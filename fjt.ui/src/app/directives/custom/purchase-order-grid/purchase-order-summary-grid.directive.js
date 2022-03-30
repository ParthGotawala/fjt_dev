(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('purchaseOrderSummaryGrid', purchaseOrderSummaryGrid);
  /** @ngInject */
  function purchaseOrderSummaryGrid(BaseService, $q, CORE, EmployeeFactory, USER, $timeout, TRANSACTION, PurchaseOrderFactory, DialogFactory, $state, ManufacturerFactory, GenericCategoryFactory, $filter, CONFIGURATION, MasterFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        isNoDataFound: '=',
        partIdFilter: '='
      },
      templateUrl: 'app/directives/custom/purchase-order-grid/purchase-order-summary-grid.html',
      controller: purchaseOrderSummaryGridCtrl,
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

    function purchaseOrderSummaryGridCtrl($scope) {
      const vm = this;
      vm.purchaseOrderChangeHistory = vm.isViewLockCustomerPayment = vm.isInProgress = vm.isCanclePO = vm.isPurchaseOrderStatus = vm.isPrinted = vm.isDownload = vm.isCreateDuplicatePO = vm.isOpenPO = vm.isNotApplicable = vm.isReadyToLock = true;
      vm.isOpenSupplierAddressPopup = vm.isOpenBillToPopup = vm.isOpenInternalCommentsPopup = vm.isOpenPOCommentsPopup = vm.isOpenCompleteReasonPopup = vm.isOpenCancleReasonPopup = vm.isDisabledLockBtn = vm.isDisabledUnlockBtn = vm.isDraft = vm.isPublish = vm.isLocked = vm.isCompleted = vm.isCanceled = false;
      vm.partIds = [];
      vm.shippingMethods = [];
      vm.supplier = [];
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
      vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, 'From Date', 'To Date');
      vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE = stringFormat(vm.CORE_MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, 'To Date', 'From Date');
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.purchaseOrderStatus = CORE.SalesOrderStatusGridHeaderDropdown;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PURCHASE_ORDER_SUMMARY_EMPTY;
      vm.setScrollClass = 'gridScrollHeight_Purchase_Order_Line_Page';
      vm.setScrollFilterClass = 'gridScrollHeight_Purchase_Order_Line_Page_Filter';
      vm.loginUser = BaseService.loginUser;
      vm.PurchaseOrderAdvanceFilter = angular.copy(CORE.PurchaseOrderAdvancedFilters);
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachPOType = vm.CheckSearchTypeList[1].id;
      vm.checkSerachAmountType = vm.CheckSearchTypeList[1].id;
      vm.currentPageName = CORE.PageName.PurchaseOrder;
      vm.completePOactionButtonName = `Complete ${vm.currentPageName}`;
      vm.openPOiconButtonName = `Open ${vm.currentPageName}`;
      vm.poCompleteType = CORE.POCompleteStatusTypeDropDown;
      let reTryCount = 0;
      vm.PO_REDIRECTION_TYPE = CORE.PO_REDIRECTION_TYPE;
      vm.PurchaseOrderLockStatus = TRANSACTION.PurchaseOrderLockStatus;
      vm.POWorkingStatus = CORE.PO_Working_Status;
      vm.POPostingStatus = CORE.PO_Posting_Status;
      vm.partIDFilter = $scope.partIdFilter || null;
      vm.termsAndCondition = null;

      const getAllRights = () => {
        vm.allowCompletePurchaseOrder = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToCompletePurchaseOrderManually);
        vm.isAllowToCancelPO = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToCancelPO);
        vm.isAllowToLock = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToLockUnlockPurchaseOrder);
        vm.AllowToOpenPurchaseOrderManually = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToOpenPurchaseOrderManually);
        if ((vm.allowCompletePurchaseOrder === null || vm.allowCompletePurchaseOrder === undefined || vm.isAllowToCancelPO === null || vm.isAllowToCancelPO === undefined
          || vm.isAllowToLock === null || vm.isAllowToLock === undefined || vm.AllowToOpenPurchaseOrderManually === null || vm.AllowToOpenPurchaseOrderManually === undefined)
          && reTryCount < _configGetFeaturesRetryCount) {
          getAllRights(); //put for hard reload option as it will not get data from feature rights
          reTryCount++;
          // console.log(reTryCount);
        }
      };
      getAllRights();

      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      function setTabWisePageRights(pageList) {
        if (pageList && pageList.length > 0) {
          const tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE);
          if (tab) {
            vm.isReadOnly = tab.RO ? true : false;
          }
        }
      }

      $timeout(() => {
        $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
          var menudata = data;
          setTabWisePageRights(menudata);
          $scope.$applyAsync();
        });
      });

      if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
        setTabWisePageRights(BaseService.loginUserPageList);
      }

      //give common search
      const returnCommonSearch = (criteria) => {
        if (criteria) {
          const replacedString = criteria.replace('\\', '\\\\');
          criteria = replacedString.replace(/"/g, '\\"').replace(/'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
          return criteria.length > 255 ? criteria.substring(0, 255) : criteria;
        }
      };

      //search component list
      vm.querycomponentSearch = (criteria) => {
        const searchObj = {
          searchString: returnCommonSearch(criteria),
          partID: vm.partIDFilter
        };
        return PurchaseOrderFactory.getComponentFilterList().query(searchObj).$promise.then((compresponse) => {
          if (compresponse && compresponse.data) {
            if (vm.partIDFilter) {
              compresponse.data[0].isDisable = true;
              vm.partIds.push(compresponse.data[0]);
              vm.PurchaseOrderAdvanceFilter.Parts.isDisable = true;
              vm.isShowGrid = true;
            }
            compresponse.data = _.differenceWith(compresponse.data, vm.partIds, (arrValue, othValue) => arrValue.id === othValue.id);
            return compresponse.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      if (vm.partIDFilter) {
        vm.querycomponentSearch();
      } else {
        vm.isShowGrid = true;
      }

      //if (vm.loginUser) {
      //    vm.setDefault = vm.loginUser.employee.defaultPurchaseDetailTabID === TRANSACTION.PO_DETAIL_TAB.DETAIL ? true : false;
      //}
      vm.isUpdatable = true;
      //get supplier list
      vm.getSupplierList = () => ManufacturerFactory.getAllManufacturerWithFormattedCodeList({ mfgType: CORE.MFG_TYPE.DIST }).query().$promise.then((suppliers) => {
        vm.supplierlist = [];
        if (suppliers && suppliers.data) {
          vm.supplierListToDisplay = _.map(suppliers.data, (supplier) => ({
            id: supplier.id,
            mfgcode: supplier.mfgCodeName
          }));
          vm.supplierlist = angular.copy(vm.supplierListToDisplay);
        }
        return vm.supplierlist;
      }).catch((error) => BaseService.getErrorLog(error));
      //get shipping list detail
      vm.getShippingList = () => {
        const GencCategoryType = [];
        GencCategoryType.push(CORE.CategoryType.ShippingType.Name);
        const listObj = {
          GencCategoryType: GencCategoryType,
          isActive: true
        };
        return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
          if (shipping && shipping.data) {
            _.each(shipping.data, (item) => {
              if (item.gencCategoryCode) {
                item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
              }
              else {
                item.gencCategoryDisplayName = item.gencCategoryName;
              }
            });
            vm.ShippingTypeList = vm.shippingListToDisplay = shipping.data;
            return $q.resolve(vm.ShippingTypeList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      const autocompletePOPromise = [vm.getSupplierList(), vm.getShippingList()];
      vm.cgBusyLoading = $q.all(autocompletePOPromise).then(() => { }).catch((error) => BaseService.getErrorLog(error));
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: '200',
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
          allowCellFocus: false
        },
        {
          field: 'serialNumber',
          displayName: vm.LabelConstant.COMMON.SystemID,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterText()}}</div>'
        },
        {
          field: 'statusName',
          displayName: vm.LabelConstant.PURCHASE_ORDER.POPostingStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.status),\
                        \'label-box label-success\':(row.entity.status)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.purchaseOrderStatus
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'lockStatusValue',
          displayName: vm.LabelConstant.PURCHASE_ORDER.LockStatus,
          width: 145,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span class="label-box" ng-class="{\'label-box label-warning\':(row.entity.lockStatus === grid.appScope.$parent.vm.PurchaseOrderLockStatus.NA.id),\
                        \'label-box label-success\':(row.entity.lockStatus === grid.appScope.$parent.vm.PurchaseOrderLockStatus.ReadyToLock.id),\
                        \'label-box label-danger\':(row.entity.lockStatus === grid.appScope.$parent.vm.PurchaseOrderLockStatus.Locked.id)}">'
            + '{{COL_FIELD}}'
            + '</span>'
            + '</div>',
          enableSorting: false,
          enableFiltering: true,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: TRANSACTION.PurchaseOrderLockStatusGridHeaderDropdown
          }
        },
        {
          field: 'poCompletionPercentage',
          width: '125',
          minWidth: '100',
          displayName: 'PO Completion Status',
          cellTemplate: '<div>'
            + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.goToPackingSlip(row.entity.packingSlipId)">'
            + '<div class="cm-quote-progress" style="width:{{((row.entity.poCompletionPercentage || 0) | number : 2) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'cursor-pointer\': row.entity.poCompletionPercentage > 0 , \'underline\':row.entity.poCompletionPercentage > 0}"> '
            + '{{(row.entity.poCompletionPercentage || 0)}}%</span></span>'
            + '</md-button>'
            + '</div>',
          enableFiltering: true,
          allowCellFocus: false
        },
        {
          field: 'workingStatusName',
          displayName: vm.LabelConstant.PURCHASE_ORDER.POWorkingStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(row.entity.poWorkingStatus===grid.appScope.$parent.vm.POWorkingStatus.InProgress.id),\
                        \'label-box label-success\':(row.entity.poWorkingStatus===grid.appScope.$parent.vm.POWorkingStatus.Completed.id),\
                        \'label-box label-danger\':(row.entity.poWorkingStatus===grid.appScope.$parent.vm.POWorkingStatus.Canceled.id)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.PurchaseOrderCompleteStatusGridHeaderDropdown
          },
          ColumnDataType: 'StringEquals'
        },
        {
          field: 'CancellationConfirmedStatus',
          displayName: vm.LabelConstant.PURCHASE_ORDER.CancellationConfirmed,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.CancellationConfirmed),\
                        \'label-box label-success\':(row.entity.CancellationConfirmed)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '160',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.ShippingInsuranceDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'cancleReason',
          displayName: 'PO Cancellation / Undo Reason',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.cancleReason || grid.appScope.$parent.vm.isOpenCancleReasonPopup" ng-click="grid.appScope.$parent.vm.showPOCancelPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '150',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'poCompleteType',
          displayName: 'PO Completion Type',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(row.entity.poCompleteType===grid.appScope.$parent.vm.poCompleteType[1].id),\
                        \'label-box label-primary\':(row.entity.poCompleteType===grid.appScope.$parent.vm.poCompleteType[3].id), \
                        \'label-box label-success\':(row.entity.poCompleteType===grid.appScope.$parent.vm.poCompleteType[2].id)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '165',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.poCompleteType
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'poCompleteReason',
          displayName: 'PO Completion Reason',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.poCompleteReason || grid.appScope.$parent.vm.isOpenCompleteReasonPopup" ng-click="grid.appScope.$parent.vm.showPOCompletePopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '100',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'blanketPO',
          displayName: 'Blanket PO',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isBlanketPO),\
                        \'label-box label-success\':(row.entity.isBlanketPO)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.ShippingInsuranceDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'shippingInsuranceName',
          displayName: 'Shipping With Insurance',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.shippingInsurance),\
                        \'label-box label-success\':(row.entity.shippingInsurance)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '130',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.ShippingInsuranceDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'isCustConsignedValue',
          displayName: vm.LabelConstant.PURCHASE_ORDER.CustomerConsigned,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isCustConsigned),\
                        \'label-box label-success\':(row.entity.isCustConsigned)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '170',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.CustomerConsignedDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'customerName',
          displayName: vm.LabelConstant.PURCHASE_ORDER.Customer,
          cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.customerID && row.entity.customerName"> <span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.customerID);$event.preventDefault();">{{COL_FIELD}}</a>\
                                        <md-tooltip>{{row.entity.customerName}}</md-tooltip>\
                                    </span>\
                                    <copy-text label="\'Customer\'" text="row.entity.customerName"></copy-text></div>',
          width: '220',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'isNonUMIDStockValue',
          displayName: vm.LabelConstant.PURCHASE_ORDER.NonUMIDStock,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isNonUMIDStock),\
                        \'label-box label-success\':(row.entity.isNonUMIDStock)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '170',
          allowCellFocus: false,
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: CORE.NonUmidStockDropDown
          },
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'supplierName',
          displayName: 'Supplier',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToSupplier(row.entity.supplierID);$event.preventDefault();">{{row.entity.supplierName}}</a>\
                                        <md-tooltip>{{row.entity.supplierName}}</md-tooltip>\
                                    </span>\
<copy-text label="\'Supplier\'" text="row.entity.supplierName"></copy-text></div>',
          width: '220',
          allowCellFocus: false,
          ColumnDataType: 'StringEquals',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'poNumber',
          displayName: vm.LabelConstant.PURCHASE_ORDER.PO,
          cellTemplate: '<div class="ui-grid-cell-contents"> \
                                    <span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetail(row.entity.id);$event.preventDefault();">{{row.entity.poNumber}}</a>\
                                        <md-tooltip>{{row.entity.poNumber}}</md-tooltip>\
                                    </span>\
                                    <copy-text label="\'PO#\'" text="row.entity.poNumber"></copy-text>\
                                    <md-icon md-font-icon="" class= "material-icons mat-icon icon-lock" ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.PurchaseOrderLockStatus.Locked.id" style="margin-left:5px !important;"> </md-icon> \
                                </div>',
          width: '190',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'poRevision',
          displayName: vm.LabelConstant.PURCHASE_ORDER.PORevision,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '150',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'poDate',
          displayName: 'PO Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'soNumber',
          displayName: 'SO#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'soDate',
          displayName: 'SO Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'MaterialReceiptNumber',
          displayName: vm.LabelConstant.PURCHASE_ORDER.MaterialReceiptNumber,
          width: 150,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.MaterialReceiptNumber.length > 0">\
                        <span><span ng-repeat="packingSlip in COL_FIELD"> \
                          <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToPackingSlip(packingSlip.id);$event.preventDefault();"> \
                            <span class="cm-text-decoration cursor-pointer">{{packingSlip.psNumber}}</span><span ng-if="!$last">, </span>\
                          </a>\
                        </span></span>\
                      </div> ',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'totalItems',
          displayName: 'Total Items',
          cellTemplate: '<span ng-if="row.entity.totalItems" class="grid-cell-text-right">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetailPerLineList(row.entity.poNumber, grid.appScope.$parent.vm.PO_REDIRECTION_TYPE.withoutOtherPart);$event.preventDefault();">{{row.entity.totalItems}}</a>\
                                        <md-tooltip>{{row.entity.totalItems}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.totalItems" class="grid-cell-text-right">\
                                        {{row.entity.totalItems}}\
                                    </span>',
          width: '80',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'totalOtherItems',
          displayName: 'Total Other Items',
          cellTemplate: '<span ng-if="row.entity.totalOtherItems" class="grid-cell-text-right">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetailPerLineList(row.entity.poNumber, grid.appScope.$parent.vm.PO_REDIRECTION_TYPE.OtherPart);$event.preventDefault();">{{row.entity.totalOtherItems}}</a>\
                                        <md-tooltip>{{row.entity.totalOtherItems}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.totalOtherItems" class="grid-cell-text-right">\
                                        {{row.entity.totalOtherItems}}\
                                    </span>',
          width: '80',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'poCompletedLine',
          displayName: 'Completed Items',
          cellTemplate: '<span ng-if="row.entity.poCompletedLine" class="grid-cell-text-right">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetailPerLineList(row.entity.poNumber, grid.appScope.$parent.vm.PO_REDIRECTION_TYPE.completedLines);$event.preventDefault();">{{row.entity.poCompletedLine}}</a>\
                                        <md-tooltip>{{row.entity.poCompletedLine}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.poCompletedLine" class="grid-cell-text-right">\
                                        {{row.entity.poCompletedLine}}\
                                    </span>',
          width: '110',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'poPendingLine',
          displayName: 'Pending Items',
          cellTemplate: '<span ng-if="row.entity.poPendingLine" class="grid-cell-text-right">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetailPerLineList(row.entity.poNumber, grid.appScope.$parent.vm.PO_REDIRECTION_TYPE.pendingLines);$event.preventDefault();">{{row.entity.poPendingLine}}</a>\
                                        <md-tooltip>{{row.entity.poPendingLine}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.poPendingLine" class="grid-cell-text-right">\
                                        {{row.entity.poPendingLine}}\
                                    </span>',
          width: '100',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'termsName',
          displayName: 'Terms',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.termsID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToTerms(row.entity.termsID);$event.preventDefault();">{{row.entity.termsName}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.termsID">\
                                        {{row.entity.termsName}}\
                                    </span>\
                       <copy-text label="\'Terms\'" text="row.entity.termsName" ng-if="row.entity.termsName"></copy-text></div>',
          width: '200',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'shippingMethod',
          displayName: 'Shipping Method',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.shippingMethodID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToShippingMethod(row.entity.shippingMethodID);$event.preventDefault();">{{row.entity.shippingMethod}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.shippingMethodID">\
                                        {{row.entity.shippingMethod}}\
                                    </span>\
                       <copy-text label="\'Shipping Method\'" text="row.entity.shippingMethod" ng-if="row.entity.shippingMethod"></copy-text></div>',
          width: '200',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'carrierName',
          displayName: 'Carrier',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span ng-if="row.entity.carrierID">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToCarrier(row.entity.carrierID);$event.preventDefault();">{{row.entity.carrierName}}</a>\
                                    </span>\
                        <span ng-if="!row.entity.carrierID">\
                                        {{row.entity.carrierName}}\
                                    </span>\
                       <copy-text label="\'Carrier\'" text="row.entity.carrierName" ng-if="row.entity.carrierName"></copy-text></div>',
          width: '180',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'carrierAccountNumber',
          displayName: 'Carrier Account#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '180',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'freeOnBoard',
          displayName: 'Free On Board',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200',
          allowCellFocus: false,
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'poDocumentCount',
          displayName: 'PO Documents',
          cellTemplate: '<span ng-if="row.entity.poDocumentCount" class="grid-cell-text-right">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToPurchaseOrderDocuments(row.entity.id);$event.preventDefault();">{{row.entity.poDocumentCount}}</a>\
                                        <md-tooltip>{{row.entity.poDocumentCount}}</md-tooltip>\
                                    </span>\
                              <span ng-if="!row.entity.poDocumentCount" class="grid-cell-text-right">\
                                        {{row.entity.poDocumentCount}}\
                                    </span>',
          width: '100',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'shippingComment',
          displayName: vm.LabelConstant.PURCHASE_ORDER.ShippingComment,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.shippingComment || grid.appScope.$parent.vm.isOpenInternalCommentsPopup" ng-click="grid.appScope.$parent.vm.showInternalCommentPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '130',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'poComment',
          displayName: vm.LabelConstant.PURCHASE_ORDER.POComments,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.poComment || grid.appScope.$parent.vm.isOpenPOCommentsPopup" ng-click="grid.appScope.$parent.vm.showPOCommentPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '130',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'supplierAddress',
          displayName: vm.LabelConstant.Address.SupplierBusinessAddress,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.supplierAddress || grid.appScope.$parent.vm.isOpenSupplierAddressPopup" ng-click="grid.appScope.$parent.vm.showSupplierAddressPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '120',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'shippingAddress',
          displayName: vm.LabelConstant.PURCHASE_ORDER.BillToShipTo,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.shippingAddress || grid.appScope.$parent.vm.isOpenBillToPopup" ng-click="grid.appScope.$parent.vm.showBillToShippToPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '90',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'intermediateAddress',
          displayName: vm.LabelConstant.Address.MarkForAddress,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.intermediateAddress || grid.appScope.$parent.vm.isOpenMarkForAddressPopup" ng-click="grid.appScope.$parent.vm.showMarkForAddressPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '120',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'totalAmount',
          displayName: 'Amount',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
          width: '150',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: true,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotal(true)}}</div>'
        },
        {
          field: 'lockedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_LOCKED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_LOCKED_AT
        },
        {
          field: 'lockByName',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_LOCKEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true
        },
        {
          field: 'lockedByRoleName',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_LOCKEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_LOCKED_BYROLE
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_AT
        }, {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: CORE.UIGrid.VISIBLE_MODIFIED_BY
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
        },
        {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableSorting: true,
          enableFiltering: true,
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
          SortColumns: [['id', 'DESC']],
          SearchColumns: []
        };
      };
      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: true,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Purchase Order Summary Detail.csv',
        CurrentPage: CORE.PAGENAME_CONSTANT[46].PageName,
        allowToExportAllData: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.isExport = true;
          return PurchaseOrderFactory.getPurchaseOrderSummaryDetail().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (response && response.data && response.data.purchaseOrder) {
                setDataAfterGetAPICall(response.data, false);
                return response.data.purchaseOrder;
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        },
        hideMultiDeleteButton: vm.isReadOnly ? true : false
      };

      /* retrieve purchase oredr log list*/
      vm.loadData = () => {
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        generateSearchFilter();
        vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderSummaryDetail().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.purchaseOrder) {
            setDataAfterGetAPICall(response.data, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderSummaryDetail().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data && response.data.purchaseOrder) {
            setDataAfterGetAPICall(response.data, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      function setDataAfterGetAPICall(data, isGetDataDown) {
        if (!isGetDataDown) {
          vm.sourceData = data.purchaseOrder;
          vm.currentdata = vm.sourceData.length;
        }
        else if (data.purchaseOrder.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(data.purchaseOrder);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = data.Count;
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.map(vm.sourceData, (record) => {
            record.isDisabledDelete = record.status || vm.isReadOnly ? true : false;
            record.soDate = BaseService.getUIFormatedDate(record.soDate, vm.DefaultDateFormat);
            record.poDate = BaseService.getUIFormatedDate(record.poDate, vm.DefaultDateFormat);
            record.isPrintDisable = false;
            record.isDownloadDisabled = false;
            record.isCanclePO = record.workingStatusName === vm.POWorkingStatus.Canceled.value ? false : true;
            record.isUndoPO = !record.isCanclePO;
            record.isDisabledCanclePO = record.workingStatusName === vm.POWorkingStatus.InProgress.value ? false : true;
            record.isDisabledUndoPO = record.isCanclePO;
            record.isDisabledManualOpenPO = record.poWorkingStatus !== vm.POWorkingStatus.Completed.id;
            if (!vm.isAllowToLock || vm.isReadOnly) {
              record.isDisableLockUnlockTransaction = true;
            }
            if (record.lockStatus === vm.PurchaseOrderLockStatus.Locked.id) {
              record.lockUnlockTransactionBtnText = `Unlock ${vm.currentPageName}`;
            } else {
              record.lockUnlockTransactionBtnText = `Lock ${vm.currentPageName}`;
            }
            record.poCompletionPercentage = record.poWorkingStatus === vm.POWorkingStatus.Completed.id ? 100 : record.poCompletionPercentage;
            if (record.packingSlip) {
              record.MaterialReceiptNumber = record.packingSlip.split(_groupConcatSeparatorValue);
              const psData = [];
              _.each(record.MaterialReceiptNumber, (value) => {
                const record = value.split('@@@');
                psData.push({
                  id: record[0],
                  psNumber: record[1]
                });
              });
              record.MaterialReceiptNumber = psData;
            }
          });
        }
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
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.supplier.length > 0 || vm.shippingMethods.length > 0 || vm.posoNumber || vm.partIds.length > 0 || vm.isInProgress || vm.isCompleted || vm.isCanceled || vm.fromDate || vm.toDate || vm.isNotApplicable || vm.isReadyToLock || vm.isLocked || vm.isDraft || vm.isPublish || vm.poComments) {
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
        $scope.isNoDataFound = vm.isNoDataFound;
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

      ////set default tab for employee
      //vm.setDefaultTabForEmp = () => {
      //    const objTab = {
      //        defaultPurchaseDetailTabID: vm.setDefault ? TRANSACTION.PO_DETAIL_TAB.DETAIL : null,
      //        employeeID: vm.loginUser.employee.id
      //    };
      //    vm.cgBusyLoading = EmployeeFactory.updateEmployeeDefaultPurchaseOrderTab().query(objTab).$promise.then((data) => {
      //        if (data) {
      //            BaseService.loginUser.employee.defaultPurchaseDetailTabID = objTab.defaultPurchaseDetailTabID;
      //            BaseService.setLoginUser(BaseService.loginUser);
      //        }
      //    }).catch((error) => BaseService.getErrorLog(error));
      //};
      //show mark for address for
      vm.showMarkForAddressPopUp = (object, ev) => {
        vm.isOpenMarkForAddressPopup = true;
        const description = object && object.intermediateAddress ? angular.copy(object.intermediateAddress).replace(/\r/g, '<br/>') : null;
        const data = {
          title: vm.LabelConstant.Address.MarkForAddress,
          description: description,
          name: object.poNumber,
          isCopy: true,
          label: vm.LabelConstant.PURCHASE_ORDER.PO
        };
        openCommonDescriptionPopup(ev, data);
      };
      //show supplier address comments
      vm.showSupplierAddressPopUp = (object, ev) => {
        vm.isOpenSupplierAddressPopup = true;
        const description = object && object.supplierAddress ? angular.copy(object.supplierAddress).replace(/\r/g, '<br/>') : null;
        const data = {
          title: vm.LabelConstant.Address.SupplierBusinessAddress,
          description: description,
          name: object.poNumber,
          isCopy: true,
          label: vm.LabelConstant.PURCHASE_ORDER.PO
        };
        openCommonDescriptionPopup(ev, data);
      };
      //show bill to ship to address comments
      vm.showBillToShippToPopUp = (object, ev) => {
        vm.isOpenBillToPopup = true;
        const description = object && object.shippingAddress ? angular.copy(object.shippingAddress).replace(/\r/g, '<br/>') : null;
        const data = {
          title: vm.LabelConstant.PURCHASE_ORDER.BillToShipTo,
          description: description,
          name: object.poNumber,
          isCopy: true,
          label: vm.LabelConstant.PURCHASE_ORDER.PO
        };
        openCommonDescriptionPopup(ev, data);
      };
      //show Internal comments
      vm.showInternalCommentPopUp = (object, ev) => {
        vm.isOpenInternalCommentsPopup = true;
        const description = object && object.shippingComment ? angular.copy(object.shippingComment).replace(/\n/g, '<br/>') : null;
        const data = {
          title: vm.LabelConstant.PURCHASE_ORDER.InternalComments,
          description: description,
          name: object.poNumber,
          isCopy: true,
          label: vm.LabelConstant.PURCHASE_ORDER.PO
        };
        openCommonDescriptionPopup(ev, data);
      };
      //show po comments
      vm.showPOCommentPopUp = (object, ev) => {
        vm.isOpenPOCommentsPopup = true;
        const description = object && object.poComment ? angular.copy(object.poComment).replace(/\n/g, '<br/>') : null;
        const data = {
          title: vm.LabelConstant.PURCHASE_ORDER.POComments,
          description: description,
          name: object.poNumber,
          isCopy: true,
          label: vm.LabelConstant.PURCHASE_ORDER.PO
        };
        openCommonDescriptionPopup(ev, data);
      };
      // show po completion reason
      vm.showPOCompletePopUp = (object, ev) => {
        vm.isOpenCompleteReasonPopup = true;
        const description = object && object.poCompleteReason ? angular.copy(object.poCompleteReason).replace(/\n/g, '<br/>') : null;
        const data = {
          title: vm.LabelConstant.PURCHASE_ORDER.POCompleteReason,
          description: description,
          name: object.poNumber,
          isCopy: true,
          label: vm.LabelConstant.PURCHASE_ORDER.PO
        };
        openCommonDescriptionPopup(ev, data);
      };
      // show po cancel reason
      vm.showPOCancelPopUp = (object, ev) => {
        vm.isOpenCancleReasonPopup = true;
        const description = object && object.cancleReason ? angular.copy(object.cancleReason).replace(/\n/g, '<br/>') : null;
        const data = {
          title: 'PO Cancellation / Undo Reason',
          description: description,
          name: object.poNumber,
          label: vm.LabelConstant.PURCHASE_ORDER.PO,
          isCopy: true
        };
        openCommonDescriptionPopup(ev, data);
      };
      //open comment popup
      const openCommonDescriptionPopup = (ev, data) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => vm.isOpenMarkForAddressPopup = vm.isOpenSupplierAddressPopup = vm.isOpenBillToPopup = vm.isOpenInternalCommentsPopup = vm.isOpenPOCommentsPopup = vm.isOpenCompleteReasonPopup = vm.isOpenCancleReasonPopup = false,
            () => vm.isOpenMarkForAddressPopup = vm.isOpenSupplierAddressPopup = vm.isOpenBillToPopup = vm.isOpenInternalCommentsPopup = vm.isOpenPOCommentsPopup = vm.isOpenCompleteReasonPopup = vm.isOpenCancleReasonPopup = false);
      };
      //go to supplier
      vm.goToSupplier = (supplierID) => {
        BaseService.goToSupplierDetail(supplierID);
      };
      vm.goToPurchaseOrderDetail = (id) => {
        BaseService.goToPurchaseOrderDetail(id);
      };
      //go to customer details page
      vm.goToCustomer = (id) => BaseService.goToCustomer(id);
      //update record
      vm.updateRecord = (row) => vm.goToPurchaseOrderDetail(row.entity.id);
      //go to purchase order documents
      vm.goToPurchaseOrderDocuments = (id) => {
        BaseService.goToPurchaseOrderDocumentsDetail(id);
      };
      // delete purchase order
      vm.deleteRecord = (purchaseOrder) => {
        if (purchaseOrder) {
          purchaseOrder.isDisabledDelete = true;
        }
        let selectedIDs = [];
        if (purchaseOrder) {
          selectedIDs.push(purchaseOrder.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((purchaseOrderItem) => purchaseOrderItem.id);
          }
        }
        if (selectedIDs) {
          vm.cgBusyLoading = PurchaseOrderFactory.checkPOConsistLine().query({
            ids: selectedIDs
          }).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (response.data && response.data.length > 0) {
                if (purchaseOrder) {
                  purchaseOrder.isDisabledDelete = false;
                }
                const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_DELETE_PO_WITH_LINES;
                return DialogFactory.messageAlertDialog({ messageContent });
              } else {
                vm.cgBusyLoading = PurchaseOrderFactory.checkPOWorkingStatus().query({
                  ids: selectedIDs
                }).$promise.then((response) => {
                  if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                    if (response.data && response.data.length > 0) {
                      if (purchaseOrder) {
                        purchaseOrder.isDisabledDelete = false;
                      }
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_DELETE_PUBLISHED_PO);
                      return DialogFactory.messageAlertDialog({ messageContent });
                    } else {
                      vm.cgBusyLoading = PurchaseOrderFactory.checkPOLineIsClosed().query({
                        refPurchaseOrderID: selectedIDs
                      }).$promise.then((response) => {
                        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                          if (response.data) {
                            if (purchaseOrder) {
                              purchaseOrder.isDisabledDelete = false;
                            }
                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_DELETE_CLOSED_PO);
                            DialogFactory.messageAlertDialog({ messageContent });
                          } else {
                            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                            messageContent.message = stringFormat(messageContent.message, vm.currentPageName, selectedIDs.length);
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
                                vm.cgBusyLoading = PurchaseOrderFactory.removePurchaseOrder().query({
                                  objIDs: objIDs
                                }).$promise.then((response) => {
                                  if (purchaseOrder) {
                                    purchaseOrder.isDisabledDelete = false;
                                  }
                                  if (response && response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                                    const data = {
                                      TotalCount: response.data.transactionDetails[0].TotalCount,
                                      pageName: vm.currentPageName
                                    };
                                    BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                      const IDs = {
                                        id: selectedIDs,
                                        CountList: true
                                      };
                                      return PurchaseOrderFactory.removePurchaseOrder().query({
                                        objIDs: IDs
                                      }).$promise.then((res) => {
                                        let data = {};
                                        data = res.data;
                                        data.pageTitle = purchaseOrder ? purchaseOrder.poNumber : null;
                                        data.PageName = vm.currentPageName;
                                        data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                                        if (res.data) {
                                          DialogFactory.dialogService(
                                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                                            USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                                            ev,
                                            data).then(() => { }, () => { });
                                        }
                                      }).catch((error) => BaseService.getErrorLog(error));
                                    });
                                  } else {
                                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                                    vm.gridOptions.clearSelectedRows();
                                  }
                                }).catch((error) => {
                                  if (purchaseOrder) {
                                    purchaseOrder.isDisabledDelete = false;
                                  }
                                  BaseService.getErrorLog(error);
                                });
                              }
                            }, () => {
                              if (purchaseOrder) {
                                purchaseOrder.isDisabledDelete = false;
                              }
                            });
                          }
                        } else {
                          if (purchaseOrder) {
                            purchaseOrder.isDisabledDelete = false;
                          }
                        }
                      }).catch((error) => {
                        if (purchaseOrder) {
                          purchaseOrder.isDisabledDelete = false;
                        }
                        BaseService.getErrorLog(error);
                      });
                    }
                  } else {
                    if (purchaseOrder) {
                      purchaseOrder.isDisabledDelete = false;
                    }
                  }
                }).catch((error) => {
                  if (purchaseOrder) {
                    purchaseOrder.isDisabledDelete = false;
                  }
                  BaseService.getErrorLog(error);
                });
              }
            } else {
              if (purchaseOrder) {
                purchaseOrder.isDisabledDelete = false;
              }
            }
          }).catch((error) => {
            if (purchaseOrder) {
              purchaseOrder.isDisabledDelete = false;
            }
            BaseService.getErrorLog(error);
          });
        } else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, vm.currentPageName);
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
          if (purchaseOrder) {
            purchaseOrder.isDisabledDelete = false;
          }
        }
      };
      /* delete multiple data called from directive of ui-grid*/
      vm.deleteMultipleData = () => vm.deleteRecord();
      //search supplier list
      vm.searchSupplierList = () => {
        const supplierListToFilter = angular.copy(vm.supplierlist);
        vm.supplierListToDisplay = vm.SupplierSearchText ? _.filter(supplierListToFilter, (item) => item.mfgcode.toLowerCase().contains(vm.SupplierSearchText.toLowerCase())) : supplierListToFilter;
      };

      const generateSearchFilter = () => {
        vm.PurchaseOrderAdvanceFilter.Supplier.isDeleted = !(vm.supplier.length > 0);
        vm.PurchaseOrderAdvanceFilter.ShippingMethod.isDeleted = !(vm.shippingMethods.length > 0);
        vm.PurchaseOrderAdvanceFilter.Parts.isDeleted = !(vm.partIds.length > 0);
        vm.PurchaseOrderAdvanceFilter.POSO.isDeleted = !(vm.posoNumber);
        vm.PurchaseOrderAdvanceFilter.Amount.isDeleted = !(vm.amount);
        vm.PurchaseOrderAdvanceFilter.POStatus.isDeleted = !(vm.isInProgress || vm.isCompleted || vm.isCanceled);
        vm.PurchaseOrderAdvanceFilter.PODate.isDeleted = !(vm.fromDate || vm.toDate);
        vm.PurchaseOrderAdvanceFilter.POLockStatus.isDeleted = !(vm.isReadyToLock || vm.isNotApplicable || vm.isLocked);
        vm.PurchaseOrderAdvanceFilter.POPostingStatus.isDeleted = !(vm.isDraft || vm.isPublish);
        vm.PurchaseOrderAdvanceFilter.POComments.isDeleted = !(vm.poComments);

        vm.pagingInfo.supplierID = vm.supplier.join();
        vm.PurchaseOrderAdvanceFilter.Supplier.tooltip = getFilterTooltip(vm.supplierlist, vm.supplier, 'id', 'mfgcode');

        vm.pagingInfo.shippingMethodId = vm.shippingMethods.join();
        vm.PurchaseOrderAdvanceFilter.ShippingMethod.tooltip = getFilterTooltip(vm.ShippingTypeList, vm.shippingMethods, 'gencCategoryID', 'gencCategoryDisplayName');

        const selectedParts = _.map(vm.partIds, 'id');
        vm.pagingInfo.partIds = selectedParts.join();
        vm.PurchaseOrderAdvanceFilter.Parts.tooltip = getFilterTooltip(vm.partIds, selectedParts.map(String), 'id', 'componentParts');

        vm.pagingInfo.posoSearchType = vm.checkSerachPOType;
        vm.PurchaseOrderAdvanceFilter.POSO.tooltip = vm.posoNumber;
        vm.pagingInfo.posoSearch = BaseService.convertSpecialCharToSearchString(vm.posoNumber);

        vm.PurchaseOrderAdvanceFilter.POComments.tooltip = vm.poComments;
        vm.pagingInfo.poComments = BaseService.convertSpecialCharToSearchString(vm.poComments);

        const itemIndexAmount = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'totalAmount' });
        if (itemIndexAmount !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexAmount, 1);
        }
        if (vm.amount) {
          let columnDataType = null;
          if (vm.checkSerachAmountType === vm.CheckSearchTypeList[0].id) {
            columnDataType = 'StringEquals';
          }
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'totalAmount', SearchString: vm.amount, ColumnDataType: columnDataType, isExternalSearch: true });
        }
        vm.PurchaseOrderAdvanceFilter.Amount.tooltip = vm.amount;

        // PO Working Status
        if (vm.isInProgress && vm.isCompleted && vm.isCanceled) {
          vm.pagingInfo.filterStatus = null;
          vm.PurchaseOrderAdvanceFilter.POStatus.tooltip = 'All';
        } else if (!vm.isInProgress && !vm.isCompleted && !vm.isCanceled) {
          vm.PurchaseOrderAdvanceFilter.POStatus.tooltip = vm.pagingInfo.filterStatus = null;
        } else {
          const strFilter = [];
          const POWorkingStatusFilterTooltip = [];
          if (vm.isInProgress) {
            strFilter.push(vm.POWorkingStatus.InProgress.id);
            POWorkingStatusFilterTooltip.push(vm.POWorkingStatus.InProgress.value);
          }
          if (vm.isCompleted) {
            strFilter.push(vm.POWorkingStatus.Completed.id);
            POWorkingStatusFilterTooltip.push(vm.POWorkingStatus.Completed.value);
          }
          if (vm.isCanceled) {
            strFilter.push(vm.POWorkingStatus.Canceled.id);
            POWorkingStatusFilterTooltip.push(vm.POWorkingStatus.Canceled.value);
          }
          vm.pagingInfo.filterStatus = `'${strFilter.join('\',\'')}'`;
          vm.PurchaseOrderAdvanceFilter.POStatus.tooltip = `${POWorkingStatusFilterTooltip.join('<br />')}`;
        }

        // Lock Status
        if (vm.isNotApplicable && vm.isReadyToLock && vm.isLocked) {
          vm.pagingInfo.lockFilterStatus = null;
          vm.PurchaseOrderAdvanceFilter.POLockStatus.tooltip = 'All';
        } else if (!vm.isNotApplicable && !vm.isReadyToLock && !vm.isLocked) {
          vm.PurchaseOrderAdvanceFilter.POLockStatus.tooltip = vm.pagingInfo.lockFilterStatus = null;
        } else {
          const LockStatusFilterTooltip = [];
          const strLockFilter = [];
          if (vm.isNotApplicable) {
            strLockFilter.push(vm.PurchaseOrderLockStatus.NA.id);
            LockStatusFilterTooltip.push(vm.PurchaseOrderLockStatus.NA.value);
          }
          if (vm.isReadyToLock) {
            strLockFilter.push(vm.PurchaseOrderLockStatus.ReadyToLock.id);
            LockStatusFilterTooltip.push(vm.PurchaseOrderLockStatus.ReadyToLock.value);
          }
          if (vm.isLocked) {
            strLockFilter.push(vm.PurchaseOrderLockStatus.Locked.id);
            LockStatusFilterTooltip.push(vm.PurchaseOrderLockStatus.Locked.value);
          }
          vm.pagingInfo.lockFilterStatus = `'${strLockFilter.join('\',\'')}'`;
          vm.PurchaseOrderAdvanceFilter.POLockStatus.tooltip = `${LockStatusFilterTooltip.join('<br />')}`;
        }

        // PO Posting Status
        if (vm.isDraft && vm.isPublish) {
          vm.pagingInfo.poPostingStatusFilter = null;
          vm.PurchaseOrderAdvanceFilter.POPostingStatus.tooltip = 'All';
        } else if (!vm.isDraft && !vm.isPublish) {
          vm.PurchaseOrderAdvanceFilter.POPostingStatus.tooltip = vm.pagingInfo.poPostingStatusFilter = null;
        } else {
          if (vm.isDraft) {
            vm.pagingInfo.poPostingStatusFilter = vm.POPostingStatus.Draft.id;
            vm.PurchaseOrderAdvanceFilter.POPostingStatus.tooltip = vm.POPostingStatus.Draft.value;
          } else if (vm.isPublish) {
            vm.pagingInfo.poPostingStatusFilter = vm.POPostingStatus.Publish.id;
            vm.PurchaseOrderAdvanceFilter.POPostingStatus.tooltip = vm.POPostingStatus.Publish.value;
          }
        }

        if (vm.fromDate && vm.toDate) {
          vm.PurchaseOrderAdvanceFilter.PODate.tooltip = 'From: ' + $filter('date')(new Date(vm.fromDate), vm.DefaultDateFormat) + ' To: ' + $filter('date')(new Date(vm.toDate), vm.DefaultDateFormat);
          vm.pagingInfo.pfromDate = BaseService.getAPIFormatedDate(vm.fromDate);
          vm.pagingInfo.ptoDate = BaseService.getAPIFormatedDate(vm.toDate);
        }
        else if (vm.fromDate) {
          vm.PurchaseOrderAdvanceFilter.PODate.tooltip = $filter('date')(new Date(vm.fromDate), vm.DefaultDateFormat);
          vm.pagingInfo.pfromDate = BaseService.getAPIFormatedDate(vm.fromDate);
          vm.pagingInfo.ptoDate = null;
        } else {
          vm.pagingInfo.pfromDate = vm.pagingInfo.ptoDate = null;
        }

        if (vm.gridOptions && vm.gridOptions.gridApi) {
          vm.isUiGridColumnFiltersApplied = _.some(vm.gridOptions.gridApi.grid.columns, (col) => !_.isEmpty(col.filters[0].term));
        }
        vm.generateFilter = _.find(vm.PurchaseOrderAdvanceFilter, (num) => num.isDeleted === false) ? true : false;
      };
      //clear suppliler filter
      vm.clearSupplierFilter = () => {
        vm.supplier = [];
      };
      //clear shipping filter
      vm.clearShippingFilter = () => {
        vm.shippingMethods = [];
      };
      //clear supplier search text
      vm.clearSupplierSearchText = () => {
        vm.SupplierSearchText = null;
        vm.searchSupplierList();
      };
      //get max length validations
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      //clear shipping search text
      vm.clearShippingSearchText = () => {
        vm.ShippingSearchText = null;
        vm.searchShippingList();
      };
      //clear filter
      vm.clearFilters = (isReset) => {
        vm.resetDateFilter();
        vm.clearSupplierFilter();
        vm.clearShippingFilter();
        if (!vm.partIDFilter) {
          vm.partIds = [];
        }
        vm.clearShippingSearchText();
        vm.clearSupplierSearchText();
        vm.fromDate = vm.toDate = vm.amount = vm.poComments = vm.posoNumber = null;
        vm.generateFilter = vm.isCompleted = vm.isCanceled = vm.isLocked = vm.isDraft = vm.isPublish = false;
        vm.isNotApplicable = vm.isReadyToLock = vm.isInProgress = isReset ? true : false;
        if (vm.gridOptions.gridApi) {
          vm.gridOptions.gridApi.core.clearAllFilters();
        }
        vm.loadData();
      };

      vm.applyFiltersOnEnter = (event) => {
        if (event.keyCode === 13) {
          vm.applyFilters();
        }
      };

      vm.applyFilters = () => {
        if (vm.filtersInfo && !vm.filtersInfo.$valid && BaseService.focusRequiredField(vm.filtersInfo)) {
          return;
        }
        vm.loadData();
      };

      //go to supplier list
      vm.goToSupplierList = () => BaseService.goToSupplierList();
      //go to shipping method
      vm.goToShippingList = () => BaseService.goToGenericCategoryShippingTypeList();

      //remove filter
      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.PurchaseOrderAdvanceFilter.Supplier.value:
              vm.supplier = [];
              break;
            case vm.PurchaseOrderAdvanceFilter.ShippingMethod.value:
              vm.shippingMethods = [];
              break;
            case vm.PurchaseOrderAdvanceFilter.Parts.value:
              vm.partIds = [];
              break;
            case vm.PurchaseOrderAdvanceFilter.POSO.value:
              vm.posoNumber = null;
              break;
            case vm.PurchaseOrderAdvanceFilter.Amount.value:
              vm.amount = null;
              break;
            case vm.PurchaseOrderAdvanceFilter.POStatus.value:
              vm.isInProgress = vm.isCompleted = vm.isCanceled = false;
              break;
            case vm.PurchaseOrderAdvanceFilter.PODate.value:
              vm.fromDate = vm.toDate = null;
              vm.resetDateFilter();
              break;
            case vm.PurchaseOrderAdvanceFilter.POLockStatus.value:
              vm.isNotApplicable = vm.isReadyToLock = vm.isLocked = false;
              break;
            case vm.PurchaseOrderAdvanceFilter.POPostingStatus.value:
              vm.isDraft = vm.isPublish = false;
              break;
            case vm.PurchaseOrderAdvanceFilter.POComments.value:
              vm.poComments = null;
              break;
          }
          vm.loadData();
        }
      };

      vm.removePOCommentFilter = () => {
        vm.poComments = null;
        vm.loadData();
      };

      vm.removePOSOFilter = () => {
        vm.posoNumber = null;
        vm.loadData();
      };

      //get footer details
      vm.getFooterTotal = () => {
        let sum = (_.sumBy(vm.sourceData, (data) => data.totalAmount)) || 0;
        sum = $filter('currency')(sum);
        return sum;
      };
      //open log for purchase order
      vm.openPurchaseOrderChangesHistory = (row, ev) => {
        row.entity.isDisabledHistoryIcon = true;
        const data = {
          purchaseOrderID: row.entity.id,
          poNumber: row.entity.poNumber,
          poRevision: row.entity.poRevision,
          supplier: row.entity.supplierName,
          supplierID: row.entity.supplierID
        };
        DialogFactory.dialogService(
          CORE.PURCHASE_ORDER_CHANGE_HISTORY_CONTROLLER,
          CORE.PURCHASE_ORDER_CHANGE_HISTORY_POPUP_VIEW,
          ev,
          data).then(() => row.entity.isDisabledHistoryIcon = false, () => row.entity.isDisabledHistoryIcon = false, (error) => BaseService.getErrorLog(error));
      };
      // get price footer detail
      vm.getFooterText = () => 'Total:';
      // go to terms
      vm.goToTerms = (id) => {
        BaseService.goToGenericCategoryManageTerms(id);
      };
      // go to shipping method
      vm.goToShippingMethod = (id) => {
        BaseService.goToManageGenericCategoryShippingType(id);
      };
      // go to carrier page
      vm.goToCarrier = (id) => {
        BaseService.goToManageGenericCategoryCarrier(id);
      };
      //search shipping list
      vm.searchShippingList = () => {
        const shippingListToFilter = angular.copy(vm.ShippingTypeList);
        vm.shippingListToDisplay = vm.ShippingSearchText ? _.filter(shippingListToFilter, (item) => item.gencCategoryDisplayName.toLowerCase().contains(vm.ShippingSearchText.toLowerCase())) : shippingListToFilter;
      };

      vm.updatePurchaseOrderStatus = (formData) => PurchaseOrderFactory.updatePurchaseOrderStatus().query(formData).$promise.then((res) => {
        if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          initPageInfo();
          vm.loadData();
          return res.data;
        } else {
          return;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      //update status to complete
      vm.purchaseOrderStatusUpdate = (row, ev, isOpenPO) => {
        row.entity.isDisabledManualCompleteOpenPO = true;
        if (isOpenPO && row.entity.lockStatus === vm.PurchaseOrderLockStatus.Locked.id) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_OPEN_LOCKED_PO);
          return DialogFactory.messageAlertDialog({ messageContent }).then(() => row.entity.isDisabledManualCompleteOpenPO = false);
        }
        const objPoDetail = {
          poNumber: row.entity.poNumber,
          poID: row.entity.id,
          soNumber: row.entity.soNumber
        };

        DialogFactory.dialogService(
          CORE.COMMON_REASON_MODAL_CONTROLLER,
          CORE.COMMON_REASON_MODAL_VIEW,
          ev,
          objPoDetail).then(() => row.entity.isDisabledManualCompleteOpenPO = false,
            (result) => {
              if (result) {
                const rowDetail = {
                  id: row.entity.id,
                  poWorkingStatus: isOpenPO ? vm.POWorkingStatus.InProgress.id : vm.POWorkingStatus.Completed.id,
                  poCompleteReason: result,
                  poCompleteType: CORE.POCompleteType.MANUAL,
                  type: isOpenPO ? 'P' : 'C'
                };
                vm.updatePurchaseOrderStatus(rowDetail).then(() => row.entity.isDisabledManualCompleteOpenPO = false);
              } else {
                row.entity.isDisabledManualCompleteOpenPO = false;
              }
            });
      };

      const openCancellationReasonPopup = (data, $event) => {
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_CANCLE_REASON_CONTROLLER,
          TRANSACTION.TRANSACTION_CANCLE_REASON_VIEW,
          $event,
          data).then((response) => {
            if (response) {
              const formField = {
                id: response.poID,
                cancleReason: response.cancleReason,
                poCompleteType: CORE.POCompleteType.MANUAL,
                type: response.type,
                CancellationConfirmed: response.CancellationConfirmed
              };
              vm.updatePurchaseOrderStatus(formField);
            }
          }, () => { }, (error) => BaseService.getErrorLog(error));
      };

      //print purchase order report
      vm.printRecord = (row, isdownload) => {
        if (isdownload) {
          row.entity.isDownloadDisabled = true;
        } else {
          row.entity.isPrintDisable = true;
        }
        if (vm.termsAndCondition) {
          vm.printReport(row, isdownload);
        } else {
          // Get Term and Condition from Data key
          MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: CONFIGURATION.SETTING.TermsAndCondition }).$promise.then((dataKeyResponse) => {
            if (dataKeyResponse && dataKeyResponse.data && dataKeyResponse.data.length > 0) {
              vm.termsAndCondition = dataKeyResponse.data[0].values;
              vm.printReport(row, isdownload);
            } else {
              if (isdownload) {
                row.entity.isDownloadDisabled = false;
              } else {
                row.entity.isPrintDisable = false;
              }
            }
          }).catch((error) => {
            if (isdownload) {
              row.entity.isDownloadDisabled = false;
            } else {
              row.entity.isPrintDisable = false;
            }
            BaseService.getErrorLog(error);
          });
        }
      };

      vm.printReport = (row, isdownload) => {
        PurchaseOrderFactory.getPurchaseOrderReport({
          id: row.entity.id,
          termsAndCondition: vm.termsAndCondition,
          POData: {
            poNumber: row.entity.poNumber,
            poRevision: row.entity.poRevision,
            mfgcode: row.entity.mfgcode,
            statusName: row.entity.status === CORE.DisplayStatus.Draft.ID ? `-${row.entity.statusName.toUpperCase()}` : ''
          }
        }).then((response) => {
          const POData = response.config.data.POData;
          if (isdownload) {
            row.entity.isDownloadDisabled = false;
          } else {
            row.entity.isPrintDisable = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.PURCHASE_ORDER, POData.poNumber, POData.poRevision, POData.mfgcode, POData.statusName), isdownload, true);
        }).catch((error) => {
          if (isdownload) {
            row.entity.isDownloadDisabled = false;
          } else {
            row.entity.isPrintDisable = false;
          }
          BaseService.getErrorLog(error);
        });
      };

      // copy purchase order
      vm.createDuplicatePO = (row, event) => {
        row.isDisabledDuplicatePOIcon = true;
        vm.cgBusyLoading = PurchaseOrderFactory.checkPartStatusOfPurchaseOrder().query({ id: row.id }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (res.data) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_CONTAINST_INACTIVE_PART);
              messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(row.id, row.poNumber));
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.openDuplicatePOpopup(row, event, true);
                }
              }, () => row.isDisabledDuplicatePOIcon = false).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.openDuplicatePOpopup(row, event);
            }
          } else {
            row.isDisabledDuplicatePOIcon = false;
          }
        }).catch((error) => {
          row.isDisabledDuplicatePOIcon = false;
          BaseService.getErrorLog(error);
        });
      };

      vm.openDuplicatePOpopup = (row, event, IsUserAwareOfPartStatus) => {
        const data = {
          purchaseID: row.id,
          status: row.statusName,
          IsUserAwareOfPartStatus: IsUserAwareOfPartStatus,
          poNumber: row.poNumber
        };
        DialogFactory.dialogService(
          TRANSACTION.DUPLICATE_PO_POPUP_CONTROLLER,
          TRANSACTION.DUPLICATE_PO_POPUP_VIEW,
          event,
          data).then(() => row.isDisabledDuplicatePOIcon = false,
            (res) => {
              row.isDisabledDuplicatePOIcon = false;
              if (res) {
                BaseService.goToPurchaseOrderDetail(res.id);
                vm.loadData();
              }
            }, (err) => BaseService.getErrorLog(err));
      };

      // download print
      vm.onDownload = (row) => vm.printRecord(row, true);

      vm.isCancleReason = (row, $event) => {
        row.entity.isDisabledCancledUndoPOIcon = true;
        if (!row.entity.status) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHANGE_PO_PUBLISHED_FOR_CANCEL_PO);
          messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(row.entity.id, row.entity.poNumber));
          const model = {
            messageContent: messageContent,
            multiple: false
          };
          return DialogFactory.messageAlertDialog(model).then(() => row.entity.isDisabledCancledUndoPOIcon = false).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.getPurchaseOrderMstDetailByID(row.entity.id).then((response) => {
            if (response) {
              if (row.entity.poWorkingStatus === vm.POWorkingStatus.InProgress.id) {
                //for cancellation process
                if (response.poWorkingStatus === vm.POWorkingStatus.Canceled.id) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_IS_ALREADY_CANCELED);
                  messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(row.entity.id, row.entity.poNumber), 'Press Refresh to see current PO status. ');
                  const model = {
                    messageContent: messageContent,
                    multiple: false
                  };
                  return DialogFactory.messageAlertDialog(model).then(() => row.entity.isDisabledCancledUndoPOIcon = false).catch((error) => BaseService.getErrorLog(error));
                } else {
                  const data = {
                    poID: row.entity.id,
                    isPurchaseOrder: true,
                    poNumber: row.entity.poNumber,
                    type: 'C' //for cancellation po
                  };
                  openCancellationReasonPopup(data, $event);
                  row.entity.isDisabledCancledUndoPOIcon = false;
                }
              }
              if (row.entity.poWorkingStatus === vm.POWorkingStatus.Canceled.id) {
                //for Undo process
                if (response.poWorkingStatus === vm.POWorkingStatus.InProgress.id) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_ALREADY_REVERTED);
                  messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(row.entity.id, row.entity.poNumber), 'Press Refresh to see current PO status.');
                  const model = {
                    messageContent: messageContent,
                    multiple: false
                  };
                  return DialogFactory.messageAlertDialog(model).then(() => row.entity.isDisabledCancledUndoPOIcon = false).catch((error) => BaseService.getErrorLog(error));
                } else {
                  if (!row.entity.CancellationConfirmed) {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UNDO_CANCELLATION_CONFIRMATION);
                    messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(row.entity.id, row.entity.poNumber), '');
                    const obj = {
                      messageContent: messageContent,
                      btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                      canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                    };
                    DialogFactory.messageConfirmDialog(obj).then((yes) => {
                      row.entity.isDisabledCancledUndoPOIcon = false;
                      if (yes) {
                        const data = {
                          poID: row.entity.id,
                          title: vm.LabelConstant.PURCHASE_ORDER.POUndoReason,
                          isPurchaseOrder: true,
                          poNumber: row.entity.poNumber,
                          type: 'R' //for Undo cancellation po
                        };
                        openCancellationReasonPopup(data, $event);
                      }
                    }, () => row.entity.isDisabledCancledUndoPOIcon = false).catch((error) => BaseService.getErrorLog(error));
                  } else {
                    const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UNCHECK_CANCELLATION_CONFIRMED_BY_SUPPLIER);
                    const model = {
                      messageContent: messageContent,
                      multiple: false
                    };
                    return DialogFactory.messageAlertDialog(model).then(() => row.entity.isDisabledCancledUndoPOIcon = false).catch((error) => BaseService.getErrorLog(error));
                  }
                }
              }
            } else {
              row.entity.isDisabledCancledUndoPOIcon = false;
            }
          });
        }
      };

      //Clear grid Column Filter
      vm.clearGridColumnFilter = (item) => {
        if (item) {
          item.filters[0].term = undefined;
          if (!item.isFilterDeregistered) {
            //refresh data grid
            vm.gridOptions.gridApi.grid.onClearUnregisteredColumnFilter();
          }
        }
      };

      vm.goToPurchaseOrderDetailPerLineList = (poNumber, type) => BaseService.goToPurchaseOrderDetailPerLineList({ poNumber, type });

      vm.goToPackingSlip = (id) => {
        if (id) {
          BaseService.goToManagePackingSlipDetail(id);
        }
      };

      vm.lockUnlockCustomerPayment = (item) => {
        item.isDisabledLockUnlockBtn = true;
        vm.lockUnlockPurchaseOrder(item, item.lockStatus !== vm.PurchaseOrderLockStatus.Locked.id ? false : true);
      };

      vm.lockUnlockPurchaseOrder = (item, isLockRecord) => {
        var selectedIds = [];
        if (!vm.isAllowToLock || vm.isReadOnly) {
          if (item) {
            item.isDisabledLockUnlockBtn = false;
          }
          return;
        }
        vm.isDisabledLockBtn = !item && !isLockRecord;
        vm.isDisabledUnlockBtn = !item && isLockRecord;
        if (isLockRecord) {
          //going for unlock
          if (item) {
            if (item.lockStatus !== vm.PurchaseOrderLockStatus.Locked.id) {
              item.isDisabledLockUnlockBtn = false;
              return DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_UNLOCKED
              });
            }
            selectedIds.push(item.id);
          } else {
            if (!(vm.selectedRowsList && vm.selectedRowsList.length > 0)) {
              vm.isDisabledUnlockBtn = false;
              return;
            }
            const inValidRecords = _.find(vm.selectedRowsList, (a) => a.lockStatus !== vm.PurchaseOrderLockStatus.Locked.id);
            if (inValidRecords) {
              vm.isDisabledUnlockBtn = false;
              return DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_UNLOCKED
              });
            }
            selectedIds = vm.selectedRowsList.map((item) => item.id);
          }
        } else {
          //going for lock
          if (item) {
            if (item.lockStatus !== vm.PurchaseOrderLockStatus.ReadyToLock.id) {
              item.isDisabledLockUnlockBtn = false;
              return DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
              });
            }
            selectedIds.push(item.id);
          } else {
            if (!(vm.selectedRowsList && vm.selectedRowsList.length > 0)) {
              vm.isDisabledLockBtn = false;
              return;
            }
            const inValidRecords = _.find(vm.selectedRowsList, (a) => a.lockStatus !== vm.PurchaseOrderLockStatus.ReadyToLock.id);
            if (inValidRecords) {
              vm.isDisabledLockBtn = false;
              return DialogFactory.messageAlertDialog({
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED
              });
            }
            selectedIds = vm.selectedRowsList.map((item) => item.id);
          }
        }
        /*if no record selected then return*/
        if (!selectedIds || selectedIds.length === 0) {
          if (item) {
            item.isDisabledLockUnlockBtn = false;
          } else {
            vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
          }
          return;
        }
        const obj = {
          messageContent: isLockRecord ? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNLOCK_RECORD_CONFIRMATION : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LOCK_RECORD_CONFIRMATION,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.cgBusyLoading = PurchaseOrderFactory.lockUnlockTransaction().query({ ids: selectedIds, isLockRecord }).$promise.then((response) => {
            if (item) {
              item.isDisabledLockUnlockBtn = false;
            } else {
              vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
            }
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.loadData();
            }
          }).catch((error) => {
            if (item) {
              item.isDisabledLockUnlockBtn = false;
            } else {
              vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
            }
            BaseService.getErrorLog(error);
          });
        }, () => {
          if (item) {
            item.isDisabledLockUnlockBtn = false;
          } else {
            vm.isDisabledUnlockBtn = vm.isDisabledLockBtn = false;
          }
        });
      };

      // get purchase order details
      vm.getPurchaseOrderMstDetailByID = (id) => PurchaseOrderFactory.getPurchaseOrderMstDetailByID().query({ id: id }).$promise.then((res) => {
        if (res && res.data && res.data[0]) {
          return res.data[0];
        }
      }).catch((error) => BaseService.getErrorLog(error));


      // Redirect to purchase order page by id
      const redirectToPOAnchorTag = (poid, poNumber) => {
        const redirectToPOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_ROUTE.replace(':id', poid);
        return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPOUrl, poNumber);
      };

      angular.element(() => $scope.isNoDataFound = vm.isNoDataFound);
    }
  }
})();
