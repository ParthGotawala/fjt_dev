(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('BaseService', BaseService);

  /** @ngInject */
  function BaseService($window, $state, $rootScope, $filter, $http, CORE, store, ChatFactory, CHAT,
    socketConnectionService, msNavigationService, UserLogoutFactory, $mdDialog, $timeout, DialogFactory, $mdSidenav, REPORTS, DYNAMIC_REPORTS,
    $log, EmployeeFactory, $q, WORKORDER, TRAVELER, USER, TRANSACTION, CONFIGURATION, RFQTRANSACTION, OPERATION, textAngularManager,
    NOTIFICATION, NotificationFactory, WarehouseBinFactory, CompanyProfileFactory, ImportExportFactory, SalesOrderFactory, ENTERPRISE_SEARCH, DbScriptFactory) {
    _IdentityUserManagerconfig.userStore = new WebStorageStateStore({ store: window.localStorage });
    $rootScope.manager = new UserManager(_IdentityUserManagerconfig); //[PP] : for Identity Server

    const service = {
      loginUser: null,
      loginUserPageList: null,
      isLoggedOut: false,
      setLoginUser: setLoginUser,
      setLoginUserPageList: setLoginUserPageList,
      getReadOnlyRights: getReadOnlyRights,
      logout: logout,
      logoutUser: logoutUser,
      isMobile: true,
      isChangePriceSelector: false,
      getOpStatus: getOpStatus,
      getOpStatusClassName: getOpStatusClassName,
      getCostingTypeClassName: getCostingTypeClassName,
      getWoStatus: getWoStatus,
      getWoStatusClassName: getWoStatusClassName,
      getWoTypeClassName: getWoTypeClassName,
      getWarehouseType: getWarehouseType,
      getErrorLog: getErrorLog,
      setDashboardPin: setDashboardPin,
      setCurrentLangauge: setCurrentLangauge,
      getDashboardPin: getDashboardPin,
      getCurrentLangauge: getCurrentLangauge,
      getWoOpFirstArticleStatus: getWoOpFirstArticleStatus,
      getCrumbs: getCrumbs,
      getPageTitle: getPageTitle,
      deleteAlertMessage: deleteAlertMessage,
      deleteAlertMessageWithHistory: deleteAlertMessageWithHistory,
      checkFormValid: checkFormValid,
      checkFormDirty: checkFormDirty,
      getcompStatusClassName: getcompStatusClassName,
      getRohsStatusClassName: getRohsStatusClassName,
      checkFeatureRights: checkFeatureRights,
      //getDataElementTransactionList: getDataElementTransactionList,
      showWithoutSavingAlertForPopUp: showWithoutSavingAlertForPopUp,
      reloadUIGrid: reloadUIGrid,
      formatToSixDigit: formatToSixDigit,
      checkForVisibleColumnInGrid: checkForVisibleColumnInGrid,
      checkForDateNullValue: checkForDateNullValue,
      setLoginUserChangeDetail: setLoginUserChangeDetail,
      dynamicAlertPopup: dynamicAlertPopup,
      logoutWithOperationConfirmation: logoutWithOperationConfirmation,
      // UserRightChange: null,
      getIsActiveStatus: getIsActiveStatus,
      getPartMasterImageURL: getPartMasterImageURL,
      openInNew: openInNew,
      openURLInNew: openURLInNew,
      getMaxLengthValidation: getMaxLengthValidation,
      getMinNumberValueValidation: getMinNumberValueValidation,
      getMinLengthValidation: getMinLengthValidation,
      getDescrLengthValidation: getDescrLengthValidation,
      setPrintStorage: setPrintStorage,
      convertThreeDecimal: convertThreeDecimal,
      goToWorkorderList: goToWorkorderList,
      goToWorkorderDetails: goToWorkorderDetails,
      goToWorkorderReviewDetails: goToWorkorderReviewDetails,
      goToPartList: goToPartList,
      goToSupplierPartList: goToSupplierPartList,
      goToSupplierPartDetails: goToSupplierPartDetails,
      goToAssemblyOpeningBalanceDetails: goToAssemblyOpeningBalanceDetails,
      goToOperationList: goToOperationList,
      goToTravelerOperationDetails: goToTravelerOperationDetails,
      goToCustomerList: goToCustomerList,
      goToCameraList: goToCameraList,
      goToCustomerCPNList: goToCustomerCPNList,
      goToAssyTypeList: goToAssyTypeList,
      goToCustomer: goToCustomer,
      goToManageSalesOrder: goToManageSalesOrder,
      goToSalesOrderList: goToSalesOrderList,
      goToWorkorderOperationDetails: goToWorkorderOperationDetails,
      goToWorkorderOperationReviewDetails: goToWorkorderOperationReviewDetails,
      goToStandardList: goToStandardList,
      goToStandardDetails: goToStandardDetails,
      goToAssignPersonnel: goToAssignPersonnel,
      goToComponentBOM: goToComponentBOM,
      goToComponentBOMWithSubAssy: goToComponentBOMWithSubAssy,
      goToComponentBOMWithKeyWord: goToComponentBOMWithKeyWord,
      goToComponentBOMWithSubAssyAndKeyWord: goToComponentBOMWithSubAssyAndKeyWord,
      goToComponentDetailTab: goToComponentDetailTab,
      goToComponentSalesPriceMatrixTab: goToComponentSalesPriceMatrixTab,
      goToWorkorderManualEntryList: goToWorkorderManualEntryList,
      goToWorkorderECORequestList: goToWorkorderECORequestList,
      goToWorkorderDFMRequestList: goToWorkorderDFMRequestList,
      goToAddWorkorderECORequest: goToAddWorkorderECORequest,
      goToAddWorkorderDFMRequest: goToAddWorkorderDFMRequest,
      goToWorkorderChangeLog: goToWorkorderChangeLog,
      goToWorkorderProfile: goToWorkorderProfile,
      goToOperationProfile: goToOperationProfile,
      goToEmployeeProfile: goToEmployeeProfile,
      goToEquipmentProfile: goToEquipmentProfile,
      goToElementManage: goToElementManage,
      goToManufacturerList: goToManufacturerList,
      goToRFQUpdate: goToRFQUpdate,
      goToPartCosting: goToPartCosting,
      goToLabor: goToLabor,
      goToSupplierList: goToSupplierList,
      goToSupplierDetail: goToSupplierDetail,
      goToSupplierBillTo: goToSupplierBillTo,
      goToSupplierBusinessAddress: goToSupplierBusinessAddress,
      goToSupplierWireTransferAddress: goToSupplierWireTransferAddress,
      goToSupplierRMAIntermediateAddress: goToSupplierRMAIntermediateAddress,
      goToSupplierBankRemitTo: goToSupplierBankRemitTo,
      goToCompanyProfileRemitTo: goToCompanyProfileRemitTo,
      goToPersonnelList: goToPersonnelList,
      goToGenericCategoryTitleList: goToGenericCategoryTitleList,
      goToGenericCategoryDocumentTypeList: goToGenericCategoryDocumentTypeList,
      goToBOMDefaultCommentTab: goToBOMDefaultCommentTab,
      goToRFQReasonTab: goToRFQReasonTab,
      goToInvoiceApprovedMessageTab: goToInvoiceApprovedMessageTab,
      goToWHList: goToWHList,
      goToBinList: goToBinList,
      goToRackList: goToRackList,
      goToUMIDList: goToUMIDList,
      goToUMIDDetail: goToUMIDDetail,
      goToSupplierQuoteList: goToSupplierQuoteList,
      goToSupplierAttributeTemplate: goToSupplierAttributeTemplate,
      goToUOMList: goToUOMList,
      searchToDigikey: searchToDigikey,
      searchToGoogle: searchToGoogle,
      goToStandardCaregoryList: goToStandardCaregoryList,
      goToFunctionalTypeList: goToFunctionalTypeList,
      goToMountingTypeList: goToMountingTypeList,
      goToPackageCaseTypeList: goToPackageCaseTypeList,
      searchToFindChip: searchToFindChip,
      searchToArrow: searchToArrow,
      searchToAvnet: searchToAvnet,
      searchToMouser: searchToMouser,
      searchToNewark: searchToNewark,
      searchToTTI: searchToTTI,
      searchToOctopart: searchToOctopart,
      getMaxDateValidation: getMaxDateValidation,
      getMinDateValidation: getMinDateValidation,
      goToManufacturer: goToManufacturer,
      goToEquipmentWorkstationList: goToEquipmentWorkstationList,
      goToManageEquipmentWorkstation: goToManageEquipmentWorkstation,
      goToLabelTemplateList: goToLabelTemplateList,
      goTowhoAcquiredWhoList: goTowhoAcquiredWhoList,
      goToRFQList: goToRFQList,
      goToCountryList: goToCountryList,
      goToJobTypeList: goToJobTypeList,
      goToKitList: goToKitList,
      goToKitPreparation: goToKitPreparation,
      goToPurchaseList: goToPurchaseList,
      getEntityStatus: getEntityStatus,
      goToPackingSlipList: goToPackingSlipList,
      goToSupplierInvoiceList: goToSupplierInvoiceList,
      goToSupplierInvoiceDetail: goToSupplierInvoiceDetail,
      goToManagePackingSlipDetail: goToManagePackingSlipDetail,
      goToKitDataList: goToKitDataList,
      setInputValidity: setInputValidity,
      goToPackaging: goToPackaging,
      currentPageForms: [],
      currentPagePopupForm: [],
      currentPageFlagForm: [],
      getFormForValidation: getFormForValidation,
      checkAllFormDirtyValidation: checkAllFormDirtyValidation,
      setFormForValidation: setFormForValidation,
      getPopupFormForValidation: getPopupFormForValidation,
      getFlagFormForValidation: getFlagFormForValidation,
      goToMountingGroupList: goToMountingGroupList,
      focusRequiredField: focusRequiredField,
      focusOnFirstEnabledField: focusOnFirstEnabledField,
      focusOnFirstEnabledFieldOnDirtyStateOrApiResponse: focusOnFirstEnabledFieldOnDirtyStateOrApiResponse,
      goToManagePersonnel: goToManagePersonnel,
      goToTransferMaterial: goToTransferMaterial,
      existsAssyListForMFGAliasDelete: existsAssyListForMFGAliasDelete,
      retriveSearchRecord: retriveSearchRecord,
      getAPIFormatedDate: getAPIFormatedDate,
      getAPIFormatedDateTime: getAPIFormatedDateTime,
      getUIFormatedDate: getUIFormatedDate,
      getUIFormatedStringDate: getUIFormatedStringDate,
      getUIFormatedDateTime: getUIFormatedDateTime,
      getUIFormatedDateTimeInCompanyTimeZone: getUIFormatedDateTimeInCompanyTimeZone,
      getUIFormatedTimeFromTimeString: getUIFormatedTimeFromTimeString,
      getCurrentDate: getCurrentDate,
      getCurrentDateTime: getCurrentDateTime,
      getCurrentTime: getCurrentTime,
      validateTransferStock: validateTransferStock,
      goToQuoteAttributeList: goToQuoteAttributeList,
      goToAddUpdateWorkorderManualEntry: goToAddUpdateWorkorderManualEntry,
      checkRightToAccessPopUp: checkRightToAccessPopUp,
      setWareHouseSide: setWareHouseSide,
      goToCreateFormsElementManage: goToCreateFormsElementManage,
      getEntityStatusClassName: getEntityStatusClassName,
      goToPOStatusAssemblyReport: goToPOStatusAssemblyReport,
      getGenericDraftPublishStatus: getGenericDraftPublishStatus,
      getGenericDraftPublishStatusClassName: getGenericDraftPublishStatusClassName,
      goToWorkorderStandards: goToWorkorderStandards,
      goToWorkorderDocuments: goToWorkorderDocuments,
      goToWorkorderOperations: goToWorkorderOperations,
      goToWorkorderParts: goToWorkorderParts,
      goToWorkorderEquipments: goToWorkorderEquipments,
      goToWorkorderDataFields: goToWorkorderDataFields,
      goToWorkorderEmployees: goToWorkorderEmployees,
      goToRoleAddUpdate: goToRoleAddUpdate,
      goToWorkorderOtherdetails: goToWorkorderOtherdetails,
      goToWorkorderInvitePeoples: goToWorkorderInvitePeoples,
      goToWorkorderOperationDoDonts: goToWorkorderOperationDoDonts,
      goToWorkorderOperationDocuments: goToWorkorderOperationDocuments,
      goToWorkorderOperationDatafields: goToWorkorderOperationDatafields,
      goToWorkorderOperationEquipments: goToWorkorderOperationEquipments,
      goToWorkorderOperationParts: goToWorkorderOperationParts,
      goToWorkorderOperationEmployees: goToWorkorderOperationEmployees,
      goToWorkorderOperationOtherDetails: goToWorkorderOperationOtherDetails,
      goToWorkorderOperationFirstArticles: goToWorkorderOperationFirstArticles,
      //getMaxLengthValidationForTextEditor: getMaxLengthValidationForTextEditor,
      setDepartmentbyUser: setDepartmentbyUser,
      goToGenericCategoryChargeTypeList: goToGenericCategoryChargeTypeList,
      goToGenericCategoryPayablePaymentMethodList: goToGenericCategoryPayablePaymentMethodList,
      goToGenericCategoryReceivablePaymentMethodList: goToGenericCategoryReceivablePaymentMethodList,
      goToGenericCategoryPaymentTypeCategoryList: goToGenericCategoryPaymentTypeCategoryList,
      goToBankList: goToBankList,
      setInvalidDisplayOrder: setInvalidDisplayOrder,
      goToNotificationList: goToNotificationList,
      moveArrayObjToOtherIndex: moveArrayObjToOtherIndex,
      goToNonUMIDStockList: goToNonUMIDStockList,
      goToLaborCostTemplateList: goToLaborCostTemplateList,
      goToManageOperation: goToManageOperation,
      goToGenericCategoryManageLocation: goToGenericCategoryManageLocation,
      goToManageOperationManagement: goToManageOperationManagement,
      goToGenericCategoryLocationsList: goToGenericCategoryLocationsList,
      goToGenericCategoryEquipmentGroupList: goToGenericCategoryEquipmentGroupList,
      goToGenericCategoryEquipmentTypeList: goToGenericCategoryEquipmentTypeList,
      goToGenericCategoryEquipmentOwnershipList: goToGenericCategoryEquipmentOwnershipList,
      goToGenericCategoryStandardTypeList: goToGenericCategoryStandardTypeList,
      goToGenericCategoryOperationTypeList: goToGenericCategoryOperationTypeList,
      goToGenericCategoryShippingStatusList: goToGenericCategoryShippingStatusList,
      goToGenericCategoryOperationVerificationStatusList: goToGenericCategoryOperationVerificationStatusList,
      goToGenericCategoryWorkAreaList: goToGenericCategoryWorkAreaList,
      goToGenericCategoryShippingTypeList: goToGenericCategoryShippingTypeList,
      goToManageGenericCategoryShippingType: goToManageGenericCategoryShippingType,
      goToGenericCategoryTermsList: goToGenericCategoryTermsList,
      goToGenericCategoryManageTerms: goToGenericCategoryManageTerms,
      goToGenericCategoryPrinterList: goToGenericCategoryPrinterList,
      goToGenericCategoryPartStatusList: goToGenericCategoryPartStatusList,
      goToGenericCategoryBarcodeSeparatorList: goToGenericCategoryBarcodeSeparatorList,
      goToGenericCategoryHomeMenuList: goToGenericCategoryHomeMenuList,
      goToGenericCategoryECO_DFMTypeList: goToGenericCategoryECO_DFMTypeList,
      goToCofC: goToCofC,
      goToPackingSlipDocument: goToPackingSlipDocument,
      goToGenericCategoryNotificationCategoryList: goToGenericCategoryNotificationCategoryList,
      goToCreditMemoDetail: goToCreditMemoDetail,
      goToDebitMemoDetail: goToDebitMemoDetail,
      goToSmartCartWHList: goToSmartCartWHList,
      gotoDataKeyList: gotoDataKeyList,
      goToDataSourceList: goToDataSourceList,
      goToUnauthorizeRequestList: goToUnauthorizeRequestList,
      gotoTaskList: gotoTaskList,
      getTransferBulkURL: getTransferBulkURL,
      gotoTransactionRequestPage: gotoTransactionRequestPage,
      generateRedirectLinkForKit: generateRedirectLinkForKit,
      removePickUserDeatil: removePickUserDeatil,
      selectedtransactionID: null,
      goToRohsList: goToRohsList,
      goToDynamicReportViewer: goToDynamicReportViewer,
      goToPartPurchaseInspectionRequirement: goToPartPurchaseInspectionRequirement,
      goToTemplatePurchaseInspectionRequirement: goToTemplatePurchaseInspectionRequirement,
      goToPurchaseInspectionRequirement: goToPurchaseInspectionRequirement,
      setPageSizeOfGrid: setPageSizeOfGrid,
      goToCustomerPackingSlipList: goToCustomerPackingSlipList,
      goToManageCustomerPackingSlip: goToManageCustomerPackingSlip,
      goToCustomerPackingSlipDocument: goToCustomerPackingSlipDocument,
      goToFOB: goToFOB,
      isUnHandleException: false,
      goToSupplierQuoteWithPartDetail: goToSupplierQuoteWithPartDetail,
      goToCustomerInvoiceList: goToCustomerInvoiceList,
      goToManageCustomerInvoice: goToManageCustomerInvoice,
      goToCustomerInvoiceDocument: goToCustomerInvoiceDocument,
      goToEmailTemplateList: goToEmailTemplateList,
      goToAgreementTemplateList: goToAgreementTemplateList,
      goToUserAgreementTemplateList: goToUserAgreementTemplateList,
      goToPackagingBoxSerialList: goToPackagingBoxSerialList,
      validateDateCode: validateDateCode,
      setBrowserTabTitleManually: setBrowserTabTitleManually,
      goToPartStandardTab: goToPartStandardTab,
      goToChartOfAccountList: goToChartOfAccountList,
      goToAccountTypeList: goToAccountTypeList,
      goToReportCategoryList: goToReportCategoryList,
      goToTemplateReportList: goToTemplateReportList,
      goToOperationMasterTemplateList: goToOperationMasterTemplateList,
      openTransferBin: openTransferBin,
      openCountMaterial: openCountMaterial,
      openTransferMaterial: openTransferMaterial,
      goToGenericCategoryCarrierList: goToGenericCategoryCarrierList,
      goToGenericCategoryPartRequirementCategoryList: goToGenericCategoryPartRequirementCategoryList,
      goToManageGenericCategoryPartRequirementCategory: goToManageGenericCategoryPartRequirementCategory,
      goToManageGenericCategoryCarrier: goToManageGenericCategoryCarrier,
      goToSupplierRMAList: goToSupplierRMAList,
      goToManageSupplierRMA: goToManageSupplierRMA,
      goToPurchaseOrderList: goToPurchaseOrderList,
      goToPurchaseOrderDetail: goToPurchaseOrderDetail,
      goToPurchaseOrderDetailPerLineList: goToPurchaseOrderDetailPerLineList,
      goToCustomerContactPersonList: goToCustomerContactPersonList,
      goToCustomerBillingAddressList: goToCustomerBillingAddressList,
      goToCustomerBusinessAddressList: goToCustomerBusinessAddressList,
      goToCustomerWireTransferAddress: goToCustomerWireTransferAddress,
      goToCustomerShippingAddressList: goToCustomerShippingAddressList,
      goToCustomerMarkForAddressList: goToCustomerMarkForAddressList,
      goToSupplierRMAAddress: goToSupplierRMAAddress,
      goToCustomerRMAAddress: goToCustomerRMAAddress,
      goToPurchaseOrderDocumentsDetail: goToPurchaseOrderDocumentsDetail,
      goToComponentUMIDList: goToComponentUMIDList,
      getCustomerPackingSlipStatus: getCustomerPackingSlipStatus,
      getCustomerPackingSlipStatusClassName: getCustomerPackingSlipStatusClassName,
      goToAddCustomerInvoice: goToAddCustomerInvoice,
      goToCreditMemoList: goToCreditMemoList,
      goToDebitMemoList: goToDebitMemoList,
      generateAddressFormateForStoreInDB: generateAddressFormateForStoreInDB,
      getFormatedTextAngularValue: getFormatedTextAngularValue,
      getFormatedHistoryDataList: getFormatedHistoryDataList,
      getCustInvStatusClassName: getCustInvStatusClassName,
      goToCustomerInvoicePackingSlipDocument: goToCustomerInvoicePackingSlipDocument,
      getCustomerPackingSlipMainStatusClassName: getCustomerPackingSlipMainStatusClassName,
      getCurrentDateTimeUI: getCurrentDateTimeUI,
      goToCustomerCreditMemoList: goToCustomerCreditMemoList,
      goToCustomerCreditMemoDetail: goToCustomerCreditMemoDetail,
      downloadReport: downloadReport,
      goToCustomerPaymentList: goToCustomerPaymentList,
      goToCustomerPaymentDetail: goToCustomerPaymentDetail,
      goToCustomerInvoicePackingSlipList: goToCustomerInvoicePackingSlipList,
      getPOLineWorkingStatus: getPOLineWorkingStatus,
      goToCustomerPaymentDocument: goToCustomerPaymentDocument,
      openTargetPopup: openTargetPopup,
      getCustPaymentLockStatusClassName: getCustPaymentLockStatusClassName,
      getCustPaymentStatusClassName: getCustPaymentStatusClassName,
      goToCustInvListWithTermsDueDateSearch: goToCustInvListWithTermsDueDateSearch,
      goToCustCMListWithTermsDueDateSearch: goToCustCMListWithTermsDueDateSearch,
      goToHelpBlogDetail: goToHelpBlogDetail,
      goToApplyCustCreditMemoToPayment: goToApplyCustCreditMemoToPayment,
      goToAppliedCustCreditMemoToInvList: goToAppliedCustCreditMemoToInvList,
      getReceivableRefPayTypeClassName: getReceivableRefPayTypeClassName,
      disableReadOnlyControl: disableReadOnlyControl,
      setElementForDisabledReadOnly: setElementForDisabledReadOnly,
      previewPopoverImage: previewPopoverImage,
      openSplitUID: openSplitUID,
      searchToHeilind: searchToHeilind,
      goToAppliedCustCreditMemoDocument: goToAppliedCustCreditMemoDocument,
      goToApplyCustWriteOffToPayment: goToApplyCustWriteOffToPayment,
      goToAppliedCustWriteOffToInvList: goToAppliedCustWriteOffToInvList,
      goToAppliedCustWriteOffDocument: goToAppliedCustWriteOffDocument,
      goToQuoteSummary: goToQuoteSummary,
      getDateFilterOptions: getDateFilterOptions,
      checkFormDirtyExceptParticularControl: checkFormDirtyExceptParticularControl,
      goToManageDepartment: goToManageDepartment,
      getCustRefundStatusClassName: getCustRefundStatusClassName,
      goToCustomerRefundDetail: goToCustomerRefundDetail,
      goToCustomerRefundDocument: goToCustomerRefundDocument,
      goToCustomerRefundList: goToCustomerRefundList,
      goToSupplierRefundList: goToSupplierRefundList,
      goToSupplierRefundDetail: goToSupplierRefundDetail,
      goToSupplierPaymentList: goToSupplierPaymentList,
      goToSupplierPaymentDetail: goToSupplierPaymentDetail,
      exportSalesCommissionDetail: exportSalesCommissionDetail,
      loginIDS: loginIDS,
      logoutIDS: logoutIDS,
      completeLogout: completeLogout,
      completeSilentRenewal: completeSilentRenewal,
      signoutListner: signoutListner,
      openURLWithTokenInNew: openURLWithTokenInNew,
      getReportStatusClassName: getReportStatusClassName,
      getsystemGeneratedStatusClassName: getsystemGeneratedStatusClassName,
      redirectToDesigner: redirectToDesigner,
      redirectToViewer: redirectToViewer,
      downloadReportFromReportingTool: downloadReportFromReportingTool,
      getCustRefundPaymentStatusClassName: getCustRefundPaymentStatusClassName,
      getCustCreditMemoRefundStatusClassName: getCustCreditMemoRefundStatusClassName,
      getCustCreditAppliedStatusClassName: getCustCreditAppliedStatusClassName,
      goToSalesOrderPartList: goToSalesOrderPartList,
      showReloadPageAlertForPopUp: showReloadPageAlertForPopUp,
      getCustomerRefundSubStatus: getCustomerRefundSubStatus,
      getCustRefundSubStatusClassName: getCustRefundSubStatusClassName,
      goToCustomerInvoiceDetailList: goToCustomerInvoiceDetailList,
      goToCustomerInvPackingSlipDetailList: goToCustomerInvPackingSlipDetailList,
      goToTransactionModesList: goToTransactionModesList,
      goToManageTransactionModes: goToManageTransactionModes,
      goToEnterpriseSearch: goToEnterpriseSearch,
      goToRFQTypeList: goToRFQTypeList,
      goToRequirementTemplateList: goToRequirementTemplateList,
      goToRFQLineitemsErrorcodeList: goToRFQLineitemsErrorcodeList,
      goToKeywordList: goToKeywordList,
      goToManageLaborCostTemplate: goToManageLaborCostTemplate,
      goToSupplierQuoteAttributelist: goToSupplierQuoteAttributelist,
      setLatestLoginUserLocalStorageDet: setLatestLoginUserLocalStorageDet,
      getMfgCodeNameFormat: getMfgCodeNameFormat,
      goToAliasValidationList: goToAliasValidationList,
      generateComponentRedirectURL: generateComponentRedirectURL,
      getHyperlinkHtml: getHyperlinkHtml,
      loadAllCustPackingSlipListSummByCust: loadAllCustPackingSlipListSummByCust,
      goToPOStatusSalseOrderReport: goToPOStatusSalseOrderReport,
      showVersionHistory: showVersionHistory,
      applyContactPersonDispNameFormat: applyContactPersonDispNameFormat,
      convertSpecialCharToSearchString: convertSpecialCharToSearchString,
      generateContactPersonDetFormat: generateContactPersonDetFormat,
      goToContactPersonList: goToContactPersonList,
      generateAddressFormateToStoreInDB: generateAddressFormateToStoreInDB,
      goToCustTypeContactPersonList: goToCustTypeContactPersonList,
      goToKitReleaseCommentTab: goToKitReleaseCommentTab,
      goToSupplierShipTo: goToSupplierShipTo,
      validateEnterpriseSearchCriteria: validateEnterpriseSearchCriteria,
      generateUMIDRedirectURL: generateUMIDRedirectURL,
      generatePackingSlipRedirectURL: generatePackingSlipRedirectURL,
      generateManufacturerDetailRedirectURL: generateManufacturerDetailRedirectURL,
      generateDataKeyRedirectURL: generateDataKeyRedirectURL,
      convertJsonPhoneNumberToSting: convertJsonPhoneNumberToSting,
      goToCompanyProfileContact: goToCompanyProfileContact,
      goToDCFormatList: goToDCFormatList
    };

    init();
    function init() {
      service.loginUser = getLocalStorageValue('loginuser');
      // service.UserRightChange = store.get('UserRightChange');
      if (service.loginUser) {
        //$http.defaults.headers.common['Authorization'] = 'Bearer ' + service.loginUser.token;
      }
      else {
        /* only for debug purpose - [S]*/
        let tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
          tractActivityLog = [];
        }
        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove loginuser: init base-service.' };
        tractActivityLog.push(obj);
        setLocalStorageValue('tractActivityLog', tractActivityLog);
        /* [E]*/
        removeLocalStorageValue('loginuser');
        store.remove('ApplicationMenuShortcutList');
        // console.log('init');
        service.loginUser = null;
      }
      if (screen.width > 768) {
        service.isMobile = false;
      }
      // check loading site is in up to tablet size
      $rootScope.isSiteLoadUpToTabletSize = screen.width <= 1024 ? true : false;

      // called when browser/screen re-size
      window.onresize = function () {
        $rootScope.isSiteLoadUpToTabletSize = screen.width <= 1024 ? true : false;
      };

      window.onbeforeunload = function () {
        if (service.selectedtransactionID) {
          service.removePickUserDeatil(service.selectedtransactionID);
        }
        const formDirty = service.checkAllFormDirtyValidation();
        if (formDirty) {
          return CORE.MESSAGE_CONSTANT.CLOSE_WINDOW_MESSAGE;
        }
        else {
          return;
        }
      };
    }
    let userData;
    function setLoginUser(userObj, empData) {
      //update only profile image.
      if (empData && !userObj) {
        if (empData.empID && service.loginUser && (service.loginUser.employee.id == empData.empID)) {
          userData = service.loginUser;
          userData.employee.profileImg = empData.profileImg;
          // store.remove('loginuser');
          /* only for debug purpose - [S]*/
          let tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
            tractActivityLog = [];
          }
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'set Loginuser from setLoginUser_1' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
          /* [E]*/
          setLocalStorageValue('loginuser', userData);
          // store.set('UserRightChange', false);
        }
      }
      if (userObj && !empData) {
        if (userObj.roles && userObj.roles.length > 0) {
          //check login user role as a super Admin or Executive
          const userRoleAdmin = _.find(userObj.roles, (role) => {
            if (role.id === userObj.defaultLoginRoleID) {
              return role.name.toLowerCase() === CORE.Role.SuperAdmin.toLowerCase() || role.name.toLowerCase() === CORE.Role.Executive.toLowerCase();
            }
          });
          //check login user role as a operator
          const userRoleOperator = _.find(userObj.roles, (role) => {
            if (role.id === userObj.defaultLoginRoleID) {
              return role.name.toLowerCase() === CORE.Role.Operator.toLowerCase();
            }
          });

          const userRoleSuperAdmin = _.find(userObj.roles, (role) => {
            if (role.id === userObj.defaultLoginRoleID) {
              return role.name.toLowerCase() === CORE.Role.SuperAdmin.toLowerCase();
            }
          });
          // check login user role manager
          const userRoleManager = _.find(userObj.roles, (role) => {
            if (role.id === userObj.defaultLoginRoleID) {
              return role.name.toLowerCase() === CORE.Role.Manager.toLowerCase();
            }
          });

          if (userObj && userObj.defaultLoginRoleID) {
            userObj.isUserAdmin = false;
            userObj.isUserOperator = false;
            userObj.isUserManager = false;
            userObj.isUserSuperAdmin = false;
            if (userRoleAdmin && userRoleAdmin.id === userObj.defaultLoginRoleID) {
              userObj.isUserAdmin = true;
              userObj.isUserOperator = false;
              userObj.isUserManager = false;
            }
            else {
              if (userRoleOperator && userRoleOperator.id === userObj.defaultLoginRoleID) {
                userObj.isUserOperator = true;
              }
              else if (userRoleManager && userRoleManager.id === userObj.defaultLoginRoleID) {
                userObj.isUserManager = true;
              }
            }
            if (userRoleSuperAdmin && userRoleSuperAdmin.id === userObj.defaultLoginRoleID) {
              userObj.isUserSuperAdmin = true;
            }
          }
        }

        if (userObj.onlineStatus && userObj.onlineStatus !== CHAT.USER_STATUS.DONOTDISTURB && !userObj.userTimeout && !userObj.isRemainOldStatus) {
          userObj.onlineStatus = CHAT.USER_STATUS.ONLINE;
        }
        service.loginUser = userObj;
        /* only for debug purpose - [S]*/
        let tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
          tractActivityLog = [];
        }
        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'set Loginuser from setLoginUser_2' };
        tractActivityLog.push(obj);
        setLocalStorageValue('tractActivityLog', tractActivityLog);
        /* [E]*/
        setLocalStorageValue('loginuser', userObj);
        // store.set('UserRightChange', false);

        // set user status to online for chat
        changeUserStatusOnline(userObj);
      }
      else if (!userObj && !empData) {
        /* only for debug purpose - [S]*/
        let tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
          tractActivityLog = [];
        }
        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'set loginuser null from setLoginUser' };
        tractActivityLog.push(obj);
        setLocalStorageValue('tractActivityLog', tractActivityLog);
        /* [E]*/
        removeLocalStorageValue('loginuser');
        store.remove('ApplicationMenuShortcutList');
        // console.log('setLoginUser2');
        service.loginUser = null;
        // store.set('UserRightChange', false);
        //$http.defaults.headers.common['Authorization'] = null;
      }
    }

    function setLoginUserChangeDetail(isChange) {
      setLocalStorageValue('passwordchange', isChange);
      if (isChange) {
        $rootScope.manager.signinSilent();
      }
    }

    function logout() {
      if (!service.isLoggedOut) {  // Multiple 401 case logged out only once.
        // store.set('isUserOverridden', false);
        setLocalStorageValue('isUserOverridden', false);
        if (!(_.find(CORE.EXCLUDE_PAGE, (page) => page === $state.current.name))) {
          const previousState = JSON.parse(sessionStorage.getItem('previousStateObj'));
          if (!previousState) {
            const previousStateObj = {
              stateName: $state.current.name,
              stateParams: $state.params
            };
            sessionStorage.setItem('previousStateObj', JSON.stringify(previousStateObj));
          }
        }
        /* only for debug purpose - [S]*/
        let tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
          tractActivityLog = [];
        }
        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service logout' };
        tractActivityLog.push(obj);
        setLocalStorageValue('tractActivityLog', tractActivityLog);
        /* [E]*/
        logoutUser();
      }
    }

    function checkAllFormDirtyValidation() {
      let returnVal = false;
      const forms = service.getFormForValidation();
      const popupforms = service.getPopupFormForValidation();
      const flagforms = service.getFlagFormForValidation();
      if (forms.length > 0 || popupforms.length > 0 || flagforms.length > 0) {
        const findDirtyForm = _.find(forms, (form) => {
          return form && form.$dirty;
        });
        const findDirtypopupForm = _.find(popupforms, (form) => {
          return form && form.$dirty;
        });
        const findDirtyFlagForm = _.find(flagforms, (form) => {
          return form && (form == true);
        });
        if (findDirtyForm || findDirtypopupForm || findDirtyFlagForm) {
          returnVal = true;
        }
      }
      return returnVal;
    }

    function logoutUser() {
      /* Testing Purpose -S */
      if (_isSaveIdentityLogInTextFile) {
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        DbScriptFactory.saveTractActivityLog().query({ tractActivityLog: tractActivityLog }).$promise.then(() => {
          // Empty block.
        });
      }
      /* -E */
      const loginuser = JSON.parse(localStorage.getItem('loginuser'));
      if (loginuser && loginuser.userid && loginuser.onlineStatus !== CHAT.USER_STATUS.DONOTDISTURB) {
        // called only once throught all open UI tabs.
        changeUserStatusOffline(loginuser.userid);
      }

      const formDirty = service.checkAllFormDirtyValidation();
      if (loginuser && formDirty) {
        const alertData = {
          cleanForm: true, isLogout: true, params: null, callbackFn: function () {
            /* only for debug purpose - [S]*/
            const tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (tractActivityLog && Array.isArray(tractActivityLog)) {
              const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service logoutUser' };
              tractActivityLog.push(obj);
              setLocalStorageValue('tractActivityLog', tractActivityLog);
            }
            /* [E]*/
            service.logoutUser();
          }
        };
        service.showWithoutSavingAlertForPopUp(alertData);
      }
      else {
        service.isLoggedOut = true;
        if (formDirty) {
          _.each(service.currentPageForms, (objform) => {
            if (objform) {
              objform.$setPristine();
            }
          });
          service.currentPageForms = [];
          service.currentPagePopupForm = [];
          service.currentPageFlagForm = [];
        }
        if ($rootScope.previousState) {
          $rootScope.previousState = null;
        }
        /* only for debug purpose - [S]*/
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'called: logoutUser' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
        }
        /* [E]*/
        UserLogoutFactory.query({
          username: service.loginUser ? service.loginUser.username : null,
          userID: service.loginUser ? service.loginUser.userid : null
        }).$promise.then((result) => {
          logoutIDS();
          setLoginUser(null, null);
          $mdDialog.hide('', { closeAll: true });
          $rootScope.pageTitle = 'Login';
          // store.remove('UserRightChange');
          removeLocalStorageValue('passwordchange');
        }).catch(() => {
          setLoginUser(null, null);
          $rootScope.pageTitle = 'Login';
          // store.remove('UserRightChange');
          removeLocalStorageValue('passwordchange');
          $mdDialog.hide('', { closeAll: true });
        });
      }
    }

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.EVENT.logOutUserFromAllDevices, logOutUserFromAllDevices);
      socketConnectionService.on(CORE.EVENT.reloadPageOnOverrideUser, reloadPageOnOverrideUser);
      // [S] Socket Listeners for deleted user logout
      socketConnectionService.on(CORE.EVENT.logOutDeletedUserFromAllDevices, logOutDeletedUserFromAllDevices);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUsertoMapandPick, updateUsertoMapandPick);
      socketConnectionService.on(CORE.Socket_IO_Events.User.Update_LoginUser, updateLoginUser);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    function logOutUserFromAllDevices(obj) {
      const passwordchange = getLocalStorageValue('passwordchange');
      if (!passwordchange && obj && (service.loginUser && (obj.userID == service.loginUser.userid || (service.loginUser.employee && obj.empID == service.loginUser.employee.id)))) {
        /* only for debug purpose - [S]*/
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service logOutUserFromAllDevices' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
        }
        /* [E]*/
        service.logoutUser();
      }
    }

    function reloadPageOnOverrideUser(obj) {
      const loginUser = JSON.parse(localStorage.getItem('loginuser'));
      if (loginUser && service.loginUser && loginUser.identityUserId !== service.loginUser.identityUserId) {
        showReloadPageAlertForPopUp();
      }
    }

    function logOutDeletedUserFromAllDevices(list) {
      var objUser = _.find(list, (id) => { return id == service.loginUser.employee.id; });
      if (objUser) {
        /* only for debug purpose - [S]*/
        let tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service logOutDeletedUserFromAllDevices' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
        }
        /* [E]*/
        service.logoutUser();
      }
    }

    function updateLoginUser(loginUserObj) {
      if (loginUserObj && service.loginUser && loginUserObj.userid === service.loginUser.userid) {
        service.loginUser = loginUserObj;
      }
    }

    function removeSocketListener() {
      // console.log("Socket disconnect:" + CORE.EVENT.logOutUserFromAllDevices);
      socketConnectionService.removeListener(CORE.EVENT.logOutUserFromAllDevices, logOutUserFromAllDevices);
      socketConnectionService.removeListener(CORE.EVENT.reloadPageOnOverrideUser, reloadPageOnOverrideUser);
      // console.log("Socket disconnect:" + CORE.EVENT.logOutDeletedUserFromAllDevices);
      socketConnectionService.removeListener(CORE.EVENT.logOutDeletedUserFromAllDevices, logOutDeletedUserFromAllDevices);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUsertoMapandPick, updateUsertoMapandPick);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.User.Update_LoginUser, updateLoginUser);
    }

    socketConnectionService.on('disconnect', () => {
      // Remove socket listeners
      if (transactionID) {
        removePickUserDeatil();
      }
      removeSocketListener();
    });

    function setLoginUserPageList(pageList) {
      service.loginUserPageList = pageList;
    }

    function getReadOnlyRights(pageroute) {
      return _.find(service.loginUserPageList, (nav) => {
        return nav.PageDetails && nav.PageDetails.pageRoute == pageroute;
      });
    }

    function changeUserStatusOnline(userObj) {
      if (userObj && userObj.onlineStatus !== CHAT.USER_STATUS.DONOTDISTURB) {
        const model = {
          userID: userObj.userid,
          onlineStatus: userObj.onlineStatus
        };
        ChatFactory.setUserStatus().save(model).$promise.then((response) => {
          if (response.data) {
            socketConnectionService.emit(CORE.Socket_IO_Events.User.User_Status, model);
          }
        }).catch((error) => service.getErrorLog(error));
      }
    }

    // Direct call Socket Io for handle various cases of logout.
    function changeUserStatusOffline(userid) {
      const model = {
        userID: userid,
        onlineStatus: CHAT.USER_STATUS.OFFLINE
      };
      socketConnectionService.emit(CORE.Socket_IO_Events.User.User_Logout, model);
    }

    function getOpStatus(statusID) {
      const status = _.find(CORE.OpStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.Name : '';
    }
    function getSoStatus(statusID) {
      const status = _.find(CORE.SoStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.Name : '';
    }
    function getOpStatusClassName(statusID) {
      const status = _.find(CORE.OpStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.ClassName : '';
    }

    function getCostingTypeClassName(statusID) {
      const status = _.find(CORE.CostingType, (item) => {
        return item.Name == statusID;
      });
      return status ? status.ClassName : '';
    }

    function getWoStatus(statusID) {
      const status = _.find(CORE.WoStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.Name : '';
    }

    function getPOLineWorkingStatus(statusID) {
      const status = _.find(CORE.PurchaseOrderLineStatusGridHeaderDropdown, (item) => item.ID === statusID);
      return status ? status.value : '';
    }

    function checkFeatureRights(featureName) {
      if (service.loginUser) {
        const objFound = _.find(service.loginUser.featurePageDetail, (obj) => {
          return obj.featureName == featureName;
        });
        return (objFound ? true : false);
      } else {
        return false;
      }
    }

    function getWoStatusClassName(statusID) {
      const status = _.find(CORE.WoStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.ClassName : '';
    }

    function getWoTypeClassName(statusID) {
      const type = _.find(CORE.workOrderTypesWithECORequestType, (item) => {
        return item.value == statusID;
      });
      return type ? type.className : '';
    }
    function getWarehouseType(key) {
      const warehouseType = _.find(TRANSACTION.warehouseType, (item) => {
        return item.key == key;
      });
      return warehouseType ? warehouseType.value : '';
    }
    function getWoOpFirstArticleStatus(statusID) {
      const status = _.find(CORE.WorkOrderOperationFirstArticleStatus, (item) => {
        return item.Value == statusID;
      });
      return status ? status.Key : '';
    }

    function getReportStatusClassName(statusID) {
      const status = _.find(CORE.reportStatus, (item) => item.ID === statusID);
      return status ? status.ClassName : '';
    }
    function getsystemGeneratedStatusClassName(statusID) {
      const status = _.find(CORE.SystemgeneratedStatus, (item) => item.ID === statusID);
      return status ? status.ClassName : '';
    }
    function getcompStatusClassName(statusname) {
      const status = _.find(CORE.PartStatus, (item) => {
        return item.Name == statusname;
      });
      return status ? status.ClassName : '';
    }

    function getRohsStatusClassName(statusID) {
      const status = _.find(CORE.RohsStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.ClassName : '';
    }

    function getErrorLog(error) {
      if (error && error.statusText) {
        console.error(error.statusText);
      }
      else if (error) {
        console.error(error);
      }
    }

    function setDashboardPin(objPinVal) {
      store.set('dashboardPin', objPinVal);
    }

    function setCurrentLangauge(langCode, langCookieVal) {
      delete_cookie('googtrans');
      if (langCookieVal) {
        set_cookie(langCookieVal);
      } else {
        SetOrignialLangague();
      }
      store.set('currentLang', langCode);
    }

    function getDashboardPin() {
      return store.get('dashboardPin');
    }

    function getCurrentLangauge() {
      //return getCookie('googtrans');
      return store.get('currentLang');
    }


    function getCrumbs() {
      /*removed page list which has isPopup = true, because it create issue in bread scrumb, it is displayed for 1 second and then actual page name displayed
       Discussion between AP and VS on 27-04-2021*/
      const mainDataList = _.filter(msNavigationService.breadcrumbs.crumbs, (a) => !a.isPopup);
      let crumbs = _.uniqBy(mainDataList, (e) => {
        return e.state;
      });
      crumbs = _.sortBy(_.reverse(crumbs), ['uisref', '_path']);
      return crumbs;
    }

    function getPageTitle(pageroute) {
      return _.find(service.loginUserPageList, (nav) => {
        return nav.PageDetails && nav.PageDetails.pageRoute == pageroute;
      });
    }

    function deleteAlertMessage(data) {
      const model = {
        messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_MESSAGE),
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
    }

    function deleteAlertMessageWithHistory(data, callbackFn) {
      var vm = this;
      vm.list = data;
      let messageContent;

      messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_USED_MESSAGE_WITH_TRANSACTION_COUNT);
      messageContent.message = stringFormat(messageContent.message, data.pageName, '<a tabindex="-1" class="underline cursor-pointer" ng-click="openPopUp($event)">Click here</a>', data.TotalCount);
      if (data.IsHideTransactionCount) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_USED_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, data.pageName);
      }
      if (data.prefixDataForMsgCont) {
        messageContent.message = stringFormat('{0} {1}', data.prefixDataForMsgCont, messageContent.message);
      };

      $mdDialog.show({
        multiple: true,
        clickOutsideToClose: true,
        template:
          '<md-dialog aria-label="List dialog">' +
          '<md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_46">' +
          '<h2 class="md-title ng-binding">' + messageContent.messageType + ': ' + messageContent.messageCode + '</h2>' +
          '<div ng-if="::!dialog.mdHtmlContent" class="md-dialog-content-body ng-scope dynamic-msg-content" style="">' +
          '<div class="dynamic-msg-body">' +
          '<p class="ng-binding">' + messageContent.message + '</p></div></div>' +
          '</md-dialog-content>' +
          '<md-dialog-actions>' +
          '<md-button ng-click="closeDialog()" class="md-ink-ripple md-raised">' +
          'Ok' +
          '</md-button>' +
          '</md-dialog-actions>' +
          '</md-dialog>',
        controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function () {
            $mdDialog.hide();
          },
            $scope.openPopUp = function (ev) {
              callbackFn(ev);
            };
        }
      });
    }

    function checkFormValid(form, isAutocomplete) {
      if (form && form.$invalid) {
        let field = null, firstError = null;
        for (field in form) {
          if (field[0] != '$') {
            if (firstError === null && !form[field].$valid) {
              firstError = form[field].$name;
            }
            if (form[field].$pristine) {
              if (!isAutocomplete) {
                form[field].$touched = true;
              }
              form[field].$dirty = true;
            }
          }
        }
        angular.element('.ng-invalid[name=' + firstError + ']').focus();
        return;
      }
    }

    function checkFormDirty(formName, Columnobject) {
      let isChanged = false;
      if (formName && formName.$dirty) {
        formName.$$controls.forEach((control) => {
          if (control.$dirty && control.$name) {
            if (control.$$controls) {
              control.$$controls.forEach((childControl) => {
                if (childControl.$dirty) {
                  isChanged = true;
                }
              });
            } else {
              if (Columnobject && Columnobject.columnName) {
                const matchColumn = _.find(Columnobject.columnName, (c) => {
                  return angular.lowercase(c) == angular.lowercase(control.$name);
                });
                if (matchColumn) {
                  if (Columnobject.oldModelName[control.$name] != Columnobject.newModelName[control.$name]) {
                    isChanged = true;
                  }
                } else {
                  isChanged = true;
                }
              } else {
                isChanged = true;
              }
            }
          }
        });
      }
      return isChanged;
    }

    function showReloadPageAlertForPopUp() {
      const loginuser = JSON.parse(localStorage.getItem('loginuser')); // Do not use 'store' or 'service.loginuser'.
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RELOAD_PAGE_ALERT_ON_OVERIDE_USER);
      messageContent.message = stringFormat(messageContent.message, loginuser ? loginuser.username : 'another');

      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.RELOAD_BUTTON
      };
      DialogFactory.messageAlertDialog(obj).then((yes) => {
        if (yes) {
          _.each(service.currentPageForms, (objform) => {
            if (objform) {
              objform.$setPristine();
            }
          });
          service.currentPageForms = [];
          service.currentPagePopupForm = [];
          service.currentPageFlagForm = [];
          service.loginIDS();
        }
      }, (error) => service.getErrorLog(error));
    }

    function showWithoutSavingAlertForPopUp(data) {
      var messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        if (data) {
          if (popup.logout_user) {
            const userid = service.loginUser ? service.loginUser.userid : null;
            if (userid) {
              const model = {
                userID: userid,
                onlineStatus: CHAT.USER_STATUS.OFFLINE
              };
              // localStorage.setItem('UserRightChange', false);
              console.log('logout from base service user:logout');
              socketConnectionService.emit(CORE.Socket_IO_Events.User.User_Logout, model);
            }
          }
          // if from logout than do logout - priority 1
          if (data.cleanForm) {
            service.currentPageForms = [];
            service.currentPagePopupForm = [];
            service.currentPageFlagForm = [];
            if (data.callbackFn) {
              data.callbackFn(data.params);
            }
            return;
          } else if (data.form) {
            data.form.$setPristine();
          }
          if (data.isRevisionPopup) {
            const model = {
              isCancelled: true
            };
            $mdDialog.hide(model);
          } else if (data.form && !data.sideName) {
            data.form.$setPristine();
            service.currentPagePopupForm.pop();
            $mdDialog.cancel(data.isSavedData || false); // CP: if found any updated data then it will get on cancel & hide popup event
          } else if (data.sideName) {
            //if it is document
            $mdSidenav(data.sideName).close()
              .then(() => {
                $log.debug('close RIGHT is done');
                if (data.form) {
                  data.form.$setPristine();
                  data.form.$setUntouched();
                }
                $rootScope.$emit('genericDoc', data.genericDoc);
              });
          }
        } else {
          // localStorage.setItem('UserRightChange', false);
          service.currentPagePopupForm.pop();
          $mdDialog.cancel();
        }
      }, (cancel) => {
        /*Set focus on first enabled field when user click stay on button*/
        if (data && data.form) {
          focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(data.form);
        }
        // localStorage.setItem('UserRightChange', false);
      }).catch((error) => {
        return service.getErrorLog(error);
      });
    }
    //function showWithoutSavingAlertForPopUp(data) {
    //    let obj = {
    //        title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
    //        textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
    //        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
    //        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
    //    };
    //    DialogFactory.confirmDiolog(obj).then(() => {
    //        if (data) {
    //            if (data.isRevisionPopup) {
    //                let model = {
    //                    isCancelled: true
    //                }
    //                $mdDialog.hide(model);
    //            } else {
    //                //if it is document
    //                $mdSidenav(data.sideName).close()
    //                  .then(function () {
    //                      $log.debug("close RIGHT is done");
    //                      data.form.$setPristine();
    //                      data.form.$setUntouched();
    //                      $rootScope.$emit('genericDoc', data.genericDoc);
    //                  });
    //            }
    //        } else {
    //            $mdDialog.cancel();
    //        }
    //    }, (cancel) => {
    //    }).catch((error) => {
    //        return service.getErrorLog(error);
    //    });
    //}

    function reloadUIGrid(gridOptions, pagingInfo, initPageInfoFn, loadDataFn) {
      //commented bacause gridOptions.enablePaging comes true after pagination implemented in UI grid on part list page case discussed with Vaibhav on 08-08-2020
      /*if (!gridOptions.enablePaging) */{
        // Added for filter of grid it doesn't checkf for static filter
        if (gridOptions.gridApi) {
          const isFilterExists = _.some(gridOptions.gridApi.grid.columns, (col) => {
            return !_.isEmpty(col.filters[0].term);
          });
          if (isFilterExists) {
            initPageInfoFn();
            gridOptions.gridApi.grid.clearAllFilters(); // newly added
          }
          else {
            initPageInfoFn();
            loadDataFn();
          }
        }
        else {
          initPageInfoFn();
          loadDataFn();
        }
      }
    }

    function formatToSixDigit(col) {
      if (col && col.getAggregationValue()) {
        const arr = col.getAggregationValue().split('Total:');
        if (arr.length > 0) {
          const footerVal = parseFloat(arr[1].trim()).toFixed('6');
          return footerVal;
        }
      }
      return '';
    }
    // get no of times value avaiable in stock
    function calucalateNoTimes(required, available) {
      // e.g required: 4, available:1000 => noOfTimes = (available/required)
      return 'x' + (available / required).toFixed(2);
    }
    function moveArrayObjToOtherIndex(arrayObjcet, oldIndex, newIndex) {
      if (newIndex >= arrayObjcet.length) {
        let arrayIndex = newIndex - arrayObjcet.length + 1;
        while (arrayIndex--) {
          arrayObjcet.push(undefined);
        }
      }
      arrayObjcet.splice(newIndex, 0, arrayObjcet.splice(oldIndex, 1)[0]);
    };

    function checkNull(value, type) {
      if (value == 'null' || value == null) {
        return '-';
      } else {
        if (type == 'day') {
          value = value + ' BD';
        }
      }
      return value;
    }

    // check for visible columns allow in grid commonly in review pricing
    function checkForVisibleColumnInGrid(PartCosting, keys, sourceHeader) {
      const fieldObj = _.find(sourceHeader, (item) => { return item.field == keys; });
      if (!fieldObj
        && keys != PartCosting.LineID
        && keys != PartCosting.LineItemID
        && keys != PartCosting.AssyID
        && keys != PartCosting.RFQAssyBomID
        && keys != PartCosting.MFGAlterparts
        && keys != PartCosting.MFGAlterpartsData
        && keys != PartCosting.ConsolidateID
        && keys != PartCosting.Pricing
        && keys != PartCosting.ISPurchase
        && keys != PartCosting.Component
        && keys != PartCosting.MfgComponents
        && keys != PartCosting.LeadQtyField
        && keys != PartCosting.AttrationRateField
        && keys != PartCosting.NumOfPosition
        && keys != PartCosting.Description
        && keys != PartCosting.IsDisabled
        && keys != PartCosting.ConsolidateQuantity
        && keys != PartCosting.numOfRows
        && keys != PartCosting.lineItemCustoms
        && keys != PartCosting.isqpaMismatch
        && keys != PartCosting.Both
        && keys != PartCosting.Auto
        && keys != PartCosting.Manual
        && keys != PartCosting.restrictUseInBOMStep
        && keys != PartCosting.uomID
        && keys != PartCosting.consolidateID
        && keys != PartCosting.mfgPN
        && keys != PartCosting.consolidatedpartlineIDPart
        && keys != PartCosting.customerID
        && keys != PartCosting.restrictCPNUseInBOMStep
        && keys != PartCosting.custPNID
        && keys != PartCosting.pricingList
        && keys != PartCosting.autoPricingStatus
        && keys != PartCosting.isCustom
        && keys != PartCosting.restrictCPNUsePermanentlyStep
        && keys != PartCosting.restrictCPNUseWithPermissionStep
        && keys != PartCosting.consolidateRestrictPartDetailPart
        && keys != PartCosting.cpncustAssyPN
        && keys != PartCosting.CPNRoHSName
        && keys != PartCosting.CPNRoHSIcon
      ) {
        return true;
      }
      return false;
    }
    // convert to date time picker values
    function checkForDateNullValue(date) {
      if (date && date != 'null') {
        return new Date(date);
      }
      return null;
    }
    const popup = {
      logout_user: false
    };
    // Open active operation  pop up used in confirmation message at logout
    const openActiveOperationPopUp = () => {
      const data = {
        employeeID: service.loginUser.employee.id,
        employeeName: '(' + service.loginUser.employee.initialName + ')' + service.loginUser.employee.firstName + ' ' + service.loginUser.employee.lastName,
        messageHeader: '',
        messageContent: ''// angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CHANGE_STATUS_WORKORDER_WITH_ACTIVE_OP.message)
      };
      DialogFactory.dialogService(
        WORKORDER.SHOW_ACTIVE_OPERATION_POPUP_CONTROLLER,
        WORKORDER.SHOW_ACTIVE_OPERATION_POPUP_VIEW,
        event,
        data).then(() => {
        }, (showDetails) => {
          return;
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    };

    // Function for logout
    function logoutWithOperationConfirmation(vmObj) {
      popup.logout_user = true;
      const Allpromise = [];
      if (service.loginUser) {
        Allpromise.push(isactiveTransEmployee());
        vmObj.cgBusyLoading = $q.all(Allpromise).then((res) => {
          vmObj.popup.logout_user = false;
          if (res && res.length > 0 && res[0].data && res[0].data.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.LOGOUT_ALERT);
            messageContent.message = stringFormat(messageContent.message, '<a class="underline cursor-pointer" ng-click="openActiveOperationPopUp()">Click here</a>');
            $mdDialog.show({
              multiple: true,
              clickOutsideToClose: true,
              template:
                '<md-dialog aria-label="List dialog">' +
                '<md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_46">' +
                '<h2 class="md-title ng-binding">' + messageContent.messageType + ': ' + messageContent.messageCode + '</h2>' +
                '<div ng-if="::!dialog.mdHtmlContent" class="md-dialog-content-body ng-scope dynamic-msg-content" style="">' +
                '<div class="dynamic-msg-body">' +
                '<p class="ng-binding">' + messageContent.message + '</p></div></div>' +
                '</md-dialog-content>' +
                '<md-dialog-actions>' +
                '<md-button ng-click="closeDialog()" class="md-ink-ripple md-raised">' +
                CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT +
                '</md-button>' +
                '<md-button ng-click="logout()" class="md-ink-ripple md-raised">' +
                CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT +
                '</md-button>' +
                '</md-dialog-actions>' +
                '</md-dialog>',
              controller: ['$scope', '$mdDialog', function ConfirmationDialogController($scope, $mdDialog) {

                $scope.closeDialog = function () {
                  popup.logout_user = false;
                  $mdDialog.hide();
                };
                $scope.openActiveOperationPopUp = function (ev) {
                  popup.logout_user = false;
                  openActiveOperationPopUp();
                };
                $scope.logout = function (ev) {
                  popup.logout_user = false;
                  /* only for debug purpose - [S]*/
                  let tractActivityLog = getLocalStorageValue('tractActivityLog');
                  if (tractActivityLog && Array.isArray(tractActivityLog)) {
                    const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service logout_user_1' };
                    tractActivityLog.push(obj);
                    setLocalStorageValue('tractActivityLog', tractActivityLog);
                  }
                  /* [E]*/
                  logout();
                };
              }]
            });
          }
          else {
            vmObj.popup.logout_user = false;
            popup.logout_user = false;
            /* only for debug purpose - [S]*/
            let tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (tractActivityLog && Array.isArray(tractActivityLog)) {
              const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service logout_user_2' };
              tractActivityLog.push(obj);
              setLocalStorageValue('tractActivityLog', tractActivityLog);
            }
            /* [E]*/
            logout();
          }
        }).catch((error) => {
          vmObj.popup.logout_user = false;
          popup.logout_user = false;
          return getErrorLog(error);
        });
      } else {
        vmObj.popup.logout_user = false;
        popup.logout_user = false;
        /* only for debug purpose - [S]*/
        let tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service logout_user_3' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
        }
        /* [E]*/
        logout();
      }
    }

    // Function for logout
    function dynamicAlertPopup(vmObj) {
      const messageContent = vmObj.messageContent;
      $mdDialog.show({
        multiple: true,
        clickOutsideToClose: true,
        template:
          '<md-dialog aria-label="List dialog">' +
          '<md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_46">' +
          '<h2 class="md-title ng-binding">' + messageContent.messageType + ': ' + messageContent.messageCode + '</h2>' +
          '<div ng-if="::!dialog.mdHtmlContent" class="md-dialog-content-body ng-scope dynamic-msg-content" style="">' +
          '<div class="dynamic-msg-body">' +
          '<p class="ng-binding">' + messageContent.message + '</p></div></div>' +
          '</md-dialog-content>' +
          '<md-dialog-actions>' +
          '<md-button ng-click="closeDialog()" class="md-ink-ripple md-raised">' +
          CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT +
          '</md-button>' +
          '</md-dialog-actions>' +
          '</md-dialog>',
        controller: ['$scope', '$mdDialog', function DynamicAlertPopup($scope, $mdDialog) {
          $scope.dynamicAlertPopupFunction = () => {
            if (typeof (vmObj.openFileRestrictExtensionPopup) === 'function') {
              vmObj.openFileRestrictExtensionPopup();
            }
          };
          $scope.closeDialog = () => $mdDialog.hide();
        }]
      });
    }

    //function to remove user id for picked color
    function removePickUserDeatil(transactionID) {
      const objTrans = {
        transactionID: transactionID
      };
      WarehouseBinFactory.removePickUserDeatil().query(objTrans);
    }
    // Function for Check Employee has any Active operation or not
    function isactiveTransEmployee() {
      return EmployeeFactory.isactiveTrans_Employee().query({ id: service.loginUser.employee.id }).$promise.then((employeeActiveTrans) => {
        return $q.resolve(employeeActiveTrans);
      }).catch((error) => {
        return getErrorLog(error);
      });
    }

    function getIsActiveStatus(statusID) {
      const status = _.find(CORE.ActiveInactiveStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.Name : '';
    }

    function getPartMasterImageURL(documentPath, imageURL) {
      var imgPath = imageURL;
      if (!imageURL) {
        imgPath = CORE.NO_IMAGE_COMPONENT;
      }
      else if (!imageURL.startsWith('//') && !imageURL.startsWith('http://') && !imageURL.startsWith('https://') && imageURL !== CORE.NO_IMAGE_COMPONENT) {
        imgPath = (documentPath && imageURL) ? CORE.WEB_URL + USER.GENERICFILE_BASE_PATH + documentPath + '/' + USER.COMPONENT_IMAGES_FOLDER_NAME + imageURL : CORE.NO_IMAGE_COMPONENT;
      }
      return imgPath;
    }

    function openInNew(route, params) {
      var url = $state.href(route, params);
      if (_configOpenInNewTab) {
        window.open(url, '_blank');
      } else {
        window.open(WebsiteBaseUrl + '/' + url, '_blank', 'top=10,left=10,resizable=1,scrollbars=1,status=1,titlebar=1,toolbar=1,width=' + (screen.width - 100) + ',height=' + (screen.height - 100));
      }
    }


    function openURLWithTokenInNew(url, params) {


      //Add authentication headers as params
      var params = {
        access_token: 'Bearer ' + service.loginUser.token,
        other_header: 'other_header'
      };

      //Add authentication headers in URL
      url = [url, $.param(params)].join('?');
      //$http.defaults.headers.common['Authorization'] = 'Bearer ' + service.loginUser.token;

      if (_configOpenInNewTab) {
        window.open(url, '_blank');
      } else {
        window.open(url, '_blank', 'top=10,left=10,resizable=1,scrollbars=1,status=1,titlebar=1,toolbar=1,width=' + (screen.width - 100) + ',height=' + (screen.height - 100));
      }
    }

    function openURLInNew(url, params) {

      if (_configOpenInNewTab) {
        window.open(url, '_blank');
      } else {
        window.open(url, '_blank', 'top=10,left=10,resizable=1,scrollbars=1,status=1,titlebar=1,toolbar=1,width=' + (screen.width - 100) + ',height=' + (screen.height - 100));
      }
    }

    function getMaxLengthValidation(maxLength, enterTextLength) {
      if (enterTextLength > maxLength) {
        return stringFormat(CORE.MESSAGE_CONSTANT.MAXLENGTH, enterTextLength, maxLength);
      }
    }

    function getMinLengthValidation(minLength, enterTextLength) {
      if (enterTextLength < minLength) {
        return stringFormat(CORE.MESSAGE_CONSTANT.MINLENGTH, enterTextLength, minLength);
      }
    }

    function getMinNumberValueValidation(minValue) {
      return stringFormat(CORE.MESSAGE_CONSTANT.MIN_LENGTH_DYNAMIC, minValue);
    }

    function getDescrLengthValidation(maxLength, enterTextLength) {
      if (enterTextLength > maxLength) {
        return stringFormat(CORE.MESSAGE_CONSTANT.MAXLENGTH, enterTextLength, maxLength);
      }
    }

    function setPrintStorage(type, item) {
      if (type === 'Printer') {
        setLocalStorageValue(type, { Printer: item });
        $rootScope.$broadcast('changePrinter', item);
      } else if (type === 'PrintFormateOfUMID') {
        setLocalStorageValue(type, { PrintFormate: item });
        $rootScope.$broadcast('changePrinterFormateOfUMID', item);
      } else if (type === 'PrintFormateOfSearchMaterial') {
        setLocalStorageValue(type, { PrintFormate: item });
      } else if (type === 'NoOfPrint') {
        setLocalStorageValue(type, { NoOfPrint: item });
      }
    }
    function setDepartmentbyUser(user, dept) {
      setLocalStorageValue(user, { department: dept });
    }
    function setWareHouseSide(item) {
      setLocalStorageValue('whSide', { side: item });
    }

    function getEntityStatus(statusID) {
      const status = _.find(CORE.CustomFormsStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.Name : '';
    }

    function convertThreeDecimal(number) {
      number = number == '.' ? 0 : number;
      let value = parseFloat(number);
      value = value.toFixed(3);
      return value;
    }

    function goToWorkorderList() {
      this.openInNew(WORKORDER.WORKORDER_WORKORDERS_STATE);
    }
    function goToWorkorderReviewDetails(woID, woRevReqID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: woID, woRevReqID: woRevReqID, openRevReq: true });
    }
    function goToWorkorderOperationReviewDetails(woID, woOPID, woRevReqID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_STATE, { woID: woID, woOPID: woOPID, woRevReqID: woRevReqID, openRevReq: true });
    }
    function goToWorkorderDetails(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, { woID: woID });
    }
    function goToWorkorderStandards(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_STANDARDS_STATE, { woID: woID });
    }
    function goToWorkorderDocuments(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_DOCUMENTS_STATE, { woID: woID });
    }
    function goToWorkorderOperations(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, { woID: woID });
    }
    function goToWorkorderParts(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_PARTS_STATE, { woID: woID });
    }
    function goToWorkorderEquipments(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_EQUIPMENTS_STATE, { woID: woID });
    }
    function goToWorkorderEmployees(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_EMPLOYEES_STATE, { woID: woID });
    }
    function goToWorkorderDataFields(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_DATAFIELDS_STATE, { woID: woID });
    }
    function goToWorkorderOtherdetails(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OTHERDETAILS_STATE, { woID: woID });
    }
    function goToWorkorderInvitePeoples(woID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_INVITEPEOPLE_STATE, { woID: woID });
    }
    function goToRoleAddUpdate(id) {
      this.openInNew(USER.ADMIN_USER_ROLE_UPDATE_STATE, { id: id });
    }
    function goToPartList(keywords, searchData, openInSameTab) {
      const route = USER.ADMIN_MFG_COMPONENT_STATE;
      let parameter = null;
      if (keywords) {
        parameter = { /*mfgType: CORE.MFG_TYPE.DIST.toLowerCase(),*/ keywords: encodeURIComponent(keywords) };
      } else if (searchData) {
        parameter = {
          headersearchkeywords: encodeURIComponent(searchData.headersearchkeyword),
          functionaltype: searchData.functionaltype,
          mountingtype: searchData.mountingtype,
          groupname: searchData.groupname
        };
      }

      if (parameter) {
        if (openInSameTab) {
          $state.go(route, parameter, {}, { reload: true });
        } else {
          this.openInNew(route, parameter);
        }
      } else {
        if (openInSameTab) {
          $state.go(route, {}, {}, { reload: true });
        } else {
          this.openInNew(route/*, { mfgType: CORE.MFG_TYPE.DIST.toLowerCase() }*/);
        }
      }
    }
    function goToSupplierPartList(keywords, searchData, openInSameTab) {
      const route = USER.ADMIN_DIST_COMPONENT_STATE;
      let parameter = null;
      if (keywords) {
        parameter = { /*mfgType: CORE.MFG_TYPE.DIST.toLowerCase(),*/ keywords: encodeURIComponent(keywords) };
      } else if (searchData) {
        parameter = {
          headersearchkeywords: encodeURIComponent(searchData.headersearchkeyword),
          functionaltype: searchData.functionaltype,
          mountingtype: searchData.mountingtype,
          groupname: searchData.groupname
        };
      }

      if (parameter) {
        if (openInSameTab) {
          $state.go(route, parameter, {}, { reload: true });
        } else {
          this.openInNew(USER.ADMIN_DIST_COMPONENT_STATE, parameter);
        }
      } else {
        if (openInSameTab) {
          $state.go(route, {}, {}, { reload: true });
        } else {
          this.openInNew(route/*, { mfgType: CORE.MFG_TYPE.DIST.toLowerCase() }*/);
        }
      }
    }
    function goToSupplierPartDetails(partID) {
      this.openInNew(USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE, {
        coid: partID, selectedTab: USER.PartMasterTabs.Detail.Name
      });
    }
    function goToAssemblyOpeningBalanceDetails(partID) {
      this.openInNew(USER.ADMIN_MANAGECOMPONENT_OPENING_STOCK_STATE, { coid: partID });
    }
    function goToOperationList(openInSameTab) {
      if (openInSameTab) {
        $state.go(OPERATION.OPERATION_OPERATIONS_STATE, {});
      } else {
        this.openInNew(OPERATION.OPERATION_OPERATIONS_STATE, {});
      }
    }
    function goToWorkorderOperationDetails(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationDoDonts(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_DODONT_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationDocuments(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_DOCUMENTS_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationDatafields(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_DATAFIELDS_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationEquipments(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_EQUIPMENTS_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationParts(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_PARTS_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationEmployees(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_EMPLOYEES_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationOtherDetails(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_OTHERDETAILS_STATE, { woOPID: woOPID });
    }
    function goToWorkorderOperationFirstArticles(woOPID) {
      this.openInNew(WORKORDER.MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_STATE, { woOPID: woOPID });
    }
    function goToTravelerOperationDetails(woOPID, employeeID, homeOPID) {
      this.openInNew(TRAVELER.TRAVELER_MANAGE_STATE, { woOPID: woOPID, employeeID: employeeID, homeOPID: homeOPID });
    }
    function goToCustomerList() {
      this.openInNew(USER.ADMIN_CUSTOMER_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER });
    }
    function goToCameraList() {
      this.openInNew(USER.ADMIN_CAMERA_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER });
    }
    function goToSupplierList() {
      this.openInNew(USER.ADMIN_SUPPLIER_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER });
    }
    function goToSupplierDetail(supplierID, openInSameTab) {
      if (openInSameTab) {
        $state.go(USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
      }
      else {
        this.openInNew(USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
      }
    }
    function goToSupplierBillTo(supplierID) {
      this.openInNew(USER.ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
    }
    function goToSupplierBusinessAddress(supplierID) {
      this.openInNew(USER.ADMIN_MANAGESUPPLIER_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
    }
    function goToSupplierWireTransferAddress(supplierID) {
      this.openInNew(USER.ADMIN_MANAGESUPPLIER_WIRE_TRANSFER_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
    }
    function goToSupplierRMAIntermediateAddress(supplierID) {
      this.openInNew(USER.ADMIN_MANAGESUPPLIER_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
    }
    function goToSupplierBankRemitTo(supplierID) {
      this.openInNew(USER.ADMIN_MANAGESUPPLIER_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
    }
    function goToCompanyProfileRemitTo() {
      this.openInNew(CORE.COMPANY_PROFILE_REMITTANCE_ADDRESS_STATE);
    }
    function goToAssyTypeList() {
      this.openInNew(USER.ADMIN_ASSYTYPE_STATE);
    }
    function goToCustomer(id, openInSameTab) {
      if (openInSameTab) {
        $state.go(USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER, cid: id });
      }
      else {
        this.openInNew(USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER, cid: id });
      }
    }
    function goToCustomerCPNList(id, cpn) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_CPN_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER, cid: id, keywords: cpn });
    }
    function goToManageSalesOrder(sID, tabObj, blanketPOID, partID) {
      const route = TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE;
      if (tabObj && tabObj.openInSameTab) {
        $state.go(route, { sID: sID }, { reload: true, inherit: false });
      } else {
        this.openInNew(route, { sID: sID, blanketPOID: blanketPOID, partID: partID });
      }
    }
    function goToSalesOrderList() {
      this.openInNew(TRANSACTION.TRANSACTION_SALESORDER_STATE);
    }
    function goToSalesOrderPartList(soNumber, status) {
      this.openInNew(TRANSACTION.TRANSACTION_SALESORDER_DETAILLIST_PART_STATE, { soNumber: soNumber, soStatus: status });
    }
    function goToStandardList() {
      this.openInNew(USER.CERTIFICATE_STANDARD_STATE);
    }
    function goToStandardDetails(certificateStandardID) {
      this.openInNew(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: certificateStandardID });
    }
    function goToAssignPersonnel(certificateStandardID, classID) {
      if (certificateStandardID) {
        this.openInNew(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_PERSONNEL_STATE, { id: certificateStandardID, classID: classID });
      }
    }
    function goToComponentDetailTab(type, componentID, tabName) {
      type = type || CORE.MFG_TYPE.MFG;
      const routeState = type.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE;
      if (tabName) {
        this.openInNew(routeState, {
          coid: componentID, selectedTab: tabName
        });
      } else {
        this.openInNew(routeState, {
          coid: componentID
        });
      }
    }
    function goToComponentSalesPriceMatrixTab(partID) {
      this.openInNew(USER.ADMIN_MANAGECOMPONENT_COMPONENT_ASSEMBLY_SALES_PRICE_MATRIX_STATE, { coid: partID, selectedTab: USER.PartMasterTabs.AssemblySalesPriceMatrix.Name });
    }
    function goToComponentBOM(partID) {
      this.openInNew(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, { coid: partID, selectedTab: USER.PartMasterTabs.BOM.Name, subTab: partID });
    }
    function goToComponentBOMWithSubAssy(mainAssyId, subAssyId) {
      this.openInNew(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, { coid: mainAssyId, selectedTab: USER.PartMasterTabs.BOM.Name, subTab: subAssyId });
    }
    function goToComponentBOMWithKeyWord(partID, keyword) {
      this.openInNew(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, { coid: partID, selectedTab: USER.PartMasterTabs.BOM.Name, subTab: partID, keywords: keyword });
    }
    function goToComponentBOMWithSubAssyAndKeyWord(mainAssyId, subAssyId, keyword) {
      this.openInNew(USER.ADMIN_MANAGECOMPONENT_BOM_STATE, { coid: mainAssyId, selectedTab: USER.PartMasterTabs.BOM.Name, subTab: subAssyId, keywords: keyword });
    }
    function goToWorkorderManualEntryList(woID) {
      this.openInNew(WORKORDER.WO_MANUAL_ENTRY_LIST_STATE, { woID: woID });
    }
    function goToWorkorderECORequestList(woID, partID) {
      this.openInNew(WORKORDER.ECO_REQUEST_LIST_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.ECO.Name, woID: woID, partID: partID });
    }
    function goToWorkorderDFMRequestList(woID, partID) {
      this.openInNew(WORKORDER.DFM_REQUEST_LIST_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.DFM.Name, woID: woID, partID: partID });
    }
    function goToAddWorkorderECORequest(partID, woID) {
      this.openInNew(WORKORDER.ECO_REQUEST_DETAIL_STATE, { partID: partID, woID: woID });
    }
    function goToAddWorkorderDFMRequest(partID, woID) {
      this.openInNew(WORKORDER.DFM_REQUEST_DETAIL_STATE, { partID: partID, woID: woID });
    }
    function goToWorkorderChangeLog(woID) {
      this.openInNew(WORKORDER.WO_DATAENTRY_CHANGE_AUDITLOG_LIST_STATE, { woID: woID });
    }
    function goToWorkorderProfile(woID) {
      this.openInNew(WORKORDER.WORKORDER_PROFILE_STATE, { woID: woID });
    }
    function goToOperationProfile(opID) {
      this.openInNew(OPERATION.OPERATION_PROFILE_STATE, { id: opID });
    }
    function goToEmployeeProfile(employeeID) {
      this.openInNew(USER.ADMIN_EMPLOYEE_PROFILE_STATE, { id: employeeID });
    }
    function goToEquipmentProfile(eqpID) {
      this.openInNew(USER.ADMIN_EQUIPMENT_PROFILE_STATE, { id: eqpID });
    }
    function goToElementManage(entityID, dataElementID) {
      this.openInNew(CONFIGURATION.CONFIGURATION_DATAELEMENT_MANAGE_STATE, { entityID: entityID, dataElementID: dataElementID });
    }
    function goToManufacturerList() {
      this.openInNew(USER.ADMIN_MANUFACTURER_STATE, {});
    }
    function goToRFQUpdate(rfqID, rfqAssyID) {
      this.openInNew(RFQTRANSACTION.RFQ_MANAGE_STATE, { id: rfqID, rfqAssyId: rfqAssyID });
    }
    function goToPartCosting(rfqID) {
      this.openInNew(RFQTRANSACTION.RFQ_PART_COSTING_STATE, { id: rfqID });
    }
    function goToLabor(rfqID, partID) {
      this.openInNew(RFQTRANSACTION.RFQ_LABOR_STATE, { id: rfqID, partId: partID });
    }
    function goToQuoteSummary(rfqID) {
      this.openInNew(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: rfqID });
    }
    function goToPersonnelList(openINSameTab) {
      if (openINSameTab) {
        $state.go(USER.ADMIN_EMPLOYEE_STATE, {});
      } else {
        this.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
      }
    }
    function goToMountingTypeList() {
      this.openInNew(USER.ADMIN_MOUNTING_TYPE_STATE, {});
    }
    function goToPackageCaseTypeList() {
      this.openInNew(USER.ADMIN_PACKAGE_CASE_TYPE_STATE, {});
    }
    function goToGenericCategoryDocumentTypeList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_DOCUMENTTYPE_STATE, { categoryTypeID: CORE.CategoryType.DocumentType.ID });
    }
    function goToGenericCategoryTitleList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_EMPTITLE_STATE, { categoryTypeID: CORE.CategoryType.EmployeeTitle.ID });
    }
    function goToBOMDefaultCommentTab() {
      this.openInNew(USER.ADMIN_BOM_REASON_STATE, { reasonId: CORE.Reason_Type.BOM.id });
    }
    function goToRFQReasonTab() {
      this.openInNew(USER.ADMIN_RFQ_REASON_STATE, { reasonId: CORE.Reason_Type.RFQ.id });
    }
    function goToInvoiceApprovedMessageTab() {
      this.openInNew(USER.ADMIN_INVOICE_APPROVED_REASON_STATE, { reasonId: CORE.Reason_Type.INVOICE_APPROVE.id });
    }
    function goToWHList() {
      this.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});
    }
    function goToPackagingBoxSerialList() {
      this.openInNew(TRANSACTION.TRANSACTION_BOX_SERIAL_NUMBERS_STATE, {});
    }
    function goToSmartCartWHList() {
      this.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, { warehousetype: TRANSACTION.warehouseType.SmartCart.value.replace(' ', '') });
    }
    function goToBinList() {
      this.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});
    }
    function goToRackList() {
      this.openInNew(TRANSACTION.TRANSACTION_RACK_STATE, {});
    }
    function goToUMIDList(whId, binId, refSalesOrderDetID, assyID, searchKeyword) {
      if (searchKeyword) {
        this.openInNew(TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE, {
          whId: whId, binId: binId, refSalesOrderDetID: refSalesOrderDetID, assyID: assyID, keywords: encodeURIComponent(searchKeyword)
        });
      } else {
        this.openInNew(TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE, {
          whId: whId, binId: binId, refSalesOrderDetID: refSalesOrderDetID, assyID: assyID
        });//{ whID: (whID || 0), binID: (binID || 0) });
      }
      return false;
    }
    function goToUMIDDetail(id) {
      this.openInNew(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { id: id });
      return false;
    }
    function goToSupplierQuoteList() {
      this.openInNew(TRANSACTION.TRANSACTION_SUPPLIER_QUOTE_STATE);
      return false;
    }
    function goToSupplierAttributeTemplate() {
      this.openInNew(USER.ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_STATE);
      return false;
    }
    function goToUOMList(data) {
      this.openInNew(USER.ADMIN_UNIT_STATE);
      return false;
    }
    function searchToDigikey(part) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.DIGIKEY + part);
    }
    function searchToGoogle(data) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.GOOGLE + data);
    }
    function searchToFindChip(part) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.FINDCHIPS + part);
    }
    function searchToArrow(part) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.ARROW);
    }
    function searchToAvnet(part) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.AVNET);
    }
    function searchToMouser(part) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.MOUSER + part);
    }
    function searchToNewark(part) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.NEWARK + part);
    }
    function searchToTTI(part) {
      this.openURLInNew(stringFormat(RFQTRANSACTION.API_LINKS.TTI, part));
    }
    function searchToHeilind(part) {
      this.openURLInNew(stringFormat(RFQTRANSACTION.API_LINKS.Heilind, part));
    }
    function searchToOctopart(part) {
      this.openURLInNew(RFQTRANSACTION.API_LINKS.OCTOPART + part);
    }
    function goToStandardCaregoryList() {
      this.openInNew(USER.STANDARD_CLASS_STATE);
    }
    function goToFunctionalTypeList() {
      this.openInNew(USER.ADMIN_PART_TYPE_STATE);
    }
    function getMaxDateValidation(FromDate, ToDate) {
      return stringFormat(CORE.MESSAGE_CONSTANT.MAX_DATE_TODAY_DATE, FromDate, ToDate);
    }
    function getMinDateValidation(FromDate, ToDate) {
      return stringFormat(CORE.MESSAGE_CONSTANT.MIN_DATE_TODAY_DATE, FromDate, ToDate);
    }
    function goToManufacturer(id, openInSameTab) {
      if (openInSameTab) {
        $state.go(USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE, { customerType: CORE.CUSTOMER_TYPE.MANUFACTURER, cid: id });
      }
      else {
        this.openInNew(USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE, { customerType: CORE.CUSTOMER_TYPE.MANUFACTURER, cid: id });
      }
    }
    function goToEquipmentWorkstationList() {
      this.openInNew(USER.ADMIN_EQUIPMENT_STATE, {});
    }
    function goToManageEquipmentWorkstation(id) {
      this.openInNew(USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE, { eqpID: id ? id : null });
    }
    function goToLabelTemplateList() {
      this.openInNew(USER.ADMIN_BARCODE_LABEL_TEMPLATE_STATE, {});
    }
    function goTowhoAcquiredWhoList() {
      this.openInNew(USER.ADMIN_WHO_ACQUIRED_WHO_STATE, {});
    }
    function goToRFQList() {
      this.openInNew(RFQTRANSACTION.RFQ_RFQ_STATE, {});
    }
    function goToCountryList() {
      this.openInNew(USER.ADMIN_COUNTRY_STATE, {});
    }
    function goToJobTypeList() {
      this.openInNew(USER.ADMIN_JOB_TYPE_STATE, {});
    }
    function goToPurchaseList(salesOrderDetID, assyID, mountingTypeId) {
      this.openInNew(TRANSACTION.TRANSACTION_PURCHASE_STATE, { id: salesOrderDetID, partId: assyID, mountingTypeId: mountingTypeId });
    }
    function goToKitList(salesOrderDetID, assyID, mountingTypeId) {
      this.openInNew(TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE, { id: salesOrderDetID, partId: assyID, mountingTypeId: mountingTypeId });
    }
    function goToKitPreparation(salesOrderDetID, assyID, mountingTypeId) {
      this.openInNew(TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE, { id: salesOrderDetID, partId: assyID, mountingTypeId: mountingTypeId });
    }
    function goToPackingSlipList() {
      this.openInNew(TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_STATE, { type: TRANSACTION.MaterialReceiveTabType.PackingSlip });
    }
    function goToSupplierInvoiceList(searchData) {
      if (searchData) {
        this.openInNew(TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE, {
          mfgCodeID: searchData.mfgCodeID,
          termsAndAboveDays: searchData.termsAndAboveDays,
          dueDate: searchData.dueDate,
          additionalDays: searchData.additionalDays
        });
      }
      else {
        this.openInNew(TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE, {});
      }
    }
    function goToSupplierInvoiceDetail(type, id) {
      this.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, { type: type || TRANSACTION.SupplierInvoiceType.Detail, id: id /*, slipType: CORE.PackingSlipInvoiceTabName*/ });
    }
    function goToManagePackingSlipDetail(id, type, openInSameTab) {
      let route = TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE;
      if (openInSameTab) {
        $state.go(route, { type: type || TRANSACTION.MaterialReceiveTabType.PackingSlip, id: id }, { reload: true });
      } else {
        this.openInNew(route, { type: type || TRANSACTION.MaterialReceiveTabType.PackingSlip, id: id });
      }
    }
    function goToKitDataList() {
      this.openInNew(TRANSACTION.KIT_LIST_STATE, {});
    }
    function goToQuoteAttributeList() {
      this.openInNew(USER.ADMIN_QUOTE_DYNAMIC_FIELDS_STATE, {});
    }
    function goToLaborCostTemplateList() {
      this.openInNew(USER.ADMIN_LABOR_COST_TEMPLATE_STATE, {});
    }
    function goToManageLaborCostTemplate(id, openInSameTab) {
      if (openInSameTab) {
        $state.go(USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE, { id: id }, { reload: true });
      } else {
        this.openInNew(USER.ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE, { id: id });
      }
    }
    function setInputValidity(form, elementID, validateOn) {
      $timeout(() => {
        const element = $window.document.getElementById(elementID);
        if (element) {
          angular.element(element).siblings('div').removeClass('md-auto-hide');
          form[elementID].$setValidity(validateOn, false);
        }
      });
    }
    function goToPackaging() {
      this.openInNew(USER.ADMIN_PACKAGING_TYPE_STATE, {});
    }
    function getFormForValidation() {
      return _.filter(service.currentPageForms, (item) => { return item; });
    }
    function setFormForValidation(form) {
      $timeout(() => {
        service.currentPageForms.push(form);
      }, 0);
    }
    function getPopupFormForValidation() {
      return _.filter(service.currentPagePopupForm, (item) => { return item; });
    }
    function getFlagFormForValidation() {
      return _.filter(service.currentPageFlagForm, (item) => { return item; });
    }
    function goToMountingGroupList() {
      this.openInNew(USER.ADMIN_COMPONENT_LOGICAL_GROUP_STATE);
    }
    function goToGenericCategoryChargeTypeList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_CHARGES_TYPE_STATE, {});
    }
    function goToGenericCategoryPayablePaymentMethodList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_PAYMENT_METHODS_STATE, {});
    }
    function goToGenericCategoryReceivablePaymentMethodList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_STATE, {});
    }
    function goToGenericCategoryPaymentTypeCategoryList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_STATE, {});
    }
    function goToGenericCategoryCarrierList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_CARRIERMST_STATE, {});
    }
    function goToGenericCategoryPartRequirementCategoryList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_PARTREQUIREMENTCATEGORY_STATE, {});
    }
    function goToManageGenericCategoryPartRequirementCategory(id) {
      this.openInNew(USER.ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE, { categoryTypeID: CORE.CategoryType.PartRequirementCategory.ID, gencCategoryID: id });
    }
    function goToManageGenericCategoryCarrier(id) {
      this.openInNew(USER.ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE, { categoryTypeID: CORE.CategoryType.Carriers.ID, gencCategoryID: id });
    }
    function goToPurchaseOrderList() {
      this.openInNew(TRANSACTION.TRANSACTION_PURCHASE_ORDER_STATE, {});
    }
    function goToPurchaseOrderDetail(id, tabObj) {
      const route = TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE;
      if (tabObj && tabObj.openInSameTab) {
        $state.go(route, { id: id || null }, {}, { reload: true });
      } else {
        this.openInNew(route, { id: id || null });
      }
    }
    function goToPurchaseOrderDetailPerLineList(obj, openInSameTab) {
      const route = TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAILLIST_PART_STATE;
      if (openInSameTab) {
        $state.go(route, { poNumber: obj.poNumber, status: obj.type }, {}, { reload: true });
      } else {
        this.openInNew(route, { poNumber: obj.poNumber, status: obj.type });
      }
    }
    function goToBankList() {
      this.openInNew(USER.ADMIN_BANK_STATE, {});
    }
    function goToSupplierQuoteWithPartDetail(id, keywords) {
      if (keywords) {
        this.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: id, keywords: keywords });
      }
      else {
        this.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_QUOTE_STATE, { id: id });
      }
    }
    function goToPartStandardTab(type, id) {
      const routeState = type.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_STANDARDS_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_STANDARDS_STATE;
      this.openInNew(routeState, { coid: id });
    }

    function goToChartOfAccountList() {
      this.openInNew(USER.ADMIN_CHART_OF_ACCOUNTS_STATE, {});
    }

    function goToAccountTypeList() {
      this.openInNew(USER.ADMIN_ACCOUNT_TYPE_STATE, {});
    }

    function goToReportCategoryList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_REPORTCATEGORY_STATE, {});
    }

    function goToTemplateReportList() {
      this.openInNew(DYNAMIC_REPORTS.DYNAMIC_REPORTS_STATE, { keywords: CORE.TEMPLATE_REPORTS_KEYWORD });
    }

    function goToKitReleaseCommentTab() {
      this.openInNew(USER.ADMIN_KIT_RELEASE_COMMENT_STATE, { reasonId: CORE.Reason_Type.KIT_RELEASE_COMMENT.id });
    }

    //    function focusRequiredField(form) {
    function focusRequiredField(form, flag) {
      if (form.$invalid) {
        let invalidElements = [];
        _.each(form.$error, (item) => {
          invalidElements = _.concat(invalidElements, item);
        });
        let elements = _.sortBy(_.map(_.flatten(_.uniq(_.map(invalidElements, (item) => {
          const reqElement = item.$error.required || item.$error.maxLength || item.$error.min || item.$error.max || item.$error.number || item.$error.step || item.$error.pattern || item.$error.datetime || item.$error.format || item.$error.taMinText || item.$error.expressionvalidator || item.$error.valid || item.$error.maxSize;
          return Array.isArray(reqElement) ? reqElement : item;
        }))), (item) => {
          const element = item.$$element;
          const isExcludeField = element.hasClass('exclude-invalid-field');
          if (!isExcludeField) {
            return element;
          }
        }), ['displaySectionOrderIndex', 'displaySectionLeftOrderIndex', 'displayOrderIndex', 'displayLeftOrderIndex']);

        let isInvalidForm = false;
        isInvalidForm = elements.some((item) => item);
        if (!isInvalidForm) {
          if (!form.$dirty) {
            NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
            isInvalidForm = true;
          }
        }
        setTimeout(() => {
          var btnElement = form.$$element && form.$$element ? form.$$element.find('#btnRequireColValidation') : null;
          if (btnElement && btnElement[0]) {
            btnElement.trigger('click');
          }
          invalidElements = [];
          _.each(form.$error, (item) => {
            invalidElements = _.concat(invalidElements, item);
          });

          elements = _.sortBy(_.map(_.flatten(_.uniq(_.map(invalidElements, (item) => {
            var reqElement = item.$error.required || item.$error.maxLength || item.$error.min || item.$error.max || item.$error.number || item.$error.step || item.$error.pattern || item.$error.datetime || item.$error.format || item.$error.taMinText || item.$error.expressionvalidator || item.$error.valid || item.$error.maxSize;
            return Array.isArray(reqElement) ? reqElement : item;
          }))), (item) => {
            var element = item.$$element;
            const isExcludeField = element.hasClass('exclude-invalid-field');
            if (!isExcludeField) {
              element = item.$$element[0];
              item.$touched = true;

              let displayOrderIndex = element.offsetParent ? element.offsetParent.offsetTop : element.offsetTop;
              let displayLeftOrderIndex = element.offsetParent ? element.offsetParent.offsetLeft : element.offsetLeft;
              let parentElement = element;
              while (parentElement && parentElement.tagName != _inputControlTagName.MdInputContainer) {
                parentElement = parentElement.offsetParent;
              }
              displayOrderIndex = parentElement ? parentElement.offsetTop : displayOrderIndex;
              displayLeftOrderIndex = parentElement ? parentElement.offsetLeft : displayLeftOrderIndex;

              if (element.tagName == 'FORM') {
                element = element[0];
              }

              const subFormDiv = angular.element(`[name="${element.getAttribute('name')}"`).closest('.subformtable');
              if (subFormDiv && subFormDiv[0]) {
                displayOrderIndex = subFormDiv[0].offsetTop;
              }

              let displaySectionOrderIndex = 0, displaySectionLeftOrderIndex = 0;
              const sectionGroupDiv = angular.element(`[name="${element.getAttribute('name')}"`).closest('.cm-section-main');
              if (sectionGroupDiv && sectionGroupDiv[0]) {
                displaySectionOrderIndex = sectionGroupDiv[0].offsetTop;
                displaySectionLeftOrderIndex = sectionGroupDiv[0].offsetLeft;
              }

              element.displaySectionOrderIndex = displaySectionOrderIndex || 0;

              element.displaySectionLeftOrderIndex = displaySectionLeftOrderIndex || 0;
              element.displayOrderIndex = displayOrderIndex;
              element.displayLeftOrderIndex = displayLeftOrderIndex;
              // console.log(`{name:${element.getAttribute('name')}, displaySectionOrderIndex:${element.displaySectionOrderIndex}, displaySectionLeftOrderIndex:${element.displaySectionLeftOrderIndex}, displayOrderIndex:${element.displayOrderIndex}, displayLeftOrderIndex:${element.displayLeftOrderIndex}`);
              return element;
            }
          }), ['displaySectionOrderIndex', 'displaySectionLeftOrderIndex', 'displayOrderIndex', 'displayLeftOrderIndex']);

          isInvalidForm = elements.some((item) => item);
          if (!isInvalidForm && !form.$dirty) {
            NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
            return true;
          }
          //console.log(elements);
          let reqEleIndex = 0;
          while (elements[reqEleIndex] && elements[reqEleIndex].disabled) {
            reqEleIndex++;
          }

          if (elements[reqEleIndex]) {
            if (elements[reqEleIndex].tagName == _inputControlTagName.TextAngular) {
              const editorScope = textAngularManager.retrieveEditor(elements[reqEleIndex].getAttribute('name')).scope;
              $timeout(() => {
                editorScope.displayElements.text.trigger('focus');
              });
            }
            else {
              elements[reqEleIndex].focus();
            }

            if (elements[reqEleIndex].tagName == _inputControlTagName.MdRadioGroup) {
              elements[reqEleIndex].classList.add('md-focused');
              if (elements[reqEleIndex].parentElement) {
                elements[reqEleIndex].parentElement.classList.add('md-focused');
              }
            }
            else if (elements[reqEleIndex].tagName == _inputControlTagName.MdCheckBox) {
              //$(elements[reqEleIndex]).addClass('md-focused');
              elements[reqEleIndex].classList.add('md-focused');
            }
            else if (elements[reqEleIndex].tagName == _inputControlTagName.MdSelect) {
              angular.element(`[name="${elements[reqEleIndex].getAttribute('name')}"`).trigger('click');
            }
            else if (elements[reqEleIndex].tagName == _inputControlTagName.Div && elements[reqEleIndex].children.length > 0 && elements[reqEleIndex].children[0].tagName == _inputControlTagName.Canvas) {
              elements[reqEleIndex].children[0].style.border = '1px solid #ff0000';
              $('#content').animate({
                scrollTop: elements[reqEleIndex].displayOrderIndex
              }, 2000);
            }
          }
        });
        return isInvalidForm;
      }
      else if (form && !form.$dirty && form.$valid && !flag) {
        NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
        return true;
      }
      return false;
    }

    /*set Focus on first enabled field in form*
     * /
     * @param {any} form
     */
    function focusOnFirstEnabledField(form) {
      focusOnFirstEnabledFormField(form);
    }

    /**
     * set focus on dirty state [stay on] button click only
     * @param {any} form
     */
    function focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(form) {
      focusOnFirstEnabledField(form);
    }

    function goToManagePersonnel(employeeID, openINSameTab) {
      if (openINSameTab) {
        $state.go(USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE, { id: employeeID });
      }
      else {
        this.openInNew(USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE, { id: employeeID });
      }
    }

    function goToTransferMaterial() {
      this.openInNew(TRANSACTION.TRANSACTION_TRANSFER_STOCK_STATE);
      return false;
    }

    /* it will display list of part that used in BOM process while we delete mfg/cust/supp alias */
    function existsAssyListForMFGAliasDelete(data) {
      var message = stringFormat(data.displayMessage, '<a tabindex="-1" class="underline" ng-click="openPopUp($event)">Click here</a>', data.TotalCount);
      $mdDialog.show({
        multiple: true,
        clickOutsideToClose: true,
        template:
          '<md-dialog aria-label="List dialog">' +
          '<md-dialog-content class="md-dialog-content" role="document" tabindex="-1" id="dialogContent_mfgalias_assy">' +
          '<h2 class="md-title ng-binding">Information</h2>' +
          '<div ng-if="::!dialog.mdHtmlContent" class="md-dialog-content-body ng-scope" style="">' +
          '<p class="ng-binding">' + message + '</p></div>' +
          '</md-dialog-content>' +
          '<md-dialog-actions>' +
          '<md-button ng-click="closeDialog()" class="md-ink-ripple md-raised">' +
          'Ok' +
          '</md-button>' +
          '</md-dialog-actions>' +
          '</md-dialog>',
        controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function () {
            $mdDialog.hide();
          },
            $scope.openPopUp = function (ev) {

              if (data.usedPartIDsList && data.usedPartIDsList.length > 0) {
                DialogFactory.dialogService(
                  CORE.VIEW_ASSY_USED_FOR_MFG_ALIAS_MODAL_CONTROLLER,
                  CORE.VIEW_ASSY_USED_FOR_MFG_ALIAS_MODAL_VIEW,
                  ev,
                  data).then((res) => {
                  }, () => {
                  });
              }
            };
        }
      });
    }

    //------------------------- [S] Elastic Search ---------------------------
    function retriveSearchRecord(message) {
      $mdDialog.show($mdDialog.alert()
        .title(CORE.MESSAGE_CONSTANT.ALERT_HEADER)
        .textContent(message)
        .ok('Ok'));
    }
    //------------------------- [S] Elastic Search ---------------------------

    /**
     * Get date only to store in DataBase without time zone
     * @param {any} pDate
     */
    function getAPIFormatedDate(pDate) {
      if (pDate) {
        if (typeof (pDate) == 'string') {
          pDate = new Date(moment(pDate).format(CORE.MOMENT_DATE_FORMAT));
        }
        return $filter('date')(pDate, CORE.MySql_Store_Date_Format);
      }
      return null;
    }
    /**
      * Get date only to store in DataBase with time zone
      * @param {any} pDate
      */
    function getAPIFormatedDateTime(pDate) {
      if (pDate) {
        if (typeof (pDate) == 'string') {
          pDate = new Date(moment(pDate).format(CORE.MOMENT_DATE_TIME_FORMAT));
        }
        return $filter('date')(pDate, CORE.MySql_Store_Date_Format);
      }
      return null;
    }
    /**
     * Get date only to view on UI and date picker
     * @param {any} pDate
     */
    function getUIFormatedDate(pDate, format) {
      if (pDate) {
        // New version of sequalize in date only give date not given time for that reason no need to this line so commented
        pDate = moment(pDate).utcOffset(pDate).format(CORE.MOMENT_DATE_FORMAT);
        pDate = $filter('date')(new Date(pDate), format);
      }
      return pDate;//? moment(pDate).utcOffset(pDate).format(CORE.MOMENT_DATE_FORMAT) : null;
    }
    function getUIFormatedStringDate(pDate, format) {
      if (pDate) {
        // This function used for displaying history of datepicker field
        pDate = moment(pDate).format(CORE.MOMENT_DATE_FORMAT);
        pDate = $filter('date')(new Date(pDate), format);
      }
      return pDate;//? moment(pDate).utcOffset(pDate).format(CORE.MOMENT_DATE_FORMAT) : null;
    }
    function getUIFormatedDateTime(pDate, format) {
      if (pDate) {
        pDate = moment(pDate).utcOffset(pDate).format(CORE.MOMENT_DATE_TIME_FORMAT);
        pDate = $filter('date')(new Date(pDate), format);
      }
      return pDate;//? moment(pDate).utcOffset(pDate).format(CORE.MOMENT_DATE_FORMAT) : null;
    }

    function getUIFormatedDateTimeInCompanyTimeZone(pDate, format) {
      if (pDate && _timeZoneOffset) {
        pDate = moment(pDate).utcOffset(_timeZoneOffset).format(CORE.MOMENT_DATE_TIME_FORMAT);
        pDate = $filter('date')(new Date(pDate), format);
      }
      return pDate;//? moment(pDate).utcOffset(pDate).format(CORE.MOMENT_DATE_FORMAT) : null;
    }

    function getUIFormatedTimeFromTimeString(pTime, format) {
      if (pTime && format) {
        const nowDate = ((new Date()).toISOString()).split('T')[0];
        const newDateValue = new Date(nowDate + 'T' + pTime);
        pTime = $filter('date')(newDateValue, 'hh:mm a');
      }
      return pTime;
    }

    function getCurrentDate() {
      if (_timeZoneOffset) {
        return moment.utc().utcOffset(_timeZoneOffset).format(CORE.MOMENT_DATE_FORMAT);
      }
      else {
        return null;
      }
    }

    function getCurrentDateTime() {
      if (_timeZoneOffset) {
        return moment.utc().utcOffset(_timeZoneOffset).format(CORE.MOMENT_DATE_TIME_FORMAT);
      }
      else {
        return null;
      }
    }
    function getCurrentDateTimeUI() {
      if (_timeZoneOffset) {
        return moment.utc().utcOffset(_timeZoneOffset).format(CORE.MOMENT_DATE_TIME_FORMAT_UI);
      }
      else {
        return null;
      }
    }
    function getCurrentTime() {
      if (_timeZoneOffset) {
        return moment.utc().utcOffset(_timeZoneOffset).format(CORE.MOMENT_TIME_FORMAT);
      }
      else {
        return null;
      }
    }

    function getMfgCodeNameFormat(mfgCode, mfgName) {
      let mfgCodeName;
      if (_mfgCodeNameFormat && mfgCode && mfgName) {
        if (_mfgCodeNameFormat === parseInt(CORE.MFGCodeFormatList[0].id)) { //1 - Code First
          mfgCodeName = stringFormat('({0}){1}', mfgCode, mfgName);
        } else if (_mfgCodeNameFormat === parseInt(CORE.MFGCodeFormatList[1].id)) { //2 - Only Name
          mfgCodeName = mfgName;
        } else if (_mfgCodeNameFormat === parseInt(CORE.MFGCodeFormatList[2].id)) { //3 - Only Code
          mfgCodeName = mfgCode;
        } else {
          // Default - Code Last
          mfgCodeName = stringFormat('{0}({1})', mfgName, mfgCode);
        }
      } else {
        mfgCodeName = null;
      }
      return mfgCodeName;
    }

    function validateTransferStock(transferOption, sourceModel, targetModel) {
      const TrasferStockType = CORE.TrasferStockType;
      const transferSection = CORE.TransferSection;
      const warehouseType = TRANSACTION.warehouseType;
      const sourceWarehouseType = this.getWarehouseType(sourceModel.warehouseType);
      const targetWarehouseType = this.getWarehouseType(targetModel.warehouseType);
      let messageContent = null;

      if (sourceModel && targetModel) {
        if (transferOption == TrasferStockType.StockTransfer && sourceModel.parentWHID != targetModel.parentWHID) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_WITHIN_DEPARTMENT);
        }
        else if (transferOption == TrasferStockType.StockTransferToOtherDept && sourceModel.parentWHID == targetModel.parentWHID) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_TO_OTHER_DEPARTMENT);
        }
        else if (sourceModel.transferSection == transferSection.WH && targetModel.transferSection == transferSection.WH) {
          if (sourceModel.id == targetModel.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_WITHIN_WH);
          }
          else if (sourceModel.isPermanent && transferOption == TrasferStockType.StockTransferToOtherDept) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_PARMANENT_WH_TO_OTHER_DEPT);
            messageContent.message = stringFormat(messageContent.message, sourceModel.name, targetModel.name);
          }
          else if (sourceModel.umidPendingParts > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_PENDING_UMID_PART_WH);
            messageContent.message = stringFormat(messageContent.message, sourceModel.name);
          }
          else if (sourceModel.totalEmptyBin > 0 &&
            sourceModel.warehouseType == warehouseType.ShelvingCart.key &&
            sourceModel.parentWHType == CORE.ParentWarehouseType.MaterialDepartment &&
            transferOption == TrasferStockType.StockTransferToOtherDept) {
            messageContent = {
              message: stringFormat(TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.OPEN_EMPTY_POP_UP)
            };
          }
          else if (sourceModel.numberTotalKit > 0 && transferOption == TrasferStockType.StockTransferToOtherDept) {
            messageContent = {
              message: stringFormat(TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_ALLOCATED_KIT)
            };
          }
          else if (sourceModel.unallocatedUMID > 0 && transferOption == TrasferStockType.StockTransferToOtherDept) {
            messageContent = {
              message: stringFormat(TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_UNALLOCATED_UMID)
            };
          }
          else if (targetModel.id) {
            if (sourceModel.binCount == 0) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_EMPTY_WH);
            }
            else if (sourceModel.warehouseType != warehouseType.ShelvingCart.key) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_WH_OTHER_THEN_SHELVING_CART);
              messageContent.message = stringFormat(messageContent.message, sourceWarehouseType, sourceModel.name);
            }
            else if (targetModel.warehouseType != warehouseType.ShelvingCart.key) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_NOT_TRANSFER_OTHER_THEN_SHELVING_CART);
              messageContent.message = stringFormat(messageContent.message, sourceModel.name, targetWarehouseType, targetModel.name);
            }
            else if (sourceModel.allMovableBin == 0 || sourceModel.allMovableBin != true) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_WH_WITH_PERMANENT_BIN);
              messageContent.message = stringFormat(messageContent.message, sourceModel.name);
            }
            else if (targetModel.allMovableBin == 0 || targetModel.allMovableBin != true) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_WH_TO_WH_WITH_PERMANENT_BIN);
              messageContent.message = stringFormat(messageContent.message, targetModel.name);
            }
          }
        }
        else if (sourceModel.transferSection == transferSection.Bin && targetModel.transferSection == transferSection.WH) {
          if (sourceModel.warehouseID == targetModel.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_WITHIN_WH);
          }
          else if (targetModel.allMovableBin == 0 || targetModel.allMovableBin != true) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_Bin_TO_WH_WITH_PERMANENT_BIN);
            messageContent.message = stringFormat(messageContent.message, sourceModel.name, targetModel.name);
          }
          else if (sourceModel.umidPendingParts > 0 && transferOption != TrasferStockType.DeptTransfer) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_PENDING_UMID_PART_BIN);
            messageContent.message = stringFormat(messageContent.message, sourceModel.name);
          }
          else if (sourceModel.numberTotalKit > 0 && transferOption == TrasferStockType.StockTransferToOtherDept) {
            messageContent = {
              message: stringFormat(TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_ALLOCATED_KIT)
            };
          }
          else if (sourceModel.unallocatedUMID > 0 && transferOption == TrasferStockType.StockTransferToOtherDept) {
            messageContent = {
              message: stringFormat(TRANSACTION.PERFORM_ACTION_IN_TRANSFER_VALIDATION.WH_TRANSFER_CONFIRMATION_UNALLOCATED_UMID)
            };
          }
        }
        else if (sourceModel.transferSection == transferSection.Bin && targetModel.transferSection == transferSection.Bin) {
          if (sourceModel.id == targetModel.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_WITHIN_BIN);
          }
          else if (sourceModel.umidPendingParts > 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_PENDING_UMID_PART_BIN);
            messageContent.message = stringFormat(messageContent.message, sourceModel.name);
          }
          else if (sourceModel.uidCount == 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_EMPTY_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.SmartCart.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_SMART_CART_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.Equipment.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_EQUIPMENT_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.ShelvingCart.key && targetModel.warehouseType == warehouseType.SmartCart.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_TO_SMART_CART_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.ShelvingCart.key && targetModel.warehouseType == warehouseType.Equipment.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_TO_EQUIPMENT_BIN);
          }
        }
        else if (sourceModel.transferSection == transferSection.UID && targetModel.transferSection == transferSection.Bin) {
          if (sourceModel.binID == targetModel.id) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_WITHIN_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.SmartCart.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_SMART_CART_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.Equipment.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_EQUIPMENT_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.ShelvingCart.key && targetModel.warehouseType == warehouseType.SmartCart.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_TO_SMART_CART_BIN);
          }
          else if (sourceModel.warehouseType == warehouseType.ShelvingCart.key && targetModel.warehouseType == warehouseType.Equipment.key) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_TRANSFER_TO_EQUIPMENT_BIN);
          }
        }
        else if (sourceModel.transferSection == transferSection.Kit && targetModel.transferSection == transferSection.Dept) {
          if (targetModel.type == CORE.ParentWarehouseType.ProductionDepartment && sourceModel.kitReleaseStatus == CORE.Kit_Release_Status.FullReleased) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_ALREADY_RELEASED);
          }
          else if (targetModel.type == CORE.ParentWarehouseType.ProductionDepartment && (!sourceModel.allocationUMIDCount || sourceModel.allocationUMIDCount == 0)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.REQUIRE_ALLOCATION_FOR_RELEASE);
          }
        }
      }

      return messageContent;
    }

    function goToAddUpdateWorkorderManualEntry(woID, woTransID) {
      this.openInNew(WORKORDER.WO_MANAGE_MANUAL_ENTRY_STATE, { woID: woID, woTransID: woTransID });
    }

    function checkRightToAccessPopUp(data) {
      /* check user have access to popup (page access rights) */
      const loginUserAllAccessPages = service.loginUserPageList;
      if (data && data.popupAccessRoutingState && data.popupAccessRoutingState.length > 0) {
        const loginUserAllAccessPageRoute = _.map(loginUserAllAccessPages, (item) => item.PageDetails && item.PageDetails.pageRoute);
        const isAllowToAccessPopup = data.popupAccessRoutingState.every((elem) => loginUserAllAccessPageRoute.indexOf(elem) > -1);
        if (!isAllowToAccessPopup) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.POPUP_ACCESS_DENIED);
          messageContent.message = stringFormat(messageContent.message, data.pageNameAccessLabel ? data.pageNameAccessLabel.toLowerCase() : 'this');
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then(() => {
          });
          return false;
        }
        return true;
      } else {
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.POPUP_ACCESS_INVALID_PARAMETER,
          multiple: true
        };
        DialogFactory.alertDialog(model).then(() => {
        });
        return false;
      }
    }

    function goToCreateFormsElementManage(entityID) {
      this.openInNew(CONFIGURATION.CONFIGURATION_FORMS_DATAELEMENT_MANAGE_STATE, { entityID: entityID, dataElementID: null });
    }

    function getEntityStatusClassName(statusID) {
      const status = _.find(CORE.CustomFormsStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.ClassName : '';
    }

    /* to go at po status assembly wise report */
    function goToPOStatusAssemblyReport(customerID, salesOrderDetID, partID) {
      this.openInNew(REPORTS.PO_STATUS_ASSY_REPORT_STATE, { customerID: customerID, salesOrderDetID: salesOrderDetID, partID: partID });
    }

    /* to go at po status so wise report */
    function goToPOStatusSalseOrderReport(customerID, salesOrderID) {
      this.openInNew(REPORTS.PO_STATUS_PO_REPORT_STATE, { customerID: customerID, salesOrderID: salesOrderID });
    }

    function getGenericDraftPublishStatus(statusID) {
      const status = _.find(CORE.GenericDraftPublishStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.Name : '';
    }

    function getGenericDraftPublishStatusClassName(statusID) {
      const status = _.find(CORE.GenericDraftPublishStatus, (item) => {
        return item.ID == statusID;
      });
      return status ? status.ClassName : '';
    }

    // common function to display invalid on display order
    function setInvalidDisplayOrder(oldvalue, newvalue, index, displayOrderColumnInex, gridOptions, sourceData, sourceHeader, rowEntity, isRequired) {
      let returnValue = true;
      if (isRequired && (newvalue === null || newvalue === undefined || newvalue === '')) {
        if (gridOptions.gridApi && (gridOptions.gridApi.cellNav || gridOptions.gridApi.grid)) {
          gridOptions.gridApi.cellNav.scrollToFocus(sourceData[index], sourceHeader[displayOrderColumnInex]);
          gridOptions.gridApi.grid.validate.setInvalid(sourceData[index], sourceHeader[displayOrderColumnInex]);
        }
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.REQUIRED,
          multiple: true
        };
        DialogFactory.alertDialog(model).then(() => {
          gridOptions.gridApi.cellNav.scrollToFocus(sourceData[index], sourceHeader[displayOrderColumnInex]);
          gridOptions.gridApi.grid.validate.setInvalid(sourceData[index], sourceHeader[displayOrderColumnInex]);
        });
        rowEntity.displayOrder = null;
        returnValue = false;
      }
      else if (newvalue && newvalue > CORE.DisplayOrder.MaxLength) {
        if (gridOptions.gridApi && (gridOptions.gridApi.cellNav || gridOptions.gridApi.grid)) {
          gridOptions.gridApi.cellNav.scrollToFocus(sourceData[index], sourceHeader[displayOrderColumnInex]);
          gridOptions.gridApi.grid.validate.setInvalid(sourceData[index], sourceHeader[displayOrderColumnInex]);
        }
        const model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.INVALID,
          multiple: true
        };
        DialogFactory.alertDialog(model).then(() => {
          gridOptions.gridApi.cellNav.scrollToFocus(sourceData[index], sourceHeader[displayOrderColumnInex]);
          gridOptions.gridApi.grid.validate.setInvalid(sourceData[index], sourceHeader[displayOrderColumnInex]);
        });
        rowEntity.displayOrder = null;
        returnValue = false;
      }
      return returnValue;
    }

    function goToNotificationList() {
      this.openInNew(NOTIFICATION.NOTIFICATION_STATE);
    }

    //function getMaxLengthValidationForTextEditor(maxLength, enterText) {
    //    let convertHtmlToText = enterText ? String(enterText).replace(/<[^>]+>/gm, '') : null;
    //    let convertTextLength = convertHtmlToText ? convertHtmlToText.length : 0;
    //    if (convertTextLength > maxLength) {
    //        return stringFormat(CORE.MESSAGE_CONSTANT.MAXLENGTH, convertTextLength, maxLength);
    //    }
    //}

    function goToNonUMIDStockList(whId, binId, keywords) {
      this.openInNew(TRANSACTION.TRANSACTION_NONUMIDSTOCK_STATE, { whId: whId, binId: binId, keywords: keywords });
    }

    function goToManageOperation(operationID, openINSameTab) {
      if (openINSameTab) {
        $state.go(OPERATION.OPERATION_MANAGE_DETAILS_STATE, { opID: operationID });
      }
      else {
        this.openInNew(OPERATION.OPERATION_MANAGE_DETAILS_STATE, { opID: operationID });
      }
    }

    function goToGenericCategoryManageLocation(gencCategoryID) {
      this.openInNew(USER.ADMIN_LOCATIONTYPE_MANAGEGENERICCATEGORY_STATE, { categoryTypeID: CORE.CategoryType.LocationType.ID, gencCategoryID: gencCategoryID });
    }

    function goToManageOperationManagement(masterTemplateID, openINSameTab) {
      if (openINSameTab) {
        $state.go(OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_STATE, { id: masterTemplateID });
      }
      else {
        this.openInNew(OPERATION.OPERATION_MASTER_MANAGE_TEMPLATE_STATE, { id: masterTemplateID });
      }
    }

    function goToGenericCategoryLocationsList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_LOCATIONTYPE_STATE, { categoryTypeID: CORE.CategoryType.LocationType.ID });
    }

    function goToGenericCategoryEquipmentGroupList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_EQPGROUP_STATE, { categoryTypeID: CORE.CategoryType.EquipmentGroup.ID });
    }

    function goToGenericCategoryEquipmentTypeList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_EQPTYPE_STATE, { categoryTypeID: CORE.CategoryType.EquipmentType.ID });
    }

    function goToGenericCategoryEquipmentOwnershipList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_EQPOWNER_STATE, { categoryTypeID: CORE.CategoryType.EquipmentOwnership.ID });
    }

    function goToGenericCategoryStandardTypeList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_STANDTYPE_STATE, { categoryTypeID: CORE.CategoryType.StandardType.ID });
    }

    function goToGenericCategoryOperationTypeList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_OPTYPE_STATE, { categoryTypeID: CORE.CategoryType.OperationType.ID });
    }

    function goToGenericCategoryShippingStatusList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPSTATUS_STATE, { categoryTypeID: CORE.CategoryType.ShippingStatus.ID });
    }

    function goToGenericCategoryOperationVerificationStatusList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_VERISTATUS_STATE, { categoryTypeID: CORE.CategoryType.OperationVerificationStatus.ID });
    }

    function goToGenericCategoryWorkAreaList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_WORKAREA_STATE, { categoryTypeID: CORE.CategoryType.WorkArea.ID });
    }

    function goToGenericCategoryShippingTypeList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE, { categoryTypeID: CORE.CategoryType.ShippingType.ID });
    }

    function goToManageGenericCategoryShippingType(id) {
      this.openInNew(USER.ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE, { categoryTypeID: CORE.CategoryType.ShippingType.ID, gencCategoryID: id });
    }

    function goToGenericCategoryTermsList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_TERMS_STATE, { categoryTypeID: CORE.CategoryType.Terms.ID });
    }

    function goToGenericCategoryManageTerms(gencCategoryID) {
      this.openInNew(USER.ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE, { categoryTypeID: CORE.CategoryType.Terms.ID, gencCategoryID: gencCategoryID });
    }

    function goToGenericCategoryPrinterList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE, { categoryTypeID: CORE.CategoryType.Printer.ID });
    }

    function goToGenericCategoryPartStatusList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_PART_STATUS_STATE, { categoryTypeID: CORE.CategoryType.PartStatus.ID });
    }

    function goToGenericCategoryBarcodeSeparatorList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_STATE, { categoryTypeID: CORE.CategoryType.BarcodeSeparator.ID });
    }

    function goToGenericCategoryHomeMenuList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_STATE, { categoryTypeID: CORE.CategoryType.HomeMenu.ID });
    }

    function goToGenericCategoryECO_DFMTypeList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_STATE, { categoryTypeID: CORE.CategoryType.ECO_DFMType.ID });
    }

    function goToCofC(id) {
      this.openInNew(TRANSACTION.TRANSACTION_COFC_DOCUMENT_STATE, { id: id });
    }

    function goToPackingSlipDocument(id) {
      this.openInNew(TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_STATE, { type: TRANSACTION.MaterialReceiveTabType.Documents, id: id });
    }

    function goToGenericCategoryNotificationCategoryList() {
      this.openInNew(USER.ADMIN_GENERICCATEGORY_NOTIFICATION_CATEGORY_STATE, { categoryTypeID: CORE.CategoryType.NotificationCategory.ID });
    }
    function goToCreditMemoDetail(tabName, id) {
      this.openInNew(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, { type: tabName || TRANSACTION.SupplierInvoiceType.Detail, id: id });
    }
    function goToDebitMemoDetail(tabName, id) {
      this.openInNew(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, { type: tabName || TRANSACTION.SupplierInvoiceType.Detail, id: id });
    }
    function gotoDataKeyList() {
      this.openInNew(CONFIGURATION.CONFIGURATION_MANAGE_SETTINGS_STATE, {});
    }
    function gotoTaskList() {
      this.openInNew(TRAVELER.TRAVELER_PAGE_STATE, {});
    }
    function goToDataSourceList() {
      this.openInNew(CONFIGURATION.CONFIGURATION_RAWDATACATEGORY_STATE);
    }
    function goToUnauthorizeRequestList() {
      this.openInNew(TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_STATE);
    }
    function gotoTransactionRequestPage() {
      this.openInNew(TRANSACTION.TRANSACTION_INOVAXELOG_STATE);
    }
    function goToDynamicReportViewer(state, reportName) {
      this.openURLWithTokenInNew(state, { reportId: reportName });
      //this.openInNew(state, { reportId: reportName });
    }
    function getTransferBulkURL() {
      var transferBulkURL = WebsiteBaseUrl + CORE.URL_PREFIX + TRANSACTION.TRANSACTION_ROUTE + TRANSACTION.TRANSACTION_TRANSFER_STOCK_ROUTE.replace(':whId', '{0}').replace(':sodId', '{1}').replace(':assyId', '{2}');
      return transferBulkURL;
    }
    function goToPartPurchaseInspectionRequirement(partID) {
      this.openInNew(USER.ADMIN_MANAGECOMPONENT_COMMENTS_STATE, { coid: partID, selectedTab: USER.PartMasterTabs.Comments.Name });
    }
    function goToTemplatePurchaseInspectionRequirement() {
      this.openInNew(USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_STATE);
    }
    function goToPurchaseInspectionRequirement() {
      this.openInNew(USER.ADMIN_PURCHASE_INSPECTION_REQUIREMENT_STATE);
    }
    function goToFOB() {
      this.openInNew(USER.ADMIN_FOB_STATE);
    }
    function goToEmailTemplateList() {
      this.openInNew(CONFIGURATION.CONFIGURATION_EMAIL_TEMPLATE_STATE, { templateType: CONFIGURATION.Agreement_Template_Type.EMAIL });
    }
    function goToAgreementTemplateList() {
      this.openInNew(CONFIGURATION.CONFIGURATION_AGREEMENT_STATE, { templateType: CONFIGURATION.Agreement_Template_Type.AGREEMENT });
    }
    function goToUserAgreementTemplateList() {
      this.openInNew(CORE.USER_PROFILE_SIGNUP_AGREEMENT_STATE, {});
    }
    function goToSupplierRMAList() {
      this.openInNew(TRANSACTION.TRANSACTION_SUPPLIER_RMA_STATE, {});
    }
    function goToManageSupplierRMA(type, id, partid, packingslipid) {
      this.openInNew(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_RMA_STATE, { type: type, id: id, partid: partid, packingslipid: packingslipid });
    }
    function goToSupplierRMAAddress(id) {
      this.openInNew(USER.ADMIN_MANAGESUPPLIER_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: id });
    }
    function goToCustomerRMAAddress(id) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER, cid: id });
    }

    function generateRedirectLinkForKit(strKitName) {
      const kitName = [];
      const transferBulkURL = this.getTransferBulkURL();
      const splitKitName = strKitName ? strKitName.split('@@@') : [];
      _.map(splitKitName, (data) => {
        if (data) {
          const splitValue = data.split('###');
          if (splitValue.length > 0) {
            const kitString = stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'cursor-pointer\'>{1}</a>', stringFormat(transferBulkURL, 0, splitValue[0], splitValue[1]), splitValue[2]);
            kitName.push(kitString);
          }
        }
      });
      return kitName;
    };

    function goToRohsList() {
      this.openInNew(USER.ADMIN_ROHS_STATE, {});
    }

    /* Bhavik: Commented below code as found it is nowhere used. */
    // function getReportFilterOption() {
    //   var filterList = getLocalStorageValue('reportFilterData');
    //   filterList = (Array.isArray(filterList)) ? filterList : [];
    //   return filterList;
    // }
    // function getReportFilterOptionByID(reportUniqueId, filterParameter) {
    //   var filterDetail = getReportFilterOption();
    //   filterDetail = filterDetail.find(item => item.reportId === reportUniqueId);
    //   return filterDetail;
    // }

    // function deleteReportFilterOptionByID(reportUniqueId, filterParameter) {
    //   var filterDetail = getReportFilterOption();

    //   var reportIndex = filterDetail.findIndex(item => item.reportId === reportUniqueId);
    //   filterDetail.splice(reportIndex, 1);

    //   setLocalStorageValue('reportFilterData', filterDetail);
    // }

    // function setReportFilterOption(reportUniqueId, filterParameter) {
    //   var filterList = getReportFilterOption();
    //   var filterDetail = {
    //     reportId: reportUniqueId,
    //     filterParameter: filterParameter
    //   };
    //   filterList.push(filterDetail);
    //   setLocalStorageValue('reportFilterData', filterList);
    // }

    function setPageSizeOfGrid(pagingInfo, gridOptions, resetPagInfo) {
      if ((gridOptions && gridOptions.enablePaging) || CORE.UIGrid.enablePaging) {
        pagingInfo.Page = gridOptions.paginationCurrentPage = resetPagInfo === false ? pagingInfo.Page : (pagingInfo.Page || CORE.UIGrid.Page());
        pagingInfo.pageSize = gridOptions.paginationPageSize = resetPagInfo === false ? pagingInfo.ItemsPerPage : (pagingInfo.ItemsPerPage || CORE.UIGrid.paginationPageSizes[0]);
      } else {
        pagingInfo.pageSize = (resetPagInfo === false ? pagingInfo.Page : CORE.UIGrid.Page()) * CORE.UIGrid.ItemsPerPage();
        pagingInfo.Page = CORE.UIGrid.Page();
      }
    }

    function goToCustomerPackingSlipList() {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_STATE, {});
    }

    function goToManageCustomerPackingSlip(customerSlipID, SalesorderID, tabObj, lineMaterialType, SODetId, SOReleaseId) {
      const route = TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE;
      const paramObj = { id: customerSlipID, sdetid: SalesorderID };
      if (lineMaterialType && SODetId && SOReleaseId) {
        paramObj.lType = lineMaterialType || 1;
        paramObj.sodid = SODetId || 0;
        paramObj.sorelid = SOReleaseId || 0;
      }
      if (tabObj && tabObj.openInSameTab) {
        $state.go(route, paramObj, {}, { reload: true });
      } else {
        this.openInNew(route, paramObj);
      }
    }

    function goToCustomerPackingSlipDocument(customerSlipID, SalesorderID) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_STATE, { id: customerSlipID, sdetid: SalesorderID });
    }

    function goToCustomerInvoiceList() {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE, {});
    }

    function goToManageCustomerInvoice(customerInvoiceID, tabObj, currPackingSlipNumber) {
      const route = TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE;
      if (tabObj && tabObj.openInSameTab) {
        $state.go(route, { transType: 'I', id: customerInvoiceID, packingSlipNumber: currPackingSlipNumber || '' }, {}, { reload: true });
      } else {
        this.openInNew(route, { transType: 'I', id: customerInvoiceID, packingSlipNumber: currPackingSlipNumber || '' });
      }
    }

    function goToCustomerInvoiceDocument(customerInvoiceID) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_STATE, { transType: 'I', id: customerInvoiceID });
    }

    function goToCustomerInvoicePackingSlipDocument(customerInvoiceID) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_STATE, { transType: 'I', id: customerInvoiceID });
    }

    function goToOperationMasterTemplateList(openInSameTab) {
      if (openInSameTab) {
        $state.go(OPERATION.OPERATION_MASTER_TEMPLATE_STATE, {});
      } else {
        this.openInNew(OPERATION.OPERATION_MASTER_TEMPLATE_STATE, {});
      }
    }

    function goToCustomerContactPersonList(customerType, customerID) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_CONTACTS_STATE, { customerType: customerType, cid: customerID });
    }

    function goToCustomerBillingAddressList(customerType, customerID) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_ADDRESSES_STATE, { customerType: customerType, cid: customerID });
    }

    function goToCustomerBusinessAddressList(customerID) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_STATE, { cid: customerID });
    }

    function goToCustomerWireTransferAddress(customerID) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER, cid: customerID });
    }

    function goToCustomerShippingAddressList(customerType, customerID) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_ADDRESSES_STATE, { customerType: customerType, cid: customerID });
    }

    function goToCustomerMarkForAddressList(customerID) {
      this.openInNew(USER.ADMIN_MANAGECUSTOMER_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.CUSTOMER, cid: customerID });
    }

    function goToPurchaseOrderDocumentsDetail(id) {
      this.openInNew(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_STATE, { id: id });
    }

    function goToComponentUMIDList(partID, mfgType) {
      const routeState = mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_UMID_LIST_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_UMID_LIST_STATE;
      this.openInNew(routeState, { coid: partID, selectedTab: USER.PartMasterTabs.UMIDList.Name });
    }

    function goToAddCustomerInvoice(currPackingSlipNumber, isOpenInNew) {
      if (isOpenInNew) {
        this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { transType: 'I', id: 0, packingSlipNumber: currPackingSlipNumber || '' });
      } else {
        //this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { id: 0, packingSlipNumber: currPackingSlipNumber || '' });
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, {
          transType: 'I',
          id: 0,
          packingSlipNumber: currPackingSlipNumber || ''
        });
      }
    }

    function goToCreditMemoList() {
      this.openInNew(TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_STATE, {});
    }

    function goToDebitMemoList() {
      this.openInNew(TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE, {});
    }

    function goToHelpBlogDetail(Id) {
      this.openInNew(CONFIGURATION.CONFIGURATION_HELPBLOG_STATE, { id: Id });
    }

    function validateDateCode(dateCodeFormat, datecode) {
      let isInValidDatecode = dateCodeFormat ? (datecode && datecode.length < 4 ? true : false) : false;
      if (datecode && datecode.length === 4) {
        if (dateCodeFormat === CORE.AssyDateCodeFormats[0]) {
          isInValidDatecode = datecode.substring(0, 2) !== '00' ? datecode.substring(2, 4) > '53' : true;
        }
        else {
          isInValidDatecode = datecode.substring(0, 2) <= '53' ? (datecode.substring(2, 4) === '00') : true;
        }
      }
      return isInValidDatecode;
    }

    function getCustomerPackingSlipStatus(statusID) {
      const status = _.find(CORE.CustomerPackingSlipStatus, (item) => {
        return item.ID === statusID;
      });
      return status ? status.Name : '';
    }

    function getCustomerPackingSlipStatusClassName(statusID) {
      const status = _.find(CORE.CustomerPackingSlipStatus, (item) => {
        return item.ID === statusID;
      });
      return status ? status.ClassName : '';
    }

    function getCustomerPackingSlipMainStatusClassName(statusID) {
      const status = _.find(CORE.CustomerPackingSlipStatus, (item) => item.ParentID === statusID);
      return status ? status.ClassName : '';
    }
    /* STATIC CODE - to set browser tab title (as per index.html)
     as browser self append PDF name in title when view any PDF file */
    function setBrowserTabTitleManually() {
      $timeout(() => {
        document.title = $rootScope.pageTitle ? 'FJT - ' + $rootScope.pageTitle : 'FJT';
      }, 1000);
    };

    let umid, transferOpen, setTransactionIDEvent, transactionID;
    /* xfer bin popup*/
    function openTransferBin() {
      DialogFactory.dialogService(
        TRANSACTION.BIN_TRANSFER_POPUP_CONTROLLER,
        TRANSACTION.BIN_TRANSFER_POPUP_VIEW,
        null,
        null).then(() => {
          // Empty
        }, () => {
          $rootScope.$broadcast('RefreshUMIDGrid');
        }, (err) => getErrorLog(err));
    };
    /* split umid popup*/
    function openSplitUID() {
      DialogFactory.dialogService(
        TRANSACTION.SPLIT_UID_POPUP_CONTROLLER,
        TRANSACTION.SPLIT_UID_POPUP_VIEW,
        null,
        null).then((umidDetail) => {
          $state.go(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { id: umidDetail ? umidDetail.id : null });
        }, () => {
        }, (err) => getErrorLog(err));
    };
    /* count material popup*/
    function openCountMaterial() {
      transferOpen = true;
      const data = {
        updateStock: true,
        transactionID: transactionID,
        uid: umid
      };
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then(() => {
          transferOpen = false;
          umid = null;
        }, () => {
          transferOpen = false;
          umid = null;
        }, (err) => {
          transferOpen = false;
          umid = null;
          return getErrorLog(err);
        });
    };
    /* xfer material popup*/
    function openTransferMaterial() {
      transferOpen = true;
      const data = {
        updateStock: false,
        transactionID: transactionID,
        uid: umid
      };
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then(() => {
          transferOpen = false;
          umid = null;
        }, () => {
          transferOpen = false;
          umid = null;
        }, (err) => {
          transferOpen = false;
          umid = null;
          return getErrorLog(err);
        });
    };
    //call to open transfer material popup set detail of different user
    const transaction = $rootScope.$on('setTransactionID', (event, data) => {
      transactionID = data.transactionID;
      setTransactionIDEvent = event;
      if (data.isOpen) {
        transferOpen = true;
      };
      service.selectedtransactionID = transactionID;
    });

    $rootScope.$on('$destroy', () => {
      // Remove socket listeners
      if (transactionID) {
        removePickUserDeatil();
      }
      transaction();
      removeSocketListener();
    });

    function updateForceDeliverRequest(request) {
      if (!transferOpen && transactionID && request.OriginalTransactionID === transactionID) {
        umid = request.UID;
        openTransferMaterial(setTransactionIDEvent);
      }
    }

    function updateCancelRequestStatus(req) {
      if (req.allRequest || req.transactionID === transactionID) {
        $timeout(() => {
          setCommonTransaction();
        }, 1500);
      }
    }

    function updateUsertoMapandPick(item) {
      if (transactionID && item.response.userID !== service.loginUser.userid && transactionID === item.response.TransactionID) {
        setCommonTransaction();
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COLOR_PICKED_USER);
        messageContent.message = stringFormat(messageContent.message, item.response.ledColorName, item.response.userName);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
      if (item.userID === service.loginUser.userid) {
        transactionID = item.response.TransactionID;
        service.selectedtransactionID = transactionID;
      }
    }

    const setCommonTransaction = () => {
      transactionID = null;
      umid = null;
      service.selectedtransactionID = transactionID;
    };

    function generateAddressFormateForStoreInDB(Address) {
      let address = null;
      if (Address) {
        // company name bind detail
        address = Address.companyName;
        if (address) {
          address = stringFormat('{0}\rATTN: {1}', address, Address.personName);
        }
        // division bind detail
        if (Address.division) {
          address = stringFormat('{0}\r{1}', address, Address.division);
        }
        if (Address.street1) {
          address = stringFormat('{0}\r{1}', address, Address.street1);
        }
        if (Address.street2) {
          address = stringFormat('{0}\r{1}', address, Address.street2);
        }
        if (Address.street3) {
          address = stringFormat('{0}\r{1}', address, Address.street3);
        }
        const addressDetail = stringFormat('{0}, {1} {2}, {3}',
          Address.city, Address.state, Address.postcode, Address.countryMst.countryName);
        // address bind
        address = stringFormat('{0}\r{1}', address, addressDetail);
        //email bind
        if (Address.email) {
          address = stringFormat('{0}\rEmail: {1}', address, Address.email);
        }
        // phone bind
        if (Address.contact) {
          address = stringFormat('{0}\rPhone: {1} {2}', address, Address.contact, (Address.phExtension ? 'Ext. ' + Address.phExtension : ''));
        }
        // fax bind
        if (Address.faxNumber) {
          address = stringFormat('{0}\rFax: {1}', address, Address.faxNumber);
        }
      }
      return address;
    };
    function generateAddressFormateToStoreInDB(Address) {
      let address = null;
      if (Address) {
        // company name bind detail
        address = stringFormat('Business Name: {0}', Address.companyName);
        if (Address.street1) {
          address = stringFormat('{0}\rAddress: {1}', address, Address.street1);
        }
        if (Address.street2) {
          address = stringFormat('{0}\r{1}', address, Address.street2);
        }
        if (Address.street3) {
          address = stringFormat('{0}\r{1}', address, Address.street3);
        }
        const addressDetail = stringFormat('{0}, {1} {2}, {3}',
          Address.city, Address.state, Address.postcode, Address.countryMst && Address.countryMst.countryName);
        // address bind
        address = stringFormat('{0}\r{1}', address, addressDetail);
      }
      return address;
    };
    function getFormatedTextAngularValue(pValue) {
      let textAngularKeyCode;
      if (pValue) {
        if ($rootScope.textAngularKeyCode) {
          textAngularKeyCode = JSON.parse($rootScope.textAngularKeyCode);
        }
        if (!textAngularKeyCode) {
          return pValue;
        } else {
          if (textAngularKeyCode && textAngularKeyCode.textAngularAPIKeyCode && textAngularKeyCode.FJTAPIUrl) {
            pValue = pValue.replace(new RegExp(textAngularKeyCode.textAngularAPIKeyCode, 'g'), textAngularKeyCode.FJTAPIUrl);
          }
          if (textAngularKeyCode && textAngularKeyCode.textAngularWebKeyCode && textAngularKeyCode.FJTWebUrl) {
            pValue = pValue.replace(new RegExp(textAngularKeyCode.textAngularWebKeyCode, 'g'), textAngularKeyCode.FJTWebUrl);
          }
        }
      }
      return pValue;
    }

    function getFormatedHistoryDataList(data) {
      if (data && data.length > 0) {
        data.forEach((row) => {
          switch (row.valueDataType) {
            case 'amount':
              row.Newval = (!row.Newval || isNaN(row.Newval)) ? row.Newval : parseFloat(row.Newval).toFixed(_amountFilterDecimal);
              row.Oldval = (!row.Oldval || isNaN(row.Oldval)) ? row.Oldval : parseFloat(row.Oldval).toFixed(_amountFilterDecimal);
              break;
            case 'sixdigitunitprice':
              row.Newval = (!row.Newval || isNaN(row.Newval)) ? row.Newval : parseFloat(row.Newval).toFixed(_sixDigitUnitFilterDecimal);
              row.Oldval = (!row.Oldval || isNaN(row.Oldval)) ? row.Oldval : parseFloat(row.Oldval).toFixed(_sixDigitUnitFilterDecimal);
              break;
            case 'unitprice':
              row.Newval = (!row.Newval || isNaN(row.Newval)) ? row.Newval : parseFloat(row.Newval).toFixed(_unitPriceFilterDecimal);
              row.Oldval = (!row.Oldval || isNaN(row.Oldval)) ? row.Oldval : parseFloat(row.Oldval).toFixed(_unitPriceFilterDecimal);
              break;
            case 'displayorder':
              break;
            /*not required to format integer numbers as it will have numbers only, so after and before format number values will be same
              case 'int':
                break;*/
            case 'percentage':
            case 'decimal':/*format 2 digit*/
              row.Newval = (!row.Newval || isNaN(row.Newval)) ? row.Newval : parseFloat(row.Newval).toFixed(2);
              row.Oldval = (!row.Oldval || isNaN(row.Oldval)) ? row.Oldval : parseFloat(row.Oldval).toFixed(2);
              break;
            case 'qty':
              row.Newval = (!row.Newval || isNaN(row.Newval)) ? row.Newval : parseInt(row.Newval);
              row.Oldval = (!row.Oldval || isNaN(row.Oldval)) ? row.Oldval : parseInt(row.Oldval);
              break;
            case 'date':
            case 'Date':
              row.Newval = row.Newval ? this.getUIFormatedStringDate(row.Newval, _dateDisplayFormat) : row.Newval;
              row.Oldval = row.Oldval ? this.getUIFormatedStringDate(row.Oldval, _dateDisplayFormat) : row.Oldval;
              break;
            case 'datetime':
              const newVal = row.Newval ? `${(row.Newval.replace(' ', "T"))}.000Z` : row.Newval;
              const oldval = row.Oldval ? `${(row.Oldval.replace(' ', "T"))}.000Z` : row.Oldval;
              row.Newval = row.Newval ? this.getUIFormatedDateTimeInCompanyTimeZone(newVal, _dateTimeDisplayFormat) : row.Newval;
              row.Oldval = row.Oldval ? this.getUIFormatedDateTimeInCompanyTimeZone(oldval, _dateTimeDisplayFormat) : row.Oldval;
              break;
            case 'time':
              row.Newval = row.Newval ? this.getUIFormatedTimeFromTimeString(row.Newval, _timeDisplayFormat) : row.Newval;
              row.Oldval = row.Oldval ? this.getUIFormatedTimeFromTimeString(row.Oldval, _timeDisplayFormat) : row.Oldval;
              break;
            case 'text':
            case 'longtext':
              row.Newval = row.Newval ? this.getFormatedTextAngularValue(row.Newval) : row.Newval;
              row.Oldval = row.Oldval ? this.getFormatedTextAngularValue(row.Oldval) : row.Oldval;
              break;
            default:
              break;
          }
        });
      }
      return data;
    }

    function loginIDS() {
      $rootScope.manager.signinRedirect({
        state: location.hash
      }).catch(err => {
        window.location.href = 'site-unavailable.html';
      });
    };

    function logoutIDS() {
      $rootScope.manager.signoutRedirect().catch(() => {
        window.location.href = 'site-unavailable.html';
      });
      completeLogout();
    };

    function completeLogout() {
      $rootScope.manager.signoutRedirectCallback().then(() => {
        $rootScope.manager.removeUser();
        localStorage.removeItem('user');
        /* only for debug purpose - [S]*/
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove login user from completeLogout' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
        }
        /* [E]*/
        localStorage.removeItem('loginuser');
        removeOidcValuesFromLocalStorage();
      }).then((res) => {
        console.log(res);
      }).catch((error) => console.log(error));
    };

    function completeSilentRenewal() {
      $rootScope.manager.signinSilentCallback()
        .then(() => {
          // console.log('signinSilentCallback callback: ', userDetail);
        }).catch((err) => {
          console.log('signinSilentCallback callback: ', err);
        });
    }

    $rootScope.manager.events.addUserLoaded((user) => {
      if (user) {
        const loginuser = getLocalStorageValue('loginuser');
        if (loginuser) {
          loginuser.token = user.access_token;
          service.loginUser.token = user.access_token;
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'set loginuser: addUserLoaded event.' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          setLocalStorageValue('loginuser', loginuser);
        }
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + user.access_token;
      }
    });

    $rootScope.manager.events.addAccessTokenExpired(x => {
      console.log('addAccessTokenExpired triggered ');
      $rootScope.manager.signinSilent();
      $rootScope.manager.signinSilentCallback()
        .then((userDetail) => {
          //console.log('signinSilentCallback callback: ', userDetail);
        })
        .catch((err) => {
          console.log('signinSilentCallback callback: ', err);
        });
    });

    /* only for testing purpose. */
    $rootScope.manager.events.addUserSignedOut(() => {
      /* only for debug purpose - [S]*/
      let tractActivityLog = getLocalStorageValue('tractActivityLog');
      if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
        tractActivityLog = [];
      }
      const loginuser = getLocalStorageValue('loginuser');
      if (loginuser) {
        const temObj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Cuerrent Token: ' + loginuser.token };
        tractActivityLog.push(temObj);
      }
      const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Hit addUserSignedOut.' };
      tractActivityLog.push(obj);
      setLocalStorageValue('tractActivityLog', tractActivityLog);
      /* [E]*/
    });

    /* Testing purpose - call below function if we got error in silent token renew. */
    $rootScope.manager.events.addSilentRenewError(() => {
      /* only for debug purpose - [S]*/
      let tractActivityLog = getLocalStorageValue('tractActivityLog');
      if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
        tractActivityLog = [];
      }
      const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Silent renew token Error:' };
      tractActivityLog.push(obj);
      setLocalStorageValue('tractActivityLog', tractActivityLog);
      /* [E]*/
    });

    function signoutListner() {
      // get value from localstorage for try to called function only once.
      const loginuser = getLocalStorageValue('loginuser');
      if (loginuser && loginuser.userid && loginuser.onlineStatus !== CHAT.USER_STATUS.DONOTDISTURB) {
        changeUserStatusOffline(loginuser.userid);
        // remove extra oidc library values from localstorage.
        removeOidcValuesFromLocalStorage();
      }

      $rootScope.manager.removeUser();
      localStorage.removeItem('user');
      /* only for debug purpose - [S]*/
      let tractActivityLog = getLocalStorageValue('tractActivityLog');
      if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
        tractActivityLog = [];
      }
      const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Remove loginuser: signoutListner.' };
      tractActivityLog.push(obj);
      setLocalStorageValue('tractActivityLog', tractActivityLog);
      /* [E]*/
      localStorage.removeItem('loginuser');
      service.loginUser = null;
    }

    function getCustInvStatusClassName(statusID, transType) {
      let status;
      if (transType === 'I') {
        status = _.find(CORE.Customer_Invoice_SubStatus, (item) => item.ID === statusID);
      } else {
        status = _.find(CORE.Customer_CrMemo_SubStatus, (item) => item.ID === statusID);
      }
      return status ? status.ClassName : '';
    }

    function goToCustomerCreditMemoList() {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_STATE, {});
    }

    function goToCustomerCreditMemoDetail(id, tabObj) {
      const route = TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE;
      if (tabObj && tabObj.openInSameTab) {
        $state.go(route, { transType: 'C', id: id }, {}, { reload: true });
      } else {
        this.openInNew(route, { transType: 'C', id: id });
      }
    }

    function downloadReport(response, reportName, isDownload, isCompany) {
      if (isCompany) {
        CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
          if (company && company.data) {
            downloadGenericReport(response, stringFormat('{0}-{1}', company.data.MfgCodeMst.mfgCode, reportName), isDownload);
          }
        }).catch((error) => getErrorLog(error));
      } else {
        downloadGenericReport(response, reportName, isDownload);
      }
    }
    function downloadGenericReport(response, reportName, isDownload) {
      var model = {
        messageContent: '',
        multiple: true
      };
      if (parseInt(response.status) === 404) {
        model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_NotFound);
        DialogFactory.messageAlertDialog(model);
      } else if (parseInt(response.status) === 403) {
        model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_AccessDenied);
        DialogFactory.messageAlertDialog(model);
      } else if (parseInt(response.status) === 401) {
        model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_Unauthorized);
        DialogFactory.messageAlertDialog(model);
      } else if (parseInt(response.status) === -1) {
        model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DownloadFileErrorMsg_SERVICEUNAVAILABLE);
        DialogFactory.messageAlertDialog(model);
      } else {
        const blob = new Blob([response.data], {
          type: 'application/pdf'
        });
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, reportName);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            if (isDownload) {
              link.setAttribute('download', reportName);
            } else {
              link.setAttribute('title', reportName);
              link.setAttribute('name', reportName);
              link.setAttribute('target', '_blank');
            }
            link.style = 'visibility:hidden';
            document.body.appendChild(link);
            $timeout(() => {
              link.click();
              URL.revokeObjectURL(url);
              document.body.removeChild(link);
            });
          }
        }
      }
    }
    function goToCustomerPaymentList() {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_LIST_STATE);
    }

    function goToCustomerPaymentDetail(custPaymentMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DETAIL_STATE, { id: custPaymentMstID });
    }
    function goToCustomerInvoicePackingSlipList() {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_STATE, {});
    }
    function goToCustomerPaymentDocument(custPaymentMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_PAYMENT_DOCUMENT_STATE, { id: custPaymentMstID });
    }
    function openTargetPopup(popupData) {
      DialogFactory.dialogService(
        popupData.controllerName,
        popupData.viewTemplateUrl,
        popupData.event,
        popupData.data).then((redirectData) => {
          setFocus();
        }, (redirectData) => {
          setFocus();
        }, (error) => {
          return BaseService.getErrorLog(error);
        });
      //this.openInNew(TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE, { id: umidID });
    }

    function getCustPaymentLockStatusClassName(lockStatus) {
      const status = _.find(TRANSACTION.CustomerPaymentLockStatusList, (item) => {
        return item.Name == lockStatus;
      });
      return status ? status.ClassName : '';
    }

    function getCustPaymentStatusClassName(paymentStatus) {
      const status = _.find(TRANSACTION.CustomerPaymentStatusList, (item) => {
        return item.Name == paymentStatus;
      });
      return status ? status.ClassName : '';
    }

    function goToCustomerRefundList() {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_LIST_STATE);
    }
    function goToCustomerRefundDetail(custRefundMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DETAIL_STATE, { id: custRefundMstID });
    }
    function goToCustomerRefundDocument(custRefundMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_REFUND_DOCUMENT_STATE, { id: custRefundMstID });
    }
    function getCustRefundStatusClassName(RefundStatus) {
      const status = _.find(TRANSACTION.CustomerRefundStatusList, (item) =>
        item.Name === RefundStatus
      );
      return status ? status.ClassName : '';
    }

    function goToSupplierPaymentList() {
      this.openInNew(TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE);
    }

    function goToSupplierPaymentDetail(id) {
      this.openInNew(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_STATE, { id: id });
    }

    function goToSupplierRefundList() {
      this.openInNew(TRANSACTION.TRANSACTION_INVOICE_REFUND_STATE);
    }
    function goToSupplierRefundDetail(id) {
      this.openInNew(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, { id: id });
    }

    function goToCustInvListWithTermsDueDateSearch(searchData) {
      if (searchData) {
        this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_STATE, {
          customerID: searchData.customerID,
          dueDate: searchData.dueDate,
          termsAndAboveDays: searchData.termsAndAboveDays,
          additionalDays: searchData.additionalDays,
          isIncludeZeroValueInv: searchData.isIncludeZeroValueInv,
          custInvCMSubStatusList: searchData.custInvSubStatusList
        });
      }
    }

    function goToCustCMListWithTermsDueDateSearch(searchData) {
      if (searchData) {
        this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_STATE, {
          customerID: searchData.customerID,
          dueDate: searchData.dueDate,
          termsAndAboveDays: searchData.termsAndAboveDays,
          additionalDays: searchData.additionalDays,
          custInvCMSubStatusList: searchData.custCMSubStatusList
        });
      }
    }

    function goToApplyCustCreditMemoToPayment(creditMemoMstID, custPaymentMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, { ccmid: creditMemoMstID, pid: custPaymentMstID });
    }

    function goToAppliedCustCreditMemoToInvList() {
      this.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_LIST_STATE);
    }

    function getReceivableRefPayTypeClassName(codeName) {
      const typeOfPay = _.find(_.values(TRANSACTION.ReceivableRefPaymentMode), (item) => item.code === codeName);
      return typeOfPay ? typeOfPay.className : '';
    }

    function disableReadOnlyControl(controls) {
      if (controls && controls.length > 0) {
        controls.forEach((item) => {
          /// Check Data Property of Element for Exclude ReadOnly Configuration
          if (!angular.element(item).data('excludereadonly')) {
            switch (item.nodeName) {
              case 'MD-ICON':
                if (angular.element(item).hasClass('icon-calendar')) {
                  const parentElement = angular.element(item).parent();
                  if (parentElement && parentElement[0] && parentElement[0].firstElementChild && parentElement[0].firstElementChild.nodeName === 'INPUT') {
                    angular.element(parentElement[0].firstElementChild).attr('disabled', true);
                  }
                }
                angular.element(item).removeAttr('ng-click');
                angular.element(item).attr('disabled', true);
                break;
              case 'BUTTON':
                angular.element(item).attr('disabled', true);
                break;
              case 'MD-CHECKBOX':
              case 'MD-SWITCH':
              case 'MD-RADIO-BUTTON':
              case 'MD-SELECT':
                angular.element(item).attr('disabled', true);
                break;
              case 'TEXTAREA':
              case 'INPUT':
                angular.element(item).attr('disabled', true);
                break;
              default:
            }

            if (item.children && item.children.length > 0) {
              disableReadOnlyControl(item.children);
            }
          }
        });
      } else {
        /// Check Data Property of Element for Exclude ReadOnly Configuration
        if (!angular.element(controls).data('excludereadonly')) {
          switch (controls.nodeName) {
            case 'MD-ICON':
              if (angular.element(item).hasClass('icon-calendar')) {
                const parentElement = angular.element(item).parent();
                if (parentElement && parentElement[0] && parentElement[0].firstElementChild && parentElement[0].firstElementChild.nodeName === 'INPUT') {
                  angular.element(parentElement[0].firstElementChild).attr('disabled', true);
                }
              }
              angular.element(item).removeAttr('ng-click');
              angular.element(item).attr('disabled', true);
              break;
            case 'MD-CHECKBOX':
            case 'BUTTON':
            case 'MD-SWITCH':
            case 'MD-RADIO-BUTTON':
            case 'MD-SELECT':
              angular.element(item).attr('disabled', true);
              break;
            case 'TEXTAREA':
            case 'INPUT':
              angular.element(item).attr('readonly', true);
              break;
            default:
          }
        }
      }
    }

    function setElementForDisabledReadOnly(elementNameList) {
      if (Array.isArray(elementNameList)) {
        elementNameList.forEach((elementName) => {
          const element = angular.element(document.querySelector(`[name='${elementName}']`));
          if (element) {
            disableReadOnlyControl(elements);
          }
        });
      } else {
        const element = angular.element(document.querySelector(`[name='${elementNameList}']`));
        if (element) {
          disableReadOnlyControl(elements);
        }
      }
    }
    function previewPopoverImage(imageUrl) {
      let templateUrl = angular.copy(CORE.ImagePopOverTemplate);
      templateUrl = stringFormat(templateUrl, imageUrl);
      return templateUrl;
    }

    function goToAppliedCustCreditMemoDocument(custCreditMemoMstID, custPaymentMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_DOCUMENT_STATE, { ccmid: custCreditMemoMstID, pid: custPaymentMstID });
    }

    function goToApplyCustWriteOffToPayment(custWriteOffPaymentMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_MANAGE_DET_STATE, { id: custWriteOffPaymentMstID });
    }

    function goToAppliedCustWriteOffToInvList() {
      this.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_LIST_STATE);
    }

    function goToAppliedCustWriteOffDocument(custPaymentMstID) {
      this.openInNew(TRANSACTION.TRANSACTION_APPLY_CUST_WRITE_OFF_TO_INV_DOCUMENT_STATE, { id: custPaymentMstID });
    }

    function goToManageDepartment(id) {
      this.openInNew(USER.ADMIN_MANAGEDEPARTMENT_DETAIL_STATE, { deptID: id });
    }

    function getDateFilterOptions(item) {
      const filterDate = {
        fromDate: null,
        toDate: null
      };
      if (item) {
        const currentDate = new Date(getCurrentDate());
        switch (item.ID) {
          case CORE.DATE_FILTER_OBJ.TODAY.ID: {
            filterDate.toDate = currentDate;
            filterDate.fromDate = currentDate;
          }
            break;
          case CORE.DATE_FILTER_OBJ.YESTERDAY.ID: {
            const yesterDay = ((currentDate).getTime()) - (1 * 24 * 60 * 60 * 1000);
            filterDate.toDate = yesterDay;
            filterDate.fromDate = yesterDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.CURRENTWEEK.ID: {
            const currentDay = (currentDate).getDay() || 7; // for sunday taken 7 as its gives 0
            const weekStartDay = ((currentDate).getTime()) - ((currentDay - 1) * 24 * 60 * 60 * 1000);
            filterDate.toDate = currentDate;
            filterDate.fromDate = weekStartDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.LASTWEEK.ID: {
            const currentDay = (currentDate).getDay() || 7; // for sunday taken 7 as its gives 0
            const weekEndDay = ((currentDate).getTime()) - ((currentDay) * 24 * 60 * 60 * 1000); // last week end date
            const weekStartDay = ((new Date(weekEndDay)).getTime()) - (6 * 24 * 60 * 60 * 1000); // last week start date
            filterDate.toDate = weekEndDay;
            filterDate.fromDate = weekStartDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.CURRENTMONTH.ID: {
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            filterDate.toDate = currentDate;
            filterDate.fromDate = firstDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.LASTMONTH.ID: {
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            filterDate.toDate = lastDay;
            filterDate.fromDate = firstDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.CURRENTQUARTER.ID: {
            const currentQuarter = Math.floor((currentDate.getMonth() / 3));
            const firstDay = new Date(currentDate.getFullYear(), currentQuarter * 3, 1); // quarter count 3 per year
            filterDate.toDate = currentDate;
            filterDate.fromDate = firstDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.LASTQUARTER.ID: {
            const currentQuarter = Math.floor((currentDate.getMonth() / 3));
            let firstDay = new Date(currentDate.getFullYear(), (currentQuarter - 1) * 3, 1); // quarter count 3 per year
            let lastday = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3, 0);
            if (!currentQuarter) {
              const getLastYear = currentDate.getFullYear() - 1;
              lastday = new Date(getLastYear, 11, 31);
              firstDay = new Date(getLastYear, 3 * 3, 1);
            }
            filterDate.toDate = lastday;
            filterDate.fromDate = firstDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.CURRENTSEMIANNUAL.ID: {
            const currentMonth = currentDate.getMonth(); // starting date for jan
            let firstDay = new Date(currentDate.getFullYear(), 0, 1);
            if (currentMonth > 5) {  // 5-June is last month of the semi annual
              firstDay = new Date(currentDate.getFullYear(), 6, 1); // starting date for July
            }
            filterDate.toDate = currentDate;
            filterDate.fromDate = firstDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.LASTSEMIANNUAL.ID: {
            const currentMonth = currentDate.getMonth(); // starting date for jan
            let firstDay = new Date(currentDate.getFullYear(), 0, 1); // starting date for Jan
            let lastDay = new Date(currentDate.getFullYear(), 5, 30); // starting date for Jun
            if (currentMonth <= 5) {  // 5-June is last month of the semi annual
              const getLastYear = currentDate.getFullYear() - 1;
              firstDay = new Date(getLastYear, 6, 1); // starting date for July
              lastDay = new Date(getLastYear, 11, 31); // starting date for Dec
            }
            filterDate.toDate = lastDay;
            filterDate.fromDate = firstDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.CURRENTYEAR.ID: {
            const firstDay = new Date(currentDate.getFullYear(), 0, 1); // start date of Jan
            filterDate.toDate = currentDate;
            filterDate.fromDate = firstDay;
          }
            break;
          case CORE.DATE_FILTER_OBJ.LASTYEAR.ID: {
            const lastYear = currentDate.getFullYear() - 1;
            const firstDay = new Date(lastYear, 0, 1); // starting date for Jan
            const lastDay = new Date(lastYear, 11, 31); // starting date for Dec
            filterDate.toDate = lastDay;
            filterDate.fromDate = firstDay;
          }
            break;
        }
      }
      return filterDate;
    }

    function checkFormDirtyExceptParticularControl(formName, columnName) {
      let changedCount = 0;
      const matchColumn = [];
      if (formName && formName.$dirty) {
        formName.$$controls.forEach((control) => {
          if (control.$dirty && control.$name) {
            if (control.$$controls) {
              control.$$controls.forEach((childControl) => {
                if (childControl.$dirty) {
                  changedCount += 1;
                }
              });
            } else {
              changedCount += 1;
            }
            if (columnName && angular.lowercase(control.$name) === angular.lowercase(columnName)) {
              matchColumn.push(control);
            }
          }
        });
      }
      return (matchColumn && changedCount > matchColumn.length) ? true : false;
    }

    function exportSalesCommissionDetail(id, detID, isFromSO, soNumber, lineID) {
      SalesOrderFactory.getSalesCommissionDetailToExport().query({ id: id, detID: detID || null, isFromSO: isFromSO }).$promise.then((response) => {
        if (response && response.data) {
          const salesCommissionList = [];
          let i = 1;
          _.each(response.data, (item) => {
            const objComm = {
              '#': i,
              [isFromSO ? CORE.LabelConstant.SalesOrder.PO : CORE.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber]: isFromSO ? item.poNumber : item.invoiceNumber,
              [isFromSO ? 'SO Line#' : 'INV Line#']: item.lineID,
              'Cust PO Line#': item.custPOLineNumber,
              [CORE.LabelConstant.SalesCommission.Type]: item.typeName,
              [CORE.LabelConstant.SalesCommission.QuoteAttribute]: item.commissionCalculateFromText,
              [CORE.LabelConstant.MFG.PID]: item.pidCode,
              [CORE.LabelConstant.SalesOrder.SalesCommissionTo]: item.salesCommissionTo,
              [CORE.LabelConstant.SalesCommission.Price]: item.unitPrice ? parseFloat(item.unitPrice.toFixed(2)) : item.unitPrice,
              [CORE.LabelConstant.SalesCommission.CommissionPercentage]: item.commissionPercentage ? parseFloat(item.commissionPercentage.toFixed(2)) : item.commissionPercentage,
              [CORE.LabelConstant.SalesCommission.CommissionDollar]: item.commissionValue ? parseFloat(item.commissionValue.toFixed(5)) : item.commissionValue,
              [CORE.LabelConstant.SalesCommission.ActualPrice]: item.unitPrice ? parseFloat((item.unitPrice - item.commissionValue).toFixed(2)) : null,
              [CORE.LabelConstant.SalesCommission.POQty]: item.poQty,
              [CORE.LabelConstant.SalesCommission.ExtCommissionDollar]: parseFloat((item.poQty * item.commissionValue).toFixed(2)),
              [CORE.LabelConstant.SalesCommission.OrgPrice]: item.quoted_unitPrice ? parseFloat(item.quoted_unitPrice.toFixed(2)) : null,
              [CORE.LabelConstant.SalesCommission.OrgCommissionPercentage]: item.quoted_commissionPercentage ? parseFloat(item.quoted_commissionPercentage.toFixed(2)) : null,
              [CORE.LabelConstant.SalesCommission.OrgCommissionDollar]: item.quoted_commissionValue ? parseFloat(item.quoted_commissionValue.toFixed(5)) : null,
              [CORE.LabelConstant.SalesCommission.ActualOrgPrice]: item.quoted_unitPrice ? parseFloat((item.quoted_unitPrice - item.quoted_commissionValue).toFixed(2)) : null,
              [CORE.LabelConstant.SalesCommission.QuotedQty]: item.quotedQty,
              [CORE.LabelConstant.SalesCommission.ExtOrgCommissionDollar]: item.quotedQty && item.quoted_commissionValue ? parseFloat((item.quotedQty * item.quoted_commissionValue).toFixed(2)) : null,
              [CORE.LabelConstant.SalesCommission.CostSummary]: item.salesCommissionNotes
            };
            i++;
            salesCommissionList.push(objComm);
          });
          ImportExportFactory.importFile(salesCommissionList).then((res) => {
            if (res.data && salesCommissionList.length > 0) {
              exportFileDetail(res, detID ? stringFormat('Sales_Commission_{0}_{1}.xls', soNumber, lineID) : stringFormat('Sales_Commission_{0}.xls', soNumber || ''));
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function exportFileDetail(res, name) {
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel'
      });
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, name);
      } else {
        const link = document.createElement('a');
        if (!link.download) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', name);
          link.style = 'visibility:hidden';
          document.body.appendChild(link);
          $timeout(() => {
            link.click();
            document.body.removeChild(link);
          });
        }
      }
    }

    function redirectToDesigner(fileName) {
      const url = CORE.VIEW_REPORT_DESIGNE_URL + fileName;
      openUrl(url);
    }

    function redirectToViewer(viewerParameterId) {
      const url = CORE.REPORT_VIEWER_URL + viewerParameterId;
      openUrl(url);
    }

    function downloadReportFromReportingTool(response, reportName, isCompany) {
      if (response.status !== CORE.API_RESPONSE_CODE.SUCCESS) {
        const res = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(response.data)));
        const model = {
          multiple: true
        };
        if (res.userMessage.messageContent) {
          model.messageContent = res.userMessage.messageContent;
          DialogFactory.messageAlertDialog(model);
        }
        else {
          model.title = CORE.MESSAGE_CONSTANT.ALERT_HEADER;
          model.textContent = res.userMessage.message;
          DialogFactory.alertDialog(model);
        }
      }
      else {
        if (isCompany) {
          CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
            if (company && company.data) {
              downloadReportFileFromReportingTool(response.data, (stringFormat('{0}-{1}', company.data.MfgCodeMst.mfgCode, reportName)));
            }
          }).catch((error) => getErrorLog(error));
        }
        else {
          downloadReportFileFromReportingTool(response.data, reportName);
        }
      }
    }

    function downloadReportFileFromReportingTool(data, fileName) {
      const blob = new Blob([data], {
        type: 'application/pdf'
      });
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style = 'visibility:hidden';
          document.body.appendChild(link);
          $timeout(() => {
            link.click();
            document.body.removeChild(link);
          });
        }
      }
    }

    function getCustRefundPaymentStatusClassName(refundStatus) {
      const status = _.find(TRANSACTION.CustomerPaymentRefundStatusText, (item) => {
        return item.Code == refundStatus;
      });
      return status ? status.ClassName : '';
    }

    function getCustCreditMemoRefundStatusClassName(refundStatus) {
      const status = _.find(TRANSACTION.CustomerCreditMemoRefundStatusText, (item) => {
        return item.Code == refundStatus;
      });
      return status ? status.ClassName : '';
    }

    function getCustCreditAppliedStatusClassName(cmPaymentStatus) {
      const status = _.find(_.values(TRANSACTION.ApplyCustomerCreditMemoStatusText), (item) => {
        return item.Code == cmPaymentStatus;
      });
      return status ? status.ClassName : '';
    }

    function goToCustomerInvoiceDetailList(transNumber, transType) {
      if (transType === CORE.TRANSACTION_TYPE.INVOICE) {
        this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE, { transNumber: transNumber });
      } else {
        this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_STATE, { transNumber: transNumber });
      }
    }

    function goToCustomerInvPackingSlipDetailList(psNumber) {
      this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_STATE, { psNumber: psNumber });
    }

    function getCustomerRefundSubStatus(statusID) {
      const status = _.find(TRANSACTION.CustomerRefundSubStatusIDDet, (item) => {
        return item.code === statusID;
      });
      return status ? status.name : '';
    }

    function goToTransactionModesList(tabName, openINSameTab) {
      if (openINSameTab) {
        $state.go(tabName === USER.TransactionModesTabs.Receivable.Name ? USER.ADMIN_RECEIVABLE_TRANSACTION_MODES_METHODS_STATE : USER.ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_STATE);
      }
      else {
        this.openInNew(tabName === USER.TransactionModesTabs.Receivable.Name ? USER.ADMIN_RECEIVABLE_TRANSACTION_MODES_METHODS_STATE : USER.ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_STATE);
      }
    }

    function goToManageTransactionModes(tabName, transactionModeId, openINSameTab) {
      if (openINSameTab) {
        $state.go(tabName === USER.TransactionModesTabs.Receivable.Name ? USER.ADMIN_MANAGE_RECEIVABLE_TRANSACTION_MODES_STATE : USER.ADMIN_MANAGE_PAYABLE_TRANSACTION_MODES_STATE, { id: transactionModeId });
      }
      else {
        this.openInNew(tabName === USER.TransactionModesTabs.Receivable.Name ? USER.ADMIN_MANAGE_RECEIVABLE_TRANSACTION_MODES_STATE : USER.ADMIN_MANAGE_PAYABLE_TRANSACTION_MODES_STATE, { id: transactionModeId });
      }
    }

    function goToEnterpriseSearch(searchCriteria) {
      this.openInNew(ENTERPRISE_SEARCH.ENTERPRISE_SEARCH_STATE, { searchText: searchCriteria });
    }
    function getCustRefundSubStatusClassName(statusID) {
      const status = _.find(TRANSACTION.CustomerRefundSubStatusIDDet, (item) => {
        return item.code === statusID;
      });
      return status ? status.className : '';
    }

    function loadAllCustPackingSlipListSummByCust(searchData) {
      if (searchData) {
        this.openInNew(TRANSACTION.TRANSACTION_CUSTOMER_PACKINGSLIP_LIST_SUMM_STATE, {
          customerID: searchData.customerID
        });
      }
    }

    //function getRedirectionAnchorTag(displayLabelValue, URL) {
    //  const redirectionURL = WebsiteBaseUrl + CORE.URL_PREFIX + URL;
    //  return stringFormat(CORE.COMMON_ANCHORE_TAG_FOR_REDIRECTION, redirectionURL, displayLabelValue);
    //}

    function goToRFQTypeList() {
      this.openInNew(USER.ADMIN_RFQ_TYPE_STATE, {});
    }

    function goToRequirementTemplateList() {
      this.openInNew(USER.ADMIN_ADDITIONAL_REQUIREMENT_STATE, {});
    }

    function goToRFQLineitemsErrorcodeList() {
      this.openInNew(USER.ADMIN_RFQ_LINEITEMS_ERRORCODE_STATE, {});
    }

    function goToKeywordList() {
      this.openInNew(USER.ADMIN_KEYWORD_STATE, {});
    }

    function goToSupplierQuoteAttributelist() {
      this.openInNew(USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE, { type: CORE.QUOTE_DB_ATTRIBUTE_TYPE.SUPPLIER });
    }
    function goToAliasValidationList() {
      this.openInNew(USER.ADMIN_ALIAS_PARTS_VALIDATION_STATE, {});
    }

    function setLatestLoginUserLocalStorageDet() {
      service.loginUser = getLocalStorageValue('loginuser');
    }
    /**
      *  Return URL or HTML HyperLink of Part
      * @param {any} partId - Part Id
      * @param {string} mfgType - Type Part (DIST/MFG)
      * @param {boolean} requiredHTMLLink - Have to return Generated HTML Link
      * @param {string} mpn - MPN/SPN
      */
    function generateComponentRedirectURL(partId, mfgType, requiredHTMLLink, mpn) {
      let url = '';
      if (CORE.MFG_TYPE.MFG === mfgType.toUpperCase()) {
        url = `${WebsiteBaseUrl}${CORE.URL_PREFIX}${USER.ADMIN_COMPONENT_ROUTE}${USER.ADMIN_MANAGECOMPONENT_ROUTE}${USER.ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE.replace(':mfgType', CORE.MFG_TYPE.MFG.toLowerCase()).replace(':coid', partId)}`;
      } else {
        url = `${WebsiteBaseUrl}${CORE.URL_PREFIX}${USER.ADMIN_COMPONENT_ROUTE}${USER.ADMIN_MANAGECOMPONENT_ROUTE}${USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_TAB_ROUTE.replace(':mfgType', CORE.MFG_TYPE.DIST.toLowerCase()).replace(':coid', partId)}`;
      }
      return requiredHTMLLink ? this.getHyperlinkHtml(url, mpn) : url;
    }
    function generateUMIDRedirectURL(umidId) {
      return `${WebsiteBaseUrl}${CORE.URL_PREFIX}${TRANSACTION.TRANSACTION_ROUTE}${TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_ROUTE}${TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_ROUTE.replace(':id', umidId)}`;
    }

    function generatePackingSlipRedirectURL(type, pId) {
      return `${WebsiteBaseUrl}${CORE.URL_PREFIX}${TRANSACTION.TRANSACTION_ROUTE}${TRANSACTION.TRANSACTION_MATERIAL_RECEIVE_ROUTE.replace(':type', type)}${TRANSACTION.TRANSACTION_MANAGE_MATERIAL_RECEIVE_ROUTE.replace(':type', type).replace(':id', pId)}`;
    }

    function generateDataKeyRedirectURL() {
      return `${WebsiteBaseUrl}${CORE.URL_PREFIX}${CORE.USER_PROFILE_SETTINGS_ROUTE}`;
    }

    function getHyperlinkHtml(href, displayValue) {
      return stringFormat('<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>', href, displayValue);
    }
    function showVersionHistory(row, componentId, ev) {
      const data = {
        partID: componentId,
        assemblyNumber: row.mfgPN,
        assemblyRev: row.rev,
        narrative: false,
        title: row.isCPN ? CORE.BOMVersionHistoryPopUpTitle.CPN : CORE.BOMVersionHistoryPopUpTitle.ASSY_BOM
      };

      DialogFactory.dialogService(
        RFQTRANSACTION.BOM_HISTORY_POPUP_CONTROLLER,
        RFQTRANSACTION.BOM_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    function applyContactPersonDispNameFormat(firstName, middleName, lastName) {
      let formattedName;
      if (_contactPersonDisplayNameFormat && firstName && lastName) {
        switch (_contactPersonDisplayNameFormat) {
          case CORE.ContactPersonDisplayFormatList[0].id:
            //1 - 'Firstname Middlename Lastname'
            formattedName = stringFormat('{0} {1}{2}', firstName, (middleName ? middleName + ' ' : ''), lastName);
            break;
          case CORE.ContactPersonDisplayFormatList[1].id:
            //2 - 'Firstname Lastname'
            formattedName = stringFormat('{0} {1}', firstName, lastName);
            break;
          case CORE.ContactPersonDisplayFormatList[2].id:
            //3 - 'Firstname Mname Lastname'
            formattedName = stringFormat('{0} {1}{2}', firstName, (middleName ? middleName.charAt(0) + ' ' : ''), lastName);
            break;
          case CORE.ContactPersonDisplayFormatList[3].id:
            //4 - 'Firstname Mname. Lastname'
            formattedName = stringFormat('{0} {1}{2}', firstName, (middleName ? middleName.charAt(0) + '. ' : ''), lastName);
            break;
          case CORE.ContactPersonDisplayFormatList[4].id:
            //5 - 'Lastname, Firstname Middlename'
            formattedName = stringFormat('{0}, {1}{2}', lastName, firstName, (middleName ? ' ' + middleName : ''));
            break;
          case CORE.ContactPersonDisplayFormatList[5].id:
            //6 - 'Lastname, Firstname'
            formattedName = stringFormat('{0}, {1}', lastName, firstName);
            break;
          case CORE.ContactPersonDisplayFormatList[6].id:
            //7 - 'Lastname, Firstname Mname'
            formattedName = stringFormat('{0}, {1}{2}', lastName, firstName, (middleName ? ' ' + middleName.charAt(0) : ''));
            break;
          case CORE.ContactPersonDisplayFormatList[7].id:
            //8 - 'Lastname, Firstname Mname.'
            formattedName = stringFormat('{0}, {1}{2}', lastName, firstName, (middleName ? ' ' + middleName.charAt(0) + '.' : ''));
            break;
          default:
            // 'Firstname Mname. Lastname'
            formattedName = stringFormat('{0} {1}{2}', firstName, (middleName ? middleName.charAt(0) + '. ' : ''), lastName);
            break;
        }
      } else {
        formattedName = null;
      }
      return formattedName;
    }

    function convertSpecialCharToSearchString(string) {
      let searchString;
      if (string) {
        searchString = string.replace('\\', '\\\\\\\\\\');
        searchString = string.replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]').replace(/\(/g, '\\\\(').replace(/\)/g, '\\\\)').replace(/\+/g, '\\\\+').replace(/\$/g, '\\\\$').replace(/\^/g, '\\\\^').replace(/}/g, '\\\\}').replace(/{/g, '\\\\{').replace(/\*/g, '\\\\*').replace(/\|/g, '\\\\|').replace(/\?/g, '\\\\?');
      } else {
        searchString = null;
      }
      return searchString;
    }

    function generateContactPersonDetFormat(contPersonDet) {
      let contactDet = null;
      if (contPersonDet) {
        contactDet = stringFormat('ATTN: {0}', applyContactPersonDispNameFormat(contPersonDet.firstName, contPersonDet.middleName, contPersonDet.lastName));
        // division bind detail
        if (contPersonDet.division) {
          contactDet = stringFormat('{0}\r{1}', contactDet, contPersonDet.division);
        }
        //email bind
        if (contPersonDet.email) {
          let allEmails = null;
          try {
            allEmails = JSON.parse(contPersonDet.email);
          } catch (ex) {
            // catch error
          }
          contactDet = stringFormat('{0}\rEmail: {1}', contactDet, allEmails && allEmails.length > 0 ? _.map(allEmails, 'email').join(',') : null);
        }
        // phone bind
        if (contPersonDet.phoneNumber) {
          let allPhoneNumber = null;
          try {
            allPhoneNumber = JSON.parse(contPersonDet.phoneNumber);
          } catch (ex) {
            // catch error
          }
          contactDet = stringFormat('{0}\rPhone: {1}', contactDet, allPhoneNumber && allPhoneNumber.length > 0 ? _.map(allPhoneNumber, 'phone').join(',') : null);
        }
        // mobile bind
        if (contPersonDet.mobile) {
          contactDet = stringFormat('{0}\rMobile: {1}', contactDet, contPersonDet.mobile);
        }
        // fax bind
        if (contPersonDet.faxNumber) {
          contactDet = stringFormat('{0}\rFax: {1}', contactDet, contPersonDet.faxNumber);
        }
      }
      return contactDet;
    };

    function goToContactPersonList() {
      this.openInNew(USER.ADMIN_CONTACT_PERSON_STATE, {});
    }

    function goToCustTypeContactPersonList(custType, customerID) {
      switch (custType) {
        case CORE.CUSTOMER_TYPE.CUSTOMER:
          this.openInNew(USER.ADMIN_MANAGECUSTOMER_CONTACTS_STATE, { customerType: custType, cid: customerID });
          break;
        case CORE.CUSTOMER_TYPE.MANUFACTURER:
          this.openInNew(USER.ADMIN_MANAGEMANUFACTURER_CONTACTS_STATE, { customerType: custType, cid: customerID });
          break;
        case CORE.CUSTOMER_TYPE.SUPPLIER:
          this.openInNew(USER.ADMIN_MANAGESUPPLIER_CONTACTS_STATE, { customerType: custType, cid: customerID });
          break;
      }
    }

    function goToSupplierShipTo(supplierID) {
      this.openInNew(USER.ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_STATE, { customerType: CORE.CUSTOMER_TYPE.SUPPLIER, cid: supplierID });
    }

    function goToDCFormatList() {
      this.openInNew(USER.ADMIN_DC_FORMAT_STATE, {});
    }

    function validateEnterpriseSearchCriteria(searchCriteria) {
      if (searchCriteria.length >= 2) {
        const firstCharacter = searchCriteria.charAt(0);
        const lastCharacter = searchCriteria.charAt(searchCriteria.length - 1);
        if (lastCharacter !== '*' && lastCharacter !== '~' && (firstCharacter !== '"' || lastCharacter !== '"')) {
          searchCriteria = `"${searchCriteria}"`;
        }
      } else if (searchCriteria) {
        searchCriteria = `"${searchCriteria}"`;
      }
      return searchCriteria;
    }

    /**
    * Return URL or HTML HyperLink of MFG
    * @param {string} customerType - Type of Customer
    * @param {string/integer} mfgCodeID - MFR id
    * @param {boolean} haveToFormatCode - Have to format MFR Code and Name base on Data Key
    * @param {boolean} requiredHTMLLink - Have to return Generated HTML Link
    * @param {string} mfgName - Name Of MFR Name
    * @param {string} mfgcode - Code of MFR Code
    */
    function generateManufacturerDetailRedirectURL(customerType, mfgCodeID, haveToFormat, requiredHTMLLink, mfgName, mfgCode) {
      if (haveToFormat) {
        mfgName = this.getMfgCodeNameFormat(mfgCode, mfgName);
      }
      const url = `${WebsiteBaseUrl}${CORE.URL_PREFIX}${USER.ADMIN_MANUFACTURER_ROUTE}${USER.ADMIN_MANAGEMANUFACTURER_ROUTE}${USER.ADMIN_MANAGEMANUFACTURER_DETAIL_ROUTE.replace(':customerType', customerType).replace(':cid', mfgCodeID)}`;
      return requiredHTMLLink ? this.getHyperlinkHtml(url, mfgName) : url;
    }

    function convertJsonPhoneNumberToSting(jsonPhoneObj) {
      if (jsonPhoneObj) {
        try {
          const allPhones = JSON.parse(jsonPhoneObj);
          const grouped = allPhones.reduce((obj, phone) => {
            obj[phone.category] = obj[phone.category] || [];
            obj[phone.category].push(phone.phone + (phone.phExtension ? (' Ext.' + phone.phExtension) : ''));
            return obj;
          }, {});
          return Object.keys(grouped).map((key) => ({ category: key, phoneDet: grouped[key].join(', ') })).map((a) => (a.category + ': ' + a.phoneDet)).join(' | ');
        } catch (ex) {
          return null;
        }
      } else {
        return null;
      }
    }

    function goToCompanyProfileContact() {
      this.openInNew(CORE.COMPANY_PROFILE_CONTACTS_STATE);
    }

    return service;
  }
})();

