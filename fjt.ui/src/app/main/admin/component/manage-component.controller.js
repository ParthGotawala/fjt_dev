(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('ManageComponentController', ManageComponentController);

  /** @ngInject */
  function ManageComponentController($state, $q, $mdDialog, $rootScope, $scope, $stateParams, $timeout, PRICING, ComponentStandardDetailsFactory, DialogFactory, BaseService, CORE, USER,
    DataElementTransactionValueFactory, ComponentFactory, EntityFactory, uiSortableMultiSelectionMethods, PartCostingFactory, $mdMenu,
    ComponentDataelementFactory, $filter, RFQTRANSACTION, WORKORDER, BOMFactory, socketConnectionService, ManufacturerFactory, MasterFactory, TRANSACTION, HELPER_PAGE) {
    const vm = this;
    vm.IsDetailTab = false;
    vm.IsDocumentTab = false;
    vm.IsOtherDetailTab = false;
    vm.IsDataFieldTab = false;
    vm.IsCommentsTab = false;
    vm.IsBOMTab = false;
    vm.IsRFQTab = false;
    vm.IsHistoryTab = false;
    vm.IsOpeningStockTab = false;
    vm.IsSupplierApiResponseTab = false;
    vm.AssemblySalesPriceMatrixTab = false;
    vm.IsStandardsTab = false;
    vm.IspricingHistoryTab = false;
    vm.IsSpleQuoteListTab = false;
    vm.IsPOListTab = false;
    vm.IsUMIDListTab = false;
    vm.IsWorkorderListTab = false;
    vm.isContainMasterDataField = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.PartMasterTabs = USER.PartMasterTabs;
    vm.documentTabName = CORE.DocumentTabName;
    vm.standardTabName = CORE.StandardTabName;
    vm.componentDetailTabName = CORE.ComponentDetailTabName;
    vm.customerLOATabName = CORE.customerLOATabName;
    vm.entityName = CORE.AllEntityIDS.Component.Name;
    vm.OtherDetailTabName = CORE.OtherDetailTabName;
    vm.CommentsTabName = CORE.CommentsTabName;
    vm.BOMTabName = CORE.BOMTabName;
    vm.DataFieldTabName = CORE.DataFieldTabName;
    vm.HistoryTabName = CORE.ComponentHistoryTabName;
    vm.OpeningStockTabName = CORE.ComponentOpeningStockTabName;
    vm.SupplierApiResponseTabName = CORE.ComponentSupplierApiResponseTabName;
    vm.ComponentAssemblySalesPriceMatrixTabName = CORE.ComponentAssemblySalesPriceMatrixTabName;
    vm.SupplierQuoteTabName = CORE.SupplierQuoteTabName;
    vm.pricingHistory = CORE.pricingHistoryTabName;
    vm.POListTabName = CORE.POListTabName;
    vm.KitAllocationTabName = CORE.KitAllocationTabName;
    vm.RFQTabName = CORE.RFQTabName;
    vm.UMIDListTabName = CORE.UMIDListTabName;
    vm.WorkorderListTabName = CORE.WorkorderListTabName;
    vm.DFMTabName = CORE.DFMTabName;
    vm.ApprovedDisapprovedSupplierTabName = CORE.ApprovedDisapprovedSupplierTabName;
    vm.pricingHistoryEmptyMesssage = USER.ADMIN_EMPTYSTATE.PRICING_HISTROY;
    vm.customerLOAEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_CUSTOMER_LOA;
    vm.customerLOAEmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.customerLOAEmptyMesssage.ADDNEWMESSAGE, 'customer');
    vm.customerLOAEmptyMesssage.MESSAGE = stringFormat(vm.customerLOAEmptyMesssage.MESSAGE, 'customer');
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ASSIGNFILEDS;
    vm.CertificateEmptyMesssage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
    vm.requestType = WORKORDER.ECO_REQUEST_TYPE;
    vm.inActivePartStatus = CORE.PartStatusList.InActiveInternal;
    let SubFormElementList = [];
    let _dataElementAddedList = [];
    let _dataElementNoAddedList = [];
    vm.SearchAddedListElement = null;
    vm.SearchNoAddedListElement = null;
    vm.mfgType = $state && $state.$current && $state.$current.parent && $state.$current.parent.name === USER.ADMIN_MANAGEDISTCOMPONENT_STATE ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG;
    vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
    vm.cid = $stateParams.coid;
    vm.subcoid = $stateParams.subTab;
    vm.tabName = $stateParams.selectedTab;
    vm.docOpenType = $stateParams.docOpenType; //In  part document tab  , docOpenType : 0-normal rout , 1-to open operator folder , 2- to upload image
    vm.dataElementList = [];
    vm.entityID = CORE.AllEntityIDS.Component.ID;
    vm.Entity = CORE.Entity.Component;
    vm.loginUser = BaseService.loginUser;
    vm.isReadOnly = BaseService.loginUser && BaseService.loginUser.RO ? BaseService.loginUser.RO : false;
    const date = new Date();
    date.setDate(date.getDate() - 30);
    vm.toDate = new Date();
    vm.fromDate = date;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsFromPickerOpen = {};
    vm.IsFromPickerOpen[vm.DATE_PICKER.fromDate] = false;
    vm.IsToPickerOpen = {};
    vm.IsToPickerOpen[vm.DATE_PICKER.toDate] = false;
    vm.CustomPriceDropdown = CORE.CustomPriceDropdown;
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.loaEntityname = CORE.AllEntityIDS.COMPONENT_CUSTOMER_LOA.Name;
    vm.showstatus = false;
    vm.isEditIntigrate = false;
    const dataelementInputFieldList = CORE.InputeFields;
    vm.partSearchList = [];
    vm.selectedTabIndex;
    vm.PartCategory = CORE.PartCategory;
    vm.PartType = CORE.PartType;
    vm.RequirmentCategory = CORE.RequirmentCategory;
    vm.tmaxIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_ICON);
    vm.tmaxYellowIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_YELLOW_ICON);
    vm.exportControlledIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.EXPORT_CONTROLLED_ICON);
    vm.inActiveImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.IN_ACTIVE_IMAGE);
    vm.documentFolderName = ''; // Put file in Operator for docOpenType = 2
    $scope.splitPaneProperties = {};
    $scope.splitSubPaneProperties = {};
    vm.enableDeleteOperation = false;
    vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.actionType = TRANSACTION.StartStopActivityActionType;
    vm.pageTabRights = [
      {
        DetailTab: { hasPermission: false, isReadOnly: false },
        POListTab: { hasPermission: false, isReadOnly: false },
        StandardTab: { hasPermission: false, isReadOnly: false },
        DocumentTab: { hasPermission: false, isReadOnly: false },
        DataFieldTab: { hasPermission: false, isReadOnly: false },
        OtherDetailTab: { hasPermission: false, isReadOnly: false },
        PricingHistoryTab: { hasPermission: false, isReadOnly: false },
        SupplierQuoteTab: { hasPermission: false, isReadOnly: false },
        CustomerLOATab: { hasPermission: false, isReadOnly: false },
        CommentsTab: { hasPermission: false, isReadOnly: false },
        RFQTab: { hasPermission: false, isReadOnly: false },
        BOMTab: { hasPermission: false, isReadOnly: false },
        KitAllocationTab: { hasPermission: false, isReadOnly: false },
        UMIDListTab: { hasPermission: false, isReadOnly: false },
        DFMTab: { hasPermission: false, isReadOnly: false },
        SupplierApiResponseTab: { hasPermission: false, isReadOnly: false },
        OpeningStockTab: { hasPermission: false, isReadOnly: false },
        ApprovedDisapprovedSupplierTab: { hasPermission: false, isReadOnly: false },
        AssemblySalesPriceMatrixTab: { hasPermission: false, isReadOnly: false },
        ComponentHistoryTab: { hasPermission: false, isReadOnly: false },
        WorkorderListTab: { hasPermission: false, isReadOnly: false }
      }];
    vm.fromDateOptions = {
      fromDateOpenFlag: false
    };
    vm.toDateOptions = {
      toDateOpenFlag: false
    };
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    if (vm.mfgType) {
      vm.mfgTypeName = vm.mfgType ? (vm.mfgType.toUpperCase() === vm.mfgTypeDist ? vm.LabelConstant.MFG.Supplier : vm.LabelConstant.MFG.MFG) : null;
    } else {
      $state.go(HELPER_PAGE.NOT_FOUND_STATE);
    }
    vm.documentCount = 0;
    vm.bomLineItemCount = 0;
    let reTryCount = 0;
    const getAllRights = () => {
      $scope.$applyAsync(() => {
        vm.enableDeleteOperation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeletePart);
        vm.enableEditAutoEntry = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UpdatePartMasterAutoEntry);
        if ((!vm.enableEditAutoEntry) && reTryCount < _configGetFeaturesRetryCount) {
          getAllRights(); //put for hard reload option as it will not get data from feature rights
          reTryCount++;
          //console.log(reTryCount);
        }
      });
    };
    vm.FullDateTimeFormat = _dateTimeFullTimeDisplayFormat;

    if (vm.docOpenType === 2) {
      vm.documentFolderName = 'Operator';
    }
    else {
      vm.documentFolderName = '';
    }
    vm.openMenu = function ($mdMenu, ev) {
      //'originatorEv = ev;
      $mdMenu.open(ev);
    };
    // on reload
    /*let stateChangeSuccessCall = $scope.$on('$viewContentLoaded', function () {
      $timeout(() => {
        getAllRights();
      }, _configTimeout);
    });*/
    $scope.$on('$stateChangeSuccess', () => {
      $timeout(() => {
        getAllRights();
      }, _configTimeout);
    });

    //get data for mfgcode
    vm.getSupplierCode = () => {
      var searchObj = {
        mfgType: CORE.MFG_TYPE.DIST,
        isCodeFirst: true
      };

      return ManufacturerFactory.getAllManufacturerWithFormattedCodeList(searchObj).query().$promise.then((mfgcodes) => {
        vm.SupplierList = [];
        if (mfgcodes && mfgcodes.data) {
          vm.SupplierList = mfgcodes.data;
        }
        return $q.resolve(vm.SupplierList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //set css class to hide tabs
    vm.setTabClass = (tabName) => {
      var className = '';
      switch (tabName) {
        case USER.PartMasterTabs.AssemblySalesPriceMatrix.Name:
        case USER.PartMasterTabs.ApprovedDisapprovedSupplier.Name:
          if ((vm.mfgType.toUpperCase()) === vm.mfgTypeDist) {
            className = 'cm-normal-hide-imp';
          }
          break;
        default:
      }
      return className;
    };
    function setTabWisePageRights(pageList) {
      var tab;
      const isSupplierPart = vm.mfgType === CORE.MFG_TYPE.DIST ? true : false;
      if (pageList && pageList.length > 0) {
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].DetailTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DetailTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_PO_LIST_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_PO_LIST_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].POListTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].POListTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_STANDARDS_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_STANDARDS_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].StandardTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].StandardTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_DOCUMENT_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].DocumentTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DocumentTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_DATAFIELDS_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_DATAFIELDS_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].DataFieldTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DataFieldTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_OTHERDETAIL_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_OTHERDETAIL_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].OtherDetailTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].OtherDetailTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_PRICINGHISTORY_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_PRICINGHISTORY_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].PricingHistoryTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].PricingHistoryTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_SPLRQUOTE_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_SPLRQUOTE_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].SupplierQuoteTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].SupplierQuoteTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_CUSTOMERLOA_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_CUSTOMERLOA_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].CustomerLOATab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].CustomerLOATab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_COMMENTS_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_COMMENTS_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].CommentsTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].CommentsTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_RFQ_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_RFQ_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].RFQTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].RFQTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_BOM_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_BOM_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].BOMTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].BOMTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_SUPPLIER_API_RESPONSE_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_SUPPLIER_API_RESPONSE_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].SupplierApiResponseTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].SupplierApiResponseTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_OPENING_STOCK_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_OPENING_STOCK_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].OpeningStockTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].OpeningStockTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_COMPONENT_ASSEMBLY_SALES_PRICE_MATRIX_STATE && !isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].AssemblySalesPriceMatrixTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].AssemblySalesPriceMatrixTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_COMPONENT_HISTORY_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_COMPONENT_HISTORY_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].ComponentHistoryTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].ComponentHistoryTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_KIT_ALLOCATION_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_KIT_ALLOCATION_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].KitAllocationTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].KitAllocationTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_UMID_LIST_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_UMID_LIST_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].UMIDListTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].UMIDListTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_DFM_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_DFM_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].DFMTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].DFMTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_APPROVED_DISAPPROVED_SUPPLIER_STATE && !isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].ApprovedDisapprovedSupplierTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].ApprovedDisapprovedSupplierTab.isReadOnly = tab.RO ? true : false;
        }
        tab = pageList.find((a) => a.PageDetails && ((a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_WORKORDER_STATE && !isSupplierPart)
          || (a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_WORKORDER_STATE && isSupplierPart)));
        if (tab) {
          vm.pageTabRights[0].WorkorderListTab.hasPermission = tab.isActive ? true : false;
          vm.pageTabRights[0].WorkorderListTab.isReadOnly = tab.RO ? true : false;
        }
      }
    }

    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        var menudata = data;
        setTabWisePageRights(menudata);
        $scope.$applyAsync();
      });
      initAutoCompleteSearchPart();
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    if (vm.tabName) {
      const tab = _.find(USER.PartMasterTabs, (item) => item.Name === vm.tabName);
      if (tab) {
        vm.selectedTabIndex = tab.ID;
      }
    }

    let rejectIndex = -1;
    _.each(vm.SupplierList, (item, index) => {
      if (item.Value === 7) {
        rejectIndex = index;
      }
    });
    if (rejectIndex !== -1) {
      vm.SupplierList.splice(rejectIndex, 1);
    }
    vm.openPicker = (type, ev) => {
      if (ev.keyCode === 40) {
        vm.IsFromPickerOpen[type] = true;
      }
    };

    vm.priceSelectorDateReset = () => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      vm.toDate = new Date();
      vm.fromDate = date;
      vm.selectedPrice = 'latestPrice';
      vm.autoCompletePricingDist.keyColumnId = PRICING.SUPPLIER_CODE.DigiKey.Id;
      initPageInfo();
      vm.loadData();
    };
    function setDefaultDate() {
      var date = new Date();
      date.setDate(date.getDate() - 30);
      vm.toDate = new Date();
      vm.fromDate = date;
    }

    vm.fromDateChanged = () => {
      vm.selectedLtbDate = vm.fromDate ? $filter('date')(new Date(vm.fromDate), vm.DefaultDateFormat) : null;
      if (vm.fromDate > vm.toDate) {
        vm.toDate = null;
      }
      vm.fromDateOptions = {
        fromDateOpenFlag: false
      };
    };

    vm.toDateChanged = () => {
      vm.SelectedEolDate = vm.toDate ? $filter('date')(new Date(vm.toDate), vm.DefaultDateFormat) : null;
      if (vm.toDate < vm.fromDate) {
        vm.fromDate = null;
      }
      vm.toDateOptions = {
        toDateOpenFlag: false
      };
    };
    vm.toOpenPicker = (type, ev) => {
      if (ev.keyCode === 40) {
        vm.IsToPickerOpen[type] = true;
      }
    };

    vm.isEditComponent = true;
    //if set pagination from controller set true to here
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    const goToSelectedTab = () => {
      if (vm.mfgType.toLowerCase() === CORE.MFG_TYPE.MFG.toLowerCase()) {
        $state.go(USER.ADMIN_MFG_COMPONENT_STATE);
      } else {
        $state.go(USER.ADMIN_DIST_COMPONENT_STATE);
      }
    };
    vm.goBack = (msWizard) => {
      var dirtyForm = _.find(msWizard.forms, (item) => {
        (item.$name !== 'vm.pricingHistoryfrom' &&
          item.$name !== 'vm.customerLOA' &&
          item.$name !== 'vm.DFMForm' &&
          item.$dirty);
      });
      if (dirtyForm) {
        showWithoutSavingAlertforBackButton(undefined, dirtyForm);
      }
      else {
        goToSelectedTab();
      }
    };
    function showWithoutSavingAlertforBackButton(callback, form) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (callback) {
            callback();
          }
          else {
            if (form && form.$dirty) {
              form.$setPristine();
            }
            goToSelectedTab();
          }
        }
      }, () => {
        if (form) {
          /*Set focus on first enabled field when user click stay on button*/
          BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(form);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.CheckStepAndAction = (msWizard, isSave, ev) => {
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.issave = isSave;
      /* Detail tab */
      if (msWizard.selectedIndex === USER.PartMasterTabs.Detail.ID) {
        if (!(vm.isSaveDisabled(msWizard) && !vm.enableEditAutoEntry &&
          vm.displayComponentDetail.createdBy === 'Auto')) {
          vm.mvizard = msWizard;
          $scope.$broadcast('checkComponent', ev);
        }
      }
      /* Alias & Alternate Groups */
      else if (msWizard.selectedIndex === USER.PartMasterTabs.POList.ID) {
        msWizard.nextStep();
        //vm.selectedTabIndex = vm.selectedTabIndex + 1;
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /* Standards */
      else if (msWizard.selectedIndex === USER.PartMasterTabs.Standard.ID) {
        if (BaseService.focusRequiredField(vm.componentstandardDetails)) {
          return;
        }
        if (!isSave) {
          if (vm.componentstandardDetails && vm.componentstandardDetails.$dirty) {
            showWithoutSavingAlertforBackButton(() => {
              vm.componentstandardDetails.$setPristine();
              msWizard.nextStep();
            }, vm.componentstandardDetails);
          }
          else {
            msWizard.nextStep();
          }
          //vm.selectedTabIndex = vm.selectedTabIndex + 1;
          vm.selectedTabIndex = msWizard.selectedIndex;
          vm.stateTransfer(vm.selectedTabIndex);
          return;
        }
        else {
          if (msWizard.selectedIndex === USER.PartMasterTabs.Standard.ID) {
            $scope.$broadcast('standardComponent');

            $scope.$on('setstandardFrom', (evt, data) => {
              if (data === 'SUCCESS') {
                vm.componentstandardDetails.$setPristine();
              }
            });
          }
        }
      }
      /* Documents */
      else if (msWizard.selectedIndex === USER.PartMasterTabs.Document.ID) {
        if (!vm.issave) {
          msWizard.nextStep();
          //vm.selectedTabIndex = vm.selectedTabIndex + 1;
          vm.selectedTabIndex = msWizard.selectedIndex;
          vm.stateTransfer(vm.selectedTabIndex);
          return;
        }
      }
      /* Data Fields */
      else if (msWizard.selectedIndex === USER.PartMasterTabs.DataFields.ID) {
        msWizard.nextStep();
        //vm.selectedTabIndex = vm.selectedTabIndex + 1;
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
        return;
      }
      /* Miscellaneous */
      else if (msWizard.selectedIndex === USER.PartMasterTabs.OtherDetail.ID) {
        if (BaseService.focusRequiredField(vm.wizardOtherDetail)) {
          return;
        }
        if (!vm.issave) {
          const isChanged = BaseService.checkFormDirty(vm.wizardOtherDetail, null);
          vm.showWithoutSavingAlertforNextPrevious(msWizard, false, isChanged, false, vm.wizardOtherDetail);
          return;
        }
        else {
          vm.finish();
          return;
        }
      }
      /* Pricing History */
      else if (msWizard.selectedIndex === USER.PartMasterTabs.PricingHistory.ID) {
        msWizard.nextStep();
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /* Customer LOA */
      else if (msWizard.selectedIndex === USER.PartMasterTabs.CustomerLOA.ID) {
        msWizard.nextStep();
        //vm.selectedTabIndex = vm.selectedTabIndex + 1;
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
        //vm.finish();
      }
      /*Comments*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.Comments.ID) {
        msWizard.nextStep();
        //vm.selectedTabIndex = vm.selectedTabIndex + 1;
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*RFQ*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.RFQ.ID) {
        msWizard.nextStep();
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*BOM*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.BOM.ID) {
        msWizard.nextStep();
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*Kit Allocation*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.KitAllocation.ID) {
        msWizard.nextStep();
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*UMID List*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.UMIDList.ID) {
        msWizard.nextStep();
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*WO List*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.WorkorderList.ID) {
        msWizard.nextStep();
        //vm.selectedTabIndex = vm.selectedTabIndex + 1;
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*DFM*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.DFM.ID) {
        vm.selectedTabIndex = msWizard.selectedIndex;
        msWizard.nextStep();
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*Supplier Api Response*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.SupplierApiResponse.ID) {
        vm.selectedTabIndex = msWizard.selectedIndex;
        msWizard.nextStep();
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*Initial Stock*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.OpeningStock.ID) {
        vm.selectedTabIndex = msWizard.selectedIndex;
        msWizard.nextStep();
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*Component Approved Disapproved Supplier*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.ApprovedDisapprovedSupplier.ID) {
        msWizard.nextStep();
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.stateTransfer(vm.selectedTabIndex);
      }
      /*Sales Price Matrix*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.AssemblySalesPriceMatrix.ID) {
        vm.mvizard = msWizard;
        $scope.$broadcast(USER.ComponentAssySalesPriceSaveBroadcast, ev);
      }
      /*History*/
      else if (msWizard.selectedIndex === USER.PartMasterTabs.ComponentHistory.ID) {
        vm.selectedTabIndex = msWizard.selectedIndex;
        vm.finish();
        vm.stateTransfer(vm.selectedTabIndex);
      }
    };

    // Don't allow to select multiple class from same standard it should work like radio button
    vm.AllowToSelect = (category, categoryList, standard) => {
      const val = category.selected;
      categoryList = _.each(categoryList, (item) => { item.selected = false; });
      category.selected = val;
      vm.passwordProtected(standard);
    };

    // check standard is password protect than set flag
    vm.passwordProtected = (standardDet) => {
      if (standardDet.passwordProtected) {
        ispasswordProtected = true;
      }
    };

    vm.addUpdateComponent = (id) => {
      if (id) {
        vm.cid = id;
        $scope.$broadcast('continueProcess', vm.cid);
        /*var itemTabName = _.find(USER.PartMasterTabs, function (valItem) {
          return valItem.ID == vm.selectedTabIndex;
        })*/
        const routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
        $state.go(routeState, { coid: vm.cid/*, selectedTab: itemTabName.Name*/ });
      }
      vm.isSave = false;
    };

    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(USER.PartMasterTabs, (valItem) => valItem.ID === tabIndex);
      if (itemTabName && itemTabName.Name !== vm.tabName) {
        let routeState = '';
        switch (itemTabName.Name) {
          case USER.PartMasterTabs.Detail.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.POList.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_PO_LIST_STATE : USER.ADMIN_MANAGECOMPONENT_PO_LIST_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.Standard.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_STANDARDS_STATE : USER.ADMIN_MANAGECOMPONENT_STANDARDS_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.Document.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_STATE : USER.ADMIN_MANAGECOMPONENT_DOCUMENT_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.DataFields.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DATAFIELDS_STATE : USER.ADMIN_MANAGECOMPONENT_DATAFIELDS_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.OtherDetail.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_OTHERDETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_OTHERDETAIL_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.PricingHistory.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_PRICINGHISTORY_STATE : USER.ADMIN_MANAGECOMPONENT_PRICINGHISTORY_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.SupplierQuote.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_SPLRQUOTE_STATE : USER.ADMIN_MANAGECOMPONENT_SPLRQUOTE_STATE;
            if (vm.displayComponentDetail.isCustom || vm.displayComponentDetail.partType === vm.PartType.Other) {
              $state.go(routeState, { coid: vm.cid });
            }
            break;
          case USER.PartMasterTabs.CustomerLOA.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_CUSTOMERLOA_STATE : USER.ADMIN_MANAGECOMPONENT_CUSTOMERLOA_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.Comments.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_COMMENTS_STATE : USER.ADMIN_MANAGECOMPONENT_COMMENTS_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.RFQ.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_RFQ_STATE : USER.ADMIN_MANAGECOMPONENT_RFQ_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.BOM.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_BOM_STATE : USER.ADMIN_MANAGECOMPONENT_BOM_STATE;
            $state.go(routeState, { coid: vm.cid, subTab: vm.cid });
            break;
          case USER.PartMasterTabs.KitAllocation.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_KIT_ALLOCATION_STATE : USER.ADMIN_MANAGECOMPONENT_KIT_ALLOCATION_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.UMIDList.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_UMID_LIST_STATE : USER.ADMIN_MANAGECOMPONENT_UMID_LIST_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.WorkorderList.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_WORKORDER_STATE : USER.ADMIN_MANAGECOMPONENT_WORKORDER_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.OpeningStock.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_OPENING_STOCK_STATE : USER.ADMIN_MANAGECOMPONENT_OPENING_STOCK_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.SupplierApiResponse.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_SUPPLIER_API_RESPONSE_STATE : USER.ADMIN_MANAGECOMPONENT_SUPPLIER_API_RESPONSE_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.AssemblySalesPriceMatrix.Name:
            $state.go(USER.ADMIN_MANAGECOMPONENT_COMPONENT_ASSEMBLY_SALES_PRICE_MATRIX_STATE, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.ComponentHistory.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_COMPONENT_HISTORY_STATE : USER.ADMIN_MANAGECOMPONENT_COMPONENT_HISTORY_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.DFM.Name:
            routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DFM_STATE : USER.ADMIN_MANAGECOMPONENT_DFM_STATE;
            $state.go(routeState, { coid: vm.cid });
            break;
          case USER.PartMasterTabs.ApprovedDisapprovedSupplier.Name:
            $state.go(USER.ADMIN_MANAGECOMPONENT_APPROVED_DISAPPROVED_SUPPLIER_STATE, { coid: vm.cid });
            break;
          default:
        }
      }
    };

    vm.isStepValid = function (step) {
      switch (step) {
        case USER.PartMasterTabs.Detail.ID: {
          //var isDirty = vm.componentForm && vm.componentForm.$dirty || BaseService.currentPageForms[1] && BaseService.currentPageForms[1].$dirty;
          const isDirty = _.find(BaseService.currentPageForms, (form) => form && form.$dirty);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step, vm.componentForm);
          }
          else {
            return true;
          }
          break;
        }
        case USER.PartMasterTabs.POList.ID: {
          break;
        }
        case USER.PartMasterTabs.Standard.ID: {
          const isDirty = vm.componentstandardDetails && vm.componentstandardDetails.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step, vm.componentstandardDetails);
          }
          else {
            return true;
          }
          break;
        }
        case USER.PartMasterTabs.Document.ID: {
          return true;
          break;
        }
        case USER.PartMasterTabs.DataFields.ID: {
          return true;
          break;
        }
        case USER.PartMasterTabs.OtherDetail.ID: {
          const isDirty = vm.wizardOtherDetail && vm.wizardOtherDetail.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step, vm.wizardOtherDetail);
          }
          else {
            return true;
          }
          break;
        }
        case USER.PartMasterTabs.PricingHistory.ID: {
          return true;
        }
        case USER.PartMasterTabs.CustomerLOA.ID: {
          const isDirty = vm.customerLOA && vm.customerLOA.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step, vm.customerLOA);
          }
          else {
            return true;
          }
          break;
        }
        case USER.PartMasterTabs.RFQ.ID: {
          //var isDirty = vm.bomForm && vm.bomForm.$dirty;
          const isDirty = BOMFactory.isBOMChanged;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            BOMFactory.bomSelectedFilter = null;
            return true;
          }
          break;
        }
        case USER.PartMasterTabs.AssemblySalesPriceMatrix.ID: {
          const isDirty = vm.componentAssemblySalesPriceMatrixForm && vm.componentAssemblySalesPriceMatrixForm.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step, vm.componentAssemblySalesPriceMatrixForm);
          }
          else {
            return true;
          }
          break;
        }
      }
    };

    vm.componentPN = (mfgPN) => {
      vm.mfgPN = '' + '#:' + mfgPN;
    };

    function checkExportControlledPart() {
      vm.isExportControlled = false;
      if (vm.displayComponentDetail &&
        vm.displayComponentDetail.componetStandardDetail &&
        vm.displayComponentDetail.componetStandardDetail.length > 0) {
        const exportControlledStandards = _.find(vm.displayComponentDetail.componetStandardDetail, (item) => item.certificateStandard.isExportControlled === true);
        if (exportControlledStandards) {
          vm.isExportControlled = true;
        }
      }
    }

    function getPartDynamicAttributeDetails() {
      if (vm.cid) {
        vm.cgBusyLoading = ComponentFactory.getPartDynamicAttributeDetails().query({ id: vm.cid }).$promise.then((res) => {
          if (res && res.data) {
            res.data.map((item) => {
              if (!item.icon || item.icon === '') {
                item.icon = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH + CORE.NO_IMAGE_ROHS;
              } else {
                item.icon = CORE.WEB_URL + USER.DYNAMIC_ATTRIBUTE_BASE_PATH + item.icon;
              }
            });
            vm.PartOperationalAttributeDetails = res.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    function startBOMActivityTimer() {
      vm.bomActivityDetails.currentTimerDiff = '';
      if (vm.bomActivityDetails.isActivityStart) {
        const searchObj = {
          pPartID: vm.displayComponentDetail.id
        };
        vm.cgBusyLoading = ComponentFactory.getComponentActivityStartTime().query({ listObj: searchObj }).$promise.then((activityTime) => {
          if (activityTime && activityTime.data && activityTime.data.length) {
            if (vm.bomActivityDetails && vm.bomActivityDetails.tickActivity) {
              clearInterval(vm.bomActivityDetails.tickActivity);
            }
            vm.bomActivityDetails = activityTime.data[0];
            vm.bomActivityDetails.activityStartAtDisplayFormat = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.bomActivityDetails.activityStartAt, vm.FullDateTimeFormat);
            vm.bomActivityDetails.tickActivity = setInterval(() => {
              const currDate = getCurrentUTC();
              vm.bomActivityDetails.timeDiffSec = calculateSeconds(vm.bomActivityDetails.activityStartAt, currDate);
              vm.bomActivityDetails.currentTimerDiff = secondsToTime(vm.bomActivityDetails.timeDiffSec, true);
            }, _configSecondTimeout);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        if (vm.bomActivityDetails && vm.bomActivityDetails.tickActivity) {
          clearInterval(vm.bomActivityDetails.tickActivity);
        }
      }
    }

    // Get part category master list
    function getPartCategoryMstList() {
      if (Array.isArray(vm.categoryList) && vm.categoryList.length > 0) {
        const categoryDetail = vm.categoryList.find((item) => item.id === vm.displayComponentDetail.partType);
        vm.displayComponentDetail.categoryName = categoryDetail ? categoryDetail.Value : null;
      } else {
        return MasterFactory.getPartCategoryMstList().query().$promise.then((response) => {
          if (response && response.data) {
            vm.categoryList = response.data.map((item) => ({
              id: item.id,
              Value: item.categoryName
            }));

            if (vm.displayComponentDetail.partType) {
              const categoryDetail = vm.categoryList.find((item) => item.id === vm.displayComponentDetail.partType);
              vm.displayComponentDetail.categoryName = categoryDetail ? categoryDetail.Value : null;
            }
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      }
    }

    function setTemperatureToolTip() {
      if (vm.displayComponentDetail.componentTemperature && vm.displayComponentDetail.componentTemperature.length > 0) {
        vm.temperatureSensetiveTooltip = stringFormat(USER.ADMIN_EMPTYSTATE.COMPONENT_TEMPERATURE.TOOLTIPMESSAGE, vm.displayComponentDetail.componentTemperature[0].pickTemperatureAbove, ((vm.displayComponentDetail.componentTemperature[0].timeLiquidusSecond) ? vm.displayComponentDetail.componentTemperature[0].timeLiquidusSecond : '?'));
      }
      else if (vm.displayComponentDetail.rfqPartType.isTemperatureSensitive) {
        vm.temperatureSensetiveTooltip = USER.ADMIN_EMPTYSTATE.COMPONENT_TEMPERATURE.TOOLTIPMESSAGE_FOR_YELLOW_ICON;
      }
      else {
        vm.temperatureSensetiveTooltip = null;
      }
    }
    vm.getComponentDetail = (componentDetail) => {
      vm.displayComponentDetail = componentDetail;
      vm.bomActivityDetails = { isActivityStart: vm.displayComponentDetail.isActivityStart };
      setRoHSDetails();
      setTemperatureToolTip();
      checkExportControlledPart();
      startBOMActivityTimer();
      getPartCategoryMstList();
    };

    vm.getComponentStandards = (componentStandards) => {
      vm.selectedStandard = componentStandards;
      vm.displayComponentDetail.componetStandardDetail = componentStandards;
      checkExportControlledPart();
    };

    function getComponentMaxTemperatureData() {
      if (vm.cid) {
        return ComponentFactory.getComponentMaxTemperatureData().query({
          id: vm.cid
        }).$promise.then((componentTemperature) => {
          if (componentTemperature && componentTemperature.data) {
            vm.displayComponentDetail.componentTemperature = [];
            vm.displayComponentDetail.componentTemperature = componentTemperature.data;
          }
          setTemperatureToolTip();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step, form) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.isSave = false;
          switch (step) {
            case USER.PartMasterTabs.Detail.ID:
              $scope.$broadcast('componentInit');
              vm.componentForm.$setPristine();
              /*BaseService.currentPageForms[1].$setPristine();*/
              if (BaseService.currentPageForms) {
                _.each(BaseService.currentPageForms, (objform) => {
                  objform.$setPristine();
                });
              }
              return true;
              break;
            case USER.PartMasterTabs.Standard.ID:
              vm.componentstandardDetails.$setPristine();
              return true;
              break;
            case USER.PartMasterTabs.Document.ID:
              //vm.componentDocuments.$setPristine();
              return true;
              break;
            case USER.PartMasterTabs.OtherDetail.ID:
              vm.wizardOtherDetail.$setPristine();
              return true;
              break;
            case USER.PartMasterTabs.PricingHistory.ID:
              vm.pricingHistoryfrom.$setPristine();
              return true;
              break;
            case USER.PartMasterTabs.CustomerLOA.ID:
              vm.customerLOA.$setPristine();
              return true;
              break;
            case USER.PartMasterTabs.BOM.ID:
              //vm.bomForm.$setPristine();
              BaseService.currentPageFlagForm = [];
              BOMFactory.isBOMChanged = false;
              BOMFactory.bomSelectedFilter = null;
              return true;
              break;
            case USER.PartMasterTabs.AssemblySalesPriceMatrix.ID:
              vm.componentAssemblySalesPriceMatrixForm.$setPristine();
              return true;
              break;
          }
        }
      }, () => {
        if (form) {
          /*Set focus on first enabled field when user click stay on button*/
          BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(form);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* Show save alert popup when performing next and previous*/
    vm.showWithoutSavingAlertforNextPrevious = (msWizard, isSave, isChanged, isPrevious, form) => {
      if (!msWizard) {
        msWizard = vm.mvizard;
      }
      if (!isSave) {
        isSave = vm.issave;
      }
      const selectedIndex = msWizard.selectedIndex;
      //if (isPrevious) {
      //    selectedIndex = msWizard.selectedIndex - 1;
      //}
      if (isSave /*&& isChanged*/) {
        if (selectedIndex === 0) {
          $scope.$broadcast('saveComponent');
        }
      }
      else if (isSave && !isChanged) {
        return;
      }
      else {
        if (isChanged) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (selectedIndex === 0) {
                $scope.$broadcast('componentInit');
              }

              vm.isSave = false;
              vm.componentForm.$setPristine();
              vm.wizardOtherDetail.$setPristine();
              //vm.commentsForm.$setPristine();
              vm.historyForm.$setPristine();
              //vm.bomForm.$setPristine();
              BOMFactory.isBOMChanged = false;
              vm.componentAssemblySalesPriceMatrixForm.$setPristine();
              if (isPrevious) {
                msWizard.previousStep();
                vm.selectedTabIndex = vm.selectedTabIndex - 1;
                vm.stateTransfer(vm.selectedTabIndex);
              } else {
                msWizard.nextStep();
                vm.selectedTabIndex = vm.selectedTabIndex + 1;
                vm.stateTransfer(vm.selectedTabIndex);
              }
            }
          }, () => {
            if (form) {
              /*Set focus on first enabled field when user click stay on button*/
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(form);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (isPrevious) {
            msWizard.previousStep();
            vm.selectedTabIndex = vm.selectedTabIndex - 1;
            vm.stateTransfer(vm.selectedTabIndex);
          } else {
            msWizard.nextStep();
            vm.selectedTabIndex = vm.selectedTabIndex + 1;
            vm.stateTransfer(vm.selectedTabIndex);
          }
        }
      }
    };

    /*To save other value detail
    Note:If any step added after other detail just remove function body and add logic of last step
    */
    vm.fileList = {};
    vm.finish = () => {
      if (vm.pageTabRights[0].OtherDetailTab.isReadOnly) {
        return;
      }
      const dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.cid,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then(() => {
        // commented as per last discussion on 18/09/2018, no need to move to list will press back button
        //goToSelectedTab();
        vm.wizardOtherDetail.$setPristine();
        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);

        /* code for rebinding document to download - (actually all other details) */
        //if (vm.fileList && !_.isEmpty(vm.fileList)) {
        vm.IsOtherDetailTab = false;
        vm.fileList = {};
        $timeout(() => {
          vm.IsOtherDetailTab = true;
        }, 0);
        //}
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.checkFormDirty = () => BaseService.checkFormDirty(vm.wizardOtherDetail, null);

    /*component Standard tab */
    function getComponentStandardDetail() {
      if (vm.cid) {
        return ComponentStandardDetailsFactory.getcomponentstandardDetail().query({ id: vm.cid }).$promise.then((response) => {
          if (response && response.data) {
            vm.componentStandardDetaillist = response.data;
            //fatch selected standard
            vm.selectedStandard = [];
            _.each(vm.componentStandardDetaillist, (stdclass) => {
              stdclass.colorCode = CORE.DefaultStandardTagColor;
              stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
              stdclass.colorCode = stdclass.Standardclass ? (stdclass.Standardclass.colorCode ? stdclass.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
              stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
              stdclass.priority = stdclass.certificateStandard ? stdclass.certificateStandard.priority : null;
              vm.selectedStandard.push(stdclass);
            });
            vm.selectedStandard.sort(sortAlphabatically('priority', 'standard', true));
          }
        });
      }
    }
    getComponentStandardDetail();

    function setRoHSDetails() {
      vm.displayComponentDetail.rohsIcon = '';
      if (vm.displayComponentDetail && vm.displayComponentDetail.RoHSStatusID) {
        if (vm.displayComponentDetail.rfq_rohsmst && vm.displayComponentDetail.rfq_rohsmst.rohsIcon) {
          vm.displayComponentDetail.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.displayComponentDetail.rfq_rohsmst.rohsIcon;
        }
        else {
          vm.displayComponentDetail.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
        }
        vm.displayComponentDetail.rohsName = vm.displayComponentDetail.rfq_rohsmst.name;
        if (vm.displayComponentDetail.rfq_rohsmst.refMainCategoryID !== USER.NonRoHSMainCategoryId) {
          vm.displayComponentDetail.isRohs = true;
        }
        else {
          vm.displayComponentDetail.isRohs = false;
        }
      }
    };

    // BOM Start and Stop activity Socket Listeners
    function bomStartStopActivityListener(message) {
      if (message && message.partID === Number(vm.cid)) {
        getComponnetDetails();
      }
    }

    function getComponnetDetails() {
      if (vm.cid) {
        if (vm.bomActivityDetails && vm.bomActivityDetails.tickActivity) {
          clearInterval(vm.bomActivityDetails.tickActivity);
        }
        return ComponentFactory.component().query({
          id: vm.cid
        }).$promise.then((component) => {
          if (component && component.data) {
            const mfgType = component.data.mfgCodemst.mfgType;
            if (mfgType.toUpperCase() !== vm.mfgType.toUpperCase()) {
              const inValidMFGTypeName = (mfgType.toUpperCase() === vm.mfgTypeDist ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier);
              const mfgTypeName = (mfgType.toUpperCase() === vm.mfgTypeDist ? vm.LabelConstant.MFG.Supplier : vm.LabelConstant.MFG.MFG);
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.INVALID_SEARCH_PART);
              messageContent.message = stringFormat(messageContent.message, mfgTypeName, component.data.mfgPN, inValidMFGTypeName, mfgTypeName);

              const model = {
                messageContent: messageContent,
                multiple: true
              };
              const routeState = (mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
              return DialogFactory.messageAlertDialog(model).then(() => {
                $state.transitionTo(routeState, { mfgType: mfgType, coid: vm.cid }, { reload: true, location: true, inherit: true, notify: true });
              }).catch((error) => BaseService.getErrorLog(error));
            }

            vm.displayComponentDetail = component.data;
            vm.bomActivityDetails = { isActivityStart: vm.displayComponentDetail.isActivityStart };
            setRoHSDetails();
            getComponentMaxTemperatureData();
            checkExportControlledPart();
            getPartDynamicAttributeDetails();
            startBOMActivityTimer();
            getPartCategoryMstList();
            if (vm.isPricingHistoryGridVisible && (vm.mfgType.toUpperCase() === vm.mfgTypeDist)) {
              vm.autoCompletePricingDist.keyColumnId = vm.displayComponentDetail.mfgcodeID;
            }
            vm.partHeaderDataLoaded = true;
          }
          if (vm.mfgType.toUpperCase() === vm.mfgTypeDist) {
            return ComponentFactory.getCommentsSize().query({ id: vm.cid }).$promise.then((res) => {
              if (res && res.data) {
                vm.displayComponentDetail.componenet_inspection_requirement_det = res.data;
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          $timeout(() => vm.setDefaultSize(), 2000);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }
    getComponnetDetails();

    function getComponentHeaderCountDetail() {
      const roleDetail = _.find(vm.loginUser.roles, (roleItem) => roleItem.id === vm.loginUser.defaultLoginRoleID);
      const parameterModel = {
        partId: vm.cid, // Single value
        entityId: CORE.AllEntityIDS.Component.ID, // Single value
        accessLevel: roleDetail.accessLevel
      };

      return ComponentFactory.retrieveComponentHeaderCountDetail().save(parameterModel).$promise.then((component) => {
        if (component && component.data && Array.isArray(component.data) && component.data.length > 0) {
          vm.documentCount = component.data[0].totalDocumentCount;
          vm.bomLineItemCount = component.data[0].lineItemCount;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    getComponentHeaderCountDetail();

    vm.editManufacturer = () => {
      if (vm.mfgType === CORE.MFG_TYPE.DIST) {
        BaseService.goToSupplierDetail(vm.displayComponentDetail.mfgcodeID);
      }
      else {
        BaseService.goToManufacturer(vm.displayComponentDetail.mfgcodeID);
      }
    };

    const UpdateComponentHeader = $rootScope.$on(RFQTRANSACTION.EVENT_NAME.UpdateComponentHeader, (event, data) => {
      vm.PartOperationalAttributeDetails = data || {};
    });

    /* Manually put as load "ViewDataElement directive" only on other details tab   */
    vm.onTabChanges = (TabName, msWizard) => {
      //vm.selectedIndex = msWizard.selectedIndex;
      if (TabName === vm.componentDetailTabName) {
        $scope.$broadcast('setComponentChanges');
        vm.IsDetailTab = true;
      } else {
        vm.IsDetailTab = false;
      }
      if (TabName === vm.standardTabName) {
        vm.IsStandardsTab = true;
        // var promise = [getStandard(), getComponentStandardDetail()];
        // getAllData(promise);
      }
      else {
        vm.IsStandardsTab = false;
      }
      if (TabName === vm.DataFieldTabName) {
        vm.IsDataFieldTab = true;
        vm.entitiesAll(true);
      }
      else {
        vm.IsDataFieldTab = false;
      }
      if (TabName === vm.OtherDetailTabName) {
        vm.IsOtherDetailTab = true;
      }
      else {
        vm.IsOtherDetailTab = false;
      }
      if (TabName === vm.pricingHistory) {
        vm.IspricingHistoryTab = true;
        setDefaultDate();
      }
      else {
        vm.IspricingHistoryTab = false;
      }
      if (TabName === vm.SupplierQuoteTabName) {
        vm.IsSpleQuoteListTab = true;
      }
      else {
        vm.IsSpleQuoteListTab = false;
      }
      if (TabName === vm.documentTabName) {
        vm.IsDocumentTab = true;
      }
      else {
        vm.IsDocumentTab = false;
      }
      if (TabName === vm.customerLOATabName) {
        vm.IsComponentLOATab = true;
      } else {
        vm.IsComponentLOATab = false;
        vm.LOAID = null;
        vm.selectedCustomerID = null;
      }
      if (TabName === vm.CommentsTabName) {
        vm.IsCommentsTab = true;
      }
      else {
        vm.IsCommentsTab = false;
      }

      if (TabName === vm.RFQTabName) {
        vm.IsRFQTab = true;
      }
      else {
        vm.IsRFQTab = false;
      }

      if (TabName === vm.BOMTabName) {
        vm.IsBOMTab = true;
      }
      else {
        vm.IsBOMTab = false;
      }

      if (TabName === vm.HistoryTabName) {
        vm.IsHistoryTab = true;
      }
      else {
        vm.IsHistoryTab = false;
      }
      if (TabName === vm.OpeningStockTabName) {
        vm.IsOpeningStockTab = true;
      }
      else {
        vm.IsOpeningStockTab = false;
      }

      if (TabName === vm.SupplierApiResponseTabName) {
        vm.IsSupplierApiResponseTab = true;
      }
      else {
        vm.IsSupplierApiResponseTab = false;
      }

      if (TabName === vm.ComponentAssemblySalesPriceMatrixTabName) {
        vm.AssemblySalesPriceMatrixTab = true;
      }
      else {
        vm.AssemblySalesPriceMatrixTab = false;
      }

      if (TabName === vm.POListTabName) {
        vm.IsPOListTab = true;
      }
      else {
        vm.IsPOListTab = false;
      }

      if (TabName === vm.KitAllocationTabName) {
        vm.IsKitAlllocationTab = true;
      }
      else {
        vm.IsKitAlllocationTab = false;
      }

      if (TabName === vm.UMIDListTabName) {
        vm.IsUMIDListTab = true;
      }
      else {
        vm.IsUMIDListTab = false;
      }
      if (TabName === vm.DFMTabName) {
        vm.IsDFMTab = true;
      }
      else {
        vm.IsDFMTab = false;
      }
      if (TabName === vm.ApprovedDisapprovedSupplierTabName) {
        vm.IsApprovedDisapprovedSupplierTab = true;
      }
      else {
        vm.IsApprovedDisapprovedSupplierTab = false;
      }
      if (TabName === vm.WorkorderListTabName) {
        vm.IsWorkorderListTab = true;
      }
      else {
        vm.IsWorkorderListTab = false;
      }
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $('#content').animate({ scrollTop: 0 }, 200);
    };

    /**
   * Tab Data element - Drag and Drop Data Elements for Equipment
   * retrieve all entities
   */
    vm.entitiesAll = (isDataFieldsTabClick) => {
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.SearchAddedListPart = null;
      vm.SearchNoAddedListPart = null;
      vm.SearchAddedListEquipment = null;
      vm.SearchNoAddedListEquipment = null;
      vm.SearchAddedListEmployee = null;
      vm.SearchNoAddedListEmployee = null;
      vm.cgBusyLoading = EntityFactory.getEntityByName().query({ name: vm.Entity }).$promise.then((res) => {
        if (res && res.data) {
          if (isDataFieldsTabClick) {
            UnSelectAllElement();
          }
          const objEntity = res.data;
          vm.enityElementDetails(objEntity.entityID);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /* retrieve EntityElement Details for Equipment */
    vm.enityElementDetails = (entityID) => {
      const objs = {
        id: entityID,
        componentID: vm.cid
      };
      vm.cgBusyLoading = ComponentFactory.retrieveComponentEntityDataElements().query({ componentObj: objs }).$promise.then((res) => {
        if (res && res.data) {
          SubFormElementList = _.remove(res.data, (o) => o.parentDataElementID);
          res.data = _.orderBy(res.data, ['displayOrder'], ['asc']);
          _dataElementAddedList = vm.dataElementAddedList = [];
          _dataElementNoAddedList = vm.dataElementNoAddedList = [];
          _.each(res.data, (itemData) => {
            itemData.icon = _.find(dataelementInputFieldList, (data) => itemData.controlTypeID === data.ID);
            itemData.componentDataelement = _.first(itemData.componentDataelement);
            if (vm.cid) {
              if (itemData.componentDataelement) {
                vm.dataElementAddedList.push(itemData);
              }
              else {
                vm.dataElementNoAddedList.push(itemData);
              }
            }
            else {
              vm.dataElementNoAddedList.push(itemData);
            }
          });
          vm.dataElementAddedList = _.orderBy(vm.dataElementAddedList, (e) => e.componentDataelement.displayOrder, ['asc']);
          _dataElementAddedList = angular.copy(vm.dataElementAddedList);
          _dataElementNoAddedList = angular.copy(vm.dataElementNoAddedList);
          if (_dataElementAddedList.length === 0 && _dataElementNoAddedList.length === 0) {
            vm.isContainMasterDataField = false;
          }
          else {
            vm.isContainMasterDataField = true;
          }
          setSelectableListItem();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.SearchElement = function (list, searchText, IsAdded) {
      if (!searchText) {
        if (IsAdded) {
          vm.SearchAddedListElement = null;
          vm.dataElementAddedList = _dataElementAddedList;
          vm.FilterDataElementAdded = true;
        } else {
          vm.SearchNoAddedListElement = null;
          vm.dataElementNoAddedList = _dataElementNoAddedList;
          vm.FilterDataElementNotAdded = true;
        }
        return;
      }
      if (IsAdded) {
        vm.dataElementAddedList = $filter('filter')(_dataElementAddedList, { dataElementName: searchText });
        vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
      }
      else {
        vm.dataElementNoAddedList = $filter('filter')(_dataElementNoAddedList, { dataElementName: searchText });
        vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
      }
    };

    $scope.selectedElementListNoAdded = [];
    $scope.selectedElementListAdded = [];
    //#region sortable option common for all list
    $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow',
      placeholder: 'beingDragged',
      'ui-floating': true,
      disabled: vm.pageTabRights[0].DataFieldTab.isReadOnly,
      cursorAt: {
        top: 0, left: 0
      },
      start: function () {
      },
      sort: function () {
      },
      stop: function (e, ui) {
        var sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const sourceTarget = ui.item.sortable.source[0];
          const dropTarget = ui.item.sortable.droptarget[0]; // get drop target element
          const SourceDivAdded = sourceTarget.id.indexOf('NoAdded') > -1 ? false : true;
          const DestinationDivAdded = dropTarget.id.indexOf('NoAdded') > -1 ? false : true;
          if (SourceDivAdded !== DestinationDivAdded) {
            if (SourceDivAdded === false && DestinationDivAdded === true) {
              if ($scope.selectedElementListNoAdded.length === 0) {
                $scope.selectedElementListNoAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Add', ui.item.sortable.dropindex);
              return;
            }
            else if (SourceDivAdded === true && DestinationDivAdded === false) {
              if ($scope.selectedElementListAdded.length === 0) {
                $scope.selectedElementListAdded.push(sourceModel);
              }
              vm.ModifyPageAdded('Remove');
              return;
            }
          }
          else if (sourceTarget.id === 'dataElementAddedList' && dropTarget.id === 'dataElementAddedList') {
            _dataElementAddedList = [];
            _dataElementAddedList = ui.item.sortable.droptargetModel;
            vm.ModifyPageAdded('InnerSorting');
            return;
          }
        }
      },
      connectWith: '.items-container'
    });
    //#endregion


    //#region unselect all element list
    function UnSelectAllElement() {
      angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
      ResetSelectedElement();
    }
    //#endregion

    //#region unselect single element list
    function UnSelectElement(unSelectFrom) {
      if (unSelectFrom === 'NoAdded') {
        angular.element('[ui-sortable]#dataElementNoAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      else {
        angular.element('[ui-sortable]#dataElementAddedList .dragsortable').removeClass('ui-sortable-selected');
      }
      ResetSelectedElement();
    }
    //#endregion

    //#region reset value of selected element
    function ResetSelectedElement() {
      $scope.selectedElementListNoAdded = [];
      $scope.selectedElementListAdded = [];
      $scope.selectAnyNoAdded = false;
      $scope.selectAnyAdded = false;
    }
    //#endregion

    //#region check for selected element
    function checkSelectAllFlag() {
      $scope.selectAnyNoAdded = $scope.selectedElementListNoAdded.length > 0 ? true : false;
      $scope.selectAnyAdded = $scope.selectedElementListAdded.length > 0 ? true : false;
    }
    //#endregion

    //#region  set item selectable
    function SetDataElementSelectable() {
      angular.element('[ui-sortable]#dataElementAddedList').on('ui-sortable-selectionschanged', () => {
        UnSelectElement('NoAdded');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(() => $(this).index()).toArray();
        $scope.selectedElementListAdded = _.map(selectedItemIndexes, (i) => vm.dataElementAddedList[i]);
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
      angular.element('[ui-sortable]#dataElementNoAddedList').on('ui-sortable-selectionschanged', () => {
        UnSelectElement('Added');
        const $this = $(this);
        const selectedItemIndexes = $this.find('.ui-sortable-selected').map(() => $(this).index()).toArray();
        $scope.selectedElementListNoAdded = _.map(selectedItemIndexes, (i) => vm.dataElementNoAddedList[i]);
        checkSelectAllFlag();
        $scope.$applyAsync();
      });
    }

    const setSelectableListItem = () => {
      $timeout(() => {
        SetDataElementSelectable();
      }, _configSelectListTimeout);
    };
    //#endregion

    //#region for update part notifiction
    //  Part Attribute changes Listeners
    function partUpdatedNotificationListener(message) {
      if (!vm.socketmsgwasOpened) {
        vm.socketmsgwasOpened = true;
        if (message && parseInt(message.bomPartID) === parseInt(vm.cid) && message.hasOwnProperty('bomLock')) {
          vm.socketmsgwasOpened = false;
          getComponnetDetails();
        }
        else {
          vm.socketmsgwasOpened = false;
        }
      }
    }
    //#endregion

    //#region for destroy selection
    function DestroyDataElementSelection() {
      angular.element('[ui-sortable]#dataElementNoAddedList').off('ui-sortable-selectionschanged');
      angular.element('[ui-sortable]#dataElementAddedList').off('ui-sortable-selectionschanged');
    }

    function DestroyAllSelection() {
      DestroyDataElementSelection();
    }
    //#endregion
    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.sendBOMStartStopActivity, bomStartStopActivityListener);
      socketConnectionService.on(PRICING.EventName.sendPartUpdatedNotification, partUpdatedNotificationListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.sendBOMStartStopActivity, bomStartStopActivityListener);
      socketConnectionService.removeListener(PRICING.EventName.sendPartUpdatedNotification, partUpdatedNotificationListener);
    }

    const onComponentGetDetailsBroadcast = $scope.$on(USER.ComponentGetDetailBroadcast, () => {
      getComponnetDetails();
    });

    //#region On change of tab
    $scope.$on('$destroy', () => {
      DestroyAllSelection();
      removeSocketListener();
      if (vm.bomActivityDetails && vm.bomActivityDetails.tickActivity) {
        clearInterval(vm.bomActivityDetails.tickActivity);
      }
      $mdDialog.hide(false, { closeAll: true });
      //stateChangeSuccessCall();
      UpdateComponentHeader();
      onComponentGetDetailsBroadcast();
    });
    //#endregion

    //#region modify data element Added based on selection from both list
    vm.ModifyPageAdded = (addType, indexPosition) => {
      if (vm.pageTabRights[0].DataFieldTab.isReadOnly) {
        return;
      }
      if (addType === 'Add') {
        _.each($scope.selectedElementListNoAdded, (item) => {
          var added = _.find(_dataElementAddedList, (element) => item.dataElementID === element.dataElementID);
          if (!added) {
            if (indexPosition !== undefined && indexPosition !== null) {
              _dataElementAddedList.splice(indexPosition, 0, item);
            }
            else {
              _dataElementAddedList.push(item);
            }
            indexPosition++;
          }
        });
        _.each($scope.selectedElementListNoAdded, (item) => {
          _dataElementNoAddedList = _.without(_dataElementNoAddedList,
            _.find(_dataElementNoAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'Remove') {
        _.each($scope.selectedElementListAdded, (item) => {
          var added = _.find(_dataElementNoAddedList, (element) => item.dataElementID === element.dataElementID);
          if (!added) {
            _dataElementNoAddedList.push(item);
          }
        });
        _.each($scope.selectedElementListAdded, (item) => {
          _dataElementAddedList = _.without(_dataElementAddedList,
            _.find(_dataElementAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'AddAll') {
        _.each(vm.dataElementNoAddedList, (item) => {
          var added = _.find(_dataElementAddedList, (element) => item.dataElementID === element.dataElementID);
          if (!added) {
            _dataElementAddedList.push(item);
          }
        });
        _.each(_dataElementAddedList, (item) => {
          _dataElementNoAddedList = _.without(_dataElementNoAddedList,
            _.find(_dataElementNoAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'RemoveAll') {
        _.each(vm.dataElementAddedList, (item) => {
          var added = _.find(_dataElementNoAddedList, (element) => item.dataElementID === element.dataElementID);
          if (!added) {
            _dataElementNoAddedList.push(item);
          }
        });
        _.each(_dataElementNoAddedList, (item) => {
          _dataElementAddedList = _.without(_dataElementAddedList,
            _.find(_dataElementAddedList, (valItem) => valItem.dataElementID === item.dataElementID)
          );
        });
        UnSelectAllElement();
      }
      else if (addType === 'InnerSorting') {
        addType = 'AddAll';
      }
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.dataElementAddedList = _dataElementAddedList;
      vm.dataElementNoAddedList = _dataElementNoAddedList;
      vm.FilterDataElementAdded = vm.dataElementAddedList.length > 0;
      vm.FilterDataElementNotAdded = vm.dataElementNoAddedList.length > 0;
      SaveComponentDataelement(addType);
    };
    //#endregion


    /* Save-Update equipment_dataelement */
    const SaveComponentDataelement = (OperationTypeToChange) => {
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.dataElementAddedList = _dataElementAddedList;
      vm.dataElementNoAddedList = _dataElementNoAddedList;
      const saveObj = [];
      let index = 1;
      _.each(_dataElementAddedList, (item) => {
        if (item.dataElementID) {
          const _object = {};
          _object.compDataElementID = item.componentDataelement ? item.componentDataelement.compDataElementID : null;
          _object.componentID = vm.cid;
          _object.dataElementID = item.dataElementID;
          _object.displayOrder = index;
          saveObj.push(_object);
        }
        const subFormElements = _.filter(SubFormElementList, (subFormItem) => subFormItem.parentDataElementID === item.dataElementID);
        if (subFormElements.length > 0) {
          _.each(subFormElements, (subItem) => {
            if (subItem.dataElementID) {
              const eqpDataElementIDOfSubFormItem = _.find(subItem.componentDataelement, (subFormEquipElementItem) => subFormEquipElementItem.componentID === vm.cid && subFormEquipElementItem.dataElementID === subItem.dataElementID);
              const _object = {};
              _object.compDataElementID = eqpDataElementIDOfSubFormItem ? eqpDataElementIDOfSubFormItem.compDataElementID : null,
                _object.componentID = vm.cid,
                _object.dataElementID = subItem.dataElementID,
                _object.displayOrder = index;
              saveObj.push(_object);
            }
            index++;
          });
        }
        index++;
      });
      const listObj = {
        entityID: CORE.AllEntityIDS.Component.ID,
        componentID: vm.cid,
        dataElementIDs: saveObj.map((item) => item.dataElementID),
        dataElementList: saveObj
      };

      /* add new data element with update order of already exists */
      if (OperationTypeToChange === 'Add' || OperationTypeToChange === 'AddAll') {
        vm.cgBusyLoading = ComponentDataelementFactory.createEquipment_DataElementList().save({ listObj: listObj }).$promise.then(() => {
          setDataAfterSaveOrDeleteDataElement();
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /* delete data_element other than passed from here and update display_order of elements which are passed */
      else {
        vm.cgBusyLoading = ComponentDataelementFactory.deleteEquipment_DataElementList().save({ listObj: listObj }).$promise.then(() => {
          setDataAfterSaveOrDeleteDataElement();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const setDataAfterSaveOrDeleteDataElement = () => {
      vm.SearchAddedListElement = null;
      vm.SearchNoAddedListElement = null;
      vm.dataElementAddedList = _dataElementAddedList;
      vm.dataElementNoAddedList = _dataElementNoAddedList;
      vm.entitiesAll(false);
    };


    vm.isSaveDisabled = function () {
      if (vm.IsDetailTab && vm.displayComponentDetail && !vm.enableEditAutoEntry && vm.displayComponentDetail.createdBy === 'Auto') {
        return true;
      }
      //else if (!vm.isEditComponent && msWizard.selectedIndex === 0) {
      //  return true;
      //}
      //else if (msWizard.currentStepInvalid()) {
      //  return true;
      //}
      ////else if (msWizard.selectedIndex === 0) {
      ////  return vm.componentForm && (vm.componentForm.$invalid /*|| !vm.componentForm.$dirty*/);
      ////}
      //else if (msWizard.selectedIndex === 3) {
      //  return !vm.checkFormDirty();
      //}
      //else if (msWizard.selectedIndex === 4) {
      //  return !vm.wizardOtherDetail.$dirty;
      //}
      //else if (msWizard.selectedIndex === 16) {
      //  return vm.componentAssemblySalesPriceMatrixForm && vm.componentAssemblySalesPriceMatrixForm.$invalid;
      //}
      //else {
      //  return !vm.componentstandardDetails.$dirty;
      //}
    };
    /************ Toogle view for edit/view and pass to directive same **************/
    vm.toggleComponent = () => {
      vm.isEditComponent = !vm.isEditComponent;
    };
    /************ Toogle view for edit/view and pass to directive same **************/

    const initAutoCompleteSearchPart = () => {
      /* Search Part */
      vm.autoCompleteSearchPart = {
        columnName: 'displayMfgPN',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'SearchPart',
        placeholderName: 'Type here to search part',
        isRequired: false,
        //addData: { mfgType: CORE.MFG_TYPE.MFG },
        isAddnew: false,
        callbackFn: (obj) => {
          const searchObj = {
            id: obj.id,
            mfgType: vm.mfgType,
            inputName: vm.autoCompleteSearchPart.inputName,
            isGoodPart: null,
            isContainCPN: true
          };
          return getPartSearch(searchObj);
        },
        onSelectCallbackFn: (partDetail) => {
          if (partDetail) {
            const mfgType = partDetail.mfgType ? partDetail.mfgType : (vm.mfgType ? vm.mfgType : CORE.MFG_TYPE.MFG);
            const routeState = (mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
            $state.go(routeState, {
              coid: partDetail.id
            });
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            mfgType: vm.mfgType,
            query: query,
            inputName: vm.autoCompleteSearchPart.inputName,
            isGoodPart: null,
            isContainCPN: true
          };
          return getPartSearch(searchObj);
        }
      };
    };

    function getPartSearch(searchObj) {
      return ComponentFactory.getComponentMFGAliasPIDProdPNSearch().query({ listObj: searchObj }).$promise.then((partList) => {
        if (partList && partList.data && partList.data.data) {
          vm.partSearchList = partList.data.data;
        }
        else {
          vm.partSearchList = [];
        }
        return vm.partSearchList;
      }).catch((error) => BaseService.getErrorLog(error));
    }
    vm.AssyAtGlance = () => {
      const obj = {
        partID: vm.cid
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        null,
        obj).then(() => {
          // success
        }, () => {
          // calcel
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.headerActionTitle = () => ((
      (vm.IsDetailTab && vm.pageTabRights[0].DetailTab.isReadOnly)
      || (vm.IsStandardsTab && vm.pageTabRights[0].StandardTab.isReadOnly)
      || (vm.IsOtherDetailTab && vm.pageTabRights[0].OtherDetailTab.isReadOnly)
      || (vm.IsPOListTab && vm.pageTabRights[0].POListTab.isReadOnly)
      || (vm.IsDocumentTab && vm.pageTabRights[0].DocumentTab.isReadOnly)
      || (vm.IsCommentsTab && vm.pageTabRights[0].CommentsTab.isReadOnly)
      || (vm.IsDataFieldTab && vm.pageTabRights[0].DataFieldTab.isReadOnly)
      || (vm.IsOtherDetailTab && vm.pageTabRights[0].OtherDetailTab.isReadOnly)
      || (vm.IsComponentLOATab && vm.pageTabRights[0].CustomerLOATab.isReadOnly)
      || (vm.IsApprovedDisapprovedSupplierTab && vm.pageTabRights[0].ApprovedDisapprovedSupplierTab.isReadOnly)
      || (vm.AssemblySalesPriceMatrixTab && vm.pageTabRights[0].AssemblySalesPriceMatrixTab.isReadOnly)) ? 'View ' : (vm.cid ? 'Update ' : 'Add '));

    /* Search Part */
    vm.addPart = (openInSameTab) => {
      if (!vm.pageTabRights[0].DetailTab.hasPermission || vm.pageTabRights[0].DetailTab.isReadOnly) {
        return;
      }
      const routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
      if (openInSameTab) {
        $state.go(routeState, { coid: null }, { reload: true });
      } else {
        BaseService.openInNew(routeState, { coid: null }, openInSameTab);
      }
    };

    angular.element(() => {
      BaseService.currentPageForms = [];
      if (vm.componentstandardDetails && vm.IsDetailTab) {
        BaseService.currentPageForms.push(vm.componentstandardDetails);
      }
      if (vm.componentstandardDetails && vm.IsStandardsTab) {
        BaseService.currentPageForms.push(vm.componentstandardDetails);
      }
      if (vm.wizardOtherDetail && vm.IsOtherDetailTab) {
        BaseService.currentPageForms.push(vm.wizardOtherDetail);
      }
    });

    vm.createAssemblyRevision = (ev) => {
      if (vm.pageTabRights[0].DetailTab.isReadOnly) {
        return;
      }
      if (vm.componentForm && vm.componentForm.$dirty) {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.SAVE_PART_DETAIL_FOR_CREATEDUPLICATE_PART,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }

      vm.displayComponentDetail.mfgCode = vm.displayComponentDetail.mfgCodemst ? vm.displayComponentDetail.mfgCodemst.mfgCode : null;
      vm.displayComponentDetail.manufacturerName = vm.displayComponentDetail.mfgCodemst ? vm.displayComponentDetail.mfgCodemst.mfgName : null;
      vm.displayComponentDetail.rohsComplientConvertedValue = vm.displayComponentDetail.rohsName;
      vm.displayComponentDetail.mfgType = vm.displayComponentDetail.mfgCodemst.mfgType;
      DialogFactory.dialogService(
        USER.ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_CONTROLLER,
        USER.ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_VIEW,
        ev,
        vm.displayComponentDetail).then((responseDetail) => {
          if (responseDetail && Array.isArray(responseDetail) && responseDetail.length > 0) {
            const partID = responseDetail[0].id ? responseDetail[0].id : responseDetail[0].partId;
            const routeState = (vm.mfgType.toUpperCase() === vm.mfgTypeDist) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
            $state.transitionTo(routeState,
              {
                coid: partID
              }, { reload: true, location: true, inherit: true, notify: true });
          }
        }, () => {
          // cancel
        }, (err) => BaseService.getErrorLog(err));
    };

    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    //link to go supplier list page
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    //go to part number
    vm.gotoPartNumber = () => {
      if (vm.selectedTabIndex !== 0) {
        BaseService.goToComponentDetailTab(null, vm.cid);
      }
    };

    vm.stopBOMActivity = () => {
      if (vm.loginUser.userid === vm.bomActivityDetails.activityStartBy || vm.loginUser.isUserSuperAdmin) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_FROM_RFQ_LIST_MESSAGE);
        if (vm.loginUser.userid === vm.bomActivityDetails.activityStartBy) {
          let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = '<tr><td class="border-bottom padding-5">1</td><td class="border-bottom padding-5">' + vm.displayComponentDetail.PIDCode + '</td></tr>';

          message = stringFormat(message, subMessage);
          messageContent.message = stringFormat(messageContent.message, message);
        }
        if (vm.loginUser.userid !== vm.bomActivityDetails.activityStartBy && vm.loginUser.isUserSuperAdmin) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE);
          let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>' + vm.LabelConstant.Assembly.PIDCode + '</th><th class=\'border-bottom padding-5\'>Activity Started By</th></tr></thead><tbody>{0}</tbody></table>';
          const subMessage = '<tr><td class="border-bottom padding-5">1</td><td class="border-bottom padding-5">' + vm.displayComponentDetail.PIDCode + '</td><td class="border-bottom padding-5">' + vm.bomActivityDetails.activityStartedByUserName + '</td></tr>';
          message = stringFormat(message, subMessage);
          messageContent.message = stringFormat(messageContent.message, vm.bomActivityDetails.activityStartedByUserName, message);
        }
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            const dataObj = {
              refTransID: vm.displayComponentDetail.id,
              isActivityStart: false,
              transactionType: vm.transactionType[0].id,
              actionType: vm.actionType[0].id
            };
            vm.isStartAndStopRequestFromThisTab = true;
            vm.cgBusyLoading = BOMFactory.startStopBOMActivity().save(dataObj).$promise.then((response) => {
              if (response && response.data) {
                vm.bomActivityDetails.isActivityStart = false;
                vm.bomActivityDetails.currentTimerDiff = '';
                startBOMActivityTimer();
              }
            }).catch((error) => {
              BaseService.getErrorLog(error);
            });
          }
        }, () => {
          // cancel
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_DIFFERENT_USER_STOP_MESSAGE
        };

        DialogFactory.messageAlertDialog(alertModel).then(() => {
          // success
        }, () => {
          // cancel
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // ---------------------------------- [S] - Manage/View Serial Number Configuration -----------------
    vm.manageSerialNumberConfiguration = (ev) => {
      DialogFactory.dialogService(
        USER.ADMIN_SERIAL_NUMBER_CONFIGURATION_POPUP_CONTROLLER,
        USER.ADMIN_SERIAL_NUMBER_CONFIGURATION_POPUP_VIEW,
        ev,
        vm.displayComponentDetail).then(() => {
          // success
        }, () => {
          // cancel
        }, (err) => BaseService.getErrorLog(err));
    };
    // ---------------------------------- [E] - Manage/View Serial Number Configuration -----------------

    vm.setDefaultSize = () => {
      if ($scope.splitPaneProperties && $scope.splitPaneProperties.firstComponentSize && $scope.splitPaneProperties.lastComponentSize) {
        $scope.splitPaneProperties.firstComponentSize = $scope.splitPaneProperties.firstComponentSize + 5;
        $scope.splitPaneProperties.lastComponentSize = $scope.splitPaneProperties.lastComponentSize - 5;
      }
      else {
        $scope.splitPaneProperties = {
          firstComponentSize: 326,
          lastComponentSize: 331
        };
      }
    };

    /* delete component*/
    vm.deleteRecord = () => {
      if (!vm.cid || !vm.enableDeleteOperation) {
        return;
      }

      if (vm.displayComponentDetail.systemGenerated) {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.SYSTEM_GENERATED_PARTS_DELETE_NOT_ALLOWED
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }

      const data = {
        transctionList: CORE.DELETE_MODULE_LIST.PARTS,
        deleteCount: 1,
        moduleName: 'Part'
      };
      $mdMenu.hide();
      DialogFactory.dialogService(
        CORE.DELETE_CONFIRMATION_MODAL_CONTROLLER,
        CORE.DELETE_CONFIRMATION_MODAL_VIEW,
        null,
        data).then(() => {
          const objIDs = {
            id: [vm.displayComponentDetail.id],
            CountList: false
          };
          vm.cgBusyLoading = ComponentFactory.deleteComponent().query({ objIDs: objIDs }).$promise.then((data) => {
            if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
              const dataObj = {
                TotalCount: data.data.transactionDetails[0].TotalCount,
                pageName: CORE.PageName.component
              };
              BaseService.deleteAlertMessageWithHistory(dataObj, (ev) => {
                const IDs = {
                  id: [vm.displayComponentDetail.id],
                  CountList: true
                };
                return ComponentFactory.deleteComponent().query({
                  objIDs: IDs
                }).$promise.then((res) => {
                  let data = {};
                  if (res && res.data) {
                    data = res.data;
                  }
                  data.redirectToPartDetailPage = true;

                  data.PageName = CORE.PageName.component;
                  data.selectedIDs = stringFormat('{0}{1}', 1, ' Selected');
                  if (res.data) {
                    DialogFactory.dialogService(
                      USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                      USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                      ev,
                      data).then(() => {
                        // success
                      }, () => {
                        // calcel
                      });
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              });
            }
            else {
              if (CORE.MFG_TYPE.MFG === vm.mfgType) {
                BaseService.goToPartList(null, null, true);
              } else {
                BaseService.goToSupplierPartList(null, null, true);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // Redirect to Add UMID page
    vm.goToUMIDDetail = () => {
      setLocalStorageValue('PendingUMIDMFRPN', { mfrpn: vm.displayComponentDetail.mfgPN });
      BaseService.goToUMIDDetail();
    };

    // Add new Supplier Quote
    vm.addSupplierQuote = () => {
      if (vm.cid) {
        if (vm.displayComponentDetail.mfgPN) {
          const obj = {
            mfgPN: vm.displayComponentDetail.mfgPN,
            mfgCode: vm.displayComponentDetail.mfgCodemst.mfgCode
          };
          DialogFactory.dialogService(
            TRANSACTION.ADD_SUPPLIER_QUOTE_MODAL_CONTROLLER,
            TRANSACTION.ADD_SUPPLIER_QUOTE_MODAL_VIEW,
            null,
            obj).then((resData) => {
              BaseService.goToSupplierQuoteWithPartDetail(resData.id, resData.component);
            }, () => {
            }, (err) => BaseService.getErrorLog(err));
        }
      }
    };

    vm.refreshData = () => {
      vm.entitiesAll();
    };

    vm.addData = () => {
      BaseService.goToElementManage(CORE.AllEntityIDS.Component.ID);
    };

    $scope.$on('documentCount', (event, documentCount) => {
      vm.documentCount = documentCount;
    });
    $scope.$on('bomLineItemCount', (event, bomLineItemCount) => {
      vm.bomLineItemCount = bomLineItemCount;
    });

    /* go to data element manage page */
    vm.goToElementManage = (entityID, dataElementID) => {
      BaseService.goToElementManage(entityID, dataElementID);
    };
  }
})();
