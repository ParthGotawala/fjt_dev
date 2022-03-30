(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('PendingWOCreationController', PendingWOCreationController);

  function PendingWOCreationController(TRANSACTION, CORE, USER, WORKORDER, BaseService, GenericCategoryFactory, $q, $scope,
    SalesOrderFactory, $timeout, socketConnectionService, DialogFactory, $mdDialog) {
    const vm = this;

    vm.isWorkOrder = true;
    vm.isHideDelete = true;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PENDINGWOCREATION;
    vm.HaltResumePopUp = CORE.HaltResumePopUp;
    vm.WoStatus = CORE.PendingWOStatusGridHeaderDropdown;
    vm.GoodBadPartHeaderDropdown = CORE.GoodBadPartHeaderDropdown;
    vm.gridConfig = CORE.gridConfig;
    vm.SOWorkingStatus = CORE.SOWorkingStatus;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.customFilterQueryObjects = [
      { pendingWOCreationSearchType: 'Pending', whereClause: '(pendingWOCreation > 0 OR pendingWOCreation IS NULL)' },
      { pendingWOCreationSearchType: 'Completed', whereClause: 'pendingWOCreation = 0' },
      { pendingWOCreationSearchType: 'All', whereClause: null }
    ];

    vm.PendingWOCreationSearchType = 'Pending';

    vm.getCustomWhereClause = () => {
      var customSearchTypeObject = _.find(vm.customFilterQueryObjects, (item) => item.pendingWOCreationSearchType === vm.PendingWOCreationSearchType);
      vm.customWhereClause = customSearchTypeObject.whereClause;
    };
    vm.getCustomWhereClause();

    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateDisplayFormat;

    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);

    vm.PendingWOCreationStatusFilter = () => {
      vm.getCustomWhereClause();
      vm.pagingInfo.customPendingWOCreationWhereClause = vm.customWhereClause;
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

    /*get shipping list data for header filter*/
    const getShippingList = () => GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({
      categoryType: CORE.CategoryType.ShippingType.Name
    }).$promise.then((shipping) => {
      if (shipping && shipping.data) {
        vm.ShippingList = [{ id: null, value: 'All' }];
        _.each(shipping.data, (item) => {
          var obj = {
            id: item.gencCategoryCode,
            value: item.gencCategoryCode
          };
          vm.ShippingList.push(obj);
        });
      }
      return shipping;
    }).catch((error) => BaseService.getErrorLog(error));

    /*get Payment Terms list data for header filter in grid */
    const getPaymentTermsList = () => GenericCategoryFactory.getAllGenericCategoryByCategoryType().query({
      categoryType: CORE.CategoryType.Terms.Name
    }).$promise.then((respOfTerms) => {
      if (respOfTerms && respOfTerms.data) {
        vm.paymentTermsList = [{ id: null, value: 'All' }];
        _.each(respOfTerms.data, (item) => {
          var obj = {
            id: item.gencCategoryName,
            value: item.gencCategoryName
          };
          vm.paymentTermsList.push(obj);
        });
      }
      return respOfTerms;
    }).catch((error) => BaseService.getErrorLog(error));

    const gridHeaderFilterPromise = [getShippingList(), getPaymentTermsList()];
    vm.cgBusyLoading = $q.all(gridHeaderFilterPromise).then(() => {
      LoadSourceData();
    }).catch((error) => BaseService.getErrorLog(error));

    //refresh pending WO creation list
    vm.refreshPendingWOCreationList = () => {
      vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
      vm.loadData();
    };

    function LoadSourceData() {
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '80',
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
          enableSorting: false
        },
        {
          field: 'statusConvertedValue',
          displayName: 'SO Posting Status',
          width: 120,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="grid.appScope.$parent.vm.getWoStatusClassName(row.entity.status)">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'kitStatusPercentage',
          width: '130',
          minWidth: '130',
          displayName: 'Kit Allocation % (Component)',
          cellTemplate: '<div>'
            + '<md-button ng-disabled="!row.entity.salesOrderDetailId" class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.openkitAllocation(row)">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.kitStatusPercentage || 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'underline\':row.entity.salesOrderDetailId}" class="cursor-pointer">A-{{(row.entity.kitStatusPercentage || 0)}}%</span></span>'
            + '<md-tooltip md-direction="top">Kit Allocation</md-tooltip>'
            + '</md-button>'
            + '</div>'
            + '<span class="ml-5 margin-top-2">'
            + '<img class="wo-stop-image" ng-if="row.entity.haltStatusKA == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
            + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusKA == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonKA}}</md-tooltip></span>',
          ColumnDataType: 'StringEquals',
          enableSorting: false,
          enableFiltering: false,
          allowCellFocus: false
        },
        {
          field: 'subKitStatusPercentage',
          width: '110',
          minWidth: '110',
          displayName: 'Kit Allocation % (With Sub Assembly)',
          cellTemplate: '<div>'
            + '<md-button ng-disabled="!row.entity.salesOrderDetailId" class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.openkitAllocation(row)">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.subKitStatusPercentage || 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'underline\':row.entity.salesOrderDetailId}" class="cursor-pointer">A-{{(row.entity.subKitStatusPercentage || 0)}}%</span></span>'
            + '<md-tooltip md-direction="top">Kit Allocation % (With Sub Assembly)</md-tooltip>'
            + '</md-button>'
            + '</div>',
          ColumnDataType: 'StringEquals',
          enableSorting: false,
          enableFiltering: false,
          allowCellFocus: false
        },
        {
          field: 'soCompletionPercentage',
          width: '100',
          minWidth: '100',
          displayName: 'SO Completion Status',
          cellTemplate: '<div>'
            + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.openPOStatusReport(row.entity)">'
            + '<div class="cm-quote-progress" style="width:{{(row.entity.soCompletionPercentage>100?100:row.entity.soCompletionPercentage|| 0) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'cursor-pointer\': row.entity.soCompletionPercentage > 0 , \'underline\':row.entity.soCompletionPercentage > 0}"> '
            + '{{(row.entity.soCompletionPercentage>100?100:row.entity.soCompletionPercentage || 0)}}%</span></span>'
            + '<md-tooltip md-direction="top">{{grid.appScope.$parent.vm.LabelConstant.Shipped.ShippedQty}}: {{row.entity.shippedQty}}</md-tooltip>'
            + '</md-button>'
            + '</div>',
          enableFiltering: true,
          allowCellFocus: false
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
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.WoStatus
          },
          width: '150',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'cancleReason',
          displayName: 'Cancellation Reason',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200'
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
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.id);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.SO" text="row.entity.salesOrderNumber" ng-if="row.entity.salesOrderNumber"></copy-text>\
                        </div>',
          width: '130'
        },
        {
          field: 'revision',
          displayName: 'SO Revision',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '110'
        },
        {
          field: 'poNumber',
          displayName: vm.LabelConstant.SalesOrder.PO,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageSalesOrder(row.entity.id);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.PO" text="row.entity.poNumber" ng-if="row.entity.poNumber"></copy-text>\
                        </div>',
          width: '150'
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
          field: 'companyName',
          displayName: vm.LabelConstant.SalesOrder.Customer,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Customer" text="row.entity.companyName" ng-if="row.entity.companyName"></copy-text>\
                        </div>',
          width: '300'
        },
        {
          field: 'fullName',
          displayName: 'Contact Person',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY
        },
        {
          field: 'termsDisplayText',
          displayName: vm.LabelConstant.SalesOrder.Terms,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToGenericCategoryManageTerms(row.entity.termsID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.Terms" text="row.entity.termsDisplayText" ng-if="row.entity.termsDisplayText"></copy-text>\
                        </div>',
          width: '140',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.paymentTermsList
          }
        },
        {
          field: 'genCategoryCode',
          displayName: vm.LabelConstant.SalesOrder.ShippingMethod,
          cellTemplate: '<div class="ui-grid-cell-contents">\
                            <a class="cm-text-decoration underline" ng-click="grid.appScope.$parent.vm.goToManageGenericCategoryShippingType(row.entity.shippingMethodID);" tabindex="-1">{{COL_FIELD}}</a>\
                            <copy-text label="grid.appScope.$parent.vm.LabelConstant.SalesOrder.ShippingMethod" text="row.entity.genCategoryCode" ng-if="row.entity.genCategoryCode"></copy-text>\
                        </div>',
          width: '100',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.ShippingList
          }
        },
        {
          field: 'shippingComment',
          displayName: 'Shipping Comment',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200'
        },
        {
          field: 'PIDCode',
          displayName: 'Assy ID',
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                rohs-icon="row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsComplientConvertedValue" \
                                is-custom-part="row.entity.isCustomPart" \
                                is-assembly="true"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID
        }, {
          field: 'mfgPN',
          displayName: vm.LabelConstant.Assembly.MFGPN,
          enableCellEdit: false,
          enableCellEditOnFocus: true,
          cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" \
                                        value="row.entity.mfgPN" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsComplientConvertedValue" \
                                        is-custom-part="row.entity.isCustomPart" \
                                        is-assembly="true"></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          allowCellFocus: true
        },
        {
          field: 'liveVersion',
          displayName: vm.LabelConstant.BOM.InternalVersion,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120'
        },
        //{
        //  field: 'releasedWorkorder',
        //  displayName: vm.LabelConstant.Workorder.ReleasedWO,
        //  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        //  width: '200',
        //  allowCellFocus: true
        //},
        //{
        //  field: 'woNumber',
        //  displayName: vm.LabelConstant.Workorder.WO,
        //  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        //  width: '200',
        //  allowCellFocus: true
        //},
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
          field: 'workOrders',
          displayName: 'WO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="padding:0px !important">\
                            <span ng-repeat="workorder in row.entity.workorderDets track by $index">\
                                <a class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.gotoWorkOrder($index,row.entity.workorderIds);" tabindex="-1">{{workorder}}</a>{{row.entity.workorderDets[row.entity.workorderDets.length-1]===workorder?\'\':\' , \'}}\
                            </span>\
                        </div>',
          width: 150,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'pendingWOCreation',
          displayName: vm.LabelConstant.Workorder.PendingWOQty,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '110',
          allowCellFocus: true
        },
        {
          field: 'nickName',
          displayName: vm.LabelConstant.Assembly.NickName,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ASSY_NICKNAME
        },
        {
          field: 'mfgPNDescription',
          displayName: vm.LabelConstant.Assembly.Description,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '230'
        },
        {
          field: 'qty',
          displayName: 'PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '80'
        },
        {
          field: 'mrpQty',
          displayName: 'MRP Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120'
        },
        {
          field: 'kitQty',
          displayName: 'Kit Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120'
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
          enableFiltering: true,
          enableSorting: false,
          width: '95'
        },
        {
          field: 'materialTentitiveDocDate',
          displayName: 'Customer Consigned Material Promised Dock Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          width: '100',
          enableFiltering: false
        },
        {
          field: 'prcNumberofWeek',
          displayName: 'Build Weeks',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80'
        },
        {
          field: 'materialDueDate',
          displayName: 'Purchased Material Dock Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><label  ng-class="{\'red\': row.entity.isPastMaterialDocDate}">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</label></div>',
          width: '110',
          enableFiltering: false
        },
        {
          field: 'shippingQty',
          displayName: 'Total Releases',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '80'
        },
        {
          field: 'kitReleasePlanCount',
          displayName: 'Plan Count',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> \
                            <a tabindex="-1" ng-class="{\'red\': row.entity.kitReleasePlanCount <= 0}" class="text-underline cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPlannPurchase(row, $event)"> \
                              {{ COL_FIELD }} \
                            </a> \
                        <md-tooltip md-direction="top">Plan Kit</md-tooltip> \
                        </div > ',
          width: '80',
          allowCellFocus: true
        },
        {
          field: 'remark',
          displayName: 'Comment',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200'
        },
        {
          field: 'nextShipDate',
          displayName: 'Next Ship Plan Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '130'
        },
        {
          field: 'kitNumber',
          displayName: 'Kit Number',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '170',
          allowCellFocus: true
        },
        {
          field: 'modifyDate',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'soModifiedBy',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'createdDate',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'soCreatedBy',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableSorting: true,
          enableFiltering: true
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];
    }

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: [],
        isPendingWOCreationList: true,
        customPendingWOCreationWhereClause: vm.customWhereClause
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowSelection: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Pending WO creation list.csv',
      rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-wo-hotjob-bgcolor\': row.entity.isBuildWiseHotJob }" role="gridcell" ui-grid-cell="">'
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
      removeSocketListener();
    });
    const setDataAfterGetAPICall = (pendingwocreation, isGetDataDown) => {
      if (pendingwocreation && pendingwocreation.data && pendingwocreation.data.salesorders) {
        if (!isGetDataDown) {
          vm.sourceData = pendingwocreation.data.salesorders;
          vm.currentdata = vm.sourceData.length;
        }
        else if (pendingwocreation.data.salesorders.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(pendingwocreation.data.salesorders);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        _.each(vm.sourceData, (item) => {
          item.isBuildWiseHotJob = item.isBuildWiseHotJob ? JSON.parse(item.isBuildWiseHotJob) : 0;
          item.copyRohsIcon = item.rohsIcon;
          item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
          item.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
          item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
          item.nextShipDate = BaseService.getUIFormatedDate(item.nextShipDate, vm.DefaultDateFormat);
          item.materialTentitiveDocDate = BaseService.getUIFormatedDate(item.materialTentitiveDocDate, vm.DefaultDateFormat);
          item.materialDueDate = BaseService.getUIFormatedDate(item.materialDueDate, vm.DefaultDateFormat);
          const releasedWorkorderDets = item.releasedWorkorderNmberAndId ? item.releasedWorkorderNmberAndId.split(',') : [];
          item.releasedWorkorderDetIds = _.map(releasedWorkorderDets, (data) => data.split('###')[0].trim()).join(',');
          item.releasedWorkorderDets = _.map(releasedWorkorderDets, (data) => data.split('###')[1]);
          item.workorderDets = item.workorders ? item.workorders.split(',') : [];

          if (item.pendingWOCreation === 0) {
            item.isHiddenAddWorkOrder = true;
          }
          if (item.partCategory !== CORE.PartCategory.SubAssembly) {
            item.isHiddenAddWorkOrder = true;
          }
          if (item.isCancle === 1) {
            item.isHiddenAddWorkOrder = true;
          }
          if (parseInt(item.status) !== 1 || item.salesOrderDetStatus !== 1) {
            item.isHiddenAddWorkOrder = true;
          }
          if (item.materialDueDate && item.kitStatusPercentage !== 100 && new Date(item.materialDueDate) < new Date()) {
            item.isPastMaterialDocDate = true;
          }
        });
        // must set after new data comes
        vm.totalSourceDataCount = pendingwocreation.data.Count;
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
          if (vm.pagingInfo.customPendingWOCreationWhereClause || vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
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
    /* retrieve pending Wo creation list*/
    vm.loadData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.pagingInfo.SortColumns.length === 0) {
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      }

      vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderList().query(vm.pagingInfo).$promise.then((pendingwocreation) => {
        vm.sourceData = [];
        if (pendingwocreation && pendingwocreation.data) {
          setDataAfterGetAPICall(pendingwocreation, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderList().query(vm.pagingInfo).$promise.then((pendingwocreation) => {
        if (pendingwocreation && pendingwocreation.data && pendingwocreation.data.salesorders) {
          setDataAfterGetAPICall(pendingwocreation, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.addWorkOrder = (row, event) => {
      const pageRightsAccessDet = {
        popupAccessRoutingState: [WORKORDER.MANAGE_WORKORDER_DETAILS_STATE],
        pageNameAccessLabel: CORE.PageName.Workorder
      };
      if (BaseService.checkRightToAccessPopUp(pageRightsAccessDet)) {
        let data = {};
        if (row && row.entity) {
          data = {
            customerID: row.entity.customerID ? row.entity.customerID : null,
            subAssy: {
              id: row.entity.PIDCode ? row.entity.partID : null
            },
            salesOrderDetailId: row.entity.salesOrderDetailId ? row.entity.salesOrderDetailId : null,
            isFromList: 1
          };
        }
        DialogFactory.dialogService(
          WORKORDER.ADD_WORKORDER_CONTROLLER,
          WORKORDER.ADD_WORKORDER_VIEW,
          event,
          data).then(() => BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData),
            (error) => BaseService.getErrorLog(error));
      }
    };

    vm.selectedWorkorder = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    vm.updateRecord = (row) => {
      $state.go(TRANSACTION.TRANSACTION_MANAGE_STATE, {
        sID: row.entity.id
      });
    };

    const updateOneRowOfGrid = (salesOrderDetailId) => {
      if (salesOrderDetailId) {
        //Code will be here
      }
    };

    vm.openkitAllocation = (row) => BaseService.goToKitList(row.entity.salesOrderDetailId, 0, null);

    vm.goToPlannPurchase = (row, event) => {
      var data = {
        salesOrderDetailId: row.entity.salesOrderDetailId,
        qty: row.entity.qty,
        partID: row.entity.partID,
        poNumber: row.entity.poNumber,
        salesOrderNumber: row.entity.salesOrderNumber,
        rohsIcon: row.entity.rohsIcon,
        rohsComplientConvertedValue: row.entity.rohsComplientConvertedValue,
        mfgPN: row.entity.mfgPN,
        PIDCode: row.entity.PIDCode,
        PODate: row.entity.poDate,
        kitQty: row.entity.kitQty,
        soId: row.entity.id
      };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_CONTROLLER,
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_VIEW,
        event,
        data).then(() => {
        }, (data) => {
          if (data && row && row.entity) {
            updateOneRowOfGrid(row.entity.salesOrderDetailId);
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    /* go to PO status report for selected sales order assembly */
    vm.openPOStatusReport = (rowData) => {
      if (rowData.partID && rowData.salesOrderDetailId && rowData.soCompletionPercentage) {
        BaseService.goToPOStatusAssemblyReport(rowData.customerID, rowData.salesOrderDetailId, rowData.partID);
      }
    };

    vm.updateOneRecord = (responseData) => {
      if (responseData.salesOrderDetailId) {
        updateOneRowOfGrid(responseData.salesOrderDetailId);
      }
    };

    function socketListener(responseData) {
      $timeout(() => vm.updateOneRecord(responseData));
    }
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, socketListener);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, socketListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => connectSocket());
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
    }

    // on disconnect socket
    socketConnectionService.on('disconnect', () => removeSocketListener());

    vm.gotoWorkOrder = (index, workOrderIds) => {
      if (workOrderIds) {
        const rowDetails = workOrderIds.split(',');
        if (rowDetails.length > 0) {
          BaseService.goToWorkorderDetails(rowDetails[index]);
        }
      }
    };

    vm.goToManageSalesOrder = (id) => {
      if (id) {
        BaseService.goToManageSalesOrder(id);
      }
    };

    vm.goToCustomer = (id) => {
      if (id) {
        BaseService.goToCustomer(id);
      }
    };

    vm.goToGenericCategoryManageTerms = (id) => {
      if (id) {
        BaseService.goToGenericCategoryManageTerms(id);
      }
    };

    vm.goToManageGenericCategoryShippingType = (id) => {
      if (id) {
        BaseService.goToManageGenericCategoryShippingType(id);
      }
    };
  }
})();
