(function () {
  'use strict';

  angular
    .module('app.transaction.purchaseorder')
    .controller('ManagePurchaseOrderController', ManagePurchaseOrderController);

  /** @ngInject */
  function ManagePurchaseOrderController($scope, $q, TRANSACTION, $state, DialogFactory, $stateParams, USER, CORE, GenericCategoryFactory, BaseService, MasterFactory, ManageMFGCodePopupFactory, $timeout, FOBFactory, PurchaseOrderFactory, CompanyProfileFactory, PartCostingFactory, ComponentFactory, uiGridGroupingConstants, SalesOrderFactory, $filter, EmployeeFactory, CustomerFactory, ManufacturerFactory) {
    const vm = this;
    vm.todayDate = new Date();
    vm.LabelConstant = CORE.LabelConstant;
    vm.gridConfig = CORE.gridConfig;
    vm.NOTE_FOR_INACTIVE_PART_NOT_SEARCHABLE = CORE.NOTE_FOR_INACTIVE_PART_NOT_SEARCHABLE;
    vm.isDisabledLineCommentsIcon = vm.isDisabledInternalNotesIcon = vm.isDisabledAdditionalNotesIcon = vm.isDisabledLineCompleteReasonIcon = vm.isDisabledReleaseNotesIcon =
      vm.isDisabledShippingAddressIcon = vm.isDisabledPartDescriptionIcon = vm.isdisabledDeleteIcon = vm.isManualCompleteReleaseLinePopupOpen = vm.isManualCompleteLinePopupOpen =
      vm.isLineRequirementPopupOpen = vm.isLineOtherChargePopupOpen = vm.addPODetailBtnDisabled = vm.isFocus = vm.isReadOnly = vm.isDisable = false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.poID = parseInt($stateParams.id);
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.IsPickerOpen = {};
    vm.disabledPoDetailsFields = {};
    vm.IsPickerOpen[vm.DATE_PICKER.poDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.soDate] = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.loginUser = BaseService.loginUser;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.Transaction = TRANSACTION;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.maxLengthForDescription = _maxLengthForDescription;
    vm.PartCategory = CORE.PartCategory;
    vm.OtherType = CORE.PartType.Other;
    vm.poDetail = { isLine: 1 };
    const CODE_DISPlAY_FORMAT = CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT;
    vm.AddressTypeConst = CORE.AddressType;
    vm.POCompleteType = CORE.POCompleteType;
    vm.POWorkingStatus = CORE.PO_Working_Status;
    vm.POLineWorkingStatus = CORE.PO_Line_WorkingStatus;
    //Supplier Address
    vm.supplierAddrViewActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.supplierContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    //Bill To Address
    vm.shippingAddrViewActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.shippingContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    //Mark For Address
    vm.markForAddrViewActionBtn = angular.copy(CORE.CustAddressViewActionBtn);
    vm.markForContPersonViewActionBtnDet = angular.copy(CORE.ContactPersonViewActionBtn);
    vm.TextAreaRows = CORE.TEXT_AREA_ROWS;

    vm.viewCustAddrOtherDet = {
      mfgType: CORE.MFG_TYPE.DIST,
      showAddressEmptyState: false,
      addressType: vm.AddressTypeConst.BusinessAddress,
      addressBlockTitle: vm.LabelConstant.Address.SupplierBusinessAddress,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: null,
      alreadySelectedAddressID: null
    };
    vm.viewShippingAddrOtherDet = {
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      showAddressEmptyState: false,
      addressType: vm.AddressTypeConst.ShippingAddress,
      addressBlockTitle: vm.LabelConstant.PURCHASE_ORDER.BillToShipTo,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: null,
      alreadySelectedAddressID: null
    };
    vm.viewMarkForAddrOtherDet = {
      mfgType: CORE.MFG_TYPE.CUSTOMER,
      showAddressEmptyState: false,
      addressType: vm.AddressTypeConst.IntermediateAddress,
      addressBlockTitle: vm.LabelConstant.Address.MarkForAddress,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      alreadySelectedPersonId: null,
      alreadySelectedAddressID: null
    };
    vm.poModel = {
      status: CORE.DisplayStatus.Draft.ID,
      poDate: vm.todayDate,
      poRevision: '00',
      poWorkingStatus: vm.POWorkingStatus.InProgress.id
    };
    vm.totalCustomerConsignedLines = [];
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.poDate = vm.poModel.poDate;
    }
    const GridOption = TRANSACTION.PURCHASEORDER;
    vm.setfocus = true;
    let reTryCount = 0;
    const getAllRights = () => {
      vm.allowCompletePurchaseOrder = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToCompletePurchaseOrderManually);
      vm.isAllowToCancelPO = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToCancelPO);
      vm.AllowToOpenPurchaseOrderManually = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToOpenPurchaseOrderManually);
      if ((vm.allowCompletePurchaseOrder === null || vm.allowCompletePurchaseOrder === undefined || vm.isAllowToCancelPO === null || vm.isAllowToCancelPO === undefined ||
        vm.AllowToOpenPurchaseOrderManually === null || vm.AllowToOpenPurchaseOrderManually === undefined)
        && reTryCount < _configGetFeaturesRetryCount) {
        getAllRights(); //put for hard reload option as it will not get data from feature rights
        reTryCount++;
        // console.log(reTryCount);
      }
    };
    getAllRights();
    const initdateoption = () => {
      vm.poDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        maxDate: vm.poModel.soDate
      };
      vm.soDateOptions = {
        appendToBody: true,
        checkoutTimeOpenFlag: false,
        minDate: vm.poModel.poDate
      };
    };
    initdateoption();

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        const tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE);
        if (tab) {
          vm.isReadOnly = tab.RO ? true : false;
          if (tab.RO && !vm.poID) {
            vm.markForAddrViewActionBtn.AddNew.isDisable = vm.markForAddrViewActionBtn.ApplyNew.isDisable = vm.markForAddrViewActionBtn.Update.isDisable = vm.markForAddrViewActionBtn.Delete.isDisable =
              vm.markForContPersonViewActionBtnDet.AddNew.isDisable = vm.markForContPersonViewActionBtnDet.ApplyNew.isDisable = vm.markForContPersonViewActionBtnDet.Update.isDisable = vm.markForContPersonViewActionBtnDet.Delete.isDisable =
              vm.shippingAddrViewActionBtn.AddNew.isDisable = vm.shippingAddrViewActionBtn.ApplyNew.isDisable = vm.shippingAddrViewActionBtn.Update.isDisable = vm.shippingAddrViewActionBtn.Delete.isDisable =
              vm.shippingContPersonViewActionBtnDet.AddNew.isDisable = vm.shippingContPersonViewActionBtnDet.ApplyNew.isDisable = vm.shippingContPersonViewActionBtnDet.Update.isDisable = vm.shippingContPersonViewActionBtnDet.Delete.isDisable =
              vm.supplierAddrViewActionBtn.AddNew.isDisable = vm.supplierAddrViewActionBtn.ApplyNew.isDisable = vm.supplierAddrViewActionBtn.Update.isDisable = vm.supplierAddrViewActionBtn.Delete.isDisable =
              vm.supplierContPersonViewActionBtnDet.AddNew.isDisable = vm.supplierContPersonViewActionBtnDet.ApplyNew.isDisable = vm.supplierContPersonViewActionBtnDet.Update.isDisable = vm.supplierContPersonViewActionBtnDet.Delete.isDisable =
              vm.isDisable = true;
          }
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.isReadOnly = vm.isReadOnly;
          }
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

    //selected Supplier detail Detail
    const getSupplierComponentMfg = (item) => {
      if (item) {
        vm.poModel.supplierMFRMappingType = item.supplierMFRMappingType;
        vm.component_approved_supplier_mst = item.component_approved_supplier_mst;
        vm.mfgCodeName = item.mfgCodeName;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.supplierName = vm.mfgCodeName;
          $scope.$parent.vm.mfgCodeID = item.id;
          $scope.$parent.vm.mfgName = item.mfgCode;
        }
        if (vm.poModel.supplierID !== item.id) {
          vm.autoCompleteCarriers.keyColumnId = item.carrierID;
          vm.poModel.carrierAccountNumber = item.carrierAccount;
          vm.poModel.shippingInsurance = item.shippingInsurence;
          vm.autoCompleteTerm.keyColumnId = item.paymentTermsID;
          vm.autoCompleteShipping.keyColumnId = item.shippingMethodID;
          vm.autoCompleteFOB.keyColumnId = item.freeOnBoardId;
          generatePOComment(item);
        }
        if (!vm.loadData && !vm.poID) {
          grid();
        }
        vm.poModel.supplierID = item.id;
        vm.poModel.mfgName = item.mfgName;
        const searchObj = {
          inputName: vm.autoCompleteCustomer.inputName,
          type: CORE.MFG_TYPE.MFG,
          isCustomer: true
        };
        getCustomerMappingList(searchObj);
        vm.viewCustAddrOtherDet.customerId = item.id || vm.autoCompleteSupplierMfgCode.keyColumnId;
        vm.viewCustAddrOtherDet.refTransID = item.id || vm.autoCompleteSupplierMfgCode.keyColumnId;
        vm.viewCustAddrOtherDet.companyNameWithCode = vm.mfgCodeName;
        vm.viewCustAddrOtherDet.companyName = vm.poModel.mfgName;
        if (!vm.poModel.supplierAddressID) {
          getSupplierAddress();
        }
        getSalesContactPersonList(vm.poModel.supplierID, true);
      } else {
        vm.autoCompleteCarriers.keyColumnId = null;
        vm.poModel.carrierAccountNumber = null;
        vm.poModel.shippingInsurance = null;
        vm.autoCompleteTerm.keyColumnId = null;
        vm.autoCompleteShipping.keyColumnId = null;
        vm.poModel.poComment = null;
        vm.poModel.supplierID = null;
        vm.autoCompleteFOB.keyColumnId = null;
        vm.poModel.supplierMFRMappingType = null;
        vm.component_approved_supplier_mst = [];
        vm.mfgCodeName = null;
        vm.poModel.customerID = null;
        vm.billingAddress = vm.selectedContactPerson = null;
        vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.viewCustAddrOtherDet.alreadySelectedAddressID = null;
        if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
          $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
        }
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.supplierName = null;
          $scope.$parent.vm.mfgCodeID = null;
          $scope.$parent.vm.mfgName = null;
        }
        vm.viewCustAddrOtherDet.customerId = null;
        vm.viewCustAddrOtherDet.refTransID = null;
        vm.viewCustAddrOtherDet.companyName = null;
        vm.viewCustAddrOtherDet.companyNameWithCode = null;
      }
    };

    const generatePOComment = (item) => {
      if (!vm.poID) {
        CustomerFactory.getCustomerCommentsById().query({ mfgCodeId: item.id }).$promise.then((res) => {
          if (res.data && res.data.fetchedCustomerComment) {
            vm.poModel.poComment = res.data.fetchedCustomerComment;
          }
          else {
            vm.poModel.poComment = '';
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.poModel.poComment = '';
      }
    };

    const getCompanyInfo = () => CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
      if (company && company.data) {
        vm.companyProfile = angular.copy(company.data);
        if (vm.companyProfile) {
          vm.viewShippingAddrOtherDet.customerId = vm.viewMarkForAddrOtherDet.customerId = vm.companyProfile.mfgCodeId;
          vm.viewShippingAddrOtherDet.refTransID = vm.viewMarkForAddrOtherDet.refTransID = vm.companyProfile.mfgCodeId;
          vm.viewShippingAddrOtherDet.companyName = vm.viewMarkForAddrOtherDet.companyName = vm.companyProfile.name;
          vm.viewShippingAddrOtherDet.companyNameWithCode = vm.viewMarkForAddrOtherDet.companyNameWithCode = vm.companyProfile.MfgCodeMst && vm.companyProfile.MfgCodeMst.mfgCodeName ? vm.companyProfile.MfgCodeMst.mfgCodeName : null;
        } else {
          vm.viewShippingAddrOtherDet.companyName = vm.viewMarkForAddrOtherDet.companyName = vm.viewShippingAddrOtherDet.companyNameWithCode = vm.viewMarkForAddrOtherDet.companyNameWithCode = vm.viewShippingAddrOtherDet.refTransID = vm.viewMarkForAddrOtherDet.refTransID = vm.viewShippingAddrOtherDet.customerId = vm.viewMarkForAddrOtherDet.customerId = null;
        }
      }
      return company;
    }).catch((error) => BaseService.getErrorLog(error));
    /*
  * Author :  Champak Chaudhary
  * Purpose : Get FOB detail
  */
    const getFOBList = () =>
      FOBFactory.retrieveFOBList().query().$promise.then((fob) => {
        if (fob && fob.data) {
          vm.FOBList = fob.data;
          return $q.resolve(vm.FOBList);
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    /*
  * Author :  Champak Chaudhary
  * Purpose : Get carrier detail
  */
    const getCarrierList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Carriers.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((carrier) => {
        if (carrier && carrier.data) {
          vm.carrierList = carrier.data;
          _.each(carrier.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.carrierList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*
  * Author :  Champak Chaudhary
  * Purpose : Get Terms detail
  */
    const getTermsList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.Terms.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.TermsList = terms.data;
          return $q.resolve(vm.TermsList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*
    * Author :  Champak Chaudhary
    * Purpose : Get shipping method detail
    */
    const getShippingList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.ShippingType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.poID ? false : true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((shipping) => {
        if (shipping && shipping.data) {
          vm.ShippingTypeList = shipping.data;
          _.each(shipping.data, (item) => {
            if (item.gencCategoryCode) {
              item.gencCategoryDisplayName = stringFormat(CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName);
            }
            else {
              item.gencCategoryDisplayName = item.gencCategoryName;
            }
          });
          return $q.resolve(vm.ShippingTypeList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get RoHS List
    function getRoHSList() {
      return MasterFactory.getRohsList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.RohsList = response.data;
        }
        else {
          vm.RohsList = [];
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //other part type component
    const getotherTypecomponent = () => SalesOrderFactory.getOtherPartTypeComponentDetails().query().$promise.then((charges) => {
      if (charges && charges.data) {
        vm.OtherPartTypeComponents = angular.copy(charges.data);
        return $q.resolve(vm.OtherPartTypeComponents);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    /** Get packaging for material detail*/
    const getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingList = packaging.data;
      }
      return vm.packagingList;
    }).catch((error) => BaseService.getErrorLog(error));
    // get contact person list
    const getContactPersonList = () => EmployeeFactory.getEmployeeListByCustomer().query({ customerID: null, salesCommissionToID: null }).$promise.then((employees) => {
      if (employees && employees.data) {
        vm.ContactPersonList = angular.copy(employees.data);
        _.each(vm.ContactPersonList, (item) => {
          if (item.profileImg) {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        return $q.resolve(vm.ContactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));
    //autocomplete initalize
    const autoCompletePromise = () => {
      vm.autoCompleteCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.poModel ? (vm.poModel.carrierID ? vm.poModel.carrierID : null) : null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getCarrierList
      };
      vm.autoCompleteFOB = {
        columnName: 'name',
        controllerName: CORE.MANAGE_FOB_POPUP_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_FOB_POPUP_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.poModel && vm.poModel.freeOnBoardID ? vm.poModel.freeOnBoardID : null,
        inputName: 'FOB',
        placeholderName: 'FOB',
        isRequired: false,
        isAddnew: true,
        callbackFn: getFOBList
      };
      vm.autoCompleteTerm = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.poModel && vm.poModel.termsID ? vm.poModel.termsID : null,
        inputName: CategoryTypeObjList.Terms.Name,
        placeholderName: CategoryTypeObjList.Terms.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.paymentTerm,
          headerTitle: CategoryTypeObjList.Terms.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getTermsList
      };
      vm.autoCompleteShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.poModel && vm.poModel.shippingMethodID ? vm.poModel.shippingMethodID : null,
        inputName: CategoryTypeObjList.ShippingType.Name,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.shippingMethods,
          headerTitle: CategoryTypeObjList.ShippingType.Title
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: () => {
        }
      };
      vm.autoCompleteContactPerson = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
        keyColumnId: vm.poModel && vm.poModel.contactPersonEmpID ? vm.poModel.contactPersonEmpID : null,
        inputName: 'Contact Person',
        placeholderName: 'Contact Person',
        addData: {
          popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getContactPersonList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poModel.email = item.email;
            vm.poModel.contact = item.contact;
          } else {
            vm.poModel.email = null;
            vm.poModel.contact = null;
          }
        }
      };
    };

    let autocompletePOPromise = [getFOBList(), getCarrierList(), getTermsList(), getShippingList(), getCompanyInfo(), getPackaging(), getRoHSList(), getotherTypecomponent(), getContactPersonList()];
    vm.cgBusyLoading = $q.all(autocompletePOPromise).then(() => {
      autoCompletePromise();
      initPurchaseDetailAutocomplete();
      autocompletePOPromise = [];
      if (vm.poID) {
        autocompletePOPromise.push(getPurchaseOrderDetail());
      } else {
        vm.autoCompleteContactPerson.keyColumnId = vm.loginUser.employee.id;
      }
      vm.cgBusyLoading = $q.all(autocompletePOPromise).then(() => {
        getCompanyAddress();
        getSalesContactPersonList();
        getCompanyAddress(null, true);
      });
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompleteSupplierMfgCode = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.poModel && vm.poModel.supplierID ? vm.poModel.supplierID : null,
        inputName: 'refSupplierMfgCode',
        placeholderName: 'Type here to Search and Add ',
        isRequired: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getSupplierMfgCodeSearch(searchObj);
        },
        onSelectCallbackFn: getSupplierComponentMfg,
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteSupplierMfgCode.inputName,
            type: CORE.MFG_TYPE.DIST
          };
          return getSupplierMfgCodeSearch(searchObj);
        }
      };
      vm.autoCompleteCustomer = {
        columnName: 'mfgCodeName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.poModel && vm.poModel.customerID ? vm.poModel.customerID : null,
        inputName: 'Customer',
        placeholderName: 'Type here to Search and Add',
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          return getCustomerMappingList(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poModel.customerID = item.id;
            if (vm.poModel.isCustConsigned) {
              if (vm.sourceData && vm.sourceData.length > 0) {
                _.each(vm.sourceData, (poLine) => {
                  if (poLine.isLine === 1 || poLine.totalRelease) {
                    poLine.lineCustomerID = item.id;
                  }
                });
              }
              if (vm.autoCompleteMfgCode.keyColumnId || vm.autocompleteOtherCharges.keyColumnId) {
                vm.poDetail.lineCustomerID = item.id;
                if (vm.autoCompleteLineCustomer) {
                  getSupplierMfgCodeSearch({
                    mfgcodeID: vm.poDetail.lineCustomerID,
                    type: CORE.MFG_TYPE.MFG,
                    isCustomer: true
                  }, true);
                }
              }
            }
          } else {
            vm.poModel.customerID = null;
            $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
            if (vm.sourceData && vm.sourceData.length > 0) {
              _.each(vm.sourceData, (poLine) => {
                if (poLine.isLine === 1 || poLine.totalRelease) {
                  poLine.lineCustomerID = null;
                }
              });
            }
            if (vm.autoCompleteMfgCode.keyColumnId || vm.autocompleteOtherCharges.keyColumnId) {
              vm.poDetail.lineCustomerID = null;
              if (vm.autoCompleteLineCustomer) {
                $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
              }
            }
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteCustomer.inputName,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          return getCustomerMappingList(searchObj);
        }
      };
    };
    const initPurchaseDetailAutocomplete = () => {
      vm.autoCompleteMfgCode = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: CORE.LabelConstant.MFG.MFGPN,
        placeholderName: CORE.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            isContainCPN: true,
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
            supplierID: vm.poModel.supplierID
          };
          return getPartNumberSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            let messageContent;
            const isrestrictPartinSupplier = _.find(vm.component_approved_supplier_mst, (supplierRestrict) => supplierRestrict.partID === item.id);
            if (isrestrictPartinSupplier && !vm.updateMatsterDetail) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PART);
              messageContent.message = stringFormat(messageContent.message, item.PIDCode, stringFormat(angular.copy(CORE.RestrictWithPermissionLabel.RestrictUseForSupplier), vm.mfgCodeName));
              restrictValidationCallback(messageContent);
            } else if ((item.restrictUsePermanently || item.restrictPackagingUsePermanently) && !vm.updateMatsterDetail) {
              if (item.restrictUsePermanently) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PART);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermanently);
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PACKAGING_PART);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermanently);
              }
              restrictValidationCallback(messageContent);
            } else if ((item.restrictUSEwithpermission || item.restrictPackagingUseWithpermission) && !vm.updateMatsterDetail) {
              const messageContentInfo = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_SLIP);
              if (item.restrictUSEwithpermission) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
                item.informationMsg = stringFormat('{0} {1}', messageContent.message, messageContentInfo.message);
              } else {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PID_RECTRICTED_WITH_PERMISION);
                messageContent.message = stringFormat(messageContent.message, item.PIDCode, CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
                item.informationMsg = stringFormat('{0} {1}', messageContent.message, messageContentInfo.message);
              }
              getAuthenticationOfApprovalPart(null, item, false);
            } else {
              mfgPartSetDetail(item);
            }
          } else {
            vm.poDetail.isLineCustConsigned = false;
            vm.poDetail.isNonUMIDStock = false;
            vm.poDetail.mfgName = null;
            vm.poDetail.unit = null;
            vm.poDetail.RoHSStatusID = null;
            vm.poDetail.category = null;
            vm.poDetail.partType = null;
            vm.poDetail.packagingID = null;
            vm.poDetail.partID = null;
            vm.poDetail.PIDCode = null;
            vm.poDetail.spq = null;
            vm.poDetail.uom = null;
            vm.poDetail.uomID = null;
            vm.poDetail.partDescription = null;
            vm.poDetail.rohsIcon = null;
            vm.poDetail.minimum = null;
            vm.poDetail.mult = null;
            vm.poDetail.rohsName = null;
            vm.disabledPoDetailsFields.pcbPerArray = vm.poDetail.pcbPerArray = null;
            vm.poDetail.ispcbArrayShow = false;
            vm.poDetail.isCustom = null;
            vm.poDetail.mfgPN = null;
            vm.poDetail.imageURL = null;
            vm.poDetail.documentPath = null;
            vm.poDetail.isCPN = null;
            vm.autoCompleteRohsStatus.keyColumnId = vm.poDetail.RoHSStatusID;
            vm.autoPackaging.keyColumnId = vm.poDetail.packagingID;
            vm.poDetail.PORequirementDetail = [];
            vm.poDetail.mfgCodeID = null;
            if (vm.autoCompleteSupplierCode && vm.autoCompleteSupplierCode.inputName) {
              $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, null);
            }
            if (vm.autoCompleteMfgPIDCode && vm.autoCompleteMfgPIDCode.inputName) {
              $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, null);
            }
            vm.poDetail.lineCustomerID = null;
            if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
              $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
            }
            vm.autoCompleteSupplierCode.keyColumnId = null;
            vm.poDetail.internalRef = null;
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteMfgCode.inputName,
            isContainCPN: true,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            supplierID: vm.poModel.supplierID,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key
          };
          return getPartNumberSearch(searchObj);
        }
      };
      vm.autoCompleteMfgPIDCode = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'autoCompleteMfgPIDCode',
        placeholderName: CORE.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            isContainCPN: true,
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
            supplierID: vm.poModel.supplierID
          };
          return getPartNumberSearch(searchObj, true);
        },
        onSelectCallbackFn: (item) => {
          if (vm.autoCompleteMfgCode && vm.autoCompleteMfgCode.inputName) {
            if (item) {
              $scope.$broadcast(vm.autoCompleteMfgCode.inputName, item);
            } else {
              $scope.$broadcast(vm.autoCompleteMfgCode.inputName, null);
            }
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompleteMfgPIDCode.inputName,
            isContainCPN: true,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            supplierID: vm.poModel.supplierID,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key
          };
          return getPartNumberSearch(searchObj, true);
        }
      };
      vm.autoCompleteSupplierCode = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'supplierCode',
        placeholderName: 'Type here to Search and Add ',
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        isRequired: false,
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: CORE.MFG_TYPE.DIST,
            isContainCPN: true,
            mfgcodeID: vm.autoCompleteSupplierMfgCode.keyColumnId,
            refSupplierMfgpnComponentID: vm.poDetail.partID || null,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
            supplierID: vm.poModel.supplierID
          };
          return getPartNumberSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetail.spq = item.packageQty;
            vm.poDetail.minimum = item.minimum ? parseInt(item.minimum) : 1,
              vm.poDetail.mult = item.mult ? parseInt(item.mult) : 1;
            if (vm.poDetail.supplierMfgPNID !== item.id) {
              vm.poDetail.supplierPID = item.PIDCode;
              vm.poDetail.supplierPN = item.orgMfgPN;
              vm.poDetail.supplierroHSName = item.rohsName;
              vm.poDetail.supplierroHSIcon = item.rohsIcon;
              vm.poDetail.supplierisCustom = item.isCustom;
              vm.poDetail.supplierMfgPNID = item.id;
              vm.poDetail.packagingID = item.packagingID;
              vm.poDetail.RoHSStatusID = vm.poDetail.RoHSStatusID ? vm.poDetail.RoHSStatusID : item.RoHSStatusID;
              vm.poDetail.rohsIcon = vm.poDetail.rohsIcon ? vm.poDetail.rohsIcon : item.rohsIcon;
              vm.poDetail.rohsName = vm.poDetail.rohsName ? vm.poDetail.rohsName : item.rohsName;
              vm.autoPackaging.keyColumnId = vm.poDetail.packagingID;
              if (!vm.poDetail.partID && !vm.autoCompleteMfgCode.keyColumnId && (!vm.updateMatsterDetail || (vm.updateMatsterDetail && !vm.poDetail.partID))) {
                const searchObj = {
                  id: item.refSupplierMfgpnComponentID,
                  isContainCPN: true,
                  mfgType: CORE.MFG_TYPE.MFG,
                  isGoodPart: true,
                  strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
                  offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
                  supplierID: vm.poModel.supplierID
                };
                getPartNumberSearch(searchObj);
              }
            }
          } else {
            vm.poDetail.supplierPID = null;
            vm.poDetail.supplierPN = null;
            vm.poDetail.supplierroHSName = null;
            vm.poDetail.supplierroHSIcon = null;
            vm.poDetail.supplierisCustom = null;
            vm.poDetail.supplierMfgPNID = null;
            vm.poDetail.spq = null;
            vm.poDetail.minimum = null;
            vm.poDetail.mult = null;
            vm.autoPackaging.keyColumnId = null;
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            query: query,
            mfgType: CORE.MFG_TYPE.DIST,
            inputName: vm.autoCompleteSupplierCode.inputName,
            isContainCPN: true,
            mfgcodeID: vm.autoCompleteSupplierMfgCode.keyColumnId,
            refSupplierMfgpnComponentID: vm.poDetail.partID || null,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
            supplierID: vm.poModel.supplierID
          };
          return getPartNumberSearch(searchObj);
        }
      };
      vm.autocompleteOtherCharges = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Other Charges',
        placeholderName: 'Other Charges',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartType.Other,
          customerID: null
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getotherTypecomponent,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetail.PIDCode = item.pidcode;
            vm.poDetail.partDescription = item.mfgPNDescription;
            vm.poDetail.isCustom = true;
            vm.poDetail.rohsIcon = item.rohsIcon;
            vm.poDetail.rohsName = item.rohsName;
            vm.poDetail.mfgPN = item.mfgPN;
            vm.poDetail.category = item.category;
            vm.poDetail.partType = item.partType;
            vm.poDetail.uom = item.unitName;
            vm.poDetail.RoHSStatusID = item.rohsStatusID;
            vm.poDetail.partID = item.id;
            vm.poDetail.mfgCodeID = item.mfgcodeid;
            vm.poDetail.mfgName = item.mfgCodeName;
            vm.autoCompleteRohsStatus.keyColumnId = vm.poDetail.RoHSStatusID;
            vm.poDetail.isNonUMIDStock = true;
            vm.poDetail.pcbPerArray = item.pcbPerArray;
            vm.poDetail.spq = parseInt(item.packageQty);
            vm.poDetail.minimum = parseInt(item.minimum);
            vm.poDetail.mult = parseInt(item.mult);
            vm.poDetail.unit = parseInt(item.unit);
            vm.poDetail.price = vm.poModel.isCustConsigned ? 0 : vm.poDetail.price;
            if (!vm.updateMatsterDetail && !vm.isView) {
              vm.poDetail.packagingName = item.packagingName;
              vm.poDetail.packagingID = item.packagingId;
              vm.autoPackaging.keyColumnId = vm.poDetail.packagingID;
              vm.poDetail.internalRef = item.internalReference;
              if (vm.poModel.isCustConsigned) {
                vm.poDetail.isLineCustConsigned = true;
                vm.poDetail.lineCustomerID = vm.poModel.customerID;
                if (vm.autoCompleteLineCustomer) {
                  getSupplierMfgCodeSearch({
                    mfgcodeID: vm.poDetail.lineCustomerID,
                    type: CORE.MFG_TYPE.MFG,
                    isCustomer: true
                  }, true);
                }
              }
              getPurchaseRequirementList(item.id);
            }
            vm.getPartPriceBreakDetails(item.id).then(() => {
              vm.changeOtherPartQty();
            });
            vm.autocompletePIDOtherCharges.keyColumnId = item.id;
          }
          else {
            vm.PartPriceBreakDetailsData = [];
            vm.poDetail.PORequirementDetail = [];
            vm.poDetail.pcbPerArray = vm.poDetail.spq = vm.poDetail.minimum = vm.poDetail.mult = vm.poDetail.unit = vm.poDetail.internalRef = vm.autoCompleteRohsStatus.keyColumnId = vm.autoPackaging.keyColumnId = vm.autocompletePIDOtherCharges.keyColumnId = null;
            resetPODetForm();
          }
        }
      };
      vm.autocompletePIDOtherCharges = {
        columnName: 'pidcode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'PID Other Charges',
        placeholderName: 'PID Other Charges',
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartType.Other,
          customerID: null
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getotherTypecomponent,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.autocompleteOtherCharges.keyColumnId = item.id;
          }
          else {
            vm.autocompleteOtherCharges.keyColumnId = null;
          }
        }
      };
      vm.autoPackaging = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
        keyColumnId: null,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PACKAGING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.packaging_type
        },
        inputName: 'Packaging',
        placeholderName: 'Packaging',
        isRequired: true,
        isAddnew: true,
        callbackFn: getPackaging,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (vm.poDetail.packagingID !== item.id && vm.autoCompleteSupplierCode && vm.autoCompleteSupplierCode.keyColumnId) {
              $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, null);
            }
            vm.poDetail.packagingName = item.name;
            vm.poDetail.packagingID = item.id;
            if (vm.poDetail.partID && !vm.autoCompleteSupplierCode.keyColumnId && !vm.poDetail.supplierPID) { // && !vm.updateMatsterDetail // Remove this condition as edit time supplier PN is not fill up based on  MFR and packaging
              const searchObj = {
                mfgType: CORE.MFG_TYPE.DIST,
                inputName: vm.autoCompleteSupplierCode.inputName,
                isContainCPN: true,
                refSupplierMfgpnComponentID: vm.poDetail.partID,
                packagingID: item.id,
                mfgcodeID: vm.autoCompleteSupplierMfgCode.keyColumnId,
                isGoodPart: true,
                strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
                offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
                supplierID: vm.poModel.supplierID
              };
              getPartNumberSearch(searchObj);
            } else {
              vm.poDetail.spq = vm.poDetail.spq ? vm.poDetail.spq : (vm.noMatchDetail ? vm.noMatchDetail.packageQty : 1);
              vm.poDetail.minimum = vm.poDetail.minimum ? vm.poDetail.minimum : (vm.noMatchDetail ? parseInt(vm.noMatchDetail.minimum) : 1);
              vm.poDetail.mult = vm.poDetail.mult ? vm.poDetail.mult : (vm.noMatchDetail ? parseInt(vm.noMatchDetail.mult) : 1);
            }
          } else {
            vm.poDetail.packagingName = null;
            vm.poDetail.packagingID = null;
            if (vm.autoCompleteSupplierCode && vm.autoCompleteSupplierCode.inputName) {
              $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, null);
            }
          }
        }
      };
      vm.autoCompleteRohsStatus = {
        columnName: 'name',
        controllerName: CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_ROHS_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'rohsComplient',
        placeholderName: 'RoHS Requirement',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ROHS_STATE],
          pageNameAccessLabel: CORE.PageName.rohs_status
        },
        callbackFn: getRoHSList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetail.rohsIcon = item.rohsIcon;
            vm.poDetail.rohsName = item.name;
            vm.poDetail.RoHSStatusID = item.id;
          } else {
            vm.poDetail.rohsIcon = null;
            vm.poDetail.rohsName = null;
            vm.poDetail.RoHSStatusID = null;
          }
        }
      };
      vm.autoCompleteSalesShipping = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.ShippingType.Title,
        placeholderName: CategoryTypeObjList.ShippingType.Title,
        addData: { headerTitle: CategoryTypeObjList.ShippingType.Title, isSalesOrder: true, saleName: CategoryTypeObjList.ShippingType.Name },
        isRequired: false,
        isAddnew: true,
        callbackFn: getShippingList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetailRelease.shippingMethodID = item.gencCategoryID;
            vm.poDetailRelease.shippingMethodCode = item.gencCategoryDisplayName;
          } else {
            vm.poDetailRelease.shippingMethodID = null;
            vm.poDetailRelease.shippingMethodCode = null;
          }
        }
      };
      vm.autoCompletelineCarriers = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.poDetailRelease ? (vm.poDetailRelease.carrierID ? vm.poDetailRelease.carrierID : null) : null,
        inputName: CategoryTypeObjList.Carriers.Title,
        placeholderName: CategoryTypeObjList.Carriers.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.Carrier,
          headerTitle: CategoryTypeObjList.Carriers.Name
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getCarrierList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetailRelease.carrierID = item.gencCategoryID;
            vm.poDetailRelease.carrierCode = item.gencCategoryCode;
          } else {
            vm.poDetailRelease.carrierID = null;
            vm.poDetailRelease.carrierCode = null;
          }
        }
      };
      vm.autoCompleteSalesAddress = {
        columnName: 'FullAddress',
        controllerName: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: vm.LabelConstant.Address.ShippingAddress,
        placeholderName: vm.LabelConstant.Address.ShippingAddress,
        addData: { addressType: vm.AddressTypeConst.ShippingAddress, companyName: vm.companyProfile && vm.companyProfile.name ? vm.companyProfile.name : null, customerId: vm.companyProfile && vm.companyProfile.mfgCodeId ? vm.companyProfile.mfgCodeId : null },
        isRequired: false,
        isAddnew: true,
        callbackFn: getCompanyAddress,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetailRelease.shippingAddress = BaseService.generateAddressFormateToStoreInDB(item);
            vm.poDetailRelease.shippingAddressID = item.id;

            if (!vm.poDetailRelease.id) {
              if (vm.autoCompleteSalesContactPerson) {
                vm.autoCompleteSalesContactPerson.keyColumnId = vm.poDetailRelease && vm.poDetailRelease.shippingContactPersonID ? vm.poDetailRelease.shippingContactPersonID : item.contactPerson && item.contactPerson.personId ? item.contactPerson.personId : null;
              }
              if (!vm.poDetailRelease.carrierAccountNumber && item.carrierAccount) {
                vm.poDetailRelease.carrierAccountNumber = item.carrierAccount;
              }
              if (vm.autoCompletelineCarriers) {
                if (vm.poDetailRelease.carrierID) {
                  vm.autoCompletelineCarriers.keyColumnId = vm.poDetailRelease.carrierID;
                } else if (item.carrierID) {
                  vm.autoCompletelineCarriers.keyColumnId = item.carrierID;
                }
              }
              if (vm.autoCompleteSalesShipping) {
                if (vm.poDetailRelease.shippingMethodID) {
                  vm.autoCompleteSalesShipping.keyColumnId = vm.poDetailRelease.shippingMethodID;
                } else if (item.shippingMethodID) {
                  vm.autoCompleteSalesShipping.keyColumnId = item.shippingMethodID;
                }
              }
            } else {
              if (vm.copyObject.shippingAddressID !== item.id) {
                if (vm.autoCompleteSalesContactPerson) {
                  vm.autoCompleteSalesContactPerson.keyColumnId = item.contactPerson && item.contactPerson.personId ? item.contactPerson.personId : null;
                }
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_LINE_SHIPPING_ADDRESS_CONFIRMATION);
                const obj = {
                  messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then(() => {
                  vm.copyObject.shippingAddressID = item.id;
                  if (item.carrierAccount) {
                    vm.poDetailRelease.carrierAccountNumber = item.carrierAccount;
                  }
                  if (item.carrierID && vm.autoCompletelineCarriers) {
                    vm.autoCompletelineCarriers.keyColumnId = item.carrierID;
                  }
                  if (item.shippingMethodID && vm.autoCompleteSalesShipping) {
                    vm.autoCompleteSalesShipping.keyColumnId = item.shippingMethodID;
                  }
                }, () => { });
              }
            }
          } else {
            vm.poDetailRelease.shippingAddressID = vm.poDetailRelease.shippingAddress = null;
            if (vm.autoCompleteSalesContactPerson) {
              vm.autoCompleteSalesContactPerson.keyColumnId = null;
            }
            if (!vm.poDetailRelease.id) {
              vm.poDetailRelease.carrierAccountNumber = null;
              if (vm.autoCompletelineCarriers) {
                vm.autoCompletelineCarriers.keyColumnId = null;
              }
              if (vm.autoCompleteSalesShipping) {
                vm.autoCompleteSalesShipping.keyColumnId = null;
              }
            }
          }
        }
      };
      vm.autoCompleteSalesContactPerson = {
        columnName: 'personFullName',
        controllerName: USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
        keyColumnName: 'personId',
        keyColumnId: null,
        inputName: vm.LabelConstant.PURCHASE_ORDER.ContactPerson,
        placeholderName: vm.LabelConstant.PURCHASE_ORDER.ContactPerson,
        addData: {
          companyName: vm.companyProfile && vm.companyProfile.name ? vm.companyProfile.name : null,
          refTransID: vm.companyProfile && vm.companyProfile.mfgCodeId ? vm.companyProfile.mfgCodeId : null,
          refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
          mfgType: CORE.MFG_TYPE.DIST
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getSalesContactPersonList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetailRelease.shippingContactPerson = BaseService.generateContactPersonDetFormat(item);
            vm.poDetailRelease.shippingContactPersonID = item.personId;
          } else {
            vm.poDetailRelease.shippingContactPerson = vm.poDetailRelease.shippingContactPersonID = null;
          }
        }
      };
      vm.autoCompleteLineCustomer = {
        columnName: 'mfgCodeName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.poDetail && vm.poDetail.lineCustomerID ? vm.poDetail.lineCustomerID : null,
        inputName: 'Line Customer',
        placeholderName: 'Type here to Search and Add',
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER,
          popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        isAddnew: true,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          return getCustomerMappingList(searchObj, true);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.poDetail.lineCustomerID = item.id;
          } else {
            vm.poDetail.lineCustomerID = null;
            $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteLineCustomer.inputName,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          return getCustomerMappingList(searchObj, true);
        }
      };
    };
    //common call back function for validations
    const restrictValidationCallback = (messageContent) => {
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model).then(() => {
        if (vm.autoCompleteSupplierCode && vm.autoCompleteSupplierCode.inputName) {
          $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, null);
        }
        if (vm.autoCompleteMfgCode && vm.autoCompleteMfgCode.inputName) {
          $scope.$broadcast(vm.autoCompleteMfgCode.inputName, null);
        }
      });
    };
    //mfg part detail set details
    const mfgPartSetDetail = (item) => {
      vm.poDetail.mfgName = item.mfgCodeName;
      vm.poDetail.mfgCodeID = item.mfgcodeID;
      if ((!vm.updateMatsterDetail && !vm.isView) || (vm.updateMatsterDetail && !vm.poDetail.partID)) {
        vm.noMatchDetail = item;
        getPurchaseRequirementList(item.id);
        vm.poDetail.unit = item.unit;
        vm.poDetail.RoHSStatusID = vm.poDetail.RoHSStatusID ? vm.poDetail.RoHSStatusID : item.RoHSStatusID;
        vm.poDetail.category = item.category;
        vm.poDetail.partType = item.partType;
        if (!vm.autoCompleteSupplierCode.keyColumnId) {
          vm.poDetail.packagingID = vm.poDetail.packagingID ? vm.poDetail.packagingID : item.packagingID;
        }
        if (vm.poModel.isCustConsigned) {
          vm.poDetail.isLineCustConsigned = true;
          vm.poDetail.lineCustomerID = vm.poModel.customerID;
          if (vm.autoCompleteLineCustomer) {
            getSupplierMfgCodeSearch({
              mfgcodeID: vm.poDetail.lineCustomerID,
              type: CORE.MFG_TYPE.MFG,
              isCustomer: true
            }, true);
          }
        }
        if (vm.poModel.isNonUMIDStock) {
          vm.poDetail.isNonUMIDStock = true;
        }
        vm.poDetail.price = vm.poModel.isCustConsigned ? 0 : vm.poDetail.price;
        vm.poDetail.internalRef = vm.poDetail && vm.poDetail.internalRef ? vm.poDetail.internalRef : item.internalReference;
        vm.poDetail.partID = item.id;
        vm.poDetail.PIDCode = item.PIDCode;
        //vm.poDetail.spq = item.packageQty;
        vm.poDetail.uom = item.unitName;
        //vm.poDetail.minimum = item.minimum ? parseInt(item.minimum) : 1;
        //vm.poDetail.mult = item.mult ? parseInt(item.mult) : 1;
        vm.poDetail.uomID = item.uom;
        vm.poDetail.partDescription = item.mfgPNDescription;
        vm.poDetail.rohsIcon = vm.poDetail.rohsIcon ? vm.poDetail.rohsIcon : item.rohsIcon;
        vm.poDetail.rohsName = vm.poDetail.rohsName ? vm.poDetail.rohsName : item.rohsName;
        vm.poDetail.pcbPerArray = item.pcbPerArray;
        vm.disabledPoDetailsFields.pcbPerArray = item.pcbPerArray;
        vm.poDetail.ispcbArrayShow = item.functionalCategoryID === CORE.RFQ_PARTTYPE.BAREPCB.ID;
        vm.poDetail.isCustom = item.isCustom;
        vm.poDetail.mfgPN = item.orgMfgPN;
        vm.poDetail.imageURL = item.imageURL;
        vm.poDetail.documentPath = item.documentPath;
        vm.poDetail.isCPN = item.isCPN;
        vm.autoCompleteRohsStatus.keyColumnId = vm.poDetail.RoHSStatusID;
        vm.autoPackaging.keyColumnId = vm.poDetail.packagingID;
      }
      if (vm.autoCompleteMfgPIDCode && vm.autoCompleteMfgPIDCode.inputName) {
        $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, item);
      }
    };

    //get supplier code list
    // eslint-disable-next-line arrow-body-style
    function getSupplierMfgCodeSearch(searchObj, isLineLevelCustomer) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        vm.supplierMfgCodeDetail = [];
        if (mfgcodes && mfgcodes.data) {
          if (searchObj.mfgcodeID) {
            $timeout(() => {
              if (searchObj.isCustomer) {
                if (isLineLevelCustomer && vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
                  $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, mfgcodes.data[0]);
                } else {
                  if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
                    $scope.$broadcast(vm.autoCompleteCustomer.inputName, mfgcodes.data[0]);
                  }
                }
              } else {
                if (vm.autoCompleteSupplierMfgCode && vm.autoCompleteSupplierMfgCode.inputName) {
                  $scope.$broadcast(vm.autoCompleteSupplierMfgCode.inputName, mfgcodes.data[0]);
                }
              }
            });
          }
          vm.supplierMfgCodeDetail = mfgcodes.data;
        }
        return vm.supplierMfgCodeDetail;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function getCustomerMappingList(searchObj, isLineLevelCustomer) {
      if (vm.poModel.supplierID) {
        return ManufacturerFactory.getCustomerMappingList().query({ id: vm.poModel.supplierID }).$promise.then((response) => {
          if (response && response.data && response.data.length > 0) {
            const customerList = _.map(response.data, 'MfgCodeMstCustomer');
            if (vm.poDetail.isCPN && vm.poDetail.mfgName && vm.poDetail.mfgCodeID) {
              customerList.push({
                id: vm.poDetail.mfgCodeID,
                mfgCodeName: vm.poDetail.mfgName
              });
            }
            if (customerList.length === 1) {
              if (isLineLevelCustomer && vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName && vm.poDetail.isLineCustConsigned) {
                $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, customerList[0]);
              } else {
                if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName && vm.poModel.isCustConsigned) {
                  $scope.$broadcast(vm.autoCompleteCustomer.inputName, customerList[0]);
                }
              }
            } else {
              return customerList;
            }
          } else {
            return getSupplierMfgCodeSearch(searchObj, isLineLevelCustomer).then((response) => {
              if (!searchObj.mfgcodeID) {
                return response;
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return getSupplierMfgCodeSearch(searchObj, isLineLevelCustomer).then((response) => {
          if (!searchObj.mfgcodeID) {
            return response;
          }
        });
      }
    }

    //get part number code details
    const getPartNumberSearch = (searchObj, isSearchByPID) => {
      if (searchObj.offtheselfPart) {
        searchObj.categoryID = CORE.PartCategory.Component;
      }
      return ComponentFactory.getComponentMFGAliasSearchPurchaseOrder().query({
        listObj: searchObj
      }).$promise.then((component) => {
        let componentData = [];
        if (component && component.data) {
          componentData = _.filter(component.data.data, (component) => component.partType !== vm.OtherType);
          if (searchObj.id || searchObj.id === 0 || searchObj.refSupplierMfgpnComponentID) {
            if (isSearchByPID) {
              if (vm.autoCompleteMfgPIDCode && vm.autoCompleteMfgPIDCode.inputName) {
                $scope.$broadcast(vm.autoCompleteMfgPIDCode.inputName, component.data.data[0]);
              }
            } else {
              if (searchObj.mfgType === CORE.MFG_TYPE.MFG && vm.autoCompleteMfgCode && vm.autoCompleteMfgCode.inputName) {
                $scope.$broadcast(vm.autoCompleteMfgCode.inputName, componentData[0]);
              } else if (searchObj.mfgType === CORE.MFG_TYPE.DIST && vm.autoCompleteSupplierCode && vm.autoCompleteSupplierCode.inputName) {
                if (vm.autoPackaging.keyColumnId && componentData.length === 1) {
                  $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, componentData[0]);
                }
                if (!componentData[0]) {
                  vm.poDetail.spq = vm.poDetail.spq ? vm.poDetail.spq : (vm.noMatchDetail ? vm.noMatchDetail.packageQty : 1);
                  vm.poDetail.minimum = vm.poDetail.minimum ? vm.poDetail.minimum : (vm.noMatchDetail ? parseInt(vm.noMatchDetail.minimum) : 1);
                  vm.poDetail.mult = vm.poDetail.mult ? vm.poDetail.mult : (vm.noMatchDetail ? parseInt(vm.noMatchDetail.mult) : 1);
                }
              }
            }
          }
        }
        return componentData;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get purchase order detail
    const getPurchaseOrderDetail = () => {
      vm.cgBusyLoading = PurchaseOrderFactory.retrievePurchaseOrder().query({ id: vm.poID }).$promise.then((res) => {
        if (res && res.data) {
          vm.IsEdit = true;
          getCompanyAddress();
          getSalesContactPersonList();
          vm.poModel = res.data;
          vm.poModel.updatedAt = BaseService.getUIFormatedDateTimeInCompanyTimeZone(vm.poModel.updatedAt, _dateTimeFullTimeDisplayFormat);
          if (vm.poModel.supplierAddressID) {
            getSupplierAddress(vm.poModel.supplierAddressID);
          }
          if (vm.poModel.shippingAddressID) {
            getCompanyAddress(vm.poModel.shippingAddressID);
          }
          if (vm.poModel.intermediateShipmentID) {
            getCompanyAddress(vm.poModel.intermediateShipmentID, true);
          }
          vm.isPackingSlipGenerated = vm.poModel.packingSlipMaterialReceive.length;
          vm.markForAddrViewActionBtn.AddNew.isDisable = vm.markForAddrViewActionBtn.ApplyNew.isDisable =
            vm.markForContPersonViewActionBtnDet.AddNew.isDisable = vm.markForContPersonViewActionBtnDet.ApplyNew.isDisable = vm.markForContPersonViewActionBtnDet.Update.isDisable = vm.markForContPersonViewActionBtnDet.Delete.isDisable =
            vm.shippingAddrViewActionBtn.AddNew.isDisable = vm.shippingAddrViewActionBtn.ApplyNew.isDisable = vm.shippingContPersonViewActionBtnDet.AddNew.isDisable = vm.shippingContPersonViewActionBtnDet.ApplyNew.isDisable =
            vm.supplierAddrViewActionBtn.AddNew.isDisable = vm.supplierAddrViewActionBtn.ApplyNew.isDisable = vm.supplierContPersonViewActionBtnDet.AddNew.isDisable = vm.supplierContPersonViewActionBtnDet.ApplyNew.isDisable =
            vm.isDisable = vm.poModel.poWorkingStatus === vm.POWorkingStatus.Completed.id || vm.poModel.poWorkingStatus === vm.POWorkingStatus.Canceled.id || vm.poModel.lockStatus === TRANSACTION.PurchaseOrderLockStatus.Locked.id || vm.isReadOnly;
          vm.supplierAddrViewActionBtn.Update.isDisable = vm.supplierAddrViewActionBtn.Delete.isDisable = !vm.billingAddress || vm.isDisable;
          vm.shippingAddrViewActionBtn.Update.isDisable = vm.shippingAddrViewActionBtn.Delete.isDisable = !vm.shippingAddress || vm.isDisable;
          vm.shippingContPersonViewActionBtnDet.Update.isDisable = vm.shippingContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedShippingContactPerson || vm.isDisable;
          vm.markForAddrViewActionBtn.Update.isDisable = vm.markForAddrViewActionBtn.Delete.isDisable = !vm.markForAddress || vm.isDisable;

          vm.CopypoModel = angular.copy(res.data);
          if (vm.autoCompleteSupplierMfgCode) {
            const searchObj = {
              mfgcodeID: vm.poModel.supplierID
            };
            getSupplierMfgCodeSearch(searchObj);
          }
          if (vm.autoCompleteCustomer && vm.poModel.customerID) {
            getSupplierMfgCodeSearch({
              mfgcodeID: vm.poModel.customerID,
              type: CORE.MFG_TYPE.MFG,
              isCustomer: true
            });
          }
          if (vm.poModel.status) {
            vm.poModel.isAskForVersionConfirmation = true;
          }
          if (vm.autoCompleteCarriers) {
            vm.autoCompleteCarriers.keyColumnId = vm.poModel.carrierID;
          }
          if (vm.autoCompleteTerm) {
            vm.autoCompleteTerm.keyColumnId = vm.poModel.termsID;
          }
          if (vm.autoCompleteShipping) {
            vm.autoCompleteShipping.keyColumnId = vm.poModel.shippingMethodID;
          }
          if (vm.autoCompleteFOB) {
            vm.autoCompleteFOB.keyColumnId = vm.poModel.freeOnBoardID;
          }
          if (vm.autoCompleteContactPerson) {
            const contactPersonHeader = _.find(vm.ContactPersonList, (item) => item.id === vm.poModel.contactPersonEmpID);
            vm.autoCompleteContactPerson.keyColumnId = vm.poModel.contactPersonEmpID;
            if (contactPersonHeader) {
              vm.poModel.email = contactPersonHeader.email;
              vm.poModel.contact = contactPersonHeader.contact;
            }
          }
          vm.poModel.poDate = BaseService.getUIFormatedDate(vm.poModel.poDate, vm.DefaultDateFormat);
          vm.poModel.soDate = BaseService.getUIFormatedDate(vm.poModel.soDate, vm.DefaultDateFormat);
          vm.CopypoModel.poDate = angular.copy(vm.poModel.poDate);
          vm.CopypoModel.soDate = angular.copy(vm.poModel.soDate);
          let innerindex = 0;
          vm.purchaseDet = [];
          _.each(vm.CopypoModel.purchaseOrderDet, (purchasedata) => {
            const otherChargeTotal = (_.sumBy(purchasedata.purchaseOrderLineOtherCharges, (o) => (o.qty * o.price)) || 0);
            const totalReceivedQty = _.sumBy(purchasedata.purchaseOrderLineReleaseDet, (o) => (o.receivedQty || 0));
            const totalcompletedQty = _.filter(purchasedata.purchaseOrderLineReleaseDet, (o) => (o.poLineWorkingStatus === vm.POLineWorkingStatus.Close.id));
            const pStatus = totalcompletedQty.length !== purchasedata.purchaseOrderLineReleaseDet.length ? vm.POLineWorkingStatus.Open.id : vm.POLineWorkingStatus.Close.id;
            const obj = {
              partID: purchasedata.mfgPartID,
              PIDCode: purchasedata.mfgPartID && purchasedata.mfgParts.PIDCode ? purchasedata.mfgParts.PIDCode : null,
              partDescription: purchasedata.partDescription,
              RoHSStatusID: purchasedata.rohsStatusID,
              category: purchasedata.category,
              partType: purchasedata.mfgPartID ? purchasedata.mfgParts.partType : null,
              packagingID: purchasedata.packagingID,
              minimum: purchasedata.supplierPartID ? purchasedata.supplierParts && purchasedata.supplierParts.minimum ? parseInt(purchasedata.supplierParts.minimum) : 1 : (purchasedata.mfgPartID ? (purchasedata.mfgParts.minimum ? parseInt(purchasedata.mfgParts.minimum) : 1) : 1),
              mult: purchasedata.supplierPartID ? purchasedata.supplierParts && purchasedata.supplierParts.mult ? parseInt(purchasedata.supplierParts.mult) : 1 : (purchasedata.mfgPartID ? (purchasedata.mfgParts.mult ? parseInt(purchasedata.mfgParts.mult) : 1) : 1),
              mfgPN: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.mfgPN : null,
              unit: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.unit : null,
              isCustom: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.isCustom : null,
              rohsIcon: purchasedata.rohsStatusID && purchasedata.rfqRoHS ? purchasedata.rfqRoHS.rohsIcon : null,
              rohsName: purchasedata.rohsStatusID && purchasedata.rfqRoHS ? purchasedata.rfqRoHS.name : null,
              pcbPerArray: purchasedata.pcbPerArray || null,
              ispcbArrayShow: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.functionalCategoryID === CORE.RFQ_PARTTYPE.BAREPCB.ID : false,
              mfgName: purchasedata.mfgPartID && purchasedata.mfgParts && purchasedata.mfgParts.mfgCodemst ? purchasedata.mfgParts.mfgCodemst.mfgCodeName : null,
              uom: purchasedata.mfgPartID && purchasedata.mfgParts && purchasedata.mfgParts.UOMs ? purchasedata.mfgParts.UOMs.unitName : null,
              imageURL: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.imageURL : null,
              documentPath: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.documentPath : null,
              uomID: purchasedata.mfgPartID && purchasedata.mfgParts && purchasedata.mfgParts.UOMs ? purchasedata.mfgParts.UOMs.id : null,
              supplierMfgPNID: purchasedata.supplierPartID || null,
              supplierPN: purchasedata.supplierPartID && purchasedata.supplierParts ? purchasedata.supplierParts.mfgPN : null,
              supplierPID: purchasedata.supplierPartID && purchasedata.supplierParts ? purchasedata.supplierParts.PIDCode : null,
              supplierroHSIcon: purchasedata.rohsStatusID && purchasedata.rfqRoHS ? purchasedata.rfqRoHS.rohsIcon : null,
              supplierroHSName: purchasedata.rohsStatusID && purchasedata.rfqRoHS ? purchasedata.rfqRoHS.name : null,
              internalRef: purchasedata.internalRef,
              totalRelease: purchasedata.totalRelease,
              supplierisCustom: purchasedata.supplierPartID && purchasedata.supplierParts ? purchasedata.supplierParts.isCustom : null,
              extPrice: (purchasedata.qty * purchasedata.price),
              totalextPrice: (purchasedata.qty * purchasedata.price) + otherChargeTotal,
              lineID: purchasedata.lineID,
              isadd: false,
              remove: false,
              id: purchasedata.id,
              price: purchasedata.price ? parseFloat(purchasedata.price).toFixed(5) : 0,
              PODetail: [],
              POOtherDetail: purchasedata.purchaseOrderLineOtherCharges || [],
              lineComment: purchasedata.lineComment,
              internalLineComment: purchasedata.internalLineComment,
              qty: purchasedata.qty,
              otherCharges: otherChargeTotal.toFixed(2),
              isdisable: false,
              packagingName: purchasedata.packagingID && purchasedata.componentPackagingMst ? purchasedata.componentPackagingMst.name : null,
              spq: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.packageQty : null,
              supplierQuoteNumber: purchasedata.supplierQuoteNumber,
              mfgCodeID: purchasedata.mfgPartID && purchasedata.mfgParts ? purchasedata.mfgParts.mfgCodeID : null,
              PORequirementDetail: purchasedata.purchaseOrderLineRequirementDet || [],
              poLineWorkingStatusDisplay: BaseService.getPOLineWorkingStatus(pStatus),
              poLineWorkingStatus: pStatus,
              receivedQty: totalReceivedQty,
              pendingQty: (purchasedata.qty - totalReceivedQty) < 0 ? 0 : purchasedata.qty - totalReceivedQty,
              isLineCustConsigned: purchasedata.isLineCustConsigned,
              isLineCustConsignedValue: purchasedata.isLineCustConsigned ? 'Yes' : 'No',
              lineCustomerID: purchasedata.lineCustomerID,
              customerName: purchasedata.customers && purchasedata.customers.customerName ? purchasedata.customers.customerName : null,
              custAssyPN: purchasedata.mfgPartID && purchasedata.mfgParts.custAssyPN ? purchasedata.mfgParts.custAssyPN : null,
              isCPN: purchasedata.mfgPartID && purchasedata.mfgParts.isCPN ? purchasedata.mfgParts.isCPN : null,
              isNonUMIDStock: purchasedata.isNonUMIDStock,
              isNonUMIDStockValue: purchasedata.isNonUMIDStock ? 'Yes' : 'No'
            };
            _.each(purchasedata.purchaseOrderLineReleaseDet, (purchase) => {
              var detailObj = {
                promisedShipDate: BaseService.getUIFormatedDate(purchase.promisedShipDate, vm.DefaultDateFormat),
                shippingDate: BaseService.getUIFormatedDate(purchase.shippingDate, vm.DefaultDateFormat),
                qty: purchase.qty,
                shipping_index: innerindex,
                shippingMethodCode: purchase.shippingMethodPurchaseOrder && purchase.shippingMethodPurchaseOrder.gencCategoryCode ? purchase.shippingMethodPurchaseOrder.gencCategoryCode : null,
                shippingAddress: purchase.customerPurchaseOrderAddress ? BaseService.generateAddressFormateToStoreInDB(purchase.customerPurchaseOrderAddress) : null,
                releaseNotes: purchase.releaseNotes,
                carrierID: purchase.carrierID,
                carrierCode: purchase.releaseLineCarrierPurchaseOrder && purchase.releaseLineCarrierPurchaseOrder.gencCategoryCode ? purchase.releaseLineCarrierPurchaseOrder.gencCategoryCode : null,
                carrierAccountNumber: purchase.carrierAccountNumber,
                additionalNotes: purchase.additionalNotes,
                id: purchase.id,
                isadd: false,
                remove: false,
                isdisable: false,
                parent: obj,
                releaseNumber: purchase.releaseNumber || 1,
                shippingMethodID: purchase.shippingMethodID || null,
                shippingAddressID: purchase.shippingAddressID || null,
                poLineWorkingStatusDisplay: BaseService.getPOLineWorkingStatus(purchase.poLineWorkingStatus || vm.POLineWorkingStatus.Open.id),
                poLineWorkingStatus: purchase.poLineWorkingStatus || vm.POLineWorkingStatus.Open.id,
                receivedQty: purchase.receivedQty || 0,
                poLineCompleteReason: purchase.poLineCompleteReason,
                poLineCompleteType: purchase.poLineCompleteType,
                poLineCompleteTypeLabel: purchase.poLineCompleteType === vm.POCompleteType.MANUAL ? CORE.POCompleteStatusTypeDropDown[3].value : purchase.poLineCompleteType === vm.POCompleteType.AUTO ? CORE.POCompleteStatusTypeDropDown[2].value : CORE.POCompleteStatusTypeDropDown[1].value,
                pendingQty: (purchase.qty - purchase.receivedQty) < 0 ? 0 : purchase.qty - purchase.receivedQty,
                shippingContactPersonID: purchase.shippingContactPersonID || null
              };
              obj.PODetail.push(detailObj);
              innerindex = innerindex + 1;
            });
            vm.purchaseDet.push(obj);
          });
          vm.totalCustomerConsignedLines = _.filter(vm.purchaseDet, ['isLineCustConsigned', true]);
          if (vm.loadData) {
            vm.sourceData = _.clone(_.orderBy(vm.purchaseDet, ['lineID'], ['ASC']));
            vm.purchaseOrderDatacopy = _.clone(vm.sourceData);
            vm.getPurchaseOrderPriceDetails();
            $timeout(() => {
              vm.totalSourceDataCount = vm.sourceData.length;
              vm.currentdata = vm.sourceData.length;
              vm.gridOptions.data = vm.sourceData;
              vm.gridOptions.totalItems = vm.sourceData.length;
              vm.gridOptions.currentItem = vm.sourceData.length;
            }, true);
          }
          else if (!vm.loadData && vm.poID) {
            grid();
          }
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.status = vm.poModel.status;
            $scope.$parent.vm.poWorkingStatus = vm.poModel.poWorkingStatus;
            $scope.$parent.vm.isDisabled = vm.isDisable;
            $scope.$parent.vm.poNumber = vm.poModel.poNumber;
            $scope.$parent.vm.poDate = vm.poModel.poDate;
            $scope.$parent.vm.poRevision = vm.poModel.poRevision;
            $scope.$parent.vm.soNumber = vm.poModel.soNumber;
            $scope.$parent.vm.label = vm.poModel.status ? CORE.OPSTATUSLABLEDRAFT : CORE.OPSTATUSLABLEPUBLISH;
            $scope.$parent.vm.poId = vm.poModel.id;
            if ($scope.$parent.vm.autoCompletePurchaseOrder) {
              $scope.$parent.vm.autoCompletePurchaseOrder.keyColumnId = res.data.id;
            }
            $scope.$parent.vm.tabList[1].isDisabled = false;
            $scope.$parent.vm.tabList[2].isDisabled = false;
            $scope.$parent.vm.CancellationConfirmed = vm.poModel.CancellationConfirmed;
            $scope.$parent.vm.lockStatus = vm.poModel.lockStatus;
            $scope.$parent.vm.lockedBy = vm.poModel.lockedBy;
            $scope.$parent.vm.lockedByName = vm.poModel.lockedByName;
            $scope.$parent.vm.lockedAt = vm.poModel.lockedAt;
          }
          $timeout(() => vm.checkPurchaseOrderMFR());
          return $q.resolve(vm.poModel);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //check for edit option
    initAutoComplete();
    //Set So date
    vm.onChangeSODate = () => {
      initdateoption();
      vm.checkDateValidation(true);
    };

    vm.onChangePORevision = () => {
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.poRevision = vm.poModel.poRevision;
      }
    };

    //set PO date
    vm.onChangePODate = () => {
      initdateoption();
      vm.checkDateValidation(false);
      if ($scope.$parent && $scope.$parent.vm) {
        $scope.$parent.vm.poDate = vm.poModel.poDate;
      }
    };

    // check date validation
    vm.checkDateValidation = (isSODate) => {
      const poDate = vm.poModel.poDate ? new Date($filter('date')(vm.poModel.poDate, vm.DefaultDateFormat)) : vm.frmPurchaseOrder && vm.frmPurchaseOrder.poDate && vm.frmPurchaseOrder.poDate.$viewValue ? new Date($filter('date')(vm.frmPurchaseOrder.poDate.$viewValue, vm.DefaultDateFormat)) : null;
      const soDate = vm.poModel.soDate ? new Date($filter('date')(vm.poModel.soDate, vm.DefaultDateFormat)) : vm.frmPurchaseOrder && vm.frmPurchaseOrder.soDate && vm.frmPurchaseOrder.soDate.$viewValue ? new Date($filter('date')(vm.frmPurchaseOrder.soDate.$viewValue, vm.DefaultDateFormat)) : null;

      if (vm.frmPurchaseOrder) {
        if (vm.frmPurchaseOrder.poDate && vm.frmPurchaseOrder.soDate && poDate && soDate) {
          if (isSODate && poDate <= soDate) {
            vm.poModel.poDate = poDate;
            vm.frmPurchaseOrder.poDate.$setValidity('maxvalue', true);
          }
          if (!isSODate && poDate <= soDate) {
            vm.poModel.soDate = soDate;
            vm.frmPurchaseOrder.soDate.$setValidity('minvalue', true);
          }
        }
      }
    };

    const getSalesContactPersonList = (refTransID, isSupplierContactPerson) => CustomerFactory.getCustomerContactPersons().query({
      refTransID: refTransID || vm.companyProfile.mfgCodeId,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST
    }).$promise.then((contactperson) => {
      if (isSupplierContactPerson) {
        vm.supplierContactPersonList = contactperson.data;
        if (vm.poModel.supplierContactPersonID && vm.billingAddress) {
          vm.billingAddress.contactPerson = _.find(vm.supplierContactPersonList, (contactPerson) => contactPerson.personId === vm.poModel.supplierContactPersonID);
          vm.supplierContPersonViewActionBtnDet.Update.isDisable = vm.supplierContPersonViewActionBtnDet.Delete.isDisable = !vm.billingAddress.contactPerson || vm.isDisable;
          billingAddressDetail(vm.billingAddress);
        }
        return $q.resolve(vm.supplierContactPersonList);
      } else {
        vm.salesContactPersonList = contactperson.data;
        return $q.resolve(vm.salesContactPersonList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer address
     */
    // eslint-disable-next-line arrow-body-style
    const getCompanyAddress = (shippingAddresssID, isMarkForAddress) => CustomerFactory.customerAddressList().query({
      customerId: vm.companyProfile.mfgCodeId,
      addressType: isMarkForAddress ? vm.AddressTypeConst.IntermediateAddress : vm.AddressTypeConst.ShippingAddress,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      addressID: shippingAddresssID
    }).$promise.then((customeraddress) => {
      vm.shippingAddressList = customeraddress.data;
      vm.viewMarkForAddrOtherDet.showAddressEmptyState = vm.viewShippingAddrOtherDet.showAddressEmptyState = vm.shippingAddressList && vm.shippingAddressList.length === 0 ? true : false;
      vm.markForAddrViewActionBtn.ApplyNew.isDisable = vm.shippingAddrViewActionBtn.ApplyNew.isDisable = vm.shippingAddressList.length === 0 || vm.isDisable;
      _.each(vm.shippingAddressList, (item) => item.FullAddress = BaseService.generateAddressFormateToStoreInDB(item));
      if (vm.companyProfile.mfgCodeId) {
        if (shippingAddresssID) {
          if (isMarkForAddress) {
            vm.markForAddress = vm.shippingAddressList[0];
            vm.viewMarkForAddrOtherDet.alreadySelectedAddressID = vm.markForAddress.id;
            if (vm.poModel.intermediateContactPersonID) {
              vm.markForAddress.contactPerson = _.find(vm.salesContactPersonList, (contactPerson) => contactPerson.personId === vm.poModel.intermediateContactPersonID);
              vm.markForContPersonViewActionBtnDet.Update.isDisable = vm.markForContPersonViewActionBtnDet.Delete.isDisable = !vm.markForAddress.contactPerson || vm.isDisable;
              if (vm.markForAddress.contactPerson) {
                vm.selectedMarkForContactPerson = angular.copy(vm.markForAddress.contactPerson);
                vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson.personId;
              } else {
                vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson = null;
              }
            } else {
              vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson = null;
              vm.markForAddress.contactPerson = null;
            }
          } else {
            vm.shippingAddress = vm.shippingAddressList[0];
            vm.viewShippingAddrOtherDet.alreadySelectedAddressID = vm.shippingAddress.id;
            if (vm.poModel.shippingContactPersonID) {
              vm.shippingAddress.contactPerson = _.find(vm.salesContactPersonList, (contactPerson) => contactPerson.personId === vm.poModel.shippingContactPersonID);
              shippingAddressDetail(vm.shippingAddress);
            }
          }
        } else {
          if (!isMarkForAddress) {
            const defaultShippingAddress = _.find(vm.shippingAddressList, (item) => item.isDefault === true);
            if (defaultShippingAddress) {
              vm.shippingAddress = defaultShippingAddress;
              vm.viewShippingAddrOtherDet.alreadySelectedAddressID = vm.shippingAddress.id;
              shippingAddressDetail(defaultShippingAddress);
            } else {
              vm.viewShippingAddrOtherDet.alreadySelectedAddressID = vm.shippingAddress = null;
            }
          } else {
            // mark for address
            if (!vm.poID && vm.shippingAddress && vm.shippingAddress.defaultIntermediateAddressID) {
              const defaultMarkForAddrDet = _.find(vm.shippingAddressList, (addrItem) => addrItem.id === vm.shippingAddress.defaultIntermediateAddressID);
              if (defaultMarkForAddrDet) {
                vm.markForAddress = defaultMarkForAddrDet;
                vm.viewMarkForAddrOtherDet.alreadySelectedAddressID = vm.markForAddress.id;
                if (vm.shippingAddress.defaultIntermediateContactPersonID) {
                  vm.markForAddress.contactPerson = _.find(vm.salesContactPersonList, (contactPerson) => contactPerson.personId === vm.shippingAddress.defaultIntermediateContactPersonID);
                  if (vm.markForAddress.contactPerson) {
                    vm.selectedMarkForContactPerson = angular.copy(vm.markForAddress.contactPerson);
                    vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson.personId;
                  } else {
                    vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson = null;
                  }
                } else {
                  vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson = null;
                  vm.markForAddress.contactPerson = null;
                }
              }
            }
          }
        }
      }
      return $q.resolve(vm.shippingAddressList);
    }).catch((error) => BaseService.getErrorLog(error));

    //shipping address
    const shippingAddressDetail = (newAddress) => {
      if (newAddress.contactPerson) {
        vm.selectedShippingContactPerson = angular.copy(newAddress.contactPerson);
        vm.viewShippingAddrOtherDet.alreadySelectedPersonId = vm.selectedShippingContactPerson.personId;
      } else {
        vm.viewShippingAddrOtherDet.alreadySelectedPersonId = vm.selectedShippingContactPerson = null;
      }
    };

    vm.addEditShippingAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.shippingAddress = callBackAddress;
        vm.shippingAddrViewActionBtn.Update.isDisable = vm.shippingAddrViewActionBtn.Delete.isDisable = !vm.shippingAddress || vm.isDisable;
        vm.viewShippingAddrOtherDet.alreadySelectedAddressID = vm.shippingAddress.id;
        shippingAddressDetail(callBackAddress);
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }
    };

    vm.addEditShippingContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedShippingContactPerson = callBackContactPerson;
        vm.shippingContPersonViewActionBtnDet.Update.isDisable = vm.shippingContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedShippingContactPerson || vm.isDisable;
        vm.viewShippingAddrOtherDet.alreadySelectedPersonId = vm.selectedShippingContactPerson.personId;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }
    };

    vm.refreshShippingAddress = (ev, callBack) => {
      if (callBack) {
        getCompanyAddress();
      }
    };

    vm.removeShippingAddress = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, 'billing address / shipping ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.viewShippingAddrOtherDet.alreadySelectedPersonId = vm.viewShippingAddrOtherDet.alreadySelectedAddressID = vm.selectedShippingContactPerson = vm.shippingAddress = null;
        vm.shippingAddrViewActionBtn.Update.isDisable = vm.shippingAddrViewActionBtn.Delete.isDisable = !vm.shippingAddress || vm.isDisable;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }, () => { });
    };

    vm.removeShippingContactPerson = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, 'billing address / shipping ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.selectedShippingContactPerson = vm.viewShippingAddrOtherDet.alreadySelectedPersonId = null;
        vm.shippingContPersonViewActionBtnDet.Update.isDisable = vm.shippingContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedShippingContactPerson || vm.isDisable;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //Mark For address
    vm.addEditMarkForAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.markForAddress = callBackAddress;
        vm.markForAddrViewActionBtn.Update.isDisable = vm.markForAddrViewActionBtn.Delete.isDisable = !vm.markForAddress || vm.isDisable;
        vm.viewMarkForAddrOtherDet.alreadySelectedAddressID = vm.markForAddress.id;
        vm.markForContPersonViewActionBtnDet.Update.isDisable = vm.markForContPersonViewActionBtnDet.Delete.isDisable = !vm.markForAddress.contactPerson || vm.isDisable;
        if (vm.markForAddress.contactPerson) {
          vm.selectedMarkForContactPerson = angular.copy(vm.markForAddress.contactPerson);
          vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson.personId;
        } else {
          vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson = null;
        }
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }
    };

    vm.addEditMarkForContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedMarkForContactPerson = callBackContactPerson;
        vm.markForContPersonViewActionBtnDet.Update.isDisable = vm.markForContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedMarkForContactPerson || vm.isDisable;
        vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.selectedMarkForContactPerson.personId;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }
    };

    vm.removeMarkForAddress = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.MarkFor);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = vm.viewMarkForAddrOtherDet.alreadySelectedAddressID = vm.selectedMarkForContactPerson = vm.markForAddress = null;
        vm.markForAddrViewActionBtn.Update.isDisable = vm.markForAddrViewActionBtn.Delete.isDisable = !vm.markForAddress || vm.isDisable;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }, () => { });
    };

    vm.removeMarkForContactPerson = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.COMMON.MarkFor);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.selectedMarkForContactPerson = vm.viewMarkForAddrOtherDet.alreadySelectedPersonId = null;
        vm.markForContPersonViewActionBtnDet.Update.isDisable = vm.markForContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedMarkForContactPerson || vm.isDisable;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*
     * Author :  Champak Chaudhary
     * Purpose : Get customer address
     */
    // eslint-disable-next-line arrow-body-style
    //get supplier address list
    const getSupplierAddress = (supplierAddressID) => CustomerFactory.customerAddressList().query({
      customerId: vm.poModel.supplierID,
      addressType: vm.AddressTypeConst.BusinessAddress,
      refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
      addressID: supplierAddressID
    }).$promise.then((customeraddress) => {
      vm.billingAddressList = customeraddress.data;
      vm.supplierAddrViewActionBtn.ApplyNew.isDisable = vm.billingAddressList.length === 0 || !vm.autoCompleteSupplierMfgCode.keyColumnId || vm.isDisable;
      vm.supplierAddrViewActionBtn.AddNew.isDisable = !vm.autoCompleteSupplierMfgCode.keyColumnId || vm.isDisable;
      vm.viewCustAddrOtherDet.showAddressEmptyState = vm.billingAddressList && vm.billingAddressList.length === 0 ? true : false;
      if (supplierAddressID) {
        vm.billingAddress = vm.billingAddressList[0];
        vm.viewCustAddrOtherDet.alreadySelectedAddressID = vm.billingAddress.id;
      } else {
        const defaultBillingAddress = _.find(vm.billingAddressList, (item) => item.isDefault === true);
        if (defaultBillingAddress) {
          vm.billingAddress = defaultBillingAddress;
          vm.viewCustAddrOtherDet.alreadySelectedAddressID = vm.billingAddress.id;
          billingAddressDetail(defaultBillingAddress);
        } else {
          vm.viewCustAddrOtherDet.alreadySelectedAddressID = vm.billingAddress = null;
        }
      }
      return $q.resolve(vm.billingAddressList);
    }).catch((error) => BaseService.getErrorLog(error));

    //billling Address
    const billingAddressDetail = (newAddress) => {
      if (newAddress.contactPerson) {
        vm.selectedContactPerson = angular.copy(newAddress.contactPerson);
        vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
      } else {
        vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson = null;
      }
    };

    vm.addEditSupplierAddress = (ev, callBackAddress) => {
      if (callBackAddress) {
        vm.billingAddress = callBackAddress;
        vm.supplierAddrViewActionBtn.Update.isDisable = vm.supplierAddrViewActionBtn.Delete.isDisable = !vm.billingAddress || vm.isDisable;
        vm.viewCustAddrOtherDet.alreadySelectedAddressID = vm.billingAddress.id;
        billingAddressDetail(callBackAddress);
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }
    };


    vm.addEditSupplierContactPerson = (ev, callBackContactPerson) => {
      if (callBackContactPerson) {
        vm.selectedContactPerson = callBackContactPerson;
        vm.supplierContPersonViewActionBtnDet.Update.isDisable = vm.supplierContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedContactPerson || vm.isDisable;
        vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.selectedContactPerson.personId;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }
    };

    vm.refreshSupplierAddress = (ev, callBack) => {
      if (callBack) {
        getSupplierAddress();
      }
    };

    vm.removeSupplierAddress = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DEFINE_ADDRESS_REMOVE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, 'supplier business ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.viewCustAddrOtherDet.alreadySelectedPersonId = vm.viewCustAddrOtherDet.alreadySelectedAddressID = vm.selectedContactPerson = vm.billingAddress = null;
        vm.supplierAddrViewActionBtn.Update.isDisable = vm.supplierAddrViewActionBtn.Delete.isDisable = !vm.billingAddress || vm.isDisable;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }, () => { });
    };

    vm.removeSupplierContactPerson = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONTACT_PERSON_FROM_ADDR);
      messageContent.message = stringFormat(messageContent.message, 'supplier business ');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.selectedContactPerson = vm.viewCustAddrOtherDet.alreadySelectedPersonId = null;
        vm.supplierContPersonViewActionBtnDet.Update.isDisable = vm.supplierContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedContactPerson || vm.isDisable;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

      //get max length validations
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      //save purchase order number
      vm.savePurchaseOrder = () => {
        if (vm.isReadOnly) {
          return;
        }
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.isSaveDisabled = true;
        }
        if (BaseService.focusRequiredField(vm.frmPurchaseOrder)) {
          if (vm.poID) {
            vm.poModel.status = vm.CopypoModel.status;
          } else {
            vm.poModel.status = 0;
          }
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.isSaveDisabled = false;
          }
          return;
        }
        else if (!(vm.billingAddress && vm.billingAddress.id) || !(vm.shippingAddress && vm.shippingAddress.id)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_ADDRESS_NOT_FOUND);
          if (!(vm.billingAddress && vm.billingAddress.id) && !(vm.shippingAddress && vm.shippingAddress.id)) {
            messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.Address.SupplierBusinessAddress} and ${vm.LabelConstant.PURCHASE_ORDER.BillToShipTo} are`);
          } else if (!(vm.billingAddress && vm.billingAddress.id)) {
            messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.Address.SupplierBusinessAddress} is`);
          } else if (!(vm.shippingAddress && vm.shippingAddress.id)) {
            messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.PURCHASE_ORDER.BillToShipTo} is`);
          }
          const obj = {
            multiple: true,
            messageContent
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            if (vm.poID) {
              vm.poModel.status = vm.CopypoModel.status;
            } else {
              vm.poModel.status = 0;
            }
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
          });
        } else if (!(vm.selectedContactPerson && vm.selectedContactPerson.personId) || !(vm.selectedShippingContactPerson && vm.selectedShippingContactPerson.personId) || (vm.markForAddress && vm.markForAddress.id && !(vm.selectedMarkForContactPerson && vm.selectedMarkForContactPerson.personId))) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS);
          if (!(vm.selectedContactPerson && vm.selectedContactPerson.personId)) {
            messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.Address.SupplierBusinessAddress} ${vm.LabelConstant.PURCHASE_ORDER.ContactPerson}`);
          } else if (!(vm.selectedShippingContactPerson && vm.selectedShippingContactPerson.personId)) {
            messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.PURCHASE_ORDER.BillToShipTo} ${vm.LabelConstant.PURCHASE_ORDER.ContactPerson}`);
          } else if (vm.markForAddress && vm.markForAddress.id && !(vm.selectedMarkForContactPerson && vm.selectedMarkForContactPerson.personId)) {
            messageContent.message = stringFormat(messageContent.message, `${vm.LabelConstant.Address.MarkForAddress} ${vm.LabelConstant.PURCHASE_ORDER.ContactPerson}`);
          }
          const obj = {
            multiple: true,
            messageContent
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            if (vm.poID) {
              vm.poModel.status = vm.CopypoModel.status;
            } else {
              vm.poModel.status = 0;
            }
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
          });
        }
        else {
          if (vm.CopypoModel && vm.CopypoModel.isAlreadyPublished) {
            if (!vm.poModel.status && vm.CopypoModel.status) {
              vm.poModel.isAskForVersionConfirmation = false;
            } else if (((vm.poModel.status && !vm.CopypoModel.status) || !vm.CopypoModel.status) && ((
              vm.CopypoModel.poDate !== vm.poModel.poDate || vm.CopypoModel.soDate !== vm.poModel.soDate || vm.CopypoModel.contactPersonEmpID !== vm.poModel.contactPersonEmpID || vm.CopypoModel.email !== vm.poModel.email || vm.CopypoModel.contact !== vm.poModel.contact ||
              vm.autoCompleteTerm.keyColumnId !== vm.CopypoModel.termsID || vm.CopypoModel.shippingMethodID !== vm.autoCompleteShipping.keyColumnId || vm.CopypoModel.carrierID !== vm.autoCompleteCarriers.keyColumnId || vm.CopypoModel.carrierAccountNumber !== vm.poModel.carrierAccountNumber ||
              vm.poModel.shippingInsurance !== vm.CopypoModel.shippingInsurance || vm.autoCompleteFOB.keyColumnId !== vm.CopypoModel.freeOnBoardID || vm.poModel.isCustConsigned !== vm.CopypoModel.isCustConsigned || vm.autoCompleteCustomer.keyColumnId !== vm.CopypoModel.customerID || vm.poModel.isNonUMIDStock !== vm.CopypoModel.isNonUMIDStock ||
              vm.poModel.shippingComment !== vm.CopypoModel.shippingComment || vm.poModel.poComment !== vm.CopypoModel.poComment
            ) || vm.checkDirty)) {
              vm.poModel.isAskForVersionConfirmation = true;
            }
          } else if (vm.poModel.status) {
            vm.poModel.isAskForVersionConfirmation = true;
          }
          saveMasterPODetail();
        }
      };
      //save purchase order details
      const saveMasterPODetail = () => {
        vm.isfalse = false;
        if (vm.sourceData && vm.sourceData.length > 0) {
          const partIds = _.map(vm.sourceData, 'partID');
          return ComponentFactory.getComponentPartStatus().query({ id: partIds }).$promise.then((response) => {
            const invalidparts = response && response.data ? _.filter(response.data, (item) => item.partStatus === CORE.PartStatusList.InActiveInternal) : null;
            if (invalidparts && invalidparts.length > 0) {
              vm.isfalse = true;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_ALREADY_INACTIVE);
              messageContent.message = stringFormat(messageContent.message, _.map(invalidparts, (part) => redirectToPartDetail(part.id, part.PIDCode)).join(', '), redirectToPOAnchorTag(vm.poID, vm.poModel.poNumber));
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              if ($scope.$parent && $scope.$parent.vm) {
                $scope.$parent.vm.isSaveDisabled = false;
              }
              return DialogFactory.messageAlertDialog(model);
            } else {
              vm.checkValidation();
              checkPOValidation();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          checkPOValidation();
        }
      };

      const checkPOValidation = () => {
        const colindex = 0;
        if (vm.isfalse) {
          if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
            vm.gridOptions.gridApi.expandable.collapseAllRows();
            vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[colindex]);
          }
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.isSaveDisabled = false;
          }
          return false;
        }
        masterPODetail();
      };

      //save purchase master detail
      const masterPODetail = () => {
        if (vm.poID) {
          vm.checkPurchaseOrderMFR().then((response) => {
            if (response && vm.CopypoModel && moment(vm.CopypoModel.poDate).format('YYYY-MM-DD') !== moment(vm.poModel.poDate).format('YYYY-MM-DD')) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_RESTRICT_FOR_PODATE);
              messageContent.message = stringFormat(messageContent.message, vm.poModel.poNumber);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                vm.poModel.poDate = vm.CopypoModel.poDate;
                vm.poModel.poNumber = vm.CopypoModel.poNumber;
                if ($scope.$parent && $scope.$parent.vm) {
                  $scope.$parent.vm.poNumber = vm.poModel.poNumber;
                  $scope.$parent.vm.isSaveDisabled = false;
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
              // Alert message already packing slip generated
            } else if (vm.poModel.poWorkingStatus === vm.POWorkingStatus.Completed.id) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_ALREADY_COMPLETED);
              messageContent.message = stringFormat(messageContent.message, vm.poModel.poNumber);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                if ($scope.$parent && $scope.$parent.vm) {
                  $scope.$parent.vm.isSaveDisabled = false;
                }
                if (vm.frmPurchaseOrder) {
                  vm.frmPurchaseOrder.$setPristine();
                }
                if (vm.PODetForm) {
                  vm.PODetForm.$setPristine();
                }
                getPurchaseOrderDetail();
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              if (vm.poModel.soNumber) {
                vm.checkUniqueSONumber().then((responseSo) => {
                  if (responseSo) {
                    checkSOValidation();
                  }
                });
              } else {
                checkSOValidation();
              }
            }
          });
        } else {
          if (vm.poModel.soNumber) {
            vm.checkUniqueSONumber().then((responseSo) => {
              if (responseSo) {
                checkSOValidation();
              }
            });
          } else {
            checkSOValidation();
          }
        }
      };
      //check so validation on save
      let isValidationOpen = false;
      const checkSOValidation = () => {
        if (vm.poID && (vm.poModel.soNumber !== vm.CopypoModel.soNumber)) {
          vm.checkPurchaseOrderMFR().then(() => {
            if (vm.packingSlipGenerate && vm.packingSlipGenerate.length > 0) {
              const uniqueSO = _.map(_.uniqBy(vm.packingSlipGenerate, 'supplierSONumber'), 'supplierSONumber').join(',');
              if (uniqueSO !== vm.poModel.soNumber) {
                if (isValidationOpen) {
                  return;
                }
                isValidationOpen = true;
                // set message to update detail
                const packingslip = _.map(vm.packingSlipGenerate, 'packingSlipNumber').join(',');
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_SO_MISMATCH_CONFIRMATION);
                messageContent.message = stringFormat(messageContent.message, vm.poModel.soNumber || '', vm.poModel.poNumber, uniqueSO, packingslip);
                const model = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(model).then((yes) => {
                  if (yes) {
                    confirmationStatusChange();
                    isValidationOpen = false;
                  }
                }, () => {
                  vm.poModel.soNumber = null;
                  isValidationOpen = false;
                  setSoHeader();
                  setFocus('soNumber');
                  if ($scope.$parent && $scope.$parent.vm) {
                    $scope.$parent.vm.isSaveDisabled = false;
                  }
                });
              } else {
                confirmationStatusChange();
                isValidationOpen = false;
              }
            } else {
              confirmationStatusChange();
              isValidationOpen = false;
            }
          });
        } else {
          confirmationStatusChange();
        }
      };

      const confirmationStatusChange = () => {
        if (((vm.CopypoModel && vm.CopypoModel.isAlreadyPublished && !vm.CopypoModel.status && vm.poModel.status) ||
          (vm.CopypoModel && vm.CopypoModel.isAlreadyPublished && vm.poModel.status)) && vm.poModel.isAskForVersionConfirmation &&
          vm.poModel.poWorkingStatus !== CORE.PurchaseOrderLineStatusGridHeaderDropdown[3].ID) {
          let newPORevision = parseInt(vm.poModel.poRevision || 0) + 1;
          if (newPORevision < 10) {
            newPORevision = stringFormat('0{0}', newPORevision);
          }
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_STATUS_REVISION_CHANGE_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, vm.poModel.poRevision, newPORevision);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.poModel.isPOrevision = true;
              nonUMIDStockConfirmation();
            }
          }, () => {
            vm.poModel.isPOrevision = false;
            nonUMIDStockConfirmation();
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.poModel.isPOrevision = false;
          nonUMIDStockConfirmation();
        }
      };

      const nonUMIDStockConfirmation = () => {
        if ((vm.poModel.isNonUMIDStock && vm.CopypoModel && !vm.CopypoModel.isNonUMIDStock && vm.poID) || (!vm.poID && vm.poModel.isNonUMIDStock)) {
          const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ADDING_AS_NON_UMID_STOCK;
          return DialogFactory.messageConfirmDialog({
            messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          }).then(() => checkPONumberDetail(), () => {
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
          });
        } else {
          checkPONumberDetail();
        }
      };
      // check po detail before save
      const checkPONumberDetail = () => {
        const podetaillist = [];
        _.each(vm.sourceData, (item) => {
          if (!vm.isfalse) {
            _.each(item.PODetail, (data) => {
              data.parent = null;
              data.shippingDate = BaseService.getAPIFormatedDate(data.shippingDate);
              data.promisedShipDate = BaseService.getAPIFormatedDate(data.promisedShipDate);
            });
          }
          const obj = {
            lineID: item.lineID,
            id: item.id ? item.id : 0,
            qty: item.qty,
            price: item.price,
            mfgPartID: item.partID,
            supplierPartID: item.supplierMfgPNID || null,
            packagingID: item.packagingID,
            partDescription: item.partDescription,
            pcbPerArray: item.pcbPerArray || null,
            rohsStatusID: item.RoHSStatusID || null,
            internalRef: item.internalRef || null,
            lineComment: item.lineComment,
            totalRelease: item.totalRelease || 1,
            PODetail: item.PODetail || [],
            custPOLineNumber: item.custPOLineNumber,
            POOtherDetail: item.POOtherDetail || [],
            category: item.category,
            supplierQuoteNumber: item.supplierQuoteNumber || null,
            PORequirementDetail: item.PORequirementDetail || [],
            objApproval: item.objApproval || null,
            internalLineComment: item.internalLineComment || null,
            poLineWorkingStatus: item.receivedQty && item.qty && parseInt(item.receivedQty) >= parseInt(item.qty) ? vm.POLineWorkingStatus.Close.id : vm.POLineWorkingStatus.Open.id,
            poLineCompleteReason: item.poLineCompleteReason || null,
            poLineCompleteType: item.poLineCompleteType,
            isLineCustConsigned: item.isLineCustConsigned,
            lineCustomerID: item.lineCustomerID,
            isNonUMIDStock: item.isNonUMIDStock
          };
          podetaillist.push(obj);
        });
        const objPurchaseOrder = {
          id: vm.poModel.id || null,
          status: vm.poModel.status,
          poNumber: vm.poModel.poNumber,
          poDate: BaseService.getAPIFormatedDate(vm.poModel.poDate),
          soNumber: vm.poModel.soNumber || null,
          soDate: BaseService.getAPIFormatedDate(vm.poModel.soDate) || null,
          shippingMethodID: vm.autoCompleteShipping.keyColumnId,
          freeOnBoardID: vm.autoCompleteFOB.keyColumnId,
          shippingAddressID: vm.shippingAddress && vm.shippingAddress.id ? vm.shippingAddress.id : null,
          contactPersonEmpID: vm.autoCompleteContactPerson.keyColumnId || null,
          intermediateShipmentID: vm.markForAddress && vm.markForAddress.id ? vm.markForAddress.id : null,
          supplierAddressID: vm.billingAddress && vm.billingAddress.id ? vm.billingAddress.id : null,
          supplierID: vm.autoCompleteSupplierMfgCode.keyColumnId,
          termsID: vm.autoCompleteTerm.keyColumnId,
          poComment: vm.poModel.poComment,
          poRevision: vm.poModel.poRevision,
          carrierID: vm.autoCompleteCarriers.keyColumnId,
          carrierAccountNumber: vm.poModel.carrierAccountNumber,
          shippingInsurance: vm.poModel.shippingInsurance,
          supplierAddress: vm.billingAddress ? BaseService.generateAddressFormateToStoreInDB(vm.billingAddress) : null,
          shippingAddress: vm.shippingAddress ? BaseService.generateAddressFormateToStoreInDB(vm.shippingAddress) : null,
          intermediateAddress: vm.markForAddress ? BaseService.generateAddressFormateToStoreInDB(vm.markForAddress) : null,
          poDet: podetaillist,
          isBlanketPO: vm.poModel.isBlanketPO,
          shippingComment: vm.poModel.shippingComment,
          poWorkingStatus: vm.poModel.poWorkingStatus,
          poCompleteReason: vm.poModel.poCompleteReason,
          poCompleteType: vm.poModel.poCompleteType,
          isPOrevision: vm.poModel.isPOrevision,
          employeeID: vm.loginUser.employee.id,
          isAlreadyPublished: vm.CopypoModel && vm.CopypoModel.isAlreadyPublished ? vm.CopypoModel.isAlreadyPublished : (vm.poModel.status),
          CancellationConfirmed: vm.poModel.CancellationConfirmed,
          cancleReason: vm.poModel.cancleReason,
          isCustConsigned: vm.poModel.isCustConsigned,
          customerID: vm.poModel.customerID,
          isNonUMIDStock: vm.poModel.isNonUMIDStock,
          isAskForVersionConfirmation: vm.poModel.isAskForVersionConfirmation,
          supplierContactPerson: vm.selectedContactPerson ? BaseService.generateContactPersonDetFormat(vm.selectedContactPerson) : null,
          supplierContactPersonID: vm.selectedContactPerson && vm.selectedContactPerson.personId ? vm.selectedContactPerson.personId : null,
          shippingContactPerson: vm.selectedShippingContactPerson ? BaseService.generateContactPersonDetFormat(vm.selectedShippingContactPerson) : null,
          shippingContactPersonID: vm.selectedShippingContactPerson && vm.selectedShippingContactPerson.personId ? vm.selectedShippingContactPerson.personId : null,
          intermediateContactPerson: vm.selectedMarkForContactPerson ? BaseService.generateContactPersonDetFormat(vm.selectedMarkForContactPerson) : null,
          intermediateContactPersonID: vm.selectedMarkForContactPerson && vm.selectedMarkForContactPerson.personId ? vm.selectedMarkForContactPerson.personId : null,
          isPackingSlipGenerated: vm.isPackingSlipGenerated
        };
        objPurchaseOrder.supplierAddress = objPurchaseOrder.supplierAddress ? objPurchaseOrder.supplierAddress.replace(/<br\/>/g, '\r') : null;
        objPurchaseOrder.shippingAddress = objPurchaseOrder.shippingAddress ? objPurchaseOrder.shippingAddress.replace(/<br\/>/g, '\r') : null;
        objPurchaseOrder.intermediateAddress = objPurchaseOrder.intermediateAddress ? objPurchaseOrder.intermediateAddress.replace(/<br\/>/g, '\r') : null;
        objPurchaseOrder.supplierContactPerson = objPurchaseOrder.supplierContactPerson ? objPurchaseOrder.supplierContactPerson.replace(/<br\/>/g, '\r') : null;
        objPurchaseOrder.shippingContactPerson = objPurchaseOrder.shippingContactPerson ? objPurchaseOrder.shippingContactPerson.replace(/<br\/>/g, '\r') : null;
        objPurchaseOrder.intermediateContactPerson = objPurchaseOrder.intermediateContactPerson ? objPurchaseOrder.intermediateContactPerson.replace(/<br\/>/g, '\r') : null;
        vm.isFocus = false;
        if (!vm.poModel.id) {
          vm.cgBusyLoading = PurchaseOrderFactory.createPurchaseOrder().query(objPurchaseOrder).$promise.then((res) => {
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
            if (res.data) {
              if (vm.frmPurchaseOrder) {
                vm.frmPurchaseOrder.$setPristine();
              }
              $scope.$parent.vm.poID = res.data.id;
              vm.resetDetail();
              $timeout(() => {
                $scope.$emit('PurchaseOrderAutocomplete');
                vm.isFocus = true;
                vm.checkDirty = false;
                $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE, { id: res.data.id }, {}, { reload: true });
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.cgBusyLoading = PurchaseOrderFactory.updatePurchaseOrder().query(objPurchaseOrder).$promise.then((res) => {
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
            if (res.data) {
              vm.frmPurchaseOrder.$setPristine();
              getPurchaseOrderDetail();
              vm.isFocus = true;
              vm.checkDirty = false;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //check Validation in save button
      vm.checkValidation = (ispublish) => {
        vm.ischeckValidation = false;
        let colindex;
        vm.isfalse = false;
        let row_index = 0;
        if (vm.sourceData && (vm.sourceData.length === 0 || (_.filter(vm.sourceData, (fAssy) => fAssy.partType !== vm.OtherType)).length === 0) && ispublish) {
          vm.isfalse = true;
          vm.ischeckValidation = true;
          const obj = {
            multiple: true,
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_ORDER_STATUS_CHANGE)
          };
          DialogFactory.messageAlertDialog(obj);
          if ($scope.$parent && $scope.$parent.vm) {
            $scope.$parent.vm.isSaveDisabled = false;
          }
          return;
        }
        _.each(vm.sourceData, (item) => {
          // match total shipping with grid number of rows
          if (item.totalRelease && item.totalRelease !== item.PODetail.length && !vm.isfalse) {
            vm.isfalse = true;
            vm.ischeckValidation = true;
            colindex = row_index;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_INVALID_LINE);
            messageContent.message = stringFormat(messageContent.message, item.lineID);
            const model = {
              multiple: true,
              messageContent
            };
            DialogFactory.messageAlertDialog(model);
            if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.cellNav) {
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[colindex], vm.sourceHeader[GridOption.SUBQTY]);
            }
            if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.grid) {
              vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[colindex], vm.sourceHeader[GridOption.SUBQTY]);
            }
            if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[colindex]);
            }
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
            return false;
          }

          vm.expandindex = 0;
          let totalqty = 0;
          _.each(item.PODetail, (data, shipingindex) => {
            if (parseFloat(data.qty) < 1) {
              vm.isfalse = true;
              colindex = row_index;
              vm.expandColumn = GridOption.SUBQTY;
              if (parseFloat(data.qty) < 1) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_QUANTITY);
                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
              }
              if (vm.gridOptions && vm.gridOptions.data[row_index] && vm.gridOptions.data[row_index].subGridOptions && vm.gridOptions.data[row_index].subGridOptions.data[shipingindex]) {
                vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[row_index].subGridOptions.data[shipingindex], vm.subGridsourceHeader[GridOption.SUBQTY]);
              }
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[row_index]);
              if ($scope.$parent && $scope.$parent.vm) {
                $scope.$parent.vm.isSaveDisabled = false;
              }
              return false;
            }
            else if ((new Date(data.shippingDate)).setHours(0, 0, 0, 0) < (new Date(vm.poModel.poDate).setHours(0, 0, 0, 0))) {
              vm.isfalse = true;
              colindex = row_index;
              vm.expandColumn = GridOption.SUBDUEDATE;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DATE_VALIDATION_PO);
              messageContent.message = stringFormat(messageContent.message, 'Due Date');
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              if (vm.gridOptions && vm.gridOptions.data[row_index] && vm.gridOptions.data[row_index].subGridOptions && vm.gridOptions.data[row_index].subGridOptions.data[shipingindex]) {
                vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[row_index].subGridOptions.data[shipingindex], vm.subGridsourceHeader[GridOption.SUBDUEDATE]);
              }
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[row_index]);
              if ($scope.$parent && $scope.$parent.vm) {
                $scope.$parent.vm.isSaveDisabled = false;
              }
              return false;
            }
            else if (data.promisedShipDate && ((new Date(data.promisedShipDate)).setHours(0, 0, 0, 0) < (new Date(vm.poModel.poDate).setHours(0, 0, 0, 0)))) {
              vm.isfalse = true;
              colindex = row_index;
              vm.expandColumn = GridOption.PROMISEDDELIVERYDATE;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DATE_VALIDATION_PO);
              messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.PURCHASE_ORDER.SupplierPromisedDeliveryDate);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
              if (vm.gridOptions && vm.gridOptions.data[row_index] && vm.gridOptions.data[row_index].subGridOptions && vm.gridOptions.data[row_index].subGridOptions.data[shipingindex]) {
                vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[row_index].subGridOptions.data[shipingindex], vm.subGridsourceHeader[GridOption.PROMISEDDELIVERYDATE]);
              }
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[row_index]);
              if ($scope.$parent && $scope.$parent.vm) {
                $scope.$parent.vm.isSaveDisabled = false;
              }
              return false;
            }
            totalqty = totalqty + parseFloat(data.qty);
            vm.expandindex = vm.expandindex + 1;
          });
          if (vm.isfalse) {
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
            return false;
          }
          if (parseFloat(item.qty) !== totalqty) {
            colindex = row_index;
            vm.isfalse = true;
            vm.ischeckValidation = true;
            vm.expandindex = item.PODetail.length - 1;
            vm.expandColumn = GridOption.SUBQTY;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_QTY_VALIDATION);
            messageContent.message = stringFormat(messageContent.message, 'Qty', 'PO Qty');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            if (vm.gridOptions.data[row_index]) {
              if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
                vm.gridOptions.gridApi.expandable.collapseAllRows();
                vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[row_index]);
              }
            }
            DialogFactory.messageAlertDialog(model);
            if ($scope.$parent && $scope.$parent.vm) {
              $scope.$parent.vm.isSaveDisabled = false;
            }
            if (vm.gridOptions.data.length > 0) {
              if (vm.gridOptions.data[row_index] && vm.gridOptions.data[row_index].subGridOptions && vm.gridOptions.data[row_index].subGridOptions.data.length > 0) {
                const lastIndexOfSubGrid = vm.gridOptions.data[row_index].subGridOptions.data.length - 1;
                vm.gridOptions.gridApi.grid.validate.setInvalid(vm.gridOptions.data[row_index].subGridOptions.data[lastIndexOfSubGrid], vm.subGridsourceHeader[GridOption.SUBQTY]);
                if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
                  vm.gridOptions.gridApi.expandable.collapseAllRows();
                  vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[row_index]);
                }
                return false;
              }
            }
          }
          row_index = row_index + 1;
        });
      };
      //change status
      vm.changePurchaseOrderStatus = (item) => {
        if ((vm.CopypoModel && vm.CopypoModel.status === item.ID) || !vm.poID || vm.isDisable || vm.isReadOnly) {
          return;
        }
        vm.poModel.status = item.ID;
        if (vm.CopypoModel && !vm.CopypoModel.status && vm.poModel.status && vm.sourceData && vm.sourceData.length === 0) {
          vm.isFocus = false;
          const obj = {
            multiple: true,
            messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PURCHASE_ORDER_PUBLISH_CONFIRMATION)
          };
          DialogFactory.messageAlertDialog(obj).then(() => {
            vm.isFocus = true;
            vm.poModel.status = vm.CopypoModel.status;
          });
          return;
        } else {
          vm.checkPurchaseOrderMFR().then((response) => {
            if (response) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.USER_STATUS_RESTRICT_PO_PACKING_SLIP);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                vm.isFocus = true;
                vm.poModel.status = vm.CopypoModel.status;
                getPurchaseOrderDetail();
              });
            } else {
              vm.cgBusyLoading = PurchaseOrderFactory.checkPOLineIsClosed().query({
                refPurchaseOrderID: vm.poID
              }).$promise.then((response) => {
                if (response && response.data) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.USER_STATUS_RESTRICT_PO_LINE_MANUAL_CLOSED);
                  messageContent.message = stringFormat(messageContent.message, redirectToPOAnchorTag(vm.poID, vm.poModel.poNumber));
                  DialogFactory.messageAlertDialog({ messageContent }).then(() => {
                    vm.isFocus = true;
                    vm.poModel.status = vm.CopypoModel.status;
                    getPurchaseOrderDetail();
                  });
                }
                else {
                  vm.frmPurchaseOrder.$$controls[0].$setDirty();
                  vm.savePurchaseOrder();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          });
        }
      };

      //change release line
      vm.changeReleaseLine = () => {
        if (vm.poDetail.totalRelease !== 1 && !vm.poDetail.lineID && vm.poDetailRelease) {
          vm.poDetailRelease.shippingDate = null;
          vm.poDetailRelease.promisedShipDate = null;
        }
      };
      //set shipping date
      vm.shippingDateOptions = {
        appendToBody: true,
        shippingDateOpenFlag: false,
        minDate: vm.poModel.poDate
      };
      vm.onChangeshippingDate = () => {
        if (vm.poDetailRelease.shippingDate) {
          vm.shippingDateOptions = {
            appendToBody: true,
            shippingDateOpenFlag: false,
            minDate: vm.poModel.poDate
          };
        }
        vm.PODetForm.$dirty = true;
      };

      //set promised ship date
      vm.promisedShipDateOptions = {
        appendToBody: true,
        shippingDateOpenFlag: false,
        minDate: vm.poModel.poDate
      };
      vm.onChangeccmDate = () => {
        if (vm.poDetailRelease.promisedShipDate) {
          vm.promisedShipDateOptions = {
            appendToBody: true,
            shippingDateOpenFlag: false,
            minDate: vm.poModel.poDate
          };
        }
        vm.PODetForm.$dirty = true;
      };
      //get component po comments detail details
      const getPurchaseRequirementList = (id) => {
        if (id) {
          vm.cgBusyLoading = ComponentFactory.getPurchaseInspectionRequirementByPartId().query({
            partId: id,
            category: CORE.RequirmentCategory.PurchasingAndIncomingInspectionComments.id
          }).$promise.then((purchaseInspection) => {
            if (purchaseInspection) {
              if (!vm.poDetail.id) {
                const defaultRole = _.find(vm.loginUser.roles, (role) => role.id === vm.loginUser.defaultLoginRoleID);
                vm.poDetail.PORequirementDetail = _.filter(purchaseInspection.data, (data) => data.inspectionmst && data.inspectionmst.requiementType === 'R');
                vm.poDetail.PORequirementDetail = _.map(vm.poDetail.PORequirementDetail, (requirement) => ({
                  instruction: requirement.inspectionmst.requirement,
                  updatedby: vm.loginUser.username,
                  createdby: vm.loginUser.username,
                  createdbyRole: defaultRole ? defaultRole.name : null,
                  updatedbyRole: defaultRole ? defaultRole.name : null,
                  createdAt: BaseService.getCurrentDateTimeUI(),
                  updatedAt: BaseService.getCurrentDateTimeUI(),
                  id: null
                }));
                vm.poDetail.lineComment = _.map(_.map(_.filter(purchaseInspection.data || [], (data) => data.inspectionmst && data.inspectionmst.requiementType === 'C' ? data.inspectionmst : null), (item) => item.inspectionmst), 'requirement').join('\r');
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.purchaseInspectionList = [];
          vm.purchaseCommentList = null;
          vm.packingSlipDet.receivedStatus = vm.packingSlipReceivedStatus[0].value;
        }
      };
      //change to edit mode on click
      vm.poDetailRelease = {};

      function grid() {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['lineID', 'ASC']],
          SearchColumns: [],
          pageName: CORE.PAGENAME_CONSTANT[6].PageName
        };
        vm.gridOptions = {
          showColumnFooter: true,
          enableRowHeaderSelection: false,
          enableFullRowSelection: false,
          enableRowSelection: true,
          multiSelect: false,
          filterOptions: vm.pagingInfo.SearchColumns,
          enableCellEdit: false,
          enablePaging: false,
          enableExpandableRowHeader: true,
          expandableRowTemplate: TRANSACTION.TRANSACTION_EXPANDABLEJS,
          expandableRowHeight: 235,
          expandableRowScope: $scope,
          enableCellEditOnFocus: false,
          enableColumnMenus: false,
          exporterMenuCsv: true,
          exporterCsvFilename: 'Purchase Order Summary Detail.csv'
        };
        vm.sourceData = [];
        if (!vm.IsEdit) {
          vm.gridOptions.data = vm.sourceData;
        }
        else if (vm.IsEdit && vm.purchaseDet && vm.purchaseDet.length > 0) {
          vm.sourceData = _.clone(vm.purchaseDet);
          vm.isValidMasterData = true;
          vm.isValidChildData = true;
        }
        if (vm.sourceData.length > 0) {
          vm.sourceData[vm.sourceData.length - 1].isadd = true;
          vm.sourceData[vm.sourceData.length - 1].remove = true;
        }
        vm.sourceDataCopy = [];
        if (vm.poDetail.isLine !== 2 && vm.sourceData) {
          const maxline = _.maxBy(vm.sourceData, (item) => item.lineID);
          vm.poDetail.lineID = maxline ? maxline.lineID + 1 : 1;
          vm.poDetail.totalRelease = 1;
        }
        vm.loadData = (pagingInfo) => {
          if (vm.sourceData) {
            vm.sourceData = _.orderBy(vm.sourceData, ['lineID'], ['ASC']);
          }
          if (pagingInfo.SortColumns.length > 0) {
            const column = [];
            const sortBy = [];
            _.each(pagingInfo.SortColumns, (item) => {
              column.push(item[0]);
              sortBy.push(item[1]);
            });
            vm.sourceData = _.orderBy(vm.sourceData, column, sortBy);
          }
          if (pagingInfo.SearchColumns.length > 0) {
            if (vm.search) {
              vm.emptyState = null;
              vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
            }
            if (!vm.search) {
              vm.sourceDataCopy = _.clone(vm.sourceData);
            }
            vm.search = true;
            _.each(pagingInfo.SearchColumns, (item) => {
              vm.sourceData = $filter('filter')(vm.sourceData, { [item.ColumnName]: item.SearchString });
            });
            if (vm.sourceData.length === 0) {
              vm.emptyState = 0;
            }
          }
          else {
            vm.emptyState = null;
            if (vm.search) {
              vm.sourceData = vm.sourceDataCopy ? vm.sourceDataCopy : vm.sourceData;
              vm.search = false;
            }
          }
          vm.totalSourceDataCount = vm.sourceData.length;
          vm.currentdata = vm.totalSourceDataCount;
          vm.purchaseOrderDatacopy = _.clone(vm.sourceData);
          $timeout(() => {
            vm.resetSourceGrid();
            vm.getPurchaseOrderPriceDetails(); // to show detail of total cost in header section
            $timeout(() => {
              vm.expandableJS();
              if (vm.gridOptions && vm.gridOptions.gridApi) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }, _configTimeout);
          }, true);
        };
        vm.sourceHeader = [
          {
            field: 'isadd',
            cellClass: 'layout-align-center-center',
            displayName: 'Action',
            width: '170',
            cellTemplate: '<md-button style="opacity: 0.3;cursor: not-allowed;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="grid.appScope.$parent.vm.isDisable">' +
              '<md-icon role="img" md-font-icon="icon-pencil"></md-icon>' +
              '</md-button>' +
              '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-if="!grid.appScope.$parent.vm.isDisable" ng-click="grid.appScope.$parent.vm.EditPurchaseMasterDetail(row)">' +
              '<md-icon role="img" md-font-icon="icon-pencil"></md-icon><md-tooltip md-direction="top">Edit</md-tooltip>' +
              '</md-button>' +
              '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-click="grid.appScope.$parent.vm.EditPurchaseMasterDetail(row, true)">' +
              '<md-icon role="img" md-font-icon="icon-eye"></md-icon><md-tooltip md-direction="top">View</md-tooltip>' +
              '</md-button>' +
              '<md-button style="opacity: 0.3;cursor: not-allowed;" ng-if="row.entity.partType===grid.appScope.$parent.vm.OtherType"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn">' +
              '<md-icon role="img" md-font-icon="icons-other-charges"></md-icon>' +
              '</md-button>' +
              '<md-button ng-if="row.entity.partType!==grid.appScope.$parent.vm.OtherType" ng-disabled="grid.appScope.$parent.vm.isLineOtherChargePopupOpen" ng-class="{\'other-charges-icon-color\':row.entity.POOtherDetail.length>0}"  class="md-primary grid-button md-icon-button bdrbtn cm-sq-btn" ng-click="grid.appScope.$parent.vm.gotoPurchaseOrderOtherCharges(row, $event)">' +
              '<md-icon role="img" md-font-icon="icons-other-charges"></md-icon><md-tooltip md-direction="top" ng-if="!grid.appScope.$parent.vm.isLineOtherChargePopupOpen">View Other Charges</md-tooltip>' +
              '</md-button>' +
              '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-class="{\'other-charges-icon-color\':row.entity.PORequirementDetail.length>0}" ng-disabled="grid.appScope.$parent.vm.isLineRequirementPopupOpen" ng-click="grid.appScope.$parent.vm.ViewPurchaseOrderRequireComment(row.entity, $event)">' +
              '<md-icon role="img" md-font-icon="icons-requirement"></md-icon><md-tooltip md-direction="top" ng-if="!grid.appScope.$parent.vm.isLineRequirementPopupOpen">View Purchase Order Material Purchase Requirements & Comments Detail</md-tooltip>' +
              '</md-button>' +
              '<md-button  style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color"  ng-if="!grid.appScope.$parent.vm.allowCompletePurchaseOrder||!row.entity.id||grid.appScope.$parent.vm.isDisable || !grid.appScope.$parent.vm.poModel.status  || row.entity.poLineWorkingStatus!==grid.appScope.$parent.vm.POLineWorkingStatus.Open.id">' +
              '<md-icon role="img" md-font-icon="icon-check-bookmark"></md-icon>' +
              '</md-button>' +
              '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color" ng-disabled="grid.appScope.$parent.vm.isManualCompleteLinePopupOpen" ng-if="grid.appScope.$parent.vm.allowCompletePurchaseOrder && !grid.appScope.$parent.vm.isDisable && row.entity.id && grid.appScope.$parent.vm.poModel.status && row.entity.poLineWorkingStatus===grid.appScope.$parent.vm.POLineWorkingStatus.Open.id" ng-click="grid.appScope.$parent.vm.CompletePOLine(row,$event)">' +
              '<md-icon role="img" md-font-icon="icon-check-bookmark"></md-icon><md-tooltip md-direction="top" ng-if="!grid.appScope.$parent.vm.isManualCompleteLinePopupOpen">Complete PO Line</md-tooltip>' +
              '</md-button>' +
              '<md-button style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color"  ng-if="!(grid.appScope.$parent.vm.AllowToOpenPurchaseOrderManually && row.entity.id && grid.appScope.$parent.vm.poModel.status && row.entity.poLineWorkingStatus === grid.appScope.$parent.vm.POLineWorkingStatus.Close.id && grid.appScope.$parent.vm.poModel.lockStatus !== grid.appScope.$parent.vm.Transaction.PurchaseOrderLockStatus.Locked.id)">' +
              '<md-icon role="img" md-font-icon="t-icons-open"></md-icon>' +
              '</md-button>' +
              '<md-button class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color" ng-disabled="grid.appScope.$parent.vm.isManualCompleteLinePopupOpen" ng-if="grid.appScope.$parent.vm.AllowToOpenPurchaseOrderManually && row.entity.id && grid.appScope.$parent.vm.poModel.status && row.entity.poLineWorkingStatus === grid.appScope.$parent.vm.POLineWorkingStatus.Close.id && grid.appScope.$parent.vm.poModel.lockStatus !== grid.appScope.$parent.vm.Transaction.PurchaseOrderLockStatus.Locked.id" ng-click="grid.appScope.$parent.vm.CompletePOLine(row,$event,true)">' +
              '<md-icon role="img" md-font-icon="t-icons-open"></md-icon><md-tooltip md-direction="top" ng-if="!grid.appScope.$parent.vm.isManualCompleteLinePopupOpen">Open PO Line</md-tooltip>' +
              '</md-button>',
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            pinnedLeft: true,
            maxWidth: '200'
          },
          {
            field: 'lineID',
            displayName: vm.LabelConstant.PURCHASE_ORDER.POLineID,
            width: '100',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><span><b>{{COL_FIELD}}</b></span></div>',
            enableFiltering: true,
            enableSorting: true,
            enableCellEdit: false,
            maxWidth: '200'
          },
          {
            field: 'internalRef',
            displayName: 'Internal Ref#',
            width: '150',
            cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD}}</span></div>',
            enableFiltering: true,
            enableSorting: true,
            enableCellEdit: false,
            maxWidth: '200'
          },
          {
            field: 'PIDCode',
            displayName: vm.LabelConstant.MFG.PID,
            cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents"> \
                                        <common-pid-code-label-link \
                                            ng-if= "row.entity.PIDCode" \
                                            component-id="row.entity.partID" \
                                            label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                            value="COL_FIELD" \
                                            is-custom-part="row.entity.isCustom" \
                                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon" \
                                            is-copy="row.entity.partID ? true : false" \
                                            is-search-digi-key="false"\
                                            cust-part-number="row.entity.custAssyPN" \
                                            is-search-findchip="false" \
                                            rohs-status="row.entity.rohsName" > \
                                        </common-pid-code-label-link > \
                                    </div > ',
            width: CORE.UI_GRID_COLUMN_WIDTH.PID,
            maxWidth: '350',
            cellTooltip: true
          },
          {
            field: 'mfgName',
            displayName: vm.LabelConstant.MFG.MFG,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManufacturerDetail(row.entity.mfgCodeID);$event.preventDefault();">{{row.entity.mfgName}}</a>\
                            <copy-text label="\'MFR\'" text="row.entity.mfgName" ng-if="row.entity.mfgName"></copy-text></div>',
            width: '250',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            maxWidth: '300'
          },
          {
            field: 'mfgPN',
            displayName: vm.LabelConstant.MFG.MFGPN,
            cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden; padding:0px !important">\
                                            <common-pid-code-label-link  ng-if="row.entity.PIDCode" component-id="row.entity.partID"\
                                                            label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                                            value="COL_FIELD"\
                                                            is-custom-part="row.entity.isCustom || row.entity.partType===grid.appScope.$parent.vm.OtherType" \
                                                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                                            is-copy="row.entity.partID ? true : false"\
                                                            cust-part-number="row.entity.custAssyPN"\
                                                            rohs-status="row.entity.rohsName"\
                                                            supplier-name="(row.entity.isCustom) ? null : (grid.appScope.$parent.vm.poModel && grid.appScope.$parent.vm.poModel.mfgName ? grid.appScope.$parent.vm.poModel.mfgName : null)" \
                                                            is-search-findchip="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            maxWidth: '300'
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
              options: CORE.CustomerConsignedDropDown
            },
            ColumnDataType: 'StringEquals',
            enableFiltering: true,
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
                                    </span>\
                                    <copy-text label="\'Customer\'" text="row.entity.customerName"></copy-text></div>',
            width: '300',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true
          },
          {
            field: 'partDescription',
            displayName: 'Description',
            cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.partDescription || grid.appScope.$parent.vm.isDisabledPartDescriptionIcon" ng-click="grid.appScope.$parent.vm.showPartDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
            width: '120',
            enableCellEdit: false,
            enableFiltering: false,
            enableSorting: false,
            maxWidth: '300'
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
            field: 'supplierPN',
            displayName: vm.LabelConstant.MFG.SupplierPN,
            cellTemplate: '<div class="ui-grid-cell-contents text-left" style="width:100%; float:left; overflow:hidden; padding:0px !important">\
                                            <common-pid-code-label-link  ng-if="row.entity.supplierPID" component-id="row.entity.supplierMfgPNID"\
                                                            label="grid.appScope.$parent.vm.LabelConstant.MFG.SupplierPN"\
                                                            value="COL_FIELD"\
                                                            is-supplier="true"\
                                                            is-custom-part="row.entity.supplierisCustom" \
                                                            cust-part-number="row.entity.custAssyPN"\
                                                            rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.supplierroHSIcon"\
                                                            is-copy="row.entity.supplierMfgPNID ? true : false"\
                                                            rohs-status="row.entity.supplierroHSName"\
                                                            is-search-findchip="true"></common-pid-code-label-link></div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            maxWidth: '300'
          },
          {
            field: 'uom',
            displayName: 'UOM',
            cellTemplate: '<div class="ui-grid-cell-contents text-left"  style="padding:0px !important">{{COL_FIELD}}</div>',
            width: '100',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            maxWidth: '100'
          },
          {
            field: 'qty',
            displayName: 'PO Qty',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '80',
            type: 'number',
            validators: { required: true },
            maxWidth: '150'
          },
          {
            field: 'price',
            displayName: 'Price ($)',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | unitPrice}}</div>',
            width: '150',
            maxWidth: '200',
            footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getPriceFooterTotal()}}</div>'
          },
          {
            field: 'extPrice',
            displayName: 'Ext. Price ($) (A)',
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
            field: 'otherCharges',
            displayName: 'Total Other Charges Price ($) (B)',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{(COL_FIELD || 0) | amount }}</div>',
            footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getOtherFooterTotal()}}</div>',
            enableCellEdit: false,
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            enableFiltering: true,
            enableSorting: true,
            width: '120',
            maxWidth: '175'
          },
          {
            field: 'totalextPrice',
            displayName: 'Total Ext. Price ($) (A+B)',
            treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="COL_FIELD">{{COL_FIELD | amount }}</div><div class="ui-grid-cell-contents grid-cell-text-right" ng-if="!COL_FIELD">${{COL_FIELD | numberWithoutDecimal}}</div>',
            footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer text-right" >{{grid.appScope.$parent.vm.getFooterTotal(true)}}</div>',
            enableCellEdit: false,
            enableFiltering: true,
            enableSorting: true,
            width: '150',
            maxWidth: '175'
          },
          {
            field: 'lineComment',
            displayName: 'Line Comment',
            cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.lineComment || grid.appScope.$parent.vm.isDisabledLineCommentsIcon" ng-click="grid.appScope.$parent.vm.showDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
            width: '90',
            maxWidth: '250',
            enableFiltering: false,
            enableSorting: false
          },
          {
            field: 'internalLineComment',
            displayName: 'Line Internal Notes',
            cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.internalLineComment || grid.appScope.$parent.vm.isDisabledInternalNotesIcon" ng-click="grid.appScope.$parent.vm.showInternalDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
            width: '90',
            maxWidth: '250',
            enableFiltering: false,
            enableSorting: false
          },
          {
            field: 'totalRelease',
            displayName: 'Total Releases',
            type: 'number',
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ng-disabled="row.entity.isdisable || row.entity.isCancle" style="padding:0px !important">{{(COL_FIELD || 1) | numberWithoutDecimal}}</div>',
            width: '80',
            enableFiltering: false,
            enableSorting: false,
            validators: { required: true },
            maxWidth: '160'
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
            field: 'poLineWorkingStatusDisplay',
            displayName: 'PO Line Working Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
              + '<span  ng-class="{\'label-box label-warning\':(row.entity.poLineWorkingStatus==grid.appScope.$parent.vm.POLineWorkingStatus.Open.id),\
                        \'label-box label-success\':(row.entity.poLineWorkingStatus==grid.appScope.$parent.vm.POLineWorkingStatus.Close.id)}"> \
                            {{COL_FIELD}}'
              + '</span>'
              + '</div>',
            width: '120'
          },
          {
            field: 'receivedQty',
            displayName: vm.LabelConstant.PURCHASE_ORDER.ReceivedQty,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title = "{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" >\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-if="row.entity.receivedQty > 0" ng-click="grid.appScope.$parent.vm.showPackingSlipSummaryDetails(row.entity);$event.preventDefault();">{{ COL_FIELD | numberWithoutDecimal}}</a>\
                                        <span ng-if="row.entity.receivedQty <= 0">{{ COL_FIELD | numberWithoutDecimal}}</span> \
                                    </div>',
            width: '120'
          },
          {
            field: 'pendingQty',
            displayName: vm.LabelConstant.PURCHASE_ORDER.OpenQty,
            cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
            width: '120'
          },
          {
            field: 'remove',
            cellClass: 'layout-align-center-center',
            displayName: 'Delete',
            width: '120',
            cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
            enableFiltering: false,
            enableSorting: false,
            enableCellEdit: false,
            exporterSuppressExport: true,
            maxWidth: '130'
          }
        ];
      }
      /*
       * Author :  Champak Chaudhary
       * Purpose : ui grid expandable
       */
      vm.isHideDelete = true;
      vm.isSalesDelete = true;
      vm.expandableJS = () => {
        if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
          vm.gridOptions.gridApi.expandable.on.rowExpandedStateChanged($scope, (row) => {
            $scope.parentrow = row.entity;
            if (row.isExpanded) {
              vm.subGridpagingInfo = {
                Page: CORE.UIGrid.Page(),
                SortColumns: [],
                SearchColumns: []
              };

              vm.subGridgridOptions = {
                showColumnFooter: false,
                enableRowHeaderSelection: false,
                enableFullRowSelection: true,
                enableRowSelection: false,
                multiSelect: false,
                filterOptions: vm.subGridpagingInfo.SearchColumns,
                enableCellEdit: false,
                enablePaging: false,
                enableExpandableRowHeader: false,
                enableGridMenu: false,
                enableCellEditOnFocus: true,
                appScopeProvider: $scope,
                enableCellSelection: true,
                allowCellFocus: true,
                hideMultiDeleteButton: true
              };


              vm.subGridsourceHeader = [
                {

                  field: 'isadd',
                  cellClass: 'layout-align-center-center',
                  displayName: 'Action',
                  width: '130',
                  cellTemplate: '<md-button  style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn"  ng-if="grid.appScope.vm.isDisable">' +
                    '<md-icon role="img" md-font-icon="icon-pencil"></md-icon>' +
                    '</md-button>' +
                    '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-if="!grid.appScope.vm.isDisable" ng-click="grid.appScope.vm.EditSalesChildDetail(row)">' +
                    '<md-icon role="img" md-font-icon="icon-pencil"></md-icon><md-tooltip md-direction="top">Edit</md-tooltip>' +
                    '</md-button>' +
                    '<md-button  class="md-primary grid-button md-icon-button bdrbtn" ng-click="grid.appScope.vm.EditSalesChildDetail(row, true)">' +
                    '<md-icon role="img" md-font-icon="icon-eye"></md-icon><md-tooltip md-direction="top">View</md-tooltip>' +
                    '</md-button>' +
                    '<md-button  style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color"  ng-if="!grid.appScope.vm.allowCompletePurchaseOrder || !grid.appScope.vm.poModel.status || !row.entity.id||grid.appScope.vm.isDisable || row.entity.poLineWorkingStatus!==grid.appScope.vm.POLineWorkingStatus.Open.id">' +
                    '<md-icon role="img" md-font-icon="icon-check-bookmark"></md-icon>' +
                    '</md-button>' +
                    '<md-button  class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color" ng-disabled="grid.appScope.vm.isManualCompleteReleaseLinePopupOpen" ng-if="grid.appScope.vm.allowCompletePurchaseOrder && grid.appScope.vm.poModel.status && !grid.appScope.vm.isDisable && row.entity.id && row.entity.poLineWorkingStatus===grid.appScope.vm.POLineWorkingStatus.Open.id" ng-click="grid.appScope.vm.CompletePOReleaseLine(row,$event)">' +
                    '<md-icon role="img" md-font-icon="icon-check-bookmark"></md-icon><md-tooltip md-direction="top" ng-if="!grid.appScope.vm.isManualCompleteReleaseLinePopupOpen">Complete PO Release Line</md-tooltip>' +
                    '</md-button>' +
                    '<md-button style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color"  ng-if="!(grid.appScope.vm.AllowToOpenPurchaseOrderManually && row.entity.id && grid.appScope.vm.poModel.status && row.entity.poLineWorkingStatus === grid.appScope.vm.POLineWorkingStatus.Close.id && grid.appScope.vm.poModel.lockStatus !== grid.appScope.vm.Transaction.PurchaseOrderLockStatus.Locked.id)">' +
                    '<md-icon role="img" md-font-icon="t-icons-open"></md-icon>' +
                    '</md-button>' +
                    '<md-button class="md-primary grid-button md-icon-button bdrbtn cm-feture-btn-color" ng-disabled="grid.appScope.vm.isManualCompleteReleaseLinePopupOpen" ng-if="grid.appScope.vm.AllowToOpenPurchaseOrderManually && row.entity.id && grid.appScope.vm.poModel.status && row.entity.poLineWorkingStatus === grid.appScope.vm.POLineWorkingStatus.Close.id && grid.appScope.vm.poModel.lockStatus !== grid.appScope.vm.Transaction.PurchaseOrderLockStatus.Locked.id" ng-click="grid.appScope.vm.CompletePOReleaseLine(row,$event,true)">' +
                    '<md-icon role="img" md-font-icon="t-icons-open"></md-icon><md-tooltip md-direction="top" ng-if="!grid.appScope.vm.isManualCompleteReleaseLinePopupOpen">Open PO Release Line</md-tooltip>' +
                    '</md-button>',
                  enableSorting: false,
                  enableCellEdit: false
                },
                {
                  field: 'releaseNumber',
                  width: '100',
                  displayName: 'Release#',
                  cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><span><b>{{COL_FIELD}}</b></span></div>',
                  enableSorting: false,
                  enableCellEdit: false
                },
                {
                  field: 'qty',
                  displayName: 'Qty',
                  width: '100',
                  type: 'number',
                  validators: { required: true },
                  cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | numberWithoutDecimal}}</div>'
                },
                {
                  field: 'shippingDate',
                  displayName: 'Due Date',
                  width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                  type: 'date',
                  cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                  validators: { required: true },
                  cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>'
                },
                {
                  field: 'promisedShipDate',
                  displayName: vm.LabelConstant.PURCHASE_ORDER.SupplierPromisedDeliveryDate,
                  width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
                  type: 'date',
                  cellFilter: 'date:' + vm.DefaultDateFormat.toUpperCase(),
                  validators: { required: true },
                  cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD | date : grid.appScope.vm.DefaultDateFormat }}</div>'
                },
                {
                  field: 'shippingAddress',
                  displayName: vm.LabelConstant.Address.ShippingAddress,
                  cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.shippingAddress || grid.appScope.vm.isDisabledShippingAddressIcon" ng-click="grid.appScope.vm.showShippingAddressPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
                  width: '110'
                },
                {
                  field: 'shippingMethodCode',
                  width: '160',
                  displayName: 'Shipping Method',
                  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
                },
                {
                  field: 'carrierCode',
                  width: '160',
                  displayName: 'Carrier',
                  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
                },
                {
                  field: 'carrierAccountNumber',
                  width: '160',
                  displayName: 'Carrier Account#',
                  cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
                },
                {
                  field: 'releaseNotes',
                  displayName: 'Release Notes',
                  cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.releaseNotes || grid.appScope.vm.isDisabledReleaseNotesIcon" ng-click="grid.appScope.vm.showReleasePartDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
                  width: '100'
                },
                {
                  field: 'additionalNotes',
                  displayName: 'Additional Notes',
                  cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.additionalNotes || grid.appScope.vm.isDisabledAdditionalNotesIcon" ng-click="grid.appScope.vm.showAdditionalPartDescriptionPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
                  width: '120'
                },
                {
                  field: 'poLineWorkingStatusDisplay',
                  displayName: 'PO Release Working Status',
                  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span  ng-class="{\'label-box label-warning\':(row.entity.poLineWorkingStatus==grid.appScope.vm.POLineWorkingStatus.Open.id),\
                                            \'label-box label-success\':(row.entity.poLineWorkingStatus==grid.appScope.vm.POLineWorkingStatus.Close.id)}"> \
                            {{COL_FIELD}}'
                    + '</span>'
                    + '</div>',
                  width: '120'
                },
                {
                  field: 'poLineCompleteTypeLabel',
                  displayName: 'PO Release Completion Type',
                  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span  ng-class="{\'label-box label-warning\':(row.entity.poLineCompleteType === grid.appScope.vm.POCompleteType.OPEN),\
                        \'label-box label-primary\':(row.entity.poLineCompleteType === grid.appScope.vm.POCompleteType.MANUAL), \
                        \'label-box label-success\':(row.entity.poLineCompleteType === grid.appScope.vm.POCompleteType.AUTO)}"> \
                            {{COL_FIELD}}'
                    + '</span>'
                    + '</div>',
                  width: '165'
                },
                {
                  field: 'poLineCompleteReason',
                  displayName: 'PO Release Completion Reason',
                  cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="!row.entity.poLineCompleteReason || grid.appScope.vm.isDisabledLineCompleteReasonIcon" ng-click="grid.appScope.vm.showPOCompleteReasonPopUp(row.entity, $event)"> \
                                View \
                            </md-button>',
                  width: '150'
                },
                {
                  field: 'receivedQty',
                  displayName: vm.LabelConstant.PURCHASE_ORDER.ReceivedQty,
                  cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title = "{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" >\
                                        <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-if="row.entity.receivedQty > 0" ng-click="grid.appScope.vm.showPackingSlipSummaryDetails(row.entity, row.entity.id);$event.preventDefault();">{{ COL_FIELD | numberWithoutDecimal}}</a>\
                                        <span ng-if="row.entity.receivedQty <= 0">{{ COL_FIELD | numberWithoutDecimal}}</span> \
                                    </div>',
                  width: '120'
                },
                {
                  field: 'pendingQty',
                  displayName: vm.LabelConstant.PURCHASE_ORDER.OpenQty,
                  cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
                  width: '120'
                },
                {
                  field: 'remove',
                  cellClass: 'layout-align-center-center',
                  displayName: 'Delete',
                  width: '100',
                  cellTemplate: '<md-button style="opacity: 0.3;"  class="md-primary grid-button md-icon-button bdrbtn" ng-if="grid.appScope.vm.isDisable || row.entity.poLineWorkingStatus!==grid.appScope.vm.POLineWorkingStatus.Open.id" >' +
                    '<md-icon role="img" md-font-icon="icon-trash"></md-icon>' +
                    '</md-button>' +
                    '<md-button ng-if="!grid.appScope.vm.isDisable && row.entity.poLineWorkingStatus===grid.appScope.vm.POLineWorkingStatus.Open.id"  class="md-primary grid-button md-icon-button bdrbtn" ng-disabled="grid.appScope.vm.isdisabledDeleteIcon" ng-click="grid.appScope.removeRow(row)">' +
                    '<md-icon role="img" md-font-icon="icon-trash"></md-icon><md-tooltip md-direction="top">Delete</md-tooltip>' +
                    '</md-button>',
                  enableSorting: false,
                  enableCellEdit: false,
                  allowCellFocus: false
                }
              ];
              vm.subGridgridOptions.columnDefs = vm.subGridsourceHeader;
              vm.subGridgridOptions.data = row.entity.PODetail;
              vm.isValidChildData = true;
              vm.subGridgridOptions.onRegisterApi = function (gridApi) {
                vm.gridApi = gridApi;
                $timeout(() => {
                  if (!vm.isfalse) {
                    if (!vm.poID) {
                      vm.gridApi.cellNav.scrollToFocus(row.entity.subGridOptions.data[0], row.entity.subGridOptions.columnDefs[GridOption.SUBQTY]);
                    }
                  }
                  else {
                    vm.gridApi.cellNav.scrollToFocus(row.entity.subGridOptions.data[vm.expandindex ? vm.expandindex : 0], row.entity.subGridOptions.columnDefs[vm.expandColumn ? vm.expandColumn : GridOption.SUBQTY]);
                    vm.isfalse = false;
                  }
                }, true);
              };
              row.entity.subGridOptions = vm.subGridgridOptions;
            }
          });
        }
      };
      vm.changePrice = () => {
        if (vm.poDetail && (vm.poDetail.qty || vm.poDetail.qty === 0) && (vm.poDetail.price || vm.poDetail.price === 0)) {
          vm.poDetail.extPrice = multipleUnitValue(vm.poDetail.qty, vm.poDetail.price);
          vm.poDetail.extPriceDisplay = $filter('amount')(vm.poDetail.extPrice);
        } else {
          vm.poDetail.extPrice = null;
          vm.poDetail.extPriceDisplay = null;
        }
        vm.poDetail.pendingQty = (vm.poDetail.qty - ((vm.totalReceiveQty) || 0)) < 0 ? 0 : vm.poDetail.qty - ((vm.totalReceiveQty) || 0);
        vm.poDetail.receivedQty = vm.totalReceiveQty || 0;
      };
      //save purchase order detail
      vm.addpoDetail = (ev) => {
        if (BaseService.focusRequiredField(vm.PODetForm) || vm.isDisable || !vm.autoCompleteSupplierMfgCode.keyColumnId || vm.isView || vm.addPODetailBtnDisabled) {
          return;
        }
        vm.addPODetailBtnDisabled = true;
        if (vm.PODetForm.$valid) {
          if (vm.poDetail.isLine === 1 || vm.poDetail.isLine === 3) {
            if (vm.PODetForm.lineID && vm.PODetForm.lineID.$dirty) {
              return;
            }
            if (vm.poDetail.isLine === 3) {
              vm.poDetail.partID = vm.autocompleteOtherCharges.keyColumnId;
              vm.poDetail.totalextPrice = vm.poDetail.extPrice;
              vm.poDetail.otherCharges = 0;
            }
            const qty = Math.max((Math.ceil((vm.poDetail.qty) / vm.poDetail.mult) * vm.poDetail.mult), vm.poDetail.minimum);
            if (vm.poDetail.packagingID === TRANSACTION.TAPEANDREELID && (vm.poDetail.qty % qty) !== 0) {
              // message for Minimum
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_RELEASE_LINE_QTY_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, vm.poDetail.minimum, vm.poDetail.mult, vm.poDetail.supplierPN || 'Create New SPN');
              const buttonsList = [
                { name: CORE.MESSAGE_CONSTANT.UPDATE_PART, isDisabled: !vm.poDetail.supplierPN },
                { name: CORE.MESSAGE_CONSTANT.ADD_PART },
                { name: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT },
                { name: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT }
              ];

              const data = {
                messageContent: messageContent,
                buttonsList: buttonsList,
                buttonIndexForFocus: 3
              };
              DialogFactory.dialogService(
                CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
                CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
                ev,
                data).then(() => vm.addPODetailBtnDisabled = false, (response) => {
                  if (response === buttonsList[0].name) {
                    BaseService.goToSupplierPartDetails(vm.poDetail.supplierMfgPNID);
                    setFocus('qty');
                    vm.addPODetailBtnDisabled = false;
                  } else if (response === buttonsList[1].name) {
                    BaseService.goToSupplierPartDetails();
                    setFocus('qty');
                    vm.addPODetailBtnDisabled = false;
                  } else if (response === buttonsList[2].name) {
                    setFocus('qty');
                    vm.addPODetailBtnDisabled = false;
                  } else if (response === buttonsList[3].name) {
                    saveMasterPurchaseDetail(ev);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
            } else {
              saveMasterPurchaseDetail(ev);
            }
          }
          else if (vm.poDetail.isLine === 2) {
            if (vm.disabledPODetailReleaseFields) {
              vm.poDetailRelease.PIDCode = vm.disabledPODetailReleaseFields.PIDCode;
              vm.poDetailRelease.partDescription = vm.disabledPODetailReleaseFields.partDescription;
              vm.poDetailRelease.poqty = vm.disabledPODetailReleaseFields.poqty;
              vm.poDetailRelease.minimum = vm.disabledPODetailReleaseFields.minimum;
              vm.poDetailRelease.totalRelease = vm.disabledPODetailReleaseFields.totalRelease;
              vm.poDetailRelease.packagingName = vm.disabledPODetailReleaseFields.packagingName;
              vm.poDetailRelease.releaseNumber = vm.disabledPODetailReleaseFields.releaseNumber;
            }
            if (vm.autoCompleteSalesAddress && !vm.autoCompleteSalesAddress.keyColumnId) {
              vm.autoCompleteSalesContactPerson.keyColumnId = null;
            }
            if (vm.poDetailRelease.packagingID === TRANSACTION.TAPEANDREELID && (vm.poDetailRelease.qty % vm.poDetailRelease.mult) !== 0) {
              // message for tape and reel
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RELEASE_LINE_QTY_MISMATCH_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, vm.poDetailRelease.minimum, vm.poDetailRelease.mult);
              const objs = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(objs).then((yes) => {
                if (yes) {
                  saveChildPurchaseDetail();
                }
              }, () => {
                setFocus('purchaseqty');
                vm.addPODetailBtnDisabled = false;
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              saveChildPurchaseDetail();
            }
          }
        }
        else {
          vm.addPODetailBtnDisabled = false;
          BaseService.focusRequiredField(vm.PODetForm);
          return;
        }
      };
      //master detail purchase order
      const saveMasterPurchaseDetail = (ev) => {
        vm.checkDirty = true;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
        vm.copypoDetail = null;
        vm.copypoDetailRelease = null;
        if (((vm.poDetail.isNonUMIDStock && !vm.poDetail.id) || (vm.poDetail.isNonUMIDStock && vm.copyPODetail && !vm.copyPODetail.isNonUMIDStock)) && !vm.poModel.isNonUMIDStock) {
          const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ADDING_AS_NON_UMID_STOCK;
          return DialogFactory.messageConfirmDialog({
            messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          }).then(() => addPOLineDetailsonGrid(ev), () => vm.addPODetailBtnDisabled = false);
        } else {
          addPOLineDetailsonGrid(ev);
        }
      };

      const addPOLineDetailsonGrid = (ev) => {
        if (!vm.updateMatsterDetail && vm.poDetail.PORequirementDetail && vm.poDetail.PORequirementDetail.length > 0) {
          vm.ViewPurchaseOrderRequireComment(vm.poDetail, ev);
          vm.addNewParentRow(_.clone(vm.poDetail), true);
        } else {
          vm.addNewParentRow(_.clone(vm.poDetail));
          if (!vm.poID) {
            vm.resetDetail();
          }
        }
      };
      //child detail purchase order
      const saveChildPurchaseDetail = () => {
        vm.addPODetailBtnDisabled = false;
        vm.checkDirty = true;
        // Static code to enable save button
        vm.frmPurchaseOrder.$$controls[0].$setDirty();
        vm.addNewRow(vm.poDetailRelease);
        vm.resetDetail();
      };
      vm.resetDetail = (isnotsetFocus, isreset) => {
        vm.isFocus = false;
        vm.isautoFocus = false;
        vm.totalReceiveQty = 0;
        vm.addPODetailBtnDisabled = vm.islineStatusCompleted = false;
        vm.IsEditReleaseLine = false;
        vm.updateMatsterDetail = false;
        if (vm.poDetail.isLine === 1 || vm.poDetail.isLine === 3) {
          vm.poDetailRelease = {};
          vm.autoCompleteMfgCode.keyColumnId = null;
          vm.autoCompleteSupplierCode.keyColumnId = null;
          vm.autoPackaging.keyColumnId = null;
          vm.autoCompleteRohsStatus.keyColumnId = null;
          vm.autoCompleteLineCustomer.keyColumnId = null;
          vm.autocompleteOtherCharges.keyColumnId = null;
          vm.autocompletePIDOtherCharges.keyColumnId = null;
          if (vm.autoCompleteMfgCode && vm.autoCompleteMfgCode.inputName) {
            $scope.$broadcast(vm.autoCompleteMfgCode.inputName, null);
          }
          if (vm.autoCompleteSupplierCode && vm.autoCompleteSupplierCode.inputName) {
            $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, null);
          }
          if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
            $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
          }
        }
        else if (vm.poDetail.isLine === 2) {
          vm.poDetailRelease = {};
          vm.autoCompleteSalesShipping.keyColumnId = null;
          vm.autoCompletelineCarriers.keyColumnId = null;
          vm.autoCompleteSalesAddress.keyColumnId = null;
        }
        if (isreset) {
          vm.poDetailRelease = {};
        }
        if (!isnotsetFocus) {
          if (vm.poDetail.isLine === 1 || vm.poDetail.isLine === 3) {
            vm.isFocus = true;
          } else {
            setFocus('lineID');
          }
        }
        $timeout(() => resetPODetForm());
      };
      //reset purchase order detail form
      function resetPODetForm() {
        if (vm.PODetForm) {
          vm.isautoFocus = true;
          vm.poDetail = { isLine: vm.poDetail.isLine };
          if (vm.poDetail.isLine !== 2 && vm.sourceData) {
            const maxline = _.maxBy(vm.sourceData, (item) => item.lineID);
            vm.poDetail.lineID = maxline ? maxline.lineID + 1 : 1;
            vm.poDetail.totalRelease = 1;
          }
          vm.shippingDateOptions = null;
          vm.promisedShipDateOptions = null;
          vm.shippingDateOptions = {
            appendToBody: true,
            shippingDateOpenFlag: false,
            minDate: vm.poModel.poDate
          };
          //set promised ship date
          vm.promisedShipDateOptions = {
            appendToBody: true,
            shippingDateOpenFlag: false,
            minDate: vm.poModel.poDate
          };
          vm.PODetForm.$setPristine();
          vm.PODetForm.$setUntouched();
          vm.PODetForm.$invalid = false;
          vm.PODetForm.$valid = true;
          $timeout(() => vm.isView = false);
        }
      }
      //Add new row in parent ui grid
      vm.addNewParentRow = (obj, isreset) => {
        vm.addPODetailBtnDisabled = false;
        obj.price = parseFloat(obj.price);
        obj.isLineCustConsigned = vm.poModel.isCustConsigned ? vm.poModel.isCustConsigned : obj.isLineCustConsigned;
        obj.isLineCustConsignedValue = obj.isLineCustConsigned ? 'Yes' : 'No';
        obj.lineCustomerID = obj.isLineCustConsigned ? obj.lineCustomerID : null;
        obj.isNonUMIDStock = vm.poModel.isNonUMIDStock ? vm.poModel.isNonUMIDStock : obj.isNonUMIDStock;
        obj.isNonUMIDStockValue = obj.isNonUMIDStock ? 'Yes' : 'No';
        obj.price = obj.isLineCustConsigned ? 0 : obj.price;
        obj.pcbPerArray = vm.disabledPoDetailsFields.pcbPerArray;
        if (vm.poDetailRelease) {
          vm.poDetailRelease.shippingDate = obj.totalRelease !== 1 ? null : vm.poDetailRelease.shippingDate;
          vm.poDetailRelease.promisedShipDate = obj.totalRelease !== 1 ? null : vm.poDetailRelease.promisedShipDate;
        }
        let objIndex = -1;
        if (!vm.poID) {
          let objPurchaseMaster = _.find(vm.sourceData, (sales) => parseInt(sales.lineID) === parseInt(obj.lineID));
          const copyobjPurchaseMaster = _.clone(objPurchaseMaster);
          if (objPurchaseMaster) {
            const index = _.indexOf(vm.sourceData, objPurchaseMaster);
            vm.sourceData.splice(index, 1);
            objPurchaseMaster = obj;
            if (objPurchaseMaster.totalRelease === 1) {
              objPurchaseMaster.PODetail = [];
              const shipObj = {
                PIDCode: objPurchaseMaster.PIDCode,
                lineID: objPurchaseMaster.lineID,
                poqty: objPurchaseMaster.qty,
                promisedShipDate: vm.poDetailRelease ? vm.poDetailRelease.promisedShipDate : null,
                qty: objPurchaseMaster.qty,
                releaseNumber: 1,
                poLineWorkingStatus: vm.POLineWorkingStatus.Open.id,
                poLineWorkingStatusDisplay: BaseService.getPOLineWorkingStatus(vm.POLineWorkingStatus.Open.id),
                receivedQty: 0,
                partDescription: objPurchaseMaster.partDescription,
                shippingDate: vm.poDetailRelease ? vm.poDetailRelease.shippingDate : null,
                totalRelease: objPurchaseMaster.totalRelease,
                parent: objPurchaseMaster,
                shipping_index: 0
              };
              objPurchaseMaster.PODetail.push(shipObj);
              vm.poDetailRelease = {};
            } else {
              if (objPurchaseMaster.totalRelease === 1 && objPurchaseMaster.PODetail && objPurchaseMaster.PODetail.length === 1) {
                copyobjPurchaseMaster.PODetail[0].poqty = objPurchaseMaster.qty;
                copyobjPurchaseMaster.PODetail[0].qty = objPurchaseMaster.qty;
                copyobjPurchaseMaster.PODetail[0].promisedShipDate = vm.poDetailRelease ? vm.poDetailRelease.promisedShipDate : null;
                copyobjPurchaseMaster.PODetail[0].shippingDate = vm.poDetailRelease ? vm.poDetailRelease.shippingDate : null;
                objPurchaseMaster.PODetail = copyobjPurchaseMaster.PODetail;
              } else {
                objPurchaseMaster.PODetail = copyobjPurchaseMaster.PODetail;
              }
            }
            const otherChargeTotal = (_.sumBy(objPurchaseMaster.POOtherDetail, (o) => (o.qty * o.price)) || 0);
            objPurchaseMaster.totalextPrice = (objPurchaseMaster.qty * objPurchaseMaster.price) + otherChargeTotal;
            vm.sourceData.splice(index, 0, objPurchaseMaster);
            vm.sourceData = _.orderBy(vm.sourceData, ['lineID'], ['asc']);
            objIndex = _.indexOf(vm.sourceData, objPurchaseMaster);
          } else {
            obj.PODetail = [];
            obj.POOtherDetail = [];
            obj.otherCharges = 0;
            const otherChargeTotal = (_.sumBy(obj.POOtherDetail, (o) => (o.qty * o.price)) || 0);
            obj.totalextPrice = (obj.qty * obj.price) + otherChargeTotal;
            if (obj.totalRelease === 1) {
              const shipObj = {
                PIDCode: obj.PIDCode,
                lineID: obj.lineID,
                nickName: obj.nickName,
                poqty: obj.qty,
                promisedShipDate: vm.poDetailRelease ? vm.poDetailRelease.promisedShipDate : null,
                qty: obj.qty,
                releaseNumber: 1,
                poLineWorkingStatus: vm.POLineWorkingStatus.Open.id,
                poLineWorkingStatusDisplay: BaseService.getPOLineWorkingStatus(vm.POLineWorkingStatus.Open.id),
                receivedQty: 0,
                partDescription: obj.partDescription,
                shippingDate: vm.poDetailRelease ? vm.poDetailRelease.shippingDate : null,
                totalRelease: obj.totalRelease,
                parent: obj,
                shipping_index: 0
              };
              obj.PODetail.push(shipObj);
              vm.poDetailRelease = {};
            }
            vm.sourceData.push(obj);
            vm.sourceData = _.orderBy(vm.sourceData, ['lineID'], ['asc']);
            objIndex = _.indexOf(vm.sourceData, obj);
          }
          vm.totalSourceDataCount = vm.sourceData.length;
          vm.currentdata = vm.totalSourceDataCount;
          if (vm.gridOptions.gridApi) {
            vm.gridOptions.currentItem = vm.currentdata;
            vm.gridOptions.totalItems = vm.totalSourceDataCount;
            vm.gridOptions.data = _.orderBy(vm.sourceData, ['lineID'], ['asc']);
            if (vm.gridOptions.gridApi.expandable) {
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[objIndex]);
            }
          }
          celledit(obj);
        }
        if (vm.poID) {
          let objPurchaseMaster = _.find(vm.sourceData, (po) => parseInt(po.lineID) === parseInt(obj.lineID));
          const copyobjPurchaseMaster = _.clone(objPurchaseMaster);
          if (objPurchaseMaster) {
            const index = _.indexOf(vm.sourceData, objPurchaseMaster);
            objPurchaseMaster = obj;
            if (objPurchaseMaster.totalRelease === 1 && (!objPurchaseMaster.PODetail || objPurchaseMaster.PODetail.length === 0)) {
              const shipObj = {
                PIDCode: objPurchaseMaster.PIDCode,
                lineID: objPurchaseMaster.lineID,
                poqty: objPurchaseMaster.qty,
                promisedShipDate: vm.poDetailRelease ? vm.poDetailRelease.promisedShipDate : null,
                qty: objPurchaseMaster.qty,
                poLineWorkingStatus: vm.POLineWorkingStatus.Open.id,
                poLineWorkingStatusDisplay: BaseService.getPOLineWorkingStatus(vm.POLineWorkingStatus.Open.id),
                receivedQty: 0,
                releaseNumber: 1,
                partDescription: objPurchaseMaster.partDescription,
                shippingDate: vm.poDetailRelease ? vm.poDetailRelease.shippingDate : null,
                totalRelease: objPurchaseMaster.totalRelease,
                parent: objPurchaseMaster,
                shipping_index: 0,
                id: objPurchaseMaster.PODetail && objPurchaseMaster.PODetail.length > 0 ? objPurchaseMaster.PODetail[0].id : null
              };
              objPurchaseMaster.PODetail = [];
              objPurchaseMaster.PODetail.push(shipObj);
              vm.poDetailRelease = {};
            } else {
              if (objPurchaseMaster.totalRelease === 1 && objPurchaseMaster.PODetail.length === 1) {
                copyobjPurchaseMaster.PODetail[0].poqty = objPurchaseMaster.qty;
                copyobjPurchaseMaster.PODetail[0].qty = objPurchaseMaster.qty;
                copyobjPurchaseMaster.PODetail[0].promisedShipDate = vm.poDetailRelease ? vm.poDetailRelease.promisedShipDate : null;
                copyobjPurchaseMaster.PODetail[0].shippingDate = vm.poDetailRelease ? vm.poDetailRelease.shippingDate : null;
                objPurchaseMaster.PODetail = copyobjPurchaseMaster.PODetail;
              } else {
                objPurchaseMaster.PODetail = copyobjPurchaseMaster.PODetail;
              }
            }
            const otherChargeTotal = (_.sumBy(objPurchaseMaster.POOtherDetail, (o) => (o.qty * o.price)) || 0);
            objPurchaseMaster.totalextPrice = (objPurchaseMaster.qty * objPurchaseMaster.price) + otherChargeTotal;
            vm.sourceData.splice(index, 1);
            vm.sourceData.splice(index, 0, objPurchaseMaster);
            vm.sourceData = _.orderBy(vm.sourceData, ['lineID'], ['asc']);
            objIndex = _.indexOf(vm.sourceData, objPurchaseMaster);
          }
          else {
            obj.otherCharges = 0;
            if (obj.totalRelease === 1) {
              if (obj.PODetail && obj.PODetail.length > 0) {
                obj.PODetail[0].shippingDate = vm.poDetailRelease ? vm.poDetailRelease.shippingDate : null;
                obj.PODetail[0].promisedShipDate = vm.poDetailRelease ? vm.poDetailRelease.promisedShipDate : null;
              } else {
                obj.PODetail = [];
                const shipObj = {
                  PIDCode: obj.PIDCode,
                  lineID: obj.lineID,
                  poqty: obj.qty,
                  poLineWorkingStatus: vm.POLineWorkingStatus.Open.id,
                  poLineWorkingStatusDisplay: BaseService.getPOLineWorkingStatus(vm.POLineWorkingStatus.Open.id),
                  receivedQty: 0,
                  promisedShipDate: vm.poDetailRelease ? vm.poDetailRelease.promisedShipDate : null,
                  qty: obj.qty,
                  shippingDate: vm.poDetailRelease ? vm.poDetailRelease.shippingDate : null,
                  totalRelease: obj.totalRelease,
                  parent: obj,
                  shipping_index: 0,
                  releaseNumber: 1
                };
                obj.PODetail.push(shipObj);
              }
            }
            const otherChargeTotal = (_.sumBy(obj.POOtherDetail, (o) => (o.qty * o.price)) || 0);
            obj.totalextPrice = (obj.qty * obj.price) + otherChargeTotal;
            vm.sourceData.push(obj);
            vm.sourceData = _.orderBy(vm.sourceData, ['lineID'], ['asc']);
            objIndex = _.indexOf(vm.sourceData, obj);
          }
          vm.totalSourceDataCount = vm.sourceData.length;
          vm.currentdata = vm.totalSourceDataCount;
          if (vm.gridOptions.gridApi) {
            vm.gridOptions.currentItem = vm.currentdata;
            vm.gridOptions.totalItems = vm.totalSourceDataCount;
            vm.gridOptions.data = _.orderBy(vm.sourceData, ['lineID'], ['asc']);
            if (vm.gridOptions.gridApi.expandable) {
              vm.gridOptions.gridApi.expandable.collapseAllRows();
              vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[objIndex]);
            }
          }
          celledit(obj);
          if (!isreset) {
            vm.resetDetail(false, true);
          }
        }
        vm.getPurchaseOrderPriceDetails();
      };
      //celledit purchase order details check validation (parent-grid)
      function celledit(rowEntity) {
        if (!vm.gridOptions.gridApi || !vm.gridOptions.gridApi.grid) {
          return;
        }
        //manually set dirty
        vm.isChanged = true;
        const obj = _.find(vm.sourceData, (item) => parseInt(item.lineID) === parseInt(rowEntity.lineID));
        rowEntity = obj;
        if (!rowEntity.PODetail) {
          rowEntity.PODetail = [];
        }
        if (rowEntity.totalRelease === rowEntity.PODetail.length) {
          vm.gridOptions.gridApi.grid.validate.setValid(rowEntity, vm.gridOptions.columnDefs[2]);
        }
        if (rowEntity.PIDCode && rowEntity.qty && rowEntity.price) {
          vm.isValidMasterData = true;
        }
        if (rowEntity.price) {
          rowEntity.price = parseFloat(rowEntity.price).toFixed(5);
        }
      }
      //open popup for purchaseorder other charges
      vm.gotoPurchaseOrderOtherCharges = (row, ev) => {
        vm.isLineOtherChargePopupOpen = true;
        if (row && row.entity && row.entity.id) {
          vm.getPurchaseOrderShippingDetails(row.entity.id).then(() => {
            if (vm.islineStatusCompleted) {
              otherChargesCompletedOrNot(row, ev, true);
            }
            else {
              otherChargesCompletedOrNot(row, ev, vm.isDisable);
            }
          });
        } else {
          otherChargesCompletedOrNot(row, ev, vm.isDisable);
        }
      };
      // check for other charges open or not
      const otherChargesCompletedOrNot = (row, ev, isDisable) => {
        const objEntity = _.clone(row.entity);
        objEntity.SalesOtherDetail = objEntity.POOtherDetail;
        objEntity.isfromPO = true;
        objEntity.isDisable = isDisable;
        DialogFactory.dialogService(
          CORE.SALESORDER_OTHER_EXPENSE_MODAL_CONTROLLER,
          CORE.SALESORDER_OTHER_EXPENSE_MODAL_VIEW,
          ev,
          objEntity).then(() => vm.isLineOtherChargePopupOpen = false,
            (data) => {
              if (data && data.isDirty) {
                const otherChargeTotal = (_.sumBy(data.otherDetails, (o) => (o.qty * o.price)) || 0);
                row.entity.POOtherDetail = data.otherDetails || [];
                row.entity.otherCharges = otherChargeTotal.toFixed(2);
                row.entity.totalextPrice = (row.entity.qty * row.entity.price) + otherChargeTotal;
                vm.frmPurchaseOrder.$$controls[0].$setDirty();
                vm.getPurchaseOrderPriceDetails();
              }
              vm.isLineOtherChargePopupOpen = false;
            }, (err) => BaseService.getErrorLog(err));
      };
      // purchase order other detail
      //change purchase detail
      vm.changePODetail = () => {
        vm.resetDetail(false);
      };
      //check line id details
      vm.checkLineID = () => {
        if (vm.isOpen) {
          return;
        }
        if (vm.poDetailRelease.lineID) {
          const objLineItem = _.find(vm.sourceData, (line) => parseInt(line.lineID) === parseInt(vm.poDetailRelease.lineID));
          if (objLineItem) {
            if (vm.poDetailRelease.shipping_index || vm.poDetailRelease.shipping_index === 0 || (!vm.poDetailRelease.shipping_index && parseInt(objLineItem.totalRelease) !== parseInt(objLineItem.PODetail.length))) {
              vm.poDetailRelease.poqty = objLineItem.qty;
              vm.poDetailRelease.totalRelease = objLineItem.totalRelease;
              vm.poDetailRelease.partDescription = objLineItem.partDescription;
              vm.poDetailRelease.PIDCode = objLineItem.PIDCode;
              vm.poDetailRelease.packagingID = objLineItem.packagingID;
              vm.poDetailRelease.minimum = objLineItem.minimum;
              vm.poDetailRelease.mult = objLineItem.mult;
              vm.poDetailRelease.packagingName = objLineItem.packagingName;
              if (!vm.IsEditReleaseLine) {
                //!objLineItem.id &&
                const sumQty = _.sumBy(objLineItem.PODetail, (o) => parseInt(o.qty));
                vm.poDetailRelease.qty = (vm.poDetailRelease.poqty - sumQty) > 0 ? (vm.poDetailRelease.poqty - sumQty) : 0;
                const maxReleaseLine = _.maxBy(objLineItem.PODetail, (item) => item.releaseNumber);
                vm.poDetailRelease.releaseNumber = vm.poDetailRelease.releaseNumber ? vm.poDetailRelease.releaseNumber : !(vm.CopypoModel && vm.CopypoModel.isAlreadyPublished && maxReleaseLine) ? objLineItem.PODetail.length + 1 : maxReleaseLine.releaseNumber + 1;
              }
              vm.disabledPODetailReleaseFields = {
                PIDCode: objLineItem.PIDCode,
                partDescription: objLineItem.partDescription,
                poqty: objLineItem.qty,
                minimum: objLineItem.minimum,
                totalRelease: objLineItem.totalRelease,
                packagingName: objLineItem.packagingName,
                releaseNumber: vm.poDetailRelease.releaseNumber
              };
              const indexSource = _.indexOf(vm.sourceData, objLineItem);
              if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
                vm.gridOptions.gridApi.expandable.collapseAllRows();
                vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[indexSource]);
              }
            }
            else {
              if (objLineItem && parseInt(objLineItem.totalRelease) === objLineItem.PODetail.length) {
                vm.isOpen = true;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_INVALID_LINE);
                messageContent.message = stringFormat(messageContent.message, vm.poDetailRelease.lineID);
                const model = {
                  multiple: true,
                  messageContent: messageContent
                };
                return DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    setFocus('lineID');
                    vm.isOpen = false;
                    vm.poDetailRelease.lineID = null;
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }
          else {
            vm.poDetailRelease.lineID = null;
            vm.poDetailRelease.poqty = null;
            vm.poDetailRelease.totalRelease = null;
            vm.poDetailRelease.partDescription = null;
            vm.poDetailRelease.PIDCode = null;
            vm.isOpen = true;
            const messageConstant = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
            messageConstant.message = stringFormat(messageConstant.message, 'PO Line ID');
            const model = {
              multiple: true,
              messageContent: messageConstant
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                setFocus('lineID');
                vm.isOpen = false;
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };
      //Add new row in expandable ui grid
      vm.addNewRow = (row) => {
        var objLineItem = _.find(vm.sourceData, (line) => parseInt(row.lineID) === parseInt(line.lineID));
        var indexSource = _.indexOf(vm.sourceData, objLineItem);
        if (objLineItem) {
          let obj = _.find(objLineItem.PODetail, (item) => item.shipping_index === row.shipping_index);
          if (obj) {
            const index = _.indexOf(objLineItem.PODetail, obj);
            obj = row;
            objLineItem.PODetail.splice(index, 1);
            objLineItem.PODetail.splice(index, 0, obj);
          } else {
            const maxobj = _.maxBy(objLineItem.PODetail, (item) => item.shipping_index);
            row.parent = objLineItem;
            row.id = 0;
            row.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(vm.POLineWorkingStatus.Open.id);
            row.poLineWorkingStatus = vm.POLineWorkingStatus.Open.id;
            row.receivedQty = 0;
            row.shipping_index = maxobj ? maxobj.shipping_index + 1 : 0;
            objLineItem.PODetail.push(row);
          }
          if (vm.gridOptions.gridApi && vm.gridOptions.gridApi.expandable) {
            vm.gridOptions.gridApi.expandable.collapseAllRows();
            vm.gridOptions.gridApi.expandable.expandRow(vm.sourceData[indexSource]);
          }
        }
        vm.getPurchaseOrderPriceDetails();
      };
      //change qty for other charges
      vm.changeOtherPartQty = () => {
        // auto select price from part master
        if (vm.poDetail.qty && vm.PartPriceBreakDetailsData) {
          const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.poDetail.qty);
          if (priceBreak) {
            vm.poDetail.price = priceBreak.unitPrice;
          } else {
            const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.poDetail.qty), (o) => o.priceBreak);
            if (priceList.length > 0) {
              vm.poDetail.price = priceList[priceList.length - 1].unitPrice;
            }
          }
          vm.changePrice();
        }
      };
      //get price break details
      vm.getPartPriceBreakDetails = (id) => ComponentFactory.getPartPriceBreakDetails().query({ id: id }).$promise.then((res) => {
        if (res && res.data) {
          vm.PartPriceBreakDetailsData = res.data;
          if (vm.poDetail.qty && !vm.poDetail.lineID) {
            const priceBreak = _.find(vm.PartPriceBreakDetailsData, (pbreak) => pbreak.priceBreak === vm.poDetail.qty);
            if (priceBreak) {
              vm.poDetail.price = priceBreak.unitPrice;
            } else {
              const priceList = _.sortBy(_.filter(vm.PartPriceBreakDetailsData, (qtyBreak) => qtyBreak.priceBreak < vm.poDetail.qty), (o) => o.priceBreak);
              if (priceList.length > 0) {
                vm.poDetail.price = priceList[priceList.length - 1].unitPrice;
              }
            }
            vm.changePrice();
          }
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
      //get footer details
      vm.getFooterTotal = (isother) => {
        let sum;
        if (isother) {
          sum = (_.sumBy(vm.sourceData, (data) => data.totalextPrice)) || 0;
        } else {
          sum = _.sumBy(vm.sourceData, (data) => data.extPrice);
        }
        sum = $filter('currency')(sum);
        return sum;
      };
      //get other footer details
      vm.getOtherFooterTotal = () => {
        let sum = (_.sumBy(vm.sourceData, (data) => parseFloat(data.otherCharges ? data.otherCharges : 0))) || 0;
        sum = $filter('currency')(sum);
        return sum;
      };
      // get price footer detail
      vm.getPriceFooterTotal = () => {
        const display = stringFormat('Total:');
        return display;
      };
      //remove delete from purchase order list
      vm.deleteRecord = (row) => {
        row.entity.isDisabledDelete = true;
        if (row.entity && row.entity.id) {
          vm.getPurchaseOrderShippingDetails(row.entity.id).then((response) => {
            if (vm.totalReceiveQty > 0 || _.find(response, (item) => (item.poLineCompleteType === vm.POCompleteType.AUTO || item.poLineCompleteType === vm.POCompleteType.MANUAL))) {
              row.entity.receivedQty = angular.copy(vm.totalReceiveQty);
              row.entity.poLineWorkingStatus = vm.islineStatusCompleted ? vm.POLineWorkingStatus.Close.id : vm.POLineWorkingStatus.Open.id;
              row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(row.entity.poLineWorkingStatus);
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PURCHASE_ORDER_REMOVE_RESTRICT_PACKING_SLIP);
              messageContent.message = stringFormat(messageContent.message, row.entity.lineID, (vm.totalReceiveQty || 0), row.entity.qty, _.map(vm.poModel.packingSlipMaterialReceive, (PS) => redirectToPSAnchorTag(PS.id, PS.packingSlipNumber)).join(', '));
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                row.entity.isDisabledDelete = false;
                vm.totalReceiveQty = 0;
                vm.islineStatusCompleted = false;
                _.each(row.entity.PODetail, (poDetail) => {
                  const objPO = _.find(response, (item) => item.id === poDetail.id);
                  if (objPO) {
                    poDetail.poLineWorkingStatus = objPO.poLineWorkingStatus || vm.POLineWorkingStatus.Open.id;
                    poDetail.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(poDetail.poLineWorkingStatus);
                    poDetail.receivedQty = objPO.receivedQty || 0;
                    poDetail.poLineCompleteType = objPO.poLineCompleteType;
                    poDetail.poLineCompleteTypeLabel = objPO.poLineCompleteType === vm.POCompleteType.MANUAL ? CORE.POCompleteStatusTypeDropDown[3].value : objPO.poLineCompleteType === vm.POCompleteType.AUTO ? CORE.POCompleteStatusTypeDropDown[2].value : CORE.POCompleteStatusTypeDropDown[1].value,
                      poDetail.poLineCompleteReason = objPO.poLineCompleteReason;
                  }
                });
                vm.gridOptions.gridApi.expandable.collapseAllRows();
              });
            } else {
              linePurchaseDetail(row);
            }
          });
        } else {
          linePurchaseDetail(row);
        }
      };
      //purchase order line detail
      const linePurchaseDetail = (row) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Purchase Order details', 1);
        const objs = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const obj = _.find(vm.sourceData, (item) => parseInt(item.lineID) === parseInt(row.entity.lineID));
        DialogFactory.messageConfirmDialog(objs).then((yes) => {
          row.entity.isDisabledDelete = false;
          if (yes && obj) {
            vm.isChanged = true;
            const _index = vm.sourceData.indexOf(obj);
            // Static code to enable save button
            vm.frmPurchaseOrder.$$controls[0].$setDirty();
            vm.sourceData.splice(_index, 1);
            vm.totalSourceDataCount = vm.sourceData.length;
            vm.currentdata = vm.totalSourceDataCount;
            if (!(vm.CopypoModel && vm.CopypoModel.isAlreadyPublished)) {
              let index = obj.lineID;
              _.each(vm.sourceData, (sData) => {
                if (sData.lineID > obj.lineID) {
                  sData.lineID = index;
                  index++;
                }
              });
            }
            $timeout(() => {
              vm.resetSourceGrid();
              vm.getPurchaseOrderPriceDetails();
              resetPODetForm();
            }, _configTimeout);
          }
        }, () => row.entity.isDisabledDelete = false).catch((error) => BaseService.getErrorLog(error));
      };
      //Remove row from expandable ui grid
      $scope.removeRow = (row) => {
        vm.isdisabledDeleteIcon = true;
        if (row.entity && row.entity.parent && row.entity.parent.id) {
          vm.getPurchaseOrderShippingDetails(row.entity.parent.id).then((list) => {
            const shippingList = _.find(list, (item) => item.id === row.entity.id);
            if (shippingList && (shippingList.poLineWorkingStatus === vm.POLineWorkingStatus.Close.id || shippingList.receivedQty > 0)) {
              row.entity.receivedQty = angular.copy(shippingList.receivedQty || 0);
              row.entity.poLineWorkingStatus = shippingList.poLineWorkingStatus === vm.POLineWorkingStatus.Close.id ? vm.POLineWorkingStatus.Close.id : vm.POLineWorkingStatus.Open.id;
              row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(row.entity.poLineWorkingStatus);
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PURCHASE_ORDER_REMOVE_SHIPPING_RESTRICTION_PS);
              messageContent.message = stringFormat(messageContent.message, row.entity.releaseNumber, (shippingList.receivedQty || 0), row.entity.qty, _.map(vm.poModel.packingSlipMaterialReceive, (PS) => redirectToPSAnchorTag(PS.id, PS.packingSlipNumber)).join(', '));
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                vm.totalReceiveQty = 0;
                vm.isdisabledDeleteIcon = vm.islineStatusCompleted = false;
              });
            } else {
              shippingPurchaseDetail(row);
            }
          });
        }
        else {
          shippingPurchaseDetail(row);
        }
      };
      // purchase order shipping detail
      const shippingPurchaseDetail = (row) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Release', 1);
        const objs = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const obj = _.find(row.grid.options.data, (item) => item.shipping_index === row.entity.shipping_index);
        DialogFactory.messageConfirmDialog(objs).then((yes) => {
          vm.isdisabledDeleteIcon = false;
          if (yes) {
            vm.isChanged = true;
            if (obj) {
              const _index = row.grid.options.data.indexOf(obj);
              row.grid.options.data.splice(_index, 1);
              const parentQty = row.entity.parent.qty;
              const sumQty = _.sumBy(row.grid.options.data, (item) => item.qty);
              let index = obj.releaseNumber;
              _.each(row.grid.options.data, (item, _index) => {
                if (sumQty === parentQty) {
                  if (row.entity && row.entity.subGridOptions) {
                    vm.gridOptions.gridApi.grid.validate.setValid(row.entity.subGridOptions.data[_index], row.entity.subGridOptions.columnDefs[GridOption.SUBQTY]);
                  }
                } else {
                  if (row.entity && row.entity.subGridOptions) {
                    vm.gridOptions.gridApi.grid.validate.setInvalid(row.grid.options.data[_index], row.grid.columns[GridOption.SUBQTY]);
                  }
                }
                if (item.releaseNumber > obj.releaseNumber && (!(vm.CopypoModel && vm.CopypoModel.isAlreadyPublished))) {
                  item.releaseNumber = index;
                  index++;
                }
              });
              vm.getPurchaseOrderPriceDetails();
              // Static code to enable save button
              vm.frmPurchaseOrder.$$controls[0].$setDirty();
            }
          }
        }, () => vm.isdisabledDeleteIcon = false).catch((error) => BaseService.getErrorLog(error));
      };
      //edit purchase order master detail
      vm.EditPurchaseMasterDetail = (purchaserow, isView) => {
        vm.isView = isView ? true : false;
        // vm.copyLineObject = angular.copy(purchaserow.entity);
        if (vm.PODetForm.$dirty) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_DETAIL_WORK_CONFIRMATION);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              purchaseMasterConfirmation(purchaserow);
            }
          }, () => vm.isView = false
          ).catch((error) => BaseService.getErrorLog(error));
        } else {
          purchaseMasterConfirmation(purchaserow);
        }
      };
      //common purchase validation
      const purchaseMasterConfirmation = (purchaserow) => {
        if (purchaserow && purchaserow.entity.id) {
          vm.getPurchaseOrderShippingDetails(purchaserow.entity.id).then((response) => {
            purchaserow.entity.receivedQty = angular.copy(vm.totalReceiveQty);
            purchaserow.entity.pendingQty = (purchaserow.entity.qty - vm.totalReceiveQty) < 0 ? 0 : purchaserow.entity.qty - vm.totalReceiveQty;
            purchaserow.entity.poLineWorkingStatus = vm.islineStatusCompleted ? vm.POLineWorkingStatus.Close.id : vm.POLineWorkingStatus.Open.id;
            purchaserow.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(purchaserow.entity.poLineWorkingStatus);
            if (vm.islineStatusCompleted && !vm.isView && response && response.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PURCHASE_ORDER_LINE_UPDATE_RESTRICT);
              messageContent.message = stringFormat(messageContent.message, 'PO Line ID', purchaserow.entity.lineID);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                vm.islineStatusCompleted = false;
                vm.totalReceiveQty = 0;
                _.each(purchaserow.entity.PODetail, (poDetail) => {
                  const objPO = _.find(response, (item) => item.id === poDetail.id);
                  if (objPO) {
                    poDetail.poLineWorkingStatus = objPO.poLineWorkingStatus || vm.POLineWorkingStatus.Open.id;
                    poDetail.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(poDetail.poLineWorkingStatus);
                    poDetail.receivedQty = objPO.receivedQty || 0;
                    poDetail.poLineCompleteType = objPO.poLineCompleteType;
                    poDetail.poLineCompleteTypeLabel = objPO.poLineCompleteType === vm.POCompleteType.MANUAL ? CORE.POCompleteStatusTypeDropDown[3].value : objPO.poLineCompleteType === vm.POCompleteType.AUTO ? CORE.POCompleteStatusTypeDropDown[2].value : CORE.POCompleteStatusTypeDropDown[1].value,
                      poDetail.poLineCompleteReason = objPO.poLineCompleteReason;
                  }
                });
                vm.gridOptions.gridApi.expandable.collapseAllRows();
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              checkParentUpdateRecord(purchaserow);
            }
          });
        } else {
          vm.totalReceiveQty = 0;
          vm.islineStatusCompleted = false;
          checkParentUpdateRecord(purchaserow);
        }
      };
      //parent record update detail
      const checkParentUpdateRecord = (purchaserow) => {
        vm.poDetail = _.clone(purchaserow.entity);
        vm.poDetail.price = parseFloat(purchaserow.entity.price);
        vm.poDetail.extPrice = parseFloat(parseFloat(purchaserow.entity.extPrice).toFixed(5));
        vm.poDetail.extPriceDisplay = $filter('amount')(vm.poDetail.extPrice);
        if (vm.poDetail.partType === vm.OtherType) {
          vm.autocompleteOtherCharges.keyColumnId = vm.poDetail.partID;
          vm.poDetail.isLine = 3;
        } else {
          vm.poDetail.isLine = 1;
        }
        if (vm.poDetail.partID && vm.poDetail.isLine === 1) {
          const searchObj = {
            id: vm.poDetail.partID,
            isContainCPN: true,
            mfgType: CORE.MFG_TYPE.MFG,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
            supplierID: vm.poModel.supplierID
          };
          getPartNumberSearch(searchObj);
        }
        if (vm.poDetail.supplierMfgPNID && vm.poDetail.isLine === 1) {
          const searchObj = {
            id: vm.poDetail.supplierMfgPNID,
            mfgType: CORE.MFG_TYPE.DIST,
            isContainCPN: true,
            isGoodPart: true,
            strictCustomPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.StrictlyCustomComponent.key,
            offtheselfPart: vm.poModel.supplierMFRMappingType === CORE.supplierMFRMappingType.OffTheShelf.key,
            supplierID: vm.poModel.supplierID
          };
          getPartNumberSearch(searchObj);
        } else {
          if (vm.autoCompleteSupplierCode) {
            vm.autoCompleteSupplierCode.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, null);
          }
        }
        if (vm.autoCompleteLineCustomer && vm.poDetail.lineCustomerID) {
          getSupplierMfgCodeSearch({
            mfgcodeID: vm.poDetail.lineCustomerID,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          }, true);
        } else {
          vm.poDetail.lineCustomerID = null;
          if (vm.autoCompleteLineCustomer && vm.autoCompleteLineCustomer.inputName) {
            $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
          }
        }
        vm.autoCompleteRohsStatus.keyColumnId = vm.poDetail.RoHSStatusID;
        vm.poDetailRelease = {};
        if (vm.poDetail.totalRelease === 1 && vm.poDetail.PODetail.length > 0) {
          vm.poDetailRelease = {
            shippingDate: vm.poDetail.PODetail[0].shippingDate,
            promisedShipDate: vm.poDetail.PODetail[0].promisedShipDate
          };
        }
        vm.updateMatsterDetail = !vm.isView;
        vm.copyPODetail = _.clone(purchaserow.entity);
        vm.copyPODetailRelease = _.clone(vm.poDetailRelease);
        $timeout(() => {
          vm.poDetail.spq = vm.copyPODetail.spq;
          vm.poDetail.minimum = vm.copyPODetail.minimum;
          vm.poDetail.mult = vm.copyPODetail.mult;
          vm.PODetForm.$setPristine();
          vm.PODetForm.$setUntouched();
          vm.PODetForm.$invalid = false;
          vm.PODetForm.$valid = true;
          vm.autoPackaging.keyColumnId = vm.copyPODetail.packagingID;
          setFocus('qty');
        });
      };
      //view purchase order material purchase part requirement details
      vm.ViewPurchaseOrderRequireComment = (row, event) => {
        vm.isLineRequirementPopupOpen = true;
        if (row && row.id) {
          vm.getPurchaseOrderShippingDetails(row.id).then(() => {
            if (vm.islineStatusCompleted) {
              checkCompletedPOLineStatus(row, event, true);
            } else {
              checkCompletedPOLineStatus(row, event, vm.isDisable);
            }
          });
        } else {
          checkCompletedPOLineStatus(row, event, vm.isDisable);
        }
      };
      // check status completed or not po line
      const checkCompletedPOLineStatus = (row, event, isDisable) => {
        const objRow = _.clone(row);
        objRow.poNumber = vm.poModel.poNumber;
        objRow.poID = vm.poID;
        objRow.isDisable = isDisable;
        DialogFactory.dialogService(
          CORE.PURCHASE_ORDER_REQUIREMENT_PART_MODAL_CONTROLLER,
          CORE.PURCHASE_ORDER_REQUIREMENT_PART_MODAL_VIEW,
          event,
          objRow).then(() => vm.isLineRequirementPopupOpen = vm.addPODetailBtnDisabled = false, (detail) => {
            if (detail && detail.isDirty) {
              row.PORequirementDetail = detail.purchaseRequirement;
              // Static code to enable save button
              vm.frmPurchaseOrder.$$controls[0].$setDirty();
            }
            vm.isLineRequirementPopupOpen = false;
            vm.resetDetail();
          }, (err) => BaseService.getErrorLog(err));
      };
      //edit child data for purchase order
      vm.EditSalesChildDetail = (row, isView) => {
        vm.isView = isView ? true : false;
        if (vm.PODetForm.$dirty) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_DETAIL_WORK_CONFIRMATION);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              commonReleaseLineChange(row);
            }
          }, () => vm.isView = false).catch((error) => BaseService.getErrorLog(error));
        } else {
          commonReleaseLineChange(row);
        }
      };
      //common relese line change
      const commonReleaseLineChange = (row) => {
        if (row && row.entity && row.entity.id && row.entity.parent && row.entity.parent.id) {
          vm.getPurchaseOrderShippingDetails(row.entity.parent.id).then((list) => {
            const shippingDet = _.find(list, (item) => item.id === row.entity.id);
            if (shippingDet && shippingDet.poLineWorkingStatus === vm.POLineWorkingStatus.Close.id && !vm.isView) {
              row.entity.receivedQty = shippingDet.receivedQty;
              row.entity.qty = shippingDet.qty;
              row.entity.poLineWorkingStatus = shippingDet.poLineWorkingStatus === vm.POLineWorkingStatus.Close.id ? vm.POLineWorkingStatus.Close.id : vm.POLineWorkingStatus.Open.id;
              row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(row.entity.poLineWorkingStatus);
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PURCHASE_ORDER_LINE_UPDATE_RESTRICT);
              messageContent.message = stringFormat(messageContent.message, 'Release#', row.entity.releaseNumber);
              const model = {
                multiple: true,
                messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                vm.islineStatusCompleted = false;
                row.entity.poLineCompleteType = shippingDet.poLineCompleteType;
                row.entity.poLineCompleteTypeLabel = shippingDet.poLineCompleteType === vm.POCompleteType.MANUAL ? CORE.POCompleteStatusTypeDropDown[3].value : shippingDet.poLineCompleteType === vm.POCompleteType.AUTO ? CORE.POCompleteStatusTypeDropDown[2].value : CORE.POCompleteStatusTypeDropDown[1].value,
                  row.entity.poLineCompleteReason = shippingDet.poLineCompleteReason;
                vm.totalReceiveQty = 0;
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (shippingDet && shippingDet.poLineWorkingStatus !== vm.POLineWorkingStatus.Close.id) {
              vm.totalReceiveQty = shippingDet.receivedQty;
              row.entity.qty = shippingDet.qty;
              row.entity.receivedQty = angular.copy(vm.totalReceiveQty);
              row.entity.pendingQty = (row.entity.qty - vm.totalReceiveQty) < 0 ? 0 : row.entity.qty - vm.totalReceiveQty;
              row.entity.poLineWorkingStatus = shippingDet.poLineWorkingStatus === vm.POLineWorkingStatus.Close.id ? vm.POLineWorkingStatus.Close.id : vm.POLineWorkingStatus.Open.id;
              row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(row.entity.poLineWorkingStatus);
              shippingReleaseCheck(row);
            } else {
              shippingReleaseCheck(row);
            }
          });
        } else {
          shippingReleaseCheck(row);
        }
      };
      // release line update message changes
      const shippingReleaseCheck = (row) => {
        vm.copyObject = _.clone(row.entity);
        vm.poDetailRelease = _.clone(row.entity);
        vm.autoCompleteSalesAddress.keyColumnId = row.entity.shippingAddressID || null;
        if (vm.poDetailRelease.id) {
          if (vm.autoCompleteSalesContactPerson) {
            vm.autoCompleteSalesContactPerson.keyColumnId = row.entity.shippingContactPersonID || null;
          }
          vm.autoCompleteSalesShipping.keyColumnId = row.entity.shippingMethodID || null;
          vm.autoCompletelineCarriers.keyColumnId = row.entity.carrierID || null;
        }
        vm.poDetailRelease.lineID = row.entity.parent ? row.entity.parent.lineID : null;
        vm.poDetail.isLine = 2;
        vm.IsEditReleaseLine = true;
        vm.checkLineID();
        //set shipping date
        vm.shippingDateOptions = {
          appendToBody: true,
          shippingDateOpenFlag: false,
          minDate: vm.poModel.poDate
        };
        //set promised ship date
        vm.promisedShipDateOptions = {
          appendToBody: true,
          shippingDateOpenFlag: false,
          minDate: vm.poModel.poDate
        };
        $timeout(() => {
          setFocus('releaseNumber');
        }, true);
      };
      //show description for detail
      vm.showDescriptionPopUp = (object, ev) => {
        vm.isDisabledLineCommentsIcon = true;
        const description = object && object.lineComment ? angular.copy(object.lineComment).replace(/\r/g, '<br/>').replace(/\n/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.LineComment,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      // show internal notes description
      vm.showInternalDescriptionPopUp = (object, ev) => {
        vm.isDisabledInternalNotesIcon = true;
        const description = object && object.internalLineComment ? angular.copy(object.internalLineComment).replace(/\r/g, '<br/>').replace(/\n/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.InternalNotes,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      //show additional notes
      vm.showAdditionalPartDescriptionPopUp = (object, ev) => {
        vm.isDisabledAdditionalNotesIcon = true;
        const description = object && object.additionalNotes ? angular.copy(object.additionalNotes).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.AdditionalNote,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      // show complete reason popup
      vm.showPOCompleteReasonPopUp = (object, ev) => {
        vm.isDisabledLineCompleteReasonIcon = true;
        const description = object && object.poLineCompleteReason ? angular.copy(object.poLineCompleteReason).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.POCompleteReleaseLineReason,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      //show release notes notes
      vm.showReleasePartDescriptionPopUp = (object, ev) => {
        vm.isDisabledReleaseNotesIcon = true;
        const description = object && object.releaseNotes ? angular.copy(object.releaseNotes).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.ReleaseNotes,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      vm.showShippingAddressPopUp = (object, ev) => {
        vm.isDisabledShippingAddressIcon = true;
        const description = object && object.shippingAddress ? angular.copy(object.shippingAddress).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.ShippingAddress,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      //show part description
      vm.showPartDescriptionPopUp = (object, ev) => {
        vm.isDisabledPartDescriptionIcon = true;
        const description = object && object.partDescription ? angular.copy(object.partDescription).replace(/\n/g, '<br/>').replace(/\r/g, '<br/>') : null;
        const obj = {
          title: vm.LabelConstant.PURCHASE_ORDER.Description,
          description: description,
          name: object.lineID
        };
        const data = obj;
        data.label = vm.LabelConstant.PURCHASE_ORDER.POLineID;
        openCommonDescriptionPopup(ev, data);
      };
      const openCommonDescriptionPopup = (ev, data) => {
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          data).then(() => vm.isDisabledLineCommentsIcon = vm.isDisabledInternalNotesIcon = vm.isDisabledAdditionalNotesIcon = vm.isDisabledLineCompleteReasonIcon = vm.isDisabledReleaseNotesIcon = vm.isDisabledShippingAddressIcon = vm.isDisabledPartDescriptionIcon = false,
            () => vm.isDisabledLineCommentsIcon = vm.isDisabledInternalNotesIcon = vm.isDisabledAdditionalNotesIcon = vm.isDisabledLineCompleteReasonIcon = vm.isDisabledReleaseNotesIcon = vm.isDisabledShippingAddressIcon = vm.isDisabledPartDescriptionIcon = false);
      };
      //get image url for component
      vm.displayCurrentImage = () => {
        if (!vm.poDetail.imageURL) {
          return CORE.NO_IMAGE_COMPONENT;
        }
        else if (!vm.poDetail.imageURL.startsWith('http://') && !vm.poDetail.imageURL.startsWith('https://')) {
          return BaseService.getPartMasterImageURL(vm.poDetail.documentPath, vm.poDetail.imageURL);
        }
        else {
          return vm.poDetail.imageURL;
        }
      };
      const getAuthenticationOfApprovalPart = (ev, componentObj, isSupplier) => {
        const objPartDetail = {
          AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
          tempID: vm.sourceData && vm.sourceData.length ? vm.sourceData.length + 1 : 1,
          refTableName: CORE.TABLE_NAME.PURCHASE_ORDER_DET,
          isAllowSaveDirect: false,
          approveFromPage: CORE.PAGENAME_CONSTANT[48].PageName,
          confirmationType: CORE.Generic_Confirmation_Type.PERMISSION_WITH_PACKAGING_ALIAS,
          createdBy: vm.loginUser.employee.initialName,
          updatedBy: vm.loginUser.employee.initialName,
          informationMsg: componentObj.informationMsg
        };
        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          ev,
          objPartDetail).then((data) => {
            if (data) {
              data.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.PERMISSION_WITH_PACKAGING_ALIAS, componentObj.PIDCode, componentObj.restrictUSEwithpermission ? CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission : CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission, data.approveFromPage, data.username);
              vm.poDetail.objApproval = data;
              if (!isSupplier) {
                mfgPartSetDetail(componentObj);
              }
            }
          }, () => {
            if (vm.autoCompleteSupplierCode && vm.autoCompleteSupplierCode.inputName) {
              $scope.$broadcast(vm.autoCompleteSupplierCode.inputName, null);
            }
            if (vm.autoCompleteMfgCode && vm.autoCompleteMfgCode.inputName) {
              $scope.$broadcast(vm.autoCompleteMfgCode.inputName, null);
            }
          }).catch((error) => BaseService.getErrorLog(error));
      };

      //open popup for supplier quote price for all suppplier
      vm.openSupplierQuotePartPricePopup = (ev) => {
        const data = angular.copy(vm.poDetail);
        data.supplierData = vm.supplierMfgCodeDetail[0];
        DialogFactory.dialogService(
          CORE.SUPPLIER_QUOTE_PO_PART_PRICE_POPUP_CONTROLLER,
          CORE.SUPPLIER_QUOTE_PO_PART_PRICE_POPUP_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };
      // get total line level price detail
      vm.getPurchaseOrderPriceDetails = () => {
        const lineTotal = _.sumBy(_.filter(vm.sourceData, (type) => type.partType !== vm.OtherType), (data) => data.extPrice);
        vm.totalLineChargeDisplay = $filter('amount')(lineTotal);

        // total line misc charges
        const linePartsList = _.filter(vm.sourceData, (type) => type.partType !== vm.OtherType);
        let totalCharges = 0;
        _.each(linePartsList, (service) => {
          totalCharges += _.sumBy(service.POOtherDetail, (data) => ((data.qty || 0) * (data.price || 0)));
        });
        vm.totalLineMiscChargesDisplay = $filter('amount')(totalCharges);

        // total order misc charges
        const orderMiscTotal = _.sumBy(_.filter(vm.sourceData, (type) => type.partType === vm.OtherType), (data) => data.extPrice);
        vm.totalordermiscDisplay = $filter('amount')(orderMiscTotal);

        //order total
        const extPrice = lineTotal + totalCharges + orderMiscTotal;
        vm.totalExtendedPriceDisplay = $filter('amount')(extPrice);
      };
      // check purchase order packing slip generated or not
      vm.checkPurchaseOrderMFR = () => PurchaseOrderFactory.getPurchaseOrderDetailByID().query({ id: vm.poID }).$promise.then((res) => {
        if (res && res.data) {
          vm.isPackingSlipGenerated = res.data.packingSlipMaterialReceive.length;
          if (vm.isPackingSlipGenerated) {
            $scope.$emit('isPackingSlipExists');
          };
          vm.packingSlipGenerate = res.data.packingSlipMaterialReceive;
          vm.poModel.poWorkingStatus = res.data.poWorkingStatus;
          vm.markForAddrViewActionBtn.AddNew.isDisable = vm.markForAddrViewActionBtn.ApplyNew.isDisable =
            vm.markForContPersonViewActionBtnDet.AddNew.isDisable = vm.markForContPersonViewActionBtnDet.ApplyNew.isDisable =
            vm.shippingAddrViewActionBtn.AddNew.isDisable = vm.shippingAddrViewActionBtn.ApplyNew.isDisable = vm.shippingContPersonViewActionBtnDet.AddNew.isDisable = vm.shippingContPersonViewActionBtnDet.ApplyNew.isDisable =
            vm.supplierAddrViewActionBtn.AddNew.isDisable = vm.supplierAddrViewActionBtn.ApplyNew.isDisable = vm.supplierContPersonViewActionBtnDet.AddNew.isDisable = vm.supplierContPersonViewActionBtnDet.ApplyNew.isDisable =
            vm.isDisable = vm.poModel.poWorkingStatus === vm.POWorkingStatus.Completed.id || vm.poModel.poWorkingStatus === vm.POWorkingStatus.Canceled.id || vm.poModel.lockStatus === TRANSACTION.PurchaseOrderLockStatus.Locked.id || vm.isReadOnly;
          vm.supplierAddrViewActionBtn.Update.isDisable = vm.supplierAddrViewActionBtn.Delete.isDisable = !vm.billingAddress || vm.isDisable;
          vm.supplierContPersonViewActionBtnDet.Update.isDisable = vm.supplierContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedContactPerson || vm.isDisable;
          vm.shippingAddrViewActionBtn.Update.isDisable = vm.shippingAddrViewActionBtn.Delete.isDisable = !vm.shippingAddress || vm.isDisable;
          vm.shippingContPersonViewActionBtnDet.Update.isDisable = vm.shippingContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedShippingContactPerson || vm.isDisable;
          vm.markForAddrViewActionBtn.Update.isDisable = vm.markForAddrViewActionBtn.Delete.isDisable = !vm.markForAddress || vm.isDisable;
          vm.markForContPersonViewActionBtnDet.Update.isDisable = vm.markForContPersonViewActionBtnDet.Delete.isDisable = !vm.selectedMarkForContactPerson || vm.isDisable;
          $scope.$parent.vm.poWorkingStatus = vm.poModel.poWorkingStatus;
          $scope.$parent.vm.isDisabled = vm.isDisable;
        }
        return vm.isPackingSlipGenerated;
      }).catch((error) => BaseService.getErrorLog(error));

      // Check purchase order detail list with shipping types
      vm.getPurchaseOrderShippingDetails = (id) => PurchaseOrderFactory.getPurchaseOrderLineDetailByID().query({ id: id }).$promise.then((res) => {
        if (res && res.data) {
          vm.totalReceiveQty = _.sumBy(res.data, (item) => (item.receivedQty || 0));
          vm.islineStatusCompleted = true;
          _.each(res.data, (item) => {
            if (item.poLineWorkingStatus !== vm.POLineWorkingStatus.Close.id) {
              vm.islineStatusCompleted = false;
            }
          });
        }
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));
      //check ship qty less or not
      vm.checkShipQty = () => {
        if (vm.totalReceiveQty && vm.poDetailRelease.qty && (vm.totalReceiveQty) > (vm.poDetailRelease.qty)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_LINE_QTY_UPDATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'Release#', vm.poDetailRelease.releaseNumber, 'Qty', vm.totalReceiveQty);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            vm.poDetailRelease.qty = null;
            setFocus('purchaseqty');
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //check ship qty less or not
      vm.checkMasterPOQty = () => {
        if (vm.totalReceiveQty && vm.poDetail.qty && (vm.totalReceiveQty) > (vm.poDetail.qty)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_LINE_QTY_UPDATE_VALIDATION);
          messageContent.message = stringFormat(messageContent.message, 'PO Line ID', vm.poDetail.lineID, 'PO Qty', vm.totalReceiveQty);
          const model = {
            multiple: true,
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            vm.poDetail.qty = null;
            setFocus('qty');
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          if (vm.poDetail.isLine === 3) {
            vm.changeOtherPartQty();
          } else {
            vm.changePrice();
          }
        }
      };
      // update po release line status
      vm.CompletePOReleaseLine = (row, ev, isOpenPOReleaseLine) => {
        vm.isManualCompleteReleaseLinePopupOpen = true;
        if (row && row.entity && row.entity.id) {
          vm.getPurchaseOrderShippingDetails(row.entity.parent.id).then((response) => {
            const objPO = _.find(response, (item) => item.id === row.entity.id);
            if (objPO) {
              row.entity.poLineWorkingStatus = objPO.poLineWorkingStatus || vm.POLineWorkingStatus.Open.id;
              row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(row.entity.poLineWorkingStatus);
              row.entity.receivedQty = objPO.receivedQty;
              row.entity.poLineCompleteType = objPO.poLineCompleteType;
              row.entity.poLineCompleteTypeLabel = objPO.poLineCompleteType === vm.POCompleteType.MANUAL ? CORE.POCompleteStatusTypeDropDown[3].value : objPO.poLineCompleteType === vm.POCompleteType.AUTO ? CORE.POCompleteStatusTypeDropDown[2].value : CORE.POCompleteStatusTypeDropDown[1].value,
                row.entity.poLineCompleteReason = objPO.poLineCompleteReason;
            }
            vm.islineStatusCompleted = false;
            if ((row.entity.poLineWorkingStatus === vm.POLineWorkingStatus.Close.id && !isOpenPOReleaseLine) || (row.entity.poLineWorkingStatus === vm.POLineWorkingStatus.Open.id && isOpenPOReleaseLine)) {
              vm.isManualCompleteReleaseLinePopupOpen = false;
              return;
            }
            const objPoDetail = {
              poNumber: vm.poModel.poNumber,
              poID: vm.poID,
              soNumber: vm.poModel.soNumber,
              pidCode: row.entity.parent.PIDCode,
              mfgPartID: row.entity.parent.partID,
              iscustom: row.entity.parent.isCustom,
              rohsIcon: row.entity.parent.rohsIcon,
              rohsName: row.entity.parent.rohsName,
              mfgPN: row.entity.parent.mfgPN,
              releaseNumber: row.entity.releaseNumber
            };

            DialogFactory.dialogService(
              CORE.COMMON_REASON_MODAL_CONTROLLER,
              CORE.COMMON_REASON_MODAL_VIEW,
              ev,
              objPoDetail).then(() => vm.isManualCompleteReleaseLinePopupOpen = false,
                (result) => {
                  vm.isManualCompleteReleaseLinePopupOpen = false;
                  if (result) {
                    const rowDetail = {
                      id: row.entity.id,
                      poLineWorkingStatus: isOpenPOReleaseLine ? vm.POLineWorkingStatus.Open.id : vm.POLineWorkingStatus.Close.id,
                      poLineCompleteReason: result,
                      poLineCompleteType: vm.POCompleteType.MANUAL,
                      refPOID: vm.poID
                    };
                    vm.cgBusyLoading = PurchaseOrderFactory.updatePurchaseOrderLineLevelStatus().query(rowDetail).$promise.then(() => {
                      row.entity.poLineWorkingStatus = isOpenPOReleaseLine ? vm.POLineWorkingStatus.Open.id : vm.POLineWorkingStatus.Close.id;
                      row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(row.entity.poLineWorkingStatus);
                      row.entity.poLineCompleteReason = rowDetail.poLineCompleteReason;
                      row.entity.poLineCompleteType = vm.POCompleteType.MANUAL;
                      row.entity.poLineCompleteTypeLabel = CORE.POCompleteStatusTypeDropDown[3].value;
                      vm.checkPurchaseOrderMFR();
                      getPurchaseOrderDetail();
                    }).catch((error) => BaseService.getErrorLog(error));
                  }
                }, (error) => BaseService.getErrorLog(error));
          });
        }
      };
      // update po release line details
      vm.CompletePOLine = (row, ev, isOpenPOLine) => {
        vm.isManualCompleteLinePopupOpen = true;
        vm.getPurchaseOrderShippingDetails(row.entity.id).then((response) => {
          row.entity.receivedQty = vm.totalReceiveQty;
          const sourceData = _.find(vm.sourceData, (sData) => sData.id === row.entity.id);
          if (vm.islineStatusCompleted) {
            row.entity.poLineWorkingStatus = vm.POLineWorkingStatus.Close.id;
            row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(vm.POLineWorkingStatus.Close.id);
          }
          _.each(row.entity.PODetail, (poDetail) => {
            const objPO = _.find(response, (item) => item.id === poDetail.id);
            if (objPO) {
              poDetail.poLineWorkingStatus = objPO.poLineWorkingStatus || vm.POLineWorkingStatus.Open.id;
              poDetail.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(poDetail.poLineWorkingStatus);
              poDetail.receivedQty = objPO.receivedQty || 0;
              poDetail.poLineCompleteType = objPO.poLineCompleteType;
              poDetail.poLineCompleteTypeLabel = objPO.poLineCompleteType === vm.POCompleteType.MANUAL ? CORE.POCompleteStatusTypeDropDown[3].value : objPO.poLineCompleteType === vm.POCompleteType.AUTO ? CORE.POCompleteStatusTypeDropDown[2].value : CORE.POCompleteStatusTypeDropDown[1].value,
                poDetail.poLineCompleteReason = objPO.poLineCompleteReason;
            }
          });
          if (vm.islineStatusCompleted && !isOpenPOLine) {
            vm.islineStatusCompleted = false;
            if (sourceData) {
              sourceData.poLineWorkingStatus = _.clone(row.entity.poLineWorkingStatus);
              sourceData.poLineWorkingStatusDisplay = _.clone(row.entity.poLineWorkingStatusDisplay);
              sourceData.PODetail = _.clone(row.entity.PODetail);
            }
            vm.gridOptions.gridApi.expandable.collapseAllRows();
            vm.isManualCompleteLinePopupOpen = false;
            return;
          }
          const objPoDetail = {
            poNumber: vm.poModel.poNumber,
            poID: vm.poID,
            soNumber: vm.poModel.soNumber,
            pidCode: row.entity.PIDCode,
            mfgPartID: row.entity.partID,
            iscustom: row.entity.isCustom,
            rohsIcon: row.entity.rohsIcon,
            rohsName: row.entity.rohsName,
            mfgPN: row.entity.mfgPN
          };
          DialogFactory.dialogService(
            CORE.COMMON_REASON_MODAL_CONTROLLER,
            CORE.COMMON_REASON_MODAL_VIEW,
            ev,
            objPoDetail).then(() => vm.isManualCompleteLinePopupOpen = false,
              (result) => {
                vm.isManualCompleteLinePopupOpen = false;
                if (result) {
                  const rowDetail = {
                    refPurchaseOrderDetID: row.entity.id,
                    poLineWorkingStatus: isOpenPOLine ? vm.POLineWorkingStatus.Open.id : vm.POLineWorkingStatus.Close.id,
                    poLineCompleteReason: result,
                    poLineCompleteType: vm.POCompleteType.MANUAL,
                    refPOID: vm.poID
                  };
                  vm.cgBusyLoading = PurchaseOrderFactory.updatePurchaseOrderLineLevelStatus().query(rowDetail).$promise.then((res) => {
                    if (res.data) {
                      _.each(row.entity.PODetail, (item) => {
                        item.poLineWorkingStatus = isOpenPOLine ? vm.POLineWorkingStatus.Open.id : vm.POLineWorkingStatus.Close.id;
                        item.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(item.poLineWorkingStatus);
                        item.poLineCompleteReason = rowDetail.poLineCompleteReason;
                        item.poLineCompleteType = vm.POCompleteType.MANUAL;
                        item.poLineCompleteTypeLabel = CORE.POCompleteStatusTypeDropDown[3].value;
                      });
                      row.entity.poLineWorkingStatus = isOpenPOLine ? vm.POLineWorkingStatus.Open.id : vm.POLineWorkingStatus.Close.id;
                      row.entity.poLineWorkingStatusDisplay = BaseService.getPOLineWorkingStatus(row.entity.poLineWorkingStatus);
                      vm.gridOptions.gridApi.expandable.collapseAllRows();
                      if (sourceData) {
                        sourceData.poLineWorkingStatus = _.clone(row.entity.poLineWorkingStatus);
                        sourceData.poLineWorkingStatusDisplay = _.clone(row.entity.poLineWorkingStatusDisplay);
                        sourceData.PODetail = _.clone(row.entity.PODetail);
                      }
                      vm.checkPurchaseOrderMFR();
                      getPurchaseOrderDetail();
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }, (error) => BaseService.getErrorLog(error));
        });
      };

      vm.setSoNumber = () => {
        setSoHeader();
        vm.checkUniqueSONumber();
      };

      let isopen = false;
      // check unique po# cusromer wise
      vm.checkUniqueSONumber = () => {
        if (!vm.poModel.soNumber || !vm.autoCompleteSupplierMfgCode) { return; }
        if (!isopen) {
          const objSupplier = {
            id: vm.poID ? parseInt(vm.poID) : null,
            supplierID: vm.autoCompleteSupplierMfgCode.keyColumnId,
            soNumber: vm.poModel.soNumber
          };
          return PurchaseOrderFactory.checkUniqueSOWithSupplier().query(objSupplier).$promise.then((purchaseOrder) => {
            if (purchaseOrder && purchaseOrder.data && purchaseOrder.data[0]) {
              isopen = true;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SO_ALREADY_EXIST_SUPPLIER);
              messageContent.message = stringFormat(messageContent.message, vm.poModel.soNumber, vm.mfgCodeName, purchaseOrder.data[0].poNumber);
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                vm.poModel.soNumber = null;
                setFocus('soNumber');
                isopen = false;
                setSoHeader();
              });
              return false;
            } else { return true; }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      // assign so number on header
      const setSoHeader = () => {
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.soNumber = vm.poModel.soNumber;
        }
      };

      vm.checkPartStatusOfPurchaseOrder = () => PurchaseOrderFactory.checkPartStatusOfPurchaseOrder().query({ id: vm.poID }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      vm.changeCancellationConfirmed = () => {
        if (!vm.poModel.CancellationConfirmed) {
          vm.checkPartStatusOfPurchaseOrder().then((response) => {
            if (response && response.mfgParts && response.mfgParts.partStatus === CORE.PartStatusList.InActiveInternal) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_IN_INTERNAL_INACTIVE);
              messageContent.message = stringFormat(messageContent.message, redirectToPartDetail(response.mfgParts.id, response.mfgParts.PIDCode));
              const model = {
                multiple: true,
                messageContent: messageContent
              };
              DialogFactory.messageAlertDialog(model).then(() => vm.poModel.CancellationConfirmed = true);
            }
          });
        }
      };

      vm.showPackingSlipSummaryDetails = (row, refReleaseLineID) => {
        const data = (row && row.parent) ? row.parent : (row || vm.poDetail);
        data.poId = vm.poID;
        data.poNumber = vm.poModel.poNumber;
        data.refReleaseLineID = refReleaseLineID || null;
        DialogFactory.dialogService(
          CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_CONTROLLER,
          CORE.PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_VIEW,
          event,
          data
        ).then(() => { }, () => { });
      };

      vm.changePOCustConsigned = (isCustConsigned) => {
        if (vm.poID) {
          vm.checkPurchaseOrderMFR().then((response) => {
            if (response) {
              alertPackingSlipCreatedMessage(vm.LabelConstant.PURCHASE_ORDER.CustomerConsigned);
              vm.poModel.isCustConsigned = !vm.poModel.isCustConsigned;
            } else {
              vm.POCustConsignedCheckedLogic(isCustConsigned);
            }
          });
        } else {
          vm.POCustConsignedCheckedLogic(isCustConsigned);
        }
      };

      vm.POCustConsignedCheckedLogic = (isCustConsigned) => {
        if (isCustConsigned && vm.autoCompleteCustomer) {
          vm.poModel.customerID = null;
          $scope.$broadcast(vm.autoCompleteCustomer.inputName, null);
        } else {
          const searchObj = {
            inputName: vm.autoCompleteCustomer.inputName,
            type: CORE.MFG_TYPE.MFG,
            isCustomer: true
          };
          getCustomerMappingList(searchObj);
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, (poLine) => {
            if (poLine.isLine === 1 || poLine.totalRelease) {
              poLine.isLineCustConsigned = !isCustConsigned ? true : false;
              poLine.isLineCustConsignedValue = !isCustConsigned ? 'Yes' : 'No';
              poLine.lineCustomerID = null;
              if (!isCustConsigned) {
                poLine.price = 0;
              }
            }
          });
        }
        if (vm.autoCompleteMfgCode.keyColumnId || vm.autocompleteOtherCharges.keyColumnId) {
          vm.poDetail.isLineCustConsigned = !isCustConsigned ? true : false;
          vm.poDetail.isLineCustConsignedValue = !isCustConsigned ? 'Yes' : 'No';
          vm.poDetail.lineCustomerID = null;
          $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
        }
      };

      vm.changePoLineCustConsigned = (isLineCustConsigned) => {
        if (vm.autoCompleteMfgCode.keyColumnId || vm.autocompleteOtherCharges.keyColumnId) {
          if (vm.poID) {
            vm.checkPurchaseOrderMFR().then((response) => {
              if (response) {
                alertPackingSlipCreatedMessage(vm.LabelConstant.PURCHASE_ORDER.CustomerConsigned);
                vm.poDetail.isLineCustConsigned = !vm.poDetail.isLineCustConsigned;
              } else {
                vm.POLineCustConsignedCheckedLogic(isLineCustConsigned);
              }
            });
          } else {
            vm.POLineCustConsignedCheckedLogic(isLineCustConsigned);
          }
        }
      };

      vm.POLineCustConsignedCheckedLogic = (isLineCustConsigned) => {
        if (!isLineCustConsigned) {
          vm.poDetail.price = 0;
          if (vm.poDetail.mfgCodeID && vm.poDetail.isCPN) {
            vm.poDetail.lineCustomerID = vm.poDetail.mfgCodeID;
            if (vm.autoCompleteLineCustomer) {
              getSupplierMfgCodeSearch({
                mfgcodeID: vm.poDetail.lineCustomerID,
                type: CORE.MFG_TYPE.MFG,
                isCustomer: true
              }, true);
            }
          } else {
            const searchObj = {
              inputName: vm.autoCompleteLineCustomer.inputName,
              type: CORE.MFG_TYPE.MFG,
              isCustomer: true
            };
            getCustomerMappingList(searchObj, true);
          }
        } else {
          vm.poDetail.lineCustomerID = null;
          if (vm.autoCompleteLineCustomer) {
            $scope.$broadcast(vm.autoCompleteLineCustomer.inputName, null);
          }
        }
      };

      vm.changePONonUMIDStock = (isNonUMIDStock) => {
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, (poLine) => {
            if (poLine.isLine === 1 || poLine.totalRelease) {
              poLine.isNonUMIDStock = !isNonUMIDStock ? true : false;
              poLine.isNonUMIDStockValue = !isNonUMIDStock ? 'Yes' : 'No';
            }
          });
        }
        if (vm.autoCompleteMfgCode.keyColumnId || vm.autocompleteOtherCharges.keyColumnId) {
          vm.poDetail.isNonUMIDStock = !isNonUMIDStock ? true : false;;
          vm.poDetail.isNonUMIDStockValue = !isNonUMIDStock ? 'Yes' : 'No';
        }
      };

      vm.changePOLineNonUMIDStock = () => {
        if (vm.autoCompleteMfgCode.keyColumnId || vm.autocompleteOtherCharges.keyColumnId) {
          if (vm.poID) {
            vm.checkPurchaseOrderMFR().then((response) => {
              if (response) {
                alertPackingSlipCreatedMessage(vm.LabelConstant.PURCHASE_ORDER.NonUMIDStock);
                vm.poDetail.isNonUMIDStock = !vm.poDetail.isNonUMIDStock;
              }
            });
          }
        }
      };

      function alertPackingSlipCreatedMessage(labelName) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_CHANGE_CUST_CONSIGNED_FIELD);
        let message = '<br/><br/><table style=\'width:100%\'><thead><tr><th class=\'border-bottom padding-5\'>#</th><th class=\'border-bottom padding-5\'>Packing Slip(s)</th></tr></thead><tbody>{0}</tbody></table>';
        const subMessage = [];
        let number = 1;
        _.each(vm.packingSlipGenerate, (packingSlip) => {
          subMessage.push('<tr><td class="border-bottom padding-5 width-40">' + number + ' </td><td class="border-bottom padding-5">' + redirectToPSAnchorTag(packingSlip.id, packingSlip.packingSlipNumber) + '</td></tr>');
          number++;
        });
        const subMsg = subMessage.join('');
        message = stringFormat(message, subMsg);
        messageContent.message = stringFormat(messageContent.message, labelName, redirectToPOAnchorTag(vm.poID, vm.poModel.poNumber), message);
        DialogFactory.messageAlertDialog({ messageContent });
      };

      //////////////////////////Redirection Links////////////////////////////////
      const redirectToPartDetail = (PartID, PIDCode) => {
        const redirectToPartUrl = WebsiteBaseUrl + CORE.URL_PREFIX + USER.ADMIN_COMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_ROUTE + USER.ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE.replace(':mfgType', CORE.MFG_TYPE.MFG.toLowerCase()).replace(':coid', PartID);
        return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPartUrl, PIDCode);
      };
      const redirectToPSAnchorTag = (psid, packingSlipNumber) => {
        const redirectToPSUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_ROUTE.replace(':type', TRANSACTION.PackingSlipTabType.PackingSlip) + TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_ROUTE.replace(':type', TRANSACTION.PackingSlipTabType.PackingSlip).replace(':id', psid);
        return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPSUrl, packingSlipNumber);
      };
      // Redirect to purchase order page by id
      const redirectToPOAnchorTag = (poid, poNumber) => {
        const redirectToPOUrl = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_MAIN_ROUTE + TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_ROUTE.replace(':id', poid);
        return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', redirectToPOUrl, poNumber);
      };
      /** Redirect to part master page */
      vm.goToMFGPartList = () => BaseService.goToPartList();
      /** Redirect to part master page disty page */
      vm.goToSupplierPartList = () => BaseService.goToSupplierPartList();
      //go to employee page list
      vm.employeelist = () => BaseService.goToPersonnelList();
      /** Redirect to UOM page */
      vm.goToUomList = () => BaseService.goToUOMList();
      //link to go supplier list page
      vm.goToSupplierList = () => BaseService.goToSupplierList();
      // go to carrier list page
      vm.goTocarrierList = () => BaseService.goToGenericCategoryCarrierList();
      //go to purchase order
      vm.goTopurchaseOrder = () => BaseService.goToPurchaseOrderList();
      //go to terms list page
      vm.goPaymentTermList = () => BaseService.goToGenericCategoryTermsList();
      //go to shipping method
      vm.goShippingMethodList = () => BaseService.goToGenericCategoryShippingTypeList();
      //go to fob
      vm.goToFOBList = () => BaseService.goToFOB();
      //go to packaging master
      vm.goToPackaging = () => BaseService.goToPackaging();
      //go to rohs page
      vm.goToRoHSStatusList = () => BaseService.goToRohsList();
      /** go to manufacturer page */
      vm.goToMFGList = () => BaseService.goToManufacturerList();
      //go to manufacturer tab
      vm.goToManufacturerDetail = (id) => BaseService.goToManufacturer(id);
      //go to component detail page
      vm.goToComponentDetail = (id) => BaseService.goToComponentDetailTab(null, id);
      //link to go customer list page
      vm.goToCustomerList = () => BaseService.goToCustomerList();
      //link to go customer details page
      vm.goToCustomer = (id) => BaseService.goToCustomer(id);
      //Go To Personal Page
      vm.goToManagePersonal = (id) => BaseService.goToManagePersonnel(id);
      ///////////////////////////////////////////////////////////////////////////

      //page load then it will add forms in page forms
      angular.element(() => {
        BaseService.currentPageForms = [vm.frmPurchaseOrder, vm.PODetForm];
        resetPODetForm();
        vm.isautoFocus = false;
        if ($scope.$parent && $scope.$parent.vm) {
          $scope.$parent.vm.frmPurchaseOrder = vm.frmPurchaseOrder;
          $scope.$parent.vm.PODetForm = vm.PODetForm;
          $scope.$parent.vm.savePurchaseOrder = vm.savePurchaseOrder;
          $scope.$parent.vm.status = vm.poModel.status;
          $scope.$parent.vm.poWorkingStatus = vm.poModel.poWorkingStatus;
          $scope.$parent.vm.poNumber = vm.poModel.poNumber;
          $scope.$parent.vm.isDisabled = vm.isDisable;
          $scope.$parent.vm.label = vm.poModel.status ? CORE.OPSTATUSLABLEDRAFT : CORE.OPSTATUSLABLEPUBLISH;
          $scope.$parent.vm.changePurchaseOrderStatus = vm.changePurchaseOrderStatus;
          $scope.$parent.vm.activeTab = 0;
          $scope.$parent.vm.updatePurchaseOrderDetails = getPurchaseOrderDetail;
          $scope.$parent.vm.checkPurchaseOrderMFR = vm.checkPurchaseOrderMFR;
          $scope.$parent.vm.checkPartStatusOfPurchaseOrder = vm.checkPartStatusOfPurchaseOrder;
          $scope.$parent.vm.redirectToPOAnchorTag = redirectToPOAnchorTag;
          $scope.$parent.vm.goTopurchaseOrder = vm.goTopurchaseOrder;
          $scope.$parent.vm.goToSupplierList = vm.goToSupplierList;
          $scope.$parent.vm.isSaveDisabled = vm.isSaveDisabled;
          $scope.$parent.vm.lockStatus = vm.poModel.lockStatus;
          $scope.$parent.vm.lockedBy = vm.poModel.lockedBy;
          $scope.$parent.vm.lockedAt = vm.poModel.lockedAt;
          $scope.$parent.vm.lockedByName = vm.poModel.lockedByName;
        }
        if (vm.poID) {
          //  setFocus('poDate');
          vm.isautoFocus = true;
        }
      });
    }
  }) ();
