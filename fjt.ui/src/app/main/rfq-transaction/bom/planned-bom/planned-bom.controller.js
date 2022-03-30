(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('PlannedBOMController', PlannedBOMController);

  /** @ngInject */
  function PlannedBOMController($state, $scope, $q, $timeout, $stateParams, $mdDialog, $mdSidenav, $filter, PRICING, $mdComponentRegistry, CORE, DialogFactory, PartCostingFactory, SalesOrderFactory, RFQTRANSACTION, RFQSettingFactory, BOMFactory, MasterFactory, BaseService, PlannedBOMFactory, CustomerConfirmationPopupFactory, socketConnectionService) {
    const vm = this;
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = 1;
    }
    vm.isExpand = true;
    vm.gridBOMLevel = CORE.gridConfig.gridBOMLevel;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM;
    vm.subAssemblyID = CORE.PartCategory.SubAssembly;
    vm.StatusOptionsGridHeaderDropdown = CORE.ClusterStatusGridHeaderDropdown;
    $scope.$parent.$parent.$parent.vm.packaging = true;
    vm.isInit = false;
    vm.lebelConstant = CORE.LabelConstant;
    vm.sourceHeader = null;
    vm.setScrollClass = 'gridScrollHeight_Bom';
    vm.isMFGPN = false;
    const rfqAssyID = parseInt($stateParams.id);
    vm.DateTimeFormat = _dateDisplayFormat;
    let varifiedBOMModel = [];
    vm.rfqAssyBOMList = [];
    vm._isreadyForPricing = null;
    vm.isHideDelete = true;
    vm.documentClass = 'workorder-js-tree';
    vm.isShowSideNav = true;
    vm.packaging = true;
    vm.selectedTreeItem = null;
    vm.loginUser = BaseService.loginUser;
    vm.loginUserId = vm.loginUser.userid;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

    //vm.isAll = true;
    vm.assyBOM = {
      selectedBOMID: null,
      PIDCode: null,
      selectedBOM: null
    };
    let customerID = null;
    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['lineID', 'ASC']],
        SearchColumns: []
      };
    };
    initPageInfo();

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      filterOptions: vm.pagingInfo.SearchColumns,
      enableCellEdit: false,
      enableCellEditOnFocus: false,
      exporterCsvFilename: 'BOM Levels.csv',
      exporterMenuCsv: true,
      enableColumnMenus: false
    };
    // used to check if BOM is changed or not
    // based on it check while tab change to display confirmation pop up if pending changes
    BOMFactory.isBOMChanged = false;

    // get Component Internal Version
    function getComponentInternalVersion() {
      if (vm.partID) {
        return MasterFactory.getComponentInternalVersion().query({ id: vm.partID }).$promise.then((component) => {
          if (component && component.data) {
            vm.liveInternalVersion = component.data.liveVersion;
          }
          return vm.liveInternalVersion;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    //  get BOM Issues list for save on submit for part costing
    const getComment = () => {
      var model = {
        partID: vm.partID,
        externalIssue: true
      };
      vm.copyBomIssue = '';
      vm.cgBusyLoading = CustomerConfirmationPopupFactory.getRfqLineItemsCopyDescription().save(model).$promise.then((response) => {
        if (response && response.data) {
          if (response.data && response.data.length > 0) {
            vm.BOMIssue = response.data;
            _.each(response.data, (copyData) => {
              vm.copyBomIssue += stringFormat('{0}: {1}<br/>', copyData.assyID, copyData.description);
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get assembly detail
    function getAssyDetail() {
      vm.cgBusyLoading = BOMFactory.getAssyDetails().query({ id: rfqAssyID }).$promise.then((response) => {
        if (response && response.data) {
          const rfqAssy = response.data;
          vm.bom = {
            assemblyDescription: rfqAssy.componentAssembly.mfgPNDescription,
            assemblyNumber: rfqAssy.componentAssembly.mfgPN,
            assemblyRev: rfqAssy.componentAssembly.rev,
            PIDCode: rfqAssy.componentAssembly.PIDCode,
            isSummaryComplete: rfqAssy.isSummaryComplete,
            rfqrefID: rfqAssy.rfqrefID,
            isActivityStart: rfqAssy.isActivityStart,
            activityStartBy: rfqAssy.activityStartBy
          };
          vm.partID = rfqAssy.partID;
          const quoteobj = _.find(rfqAssy.rfqAssyQuoteSubmitted, (x) => !x.quotenumber);
          if (quoteobj) {
            vm.rfqQuoteSumbuittedID = quoteobj.id;
          }
          if (rfqAssy.rfqForms) {
            vm.bom.quoteindate = rfqAssy.rfqForms.quoteindate;
            vm.bom.rfqNo = rfqAssy.rfqForms.id;
            if (rfqAssy.rfqForms.customer) {
              vm.bom.companyName = rfqAssy.rfqForms.customer.companyName;
              customerID = rfqAssy.rfqForms.customer.id;
            }
          }
          vm.gridOptions.enableCellEdit = !vm.bom.isSummaryComplete,
            initUIGrid();
          vm._isreadyForPricing = rfqAssy.isReadyForPricing;
          getComponentInternalVersion();
          getComment();
        }
      });
    }
    vm.isValid = false;
    init();

    function init() {
      vm.cgBusyLoading = $q.all([getAssyDetail(), getAssyBOMList()]).then(() => {
        vm.isInit = true;
        vm.loadData();
        initUIGrid();
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    function initUIGrid() {
      vm.sourceHeader = [{
        field: '#',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-disabled="row.entity.isdisable" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
                          <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
                          </div>\
                          <div class="ui-grid-cell-contents grid-cell-text-right" ng-disabled="row.entity.isdisable" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
                          <span><b>{{(grid.appScope.$parent.vm.pagingInfo.pageSize * (grid.appScope.$parent.vm.pagingInfo.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
                       </div>',
        width: '50',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false
      }, {
        field: 'lineID',
        displayName: 'Item(Line#)',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-disabled="row.entity.isdisable" style="padding:0px !important">{{COL_FIELD}}</div>',
        width: '65',
        type: 'number',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false

      }, {
        field: 'cust_lineID',
        displayName: 'Customer BOM Line Number',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-disabled="row.entity.isdisable" style="padding:0px !important">{{COL_FIELD}}</div>',
        width: '130',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false

      }, {
        field: 'CPNPID',
        displayName: vm.lebelConstant.MFG.CPN,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-disabled="row.entity.isdisable"><span ng-class="{\'text-line-through\':(row.entity.restrictCPNUseInBOMStep||!row.entity.restrictCPNUsePermanentlyStep||!row.entity.restrictCPNUseWithPermissionStep)}">{{COL_FIELD}}</span></div>',
        maxWidth: '200',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'qpa',
        displayName: 'QPA',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        width: '65',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'refDesig',
        displayName: vm.lebelConstant.BOM.REF_DES,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        width: '150',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'isPurchase',
        displayName: 'Buy',
        width: '100',
        cellTemplate: '<input type="checkbox" class="grid-checkbox-size" ng-model="row.entity.isPurchase" disabled>',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        type: 'boolean'
      }, {
        field: 'isInstall',
        displayName: 'Populate',
        cellTemplate: '<input type="checkbox" class="grid-checkbox-size" ng-model="row.entity.isInstall" disabled>',
        width: '100',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.StatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        type: 'boolean'
      }, {
        field: 'dnpQty',
        displayName: 'DNP QPA',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        width: '70',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'dnpDesig',
        displayName: vm.lebelConstant.BOM.DNP_REF_DES,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        width: '140',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'isBuyDNPQty',
        displayName: 'Buy DNP Qty',
        width: '170',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        //editableCellTemplate: '<input type="checkbox" class="grid-checkbox-size" ng-model="row.entity.isBuyDNPQty" disabled>',
        //cellTemplate: '<input type="checkbox" class="grid-checkbox-size" ng-model="row.entity.isBuyDNPQty" disabled>',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        //allowCellFocus: true,
        //filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        //filter: {
        //    term: 0,
        //    options: vm.StatusOptionsGridHeaderDropdown
        //},
        ColumnDataType: 'StringEquals'
        //type: 'boolean'
      }, {
        field: 'unitName',
        displayName: 'UOM',
        cellTemplate: '<div class="ui-grid-cell-contents text-left" ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        width: '100',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'name',
        displayName: 'Mounting Type',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}"  ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        width: '150',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'partTypeName',
        displayName: 'Functional Type',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}"  ng-disabled="row.entity.isdisable">{{COL_FIELD}}</div>',
        width: '150',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'PIDList',
        displayName: vm.lebelConstant.MFG.PID,
        cellTemplate: '<alternative-component-details is-expand="grid.appScope.$parent.vm.isExpand" row-data="row.entity" row-restrict-part="grid.appScope.$parent.vm.restrictedLine"></alternative-component-details>',
        width: '500',
        maxWidth: '700',
        minWidth: '400',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      }, {
        field: 'internalComment',
        displayName: 'Internal Comment',
        cellTemplate: '<span class="ui-grid-cell-contents-break text-left" ng-disabled="row.entity.isdisable" ng-bind-html="row.entity.internalComment"></span>',
        width: '350',
        maxWidth: '600',
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false,
        type: 'html'
      }, {
        field: 'numOfPosition',
        displayName: vm.lebelConstant.MFG.noOfPosition,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" is-show="!grid.appScope.$parent.vm.bom.isSummaryComplete" style="padding:0px !important">{{COL_FIELD}}</div>',
        width: '70',
        type: 'number',
        enableFiltering: true,
        enableSorting: true,
        enableCellEdit: false,
        allowCellFocus: true
      }];
    }

    vm.selectedBOM = (item) => {
      if (item) {
        vm.selectedTreeItem = item;
        vm.assyBOM.selectedBOMID = item.partID;
        vm.assyBOM.PIDCode = item.text;
        vm.assyBOM.selectedBOM = item.partID;
        vm.currentKey = item.prPartLineItemID;
        vm.loadData();
      }
    };


    vm.ChangeBOM = (item) => {
      if (item) {
        const selectedSubAssyItem = _.find(vm.rfqAssyBOMList, (obj) => obj.partID === item && obj.parent === vm.selectedTreeItem.id);
        if (selectedSubAssyItem) {
          $('.jstree').jstree(true).deselect_all(true);
          $('.jstree').jstree(true).select_node(selectedSubAssyItem.id);
        }
      }
    };


    function getAssyBOMList() {
      return PlannedBOMFactory.getAssyBOMList({ rfqAssyID: rfqAssyID }).query().$promise.then((response) => {
        if (response && response.data) {
          vm.rfqAssyBOMList = response.data.rfqAssyBOM;
          const selectedBOMItem = _.first(vm.rfqAssyBOMList);
          vm.assyBOM.selectedBOMID = selectedBOMItem.partID;
          $mdComponentRegistry.when('rfqsubassy-tree').then(() => {
            $mdSidenav('rfqsubassy-tree').open();
            vm.isShowSideNav = true;
          });
        }
      });
    }

    function setDataAfterGetAPICall(rfqLineItems, isGetDataDown) {
      if (rfqLineItems && rfqLineItems.data.rfqLineItems) {
        vm.restrictedLine = rfqLineItems.data.restrictedParts;
        if (!isGetDataDown) {
          vm.sourceData = rfqLineItems.data.rfqLineItems;
          vm.currentdata = vm.sourceData.length;
        }
        else if (rfqLineItems.data.rfqLineItems.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(rfqLineItems.data.rfqLineItems);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, (item) => {
            item.isInstall = item.isInstall ? true : false;
            item.isPurchase = item.isPurchase ? true : false;
            item.rfqAssyID = rfqAssyID;
            item.customerID = customerID;
            item.rfqLineItemID = item.id;
          });
        }
        // must set after new data comes
        vm.totalSourceDataCount = rfqLineItems.data.Count;
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
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.resetScroll();
        }

        vm.gridOptions.clearSelectedRows();
        if (vm.totalSourceDataCount === 0) {
          vm.isNoDataFound = false;
          vm.emptyState = 0;
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
        }
        $timeout(() => {
          vm.resetSourceGrid();
          //$('.jstree').on('ready.jstree', () => {
          //  $('.jstree').jstree('open_all');
          //});
          if (!isGetDataDown) {
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              vm.isallloaded = true;
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            } else {
              vm.isallloaded = false;
            }
          } else {
            if (vm.totalSourceDataCount === vm.currentdata) {
              vm.isallloaded = true;
            }
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    }

    vm.loadData = () => {
      vm.pagingInfo.partID = vm.assyBOM.selectedBOMID;
      vm.pagingInfo.rfqAssyBOMID = vm.isAll ? null : vm.assyBOM.selectedBOMID ? vm.assyBOM.selectedBOMID : vm.pagingInfo.rfqAssyBOMID;
      vm.pagingInfo.isPackagingDisplay = vm.packaging;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      if (vm.pagingInfo.partID) {
        vm.cgBusyLoading = BOMFactory.getRFQLineItems().query(vm.pagingInfo).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(response, false);
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      if (!vm.isallloaded) {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = BOMFactory.getRFQLineItems().query(vm.pagingInfo).$promise.then((response) => {
          setDataAfterGetAPICall(response, true);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    //get unit list for price
    const getUnitList = () => SalesOrderFactory.getUnitList().query().$promise.then((unitlist) => {
      vm.UnitList = unitlist.data;
      return unitlist.data;
    }).catch((error) => BaseService.getErrorLog(error));

    vm.Expand = () => {
      vm.isExpand = vm.isExpand ? false : true;
    };

    function checkValidateUOMDetails(multipleMGF) {
      if (multipleMGF.length) {
        const misMatchLineList = [];
        for (const prop in multipleMGF) {
          const obj = multipleMGF[prop];
          const mismatchObj = {};
          _.each(obj, (x) => {
            var mfgCode = x.mfgcode.split(',');
            mismatchObj.parts = mfgCode.join('<br />');
            if (!mismatchObj.lineID) {
              mismatchObj.lineID = x.assy + ' | ' + x.lineID;
            } else {
              mismatchObj.lineID = mismatchObj.lineID + ', ' + x.assy + ' | ' + x.lineID;
            }
          });
          misMatchLineList.push(mismatchObj);
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.UOM_MISMATCH_TEXT);
        const message = messageContent.message + '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>Part Number</th><th class=\'border-bottom padding-5\'>Item</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = [];
        misMatchLineList.forEach((item) => {
          subMessage.push('<tr><td class=\'border-bottom padding-5\'>' + (misMatchLineList.indexOf(item) + 1) + '</td><td class=\'border-bottom padding-5\'>' + item.parts + '</td><td class=\'border-bottom padding-5\'>' + item.lineID + '</td></tr>');
        });

        messageContent.message = stringFormat(message, subMessage.join(''));
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return true;
      }
      return false;
    }

    vm.save = () => {
      if ((!vm._isreadyForPricing ? false : vm.isValid) || vm.bom.isSummaryComplete || (vm.totalSourceDataCount == 0) || !vm.bom.isActivityStart || vm.bom.activityStartBy != vm.loginUserId) { return false;}
      _.each(vm.sourceData, (item) => {
        var obj = {};
        obj.id = item.id;
        obj.partID = item.partID;
        obj.rfqAssyID = rfqAssyID;
        obj.isInstall = item.isInstall;
        obj.isPurchase = item.isPurchase;
        //obj.isBuyDNPQty = item.isBuyDNPQty;
        obj.lineID = item.lineID;
        obj.numOfPosition = item.numOfPosition;
        varifiedBOMModel.push(obj);
      });
      showConfirmationPopup();
    };


    function showConfirmationPopup() {
      var messgaeContent = vm._isreadyForPricing ? angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.VERIFY_BOM_PRICING_CONFIRMATION_MSG) : angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.VERIFY_BOM_PRICING_CONFIRMATION_MSG_INITIAL);
      const obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          submitForPartCostingAndLaborCost();
        }
      }, () => {
        if (vm._isreadyForPricing) {
          varifiedBOMModel = [];
          vm.isValid = false;
          vm.loadData();
          BOMFactory.isBOMChanged = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // Submit for Part costing and labor cost
    function submitForPartCostingAndLaborCost(submitForConsolidate) {
      const model = {
        bomModel: varifiedBOMModel,
        rfqAssyID: rfqAssyID,
        partID: vm.partID,
        isReadyForPricing: true,
        BOMVersion: vm.liveInternalVersion,
        BOMIssues: vm.copyBomIssue,
        currentBOMIssue: vm.BOMIssue,
        rfqAssyQuoteSubmittedID: vm.rfqQuoteSumbuittedID,
        rfqrefID: vm.bom.rfqrefID,
        submitForConsolidate: submitForConsolidate || false
      };
      vm.cgBusyLoading = PlannedBOMFactory.updateVerifyBOM().save(model).$promise.then((response) => {
        if (response && response.data) {
          BOMFactory.isBOMChanged = false;
          BaseService.currentPageFlagForm = [];
          vm.consolidateItems = [];
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            getConsolidateLineItems().then((consolidateResponse) => {
              varifiedBOMModel = [];
              vm.consolidateItems = consolidateResponse.consolidateParts;
              vm.qtyDetails = consolidateResponse.quantityAssembly;
              vm.isValid = false;
              if (response.data.ismismatchVersion) {
                let autocompletePromiseUnit = [getPricingDetails(), getUnitList()];
                vm.cgBusyLoading = $q.all(autocompletePromiseUnit).then((pricingResponse) => {
                  if (pricingResponse) {
                    const minDate = _.minBy(vm.pricingList, (o) => (new Date(o.UpdatedTimeStamp)));
                    const maxDate = _.maxBy(vm.pricingList, (o) => (new Date(o.UpdatedTimeStamp)));
                    if (minDate && maxDate) {
                      const currDate = (new Date(minDate.UpdatedTimeStamp));
                      currDate.setDate(currDate.getDate() - 1);
                      const currMaxDate = (new Date(maxDate.UpdatedTimeStamp));
                      currMaxDate.setDate(currMaxDate.getDate() + 2);
                      const startDate = $filter('date')(new Date(currDate), CORE.DateFormatArray[0].format);
                      const endDate = $filter('date')(new Date(currMaxDate), CORE.DateFormatArray[0].format);
                      autocompletePromiseUnit = [callbackFunction(startDate, endDate)];
                      vm.cgBusyLoading = $q.all(autocompletePromiseUnit).then(() => {
                        const autocompletePromise = [getPriceSettings()];
                        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
                          const consolidateItems = vm.consolidateItems;
                          const qtyDetails = vm.qtyDetails;
                          vm.pricingsetting = responses[0].priceSetting;
                          const assyQtyBreakList = [];
                          //check for qty having pricing or not
                          _.each(qtyDetails, (qtyDetail) => {
                            _.each(vm.pricingList, (pricingDetails) => {
                              const currentPriceBreak = _.filter(vm.qtyBreakList, (pBreak) => parseInt(pBreak.supplierID) === parseInt(pricingDetails.SupplierID) && pBreak.UpdatedTimeStamp === pricingDetails.UpdatedTimeStamp && parseInt(pBreak.componentID) === parseInt(pricingDetails.PartNumberId) && ((pricingDetails.packageID && pBreak.packagingID && parseInt(pricingDetails.packageID) === parseInt(pBreak.packagingID)) || (!pricingDetails.packageID && !pBreak.packagingID)));
                              if (currentPriceBreak.length > 0) {
                                const isQtyExist = _.find(pricingDetails.assemblyQtyBreak, (assyQty) => parseInt(assyQty.RfqAssyQtyId) === parseInt(qtyDetail.id));
                                const consolidateObj = _.find(consolidateItems, (item) => parseInt(item.id) === parseInt(pricingDetails.ConsolidateID));
                                if (consolidateObj) {
                                  const objPriceBreak = getAssyBreak(qtyDetail.requestQty, pricingDetails.ApiNoOfPosition, pricingDetails.NoOfPosition, consolidateObj.qpa, pricingDetails.Multiplier ? pricingDetails.Multiplier : 1, pricingDetails.MinimumBuy ? pricingDetails.MinimumBuy : 1, consolidateObj.uomID, pricingDetails.componentUnitID,
                                    pricingDetails.packageQty, currentPriceBreak, qtyDetail.id, pricingDetails.ConsolidateID, pricingDetails.connectorTypeID, pricingDetails.noOfRows, pricingDetails.AdditionalValueFee, pricingDetails.isCustom);
                                  if (objPriceBreak) {
                                    objPriceBreak.qtySupplierID = pricingDetails._id;
                                    if (isQtyExist && (parseInt(isQtyExist.CurrentQty) !== parseInt(qtyDetail.requestQty) || (pricingDetails.qpa && consolidateObj.qpa && parseInt(pricingDetails.qpa) !== parseInt(consolidateObj.qpa)) || (pricingDetails.NoOfPosition && consolidateObj.numOfPosition && parseInt(pricingDetails.NoOfPosition) !== parseInt(consolidateObj.numOfPosition)))) {
                                      objPriceBreak._id = isQtyExist._id;
                                      assyQtyBreakList.push(objPriceBreak);
                                    }
                                    else if (!isQtyExist) {
                                      assyQtyBreakList.push(objPriceBreak);
                                    }
                                  }
                                }
                              }
                            });
                          });
                          if (assyQtyBreakList.length > 0) {
                            vm.cgBusyLoading = PartCostingFactory.saveAssyPriceQtyBreak().query({ assyQtyBreak: assyQtyBreakList }).$promise.then(() => {
                              gotoPartCostingTab(true);
                            });
                          }
                          else {
                            gotoPartCostingTab(false);
                          }
                        });
                      });
                    } else {
                      gotoPartCostingTab(false);
                    }
                  } else {
                    gotoPartCostingTab(false);
                  }
                });
              } else if (!submitForConsolidate) {
                const messgaeContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SUBMIT_BOM_FOR_PRICING_CONFIRMATION_MSG;
                const obj = {
                  messageContent: messgaeContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    submitForPartCostingAndLaborCost(true);
                  }
                }, () => {
                  gotoPartCostingTab(false);
                }).catch((error) => BaseService.getErrorLog(error));
              } else {
                gotoPartCostingTab(false);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
            checkValidateUOMDetails(response.data);
          }
        } else {
          varifiedBOMModel = [];
          vm.isValid = false;
          vm.loadData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //hide show side nav.
    vm.HideShowSideNav = () => {
      if (vm.isShowSideNav) {
        $mdSidenav('rfqsubassy-tree').close();
        // added for custom apply z-index
        const myEl = angular.element(document.querySelector('rfqsubassy-tree'));
        if (myEl.length > 0) {
          myEl.addClass('workorder-tree-hide');
        }
        // added for custom apply z-index
        vm.isShowSideNav = false;
      }
      else {
        $mdSidenav('rfqsubassy-tree').open();
        vm.isShowSideNav = true;
      }
    };

    $scope.$on(RFQTRANSACTION.EVENT_NAME.Packaging, (name, packaging) => {
      vm.pagingInfo.ppackageing = packaging;
      vm.packaging = packaging;
      vm.loadData();
    });

    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      socketConnectionService.on(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
      socketConnectionService.removeListener(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
    }


    function revisedQuote(assyid) {
      if (assyid && parseInt(assyid) === rfqAssyID && vm.bom.isSummaryComplete) {
        vm.bom.isSummaryComplete = false;
        vm.gridOptions.enableCellEdit = vm.bom.isSummaryComplete;
        getAssyDetail();
      }
    }
    function CostingStartStopActivity(data) {
      if (data && data.rfqAssyID && parseInt(data.rfqAssyID) === rfqAssyID) {
        vm.bom.isActivityStart = !vm.bom.isActivityStart;
        vm.bom.activityStartBy = data.loginUserId;
        getAssyDetail();
      }
    }
    function sendSubmittedQuote(data) {
      if (data && data.assyID && parseInt(data.assyID) === rfqAssyID) {
        vm.bom.isSummaryComplete = true;
        vm.gridOptions.enableCellEdit = vm.bom.isSummaryComplete;
      }
    }
    //close popup on destroy page

    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });
    //close popup on destroy page
    $scope.$on('$destroy', () => {
      removeSocketListener();
      BaseService.currentPageFlagForm = [];
      BOMFactory.isBOMChanged = false;
      $mdDialog.hide(false, {
        closeAll: true
      });
    });


    //common function after save and merge
    function gotoPartCostingTab(isUpdate) {
      if (vm.consolidateItems && vm.consolidateItems.length > 0) {
        $scope.$emit('isReadyForPricing', true);
        vm._isreadyForPricing = true;
        BOMFactory.isBOMChanged = false;
        BOMFactory.isqtyUpdate = isUpdate;
        $state.go(RFQTRANSACTION.RFQ_PART_COSTING_STATE, { id: rfqAssyID }, { reload: true });
      }
      else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PLANBOM_SUBMIT_NO_PARTS);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          updateReadyForPricing(false);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    const updateReadyForPricing = (isReadyPricing) => {
      PlannedBOMFactory.updateReadyForPricingAssy().query({ isReadyForPricing: isReadyPricing, id: rfqAssyID}).$promise.then(() => {
        $scope.$emit('isReadyForPricing', isReadyPricing);
        vm._isreadyForPricing = isReadyPricing;
        BOMFactory.isBOMChanged = isReadyPricing;
        getAssyDetail();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get line item details
    function getConsolidateLineItems() {
      return PlannedBOMFactory.getConsolidateLineItems().query({ rfqAssyID: rfqAssyID }).$promise.then((response) => response.data).catch((error) => BaseService.getErrorLog(error));
    }
    function getPricingDetails() {
      const pObj = {
        assyID: parseInt(rfqAssyID),
        IsDeleted: false,
        isPurchaseApi: false
      };
      return PartCostingFactory.retrievePricing().query({ pricingObj: pObj }).$promise.then((pricing) => {
        if (pricing && pricing.data) {
          vm.pricingList = pricing.data.pricing;
          return pricing.data.pricing;
        }
      });
    }
    function callbackFunction(startDate, endDate) {
      const componentIds = _.map(_.uniqBy(vm.pricingList, 'PartNumberId'), 'PartNumberId');
      const pObj = {
        timeStamp: startDate,
        toDate: endDate,
        componentID: componentIds
      };
      return PartCostingFactory.retrievePriceBreak().query({ pricingObj: pObj }).$promise.then((qtyBreak) => {
        if (qtyBreak && qtyBreak.data) {
          vm.qtyBreakList = qtyBreak.data.qtyBreak;
        }
        return vm.qtyBreakList;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get object for price break and assy break
    function getAssyBreak(assyRequestQty, ApinoOfPosition, bomNoOfPosition, Qpa, Multiplier, Minimum, billUOM, componentUOM, packageQty, qtyBreakList, QtyID, consolidateID, connectorTypeID, noOfrows, AdditionalValueFee, isCustom) {
      let unitPrice;
      let price;
      var leadTime = null;
      var bomUom = _.find(vm.UnitList, (uom) => billUOM && parseInt(uom.id) === parseInt(billUOM));
      var compUom = _.find(vm.UnitList, (uom) => componentUOM && parseInt(uom.id) === parseInt(componentUOM));
      var requestQty = parseInt(assyRequestQty) * (Qpa ? Qpa : 1);
      if (bomUom && compUom) {
        const fromBasedUnitValues = (bomUom.baseUnitConvertValue) * (packageQty ? packageQty : 1);
        const toBasedUnitValues = compUom.baseUnitConvertValue;
        const ConvertFromValueIntoBasedValue = (requestQty / fromBasedUnitValues);
        requestQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) === 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
      }
      if (ApinoOfPosition && connectorTypeID && parseInt(connectorTypeID) === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
        bomNoOfPosition = bomNoOfPosition ? bomNoOfPosition : 1;
        requestQty = requestQty * (bomNoOfPosition);
        const noOfPositionDiff = parseFloat((ApinoOfPosition) - ((ApinoOfPosition) % (bomNoOfPosition)));
        if (noOfPositionDiff === 0) {
          return;
        }
        requestQty = requestQty / noOfPositionDiff;
      }
      let ordQty = Math.max((Math.ceil((requestQty) / Multiplier) * Multiplier), Minimum);
      const ActualQty = angular.copy(ordQty);
      let priceBreakDetail;
      if (isCustom) {
        const settingType = RFQTRANSACTION.PRICE_SELECTEION_SETTING_TYPE.CUSTOM_PART_SELECTION.value;
        const setting = _.find(vm.pricingsetting, (set) => parseInt(set.requestQty) === parseInt(assyRequestQty) && set.settingType === settingType);
        if (setting && setting.isLeadTime) {
          let consolidateList = _.filter(qtyBreakList, (consolidate) => parseInt(consolidate.qty) === parseInt(ordQty));
          if (consolidateList.length === 0) {
            let pricelst = _.orderBy(_.filter(qtyBreakList, (consolidate) => consolidate.qty < ordQty && consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1)), ['qty', 'price'], ['ASC', 'ASC']);
            if (pricelst.length > 0) {
              priceBreakDetail = pricelst[pricelst.length - 1];
            }
            else {
              pricelst = _.orderBy(_.filter(qtyBreakList, (consolidate) => consolidate.qty < ordQty), ['qty', 'price'], ['ASC', 'ASC']);
              if (pricelst.length > 0) {
                priceBreakDetail = pricelst[pricelst.length - 1];
              } else {
                priceBreakDetail = _.orderBy(qtyBreakList, ['qty', 'price'], ['ASC', 'ASC'])[0];
              }
            }
          } else {
            const actualConsolidateList = angular.copy(consolidateList);
            consolidateList = _.filter(consolidateList, (consolidate) => consolidate.leadTime <= (setting.leadTime ? setting.leadTime : 1));
            if (consolidateList.length === 0) {
              consolidateList = actualConsolidateList;
            }
            priceBreakDetail = _.minBy(consolidateList, 'price');
          }
        }
        else {
          const consolidateList = _.filter(qtyBreakList, (consolidate) => parseInt(consolidate.qty) === parseInt(ordQty));
          if (consolidateList.length === 0) {
            const pricelst = _.orderBy(_.filter(qtyBreakList, (consolidate) => consolidate.qty < ordQty), ['qty', 'price'], ['ASC', 'ASC']);
            if (pricelst.length > 0) {
              priceBreakDetail = pricelst[pricelst.length - 1];
            }
            else {
              priceBreakDetail = _.orderBy(qtyBreakList, ['qty', 'price'], ['ASC', 'ASC'])[0];
            }
          } else {
            priceBreakDetail = _.minBy(consolidateList, 'price');
          }
        }
      } else {
        priceBreakDetail = _.find(qtyBreakList, (qtyBreak) => parseInt(qtyBreak.qty) === parseInt(ordQty));
      }
      if (priceBreakDetail) {
        unitPrice = parseFloat(priceBreakDetail.price);
        price = parseFloat((priceBreakDetail.price * ordQty).toFixed(5));
        leadTime = parseInt(priceBreakDetail.leadTime);
      }
      else {
        let priceList = _.sortBy(_.filter(qtyBreakList, (qtyBreak) => qtyBreak.qty < ordQty), (o) => o.qty);
        if (priceList.length === 0) {
          priceList = _.sortBy(qtyBreakList, (qtyBreak) => qtyBreak.qty);
        }
        unitPrice = parseFloat(priceList[priceList.length - 1].price);
        price = parseFloat((priceList[priceList.length - 1].price * ordQty).toFixed(5));
        leadTime = parseInt(priceList[priceList.length - 1].leadTime);
      }
      let ActualPrice = angular.copy(unitPrice);
      if (bomUom && compUom) {
        unitPrice = (unitPrice * (compUom.baseUnitConvertValue ? compUom.baseUnitConvertValue : 1)) / ((packageQty ? packageQty : 1) * (bomUom.baseUnitConvertValue ? bomUom.baseUnitConvertValue : 1));
        const toBasedUnitValues = (bomUom.baseUnitConvertValue) * (packageQty ? packageQty : 1);
        const fromBasedUnitValues = compUom.baseUnitConvertValue;
        const ConvertFromValueIntoBasedValue = (ordQty / fromBasedUnitValues);
        ordQty = parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues)) === 0 ? 1 : parseInt(Math.ceil(ConvertFromValueIntoBasedValue * toBasedUnitValues));
        requestQty = parseInt(assyRequestQty * (Qpa ? Qpa : 1));
      }
      if (ApinoOfPosition && connectorTypeID && parseInt(connectorTypeID) === RFQTRANSACTION.DEFAULT_ID.HEADER_BREAKWAY) {
        ordQty = ordQty * (ApinoOfPosition);
        unitPrice = unitPrice / (ApinoOfPosition);
        requestQty = requestQty * (bomNoOfPosition);
      }
      if (AdditionalValueFee) {
        //Add value for additional value
        const additionalValue = parseFloat(AdditionalValueFee) / parseInt(ordQty);
        unitPrice = unitPrice + additionalValue;
        ActualPrice = ActualPrice + additionalValue;
      }
      const assyQtyObj = {
        RfqAssyQtyId: QtyID,
        isDeleted: false,
        ConsolidateID: consolidateID,
        CurrentQty: assyRequestQty,
        OrderQty: parseInt(ordQty),
        leadTime: leadTime,
        PricePerPart: unitPrice,
        TotalDollar: parseFloat((parseFloat(unitPrice) * parseFloat(ordQty)).toFixed(6)),
        RequireQty: requestQty,
        ActualPrice: ActualPrice,
        ActualQty: ActualQty
      };
      return assyQtyObj;
    }
    //get not quoted line items and price settings
    function getPriceSettings() {
      return PartCostingFactory.getnonQuotedQty().query({ rfqAssyID: rfqAssyID, isPurchaseApi: false }).$promise.then((list) => {
        if (list && list.data) {
          return list.data;
        }
        return list.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }
  }
})();
