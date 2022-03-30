(function () {
  'use strict';

  angular.module('app.core').directive('kitList', kitList);

  /** @ngInject */
  function kitList($mdDialog, CORE, USER, TRANSACTION, KitAllocationFactory, MasterFactory, DialogFactory, BaseService, GenericCategoryFactory, RFQTRANSACTION, socketConnectionService, $q, $filter, PurchaseOrderFactory) {
    var directive = {
      restrict: 'E',
      scope: {
        isSubAssemblyTab: '=?',
        isPurchaseTab: '=?'
      },
      templateUrl: 'app/directives/custom/kit-list/kit-list.html',
      controller: kitListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of User Agreement
    *
    * @param
    */
    function kitListCtrl($scope, $timeout) {
      const vm = this;
      vm.isSubAssemblyTab = $scope.isSubAssemblyTab || false;
      vm.isPurchaseTab = $scope.isPurchaseTab || false;
      vm.isSubAssembly = vm.isSubAssemblyTab ? true : false;
      vm.isUpdatable = true;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KITLIST;
      vm.DisplayStatus = CORE.DisplayStatus;
      vm.woStatusDetail = CORE.WorkOrderStatus;
      vm.SOStatus = CORE.SalesOrderStatusGridHeaderDropdown;
      vm.kitReleaseStatus = CORE.ReleaseKitStatusGridHeaderDropdown;
      vm.kitReturnStatus = CORE.KitReturnStatusGridHeaderDropdown;
      vm.kitPlanStatus = CORE.KitPlanStatusGridHeaderDropdown;
      vm.CompelteStatus = CORE.SalesOrderCompleteStatusGridHeaderDropdown;
      vm.GoodBadPartHeaderDropdown = CORE.GoodBadPartHeaderDropdown;
      vm.Kit_Release_Status = CORE.Kit_Release_Status;
      vm.Kit_Plan_Status = CORE.Kit_Plan_Status;
      vm.KIT_RETURN_STATUS = TRANSACTION.KIT_RETURN_STATUS;
      vm.isHideDelete = true;
      vm.isAssyAtGlance = true;
      vm.isCheckKitFeasibility = true;
      vm.isHaltResumeKitAllocation = true;
      vm.isHaltResumeKitRelease = true;
      vm.isHaltResumeHistory = true;
      vm.isBulkTransfer = true;
      vm.isAddManualKitEntry = true;
      vm.isKitActivityHistory = true;
      vm.isKitTreeView = true;
      vm.isRecalculation = true;
      vm.SOWorkingStatus = CORE.SOWorkingStatus;
      vm.HaltResumePopUp = CORE.HaltResumePopUp;
      vm.haltImagePath = vm.HaltResumePopUp.stopImagePath;
      vm.resumeImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, vm.HaltResumePopUp.resumeFileName);
      vm.isKitRelease = true;
      vm.shortageIndication = CORE.LabelConstant.KitAllocation.ShortageIndication;
      vm.KitListAdvanceFilter = angular.copy(CORE.SalesOrderAdvancedFilters);
      vm.KitListAdvanceFilter.POSO.value = vm.KitListAdvanceFilter.POSO.value.replace(vm.KitListAdvanceFilter.POSO.value, 'PO#/SO#');
      vm.pending = true;
      vm.completed = vm.canceled = false;
      vm.planned = vm.unPlanned = vm.partiallyPlanned = true;
      vm.publish = vm.draft = false;
      vm.kitReturnNA = vm.KitReturnReady = vm.kitReturnNot = vm.kitReturnPartially = vm.kitReturnedWithShortage = true;
      vm.kitReadyRelease = vm.kitNotRelease = vm.kitPartialRelease = vm.kitFullyRelease = true;
      vm.currentDate = new Date();
      vm.WOSTATUS = CORE.WOSTATUS;
      vm.kitList = true;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.entityID = CORE.AllEntityIDS.SalesOrder.ID;
      vm.LabelConstant = CORE.LabelConstant;
      vm.KitReleaseStatusType = vm.kitReleaseStatus[0].value;
      vm.KitReturnStatusType = vm.kitReturnStatus[0].value;
      vm.activityTransactionType = TRANSACTION.StartStopActivityTransactionType;
      vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);
      vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
      vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
      vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
      vm.gridConfig = CORE.gridConfig;
      vm.customer = [];
      vm.partIds = [];
      vm.woIds = [];
      const initDateOption = () => {
        vm.fromDateOptions = {
          appendToBody: true,
          fromDateOpenFlag: false,
          maxDate: vm.toDate
        };
        vm.toDateOptions = {
          appendToBody: true,
          toDateOpenFlag: false,
          minDate: vm.fromDate
        };
        vm.fromPODateOptions = {
          appendToBody: true,
          fromPODateOpenFlag: false,
          maxDate: vm.toPODate
        };
        vm.toPODateOptions = {
          appendToBody: true,
          toPODateOpenFlag: false,
          minDate: vm.fromPODate
        };
      };
      initDateOption();
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();

      //refersh sales order
      vm.refreshSalesOrder = () => {
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      /*load source header after getting kit list*/
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '180',
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="4"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          pinnedLeft: true
        },
        {
          field: 'statusConvertedValue',
          displayName: 'SO Posting Status',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-warning\':row.entity.statusConvertedValue == grid.appScope.$parent.vm.SOStatus[1].value, \'label-success\':row.entity.statusConvertedValue == grid.appScope.$parent.vm.SOStatus[2].value }">'
            + '{{COL_FIELD}}'
            + '</div>',
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: true
        },
        {
          field: 'completedStatus',
          displayName: 'SO Working Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-warning\':row.entity.completedStatus == grid.appScope.$parent.vm.SOWorkingStatus.InProgress, \'label-success\':row.entity.completedStatus == grid.appScope.$parent.vm.SOWorkingStatus.Completed ,\'label-danger\' :row.entity.completedStatus ==grid.appScope.$parent.vm.SOWorkingStatus.Canceled }">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '<span class="ml-5">'
            + '<img class="wo-stop-image wo-stop-image-margin" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonPO}}</md-tooltip>'
            + '</span>'
            + '</div>',
          width: '150',
          enableFiltering: false,
          enableSorting: false,
          allowCellFocus: true
        },
        {
          field: 'kitStatusPercentage',
          width: '130',
          minWidth: '130',
          displayName: 'Kit Allocation % (Component)',
          cellTemplate: '<div>'
            + '<md-button ng-disabled="!row.entity.salesOrderDetailId" class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.updateRecord(row)">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.kitStatusPercentage || 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'underline\':row.entity.salesOrderDetailId}" class="cursor-pointer">A-{{(row.entity.kitStatusPercentage || 0)}}%</span></span>'
            + '<md-tooltip md-direction="top">Kit Allocation % (Component)</md-tooltip>'
            + '</md-button>'
            + '</div>'
            + '<span class="ml-5 margin-top-2">'
            + '<img class="wo-stop-image" ng-if="row.entity.haltStatusKA == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusKA == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonKA}}</md-tooltip></span>',
          ColumnDataType: 'StringEquals',
          enableSorting: false,
          enableFiltering: false,
          allowCellFocus: false,
          cellClass: function (grid, row) {
            if (row.entity.kitReturnStatus === vm.KIT_RETURN_STATUS.FR.name) {
              return 'label-light-green';
            }
          }
        },
        {
          field: 'subKitStatusPercentage',
          width: '140',
          minWidth: '140',
          displayName: 'Kit Allocation % (With Sub Assembly)',
          cellTemplate: '<div>'
            + '<md-button ng-disabled="!row.entity.salesOrderDetailId || row.entity.isSubAssembly" class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.updateRecord(row)">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.subKitStatusPercentage || 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'underline\':row.entity.salesOrderDetailId}" class="cursor-pointer"> {{row.entity.isSubAssembly? "N/A" : "A-"+ (row.entity.subKitStatusPercentage || 0) + "%"}}</span></span>'
            + '<md-tooltip md-direction="top">Kit Allocation % (With Sub Assembly)</md-tooltip>'
            + '</md-button>'
            + '</div>',
          ColumnDataType: 'StringEquals',
          enableSorting: false,
          enableFiltering: false,
          allowCellFocus: false
        },
        {
          field: 'kitPlanStatus',
          displayName: 'Kit Plan Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-warning\':row.entity.kitPlanStatus == grid.appScope.$parent.vm.Kit_Plan_Status.Unplanned, \'label-info\':row.entity.kitPlanStatus == grid.appScope.$parent.vm.Kit_Plan_Status.PartiallyPlanned ,\'label-success\' :row.entity.kitPlanStatus == grid.appScope.$parent.vm.Kit_Plan_Status.FullPlanned}">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 200,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'kitReleaseStatus',
          displayName: 'Kit Release Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-warning\':row.entity.kitReleaseStatus == grid.appScope.$parent.vm.Kit_Release_Status.NotReleased, \'label-info\':row.entity.kitReleaseStatus == grid.appScope.$parent.vm.Kit_Release_Status.PartiallyReleased ,\'label-success\' :row.entity.kitReleaseStatus == grid.appScope.$parent.vm.Kit_Release_Status.FullReleased,\'light-green-bg\' :row.entity.kitReleaseStatus == grid.appScope.$parent.vm.Kit_Release_Status.ReadyToRelease }">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>'
            + '<span class="ml-5 mt-1">'
            + '<img class="wo-stop-image" ng-if="row.entity.haltStatusKR == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusKR == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonKR}}</md-tooltip></span>',
          width: 200,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'kitReturnStatus',
          displayName: 'Kit Return Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-primary-gray\':row.entity.kitReturnStatus == grid.appScope.$parent.vm.KIT_RETURN_STATUS.NA.name, \'label-warning\': row.entity.kitReturnStatus == grid.appScope.$parent.vm.KIT_RETURN_STATUS.NR.name ,\'label-info\' :row.entity.kitReturnStatus == grid.appScope.$parent.vm.KIT_RETURN_STATUS.PR.name, \'label-success\' :row.entity.kitReturnStatus == grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name,\'light-green-bg\' :row.entity.kitReturnStatus == grid.appScope.$parent.vm.KIT_RETURN_STATUS.RR.name, \'label-primary\' :row.entity.kitReturnStatus == grid.appScope.$parent.vm.KIT_RETURN_STATUS.RS.name }">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: 200,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'shortageLines',
          displayName: 'Shortage Line(s)',
          cellTemplate: '<div class="ui-grid-cell-contents mt-5" style="text-align:center">'
            + '<span ng-if="row.entity.kitReturnStatus != grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>'
            + '<div class="layout-row layout-align-end-center flex mr-10">'
            + '<span ng-if="row.entity.kitReturnStatus != grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name">'
            + '<img class="shortage-idication-image" ng-if="row.entity.kitReleaseIndication != null || row.entity.kitReturnStatus != grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name" src="assets/images/etc/alert.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.kitReleaseIndication!=null">'
            + '<span ng-bind-html="row.entity.kitReleaseIndication">'
            + '</span>'
            + '</md-tooltip>'
            + '<div>'
            + '</span>',
          width: 130,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'nextReleaseDate',
          displayName: 'Next Release Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '100',
          enableFiltering: false,
          enableSorting: false,
          cellClass: function (grid, row) {
            if (row.entity.indicationForNextReleaseDate === 1) {
              return 'cm-kit-next-release-passmoreweek-err';
            } else if (row.entity.indicationForNextReleaseDate === 2) {
              return 'cm-kit-next-release-week-err';
            } else if (row.entity.indicationForNextReleaseDate === 3) {
              return 'cm-kit-next-release-hot-err';
            }
          }
        },
        {
          field: 'soDate',
          displayName: CORE.LabelConstant.SalesOrder.SODate,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '100',
          type: 'date',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'salesOrderNumber',
          displayName: CORE.LabelConstant.SalesOrder.SO,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSalesOrderDetail(row.entity.id);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.SO" text="row.entity.salesOrderNumber" ng-if="row.entity.salesOrderNumber"></copy-text>\
                        </div>',
          width: '130',
          minWidth: '130',
          allowCellFocus: true,
          enableFiltering: false
        },
        {
          field: 'revision',
          displayName: 'SO Version',
          cellTemplate: '<div class="ui-grid-cell-contents text-right">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: true
        },
        {
          field: 'poNumber',
          displayName: vm.LabelConstant.SalesOrder.PO,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToSalesOrderDetail(row.entity.id);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"></copy-text>\
                        </div>',
          width: '150',
          allowCellFocus: true,
          enableFiltering: false
        },
        {
          field: 'poDate',
          displayName: 'PO Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD| date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '100',
          type: 'date',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'PIDCode',
          displayName: vm.LabelConstant.Assembly.MainPIDCode,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                rohs-icon="row.entity.rohsIcon" \
                                has-sub-assembly="row.entity.havingSubAssyCount > 0"\
                                rohs-status="row.entity.rohsComplientConvertedValue" \
                                is-custom-part="row.entity.isCustomPart" \
                                cust-part-number="row.entity.custAssyPN"\
                                is-assembly="true" \
                                ></common-pid-code-label-link></div>',
          width: '300',
          enableFiltering: false
        },
        {
          field: 'mfgPN',
          displayName: vm.LabelConstant.Assembly.MainAssy,
          enableCellEdit: false,
          enableCellEditOnFocus: true,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        value="row.entity.mfgPN" \
                                        is-copy="true" \
                                        cust-part-number="row.entity.custAssyPN"\
                                        rohs-icon="row.entity.rohsIcon" \
                                        has-sub-assembly="row.entity.havingSubAssyCount > 0"\
                                        rohs-status="row.entity.rohsComplientConvertedValue" \
                                        is-custom-part="row.entity.isCustomPart" \
                                        is-assembly="true"></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: true,
          enableFiltering: false
        },
        {
          field: 'nickName',
          displayName: 'Main Assy Nickname',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: true
        },
        {
          field: 'partDescription',
          displayName: 'Main Assy Description',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: true
        },
        {
          field: 'assyPIDCode',
          displayName: vm.LabelConstant.Assembly.ID,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.assyID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.assyPIDCode" \
                                is-copy="true" \
                                rohs-icon="row.entity.assyRohsIcon" \
                                rohs-status="row.entity.assyRohsName" \
                                has-sub-assembly="row.entity.subAssyCount > 0"\
                                cust-part-number="row.entity.assyCustAssyPN"\
                                is-custom-part="row.entity.assyIsCustomPart" \
                                is-assembly="true" \
                                ></common-pid-code-label-link></div>',
          width: '300',
          enableFiltering: false
        },
        {
          field: 'assyMfgPN',
          displayName: vm.LabelConstant.Assembly.MFGPN,
          enableCellEdit: false,
          enableCellEditOnFocus: true,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.assyID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        value="row.entity.assyMfgPN" \
                                        is-copy="true" \
                                        cust-part-number="row.entity.assyCustAssyPN"\
                                        rohs-icon="row.entity.assyRohsIcon" \
                                        has-sub-assembly="row.entity.subAssyCount > 0"\
                                        rohs-status="row.entity.assyRohsName" \
                                        is-custom-part="row.entity.assyIsCustomPart" \
                                        is-assembly="true"></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: true,
          enableFiltering: false
        },
        {
          field: 'assyNickName',
          displayName: vm.LabelConstant.Assembly.NickName,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: true
        },
        {
          field: 'assyPartDescription',
          displayName: vm.LabelConstant.Assembly.Description,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: true
        },
        {
          field: 'kitAllocationInternalVersion',
          displayName: vm.LabelConstant.KitAllocation.KitAllocationInternalVersion,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">'
            + '<span>'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>'
            + '<div ng-if="row.entity.isSubAssembly == 0 && (row.entity.kitReturnStatus != grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name && row.entity.liveVersion != row.entity.kitAllocationInternalVersion)" class="layout-row layout-align-end-center flex mr-10">'
            + '<md-button class="md-primary md-raised md-icon-button margin-0 margin-right-5-imp" ng-click="grid.appScope.$parent.vm.KitRecalcuation(row.entity)" ng-if="row.entity.isSubAssembly == 0 && (row.entity.kitReturnStatus != grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name && row.entity.liveVersion != row.entity.kitAllocationInternalVersion)">'
            + '<md-icon md-font-icon="t-icons-recalc"></md-icon>'
            + '<md-tooltip ng-if="row.entity.isSubAssembly == 0 && (row.entity.kitReturnStatus != grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name && row.entity.liveVersion != row.entity.kitAllocationInternalVersion)" md-direction="top">Recalculate</md-tooltip>'
            + '</md-button>'
            + '<div>',
          width: 200,
          cellClass: function (grid, row) {
            if (row.entity.isSubAssembly === 0 && (row.entity.kitReturnStatus !== grid.appScope.$parent.vm.KIT_RETURN_STATUS.FR.name && row.entity.liveVersion !== row.entity.kitAllocationInternalVersion)) {
              return 'cm-kit-recalc-require';
            }
          },
          allowCellFocus: true
        },
        {
          field: 'liveVersion',
          displayName: vm.LabelConstant.KitAllocation.BOMCurrentInternalVersion,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: true
        },
        {
          field: 'releasedWorkorder',
          displayName: vm.LabelConstant.Workorder.ReleasedWO,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">\
                            <span ng-repeat="releasedWorkorder in row.entity.releasedWorkorderDets track by $index">\
                                <a class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.gotoWorkOrder($index,row.entity.releasedWorkorderDetIds);" tabindex="-1">{{releasedWorkorder}}</a>{{row.entity.releasedWorkorderDets[row.entity.releasedWorkorderDets.length-1]===releasedWorkorder?\'\':\' , \'}}\
                            </span>\
                        </div>',
          width: '200',
          allowCellFocus: true
        },
        {
          field: 'qty',
          displayName: 'PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '100',
          allowCellFocus: true
        },
        {
          field: 'mrpQty',
          displayName: 'MRP Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          allowCellFocus: true
        },
        {
          field: 'kitQty',
          displayName: 'Kit Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          allowCellFocus: true
        },
        {
          field: 'perAssyBuildQty',
          displayName: 'Sub ASSY QPA',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '100',
          allowCellFocus: true
        },
        {
          field: 'assyPOQty',
          displayName: 'Sub ASSY PO Requirement',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '100',
          allowCellFocus: true
        },
        {
          field: 'assyMRPQty',
          displayName: 'Sub ASSY MRP Requirement',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          allowCellFocus: true
        },
        {
          field: 'assyKitQty',
          displayName: 'Sub ASSY KIT Requirement',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          allowCellFocus: true
        },
        {
          field: 'isHotJobValue',
          displayName: 'Rush Job',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isHotJobValue == \'Yes\',\
                            \'label-warning\':row.entity.isHotJobValue == \'No\' }"> \
                                {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.GoodBadPartHeaderDropdown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: false,
          enableSorting: false,
          width: '95'
        },
        {
          field: 'materialTentitiveDocDate',
          displayName: 'Customer Consigned Material Promised Dock Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '130',
          type: 'date',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'materialDueDate',
          displayName: 'Purchased Material Dock Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><label  ng-class="{\'red\': row.entity.isPastMaterialDocDate}">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</label></div>',
          width: '110',
          type: 'date',
          allowCellFocus: true,
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'remark',
          displayName: 'Comment',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: true
        },
        {
          field: 'cancleReason',
          displayName: 'Cancellation Reason',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: true
        },
        {
          field: 'companyName',
          displayName: vm.LabelConstant.SalesOrder.Customer,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Customer" text="row.entity.companyName" ng-if="row.entity.companyName"></copy-text>\
                        </div>',
          width: '300',
          enableFiltering: false
        },
        {
          field: 'fullName',
          displayName: 'Contact Person',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: true
        },
        {
          field: 'genCategoryCode',
          displayName: vm.LabelConstant.SalesOrder.ShippingMethod,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryShippingType(row.entity.shippingMethodID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.ShippingMethod" text="row.entity.genCategoryCode" ng-if="row.entity.genCategoryCode"></copy-text>\
                        </div>',
          width: '100',
          allowCellFocus: true,
          enableFiltering: false
        },
        {
          field: 'shippingComment',
          displayName: 'Shipping Comment',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: true
        },
        {
          field: 'prcNumberofWeek',
          displayName: 'Build Weeks',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80',
          allowCellFocus: true
        },
        {
          field: 'shippingQty',
          displayName: 'Total Releases',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80',
          allowCellFocus: true
        },
        {
          field: 'subAssyCount',
          displayName: 'Sub Assy Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.isSubAssembly == 0 && row.entity.subAssyCount > 0">'
            + '<span>'
            + ' <a tabindex="-1" ng-class="{\'red\': row.entity.isSubAssembly == 0 && row.entity.subAssyCount > 0}" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.KitTreeView(row.entity)">'
            + ' {{COL_FIELD}}'
            + ' </a>'
            + '</span>'
            + '</div>'
            + '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.subAssyCount == 0">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: true,
          enableSorting: false
        },
        {
          field: 'kitReleasePlanCount',
          displayName: 'Plan Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.isSubAssembly == 0">'
            + '<span>'
            + ' <a tabindex="-1" ng-class="{\'red\': row.entity.kitReleasePlanCount <= 0}" ng-if="row.entity.isSubAssembly == 0" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.kitPlannPopUp($event, row.entity)">'
            + ' {{COL_FIELD}}'
            + ' </a>'
            + '<md-tooltip ng-if="row.entity.isSubAssembly == 0" md-direction="top" class="tooltip-multiline">'
            + 'Plan Kit'
            + '</md-tooltip>'
            + '</span>'
            + '</div>'
            + '<div ng-if="row.entity.kitReleasePlanCount <= 0 && row.entity.isSubAssembly == 0" class="ui-grid-cell-contents grid-cell-text-right">'
            + '<span>'
            + '<img class="shortage-idication-image" ng-if="row.entity.kitReleasePlanCount <= 0 && row.entity.isSubAssembly == 0" src="assets/images/etc/alert.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.kitReleaseIndication != null && row.entity.isSubAssembly == 0">'
            + 'Kit Planning is required!'
            + '</md-tooltip>'
            + '</span>'
            + '</div>'
            + '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="row.entity.isSubAssembly == 1">{{COL_FIELD}}</div>',
          width: '100',
          allowCellFocus: true,
          enableSorting: false
        },
        {
          field: 'kitNumber',
          displayName: 'Kit Number',
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToKitList(row.entity.salesOrderDetailId, row.entity.partID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text text="row.entity.kitNumber" ng-if="row.entity.kitNumber"></copy-text>\
                        </div>',
          width: '170',
          allowCellFocus: true
        },
        {
          field: 'modifyDate',
          displayName: 'Modified Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          enableFiltering: false,
          enableSorting: true,
          type: 'datetime',
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        },
        {
          field: 'soModifiedBy',
          displayName: 'Modified By',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
        },
        {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BYROLE
        },
        {
          field: 'createdDate',
          displayName: 'Created Date',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateTimeFormat}}</div>',
          enableFiltering: false,
          enableSorting: true,
          type: 'datetime',
          visible: CORE.UIGrid.VISIBLE_CREATED_AT
        },
        {
          field: 'soCreatedBy',
          displayName: 'Created By',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          allowCellFocus: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BY
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_CREATED_BYROLE
        }
      ];

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [],
          SearchColumns: [],
          isKitList: true
        };
      };
      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        allowToExportAllData: true,
        exporterCsvFilename: vm.isPurchaseTab ? `${TRANSACTION.TRANSACTION_PURCHASE_LIST_LABEL}.csv` : (vm.isSubAssemblyTab ? `${TRANSACTION.SUB_KIT_LIST_LABEL}.csv` : `${TRANSACTION.KIT_LIST_LABEL}.csv`),
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.Page = 1;
          vm.gridOptions.isExport = pagingInfoOld.isExport = true;
          return KitAllocationFactory.retrieveKitList().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.kitList) {
              setDataAfterGate(response.data.kitList, true);
              return response.data.kitList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // Get Tool tip for selected filters
      function getFilterTooltip(displayList, selectedModdel, idFieldName, valueFieldName, optionalLabel) {
        var maxTooltipLimit = 10;
        var isTooltipGreatrtthenLimit = false;
        var moreTooltipText = '<br />more...';
        if (displayList && displayList.length && selectedModdel && ((Array.isArray(selectedModdel) ? selectedModdel.length : true))) {
          let toolTipText;
          if (Array.isArray(selectedModdel)) {
            toolTipText = displayList.filter((item) => item[idFieldName] && selectedModdel.includes(item[idFieldName].toString()));
          }
          else {
            toolTipText = displayList.filter((item) => item[idFieldName] === selectedModdel);
          }
          if (toolTipText && toolTipText.length > maxTooltipLimit) {
            toolTipText = toolTipText.splice(0, maxTooltipLimit);
            isTooltipGreatrtthenLimit = true;
          }
          toolTipText = toolTipText.map((a) => a[valueFieldName]);
          return (optionalLabel ? (optionalLabel + ': ') : '') + toolTipText.join('<br />') + (isTooltipGreatrtthenLimit ? moreTooltipText : '') + (optionalLabel ? '<br />' : '');
        }
        else {
          return '';
        }
      }

      // generate filter for sales order list page
      const generateSearchFilter = () => {
        vm.generateFilter = false;
        vm.KitListAdvanceFilter.ClearAll.isDeleted = true;
        if (vm.customer.length > 0) {
          vm.pagingInfo.customerID = _.map(vm.customer).join();
          vm.generateFilter = true;
          vm.KitListAdvanceFilter.Customer.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
          vm.KitListAdvanceFilter.Customer.tooltip = getFilterTooltip(vm.customerListToDisplay, vm.customer, 'id', 'mfgName'); //Need to check this
        } else {
          vm.pagingInfo.customerID = null;
          vm.KitListAdvanceFilter.Customer.isDeleted = true;
        }
        if (vm.partIds && vm.partIds.length > 0) {
          vm.pagingInfo.partIds = _.map(vm.partIds, 'id').join(',');
          vm.generateFilter = true;
          vm.KitListAdvanceFilter.Parts.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
        } else {
          vm.pagingInfo.partIds = null;
          vm.KitListAdvanceFilter.Parts.isDeleted = true;
        }
        if (vm.woIds && vm.woIds.length > 0) {
          vm.pagingInfo.woIds = _.map(vm.woIds, 'woNumber').join(',');
          vm.generateFilter = true;
          vm.KitListAdvanceFilter.WorkOrder.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
        } else {
          vm.pagingInfo.woIds = null;
          vm.KitListAdvanceFilter.WorkOrder.isDeleted = true;
        }
        if (vm.posoNumber) {
          vm.pagingInfo.posoSearch = vm.posoNumber;
          vm.generateFilter = true;
          vm.KitListAdvanceFilter.POSO.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
          vm.KitListAdvanceFilter.POSO.tooltip = vm.posoNumber;
        } else {
          vm.pagingInfo.posoSearch = null;
          vm.KitListAdvanceFilter.POSO.isDeleted = true;
        }
        vm.pagingInfo.posoSearchType = vm.checkSerachPOType;
        let strFilter = '';
        const SOWorkingStatusTooltip = [];
        if (vm.isCheckAll) {
          strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[1].value);
          strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[2].value);
          strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[3].value);
        } else {
          if (vm.pending) {
            strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[1].value);
            SOWorkingStatusTooltip.push(vm.CompelteStatus[1].value);
          }
          if (vm.completed) {
            strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[2].value);
            SOWorkingStatusTooltip.push(vm.CompelteStatus[2].value);
          }
          if (vm.canceled) {
            strFilter = stringFormat('{0},{1}', strFilter, vm.CompelteStatus[3].value);
            SOWorkingStatusTooltip.push(vm.CompelteStatus[3].value);
          }
        }
        if (strFilter.length > 0) {
          vm.KitListAdvanceFilter.SOStatus.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
          vm.generateFilter = true;
          vm.pagingInfo.filterStatus = strFilter.substring(1);
        } else {
          vm.KitListAdvanceFilter.SOStatus.isDeleted = true;
          vm.pagingInfo.filterStatus = '';
        }
        vm.KitListAdvanceFilter.SOStatus.tooltip = vm.pending && vm.completed && vm.canceled ? 'All' : `${SOWorkingStatusTooltip.join('<br />')}`;
        let strpoStatusFilter = '';
        const SOPostingStatusTooltip = [];
        if (vm.isCheckAllStatus) {
          strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.SOStatus[1].value);
          strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.SOStatus[2].value);
        } else {
          if (vm.draft) {
            strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.SOStatus[1].value);
            SOPostingStatusTooltip.push(vm.SOStatus[1].value);
          }
          if (vm.publish) {
            strpoStatusFilter = stringFormat('{0},{1}', strpoStatusFilter, vm.SOStatus[2].value);
            SOPostingStatusTooltip.push(vm.SOStatus[2].value);
          }
        }
        if (strpoStatusFilter.length > 0) {
          vm.KitListAdvanceFilter.SOPOSTStatus.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
          vm.generateFilter = true;
          vm.pagingInfo.filterPOStatus = strpoStatusFilter.substring(1);
        } else {
          vm.KitListAdvanceFilter.SOPOSTStatus.isDeleted = true;
          vm.pagingInfo.filterPOStatus = '';
        }
        vm.KitListAdvanceFilter.SOPOSTStatus.tooltip = vm.publish && vm.draft ? 'All' : `${SOPostingStatusTooltip.join('<br />')}`;
        let strKitReturnFilter = '';
        const KitReturnTooltip = [];
        if (vm.iskitReturnCheckAll) {
          strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[1].id);
          strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[2].id);
          strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[3].id);
          strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[4].id);
          strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[5].id);
          strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[6].id);
        } else {
          if (vm.kitReturnNA) {
            strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[1].id);
            KitReturnTooltip.push(vm.kitReturnStatus[1].value);
          }
          if (vm.kitReturnNot) {
            strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[2].id);
            KitReturnTooltip.push(vm.kitReturnStatus[2].value);
          }
          if (vm.KitReturnReady) {
            strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[3].id);
            KitReturnTooltip.push(vm.kitReturnStatus[3].value);
          }
          if (vm.kitReturnPartially) {
            strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[4].id);
            KitReturnTooltip.push(vm.kitReturnStatus[4].value);
          }
          if (vm.kitReturnedWithShortage) {
            strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[5].id);
            KitReturnTooltip.push(vm.kitReturnStatus[5].value);
          }
          if (vm.kitReturnFully) {
            strKitReturnFilter = stringFormat('{0},{1}', strKitReturnFilter, vm.kitReturnStatus[6].id);
            KitReturnTooltip.push(vm.kitReturnStatus[6].value);
          }
        }
        if (strKitReturnFilter.length > 0) {
          vm.KitListAdvanceFilter.KitReturnStatus.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
          vm.generateFilter = true;
          vm.pagingInfo.kitReturnFilterStatus = strKitReturnFilter.substring(1);
        } else {
          vm.KitListAdvanceFilter.KitReturnStatus.isDeleted = true;
          vm.pagingInfo.kitReturnFilterStatus = '';
        }
        vm.KitListAdvanceFilter.KitReturnStatus.tooltip = vm.kitReturnNA && vm.kitReturnNot && vm.KitReturnReady && vm.kitReturnPartially && vm.kitReturnedWithShortage && vm.kitReturnFully ? 'All' : `${KitReturnTooltip.join('<br />')}`;

        let strKitReleaseFilter = '';
        const KitReleaseTooltip = [];
        if (vm.iskitReleaseCheckAll) {
          strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[1].id);
          strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[2].id);
          strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[3].id);
          strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[4].id);
        } else {
          if (vm.kitReadyRelease) {
            strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[1].id);
            KitReleaseTooltip.push(vm.kitReleaseStatus[1].value);
          }
          if (vm.kitNotRelease) {
            strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[2].id);
            KitReleaseTooltip.push(vm.kitReleaseStatus[2].value);
          }
          if (vm.kitPartialRelease) {
            strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[3].id);
            KitReleaseTooltip.push(vm.kitReleaseStatus[3].value);
          }
          if (vm.kitFullyRelease) {
            strKitReleaseFilter = stringFormat('{0},{1}', strKitReleaseFilter, vm.kitReleaseStatus[4].id);
            KitReleaseTooltip.push(vm.kitReleaseStatus[4].value);
          }
        }
        if (strKitReleaseFilter.length > 0) {
          vm.KitListAdvanceFilter.KitReleaseStatus.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
          vm.generateFilter = true;
          vm.pagingInfo.kitReleaseFilterStatus = strKitReleaseFilter.substring(1);
        } else {
          vm.KitListAdvanceFilter.KitReleaseStatus.isDeleted = true;
          vm.pagingInfo.kitReleaseFilterStatus = '';
        }
        vm.KitListAdvanceFilter.KitReleaseStatus.tooltip = vm.kitReadyRelease && vm.kitNotRelease && vm.kitPartialRelease && vm.kitFullyRelease ? 'All' : `${KitReleaseTooltip.join('<br />')}`;
        let strPlannedStatusFilter = '';
        const PlannedStatusTooltip = [];
        if (!(vm.unPlanned && vm.partiallyPlanned && vm.planned)) {
          if (vm.unPlanned) {
            strPlannedStatusFilter = stringFormat('{0},{1}', strPlannedStatusFilter, vm.kitPlanStatus[1].id);
            PlannedStatusTooltip.push(vm.kitPlanStatus[1].value);
          }
          if (vm.partiallyPlanned) {
            strPlannedStatusFilter = stringFormat('{0},{1}', strPlannedStatusFilter, vm.kitPlanStatus[2].id);
            PlannedStatusTooltip.push(vm.kitPlanStatus[2].value);
          }
          if (vm.planned) {
            strPlannedStatusFilter = stringFormat('{0},{1}', strPlannedStatusFilter, vm.kitPlanStatus[3].id);
            PlannedStatusTooltip.push(vm.kitPlanStatus[3].value);
          }
        } else {
          strPlannedStatusFilter = stringFormat('{0},{1}', strPlannedStatusFilter, vm.kitPlanStatus[1].id);
          strPlannedStatusFilter = stringFormat('{0},{1}', strPlannedStatusFilter, vm.kitPlanStatus[2].id);
          strPlannedStatusFilter = stringFormat('{0},{1}', strPlannedStatusFilter, vm.kitPlanStatus[3].id);
        }
        if (strPlannedStatusFilter.length > 0) {
          vm.KitListAdvanceFilter.KitPlanStatus.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
          vm.generateFilter = true;
          vm.pagingInfo.PlannedStatus = strPlannedStatusFilter.substring(1);
        } else {
          vm.KitListAdvanceFilter.KitPlanStatus.isDeleted = true;
          vm.pagingInfo.PlannedStatus = '';
        }
        vm.KitListAdvanceFilter.KitPlanStatus.tooltip = vm.unPlanned && vm.partiallyPlanned && vm.planned ? 'All' : `${PlannedStatusTooltip.join('<br />')}`;
        if (vm.fromDate) {
          vm.pagingInfo.pfromDate = BaseService.getAPIFormatedDate(vm.fromDate);
          vm.KitListAdvanceFilter.SODate.tooltip = 'From: ' + $filter('date')(new Date(vm.pagingInfo.fromDate), vm.DefaultDateFormat);
        } else {
          vm.pagingInfo.pfromDate = null;
        }
        if (vm.toDate) {
          vm.pagingInfo.ptoDate = BaseService.getAPIFormatedDate(vm.toDate);
          vm.KitListAdvanceFilter.SODate.tooltip = 'To: ' + $filter('date')(new Date(vm.pagingInfo.toDate), vm.DefaultDateFormat);
        } else {
          vm.pagingInfo.ptoDate = null;
        }
        vm.KitListAdvanceFilter.SODate.tooltip = vm.pagingInfo.fromDate && vm.pagingInfo.toDate ? 'From:' + $filter('date')(new Date(vm.pagingInfo.fromDate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.pagingInfo.toDate), vm.DefaultDateFormat) : vm.KitListAdvanceFilter.SODate.tooltip;
        if (vm.pagingInfo.pfromDate || vm.pagingInfo.ptoDate) {
          vm.KitListAdvanceFilter.SODate.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
        } else {
          vm.KitListAdvanceFilter.SODate.isDeleted = true;
        }
        if (vm.fromPODate) {
          vm.pagingInfo.pfromPODate = BaseService.getAPIFormatedDate(vm.fromPODate);
          vm.KitListAdvanceFilter.PODate.tooltip = 'From: ' + $filter('date')(new Date(vm.pagingInfo.pfromPODate), vm.DefaultDateFormat);
        } else {
          vm.pagingInfo.pfromPODate = null;
        }
        if (vm.toPODate) {
          vm.pagingInfo.ptoPODate = BaseService.getAPIFormatedDate(vm.toPODate);
          vm.KitListAdvanceFilter.PODate.tooltip = 'To: ' + $filter('date')(new Date(vm.pagingInfo.ptoPODate), vm.DefaultDateFormat);
        } else {
          vm.pagingInfo.ptoPODate = null;
        }
        vm.KitListAdvanceFilter.PODate.tooltip = vm.pagingInfo.pfromPODate && vm.pagingInfo.ptoPODate ? 'From:' + $filter('date')(new Date(vm.pagingInfo.pfromPODate), vm.DefaultDateFormat) + ' To:' + $filter('date')(new Date(vm.pagingInfo.ptoPODate), vm.DefaultDateFormat) : vm.KitListAdvanceFilter.PODate.tooltip;
        if (vm.pagingInfo.pfromPODate || vm.pagingInfo.ptoPODate) {
          vm.KitListAdvanceFilter.PODate.isDeleted = false;
          vm.KitListAdvanceFilter.ClearAll.isDeleted = false;
        } else {
          vm.KitListAdvanceFilter.PODate.isDeleted = true;
        }
        vm.KitListAdvanceFilter.RushJob.isDeleted = true;
        vm.pagingInfo.isRushJob = false;
        if (vm.isRushJob) {
          vm.pagingInfo.isRushJob = true;
          vm.KitListAdvanceFilter.RushJob.tooltip = vm.KitListAdvanceFilter.RushJob.value;
          vm.KitListAdvanceFilter.RushJob.isDeleted = false;
        }
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }
      };

      //close popup on page destroy
      $scope.$on('$destroy', () => {
        $mdDialog.hide(false, { closeAll: true });
        removeSocketListener();
      });

      // set formattted data for Export
      const setDataAfterGate = (sourceData, isFromExport) => {
        const currentDate = new Date(vm.currentDate.setHours(0, 0, 0, 0));
        _.each(sourceData, (item) => {
          item.copyRohsIcon = item.rohsIcon;
          item.isPassNextReleaseDate = item.nextReleaseDate ? (new Date(new Date(item.nextReleaseDate).setHours(0, 0, 0, 0))) < currentDate : false;
          item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
          item.assyRohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.assyRohsIcon);
          item.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
          item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
          item.materialTentitiveDocDate = BaseService.getUIFormatedDate(item.materialTentitiveDocDate, vm.DefaultDateFormat);
          item.materialDueDate = BaseService.getUIFormatedDate(item.materialDueDate, vm.DefaultDateFormat);
          const releasedWorkorderDets = item.releasedWorkorderNmberAndId ? item.releasedWorkorderNmberAndId.split(',') : [];
          item.releasedWorkorderDetIds = _.map(releasedWorkorderDets, (data) => data.split('###')[0].trim()).join(',');
          item.releasedWorkorderDets = _.map(releasedWorkorderDets, (data) => data.split('###')[1]);
          if (!isFromExport) {
            if (item.status !== CORE.WOSTATUS.DRAFT) {
              item.isDisabledDelete = true;
              item.isRowSelectable = false;
            }

            if (item.releaseDayDiffwithCurrentDate >= 8 && item.releaseDayDiffwithCurrentDate <= 14) {
              item.indicationForNextReleaseDate = 1;
            } else if (item.releaseDayDiffwithCurrentDate >= 1 && item.releaseDayDiffwithCurrentDate <= 7) {
              item.indicationForNextReleaseDate = 2;
            } else if (item.releaseDayDiffwithCurrentDate !== null && item.releaseDayDiffwithCurrentDate <= 0) {
              item.indicationForNextReleaseDate = 3;
            }

            if (item.kitReleasePlanCount && item.kitReleasePlanCount === 1 && item.kitReleaseStatus === vm.Kit_Release_Status.ReadyToRelease) {
              item.isSetPlanCountBackground = true;
            }

            if (item.isSubAssembly || !item.salesOrderDetailId) {
              item.isDisabledHaltResumeKitAllocation = true;
              item.isDisabledHaltResumeKitRelease = true;
              item.isDisabledHaltResumeHistory = true;
            }
            if (item.isSubAssembly || !item.salesOrderDetailId || item.kitReturnStatus === vm.KIT_RETURN_STATUS.FR.name || item.liveVersion === item.kitAllocationInternalVersion) {
              item.isDisableRecalc = true;
            }
            if (!item.salesOrderDetailId) {
              item.disableAssyAtGlance = true;
              item.isDisabledCheckKitFeasibility = true;
              item.isDisabledKitRelease = true;
              item.isDisabledBulkTransfer = true;
            }
            if (item.refTypeKA === vm.HaltResumePopUp.refTypeKA) {
              if (item.haltStatusKA === vm.HaltResumePopUp.HaltStatus) {
                item.kitAllocationHaltImage = vm.resumeImagePath;
                item.kitAllocationHalt = vm.HaltResumePopUp.ResumeKitAllocation;
              } else {
                item.kitAllocationHaltImage = vm.haltImagePath;
                item.kitAllocationHalt = vm.HaltResumePopUp.HaltKitAllocation;
              }
            }
            if (item.refTypeKR === vm.HaltResumePopUp.refTypeKR) {
              if (item.haltStatusKR === vm.HaltResumePopUp.HaltStatus) {
                item.kitReleaseHaltImage = vm.resumeImagePath;
                item.KitReleaseHalt = vm.HaltResumePopUp.ResumeKitRelease;
              } else {
                item.kitReleaseHaltImage = vm.haltImagePath;
                item.KitReleaseHalt = vm.HaltResumePopUp.HaltKitRelease;
              }
            }
            if (item.refTypeKA === null) {
              item.kitAllocationHaltImage = vm.haltImagePath;
              item.kitAllocationHalt = vm.HaltResumePopUp.HaltKitAllocation;
            }
            if (item.refTypeKR === null) {
              item.kitReleaseHaltImage = vm.haltImagePath;
              item.KitReleaseHalt = vm.HaltResumePopUp.HaltKitRelease;
            }

            if (item.wosalesOrderDetail) {
              item.isDisabledCancle = true;
            }
            if (item.materialDueDate && item.kitStatusPercentage !== 100 && new Date(item.materialDueDate) < vm.currentDate) {
              item.isPastMaterialDocDate = true;
            }
          }
        });
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (kits, isGetDataDown) => {
        if (kits && kits.data && kits.data.kitList) {
          if (!isGetDataDown) {
            vm.sourceData = kits.data.kitList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (kits.data.kitList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(kits.data.kitList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          if (vm.sourceData && vm.sourceData.length > 0) {
            setDataAfterGate(vm.sourceData, false);
          }

          // must set after new data comes
          vm.totalSourceDataCount = kits.data.Count;
          vm.unPlannedCount = kits.data.UnPlannedCount;
          vm.partiallyPlannedCount = kits.data.PartiallyPlannedCount;
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
            if (vm.pagingInfo.SearchColumns.length > 0 || vm.generateFilter) {
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

      /* retrieve sales order detail list*/
      vm.loadData = () => {
        if (vm.callLoadData === false) {
          vm.callLoadData = true;
          return;
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        }
        // Added custome filter for kits status
        //filterStatus();
        generateSearchFilter();
        vm.pagingInfo.isSubAssembly = vm.isSubAssembly || false;
        vm.pagingInfo.isSubAssemblyTab = vm.isSubAssemblyTab || false;
        vm.cgBusyLoading = KitAllocationFactory.retrieveKitList().query(vm.pagingInfo).$promise.then((kits) => {
          if (kits && kits.data) {
            setDataAfterGetAPICall(kits, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = KitAllocationFactory.retrieveKitList().query(vm.pagingInfo).$promise.then((kits) => {
          if (kits && kits.data && kits.data.kitList) {
            setDataAfterGetAPICall(kits, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.updateRecord = (row) => {
        if (vm.isPurchaseTab) {
          BaseService.goToPurchaseList(row.entity.salesOrderDetailId, 0, null);
        }
        else {
          vm.goToKitList(row.entity.salesOrderDetailId, row.entity.partID, null);
        }
      };

      vm.goToKitList = (salesOrderDetailId, partID) => BaseService.goToKitList(salesOrderDetailId, partID);

      // Plan kit Popup
      vm.kitPlannPopUp = (ev, row) => {
        const rowData = row;
        if (rowData) {
          const obj = {
            salesOrderDetailId: rowData.salesOrderDetailId,
            qty: rowData.qty,
            partID: rowData.partID,
            poNumber: rowData.poNumber,
            salesOrderNumber: rowData.salesOrderNumber,
            rohsIcon: rowData.rohsIcon,
            mfgPN: rowData.mfgPN,
            PIDCode: rowData.PIDCode,
            PODate: rowData.poDate,
            kitQty: rowData.kitQty,
            soId: rowData.id
          };

          DialogFactory.dialogService(
            TRANSACTION.TRANSACTION_PLANN_PURCHASE_CONTROLLER,
            TRANSACTION.TRANSACTION_PLANN_PURCHASE_VIEW,
            ev,
            obj).then(() => {
            }, (data) => {
              if (data && rowData) {
                updateOneRowOfGrid(rowData.salesOrderDetailId);
              }
            }, (error) => BaseService.getErrorLog(error));
        }
      };

      vm.getAssyAtGlance = (row, ev) => {
        row.id = null;
        DialogFactory.dialogService(
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
          RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
          ev,
          row).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // Tree in view popup
      vm.KitTreeView = (row) => {
        const dataObj = {
          salesOrderDetailId: row.salesOrderDetailId,
          kitNumber: row.kitNumber,
          partID: row.partID,
          isKitAllocation: true,
          soId: row.id,
          poNumber: row.poNumber,
          soNumber: row.salesOrderNumber,
          liveVersion: row.liveVersion,
          rohsIcon: row.rohsIcon,
          rohsName: row.rohsComplientConvertedValue,
          assyPIDCode: row.PIDCode,
          assyName: row.mfgPN,
          kitAllocationInternalVersion: row.kitAllocationInternalVersion,
          kitQty: row.kitQty,
          qty: row.qty
        };
        DialogFactory.dialogService(
          TRANSACTION.TREE_IN_VIEW_POPUP_CONTROLLER,
          TRANSACTION.TREE_IN_VIEW_POPUP_VIEW,
          null,
          dataObj).then(() => {
          }, (data) => {
            if (data) {
              updateOneRowOfGrid(row.salesOrderDetailId);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      // Kit Recalculation for Main Assy
      vm.KitRecalcuation = (row) => {
        const kitDetail = {
          refSalesOrderDetID: row.salesOrderDetailId,
          assyID: row.partID,
          isConsolidated: false,
          poNumber: row.poNumber,
          soNumber: row.salesOrderNumber,
          rohsIcon: row.rohsIcon,
          rohsName: row.rohsComplientConvertedValue,
          assyPIDCode: row.PIDCode,
          assyName: row.mfgPN
        };
        vm.cgBusyLoading = KitAllocationFactory.getCustConsignMismatchKitAllocationDetails().query(kitDetail).$promise.then((response) => {
          if (response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data.KitLineDetail && response.data.KitLineDetail.length > 0) {
              const KitLineDetail = {
                kitAllocationList: response.data.KitLineDetail,
                salesOrderDetail: kitDetail
              };
              DialogFactory.dialogService(
                TRANSACTION.KIT_CUSTCONSIGN_MISMATCH_POPUP_CONTROLLER,
                TRANSACTION.KIT_CUSTCONSIGN_MISMATCH_POPUP_VIEW,
                null,
                KitLineDetail).then(() => {
                }, (data) => {
                  if (data) {
                    vm.reCalculateKitAllocation(true, row);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.reCalculateKitAllocation(false, row);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.reCalculateKitAllocation = (isPurchaseChange, rowData) => {
        const objData = {
          partId: rowData.partID,
          sodid: rowData.salesOrderDetailId,
          kitQty: rowData.kitQty,
          mrpQty: rowData.qty,
          isPurchaseChange: isPurchaseChange
        };
        vm.cgBusyLoading = KitAllocationFactory.reCalculateKitAllocation().query(objData).$promise.then((response) => {
          if (response.data && response.data.calculated && response.data.calculated.IsSuccess && response.data.calculated.IsSuccess === 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BOM_INTERNAL_VERSION_NOT_SET);
            const model = {
              messageContent: messageContent,
              multiple: false
            };
            return DialogFactory.messageAlertDialog(model);
          } else {
            updateOneRowOfGrid(rowData.salesOrderDetailId);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.checkKitFeasibility = (row, ev) => {
        const salesOrderDetails = {
          poNumber: row.entity.poNumber,
          soNumber: row.entity.salesOrderNumber,
          SubAssy: row.entity.PIDCode,
          assyPIDCode: row.entity.PIDCode,
          assyName: row.entity.mfgPN,
          rohsIcon: row.entity.copyRohsIcon,
          nickName: row.entity.nickName,
          rohs: row.entity.rohsComplientConvertedValue,
          kitQty: row.entity.kitQty,
          poQty: row.entity.qty,
          soQty: row.entity.mrpQty,
          soId: row.entity.id,
          partId: row.entity.partID,
          SalesOrderDetailId: row.entity.salesOrderDetailId,
          SubKitQty: row.entity.isSubAssembly ? row.entity.assyKitQty : null
        };
        const feasibilityDetail = {
          refSalesOrderDetID: row.entity.salesOrderDetailId,
          assyID: parseInt(row.entity.partID || 0),
          isConsolidated: false,
          inputQty: 0,
          salesOrderDetail: salesOrderDetails
        };

        DialogFactory.dialogService(
          TRANSACTION.KIT_FEASIBILITY_POPUP_CONTROLLER,
          TRANSACTION.KIT_FEASIBILITY_POPUP_VIEW,
          ev,
          feasibilityDetail).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.kitRelease = (row, ev) => {
        const assyID = parseInt(row.entity.partID || 0);
        const salesOrderDetails = {
          poNumber: row.entity.poNumber,
          soNumber: row.entity.salesOrderNumber,
          SubAssy: row.entity.assyPIDCode,
          assyName: row.entity.mfgPN,
          rohsIcon: row.entity.copyRohsIcon,
          nickName: row.entity.nickName,
          rohs: row.entity.rohsComplientConvertedValue,
          kitQty: row.entity.kitQty,
          poQty: row.entity.qty,
          soQty: row.entity.mrpQty,
          soId: row.entity.id,
          partId: row.entity.assyID,
          SalesOrderDetailId: row.entity.salesOrderDetailId
        };
        if (row.entity.isSubAssembly) {
          salesOrderDetails.SubAssyId = row.entity.partID;
          salesOrderDetails.SubAssyPIDCode = row.entity.assyPIDCode;
          salesOrderDetails.assyPIDCode = row.entity.PIDCode;
          salesOrderDetails.SubAssyRohs = row.entity.assyRohsName;
          salesOrderDetails.SubAssyRohsIcon = row.entity.assyRohsIcon;
          salesOrderDetails.SubKitQty = row.entity.assyKitQty;
          salesOrderDetails.SubPOQty = row.entity.assyPOQty;
          salesOrderDetails.SubMrpQty = row.entity.assyMRPQty;
        }
        const kitDetail = {
          salesOrderDetail: salesOrderDetails,
          refSalesOrderDetID: salesOrderDetails.SalesOrderDetailId,
          assyID: (assyID || salesOrderDetails.partId),
          isConsolidated: true
        };

        DialogFactory.dialogService(
          TRANSACTION.KIT_RELEASE_POPUP_CONTROLLER,
          TRANSACTION.KIT_RELEASE_POPUP_VIEW,
          ev,
          kitDetail).then(() => {
          }, (data) => {
            if (data && row && row.entity) {
              updateOneRowOfGrid(row.entity.salesOrderDetailId);
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      //purchase plann for sales order issue
      vm.goToPlannPurchase = (row, event) => {
        vm.kitPlannPopUp(event, row.entity);
      };

      //Kitallocation halt-resume pop-up
      vm.haltResumeKitAllocation = (row, ev) => {
        const rowData = row.entity;

        if (rowData) {
          const haltResumeObj = {
            refTransId: rowData.salesOrderDetailId,
            isHalt: rowData.haltStatusKA ? (rowData.haltStatusKA === vm.HaltResumePopUp.HaltStatus ? false : true) : true,
            module: CORE.redirectLink.kit_allocation,
            refType: vm.HaltResumePopUp.refTypeKA,
            poNumber: rowData.poNumber,
            soNumber: rowData.salesOrderNumber,
            assyName: rowData.PIDCode,
            rohsIcon: rowData.copyRohsIcon,
            rohs: rowData.rohsComplientConvertedValue,
            soId: rowData.id,
            assyID: rowData.partID
          };
          DialogFactory.dialogService(
            CORE.HALT_RESUME_CONTROLLER,
            CORE.HALT_RESUME_VIEW,
            ev,
            haltResumeObj).then(() => {
            }, () => {
            }, (error) => BaseService.getErrorLog(error));
        }
      };

      vm.haltResumeHistoryList = (row, $event) => {
        const rowData = row.entity;
        const data = {
          refTransId: rowData.salesOrderDetailId,
          poNumber: rowData.poNumber,
          soNumber: rowData.salesOrderNumber,
          assyName: rowData.PIDCode,
          rohsIcon: rowData.copyRohsIcon,
          rohs: rowData.rohsComplientConvertedValue,
          soId: rowData.id,
          assyID: rowData.partID
        };
        DialogFactory.dialogService(
          CORE.HALT_RESUME_HISTORY_CONTROLLER,
          CORE.HALT_RESUME_HISTORY_VIEW,
          $event,
          data).then(() => {
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
      };

      vm.haltResumeKitRelease = (row, ev) => {
        const rowData = row.entity;
        if (rowData) {
          const haltResumeObj = {
            refTransId: rowData.salesOrderDetailId,
            isHalt: rowData.haltStatusKR ? (rowData.haltStatusKR === vm.HaltResumePopUp.HaltStatus ? false : true) : true,
            module: CORE.UMID_History.Action_Performed.KitRelease,
            refType: vm.HaltResumePopUp.refTypeKR,
            poNumber: rowData.poNumber,
            soNumber: rowData.salesOrderNumber,
            assyName: rowData.PIDCode,
            rohsIcon: rowData.copyRohsIcon,
            rohs: rowData.rohsComplientConvertedValue,
            soId: rowData.id,
            assyID: rowData.partID
          };
          DialogFactory.dialogService(
            CORE.HALT_RESUME_CONTROLLER,
            CORE.HALT_RESUME_VIEW,
            ev,
            haltResumeObj).then(() => {
            }, () => {
            }, (error) => BaseService.getErrorLog(error));
        }
      };

      vm.bulkTransfer = (row) => {
        const rowData = row.entity;
        if (rowData) {
          BaseService.openInNew(TRANSACTION.TRANSACTION_TRANSFER_STOCK_STATE, { sodId: rowData.salesOrderDetailId });
        }
      };

      const updateOneRowOfGrid = (salesOrderDetailId) => {
        if (salesOrderDetailId) {
          vm.pagingInfo.SalesOrderDetailId = salesOrderDetailId;
          vm.pagingInfo.Page = 0;
          vm.cgBusyLoading = KitAllocationFactory.retrieveKitList().query(vm.pagingInfo).$promise.then((kits) => {
            vm.pagingInfo.SalesOrderDetailId = null;
            if (kits && kits.data) {
              vm.unPlannedCount = kits.data.UnPlannedCount;
              vm.partiallyPlannedCount = kits.data.PartiallyPlannedCount;
              if (kits.data.kitList && kits.data.kitList.length > 0) {
                setDataAfterGate(kits.data.kitList, false);
              }

              if (kits.data.kitList && kits.data.kitList.length > 0) {
                _.map(vm.gridOptions.data, (data, $index) => {
                  if (data.salesOrderDetailId === kits.data.kitList[$index].salesOrderDetailId) {
                    vm.sourceData.splice($index, 1);
                    vm.sourceData.splice($index, 0, kits.data.kitList[$index]);
                  }
                });
              } else {
                const index = _.findIndex(vm.gridOptions.data, (data) => data.salesOrderDetailId === rowData.salesOrderDetailId);
                if (index !== -1) {
                  vm.sourceData.splice(index, 1);
                }
              }

              $timeout(() => {
                vm.resetSourceGrid();
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.updateOneRecord = (responseData) => {
        if (responseData.refTransId) {
          updateOneRowOfGrid(responseData.refTransId);
        }
      };

      // Add Kit Manual Activity
      vm.addManualKitEntry = (rowData) => {
        BaseService.openInNew(TRANSACTION.MANAGE_MANUAL_ENTRY_STATE, { transType: vm.activityTransactionType[2].id, refTransId: rowData.salesOrderDetailId });
      };

      // Add Kit Manual Activity history
      vm.KitActivityHistory = (rowData) => {
        var data = {
          refTransID: rowData.salesOrderDetailId,
          transactionType: vm.transactionType[2].id
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_CONTROLLER,
          RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_VIEW,
          null,
          data).then(() => {
            //success
          }, (err) => BaseService.getErrorLog(err));
      };

      function socketListener(responseData) { $timeout(() => vm.updateOneRecord(responseData)); }

      function connectSocket() {
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, socketListener);
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, socketListener);
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START, socketListener);
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP, socketListener);
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START, socketListener);
        socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP, socketListener);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      function removeSocketListener() {
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START);
        socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP);
      }

      // on disconnect socket
      socketConnectionService.on('disconnect', () => removeSocketListener());

      vm.goToSalesOrderDetail = (id) => {
        if (id) {
          BaseService.goToManageSalesOrder(id);
        }
      };

      vm.gotoWorkOrder = (index, workOrderIds) => {
        if (workOrderIds) {
          const rowDetails = workOrderIds.split(',');
          if (rowDetails.length > 0) {
            BaseService.goToWorkorderDetails(rowDetails[index]);
          }
        }
      };

      vm.goToCustomer = (id) => {
        if (id) {
          BaseService.goToCustomer(id);
        }
      };

      vm.goToManageGenericCategoryShippingType = (id) => {
        if (id) {
          BaseService.goToManageGenericCategoryShippingType(id);
        }
      };

      //kit list filter
      // check status filter

      vm.statusFilter = () => {
        if (vm.pending && vm.completed && vm.canceled) {
          vm.isCheckAll = true;
        } else if (!vm.pending && !vm.completed && !vm.canceled) {
          vm.isCheckAll = true;
        } else {
          vm.isCheckAll = false;
        }
      };

      // check po status filter
      vm.postingStatusFilter = () => {
        if (vm.draft && vm.publish) {
          vm.isCheckAllStatus = true;
        } else if (!vm.draft && !vm.publish) {
          vm.isCheckAllStatus = true;
        } else {
          vm.isCheckAllStatus = false;
        }
      };

      //advance search
      vm.advanceFilterSearch = () => {
        vm.callLoadData = true;
        if (!vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
          return;
        }
        initPageInfo();
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              vm.callLoadData = false;
              col.filters[0].term = undefined;
            }
          });
        }
        vm.loadData();
      };

      //Clear selected master filters from boxes
      vm.clearSelection = () => {
        vm.clearCustomerFilter();
        vm.clearCustomerSearchText();
        vm.posoNumber = null;
        vm.isCheckAll = false;
        vm.isplanCheckAll = false;
        vm.iskitReturnCheckAll = false;
        vm.iskitReleaseCheckAll = false;
        vm.partIds = [];
        vm.woIds = [];
        vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
        vm.fromDate = vm.toDate = null;
        vm.isRushJob = false;
        vm.pending = vm.completed = vm.canceled = false;
        vm.draft = vm.publish = false;
        vm.planned = vm.unPlanned = vm.partiallyPlanned = false;
        vm.kitReturnNA = vm.KitReturnReady = vm.kitReturnNot = vm.kitReturnPartially = vm.kitReturnFully = vm.kitReturnedWithShortage = false;
        vm.kitReadyRelease = vm.kitNotRelease = vm.kitPartialRelease = vm.kitFullyRelease = false;
        initPageInfo();
        vm.loadData();
      };

      vm.isClearSelectionDisabled = () => (!vm.draft && !vm.publish && !vm.posoNumber && !vm.pending && !vm.completed && !vm.canceled && !vm.planned && !vm.unPlanned && !vm.partiallyPlanned &&
        !vm.kitReturnNA && !vm.KitReturnReady && !vm.kitReturnNot && !vm.kitReturnPartially && !vm.kitReturnFully && !vm.kitReturnedWithShortage &&
        !vm.kitReadyRelease && !vm.kitNotRelease && !vm.kitPartialRelease && !vm.kitFullyRelease && !vm.isRushJob && !vm.fromDate && !vm.toDate
        && !(vm.partIds && vm.partIds.length > 0) && !(vm.woIds && vm.woIds.length > 0) && !vm.CustomerSearchText && !(vm.customer && vm.customer.length)
      );

      // Clear grid Column Filter
      vm.clearGridColumnFilter = (item) => {
        if (item) {
          item.filters[0].term = undefined;
          if (!item.isFilterDeregistered) {
            // refresh data grid
            vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
          }
        }
      };

      //reset filter
      vm.reset = (isfromClear) => {
        if (vm.gridOptions && vm.gridOptions.gridApi) {
          _.each(vm.gridOptions.gridApi.grid.columns, (col) => {
            if (!_.isEmpty(col.filters[0].term)) {
              vm.callLoadData = false;
              col.filters[0].term = undefined;
            }
          });
        }
        vm.clearCustomerFilter();
        vm.clearCustomerSearchText();
        vm.posoNumber = null;
        vm.isCheckAll = false;
        vm.isplanCheckAll = false;
        vm.iskitReturnCheckAll = false;
        vm.iskitReleaseCheckAll = false;
        vm.isCheckAllStatus = false;
        vm.partIds = [];
        vm.woIds = [];
        vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
        vm.generateFilter = false;
        vm.fromDate = vm.toDate = null;
        vm.isRushJob = false;
        vm.isSubAssembly = vm.isSubAssemblyTab ? true : false;
        vm.pending = vm.completed = vm.canceled = false;
        vm.planned = vm.unPlanned = vm.partiallyPlanned = false;
        vm.draft = vm.publish = false;
        vm.kitReturnNA = vm.KitReturnReady = vm.kitReturnNot = vm.kitReturnPartially = vm.kitReturnedWithShortage = vm.kitReturnFully = false;
        vm.kitReadyRelease = vm.kitNotRelease = vm.kitPartialRelease = vm.kitFullyRelease = false;
        if (vm.gridOptions.gridApi) {
          vm.gridOptions.gridApi.core.clearAllFilters();
        }
        if (!isfromClear) {
          vm.pending = true;
          vm.completed = vm.canceled = false;
          vm.draft = vm.publish = false;
          vm.planned = vm.unPlanned = vm.partiallyPlanned = true;
          vm.isSubAssembly = vm.isSubAssemblyTab ? true : false;
          vm.kitReturnNA = vm.KitReturnReady = vm.kitReturnNot = vm.kitReturnPartially = vm.kitReturnedWithShortage = vm.kitReturnPartially = true;
          vm.kitReadyRelease = vm.kitNotRelease = vm.kitPartialRelease = vm.kitFullyRelease = true;
          initPageInfo();
          vm.loadData();
        }
      };

      //remove filter
      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.KitListAdvanceFilter.Customer.value:
              vm.clearCustomerFilter();
              break;
            case vm.KitListAdvanceFilter.SOStatus.value:
              vm.pending = vm.completed = vm.canceled = false;
              break;
            case vm.KitListAdvanceFilter.POSO.value:
              vm.posoNumber = null;
              break;
            case vm.KitListAdvanceFilter.SODate.value:
              vm.fromDate = vm.toDate = null;
              break;
            case vm.KitListAdvanceFilter.Parts.value:
              vm.partIds = [];
              break;
            case vm.KitListAdvanceFilter.WorkOrder.value:
              vm.woIds = [];
              break;
            case vm.KitListAdvanceFilter.RushJob.value:
              vm.isRushJob = false;
              break;
            case vm.KitListAdvanceFilter.SubAssembly.value:
              vm.isSubAssembly = false;
              break;
            case vm.KitListAdvanceFilter.KitPlanStatus.value:
              vm.unPlanned = vm.partiallyPlanned = vm.planned = false;
              break;
            case vm.KitListAdvanceFilter.KitReturnStatus.value:
              vm.iskitReturnCheckAll = false;
              vm.kitReturnNA = vm.KitReturnReady = vm.kitReturnNot = vm.kitReturnPartially = vm.kitReturnedWithShortage = vm.kitReturnFully = false;
              break;
            case vm.KitListAdvanceFilter.KitReleaseStatus.value:
              vm.kitReadyRelease = vm.kitNotRelease = vm.kitPartialRelease = vm.kitFullyRelease = false;
              break;
            case vm.KitListAdvanceFilter.PODate.value:
              vm.fromPODate = vm.toPODate = null;
              break;
            case vm.KitListAdvanceFilter.SOPOSTStatus.value:
              vm.draft = vm.publish = false;
              break;
            case vm.KitListAdvanceFilter.ClearAll.value:
              vm.reset(true);
              break;
          }
          initPageInfo();
          vm.loadData();
        }
      };

      vm.removePOSONumber = () => {
        vm.posoNumber = null;
        vm.loadData();
      };

      vm.scanSearchKey = ($event) => {
        $timeout(() => {
          if ($event.keyCode === 13) {
            vm.loadData();
          }
        });
      };

      // check plan status filter
      vm.planstatusFilter = () => {
        if (vm.unPlanned && vm.partiallyPlanned && vm.planned) {
          vm.isplanCheckAll = true;
        } else if (!vm.unPlanned && !vm.partiallyPlanned && !vm.planned) {
          vm.isplanCheckAll = true;
        } else {
          vm.isplanCheckAll = false;
        }
      };

      // kit release return status filter
      vm.kitReturnstatusFilter = () => {
        if (vm.kitReturnNA && vm.KitReturnReady && vm.kitReturnNot && vm.kitReturnPartially && vm.kitReturnFully && vm.kitReturnedWithShortage) {
          vm.iskitReturnCheckAll = true;
        } else {
          vm.iskitReturnCheckAll = false;
        }
      };

      // kit release status
      vm.releasestatusFilter = () => {
        if (vm.kitReadyRelease && vm.kitNotRelease && vm.kitPartialRelease && vm.kitFullyRelease) {
          vm.iskitReleaseCheckAll = true;
        } else if (!vm.kitReadyRelease && !vm.kitNotRelease && !vm.kitPartialRelease && !vm.kitFullyRelease) {
          vm.iskitReleaseCheckAll = true;
        } else {
          vm.iskitReleaseCheckAll = false;
        }
      };

      // get customer list
      vm.getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
        // Added by Vaibhav - For display company name with customer code
        if (customer && customer.data) {
          _.each(customer.data, (item) => {
            item.mfgactualName = item.mfgName;
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          });
          vm.CustomerList = vm.customerListToDisplay = customer.data;
          return vm.CustomerList;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      //clear customer filter
      vm.clearCustomerFilter = () => {
        vm.customer = [];
      };

      //clear customer search text
      vm.clearCustomerSearchText = () => {
        vm.CustomerSearchText = undefined;
        vm.searchCustomerList();
      };

      //search customer list
      vm.searchCustomerList = () => {
        const customerListToFilter = angular.copy(vm.CustomerList);
        vm.customerListToDisplay = vm.CustomerSearchText ? _.filter(customerListToFilter, (item) => item.mfgName.toLowerCase().contains(vm.CustomerSearchText.toLowerCase())) : customerListToFilter;
      };
      // go to customer list
      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
      };

      //Set from date
      vm.fromDateChanged = () => {
        initDateOption();
        vm.checkDateValidation(true);
      };
      //Set to date
      vm.toDateChanged = () => {
        initDateOption();
        vm.checkDateValidation(false);
      };
      //Set PO from date
      vm.fromPODateChanged = () => {
        initDateOption();
        vm.checkPODateValidation(true);
      };
      //Set PO to date
      vm.toPODateChanged = () => {
        initDateOption();
        vm.checkPODateValidation(false);
      };

      // check date vallidation
      vm.checkDateValidation = (type) => {
        const fromDate = vm.fromDate ? new Date($filter('date')(vm.fromDate, vm.DefaultDateFormat)) : vm.filtersInfo.fromDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.fromDate.$viewValue, vm.DefaultDateFormat)) : null;
        const toDate = vm.toDate ? new Date($filter('date')(vm.toDate, vm.DefaultDateFormat)) : vm.filtersInfo.toDate.$viewValue ? new Date($filter('date')(vm.filtersInfo.toDate.$viewValue, vm.DefaultDateFormat)) : null;
        if (vm.filtersInfo) {
          if (vm.filtersInfo.fromDate && vm.filtersInfo.toDate && fromDate && toDate) {
            if (type && fromDate <= toDate) {
              vm.toDate = toDate;
              vm.filtersInfo.toDate.$setValidity('minvalue', true);
            }
            if (type && fromDate > toDate) {
              vm.fromDate = fromDate;
              vm.filtersInfo.fromDate.$setValidity('maxvalue', false);
            }
            if (!type && fromDate <= toDate) {
              vm.fromDate = fromDate;
              vm.filtersInfo.fromDate.$setValidity('maxvalue', true);
            }
            if (!type && fromDate > toDate) {
              vm.toDate = toDate;
              vm.filtersInfo.toDate.$setValidity('minvalue', false);
            }
          }
        }
      };

      // check date vallidation
      vm.checkPODateValidation = (type) => {
        const fromPODate = vm.fromPODate ? new Date($filter('date')(vm.fromPODate, vm.DefaultDateFormat)) : vm.filtersInfo.fromPODate.$viewValue ? new Date($filter('date')(vm.filtersInfo.fromPODate.$viewValue, vm.DefaultDateFormat)) : null;
        const toPODate = vm.toPODate ? new Date($filter('date')(vm.toPODate, vm.DefaultDateFormat)) : vm.filtersInfo.toPODate.$viewValue ? new Date($filter('date')(vm.filtersInfo.toPODate.$viewValue, vm.DefaultDateFormat)) : null;
        if (vm.filtersInfo) {
          if (vm.filtersInfo.fromPODate && vm.filtersInfo.toPODate && fromPODate && toPODate) {
            if (type && fromPODate <= toPODate) {
              vm.toPODate = toPODate;
              vm.filtersInfo.toPODate.$setValidity('minvalue', true);
            }
            if (type && fromPODate > toPODate) {
              vm.fromPODate = fromPODate;
              vm.filtersInfo.fromPODate.$setValidity('maxvalue', false);
            }
            if (!type && fromPODate <= toPODate) {
              vm.fromPODate = fromPODate;
              vm.filtersInfo.fromPODate.$setValidity('maxvalue', true);
            }
            if (!type && fromPODate > toPODate) {
              vm.toPODate = toPODate;
              vm.filtersInfo.toPODate.$setValidity('minvalue', false);
            }
          }
        }
      };
      //search component list
      vm.querycomponentSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria),
          isFromSalesOrder: true
        };
        return PurchaseOrderFactory.getComponentFilterList().query(searchObj).$promise.then((compresponse) => {
          if (compresponse && compresponse.data) {
            compresponse.data = _.differenceWith(compresponse.data, vm.partIds, (arrValue, othValue) => arrValue.id === othValue.id);
            return compresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //give common search
      const returnCommonSearch = (criteria) => {
        const replacedString = criteria.replace('\\', '\\\\');
        criteria = replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
        return criteria.length > 255 ? criteria.substring(0, 255) : criteria;
      };
      //search workorder list
      vm.queryworkorderSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria),
          customerID: vm.customer.join(',')
        };
        return PurchaseOrderFactory.getWorkOrderFilterList().query(searchObj).$promise.then((woresponse) => {
          if (woresponse && woresponse.data) {
            woresponse.data = _.differenceWith(woresponse.data, vm.woIds, (arrValue, othValue) => arrValue.woNumber === othValue.woNumber);
            return woresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      const autocompleteSOPromise = [vm.getCustomerList()];
      vm.cgBusyLoading = $q.all(autocompleteSOPromise).then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    }
  }
})();
