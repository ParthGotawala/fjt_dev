(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('purchaseOrderPartDetailGrid', purchaseOrderPartDetailGrid);
  /** @ngInject */
  function purchaseOrderPartDetailGrid(BaseService, CORE, USER, $q, EmployeeFactory, $timeout, TRANSACTION, PurchaseOrderFactory, DialogFactory, $state, uiGridGroupingConstants, ManufacturerFactory, GenericCategoryFactory, $filter, MasterFactory, CONFIGURATION, $stateParams) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        isNoDataFound: '=',
        partIdFilter: '='
      },
      templateUrl: 'app/directives/custom/purchase-order-grid/purchase-order-part-detail-grid.html',
      controller: purchaseOrderPartDetailGridCtrl,
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

    function purchaseOrderPartDetailGridCtrl($scope) {
      const vm = this;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.posoNumber = $stateParams.poNumber;
      vm.status = $stateParams.status;
      switch (vm.status) {
        case CORE.PO_REDIRECTION_TYPE.withoutOtherPart:
          vm.isOpen = vm.isInProgress = false;
          vm.withoutOtherPart = true;
          break;
        case CORE.PO_REDIRECTION_TYPE.OtherPart:
          vm.isOpen = vm.isInProgress = false;
          vm.onlyOtherPart = true;
          break;
        case CORE.PO_REDIRECTION_TYPE.completedLines:
          vm.isClose = vm.isCompleted = true;
          break;
        case CORE.PO_REDIRECTION_TYPE.pendingLines:
          vm.isOpen = true;
          vm.isInProgress = false;
          vm.isonlyPendingLines = true;
          break;
        default:
          vm.isOpen = vm.isInProgress = true;
          break;
      }
      vm.isHideDelete = vm.purchaseOrderChangeHistory = vm.isPrinted = vm.ispoPartRequirement = vm.isDownload = vm.isPurchaseOrderStatus = vm.isCreateDuplicatePO = vm.isUpdatable = vm.isOpenPO = true;
      vm.isOpenLineCompleteReasonPopup = vm.isOpenInternalNotesPopup = vm.isOpenPOCommentsPopup = vm.isOpenDescriptionPopup = vm.isOpenLineNotesPopup = vm.isOpenLineCommentPopup = false;
      vm.ispoPartRequirementIconName = `View Purchase Order Material Purchase ${vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement} Detail`;
      vm.CORE_MESSAGE_CONSTANT = angular.copy(CORE.MESSAGE_CONSTANT);
      vm.completePOactionButtonName = 'Complete PO Line';
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.purchaseOrderStatus = CORE.SalesOrderStatusGridHeaderDropdown;
      vm.purchaseOrderLineStatus = CORE.PurchaseOrderLineStatusGridHeaderDropdown;
      vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PURCHASE_ORDER_PART_LINE_EMPTY;
      vm.setScrollClass = 'gridScrollHeight_Purchase_Order_Line_Page';
      vm.setScrollFilterClass = 'gridScrollHeight_Purchase_Order_Line_Page_Filter';
      vm.EmptyMesssages = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.PurchaseOrderAdvanceFilter = angular.copy(CORE.PurchaseOrderAdvancedFilters);
      vm.loginUser = BaseService.loginUser;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      const CategoryTypeObjList = angular.copy(CORE.CategoryType);
      vm.CheckSearchTypeList = TRANSACTION.CheckSearchType;
      vm.checkSerachPOType = vm.posoNumber ? vm.CheckSearchTypeList[0].id : vm.CheckSearchTypeList[1].id;
      vm.checkSerachAmountType = vm.CheckSearchTypeList[1].id;
      vm.PO_Line_WorkingStatus = CORE.PO_Line_WorkingStatus;
      vm.PO_Working_Status = CORE.PO_Working_Status;
      vm.poCompleteType = CORE.POCompleteStatusTypeDropDown;
      vm.supplier = [];
      vm.shippingMethods = [];
      vm.partIds = [];
      let reTryCount = 0;
      vm.PurchaseOrderLockStatus = TRANSACTION.PurchaseOrderLockStatus;
      vm.openPOiconButtonName = 'Open PO Line';
      const UIGrid = CORE.UIGrid;
      vm.partIDFilter = $scope.partIdFilter || null;
      vm.termsAndCondition = null;

      const getAllRights = () => {
        vm.allowCompletePurchaseOrder = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToCompletePurchaseOrderManually);
        vm.AllowToOpenPurchaseOrderManually = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToOpenPurchaseOrderManually);
        if ((vm.allowCompletePurchaseOrder === null || vm.allowCompletePurchaseOrder === undefined || vm.AllowToOpenPurchaseOrderManually === null || vm.AllowToOpenPurchaseOrderManually === undefined)
          && reTryCount < _configGetFeaturesRetryCount) {
          getAllRights(); //put for hard reload option as it will not get data from feature rights
          reTryCount++;
          // console.log(reTryCount);
        }
      };
      getAllRights();
      const isEnablePagination = vm.loginUser.uiGridPreference === UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

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
      //give common search
      const returnCommonSearch = (criteria) => {
        if (criteria) {
          const replacedString = criteria.replace('\\', '\\\\');
          criteria = replacedString.replace(/\"/g, '\\"').replace(/\'/g, '\\\'').replace('[', '\\\\[').replace(']', '\\\\]');
          return criteria.length > 255 ? criteria.substring(0, 255) : criteria;
        }
      };
      if (vm.partIDFilter) {
        vm.querycomponentSearch();
      } else {
        vm.isShowGrid = true;
      }

      //if (vm.loginUser) {
      //  vm.setDefault = vm.loginUser.employee.defaultPurchaseDetailTabID === TRANSACTION.PO_DETAIL_TAB.PART_DETAIL ? true : false;
      //}
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
        GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
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
      vm.cgBusyLoading = $q.all(autocompletePOPromise).then(() => {

      }).catch((error) => BaseService.getErrorLog(error));
      vm.getSupplierList();
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
          field: 'poLineCompletionPercentage',
          width: '125',
          minWidth: '100',
          displayName: 'PO Line Completion Status',
          cellTemplate: '<div>'
            + '<md-button class="md-raised md-mini float-right md-mini grid-button md-icon-button bdrbtn kit-status text-left" ng-click="grid.appScope.$parent.vm.goToPackingSlip(row.entity.packingSlipId)">'
            + '<div class="cm-quote-progress" style="width:{{((row.entity.poLineCompletionPercentage || 0) | number : 2) +\'%\'}}"></div>'
            + '<span class="relative" style="margin-left:5px !important;"><span ng-class="{\'cursor-pointer\': row.entity.poLineCompletionPercentage > 0 , \'underline\':row.entity.poLineCompletionPercentage > 0}"> '
            + '{{(row.entity.poLineCompletionPercentage || 0)}}%</span></span>'
            + '</md-button>'
            + '</div>',
          enableFiltering: true,
          allowCellFocus: false
        },
        {
          field: 'poLineWorkingDisplayStatus',
          displayName: 'PO Line Working Status',
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(row.entity.poLineWorkingStatus==grid.appScope.$parent.vm.PO_Line_WorkingStatus.Open.id),\
                        \'label-box label-success\':(row.entity.poLineWorkingStatus==grid.appScope.$parent.vm.PO_Line_WorkingStatus.Close.id)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          enableFiltering: false,
          ColumnDataType: 'StringEquals',
          enableSorting: false
        },
        {
          field: 'poWorkingStatusDisplayStatus',
          displayName: vm.LabelConstant.PURCHASE_ORDER.POWorkingStatus,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(row.entity.poWorkingStatusDisplayStatus===grid.appScope.$parent.vm.PO_Working_Status.InProgress.value),\
                        \'label-box label-success\':(row.entity.poWorkingStatusDisplayStatus===grid.appScope.$parent.vm.PO_Working_Status.Completed.value),\
                        \'label-box label-danger\':(row.entity.poWorkingStatusDisplayStatus===grid.appScope.$parent.vm.PO_Working_Status.Canceled.value)}"> \
                            {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          width: '120',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'poCompleteType',
          displayName: 'PO Line Completion Type',
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
          field: 'poLineCompleteReason',
          displayName: vm.LabelConstant.PURCHASE_ORDER.POCompleteLineReason,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.poLineCompleteReason || grid.appScope.$parent.vm.isOpenLineCompleteReasonPopup" ng-click="grid.appScope.$parent.vm.showPOCompletePopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '120',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'isLineCustConsignedValue',
          displayName: vm.LabelConstant.PURCHASE_ORDER.CustomerConsigned,
          cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
            + '<span  ng-class="{\'label-box label-warning\':(!row.entity.isLineCustConsigned),\
                        \'label-box label-success\':(row.entity.isLineCustConsigned)}"> \
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
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.lineCustomerID && row.entity.customerName"> <span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToCustomer(row.entity.lineCustomerID);$event.preventDefault();">{{COL_FIELD}}</a>\
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
          field: 'poDate',
          displayName: vm.LabelConstant.PURCHASE_ORDER.PODate,
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
                        <span ng-repeat="packingSlip in COL_FIELD"> \
                          <a tabindex="-1" ng-click="grid.appScope.$parent.vm.goToPackingSlip(packingSlip.id);$event.preventDefault();"> \
                            <span class="cm-text-decoration cursor-pointer">{{packingSlip.psNumber}}</span><span ng-if="!$last">, </span>\
                          </a>\
                        </span>\
                      </div> ',
          enableFiltering: true,
          enableSorting: false
        },
        {
          field: 'packingSlipDate',
          displayName: vm.LabelConstant.PURCHASE_ORDER.LastMaterialReceiptDate,
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-if="row.entity.packingSlipId">\
                        <span> \
                          <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPackingSlip(row.entity.packingSlipId);$event.preventDefault();"> \
                            {{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}\
                          </a>\
                        </span>\
                      </div> ',
          type: 'date'
        },
        {
          field: 'poNumber',
          displayName: vm.LabelConstant.PURCHASE_ORDER.PO,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                    <span> <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-click="grid.appScope.$parent.vm.goToPurchaseOrderDetail(row.entity.refPurchaseOrderID);$event.preventDefault();">{{ row.entity.poNumber }}</a>\
                                        <md-tooltip>{{row.entity.poNumber}}</md-tooltip>\
                                    </span>\
                                    <copy-text label="\'PO#\'" text="row.entity.poNumber" ng-if="row.entity.poNumber"></copy-text>\
                                    <md-icon md-font-icon="" class="material-icons mat-icon icon-lock" ng-if="row.entity.lockStatus === grid.appScope.$parent.vm.PurchaseOrderLockStatus.Locked.id" style="margin-left:5px !important;"></md-icon>\
                                </div> ',
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
          field: 'soDate',
          displayName: 'SO Date',
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
          field: 'supplierName',
          displayName: 'Supplier',
          cellTemplate: '<div class="ui-grid-cell-contents"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToSupplier(row.entity.supplierID);$event.preventDefault();">{{row.entity.supplierName}}</a>\
                                        <md-tooltip>{{row.entity.supplierName}}</md-tooltip>\
                                    </span>\
<copy-text label="\'Supplier\'" text="row.entity.supplierName"></copy-text></div>',
          width: '200',
          allowCellFocus: false,
          ColumnDataType: 'StringEquals',
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'supplierQuoteNumber',
          displayName: 'Supplier Quote#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: 150,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '180'
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
          field: 'shippingComment',
          displayName: vm.LabelConstant.PURCHASE_ORDER.ShippingComment,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.shippingComment || grid.appScope.$parent.vm.isOpenInternalNotesPopup" ng-click="grid.appScope.$parent.vm.showInternalCommentPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          enableFiltering: false,
          width: '130',
          enableSorting: false
        },
        {
          field: 'poComment',
          displayName: vm.LabelConstant.PURCHASE_ORDER.POComments,
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.poComment || grid.appScope.$parent.vm.isOpenPOCommentsPopup" ng-click="grid.appScope.$parent.vm.showPOCommentPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          enableFiltering: false,
          width: '130',
          enableSorting: false
        },
        {
          field: 'lineID',
          displayName: 'PO Line ID',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false,
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'internalRef',
          displayName: 'Internal Ref#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '120',
          allowCellFocus: false,
          ColumnDataType: 'StringEquals',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'pidCode',
          displayName: vm.LabelConstant.MFG.PID,
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents">\
                                    <common-pid-code-label-link  ng-if="row.entity.pidCode" component-id="row.entity.mfgPartID"\
                                                                label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                                                value="COL_FIELD"\
                                                                is-custom-part="row.entity.iscustom" \
                                                                cust-part-number="row.entity.custAssyPN"\
                                                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                                is-copy="row.entity.mfgPartID ? true : false" \
                                                                is-search-digi-key="false" \
                                                                is-search-findchip="false" \
                                                                rohs-status="row.entity.rohsName"> \
                                    </common-pid-code-label-link> \
                                </div > ',
          width: CORE.UI_GRID_COLUMN_WIDTH.PID,
          maxWidth: '350',
          cellTooltip: true
        },
        {
          field: 'mfgcodeName',
          displayName: vm.LabelConstant.MFG.MFG,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"><span><a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturer(row.entity.mfgcodeID);$event.preventDefault();">{{row.entity.mfgcodeName}}</a>\
                                        </span>\
<copy-text label="\'MFR\'" text="row.entity.mfgcodeName" ng-if="row.entity.mfgcodeName"></copy-text></div>',
          width: '300',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '750'
        },
        {
          field: 'mfgPN',
          displayName: vm.LabelConstant.MFG.MFGPN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden; padding:0px !important">\
                                            <common-pid-code-label-link  ng-if="row.entity.pidCode" component-id="row.entity.mfgPartID"\
                                                            label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                                            value="COL_FIELD"\
                                                            is-custom-part="row.entity.iscustom" \
                                                            cust-part-number="row.entity.custAssyPN"\
                                                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                            is-copy="row.entity.mfgPartID ? true : false"\
                                                            rohs-status="row.entity.rohsName"\
                                                            supplier-name="(row.entity.iscustom) ? null : (row.entity.POSupplierName ? row.entity.POSupplierName : null)" \
                                                            is-search-findchip="true"></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'partDescription',
          displayName: 'Description',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.partDescription || grid.appScope.$parent.vm.isOpenDescriptionPopup" ng-click="grid.appScope.$parent.vm.showPartDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '120',
          enableCellEdit: false,
          enableFiltering: false,
          enableSorting: false,
          maxWidth: '300',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getPriceFooterTotal()}}</div>'
        },
        {
          field: 'qty',
          displayName: 'PO Qty',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          type: 'number',
          validators: { required: true },
          maxWidth: '150',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterQtyTotal() | numberWithoutDecimal}}</div>'
        },
        {
          field: 'totalReceivedQty',
          displayName: vm.LabelConstant.PURCHASE_ORDER.ReceivedQty,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">\
                                    <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-if="row.entity.totalReceivedQty > 0" ng-click="grid.appScope.$parent.vm.showPackingSlipSummaryDetails(row.entity);$event.preventDefault();">{{ COL_FIELD | numberWithoutDecimal}}</a>\
                                    <span ng-if="row.entity.totalReceivedQty <= 0">{{ COL_FIELD | numberWithoutDecimal}}</span> \
                                </div>',
          width: '125',
          type: 'number',
          maxWidth: '150',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterReceivedQtyTotal() | numberWithoutDecimal}}</div>'
        },
        {
          field: 'totalPendingQty',
          displayName: vm.LabelConstant.PURCHASE_ORDER.OpenQty,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
          width: '120',
          type: 'number',
          validators: { required: true },
          maxWidth: '150',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterPendingQtyTotal() | numberWithoutDecimal}}</div>'
        },
        {
          field: 'uomName',
          displayName: 'UOM',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: '100',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '100'
        },
        {
          field: 'price',
          displayName: 'Price ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>',
          width: '120',
          maxWidth: '150'
        },
        {
          field: 'extPrice',
          displayName: 'Ext. Price ($)',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD | numberWithoutDecimal}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotal()}}</div>',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          width: '150',
          maxWidth: '175'
        },
        {
          field: 'otherExpense',
          displayName: 'Total Other Charges Price ($)',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{(COL_FIELD || 0) | amount }}</div>',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          width: '120',
          maxWidth: '175'
        },
        {
          field: 'totalExtPrice',
          displayName: 'Total Ext. Price ($)',
          treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD | numberWithoutDecimal}}</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotal(true)}}</div>',
          enableCellEdit: false,
          enableFiltering: false,
          enableSorting: true,
          width: '150',
          maxWidth: '175'
        },
        {
          field: 'packagingName',
          displayName: 'Packaging',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
          width: '120',
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '200'
        },
        {
          field: 'totalRelease',
          displayName: 'Total Releases',
          type: 'number',
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"> <span ng-if="row.entity.id"> <a tabindex="-1"  class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToReleaseLine(row.entity,$event);$event.preventDefault();">{{(COL_FIELD || 1) | numberWithoutDecimal}}</a> </span>\
                                         <span ng-if="!row.entity.id">0</span></div>',
          width: '80',
          enableFiltering: false,
          enableSorting: false,
          validators: { required: true },
          maxWidth: '160'
        },
        {
          field: 'shipDate',
          displayName: 'Due Date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToReleaseLine(row.entity,$event);$event.preventDefault();">{{row.entity.shipDate}}</a>\
                                        </div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'promisedShipDate',
          displayName: vm.LabelConstant.PURCHASE_ORDER.SupplierPromisedDeliveryDate,
          cellTemplate: '<div class="ui-grid-cell-contents text-left"> <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToReleaseLine(row.entity,$event);$event.preventDefault();">{{row.entity.promisedShipDate}}</a>\
                                        </div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
          enableFiltering: false,
          enableSorting: true
        },
        {
          field: 'internalLineComment',
          displayName: 'Line Internal Notes',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.internalLineComment || grid.appScope.$parent.vm.isOpenLineNotesPopup" ng-click="grid.appScope.$parent.vm.showInternalLineDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '90',
          maxWidth: '250',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'lineComment',
          displayName: 'Line Comments',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.lineComment || grid.appScope.$parent.vm.isOpenLineCommentPopup" ng-click="grid.appScope.$parent.vm.showLineDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
          width: '90',
          maxWidth: '250',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'supplierPN',
          displayName: vm.LabelConstant.MFG.SupplierPN,
          cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden; padding:0px !important">\
                                            <common-pid-code-label-link  ng-if="row.entity.supplierPartID" component-id="row.entity.supplierPartID"\
                                                            label="grid.appScope.$parent.vm.LabelConstant.MFG.SupplierPN"\
                                                            value="COL_FIELD"\
                                                            is-supplier="true"\
                                                            is-custom-part="row.entity.iscustom" \
                                                            cust-part-number="row.entity.custAssyPN"\
                                                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                            is-copy="row.entity.supplierPartID ? true : false"\
                                                            rohs-status="row.entity.rohsName"\
                                                            ></common-pid-code-label-link></div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
          enableCellEdit: false,
          enableFiltering: true,
          enableSorting: true,
          maxWidth: '300'
        },
        {
          field: 'updatedAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: UIGrid.VISIBLE_MODIFIED_AT
        }, {
          field: 'updatedby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: UIGrid.VISIBLE_MODIFIED_BY
        }, {
          field: 'updatedbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: UIGrid.VISIBLE_MODIFIED_BYROLE
        }, {
          field: 'createdAt',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false,
          visible: UIGrid.VISIBLE_CREATED_AT
        },
        {
          field: 'createdby',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableSorting: true,
          enableFiltering: true,
          visible: UIGrid.VISIBLE_CREATED_BY
        },
        {
          field: 'createdbyRole',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true,
          visible: UIGrid.VISIBLE_CREATED_BYROLE
        }
      ];
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: UIGrid.Page(),
          SortColumns: [['id', 'DESC']],
          SearchColumns: []
        };
      };
      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: true,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        allowToExportAllData: true,
        exporterCsvFilename: 'Purchase Order Per Line Detail.csv',
        CurrentPage: CORE.PAGENAME_CONSTANT[46].PageName,
        hideMultiDeleteButton: true,
        exporterAllDataFn: () => {
          const pagingInfoOld = _.clone(vm.pagingInfo);
          pagingInfoOld.pageSize = 0;
          pagingInfoOld.isExport = true;
          return PurchaseOrderFactory.getPurchaseOrderPerLineDetail().query(pagingInfoOld).$promise.then((response) => {
            if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (response && response.data && response.data.purchaseOrder) {
                setDataAfterGetAPICall(response.data, false);
                return response.data.purchaseOrder;
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      /* retrieve purchase order detail list log list*/
      vm.loadData = () => {
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['id', 'DESC']];
        }
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        generateSearchFilter();
        vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderPerLineDetail().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data.purchaseOrder) {
            setDataAfterGetAPICall(response.data, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = PurchaseOrderFactory.getPurchaseOrderPerLineDetail().query(vm.pagingInfo).$promise.then((response) => {
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
          _.map(vm.sourceData, (data) => {
            data.soDate = BaseService.getUIFormatedDate(data.soDate, vm.DefaultDateFormat);
            data.poDate = BaseService.getUIFormatedDate(data.poDate, vm.DefaultDateFormat);
            data.shipDate = BaseService.getUIFormatedDate(data.shipDate, vm.DefaultDateFormat);
            data.isPrintDisable = false;
            data.isDownloadDisabled = false;
            data.promisedShipDate = BaseService.getUIFormatedDate(data.promisedShipDate, vm.DefaultDateFormat);
            data.poLineCompletionPercentage = data.poWorkingStatus === vm.PO_Working_Status.Completed.id ? 100 : data.poLineCompletionPercentage;
            data.isDisabledManualOpenPO = data.poLineWorkingStatus === vm.PO_Line_WorkingStatus.Open.id || data.poWorkingStatus === vm.PO_Working_Status.Canceled.id;
            if (data.packingSlip) {
              data.MaterialReceiptNumber = data.packingSlip.split(_groupConcatSeparatorValue);
              const psData = [];
              _.each(data.MaterialReceiptNumber, (value) => {
                const data = value.split('@@@');
                psData.push({
                  id: data[0],
                  psNumber: data[1]
                });
              });
              data.MaterialReceiptNumber = psData;
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
          if (vm.pagingInfo.SearchColumns.length > 0 || vm.supplier.length > 0 || vm.shippingMethods.length > 0 || vm.posoNumber || vm.partIds.length > 0 || vm.isInProgress || vm.isCompleted || vm.isCanceled || vm.isOpen || vm.isClose || vm.fromDate || vm.toDate || vm.poComments) {
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

      //refresh purchase order line detail
      vm.refreshPurchaseOrderPerLine = () => {
        vm.loadData();
      };
      //get footer details
      vm.getFooterTotal = (isother) => {
        let sum;
        if (isother) {
          sum = (_.sumBy(vm.sourceData, (data) => data.totalExtPrice)) || 0;
        } else {
          sum = _.sumBy(vm.sourceData, (data) => data.extPrice);
        }
        sum = $filter('currency')(sum);
        return sum;
      };
      //get footer qty
      vm.getFooterQtyTotal = () => (_.sumBy(vm.sourceData, (data) => data.qty)) || 0;

      //get footer received qty
      vm.getFooterReceivedQtyTotal = () => (_.sumBy(vm.sourceData, (data) => data.totalReceivedQty)) || 0;

      //get footer pending qty
      vm.getFooterPendingQtyTotal = () => (_.sumBy(vm.sourceData, (data) => data.totalPendingQty)) || 0;
      // get price footer detail
      vm.getPriceFooterTotal = () => 'Total:';
      //show description for detail
      vm.showLineDescriptionPopUp = (object, ev) => {
        vm.isOpenLineCommentPopup = true;
        const description = object && object.lineComment ? angular.copy(object.lineComment).replace(/\n/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.LineComment,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      // show internal description
      vm.showInternalLineDescriptionPopUp = (object, ev) => {
        vm.isOpenLineNotesPopup = true;
        const description = object && object.internalLineComment ? angular.copy(object.internalLineComment).replace(/\n/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.InternalNotes,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      //show part description
      vm.showPartDescriptionPopUp = (object, ev) => {
        vm.isOpenDescriptionPopup = true;
        const description = object && object.partDescription ? angular.copy(object.partDescription).replace(/\n/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.Description,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      //go to purchase Order detail
      vm.goToPurchaseOrderDetail = (id) => {
        BaseService.goToPurchaseOrderDetail(id);
      };
      //open common description popup
      const openCommonDescriptionPopup = (ev, data) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => vm.isOpenLineCompleteReasonPopup = vm.isOpenInternalNotesPopup = vm.isOpenPOCommentsPopup = vm.isOpenDescriptionPopup = vm.isOpenLineNotesPopup = vm.isOpenLineCommentPopup = false,
            () => vm.isOpenLineCompleteReasonPopup = vm.isOpenInternalNotesPopup = vm.isOpenPOCommentsPopup = vm.isOpenDescriptionPopup = vm.isOpenLineNotesPopup = vm.isOpenLineCommentPopup = false);
      };
      //update record
      vm.updateRecord = (row) => vm.goToPurchaseOrderDetail(row.entity.refPurchaseOrderID);
      //go to manufacturer page
      vm.goToManufacturer = (id) => {
        BaseService.goToManufacturer(id);
      };
      //search supplier list
      vm.searchSupplierList = () => {
        const supplierListToFilter = angular.copy(vm.supplierlist);
        vm.supplierListToDisplay = vm.SupplierSearchText ? _.filter(supplierListToFilter, (item) => item.mfgcode.toLowerCase().contains(vm.SupplierSearchText.toLowerCase())) : supplierListToFilter;
      };
      //search shipping list
      vm.searchShippingList = () => {
        const shippingListToFilter = angular.copy(vm.ShippingTypeList);
        vm.shippingListToDisplay = vm.ShippingSearchText ? _.filter(shippingListToFilter, (item) => item.gencCategoryDisplayName.toLowerCase().contains(vm.ShippingSearchText.toLowerCase())) : shippingListToFilter;
      };

      const generateSearchFilter = () => {
        vm.PurchaseOrderAdvanceFilter.Supplier.isDeleted = !(vm.supplier.length > 0);
        vm.PurchaseOrderAdvanceFilter.ShippingMethod.isDeleted = !(vm.shippingMethods.length > 0);
        vm.PurchaseOrderAdvanceFilter.Parts.isDeleted = !(vm.partIds.length > 0);
        vm.PurchaseOrderAdvanceFilter.POSO.isDeleted = !(vm.posoNumber);
        vm.PurchaseOrderAdvanceFilter.POComments.isDeleted = !(vm.poComments);
        vm.PurchaseOrderAdvanceFilter.TotalExt.isDeleted = !(vm.amount);
        vm.PurchaseOrderAdvanceFilter.POLineStatus.isDeleted = !(vm.isOpen || vm.isClose);
        vm.PurchaseOrderAdvanceFilter.POStatus.isDeleted = !(vm.isInProgress || vm.isCompleted || vm.isCanceled);
        vm.PurchaseOrderAdvanceFilter.PODate.isDeleted = !(vm.fromDate || vm.toDate);

        vm.pagingInfo.supplierID = vm.supplier.join();
        vm.PurchaseOrderAdvanceFilter.Supplier.tooltip = getFilterTooltip(vm.supplierlist, vm.supplier, 'id', 'mfgcode');

        vm.pagingInfo.shippingMethodId = vm.shippingMethods.join();
        vm.PurchaseOrderAdvanceFilter.ShippingMethod.tooltip = getFilterTooltip(vm.ShippingTypeList, vm.shippingMethods, 'gencCategoryID', 'gencCategoryDisplayName');

        vm.pagingInfo.posoSearchType = vm.checkSerachPOType;
        vm.PurchaseOrderAdvanceFilter.POSO.tooltip = vm.posoNumber;
        vm.pagingInfo.posoSearch = BaseService.convertSpecialCharToSearchString(vm.posoNumber);

        vm.PurchaseOrderAdvanceFilter.POComments.tooltip = vm.poComments;
        vm.pagingInfo.poComments = BaseService.convertSpecialCharToSearchString(vm.poComments);

        const itemIndexAmount = _.findIndex(vm.pagingInfo.SearchColumns, { ColumnName: 'totalExtPrice' });
        if (itemIndexAmount !== -1) {
          vm.pagingInfo.SearchColumns.splice(itemIndexAmount, 1);
        }
        if (vm.amount) {
          let columnDataType = null;
          if (vm.checkSerachAmountType === vm.CheckSearchTypeList[0].id) {
            columnDataType = 'StringEquals';
          }
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'totalExtPrice', SearchString: vm.amount, ColumnDataType: columnDataType, isExternalSearch: true });
        }
        vm.PurchaseOrderAdvanceFilter.TotalExt.tooltip = vm.amount;

        const selectedParts = _.map(vm.partIds, 'id');
        vm.pagingInfo.partIds = selectedParts.join();
        vm.PurchaseOrderAdvanceFilter.Parts.tooltip = getFilterTooltip(vm.partIds, selectedParts.map(String), 'id', 'componentParts');

        // PO Line Working Status
        if (vm.isOpen && vm.isClose) {
          vm.pagingInfo.filterStatus = null;
          vm.PurchaseOrderAdvanceFilter.POLineStatus.tooltip = 'All';
        } else if (!vm.isOpen && !vm.isClose) {
          vm.PurchaseOrderAdvanceFilter.POLineStatus.tooltip = vm.pagingInfo.filterStatus = null;
        } else {
          if (vm.isOpen) {
            vm.pagingInfo.filterStatus = vm.PO_Line_WorkingStatus.Open.id;
            vm.PurchaseOrderAdvanceFilter.POLineStatus.tooltip = vm.PO_Line_WorkingStatus.Open.value;
          } else if (vm.isClose) {
            vm.pagingInfo.filterStatus = vm.PO_Line_WorkingStatus.Close.id;
            vm.PurchaseOrderAdvanceFilter.POLineStatus.tooltip = vm.PO_Line_WorkingStatus.Close.value;
          }
        }

        // PO Working Status
        if (vm.isInProgress && vm.isCompleted && vm.isCanceled) {
          vm.pagingInfo.poStatusFilter = null;
          vm.PurchaseOrderAdvanceFilter.POStatus.tooltip = 'All';
        } else if (!vm.isInProgress && !vm.isCompleted && !vm.isCanceled) {
          vm.PurchaseOrderAdvanceFilter.POStatus.tooltip = vm.pagingInfo.poStatusFilter = null;
        } else {
          const strFilter = [];
          const POWorkingStatusFilterTooltip = [];
          if (vm.isInProgress) {
            strFilter.push(vm.PO_Working_Status.InProgress.id);
            POWorkingStatusFilterTooltip.push(vm.PO_Working_Status.InProgress.value);
          }
          if (vm.isCompleted) {
            strFilter.push(vm.PO_Working_Status.Completed.id);
            POWorkingStatusFilterTooltip.push(vm.PO_Working_Status.Completed.value);
          }
          if (vm.isCanceled) {
            strFilter.push(vm.PO_Working_Status.Canceled.id);
            POWorkingStatusFilterTooltip.push(vm.PO_Working_Status.Canceled.value);
          }
          vm.pagingInfo.poStatusFilter = `'${strFilter.join('\',\'')}'`;
          vm.PurchaseOrderAdvanceFilter.POStatus.tooltip = `${POWorkingStatusFilterTooltip.join('<br />')}`;
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

        vm.pagingInfo.withoutOtherPart = vm.withoutOtherPart;
        vm.pagingInfo.onlyOtherPart = vm.onlyOtherPart;
        vm.pagingInfo.isonlyPendingLines = vm.isonlyPendingLines;

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
        vm.SupplierSearchText = undefined;
        vm.searchSupplierList();
      };

      vm.removePOCommentFilter = () => {
        vm.poComments = null;
        vm.loadData();
      };

      vm.removePOSOFilter = () => {
        vm.posoNumber = null;
        vm.loadData();
      };

      //get max length validations
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      //clear shipping search text
      vm.clearShippingSearchText = () => {
        vm.ShippingSearchText = undefined;
        vm.searchShippingList();
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

      //reset filter
      vm.reset = (isReset) => {
        vm.resetDateFilter();
        vm.clearSupplierFilter();
        vm.clearShippingFilter();
        vm.clearShippingSearchText();
        vm.clearSupplierSearchText();
        if (!vm.partIDFilter) {
          vm.partIds = [];
        }
        vm.posoNumber = null;
        vm.amount = null;
        vm.generateFilter = false;
        vm.poComments = vm.fromDate = vm.toDate = null;
        vm.isClose = vm.isCompleted = vm.isCanceled = false;
        vm.isInProgress = vm.isOpen = isReset ? true : false;
        if (vm.gridOptions.gridApi) {
          vm.gridOptions.gridApi.core.clearAllFilters();
        }
        vm.loadData();
      };
      //go to supplier list
      vm.goToSupplierList = () => {
        BaseService.goToSupplierList();
      };
      //go to shipping method
      vm.goToShippingList = () => {
        BaseService.goToGenericCategoryShippingTypeList();
      };
      //go to supplier edit page
      vm.goToSupplier = (supplierID) => {
        BaseService.goToSupplierDetail(supplierID);
      };
      //show po comments
      vm.showPOCommentPopUp = (object, ev) => {
        vm.isOpenPOCommentsPopup = true;
        const description = object && object.poComment ? angular.copy(object.poComment).replace(/\n/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.POComments,
          description: description,
          name: object.poNumber
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.PO;
        openCommonDescriptionPopup(ev, data);
      };
      //show Internal comments
      vm.showInternalCommentPopUp = (object, ev) => {
        vm.isOpenInternalNotesPopup = true;
        const description = object && object.shippingComment ? angular.copy(object.shippingComment).replace(/\n/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.InternalComments,
          description: description,
          name: object.poNumber
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.PO;
        openCommonDescriptionPopup(ev, data);
      };
      //remove filter
      vm.removeAppliedFilter = (item) => {
        if (item) {
          item.isDeleted = true;
          switch (item.value) {
            case vm.PurchaseOrderAdvanceFilter.Supplier.value:
              vm.clearSupplierFilter();
              break;
            case vm.PurchaseOrderAdvanceFilter.ShippingMethod.value:
              vm.clearShippingFilter();
              break;
            case vm.PurchaseOrderAdvanceFilter.Parts.value:
              vm.partIds = [];
              break;
            case vm.PurchaseOrderAdvanceFilter.POSO.value:
              vm.posoNumber = null;
              break;
            case vm.PurchaseOrderAdvanceFilter.TotalExt.value:
              vm.amount = null;
              break;
            case vm.PurchaseOrderAdvanceFilter.POLineStatus.value:
              vm.isOpen = vm.isClose = false;
              break;
            case vm.PurchaseOrderAdvanceFilter.POStatus.value:
              vm.isInProgress = vm.isCompleted = vm.isCanceled = false;
              break;
            case vm.PurchaseOrderAdvanceFilter.PODate.value:
              vm.fromDate = vm.toDate = null;
              vm.resetDateFilter();
              break;
            case vm.PurchaseOrderAdvanceFilter.POComments.value:
              vm.poComments = null;
              break;
          }
          vm.loadData();
        }
      };
      //open log for purchase order detail
      vm.openPurchaseOrderChangesHistory = (row, ev) => {
        row.entity.isDisabledHistoryIcon = true;
        const data = {
          purchaseOrderID: row.entity.refPurchaseOrderID,
          poNumber: row.entity.poNumber,
          purchaseOrderDetId: row.entity.id,
          pidCode: row.entity.pidCode,
          iscustom: row.entity.iscustom,
          rohsName: row.entity.rohsName,
          rohsIcon: stringFormat('{0}{1}', vm.rohsImagePath, row.entity.rohsIcon),
          partID: row.entity.mfgPartID,
          mfgPN: row.entity.mfgPN,
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
      ////set default tab for employee
      //vm.setDefaultTabForEmp = () => {
      //  const objTab = {
      //    defaultPurchaseDetailTabID: vm.setDefault ? TRANSACTION.PO_DETAIL_TAB.PART_DETAIL : null,
      //    employeeID: vm.loginUser.employee.id
      //  };
      //  vm.cgBusyLoading = EmployeeFactory.updateEmployeeDefaultPurchaseOrderTab().query(objTab).$promise.then((data) => {
      //    if (data) {
      //      BaseService.loginUser.employee.defaultPurchaseDetailTabID = objTab.defaultPurchaseDetailTabID;
      //      BaseService.setLoginUser(BaseService.loginUser);
      //    }
      //  }).catch((error) => BaseService.getErrorLog(error));
      //};
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
      //go to customer details page
      vm.goToCustomer = (id) => BaseService.goToCustomer(id);
      // open release line popup
      vm.goToReleaseLine = (row, ev) => {
        row.isReadOnly = vm.isReadOnly;
        DialogFactory.dialogService(
          CORE.RELEASE_LINE_PO_MODAL_CONTROLLER,
          CORE.RELEASE_LINE_PO_MODAL_VIEW,
          ev,
          row).then(() => {
          }, (isChange) => {
            if (isChange) {
              vm.loadData();
            }
          }, (error) => BaseService.getErrorLog(error));
      };

      //print purchase order report
      vm.printRecord = (row, isDownload) => {
        if (isDownload) {
          row.entity.isDownloadDisabled = true;
        } else {
          row.entity.isPrintDisable = true;
        }
        if (vm.termsAndCondition) {
          vm.printReport(row, isDownload);
        } else {
          // Get Term and Condition from Data key
          MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: CONFIGURATION.SETTING.TermsAndCondition }).$promise.then((dataKeyResponse) => {
            if (dataKeyResponse && dataKeyResponse.data && dataKeyResponse.data.length > 0) {
              vm.termsAndCondition = dataKeyResponse.data[0].values;
              vm.printReport(row, isDownload);
            } else {
              if (isDownload) {
                row.entity.isDownloadDisabled = false;
              } else {
                row.entity.isPrintDisable = false;
              }
            }
          }).catch((error) => {
            if (isDownload) {
              row.entity.isDownloadDisabled = false;
            } else {
              row.entity.isPrintDisable = false;
            }
            BaseService.getErrorLog(error);
          });
        }
      };

      vm.printReport = (row, isDownload) => {
        PurchaseOrderFactory.getPurchaseOrderReport({
          id: row.entity.refPurchaseOrderID,
          termsAndCondition: vm.termsAndCondition,
          POLineData: {
            poNumber: row.entity.poNumber,
            poRevision: row.entity.poRevision,
            supplierMfgName: row.entity.supplierMfgName,
            statusName: row.entity.status === CORE.DisplayStatus.Draft.ID ? `-${row.entity.statusName.toUpperCase()}` : ''
          }
        }).then((response) => {
          const POLineData = response.config.data.POLineData;
          if (isDownload) {
            row.entity.isDownloadDisabled = false;
          } else {
            row.entity.isPrintDisable = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.PURCHASE_ORDER, POLineData.poNumber, POLineData.poRevision, POLineData.supplierMfgName, POLineData.statusName), isDownload, true);
        }).catch((error) => {
          if (isDownload) {
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
        vm.cgBusyLoading = PurchaseOrderFactory.checkPartStatusOfPurchaseOrder().query({ id: row.refPurchaseOrderID }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (res.data) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_CONTAINST_INACTIVE_PART);
              messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(row.refPurchaseOrderID, row.poNumber));
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
          purchaseID: row.refPurchaseOrderID,
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

      //update status to complete
      vm.purchaseOrderStatusUpdate = (row, ev, isOpenPOLine) => {
        row.entity.isDisabledManualCompleteOpenPO = true;
        if (isOpenPOLine && row.entity.lockStatus === vm.PurchaseOrderLockStatus.Locked.id) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_OPEN_LOCKED_PO);
          return DialogFactory.messageAlertDialog({ messageContent }).then(() => row.entity.isDisabledManualCompleteOpenPO = false);
        }
        const objPoDetail = {
          poNumber: row.entity.poNumber,
          poID: row.entity.refPurchaseOrderID,
          soNumber: row.entity.soNumber,
          pidCode: row.entity.pidCode,
          mfgPartID: row.entity.mfgPartID,
          iscustom: row.entity.iscustom,
          rohsIcon: row.entity.rohsIcon,
          rohsName: row.entity.rohsName,
          mfgPN: row.entity.mfgPN
        };
        DialogFactory.dialogService(
          CORE.COMMON_REASON_MODAL_CONTROLLER,
          CORE.COMMON_REASON_MODAL_VIEW,
          ev,
          objPoDetail).then(() => row.entity.isDisabledManualCompleteOpenPO = false,
            (result) => {
              if (result) {
                const rowDetail = {
                  refPurchaseOrderDetID: row.entity.id,
                  poLineWorkingStatus: isOpenPOLine ? vm.PO_Line_WorkingStatus.Open.id : vm.PO_Line_WorkingStatus.Close.id,
                  poLineCompleteReason: result,
                  poLineCompleteType: CORE.POCompleteType.MANUAL,
                  refPOID: row.entity.refPurchaseOrderID
                };
                vm.cgBusyLoading = PurchaseOrderFactory.updatePurchaseOrderLineLevelStatus().query(rowDetail).$promise.then((res) => {
                  row.entity.isDisabledManualCompleteOpenPO = false;
                  if (res.data) {
                    initPageInfo();
                    vm.loadData();
                  }
                }).catch((error) => {
                  row.entity.isDisabledManualCompleteOpenPO = false;
                  BaseService.getErrorLog(error);
                });
              } else {
                row.entity.isDisabledManualCompleteOpenPO = false;
              }
            }, (error) => BaseService.getErrorLog(error));
      };

      vm.viewPurchaseRequirement = (row, ev) => {
        row.entity.isDisableRequirementIcon = true;
        const objRow = _.clone(row.entity);
        objRow.poID = row.entity.refPurchaseOrderID;
        objRow.partID = row.entity.mfgPartID;
        objRow.isDisable = false;
        objRow.isView = true;
        DialogFactory.dialogService(
          CORE.PURCHASE_ORDER_REQUIREMENT_PART_MODAL_CONTROLLER,
          CORE.PURCHASE_ORDER_REQUIREMENT_PART_MODAL_VIEW,
          ev,
          objRow).then(() => row.entity.isDisableRequirementIcon = false, () => row.entity.isDisableRequirementIcon = false, (err) => BaseService.getErrorLog(err));
      };
      // Redirect to material receipt manage page
      vm.goToPackingSlip = (id) => {
        if (id) {
          BaseService.goToManagePackingSlipDetail(id);
        }
      };
      // download print
      vm.onDownload = (row) => vm.printRecord(row, true);
      // show po completion reason
      vm.showPOCompletePopUp = (object, ev) => {
        vm.isOpenLineCompleteReasonPopup = true;
        const description = object && object.poLineCompleteReason ? angular.copy(object.poLineCompleteReason).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.POCompleteLineReason,
          description: description,
          name: object.poNumber
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.PO;
        openCommonDescriptionPopup(ev, data);
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

      vm.showPackingSlipSummaryDetails = (row) => {
        const data = row;
        data.poId = row.refPurchaseOrderID;
        data.mfgCodeID = row.mfgcodeID;
        data.partID = row.mfgPartID;
        data.PIDCode = row.pidCode;
        data.receivedQty = row.totalReceivedQty;
        data.pendingQty = row.totalPendingQty;
        data.mfgName = row.mfgcodeName;
        DialogFactory.dialogService(
          CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_CONTROLLER,
          CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_VIEW,
          event,
          data
        ).then(() => { }, () => { });
      };

      // Redirect to purchase order page by id
      const redirectToPOAnchorTag = (poid, poNumber) => {
        const redirectToPOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_ROUTE.replace(':id', poid);
        return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPOUrl, poNumber);
      };
    }
  }
})();
