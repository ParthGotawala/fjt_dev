(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('pendingCustPackingslipCreationView', pendingCustPackingslipCreationView);

  /** @ngInject */
  function pendingCustPackingslipCreationView() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        customerId: '=?'
      },
      templateUrl: 'app/directives/custom/pending-po-cust-packingslip/pending-cust-packingslip-creation-view.html',
      controller: pendingCustPackingslipCreationViewCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function pendingCustPackingslipCreationViewCtrl($scope, $timeout, CORE, TRANSACTION, BaseService, $q, USER, SalesOrderFactory) {
      var vm = this;
      //vm.listType = parseInt($stateParams.listType); // 0 - sales order list, 1 - Pending customer paking slip list
      //vm.isUpdatable = vm.listType === 0 ? true : false;
      //vm.isUsageMaterial = vm.listType === 0 ? true : false;
      //vm.isManualStatusChange = vm.listType === 0 ? true : false;
      vm.customerId = parseInt($scope.customerId || 0);
      vm.configTimeout = _configTimeout;
      vm.EmptyMesssageForPECustPackingSlip = TRANSACTION.TRANSACTION_EMPTYSTATE.PENDING_CUSTOMER_PACKING_SLIP_CREATION;
      // vm.DisplayStatus = CORE.DisplayStatus;
      vm.HaltResumePopUp = CORE.HaltResumePopUp;
      vm.haltImagePath = vm.HaltResumePopUp.stopImagePath;
      vm.resumeImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, vm.HaltResumePopUp.resumeFileName);
      vm.woStatusDetail = CORE.WorkOrderStatus;
      vm.WoStatus = CORE.SalesOrderStatusGridHeaderDropdown;
      vm.CompelteStatus = CORE.SalesOrderCompleteStatusGridHeaderDropdown;
      vm.GoodBadPartHeaderDropdown = CORE.GoodBadPartHeaderDropdown;
      // vm.gridConfig = CORE.gridConfig;
      vm.gridId = CORE.gridConfig.gridPendingCustPackingSlipPopup;
      //vm.isAssyAtGlance = vm.listType === 0 ? true : false;
      //vm.isCheckKitFeasibility = vm.listType === 0 ? true : false;
      //vm.isKitRelease = vm.listType === 0 ? true : false;
      //vm.isWorkOrder = vm.listType === 0 ? true : false;
      //vm.SOWorkingStatus = CORE.SOWorkingStatus;
      //vm.isHaltResumeHistory = vm.listType === 0 ? true : false;
      //vm.isHaltResumeSalesOrder = vm.listType === 0 ? true : false;
      vm.isfocus = true;
      vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
      vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
      vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
      vm.EmptyMesssages = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      // const CategoryTypeObjList = angular.copy(CORE.CategoryType);
      //vm.salesOrderList = vm.listType === 0 ? true : false;
      //vm.salesorderChangesHistory = vm.listType === 0 ? true : false;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      //vm.iscancle = vm.listType === 0 ? true : false;
      //vm.isAddCustPackingSlip = vm.listType === 1 ? true : false;
      //vm.isHideDelete = vm.listType === 1 ? true : false;
      //vm.isViewAssembly = vm.listType === 0 ? true : false;
      //vm.kitRelease = true;
      vm.entityID = CORE.AllEntityIDS.SalesOrder.ID;
      vm.LabelConstant = CORE.LabelConstant;
      vm.getWoStatus = (statusID) => BaseService.getWoStatus(statusID);
      vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.pending = true;
      vm.isHideDelete = true;
      vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
      vm.WOSTATUS = CORE.WOSTATUS;


      /*load source header after getting shipping detail list*/
      function LoadSourceData() {
        vm.sourceHeader = [
          {
            field: '#',
            width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
            cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
            enableFiltering: false,
            enableSorting: false
          },
          {
            field: 'serialNumber',
            displayName: 'SystemID',
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents">'
              + '{{COL_FIELD}}'
              + '</div>',
            enableFiltering: true,
            enableSorting: true
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
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
              term: null,
              options: vm.WoStatus
            },
            enableFiltering: true,
            enableSorting: false
          },
          {
            field: 'soCompletionPercentage',
            width: '100',
            minWidth: '100',
            displayName: 'SO Completion Status',
            cellTemplate: '<div>'
              + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.openPOStatusReport(row.entity)">'
              + '<div class="cm-quote-progress" style="width:{{(row.entity.soCompletionPercentage || 0) +\'%\'}}"></div>'
              + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'cursor-pointer\': row.entity.soCompletionPercentage > 0 , \'underline\':row.entity.soCompletionPercentage > 0}"> '
              + '{{(row.entity.soCompletionPercentage || 0)}}%</span></span>'
              + '<md-tooltip md-direction="top">{{grid.appScope.$parent.vm.LabelConstant.Shipped.ShippedQty}}: {{row.entity.shippedQty}}</md-tooltip>'
              + '</md-button>'
              + '</div>',
            enableFiltering: true,
            allowCellFocus: false
          },
          //{
          //  field: 'salesOrderDetStatusConvertedValues',
          //  displayName: 'SO Working Status',
          //  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          //    + '<span class="label-box" ng-class="{\'label-warning\':row.entity.salesOrderDetStatusConvertedValues == grid.appScope.$parent.vm.SOWorkingStatus.InProgress, \'label-success\':row.entity.salesOrderDetStatusConvertedValues == grid.appScope.$parent.vm.SOWorkingStatus.Completed ,\'label-danger\' :row.entity.completedStatus ==grid.appScope.$parent.vm.SOWorkingStatus.Canceled }">'
          //    + '{{COL_FIELD}}'
          //    + '</span>'
          //    + '<span class="ml-5">'
          //    + '<img class="wo-stop-image wo-stop-image-margin" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus" src="assets/images/logos/stopped.png" />'
          //    + '<md-tooltip md-direction="top" class="tooltip-multiline" ng-if="row.entity.haltStatusPO == grid.appScope.$parent.vm.HaltResumePopUp.HaltStatus">{{row.entity.reasonPO}}</md-tooltip>'
          //    + '</span>'
          //    + '</div>',
          //  width: '150',
          //  enableFiltering: false,
          //  enableSorting: false
          //},
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
            width: '180'
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
            width: '280',
            enableFiltering: true
          },
          {
            field: 'PIDCode',
            displayName: 'Assy ID/PID',
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                component-id="row.entity.partID" \
                                label="\'Assy ID/ PID\'" \
                                value="row.entity.PIDCode" \
                                is-copy="true" \
                                is-custom-part="row.entity.isCustomPart" \
                                rohs-icon="row.entity.rohsIcon" \
                                rohs-status="row.entity.rohsComplientConvertedValue" \
                                is-assembly="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID,
            enableFiltering: false
          },
          {
            field: 'mfgPN',
            displayName: vm.LabelConstant.MFG.MFGPN,
            enableCellEdit: false,
            enableCellEditOnFocus: true,
            cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.partID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                        value="row.entity.mfgPN" \
                                        is-copy="true" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsComplientConvertedValue" \
                                        is-custom-part="row.entity.isCustomPart" \
                                        is-assembly="row.entity.isCustomPart"></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
            allowCellFocus: true,
            enableFiltering: false
          },
          {
            field: 'custPOLineNumber',
            displayName: 'Cust PO Line#',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
            width: '140',
            allowCellFocus: true
          },
          //{
          //  field: 'liveVersion',
          //  displayName: vm.LabelConstant.BOM.InternalVersion,
          //  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          //  width: '120'
          //},
          {
            field: 'qty',
            displayName: 'PO Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '80'
          },
          {
            field: 'custPackingSlipShippedQty',
            displayName: 'Shipped Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '120',
            allowCellFocus: true
          },
          {
            field: 'balancePoQty',
            displayName: 'Balance Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '120',
            allowCellFocus: true
          },
          {
            field: 'modifyDate',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
            type: 'datetime',
            enableFiltering: false
          }, {
            field: 'soModifiedBy',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true
          }, {
            field: 'updatedbyRole',
            displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
            type: 'StringEquals',
            enableFiltering: true
          }, {
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

        //if (vm.listType === 0) {
        //  vm.sourceHeader.splice(3, 0, kitStatusPercentageColumn);
        //  vm.sourceHeader.splice(4, 0, subKitStatusPercentageColumn);
        //  vm.sourceHeader.splice(7, 0, cancleReasonColumn);
        //  vm.sourceHeader.splice(20, 0, priceColumn);
        //  vm.sourceHeader.splice(21, 0, mrpQtyColumn);
        //  vm.sourceHeader.splice(22, 0, extPriceDisplayValueColumn);
        //  vm.sourceHeader.splice(23, 0, otherChargesTotalColumn);
        //  vm.sourceHeader.splice(24, 0, totalextPriceDisplayValueColumn);
        //  vm.sourceHeader.splice(25, 0, kitQtyColumn);
        //  vm.sourceHeader.splice(34, 0, kitReleasePlanCountColumn);
        //  vm.sourceHeader.splice(37, 0, kitNumberColumn);
        //  vm.sourceHeader.splice(38, 0, isSkipKitCreationColumn);
        //} else if (vm.listType === 1) {
        //  vm.sourceHeader.splice(11, 0, shippedQtyColumn);
        //  vm.sourceHeader.splice(12, 0, balancePOQtyColumn);
        //  vm.sourceHeader.splice(13, 0, promisedShipDateColumn);
        //}
      }
      // Get Term and Condition from Data key for Sales Order Report
      const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
        if (dataKey) {
          vm.dataKey = dataKey.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      const gridHeaderFilterPromise = [getDataKey()];
      vm.cgBusyLoading = $q.all(gridHeaderFilterPromise).then(() => {
        LoadSourceData();
      }).catch((error) => BaseService.getErrorLog(error));

      //refersh sales order
      vm.refreshSalesOrder = () => {
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['id', 'DESC']],
          SearchColumns: [],
          isKitList: false,
          isPendingCustPackingSlipList: true
        };
        vm.pagingInfo.SortColumns = [['promisedShipDate', 'ASC']];
      };
      initPageInfo();

      if (vm.customerId) {
        vm.pagingInfo.filter = { customerId: vm.customerId };
      }

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: vm.listType === 0 ? true : false,
        enableFullRowSelection: false,
        enableRowSelection: vm.listType === 0 ? true : false,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Pending Customer Packing Slip Creation List.csv',
        rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'cm-pending-po-hotjob-bgcolor\': row.entity.isBuildWiseHotJob }" role="gridcell" ui-grid-cell="">'
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (salesorder, isGetDataDown) => {
        if (salesorder && salesorder.data && salesorder.data.salesorders) {
          if (!isGetDataDown) {
            vm.sourceData = salesorder.data.salesorders;
            vm.currentdata = vm.sourceData.length;
          }
          else if (salesorder.data.salesorders.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(salesorder.data.salesorders);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = salesorder.data.Count;

          _.each(vm.sourceData, (item) => {
            item.isBuildWiseHotJob = item.isBuildWiseHotJob ? JSON.parse(item.isBuildWiseHotJob) : 0;
            item.isSkipKitCreation = item.isSkipKitCreation ? true : false;
            item.copyRohsIcon = item.rohsIcon;
            item.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.rohsIcon);
            item.soDate = BaseService.getUIFormatedDate(item.soDate, vm.DefaultDateFormat);
            item.poDate = BaseService.getUIFormatedDate(item.poDate, vm.DefaultDateFormat);
            item.nextShipDate = BaseService.getUIFormatedDate(item.nextShipDate, vm.DefaultDateFormat);
            item.materialTentitiveDocDate = BaseService.getUIFormatedDate(item.materialTentitiveDocDate, vm.DefaultDateFormat);
            item.materialDueDate = BaseService.getUIFormatedDate(item.materialDueDate, vm.DefaultDateFormat);
            item.isDisabledAddInvoice = item.salesOrderDetailId ? false : true;
            const releasedWorkorderDets = item.releasedWorkorderNmberAndId ? item.releasedWorkorderNmberAndId.split(',') : [];
            item.releasedWorkorderDetIds = _.map(releasedWorkorderDets, (data) => data.split('###')[0].trim()).join(',');
            item.releasedWorkorderDets = _.map(releasedWorkorderDets, (data) => data.split('###')[1]);
            item.workorderDets = item.workorders ? item.workorders.split(',') : [];
            item.isDisabledDelete = true;
            item.isRowSelectable = false;

            if (item.refTypePO === vm.HaltResumePopUp.refTypePO) {
              if (item.haltStatusPO === vm.HaltResumePopUp.HaltStatus) {
                item.salesOrderHaltImage = vm.resumeImagePath;
                item.salesOrderHalt = vm.HaltResumePopUp.ResumeSalesOrder;
              } else {
                item.salesOrderHaltImage = vm.haltImagePath;
                item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
              }
            }
            if (item.refTypePO === null) {
              item.salesOrderHaltImage = vm.haltImagePath;
              item.salesOrderHalt = vm.HaltResumePopUp.HaltSalesOrder;
            }
          });
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
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['promisedShipDate', 'ASC']];
        }
        if (vm.customerId) {
          vm.pagingInfo.customerId = vm.customerId;
        }
        vm.pagingInfo.isPendingCustPackingSlipList = true;
        vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderList().query(vm.pagingInfo).$promise.then((salesorder) => {
          vm.sourceData = [];
          if (salesorder && salesorder.data) {
            setDataAfterGetAPICall(salesorder, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = SalesOrderFactory.retrieveSalesOrderList().query(vm.pagingInfo).$promise.then((salesorder) => {
          if (salesorder && salesorder.data && salesorder.data.salesorders) {
            setDataAfterGetAPICall(salesorder, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.fab = {
        Status: false
      };

      vm.openkitRelease = (row) => {
        BaseService.goToKitList(row.entity.salesOrderDetailId, 0, null);
      };

      vm.openkitAllocation = (row) => {
        BaseService.goToKitList(row.entity.salesOrderDetailId, 0, null);
      };

      //function socketListener(responseData) { $timeout(() => { vm.updateOneRecord(responseData); }); }
      //function connectSocket() {
      //  socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, socketListener);
      //  socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, socketListener);
      //}
      //connectSocket();

      //socketConnectionService.on('reconnect', () => {
      //  connectSocket();
      //});
      //function removeSocketListener() {
      //  socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      //  socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
      //}
      //// on disconnect socket
      //socketConnectionService.on('disconnect', () => {
      //  removeSocketListener();
      //});

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
      // go to customer list
      vm.goToCustomerList = () => {
        BaseService.goToCustomerList();
      };
      //go to shipping method
      vm.goToShippingList = () => {
        BaseService.goToGenericCategoryShippingTypeList();
      };
      //go to terms
      vm.goToTermsList = () => {
        BaseService.goToGenericCategoryTermsList();
      };
    }
  }
})();
