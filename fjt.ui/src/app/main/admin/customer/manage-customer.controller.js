(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('ManageCustomerController', ManageCustomerController);

  /** @ngInject */
  function ManageCustomerController($state, $scope, $mdDialog, $stateParams, $timeout, DialogFactory, BaseService, CORE, USER,
    DataElementTransactionValueFactory, CustomerFactory, ComponentFactory, ManufacturerFactory, MasterFactory, ChartOfAccountsFactory,
    ImportExportFactory, RFQTRANSACTION, DASHBOARD, ManageMFGCodePopupFactory, GenericCategoryFactory, $q, EmployeeFactory, FOBFactory,
    CertificateStandardFactory, $filter, NotificationFactory, TRANSACTION, DCFormatFactory) {
    // var selecteddata;
    if (!$stateParams.customerType) {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      return;
    }
    const vm = this;
    vm.DigikeyID = CORE.DIGIKEYID;
    vm.LabelConstant = CORE.LabelConstant;
    vm.currentTabName = $stateParams.selectedTab;
    vm.keywords = $stateParams.keywords;
    vm.currentSubTabName = $stateParams.subTab;
    // vm.gridConfig = CORE.gridConfig;
    vm.IsOtherDetailTab = false;
    vm.HistoryTableName = CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.MFGCODEMST;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssageBillingAddress = USER.ADMIN_EMPTYSTATE.CUSTOMERBILLINGADDRESS;
    vm.EmptyMesssageShippingAddress = USER.ADMIN_EMPTYSTATE.CUSTOMERSHIPPINGADDRESS;
    vm.EmptyMesssagePayToInformation = USER.ADMIN_EMPTYSTATE.SUPPLIERPAYTOINFORMATION;
    vm.EmptyMesssageContactPerson = USER.ADMIN_EMPTYSTATE.CUSTOMER_CONTACTPERSON;
    vm.EmptyMesssageComponantalias = USER.ADMIN_EMPTYSTATE.COMPONANT_CUST_ALIAS_REV;
    vm.EmptyMesssageComponantaliasPN = USER.ADMIN_EMPTYSTATE.COMPONANT_CUST_ALIAS_REV_PN;
    vm.customerLOAEmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_CUSTOMER_LOA;
    vm.SUPPLIER_TYPE_TOOLTIP = CORE.SUPPLIER_TYPE_TOOLTIP;
    vm.customerLOAEmptyMesssage.ADDNEWMESSAGE = stringFormat(vm.customerLOAEmptyMesssage.ADDNEWMESSAGE, 'part');
    vm.customerLOAEmptyMesssage.MESSAGE = stringFormat(vm.customerLOAEmptyMesssage.MESSAGE, 'part');
    vm.addressTypeModelPopup = CORE.AddressType;
    vm.EmailPattern = CORE.EmailPattern;
    vm.WebSitePattern = CORE.WebSitePattern;
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.loaEntityname = CORE.AllEntityIDS.COMPONENT_CUSTOMER_LOA.Name;
    vm.isUpdatable = true;
    vm.focusDateCode = false;
    vm.isNoCustomerAssembyStock = false;
    vm.supplierAuthorize = CORE.SUPPLIER_AUTHORIZE_TYPE;
    vm.isImport = false;
    vm.phoneNumberNote = null;
    vm.faxNumberNote = null;
    vm.activeInactiveStatusList = CORE.ActiveInactiveStatus;
    vm.defaultDateTimeDisplayFormat = _dateTimeDisplayFormat;
    vm.customerType = $stateParams.customerType;
    vm.customerTypeConst = CORE.CUSTOMER_TYPE;
    vm.custPersonViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.custPersonViewActionBtnDet.AddNew.isVisible = vm.custPersonViewActionBtnDet.ApplyNew.isVisible = vm.custPersonViewActionBtnDet.Refresh.isVisible = false;
    // vm.mfgPageName = CORE.PAGENAME_CONSTANT[21].PageName;
    vm.mfgType = (vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER || vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST;
    vm.addressType = vm.mfgType === CORE.MFG_TYPE.DIST ? CORE.AddressTypes.SUPP : CORE.AddressTypes.CUST_MFR;
    vm.currentPageName = vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? CORE.PAGENAME_CONSTANT[10].PageName : (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER ? CORE.PAGENAME_CONSTANT[21].PageName : CORE.PAGENAME_CONSTANT[22].PageName);
    vm.isComponentAliasTab = vm.iscomponentLOATab = vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER ? true : false;
    // vm.CustomPartGridHeaderDropdown = CORE.CustomPartGridHeaderDropdown;
    vm.CPNGridHeaderDropdown = CORE.CPNGridHeaderDropdown;
    vm.isPersonnelMappingTab = false;
    vm.isDetailTab = false;
    vm.cid = $stateParams.cid;
    vm.documentsCount = 0;
    vm.commentsCount = 0;
    vm.documentmfgCount = 0;
    vm.customerMappingToooltip = CORE.CustomerMappingTooltip;
    vm.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.contPersonViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
    vm.addBtnIcon = vm.customerType === vm.customerTypeConst.CUSTOMER ? 't-icons-customer' : vm.customerType === vm.customerTypeConst.SUPPLIER ? 't-icons-supplier' : 't-icons-manufacturer';

    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
    vm.standardStatus = CORE.Supplier_Standard_Status;
    const DATE_PICKER = CORE.DATE_PICKER;
    vm.lastApprovalDatePicker = DATE_PICKER.lastApprovalDate;
    vm.expirationDatePicker = DATE_PICKER.expirationDate;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.lastApprovalDatePicker] = false;
    vm.IsPickerOpen[vm.expirationDatePicker] = false;
    vm.supplierStandard = {
      standardStatus: vm.standardStatus.NA.id
    };
    vm.tempLastStandardId = 0;
    vm.updateRecords = [];
    vm.saveRecords = [];
    vm.deleteRecords = [];
    vm.selectedRecord = [];
    vm.initdateoption = () => {
      vm.lastApprovalDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        maxDate: vm.supplierStandard.expDate
      };
      vm.expirationDateDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false
      };
    };
    vm.initdateoption();

    if (!vm.cid) {
      /*this flag introduced due to email setting tab issue on mfr page
       * - Bug 26858: When user open Assembly Stock under Inventory for Customer master then it generates Console error */
      vm.isTabDisplay = true;
    }
    vm.CustomerInventoryTabs = USER.CustomerInventoryTabs;
    vm.InventoryTab = {
      isUMIDStock: false,
      isAssemblyStock: false
    };
    vm.selectedInventoryTabIndex = 0;
    vm.supplierMFRMappingType = CORE.supplierMFRMappingType;
    vm.ScanDocumentSide = CORE.ScanDocumentSide;
    vm.customerTypeList = _.filter(CORE.customerTypeDropdown, (item) => item.id);
    let approvalReasonList = [];
    let mappedMFGList = [];
    let isapprove = false;
    let ismfgMapped = false;
    let isPartsUpdate = false;
    vm.CustomerTabs = USER.CustomerTabs;
    vm.docEntityID = 0;
    vm.CustomerBilingAddressTabs = USER.CustomerBilingAddressTabs;
    vm.CustomerShippingAddressTabs = USER.CustomerShippingAddressTabs;
    vm.CustomerRMAShippingAddressTabs = USER.CustomerRMAShippingAddressTabs;
    vm.selectedTabIndex = vm.CustomerTabs.Detail.ID;
    vm.selectedSubTabIndex = vm.CustomerBilingAddressTabs.Detail.ID;
    vm.selectedShippingSubTabIndex = vm.CustomerShippingAddressTabs.Detail.ID;
    vm.selectedRMAShippingSubTabIndex = vm.CustomerRMAShippingAddressTabs.Detail.ID;
    vm.BillToDetailUI = USER.CustomerSupplierManufacture_BillTo_Split_UI.BillToDetailUI;
    vm.BillToAddressUI = USER.CustomerSupplierManufacture_BillTo_Split_UI.BillToAddressUI;
    $scope.splitPaneFirstProperties = {};
    $scope.splitPaneSecondProperties = {};
    //$scope.splitPaneThirdProperties = {};
    //$scope.splitPaneFourthProperties = {};
    $scope.splitSubPaneFirstProperties = {};
    $scope.splitSubPaneSecondProperties = {};
    $scope.splitSubPaneThirdProperties = {};
    $scope.splitSubPaneFourthProperties = {};
    vm.loginUser = BaseService.loginUser;
    vm.entityName = vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER ? CORE.AllEntityIDS.Supplier.Name : vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER ? CORE.AllEntityIDS.Manufacturer.Name : CORE.AllEntityIDS.Customer.Name;
    vm.ManufacturerentityName = CORE.AllEntityIDS.Manufacturer.Name;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.isSuperAdmin = (_.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID && item.name.toLowerCase() === CORE.Role.SuperAdmin.toLowerCase())) ? true : false;
    vm.emailList = [];
    if (vm.currentTabName) {
      const tab = _.find(vm.CustomerTabs, (item) => item.Name === vm.currentTabName);
      if (tab) {
        vm.selectedTabIndex = tab.ID;
      }
    }

    //go to fob
    vm.goToFOBList = () => BaseService.goToFOB();

    const getSalesCommissionEmployeeListbyCustomer = () => {
      const obj = {
        customerID: vm.cid,
        salesCommissionToID: vm.customer && vm.customer.salesCommissionTo ? vm.customer.salesCommissionTo : null
      };
      return EmployeeFactory.getEmployeeListByCustomer().query(obj).$promise.then((employees) => {
        if (employees && employees.data) {
          vm.SalesCommissionEmployeeList = angular.copy(employees.data);
          _.each(vm.SalesCommissionEmployeeList, (item) => {
            if (item.profileImg) {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
            }
            else {
              item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            }
          });
          return $q.resolve(vm.SalesCommissionEmployeeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getCertificateStandard = () => CertificateStandardFactory.getCertificateStandard().query().$promise.then((response) => {
      if (response && response.data) {
        if (vm.supplierStandard.id) {
          vm.StandardsList = response.data;
        } else {
          vm.StandardsList = _.filter(response.data, (item) => item.isActive);
        }
        _.each(vm.StandardsList, (standard) => {
          if (standard.CertificateStandard_Class && standard.CertificateStandard_Class.length > 0) {
            _.each(standard.CertificateStandard_Class, (item) => {
              standard.standardName = standard.fullName + ' | ' + item.className;
              standard.standardID = standard.certificateStandardID;
              standard.refStandardClassId = item.classID;
              standard.className = item.className;
            });
          } else {
            standard.standardName = standard.fullName;
            standard.standardID = standard.certificateStandardID;
          }
          standard.standardDisplayName = standard.standardName;
        });
        if (vm.supplierStandard.id) {
          vm.autoCompleteStandard.keyColumnId = vm.supplierStandard.standardDisplayName;
        }
        return $q.resolve(vm.StandardsList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // set tab index for inventory detail tab
    vm.currentInventoryTab = $stateParams.subTab;
    if (vm.currentInventoryTab) {
      const itemTabName = _.find(vm.CustomerInventoryTabs, (valItem) => valItem.Name === vm.currentInventoryTab);
      if (itemTabName) {
        if (vm.CustomerInventoryTabs.AssemblyStock.Name === itemTabName.Name) {
          vm.InventoryTab.isAssemblyStock = true;
          vm.InventoryTab.isUMIDStock = false;
        } else if (vm.CustomerInventoryTabs.UMIDStock.Name === itemTabName.Name) {
          vm.InventoryTab.isUMIDStock = true;
          vm.InventoryTab.isAssemblyStock = false;
        }
        vm.selectedTabInventory = itemTabName.ID;
      }
    }

    vm.pageTabRights =
    {
      Detail: false,
      Addresses: false,
      BilingAddress: false,
      ShippingAddress: false,
      RMAShippingAddress: false,
      Contacts: false,
      OtherDetail: false,
      PersonnelMapping: false,
      CPN: false,
      LOA: false,
      EmailReportSetting: false,
      Inventory: false,
      CustomComponentApprovedDisapprovedDetail: false,
      RemitTo: false,
      Documents: false,
      ManufacturerDocuments: false,
      Comments: false,
      History: false
    };

    function activeCurrentTab(TabName, SubTabName) {
      if (TabName === vm.CustomerTabs.Detail.Name) {
        vm.isDetailTab = true;
      }
      else {
        vm.isDetailTab = false;
      }
      if (TabName === vm.CustomerTabs.OtherDetail.Name) {
        vm.IsOtherDetailTab = true;
      }
      else {
        vm.IsOtherDetailTab = false;
      }
      if (TabName === vm.CustomerTabs.Contacts.Name) {
        vm.isotherContactInfo = true;
      } else {
        vm.isotherContactInfo = false;
      }
      if (TabName === vm.CustomerTabs.CPN.Name) {
        vm.iscomponentAlias = true;
        vm.CPNPartID = null;
      } else {
        vm.iscomponentAlias = false;
      }
      if (TabName === vm.CustomerTabs.PersonnelMapping.Name) {
        vm.isPersonnelMappingTab = true;
      } else {
        vm.isPersonnelMappingTab = false;
      }
      if (TabName === vm.CustomerTabs.LOA.Name) {
        vm.IsComponentLOATab = true;
        vm.isHideDelete = true;
      } else {
        vm.IsComponentLOATab = false;
        vm.LOAID = null;
        vm.selectedComponentID = null;
        if (TabName === vm.CustomerTabs.CPN.Name) {
          vm.isHideDelete = true;
        }
        else {
          vm.isHideDelete = false;
        }
      }
      if (TabName === vm.CustomerTabs.EmailReportSetting.Name) {
        vm.IsEmailSettingTab = true;
      }
      else {
        vm.IsEmailSettingTab = false;
      }
      if (TabName === vm.CustomerTabs.Inventory.Name) {
        vm.IsInventoryTab = true;
      }
      else {
        vm.IsInventoryTab = false;
      }
      if (TabName === vm.CustomerTabs.CustomComponentApprovedDisapprovedDetail.Name) {
        vm.IsCustomComponentApprovedDisapprovedDetailTab = true;
      }
      else {
        vm.IsCustomComponentApprovedDisapprovedDetailTab = false;
      }
      if (TabName === vm.CustomerTabs.Documents.Name) {
        vm.IsDocumentTab = true;
      }
      else {
        vm.IsDocumentTab = false;
      }
      if (TabName === vm.CustomerTabs.ManufacturerDocuments.Name) {
        vm.IsManufacturerDocumentTab = true;
      }
      else {
        vm.IsManufacturerDocumentTab = false;
      }
      if (TabName === vm.CustomerTabs.Comments.Name) {
        vm.IsCommentTab = true;
      }
      else {
        vm.IsCommentTab = false;
      }
      vm.isHistoryTab = TabName === vm.CustomerTabs.History.Name;
      vm.isStandardsTab = TabName === vm.CustomerTabs.Standards.Name;
    }

    //set css class to hide tabs
    vm.setTabClass = (tabName) => {
      var className = '';
      switch (tabName) {
        case vm.CustomerTabs.WireTransferAddresses.Name:
          if (vm.customerType !== vm.customerTypeConst.SUPPLIER) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.PersonnelMapping.Name:
          if (!(vm.customerType === vm.customerTypeConst.CUSTOMER)) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.CPN.Name:
          if (!vm.isComponentAliasTab) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.LOA.Name:
          if (!vm.iscomponentLOATab) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.EmailReportSetting.Name:
          if (!(vm.customerType !== vm.customerTypeConst.SUPPLIER)) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.Inventory.Name:
          if (vm.customerType === vm.customerTypeConst.MANUFACTURER || vm.customerType === vm.customerTypeConst.SUPPLIER) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.Standards.Name:
          if (vm.customerType !== vm.customerTypeConst.SUPPLIER) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.CustomComponentApprovedDisapprovedDetail.Name:
          if (vm.customerType !== vm.customerTypeConst.SUPPLIER) {
            className = 'cm-normal-hide-imp';
          }
          break;
        case vm.CustomerTabs.ManufacturerDocuments.Name:
          if (vm.customerType === vm.customerTypeConst.SUPPLIER || vm.customerType === vm.customerTypeConst.MANUFACTURER) {
            className = 'cm-normal-hide-imp';
          }
          break;
        //case vm.CustomerTabs.Documents.Name:
        //  if (vm.customerType === vm.customerTypeConst.MANUFACTURER) {
        //    className = 'cm-normal-hide-imp';
        //  }
        //  break;
      }
      return className;
    };

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        let tab;
        if (vm.customerType === vm.customerTypeConst.CUSTOMER) {
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Detail = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_ADDRESSES_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Addresses = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.AutomationAddresses = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_CONTACTS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Contacts = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_OTHER_DETAIL_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.OtherDetail = true;
          }
          //console.log('OtherDetail:' + vm.pageTabRights.OtherDetail);
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_PERSONNEL_MAPPING_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.PersonnelMapping = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_CPN_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.CPN = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_LOA_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.LOA = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_EMAIL_REPORT_SETTING_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.EmailReportSetting = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_INVENTORY_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Inventory = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_DOCUMENTS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Documents = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMERMFR_DOCUMENTS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.ManufacturerDocuments = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_COMMENT_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Comments = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECUSTOMER_HISTORY_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.History = true;
          }
        }
        else if (vm.customerType === vm.customerTypeConst.MANUFACTURER) {
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Detail = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_ADDRESSES_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Addresses = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_AUTOMATION_ADDRESSES_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.AutomationAddresses = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_CONTACTS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Contacts = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_EMAIL_REPORT_SETTING_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.EmailReportSetting = (vm.customer && !vm.customer.isCompany) ? false : true;
            // vm.pageTabRights.EmailReportSetting = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_OTHER_DETAIL_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.OtherDetail = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_DOCUMENTS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Documents = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGEMANUFACTURER_HISTORY_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.History = true;
          }
        }
        else if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Detail = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_ADDRESSES_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Addresses = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_WIRE_TRANSFER_ADDRESSES_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.WireTransferAddresses = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.AutomationAddresses = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_CONTACTS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Contacts = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_OTHER_DETAIL_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.OtherDetail = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_STANDARDS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Standards = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_CUSTOM_COMPONENT_APPROVED_DISAPPROVED_DETAIL_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.CustomComponentApprovedDisapprovedDetail = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_REMIT_TO_STATE);
          //if (tab && tab.length > 0 && tab[0].isActive) {
          //  vm.pageTabRights.RemitTo = true;
          //}
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_DOCUMENTS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Documents = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_COMMENT_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.Comments = true;
          }
          tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGESUPPLIER_HISTORY_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.pageTabRights.History = true;
          }
        }
      }
    }

    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        setTabWisePageRights(data);
        $scope.$applyAsync();
      });
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }
    vm.customer = {
      scanDocumentSide: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.ScanDocumentSide.D.type : null),
      requiredOrderQty: (vm.customerType === vm.customerTypeConst.SUPPLIER ? true : null),
      manufacturerMapping: [],
      customerMapping: [],
      supplierMFRMappingType: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.supplierMFRMappingType.OffTheShelf.key : null),
      isCustOrDisty: (vm.customerType === vm.customerTypeConst.CUSTOMER || vm.customerType === vm.customerTypeConst.MANUFACTURER) ? true : false
    };
    vm.enableMappingFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.MappingManufacturer);
    vm.enableDisableExternalAPI = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToEnableDisableExternalAPI);
    vm.dataElementList = [];
    vm.Entity = CORE.Entity;
    vm.entityID = 0;
    vm.isotherContactInfo = false;
    vm.IsEmailSettingTab = false;
    //vm.isBillingAddress = false;
    vm.iscomponentAlias = false;
    vm.isshippingAddress = false;
    vm.isrmashippingAddress = false;
    vm.isLoad = false;
    let oldCompanyName = '';
    let oldCustomerCode = '';
    vm.mfgLength = (vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER || vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) ? CORE.MFG_TYPE_LENGTH.MFG : CORE.MFG_TYPE_LENGTH.DIST;
    vm.isShowAllMFGCustList = true;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.DefaultDateWithoutTimeFormat = _dateDisplayFormat;
    vm.EmptyMesssageAliaslist = USER.ADMIN_EMPTYSTATE.MFG;
    vm.isAllowDeleteCustSuppAlias = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.paymentTypeCategoryTitle = CategoryTypeObjList.PaymentTypeCategory.Title;
    vm.todayDate = new Date();
    let entityTypeTextinLC, entityTypeTextinCC, listPageState = null;
    vm.customerContactList = [];
    vm.datePlaceHolderFormat = CORE.DATE_FORMAT;
    vm.buyDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };

    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.debounceConstant = CORE.Debounce;
    let isCPNUploaded = false;
    const _cpnItemsHeaders = [{ name: vm.LabelConstant.MFG.CPN, field: 'cpn', displayOrder: 1, isActive: true, isRequired: true }, { name: vm.LabelConstant.MFG.Rev, field: 'revision', displayOrder: 2, isActive: true }, { name: vm.LabelConstant.MFG.MFG, field: 'mfgCode', displayOrder: 3, isActive: true, isRequired: true }, { name: vm.LabelConstant.MFG.MFGPN, field: 'mfgPN', displayOrder: 4, isActive: true, isRequired: true }];
    let _dummyEvent = null;
    if (vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER) {
      vm.fromPageRequest = CORE.MFG_TYPE.CUSTOMER;
      entityTypeTextinLC = 'customer';
      entityTypeTextinCC = 'Customer';
      listPageState = USER.ADMIN_CUSTOMER_STATE, { customerType: vm.customerType };
    }
    else if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
      vm.fromPageRequest = CORE.MFG_TYPE.DIST;
      entityTypeTextinLC = 'supplier';
      entityTypeTextinCC = 'Supplier';
      listPageState = USER.ADMIN_SUPPLIER_STATE, { customerType: vm.customerType };
    }
    else if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
      vm.fromPageRequest = CORE.MFG_TYPE.MFG;
      entityTypeTextinLC = 'manufacturer';
      entityTypeTextinCC = 'Manufacturer';
      listPageState = USER.ADMIN_MANUFACTURER_STATE, { customerType: vm.customerType };
    }
    else {
      $state.go(DASHBOARD.DASHBOARD_STATE);
      return;
    }
    vm.radioButtonGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };

    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
      limit: !(vm.ispagination === undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.goBack = (msWizard) => {
      if (vm.wizardOtherDetail && vm.wizardOtherDetail.$dirty) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else if (BaseService.checkFormDirty(vm.wizardStep1CustomerInfo, vm.checkDirtyObject)) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else if (vm.supplierlistForm && vm.supplierlistForm.$dirty) {
        showWithoutSavingAlertforBackButton(msWizard);
      } else {
        BaseService.currentPageForms = [];
        $state.go(listPageState);
      }
    };

    const selectedType = (item) => {
      if (item) {
        vm.customer.authorizeType = item.id;
      }
      else {
        vm.customer.authorizeType = null;
      }
    };

    const getChartOfAccountBySearch = (searchObj) => ChartOfAccountsFactory.getChartOfAccountBySearch().query(searchObj).$promise.then((chartofAccount) => {
      if (chartofAccount) {
        _.each(chartofAccount.data, (item) => item.chartOfAccountsDisplayName = item.acct_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.acct_code, item.acct_name) : item.acct_name);
        if (searchObj && searchObj.acct_id) {
          $scope.$broadcast(vm.autoCompleteChartOfAccounts.inputName, chartofAccount.data[0]);
        }
        return chartofAccount.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const selectCustomer = (item) => {
      if (item) {
        if ($stateParams.customerType === CORE.CUSTOMER_TYPE.CUSTOMER) {
          $state.transitionTo($state.$current, { customerType: $stateParams.customerType, cid: item.id }, { reload: true, location: true, inherit: true, notify: true });
        }
        else if ($stateParams.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
          $state.transitionTo($state.$current, { customerType: $stateParams.customerType, cid: item.id }, { reload: true, location: true, inherit: true, notify: true });
        } else {
          $state.transitionTo($state.$current, { customerType: $stateParams.customerType, cid: item.id }, { reload: true, location: true, inherit: true, notify: true });
        }
        $timeout(() => {
          vm.autoCompleteCustomer.keyColumnId = null;
        }, true);
      }
    };

    const getAllCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      if (customer && customer.data) {
        _.each(customer.data, (item) => {
          item.mfgName = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
        });
        vm.CustomerList = customer.data;
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));

    const getCustomerSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => mfgcodes.data).catch((error) => BaseService.getErrorLog(error));

    /*Auto-complete for Search Customer/Supplier */
    vm.autoCompleteCustomer = {
      columnName: 'mfgCodeName',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: vm.customerType === vm.customerTypeConst.CUSTOMER ? 'Customer' : 'Supplier',
      placeholderName: vm.customerType === vm.customerTypeConst.CUSTOMER ? 'Customer' : 'Supplier',
      isRequired: false,
      isAddnew: false,
      callbackFn: getAllCustomerList,
      onSelectCallbackFn: selectCustomer,
      onSearchFn: (query) => {
        const searchObj = {
          searchQuery: query,
          inputName: vm.autoCompleteCustomer.inputName,
          type: vm.customerType === vm.customerTypeConst.SUPPLIER ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG,
          searchInActive: false

        };
        if (vm.customerType === vm.customerTypeConst.CUSTOMER) {
          searchObj.isCustomer = true;
        }
        return getCustomerSearch(searchObj);
      }
    };

    const initAutoComplete = () => {
      vm.autoCompletePaymentTerm = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customer ? (vm.customer.paymentTermsID ? vm.customer.paymentTermsID : null) : null,
        inputName: CategoryTypeObjList.Terms.Name,
        placeholderName: CategoryTypeObjList.Terms.Title,
        addData: {
          headerTitle: CategoryTypeObjList.Terms.Title,
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CategoryTypeObjList.Terms.Title
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getPaymentTermsList
      };
      vm.autoCompleteSupplierAuthorize = {
        columnName: 'Value',
        keyColumnName: 'id',
        keyColumnId: vm.customer && vm.customer.authorizeType ? vm.customer.authorizeType : vm.supplierAuthorize[0].id,
        inputName: 'Authorize type',
        placeholderName: 'Authorize type',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: selectedType
      };
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customer ? (vm.customer.shippingMethodID ? vm.customer.shippingMethodID : null) : null,
        inputName: CategoryTypeObjList.ShippingType.Name,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: {
          headerTitle: CategoryTypeObjList.ShippingType.Title,
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE]
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: selectShippingMethod
      };
      vm.autoCompleteRMAShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customer ? (vm.customer.rmashippingMethodId ? vm.customer.rmashippingMethodId : null) : null,
        inputName: CategoryTypeObjList.ShippingType.Name,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: {
          headerTitle: CategoryTypeObjList.ShippingType.Title,
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE]
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: selectRMAShippingMethod
      };
      vm.autoCompleteFOB = {
        columnName: 'name',
        controllerName: CORE.MANAGE_FOB_POPUP_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_FOB_POPUP_VIEW,
        keyColumnName: 'id',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_FOB_STATE],
          pageNameAccessLabel: CORE.PageName.fob
        },
        keyColumnId: vm.customer ? (vm.customer.freeOnBoardId ? vm.customer.freeOnBoardId : null) : null,
        inputName: 'FOB',
        placeholderName: 'FOB',
        isRequired: false,
        isAddnew: true,
        callbackFn: getFOBList
      };
      vm.autoCompleteDateCodeFormat = {
        columnName: 'dateCodeFormatValue',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_DC_FORMAT_POPUP_CONTROLLER,
        viewTemplateURL: USER.ADMIN_DC_FORMAT_POPUP_VIEW,
        keyColumnId: vm.customer ? vm.customer.dateCodeFormatID : null,
        inputName: 'dateCodeFormatValue',
        placeholderName: vm.LabelConstant.MFG.MFRDateCodeFormat,
        isRequired: false,
        isAddnew: true,
        callbackFn: getDateCodeFormatList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.autoCompleteCustomer.keyColumnId = item.id;
          }
          else {
            vm.autoCompleteDateCodeFormat.keyColumnId = null;
          }
        }
      };
      vm.autoCompleteCustomerType = {
        columnName: 'value',
        keyColumnName: 'id',
        keyColumnId: vm.customer && vm.customer.customerType ? vm.customer.customerType : 'E',
        inputName: 'value',
        placeholderName: 'Customer Type',
        isRequired: true
      };
      vm.autoCompleteSalesCommosssionTo = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.customer && vm.customer.salesCommissionTo ? vm.customer.salesCommissionTo : null,
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: vm.LabelConstant.Personnel.PageName
        },
        inputName: 'Customer Sales Commission To',
        placeholderName: vm.LabelConstant.Customer.SalesCommossionTo,
        isRequired: true,
        isAddnew: true,
        callbackFn: getSalesCommissionEmployeeListbyCustomer
      };
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customer ? (vm.customer.carrierID ? vm.customer.carrierID : null) : null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getCarrierList
      };
      vm.autoCompleteRMACarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customer ? (vm.customer.rmaCarrierID ? vm.customer.rmaCarrierID : null) : null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getCarrierList
      };
      vm.autoCompleteChartOfAccounts = {
        columnName: 'chartOfAccountsDisplayName',
        controllerName: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW,
        keyColumnName: 'acct_id',
        keyColumnId: vm.customer ? (vm.customer.acctId ? vm.customer.acctId : null) : null,
        inputName: CORE.Chart_of_Accounts.SINGLELABEL,
        placeholderName: CORE.Chart_of_Accounts.SINGLELABEL,
        isRequired: false,
        isAddnew: true,
        callbackFn: getChartOfAccountBySearch,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.customer.acctId = item.acct_id;
          }
          else {
            $scope.$broadcast(vm.autoCompleteChartOfAccounts.inputName, null);
          }
        },
        onSearchFn: (query) => getChartOfAccountBySearch({ searchString: query })
      };
      vm.autoCompleteStandard = {
        columnName: 'standardName',
        controllerName: USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_VIEW,
        keyColumnName: 'standardDisplayName',
        keyColumnId: vm.supplierStandard && vm.supplierStandard.id ? vm.supplierStandard.id : null,
        inputName: vm.LabelConstant.Supplier.Standard,
        placeholderName: vm.LabelConstant.Supplier.Standard,
        addData: {
          pageNameAccessLabel: vm.LabelConstant.Standards.PageName,
          popupAccessRoutingState: [USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE]
        },
        isAddnew: true,
        inputId: 'supplierStandard',
        isRequired: true,
        callbackFn: getCertificateStandard,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (!vm.supplierStandard.id) {
              vm.supplierStandard.standardName = item.standardName;
              vm.supplierStandard.standardDisplayName = item.standardName;
              vm.supplierStandard.standardID = item.standardID;
              vm.supplierStandard.refStandardClassId = item.refStandardClassId || null;
              vm.supplierStandard.className = item.className || null;
            }
          } else {
            vm.StandardsList = _.filter(vm.StandardsList, (item) => item.isActive);
            vm.resetSupplierStandardForm();
          }
        }
      };
    };

    const initRemitToAutoComplete = () => {
      vm.autoCompletePaymentMethod = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customer && vm.customer.paymentMethodID ? vm.customer.paymentMethodID : null,
        inputName: CategoryTypeObjList.PayablePaymentMethods.Name,
        placeholderName: 'Payment Method',
        addData: {
          headerTitle: CategoryTypeObjList.PayablePaymentMethods.Title,
          popupAccessRoutingState: [USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CategoryTypeObjList.PayablePaymentMethods.Title
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getPaymentMethod,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.customer.paymentTypeCategoryName = item.paymentTypeCategory ? item.paymentTypeCategory.gencCategoryName : null;
            vm.customer.bankAccountCode = item.bankMst ? item.bankMst.accountCode : null;
            vm.customer.bankName = item.bankMst ? item.bankMst.bankName : null;
          } else {
            vm.customer.paymentTypeCategoryName = null;
            vm.customer.bankAccountCode = null;
            vm.customer.bankName = null;
          }
        }
      };
    };

    const initPaymentMethodAutoCompleteForCust = () => {
      vm.autoCompletePaymentMethodForCust = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.customer && vm.customer.paymentMethodID ? vm.customer.paymentMethodID : null,
        inputName: CategoryTypeObjList.ReceivablePaymentMethods.Name,
        placeholderName: 'Payment Method',
        addData: {
          headerTitle: CategoryTypeObjList.ReceivablePaymentMethods.Title,
          popupAccessRoutingState: [USER.ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CategoryTypeObjList.ReceivablePaymentMethods.Title
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getReceivablePaymentMethod
      };
    };

    function getDateCodeFormatList() {
      return DCFormatFactory.retriveDateCodeFormatList().query({}).$promise.then((dcFormatList) => {
        if (dcFormatList && dcFormatList.data) {
          vm.dateCodeFormatList = dcFormatList.data;
          return vm.dateCodeFormatList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getAcquiredBySearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query({
        type: vm.mfgType, searchQuery: searchObj.searchQuery, mfgcodeID: searchObj.mfgcodeID
      }).$promise.then((mfgcodes) => {
        let rejectIndex = -1; // remove 0 id db item as not system generated
        _.each(mfgcodes.data, (item, index) => {
          if (item.id === 0) {
            rejectIndex = index;
          }
          item.mfg = item.mfgCode;
          item.mfgCode = BaseService.getMfgCodeNameFormat(item.mfgCode, item.mfgName);
        });

        if (rejectIndex !== -1) {
          mfgcodes.data.splice(rejectIndex, 1);
        }
        if (vm.customer.id) { // remove same updated record from acquired by list
          _.remove(mfgcodes.data, (item) => item.id === vm.customer.id);
        }

        if (searchObj.mfgcodeID) {
          const selectedBuyBy = mfgcodes.data[0];
          $timeout(() => {
            $scope.$broadcast(vm.autoCompleteBuyBy.inputName, selectedBuyBy);
          });
        }
        //vm.mfgCodeDetail = mfgcodes.data;
        //return $q.resolve(vm.mfgCodeDetail);
        return $q.resolve(mfgcodes.data);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getBuyByMfg(item) {
      if (item) {
        vm.customer.whoAcquiredWho.buyBy = item.id;
      }
    }

    function initAutoCompleteAcquired() {
      vm.autoCompleteBuyBy = {
        columnName: 'mfgCode',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.customer.whoAcquiredWho ? vm.customer.whoAcquiredWho.buyBy : null,
        inputName: 'MFG Code',
        placeholderName: 'Acquired By',
        isRequired: true,
        isAddnew: true,
        addData: { mfgType: vm.mfgType },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getAcquiredBySearch(searchObj);
        },
        onSelectCallbackFn: getBuyByMfg,
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteBuyBy.inputName
          };
          return getAcquiredBySearch(searchObj);
        }
      };
    }

    vm.isAcquiredchange = () => {
      if (vm.customer.isAcquired) {
        initAutoCompleteAcquired();
      }
      else {
        vm.customer.whoAcquiredWho = {};
      }
    };

    function showWithoutSavingAlertforBackButton(msWizard) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (msWizard.selectedIndex === vm.CustomerTabs.Detail.ID) {
            if (vm.wizardStep1CustomerInfo) {
              vm.wizardStep1CustomerInfo.$setPristine();
            }
          }
          if (msWizard.selectedIndex === vm.CustomerTabs.OtherDetail.ID) {
            if (vm.wizardOtherDetail) {
              vm.wizardOtherDetail.$setPristine();
            }
          }
          $state.go(listPageState);
        }
      }, (err) => BaseService.getErrorLog(err));
    }

    if (vm.customerType === vm.customerTypeConst.SUPPLIER || vm.customerType === vm.customerTypeConst.CUSTOMER) {
      /** Auto-complete for MFG code */
      vm.autoCompletemfgCode = {
        columnName: 'mfgCode',
        controllerName: vm.customerType !== vm.customerTypeConst.CUSTOMER ? CORE.MANAGE_MFGCODE_MODAL_CONTROLLER : USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: vm.customerType !== vm.customerTypeConst.CUSTOMER ? CORE.MANAGE_MFGCODE_MODAL_VIEW : USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'MFG',
        placeholderName: vm.LabelConstant.MFG.MFG,
        isRequired: false,
        isAddnew: vm.loginUser ? (vm.loginUser.isUserManager || vm.loginUser.isUserAdmin || vm.loginUser.isUserSuperAdmin) : false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: vm.customerType === vm.customerTypeConst.CUSTOMER ? [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE] : [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: vm.customerType === vm.customerTypeConst.CUSTOMER ? CORE.PageName.customer : CORE.PageName.manufacturer
        },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            item.refMfgCodeMstID = item.id ? item.id : (item.refMfgCodeMstID ? item.refMfgCodeMstID : null);
            if (item.refMfgCodeMstID) {
              manufacturerMapping(item);
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletemfgCode.inputName
          };
          return getMfgSearch(searchObj);
        }
      };
    }

    if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
      /** Auto-complete for MFG code */
      vm.autoCompleteCustomerMapping = {
        columnName: 'mfgCode',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'CustomerMapping',
        placeholderName: 'Customer Mapping',
        isRequired: false,
        isAddnew: vm.loginUser ? (vm.loginUser.isUserManager || vm.loginUser.isUserAdmin || vm.loginUser.isUserSuperAdmin) : false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            item.refMfgCodeMstID = item.id ? item.id : (item.refMfgCodeMstID ? item.refMfgCodeMstID : null);
            if (item.refMfgCodeMstID) {
              customerMapping(item);
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteCustomerMapping.inputName,
            isCustomer: true
          };
          return getMfgSearch(searchObj);
        }
      };
    }

    const manufacturerMapping = (item) => {
      vm.customer.manufacturerMapping.push(item);
      $timeout(() => {
        $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
        setFocusByName(vm.autoCompletemfgCode.inputName);
      }, true);
    };
    vm.removeManufacturer = (item, index) => {
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.customerType === vm.customerTypeConst.CUSTOMER ? 'Mapped Customer' : 'Mapped Manufacturer', '');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.wizardStep1CustomerInfo.$setDirty(true);
            vm.customer.manufacturerMapping.splice(index, 1);
            // setFocusByName(vm.autoCompletemfgCode.inputName);
          }
        }, () => {
          //setFocusByName(vm.autoCompletemfgCode.inputName);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    const getMfgSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcode) => {
      if (vm.cid) {
        mfgcode.data = _.filter(mfgcode.data, (mfgData) => mfgData.id !== parseInt(vm.cid));
      }
      _.each(mfgcode.data, (item) => {
        item.refMfgCodeMstID = item.id;
        item.id = null;
        item.mfg = item.mfgCode;
        item.mfgCode = item.mfgCodeName;
      });
      mfgcode.data = _.differenceWith(mfgcode.data, searchObj.isCustomer ? vm.customer.customerMapping : vm.customer.manufacturerMapping, (arrValue, othValue) => arrValue.refMfgCodeMstID === othValue.refMfgCodeMstID);
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
        $timeout(() => {
          if (searchObj.isCustomer) {
            if (vm.autoCompleteCustomerMapping && vm.autoCompleteCustomerMapping.inputName) {
              $scope.$broadcast(vm.autoCompleteCustomerMapping.inputName, mfgcode.data[0]);
            }
          } else {
            if (vm.autoCompletemfgCode && vm.autoCompletemfgCode.inputName) {
              $scope.$broadcast(vm.autoCompletemfgCode.inputName, mfgcode.data[0]);
            }
          }
        }, true);
      }
      return mfgcode.data;
    }).catch((error) => BaseService.getErrorLog(error));

    /* On change MFG name update value in header. */
    vm.changedMfgName = () => {
      vm.formatedMfgName = vm.customer.mfgCode && vm.customer.mfgName ? BaseService.getMfgCodeNameFormat(vm.customer.mfgCode, vm.customer.mfgName) : null;
    };

    /* retrieve customer Details*/
    vm.customerDetails = (cid) => {
      const mfgInfo = {
        mfgType: vm.mfgType,
        //isCustOrDisty: CORE.CUSTOMER_TYPE.CUSTOMER,
        fromPageRequest: vm.fromPageRequest
      };
      return ManufacturerFactory.customer(mfgInfo).query({
        id: cid,
        refTableName: CORE.TABLE_NAME.MFG_CODE_MST
      }).$promise.then((customer) => {
        vm.customer = angular.copy(customer.data);
        vm.customerOldRecord = angular.copy(customer.data);
        vm.isTabDisplay = true;
        $timeout(() => {
          documentReadyMethod();
        }, 0);
        if (vm.customer) {
          /* set default country code value to model if CountryCode not available */
          vm.customer.contactCountryCode = vm.customer.contactCountryCode ? vm.customer.contactCountryCode : CORE.defaultCountryCodeForPhone;
          vm.customer.faxCountryCode = vm.customer.faxCountryCode ? vm.customer.faxCountryCode : CORE.defaultCountryCodeForPhone;
          oldCompanyName = vm.customer.mfgName;
          oldCustomerCode = vm.customer.mfgCode;
          vm.customer.requiredOrderQty = vm.customer.isOrderQtyRequiredInPackingSlip;
          if (vm.customerType === vm.customerTypeConst.SUPPLIER || vm.customerType === vm.customerTypeConst.CUSTOMER) {
            if (vm.customer.supplier_mapping_mstSupplier && vm.customer.supplier_mapping_mstSupplier.length > 0) {
              vm.customer.manufacturerMapping = _.map(vm.customer.supplier_mapping_mstSupplier, (item) => ({
                id: item.id,
                refMfgCodeMstID: item.MfgCodeMstManufacturer.id,
                mfgCode: BaseService.getMfgCodeNameFormat(item.MfgCodeMstManufacturer.mfgCode, item.MfgCodeMstManufacturer.mfgName)
              }));
            } else {
              vm.customer.manufacturerMapping = [];
            }
            if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
              if (vm.customer.supplier_mapping_mstCustomerMapping && vm.customer.supplier_mapping_mstCustomerMapping.length > 0) {
                vm.customer.customerMapping = _.map(vm.customer.supplier_mapping_mstCustomerMapping, (item) => ({
                  id: item.id,
                  refMfgCodeMstID: item.MfgCodeMstCustomer.id,
                  mfgCode: BaseService.getMfgCodeNameFormat(item.MfgCodeMstCustomer.mfgCode, item.MfgCodeMstCustomer.mfgName)
                }));
              } else {
                vm.customer.customerMapping = [];
              }
            }
          }
          vm.taxID = vm.customer.taxID;
          vm.accountRef = vm.customer.accountRef;
          vm.carrierAccount = vm.customer.carrierAccount;
          vm.shippingInsurence = vm.customer.shippingInsurence;
          vm.rmacarrierAccount = vm.customer.rmaCarrierAccount;
          vm.rmashippingInsurence = vm.customer.rmaShippingInsurence;
          vm.oldformatedMfgName = vm.customer.mfgCode && vm.customer.mfgName ? BaseService.getMfgCodeNameFormat(vm.customer.mfgCode, vm.customer.mfgName) : null;
          vm.changedMfgName();
          vm.billingAddressData = {
            addressType: 'B',
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.shippingAddressData = {
            addressType: 'S',
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.rmaAddressData = {
            addressType: 'R',
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.payToAddressData = {
            addressType: 'P',
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.markForAddressData = {
            addressType: CORE.AddressType.IntermediateAddress,
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.wireTransferAddressData = {
            addressType: CORE.AddressType.WireTransferAddress,
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.businessAddressData = {
            addressType: CORE.AddressType.BusinessAddress,
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.rmaIntermediateAddressData = {
            addressType: CORE.AddressType.RMAIntermediateAddress,
            customerId: vm.cid,
            isMasterPage: true,
            alreadySelectedAddressID: null,
            companyNameWithCode: vm.formatedMfgName,
            companyName: vm.customer.mfgName,
            mfgType: vm.mfgType
          };
          vm.contactPersonDetail = {
            companyName: vm.customer.mfgName,
            refTransID: parseInt(vm.cid),
            refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
            isMasterPage: true,
            isFromContactTab: true,
            pageName: vm.currentPageName,
            mfgType: vm.mfgType,
            contactRedirectionFn: () => { vm.goToCustomerContactPersonList(); }
          };
          vm.primaryContPersonsDet = vm.customer.contactPerson;
        }
        if (vm.customer.email) {
          vm.emailList = vm.customer.email ? vm.customer.email.split(',').map((item) => item.trim()) : [];
        }

        /* default alias */
        const aliaslist = vm.aliaslist = angular.copy(vm.customer.mfgCodeAlias);
        vm.customer.alias = [];
        _.each(aliaslist, (data) => {
          var objAlis = {
            alias: data.alias,
            id: data.id,
            createdAt: data.createdAt,
            employeeName: data.user && data.user.employee ? data.user.employee.firstName + ' ' + data.user.employee.lastName : '',
            isSystemGenerated: data.alias === vm.customer.mfgName.toUpperCase() || data.alias === vm.customer.mfgCode,
            isDefaultAlias: data.alias === vm.customer.mfgName.toUpperCase(),
            isMapped: data.invalidMfgMapping.length,
            createdAtValue: data.createdAtValue
          };
          objAlis.index = objAlis.alias.toUpperCase() === vm.customer.mfgCode.toUpperCase() ? 1 : (objAlis.isDefaultAlias ? 2 : 3);
          vm.customer.alias.push(objAlis);
        });

        if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER && vm.customer.mfgCodeTo) {
          vm.customer.whoAcquiredWho = {
            id: vm.customer.mfgCodeTo.id,
            buyBy: vm.customer.mfgCodeTo.buyBy,
            buyTo: vm.customer.mfgCodeTo.buyTo,
            //buyDate: vm.customer.mfgCodeTo.buyDate,
            buyDate: BaseService.getUIFormatedDate(vm.customer.mfgCodeTo.buyDate, vm.DefaultDateWithoutTimeFormat),
            description: vm.customer.mfgCodeTo.description
          };
          vm.disableAcquired = true;
          vm.customer.isAcquired = true;
          initAutoCompleteAcquired();
          delete vm.customer.mfgCodeTo;
        }
        else {
          vm.customer.whoAcquiredWho = {};
        }

        vm.customerCopy = angular.copy(vm.customer);
        if (!vm.customer) {
          vm.customer = {
            scanDocumentSide: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.ScanDocumentSide.D.type : null)
          };
        }
        return $q.resolve(vm.customer);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* Get payment terms detail */
    vm.TermsList = [];
    const getPaymentTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType
      };

      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.TermsList = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //select shipping method
    const selectShippingMethod = (item) => {
      if (item) {
        if (vm.autoCompleteCarriers) {
          if (!vm.customer || (vm.customer && vm.customer.shippingMethodID !== item.gencCategoryID)) {
            vm.autoCompleteCarriers.keyColumnId = item.carrierID;
          }
        }
      }
      else {
        vm.autoCompleteCarriers.keyColumnId = null;
        vm.carrierAccount = null;
      }
    };
    //select rma shipping method
    const selectRMAShippingMethod = (item) => {
      if (item) {
        if (vm.autoCompleteRMACarriers) {
          if (!vm.customer || (vm.customer && vm.customer.rmashippingMethodId !== item.gencCategoryID)) {
            vm.autoCompleteRMACarriers.keyColumnId = item.carrierID;
          }
        }
      }
      else {
        vm.autoCompleteRMACarriers.keyColumnId = null;
      }
    };
    //Get list shipping list
    const getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          vm.ShippingTypeList = shipping.data;
          _.each(shipping.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.ShippingTypeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get carrier list
    const getCarrierList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Carriers.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.id ? true : false
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((carrier) => {
        if (carrier && carrier.data) {
          vm.carrierList = carrier.data;
          _.each(carrier.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.carrierList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get paymentMethod
    const getPaymentMethod = () => {
      const listObj = {
        GencCategoryType: [CategoryTypeObjList.PayablePaymentMethods.Name],
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentMethod) => {
        if (paymentMethod && paymentMethod.data) {
          vm.paymentMethodList = paymentMethod.data;
          return $q.resolve(vm.paymentMethodList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get paymentMethod
    const getReceivablePaymentMethod = () => {
      const listObj = {
        GencCategoryType: [CategoryTypeObjList.ReceivablePaymentMethods.Name],
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((paymentMethod) => {
        if (paymentMethod && paymentMethod.data) {
          vm.receivablePaymentMethodList = paymentMethod.data;
          return $q.resolve(vm.receivablePaymentMethodList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Get list of FOB
    const getFOBList = () =>
      FOBFactory.retrieveFOBList().query().$promise.then((fob) => {
        if (fob && fob.data) {
          vm.FOBList = fob.data;
          return $q.resolve(vm.FOBList);
        }
      }).catch((error) => BaseService.getErrorLog(error));

    //  check and get accesslevel for delete customer/mfg/supplier alias : DELETEROLEACCESS key used right now
    function getAccessLevelForDeleteAlias() {
      return MasterFactory.getAcessLeval().query({
        access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.isAllowDeleteCustSuppAlias = false;
          const currentLoginUserRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.isAllowDeleteCustSuppAlias = true;
          }
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getStandardbySupplier = () => ManufacturerFactory.getStandardbySupplier().query({ id: vm.cid }).$promise.then((response) => {
      vm.supplierStandardsList = [];
      if (response && response.data && response.data.length > 0) {
        vm.supplierStandardsList = response.data;
        _.each(vm.supplierStandardsList, (standard) => {
          standard.standardDisplayName = standard.standardName;
          standard.lastApprovalDate = BaseService.getUIFormatedDate(standard.lastApprovalDate, vm.DefaultDateWithoutTimeFormat);
          standard.expDate = BaseService.getUIFormatedDate(standard.expDate, vm.DefaultDateWithoutTimeFormat);
        });
        return vm.supplierStandardsList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    const intialRenderOnPageLoad = () => {
      let autocompletePromise = [getPaymentTermsList(), getShippingList(), getAccessLevelForDeleteAlias(), getDateCodeFormatList(), getFOBList(), getCarrierList(), getCertificateStandard()];
      //if (vm.currentTabName === vm.CustomerTabs.RemitTo.Name) {
      if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
        autocompletePromise = [...autocompletePromise, ...[getPaymentMethod()]];
      }
      //&& vm.currentTabName === vm.CustomerTabs.BilingAddress.Name
      if (vm.customerType === vm.customerTypeConst.CUSTOMER) {
        autocompletePromise = [...autocompletePromise, ...[getReceivablePaymentMethod()]];
      }

      if (vm.cid) {
        autocompletePromise.push(vm.customerDetails(vm.cid), getStandardbySupplier());
      } else {
        autocompletePromise.push(getSalesCommissionEmployeeListbyCustomer());
        vm.primaryContPersonsDet = [];
        vm.contactPersonDetail = {
          isMasterPage: true,
          isFromContactTab: true,
          pageName: vm.currentPageName,
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
          mfgType: vm.mfgType,
          contactRedirectionFn: () => { vm.goToCustomerContactPersonList(); }
        };
      }
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (!vm.cid) {
          vm.customer = {
            alias: [],
            whoAcquiredWho: {},
            scanDocumentSide: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.ScanDocumentSide.D.type : null),
            requiredOrderQty: (vm.customerType === vm.customerTypeConst.SUPPLIER ? true : null),
            manufacturerMapping: [],
            customerMapping: [],
            supplierMFRMappingType: vm.supplierMFRMappingType.OffTheShelf.key,
            isCustOrDisty: (vm.customerType === vm.customerTypeConst.CUSTOMER) ? true : false
          };
          vm.customer.isActive = true;
          initAutoComplete();
          //if (vm.currentTabName === vm.CustomerTabs.RemitTo.Name) {
          if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
            initRemitToAutoComplete();
          }
        }
        else {
          if (vm.customer.whoAcquiredWho && vm.customer.whoAcquiredWho.buyBy) {
            const autocompletePromise = [getAcquiredBySearch({ mfgcodeID: vm.customer.whoAcquiredWho.buyBy, mfgType: vm.mfgType }), getSalesCommissionEmployeeListbyCustomer()];
            vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
              initAutoComplete();
              getSetCheckDirtyObject();
              //if (vm.currentTabName === vm.CustomerTabs.RemitTo.Name) {
              if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
                initRemitToAutoComplete();
              }
            });
          }
          else {
            const autocompletePromise = [getSalesCommissionEmployeeListbyCustomer()];
            vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
              initAutoComplete();
              getSetCheckDirtyObject();
              //if (vm.currentTabName === vm.CustomerTabs.RemitTo.Name) {
              if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
                initRemitToAutoComplete();
              }
              if (vm.customer && vm.customer.acctId) {
                getChartOfAccountBySearch({ acct_id: vm.customer.acctId });
              }
            });
          }
        }
        if (vm.customerType === vm.customerTypeConst.CUSTOMER) {
          initPaymentMethodAutoCompleteForCust();
        }
        setTabWisePageRights(BaseService.loginUserPageList);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    intialRenderOnPageLoad();

    const getSetCheckDirtyObject = () => {
      $timeout(() => {
        if (vm.cid && vm.wizardStep1CustomerInfo) {
          removeCountryDialCodeManual(vm.customer, vm.customerCopy);
          if (vm.wizardStep1CustomerInfo) {
            vm.wizardStep1CustomerInfo.$setPristine();
          }
          BaseService.checkFormValid(vm.wizardStep1CustomerInfo, false);
          vm.checkDirtyObject = {
            columnName: ['contact', 'faxNumber'],
            oldModelName: vm.customerCopy,
            newModelName: vm.customer
          };
        }
      }, 0);
    };

    function CheckAnyCustomPartSupplierMFRMapping(customerInfo) {
      if (vm.customer.id && vm.currentPageName === CORE.PAGENAME_CONSTANT[21].PageName && vm.autoCompleteDateCodeFormat && vm.autoCompleteDateCodeFormat.keyColumnId) {
        return ManufacturerFactory.CheckAnyCustomPartSupplierMFRMapping().save({ mfgCodeID: vm.customer.id }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data && response.data > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFR_SUPPLIER_MAPPING_CUSTOM_PART);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            return DialogFactory.messageConfirmDialog(model).then((yes) => {
              if (yes) {
                vm.focusDateCode = false;
                saveCustomerInfoEdit(customerInfo);
              }
            }, () => {
              vm.saveDisable = false;
              $timeout(() => {
                if (vm.autoCompleteDateCodeFormat) {
                  $scope.$broadcast(vm.autoCompleteDateCodeFormat.inputName, null);
                  vm.autoCompleteDateCodeFormat.keyColumnId = null;
                }
              }, 0);
              vm.customer.dateCodeFormatID = null;
              vm.focusDateCode = true;
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.focusDateCode = false;
            saveCustomerInfoEdit(customerInfo);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.focusDateCode = false;
        saveCustomerInfoEdit(customerInfo);
      }
    }

    /* add/update customer */
    vm.SaveCustomer = (msWizard, isCheckUnique) => {
      vm.inactiveParts = false;
      if (!vm.customer.isActive && vm.customer.id && (vm.customerOldRecord.isActive !== vm.customer.isActive && (vm.mfgType === CORE.MFG_TYPE.MFG))) {
        vm.cgBusyLoading = ManufacturerFactory.getManufacturerAssignCount().query({ mfrID: vm.customer.id }).$promise.then((res) => {
          if (res.data.partsCount[0].totalcount > 0) {
            const data = {};
            data.mfgName = vm.customer.mfgName;
            data.pageName = vm.currentPageName;
            data.totalCount = res.data.partsCount[0].totalcount;
            DialogFactory.dialogService(
              CORE.MFR_CUSTOMER_INACTIVE_MODAL_CONTROLLER,
              CORE.MFR_CUSTOMER_INACTIVE_MODAL_VIEW,
              vm.event,
              data).then(() => {
              }, (val) => {
                if (val === 1) {
                  vm.inactiveParts = true;
                  saveCustomerDetails(msWizard, isCheckUnique);
                } else if (val === 2) {
                  saveCustomerDetails(msWizard, isCheckUnique);
                }
              }, () => {

              }).catch((error) => BaseService.getErrorLog(error));
          } else {
            saveCustomerDetails(msWizard, isCheckUnique);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        saveCustomerDetails(msWizard, isCheckUnique);
      }
    };
    const saveCustomerDetails = (msWizard, isCheckUnique) => {
      if (vm.alias) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MFG_ALIAS_NOT_ADDED);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            saveCustomerAllDetails(msWizard, isCheckUnique);
          }
          vm.saveDisable = false;
        }, () => {
          vm.saveDisable = false;
        }, () => {
          vm.saveDisable = false;
          // empty
        });
      }
      else {
        saveCustomerAllDetails(msWizard, isCheckUnique);
      }
    };
    const saveCustomerAllDetails = (msWizard, isCheckUnique) => {
      vm.customer.alias = vm.customer.alias ? vm.customer.alias : [];
      /* add name and code as default alias */
      const defaultAliasCode = _.find(vm.customer.alias, (item) => item.alias.toUpperCase() === vm.customer.mfgCode.toUpperCase());
      if (!defaultAliasCode) {
        vm.customer.alias.push({
          alias: vm.customer.mfgCode.toUpperCase(),
          createdAt: new Date(),
          employeeName: vm.loginUser.employee.firstName + ' ' + vm.loginUser.employee.lastName
        });
      }

      const defaultAliasName = _.find(vm.customer.alias, (item) => item.alias.toUpperCase() === vm.customer.mfgName.toUpperCase());
      if (!defaultAliasName) {
        vm.customer.alias.push({
          alias: vm.customer.mfgName.toUpperCase(),
          createdAt: new Date(),
          employeeName: vm.loginUser.employee.firstName + ' ' + vm.loginUser.employee.lastName
        });
      }

      const addedPrimaryContPerson = _.filter(vm.primaryContPersonsDet, (item) => !item.personId);

      const customerInfo = {
        id: vm.customer.id,
        email: vm.emailList.length > 0 ? vm.emailList.join(', ') : null,
        website: vm.customer.website,
        contact: vm.customer.contact,
        mfgName: vm.customer.mfgName,
        mfgCode: vm.customer.mfgCode ? (vm.customer.mfgCode).toUpperCase() : null,
        legalName: vm.customer.legalName,
        comments: vm.customer.comments,
        //customerType: vm.customerType == "S" ? "S" : "C",
        faxNumber: vm.customer.faxNumber,
        phExtension: vm.customer.phExtension,
        isCheckUnique: isCheckUnique ? isCheckUnique : false,
        contactCountryCode: vm.customer.contact ? vm.customer.contactCountryCode : null,
        faxCountryCode: vm.customer.faxNumber ? vm.customer.faxCountryCode : null,
        isActive: vm.customer.isActive,
        isCustOrDisty: vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER ? vm.customer.isCustOrDisty : true,
        mfgType: vm.mfgType,
        authorizeType: vm.mfgType === CORE.MFG_TYPE.DIST ? vm.autoCompleteSupplierAuthorize.keyColumnId : null,
        //isSetMFGAsCustomerAction: isSetMFGAsCustomerAction,
        fromPageRequest: vm.fromPageRequest,
        alias: vm.customer.alias,
        territory: vm.customer.territory,
        whoAcquiredWho: angular.copy(vm.customer.whoAcquiredWho),
        isCompany: vm.customer.id ? vm.customer.isCompany : false,
        //isExistingAliasAllowedToChange: false,
        scanDocumentSide: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.customer.scanDocumentSide : null),
        isOrderQtyRequiredInPackingSlip: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.customer.requiredOrderQty : null),
        dateCodeFormatID: vm.autoCompleteDateCodeFormat.keyColumnId,
        customerType: ((vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER && vm.customer.isCustOrDisty) || (vm.customerType === CORE.CUSTOMER_TYPE.CUSTOMER)) ? vm.autoCompleteCustomerType.keyColumnId : null,
        salesCommissionTo: vm.autoCompleteSalesCommosssionTo.keyColumnId,
        freeOnBoardId: vm.customerType !== CORE.CUSTOMER_TYPE.MANUFACTURER ? vm.autoCompleteFOB.keyColumnId : null,
        supplierMFRMappingType: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.customer.supplierMFRMappingType : null),
        manufacturerMapping: (vm.customerType === vm.customerTypeConst.SUPPLIER || vm.customerType === vm.customerTypeConst.CUSTOMER ? vm.customer.manufacturerMapping : []),
        customerMapping: (vm.customerType === vm.customerTypeConst.SUPPLIER ? vm.customer.customerMapping : []),
        poComment: vm.customer ? vm.customer.poComment : null,
        gencFileOwnerType: vm.customer !== CORE.CUSTOMER_TYPE.MANUFACTURER ? vm.entityName : null,
        invoicesRequireManagementApproval: vm.customer.invoicesRequireManagementApproval,
        isSupplierEnable: vm.customer.isSupplierEnable,
        primaryContPersonsDet: addedPrimaryContPerson,
        paymentTermsID: vm.autoCompletePaymentTerm.keyColumnId ? vm.autoCompletePaymentTerm.keyColumnId : null,
        taxID: vm.taxID,
        accountRef: vm.accountRef,
        acctId: vm.autoCompleteChartOfAccounts.keyColumnId ? vm.autoCompleteChartOfAccounts.keyColumnId : null,
        shippingMethodID: (vm.autoCompleteShipping && vm.autoCompleteShipping.keyColumnId) ? vm.autoCompleteShipping.keyColumnId : null,
        carrierID: (vm.autoCompleteCarriers && vm.autoCompleteCarriers.keyColumnId) ? vm.autoCompleteCarriers.keyColumnId : null,
        carrierAccount: vm.carrierAccount,
        shippingInsurence: vm.shippingInsurence ? true : false,
        rmashippingMethodId: (vm.autoCompleteRMAShipping && vm.autoCompleteRMAShipping.keyColumnId) ? vm.autoCompleteRMAShipping.keyColumnId : null,
        rmaCarrierID: (vm.autoCompleteRMACarriers && vm.autoCompleteRMACarriers.keyColumnId) ? vm.autoCompleteRMACarriers.keyColumnId : null,
        rmaCarrierAccount: vm.rmacarrierAccount,
        rmaShippingInsurence: vm.rmashippingInsurence ? true : false
        //paymentTypeCategoryName: vm.customer.paymentTypeCategoryName,
        //bankAccountCode: vm.customer.bankAccountCode,
        //bankName: vm.customer.bankName
      };
      if (vm.customerType === vm.customerTypeConst.CUSTOMER) {
        customerInfo.paymentMethodID = vm.autoCompletePaymentMethodForCust && vm.autoCompletePaymentMethodForCust.keyColumnId ? vm.autoCompletePaymentMethodForCust.keyColumnId : null;
      }
      else if (vm.customerType === vm.customerTypeConst.SUPPLIER) {
        customerInfo.paymentMethodID = vm.autoCompletePaymentMethod.keyColumnId ? vm.autoCompletePaymentMethod.keyColumnId : null;
      }

      if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER && vm.customer.whoAcquiredWho && vm.customer.whoAcquiredWho.buyDate) {
        //customerInfo.whoAcquiredWho.buyDate = $filter('date')(new Date(vm.customer.whoAcquiredWho.buyDate));
        customerInfo.whoAcquiredWho.buyDate = BaseService.getAPIFormatedDate(vm.customer.whoAcquiredWho.buyDate);
        customerInfo.whoAcquiredWho.buyTo = vm.customer.id;
      }

      customerInfo.contact = addDialCodeForPhnData('id_contact_forcustomer', customerInfo.contact);
      customerInfo.faxNumber = addDialCodeForPhnData('id_faxNumber_forcustomer', customerInfo.faxNumber);

      if (vm.customer.id) {
        if (vm.enableDisableExternalAPI && vm.customer.isSupplierEnable !== vm.customerOldRecord.isSupplierEnable) {
          const Obj = {
            AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
            refID: vm.customer.id,
            refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
            isAllowSaveDirect: false,
            approveFromPage: vm.currentPageName,
            confirmationType: CORE.Generic_Confirmation_Type.ENABLE_DISABLE_SUPPLIER_API_REQUEST,
            transactionType: stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.ENABLE_DISABLE_SUPPLIER_API_REQUEST, vm.customer.mfgName, vm.customer.isSupplierEnable ? 'disable' : 'enable', vm.customer.isSupplierEnable ? 'enable' : 'disable', vm.loginUser.username),
            createdBy: vm.loginUser.userid,
            updatedBy: vm.loginUser.userid
          };
          DialogFactory.dialogService(
            CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
            CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
            null,
            Obj).then((data) => {
              if (data) {
                approvalReasonList.push(data);
                CheckAnyCustomPartSupplierMFRMapping(customerInfo);
              } else {
                vm.saveDisable = false;
              }
            }, (error) => BaseService.getErrorLog(error));
        } else {
          CheckAnyCustomPartSupplierMFRMapping(customerInfo);
        }
      }
      else {
        vm.cgBusyLoading = ManufacturerFactory.managecustomer().save(customerInfo).$promise.then((res) => {
          removeCountryDialCodeManual(customerInfo, vm.customerCopy);
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
            displayCodeAliasUniqueMessage();
          }
          else if (res.data && res.data.status && res.data.status === 'alias') {
            BaseService.currentPageForms = [];
            const alias = res.data.data;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
            messageContent.message = stringFormat(messageContent.message, alias[0].alias, entityTypeTextinLC, alias[0].mfgCodemst.mfgCode);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
          else if (res.data && res.data.id) {
            if (approvalReasonList.length > 0 || mappedMFGList.length > 0) {
              const savePromise = [];
              if (approvalReasonList.length > 0) {
                savePromise.push(saveApprovalReason(res));
              } else {
                isapprove = true;
              }
              if (mappedMFGList.length > 0) {
                savePromise.push(saveMappedMFGs(res));
              } else {
                ismfgMapped = true;
              }
              isPartsUpdate = true;
              vm.cgBusyLoading = $q.all(savePromise).then(() => {
                //$timeout(() => {
                //    commonSetValid(res)
                //}, true);
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              commonSetValid(res);
            }
            getCustomerCount();
          }
          else {
            if (res.data && res.data.fieldName) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  saveCustomerAllDetails(msWizard, false);
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    const saveCustomerInfoEdit = (customerInfo) => {
      vm.cgBusyLoading = ManufacturerFactory.managecustomer().save(customerInfo).$promise.then((res) => {
        removeCountryDialCodeManual(customerInfo, vm.customerCopy);
        getCustomerCount();
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          //BaseService.currentPageForms = [];
          if (approvalReasonList.length > 0 || mappedMFGList.length > 0 || vm.inactiveParts) {
            const savePromise = [];
            if (approvalReasonList.length > 0) {
              savePromise.push(saveApprovalReason(res));
            } else {
              isapprove = true;
            }
            if (mappedMFGList.length > 0) {
              savePromise.push(saveMappedMFGs(res));
            } else {
              ismfgMapped = true;
            }
            if (vm.inactiveParts) {
              savePromise.push(partStatusUpdate(res));
            } else {
              isPartsUpdate = true;
            }
            vm.cgBusyLoading = $q.all(savePromise).then(() => {
              //$timeout(() => {
              //    commonSetValid(res)
              //}, true);
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            commonSetValid(res);
          }
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGName) {
          displayCompanyNameUniqueMessage();
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
          displayCodeAliasUniqueMessage();
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateMapping) {
          vm.cgBusyLoading = false;
          vm.saveDisable = false;
          const duplicateMFR = _.map(res.errors.data.isDuplicateMapping, (item) => item.MfgCodeMstManufacturer.mfgName).join(',');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
          messageContent.message = stringFormat('Manufacturer ' + messageContent.message, duplicateMFR);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              commonSetValid(res);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.status && res.errors.data.status === 'alias') {
          const alias = res.errors.data.data;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
          messageContent.message = stringFormat(messageContent.message, alias[0].alias, entityTypeTextinLC, alias[0].mfgCodemst.mfgCode);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    //use common function to load page
    function commonSetValid(res) {
      if (res.data && res.data.id) {
        vm.customer.id = res.data.id;
        vm.cid = res.data.id;
        vm.contactPersonDetail.companyName = vm.customer.mfgName;
        vm.contactPersonDetail.refTransID = vm.cid;
        $scope.$broadcast('refreshPrimaryContPerson');
      }
      vm.isShowAllMFGCustList = false;
      $state.transitionTo($state.$current, { cid: vm.cid }, { location: true, inherit: true, notify: false });
      $timeout(() => {
        intialRenderOnPageLoad(); // as getting updated alias details
        $timeout(() => {
          removeCountryDialCodeManual(vm.customer, vm.customerCopy);
          if (vm.wizardStep1CustomerInfo) {
            vm.wizardStep1CustomerInfo.$setPristine();
          }
        }, true);
        vm.isShowAllMFGCustList = true;
      }, true);
    }

    //save mapped mfrs
    function saveMappedMFGs(res) {
      return ManageMFGCodePopupFactory.saveMappedManufacturer().query({ mappedManufacturerLst: mappedMFGList }).$promise.then((response) => {
        mappedMFGList = [];
        ismfgMapped = true;
        if (isapprove && ismfgMapped && isPartsUpdate) {
          isapprove = false;
          ismfgMapped = false;
          isPartsUpdate = false;
          commonSetValid(res);
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //save approval reason list
    function saveApprovalReason(res) {
      return MasterFactory.saveAllApprovalReasons().query({ objReasonlst: approvalReasonList }).$promise.then((response) => {
        approvalReasonList = [];
        isapprove = true;
        if (isapprove && ismfgMapped && isPartsUpdate) {
          isapprove = false;
          ismfgMapped = false;
          isPartsUpdate = false;
          commonSetValid(res);
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //update part status
    function partStatusUpdate(res) {
      return ManufacturerFactory.updateComponentStatusToObsolete().query({ mfrID: vm.customer.id }).$promise.then((response) => {
        isPartsUpdate = true;
        if (isapprove && ismfgMapped && isPartsUpdate) {
          isapprove = false;
          ismfgMapped = false;
          isPartsUpdate = false;
          commonSetValid(res);
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* to add customer/supplier alias in alias list */
    vm.updateAliasList = (alias) => {
      vm.disableAliasbutton = true;
      alias = replaceHiddenSpecialCharacter(alias);
      vm.alias = alias;
      const aliasObj = _.find(vm.customer.alias, (item) => item.alias === alias);
      if (aliasObj) {
        const uniqueObj = {
          isSetAliasNull: true
        };

        if (vm.customer.id) {
          //uniqueObj.textContent = stringFormat(CORE.MESSAGE_CONSTANT.MFG_ALIAS_EXISTS, vm.alias, entityTypeTextinCC, "<b>" + vm.customer.mfgCode + "</b>");
          uniqueObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
          uniqueObj.messageContent.message = stringFormat(uniqueObj.messageContent.message, vm.alias, entityTypeTextinCC, vm.customer.mfgCode);
        }
        else {
          //uniqueObj.textContent = CORE.MESSAGE_CONSTANT.ALIAS_EXISTS_GLOBAL;
          uniqueObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS_GLOBAL);
        }
        displayAliasUniqueMessage(uniqueObj);
        vm.wizardStep1CustomerInfo.$setDirty();
      }
      else {
        vm.cgBusyLoading = ManageMFGCodePopupFactory.checkUniqueMFGAlias().save({
          alias: vm.alias,
          mfgType: vm.mfgType,
          fromPageRequest: vm.fromPageRequest
        }).$promise.then((response) => {
          if (response && response.data && (response.data.mfgAliasExistsInfo || response.data.mfgCodeExistsInfo)) {
            if (response.data.mfgAliasExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias === response.data.mfgAliasExistsInfo.alias);
              if (aliasobj) {
                if (vm.alias) {
                  vm.customer.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    employeeName: vm.loginUser.employee.firstName + ' ' + vm.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                checkValidateAliasDetails(response.data.mfgAliasExistsInfo);
              }
            }
            else if (response.data.mfgCodeExistsInfo) {
              const aliasobj = _.find(vm.aliaslist, (alias) => alias.alias === response.data.mfgCodeExistsInfo.mfgName);
              if (aliasobj) {
                if (vm.alias) {
                  vm.customer.alias.unshift({
                    id: aliasobj.id,
                    alias: vm.alias,
                    createdAt: new Date(),
                    employeeName: vm.loginUser.employee.firstName + ' ' + vm.loginUser.employee.lastName
                  });
                }
                vm.alias = null;
              } else {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
                messageContent.message = stringFormat(messageContent.message, vm.alias, entityTypeTextinCC, response.data.mfgCodeExistsInfo.mfgCode);
                const uniqueObj = {
                  messageContent: messageContent,
                  isSetAliasNull: true
                };
                displayAliasUniqueMessage(uniqueObj);
                return;
              }
            }
          } else {
            if (vm.alias) {
              vm.customer.alias.unshift({
                alias: vm.alias,
                createdAt: new Date(),
                employeeName: vm.loginUser.employee.firstName + ' ' + vm.loginUser.employee.lastName
              });
            }
            vm.alias = null;
          }
          vm.wizardStep1CustomerInfo.$setDirty();
          vm.disableAliasbutton = false;
        });
      }
    };

    function checkValidateAliasDetails(mfgalias) {
      if (mfgalias) {
        //var obj = mfgalias;
        //var mfgObj = {};
        //mfgObj.mfgCode = obj.mfgCodemst.mfgCode;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALIAS_EXISTS);
        messageContent.message = stringFormat(messageContent.message, vm.alias, entityTypeTextinLC, mfgalias.mfgCodemst.mfgCode);
        const uniqueObj = {
          messageContent: messageContent,
          isSetAliasNull: true
        };
        displayAliasUniqueMessage(uniqueObj);
        return true;
      }
      return false;
    }

    /* to remove customer/supplier alias */
    vm.removeAliasFromList = ($event, $index, aliasName) => {
      if (vm.customer.alias[$index].id) {
        const objMFGDetail = {
          AccessRole: CORE.ROLE_ACCESS.MFRRemoveAccess,
          refID: vm.customer.alias[$index].id,
          refTableName: CORE.TABLE_NAME.MFG_CODE_ALIAS,
          isAllowSaveDirect: false,
          approveFromPage: vm.currentPageName,
          confirmationType: CORE.Generic_Confirmation_Type.MFR_REMOVE_REASON,
          transactionType: stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.MFR_REMOVE_REASON, aliasName.alias, vm.customer.mfgName),
          createdBy: vm.loginUser.userid,
          updatedBy: vm.loginUser.userid
        };
        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          $event, objMFGDetail).then((data) => {
            if (data) {
              vm.customer.alias.splice(_.indexOf(vm.customer.alias, aliasName), 1);
              vm.wizardStep1CustomerInfo.$setDirty();
              vm.wizardStep1CustomerInfo.companyName.$dirty = true;
              approvalReasonList.push(data);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.customer.alias.splice(_.indexOf(vm.customer.alias, aliasName), 1);
        /* manually set form dirty */
        vm.wizardStep1CustomerInfo.$setDirty();
        vm.wizardStep1CustomerInfo.companyName.$dirty = true;
        //vm.checkDirty = true;
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };


    /* Show save alert popup when performing next and previous*/
    function showWithoutSavingAlertforNextPrevious(msWizard, isSave) {
      const selectedIndex = msWizard.selectedIndex;
      if (isSave) {
        if (selectedIndex === vm.CustomerTabs.Detail.ID) {
          vm.SaveCustomer(msWizard, true);
        }
        else if (selectedIndex === vm.CustomerTabs.OtherDetail.ID) {
          vm.finish();
        }
        else if (msWizard.selectedIndex === vm.CustomerTabs.Standards.ID) {
          vm.saveStandards();
        }
      }
    }
    vm.CheckStepAndAction = (msWizard, isUnique, isSave, ev) => {
      let isChanged = true;
      vm.event = ev;
      if (msWizard.selectedIndex === vm.CustomerTabs.Detail.ID) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.wizardStep1CustomerInfo)) {
            vm.saveDisable = false;
            return;
          }
        }
        isChanged = BaseService.checkFormDirty(vm.wizardStep1CustomerInfo, vm.checkDirtyObject);
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
      }
      else if (msWizard.selectedIndex === vm.CustomerTabs.OtherDetail.ID) {
        if (isSave) {
          vm.saveDisable = true;
          if (BaseService.focusRequiredField(vm.wizardOtherDetail)) {
            vm.saveDisable = false;
            return;
          }
        }
        vm.finish();
      }
      else if (msWizard.selectedIndex === vm.CustomerTabs.Standards.ID) {
        if (isSave) {
          vm.saveDisable = true;
        }
        isChanged = BaseService.checkFormDirty(vm.supplierlistForm, vm.checkDirtyObject);
        showWithoutSavingAlertforNextPrevious(msWizard, isSave, isChanged, false);
      }
    };

    vm.saveStandards = () => {
      if (vm.saveRecords.length > 0 || vm.updateRecords.length > 0 || vm.deleteRecords.length > 0) {
        const obj = { updateRecords: vm.updateRecords, saveRecords: vm.saveRecords, deleteRecords: vm.deleteRecords };
        vm.cgBusyLoading = ManufacturerFactory.saveStandards().query(obj).$promise.then((response) => {
          vm.saveDisable = false;
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveRecords = [];
            vm.updateRecords = [];
            vm.deleteRecords = [];
            vm.resetSupplierStandardForm();
            getStandardbySupplier();
            vm.supplierlistForm.$setPristine();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.saveDisable = false;
        NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
        return;
      }
    };

    vm.editStandardDetails = (item) => {
      if (vm.supplierStandardsForm.$dirty) {
        const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_DETAIL_WORK_CONFIRMATION;
        const obj = {
          messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(obj).then(() => vm.editRecords(item), () => { });
      } else {
        vm.editRecords(item);
      }
    };

    vm.editRecords = (item) => {
      vm.supplierStandardsForm.$setPristine();
      vm.supplierStandard = angular.copy(item);
      if (vm.supplierStandard.id > 0) {
        getCertificateStandard();
      } else {
        vm.autoCompleteStandard.keyColumnId = vm.supplierStandard.standardDisplayName;
      }
    };

    vm.deleteStandard = (item) => {
      if (vm.supplierlistForm && vm.supplierlistForm.$$controls[1]) {
        vm.supplierlistForm.$$controls[1].$setDirty();
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Standards.PageName);
      const obj = {
        messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.isAllSelect = false;
        if (item) {
          vm.supplierStandardsList = _.filter(vm.supplierStandardsList, (data) => data.id !== item.id);
          if (item.id > 0) {
            vm.deleteRecords.push(item.id);
          } else {
            vm.saveRecords = _.filter(vm.saveRecords, (data) => data.id !== item.id);
          }
        } else {
          vm.supplierStandardsList = _.filter(vm.supplierStandardsList, (data) => !data.isSelect);
          _.each(vm.selectedRecord, (data) => {
            if (data.id > 0) {
              vm.deleteRecords.push(data.id);
            } else {
              vm.saveRecords = _.filter(vm.saveRecords, (standard) => standard.id !== data.id);
            }
          });
        }
        vm.selectedRecord = [];
      }, () => {
      });
    };

    vm.resetSupplierStandardForm = () => {
      vm.supplierStandard = {
        standardStatus: vm.standardStatus.NA.id
      };
      vm.autoCompleteStandard.keyColumnId = null;
      $timeout(() => {
        vm.supplierStandardsForm.$setPristine();
        setFocusByName(vm.autoCompleteStandard.inputName);
      });
    };

    // set default person
    vm.setDefaultPerson = (ev, callbackPerson) => {
      if (callbackPerson) {
        vm.setDefaultContactPerson(callbackPerson.personId);
      }
    };


    // get customer address list based on address type
    vm.getCustomerAddressesList = (addressType) => {
      vm.NoAddressFound = false;
      vm.addressList = [];
      if (vm.cid) {
        vm.cgBusyLoading = CustomerFactory.customerAddressList().query({
          customerId: vm.cid,
          addressType: addressType,
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST
        }).$promise.then((addressesData) => {
          vm.addressList = addressesData.data;
          vm.NoAddressFound = vm.addressList && vm.addressList.length > 0 ? false : true;
          setOtherDetForCustAddrDir();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    // open addEdit Addresses popup
    vm.addEditAddress = (addressType, cId, objAddress, ev) => {
      const data = {};
      data.customerId = cId;
      data.companyName = vm.customer.mfgName;
      data.companyNameWithCode = BaseService.getMfgCodeNameFormat(vm.customer.mfgCode, vm.customer.mfgName);
      data.objAddress = objAddress ? objAddress : null;
      data.addressType = addressType;
      data.mfgType = vm.customer.mfgType;
      data.customerType = vm.customerType;
      data.isMasterPage = true;
      DialogFactory.dialogService(
        USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
        USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
        ev,
        data).then(() => {
        }, () => {
          vm.getCustomerAddressesList(addressType);
        }, (err) => BaseService.getErrorLog(err));
    };

    //Get customer Comments Count
    const getCustomerCount = () => {
      const parameterModel = {
        mfgCodeId: vm.cid
      };
      return CustomerFactory.getCustomerCommentsCount().query(parameterModel).$promise.then((commentsCount) => {
        if (commentsCount && commentsCount.data) {
          vm.commentsCount = commentsCount.data.totalCommentsCount;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCustomerCount();
    $scope.$on('customerCommentCount', () => {
      getCustomerCount();
    });

    /*To save other value detail
    Note:If any step added after other detail just remove function body and add logic of last step
    */
    vm.fileList = {};
    vm.finish = () => {
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
        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        if (vm.wizardOtherDetail) {
          vm.wizardOtherDetail.$setPristine();
        }
        /* code for rebinding document document to download - (actually all other details) */
        //if (vm.fileList && !_.isEmpty(vm.fileList)) {
        vm.IsOtherDetailTab = false;
        vm.fileList = {};
        $timeout(() => {
          vm.IsOtherDetailTab = true;
        }, 0);
        //}
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.stateTransfer = (tabName, subTabName) => {
      let stateDetail = '';
      if ((tabName && tabName !== vm.currentTabName) || (subTabName && subTabName !== vm.currentSubTabName)) {
        switch (tabName) {
          case vm.CustomerTabs.Detail.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE;
            } else if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.Addresses.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_ADDRESSES_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_ADDRESSES_STATE;
            } else if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_ADDRESSES_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.WireTransferAddresses.Name: {
            if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_WIRE_TRANSFER_ADDRESSES_STATE;
              $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            }
            break;
          }
          case vm.CustomerTabs.AutomationAddresses.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_STATE;
            } else if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_AUTOMATION_ADDRESSES_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.Contacts.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_CONTACTS_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_CONTACTS_STATE;
            }
            else if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_CONTACTS_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.OtherDetail.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_OTHER_DETAIL_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_OTHER_DETAIL_STATE;
            }
            else if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_OTHER_DETAIL_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.Standards.Name: {
            stateDetail = USER.ADMIN_MANAGESUPPLIER_STANDARDS_STATE;
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.PersonnelMapping.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_PERSONNEL_MAPPING_STATE;
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.CPN.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_CPN_STATE;
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.LOA.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_LOA_STATE;
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.EmailReportSetting.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_EMAIL_REPORT_SETTING_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_EMAIL_REPORT_SETTING_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.Inventory.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_INVENTORY_STATE;
            //$state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid});
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid, subTab: USER.CustomerInventoryTabs.UMIDStock.Name });
            break;
          }
          case vm.CustomerTabs.CustomComponentApprovedDisapprovedDetail.Name: {
            stateDetail = USER.ADMIN_MANAGESUPPLIER_CUSTOM_COMPONENT_APPROVED_DISAPPROVED_DETAIL_STATE;
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.Documents.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_DOCUMENTS_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_DOCUMENTS_STATE;
            } else if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_DOCUMENTS_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.ManufacturerDocuments.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMERMFR_DOCUMENTS_STATE;
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.Comments.Name: {
            if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_COMMENT_STATE;
            }
            else {
              stateDetail = USER.ADMIN_MANAGECUSTOMER_COMMENT_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          case vm.CustomerTabs.History.Name: {
            stateDetail = USER.ADMIN_MANAGECUSTOMER_HISTORY_STATE;
            if (vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
              stateDetail = USER.ADMIN_MANAGESUPPLIER_HISTORY_STATE;
            } else if (vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
              stateDetail = USER.ADMIN_MANAGEMANUFACTURER_HISTORY_STATE;
            }
            $state.go(stateDetail, { customerType: vm.customerType, cid: vm.cid });
            break;
          }
          default:
        }
      }
    };

    vm.stateTransferInventory = (tabName) => {
      const itemTabName = _.find(vm.CustomerInventoryTabs, (valItem) => valItem.Name === tabName);
      var stateDetail = '';
      if (itemTabName && itemTabName.Name !== vm.currentInventoryTab) {
        switch (itemTabName.Name) {
          case vm.CustomerInventoryTabs.UMIDStock.Name:
            vm.currentInventoryTab = vm.CustomerInventoryTabs.UMIDStock.Name;
            vm.selectedInventoryTabIndex = itemTabName.ID;
            stateDetail = USER.ADMIN_MANAGECUSTOMER_INVENTORY_STATE;
            $state.transitionTo(stateDetail, { customerType: vm.customerType, cid: vm.cid, subTab: USER.CustomerInventoryTabs.UMIDStock.Name }, { location: true, inherit: true, notify: true });
            break;
          case vm.CustomerInventoryTabs.AssemblyStock.Name:
            vm.currentInventoryTab = vm.CustomerInventoryTabs.AssemblyStock.Name;
            vm.selectedInventoryTabIndex = itemTabName.ID;
            stateDetail = USER.ADMIN_MANAGECUSTOMER_INVENTORY_STATE;
            $state.transitionTo(stateDetail, { customerType: vm.customerType, cid: vm.cid, subTab: USER.CustomerInventoryTabs.AssemblyStock.Name }, { location: true, inherit: true, notify: true });
            break;
          default:
        }
      }
    };


    /* Manually put as load "ViewDataElement directive" only on other details tab */
    vm.onTabChanges = (TabName, msWizard, subTabName) => {
      setTabWisePageRights(BaseService.loginUserPageList);
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(TabName, subTabName);
      $('#content').animate({ scrollTop: 0 }, 200);
    };

    vm.onInventoryTabChanges = (TabName, msWizard) => {
      setTabWisePageRights(BaseService.loginUserPageList);
      msWizard.selectedIndex = vm.selectedTabInventory;
      vm.stateTransferInventory(TabName);
      $('#content').animate({ scrollTop: 0 }, 200);
    };

    /* delete billing-shipping address */
    vm.deleteBillingShippingAddress = (ev, objAddress) => {
      if (!objAddress || !objAddress.id || !objAddress.addressType) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SOMTHING_WRONG);
        const alertModel = {
          messageContent: messageContent
        };
        DialogFactory.messageAlertDialog(alertModel);
        return;
      }
      let selectedIDs = [];
      if (objAddress) {
        selectedIDs.push(objAddress.id);
      }
      else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((departmentItem) => departmentItem.id);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, vm.addressType[objAddress.addressType].title, 1);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        const _objDelete = {};
        _objDelete.id = objAddress.id,
          _objDelete.addressType = objAddress.addressType;
        _objDelete.CountList = false;

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = CustomerFactory.deleteCustomerAddresses().query({
              objDelete: _objDelete
            }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: vm.addressType[objAddress.addressType].title
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return CustomerFactory.deleteCustomerAddresses().query({ objDelete: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = null;
                      data.PageName = vm.addressType[objAddress.addressType].title;
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
                  vm.getCustomerAddressesList(objAddress.addressType);
                }
              } else {
                vm.getCustomerAddressesList(objAddress.addressType);
              }
              //if (respose.data && respose.data.TotalCount && respose.data.TotalCount > 0) {
              //  BaseService.deleteAlertMessage(respose.data);
              //}
              //else {
              //  vm.getCustomerAddressesList(objAddress.addressType);
              //}
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.selectedOtherPermission = () => vm.gridOptions.getSelectedRowsCount ? vm.gridOptions.getSelectedRowsCount() : 0;

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      let isDirty = false;
      switch (step) {
        case vm.CustomerTabs.Detail.ID: {
          isDirty = BaseService.checkFormDirty(vm.wizardStep1CustomerInfo, vm.checkDirtyObject);
          if (isDirty || vm.wizardStep1CustomerInfo.$dirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
        }
        case vm.CustomerTabs.OtherDetail.ID: {
          //checked null condition due to tab is visible on condition basis,
          //conflict with email report setting tab in manufacturer master page
          isDirty = vm.wizardOtherDetail ? vm.wizardOtherDetail.$dirty : false;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
        }
        case vm.CustomerTabs.Standards.ID: {
          isDirty = (vm.supplierlistForm && vm.supplierlistForm.$dirty);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          }
          else {
            return true;
          }
        }
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.isSave = false;
        approvalReasonList = [];
        if (step === vm.CustomerTabs.Detail.ID) {
          vm.alias = null;
          vm.customerDetails(vm.cid);
          if (vm.wizardStep1CustomerInfo) {
            vm.wizardStep1CustomerInfo.$setPristine();
          }
          return true;
        }
        else if (step === vm.CustomerTabs.OtherDetail.ID) {
          if (vm.wizardOtherDetail) {
            vm.wizardOtherDetail.$setPristine();
          }
          return true;
        }
        else if (step === vm.CustomerTabs.Standards.ID) {
          if (vm.supplierlistForm) {
            vm.supplierlistForm.$setPristine();
          }
          return true;
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }


    /* [E] Component customer LOA section [E] */

    vm.CPNTextCopiedStatus = () => {
      vm.showCPNStatus = false;
    };
    //copy MFG PN on click
    vm.copyCPNText = (item) => {
      const copytext = item;
      const $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showCPNStatus = true;
    };


    //remove MFG PN copied status on hover
    vm.MFGPNStatus = () => {
      vm.showMFGPNstatus = false;
    };
    //copy MFG PN on click
    vm.copyMFGPNText = (item) => {
      const copytext = item;
      const $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copytext).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showMFGPNstatus = true;
    };

    // Function call on company name blue event and check company name exist and ask for confirmation
    vm.checkDuplicateCompanyName = () => {
      if (oldCompanyName !== vm.customer.mfgName) {
        if (vm.wizardStep1CustomerInfo && vm.wizardStep1CustomerInfo.companyName.$dirty && vm.customer.mfgName) {
          vm.cgBusyLoading = ManufacturerFactory.checkDuplicateMFGName().query({
            mfgCodeMstID: vm.customer.id,
            mfgName: vm.customer.mfgName,
            mfgType: vm.mfgType
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldCompanyName = angular.copy(vm.customer.mfgName);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGName) {
              displayCompanyNameUniqueMessage();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    // Function call on customer code blue event and check code exist or not
    vm.checkDuplicateCustomerCode = () => {
      if (oldCustomerCode !== vm.customer.mfgCode) {
        if (vm.wizardStep1CustomerInfo && vm.wizardStep1CustomerInfo.customerCode.$dirty && vm.customer.mfgCode) {
          vm.cgBusyLoading = ManufacturerFactory.checkDuplicateMFGCode().save({
            mfgCodeMstID: vm.customer.id,
            mfgCode: vm.customer.mfgCode,
            mfgType: vm.mfgType
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldCustomerCode = angular.copy(vm.customer.mfgCode);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCustomerMFGCode) {
              displayCodeAliasUniqueMessage();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* display customer code unique confirmation message */
    const displayCodeAliasUniqueMessage = () => {
      oldCustomerCode = '';
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
      messageContent.message = stringFormat(messageContent.message, vm.customer.mfgCode);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      vm.customer.mfgCode = null;
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName('customerCode');
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* display company name unique confirmation message */
    const displayCompanyNameUniqueMessage = () => {
      oldCompanyName = '';
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
      messageContent.message = stringFormat(messageContent.message, vm.customer.mfgName);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      vm.customer.mfgName = null;
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocusByName('companyName');
      });
    };

    /* mfg alias unique message */
    const displayAliasUniqueMessage = (uniqueObj) => {
      const obj = {
        messageContent: uniqueObj.messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        vm.disableAliasbutton = false;
        setFocusByName('mfgcodealias');
      }, () => {
        vm.disableAliasbutton = false;
        if (uniqueObj.isSetAliasNull) {
          vm.alias = null;
        }
      }).catch((error) => {
        vm.disableAliasbutton = false;
        return BaseService.getErrorLog(error);
      });
    };

    /* Open History Popup. */
    vm.openCustomerChangesHistory = (ev) => {
      const data = {
        id: vm.cid,
        title: `${vm.currentPageName} History`,
        TableName: vm.HistoryTableName,
        headerData: [{
          label: vm.currentPageName,
          value: vm.oldformatedMfgName,
          displayOrder: 1,
          valueLinkFn: vm.addCustomer,
          valueLinkFnParams: vm.cid,
          labelLinkFn: vm.gotoCustomerList
        }]
      };
      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goPaymentTermList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_TERMS_STATE, {});
    };

    /* set selected alias as default one and set it as mfgname */
    vm.setAliasAsDefault = (aliasItem) => {
      if (aliasItem && aliasItem.id) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SET_ALIAS_AS_DEFAULT_NAME);
        messageContent.message = stringFormat(messageContent.message, aliasItem.alias, 'company');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.customer.mfgName = aliasItem.alias;
            const defaultAlias = _.find(vm.customer.alias, (dAlias) => dAlias.isDefaultAlias === true);
            if (defaultAlias) {
              defaultAlias.index = (defaultAlias.index === 1 ? defaultAlias.index : 3); //mfg code should be om first
              defaultAlias.isDefaultAlias = false;
            }
            //vm.customer.alias.map(item => item.isDefaultAlias = false);
            aliasItem.isDefaultAlias = true;
            aliasItem.index = (aliasItem.index === 1 ? aliasItem.index : 2);
            // Static code to enable save button
            vm.wizardStep1CustomerInfo.$$controls[0].$setDirty();
          }
        }, () => {
          // empty
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* called for max date validation */
    vm.getMaxDateValidation = (FromDate, ToDate) => BaseService.getMaxDateValidation(FromDate, ToDate);

    //redirect to Shipping method list
    vm.goShippingMethodList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE);
    };

    /* get all contact list of selected customer/mfg/supplier  */
    // remove contact person
    vm.removePerson = (ev, callBackPerson) => {
      vm.deleteContactPersonInfo(callBackPerson, ev);
    };
    vm.mappManufacturers = (ev, alias) => {
      alias.mfgCodeID = vm.cid;
      alias.mappedMFGList = _.filter(mappedMFGList, (mapp) => mapp.refmfgAliasID === alias.id && mapp.refmfgAliasName === alias.alias);
      alias.type = vm.mfgType;
      alias.name = vm.currentPageName;
      DialogFactory.dialogService(
        CORE.INVALID_MFR_MAPPING_MODAL_CONTROLLER,
        CORE.INVALID_MFR_MAPPING_MODAL_VIEW,
        ev, alias).then((data) => {
          if (data) {
            checkandmappList(data);
            vm.wizardStep1CustomerInfo.$setDirty();
            vm.wizardStep1CustomerInfo.companyName.$dirty = true;
          }
        }, () => {

        }).catch((error) => BaseService.getErrorLog(error));
    };
    //mapplist for manufacturers
    function checkandmappList(mfgList) {
      if (mfgList.length > 0) {
        mappedMFGList = _.filter(mappedMFGList, (removeMapp) => removeMapp.refmfgAliasName !== mfgList[0].refmfgAliasName);
      }
      _.each(mfgList, (objMFG) => {
        if (objMFG.isremove) {
          mappedMFGList = _.filter(mappedMFGList, (removeMapp) => removeMapp.refmfgAliasName !== objMFG.refmfgAliasName);
        }
        if (!_.find(mappedMFGList, (mfgDet) => mfgDet.refmfgCodeID === objMFG.refmfgCodeID && mfgDet.refmfgAliasName === objMFG.refmfgAliasName)) {
          mappedMFGList.push(objMFG);
        }
        //new added alias
        const objAlias = _.find(vm.customer.alias, (alias) => alias.alias === objMFG.refmfgAliasName);
        if (objAlias) {
          if (!objMFG.isremove) {
            objAlias.isMapped = 1;
          }
          else {
            objAlias.isMapped = 0;
          }
        }
      });
    }

    const removeCountryDialCodeManual = (modelObj, modelCopyObj) => {
      modelObj.contact = removeDialCodeForPhnData('id_contact_forcustomer', modelObj.contact);
      modelObj.faxNumber = removeDialCodeForPhnData('id_faxNumber_forcustomer', modelObj.faxNumber);
      if (modelCopyObj && !_.isEmpty(modelCopyObj)) {
        modelCopyObj.contact = modelObj.contact;
        modelCopyObj.faxNumber = modelObj.faxNumber;
      }
    };

    vm.employeelist = () => {
      BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
    };

    // Add new Customer/ Supplier
    vm.addCustomer = (cid, openInSameTab) => {
      if ($stateParams.customerType === CORE.CUSTOMER_TYPE.CUSTOMER) {
        vm.goToCustomer(cid, openInSameTab);
      } else if ($stateParams.customerType === CORE.CUSTOMER_TYPE.SUPPLIER) {
        BaseService.goToSupplierDetail(cid, openInSameTab);
      } else if ($stateParams.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER) {
        BaseService.goToManufacturer(cid, openInSameTab);
      }
    };

    $scope.$on('CustomerAssemblyStock', (ev, data) => {
      vm.isNoCustomerAssembyStock = data;
    });
    // Go to Customer/Supplier list page
    vm.gotoCustomerList = () => {
      BaseService.openInNew(listPageState);
    };

    vm.validateEmail = () => {
      const invalidEmailList = [];
      vm.invalidEmailErrorMessage = null;
      let invalidEmail = null;
      if (vm.emailList && vm.emailList.length > 0) {
        _.find(vm.emailList, (obj) => {
          vm.isValidEmail = vm.EmailPattern.test(obj) ? true : false;
          if (!vm.isValidEmail) { invalidEmailList.push(obj); }
        });
        invalidEmail = invalidEmailList && invalidEmailList.length > 0 ? invalidEmailList.join(', ') : null;
        if (invalidEmail !== null && invalidEmail !== '') {
          const messageContent = angular.copy(CORE.INVALID_EMAIL);
          vm.invalidEmailErrorMessage = stringFormat(messageContent, invalidEmail);
        }
        if (!vm.isValidEmail) {
          $scope.$applyAsync(() => {
            vm.wizardStep1CustomerInfo.email.$setValidity('emailpattern', false);
          });
          return false;
        }
        vm.wizardStep1CustomerInfo.email.$setValidity('emailpattern', true);
        return true;
      }
    };
    //link to go for manufacturer master list page
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };
    //link to go for customer master list page
    vm.goToCustomerPageList = () => {
      BaseService.goToCustomerList();
    };

    vm.goToPayablePaymentMethodList = () => {
      BaseService.goToGenericCategoryPayablePaymentMethodList();
    };

    vm.goToReceivablePaymentMethodList = () => {
      BaseService.goToGenericCategoryReceivablePaymentMethodList();
    };

    vm.goToBankList = () => {
      BaseService.goToBankList();
    };

    vm.goToCustomerDetail = () => {
      vm.goToCustomer(vm.cid);
    };

    vm.goChartOfAccountsList = () => BaseService.goToChartOfAccountList();

    function documentReadyMethod() {
      if (vm.isTabDisplay) {
        switch (vm.currentTabName) {
          case vm.CustomerTabs.Detail.Name:
            if (vm.wizardStep1CustomerInfo) {
              vm.wizardStep1CustomerInfo.$setPristine();
            }
            BaseService.currentPageForms = [vm.wizardStep1CustomerInfo];
            break;
          case vm.CustomerTabs.Contacts.Name:
            BaseService.currentPageForms = [vm.wizardStep2IOtherPersonContactnfo];
            break;
          case vm.CustomerTabs.OtherDetail.Name:
            if (vm.wizardOtherDetail) {
              vm.wizardOtherDetail.$setPristine();
            }
            BaseService.currentPageForms = [vm.wizardOtherDetail];
            break;
          case vm.CustomerTabs.Standards.Name:
            if (vm.supplierlistForm) {
              vm.supplierlistForm.$setPristine();
            }
            BaseService.currentPageForms = [vm.supplierlistForm];
            break;
          case vm.CustomerTabs.PersonnelMapping.Name:
            BaseService.currentPageForms = [vm.personnelMappingForm];
            break;
          case vm.CustomerTabs.CPN.Name:
            BaseService.currentPageForms = [vm.wizardStep5ComponentAlias];
            break;
          case vm.CustomerTabs.LOA.Name:
            BaseService.currentPageForms = [vm.customerLOA];
            break;
          case vm.CustomerTabs.EmailReportSetting.Name:
            BaseService.currentPageForms = [vm.wizardEmailReportSetting];
            break;
        }
        /*after page activate tab contains*/
        activeCurrentTab(vm.currentTabName, vm.currentSubTabName);
      }
    }
    /* to go at Edit Manufacture Code details page  */
    vm.goToManufacturer = (mfgCodeID) => {
      BaseService.goToManufacturer(mfgCodeID);
      return false;
    };

    // go to carrier list page
    vm.goTocarrierList = () => {
      BaseService.goToGenericCategoryCarrierList();
    };
    /* show change company ownership popup for email and new company ownership selection */
    vm.changeOwnership = (ev) => {
      const data = {
        toCompany: vm.customer.mfgName,
        id: vm.customer.id
        // email: vm.emailList[0] ? vm.emailList[0] : null
        // email: vm.emailList
      };
      DialogFactory.dialogService(
        USER.ADMIN_CHANGE_COMPANY_OWNERSHIP_POPUP_CONTROLLER,
        USER.ADMIN_CHANGE_COMPANY_OWNERSHIP_POPUP_VIEW,
        ev,
        data).then(() => {
          // yes
        }, () => {
          // Cancel
        }).catch((error) => BaseService.getErrorLog(error));
    };
    /*--------------Document count--------------*/

    const getComponentHeaderCountDetail = () => {
      const roleDetail = _.find(vm.loginUser.roles, (roleItem) => roleItem.id === vm.loginUser.defaultLoginRoleID);
      vm.entityID = vm.customerType === CORE.CUSTOMER_TYPE.SUPPLIER ? CORE.AllEntityIDS.Supplier.ID : vm.customerType === CORE.CUSTOMER_TYPE.MANUFACTURER ? CORE.AllEntityIDS.Manufacturer.ID : CORE.AllEntityIDS.Customer.ID;
      const parameterModel = {
        partId: vm.cid, // Single value
        entityId: vm.entityID, // Single value
        accessLevel: roleDetail.accessLevel
      };
      return ComponentFactory.retrieveComponentHeaderCountDetail().save(parameterModel).$promise.then((component) => {
        if (component && component.data && Array.isArray(component.data) && component.data.length > 0) {
          vm.documentsCount = component.data[0].totalDocumentCount;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getComponentHeaderCountDetail();
    const getMFRHeaderCountDetail = () => {
      const roleDetail = _.find(vm.loginUser.roles, (roleItem) => roleItem.id === vm.loginUser.defaultLoginRoleID);
      vm.docEntityID = CORE.AllEntityIDS.Manufacturer.ID;
      const parameterModel = {
        partId: vm.cid, // Single value
        entityId: vm.docEntityID, // Single value
        accessLevel: roleDetail.accessLevel
      };
      return ComponentFactory.retrieveComponentHeaderCountDetail().save(parameterModel).$promise.then((component) => {
        if (component && component.data && Array.isArray(component.data) && component.data.length > 0) {
          vm.documentmfgCount = component.data[0].totalDocumentCount;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getMFRHeaderCountDetail();
    $scope.$on('documentCount', (event, documentCount) => {
      if (vm.currentTabName === vm.CustomerTabs.ManufacturerDocuments.Name && vm.pageTabRights.ManufacturerDocuments && vm.ManufacturerentityName) {
        vm.documentmfgCount = documentCount;
      } else {
        vm.documentsCount = documentCount;
      }
    });

    const customerMapping = (item) => {
      vm.customer.customerMapping.push(item);
      $timeout(() => {
        $scope.$broadcast(vm.autoCompleteCustomerMapping.inputName, null);
        setFocusByName(vm.autoCompleteCustomerMapping.inputName);
      }, true);
    };

    vm.removeCustomer = (item, index) => {
      if (item) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Mapped Customer', '');

        DialogFactory.messageConfirmDialog({
          messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        }).then(() => {
          vm.wizardStep1CustomerInfo.$setDirty(true);
          vm.customer.customerMapping.splice(index, 1);
        }, () => { });
      }
    };

    // check date validation
    vm.checkDateValidation = (isExpDate) => {
      const lastApprovalDate = vm.supplierStandard.lastApprovalDate ? new Date($filter('date')(vm.supplierStandard.lastApprovalDate, vm.DefaultDateFormat)) : vm.supplierStandardsForm && vm.supplierStandardsForm.lastApprovalDate && vm.supplierStandardsForm.lastApprovalDate.$viewValue ? new Date($filter('date')(vm.supplierStandardsForm.lastApprovalDate.$viewValue, vm.DefaultDateFormat)) : null;
      const expDate = vm.supplierStandard.expDate ? new Date($filter('date')(vm.supplierStandard.expDate, vm.DefaultDateFormat)) : vm.supplierStandardsForm && vm.supplierStandardsForm.expDate && vm.supplierStandardsForm.expDate.$viewValue ? new Date($filter('date')(vm.supplierStandardsForm.expDate.$viewValue, vm.DefaultDateFormat)) : null;

      if (vm.supplierStandardsForm) {
        if (vm.supplierStandardsForm.lastApprovalDate && vm.supplierStandardsForm.expDate && lastApprovalDate && expDate) {
          if (isExpDate && lastApprovalDate <= expDate) {
            vm.supplierStandard.lastApprovalDate = lastApprovalDate;
            vm.supplierStandardsForm.lastApprovalDate.$setValidity('maxvalue', true);
          }
          if (!isExpDate && lastApprovalDate <= expDate) {
            vm.supplierStandard.expDate = expDate;
            vm.supplierStandardsForm.expDate.$setValidity('minvalue', true);
          }
        }
      }
    };

    vm.onChangeLastApprovalDate = () => {
      vm.initdateoption();
      vm.checkDateValidation(false);
    };

    vm.onChangeExpDate = () => {
      vm.initdateoption();
      vm.checkDateValidation(true);
    };

    vm.AddStandards = () => {
      if (BaseService.focusRequiredField(vm.supplierStandardsForm)) {
        return;
      }
      if (vm.supplierlistForm && vm.supplierlistForm.$$controls[1]) {
        vm.supplierlistForm.$$controls[1].$setDirty();
      }
      if (vm.supplierStandard.id) {
        const recordIndex = _.findIndex(vm.supplierStandardsList, { id: vm.supplierStandard.id });
        const existingRecord = {
          id: vm.supplierStandard.id,
          standardName: vm.supplierStandard.standardName,
          standardDisplayName: vm.supplierStandard.standardName,
          standardStatusName: vm.standardStatus.Compliant.id === vm.supplierStandard.standardStatus ? vm.standardStatus.Compliant.value : vm.standardStatus.Certified.id === vm.supplierStandard.standardStatus ? vm.standardStatus.Certified.value : vm.standardStatus.NA.value,
          lastApprovalDate: vm.supplierStandard.lastApprovalDate ? vm.supplierStandardsForm.lastApprovalDate.$viewValue : null,
          expDate: vm.supplierStandard.expDate ? vm.supplierStandardsForm.expDate.$viewValue : null,
          standardStatus: vm.supplierStandard.standardStatus,
          refMfgCodeID: vm.cid,
          refStandardClassId: vm.supplierStandard.refStandardClassId,
          standardID: vm.supplierStandard.standardID,
          cerificateNumber: vm.supplierStandard.cerificateNumber ? vm.supplierStandard.cerificateNumber.toUpperCase() : null
        };
        vm.supplierStandardsList[recordIndex] = angular.copy(existingRecord);
        const standardRecordIndex = _.findIndex(vm.updateRecords, { id: vm.supplierStandard.id });
        if (standardRecordIndex > -1) {
          vm.updateRecords[standardRecordIndex] = angular.copy(existingRecord);
        } else {
          if (vm.supplierStandard.id > 0) {
            const UpdateRecordIndex = _.findIndex(vm.updateRecords, { id: vm.supplierStandard.id });
            if (UpdateRecordIndex > -1) {
              vm.updateRecords[UpdateRecordIndex] = angular.copy(existingRecord);
            } else {
              vm.updateRecords.push(existingRecord);
            }
          } else {
            const standardUpdateRecordIndex = _.findIndex(vm.saveRecords, { id: vm.supplierStandard.id });
            if (standardUpdateRecordIndex > -1) {
              vm.saveRecords[standardUpdateRecordIndex] = angular.copy(existingRecord);
            }
          }
        }
      } else {
        const newStandard = {
          id: vm.tempLastStandardId - 1,
          standardName: vm.supplierStandard.standardName,
          standardDisplayName: vm.supplierStandard.standardName,
          standardStatusName: vm.standardStatus.Compliant.id === vm.supplierStandard.standardStatus ? vm.standardStatus.Compliant.value : vm.standardStatus.Certified.id === vm.supplierStandard.standardStatus ? vm.standardStatus.Certified.value : vm.standardStatus.NA.value,
          lastApprovalDate: vm.supplierStandard.lastApprovalDate ? vm.supplierStandardsForm.lastApprovalDate.$viewValue : null,
          expDate: vm.supplierStandard.expDate ? vm.supplierStandardsForm.expDate.$viewValue : null,
          standardStatus: vm.supplierStandard.standardStatus,
          refMfgCodeID: vm.cid,
          refStandardClassId: vm.supplierStandard.refStandardClassId,
          standardID: vm.supplierStandard.standardID,
          cerificateNumber: vm.supplierStandard.cerificateNumber ? vm.supplierStandard.cerificateNumber.toUpperCase() : null
        };
        vm.supplierStandardsList.push(newStandard);
        vm.saveRecords.push(newStandard);
        vm.tempLastStandardId--;
      }
      vm.resetSupplierStandardForm();
    };

    vm.selectAllStandards = () => {
      if (vm.isAllSelect) {
        _.map(vm.supplierStandardsList, (data) => data.isSelect = true);
      }
      else {
        _.map(vm.supplierStandardsList, (data) => data.isSelect = false);
      }
      vm.selectedRecord = _.filter(vm.supplierStandardsList, (data) => data.isSelect === true);
    };

    vm.selectStandard = (item) => {
      if (item.isSelect) {
        const checkAnyDeSelect = _.find(vm.supplierStandardsList, (data) => !data.isSelect);
        vm.isAllSelect = checkAnyDeSelect ? false : true;
      } else {
        vm.isAllSelect = false;
      }
      vm.selectedRecord = _.filter(vm.supplierStandardsList, (data) => data.isSelect === true);
    };

    vm.valueChange = () => {
      if (vm.standardStatus.Certified.id !== vm.supplierStandard.standardStatus) {
        vm.supplierStandard.lastApprovalDate = vm.supplierStandard.expDate = vm.supplierStandard.cerificateNumber = null;
      }
    };

    vm.employeelist = () => BaseService.goToPersonnelList();
    vm.goToCustomerListPage = () => BaseService.goToCustomerList();
    vm.goToCustomer = (id, openInSameTab) => BaseService.goToCustomer(id, openInSameTab);
    vm.goToStandardList = () => BaseService.goToStandardList();
    vm.goToPaymentTypeCategoryList = () => BaseService.goToGenericCategoryPaymentTypeCategoryList();

    vm.goToCustContPersonList = () => {
      BaseService.goToCustomerContactPersonList(CORE.CUSTOMER_TYPE.CUSTOMER, vm.cid);
    };

    // set data for customer address directive
    const setOtherDetForCustAddrDir = () => {
      if (vm.addressList && vm.addressList.length > 0) {
        _.each(vm.addressList, (addrItem) => {
          addrItem.viewCustAddrOtherDet = {
            addressType: addrItem.addressType,
            customerId: addrItem.customerId,
            companyNameWithCode: vm.formatedMfgName,
            mfgType: vm.customer.mfgType,
            addressBlockTitle: addrItem.isDefault ? 'Default Address' : '',
            isManualSetDefaultAddrClass: true,
            isMasterPage: true
          };
          addrItem.custAddrViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);
          addrItem.contPersonViewActionBtnDet = angular.copy(CORE.CustAddressViewActionBtn);

          addrItem.custAddrViewActionBtnDet.AddNew.isVisible = addrItem.custAddrViewActionBtnDet.ApplyNew.isVisible = false;
          addrItem.custAddrViewActionBtnDet.Delete.isDisable = addrItem.systemGenerated ? true : false;
          addrItem.custAddrViewActionBtnDet.SetDefault.isVisible = true;
          addrItem.custAddrViewActionBtnDet.SetDefault.isDisable = addrItem.isDefault ? true : false;

          addrItem.contPersonViewActionBtnDet.AddNew.isVisible = addrItem.contPersonViewActionBtnDet.Update.isVisible = addrItem.contPersonViewActionBtnDet.ApplyNew.isVisible = addrItem.contPersonViewActionBtnDet.Delete.isVisible = addrItem.contPersonViewActionBtnDet.SetDefault.isVisible = false;
        });
      }
    };

    // callback function for add/Edit Addresses popup
    vm.addEditAddressClBKFun = (ev, callBackAddress, addressType) => {
      vm.getCustomerAddressesList(addressType);
    };

    // call Back function for copy address
    vm.duplicateAddressCallBack = (ev, addressType) => {
      vm.getCustomerAddressesList(addressType);
    };

    // Go to customer contact tab.
    vm.goToCustomerContactPersonList = () => {
      if (vm.cid && vm.customerType) {
        BaseService.goToCustTypeContactPersonList(vm.customerType, vm.cid);
      }
    };

    //Set as current form when page loaded
    angular.element(() => {
      documentReadyMethod();
    });
  }
})();
