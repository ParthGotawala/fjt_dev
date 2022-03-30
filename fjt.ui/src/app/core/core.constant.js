(function (LABELCONSTANT) {
  'use strict';
  /** @ngInject */
  const LABEL_CONSTANT = {
    PACKAGING_ALIAS: 'Packaging Alias',
    OTHER_PART_NAMES: 'Other Part Names',
    ALTERNATE_PARTS: 'Alternate Parts',
    ROHS_REPLACEMENT_PARTS: 'RoHS Replacement parts',
    DRIVE_TOOLS: 'Drive Tools',
    REQUIRE_MATING_PARTS: 'Require Mating Parts',
    REQUIRE_PICKUP_PAD: 'Require Pickup Pad',
    REQUIRE_FUNCTIONAL_TESTING: 'Require Functional Testing',
    FUNCTIONAL_TESTING_EQUIPMENT: 'Functional Testing Equipment',
    PROCESS_MATERIALS: 'Process Materials',
    STANDARDS: 'Standards',
    DOCUMENTS: 'Documents',
    DATA_FIELDS: 'Data Fields',
    MISC: 'MISC',
    CUSTOMER_LOA: 'Customer LOA',
    COMMENTS: 'Comments',
    DISAPPROVED_SUPPLIER: 'Disapproved Supplier',
    SALES_PRICE_MATRIX: 'Sales Price Matrix',
    PART_IMAGES: 'Part Images',
    PART_DATASHEET: 'Part Datasheet',
    EXPORT_AND_LEGAL_CLASSIFICATION: 'Export & Legal Classification',
    SPECIFIC_REQUIREMENT_AND_COMMENTS: 'Specific Requirement & Comments',
    OPERATIONAL_ATTRIBUTES: 'Operational Attributes',
    ACCEPTABLE_SHIPPING_COUNTRIES: 'Acceptable Shipping Countries'
  };
  var CORE = {
    THEME: 'md-tealTheme-theme',
    MESSAGE_CONSTANT: {
      ALERT_HEADER: 'Information',
      ERROR: 'Error',
      EDITOR_DRAG_AND_DROP_MESSAGE: 'Drop files to instantly upload.',
      EDITOR_ADD_IMAGE_MESSAGE: 'While \'Insert Image\', image in the editor must not be selected.',
      INITAL_UPLOAD_STATUS: 'Initial Draft',
      LEAVE_ON_BUTTON: 'Leave Page',
      RESET_POPUP_BUTTON: 'Reset',
      SAVE_AND_EXIT: 'Save & Exit',
      STAY_ON_BUTTON: 'Stay On',
      BUTTON_DELETE_TEXT: 'Yes',
      BUTTON_CANCEL_TEXT: 'No',
      BUTTON_CREATENEW_TEXT: 'Create New',
      BUTTON_OK: 'Ok',
      BUTTON_OK_TEXT: 'Yes',
      IMPORT_BUTTON_DELETE_TEXT: 'Delete all & Import',
      BUTTON_FOR_Continue: 'Continue',
      RESET_AND_CONTINUE_BUTTON: 'Reset & Continue',
      BUTTON_FOR_CANCEL: 'Cancel',
      BUTTON_FOR_SEND_NOTIFICATION: 'Save & Send Notification',
      BUTTON_FOR_LOGOUT: 'Logout',
      LEAVE_ON_BUTTON_FOR_TAB: 'Leave Tab',
      LEAVE_ON_BUTTON_FOR_ROLE: 'Leave Role',
      QPA_PRICE_MATRIX_QPA_VALIDATION_MESSAGE: 'Mounting Type, QPA / Line Count and Order Qty',
      LINE_OVERHEAD_QPA_VALIDATION_MESSAGE: 'Mounting Type, QPA / Line Count',
      SCRIPT_UPTODATE: 'No new db-script to update. All updated.',
      BUTTON_ADD_ONLY: 'Add Only',
      BUTTON_ALL: 'All',
      CONFIGURE_RESTRICT_FILE_EXTENSTION: 'Restriction of file extensions are based on configuration done in',
      OPERATION_DISPlAY_FORMAT: '({1}) {0}',
      WO_STATUS_CHANGE_DENIED: 'Action "Change Work Order\'s Status" is denied due to following reason. <br/>',
      WO_STATUS_CHANGE_DENIED_MULTI: 'Action "Change Work Order\'s Status" is denied due to any of the following reasons. <br/>',
      IMPORT_BUTTON_APPEND_TEXT: 'Append & Import',
      MIN_INVOICE_DATE: 'Invoice date should be more than packing slip date.',
      MAX_INVOICE_DATE: 'Invoice date should not be more than current date.',
      MAX_PURCHASE_DATE_INVOICE_DATE: 'PO Date cannot be greater than Invoice Date',
      MIN_INVOICE_DATE_PS_DATE: 'Invoice Date cannot be less than PS Date',
      MIN_INVOICE_DATE_PO_DATE: 'Invoice Date cannot be less than PO Date',
      MAX_INVOICE_DATE_CRN_DATE: 'Invoice Date cannot be greater than Credit Memo Date',
      MAX_INVOICE_DATE_DBN_DATE: 'Invoice Date cannot be greater than Ref. Debit Memo Date',
      MIN_CREDITNOTE_DATE_INVOICE_DATE: 'Credit Memo Date cannot be less than Invoice Date',
      MAX_CREDITNOTE_DATE_DBN_DATE: 'Credit Memo Date cannot be greater than Ref. Debit Memo Date',
      MIN_DEBITNOTE_DATE_CRN_DATE: 'Ref. Debit Memo Date cannot be less than Invoice Date',
      MAX_DEBITNOTE_DATE_CRN_DATE: 'Ref. Debit Memo Date cannot be greater than Credit Memo Date',
      MOVE_TO_RECYCLE_BUTTON_TEXT: 'Move To Recycle',
      DELETE_PERMANENT_BUTTON_TEXT: 'Delete Permanently',
      UPDATE_PART: 'Update Supplier Part',
      ADD_PART: 'Add Supplier Part',
      NO_CHANGES_MADE: 'You have not made any changes',
      TOTAL_LINES_MISMATCH: 'Sum of Rejected, Accepted with Deviation, Pending and Accepted Lines are mismatched with Total Lines',
      SCAN_UMID_EDIT_HISTORY_NOTE: '(Allowed only for material scanned in current operation activity)',
      NO_CUSTOMER_PACKINGSLIP_CREATED: 'Packing Slip does not exist!',
      GO_TO_PENDING_STOCK: 'Go To UMID Pending Parts',
      BASIC_PLACEMENT_AT_TRAVELER: 'This will allow to add RefDes details on enter material to be used.',
      VALIDATION_NOTE_ON_ADD_PACKGAGING_PART: 'Following attributes will be compared among all Packaging Aliases per Alias Validation rules. To add/view/update validation rules go to ',
      ATTRIBUTE_MIS_MATCH_LIST_NOTES: 'Attributes are mismatched for following Parts.',
      INVALID_MIN_EXPIRATION_DATE: 'Expiration Date cannot be less than Issue Date',
      INVALID_MAX_LAST_APPROVAL_DATE: 'Issue Date cannot be greater than Expiration Date',
      LOGOUT_CHANGE_CREDENTIAL: 'LOGOUT & CHANGE CREDENTIAL',
      KEEP_OLD_CREDENTIAL: 'KEEP OLD CREDENTIAL',
      MUST_REQUIRE_ONE_DEFAULT_CONT_PERSON: 'Must require one default Contact Person',
      AllowToUpdateContactPersonNote: 'Note: Please enable feature rights to update Contact Person details.',
      ASSIGNED_CONT_PERSON_TOOLTIP: 'Blue Text indicates current selection',
      AUTO_COMPLETE_EDIT: 'edit in progress part',
      LEAVE_ON_BUTTON_FOR_RECORD: 'Leave Record'
    },
    COFC_Report_Disclaimer: 'THIS IS TO CERTIFY THAT THE MATERIAL SHIPPED FOR THIS ORDER IS MANUFACTURED IN COMPLIANCE WITH CUSTOMER SUPPLIED AND/OR STATED SPECIFICATIONS. CERTIFICATION DOES NOT APPLY TO CUSTOMER CONSIGNED ITEMS LACKING CERTIFICATION OF CONFORMANCE.',
    PACKINGSLIP_Report_Disclaimer: 'FLEXTRON CIRCUIT ASSEMBLY SHALL IN NO EVENT BE LIABLE FOR ANY LOSS OR DAMAGES, DIRECT OR INDIRECT, INCIDENTAL OR CONSEQUENTIAL, ARISING OUT OF USE OF, OR THE INABILITY TO USE THE PRODUCT(S). WRITTEN NOTIFICATION OF CLAIMS AGAINST THIS PRODUCT MUST BE MADE WITHIN 30 DAYS FROM RECEIPT. MAXIMUM LIABILITY LIMITED TO THE COST OF PRODUCTS AND/OR SERVICES PROVIDED.',
    DECLARATION_OF_RoHS_COMPLIANCE: 'We declare that the product(s)/process(s) supplied (CHECK MARKED) under below listed manufactured by Flextron Circuit Assembly (FCA) are compliance with RoHS 2 Directive 2015/65/EU / RoHS 3 Directive 2015/863 of the European Parliament and of Council of June 4, 2015 on the restriction of the use of certain hazardous substances (Lead (Pb), Cadmium (Cd), Mercury (Hg), Hexavalent Chromium or their compounds, Flame retardants PolyBrominated Biphenyls (PBB) and PolyBrominated Diphenyl Ethers (PBDE)) in electrical and electronic equipment (RoHS Directives). Manufacturer part label should state RoHS status of the part. <b>RoHS declaration does not apply to Non-RoHS items.</b>',
    RoHS_Report_Disclaimer: 'Disclaimer: This RoHS compliance statement is, to the best of Flextron\'s knowledge, accurate as of the date indicated on this page. As some of the information is based upon data provided from sources outside of the Company, Flextron makes no representation or warranty as to the accuracy of such information. Flextron continues to work toward obtaining valid and certifiable third-party information, but has not necessarily conducted analytical or chemical analyses on all materials or purchased components. In no event shall Flextron\'s liability arising out of such information exceed the purchase price of the Flextron\'s item(s) sold to Customer.',
    Invoice_Report_Disclaimer: 'FLEXTRON CIRCUIT ASSEMBLY SHALL IN NO EVENT BE LIABLE FOR ANY LOSS OR DAMAGES, DIRECT OR INDIRECT, INCIDENTAL OR CONSEQUENTIAL, ARISING OUT OF USE OF, OR THE INABILITY TO USE THE PRODUCT(S). WRITTEN NOTIFICATION OF CLAIMS AGAINST THIS PRODUCT MUST BE MADE WITHIN 30 DAYS FROM RECEIPT. MAXIMUM LIABILITY LIMITED TO THE COST OF PRODUCTS AND/OR SERVICES PROVIDED.<br/>ALL PAST DUE INVOICES ARE SUBJECT TO 2% INTEREST CHARGE. CLERICAL AND PRICING ERRORS ARE SUBJECT TO CORRECTION. PURCHASER WILL BE LIABLE FOR ANY LEGAL EXPENSES INCURRED FOR COLLECTION OF THIS INVOICE.',
    REPORT_NAME: {
      Purchase_Order: 'Purchase Order Report.pdf',
      Customer_Invoice: 'Customer Invoice Report.pdf',
      Customer_Packing_Slip: 'Packing Slip Report.pdf',
      Supplier_RMA: 'Supplier RMA Report.pdf',
      Credit_Memo: 'Credit Memo.pdf'
    },
    UMID_HISTORY_ICON: 't-icons-umid-history',
    COUNT_MATERIAL_POPUP_NOTES: {
      CONFIRMATION_UPON_SAVING_NOTE: 'Note: For Trainee Users',
      MUST_SELECT_KIT_NOTE: 'Note: Supervisor permission is required to uncheck.',
      APPROVE_TO_DEALLOCATE_FROM_KIT_NOTE: 'To proceed it requires superior confirmation.',
      DIFFRENT_DESTINATION_LOCATION_BIN_NOTE: 'Note: Destination location/bin must be different then original location/bin.'
    },
    SUPPLIER_QUOTE_PART_PRICE_FETCH_INTO_PART_COSTING_NOTE: 'Note: Part Price record will be disabled if Supplier Quote is already used in Part Costing.',
    DefaultSystemVariable: '<% CompanyName %>',
    DefaultListCount: 10,
    DefaultNotApplicable: 'N/A',
    ApiResponseTypeStatus: {
      SUCCESS: 'SUCCESS',
      FAILED: 'FAILED',
      EMPTY: 'EMPTY'
    },
    API_RESPONSE_CODE: {
      SUCCESS: 200,
      ERROR: 200,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAGE_NOT_FOUND: 404,
      ACCESS_DENIED: 403, //client authenticated but doesnot have permission to access requested resource
      INTERNAL_SERVER_ERROR: 500
    },
    POPUP_FOOTER_BUTTON: {
      SAVE: '1',
      SAVEANDEXIT: '2',
      ADDNEW: '3'
    },
    DATE_FORMAT: 'MM/DD/YYYY',
    URL_PREFIX: '/#!',
    GRID_ACTION_PAGE: 'app/core/view/GridActionView.html',
    GRID_COL_PINNED_AND_VISIBLE_CHANGE: 'GRID_COL_PINNED_AND_VISIBLE_CHANGE',
    CONTROLLER_AS: 'vm',

    LOGIN_ROUTE: '/login',
    LOGIN_STATE: 'app.login',
    LOGIN_CONTROLLER: 'LoginController',
    LOGIN_VIEW: 'app/main/login/login.html',

    LOGIN_RESPONSE_ROUTE: '/loginresponse',
    LOGIN_RESPONSE_STATE: 'app.loginresponse',
    LOGIN_RESPONSE_CONTROLLER: 'LoginResponseController',
    LOGIN_RESPONSE_VIEW: 'app/main/login/loginResponse.html',

    LOGOUT_RESPONSE_ROUTE: '/logoutresponse',
    LOGOUT_RESPONSE_STATE: 'app.logoutresponse',
    LOGOUT_RESPONSE_CONTROLLER: 'LogoutResponseController',
    LOGOUT_RESPONSE_VIEW: 'app/main/login/logoutResponse.html',

    ACESSTOKEN_RENEW_ROUTE: '/silentrefresh',
    ACESSTOKEN_RENEW_STATE: 'app.silentrefresh',
    ACESSTOKEN_RENEW_CONTROLLER: 'SilentRefreshController',
    ACESSTOKEN_RENEW_VIEW: 'app/main/login/silentrefresh.html',

    INTERNAL_SERVER_ERROR_LABEL: '500',
    INTERNAL_SERVER_ERROR_ROUTE: '/500?errorMessage',
    INTERNAL_SERVER_ERROR_STATE: 'app.500',
    INTERNAL_SERVER_ERROR_CONTROLLER: 'InternalServerErrorController',
    INTERNAL_SERVER_ERROR_VIEW: 'app/main/login/500.html',

    //FORGOT_PASSWORD_ROUTE: '/forgotpassword',
    //FORGOT_PASSWORD_STATE: 'app.forgotpassword',
    // FORGOT_PASSWORD_CONTROLLER: 'ForgotPasswordController',
    //FORGOT_PASSWORD_VIEW: 'app/main/forgot-password/forgot-password.html',

    RESET_PASSWORD_ROUTE: '/resetpassword/:forGotPasswordToken',
    RESET_PASSWORD_STATE: 'app.resetpassword',
    RESET_PASSWORD_CONTROLLER: 'ResetPasswordController',
    RESET_PASSWORD_VIEW: 'app/main/reset-password/reset-password.html',

    USER_PROFILE_LABEL: 'UserProfile',
    USER_PROFILE_ROUTE: '/userprofile',
    USER_PROFILE_STATE: 'app.userprofile',
    USER_PROFILE_CONTROLLER: 'MyProfileController',
    USER_PROFILE_VIEW: 'app/core/user/my-profile/my-profile.html',

    USER_PROFILE_DETAIL_STATE: 'app.userprofile.detail',
    USER_PROFILE_DETAIL_ROUTE: '/details',

    USER_PROFILE_SECURITY_STATE: 'app.userprofile.security',
    USER_PROFILE_SECURITY_ROUTE: '/security',

    USER_PROFILE_SETTINGS_STATE: 'app.userprofile.settings',
    USER_PROFILE_SETTINGS_ROUTE: '/settings',

    USER_PROFILE_PREFERENCE_STATE: 'app.userprofile.preference',
    USER_PROFILE_PREFERENCE_ROUTE: '/preference',

    USER_PROFILE_SIGNUP_AGREEMENT_LABEL: 'User Agreement',
    USER_PROFILE_SIGNUP_AGREEMENT_STATE: 'app.userprofile.agreement',
    USER_PROFILE_SIGNUP_AGREEMENT_ROUTE: '/agreement',

    COMPANY_PROFILE_LABEL: 'Company Profile',
    COMPANY_PROFILE_ROUTE: '/companyprofile',
    COMPANY_PROFILE_STATE: 'app.companyprofile',
    COMPANY_PROFILE_CONTROLLER: 'CompanyProfileController',
    COMPANY_PROFILE_VIEW: 'app/core/user/company-profile/company-profile-main.html',

    COMPANY_PROFILE_DETAIL_STATE: 'app.companyprofile.detail',
    COMPANY_PROFILE_DETAIL_ROUTE: '/details',

    COMPANY_PROFILE_ADDRESSES_STATE: 'app.companyprofile.addresses',
    COMPANY_PROFILE_ADDRESSES_ROUTE: '/addresses',

    COMPANY_PROFILE_COMPANY_PREFERENCE_STATE: 'app.companyprofile.companypreference',
    COMPANY_PROFILE_COMPANY_PREFERENCE_ROUTE: '/companypreference',

    COMPANY_PROFILE_REMITTANCE_ADDRESS_STATE: 'app.companyprofile.remittanceaddress',
    COMPANY_PROFILE_REMITTANCE_ADDRESS_ROUTE: '/remittanceaddress',

    COMPANY_PROFILE_CONTACTS_STATE: 'app.companyprofile.contacts',
    COMPANY_PROFILE_CONTACTS_ROUTE: '/contacts',

    Copy_Image_Name: 'image.png',
    Copy_Image_Extension: 'image/png',
    IMAGE_ICON_PATH: '{0}/../../../../assets/images/etc/{1}',

    SHOW_LIST_MODAL_VIEW: 'app/view/show-common-list-view-popup/show-common-list-view-popup.html',
    SHOW_LIST_MODAL_CONTROLLER: 'ShowListViewPopupController',



    SAVE_DATAELEMENT_LIST_MODAL_VIEW: 'app/view/save-dataelement-list-view-popup/save-dataelement-list-view-popup.html',
    SAVE_DATAELEMENT_LIST_MODAL_CONTROLLER: 'SaveDataElementListViewPopupController',

    DESCRIPTION_MODAL_VIEW: 'app/view/description-view-popup/description-view-popup.html',
    DESCRIPTION_MODAL_CONTROLLER: 'DescriptionPopupController',

    ECO_DFM_DESCRIPTION_MODAL_VIEW: 'app/view/eco-dfm-description-view-popup/eco-dfm-description-view-popup.html',
    ECO_DFM_DESCRIPTION_MODAL_CONTROLLER: 'ECODFMDescriptionPopupController',

    DIGIKEY_VERIFICATION_MODAL_VIEW: 'app/view/digikey-verification-popup/digikey-verification-popup.html',
    DIGIKEY_VERIFICATION_MODAL_CONTROLLER: 'DigikeyVerificationPopupController',

    IPWEBCAM_CONFIGURATION_MODAL_VIEW: 'app/view/ipwebcam-configuration-popup/ipwebcam-configuration-popup.html',
    IPWEBCAM_CONFIGURATION_MODAL_CONTROLLER: 'IPWebCamConfigurationPopupController',

    AGREEMENT_MODAL_VIEW: 'app/view/agreement-view-popup/agreement-view-popup.html',
    AGREEMENT_MODAL_CONTROLLER: 'AgreementPopupController',

    EDIT_DESCRIPTION_MODAL_VIEW: 'app/view/description-edit-popup/description-edit-popup.html',
    EDIT_DESCRIPTION_MODAL_CONTROLLER: 'EditDescriptionPopupController',

    TREE_MODAL_VIEW: 'app/view/tree-view-popup/tree-view-popup.html',
    TREE_MODAL_CONTROLLER: 'TreeViewPopupController',

    LEGEND_MODAL_VIEW: 'app/view/legend-view-popup/legend-view-popup.html',
    LEGEND_MODAL_CONTROLLER: 'LegendViewPopupController',

    //USER_CONFIRM_PASSWORD_MODAL_VIEW: 'app/view/user-confirm-password-popup/user-confirm-password-popup.html',
    //USER_CONFIRM_PASSWORD_MODAL_CONTROLLER: 'UserConfirmPasswordPopupController',

    WIDGET_FILTER_MODAL_VIEW: 'app/core/component/widget-filter-popup/widget-filter-popup.html',
    WIDGET_FILTER_MODAL_CONTROLLER: 'WidgetFilterPopupController',

    WIDGET_FILTER_EXPRESSION_MODAL_VIEW: 'app/core/component/widget-filter-expression-popup/widget-filter-expression-popup.html',
    WIDGET_FILTER_EXPRESSION_MODAL_CONTROLLER: 'WidgetFilterExpressionPopupController',

    TEXT_ANGULAR_ELEMENT_MODAL_VIEW: 'app/core/component/text-angular-element/text-angular-element-popup.html',
    TEXT_ANGULAR_ELEMENT_MODAL_CONTROLLER: 'TextAngularElementPopupController',

    FOLDER_ADD_MODAL_VIEW: 'app/directives/custom/documents/add-folder-popup/add-folder-popup.html',
    FOLDER_ADD_MODAL_CONTROLLER: 'AddFolderPopupController',

    MOVE_FILE_FOLDER_MODAL_VIEW: 'app/directives/custom/documents/move-folder-file-popup/move-folder-file-popup.html',
    MOVE_FILE_FOLDER_MODAL_CONTROLLER: 'MoveFileFolderPopupController',

    MANAGE_MFGCODE_MODAL_CONTROLLER: 'ManageMFGCodePopupController',
    MANAGE_MFGCODE_MODAL_VIEW: 'app/core/component/manage-mfgcode-popup/manage-mfgcode-popup.html',

    MANAGE_ROHS_MODAL_CONTROLLER: 'ManageRoHSPopupController',
    MANAGE_ROHS_MODAL_VIEW: 'app/main/admin/rfq-setting/rohs/manage-rohs-popup.html',

    MANAGE_ROHS_PEER_MODAL_CONTROLLER: 'ManageRoHSPeersPopupController',
    MANAGE_ROHS_PEER_MODAL_VIEW: 'app/main/admin/rfq-setting/rohs/rohs-peer/rohs-peer-popup.html',

    MANAGE_WHO_ACQUIRED_WHO_MODAL_CONTROLLER: 'ManageWhoAcquiredWhoPopupController',
    MANAGE_WHO_ACQUIRED_WHO_MODAL_VIEW: 'app/main/admin/component/who-acquired-who/manage-who-acquired-who-popup.html',

    MANAGE_GOODPART_MODAL_CONTROLLER: 'ManageGoodPartPopupController',
    MANAGE_GOODPART_MODAL_VIEW: 'app/core/component/good-bad-part-popup/manage-good-bad-part-popup.html',

    COMPONENT_FIELD_GENERIC_ALIAS_CONTROLLER: 'ComponentFieldGenericAliasController',
    COMPONENT_FIELD_GENERIC_ALIAS_VIEW: 'app/core/component/component-fields-genericalias-popup/component-fields-genericalias-popup.html',

    COMPONENT_LOGICAL_GROUP_ALIAS_CONTROLLER: 'ComponentLogicalGroupAliasController',
    COMPONENT_LOGICAL_GROUP_ALIAS_VIEW: 'app/main/admin/component/component-logical-group/component-logical-group-alias-popup.html',

    MANAGE_MEASUREMENT_TYPES_MODAL_CONTROLLER: 'ManageMeasurementTypesPopupController',
    MANAGE_MEASUREMENT_TYPES_MODAL_VIEW: 'app/main/admin/unit/manage-measurement-type-popup/manage-measurement-type-popup.html',

    MANAGE_JOB_TYPES_MODAL_CONTROLLER: 'ManageJobTypesPopupController',
    MANAGE_JOB_TYPES_MODAL_VIEW: 'app/main/admin/rfq-setting/job-type/manage-job-type-popup.html',

    MANAGE_CHART_TYPES_MODAL_CONTROLLER: 'ManageChartTypesPopupController',
    MANAGE_CHART_TYPES_MODAL_VIEW: 'app/main/configuration/chart-type/manage-chart-type-popup.html',

    MANAGE_RFQ_TYPES_MODAL_CONTROLLER: 'ManageRfqTypesPopupController',
    MANAGE_RFQ_TYPES_MODAL_VIEW: 'app/main/admin/rfq-setting/rfq-type/manage-rfq-type-popup.html',

    RFQ_LIST_HISTORY_POPUP_MODAL_CONTROLLER: 'rfqListChangeHistoryPopupController',
    RFQ_LIST_HISTORY_POPUP_MODAL_VIEW: 'app/main/rfq-transaction/rfq/rfq-list-history-popup/rfq-list-history-popup.html',

    MANAGE_MOUNTING_TYPE_MODAL_CONTROLLER: 'ManageMountingTypePopupController',
    MANAGE_MOUNTING_TYPE_MODAL_VIEW: 'app/main/admin/rfq-setting/mounting-type/manage-mounting-type-popup.html',

    MANAGE_CONNECTER_TYPE_MODAL_CONTROLLER: 'ManageConnecterTypePopupController',
    MANAGE_CONNECTER_TYPE_MODAL_VIEW: 'app/main/admin/rfq-setting/connecter-type/manage-connecter-type-popup.html',

    MANAGE_RFQ_LINEITEMS_ERRORCODE_CONTROLLER: 'ManageRFQLineitemsErrorcodePopupController',
    MANAGE_RFQ_LINEITEMS_ERRORCODE_VIEW: 'app/main/admin/rfq-setting/rfq-lineitems-errorcode/manage-rfq-lineitems-errorcode-popup.html',

    RFQ_LINEITEMS_ERRORCODE_CATEGORY_MAPPING_CONTROLLER: 'RFQLineitemsErrorcodeCategoryMappingPopupController',
    RFQ_LINEITEMS_ERRORCODE_CATEGORY_MAPPING_VIEW: 'app/main/admin/rfq-setting/rfq-lineitems-errorcode/rfq-lineitems-errorcode-category-mapping-popup.html',

    MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER: 'ManageQuoteDynamicFieldsPopupController',
    MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW: 'app/main/admin/rfq-setting/quote-dynamic-fields/manage-quote-dynamic-fields-popup.html',

    MANAGE_COSE_CATEGORY_MODAL_CONTROLLER: 'ManageCostCategoryPopupController',
    MANAGE_COSE_CATEGORY_MODAL_VIEW: 'app/main/admin/rfq-setting/cost-category/manage-cost-category-popup.html',

    MANAGE_PASSWORD_POPUP_CONTROLLER: 'passwordPopupController',
    MANAGE_PASSWORD_POPUP_VIEW: 'app/core/component/password-popup/password-popup.html',

    VERIFY_USER_PASSWORD_POPUP_CONTROLLER: 'varifyUserPasswordPopupController',
    VERIFY_USER_PASSWORD_POPUP_VIEW: 'app/core/component/verify-user-password-popup/verify-user-password-popup.html',

    MANAGE_PART_TYPE_MODAL_CONTROLLER: 'ManagePartTypePopupController',
    MANAGE_PART_TYPE_MODAL_VIEW: 'app/main/admin/rfq-setting/part-type/manage-part-type-popup.html',

    MANAGE_ADDITIONAL_REQUIREMENT_MODAL_CONTROLLER: 'ManageAdditionalRequirementPopupController',
    MANAGE_ADDITIONAL_REQUIREMENT_MODAL_VIEW: 'app/main/admin/rfq-setting/additional-requirement/manage-additional-requirement-popup.html',

    ADD_ASSY_REV_MODAL_CONTROLLER: 'AddAssyRevPopupController',
    ADD_ASSY_REV_MODAL_VIEW: 'app/core/component/add-assy-rev-popup/add-assy-rev-popup.html',

    ADD_CUST_ALIAS_MODAL_CONTROLLER: 'AddCustAliasPopupController',
    ADD_CUST_ALIAS_MODAL_VIEW: 'app/core/component/add-cust-alias-popup/add-cust-alias-popup.html',

    COMPONENT_IMPORT_MODAL_CONTROLLER: 'PartImportPopupController',
    COMPONENT_IMPORT_MODAL_VIEW: 'app/core/component/part-import-popup/part-import-popup.html',

    COMPONENT_IMPORT_MAPP_ERROR_MODAL_CONTROLLER: 'PartImportMappPopupController',
    COMPONENT_IMPORT_MAPP_ERROR_MODAL_VIEW: 'app/core/component/part-import-mapp-popup/part-import-mapp-popup.html',

    MANAGE_COMPONENT_MODAL_CONTROLLER: 'ManageComponentPopupController',
    MANAGE_COMPONENT_MODAL_VIEW: 'app/core/component/manage-component-popup/manage-component-popup.html',

    COMPONENT_PURCHASE_COMMENT_MODAL_CONTROLLER: 'ComponentPurchaseCommentViewPopupController',
    COMPONENT_PURCHASE_COMMENT__MODAL_VIEW: 'app/main/admin/component/component-purchase-comment-view-popup.html',

    COMPONENT_DATA_SHEET_URL_ADD_MODAL_CONTROLLER: 'ComponentDataSheetURLPopupController',
    COMPONENT_DATA_SHEET_URL_ADD_MODAL_VIEW: 'app/core/component/component-datasheet-url-popup/component-datasheet-url-popup.html',

    COMPONENT_HISTORY_POPUP_MODAL_CONTROLLER: 'ComponentHistoryViewPopupController',
    COMPONENT_HISTORY_POPUP_MODAL_VIEW: 'app/core/component/component-history-view-popup/component-history-view-popup.html',

    COMPONENT_IMAGES_PREVIEW_POPUP_MODAL_CONTROLLER: 'ComponentImagesPreviewPopupController',
    COMPONENT_IMAGES_PREVIEW_POPUP_MODAL_VIEW: 'app/directives/custom/component-images-preview-popup/component-images-preview-popup.html',

    MANAGE_WIDGET_DETAIL_MODAL_CONTROLLER: 'WidgetPopupController',
    MANAGE_WIDGET_DETAIL_MODAL_VIEW: 'app/core/component/widget-popup/widget-popup.html',

    DATAELEMENT_VALIDATION_MODAL_VIEW: 'app/main/configuration/dataelement/dataelement-validation-popup/dataelement-validation-popup.html',
    DATAELEMENT_VALIDATION_MODAL_CONTROLLER: 'DataelementValidationPopupController',

    MANAGE_WIDGET_OPERATION_CONTROLLER: 'WidgetOperationPopupController',
    MANAGE_WIDGET_OPERATION_VIEW: 'app/main/widget/widget-dashboard/widget-operation-popup/widget-operation-popup.html',

    DATAELEMENT_VALIDATION_EXPRESSION_MODAL_VIEW: 'app/main/configuration/dataelement/dataelement-validation-expression-popup/dataelement-validation-expression-popup.html',
    DATAELEMENT_VALIDATION_EXPRESSION_MODAL_CONTROLLER: 'DataelementValidationExpressionPopupController',

    IN_HOUSE_ASSEMBLY_STOCK_MODAL_CONTROLLER: 'InHouseAssemblyStockPopupController',
    IN_HOUSE_ASSEMBLY_STOCK_MODAL_VIEW: 'app/core/component/in-house-assembly-stock-popup/in-house-assembly-stock-popup.html',

    WORKORDER_OPERATION_FIELDS_HISTORY_MODAL_CONTROLLER: 'WorkorderOperationFieldsHistoryPopupController',
    WORKORDER_OPERATION_FIELDS_HISTORY_MODAL_VIEW: 'app/view/workorder-operation-fields-history-popup/workorder-operation-fields-history-popup.html',

    WORKORDER_OPERATION_EQUIPMENT_FIELDS_HISTORY_MODAL_CONTROLLER: 'WorkorderOperationEquipmentFieldsHistoryPopupController',
    WORKORDER_OPERATION_EQUIPMENT_FIELDS_HISTORY_MODAL_VIEW: 'app/view/workorder-operation-equipment-fields-history-popup/workorder-operation-equipment-fields-history-popup.html',

    RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_CONTROLLER: 'ManagePartCostingApiPopupController',
    RFQ_TRANSACTION_BOM_PART_COSTING_MANAGEPRICE_MODAL_VIEW: 'app/main/rfq-transaction/bom/part-costing/manage-part-costingapi-popup/manage-part-costingapi-popup.html',

    MANAGE_KEYWORD_MODAL_CONTROLLER: 'ManageKeywordPopupController',
    MANAGE_KEYWORD_MODAL_VIEW: 'app/main/admin/rfq-setting/keyword/manage-keyword-popup.html',

    ALTERNATE_PART_MODAL_CONTROLLER: 'AlternatePartPopupController',
    ALTERNATE_PART_MODAL_VIEW: 'app/core/component/alternate-part-popup/alternate-part-popup.html',

    PACKAGING_ALIAS_PART_MODAL_CONTROLLER: 'PackagingAliasPartPopupController',
    PACKAGING_ALIAS_PART_MODAL_VIEW: 'app/core/component/packaging-alias-part-popup/packaging-alias-part-popup.html',

    EPOXY_PROCESS_MATERIAL_PART_MODAL_CONTROLLER: 'EpoxyProcessMaterialPartPopupController',
    EPOXY_PROCESS_MATERIAL_PART_MODAL_VIEW: 'app/core/component/epoxy-process-material-popup/epoxy-process-material-popup.html',


    RFQ_TRANSACTION_BOM_PART_COSTING_PRICE_SELECTOR_MODAL_VIEW: 'app/main/rfq-transaction/bom/part-costing/part-price-select/price-selector.html',

    MAIN_CONTROLLER: 'MainController',
    CONTENT_ONLY_VIEW: 'app/core/layouts/content-only.html',

    ASSY_QTY_PRICE_SELECT_SETTING_CONTROLLER: 'AssyQuantityPriceSelectionSettingController',
    ASSY_QTY_PRICE_SELECT_SETTING_VIEW: 'app/main/rfq-transaction/bom/part-costing/assy_quantity_price_selection_setting/assy_quantity_price_selection_setting.html',

    TIMEDOUT_MODAL_VIEW: 'app/view/timedout-popup/timedout-popup.html',
    TIMEDOUT_MODAL_CONTROLLER: 'TimedOutPopupController',

    CHANGE_PASSWORD_VIEW: 'app/core/user/change-password/change-password-popup.html',
    CHANGE_PASSWORD_CONTROLLER: 'ChangePasswordPopupController',

    PRINT_BARCODE_LABEL_MODAL_CONTROLLER: 'PrintLabelPopupController',
    PRINT_BARCODE_LABEL_MODAL_VIEW: 'app/core/component/print-label-popup/print-label-popup.html',

    HALT_RESUME_VIEW: 'app/core/component/halt-resume-popup/halt-resume-popup.html',
    HALT_RESUME_CONTROLLER: 'HaltResumePopupController',

    HALT_RESUME_HISTORY_VIEW: 'app/core/component/halt-resume-history-popup/halt-resume-history-popup.html',
    HALT_RESUME_HISTORY_CONTROLLER: 'HaltResumeHistoryPopupController',

    ROHS_STATUS_MISMATCH_CONFIRMATION_VIEW: 'app/core/component/rohs-status-mismatch-confirmation-popup/rohs-status-mismatch-confirmation-popup.html',
    ROHS_STATUS_MISMATCH_CONFIRMATION_CONTROLLER: 'RohsStatusMismatchConfirmationPopupController',

    SUPPLIER_QUOTE_PART_ATTRIBUTES_VIEW: 'app/core/component/supplier-quote-part-attributes-popup/supplier-quote-part-attributes-popup.html',
    SUPPLIER_QUOTE_PART_ATTRIBUTES_CONTROLLER: 'SupplierQuotePartAttributesPopupController',

    SUPPLIER_QUOTE_PART_PRICE_DETAIL_VIEW: 'app/core/component/supplier-quote-part-price-detail-popup/supplier-quote-part-price-detail-popup.html',
    SUPPLIER_QUOTE_PART_PRICE_DETAIL_CONTROLLER: 'SupplierQuotePartPriceDetailPopupController',

    SUPPLIER_QUOTE_COPY_VIEW: 'app/core/component/supplier-quote-copy-popup/supplier-quote-copy-popup.html',
    SUPPLIER_QUOTE_COPY_CONTROLLER: 'SupplierQuoteCopyPopupController',

    SUPPLIER_QUOTE_PART_PRICING_ERROR_VIEW: 'app/core/component/supplier-quote-part-pricing-error-popup/supplier-quote-part-pricing-error-popup.html',
    SUPPLIER_QUOTE_PART_PRICING_ERROR_CONTROLLER: 'SupplierQuotePartPricingErrorPopupController',

    SUPPLIER_QUOTE_PART_PRICING_HISTORY_VIEW: 'app/core/component/supplier-quote-part-pricing-history-popup/supplier-quote-part-pricing-history-popup.html',
    SUPPLIER_QUOTE_PART_PRICING_HISTORY_CONTROLLER: 'SupplierQuotePartPricingHistoryPopupController',

    SUPPLIER_QUOTE_PART_PRICING_WHERE_USED_VIEW: 'app/core/component/supplier-quote-part-pricing-where-used-popup/supplier-quote-part-pricing-where-used-popup.html',
    SUPPLIER_QUOTE_PART_PRICING_WHERE_USED_CONTROLLER: 'SupplierQuotePartPricingWhereUsedPopupController',

    COMPONENT_APPROVED_SUPPLIER_VIEW: 'app/core/component/component-approved-supplier-popup/component-approved-supplier-popup.html',
    COMPONENT_APPROVED_SUPPLIER_CONTROLLER: 'ComponentApprovedSupplierPopupController',


    COMPONENT_COMMENT_VIEW: 'app/core/component/component-comment-popup/component-comment-popup.html',
    COMPONENT_COMMENT_CONTROLLER: 'ComponentCommentPopupController',

    PACKING_SLIP_RECEIVED_QTY_VIEW: 'app/core/component/packing-slip-received-qty-popup/packing-slip-received-qty-popup.html',
    PACKING_SLIP_RECEIVED_QTY_CONTROLLER: 'PackingSlipReceivedQtyPopupController',

    SUPPLIER_INVOICE_PAYMENT_HISTORY_VIEW: 'app/core/component/supplier-invoice-payment-history-popup/supplier-invoice-payment-history-popup.html',
    SUPPLIER_INVOICE_PAYMENT_HISTORY_CONTROLLER: 'SupplierInvoicePaymentHistoryPopupController',

    SHOW_GENERIC_CONFIRMATION_VIEW: 'app/core/component/show-generic-confirmation-popup/show-generic-confirmation-popup.html',
    SHOW_GENERIC_CONFIRMATION_CONTROLLER: 'ShowGenericConfirmationPopupController',

    SALESORDER_SKIPKIT_CONFIRMATION_ERROR_VIEW: 'app/core/component/salesorder-skipkit-confirmation-error-popup/salesorder-skipkit-confirmation-error-popup.html',
    SALESORDER_SKIPKIT_CONFIRMATION_ERROR_CONTROLLER: 'SalesOrderSkipKitConfirmationErrorPopupController',


    //Not in use
    //BARCODE_LABEL_VERIFY_MODAL_CONTROLLER: 'BarcodeVerificationPopupController',
    //BARCODE_LABEL_VERIFY_MODAL_VIEW: 'app/core/component/barcode-verification-popup/barcode-verification-popup.html',

    CAMERA_ZOOM_INOUT_MODAL_CONTROLLER: 'CameraCaptureZoomInOutPopupController',
    CAMERA_ZOOM_INOUT_MODAL_VIEW: 'app/core/component/camera-capture-zoom-in-out-popup/camera-capture-zoom-in-out-popup.html',

    IP_WEBCAM_CAPTURE_MODAL_CONTROLLER: 'IpWebcamCapturePopupController',
    IP_WEBCAM_CAPTURE_MODAL_VIEW: 'app/core/component/ip-webcam-capture-popup/ip-webcam-capture-popup.html',


    TRANSFER_STOCK_MODAL_CONTROLLER: 'TransferStockPopupController',
    TRANSFER_STOCK_MODAL_VIEW: 'app/core/component/transfer-stock-popup/transfer-stock-popup.html',

    SCAN_IMAGE_URL_MODAL_CONTROLLER: 'ScanImageURLPopupController',
    SCAN_IMAGE_URL_MODAL_VIEW: 'app/core/component/scan-image-url-popup/scan-image-url-popup.html',

    COMPONENT_NONETYPE_MODAL_CONTROLLER: 'ComponentNoneTypePopupController',
    COMPONENT_NONETYPE_MODAL_VIEW: 'app/main/admin/component/component-nonetype-popup/component-nonetype-popup.html',

    MANAGE_ASSY_TYPE_MODAL_CONTROLLER: 'ManageAssyTypePopupController',
    MANAGE_ASSY_TYPE_MODAL_MODAL_VIEW: 'app/main/admin/component/rfq-assy-type/manage-rfq-assy-type.html',

    MANAGE_COMPONENT_ADVANCED_FILTER_MODAL_CONTROLLER: 'ManageComponemtAdvancedFilterPopupController',
    MANAGE_COMPONENT_ADVANCED_FILTER_MODAL_VIEW: 'app/main/admin/component/component-advanced-filter-popup/component-advanced-filter-popup.html',

    UID_VERIFICATION_FAILED_MODAL_CONTROLLER: 'UIDVerificationFailedPopupController',
    UID_VERIFICATION_FAILED_MODAL_VIEW: 'app/core/component/uid-verification-failed-popup/uid-verification-failed-popup.html',

    WO_SO_HEADER_DETAILS_MODAL_CONTROLLER: 'WoSalesOrderHeaderDetailsPopupController',
    WO_SO_HEADER_DETAILS_MODAL_VIEW: 'app/core/component/wo-salesorder-header-details-popup/wo-salesorder-header-details-popup.html',

    WO_COMPONENT_STANDARD_CHANGE_ALERT_MODAL_CONTROLLER: 'WOComponentStandardChangeAlertPopupController',
    WO_COMPONENT_STANDARD_CHANGE_ALERT_MODAL_VIEW: 'app/core/component/wo-component-standard-change-alert-popup/wo-component-standard-change-alert-popup.html',

    WO_COMPONENT_ROHS_CHANGE_ALERT_MODAL_CONTROLLER: 'WOComponentRoHSChangeAlertPopupController',
    WO_COMPONENT_ROHS_CHANGE_ALERT_MODAL_VIEW: 'app/core/component/wo-component-rohs-change-alert-popup/wo-component-rohs-change-alert-popup.html',

    TRANSFER_WAREHOUSE_BIN_MODAL_CONTROLLER: 'TransferWarehouseBinPopupController',
    TRANSFER_WAREHOUSE_BIN_MODAL_VIEW: 'app/core/component/transfer-warehouse-bin-popup/transfer-warehouse-bin-popup.html',

    WAREHOUSE_HISTORY_MODAL_CONTROLLER: 'WarehouseHistoryController',
    WAREHOUSE_HISTORY_MODAL_VIEW: 'app/core/component/warehouse-history-popup/warehouse-history-popup.html',

    BIN_HISTORY_MODAL_CONTROLLER: 'BinHistoryController',
    BIN_HISTORY_MODAL_VIEW: 'app/core/component/bin-history-popup/bin-history-popup.html',

    MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER: 'ManagePackagingTypePopupController',
    MANAGE_PACKAGING_TYPE_MODAL_VIEW: 'app/main/admin/rfq-setting/packaging-type/manage-packaging-type-popup.html',

    ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER: 'AssemblyStockStatusPopUpController',
    ASSEMBLY_STOCK_STATUS_MODAL_VIEW: 'app/view/assembly-stock-details-popup/assembly-stock-details-popup.html',

    PREVIEW_SCAN_DOCUMENT_MODAL_CONTROLLER: 'PreviewScanDocumentController',
    PREVIEW_SCAN_DOCUMENT_MODAL_VIEW: 'app/core/component/preview-scan-document-popup/preview-scan-document-popup.html',

    TOLERANCE_QTY_CONFIRMATION_MODAL_CONTROLLER: 'ToleranceQtyConfirmationPopupController',
    TOLERANCE_QTY_CONFIRMATION_MODAL_VIEW: 'app/main/transaction/salesorder/tolerance-qty-confirmation-popup.html',

    CHANGE_UMID_INITIAL_COUNT_MODAL_CONTROLLER: 'ChangeUMIDInitialCountController',
    CHANGE_UMID_INITIAL_COUNT_MODAL_VIEW: 'app/core/component/change-umid-initial-count-popup/change-umid-initial-count-popup.html',

    ADD_EDIT_EMAIL_REPORT_SETTING_MODAL_CONTROLLER: 'EmailReportSettingPopupController',
    ADD_EDIT_EMAIL_REPORT_SETTING_MODAL_VIEW: 'app/directives/custom/email-report-setting/email-report-setting-popup/email-report-setting-popup.html',

    VIEW_ASSY_USED_FOR_MFG_ALIAS_MODAL_CONTROLLER: 'ViewAssyUsedForMFGAliasPopupController',
    VIEW_ASSY_USED_FOR_MFG_ALIAS_MODAL_VIEW: 'app/core/component/view-assy-used-for-mfg-alias/view-assy-used-for-mfg-alias-popup.html',

    VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_CONTROLLER: 'ViewAssemblyListWithoutBOOMPopUpController',
    VIEW_ASSY_LIST_WITHOUT_BOM_MODAL_VIEW: 'app/view/view-assy-list-without-bom-popup/view-assy-list-without-bom-popup.html',

    VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_CONTROLLER: 'ShippingExportControlAssemblyPopUpController',
    VIEW_EXPORT_CONTROL_ASSY_LIST_MODAL_VIEW: 'app/view/shipping-export-control-assy-list-popup/shipping-export-control-assy-list-popup.html',

    WORKORDER_SERIAL_NO_STATUS_LIST_MODAL_CONTROLLER: 'WorkorderSerialNoStatusListPopUpController',
    WORKORDER_SERIAL_NO_STATUS_LIST_LIST_MODAL_VIEW: 'app/view/workorder-serial-no-status-list-view-popup/workorder-serial-no-status-list-view-popup.html',

    WORKORDER_OPERATION_CLEANING_DETAIL_LIST_MODAL_CONTROLLER: 'WorkorderOperationCleaningDetailListPopUpController',
    WORKORDER_OPERATION_CLEANING_DETAIL_LIST_MODAL_VIEW: 'app/view/workorder-operation-cleaning-detail-list-view-popup/workorder-operation-cleaning-detail-list-view-popup.html',

    PACKAGINAG_ALIAS_VALIDATION_POPUP_CONTROLLER: 'PackagingAliasPartValidationPopupController',
    PACKAGINAG_ALIAS_VALIDATION_POPUP_VIEW: 'app/view/packaging-alias-part-validation-popup/packaging-alias-part-validation-popup.html',

    PART_USED_TRANSACTION_LIST_MODAL_CONTROLLER: 'PartUsedTransactionListViewPopupController',
    PART_USED_TRANSACTION_LIST_MODAL_VIEW: 'app/view/part-used-transaction-list-view-popup/part-used-transaction-list-view-popup.html',

    DELETE_CONFIRMATION_MODAL_CONTROLLER: 'DeleteConfirmationPopupController',
    DELETE_CONFIRMATION_MODAL_VIEW: 'app/view/delete-confirmation-popup/delete-confirmation-popup.html',

    GENERIC_CONFIRMATION_MODAL_CONTROLLER: 'GenericConfirmationPopupController',
    GENERIC_CONFIRMATION_MODAL_VIEW: 'app/core/component/generic-confirmation-popup/generic-confirmation-popup.html',

    INVALID_MFR_MAPPING_MODAL_CONTROLLER: 'InvalidMfrMappingPopupController',
    INVALID_MFR_MAPPING_MODAL_VIEW: 'app/core/component/invalid-mfr-mapping-popup/invalid-mfr-mapping-popup.html',

    MFR_IMPORT_MAPP_ERROR_MODAL_CONTROLLER: 'ManufacturerImportMappPopupController',
    MFR_IMPORT_MAPP_ERROR_MODAL_VIEW: 'app/core/component/manufacturer-import-mapp-popup/manufacturer-import-mapp-popup.html',

    MFR_IMPORT_MODAL_CONTROLLER: 'ManufacturerImportPopupController',
    MFR_IMPORT_MODAL_VIEW: 'app/main/admin/component/manufacturer/manufacture-import-popup/manufacture-import-popup.html',

    RESTRICT_ACCESS_CONFIRMATION_MODAL_CONTROLLER: 'RestrictAccessConfirmationPopupController',
    RESTRICT_ACCESS_CONFIRMATION_MODAL_VIEW: 'app/core/component/restrict-access-confirmation-popup/restrict-access-confirmation-popup.html',

    TRANSFER_EMPTY_BIN_MODAL_CONTROLLER: 'TransferEmptyBinPopupController',
    TRANSFER_EMPTY_BIN_MODAL_VIEW: 'app/main/transaction/transfer-stock/transfer-empty-bin-popup.html',

    MFR_CUSTOMER_INACTIVE_MODAL_CONTROLLER: 'MFRCustomerInactiveConfirmationPopupController',
    MFR_CUSTOMER_INACTIVE_MODAL_VIEW: 'app/core/component/mfr-customer-inactive-confirmation-popup/mfr-customer-inactive-confirmation-popup.html',

    COPY_OPMST_DOC_TO_WOOP_MODAL_VIEW: 'app/directives/custom/documents/copy-op-mst-doc-to-woop-popup/copy-op-mst-doc-to-woop-popup.html',
    COPY_OPMST_DOC_TO_WOOP_MODAL_CONTROLLER: 'CopyOpMstDocToWOOpPopupController',

    WHDEPT_CONFIRMATION_MODAL_CONTROLLER: 'WareHouseDepartmentConfirmationPopupController',
    WHDEPT_CONFIRMATION_MODAL_VIEW: 'app/core/component/warehouse-department-confirmation-popup/warehouse-department-confirmation-popup.html',

    AUDIT_MODAL_CONTROLLER: 'AuditPagePopupController',
    AUDIT_MODAL_VIEW: 'app/core/component/audit-page-popup/audit-page-popup.html',

    SEARCH_COLLECT_PART_MODAL_VIEW: 'app/core/component/search-collect-part-popup/search-collect-part-popup.html',
    SEARCH_COLLECT_PART_MODAL_CONTROLLER: 'SearchCollectPartPopupController',

    SELECT_FEEDER_LOCATION_MODAL_VIEW: 'app/core/component/select-feeder-location-popup/select-feeder-location-popup.html',
    SELECT_FEEDER_LOCATION_MODAL_CONTROLLER: 'SelectFeederLocationPopUpController',

    WO_REQ_REV_INVITED_EMP_MODAL_VIEW: 'app/directives/custom/wo-req-rev-invited-personnel-popup/wo-req-rev-invited-personnel-popup.html',
    WO_REQ_REV_INVITED_EMP_MODAL_CONTROLLER: 'WOReqRevInvitedPersonnelPopupController',

    REQUEST_RESPONSE_MODAL_CONTROLLER: 'RequestResponsePopupController',
    REQUEST_RESPONSE_MODAL_VIEW: 'app/core/component/request-response-history-popup/request-response-history-popup.html',

    EMP_PERFORMANCE_MODAL_CONTROLLER: 'EmployeePerformancePopupController',
    EMP_PERFORMANCE_MODAL_VIEW: 'app/core/component/employee-performance-popup/employee-performance-popup.html',

    ALLOCATE_FEEDER_UMID_MODAL_CONTROLLER: 'AllocateFeederUMIDPopupController',
    ALLOCATE_FEEDER_UMID_MODAL_VIEW: 'app/core/component/allocate-feeder-umid-popup/allocate-feeder-umid-popup.html',

    /*Pop-up for view expired and expiring part details (wo op wise) */
    VIEW_INCOMING_OUTGOING_RACK_MODAL_CONTROLLER: 'IncomingOutgoingRackPopupController',
    VIEW_INCOMING_OUTGOING_RACK_MODAL_VIEW: 'app/core/component/incoming-outgoing-rack-popup/incoming-outgoing-rack-popup.html',

    SHOW_EMPTY_RACK_MODAL_CONTROLLER: 'EmptyRackPopupController',
    SHOW_EMPTY_RACK_MODAL_VIEW: 'app/core/component/empty-rack-popup/empty-rack-popup.html',

    SHOW_AVAILABLE_RACK_MODAL_CONTROLLER: 'AvailableRackPopupController',
    SHOW_AVAILABLE_RACK_MODAL_VIEW: 'app/core/component/available-rack-popup/available-rack-popup.html',

    CLEAR_RACK_MODAL_CONTROLLER: 'ClearRackPopupController',
    CLEAR_RACK_MODAL_VIEW: 'app/core/component/clear-rack-popup/clear-rack-popup.html',

    RACK_HISTORY_MODAL_CONTROLLER: 'RackHistoryPopupController',
    RACK_HISTORY_MODAL_VIEW: 'app/core/component/rack-history-popup/rack-history-popup.html',

    COPY_CONFIRM_WOOP_DUPLICATE_DOC_MODAL_VIEW: 'app/directives/custom/documents/copy-confirmation-for-woop-duplicate-doc-popup/copy-confirmation-for-woop-duplicate-doc-popup.html',
    COPY_CONFIRM_WOOP_DUPLICATE_DOC_MODAL_CONTROLLER: 'CopyConfirmationForWOOPDuplicateDocPopUpController',

    RACK_STATUS_MODAL_CONTROLLER: 'RackCurrentStatusPopupController',
    RACK_STATUS_MODAL_VIEW: 'app/core/component/rack-current-status-popup/rack-current-status-popup.html',

    COMPONENET_INSPECTION_REQUIREMENT_DET_MODAL_CONTROLLER: 'ComponenetInspectionRequirementDetPopupController',
    COMPONENET_INSPECTION_REQUIREMENT_DET_MODAL_VIEW: 'app/core/component/componenet-inspection-requirement-det-popup/componenet-inspection-requirement-det-popup.html',

    COMPONENT_CUSTOMER_COMMENT_DET_MODAL_CONTROLLER: 'ComponentCustomerCommentDetPopupController',
    COMPONENT_CUSTOMER_COMMENT_DET_MODAL_VIEW: 'app/main/admin/customer/mfgcode-customer-comment-det-popup/mfgcode-customer-comment-det-popup.html',


    COMPONENET_REQUIREMENT_COPY_POPUP_MODAL_CONTROLLER: 'componentRequirmentCopyPopupController',
    COMPONENET_REQUIREMENT_COPY_POPUP_MODAL_VIEW: 'app/directives/custom/componenet-inspection-requirement-det/component-requirment-copy-popup.html',

    MOVE_DUPLICATE_DOC_CONFIRM_MODAL_VIEW: 'app/directives/custom/documents/move-duplicate-doc-confirmation-popup/move-duplicate-doc-confirmation-popup.html',
    MOVE_DUPLICATE_DOC_CONFIRM_MODAL_CONTROLLER: 'MoveDuplicateDocConfirmationPopupController',

    MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER: 'ManagePuchaseInspectionRequirementPopupController',
    MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW: 'app/main/admin/purchase-incoming-inspection-requirement/purchase-inspection/manage-purchase-inspection-popup.html',

    PURCHASE_INSPECTION_UPDATE_MULTIPLE_CATEGORY_MODAL_CONTROLLER: 'PurchaseInspectionUpdateMultipleCategoryPopupController',
    PURCHASE_INSPECTION_UPDATE_MULTIPLE_CATEGORY_MODAL_VIEW: 'app/main/admin/purchase-incoming-inspection-requirement/purchase-inspection/update-multiple-category-popup/update-multiple-category-popup.html',

    MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_CONTROLLER: 'ManagePurchaseInspectionTemplateController',
    MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_VIEW: 'app/main/admin/purchase-incoming-inspection-requirement/purchase-inspection-template/manage-purchase-inspection-template-popup.html',

    WHERE_USED_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER: 'WhereUsedInspectionRequirementPopupController',
    WHERE_USED_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW: 'app/main/admin/purchase-incoming-inspection-requirement/purchase-inspection/where-used-inspection-popup.html',

    MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER: 'MultipleButtonsDialogPopupController',
    MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW: 'app/core/component/multiple-buttons-dialog-popup/multiple-buttons-dialog-popup.html',

    SUPPLIER_RMA_DUPLICATE_CONFIRMATION_POPUP_CONTROLLER: 'SupplierRMADuplicateConfirmationPopupController',
    SUPPLIER_RMA_DUPLICATE_CONFIRMATION_POPUP_VIEW: 'app/core/component/supplier-rma-duplicate-confirmation-popup/supplier-rma-duplicate-confirmation-popup.html',

    COMPONENT_NICKNAME_VALIDATION_DETAIL_POPUP_CONTROLLER: 'ComponentNicknameValidationDetailPopupController',
    COMPONENT_NICKNAME_VALIDATION_DETAIL_POPUP_VIEW: 'app/core/component/component-nickname-validation-detail-popup/component-nickname-validation-detail-popup.html',

    HOME_DUPLICATE_ENTRY_DIALOG_POPUP_CONTROLLER: 'HomePageDuplicateEntryDialogPopupController',
    HOME_DUPLICATE_ENTRY_DIALOG_POPUP_VIEW: 'app/core/component/home-page-duplicate-entry-popup/home-page-duplicate-entry-popup.html',

    CUSTOMER_TRANSACTION_CHANGE_HISTORY_CONTROLLER: 'CutomerPackingSlipHistoryController',
    CUSTOMER_TRANSACTION_CHANGE_HISTORY_POPUP_VIEW: 'app/core/component/customer-packing-slip-history/customer-packing-slip-history.html',

    CUSTOMER_TRACKING_NUMBER_CONTROLLER: 'CustomerTrackingNumber',
    CUSTOMER_TRACKING_NUMBER_POPUP_VIEW: 'app/core/component/customer-tracking-number/customer-tracking-number.html',

    MANAGE_FOB_POPUP_CONTROLLER: 'FOBPopupController',
    MANAGE_FOB_POPUP_VIEW: 'app/main/admin/fob/manage-fob-popup.html',

    ARCHIEVE_VERSION_POPUP_CONTROLLER: 'ArchieveVersionPopupController',
    ARCHIEVE_VERSION_POPUP_VIEW: 'app/core/component/archieve-version-popup/archieve-version-popup.html',

    AGREED_USER_POPUP_CONTROLLER: 'AgreedUserPopupController',
    AGREED_USER_POPUP_VIEW: 'app/core/component/agreed-user-popup/agreed-user-popup.html',

    DATAKEY_POPUP_CONTROLLER: 'DataKeyPopupController',
    DATAKEY_POPUP_VIEW: 'app/core/component/data-key-popup/data-key-popup.html',

    ASSIGNRIGHTSANDFEATURES_POPUP_CONTROLLER: 'AssignRightsAndFeaturesPopupController',
    ASSIGNRIGHTSANDFEATURES_POPUP_VIEW: 'app/core/component/assign-rights-and-features-popup/assign-rights-and-features-popup.html',

    SIGNATURE_MODAL_VIEW: 'app/view/signature-view-popup/signature-view-popup.html',
    SIGNATURE_MODAL_CONTROLLER: 'SignaturePopupController',

    ENTITY_IMAGES_PREVIEW_MODAL_VIEW: 'app/core/component/entity-images-preview-popup/entity-images-preview-popup.html',
    ENTITY_IMAGES_PREVIEW_MODAL_CONTROLLER: 'EntityImagesPreviewPopupController',

    SALESORDER_OTHER_EXPENSE_MODAL_VIEW: 'app/core/component/salesorder-otherexpense-popup/salesorder-otherexpense-popup.html',
    SALESORDER_OTHER_EXPENSE_MODAL_CONTROLLER: 'SalesOrderOtherExpensePopupController',

    COMPONENT_CUSTOMER_CONSIGN_STOCK_DETAIL_MODEL_VIEW: 'app/core/component/component-customer-consign-stock-detail-popup/component-customer-consign-stock-detail-popup.html',
    COMPONENT_CUSTOMER_CONSIGN_STOCK_DETAIL_MODEL_CONTROLLER: 'ComponentCustomerConsignStockDetailPopUpController',

    COMMON_USERNAME_PASSWORD_CONFIRMATION_POPUP_VIEW: 'app/core/component/common-username-password-confirmation-popup/common-username-password-confirmation-popup.html',
    COMMON_USERNAME_PASSWORD_CONFIRMATION_POPUP_CONTROLLER: 'CommonUsernamePasswordConfirmationPopupController',

    MULTI_CAMERA_MODAL_VIEW: 'app/core/component/multi-camera-view/multi-camera-view.html',
    MULTI_CAMERA_MODAL_CONTROLLER: 'MultiCameraController',

    PURCHASE_ORDER_REQUIREMENT_PART_MODAL_CONTROLLER: 'PurchaseOrderPurchasePartRequirementPopupController',
    PURCHASE_ORDER_REQUIREMENT_PART_MODAL_VIEW: 'app/main/transaction/purchase-management/purchase-order/purchase-order-purchase-require-comment.html',

    PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_TITLE: 'Received Qty Details',
    PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_CONTROLLER: 'PurchaseOrderReceivedQtyDetailsController',
    PURCHASE_ORDER_RECEIVED_QTY_DETAILS_POPUP_VIEW: 'app/main/transaction/purchase-management/purchase-order/purchase-order-received-qty-details-popup.html',

    MANAGE_RELEASE_POPUP_CONTROLLER: 'ReleasePopupController',
    MANAGE_RELEASE_POPUP_VIEW: 'app/main/admin/release-notes/manage-release-popup.html',

    MANAGE_RELEASE_NOTE_POPUP_CONTROLLER: 'ReleaseNotePopupController',
    MANAGE_RELEASE_NOTE_POPUP_VIEW: 'app/main/admin/release-notes/manage-release-notes-popup.html',

    PURCHASE_ORDER_CHANGE_HISTORY_POPUP_TITLE: 'Purchase Order Change History',
    PURCHASE_ORDER_CHANGE_HISTORY_CONTROLLER: 'PurchaseOrderHistoryController',
    PURCHASE_ORDER_CHANGE_HISTORY_POPUP_VIEW: 'app/core/component/purchase-order-change-history/purchase-order-change-history.html',

    VIEW_WHEREUSED_MANUFACTURER_MODAL_VIEW: 'app/view/view-where-used-manufacturer-popup/view-where-used-manufacturer-popup.html',
    VIEW_WHEREUSED_MANUFACTURER_MODAL_CONTROLLER: 'ViewWhereUsedManufacturerPopupController',

    RELEASE_LINE_PO_MODAL_VIEW: 'app/core/component/purchase-order-release-line-popup/purchase-order-release-line-popup.html',
    RELEASE_LINE_PO_MODAL_CONTROLLER: 'PurchaseOrderReleaseLinePopupController',

    PART_IN_PO_LINE_CONTROLLER: 'PartInPOLinePopupController',
    PART_IN_PO_LINE_VIEW: 'app/core/component/part-in-po-line-popup/part-in-po-line-popup.html',

    MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER: 'ManageChartofAccountsPopupController',
    MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW: 'app/main/admin/chartofaccounts/manage-chart-of-accounts-popup.html',

    MANGE_HELPBLOG_DETAILS_POPUP_CONTROLLER: 'HelpBlogNotesController',
    MANGE_HELPBLOG_DETAILS_POPUP_VIEW: 'app/main/configuration/help-blog/manage-help-blog-detail-popup.html',

    MANGE_HELPBLOG_HISTORY_POPUP_CONTROLLER: 'HelpBlogHistoryPopupController',
    MANGE_HELPBLOG_HISTORY_POPUP_VIEW: 'app/main/configuration/help-blog/help-blog-history-popup.html',

    COMMON_REASON_MODAL_CONTROLLER: 'CommonReasonPopupController',
    COMMON_REASON_MODAL_VIEW: 'app/core/component/common-reason-popup/common-reason-popup.html',

    SO_RELEASE_LINE_MODAL_CONTROLLER: 'SalesOrderReleaseLinePopupController',
    SO_RELEASE_LINE_MODAL_VIEW: 'app/main/transaction/salesorder/salesorder-releaseline-popup.html',

    VIEW_BULLET_POINT_LIST_POPUP_CONTROLLER: 'viewBulletPointListPopupController',
    VIEW_BULLET_POINT_LIST_POPUP_VIEW: 'app/directives/custom/view-bullet-point-list/view-bullet-point-list-popup.html',

    COMMON_HISTORY_POPUP_MODAL_CONTROLLER: 'CommonHistoryPopupController',
    COMMON_HISTORY_POPUP_MODAL_VIEW: 'app/core/component/common-history-popup/common-history-popup.html',

    VIEW_OTHER_CHARGE_SODETAIL_MODAL_CONTROLLER: 'ViewOtherChargesWithSODetailPopupController',
    VIEW_OTHER_CHARGE_SODETAIL_MODAL_VIEW: 'app/view/view-other-charges-with-sodetail-popup/view-other-charges-with-sodetail-popup.html',

    VIEW_SO_RELEASE_DETAIL_CONFIRM_MODAL_CONTROLLER: 'ViewSOReleaseLineChargeConfirmationPopupController',
    VIEW_SO_RELEASE_DETAIL_CONFIRM_MODAL_VIEW: 'app/view/view-so-release-line-change-confirmation-popup/view-so-release-line-change-confirmation-popup.html',

    BLANKET_PO_ASSY_MODAL_VIEW: 'app/view/view-blanket-po-assy-detail/view-blanket-po-assy-detail.html',
    BLANKET_PO_ASSY_MODAL_CONTROLLER: 'ViewBlanketPOAssyDetailPopupController',

    BURDEN_PAYMENT_MODAL_CONTROLLER: 'BurdenPaymentController',
    BURDEN_PAYMENT_MODAL_VIEW: 'app/core/component/employee-burden-payment-popup/employee-burden-payment-popup.html',

    FUTURE_PO_ASSY_NOT_LINK_MODAL_VIEW: 'app/core/component/salesorder-not-linked-future-po/salesorder-not-linked-future-po-popup.html',
    FUTURE_PO_ASSY_NOT_LINK_MODAL_CONTROLLER: 'SalesOrderNotLinkedFPOPopupController',

    FUTURE_PO_ASSY_NEW_CREATE_MODAL_VIEW: 'app/core/component/salesorder-new-future-po-popup/salesorder-new-future-po-popup.html',
    FUTURE_PO_ASSY_NEW_CREATE_MODAL_CONTROLLER: 'SalesOrderNewFuturePOPopupController',

    //paymentTerm: "Terms",
    EquipmentEmpty: 'equipment',
    WorksationEmpty: 'workstation',

    EMPTYSTATE: {
      COMMON: {
        IMAGEURL: 'assets/images/emptystate/grid-empty.png',
        MESSAGE: 'Click below to add new records for {0}!'
      },
      QTY_CONFIRMATION_LIST: {
        IMAGEURL: 'assets/images/emptystate/grid-empty.png',
        MESSAGE: '{0} does not exists.'
      },
      NOTIFICATION: {
        IMAGEURL: 'assets/images/emptystate/page-list.png',
        MESSAGE: 'No notifications listed yet!'
      },
      EMPTY_SEARCH: {
        IMAGEURL: 'assets/images/emptystate/grid-empty.png',
        MESSAGE: 'No result matching your search criteria.'
      },
      TIMELINE: {
        IMAGEURL: 'assets/images/emptystate/grid-empty.png',
        MESSAGE: 'No timeline details for current user!'
      },
      IN_HOUSE_ASSEMBLY_STOCK: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No opening assembly stock details listed yet!'
      },
      ASSIGNEMPLOYEES: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        MESSAGE: 'Personnel not assigned to customer.',
        ALL_ASSIGNED: 'All personnels are assigned.',
        ADDNEWMESSAGE: 'Click below to add a personnel',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNCUSTOMER: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        MESSAGE: 'Customer not assigned to personnel.',
        ALL_ASSIGNED: 'All customers are assigned.',
        ADDNEWMESSAGE: 'Click below to add a personnel',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      MESSAGE_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/message-list.png',
        MESSAGE: 'No message history found!'
      },
      HALT_RESUME_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No halt history found!'
      },
      RACK: {
        IMAGEURL: 'assets/images/emptystate/rack.png',
        MESSAGE: 'No rack assigned for operation {0}.',
        REFRESHMSG: 'Click below to refresh Rack'
      },
      EMPTYRACK: {
        IMAGEURL: 'assets/images/emptystate/rack.png',
        MESSAGE: 'No empty rack available.',
        REFRESHMSG: 'Click below to refresh Empty Rack'
      },
      AVAILABLERACK: {
        IMAGEURL: 'assets/images/emptystate/rack.png',
        MESSAGE: 'No rack available for operation {0}.',
        REFRESHMSG: 'Click below to refresh Available Rack'
      },
      CLEARRACK: {
        IMAGEURL: 'assets/images/emptystate/rack.png',
        MESSAGE: 'No rack cleared from operation {0}.',
        REFRESHMSG: 'Click below to refresh Clear Rack'
      },
      RACKHISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'No history listed yet.',
        MESSAGERACK: 'No {0} history listed yet.',
        REFRESHMSG: 'Click below to refresh Rack History'
      },
      RACK_STATUS_CURRENT: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        MESSAGE: 'No rack scanned yet.',
        MESSAGERACK: 'No operation listed for rack {0} yet.'
      },
      COMMON_DATA_NOT_FOUND: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No data logged yet!'
      },
      SALES_COMMISSION: {
        IMAGEURL: 'assets/images/emptystate/sales-commission.png',
        MESSAGE: 'Sales Commission does not exist.'
      },
      RELEASE_LINE: {
        IMAGEURL: 'assets/images/emptystate/release-line.png',
        MESSAGE: 'All release line(s) completed.',
        MESSAGE_CHECK: 'No release line completed yet!'
      },
      SELECT_ANY_FOLDER_FOR_DOC_ACTION: {
        IMAGEURL: 'assets/images/emptystate/document.png',
        MESSAGE: 'No folder selected, Please select folder from list.'
      },
      VIEW_ASSY_BPO: {
        IMAGEURL: 'assets/images/emptystate/link-fpo.png',
        MESSAGE: 'No PO(s) linked with Blanket PO.'
      },
      FPO_LINK_VIEW_ASSY_BPO: {
        IMAGEURL: 'assets/images/emptystate/unlink-fpo.png',
        MESSAGE: 'No PO(s) added for selected assembly.'
      },
      PRIMARY_CONTACT_PERSON_DIRECTIVE: {
        MESSAGE: 'There is no "Primary Contact Person" added in this {0}.'
      },
      PHONE_EMAIL_NOT_ADDED: {
        MESSAGE: 'There is no "{0}" added in this Contact Person.'
      }
    },

    API_URL: _configRootUrl,
    IDENTITY_URL: _identityURL,
    WEB_URL: _configWebUrl,
    REPORT_URL: _configReportUrl,
    ENTERPRISE_SEARCH_URL: _configEnterpriseSearchUrl,
    REPORT_DESIGNE_URL: _configReportDesigneUrl,
    VIEW_REPORT_DESIGNE_URL: _configReportDesigneUrl + 'Designer/Index/',
    REPORT_VIEWERLINK_URL: _configReportViewerUrl,
    REPORT_VIEWER_URL: _configReportViewerUrl + 'Viewer/Index/',
    DocumentSize: _configDocumentSize,
    IsPermanentDelete: _configPermanentDelete,

    //set data limit per page
    datalimit: _dataLimit,
    //set is pagination flag
    isPagination: true,
    //API_URL: 'http://192.168.0.208:8899',
    REPORT_CATEGORY: {
      STATIC_REPORT: '1',
      END_USER_REPORT: '2',
      TEMPLATE_REPORT: '3',
      SYSTEM_GENERATED_REPORT: '4'
    },

    TABLE_NAME: {
      UOM: 'Uoms',
      RFQ_MOUNTINGTYPE: 'rfq_mountingtypemst',
      RFQ_PACKAGECASETYPE: 'rfq_packagecasetypemst',
      RFQ_PARTTYPE: 'rfq_parttypemst',
      RFQ_ROHS: 'rfq_rohsmst',
      COUNTRY: 'countrymst',
      RFQ_CONNECTERTYPE: 'rfq_connectertypemst',
      COMPONENT_PACKAGINGTYPE: 'component_packagingmst',
      COMPONENT_PARTSTATUS: 'component_partstatusmst',
      MFG_CODE_ALIAS: 'mfgcodealias',
      PACKING_SLIP_MATERIAL_RECEIVE_DET: 'packing_slip_material_receive_det',
      COMPONENT_SID_STOCK: 'component_sid_stock',
      KIT_ALLOCATION: 'kit_allocation',
      WORKORDER_OPERATION_PART: 'workorder_operation_part',
      WORKORDER_TRANS_UMID_DETAILS: 'workorder_trans_umid_details',
      OPERATION_PART: 'operation_part',
      USERS: 'users',
      PURCHASE_INSPECTION_REQUIREMENT: 'inspection_mst',
      PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE: 'inspection_template_mst',
      SUPPLIER_QUOTE_PARTS_DET: 'supplier_quote_parts_det',
      FOB: 'freeonboardmst',
      GENERIC_FILE_EXTENSION: 'generic_file_extension',
      PACKINGSLIP_INVOICE_PAYMENT: 'packingslip_invoice_payment',
      PURCHASE_ORDER_DET: 'purchase_order_det',
      MFG_CODE_MST: 'mfgcodemst',
      SUPPLIER_QUOTE_MST: 'supplier_quote_mst',
      DC_FORMAT: 'date_code_format'
    },

    InputeFields: [{
      ID: 1,
      Value: 'Text box',
      IconClass: 'icon-format-text',
      DataType: 'Varchar'
    }, {
      ID: 2,
      Value: 'Number box',
      IconClass: 'icon-numeric',
      DataType: 'Integer'
    }, {
      ID: 3,
      Value: 'Multiline Text',
      IconClass: 'icon-comment-multipe-outline',
      DataType: 'Varchar'
    }, {
      ID: 4,
      Value: 'Editor',
      IconClass: 'icon-newspaper',
      DataType: 'Varchar'
    }, {
      ID: 5,
      Value: 'Date Time',
      IconClass: 'icon-calendar-text',
      DataType: 'DateTime'
    }, {
      ID: 6,
      Value: 'Date Range',
      IconClass: 'icon-calendar-multiple',
      DataType: 'DateTime'
    }, {
      ID: 7,
      Value: 'Single Choice',
      IconClass: 'icon-checkbox-marked-outline',
      DataType: 'Varchar'
    }, {
      ID: 8,
      Value: 'Multiple Select',
      IconClass: 'icon-checkbox-multiple-marked-outline',
      DataType: 'Varchar'
    }, {
      ID: 9,
      Value: 'Option',
      IconClass: 'icon-radiobox-marked',
      DataType: 'Varchar'
    }, {
      ID: 10,
      Value: 'Combo Box',
      IconClass: 'icon-menu-down',
      DataType: 'Varchar'
    }, {
      ID: 11,
      Value: 'Multi-Choice',
      IconClass: 'icon-markdown',
      DataType: 'Varchar'
    }, {
      ID: 12,
      Value: 'Document Upload',
      IconClass: 'icon-auto-upload',
      DataType: 'Document'
    }, {
      ID: 13,
      Value: 'Email',
      IconClass: 'icon-email',
      DataType: 'Varchar'
    }, {
      ID: 14,
      Value: 'Currency',
      IconClass: 'icon-currency-usd',
      DataType: 'Decimal'
    }, {
      ID: 15,
      Value: 'URL',
      IconClass: 'icon-web',
      DataType: 'Varchar'
    }, {
      ID: 16,
      Value: 'Signature',
      IconClass: 'icon-pen',
      DataType: 'Varchar'
    },
    //{
    //    ID: 17,
    //    Value: "Lookup",
    //    IconClass: "icon-account-search"
    //},
    {
      ID: 18,
      Value: 'Subform',
      IconClass: 'icon-forum',
      DataType: '-'
    },
    //, {
    //    ID: 19,
    //    Value: "ControlState",
    //    IconClass: "icon-toggle-switch-on"
    //}
    //, {
    //    ID: 19,
    //    Value: "MultipleInput",
    //    IconClass: "icon-playlist-plus"
    //}
    {
      ID: 19,
      Value: 'Autocomplete Search',
      IconClass: 'icons-auto-complete',
      DataType: 'Varchar'
    },
    {
      ID: 20,
      Value: 'Label',
      IconClass: 'icon-alphabetical',
      DataType: 'Varchar'
    }
    ],

    InputeFieldKeys: {
      Textbox: 1,
      Numberbox: 2,
      Multilinetextbox: 3,
      Editor: 4,
      DateTime: 5,
      DateRange: 6,
      SingleChoice: 7,
      MultipleChoice: 8,
      Option: 9,
      Combobox: 10,
      MultipleChoiceDropdown: 11,
      FileUpload: 12,
      Email: 13,
      Currency: 14,
      URL: 15,
      Signature: 16,
      //Lookup:17,
      SubForm: 18,
      //ControlState: 19
      CustomAutoCompleteSearch: 19,
      Label: 20
    },
    TimeFormatArray: [{
      'format': 'hh:mm a',
      'mask': '99:99 AA',
      'placeholder': 'HH:MM AM',
      'ReportTimeFormat': 'hh:mm tt'
    }],
    commonNumberUnit: [{
      'unitename': 'UnitPrice',
      'value': {
        'Decimal': '5',
        'Step': '0.00001'
        //'Report': "''$'#,0.00000;('$'#,0.00000)'"
      }
    }, {
      'unitename': 'SixDigitUnit',
      'value': {
        'Decimal': '6',
        'Step': '0.000001'
        //'Report': "'$'#,0.000000;('$'#,0.000000)"
      }
    }, {
      'unitename': 'Unit',
      'value': {
        'Decimal': '5',
        'Step': '0.00001'
        //'Report': '#,0;(#,0)'
      }
    }, {
      'unitename': 'Amount',
      'value': {
        'Decimal': '2',
        'Step': '0.01'
        //'Report': "'$'#,0.00;('$'#,0.00)"
      }
    }],
    RFQInternalVersionMethodArray: [{
      title: 'Date',
      value: 'D'
    },
    {
      title: 'Text',
      value: 'T'
    }],
    InoAutoServerHeartbeatStatusArray: [{
      title: 'Online',
      value: 'Online'
    },
    {
      title: 'Offline',
      value: 'Offline'
    }],
    PricingServiceStatusArray: [{
      title: 'Service is in running mode',
      value: '1'
    },
    {
      title: 'Service is in stop mode',
      value: '0'
    }],
    CustomerReceiptInvoiceAutoSelectArray: [{
      title: 'Auto select invoice from pending invoice list based on matching payment amount',
      value: '1'
    },
    {
      title: 'Forwarding balance amount',
      value: '2'
    },
    {
      title: 'Manual',
      value: '0'
    }],
    DefaultThemeArray: [{
      title: 'Default Theme',
      value: 'default'
    },
    {
      title: 'Pink Theme',
      value: 'pinkTheme'
    },
    {
      title: 'Teal Theme',
      value: 'tealTheme'
    }],
    DemoThemeArray: [{
      title: 'To view as demo application',
      value: '1'
    },
    {
      title: 'To view as live application',
      value: '0'
    }],
    AuthenticateCheckNumberDuplicationArray: [{
      title: 'Authentication Required',
      value: '1'
    },
    {
      title: 'Authentication not required',
      value: '0'
    }],
    ShowDigikeyAccessTokenPopupOnLoginArray: [{
      title: 'Turn on',
      value: '1'
    },
    {
      title: 'Turn off',
      value: '0'
    }],
    DatakeyOrderingArray: [
      { name: 'clusterName', value: 'Cluster Name' },
      { name: 'displayName', value: 'Display Name' }
    ],
    DateFormatArray: [{
      'type': '1',
      'uimaskformat': '99/99/9999',
      //"bootstapformat": "MM/dd/yyyy",
      'format': 'MM/dd/yyyy', //01. 12/13/2016
      'placeholder': 'MM/DD/YYYY',
      'MySQLFormat': '%m/%d/%Y',
      'displayformat': '12/13/2016',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'MM/dd/yyyy'
    }, {
      'type': '0',
      'uimaskformat': '99/99/9999 99:99',
      //"bootstapformat": "MM/dd/yyyy HH:mm",
      'format': 'MM/dd/yyyy HH:mm', //02. 12/13/2016 15:12
      'placeholder': 'MM/DD/YYYY HH:mm',
      'MySQLFormat': '%m/%d/%Y %H:%i',
      'displayformat': '12/13/2016 15:12',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'MM/dd/yyyy HH:mm'
    }, {
      'type': '0',
      'uimaskformat': '99/99/9999 99:99 AA',
      //"bootstapformat": "MM/dd/yyyy hh:mm AM",
      'format': 'MM/dd/yyyy hh:mm a', //03. 12/13/2016 5:12 AM
      'placeholder': 'MM/DD/YYYY HH:mm AM',
      'MySQLFormat': '%m/%d/%Y %h:%i %p',
      'displayformat': '12/13/2016 5:12 AM',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'MM/dd/yyyy hh:mm tt'
    }, {
      'type': '1',
      'uimaskformat': '99/99/9999',
      //"bootstapformat": "dd/MM/yyyy",
      'format': 'dd/MM/yyyy', //04. 13-12-2016
      'placeholder': 'DD/MM/YYYY',
      'MySQLFormat': '%d/%m/%Y',
      'displayformat': '13-12-2016',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'dd/MM/yyyy'
    }, {
      'type': '0',
      'uimaskformat': '99/99/9999 99:99',
      //"bootstapformat": "dd/MM/yyyy HH:mm",
      'format': 'dd/MM/yyyy HH:mm', //05. 13/12/2016 15:12
      'placeholder': 'DD/MM/YYYY HH:mm',
      'MySQLFormat': '%d/%m/%Y %H:%i',
      'displayformat': '13/12/2016 15:12',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'dd/MM/yyyy HH:mm'
    }, {
      'type': '0',
      'uimaskformat': '99/99/9999 99:99 AA',
      //"bootstapformat": "dd/MM/yyyy hh:mm AM",
      'format': 'dd/MM/yyyy hh:mm a', //06. 13/12/2016 5:12 AM
      'placeholder': 'DD/MM/YYYY HH:mm AM',
      'MySQLFormat': '%d/%m/%Y %h:%i %p',
      'displayformat': '13/12/2016 5:12 AM',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'dd/MM/yyyy hh:mm tt'
    }, {
      'type': '1',
      'uimaskformat': '9999/99/99',
      //"bootstapformat": "yyyy/MM/dd",
      'format': 'yyyy/MM/dd', //07. 2016/12/13
      'placeholder': 'YYYY/MM/DD',
      'MySQLFormat': '%Y/%m/%d',
      'displayformat': '2016/12/13',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'yyyy/MM/dd'
    }, {
      'type': '0',
      'uimaskformat': '9999/99/99 99:99',
      //"bootstapformat": "yyyy/MM/dd HH:mm",
      'format': 'yyyy/MM/dd HH:mm', //08. 13/12/2016 15:12
      'placeholder': 'YYYY/MM/DD HH:mm',
      'MySQLFormat': '%Y/%m/%d %H:%i',
      'displayformat': '13/12/2016 15:12',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'yyyy/MM/dd HH:mm'
    }, {
      'type': '0',
      'uimaskformat': '9999/99/99 99:99 AA',
      //"bootstapformat": "yyyy/MM/dd hh:mm AM",
      'format': 'yyyy/MM/dd hh:mm a', //09. 2016/12/13 03:12 PM
      'placeholder': 'YYYY/MM/DD HH:mm AM',
      'MySQLFormat': '%Y/%m/%d %h:%i %p',
      'displayformat': '2016/12/13 03:12 PM',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'yyyy/MM/dd hh:mm tt'
    }, {
      'type': '1',
      'uimaskformat': '99.99.9999',
      //"bootstapformat": "dd.MM.yyyy",
      'format': 'dd.MM.yyyy', //10. 13.12.2016
      'placeholder': 'DD.MM.YYYY',
      'MySQLFormat': '%d.%m.%Y',
      'displayformat': '13.12.2016',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'dd.MM.yyyy'
    }, {
      'type': '1',
      'uimaskformat': '99-AAA-9999',
      //"uimaskformat": "",
      //"bootstapformat": "dd-MMMM-yyyy",
      'format': 'dd-MMM-yyyy', //11. 13-12-2016
      'placeholder': 'DD-MMM-YYYY',
      'MySQLFormat': '%d-%m-%Y',
      'displayformat': '13-12-2016',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'dd-MMM-yyyy'
    }, {
      'type': '1',
      'uimaskformat': '9999-99-99',
      //"bootstapformat": "yyyy-MM-dd",
      'format': 'yyyy-MM-dd', //12. 2016-12-13
      'placeholder': 'YYYY-MM-DD',
      'MySQLFormat': '%Y-%m-%d',
      'displayformat': '2016-12-13',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'yyyy-MM-dd'
    }, {
      'type': '0',
      'uimaskformat': '9999-99-99 99:99',
      //"bootstapformat": "yyyy-MM-dd hh:mm",
      'format': 'yyyy-MM-dd HH:mm', //13. 2016-12-13 03:12
      'placeholder': 'YYYY-MM-DD HH:mm',
      'MySQLFormat': '%Y-%m-%d %H:%i',
      'displayformat': '2016-12-13 03:12',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'yyyy-MM-dd HH:mm'
    }, {
      'type': '0',
      'uimaskformat': '9999-99-99 99:99 AA',
      //"bootstapformat": "yyyy-MM-dd hh:mm AM",
      'format': 'yyyy-MM-dd hh:mm a', //14. 2016-12-13 03:12 PM
      'placeholder': 'YYYY-MM-DD HH:mm AM',
      'MySQLFormat': '%Y-%m-%d %h:%i %p',
      'displayformat': '2016-12-13 03:12 PM',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'yyyy-MM-dd hh:mm tt'
    }, {
      'type': '2',
      'uimaskformat': '99:99 AA',
      //"bootstapformat": "hh:mm AM",
      'format': 'hh:mm a', //15. 03:12 PM
      'placeholder': 'HH:mm AM',
      'MySQLFormat': '%h:%i %p',
      'displayformat': '03:12 PM',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'hh:mm tt'
    }, {
      'type': '2',
      'uimaskformat': '99:99',
      //"bootstapformat": "hh:mm",
      'format': 'HH:mm', //16. 03:12
      'placeholder': 'HH:mm',
      'MySQLFormat': '%H:%i',
      'displayformat': '03:12',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'HH:mm'
    },
    {
      'type': '1',
      'uimaskformat': '99/99/99',
      //"bootstapformat": "MM/dd/yy",
      'format': 'MM/dd/yy', //17. 12/13/16
      'placeholder': 'MM/DD/YY',
      'MySQLFormat': '%m/%d/%y',
      'displayformat': '12/13/16',
      'isDisplayFullYearFormat': false,
      'ReportDateFormat': 'MM/dd/yy'
    },
    {
      'type': '1',
      'uimaskformat': 'AAA 99, 9999',
      //"bootstapformat": "MMMM DD, Y",
      'format': 'MMM dd, yyyy', //18. 'MMMM DD, Y'
      'placeholder': 'MMM DD, YYYY',
      'MySQLFormat': '%m %d %Y',
      'displayformat': '12 13, 2016',
      'isDisplayFullYearFormat': true,
      'ReportDateFormat': 'MMM dd, yyyy'
    },
    {
      'type': '0',
      'uimaskformat': '99/99/99 99:99',
      //"bootstapformat": "MM/dd/yy HH:mm",
      'format': 'MM/dd/yy HH:mm', //19. 12/13/16 15:12
      'placeholder': 'MM/DD/YY HH:mm',
      'MySQLFormat': '%m/%d/%y %H:%m',
      'displayformat': '12/13/16 15:12',
      'isDisplayFullYearFormat': false,
      'ReportDateFormat': 'MM/dd/yy HH:mm'
    },
    {
      'type': '0',
      'uimaskformat': '99/99/99 99:99 AA',
      //"bootstapformat": "MM/dd/yy hh:mm AM",
      'format': 'MM/dd/yy hh:mm a', //20. 12/13/16 5:12 AM
      'placeholder': 'MM/DD/YY HH:mm AM',
      'MySQLFormat': '%m/%d/%y %H:%m %p',
      'displayformat': '12/13/16 5:12 AM',
      'isDisplayFullYearFormat': false,
      'ReportDateFormat': 'MM/dd/yy hh:mm tt'
    }
    ],
    DateFormatArrayForPaymentReport:[{
      id: 'MM/dd/yyyy',
      value: 'MM/dd/yyyy'
    }, {
      id: 'dd/MM/yyyy',
      value: 'dd/MM/yyyy'
    }, {
      id: 'yyyy/MM/dd',
      value: 'yyyy/MM/dd'
    }, {
      id: 'dd.MM.yyyy',
      value: 'dd.MM.yyyy'
    }, {
      id: 'dd-MMM-yyyy',
      value: 'dd-MMM-yyyy'
    }, {
      id: 'yyyy-MM-dd',
      value: 'yyyy-MM-dd'
    }, {
      id: 'MM/dd/yy',
      value: 'MM/dd/yy'
    }, {
      id: 'MMM dd, yyyy',
      value: 'MMM dd, yyyy'
    }],
    FileTypeList: [{
      mimetype: 'application/pdf',
      extension: '.pdf',
      icon: '/assets/images/etc/pdf.png'
    }, {
      mimetype: 'application/msword',
      extension: '.doc',
      icon: '/assets/images/etc/doc.png'
    }, {
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: '.docx',
      icon: '/assets/images/etc/docx.png'
    }, {
      mimetype: 'application/vnd.ms-excel',
      extension: '.xls',
      icon: '/assets/images/etc/xls.png'
    }, {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: '.xlsx',
      icon: '/assets/images/etc/xlsx.png'
    }, {
      mimetype: 'image/gif',
      extension: '.gif',
      icon: '/assets/images/etc/image.png'
    }, {
      mimetype: 'image/jpeg',
      extension: '.jpg',
      icon: '/assets/images/etc/image.png'
    }, {
      mimetype: 'image/jpeg',
      extension: '.jpeg',
      icon: '/assets/images/etc/image.png'
    }, {
      mimetype: 'image/png',
      extension: '.png',
      icon: '/assets/images/etc/image.png'
    }, {
      mimetype: 'image/tiff',
      extension: '.tif',
      icon: '/assets/images/etc/image.png'
    }, {
      mimetype: 'image/tiff',
      extension: '.tiff',
      icon: '/assets/images/etc/image.png'
    }, {
      mimetype: 'text/plain',
      extension: '.txt',
      icon: '/assets/images/etc/txt.png'
    }, {
      mimetype: 'text/csv',
      extension: '.csv',
      icon: '/assets/images/etc/xls.png'
    }, {
      mimetype: 'video/mp4',
      extension: '.mp4',
      icon: '/assets/images/etc/mp3.png'
    }, {
      mimetype: 'video/webm',
      extension: '.webm',
      icon: '/assets/images/etc/mp3.png'
    }, {
      mimetype: 'audio/mp3',
      extension: '.mp3',
      icon: '/assets/images/etc/mp3audio.png'
    }, {
      mimetype: 'application/x-rar-compressed',
      extension: '.rar',
      icon: '/assets/images/etc/mp3audio.png'
    }, {
      mimetype: 'application/zip',
      extension: '.zip',
      icon: '/assets/images/etc/zipfile.png'
    }, {
      mimetype: 'audio/ogg',
      extension: '.ogg',
      icon: '/assets/images/etc/ogg.png'
    }, {
      mimetype: 'video/ogg',
      extension: '.ogv',
      icon: '/assets/images/etc/mp3.png'
    }
      //{
      //  mimetype: 'video/webm',
      //  extension: '.webm',
      //  icon: '/assets/images/etc/mp3.png'
      //}
    ],

    DocumentType: {
      Document: 'Documents',
      Image: 'Image',
      Video: 'Video',
      Audio: 'Audio'
    },
    DisplayStatus: {
      Draft: {
        ID: 0,
        Value: 'Draft',
        DisplayOrder: 1
      },
      Published: {
        ID: 1,
        Value: 'Published',
        DisplayOrder: 3
      },
      Completed: {
        ID: 2,
        Value: 'Completed',
        DisplayOrder: 4
      },
      //COR: {
      //    ID: 3,
      //    Value: 'COR',
      //    DisplayOrder: 5
      //},
      Void: {
        ID: 4,
        Value: 'Void',
        DisplayOrder: 6
      },
      DraftReview: {
        ID: 5,
        Value: 'Draft Under Review',
        DisplayOrder: 7
      }
    },
    RFQ_SETTING: {
      MountingType: 'Mounting Type',
      FunctionalType: 'Functional Type',
      ConnectorType: 'Connector Type',
      PartStatus: 'Part Status',
      RoHS: 'RoHS',
      UOM: 'UOM',
      MountingTypeAlias: 'Mounting Type Alias',
      FunctionalTypeAlias: 'Functional Type Alias',
      UnitAlias: 'Unit Alias',
      RoHSAlias: 'RoHS Alias',
      ConnectorTypeAlias: 'Connector Type Alias',
      CountryAlias: 'Country Alias',
      Country: 'Country',
      PackagingType: 'Packaging Type',
      PackageCaseType: 'Package Case Type'
    },

    PartStatus: [{
      Name: 'Active',
      ClassName: 'label-success',
      status: true
    },
    {
      Name: 'Inactive',
      ClassName: 'label-warning',
      status: false
    }],
    RohsStatus: [{
      ID: true,
      ClassName: 'label-success'
    },
    {
      ID: false,
      ClassName: 'label-warning'
    }],
    OpStatus: [{
      ID: 0,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary'
    },
    {
      ID: 2,
      Name: 'Disabled',
      DisplayOrder: 3,
      ClassName: 'label-danger'
    }],
    SoStatus: [{
      ID: 0,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary'
    }
    ],
    // Added propeties for radio button, label display, confirmation ask while changes
    RfqStatus: [{
      ID: 0,
      Name: 'Incomplete',
      value: false,
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Completed',
      value: true,
      DisplayOrder: 2,
      ClassName: 'label-success'
    }
    ],
    //radio button constant for operation
    OperationQtyTrackeing: {
      QtyTrackingRequired: true,
      QtyTrackingNotRequired: false
    },
    OPSTATUS: {
      DRAFT: 0,
      PUBLISHED: 1,
      TERMINATED: 2
    },
    InvoiceStatus: [{
      ID: 0,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Locked',
      DisplayOrder: 3,
      ClassName: 'label-primary'
    }],
    // Added propeties for radio button, label display, confirmation ask while changes
    WoStatus: [{
      ID: 0,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Published',
      DisplayOrder: 3,
      ClassName: 'label-primary'
    }, {
      ID: 2,
      Name: 'Completed',
      DisplayOrder: 7,
      ClassName: 'label-success'
    },
    {
      ID: 4,
      Name: 'Void',
      DisplayOrder: 9,
      ClassName: 'label-danger'
    }, {
      ID: 5,
      Name: 'Draft Under Review',
      DisplayOrder: 2,
      ClassName: 'light-blue-bg'
    },
    {
      ID: 6,
      Name: 'Under Termination',
      DisplayOrder: 5,
      ClassName: 'label-danger'
    },
    {
      ID: 7,
      Name: 'Terminated',
      DisplayOrder: 6,
      ClassName: 'label-danger'
    },
    {
      ID: 8,
      Name: 'Published Draft & Review',
      DisplayOrder: 4,
      ClassName: 'light-green-bg'
    },
    {
      ID: 9,
      Name: 'Completed With Missing Parts',
      DisplayOrder: 8,
      ClassName: 'label-primary'
    }],
    reportStatus: [{
      ID: 'D',
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 'P',
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary'
    }],
    SystemgeneratedStatus: [{
      ID: 0,
      Name: 'No',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Yes',
      DisplayOrder: 2,
      ClassName: 'label-success'
    }],
    BUTTON_CLASS: [
      {
        ClassName: 'light-blue-bg'
      },
      {
        ClassName: 'md-warn'
      },
      {
        ClassName: 'md-teal-300-bg'
      },
      {
        ClassName: 'md-green-300-bg'
      },
      {
        ClassName: 'md-orange-300-bg'
      },
      {
        ClassName: 'md-indigo-300-bg'
      }
    ],
    WOSTATUS: {
      DRAFT: 0,
      PUBLISHED: 1,
      COMPLETED: 2,
      VOID: 4,
      DRAFTREVIEW: 5,
      UNDER_TERMINATION: 6,
      TERMINATED: 7,
      PUBLISHED_DRAFT: 8,
      COMPLETED_WITH_MISSING_PARTS: 9
    },
    SupplierQuoteWorkingStatus: [
      {
        ID: 'D',
        Name: 'Draft',
        DisplayOrder: 1,
        ClassName: 'label-warning'
      }, {
        ID: 'P',
        Name: 'Published',
        DisplayOrder: 2,
        ClassName: 'label-primary'
      }],
    SOWorkingStatus: {
      InProgress: 'In Progress',
      Completed: 'Completed',
      Canceled: 'Canceled'
    },
    CostingType: [{
      Name: 'Material',
      ClassName: 'light-green-bg'
    }, {
      Name: 'Labor',
      ClassName: 'label-primary'
    }, {
      Name: 'Overhead',
      ClassName: 'label-warning'
    },
    {
      Name: 'NRE',
      ClassName: 'label-success'
    },
    {
      Name: 'Tooling',
      ClassName: 'light-blue-bg'
    },
    {
      Name: 'RE',
      ClassName: 'light-blue-600-bg'
    }, {
      Name: 'All',
      ClassName: 'light-pink-bg'
    }],
    Costing_Data_Type: [{
      ID: 1,
      Name: 'EA'
    },
    {
      ID: 2,
      Name: 'OTC'
    }],
    MasterTemplateDropdown: [
      {
        id: null, value: 'All'
      },
      { id: 'Yes', value: 'Yes' },
      {
        id: 'No', value: 'No'
      }],
    Audit_Filter: [
      { id: 1, value: 'All' },
      { id: 2, value: 'Mismatched' },
      { id: 3, value: 'Matched' }
    ],
    InovaxeSideDropdown: [
      {
        id: null, value: 'All'
      },
      { id: 'Left', value: 'Left' },
      {
        id: 'Right', value: 'Right'
      }],
    InovaxeStatus: [
      {
        id: null, value: 'All'
      },
      { id: 'Online', value: 'Online' },
      {
        id: 'Offline', value: 'Offline'
      }],

    InovaxeNotification: [
      {
        id: null, value: 'All'
      },
      { id: 'Inovaxe', value: 'Inovaxe' },
      {
        id: 'System', value: 'System'
      }],
    InovaxeMessageType: [
      {
        id: null, value: 'All'
      },
      { id: '101', value: '101' },
      { id: '102', value: '102' },
      { id: '103', value: '103' },
      { id: '104', value: '104' },
      { id: '108', value: '108' },
      { id: '110', value: '110' },
      { id: '114', value: '114' },
      { id: '116', value: '116' },
      { id: '117', value: '117' },
      {
        id: '501', value: '501'
      },
      { id: '502', value: '502' },
      { id: '1001', value: '1001' },
      { id: '1004', value: '1004' },
      { id: '1030', value: '1030' }
    ],
    InovaxeUnAuthorizeMessageType: [
      {
        id: null, value: 'All'
      },
      { id: '1001', value: '1001' },
      { id: '1004', value: '1004' }
    ],
    /* For binding in ui-grid header filter part of operation list*/
    OperationStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      { id: 'Published', value: 'Published' },
      { id: 'Disabled', value: 'Disabled' }
      // { ID: '2', Name: 'Completed' },
      //{ ID: '3', Name: 'COR' },
      //  { ID: '4', Name: 'Void' },
      //{ ID: '5', Name: 'Draft Under Review' }
    ],

    /* For binding in ui-grid header filter part of operation list*/
    WorkOrderStatusGridHeaderDropdown: [
      {
        id: null, Name: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      {
        id: 'Published', value: 'Published'
      },
      {
        id: 'Draft Under Review', value: 'Draft Under Review'
      },
      { id: 'Completed', value: 'Completed' },
      {
        id: 'Void', value: 'Void'
      },
      {
        id: 'Under Termination', value: 'Under Termination'
      },
      {
        id: 'Terminated', value: 'Terminated'
      },
      {
        id: 'Published Draft & Review', value: 'Published Draft & Review'
      },
      {
        id: 'Completed With Missing Parts', value: 'Completed With Missing Parts'
      }
      // { ID: '2', Name: 'Completed' },
      //{ ID: '3', Name: 'COR' },
      //  { ID: '4', Name: 'Void' },
      //{ ID: '5', Name: 'Draft Under Review' }
    ],
    /* for binding in ui-grid header filter Sample available in workorder list*/
    SampleStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Cluster applied in workorder list*/
    ClusterStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: '1', value: 'Yes'
      },
      { id: '0', value: 'No' }
    ],
    /* for binding in ui-grid header filter Cluster applied in workorder list*/
    HaltTypeGridHeaderDropdown: [
      { id: null, value: 'All' },
      {
        id: '0', value: 'Work Order'
      },
      {
        id: '1', value: 'Work Order Operation'
      },
      { id: 'KA', value: 'Kit Allocation' },
      { id: 'KR', value: 'Kit Release' },
      { id: 'PO', value: 'PO/SO' }
    ],

    /* for binding in ui-grid header filter for halt resume wo/op applied in list*/
    HaltResumeTypeValueGridHeaderDropdown: [
      { id: null, value: 'All' },
      {
        id: 'Work Order', value: 'Work Order'
      },
      {
        id: 'Work Order Operation', value: 'Work Order Operation'
      },
      { id: 'Kit Allocation', value: 'Kit Allocation' },
      { id: 'Kit Release', value: 'Kit Release' },
      { id: 'PO/SO', value: 'PO/SO' }
    ],

    /* for binding in ui-grid header filter cluster applied in hold resume history popup */
    HaltResumeTypeGridHeaderDropDown: [
      { id: null, value: 'All' },
      { id: 'KA', value: 'Kit Allocation' },
      { id: 'KR', value: 'Kit Release' },
      { id: 'PO', value: 'PO/SO' }
    ],
    /* for binding in ui-grid header filter Component Good/Bad Part*/
    GoodBadPartHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Component Custom Part*/
    CustomPartGridHeaderDropdown: [
      {
        id: undefined, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Component CPN*/
    CPNGridHeaderDropdown: [
      {
        id: undefined, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Hazmat Material*/
    HazmatMaterialGridHeaderDropdown: [
      {
        id: undefined, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Receive as a Bulk item*/
    ReceiveBulkItemGridHeaderDropdown: [
      {
        id: undefined, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    CustomPriceDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'true', value: 'Yes'
      },
      {
        id: 'false', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Lead free in workorder list*/
    HaltWorkorderGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      { id: 'Yes', value: 'Yes' },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Display % in quote dynamic fields list*/
    DisplayPercentageStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Display Margin in quote dynamic fields list*/
    DisplayMarginStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Display Reserved fields list*/
    UMIDReserved: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Display CPN fields list*/
    CPNDropDown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Display MFG Available fields list*/
    MFGAvailable: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    UMIDRestricted: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Display Margin in quote dynamic fields list*/
    CostingTypeStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Material', value: 'Material'
      },
      {
        id: 'Labor', value: 'Labor'
      },
      {
        id: 'Overhead', value: 'Overhead'
      },
      { id: 'NRE', value: 'NRE' },
      {
        id: 'Tooling', value: 'Tooling'
      }, {
        id: 'RE', value: 'RE'
      }
    ],
    /* for binding in ui-grid header filter Display Margin in quote dynamic fields list*/
    AffectTypeStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Material', value: 'Material' },
      { id: 'Labor', value: 'Labor' }
    ],
    /* For binding Bin Type in ui-grid header filter part */
    BinTypeStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Movable', value: 'Movable'
      },
      {
        id: 'Non-Movable', value: 'Non-Movable'
      }],

    /* For binding Bin Generate Type in ui-grid header filter part */
    BinGenerateTypeStatusGridHeaderDropdown: [{
      id: null,
      value: 'All'
    },
    {
      id: 'Random',
      value: 'Random'
    },
    {
      id: 'Sequence',
      value: 'Sequence'
    }
    ],
    /* for binding in ui-grid header filter keyword list*/
    KeywordStatusGridHeaderDropdown: [{
      id: null,
      value: 'All'
    },
    {
      id: 'Yes',
      value: 'Yes'
    },
    {
      id: 'No',
      value: 'No'
    }
    ],
    /* for binding in ui-grid header filter keyword list*/
    KeywordAssemblyLevelStatusGridHeaderDropdown: [{
      id: null,
      value: 'All'
    },
    {
      id: 'Assembly Level',
      value: 'Assembly Level'
    },
    {
      id: 'Line Level',
      value: 'Line Level'
    }
    ],
    /* for binding in ui-grid header filter keyword list*/
    KeywordAllowEngrStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      },
      {
        id: 'N/A (Not Applicable)', value: 'N/A (Not Applicable)'
      }
    ],
    /* For binding status in ui-grid header filter part */
    StatusOptionsGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Active', value: 'Active'
      },
      {
        id: 'Inactive', value: 'Inactive'
      }],
    /* For binding required management approval in ui-grid header filter */
    InvoiceRequireManagementApprovalGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }],
    /* For binding marked for refund in ui-grid header filter */
    InvoiceMarkedForRefundGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'N/A', value: 'N/A'
      },
      {
        id: 'Waiting for Refund', value: 'Waiting for Refund'
      },
      {
        id: 'Partially Refunded', value: 'Partially Refunded'
      },
      {
        id: 'Fully Refunded', value: 'Fully Refunded'
      }
    ],
    /* For binding confirmed zero invoice in ui-grid header filter */
    ConfirmedZeroInvoiceGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }],
    /* For bining verification in ui-grid header filter part */
    VerificationOptionsGridHeaderDropDown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }],
    /* For binding default template in ui-grid header */
    DefaultLabelTemplateOptionsGridHeaderDropDown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'B', value: 'Bin'
      },
      {
        id: 'R', value: 'Rack'
      },
      {
        id: 'U', value: 'UMID'
      },
      {
        id: 'W', value: 'Warehouse'
      },
      {
        id: 'SM', value: 'Search Material'
      }
    ],
    /* for binding in ui-grid header filter keyword list*/
    EOMGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Component Good/Bad Part*/
    AttributeTypeDropdown: [
      {
        fieldType: 'Bool'
      },
      {
        fieldType: 'Number'
      },
      {
        fieldType: 'Text'
      },
      {
        fieldType: 'Date'
      }
    ],
    AttributeBoolValueDropdown: [
      {
        defaultValue: 'Yes'
      },
      {
        defaultValue: 'No'
      }
    ],
    BarcodeCategoryDropdown: [
      { id: null, value: 'All' },
      { id: 'MFR PN', value: 'MFR PN' },
      { id: 'Packing Slip', value: 'Packing Slip' }
    ],
    /* for binding in ui-grid header filter Component Water Soluble*/
    WaterSolubleGridHeaderDropdown: [
      {
        id: undefined, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter Component No-Clean*/
    NoCleanGridHeaderDropdown: [
      {
        id: undefined, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    /* For binding Contact Person in ui-grid header filter */
    ContactPersonGridHeaderDropdown: [{
      id: null, value: 'All', labelClass: null
    },
    {
      id: 'Personnel', value: 'Personnel', labelClass: 'label-primary'
    },
    {
      id: 'Supplier', value: 'Supplier', labelClass: 'label-warning'
    },
    {
      id: 'Customer/Manufacturer', value: 'Customer/Manufacturer', labelClass: 'label-success'
    }],
    BarcodeCategory: {
      MFRPN: 'M',
      PackingSlip: 'P'
    },
    UMIDStockType: {
      All: { key: 'All', value: 'All' },
      CustomerConsignedStock: { key: 'Yes', value: 'Customer Consigned Stock' },
      InternalStock: { key: 'No', value: 'Internal Stock' }
    },
    PartMasterAdvancedFilters: {
      HeaderSearch: { value: 'Header Search', isDeleted: true },
      Manufacturer: { value: 'Manufacturer', isDeleted: true },
      ManufacturerForSupplierParts: { value: 'Manufacturer', isDeleted: true },
      PartStatus: { value: 'Part Status', isDeleted: true },
      Packaging: { value: 'Packaging', isDeleted: true },
      FunctionalType: { value: 'Functional Type', isDeleted: true },
      ExternalFunctionalType: { value: 'External Functional Type', isDeleted: true },
      PackageCaseType: { value: 'Package/Case(Shape) Type', isDeleted: true },
      PartGroups: { value: 'Part Groups', isDeleted: true },
      MountingType: { value: 'Mounting Type', isDeleted: true },
      ExternalMountingType: { value: 'External Mounting Type', isDeleted: true },
      RoHS: { value: 'RoHS', isDeleted: true },
      ExternalRoHS: { value: 'External RoHS', isDeleted: true },
      PartType: { value: 'Part Type', isDeleted: true },
      AssemblyType: { value: 'Assembly Type', isDeleted: true },
      Standards: { value: 'Standards', isDeleted: true },
      AcceptableShippingCountry: { value: 'Acceptable Shipping Countries', isDeleted: true },
      OperationalAttributes: { value: 'Operational Attributes', isDeleted: true },
      DisapprovedSuppliers: { value: 'Disapproved Suppliers', isDeleted: true },
      DateFilters: { value: 'Date Filters', isDeleted: true },
      Assemblies: { value: 'BOM Parts', isDeleted: true },
      ReversalParts: { value: 'Reversal Parts Only', isDeleted: true },
      CPNParts: { value: 'CPN Parts Only', isDeleted: true },
      CustomParts: { value: 'Custom Parts Only', isDeleted: true },
      AssemblieswithActivityStarted: { value: 'Assemblies with Activity Started', isDeleted: true },
      ExportControlled: { value: 'Export Controlled', isDeleted: true },
      OperatingTemperatureBlank: { value: 'Operating Temperature is Blank (Internal)', isDeleted: true },
      IdenticalMfrPN: { value: 'Identical {0}', isDeleted: true, helptext: 'Filter all those part which have same {0} but {1} is different.' },
      ProductionPNEmpty: { value: 'Production PN is Blank', isDeleted: true, helptext: 'Filter all those part which have PRODUCTION PN is Blank.' },
      CreatedOn: { value: 'Created On', isDeleted: true },
      ExcludeIncorrectPart: { value: 'Exclude Incorrect Parts', isDeleted: true },
      PartRestrictionSetting: { value: 'Part Restriction Filter', isDeleted: true }
    },
    SupplierInvoiceAdvanceFilters: {
      Supplier: { value: 'Suppliers', isDeleted: true },
      PaymentMethod: { value: 'Payment Methods', isDeleted: true },
      PaymentTerms: { value: 'Supplier PMT Terms', isDeleted: true },
      InvPaymentTerms: { value: 'INV PMT Terms', isDeleted: true },
      SupplierInvoiceStatus: { value: 'Supplier Invoice Status', isDeleted: true },
      LockStatus: { value: 'Lock Status', isDeleted: true },
      ConfirmedZeroValueInvoicesOnly: { value: 'Confirmed Zero Value Invoices Only', isDeleted: true },
      SupplierMarkedForRefundStatus: { value: 'Marked for Refund Status', isDeleted: true },
      DueDateFilter: { value: 'Due Date', isDeleted: true },
      PurchaseSalesPackingSlipInvoiceNumber: { value: 'PO# / SO# / Packing Slip# / Invoice#', isDeleted: true },
      Search_Invoice_Comments: { value: 'Search Comments', isDeleted: true },
      MFRPN: { value: 'MPN', isDeleted: true },
      PODate: { value: 'PO / RMA Date', isDeleted: true },
      MaterialReceiptDate: { value: 'Material Receipt Date', isDeleted: true },
      PackingSlipDate: { value: 'Packing Slip Date', isDeleted: true },
      InvoiceDate: { value: 'Invoice Date', isDeleted: true },
      CreditMemoDate: { value: 'Credit Memo Date', isDeleted: true },
      DebitMemoDate: { value: 'Debit Memo Date', isDeleted: true },
      PaidPaymentOrCheckNumber: { value: 'Search Paid Payment# or Check#', isDeleted: true },
      PaidAmount: { value: 'Paid Amount ($)', isDeleted: true },
      ExtendedAmount: { value: 'Extended Amount ($)', isDeleted: true }
    },
    SupplierInvoicePaymentAdvanceFilters: {
      Supplier: { value: 'Suppliers', isDeleted: true },
      PaymentMethod: { value: 'Payment Methods', isDeleted: true },
      BankAccountCode: { value: 'Bank Account Codes', isDeleted: true },
      TransactionMode: { value: 'Transaction Modes', isDeleted: true },
      LockStatus: { value: 'Lock Status', isDeleted: true },
      PaymentOrCheckNumber: { value: 'Payment# or Check#', isDeleted: true },
      PaymentAmount: { value: 'Payment Amount ($)', isDeleted: true },
      RefundAmount: { value: 'Refund Amount ($)', isDeleted: true },
      InvoiceAmount: { value: 'Extended INV/CM/DM Amount ($)', isDeleted: true },
      PaymentDate: { value: 'Payment Date', isDeleted: true },
      PackingSlipDate: { value: 'Packing Slip Date', isDeleted: true },
      MaterialReceiptDate: { value: 'Material Receipt Date', isDeleted: true },
      RefundDate: { value: 'Refund Date', isDeleted: true },
      PODate: { value: 'PO Date', isDeleted: true },
      InvoiceDate: { value: 'Invoice Date', isDeleted: true },
      SearchComments: { value: 'Search Comments', isDeleted: true },
      InvoiceNumber: { value: 'Invoice#', isDeleted: true },
      CMDMNumber: { value: 'Credit Memo# or Debit Memo#', isDeleted: true }
    },
    PackingSlipAdvanceFilters: {
      Supplier: { value: 'Suppliers', isDeleted: true },
      PackingSlipStatus: { value: 'Packing Slip Status', isDeleted: true },
      ReceivedStatus: { value: 'Received Status', isDeleted: true },
      LockStatus: { value: 'Lock Status', isDeleted: true },
      PostingStatus: { value: 'Packing Slip Posting Status', isDeleted: true },
      Search_PO_SO_Packingslip_InvoiceNo: { value: 'Search PO# / SO# / Packing Slip# / Invoice#', isDeleted: true },
      MFRPN: { value: 'MPN', isDeleted: true },
      PaymentOrCheck: { value: 'Search Paid Payment# or Check#', isDeleted: true },
      Search_PS_Comments: { value: 'Search Comments', isDeleted: true },
      PackingSlipDate: { value: 'Packing Slip Date', isDeleted: true },
      MaterialReceiptDate: { value: 'Material Receipt Date', isDeleted: true },
      PODate: { value: 'PO Date', isDeleted: true }
    },
    SupplierRMAAdvanceFilters: {
      Supplier: { value: 'Suppliers', isDeleted: true },
      SupplierRMAStatus: { value: 'Supplier RMA/CM Status', isDeleted: true },
      LockStatus: { value: 'Lock Status', isDeleted: true },
      PostingStatus: { value: 'RMA & RMA Packing Slip Posting Status', isDeleted: true },
      Search_RMA_Packingslip_CreditMemoNo: { value: 'Search RMA# / Packing Slip# / Credit Memo#', isDeleted: true },
      MFRPN: { value: 'MPN', isDeleted: true },
      RMADate: { value: 'RMA Date', isDeleted: true },
      SearchComments: { value: 'Search Comments', isDeleted: true }
    },
    FEEDER_PLACEMENT_TYPE: [{ value: 'All', id: null }, { value: 'By Machine', id: 'By Machine' }, { value: 'By Hand', id: 'By Hand' }],
    /* For binding status in ui-grid header filter part */
    BOM_SUB_MENU_OPTION: {
      search_google: { value: 'search_google', name: 'Search Google' },
      search_dk: { value: 'search_dk', name: 'Search Digi-Key' },
      search_fc: { value: 'search_fc', name: 'Search Findchips' },
      search_part: { value: 'search_part', name: 'Search Part' },
      searchmfg: { value: 'searchmfg', name: 'Update MFR' },
      searchdisty: { value: 'searchdisty', name: 'Update Supplier' },
      search: { value: 'search', name: 'Update Part' },
      update_part_attribute: { value: 'update_part_attribute', name: 'Update Part Attribute' },
      search_cpn: { value: 'search_cpn', name: 'Search CPN in Customer CPN List' },
      show_data_sheet: { value: 'show_data_sheet', name: 'Show Data Sheet' },
      additional_comment: { value: 'additional_comment', name: 'Additional Comments' },
      show_issue: { value: 'show_issue', name: 'Show Issues' },
      add_mfg: { value: 'add_mfg', name: 'Add MFR' },
      add_dist: { value: 'add_dist', name: 'Add Supplier' },
      row_above: { value: 'row_above', name: 'Insert Item Above' },
      row_below: { value: 'row_below', name: 'Insert Item Below' },
      row_lineitem_above: { value: 'row_lineitem_above', name: 'Insert Alternate Part Above' },
      row_lineitem_below: { value: 'row_lineitem_below', name: 'Insert Alternate Part Below' },
      enable_cust_line: { value: 'enable_cust_line', name: 'Enable to Edit Customer BOM Line Number' },
      suggest_alternate_parts: { value: 'suggest_alternate_parts', name: '<div class="cm-feture-btn-color">Suggest Alternate Parts (Feature Base)</div>' },
      suggest_rohs_replacement_parts: { value: 'suggest_rohs_replacement_parts', name: '<div class="cm-feture-btn-color">Suggest RoHS Replacement Parts (Feature Base)</div>' },
      suggest_good_parts: { value: 'suggest_good_parts', name: 'Add Correct Part as a Alternate' },
      add_cpn_mapping: { value: 'add_cpn_mapping', name: 'Map this MPN to CPN' },
      part_program_mapping: { value: 'part_program_mapping', name: 'Part Program Mapping' },
      suggest_epoxy_parts: { value: 'suggest_epoxy_parts', name: 'Suggest Process Material (Epoxy)' },
      suggest_packaging_alias: { value: 'suggest_packaging_alias', name: 'Suggest Packaging Alias' },
      unlock_part: { value: 'unlock_part', name: 'Unlock to Enable Edit' },
      lock_part: { value: 'lock_part', name: 'Lock to Disable Edit' },
      approve_mounting_part: { value: 'approve_mounting_part', name: 'Set as Approved Mounting Type & Functional Type' },
      unapprove_mounting_part: { value: 'unapprove_mounting_part', name: 'Set as Disapproved Mounting Type & Functional Type' },
      approve_part: { value: 'approve_part', name: 'Lock as Engineering Approved Part' },
      unapprove_part: { value: 'unapprove_part', name: 'Set as Engineering Disapproved Part' },
      restrict_cpn_use_in_BOM: { value: 'search', name: 'Restrict CPN (Component) Use in BOM' },
      Unrestrict_cpn_use_in_BOM: { value: 'Unrestrict_cpn_use_in_BOM', name: 'Unrestrict CPN (Component) Use in BOM' },
      restrict_use_in_BOM: { value: 'restrict_use_in_BOM', name: 'Restrict Use in BOM' },
      unrestrict_use_in_BOM: { value: 'unrestrict_use_in_BOM', name: 'Unrestrict Use in BOM' },
      restrict_use_in_BOM_with_permission: { value: 'restrict_use_in_BOM_with_permission', name: 'Restrict Use in BOM With Permission' },
      unrestrict_use_in_BOM_with_permission: { value: 'unrestrict_use_in_BOM_with_permission', name: 'Unrestrict Use in BOM With Permission' },
      restrict_part_excluding_alias_use_in_BOM: { value: 'restrict_part_excluding_alias_use_in_BOM', name: 'Restrict Use Excluding Packaging Alias in BOM Permanently' },
      unrestrict_part_excluding_alias_use_in_BOM: { value: 'unrestrict_part_excluding_alias_use_in_BOM', name: 'Unrestrict Use Excluding Packaging Alias in BOM Permanently' },
      restrict_part_excluding_alias_use_in_BOM_with_permission: { value: 'restrict_part_excluding_alias_use_in_BOM_with_permission', name: 'Restrict Use Excluding Packaging Alias in BOM With Permission' },
      unrestrict_part_excluding_alias_use_in_BOM_with_permission: { value: 'unrestrict_part_excluding_alias_use_in_BOM_with_permission', name: 'Unrestrict Use Excluding Packaging Alias in BOM With Permission' },
      ca_cpn: { value: 'ca_cpn', name: 'Set Customer Approval for CPN (Component)' },
      cust_unapproved_cpn: { value: 'cust_unapproved_cpn', name: 'Set Customer Disapproved for CPN (Component)' },
      ca_qparefdes: { value: 'ca_qparefdes', name: 'Set Customer Approval for QPA vs RefDes' },
      oddly_named_refdes: { value: 'oddly_named_refdes', name: 'Oddly Named RefDes' },
      ca_dnp_qparefdes: { value: 'ca_dnp_qparefdes', name: 'Set Customer Approval for DNP Qty vs DNP RefDes' },
      ca_buy: { value: 'ca_buy', name: 'Set Customer Approval for Buy' },
      ca_dnp_buy: { value: 'ca_dnp_buy', name: 'Set Customer Approval for Buy DNP Qty' },
      ca_populate: { value: 'ca_populate', name: 'Set Customer Approval for Populate' },
      empty_menu: { value: 'empty_menu', name: '<div class=\'menu-tecture\'></div>' },
      remove_row: { value: 'remove_row', name: 'Remove Selected Row(s)' },
      add_mfr: { value: 'add_mfr', name: 'Add MFR' },
      add_correct_part: { value: 'add_correct_part', name: 'Add Correct Part' },
      add_incorrect_part: { value: 'add_incorrect_part', name: '<div class=\'cm-feture-btn-color\'>Add as Incorrect Part (Feature Base)</div>' },
      add_tbd_part: { value: 'add_tbd_part', name: 'Add as TBD Type Part' },
      add_dist1: { value: 'add_dist:1', name: 'Add Supplier' },
      add_dist3: { value: 'add_dist:3', name: 'Add Supplier PN' },
      add_dist4: { value: 'add_dist:4', name: '<div class=\'cm-feture-btn-color\'>Add as Incorrect Supplier PN (Feature Base)</div>' },
      add_dist5: { value: 'add_dist:5', name: 'Add as TBD Type Supplier PN' }
      //remove_all_row: { value: 'remove_all_row', name: 'Remove Selected Rows' }
    },
    ScanStatusOptionsGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Verified', value: 'Verified'
      },
      {
        id: 'Pending', value: 'Pending'
      }],
    /* For binding status in ui-grid header filter part */
    PaymentModeOptionDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Exempt', value: 'Exempt'
      },
      { id: 'Non-Exempt', value: 'Non-Exempt' }],

    /* For binding status in ui-grid header filter generic category */
    StatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      {
        id: 'Enable', value: 'Enable'
      },
      {
        id: 'Disable', value: 'Disable'
      }],
    /* For binding CountTypeEach in ui-grid header filter mounting type*/
    CountTypeEachGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }],

    /* For binding Temperature Sensitive in ui-grid header filter functional type*/
    TemperatureSensitiveGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }],

    /* For binding status in ui-grid header filter part (ECO Request) */
    ECORequestStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Active', value: 'Active'
      },
      {
        id: 'Inactive', value: 'Inactive'
      }],

    /* For binding status in ui-grid header filter part  */
    CertificateStandardRequiredStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Required', value: 'Required'
      },
      {
        id: 'Optional', value: 'Optional'
      }
    ],

    /* For binding status in ui-grid header filter part  */
    CertificateStandardCertifiedStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Certified', value: 'Certified'
      },
      {
        id: 'Compliant', value: 'Compliant'
      }],

    /* For binding final status in ui-grid header filter part (ECO Request) */
    ECORequestFinalStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Resolution Pending', value: 'Resolution Pending'
      },
      {
        id: 'Resolution Accepted', value: 'Resolution Accepted'
      },
      {
        id: 'Rejected', value: 'Rejected'
      }],
    /* For binding final status in ui-grid header filter part (DFM Request) */
    DFMRequestFinalStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Resolution Pending', value: 'Resolution Pending'
      },
      {
        id: 'Resolution Accepted', value: 'Resolution Accepted'
      },
      {
        id: 'Rejected', value: 'Rejected'
      }],

    WoOpFirstArticleStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Pass', value: 'Pass'
      },
      {
        id: 'Needs Improvement', value: 'Needs Improvement'
      },
      {
        id: 'WIP', value: 'WIP'
      }
    ],
    MFGTypeDropdown: [
      {
        Key: 'MFG', Value: 'MFG'
      },
      {
        Key: 'DIST', Value: 'DIST'
      }
    ],
    LogicCategoryDropdown: [
      { id: 1, value: 'QPA/Designator' },
      { id: 2, value: 'MFR Invalid' },
      { id: 3, value: 'MFR Verification' },
      { id: 4, value: 'Supplier Verification' },
      { id: 5, value: 'Invalid MFR-Supplier Mapping' },
      { id: 6, value: 'Get MFRPN' },
      { id: 7, value: 'MFR Bad Part' },
      { id: 8, value: 'Check Obsolete Parts' },
      { id: 9, value: 'MFR PN Invalid' },
      { id: 10, value: 'Supplier Invalid' },
      { id: 11, value: 'Supplier PN Invalid' },
      { id: 12, value: 'Customer Approval' },
      { id: 13, value: 'Supplier Bad Part' },
      { id: 14, value: 'Line Merge' },
      { id: 15, value: 'RoHS Status' },
      { id: 16, value: 'Epoxy' },
      { id: 17, value: 'Duplicate RefDes' },
      { id: 18, value: 'Invalid RefDes' },
      { id: 20, value: 'Pin Mismatch' },
      { id: 21, value: 'Duplicate MFR PN' },
      { id: 22, value: 'Require Mating Part' },
      { id: 23, value: 'Require Drive Tools Part' },
      { id: 24, value: 'Require Pickup Part' },
      { id: 25, value: 'Restrict Use With Permission' },
      { id: 26, value: 'Restrict Use Permanently' },
      { id: 27, value: 'Mismatch Mounting Type' },
      { id: 28, value: 'Mismatch Functional Type' },
      { id: 29, value: 'Mismatch Pitch' },
      { id: 30, value: 'Mismatch Tolerance' },
      { id: 31, value: 'Mismatch Voltage' },
      { id: 32, value: 'Mismatch Package' },
      { id: 33, value: 'Mismatch Value' },
      { id: 34, value: 'Duplicate CPN (Component) with Rev' },
      { id: 35, value: 'Require Functional Testing Part' },
      { id: 36, value: 'Require Mounting Type' },
      { id: 37, value: 'Require Functional Type' },
      { id: 39, value: 'UOM Mismatched' },
      { id: 40, value: 'Programming Is Not Included' },
      { id: 41, value: 'Mismatch Color' },
      { id: 42, value: 'Mismatch Temperature' },
      { id: 43, value: 'Mismatch Power' },
      { id: 50, value: 'Restrict Use in BOM' },
      { id: 51, value: 'Customer Approval For QPA or RefDes' },
      { id: 52, value: 'Customer Approval For Buy' },
      { id: 53, value: 'Customer Approval For Populate' },
      { id: 54, value: 'Mismatch Number Of Rows' },
      { id: 55, value: 'Part pin is less then BOM pin' },
      { id: 56, value: 'TBD Part' },
      { id: 57, value: 'Restrict CPN (Component) Use With Permission' },
      { id: 58, value: 'Restrict CPN (Component) Use Permanently' },
      { id: 59, value: 'Restrict CPN (Component) Use in BOM' },
      { id: 60, value: 'Export Controlled' },
      { id: 61, value: 'Restrict Use in BOM With Permission' },
      { id: 62, value: 'TBD Type Part' },
      { id: 63, value: 'Default Invalid MFR' },
      { id: 64, value: 'Restrict Use In BOM Excluding Packaging Alias (With Permission)' },
      { id: 65, value: 'Restrict Use In BOM Excluding Packaging Alias (Permanently)' },
      { id: 66, value: 'Restrict Use Excluding Packaging Alias (Permanently)' },
      { id: 67, value: 'Restrict Use Excluding Packaging Alias (With Permission)' },
      { id: 68, value: 'DNP Qty vs RefDes' },
      { id: 69, value: 'Customer Approval For DNP QPA or RefDes' },
      { id: 70, value: 'Customer Approval For Buy DNP Qty' },
      { id: 71, value: 'Invalid DNP RefDes' },
      { id: 72, value: 'Suggested Good Part' },
      { id: 73, value: 'Suggested Good Supplier Part' },
      { id: 74, value: 'Mismatch Required Programming' },
      { id: 75, value: 'Mismatch Custom Part' },
      { id: 76, value: 'Map Part Program RefDes' },
      { id: 77, value: 'Suggested MFR Mapping' },
      { id: 78, value: 'Suggested Alternate Part' },
      { id: 79, value: 'Suggested Packaging Part' },
      { id: 80, value: 'Suggested Process Material Part' },
      { id: 81, value: 'Suggested RoHS Replacement Part' },
      { id: 82, value: 'Mismatch Line and Part Programming' },
      { id: 83, value: 'QPA RefDes Change' },
      { id: 84, value: 'DNP QPA RefDes Change' },
      { id: 85, value: 'MPN not Mapped in CPN' },
      { id: 86, value: 'Mismatch Custom Part Rev' },
      { id: 87, value: 'Mismatch CPN and Custom Part Rev' }
    ],
    PartSuggestType: {
      default: {
        id: 0,
        value: 'default'
      },
      suggestedMFRMapping: {
        id: 1,
        value: 'SuggestedMFRMapping'
      },
      suggestedAlternatePart: {
        id: 2,
        value: 'suggestedAlternatePart'
      },
      suggestedPackagingPart: {
        id: 3,
        value: 'suggestedPackagingPart'
      },
      suggestedProcessMaterialPart: {
        id: 4,
        value: 'suggestedProcessMaterialPart'
      },
      suggestedRoHSReplacementPart: {
        id: 5,
        value: 'suggestedRoHSReplacementPart'
      }
    },
    errorCodeLogicIDs: {
      OBS: 8
    },
    ProgramingStatusDropdown: [
      { id: 0, value: 'N/A' },
      { id: 5, value: 'Who Will Program' },
      { id: 3, value: 'Cust Will Program' },
      { id: 4, value: 'Pre-Programmed' },
      { id: 1, value: 'Pre-Assy' },
      { id: 2, value: 'Post-Assy' }
    ],
    BuyDNPQTYDropdown: [
      { id: 'N', value: 'NO' },
      { id: 'Y', value: 'YES' },
      { id: 'C', value: 'Customer Consigned' },
      { id: 'P', value: 'YES PRE-ASSY PROGRAM' }
    ],
    SubstitutesAllowDropdown: [
      {
        id: 1, value: ''
      },
      {
        id: 2, value: 'No'
      },
      {
        id: 3, value: 'Yes with Customer Approval', alias: [
          { alias: 'Yes' }
        ]
      }
    ],
    TBDMFGAndMFGPN: ['TO BE DETERMINED', 'TBD', 'Any', 'ANY', 'NOT-A-COMPONENT'],
    NOT_A_COMPONENT: 'NOT-A-COMPONENT',
    TO_BE_DETERMINED: 'To Be Determined',
    TBD_MFR_CODE: 'TBD',
    BusinessRisk: {
      Critical: 'Critical',
      High: 'High',
      Medium: 'Medium',
      Low: 'Low'
    },
    ComponentAdvancePartNoFilterTypeDropDown: [
      { id: 'C', value: 'Contains' },
      { id: 'E', value: 'Exact' }
    ],
    SerialNumberGenerateLevel: [
      { id: 1, value: 'Nickname' },
      { id: 2, value: 'Assembly' }
    ],
    AssyDateCodeFormats: [
      'YYWW',
      'WWYY'
    ],
    RoHSDeviation: [
      { id: -1, name: 'None', isDeleted: false },
      { id: -2, name: 'Allowed w/ Engr. Approval', isDeleted: false },
      { id: -3, name: 'Allowed w/o Engr. Approval', isDeleted: false }
    ],
    RoHSDeviationDet: {
      No: -1,
      WithApproval: -2,
      Yes: -3
    },
    PartCategory: {
      PCB: 1,
      Component: 2,
      SubAssembly: 3
    },
    PartType: {
      Component: 2,
      SubAssembly: 3,
      Other: 4
    },
    PackagingAliasFilter: [
      {
        Key: 'All', Value: undefined
      },
      {
        Key: 'With Packaging Alias', Value: 1
      },
      {
        Key: 'Without Packaging Alias', Value: 2
      }
    ],
    AlternatePartFilter: [
      {
        Key: 'All', Value: undefined
      },
      {
        Key: 'With Alternate Part', Value: 1
      },
      {
        Key: 'Without Alternate Part', Value: 2
      }
    ],
    RoHSAlternatePartFilter: [
      {
        Key: 'All', Value: undefined
      },
      {
        Key: 'With RoHS Replacement Part', Value: 1
      },
      {
        Key: 'Without RoHS Replacement Part', Value: 2
      }
    ],
    PartUsedInAssemblyFilter: [
      {
        Key: 'All', Value: undefined
      },
      {
        Key: 'Used in Active Assembly', Value: 1
      },
      {
        Key: 'Not Used in Active Assembly', Value: 2
      }
    ],
    PartCategoryName: {
      Assembly: 'Assembly',
      Component: 'Component'
    },
    PartStatusDropdown: [
      {
        Key: '1', Value: 'Active'
      },
      {
        Key: '2', Value: 'Inactive'
      },
      {
        Key: '3', Value: 'Obsolete'
      },
      { Key: '4', Value: 'Going Obsolete' },
      {
        Key: '5', Value: 'EOL'
      }
    ],
    ComponentListOrder: [
      { key: undefined, value: 'Select' },
      { key: 'MFG', value: 'MFR Code' },
      { key: 'MFGPN', value: 'MFR PN' },
      { key: 'USAGE', value: 'Usage' },
      { key: 'STOCK', value: 'Stock' }
    ],
    ComponentUsageCriteria: [
      { key: 'CURRENT_MONTH', value: 'Current Month' },
      { key: 'CURRENT_QUARTER', value: 'Current Quarter' },
      { key: 'CURRENT_YEAR', value: 'Current Year' },
      { key: 'LAST_MONTH', value: 'Last Month' },
      { key: 'LAST_QUARTER', value: 'Last Quarter' },
      { key: 'LAST_YEAR', value: 'Last Year' },
      { key: 'TTM', value: 'TTM' },
      { key: 'LIFE_TIME', value: 'Life Time' }
    ],
    matchCriteriaOptionsDropdown: [
      {
        id: '==', value: 'Equal to'
      },
      {
        id: '!==', value: 'Not equal to'
      },
      {
        id: '>=', value: 'Greater than or equal to'
      },
      {
        id: '<=', value: 'Less than or equal to'
      }
    ],
    matchCriteriaOptionsForStringFieldDropdown: [
      {
        id: '==', value: 'Equal to'
      },
      {
        id: '!==', value: 'Not equal to'
      }
    ],
    validationTypeOptionsDropdown: [
      {
        id: 1, value: 'Alternate Part'
      },
      {
        id: 2, value: 'Packaging Alias'
      },
      {
        id: 3, value: 'RoHS Alternate Part'
      }
    ],

    fieldDataTypeOptionsDropdown: [
      {
        id: 'number', value: 'Number'
      },
      {
        id: 'string', value: 'Alphanumeric'
      }
    ],
    titleOptionsDropdown: [
      {
        id: 'weight', value: 'Weight'
      },
      {
        id: 'voltage', value: 'Voltage'
      },
      {
        id: 'value', value: 'Value'
      },
      {
        id: 'tolerance', value: 'Tolerance'
      },
      {
        id: 'powerRating', value: 'Power'
      },
      {
        id: 'partPackage', value: 'Package/ Case (Shape)'
      },
      {
        id: 'mountingTypeID', value: 'Mounting Type'
      },
      {
        id: 'minOperatingTemp', value: 'Min Operating Temperature'
      },
      {
        id: 'maxOperatingTemp', value: 'Max Operating Temperature'
      },
      {
        id: 'functionalCategoryID', value: 'Functional Type'
      },
      {
        id: 'feature', value: 'Feature'
      },
      {
        id: 'color', value: 'Color'
      }
    ],
    PartExternalValuesDropdown: [
      {
        Key: undefined, Value: 'Select'
      },
      {
        Key: 'connectertype', Value: 'Connector Type'
      },
      {
        Key: 'functionaltype', Value: 'Functional Type'
      },
      {
        Key: 'mountingtype', Value: 'Mounting Type'
      },
      {
        Key: 'operatingtemperature', Value: 'Operating Temperature'
      },
      {
        Key: 'partstatus', Value: 'Part Status'
      },
      {
        Key: 'rohsstatus', Value: 'RoHS Status'
      },
      {
        Key: 'unit', Value: 'UOM'
      }
    ],

    EmailReportScheduleType: [
      {
        Name: 'Daily', id: 1
      },
      {
        Name: 'Weekly', id: 2
      },
      {
        Name: 'Monthly', id: 3
      },
      {
        Name: 'Semi Annually', id: 4
      },
      {
        Name: 'Quarterly', id: 5
      },
      {
        Name: 'Annually', id: 6
      }],

    ComponentAlternatePartType: {
      AlternatePart: 1,
      PickupPadRequired: 2,
      ProgrammingRequired: 3,
      FunctionaTestingRequired: 4,
      MatingPartRequired: 5,
      RoHSReplacementPart: 6
    },
    ComponentValidationPartType: {
      AlternatePart: 1,
      PackagingAlias: 2,
      RohsAlternatePart: 3
    },
    RequirmentType: [
      {
        id: 'R', value: 'Requirement'
      },
      {
        id: 'C', value: 'Comment'
      }
    ],
    RequirmentCategory: {
      PurchasingAndIncomingInspectionComments:
      {
        id: 'P', value: 'Purchasing & Incoming Inspection Requirements/Comments', broadCastValue: 'PurchasingIncomingInspectionComments'
      },
      ManufacturingAndProductionComments:
      {
        id: 'M', value: 'Manufacturing (Production) Requirements/Comments', broadCastValue: 'ManufacturingProductionComments'
      },
      ShippingComments:
      {
        id: 'S', value: 'Shipping Requirements/Comments', broadCastValue: 'ShippingComments'
      },
      PartsComments:
      {
        id: 'C', value: 'Part Comments (Internal Notes)', broadCastValue: 'PartComments'
      }
    },
    //ComponentStandardClassCommonDropdown: [
    //  { id: null, value: 'All' },
    //  { id: 'YES', value: 'YES' },
    //  { id: 'NO', value: 'NO' },
    //],
    AgreementTemplateStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      { id: 'Published', value: 'Published' }
    ],
    ReportStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      { id: 'Published', value: 'Published' }
    ],
    systemGeneratedGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      { id: 'No', value: 'No' }
    ],
    PartStatusCommonDropdown: [
      { id: null, value: 'All' },
      {
        id: 'Active', value: 'Active'
      },
      {
        id: 'Inactive', value: 'Inactive'
      }
    ],
    SalesOrderStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      { id: 'Published', value: 'Published' }
    ],
    InvoiceStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      { id: 'Locked', value: 'Locked' }
    ],
    SalesOrderCompleteStatusGridHeaderDropdown: [
      {
        id: '', value: 'All'
      },
      {
        id: 'In Progress', value: 'In Progress'
      },
      {
        id: 'Completed', value: 'Completed'
      },
      { id: 'Cancel', value: 'Canceled' }
    ],
    PurchaseOrderCompleteStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'In Progress', value: 'In Progress', class: 'label-box label-warning'
      },
      {
        id: 'Completed', value: 'Completed', class: 'label-box label-success'
      },
      { id: 'Canceled', value: 'Canceled', class: 'label-box label-danger' }
    ],
    PendingWOStatusGridHeaderDropdown: [
      {
        id: '', value: 'All'
      },
      {
        id: 'In Progress', value: 'In Progress'
      },
      {
        id: 'Completed', value: 'Completed'
      }
    ],
    IsRepeatGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      { id: 'Repeat', value: 'Repeat' },
      {
        id: 'One Time', value: 'One Time'
      }
    ],
    RFQStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      { id: 'In Progress', value: 'In Progress' },
      {
        id: 'Follow up Submitted RFQ', value: 'Follow up Submitted RFQ'
      },
      {
        id: 'Won', value: 'Won'
      },
      {
        id: 'Lost', value: 'Lost'
      },
      {
        id: 'Canceled', value: 'Canceled'
      }
    ],
    RFQQuoteProgressGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Pending', value: 'Pending'
      },
      { id: 'Re-Quote', value: 'Re-Quote' },
      { id: 'Submitted', value: 'Submitted' },
      {
        id: 'Completed', value: 'Completed'
      }
    ],
    RequitementCategory: [
      {
        id: 1, value: 'Customer Quote Requirement'
      },
      {
        id: 2, value: 'Assembly Requirement'
      },
      {
        id: 3, value: 'Narrative Master'
      }
    ],
    RequitementTeUniqueMSG: {
      CUSTOMER_QUOTE_TEMPLATE: 'Customer Quote Requirement Template name',
      ASSEMBLY_QUOTE_TEMPLATE: 'Assembly Requirement Template name',
      NARRATIVE_MASTER_TEMPLATE: 'Narrative Master Template name'
    },
    RequitementCategoryDropdown: [
      { id: null, value: 'All' },
      { id: 'Customer Quote Requirement', value: 'Customer Quote Requirement' },
      { id: 'Assembly Requirement', value: 'Assembly Requirement' },
      { id: 'Narrative Master', value: 'Narrative Master' }
    ],
    CategoryTypeLabel: [
      { id: 1, value: 'ECO/DFM' },
      { id: 2, value: 'Quote Terms & Conditions' }
    ],
    ECOTypeCategory: [
      { id: 1, value: 'Work Order' },
      { id: 2, value: 'RFQ Terms & Condition' }
    ],
    ECOTypeCategoryDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Work Order', value: 'Work Order'
      },
      {
        id: 'RFQ Terms & Condition', value: 'RFQ Terms & Condition'
      }
    ],
    RFQQtyTypeRadiobutton: [
      {
        text: 'Proto', value: 1
      },
      {
        text: 'Unknown', value: 2
      },
      {
        text: 'Production', value: 3
      }
    ],
    Entity: {
      Operation: 'Operation',
      Customer: 'Customer',
      Equipment: 'Equipment, Workstation & Sample',
      Certificate: 'Standard',
      Employee: 'Personnel',
      Department: 'Department',
      Workorder: 'Work Order',
      Supplier: 'Supplier',
      Component: 'Part',
      Salesorder: 'Sales Order',
      RFQ: 'RFQ',
      ComponentAsPart: 'component',
      SupplierInvoice: 'Supplier Invoice',
      PackingSlip: 'Packing Slip',
      CreditMemo: 'Credit Memo',
      DebitMemo: 'Debit Memo',
      CustomerPackingSlip: 'Customer Packing Slip',
      CustomerInvoice: 'Customer Invoice',
      SupplierRMA: 'Supplier RMA',
      PurchaseOrder: 'Purchase Order',
      Manufacturer: 'Manufacturer'
    },
    CommonStatus: [
      {
        id: 'Unknown', value: 'Unknown'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      { id: 'No', value: 'No' }
    ],
    IsSubAccountGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    IsSubTypeGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Yes', value: 'Yes'
      },
      {
        id: 'No', value: 'No'
      }
    ],
    AllEntityIDS: {
      Operation: {
        ID: -1,
        Name: 'operations'
      },
      Customer: {
        ID: -2,
        Name: 'customer'
      },
      Equipment: {
        ID: -3,
        Name: 'equipment'
      },
      CertificateStandard: {
        ID: -4,
        Name: 'certificate_standards'
      },
      Employee: {
        ID: -5,
        Name: 'employees'
      },
      Department: {
        ID: -6,
        Name: 'department'
      },
      Workorder: {
        ID: -7,
        Name: 'workorder'
      },
      Supplier: {
        ID: -8,
        Name: 'supplier'
      },
      Component: {
        ID: -9,
        Name: 'component'
      },
      SalesOrder: {
        ID: -10,
        Name: 'salesorder'
      },
      Component_sid_stock: {
        ID: -11,
        Name: 'component_sid_stock'
      },
      Equipment_Task: {
        ID: null,
        Name: 'equipment_task'
      },
      Workorder_operation: {
        ID: null,
        Name: 'workorder_operation'
      },
      ECORequest: {
        ID: null,
        Name: 'eco_request'
      },
      PreProgramComponent: {
        ID: null,
        Name: 'workorder_preprogcomp'
      },
      Assembly_revision: {
        ID: null,
        Name: 'assembly_revisionmst'
      },
      BOM: {
        ID: null,
        Name: 'bom'
      },
      COMPONENT_CUSTOMER_LOA: {
        ID: null,
        Name: 'component_customer_loa'
      },
      Assembly: {
        ID: null,
        Name: 'assembly'
      },
      PackingSlip: {
        ID: -14,
        Name: 'packing_slip'
      },
      RFQ: {
        ID: -12,
        Name: 'RFQ'
      },
      Workorder_FeederDetail: {
        Name: 'workorder_operation_equipment_feeder_details'
      },
      SupplierInvoice: {
        ID: -13,
        Name: 'supplier_invoice'
      },
      CreditMemo: {
        ID: -15,
        Name: 'credit_memo'
      },
      DebitMemo: {
        ID: -16,
        Name: 'debit_memo'
      },
      Customer_PackingSlip: {
        ID: -17,
        Name: 'customer_packingslip'
      },
      Supplier_Quote: {
        ID: null,
        Name: 'supplier_quote'
      },
      Customer_Invoice: {
        ID: -18,
        Name: 'customer_invoice'
      },
      Supplier_RMA: {
        ID: -19,
        Name: 'supplier_rma'
      },
      Purchase_Order: {
        ID: -20,
        Name: 'purchase_order_mst'
      },
      CustomerPayment: {
        ID: null,
        Name: 'cust_packingslip_invoice_payment'
      },
      Manufacturer: {
        ID: -21,
        Name: 'mfgcodemst'
      },
      ApplyCustomerCreditMemo: {
        ID: null,
        Name: 'apply_cust_credit_memo_to_inv'
      },
      ApplyCustomerWriteOff: {
        ID: null,
        Name: 'apply_cust_write_off_to_inv'
      },
      SupplierInvoiceRefund: {
        ID: -22,
        Name: 'supplier_invoice_refund'
      },
      CustomerRefund: {
        ID: null,
        Name: 'cust_payment_CM_Refund'
      },
      SupplierInvoicePayment: {
        ID: -23,
        Name: 'supplier_invoice_payment'
      }
    },
    SHOW_ELEMENT_OPTION: [
      'Entity',
      'Operation',
      'Both'
    ],
    AssemblyActiveObseleteDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: '1', value: 'Active'
      },
      { id: '0', value: 'Obsolete' }
    ],
    OperationTimeMask: '999?9?:99',
    TimeMask: '99:99',
    TimePattern: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
    datakeyTimePattern: /^([0-2]|0[0-4]]):[0-5][0-9]$/,
    PhonePattern: /^\+[1-9]{1}[0-9]{3,14}$/,
    //OperationTimePattern: /^(\d{0,2})(?::([0-5]\d{0,2}))$/,
    OperationTimePattern: /^(\d{2,4})(?::([0-5]\d{0,2}))$/,
    EmailPattern: /^[a-zA-Z0-9]+([\.\-\_][_a-zA-Z0-9\-\_]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,7})$/,
    //EmailPattern: /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,7})$/,
    //WebSitePattern: '^(http|https?|ftp)://([a-zA-Z0-9_\-]+)([\.][a-zA-Z0-9_\-]+)+([/][a-zA-Z0-9\~\(\)_\-]*)+([\.][a-zA-Z0-9\(\)_\-]+)*$',
    //WebSitePattern: '^((https?|ftp)://)?([A-Za-z]+\\.)?[A-Za-z0-9-]+(\\.[a-zA-Z]{1,4}){1,2}(/.*\\?.*)?$',
    //WebSitePattern: '^(http|https?|ftp)://([a-zA-Z0-9_\-]+)([\.][a-zA-Z0-9\%_\-]+)+(([/][a-zA-Z0-9\%\~\(\)_\-]*)+([\.][a-zA-Z0-9\%\(\)_\-]+)*)*$',
    WebSitePattern: '^((http|https?|ftp)://)?([a-zA-Z0-9_\-]+)([\.\:][a-zA-Z0-9\%_\-]+)+(([/][a-zA-Z0-9\%\#\!\&\?\=\~\(\)_\-]*)+([\.][a-zA-Z0-9\%\#\!\?\&\=\(\)_\-]+)*)*$',
    PhoneNumberPattern: /^\+(\d{0,})[\s-,]*(\(\d{1,}\)|\d{1,})[\s-,]*(\(\d{1,}\)|\d{0,})[\s-,]*(\(\d{1,}\)|\d{0,})$/,
    DecimalNmberPattern: /^[0-9]\d{0,9}(\.\d{1,4})?%?$/,
    MACAddressPattern: /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i,
    IPAddressPattern: /^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-2][0-3])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
    //IPAddressPattern: /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
    //IPAddressPattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    restrictSpecialCharatorPattern: /^[^`~!@#$%\^*()+={}|[\]\\:';"<>?,./]*$/,
    //restrictSpecialCharatorPattern: /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/,
    restrictSpecialCharator: 'Only + and - special characters are allowed in Production PN',
    CameraNamePattern: '^[A-Za-z0-9-]*$',
    TurnTimeStringPattern: /^[0-9,]*$/,
    ReleaseVersionPattern: '^[0-9]*[.][0-9]*[.][0-9]*$',
    restrictLikOperatoreWildCardChar: /^[^%_]+$/,
    restrictQuoteInSearch: /^[^']$/,
    AddressType: {
      BillingAddress: 'B',
      ShippingAddress: 'S',
      IntermediateAddress: 'I',
      PayToInformation: 'P',
      RMAShippingAddress: 'R',
      WireTransferAddress: 'W',
      BusinessAddress: 'BU',
      RMAIntermediateAddress: 'RI'
    },
    AddressTypes: {
      CUST_MFR: {
        B: {
          value: 'Billing Address',
          title: 'Billing address'
        },
        S: {
          value: 'Shipping Address',
          title: 'Shipping address'
        },
        I: {
          value: 'Intermediate Shipping Address',
          title: 'Intermediate Shipping address'
        },
        P: {
          value: 'Remit To Address',
          title: 'Remit To address'
        },
        R: {
          value: 'Shipping From Address (RMA)',
          title: 'Shipping From address (RMA)'
        },
        W: {
          value: 'Wire Transfer Address',
          title: 'Wire Transfer address'
        },
        BU: {
          value: 'Business Address',
          title: 'Business address'
        },
        RI: {
          value: 'RMA Intermediate Address',
          title: 'RMA Intermediate Address'
        }
      },
      SUPP: {
        B: {
          value: 'Billing Address',
          title: 'Billing address'
        },
        S: {
          value: 'Shipping From Address',
          title: 'Shipping From address'
        },
        I: {
          value: 'Intermediate Shipping Address',
          title: 'Intermediate Shipping address'
        },
        P: {
          value: 'Remit To Address',
          title: 'Remit To address'
        },
        R: {
          value: 'RMA Shipping Address',
          title: 'RMA Shipping Address'
        },
        W: {
          value: 'Wire Transfer Address',
          title: 'Wire Transfer address'
        },
        BU: {
          value: 'Business Address',
          title: 'Business address'
        },
        RI: {
          value: 'RMA Intermediate Address',
          title: 'RMA Intermediate Address'
        }
      }
    },
    //WONumberPattern: /^\d{4,5}-\d{2}$/,  // e.g 9999-99 OR 99999-99,
    ProductionWONumberPattern: /^WO\d{5}-\d{2,}$/,  // e.g WO00001-01 || WO00001-111,
    ProdWONumPatternNotAllowedForOtherTypeWONum: /^WO\d{5}-\d{0,}$/,  // e.g WO00001- || WO00001-1 || WO00001-01 || WO00001-111
    UserPasswordPattern: /(?=.{8,50})(?=(.*\d){1,})(?=.*[a-z])(?=(?:.*?[A-Z]){1})(?=(.*\W){1})/,
    ProductionPNAllowedCharactersPattern: /^[A-Za-z0-9+-]+$/,
    UIGrid: {
      paginationPageSizes: [25, 50, 100, 200, 500],
      Page: function () {
        return this.enablePaging ? 1 : 1;
      },
      ItemsPerPage: function () { return this.enablePaging ? this.paginationPageSizes[0] : _configPageSize; },
      InfiniteScrollRowsFromEnd: _configScrollRowsFromEnd,
      enablePaging: false,
      enableRowHeaderSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      enableFullRowSelection: false,
      selectedRowKey: 'ID',
      enableGrouping: false,
      ROW_NUM_CELL_TEMPLATE: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
      <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
      </div>\
      <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
      <span><b>{{(grid.appScope.$parent.vm.pagingInfo.pageSize * ((grid.appScope.$parent.vm.pagingInfo.Page || 1) - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
      </div>',
      UI_GRID_PAGING_PREFERENCE_TYPE: {
        Pagination: 'P'
      },
      VISIBLE_CREATED_BY: true,
      VISIBLE_CREATED_AT: false,
      VISIBLE_CREATED_BYROLE: false,
      VISIBLE_MODIFIED_BY: false,
      VISIBLE_MODIFIED_AT: false,
      VISIBLE_MODIFIED_BYROLE: false,
      VISIBLE_LOCKED_AT: false,
      VISIBLE_LOCKED_BYROLE: false
    },
    PaymentMode: {
      Exempt: 'Exempt',
      Non_exempt: 'Non-exempt'
    },
    QuoteDynamicFieldsType: {
      Material: 'Material',
      Labor: 'Labor',
      Adhoc: 'Overhead',
      NRE: 'NRE',
      TOOL: 'Tooling',
      RC: 'RE',
      ALL: 'All'
    },
    DateTimeFormat_PICKER: 'MM/DD/YYYY HH:mm',
    Category_Type: [
      {
        categoryTypeID: 1, categoryType: 'Equipment, Workstation & Sample Groups', passfilterValue: 'Equipment, Workstation & Sample Groups', displayName: 'Equipment, Workstation & Sample Groups', singleLabel: 'Equipment, Workstation & Sample Group', fileName: 'Equipment Group', EmptyStateImageName: 'Equipment-&-Workstation-Groups'
      },
      {
        categoryTypeID: 2, categoryType: 'Equipment, Workstation & Sample Types', passfilterValue: 'Equipment, Workstation & Sample Types', displayName: 'Equipment, Workstation & Sample Types', singleLabel: 'Equipment, Workstation & Sample Type', fileName: 'Equipment Type', EmptyStateImageName: 'equipment_workstation_types'
      },
      {
        categoryTypeID: 3, categoryType: 'Equipment & Workstation Possessions', passfilterValue: 'Equipment & Workstation Possessions', displayName: 'Equipment & Workstation Possessions', singleLabel: 'Equipment & Workstation Possession', fileName: 'Equipment Possession', EmptyStateImageName: 'ECO-DFM-Type'
      },
      {
        categoryTypeID: 4, categoryType: 'Equipment, Workstation & Sample Ownerships', passfilterValue: 'Equipment, Workstation & Sample Ownerships', displayName: 'Equipment, Workstation & Sample Ownerships', singleLabel: 'Equipment, Workstation & Sample Ownership', fileName: 'Equipment Ownership', EmptyStateImageName: 'equipment_workstation_ownership'
      },
      {
        categoryTypeID: 5, categoryType: 'Standard Types', passfilterValue: 'Standard Types', displayName: 'Standard Types', singleLabel: 'Standard Type', fileName: 'Standard Type', EmptyStateImageName: 'standard_types'
      },
      {
        categoryTypeID: 7, categoryType: 'Titles', passfilterValue: 'Titles', displayName: 'Titles', singleLabel: 'Title', fileName: 'Titles', EmptyStateImageName: 'user-titles'
      },
      {
        categoryTypeID: 8, categoryType: 'Operation Types', passfilterValue: 'Operation Types', displayName: 'Operation Types', singleLabel: 'Operation Type', fileName: 'Operation Types', EmptyStateImageName: 'operation_types'
      },
      {
        categoryTypeID: 9, categoryType: 'Shipping Status', passfilterValue: 'Shipping Status', displayName: 'Shipping Status', singleLabel: 'Shipping Status', fileName: 'Shipping Status', EmptyStateImageName: 'Shipping-Status'
      },
      {
        categoryTypeID: 10, categoryType: 'Operation Verification Status', passfilterValue: 'Operation Verification Status', displayName: 'Operation Verification Status', singleLabel: 'Operation Verification Status', fileName: 'Operation Verification Status', EmptyStateImageName: 'Operation-Verification-Status'
      },
      {
        categoryTypeID: 11, categoryType: 'Geolocations', passfilterValue: 'Geolocations', displayName: 'Geolocations', singleLabel: 'Geolocation', fileName: 'Geolocations', EmptyStateImageName: 'geolocations'
      },
      {
        categoryTypeID: 12, categoryType: 'Responsibilities', passfilterValue: 'Responsibilities', displayName: 'Responsibilities', singleLabel: 'Responsibility', fileName: 'Work Area', EmptyStateImageName: 'responsibilities'
      },
      {
        categoryTypeID: 13, categoryType: 'Shipping Methods', passfilterValue: 'Shipping Methods', displayName: 'Shipping Methods', singleLabel: 'Shipping Method', fileName: 'Shipping Type', EmptyStateImageName: 'Shipping-Methods'
      },
      {
        categoryTypeID: 14, categoryType: 'Payment Terms', passfilterValue: 'Payment Terms', displayName: 'Payment Terms', singleLabel: 'Payment Term', fileName: 'Terms', EmptyStateImageName: 'payment-terms-new'
      },
      {
        categoryTypeID: 15, categoryType: 'Printers', passfilterValue: 'Printers', displayName: 'Printers', singleLabel: 'Printer', fileName: 'Printer', EmptyStateImageName: 'Printers'
      },
      {
        categoryTypeID: 16, categoryType: 'Label Templates', passfilterValue: 'Label Templates', displayName: 'Label Templates', singleLabel: 'Label Template', fileName: 'Print Format', EmptyStateImageName: 'label_templates'
      },
      {
        categoryTypeID: 17, categoryType: 'Part Status', passfilterValue: 'Part Status', displayName: 'Part Status', singleLabel: 'Part Status', fileName: 'Part Status', EmptyStateImageName: 'Part-Type'
      },
      {
        categoryTypeID: 18, categoryType: 'Barcode Separators', passfilterValue: 'Barcode Separators', displayName: 'Barcode Separators', singleLabel: 'Barcode Separator', fileName: 'Barcode Separators', EmptyStateImageName: 'Barcode-Separators'
      },
      {
        categoryTypeID: 19, categoryType: 'Assy.Status', passfilterValue: 'Assy.Status', displayName: 'Assy.Status', singleLabel: 'Assy.Status', fileName: 'Assy Status', EmptyStateImageName: 'assembly'
      },
      {
        categoryTypeID: 20, categoryType: 'Home Menu Category', passfilterValue: 'Home Menu Category', displayName: 'Home Menu Category', singleLabel: 'Home Menu Category', fileName: 'Home Menu Category', EmptyStateImageName: 'Home-Menu-Category'
      },
      {
        categoryTypeID: 21, categoryType: 'Document Type', passfilterValue: 'Document Type', displayName: 'Document Type', singleLabel: 'Document Type', fileName: 'Document Type', EmptyStateImageName: 'Document-Type'
      },
      {
        categoryTypeID: 22, categoryType: 'ECO/DFM Type', passfilterValue: 'ECO/DFM Type', displayName: 'ECO/DFM Type', singleLabel: 'ECO/DFM Type', fileName: 'ECODFM Type', EmptyStateImageName: 'ECO-DFM-Type'
      },
      {
        categoryTypeID: 23, categoryType: 'Charges Type', passfilterValue: 'Charges Type', displayName: 'Charges Type', singleLabel: 'Charges Type', fileName: 'Charges Type', EmptyStateImageName: 'charges-type'
      },
      {
        categoryTypeID: 24, categoryType: 'Notification Category', passfilterValue: 'Notification Category', displayName: 'Notification Category', singleLabel: 'Notification Category', fileName: 'Notification Category', EmptyStateImageName: 'notification-category'
      },
      {
        categoryTypeID: 25, categoryType: 'Payable Payment Method', passfilterValue: 'Payable Payment Method', displayName: 'Payable Payment Method', singleLabel: 'Payable Payment Method', fileName: 'Payable Payment Method', EmptyStateImageName: 'payment-method-type'
      },
      {
        categoryTypeID: 26, categoryType: 'Carrier', passfilterValue: 'Carrier', displayName: 'Carriers', singleLabel: 'Carrier', fileName: 'Carriers', EmptyStateImageName: 'carrier-master'
      },
      {
        categoryTypeID: 27, categoryType: 'Report Category', passfilterValue: 'Report Category', displayName: 'Report Category', singleLabel: 'Report Category', fileName: 'Report Category', EmptyStateImageName: 'Report-Category'
      },
      {
        categoryTypeID: 28, categoryType: 'Part Requirement Category', passfilterValue: 'Part Requirement Category', displayName: 'Requirements & Comments Category', singleLabel: 'Requirements & Comments Category', fileName: 'Requirements & Comments Category', EmptyStateImageName: 'Part-Requirement-Category'
      },
      {
        categoryTypeID: 29, categoryType: 'Payment Type Category', passfilterValue: 'Payment Type Category', displayName: 'Payment Type Category', singleLabel: 'Payment Type Category', fileName: 'Payment Type Category', EmptyStateImageName: 'Payment-Type-Category'
      },
      {
        categoryTypeID: 30, categoryType: 'Receivable Payment Method', passfilterValue: 'Receivable Payment Method', displayName: 'Receivable Payment Method', singleLabel: 'Receivable Payment Method', fileName: 'Receivable Payment Method', EmptyStateImageName: 'payment-method-type'
      }
    ],
    CategoryType: {
      EquipmentGroup: {
        ID: 1,
        Name: 'Equipment, Workstation & Sample Groups',
        Title: 'Equipment, Workstation & Sample Group'
      },
      EquipmentType: {
        ID: 2,
        Name: 'Equipment, Workstation & Sample Types',
        Title: 'Equipment, Workstation & Sample Type'
      },
      EquipmentPossession: {
        ID: 3,
        Name: 'Equipment & Workstation Possessions',
        Title: 'Equipment & Workstation Possession'
      },
      EquipmentOwnership: {
        ID: 4,
        Name: 'Equipment, Workstation & Sample Ownerships',
        Title: 'Equipment, Workstation & Sample Ownership'
      },
      StandardType: {
        ID: 5,
        Name: 'Standard Types',
        Title: 'Standard Type'
      },
      EmployeeTitle: {
        ID: 7,
        Name: 'Titles',
        Title: 'Title'
      },
      OperationType: {
        ID: 8,
        Name: 'Operation Types',
        Title: 'Operation Type'
      },
      ShippingStatus: {
        ID: 9,
        Name: 'Shipping Status',
        Title: 'Shipping Status'
      },
      OperationVerificationStatus: {
        ID: 10,
        Name: 'Operation Verification Status',
        Title: 'Operation Verification Status'
      },
      LocationType: {
        ID: 11,
        Name: 'Geolocations',
        Title: 'Geolocation'
      },
      WorkArea: {
        ID: 12,
        Name: 'Responsibilities',
        Title: 'Responsibility'
      },
      ShippingType: {
        ID: 13,
        Name: 'Shipping Methods',
        Title: 'Shipping Method'
      },
      Terms: {
        ID: 14,
        Name: 'Payment Terms',
        Title: 'Payment Term'
      },
      Printer: {
        ID: 15,
        Name: 'Printers',
        Title: 'Printer'
      },
      PrintFormat: {
        ID: 16,
        Name: 'Label Templates',
        Title: 'Label Template'
      },
      PartStatus: {
        ID: 17,
        Name: 'Part Status',
        Title: 'Part Status'
      },
      BarcodeSeparator: {
        ID: 18,
        Name: 'Barcode Separators',
        Title: 'Barcode Separator'
      },
      AssyStatus: {
        ID: 19,
        Name: 'Assy. Status',
        Title: 'Assy. Status'
      },
      HomeMenu: {
        ID: 20,
        Name: 'Home Menu Category',
        Title: 'Home Menu Category'
      },
      DocumentType: {
        ID: 21,
        Name: 'Document Type',
        Title: 'Document Type',
        ManageTitle: 'Add Document Type'
      },
      ECO_DFMType: {
        ID: 22,
        Name: 'ECO/DFM Type',
        Title: 'ECO/DFM Type'
      },
      ChargesType: {
        ID: 23,
        Name: 'Charges Type',
        Title: 'Charges Type',
        ManageTitle: 'Add Charges Type'
      },
      NotificationCategory: {
        ID: 24,
        Name: 'Notification Category',
        Title: 'Notification Category'
      },
      PayablePaymentMethods: {
        ID: 25,
        Name: 'Payable Payment Method',
        Title: 'Payable Payment Method',
        ManageTitle: 'Add Payable Payment Methods'
      },
      Carriers: {
        ID: 26,
        Name: 'Carrier',
        Title: 'Carriers',
        ManageTitle: 'Add Carrier',
        singleLabel: 'Carrier'
      },
      ReportCategory: {
        ID: 27,
        Name: 'Report Category',
        Title: 'Report Category',
        singleLabel: 'Report Category'
      },
      PartRequirementCategory: {
        ID: 28,
        Name: 'Part Requirement Category',
        Title: 'Requirements & Comments Category',
        singleLabel: 'Requirements & Comments Category'
      },
      PaymentTypeCategory: {
        ID: 29,
        Name: 'Payment Type Category',
        Title: 'Payment Type Category',
        ManageTitle: 'Add Payment Type Category'
      },
      ReceivablePaymentMethods: {
        ID: 30,
        Name: 'Receivable Payment Method',
        Title: 'Receivable Payment Method',
        ManageTitle: 'Add Receivable Payment Methods'
      }
    },
    GenericTransMode: {
      RefundPayable: 'RP',
      RefundReceivable: 'RR'
    },
    GenericTransModeName: {
      RefundReceivableCMRefund: { id: -1, modeType: 'RR', modeCode: '', modeName: 'CM/DM Refund', description: 'CM/DM Refund', ref_acctid: '' },
      RefundReceivableDiscount: { id: -2, modeType: 'RR', modeCode: '', modeName: 'Discount', description: 'Discount', ref_acctid: '' },
      RefundReceivablePromotion: { id: -3, modeType: 'RR', modeCode: '', modeName: 'Promotion', description: 'Promotion', ref_acctid: '' },
      RefundReceivablePayRefund: { id: -4, modeType: 'RR', modeCode: '', modeName: 'Overpayment Refund', description: 'Overpayment Refund', ref_acctid: '' },
      RefundReceivableMISCRefund: { id: -5, modeType: 'RR', modeCode: '', modeName: 'Misc Refund', description: 'Misc Refund', ref_acctid: '' },
      RefundPayableCMRefund: { id: -6, modeType: 'RP', modeCode: '', modeName: 'CM Refund', description: 'CM Refund', ref_acctid: '' },
      RefundPayableDiscount: { id: -7, modeType: 'RP', modeCode: '', modeName: 'Discount', description: 'Discount', ref_acctid: '' },
      RefundPayablePromotion: { id: -8, modeType: 'RP', modeCode: '', modeName: 'Promotion', description: 'Promotion', ref_acctid: '' },
      RefundPayablePayRefund: { id: -9, modeType: 'RP', modeCode: '', modeName: 'Overpayment Refund', description: 'Overpayment Refund', ref_acctid: '' },
      RefundPayableMISCRefund: { id: -10, modeType: 'RP', modeCode: '', modeName: 'Misc Refund', description: 'Misc Refund', ref_acctid: '' },
      RefundPayableWOFF: { id: -11, modeType: 'RP', modeCode: '', modeName: 'Write Off', description: 'Write Off', ref_acctid: '' }
    },
    Chart_of_Accounts: {
      SINGLELABEL: 'Chart of Accounts',
      AccountCode: 'Account#',
      AccountType: 'Account Type',
      Description: 'Description',
      AccountName: 'Account Name',
      SubAccount: 'Sub Account of',
      ParentAccount: 'Parent Account'
    },
    Account_Type: {
      SINGLELABEL: 'Account Type',
      AccountCode: 'Account#',
      SubAccount: 'Sub Account of',
      ParentAccountType: 'Parent Account Type',
      Description: 'Description'
    },
    EQUIPMENT_OWNERSHIP_TYPE: {
      CUSTOMER: 'Customer',
      LOAN: 'Loan',
      FLAX_TRON: 'Flax Tron',
      SMALL_TOOL: 'Small Tool'
    },
    UMID_APPROVAL_TYPE: {
      selfLifeDays: 'SL'
    },
    Month: [
      {
        ID: 1, Value: 'January'
      },
      {
        ID: 2, Value: 'February'
      },
      { ID: 3, Value: 'March' },
      {
        ID: 4, Value: 'April'
      },
      {
        ID: 5, Value: 'May'
      },
      {
        ID: 6, Value: 'June'
      },
      {
        ID: 7, Value: 'July'
      },
      {
        ID: 8, Value: 'August'
      },
      {
        ID: 9, Value: 'September'
      },
      {
        ID: 10, Value: 'October'
      },
      {
        ID: 11, Value: 'November'
      },
      {
        ID: 12, Value: 'December'
      }
    ],
    Day: [
      {
        ID: 1, Value: 'Sunday'
      },
      {
        ID: 2, Value: 'Monday'
      },
      {
        ID: 3, Value: 'Tuesday'
      },
      {
        ID: 4, Value: 'Wednesday'
      },
      {
        ID: 5, Value: 'Thursday'
      },
      { ID: 6, Value: 'Friday' },
      {
        ID: 7, Value: 'Saturday'
      }
    ],

    //PAGENAME_CONSTANT: {
    //    GenericCategory: {
    //        PageName: 'GenericCategory'
    //    },
    //    WorkorderTransManualEntryList: {
    //        PageName: 'WorkorderTransManualEntryList'
    //    },
    //    RoleList: {
    //        PageName: 'RoleList'
    //    },
    //    StandardClassList: {
    //        PageName: 'StandardClassList'
    //    },
    //    EntityList: {
    //        PageName: 'EntityList'
    //    },
    //    RfqPartCategory: {
    //        PageName: 'RfqPartCategory'
    //    }
    //},
    PAGENAME_CONSTANT: [
      {
        PageName: 'GenericCategory', isDisabledDelete: true, isDisabledUpdate: true
      }, //0
      {
        PageName: 'WorkorderTransManualEntryList', isDisabledDelete: true, isDisabledUpdate: true
      }, //1
      {
        PageName: 'RoleList', isDisabledDelete: true, isDisabledUpdate: false
      }, //2
      {
        PageName: 'StandardClassList', isDisabledDelete: true, isDisabledUpdate: true
      }, //3
      {
        PageName: 'EntityList', isDisabledDelete: true, isDisabledUpdate: true
      }, //4
      {
        PageName: 'RfqPartCategory', isDisabledDelete: true, isDisabledUpdate: true
      }, //5
      {
        PageName: 'Sales Order', isDisabledDelete: true, isDisabledUpdate: false
      }, //6
      {
        PageName: 'Receving material'
      }, //7
      {
        PageName: 'BarcodeTemplate'
      },  //8
      {
        PageName: 'Component'
      },  //9
      {
        PageName: 'Customer'
      }, //10
      {
        PageName: 'Master Template'
      }, //11
      {
        PageName: 'Unit Of Measurement', isDisabledDelete: true
      }, //12
      {
        PageName: 'CPN Grid Of Customer'
      }, //13
      {
        PageName: 'Functional Type', isDisabledDelete: true
      },//14
      {
        PageName: 'Connector Type', isDisabledDelete: true
      },//15
      {
        PageName: 'Feeder Details'
      }, //16
      {
        PageName: 'Feeder Transaction History'
      }, //17,
      {
        PageName: 'Warehouse'
      }, //18,
      {
        PageName: 'Bin'
      }, //19,
      {
        PageName: 'Manufacturer/Customer Popup'
      }, //20,
      {
        PageName: 'Manufacturer'
      }, //21,
      {
        PageName: 'Supplier'
      }, //22,
      {
        PageName: 'Manage Packing Slip'
      }, //23,
      {
        PageName: 'UMID Management'
      }, //24
      {
        PageName: 'Kit Allocation'
      }, //25
      {
        PageName: 'Job Type'
      }, //26
      {
        PageName: 'Label Templates'
      }, //27
      {
        PageName: 'Rack'
      },  //28
      {
        PageName: 'Unallocated UMID Transfer History'
      }, //29
      {
        PageName: 'Manage Parts Purchase Inspection Requirement', isDisabledDelete: true, isDisabledUpdate: false
      },  //30
      {
        PageName: 'Requirements & Comments', isDisabledDelete: true, isDisabledUpdate: true
      },  //31
      {
        PageName: 'Purchase/Incoming Inspection Requirement Template'
      }, //32
      {
        PageName: 'Supplier Quote'
      }, //33
      {
        PageName: 'Supplier Attribute Template'
      }, //34
      {
        PageName: 'FOB'
      }, //35,
      {
        PageName: 'Customer Invoice', isDisabledDelete: true, isDisabledUpdate: true
      },//36
      {
        PageName: 'Agreement'
      }, //37
      {
        PageName: 'User Agreement'
      },//38
      {
        PageName: 'Email'
      },//39
      {
        PageName: 'Archive Version'
      },//40
      {
        PageName: 'Agreed User'
      }, //41
      {
        PageName: 'Assembly Initial Stock', isDisabledDelete: true, isDisabledUpdate: false
      }, //42
      {
        PageName: 'Bank'
      }, //43
      {
        PageName: 'Customer Packing Slip', isDisabledDelete: true, isDisabledUpdate: true
      },//44
      {
        PageName: 'Packing Slip', isDisabledDelete: true, isDisabledUpdate: true
      },//45
      {
        PageName: 'Purchase Order Summary', isDisabledDelete: true, isDisabledUpdate: false
      },//46
      {
        PageName: 'Generate Serial No'
      }, //47
      {
        PageName: 'Manage Purchase Order'
      }, //48,
      {
        PageName: 'Chart of Accounts'
      }, //49
      {
        PageName: 'Help Blog History'
      }, //50
      {
        PageName: 'Account Type'
      }, //51
      {
        PageName: 'Packaging Type', isDisabledDelete: true
      }, //52
      {
        PageName: 'Mounting Type', isDisabledDelete: true
      }, //53
      {
        PageName: 'RoHS', isDisabledDelete: true
      }, //54
      {
        PageName: 'Part Status', isDisabledDelete: true
      }, //55
      {
        PageName: 'UMID Pending Parts'
      }, //56
      {
        PageName: 'Assembly Production Stock', isDisabledDelete: true, isDisabledUpdate: false
      }, //57
      {
        PageName: 'Transaction Modes'
      }, //58
      {
        PageName: 'Defect Categories'
      }, //59
      {
        PageName: 'Personnel'
      }, //60
      {
        PageName: 'Package Case Type'
      }, //61
      {
        PageName: 'Part Operational Attribute'
      }, //62
      {
        PageName: 'Unauthorized Notification'
      }, //63
      {
        PageName: 'Part Comments (Internal Notes)'
      }, //64
      {
        PageName: 'Kit Release/Return History'
      }, //65
      {
        PageName: 'Sales Order Shipping History'
      }, // 66
      { PageName: 'Contact Person' }, //67
      { PageName: 'Employee Contact Person History' }, //68
      { PageName: 'Date Code Format' } //69
    ],

    CAMERA_CAPTURE: {
      CONTROLLER: 'CameraCaptureController',
      VIEW: 'app/core/component/camera-capture/camera-capture-modal.html'
    },


    IP_CAMERA_CAPTURE: {
      CONTROLLER: 'IpCameraCaptureController',
      VIEW: 'app/core/component/ip-camera-capture/ip-camera-capture-modal.html'
    },

    QTY_CONFIRMATION_LIST: {
      CONTROLLER: 'QuantityConfirmationController',
      VIEW: 'app/core/component/qty-confirmation-list/qty-confirmation-list-modal.html'
    },


    IMPORT_FILE_POPUP_CONTROLLER: 'FieldMappingController',
    IMPORT_FILE_POPUP_VIEW: 'app/core/component/import-export/field-mapping-popup.html',

    VIDEO_FILE_UPLOAD_POPUP_CONTROLLER: 'VideoFileUploadController',
    VIDEO_FILE_UPLOAD_POPUP_VIEW: 'app/directives/custom/video-file-upload-popup/video-file-upload-popup.html',

    SUPPLIER_QUOTE_PO_PART_PRICE_POPUP_CONTROLLER: 'SupplierQuotePurchaseOrderPartPricePopupController',
    SUPPLIER_QUOTE_PO_PART_PRICE_POPUP_VIEW: 'app/core/component/supplier-quote-purchase-order-part-price/supplier-quote-purchase-order-part-price.html',

    SEARCH_MULTIPART_COLUMN_MAPPING_POPUP_CONTROLLER: 'SearchMultipartColumnMappingPopupController',
    SEARCH_MULTIPART_COLUMN_MAPPING_POPUP_VIEW: 'app/core/component/search-multipart-column-mapping-popup/search-multipart-column-mapping-popup.html',

    PART_UNIT_CALCULATION_SAMPLE_DATA_POPUP_CONTROLLER: 'PartUnitCalculationSampleDataPopupController',
    PART_UNIT_CALCULATION_SAMPLE_DATA_POPUP_VIEW: 'app/core/component/part-unit-calculation-sample-data-popup/part-unit-calculation-sample-data-popup.html',

    WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_CONTROLLER: 'WOBuildHistoryCompNicknamePopupController',
    WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_VIEW: 'app/core/component/wo-build-history-comp-nickname-popup/wo-build-history-comp-nickname-popup.html',

    ManfucaturerTab: 'ManfucaturerTab',
    DistributorTab: 'DistributorTab',
    DataFieldTabName: 'DataFieldTab',
    OtherDetailTabName: 'OtherDetailTab',
    CommentsTabName: 'CommentsTab',
    BOMTabName: 'BOMTab',
    ComponentHistoryTabName: 'HistoryTab',
    ComponentOpeningStockTabName: 'OpeningStockTab',
    ComponentSupplierApiResponseTabName: 'SupplierApiResponseTab',
    ComponentAssemblySalesPriceMatrixTabName: 'ComponentAssemblySalesPriceMatrixTab',
    TemplateAllocation: 'TemplateAllocation',
    DocumentTabName: 'DocumentTab',
    PackingslipDocumentTab: 'PackingslipDocumentTab',
    SupplierInvoiceDocumentTab: 'SupplierInvoiceDocumentTab',
    StandardTabName: 'StandardTab',
    ComponentDetailTabName: 'ComponentDetailTab',
    customerLOATabName: 'customerLOATabName',
    pricingHistoryTabName: 'PricingHistoryTab',
    SupplierQuoteTabName: 'SupplierQuoteTab',
    POListTabName: 'POListTab',
    KitAllocationTabName: 'KitAllocationTab',
    RFQTabName: 'RFQTab',
    UMIDListTabName: 'UMIDListTab',
    DFMTabName: 'DFMTab',
    PackingSlipTabName: 'PackingSlipTab',
    PackingSlipInvoiceTabName: 'InvoiceVerificationTab',
    MISCTabName: 'MISCTab',
    //PurchaseInspectionRequirementTabName: 'PurchaseInspectionRequirementTab',
    ApprovedDisapprovedSupplierTabName: 'ApprovedDisapprovedSupplierTabName',
    /*AlternateGroupAlternatePartTabName: 'AlternateGroupAlternatePartTab',
    AlternateGroupWhereUsedTabName: 'AlternateGroupWhereUsedTab',
    AlternateGroupPurchaseHistoryTabName: 'AlternateGroupPurchaseHistoryTab',
    AlternateGroupCPNListTabName: 'AlternateGroupCPNListTab',
    AlternateGroupPackagingPartsTabName: 'AlternateGroupCPNListTab',*/
    PackingSlipListTabName: 'PackingSlipTab',
    CreditMemoListTabName: 'CreditMemoTab',
    DebitMemoListTabName: 'DebitMemoTab',
    WorkorderListTabName: 'WorkorderTab',
    EmployeeAutoCompleteDynamicBind: {
      selectedEmployee: 'selectedEmployee',
      selectedNewEmployeeInDepartment: 'selectedNewEmployeeInDepartment'
    },
    NO_IMAGE_COMPONENT: 'assets/images/component/noimage.png',
    COMPONENT_IMAGE_360: '//www.digikey.com/-/media/Designer/part-search/images/360.png',
    NO_IMAGE_ROHS: 'default/image/rohs/noimage.png',
    NO_IMAGE_STANDARD: 'default/image/certificate_standards/noimage.jpg',
    NO_IMAGE_OPERATIONAL_ATTRIBUTES: 'default/image/operational_attribute/noimage.jpg',
    NO_IMAGE_EQUIPMENT: 'default/image/equipment/profile.jpg',
    DISPLAY_DOCUMENT_ICON: {
      TXT: 'assets/images/etc/txt.png',
      PDF: 'assets/images/etc/pdf.png',
      XLSX: 'assets/images/etc/xlsx.png',
      XLS: 'assets/images/etc/xls.png',
      DOC: 'assets/images/etc/doc.png',
      DOCX: 'assets/images/etc/docx.png',
      OTHER: 'assets/images/etc/other.png',
      MP4: 'assets/images/etc/mp3.png',
      WEBM: 'assets/images/etc/mp3.png',
      MP3: 'assets/images/etc/mp3audio.png',
      CSV: 'assets/images/etc/csv.png',
      ZIP: 'assets/images/etc/zipfile.png',
      OGG: 'assets/images/etc/ogg.png',
      RAR: 'assets/images/etc/rar.png',
      TIF: 'assets/images/etc/tif.png',
      TIFF: 'assets/images/etc/tiff.png',
      WEBM: 'assets/images/etc/webm.png'
    },
    DOCUMENT_TYPE: ['txt', 'pdf', 'xlsx', 'xls', 'doc', 'docx', 'mp4', 'webm', 'mp3', 'csv', 'zip', 'ogg', 'rar', 'tif', 'tiff', 'webm'],
    UPLOAD_DOCUMENT_TYPE: ['xlsx', 'xls', 'csv'],
    InputField_DataType: [
      {
        dataTypeID: 1, dataTypeName: 'Varchar'
      },
      {
        dataTypeID: 2, dataTypeName: 'Text'
      },
      {
        dataTypeID: 3, dataTypeName: 'Integer'
      },
      {
        dataTypeID: 4, dataTypeName: 'Date Time'
      },
      {
        dataTypeID: 5, dataTypeName: 'Decimal'
      },
      {
        dataTypeID: 6, dataTypeName: 'Document'
      }
    ],

    Maintenance_Schedule_RepeatType: [
      {
        Name: 'Daily', value: '1'
      },
      {
        Name: 'Weekly', value: '2'
      },
      { Name: 'Monthly', value: '3' },
      {
        Name: 'Quarterly', value: '4'
      },
      {
        Name: 'SemiAnnual', value: '5'
      },
      {
        Name: 'Annual', value: '6'
      }
    ],

    Maintenance_Schedule_RepeatTypeDataValue: {
      Daily: '1',
      Weekly: '2',
      Monthly: '3',
      Quarterly: '4',
      SemiAnnual: '5',
      Annual: '6'
    },

    Maintenance_Schedule_RepeatTypeKey:
    {
      Daily: 'Daily',
      Weekly: 'Weekly',
      Monthly: 'Monthly',
      Quarterly: 'Quarterly',
      SemiAnnual: 'SemiAnnual',
      Annual: 'Annual'
    },

    EquipmentMaintenanceType: {
      Usage: 'U',
      Time: 'T'
    },
    documentSizeError: {
      NotAllowed: 'Document size greater than 16 Mb is not allowed'
    },
    Toolbar: {
      REQUIRED: true,
      MIN_LENGTH: 10,
      MAX_LENGTH: _textEditorMaxLength,
      MAX_LENGTH_3000: 3000,
      INLINE: [['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'uploadVideo', 'fontSize', 'fontName', 'fontColor', 'backGroundColor', 'wordcount', 'charcount', 'toolsSetting', 'camara', 'toolbarFullscreen', 'notes']],
      TWOLINE: [['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'], ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'uploadVideo', 'fontSize', 'fontName', 'wordcount', 'charcount', 'toolsSetting', 'camara', 'toolbarFullscreen', 'notes']]
    },
    DATE_PICKER: {
      certificateDate: 'certificateDate',
      placedInServiceDate: 'placedInServiceDate',
      outOfServiceDate: 'outOfServiceDate',
      endOnDate: 'endOnDate',
      fromDate: 'fromDate',
      toDate: 'toDate',
      defaultValue: 'defaultValue',
      shipDate: 'shipDate',
      initiateDate: 'initiateDate',
      finalStatusDate: 'finalStatusDate',
      ltbDate: 'ltbDate',
      eolDate: 'eolDate',
      poDate: 'poDate',
      soDate: 'soDate',
      shippingDate: 'shippingDate',
      owInvoiceDate: 'owInvoiceDate',
      openingdate: 'openingdate',
      quoteInDate: 'quoteInDate',
      quoteDueDate: 'quoteDueDate',
      buyDate: 'buyDate',
      partExpiryDate: 'partExpiryDate',
      partMFGDate: 'partMFGDate',
      invoiceDate: 'invoiceDate',
      packingSlipDate: 'packingSlipDate',
      receiptDate: 'receiptDate',
      transactionDate: 'transactionDate',
      materialDockDate: 'materialDockDate',
      kitReleaseDate: 'kitReleaseDate',
      quoteDate: 'quoteDate',
      releasedDate: 'releasedDate',
      creditMemoDate: 'creditMemoDate',
      refDebitMemoDate: 'refDebitMemoDate',
      originalPODate: 'originalPODate',
      poRevisionDate: 'poRevisionDate',
      lastApprovalDate: 'lastApprovalDate',
      expirationDate: 'ExpirationDate'
    },
    woQtyApprovalConfirmationTypes:
    {
      BuildQtyConfirmation: 'BuildQtyConfirmation',
      WOStatusChangeRequest: 'WOStatusChangeRequest',
      ReasonChangeRequest: 'ReasonChangeRequest',
      SOWorkingStatusChange: 'SOWorkingStatusChange'
    },
    ColorCode: {
      LeadFree: '#AEF9C2'
    },
    Import_export_FileTypeList: [{
      extension: 'xls'
    },
    {
      extension: 'xlsx'
    }],
    Import_export: {
      Personnel: {
        FileName: 'Personnel',
        Model: 'Personnel',
        Factory: 'EmployeeFactory',
        Method: 'employee',
        validateField: [{
          'field': 'email'
        }, {
          'field': 'code'
        }, {
          'field': 'initialName'
        }],
        requiredField: ['firstName', 'lastName', 'initialName', 'code'],
        numberField: ['burdenRate'],
        Table_Name: 'employees',
        maxLengthFieldValidation: [{
          'firstName': 50
        }, {
          'lastName': 50
        }, {
          'initialName': 50
        }, {
          'code': 50
        },
        {
          'contact': 10
        },
        {
          'contactCountryCode': 4
        }
        ],
        phoneField: [{
          phField: 'contact',
          matchCountryCodeField: 'contactCountryCode'
        }],
        emailField: ['email'],
        specialCharNotInclude: ['code', 'initialName']

      },
      LaborCostTemplate: {
        MountingType: {
          Name: 'MountingTypeName',
          Display: 'Mounting Type',
          isRequired: true,
          isDisplay: true
        },
        mountingTypeId: {
          Name: 'mountingTypeId',
          Display: 'mountingTypeId',
          isRequired: false,
          isDisplay: false
        },
        QPA: {
          Name: 'qpa',
          Display: 'QPA / Line count',
          isRequired: true,
          isDisplay: true
        },
        ORDEREDQTY: {
          Name: 'orderedQty',
          Display: 'Ordered Qty',
          isRequired: true,
          isDisplay: true
        },
        PRICE: {
          Name: 'price',
          Display: 'Price $',
          isRequired: true,
          isDisplay: true
        }
      },
      Equipment: {
        FileName: 'Equipment, Workstation & Sample',
        Model: 'Equipment',
        Factory: 'EquipmentFactory',
        Method: 'equipment',
        validateField: [
          {
            'field': 'assetName',
            'type': 'equipmentAs'
          }
        ],
        minLengthFieldValidation: [{ 'eqpDescription': 10 }],
        maxLengthFieldValidation: [{ 'assetName': 255 }, {
          'eqpMake': 100
        }, { 'eqpModel': 255 }, { 'eqpDescription': 1000 }],
        //categoryValidation: [{ 'field': 'equipmentAs' }],
        requiredField: ['equipmentAs', 'eqpMake', 'eqpModel', 'eqpYear', 'assetName', 'assetNumber', 'eqpOwnershipTypeID', 'eqpDescription'],
        numberField: [],
        fixedValueField: ['equipmentAs'],
        Table_Name: 'equipment'
      },
      Manufacturer: {
        FileName: 'Manufacturer',
        Model: 'MfgCodeMst',
        validateField: [{ 'field': 'mfgCode' }, {
          'field': 'mfgName'
        }],
        requiredField: ['mfgCode', 'mfgName'],
        maxLengthFieldValidation: [{
          'mfgCode': 8
        }, { 'mfgName': 255 }],
        //fixedValueField: ["mfgType"],
        Table_Name: 'mfgcodemst'
      },
      Supplier: {
        Model: 'MfgCodeMst',
        validateField: [{
          'field': 'mfgCode'
        }, {
          'field': 'mfgName'
        }],
        requiredField: ['mfgCode', 'mfgName'],
        Table_Name: 'mfgcodemst',
        maxLengthFieldValidation: [{
          'mfgCode': 8
        }, {
          'mfgName': 255
        }],
        excludeNotUsedMappingDbFields: ['isCustOrDisty']
      },
      GenericCategory: {
        Model: 'GenericCategory',
        validateField: [{
          'field': 'gencCategoryCode'
        }],
        requiredField: ['gencCategoryCode', 'gencCategoryName'],
        Table_Name: 'genericcategory'
      },
      LabelTemplate: {
        FileName: 'Label Templates'
      },

      fields_RemoveSpecialCharFromPhoneTypeFieldValue: ['contact']
    },
    FileGroup: {
      Sample: 'Samples Pictures',
      BOM: 'BOM Documents',
      Process: 'Process Instructions',
      Standard: 'Standard Documents',
      Product: 'Product Related',
      Document: 'Documents',
      Other: 'Others',
      COFC: 'COFC',
      PackingSlipWithCOFC: 'Packing Slip With COFC',
      PackingSlipwithoutCOFC: 'Packing Slip without COFC',
      PartsPicture: 'Part Picture',
      SupplierInvoice: 'Supplier Invoice'
    },
    workOrderECORequestType: {
      New: 'New',
      FCAECO: 'Internal-ECO',
      FCADFM: 'Internal-DFM',
      LotBreak: 'Lot Break',
      CustomerECO: 'ECO',
      CustomerDFM: 'DFM',
      Revision: 'Revision change',
      RepeatOrder: 'Repeat order with same revision'
    },
    WorkorderChangeType: {
      DO: 'Do\'s',
      DN: 'Don\'ts',
      IP: 'Instruction/Process Detail',
      OF: 'Operation Fields',
      ST: 'Standards',
      ET: 'Equipments',
      SM: 'Supplies, Materials & Tools',
      LI: 'Document',
      WC: 'Job Specific Requirement',
      MI: 'Management Communication'
    },
    supplierMFRMappingType: {
      StrictlyCustomComponent: { key: 'S', value: 'Strictly Custom Part Only' },
      OffTheShelf: { key: 'B', value: 'Off-the-shelf' },
      Both: { key: 'O', value: 'All' }
    },
    customComponentApprovedDisapprovedFilter: {
      MappedManufacturerCustomPartsOnly: { key: 'true', value: 'Mapped Manufacturer (For Custom Parts Only)' },
      All: { key: 'false', value: 'All Custom Parts Only' }
    },
    WorkorderReviewType: {
      InitalDraft: 'I',
      ChangeRequest: 'C'
    },
    WorkorderReviewStatus: {
      Pending: 'P',
      Accepted: 'A',
      Rejected: 'R'
    },
    WorkorderReviewStatusData: {
      All: { Key: 'All', Value: null },
      Pending: { Key: 'Pending', Value: 'P' },
      Accepted: { Key: 'Approved', Value: 'A' },
      Rejected: { Key: 'Declined', Value: 'R' }
    },
    NotificationSubType: {
      AR: 'AR',
      A: 'A'
    },
    NotificationRequestStatus: {
      Accepted: 'A',
      Rejected: 'R',
      Pending: 'P'
    },
    WorkorderSerialNumberFilterType: {
      SerialNumber: 'SerialNumber',
      Range: 'Range',
      FromQty: 'FromQty'
    },
    WorkorderSerialNumberSelectionType: {
      SerialNumber: 'SerialNumber',
      RangeSelector: 'Range',
      RangeType: {
        Range: 'Range',
        QtyRange: 'FromQty'
      }
    },
    WorkOrderPrefixorSuffix: [
      {
        Key: 'Prefix', Value: true
      },
      { Key: 'Suffix', Value: false }
    ],
    WorkOrderOperationFirstArticleStatus: [
      {
        Key: 'Pass', Value: '1'
      },
      {
        Key: 'Needs Improvement', Value: '2'
      },
      {
        Key: 'WIP', Value: '3'
      }
    ],
    productStatus: [
      {
        id: '1', status: 'Passed'
      },
      {
        id: '2', status: 'Reprocess Required'
      },
      {
        id: '3', status: 'Defect Observed'
      },
      {
        id: '4', status: 'Scrapped'
      },
      {
        id: '5', status: 'Rework Required'
      },
      {
        id: '6', status: 'Board With Missing Parts'
      },
      {
        id: '7', status: 'Bypassed'
      }
    ],
    statusText: {
      Passed: '1',
      Reprocessed: '2',
      DefectObserved: '3',
      Scraped: '4',
      ReworkRequired: '5',
      BoardWithMissingParts: '6',
      Bypassed: '7'
    },
    statusTextValue: {
      Passed: {
        Value: '1',
        Text: 'Passed'
      },
      Reprocessed: {
        Value: '2',
        Text: 'Reprocess Required'
      },
      DefectObserved: {
        Value: '3',
        Text: 'Defect Observed'
      },
      Scraped: {
        Value: '4',
        Text: 'Scrapped'
      },
      ReworkRequired: {
        Value: '5',
        Text: 'Rework Required'
      },
      BoardWithMissingParts: {
        Value: '6',
        Text: 'Board With Missing Parts'
      },
      Bypassed: {
        Value: '7',
        Text: 'Bypassed'
      }
    },
    WorkOrderStatus: [
      {
        Key: '0', Value: 'Draft'
      },
      {
        Key: '1', Value: 'Published'
      },
      { Key: '2', Value: 'Completed' },
      {
        Key: '4', Value: 'Void'
      },
      {
        Key: '5', Value: 'Draft Under Review'
      },
      {
        Key: '6', Value: 'Under Termination'
      },
      {
        Key: '7', Value: 'Terminated'
      },
      {
        Key: '8', Value: 'Published Draft & Review'
      },
      {
        Key: '9', Value: 'Completed With Missing Parts'
      }
    ],
    SerialTypeLabel: {
      MFRSerial: {
        Label: 'MFR Serial#'
      },
      FinalSerial: {
        Label: 'Final Product Serial#'
      }
    },
    BarcodeStatus: [{
      ID: 0,
      Name: 'Draft',
      value: false,
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Published',
      value: true,
      DisplayOrder: 2,
      ClassName: 'label-success'
    }
    ],
    Role: {
      SuperAdmin: 'Super Admin',
      Executive: 'Executive',
      Operator: 'Operator',
      Manager: 'Manager'
    },
    DefaultVersion: 'A',
    WorkorderEntryType: {
      TravellerPage: 'T',
      Manual: 'M'
    },
    AllowedImageUploadSizeForProfileInByte: '3145728',  // 3 MB Size
    NOTIFICATION_MESSAGETYPE: {
      WO_REVIEW: {
        TYPE: 'WO-REVIEW-REQ'
      },
      WO_CHANGE_REVIEW: {
        TYPE: 'WO-CHANGE-REQ-COMMENT'
      },
      WO_REVIEW_COMMENT: {
        TYPE: 'WO-REVIEW-COMMENT'
      },
      WO_REVIEW_COMMENT_STATUS: {
        TYPE: 'WO-REVIEW-COMMENT-STATUS'
      },
      WO_REVIEW_STATUS: {
        TYPE: 'WO-REVIEW-STATUS'
      },
      WO_TRANS_ASSY_DEFECT: {
        TYPE: 'WO-OP-ASSEMBLY-DEFECT-ADDED'
      },
      WO_ASSY_DESIGNATOR: {
        TYPE: 'WO-ASSY-DESIGNATOR'
      },
      WO_ASSY_DESIGNATOR_UPDATE: {
        TYPE: 'WO-ASSY-DESIGNATOR-UPDATE'
      },
      WO_ASSY_DESIGNATOR_REMOVE: {
        TYPE: 'WO-ASSY-DESIGNATOR-REMOVE'
      },
      WO_OP_VERSION_CHANGE: {
        TYPE: 'WO-OP-VERSION-CHANGE'
      },
      WO_VERSION_CHANGE: {
        TYPE: 'WO-VERSION-CHANGE'
      },
      WO_OP_TEAM_CHECKIN: {
        TYPE: 'WO-OP-TEAM-START-ACTIVITY'
      },
      WO_OP_TEAM_CHECKOUT: {
        TYPE: 'WO-OP-TEAM-STOP-ACTIVITY'
      },
      WO_OP_TEAM_PAUSE: {
        TYPE: 'WO-OP-TEAM-PAUSE-ACTIVITY'
      },
      WO_OP_TEAM_RESUME: {
        TYPE: 'WO-OP-TEAM-RESUME-ACTIVITY'
      },
      WO_OP_HOLD: {
        TYPE: 'HALT-WO-OP'
      },
      WO_OP_UNHOLD: {
        TYPE: 'RESUME-WO-OP'
      },
      WO_START: {
        TYPE: 'RESUME-WO'
      },
      WO_STOP: {
        TYPE: 'HALT-WO'
      },
      EQUIPMENT_ONLINE: {
        TYPE: 'EQUIPMENT-ONLINE'
      },
      EQUIPMENT_OFFLINE: {
        TYPE: 'EQUIPMENT-OFFLINE'
      },
      CHAT_MESSAGE: {
        TYPE: 'chat-message'
      },
      WO_PREPROG_DESIGNATOR: {
        TYPE: 'WO-PRE-PROG-COMP-DESIGNATOR-ADD'
      },
      WO_PREPROG_DESIGNATOR_REMOVE: {
        TYPE: 'WO-PRE-PROG-COMP-DESIGNATOR-REMOVE'
      },
      WO_TRANS_PREPROG_COMP: {
        TYPE: 'WO-OP-PRE-PROG-COMPONENT-ADDED'
      },
      WO_PRODUCTION_START_AS_FIRST_CHECKIN: {
        TYPE: 'wo-production-start-as-first-checkin'
      },
      WO_OP_TEAM_REPROCESS_QTY_UPDATE: {
        TYPE: 'WO-OP-TEAM-UPDATE-REPROCESS-QTY'
      },
      WO_REWORK_OP_DEFECT_CHANGE_DPMO: {
        TYPE: 'wo-rework-op-defect-change-dpmo'
      },
      WO_REVIEW_CO_OWNER: {
        TYPE: 'WO-CO-OWNER-ADD'
      },
      REMOVE_EMP_FROM_WO_REQ_REVIEW: {
        TYPE: 'REMOVE_EMP_WO_REQ_REVIEW'
      },
      PO_START: {
        TYPE: 'RESUME-PO'
      },
      PO_STOP: {
        TYPE: 'HALT-PO'
      },
      KIT_ALLOCATION_START: {
        TYPE: 'RESUME-KIT ALLOCATION'
      },
      KIT_ALLOCATION_STOP: {
        TYPE: 'HALT-KIT ALLOCATION'
      },
      KIT_RELEASE_START: {
        TYPE: 'RESUME-KIT RELEASE'
      },
      KIT_RELEASE_STOP: {
        TYPE: 'HALT-KIT RELEASE'
      }
    },
    /* for binding in ui-grid header filter note required in eco category values list*/
    noteRequiredStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: '1', value: 'Yes'
      },
      {
        id: '0', value: 'No'
      }
    ],
    /* for binding in ui-grid header filter note required in quote terms & condition category values list*/
    multiselectStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Single Select', value: 'Single Select'
      },
      {
        id: 'Multi Select', value: 'Multi Select'
      }
    ],

    /* For Bind sort drop-down defect log directive*/
    SortOption: {
      Order: 1,
      MostPopular: 2,
      Name: 3
    },
    SortOptionDropDown: [
      {
        key: 1, value: 'Order'
      },
      {
        key: 2, value: 'Most Popular'
      },
      {
        key: 3, value: 'Name'
      }
    ],
    /* For Bind sort drop-down preprogram component directive*/
    SorComponentOption: {
      Order: 1,
      Name: 3
    },
    SortComponentOptionDropDown: [
      {
        key: 1, value: 'Order'
      },
      {
        key: 3, value: 'Name'
      }
    ],

    HaltResumePopUp: {
      Cancel: 'Cancel',
      Halt: 'Halt',
      Resume: 'Resume',
      HaltReason: 'Reason',
      ResumeReason: 'Reason',
      HaltKitAllocation: 'Halt Kit Allocation',
      ResumeKitAllocation: 'Resume Kit Allocation',
      HaltKitRelease: 'Halt Kit Release',
      ResumeKitRelease: 'Resume Kit Release',
      HaltSalesOrder: 'Halt PO/SO',
      ResumeSalesOrder: 'Resume PO/SO',
      HaltStatus: 'H',
      ResumeStatus: 'R',
      refTypeKA: 'KA',
      refTypeKR: 'KR',
      refTypePO: 'PO',
      refTypeWO: 'WO',
      refTypeSINV: 'SINV',
      refTypeSCM: 'SCM',
      refTypeSDM: 'SDM',
      stopImageClass: 'wo-stop-image',
      stopImagePath: 'assets/images/logos/stop.png',
      resumeFileName: 'resume.png',
      KitAllocationHaltLabel: 'Kit Allocation Halted',
      kitReleaseHaltLabel: 'Kit Release Halted',
      POHaltLabel: 'PO/SO Halted',
      HaltWorkOrder: 'Halt WO',
      ResumeWorkOrder: 'Resume WO',
      POSOLabel: 'PO/SO',
      HaltInvoice: 'Halt Invoice',
      ResumeInvoice: 'Resume Invoice',
      HaltCreditMemo: 'Halt Credit Memo',
      ResumeCreditMemo: 'Resume Credit Memo',
      HaltDebitMemo: 'Halt Debit Memo',
      ResumeDebitMemo: 'Resume Debit Memo'
    },
    TransferStockUnallocateUMIDHistoryPopup: {
      CancelButton: 'CANCEL',
      SaveButton: 'SAVE',
      HeaderLabel: 'Unallocated UMID Xfer History',
      ReasonLabel: 'Reason',
      PasswordLabel: 'Password'
    },
    RohsStatusMismatchConfirmationPopup: {
      CancelButton: 'CANCEL',
      ConfirmButton: 'CONFIRM',
      HeaderLabel: ' Mismatch RoHS Status',
      ReasonLabel: 'Reason',
      PasswordLabel: 'Password',
      DisplayNoteUMID: 'RoHS Status of Part <b>{0}</b> and UMID are mismatched. Please enter a reason to allocate UMID with different RoHS status.',
      DisplayNoteKIT: 'RoHS Status of Part(s) <b>{0}</b> and UMID(s) <b>{1}</b> are mismatched. Please enter a reason to allocate UMID with different RoHS status.'
    },
    BuyAndStockTypeMismatchConfirmationPopup: {
      CancelButton: 'CANCEL',
      ConfirmButton: 'CONFIRM',
      HeaderLabel: 'Kit Allocation Confirmation',
      DisplayNoteForInternalStockForKit: 'Part(s) <b>{0}</b> is provide by customer and UMID(s) of this part <b>{1}</b> is contain in Internal Stock. Please enter a reason to allocate UMID for confirmation.',
      DisplayNoteForCustomerStockForKit: 'Part(s) <b>{0}</b> is not provide by customer and UMID(s) of this part <b>{1}</b> is contain in Customer Stock. Please enter a reason to allocate UMID for confirmation.',
      DisplayNoteForInternalStockForUMID: 'Part <b>{0}</b> is provide by customer and UMID of this part will be contain in Internal Stock. Please enter a reason to allocate UMID for confirmation.',
      DisplayNoteForCustomerStockForUMID: 'Part <b>{0}</b> is not provide by customer and UMID of this part wiil be contain in Customer Stock. Please enter a reason to allocate UMID for confirmation.'
    },
    EmableDisableSupplierConfirmationPopup: {
      CancelButton: 'CANCEL',
      ConfirmButton: 'CONFIRM',
      HeaderLabel: 'Supplier Enable/Disable Confirmation',
      DisplayNoteForEnableDisableSupplier: 'It will {0} Supplier API request for all users. Please enter a reason to proceed for confirmation.'
    },
    WhereUsedPurchaseInspectionRequirementPopup: {
      TransactionTypeLabel: 'Transaction Type',
      TransactionLabel: 'Transaction'
    },
    MasterPage: {
      Employee: 'Employee(s)',
      EcoTypeCategory: 'Eco category(s)',
      EcoTypeValues: 'Eco category value(s)',
      Customer: 'Customer(s)',
      Supplier: 'Supplier(s)',
      CertificateStandard: 'Standard(s)',
      Department: 'Department(s)',
      GenericCategory: '{0}',
      MasterTemplate: 'Operation Management(s)',
      Operation: 'Operation(s)',
      Workorder: 'Work Order(s)',
      Role: 'Role(s)',
      Equipment: 'Equipment(s)',
      StandardClass: 'Standard category(s)',
      DataElement: 'Data element(s)',
      WorkorderCluster: 'Work Order Cluster',
      PreprogramComponent: 'Pre program component',
      WorkorderOperation: 'Work Order operation(s)',
      WorkorderPart: 'Work Order part(s)',
      WorkorderEquipment: 'Work Order equipment(s)',
      WorkorderOperationPart: 'Work Order operation part(s)',
      WorkorderEmployee: 'Work Order personnel(s)',
      Component: 'Component(s)'
    },
    Workorder_Operation_Tabs: {
      Details: {
        ID: 'WOOP_1', Name: 'Details', Type: 'detail', Route: 'app.workorder.manage.operation.details'
      },
      DoDont: {
        ID: 'WOOP_2', Name: 'Do\'s & Don\'ts', Type: 'dodont', Route: 'app.workorder.manage.operation.dodont'
      },
      Document: {
        ID: 'WOOP_3', Name: 'Documents', Type: 'document', Route: 'app.workorder.manage.operation.documents'
      },
      DataFields: {
        ID: 'WOOP_4', Name: 'Data Fields', Type: 'datafields', Route: 'app.workorder.manage.operation.datafields'
      },
      SupplyAndMaterial: {
        ID: 'WOOP_5', Name: 'Supplies, Materials & Tools', Type: 'supplyandmaterial', Route: 'app.workorder.manage.operation.parts'
      },
      EquipmentAndTools: {
        ID: 'WOOP_6', Name: 'Equipments', Type: 'equipmentandtool', Route: 'app.workorder.manage.operation.equipments'
      },
      Employee: {
        ID: 'WOOP_7', Name: 'Personnel', Type: 'employee', Route: 'app.workorder.manage.operation.employees'
      },
      FirstArticle: {
        ID: 'WOOP_8', Name: '1st Article', Type: '1starticle', Route: 'app.workorder.manage.operation.firstarticle'
      },
      //Status: { ID: 'WOOP_9', Name: 'Status', Type: 'status', Route: 'app.workorder.manage.operation.status' },
      OtherDetails: {
        ID: 'WOOP_10', Name: 'MISC', Type: 'otherdetail', Route: 'app.workorder.manage.operation.otherdetails'
      }
    },
    Workorder_Tabs: {
      Details: {
        ID: 'WO_1', Name: 'Details', Type: 'detail', Route: 'app.workorder.manage.details'
      },
      Standards: {
        ID: 'WO_2', Name: 'Standards', Type: 'standard', Route: 'app.workorder.manage.standards'
      },
      Document: {
        ID: 'WO_3', Name: 'Documents', Type: 'document', Route: 'app.workorder.manage.documents'
      },
      Operations: {
        ID: 'WO_4', Name: 'Operations', Type: 'operationmain', Route: 'app.workorder.manage.operations'
      },
      SupplyAndMaterial: {
        ID: 'WO_5', Name: 'Supplies, Materials & Tools', Type: 'supplyandmaterial', Route: 'app.workorder.manage.parts'
      },
      EquipmentAndTools: {
        ID: 'WO_6', Name: 'Equipments', Type: 'equipmentandtool', Route: 'app.workorder.manage.equipments'
      },
      Employee: {
        ID: 'WO_7', Name: 'Personnel', Type: 'employee', Route: 'app.workorder.manage.employees'
      },
      DataFields: {
        ID: 'WO_8', Name: 'Data Fields', Type: 'datafields', Route: 'app.workorder.manage.datafields'
      },
      OtherDetails: {
        ID: 'WO_9', Name: 'MISC', Type: 'otherdetail', Route: 'app.workorder.manage.otherdetails'
      },
      InvitePeople: {
        ID: 'WO_10', Name: 'Review Group Members', Type: 'invitepeople', Route: 'app.workorder.manage.invitepeople'
      }
    },

    DynamicMasterEntityTreeTabs: {
      DataElementList: {
        ID: 'ENTITYLIST_DT1', Name: 'Record List', Type: 'customforms-dataelementlist',
        Route: '/customformsentity/dataelementlist/:entityID', State: 'app.customformsentity.dataelementlist'
      },
      ManageDataElement: {
        ID: 'MANAGEENTITY_DT2', Name: 'Add Record', Type: 'customforms-managedataelement',
        Route: '/customformsentity/managedataelement/:entityID/', State: 'app.customformsentity.managedataelement'
      }
    },

    UserProfileTabs: {
      Detail: { ID: 0, Name: 'Details' },
      Security: { ID: 1, Name: 'Role And Page Rights' },
      Settings: { ID: 2, Name: 'User Settings' },
      Preferences: { ID: 3, Name: 'User Preferences' },
      UserSignUpAgreement: { ID: 4, Name: 'User Signup Agreement' }
    },

    CompanyProfileTabs: {
      Details: { ID: 0, Name: 'Details' },
      Addresses: { ID: 1, Name: 'Addresses' },
      RemittanceAddress: { ID: 2, Name: 'Remittance Address' },
      Contacts: { ID: 3, Name: 'Contacts' },
      CompanyPreference: { ID: 4, Name: 'Company Preferences' }
    },

    // [S] filter expression objects
    ALL_OPERATOR: [{
      'Name': 'EqualTo', 'Value': '=', 'KEY_CODE': 187
    },
    {
      'Name': 'Not EqualTo', 'Value': '!=', 'KEY_CODE': null
    },
    {
      'Name': 'Greater Than', 'Value': '>', 'KEY_CODE': 190
    },
    {
      'Name': 'Less Than', 'Value': '<', 'KEY_CODE': 188
    },
    { 'Name': 'Greater Than Or EqualTo', 'Value': '>=', 'KEY_CODE': null },
    {
      'Name': 'Less Than Or EqualTo', 'Value': '<=', 'KEY_CODE': ''
    },
    {
      'Name': 'Contains', 'Value': 'like', 'KEY_CODE': ''
    },
    {
      'Name': 'Does Not Contain', 'Value': 'not like', 'KEY_CODE': ''
    },
    {
      'Name': 'Starts With', 'Value': 'start with', 'KEY_CODE': ''
    },
    {
      'Name': 'Ends With', 'Value': 'end with', 'KEY_CODE': ''
    },
    { 'Name': 'Is Null', 'Value': 'is null', 'KEY_CODE': '' },
    { 'Name': 'Is Not Null', 'Value': 'is not null', 'KEY_CODE': '' }
    ],
    DATE_AND_NUMBER_OPERATOR: [{
      'Name': 'Equal To', 'Value': '='
    },
    {
      'Name': 'Not EqualTo', 'Value': '<>'
    },
    {
      'Name': 'GreaterThan', 'Value': '>'
    },
    {
      'Name': 'LessThan', 'Value': '<'
    },
    { 'Name': 'Greater Than Or EqualTo', 'Value': '>=' },
    {
      'Name': 'Less Than Or EqualTo', 'Value': '<='
    },
    {
      'Name': 'Is Null', 'Value': 'is null'
    },
    {
      'Name': 'Is Not Null', 'Value': 'is not null'
    }],
    DATE_OPERATOR: [{ 'Name': 'Equal To', 'Value': '=' },
    {
      'Name': 'Not EqualTo', 'Value': '<>'
    },
    {
      'Name': 'GreaterThan', 'Value': '>'
    },
    {
      'Name': 'LessThan', 'Value': '<'
    },
    {
      'Name': 'Greater Than Or EqualTo', 'Value': '>='
    },
    {
      'Name': 'Less Than Or EqualTo', 'Value': '<='
    },
    {
      'Name': 'Is Null', 'Value': 'is null'
    },
    { 'Name': 'Is Not Null', 'Value': 'is not null' },
    {
      'Name': 'Equal To System Date', 'Value': '= {SYS_DATE}'
    },
    {
      'Name': 'Not EqualTo System Date', 'Value': '<> {SYS_DATE}'
    },
    {
      'Name': 'GreaterThan System Date', 'Value': '> {SYS_DATE}'
    },
    {
      'Name': 'LessThan System Date', 'Value': '< {SYS_DATE}'
    },
    {
      'Name': 'Greater Than Or EqualTo System Date', 'Value': '>= {SYS_DATE}'
    },
    {
      'Name': 'Less Than Or EqualTo System Date', 'Value': '<= {SYS_DATE}'
    }],
    TEXT_OPERATOR: [{
      'Name': 'EqualTo', 'Value': '='
    },
    {
      'Name': 'Not EqualTo', 'Value': '<>'
    },
    {
      'Name': 'Contains', 'Value': 'like'
    },
    {
      'Name': 'Does Not Contain', 'Value': 'not like'
    },
    { 'Name': 'Starts With', 'Value': 'start with' },
    {
      'Name': 'Ends With', 'Value': 'end with'
    },
    {
      'Name': 'Is Null', 'Value': 'is null'
    },
    {
      'Name': 'Is Not Null', 'Value': 'is not null'
    }],
    BOOLEAN_OPERATOR: [{ 'Name': 'Equal To', 'Value': '=' },
    {
      'Name': 'Not EqualTo', 'Value': '<>'
    },
    {
      'Name': 'Is Null', 'Value': 'is null'
    },
    {
      'Name': 'Is Not Null', 'Value': 'is not null'
    }],
    AIRTHMETIC_ALL_OPERTAOR: [{
      'Name': 'Addition', Value: '+', 'KEY_CODE': 107
    },
    {
      'Name': 'Subtraction', Value: '-', 'KEY_CODE': 109
    },
    {
      'Name': 'Multiplication', Value: '*', 'KEY_CODE': 106
    },
    {
      'Name': 'Division', Value: '/', 'KEY_CODE': 111
    },
    {
      'Name': 'Modulus', Value: '%', 'KEY_CODE': 53
    },
    { 'Name': 'Opening Bracket', Value: '(', 'KEY_CODE': 219 },
    { 'Name': 'Closing Bracket', Value: ')', 'KEY_CODE': 221 }],
    OPERATOR_FILTER_TYPE: {
      DATE_AND_NUMBER_OPERATOR: 1,
      TEXT_OPERATOR: 2,
      BOOLEAN_OPERATOR: 3,
      ALL_OPERATOR: 4,
      NUMBER_OPERATOR: 5,
      DATE_OPERATOR: 6
    },
    ENTERPRICE_ADVANCE_SEARCH_CONDITION: ['Should', 'Must', 'Must not', 'Contain', 'Start with', 'End with'],
    CONDITIONS: ['AND', 'OR'],
    OPTIONTYPES: ['Column', 'Expression'],
    BOOLEANLIST: [
      {
        Name: 'True',
        Value: 1
      },
      {
        Name: 'False',
        Value: 0
      }
    ],
    DATATYPE: {
      BOOLEAN: ['tinyint'],
      NUMBER: ['int', 'bigint', 'decimal'],
      STRING: ['varchar', 'text', 'longtext'],
      DATE: ['datetime', 'date'],
      TIME: ['time']
    },
    SYMBOL: {
      LESS_THAN_SYMBOL: '<',
      GREATER_THAN_SYMBOL: '>',
      GREATER_THAN_OR_EQUAL_SYMBOL: '>=',
      LESS_THAN_OR_EQUAL_SYMBOL: '<=',
      LIKE: 'like',
      START_WITH: 'start with',
      END_WITH: 'end with',
      EQUAL_TO_SYMBOL: '=',
      NOT_LIKE: 'not like',
      NOT_EQUAL_TO_SYMBOL: '<>'
    },
    ALL_OPERATOR_JS_EXP: {
      '=': ' {0} == {1}',
      '<>': '{0} != {1}',
      '>': '{0} > {1}',
      '<': '{0} < {1}',
      '>=': '{0} >= {1}',
      '<=': '{0} <= {1}',
      'like': '({0}).indexOf({1}) != -1',
      'not like': '({0}).indexOf({1}) == -1',
      'start with': '({0}).startsWith({1})',
      'end with': '({0}).endsWith({1})',
      'is null': '{0} == null',
      'is not null': '{0} != null',
      '= {SYS_DATE}': '{0} == new Date()',
      '<> {SYS_DATE}': '{0} != new Date()',
      '> {SYS_DATE}': '{0} > new Date()',
      '< {SYS_DATE}': '{0} < new Date()',
      '>= {SYS_DATE}': '{0} >= new Date()',
      '<= {SYS_DATE}': '{0} <= new Date()'
    },
    OPTIONTYPES_JS_EXP: ['Field', 'Expression'],
    CONDITIONS_JS_EXP: {
      'AND': '&&', 'OR': '||'
    },
    DATE_FORMATES: [
      { name: 'Year', value: '%y' },
      {
        name: 'Month', value: '%m'
      },
      {
        name: 'Date', value: '%d'
      }
    ],
    // [E] filter expression objects


    FILE_FOLDER: {
      FOLDER: 'Folder'
    },
    EXCLUDE_PAGE: ['app.401', 'app.404', 'app.501', 'app.comingsoon', 'app.loginresponse',
      'app.pageright', 'app.pricing', 'app.dbscript', 'app.diffchecker', 'app.resetpassword', 'app.helpblog.helpblogdetail'
      , 'app.notification'], //, 'app.userprofile'
    /* As in some case not able to mange current page state so used URL, like 1.when go for login and current state is login 2.on token expired need to find last page state from custom http interceptor factory. */
    EXCLUDE_PAGE_URLS: ['#!/401', '#!/404', '#!/501', '#!/comingsoon', '#!/loginresponse', '#!/dbscript', '#!/pageright', '#!/pricing', '#!/helpblogdetail', '#!/helpblogdetail'],
    MISCommonReportType: {
      Detail: 1,
      Summary: 2
    },
    MainTitle: {
      Operation: 'Operation',
      Does: 'Do\'s',
      Donts: 'Don\'ts',
      Instruction: 'Instruction',
      OperationDataFields: 'Operation Data Fields',
      WorkorderDataFields: 'Work Order Data Fields',
      Standards: 'Standards',
      Equipment: 'Equipments',
      SupplyAndMaterial: 'Supplies, Materials & Tools',
      WorkingCondition: 'Job Specific Requirement',
      Employee: 'Personnel',
      ManagementInstruction: 'Management Instruction',
      DeferredInstruction: 'Deferred Instruction',
      Documents: 'Documents',
      CheckIn: 'Start Activity',
      CheckOut: 'Stop Activity',
      Resume: 'Resume Activity',
      History: 'History',
      EquipmentDataFields: 'Equipment Data Fields',
      FirstArticle: '1st Article',
      Production: 'Production',
      Workorder: 'Workorder',
      CustomerPersonnelMapping: 'Customer Persgnnel Mapping',
      Op_Template: 'Template(s)',
      Operations: 'Operation(s)'
    },
    SERIAL_TYPE: {
      MANUFACTURE: 1,
      PACKING: 2
    },
    BARCODE_DELIMITER_DATATYPE: [
      {
        ID: 0, dataTypeName: 'Alphanumeric'
      },
      {
        ID: 1, dataTypeName: 'Number'
      }
    ],
    LABELTEMPLATE_DEFAULTLABELTYPE: [
      {
        ID: null, name: 'Select'
      },
      {
        ID: 'B', name: 'Bin'
      },
      {
        ID: 'R', name: 'Rack'
      },
      {
        ID: 'U', name: 'UMID'
      },
      {
        ID: 'W', name: 'Warehouse'
      },
      {
        ID: 'SM', name: 'Search Material'
      },
      {
        ID: 'R', name: 'Serial#'
      }
    ],
    BARCODE_DELIMITER_FIELDTYPE: [
      { ID: 0, Value: 'Manual' },
      {
        ID: 1, Value: 'Dynamic'
      }
    ],

    PO_STATUS_REPORT: {
      //PartNumber: 'PO Number',
      Assembly: 'Assembly',
      WorkOrder: 'WorkOrder',
      PartNumberType: 'detail',
      AssemblyType: 'operationmain',
      WorkOrderType: 'supplyandmaterial',
      Customer: 'Customer',
      CustomerType: 'folder',
      SalesOrder_PO_Numer: 'PONumber',
      ToolTip_Format: '{0}: {1}',
      Tree_ID_Format: '{0}_{1}',
      Sales_Order_Det_As_Assembly: 'SalesOrderDetAsAssy',
      WO_SO_Det_As_WorkOrder: 'WoSoDetAsWorkOrder',
      Initial_Stock: 'InitialStock',
      displayReportFor: {
        customer: 'customer',
        po: 'po',
        assembly: 'assembly',
        workorder: 'workorder',
        initialStock: 'initialstock'
      },
      PO_Assy_LineID_Format: '{0} ({1})',
      PO_Assy_LineID_ToolTip_Format: '{0} (LineID): {1}'
    },
    COMPONENT_ALIAS: {
      Alias: 'Alias',
      PackagingAlias: 'Packaging Alias',
      AlternateAlias: 'Alternate Part',
      Mfg: 'MFG'
    },
    BARCODE_DELIMITER_COLOR: ['#00FF7F', '#E6E6FA', '#D8BFD8', '#8FBC8F', '#ffb2b2', '#ccccff', '#9acd32', '#ffe4b5', '#cccc00', '#9999ff', '#ffff00', '#FF6E74', '#ee82ee', '#89D955', '#66CCCC', '#CA881E',
      '#FFC7B3', '#ACFFEE', '#E6E610', '#2D6AF1', '#EBA82F', '#ADC987', '#BBF1F1', '#DD7189', '#99B7BC'],
    FEATURE_NAME: {
      ToggleOperation: 'Resume/Halt Operation',
      ToggleWorkorder: 'Resume/Halt Work Order',
      TerminateWorkorder: 'Terminate & Transfer Work Order',
      AllowNarrativeDetails: 'Allow Narrative Details',
      ChangeWOStatus: 'Change Work Order Status',
      EditOperation: 'Update Operation',
      ChangeTravelerHistory: 'Change Traveler History',
      AddMISReport: 'Add MIS Report',
      EditMISReport: 'Update & Invite Personnel MIS Report',
      DeleteMISReport: 'Delete MIS Report',
      EditMFGCode: 'Update Manufacturer Code',
      SuggestAlternatePartOnBOM: 'Suggest Alternate Part On BOM',
      SuggestRoHSReplacementPartOnBOM: 'Suggest RoHS Replacement Part On BOM',
      DeleteBOM: 'Delete BOM',
      DeletePart: 'Delete Part',
      UpdatePartMasterAutoEntry: 'Update Part Master Auto Entry',
      AllowIncorrectPartCreation: 'Allow to create incorrect part (Part Master and Add Part Popup both)',
      UpdatePartsAttributes: 'Update Parts Attributes From List Page',
      UpdatePartsMPNPID: 'Update Part Name MPN and PID',
      ChangeInitialQuantity: 'Change Initial Quantity',
      CorrectIncorrectPartSetting: 'Modify Correct/Incorrect Part status (Part Master)',
      MappingManufacturer: 'Mapping Invalid Manufacturer',
      AllowRestrictWithPermission: 'Allow Restrict With Permission',
      TransferWHToWHToOtherDepartment: 'Warehouse To Warehouse Transfer To another Department',
      AllowDesignReport: 'Allow Design Report',
      AllowToAddReport: 'Allow to Add Report',
      UnallocatedUMIDTransfer: 'Unallocated UMID Transfer',
      AllowToModifyPaymentDetails: 'Allow to Modify Payment Details',
      AllowToVoidAndReIssuePayment: 'Allow to Void, Void & Reissue Payment',
      AllowToVoidAndReIssueRefund: 'Allow to Void, Void & Reissue Refund',
      AllowToVoidAndReleaseCustCM: 'Allow to Void Applied CM & Release Invoice Group',
      AllowToDeleteOtherPartNames: 'Allow to Delete Other Part Names',
      DeleteSerialNo: 'Delete Serial No',
      StopExternalPartUpdate: 'Stop External Part Update',
      SupplierInvoiceApproval: 'Supplier Invoice Approval',
      AllowToLockUnlockCustomerPayment: 'Allow to Lock/Unlock Customer Payment',
      AllowToPermanentDeleteDocument: 'Allow to Permanent Delete Document',
      AllowToRestoreDocument: 'Allow to Restore Document',
      AllowToVoidAndReIssueCustomerPayment: 'Allow to Void, Void & Re-Receive Customer Payment',
      AllowToLockCustomerInvoice: 'Allow to Lock/Unlock Customer Invoice',
      AllowToLockCustomerCreditMemo: 'Allow to Lock/Unlock Customer Credit Memo',
      AllowToLockCustomerPackingSlip: 'Allow to Lock Customer Packing Slip',
      AllowToAddUnitPriceAtCustomerPackingSlip: 'Allow to Add Price Details At Customer Packing Slip',
      AllowToCompletePurchaseOrderManually: 'Allow to Complete Purchase Order Manually',
      AllowToAddUpdateHelpBlogNotes: 'Allow to Add/Update Help Blog Note',
      AllowToDeleteHelpBlogNotes: 'Allow to Delete Help Blog Note',
      AllowToLockSupplierPackingSlip: 'Allow to Lock Supplier Packing Slip',
      AllowToLockSupplierInvoice: 'Allow to Lock Supplier Invoice',
      AllowToLockSupplierDebitMemo: 'Allow to Lock Supplier Debit Memo',
      AllowToLockSupplierCreditMemo: 'Allow to Lock Supplier Credit Memo',
      AllowToLockSupplierPayment: 'Allow to Lock/Unlock Supplier Payment',
      AllowToLockSupplierRMA: 'Allow to Lock Supplier RMA',
      AllowToLockSupplierRefund: 'Allow to Lock/Unlock Supplier Refund',
      AllowToCancelPO: 'Allow to Cancel PO / Undo Cancellation',
      AllowToChangeCustPackingSlipAndInvoiceTrackingNumber: 'Allow to Add/Update/Delete Tracking# At Customer Packing Slip and Customer Invoice',
      AllowToEnableDisableExternalAPI: 'Allow to Enable/Disable Supplier API Request for All Users',
      AllowToVoidCustWriteOffAndReleaseInv: 'Allow to Void Applied WOFF & Release Invoice Group',
      AllowToDeleteMPNFromCPNMapping: 'Allow to delete CPN mapping',
      AllowToTakePictureViaIP: 'Allow to Take Picture (IP Webcam) in Document',
      AllowToVoidCustomerRefund: 'Allow to Void Customer Refund',
      AllowToLockUnlockCustomerWriteOff: 'Allow to Lock/Unlock Customer Write Offs',
      AllowToLockUnlockCustomerRefund: 'Allow to Lock/Unlock Customer Refund',
      AllowToLockUnlockCustomerAppliedCM: 'Allow to Lock/Unlock Customer Applied Credit Memo',
      AllowToChangeKitLineCustConsignStatus: 'Allow to Change Kit Allocation Customer Consign Status',
      AllowViewUpdateCommentsAtShipmentSummary: 'Allow to View/Update PO Header Internal Notes, Release Notes, WO Comment, TBD Comment and Int. Notes at Customer Open Sales Order and Shipment Summary',
      AllowToLockUnlockPurchaseOrder: 'Allow to Lock/Unlock Purchase Order',
      AllowToOpenPurchaseOrderManually: 'Allow to Open Purchase Order Manually',
      AllowToEnableDisableBaseUOM: 'Allow to Change Base UOM',
      AllowAddAliasParts: 'Allow to Add/Update/Delete Part Packaging Alias',//Allow to Add Packaging Alias Part',
      AllowToUpdateDeleteActivityEntryManually: 'Allow to Update/Delete Activity Entry Manually',
      AllowToUpdateContactPerson: 'Allow to Update Contact Person',
      AllowToDeleteContactPerson: 'Allow to Delete Contact Person',
      AllowToUpdateAddress: 'Allow to Update Address for Customer/Supplier/Manufacturer',
      AllowToDeleteAddress: 'Allow to Delete Address for Customer/Supplier/Manufacturer',
      AllowToChangeSOWorkingStatus: 'Allow Sales Order Manual Completion, Reopening & Cancelling Authorization',
      AllowToUpdateUMIDDateCodeFormat: 'Allow to Update UMID Date Code Format'
    },
    OPSTATUSLABLEPUBLISH: 'Publish To Use',
    OPSTATUSLABLEDRAFT: 'Draft To Edit',
    OPSTATUSLABLEDRAFTED: 'Locked',
    OPSTATUSLABLELOCK: 'Lock To Pay',
    CUSTOMERAPPROVALFOR: {
      QPA_REFDES: 'QPAREFDES',
      BUY: 'Buy',
      POPULATE: 'Populate',
      CPN: 'CPN',
      DNP_BUY: 'BuyDNPQty',
      DNP_QPA_REFDES: 'DNPQPAREFDES',
      KitAllocationNotRequired: 'KitAllocationNotRequired',
      ApprovedMountingType: 'ApprovedMountingType'
    },
    CUSTPN_FORMAT: '{0} Rev{1}',
    SHIPPING_REQUEST_STATUS: {
      PUBLISHED: 'P',
      DRAFT: 'D'
    },
    SHIPPING_REQUEST_STATUS_DROPDOWN: {
      Published: 1,
      Draft: 0
    },
    SHIPPING_REQUEST_VERIFY_STATUS: [{
      id: 'VERIFIED', value: 'Verified'
    }, {
      id: 'PENDING', value: 'Pending'
    }],
    TIMLINE: {
      eventAction: {
        CREATE: 1,
        UPDATE: 2,
        DELETE: 3,
        GENERICFILE_DOWNLOAD: 4,
        MOVE_GENERICFILE_TO_FOLDER: 5,
        MOVE_FOLDER_TO_OTHER_FOLDER: 6,
        GENERICFILE_PREVIEW: 7,
        GENERICFILE_EDIT: 8,
        PRINT: 9,
        GENERICFILE_DISABLE: 10,
        GENERICFILE_ENABLE: 11
      }
    },
    EVENT: {
      logOutUserFromAllDevices: 'logOutUserFromAllDevices:receive',
      logOutDeletedUserFromAllDevices: 'logOutDeletedUserFromAllDevices:receive',
      reloadPageOnOverrideUser: 'reloadPageOnOverrideUser:receive'
    },
    TIMELINE_EVENTS: {
      LOGIN: {
        id: 1,
        action: 'Login',
        icon: 'icon-login'
      },
      LOGOUT: {
        id: 2,
        action: 'Logout',
        icon: 'icon-logout'
      },
      NAVIGATE: {
        id: 3,
        action: 'Navigation',
        icon: 'icon-map-marker'
      },
      WORKORDER: {
        id: 4,
        action: 'Work Order',
        icon: 'icon-format-list-numbers',
        WORKORDER_SERIALMST: {
          id: 4.01,
          action: 'Work Order Serial Master',
          icon: 'icon-receipt'
        },
        TASK_CONFIRMATION: {
          id: 4.02,
          action: 'Work Order Task Confirmation',
          icon: 'icon-receipt'
        },
        WORKORDER_CERTIFICATION: {
          id: 4.03,
          action: 'Work Order Certification',
          icon: 'icon-verified'
        },
        WORKORDER_CLUSTER: {
          id: 4.04,
          action: 'Work Order Cluster',
          icon: 'icon-cog-box'
        },
        WORKORDER_SALESORDER_DETAILS: {
          id: 4.05,
          action: 'Work Order Sales Order Details',
          icon: 'icon-receipt'
        },
        WORKORDER_REQFORREVIEW: {
          id: 4.06,
          action: 'Work Order Request For Review',
          icon: 'icon-account-multiple-plus'
        },
        WORKORDER_REQREVINVITEDEMP: {
          id: 4.07,
          action: 'Work Order Request Review Invited Personnel',
          icon: 'icon-account-multiple-plus'
        },
        WORKORDER_REQREVCOMMENTS: {
          id: 4.08,
          action: 'Work Order Request Review Comments',
          icon: 'icon-comment-outline'
        },
        WORKORDER_OPERATION: {
          id: 4.09,
          action: 'Work Order Operation',
          icon: 'icon-cog-box'
        },
        WORKORDER_OPERATION_DATAELEMENT: {
          id: 4.10,
          action: 'Work Order Operation Data Element',
          icon: 'icon-spotlight'
        },
        WORKORDER_OPERATION_DATAELEMENT_ROLE: {
          id: 4.11,
          action: 'Work Order Operation Data Element Role',
          icon: 'icon-spotlight'
        },
        WORKORDER_OPERATION_EMPLOYEE: {
          id: 4.12,
          action: 'Work Order Operation Personnel',
          icon: 'icon-account-box-outline'
        },
        WORKORDER_OPERATION_EQUIPMENT: {
          id: 4.13,
          action: 'Work Order Operation Equipment',
          icon: 'icon-etsy'
        },
        WORKORDER_OPERATION_EQUIPMENT_DATAELEMENT: {
          id: 4.14,
          action: 'Work Order Operation Equipment Data Field',
          icon: 'icon-etsy'
        },
        WORKORDER_OPERATION_PART: {
          id: 4.15,
          action: 'Work Order Operation Part',
          icon: 'icon-memory'
        },
        WORKORDER_OPERATION_FIRSTPIECE: {
          id: 4.16,
          action: 'Work Order Operation First Piece',
          icon: 'icon-numeric'
        },
        ECO_REQUEST: {
          id: 4.17,
          action: 'Eco Request',
          icon: 'icon-account'
        },
        ECO_REQUEST_DEPARTMENT_APPROVAL: {
          id: 4.18,
          action: 'Eco Request Department Approval',
          icon: 'icon-account'
        },
        WORKORDER_OPERATION_CLUSTER: {
          id: 4.19,
          action: 'Work Order Operation Cluster',
          icon: 'icon-cog-box'
        },
        DATAELEMENT_TRANSACTIONVALUES_FOR_WORKORDER: {
          id: 4.20,
          action: 'Data Fields For Work Order',
          icon: 'icon-receipt'
        },
        DATAELEMENT_TRANSACTIONVALUES_FOR_WORKORDER_OPERATION: {
          id: 4.21,
          action: 'Data Fields For Work Order Operation',
          icon: 'icon-receipt'
        },
        GENERICFILES_FOR_WORKORDER: {
          id: 4.22,
          action: 'Document For Work Order',
          icon: 'icon-library-books'
        },
        GENERICFILES_FOR_WORKORDER_OPERATION: {
          id: 4.23,
          action: 'Document For Work Order Operation',
          icon: 'icon-library-books'
        },
        GENERICFILES_FOR_WORKORDER_ECOREQUEST: {
          id: 4.24,
          action: 'Document For Work Order ECO Request',
          icon: 'icon-library-books'
        },
        GENERICFOLDER_FOR_WORKORDER: {
          id: 4.25,
          action: 'Document Folder For Work Order',
          icon: 'icon-folder'
        },
        GENERICFOLDER_FOR_WORKORDER_OPERATION: {
          id: 4.26,
          action: 'Document Folder For Work Order Operation',
          icon: 'icon-folder'
        },
        GENERICFOLDER_FOR_WORKORDER_ECOREQUEST: {
          id: 4.27,
          action: 'Document Folder For Work Order ECO Request',
          icon: 'icon-folder'
        },
        VERIFY_WORKORDER: {
          id: 4.28,
          action: 'Document Folder For Work Order ECO Request',
          icon: 'icon-cog-box'
        },
        WORKORDER_STATUS: {
          id: 4.29,
          action: 'Work Order Status',
          icon: 'icon-battery-charging-60'
        },
        WORKORDER_OPERATION_DOSANDDONTS: {
          id: 4.30,
          action: 'Work Order Operation Dos and Donts',
          icon: 'icon-format-strikethrough'
        },
        WORKORDER_OPERATION_FIRSTPCSDET: {
          id: 4.31,
          action: 'Work Order Operation First PCS Details',
          icon: 'icon-numeric'
        },
        WORKORDER_OPERATION_WOOPSTATUS: {
          id: 4.32,
          action: 'Work Order Operation Status',
          icon: 'icon-battery-charging-60'
        },
        MASTER_TEMPLATE: {
          id: 4.33,
          action: 'Master Template',
          icon: 'icon-sitemap'
        },
        WORKORDER_VERSION: {
          id: 4.34,
          action: 'Master Template',
          icon: 'icon-camera-iris'
        },
        WORKORDER_OPERATION_VERSION: {
          id: 4.35,
          action: 'Master Template',
          icon: 'icon-camera-iris'
        },
        WORKORDER_DATAELEMENT: {
          id: 4.36,
          action: 'Work Order Data Element',
          icon: 'icon-spotlight'
        }
      },
      TRAVELER: {
        id: 5,
        action: 'Traveler',
        icon: 'icon-wallet-travel',
        CHECK_IN: {
          id: 5.01,
          action: 'Start Activity',
          icon: 'icon-login'
        },
        WORKORDER_TRANS_DATAELEMENT_VALUES: {
          id: 5.02,
          action: 'Work Order Trans Data Field Values',
          icon: 'icon-spotlight'
        },
        WORKORDER_TRANS_EQUIPMENT_DATAELEMENT_VALUES: {
          id: 5.03,
          action: 'Work Order Trans Equipment Data Field Values',
          icon: 'icon-spotlight'
        },
        CHECK_OUT: {
          id: 5.04,
          action: 'Stop Activity',
          icon: 'icon-logout'
        },
        WORKORDER_TRANS_FIRSTPCSDET: {
          id: 5.05,
          action: 'Work Order Trans First Piece Detail',
          icon: 'icon-numeric'
        },
        WORKORDER_TRANS_SERIALNO: {
          id: 5.06,
          action: 'Work Order Trans Serial No',
          icon: 'icon-format-list-numbers'
        },
        WORKORDER_TRANSFER: {
          id: 5.07,
          action: 'Work Order Transfer',
          icon: 'icon-transfer'
        },
        WORKORDER_REQFORREVIEW: {
          id: 5.08,
          action: 'Work Order Request For Review',
          icon: 'icon-account-multiple-plus'
        },
        OP_EMP_PAUSE: {
          id: 5.09,
          action: 'Operation Employee Pause',
          icon: 'icon-pause-circle-outline'
        },
        OP_EMP_RESUME: {
          id: 5.10,
          action: 'Operation Employee Resume',
          icon: 'icon-play-circle-outline'
        },
        WORKORDER_TRANS_PRODUCTION: {
          id: 5.11,
          action: 'Work Order Trans Production',
          icon: 'icon-package-variant'
        },
        WORKORDER_ASSY_DESIGNATORS: {
          id: 5.12,
          action: 'Work Order Assembly Designator',
          icon: 'icon-dice-5'
        },
        WORKORDER_TRANS_ASSY_DEFECTDET: {
          id: 5.13,
          action: 'Work Order Trans Assembly Defect detail',
          icon: 'icon-barley'
        },
        WORKORDER_PREPROGCOMP: {
          id: 5.14,
          action: 'Work Order Pre-Programming Part',
          icon: 'icon-apps'
        },
        WORKORDER_PREPROGCOMP_DESIGNATOR: {
          id: 5.15,
          action: 'Work Order Pre-Programming Part Designator',
          icon: 'icon-dice-5'
        },
        WORKORDER_TRANS_PREPROGRAMCOMP: {
          id: 5.16,
          action: 'Work Order Trans Pre-Programming Part',
          icon: 'icon-apps'
        },
        WORKORDER_TRANS_PACKAGINGDETAIL: {
          id: 5.17,
          action: 'Work Order Trans Packaging Detail',
          icon: 'icon-package-variant-closed'
        },
        PRINT_WORKORDER_OPERATION_DETAILS: {
          id: 5.18,
          action: 'Work Order Operation Details',
          icon: 'icon-printer'
        }
      },
      SALES_ORDER: {
        id: 6,
        action: 'Sales Order',
        icon: 'mdi mdi-equal-box',
        GENERICFILES_FOR_SALESORDER: {
          id: 6.01,
          action: 'Generic Documents For Sales Order',
          icon: 'icon-library-books'
        },
        GENERICFOLDER_FOR_SALESORDER: {
          id: 6.02,
          action: 'Generic Folder For Sales Order',
          icon: 'icon-folder'
        },
        DATAELEMENT_TRANSACTIONVALUES_FOR_SALESORDER: {
          id: 6.03,
          action: 'Data Fields Trans Values For Sales Order',
          icon: 'icon-spotlight'
        }
      },
      COMPONENT_SID_STOCK: {
        id: 7,
        action: 'Receiving Material',
        icon: 'mdi mdi-cube-send',
        COMPONENT_SID_STOCK_DATAELEMENT_VALUES: {
          id: 7.01,
          action: 'Receiving Material Data Fields',
          icon: 'icon-spotlight'
        },
        GENERICFILES_FOR_COMPONENT_SID_STOCK: {
          id: 7.02,
          action: 'Generic Document For Receiving Material',
          icon: 'icon-library-books'
        }
      },
      SHIPPING_REQUEST: {
        id: 8,
        action: 'Shipping Request',
        icon: 'icon-read',
        SHIPPING_REQUESTDET: {
          id: 8.01,
          action: 'Shipping Request Details',
          icon: 'icon-package-down'
        },
        SHIPPING_REQUEST_EMPDET: {
          id: 8.02,
          action: 'Shipping Request Employee Details',
          icon: 'icon-account-check'
        }
      },
      SHIPPEDASSEMBLY: {
        id: 9,
        action: 'Shipping records Assembly',
        icon: 'mdi mdi-clipboard-check-outline'
      },
      WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION: {
        id: 10,
        action: 'Work Order Assembly Excess Stock Location',
        icon: 'icon-archive'
      }
    },
    CHART_RAWDATA_CATEGORY_FIELDS: {
      AGGREGATE: {
        GROUP: 'GROUP',
        SUM: 'SUM'
      }
    },
    MFG_TYPE: {
      MFG: 'MFG',
      DIST: 'DIST',
      CUSTOMER: 'CUSTOMER'
    },
    COMPONENT_MFG_TYPE: {
      MANUFACTURER: 'Manufacturer',
      SUPPLIER: 'Supplier',
      DISTY: 'DISTY',
      CUSTOMER: 'Customer'
    },
    COMPONENT_COA_TYPE: {
      PURCHASE: 'P',
      SALES: 'S'
    },
    AccountType: {
      Assets: -1,
      Liabilities: -2,
      Equity: -3,
      Income: -4,
      Expense: -5
    },
    PRODUCTION_REPORT_STOCK_COLUMN: {
      IsTerminated: 'isTerminated',
      TO_WO_NUMBER: 'To Work Order',
      MFG_QTY_REQUIRED: 'MFR Qty Required?',
      OP_STOCK_QTY: 'OP Stock Qty',
      OP_SCRAPED_QTY: 'OP Scrapped Qty',
      SHIPPED_QTY: 'Shipped Qty',
      TRANSFER_QTY: 'Transfer Qty',
      UNPROCESS_QTY: 'unprocess',
      IS_REWORK_OPERATION: 'is Rework Operation?',
      IS_STOP_OPERATION: 'is Stop Operation?',
      ISSUE_QTY: 'Issue Qty',
      OP_STATUS: 'OP Status',
      OP_VERSION: 'OP Version',
      OP_NAME: 'OP Name',
      OP_NUMBER: 'OP Number',
      OP_PASSED_QTY: 'OP Passed Qty',
      OP_DEFECT_OBSERVED_QTY: 'OP Defect Observed Qty',
      OP_REWORK_REQUIRED_QTY: 'OP Rework Required Qty',
      READY_To_SHIP: 'Ready To Ship Qty',
      WIPQty: 'WIPQty'
    },
    GOOGLE_IMAGE: 'https://www.google.com/favicon.ico',
    SUPPLIER_AUTHORIZE_TYPE: [{
      id: 1,
      Value: 'Authorized'
    }, {
      id: 2,
      Value: 'Independent'
    },
    {
      id: 3,
      Value: 'Authorized & Independent'
    }],
    Suppliers_Api: [{
      ID: -5,
      Name: 'Arrow',
      Code: 'AR',
      isChecked: false,
      Image: 'https://static4.arrow.com/static/img/icons/favicon.90beaa56c09ab8ea.ico',
      link: 'https://www.arrow.com/'
    },
    {
      ID: -6,
      Name: 'Avnet',
      Code: 'AV',
      isChecked: false,
      Image: '{0}/../../assets/images/etc/favicon.ico',
      link: 'https://www.avnet.com/wps/portal/us/',
      Partlink: 'https://www.avnet.com/wps/portal/apac/'
    },
    {
      ID: -1,
      Name: 'DigiKey',
      Code: 'DK',
      isChecked: false,
      Image: 'https://www.digikey.in/favicon.ico',
      link: 'https://www.digikey.com/',
      Partlink: 'https://www.digikey.com/products/en?keywords={0}'

    },
    {
      ID: -3,
      Name: 'Mouser',
      Code: 'MO',
      isChecked: false,
      Image: 'https://www.mouser.com/favicon.ico',
      link: 'https://www.mouser.com/',
      Partlink: 'https://www.mouser.com/Search/Refine?Keyword={0}'
    }, {
      ID: -2,
      Name: 'Newark',
      Code: 'NW',
      isChecked: false,
      Image: 'https://www.newark.com/favicon.ico',
      link: 'http://www.newark.com/',
      Partlink: 'https://www.newark.com/{0}'
    },
    {
      ID: -4,
      Name: 'TTI',
      Code: 'TTI',
      isChecked: false,
      Image: 'https://www.ttiinc.com/etc/designs/ttiinc/favicon.ico?v=1',
      link: 'https://www.ttiinc.com/',
      Partlink: 'https://www.ttiinc.com/content/ttiinc/en/apps/part-detail.html?partsNumber={0}&autoRedirect=true'
    },
    {
      ID: 0,
      Name: 'FindChips',
      isChecked: false,
      Image: 'assets/images/pricing/fchip.png',
      link: 'http://www.findchips.com/',
      Partlink: 'http://www.findchips.com/search/{0}'
    },
    {
      ID: 1,
      Name: 'Octopart',
      isChecked: false,
      Image: 'assets/images/pricing/Octopart.png',
      link: 'https://octopart.com',
      Partlink: 'https://octopart.com/search?q={0}'
    },
    {
      ID: -12,
      Name: 'Heilind',
      Code: 'HEILIND',
      isChecked: false,
      Image: 'https://estore.heilindasia.com/favicon.ico',
      link: 'https://estore.heilindasia.com/',
      Partlink: 'https://estore.heilindasia.com/'
    }
    ],
    EXTERNALAPI: [{
      ID: 0,
      Name: 'FindChips',
      isChecked: null,
      isNotShow: true,
      Image: 'assets/images/pricing/fchip.png',
      link: 'http://www.findchips.com/'
    },
    {
      ID: 1,
      Name: 'Octopart',
      isChecked: null,
      isNotShow: true,
      Image: 'assets/images/pricing/Octopart.png',
      link: 'https://octopart.com'
    }],
    Reason_Type: {
      RFQ: {
        id: '1',
        title: 'RFQ Reasons',
        popupTitle: 'RFQ Reason',
        DisplayOrder: 2,
        CategoryDisplayColumn: 'Code',
        ReasonDisplayColumn: 'Reason'
      },
      BOM: {
        id: '2',
        title: 'Bill Of Material Approval Reasons',
        popupTitle: 'Bill Of Material Approval Reason',
        DisplayOrder: 1,
        CategoryDisplayColumn: 'Code',
        ReasonDisplayColumn: 'Description'
      },
      INVOICE_APPROVE: {
        id: '3',
        title: 'Predefined Invoice Approval Reasons',
        popupTitle: 'Predefined Invoice Approval Reason',
        DisplayOrder: 3,
        CategoryDisplayColumn: 'Code',
        ReasonDisplayColumn: 'Reason'
      },
      KIT_RELEASE_COMMENT: {
        id: '4',
        title: 'Predefined Release Comments',
        popupTitle: 'Predefined Release Comment',
        DisplayOrder: 4,
        CategoryDisplayColumn: 'Code',
        ReasonDisplayColumn: 'Comment'
      }
      //,
      //SO_REOPEN_REASON: {
      //  id: '5',
      //  title: 'Predefined SO Re-Open Reasons',
      //  popupTitle: 'Predefined SO Re-Open Reasons',
      //  DisplayOrder: 5,
      //  CategoryDisplayColumn: 'Code',
      //  ReasonDisplayColumn: 'Reason'
      //},
      //SO_POQTY_CHANGE_REASON: {
      //  id: '6',
      //  title: 'Predefined SO Qty/Price Change Reasons',
      //  popupTitle: 'Predefined SO Qty/Price Change Reasons',
      //  DisplayOrder: 6,
      //  CategoryDisplayColumn: 'Code',
      //  ReasonDisplayColumn: 'Reason'
      //}
    },
    Warehouse_Bin: {
      WAREHOUSE: {
        id: 1,
        title: 'Warehouse',
        DisplayOrder: 1
      },
      BIN: {
        id: 2,
        title: 'BIN',
        DisplayOrder: 2
      }
    },
    DataElementReportTransFields: {
      Transaction_Date: 'Transaction Date',
      Transaction_By: 'Transaction By'
    },
    UOM_DEFAULTS: {
      EACH: {
        ID: -1, NAME: 'EACH'
      },
      TBD: {
        ID: 0, NAME: 'N/A (Not Applicable)'
      }
    },
    PRICING_TYPE: [{ ID: 1, Name: 'Current Pricing' }, {
      ID: 2, Name: 'Historical Pricing'
    }],
    PRICING_TYPEDETAIL: {
      CURRENT_PRICE: 1,
      HISTORICAL_PRICE: 2
    },
    PRICING_ERROR_TYPES: {
      MFGNOTADDED: 'MFGNOTADDED', // Mfg not added
      DISTNOTADDED: 'DISTYNOTADDED',// Supplier not added
      PARTINVALID: 'PARTINVALID', // Part not found
      AUTHFAILED: 'AUTHFAILED', // Digikey Authentication
      UNKNOWN: 'UNKNOWN', // Something went wrong
      PIDCODELENGTH: 'PIDCodeLength', // PID length
      PIDCODEINVALID: 'PIDCodeInvalid',// Invalid character - in MFR PN
      MOUNTNOTADDED: 'MOUNTNOTADDED',// Mounting Type
      MOUNTINACTIVE: 'MOUNTINACTIVE',// Mounting type added but inactive
      UOMNOTADDED: 'UOMNOTADDED', // UOM Not Added
      UOMINACTIVE: 'UOMINACTIVE', // UOM Added but inactive
      UOMCLASSNOTADDED: 'UOMCLASSNOTADDED',// Measurement type not added
      UOMCLASSINACTIVE: 'UOMCLASSINACTIVE',// Measurement type added but inactive
      PARTTYPENOTADDED: 'PARTTYPENOTADDED',// Functional Type not added
      PARTTYPEINACTIVE: 'PARTTYPEINACTIVE',// Functional Type added but inactive
      ROHSNOTADDED: 'ROHSNOTADDED',// RoHS not added
      ROHSINACTIVE: 'ROHSINACTIVE',// RoHS added but inactive
      CONNECTNOTADDED: 'CONNECTNOTADDED',// Connector Type not added
      CONNECTINACTIVE: 'CONNECTINACTIVE',// Connector type Added but inactive
      PACKAGINGNOTADDED: 'PACKAGINGNOTADDED',// Packaging type not added
      PACKAGINGINACTIVE: 'PACKAGINGINACTIVE',// Packaging Type added but inactive
      CONTACTADMIN: 'CONTACTADMIN', // Something went wrong
      PARTSTATUSNOTADDED: 'PARTSTATUSNOTADDED',// Part Status Not added
      PARTSTATUSINACTIVE: 'PARTSTATUSINACTIVE'// Part status added but inactive
    },
    PRICING_STATUS: {
      PENDING: 0,
      ERROR: 1,
      SUCCESS: 2
    },
    OPERATION_FIELD: {
      NAME: 'Operation Fields'
    },
    DbScriptIdentifierContainDefinerRoot: ['PROCEDURE', 'TRIGGER', 'VIEW', 'FUNCTION'],
    Operations_Type_For_WOOPTimeLineLog: {
      DosAndDonts: 'DOSANDDONTS',
      firstPcsDet: 'FIRSTPCSDET',
      WoOpStatus: 'WOOPSTATUS'
    },
    Workorder_Log_Type_For_WOTimeLineLog: {
      MasterTemplate: 'MASTERTEMPLATE'
    },
    HOT_KEYS: {
      USER_LOGOUT: {
        SHORTCUT_KEY: 'alt+l',
        DESCRIPTION: 'Logout'
      },
      PAUSE_OPERATION: {
        SHORTCUT_KEY: 'alt+p',
        DESCRIPTION: 'Pause Activity'
      },
      RESUME_OPERATION: {
        SHORTCUT_KEY: 'alt+r',
        DESCRIPTION: 'Resume Activity'
      },
      ADD_STOCK_OPERATION: {
        SHORTCUT_KEY: 'alt+s',
        DESCRIPTION: 'Add Production Stock Details'
      },
      CHECK_OUT_OPERATION: {
        SHORTCUT_KEY: 'alt+o',
        DESCRIPTION: 'Start Activity'
      },
      CHECK_IN_OPERATION: {
        SHORTCUT_KEY: 'alt+i',
        DESCRIPTION: 'Stop Activity'
      },
      FIRST_ARTICLE_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+1',
        DESCRIPTION: '1st Article'
      },
      BACK_TO_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+b',
        DESCRIPTION: 'Back to Operation Activity'
      },
      TRANSFER_WORKORDER: {
        SHORTCUT_KEY: 'ctrl+alt+t',//ctrl + t not working
        DESCRIPTION: 'Terminate & Transfer Work Order'
      },
      ADD_NARRATIVE_DETAILS: {
        SHORTCUT_KEY: 'ctrl+alt+n',//ctrl + t not working
        DESCRIPTION: 'Add Narrative Details'
      },
      ADD_SERIAL_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+a',
        DESCRIPTION: 'Add Processed Serial#'
      },
      VIEW_HISTORY_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+v',
        DESCRIPTION: 'Production Activity Log'
      },
      HALT_WORKORDER_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+h',
        DESCRIPTION: 'Halt Operation'
      },
      RESUME_WORKORDER_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+r',
        DESCRIPTION: 'Resume Operation'
      },
      LOG_DEFFECT_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+d',
        DESCRIPTION: 'Log Deffect'
      },
      PREPROGRAMMING_OPERATION: {
        SHORTCUT_KEY: 'ctrl+alt+p',
        DESCRIPTION: 'Part Pre-Programming'
      }
    },
    Template_System_Variables: {
      companyLogoHtmlTag: '<% CompanyLogo %>'
    },
    EquipmentToolAs: ['E', 'W', 'S'],
    WORK_ORDER_TYPES: {
      NEW: 1,
      REPEAT_ORDER_WITH_SAME_REVISION: 2,
      REVISION_CHANGE: 3,
      I_ECO: 4,
      C_ECO: 5
    },
    workOrderTypesWithECORequestType: [
      {
        requestType: 'New', value: 1, className: 'label-primary'
      },
      {
        requestType: 'Repeat order with same revision', value: 2, className: 'light-blue-bg'
      },
      {
        requestType: 'Revision change', value: 3, className: 'label-warning'
      },
      {
        requestType: 'Internal-ECO', value: 4, className: 'light-green-bg'
      },
      {
        requestType: 'ECO', value: 5, className: 'label-danger'
      }
    ],
    workOrderTypes: [
      {
        requestType: 'New', value: 1, className: 'label-primary'
      },
      {
        requestType: 'Repeat order with same revision', value: 2, className: 'light-blue-bg'
      },
      {
        requestType: 'Revision change', value: 3, className: 'label-warning'
      }
    ],
    workOrderTypesWithGridHeaderDropdown: [
      {
        ID: null, value: 'All'
      },
      {
        id: 'New', value: 'New'
      },
      {
        id: 'Repeat order with same revision', value: 'Repeat order with same revision'
      },
      {
        id: 'Revision change', value: 'Revision change'
      }
      //{
      //  id: 'Internal-ECO', value: 'Internal-ECO'
      //},
      //{
      //  id: 'ECO', value: 'ECO'
      //}
    ],
    MFG_TYPE_LENGTH: {
      MFG: 8,
      DIST: 15,
      MFGPN: 100
    },
    //MFG_ACCESS: {
    //  MFG_ADD_ACCESS: 'AddMFGRoleAccessLevel'
    //},
    ROLE_ACCESS: {
      VERIFICATION_ROLE_ACCESS: 'VerificationRoleAccess',
      DELETE_ROLE_ACCESS: 'DeleteRoleAccess',
      FeederStatusAccess: 'FeederStatusAccess',
      MFRRemoveAccess: 'MFRRemoveAccess',
      SmartCartUser: 'Show Smart Cart Users',
      UNAUTHORIZE_NOTIFICATION_REMOVE: 'Allow to Delete Unauthorize Notification',
      SupplierInvoiceApproval: 'Supplier Invoice Approval',
      SUPERVISOR_APPROVAL_FOR_UMIDSCAN: 'SupervisorApprovalForUMIDScan'
    },
    defaultSelectedCountry: {
      countryName: 'United States'
    },
    FCA: {
      Name: 'Internal',
      ShortName: 'Int'
    },
    DBTableName: {
      DynamicReportMst: 'dynamicreportmst',
      Entity: 'entity',
      WorkorderTransOperationHoldUnhold: 'workorder_trans_operation_hold_unhold',
      WorkorderTransHoldUnhold: 'workorder_trans_hold_unhold',
      HoldUnholdTrans: 'holdunholdtrans'
    },

    STANDARD_CLASS_COLOR_FORMATE: 'rgb({0}, {1}, {2})',
    DEFAULT_STANDARD_CLASS_COLOR: 'rgb(64, 119, 132)',
    SUCCESS_RGB_COLOR: 'rgb(204, 238, 204)',
    ERROR_RGB_COLOR: 'rgb(255, 76, 66)',
    PhoneNumDefaultExampleLable: 'Phone (+1 (123) 456 - 7890)',
    PhoneNumLable: 'Phone',
    NON_ROHS_RGB_COLOR: 'rgb(255, 255, 255)',
    RoHSLeadFreeText: 'RoHS/Lead Free',
    MOUNTING_TYPE_COLOR_FORMATE: 'rgb({0}, {1}, {2})',
    DEFAULT_MOUNTING_TYPE_COLOR: 'rgb(255, 255, 255)',
    PACKAGE_CASE_TYPE_COLOR_FORMATE: 'rgb({0}, {1}, {2})',
    DEFAULT_PACKAGE_CASE_TYPE_COLOR: 'rgb(255, 255, 255)',
    OtherDetail: {
      TabName: 'MISC'
    },
    ProjectBranches: {
      MainBranch: '1.00',
      DevBranch: '2.00'
    },
    ProjectBranchesName: {
      MainMsgBranch: 'Main Message Branch',
      DevMsgBranch: 'Dev Message Branch'
    },
    RoHSText: 'RoHS',
    ActiveText: 'Active',
    MountingTypeAssembly: 'Assembly',
    EventName: {
      sendNotificationOfRightChanges: 'sendNotificationOfRightChanges:receive',
      sendNotificationOfDefaultRoleChanges: 'sendNotificationOfDefaultRoleChanges:receive',
      sendPartUpdateVerification: 'sendPartUpdateVerification:receive',
      refreshinoutGrid: 'refreshinoutGrid',
      componentListUpdate: 'componentlistrecords:receive',
      sendPartMasterProgressbarUpdate: 'sendPartMasterProgressbarUpdate:receive',
      sendNotificationOfCustomFormStatus: 'sendNotificationOfCustomFormStatus:receive',
      sendPartUpdateStopNotificationToAllUsers: 'sendPartUpdateStopNotificationToAllUsers:receive',
      sendPartPictureSave: 'sendPartPictureSave:receive',
      onAddDeletePackagingAliasPart: 'onAddDeletePackagingAliasPart',
      onAddDeleteAlternatePart: 'onAddDeleteAlternatePart',
      onAddDeleteDriveToolsPart: 'onAddDeleteDriveToolsPart',
      onAddDeleteProcessMaterial: 'onAddDeleteProcessMaterial',
      onAddDeleteFunTestEquipment: 'onAddDeleteFunTestEquipment',
      onAddDeleteSupplier: 'onAddDeleteSupplier'
    },
    AllCommonLabels: {
      TRAVELER: {
        TotalQty: 'Total Qty = Passed Qty + Defect Observed Qty + Rework Required Qty + Scrapped Qty',
        ReworkTotalQty: 'Total Qty = Passed Qty + Scrapped Qty',
        MoveToStockOPTotalQty: 'Total Qty = Passed Qty + Scrapped Qty'
      },
      MFG_SUPPLIER: {
        Manufacturer: 'MFR',
        Supplier: 'Supplier'
      }
    },
    SpecialKeys: [8, //backspace
      9, //tab
      13, //enter
      16, //shift
      17, //ctrl
      18, //alt
      19, //pause/break
      20, //caps lock
      27, //escape
      32, //(space)
      33, //page up
      34, //page down
      35, //end
      36, //home
      37, //left arrow
      38, //up arrow
      39, //right arrow
      40, //down arrow
      45, //insert
      46 //delete
    ],
    defaultCountryCodeForPhone: 'US',
    AssemblyRevisionPrefix: 'Rev',
    AssemblyObsoleteStatus: 'Obsolete',
    AssemblyStatus: 'Assy.Status',
    ActiveInactiveStatus: [
      {
        ID: 0,
        Name: 'Inactive',
        ClassName: 'label-warning',
        DisplayOrder: 2
      },
      {
        ID: 1,
        Name: 'Active',
        ClassName: 'label-success',
        DisplayOrder: 1
      }],
    ActiveInactiveDisplayStatus: {
      InActive: {
        ID: 0,
        Value: 'Inactive',
        DisplayOrder: 2
      },
      Active: {
        ID: 1,
        Value: 'Active',
        DisplayOrder: 1
      }
    },
    KitListTab: {
      KitList: {
        id: 0,
        Name: 'kitlist',
        title: 'Kit List',
        DisplayOrder: 1,
        IsDisable: false,
        Code: 'MA'
      },
      SubKitList: {
        id: 1,
        Name: 'subkitlist',
        title: 'Sub Assembly Kits',
        DisplayOrder: 2,
        IsDisable: false,
        Code: 'SA'
      },
      MRPList: {
        id: 2,
        Name: 'purchaselist',
        title: 'MRP List',
        DisplayOrder: 3,
        IsDisable: false,
        Code: 'ML'
      }
    },
    ReceivingMatirialTab: {
      UIDManagement: {
        id: 1,
        Name: 'UIDManagement',
        title: 'UMID Management',
        DisplayOrder: 1,
        IsDisable: false,
        Code: 'UM'
      },
      List: {
        id: 2,
        Name: 'receivingList',
        title: 'UMID List',
        DisplayOrder: 2,
        IsDisable: false,
        Code: 'UL'
      },
      PartToStock: {
        id: 3,
        Name: 'receivingPartToStock',
        title: 'Purchased Part',
        DisplayOrder: 3,
        IsDisable: false,
        Code: 'PP'
      },
      CPNReceive: {
        id: 4,
        Name: 'cpnReceive',
        title: 'Customer Consigned Part',
        DisplayOrder: 4,
        IsDisable: false,
        Code: 'CP'
      },
      UMIDDocument: {
        id: 7,
        Name: 'umidDocument',
        title: 'Document',
        DisplayOrder: 7,
        IsDisable: false,
        Code: 'UD'
      },
      COFCDocument: {
        id: 8,
        Name: 'cofcDocument',
        title: 'COFC Document',
        DisplayOrder: 8,
        IsDisable: false,
        Code: 'CD'
      },
      VerificationHistory: {
        id: 9,
        Name: 'verificationHistory',
        title: 'Label Verification History',
        DisplayOrder: 9,
        IsDisable: false,
        Code: 'VH'
      },
      NonUMIDStockList: {
        id: 10,
        Name: 'NonUMIDStockList',
        title: 'UMID Pending Parts',
        DisplayOrder: 10,
        IsDisable: false,
        Code: 'UP'
      },
      CountApprovalHistoryList: {
        id: 10,
        Name: 'DeallocationApprovalHistoryList',
        title: 'Deallocation Approval History',
        DisplayOrder: 11,
        IsDisable: false,
        Code: 'CA'
      },
      SplitUMIDList: {
        id: 10,
        Name: 'SplitUIDList',
        title: 'Split UMID List',
        DisplayOrder: 12,
        IsDisable: false,
        Code: 'SU'
      },
      ParentUMIDDocument: {
        id: 11,
        Name: 'parentumidDocument',
        title: 'Origin UMID Document',
        DisplayOrder: 13,
        IsDisable: false,
        Code: 'PUD'
      }
    },
    PIDCODELENGTH: {
      DISTY: 50,
      MFG: 30
    },
    CUSTOMER_TYPE: {
      CUSTOMER: '1',
      SUPPLIER: '0',
      MANUFACTURER: '2'
    },
    ATTRIBUTE_TYPE: {
      RFQ: 'rfq',
      SUPPLIER: 'supplier'
    },
    ATTRIBUTE_TYPE_NAME: {
      RFQ: 'RFQ',
      SUPPLIER: 'Supplier'
    },
    QUOTE_DB_ATTRIBUTE_TYPE: {
      RFQ: 'R',
      SUPPLIER: 'S'
    },
    codeUniqueForModule: {
      CUSTOMER: 'Customer',
      MANUFACTURE: 'Manufacturer'
    },
    CustomSearchTypeForList: {
      Exact: 'exact',
      Contains: 'contains'
    },
    TreeTabNameDisplayFormat: '{0}. {1}',
    StandardDisplayFormat: '{0} {1}',
    VerificationType: {
      UIDandMfgPNLabel: 'UMID to MFR/Supplier PN Label (1D or 2D)',
      UIDtoPID: 'UMID to PID Labels',
      UIDtoCPN: 'UMID to CPN (Component) Labels',
      UIDtoUID: 'UMID to UMID Labels',
      UIDtoMfgPN: 'UMID Label to MFR PN(Without Barcode)',
      FeederFirst: 'Scan Feeder First',
      UMIDFirst: 'Scan UMID First',
      ReplacePart: 'Replace Part',
      OnlyUMID: 'Scan UMID Only',
      ScanUMIDForPreProgramming: 'Scan UMID For Pre-Programming'
    },
    ChangeReelType: {
      ZeroOut: { Name: 'Zero Out', Code: 'Z', Type: 'ZeroOut' },
      ChangeMaterial: { Name: 'Change Material', Code: 'C', Type: 'Consumed' }
    },
    VerificationStatus: {
      Verified: 'Passed Verification',
      Unverified: 'Failed Verification'
    },
    COMPONENT_LOGICALGROUP: {
      SUPPLIES: {
        ID: -1,
        Name: 'Supplies'
      },
      MATERIALS: {
        ID: -2,
        Name: 'Materials'
      },
      TOOLS: {
        ID: -3,
        Name: 'Tools'
      }
    },
    COMPONENT_LOGICALGROUPID: [-1, -2, -3],
    RFQ_MOUNTINGTYPE: {
      TBD: {
        ID: -1,
        Name: 'TBD'
      }, Assembly: {
        ID: 1,
        Name: 'Assembly'
      }, ThruHole: {
        ID: 2,
        Name: 'Thru-Hole'
      }, SMT: {
        ID: 3,
        Name: 'SMT'
      }, BarePCB: {
        ID: -3,
        Name: 'Bare PCB'
      },
      //Chemical: {
      //  ID: -4,
      //  Name: 'Chemical'
      //},
      Tools: {
        ID: 5,
        Name: 'Tools'
      }
    },
    RFQ_PARTTYPE: {
      BAREPCB: {
        ID: -4,
        Name: 'Bare PCB'
      }
    },
    ConnectorType: {
      HEADERBREAKAWAY: {
        ID: -2,
        Name: 'Header, Breakaway'
      }
    },
    MEASUREMENT_TYPES: {
      COUNT: {
        ID: -1,
        Name: 'Count'
      },
      WEIGHT: {
        ID: -2,
        Name: 'Weight'
      },
      LENGTH: {
        ID: -3,
        Name: 'Length'
      },
      VOLUME: {
        ID: -4,
        Name: 'Volume'
      }
    },
    EquipmentType: [
      { id: null, value: 'All' },
      { id: 'Equipment', value: 'Equipment' },
      { id: 'Workstation', value: 'Workstation' },
      { id: 'Sample', value: 'Sample' }
    ],
    EquipmentAndWorkstation_Title: {
      Equipment: 'Equipment',
      Workstation: 'Workstation',
      Sample: 'Sample'
    },
    CalibrationType: [
      { id: 1, value: 'Calibration' },
      { id: 2, value: 'Repair' }
    ],
    CalibrationFilterType: [
      { id: false, value: 'All' },
      { id: true, value: 'Current Calibration Detail' }
    ],
    CheckInRadioGroup: {
      Activity: [{ Key: 'Setup Activity', Value: true }, { Key: 'Production Activity', Value: false }]
    },
    CheckOutRadioGroup: {
      CheckOutType: [{ Key: 'Interim', Value: true }, { Key: 'Mid Shift/End Of Shift', Value: false }]
    },
    ActiveRadioGroup: [{ Key: 'Active', Value: true }, { Key: 'Inactive', Value: false }],
    memoRadioGroup: [{ Key: 'Credit Memo', Value: true }, { Key: 'Debit Memo', Value: false }],
    BooleanRadioGroup: [{ Key: 'Yes', Value: true }, { Key: 'No', Value: false }],
    BooleanUserAccessMode: [{ Key: 'N/A (Not Applicable)', Value: 'N/A', isDisable: true }, { Key: 'Single User', Value: 'S', isDisable: false }, { Key: 'Multiple Users', Value: 'M', isDisable: false }],
    NoteRadioGroup: [{ Key: 'With Note', Value: true }, {
      Key: 'Without Note', Value: false
    }],
    EquipmentRadioGroup: {
      equipmentAs: [{ Key: 'Equipment', Value: 1, DefaultValue: 'E' }, { Key: 'Workstation', Value: 2, DefaultValue: 'W' }, { Key: 'Sample', Value: 3, DefaultValue: 'S' }]
    },
    EquipmentRadioButtonValue: {
      Equipment: { ID: 1, Value: 'E' },
      Workstation: { ID: 2, Value: 'W' },
      Sample: { ID: 3, Value: 'S' }
    },
    OperationRadioGroup: {
      cleaningType: [{ Key: 'Not Applicable', Value: 'NA' }, { Key: 'No-Clean', Value: 'NC' }, { Key: 'Water-Soluble', Value: 'WS' }],
      qtyControl: [{ Key: 'Qty Tracking Required', Value: true }, { Key: 'Qty Tracking Not Required', Value: false }],
      isRework: [{ Key: 'Rework Operation', Value: true }, { Key: 'Non-Rework Operation', Value: false }],
      isIssueQty: [{ Key: 'Issue Qty Required', Value: true }, { Key: 'Issue Qty Not Required', Value: false }],
      isTeamOperation: [{ Key: 'One Person Operation', Value: false }, { Key: 'Team Operation', Value: true }],
      isPreProgrammingComponent: [{ Key: 'Part Pre-Programming Required', Value: true }, { Key: 'Part Pre-Programming Not Required', Value: false }],
      isRequireMachineVerification: [{ Key: 'Not Applicable', Value: 'NA' }, { Key: 'Yes', Value: 'YES' }, { Key: 'No', Value: 'NO' }],
      doNotReqApprovalForScan: [{ Key: 'Not Applicable', Value: 'NA' }, { Key: 'Yes', Value: 'YES' }, { Key: 'No', Value: 'NO' }]
    },
    OperationCleaningTypeFilter: [{ id: null, value: 'All' }, { value: 'Not Applicable', id: 'Not Applicable' }, { value: 'No-Clean', id: 'No-Clean' }, { value: 'Water-Soluble', id: 'Water-Soluble' }],
    productStatusFilter: [
      { id: null, value: 'All' },
      {
        id: '1', value: 'Passed'
      },
      {
        id: '2', value: 'Reprocess Required'
      },
      {
        id: '3', value: 'Defect Observed'
      },
      {
        id: '4', value: 'Scrapped'
      },
      {
        id: '5', value: 'Rework Required'
      },
      {
        id: '6', value: 'Board With Missing Parts'
      },
      {
        id: '7', value: 'Bypassed'
      }
    ],
    SearchRadioGroup: [{ Key: 'Contains', Value: false }, { Key: 'Exact', Value: true }],
    AssyBOMRFQRadioGroup: [{ Key: 'Copy BOM', Value: true }, { Key: 'Copy RFQ', Value: false }],
    AddWOFromRadioGroup: [{ Key: 'Create WO w/o Sales Order (Sales Order can be added later)', Value: 'W' }, { Key: 'Create WO for Sales Order ', Value: 'S' }, { Key: 'Terminate Open WO & Transfer to New WO', Value: 'U' }, { Key: 'Create WO', Value: 'N' }],
    UserPrefRadioGroup: {
      isUserPref: [{ Key: 'Pagination', Value: false }, { Key: 'Scrolling ', Value: true }]
    },
    TrasferStockType: {
      StockTransfer: 'Stock Transfer',
      StockTransferToOtherDept: 'Stock Transfer To Other Department',
      KitTransfer: 'Kit Transfer',
      DeptTransfer: 'Department Transfer',
      WarehouseTransfer: 'Warehouse Transfer',
      BinTransfer: 'Bin Transfer',
      UMIDTransfer: 'UMID Transfer'
    },
    DEBOUNCE_TIME_INTERVAL: 1000,
    LabelConstant: {
      COMMON: {
        GRIDHEADER_MODYFYBY: 'Last Modified By',
        GRIDHEADER_MODYFYBY_ROLE: 'Last Modified By Role',
        GRIDHEADER_CREATED_DATE: 'Created Date',
        GRIDHEADER_MODIFY_DATE: 'Modified Date',
        GRIDHEADER_CREATEDBY: 'Created By',
        GRIDHEADER_CREATEDBY_ROLE: 'Created By Role',
        GRIDHEADER_SYSTEM_GENERATED: 'System Generated',
        GRIDHEADER_SCANNEDBY: 'Added By',
        GRIDHEADER_SCANNEDON: 'Added On',
        GRIDHEADER_SCANNEDBY_ROLE: 'Added By Role',
        TimeRemain: 'Time Remaining',
        DisplayOrder: 'Display Order',
        NotApplicable: 'Not Applicable',
        PaymentTerms: 'Payment Terms',
        SystemID: 'SystemID',
        InternmediateAddress: 'Intermediate Shipping',
        ShippingAddress: 'Shipping',
        BillingAddress: 'Billing',
        RMAShippingAddress: 'RMA Shipping Address',
        Version: 'Ver.',
        MarkFor: 'Intermediate Shipping',
        RevisionShort: 'Rev.',
        CustomerMapping: 'Customer Mapping',
        GRIDHEADER_LOCKEDBY: 'Locked By',
        GRIDHEADER_LOCKEDBY_ROLE: 'Locked By Role',
        GRIDHEADER_LOCKED_DATE: 'Locked Date',
        APPLY_FILTERS: 'Apply Filters',
        CLEAR_ALL: 'Clear All',
        RESET: 'Reset',
        APPLIED_FILTERS: 'Applied Filters:',
        APPLIED_GRID_FILTERS: 'Applied Grid Filters:',
        FILTER_REMOVE_TOOLTIP: 'Click to remove this filter',
        ShippingAddressContactPerson: 'Contact Person(Ship To)',
        BillingAddressContactPerson: 'Contact Person(Bill To)',
        MarkForContactPerson: 'Contact Person(Intermediate Shipping)'
      },
      Workorder: {
        PageName: 'Work Order',
        WO: 'WO#',
        Version: 'WO Version',
        ECO: 'ECO Request#',
        CECO: 'ECO',
        IECO: 'Internal-ECO',
        DFM: 'DFM Request#',
        CDFM: 'DFM',
        ECO_DFM_REQUEST_LABEL: 'ECO/DFM Request#',
        ECO_DFM_COMMON_LABEL: 'ECO/DFM',
        IDFM: 'Internal-DFM',
        ECOStatus: 'ECO Status',
        DFMStatus: 'DFM Status',
        WOType: 'WO Type',
        POQty: 'PO Qty',
        AssignedPOQty: 'Assign PO Qty TO WO',
        BuildQty: 'Build Qty',
        ScrappedQty: 'WO Scrapped Qty',
        MRPQty: 'MRP Qty',
        PO: 'PO#',
        PODate: 'PO Date',
        ExcessBuildQty: 'Excess Build Qty',
        WODate: 'WO Date',
        StandardCategory: 'Standard Category',
        Status: 'WO Status',
        TrackSerialNumbers: 'Track Serial Numbers',
        ClusterApplied: 'Cluster Applied',
        IncludeSubAssembly: 'Build Sub Assembly Within Operations',
        InitialInternalVersion: 'Initial Internal Version',
        TotalSolderOpportunitiesOfError: 'Total Solder Opportunities of Error',
        DPMO: 'DPMO',
        DPMOFullName: 'Defects Per Million Opportunities',
        Standards: 'Standards',
        FromWOOpVersion: 'From OP Version',
        NewWOOpVersion: 'New OP Version',
        FromWOVersion: 'From Work Order Version',
        NewWOVersion: 'New Work Order Version',
        BroadcastMsgForVersionChange: 'Broadcast message',
        RushJob: 'Rush Job',
        ExportControlImagePath: '../../../../assets/images/etc/export.png',
        WOCreator: 'WO CREATOR-OWNER',
        KitNumber: 'KIT#',
        RequiredRackTracking: 'Require Rack Tracking',
        StrictlyValidation: 'Strictly Follow Rack Validation',
        RequireRackTrackingHelp: 'If selected, Work Order has a rack tracking feature on the traveler page.',
        StrictlyValidationHelp: 'If selected, Rack tracking with strictly follow rack validation for incoming rack, outgoing rack, and clear rack.',
        ReleasedWO: 'Released WO#',
        PendingWOQty: 'Pending WO Qty',
        ReadyForOperation: 'Waiting For Operation(s)',
        SampleDetail: 'Sample Details',
        ReferenceWO: 'Reference WO#',
        InternalBuild: 'Internal Build Only',
        InternalBuildHelp: 'Must create UMID from this work order upon completion.',
        PropUmidQty: 'Proposed UMID Creation Qty After Moving To Stock',
        PlannedBuildQty: 'Planned Build Qty',
        ActualBuildQty: 'Actual Build Qty',
        IsKitAllocationNotRequired: 'Validate UMID With BOM Without Kit Allocation',
        IsKitAllocationNotRequiredHelp: 'Allowed to Scan UMID without Kit Allocation Validation.',
        FluxTypeBoth: 'Water-Soluble and No-Clean',
        WorkorderSerialNoPrefixNote: 'Note: The \'% \' and \'_\' characters are not allowed as Prefix.',
        WorkorderSerialNoSuffixNote: 'Note: The \'%\' and \'_\' characters are not allowed as Suffix.',
        WorkorderSerialNoSuffixPreFixNote: 'The \'%\' and \'_\' characters are not allowed as Suffix and Prefix.'
      },
      Assembly: {
        PageName: 'Assembly',
        NickName: 'Nickname',
        ID: 'Assy ID',
        PIDCode: 'Assy ID',
        Rev: 'Assy Rev',
        Description: 'Assy Description',
        MFGPN: 'Assy#',
        Assy: 'Assy#',
        InternalVersion: 'Internal Ver.',
        Halt: 'Place Hold on Published Work Order',
        Resume: 'Release Hold',
        AssyNote: 'Assy Special Note',
        QuoteGroup: 'Quote Group',
        PartsToWatch: 'Parts to Watch',
        SubPIDCode: 'Sub Assy ID',
        SubAssy: 'Sub Assy#',
        MainPIDCode: 'Main Assy ID',
        MainAssy: 'Main Assy#'
      },
      Operation: {
        PageName: 'Operation',
        OP: 'OP#',
        Version: 'OP Version',
        Short_OP: 'OP#',// Added for PO status Report
        Short_Version: 'OP Version',// Added for PO status Report
        OperationType: 'Operation Type',
        Name: 'Operation Name',
        Type: 'Type',
        NoClean: 'No-Clean',
        Status: 'OP Status',
        WaterSoluble: 'Water Soluble',
        FluxTypeNotApplicable: 'N/A',
        NotApplicable: 'Not Applicable',
        Halt: 'Place Hold on Published Work Order Operation',
        Resume: 'Release Hold',
        TeamOperation: 'Team Operation',
        ParallelOperation: 'Parallel Operation',
        SequentialOperation: 'Sequential Operation',
        ReWork: 'Rework Operation',
        QtyTrackingRequired: 'Qty Tracking Required',
        PreProgramming: 'Part Pre-Programming Required',
        IssueQtyRequired: 'Issue Qty Required',
        MoveToStock: 'Move To Stock',
        LastOperation: 'Last Operation',
        LastOperationAndMoveToStock: 'Last operation, Product moves to stock upon completing this operation',
        BasicPlacementTracking: 'Always Requires RefDes when using UMID',
        LoopOperation: 'Loop Operation',
        MappingSerial: 'Serial# Mapping',
        TrackSerialInOperation: 'Track Serial# In Operation',
        AllowMissingPartQty: 'Allow Operation To Continue With Possibility Of Missing Parts Placements',
        AllowByPassQty: 'Allow Operation To Continue With Possibility Of Bypassing Qty',
        EnablePreProgrammingPart: 'Enable Pre-Programmed Part Use',
        AddRefDesignator: 'Enter required RefDes for this operation',
        IsRequireMachineVerification: 'Require Machine Setup Verification',
        DoNotReqApprovalForScan: 'Does not Require Supervisor Approval (Before Using)',
        IsRequireRefDesWithUMID: 'Strictly requires UMID',
        IsStrictlyLimitRefDes: 'Allow only RefDes from this list when using UMID'
      },
      Traveler: {
        PageName: 'Traveler',
        CheckInTime: 'Started Date',
        PausedTime: 'Paused Date',
        AvailableQty: 'Available Qty',
        CumulativeCompletedQty: 'Cumulative Completed Qty',
        ReadyforIssueQty: 'Available Qty to Issue',
        Totaltime: 'Total Time (HH:MM:SS)',
        Productiontime: 'Production Time',
        Setuptime: 'Setup Time',
        IssueQty: 'Issue Qty',
        Production: 'Production Activity',
        ScrappedQty: 'Scrapped Qty',
        Setup: 'Setup Activity',
        ProductionLabel: 'Production',
        SetupLabel: 'Setup',
        Scan_Feeder: 'Scan Feeder#',
        Scan_UMID: 'Scan UMID',
        Feeder: 'Feeder#',
        BoardWithMissingPartsQty: 'Board With Missing Parts Qty',
        BypassedQty: 'Bypassed Qty',
        AvailableRack: 'Available Rack',
        ByPassMachineVerification: 'Bypass Machine Setup Verification',
        RequireApprovalForScanUMID: 'Require Supervisor Approval (Before Using)'
      },
      TaskList: {
        PageName: 'Task List'
      },
      KitList: {
        PageName: 'Kit List',
        KitNumber: 'Kit Number'
      },
      Customer: {
        PageName: 'Customer',
        MenuName: 'Customers',
        Customer: 'Customer',
        SalesCommossionTo: 'Sales Commission To'
      },
      CustomerPackingSlip: {
        CustomerPackingSlipNumber: 'Customer Packing Slip#',
        ShippingCommentPS: 'Header Shipping Comments',
        ShippingCommentLine: 'Line Shipping Comments',
        PackingSlipNumber: 'Packing Slip#',
        InternalNotes: 'Header Internal Notes',
        InternalNotesLine: 'Line Internal Notes',
        PackingSliptype: 'Packing Slip Type',
        ConfirmingZeroValueLine: 'Confirming Zero Value Line',
        ConfirmingZeroValueHeader: 'Confirming Zero Value {0}',
        ConfirmingZeroValueLineHint: 'Applies to invoice line with "Confirming Zero Value Invoice" only.',
        ConfirmingZeroValueHint: 'Applies to invoices with "Confirming Zero Value Invoice" only.',
        CurrentPaymentTermsFilterHint: 'Payment Terms are derived from Customer Master. In list, Payment Due Date calculation based on current terms days.',
        HistoryButtonName: 'Customer Packing Slip Change History',
        PageName: 'Customer Packing Slip',
        PackingSlipDate: 'PS Date',
        ReleaseNotes: 'Release Notes',
        LegacyOpenQty: 'Legacy PO Open PO Qty',
        OrgPOOrdQty: 'Orig. PO Line Order Qty'
      },
      CustomerPackingInvoice: {
        CustomerPackingInvoiceNumber: 'Customer Invoices',
        CustomerInvoiceNumber: 'Invoice#',
        InvoiceRef: 'INV Line#',
        ReceivedAmount: 'Less DEP/PMT/CM/WOFF',
        BalanceAmount: 'Balance Due',
        CMAppliedAmount: 'Applied CM Amount',
        CMBalanceAmount: 'Remaining Amount',
        HistoryButtonName: 'Customer Invoice Change History'
      },
      CustomerCreditMemo: {
        CustomerCreditMemoNumer: 'Credit Memo#',
        HistoryButtonName: 'Customer Credit Memo Change History',
        TotalRefundIssued: 'Refunded Amt.',
        LeftOverAmtToBeRefunded: 'Leftover Amt. to be Refunded'
      },
      MFG: {
        MFG: 'MFR',
        Manufacturers: 'Manufacturers',
        Supplier: 'Supplier',
        Customer: 'Customer',
        MFGCode: 'MFR Code',
        CustomerCode: 'Customer Code',
        SupplierCode: 'Supplier Code',
        PID: 'PID',
        MFGPN: 'MPN',
        ProductionPN: 'Production PN',
        MFGPNDescription: 'Description',
        SupplierPN: 'SPN',
        CustomerPN: 'CPN',
        Nickname: 'Nickname',
        CPN: 'CPN Part',
        PartType: 'Part Type',
        ShelfLifeDays: 'Shelf Life Days',
        ShelfLifeDaysPer: 'Shelf Life Days (%)',
        ShelfLifAcceptanceDays: 'When receiving: Accept with permission if expires in (Days)',
        MaxShelfLifAcceptanceDays: 'When Receiving: Reject if expires in (Days)',
        ShelfLifeDateType: 'Shelf Life Date Type',
        LtbDate: 'LTB Date',
        EolDate: 'EOL Date',
        ReversalDate: 'Reversal Date',
        noOfPosition: 'Pin Count',
        noOfPositionText: 'Pin Count (External)',
        Manufacturer: 'Manufacturer',
        MFRName: 'MFR Name',
        SupplierName: 'Supplier Name',
        CustomerName: 'Customer Name',
        Rev: 'Rev',
        AssyID: 'Assy ID',
        AssyType: 'Assy Type',
        MFRDateCodeFormat: 'MFR Date Code Format',
        MFRDateCode: 'MFR Date Code',
        PackagingBoxSerial: 'Packaging/Box Serial#',
        SerialNo: 'Serial#',
        PackagingBoxWeightHelp: '((Assy Weight * Qty Per Box) + Box Weight).',
        Alias: 'Alias',
        ChangeCompanyOwnership: 'Change Company Ownership',
        ScanMPNSPN: 'MPN/SPN',
        MPNCPN: 'CPN/MPN',
        SpecialNote: 'Special Note',
        AllowToUpdateNote: 'Note: Please enable feature rights to update address details.',
        Packaging: 'Packaging'
      },
      BOM: {
        QuoteGroup: 'Update Quote Group',
        QuoteGroupDate: 'Quote Group Date',
        QuoteGroupAssy: 'Quote Group Assy Count',
        InternalVersion: 'Current Internal Version',
        AssyAtGlance: 'Assy At Glance',
        AssyType: 'Assy Type',
        EditRFQ: 'Update RFQ',
        Standards: 'Standards',
        BusinessRisk: 'Business Risk',
        AssyLevel: 'Assy Level',
        BOMStatus: 'Engr. BOM Status',
        TotalQuote: 'Total Quote Count',
        LastQuote: 'Last Quote#',
        LastQuoteDate: 'Last Quote Date',
        LastQuotedInternalVersion: 'Last Quoted Internal Version',
        RNDStatus: 'R&D Activity',
        BOM_STATUS: 'Click here to unlock the BOM',
        BOM_LOCK_STATUS: 'BOM is locked',
        RFQStatus: 'RFQ Status',
        QuoteProgress: 'Quote Progress',
        QuoteQty: 'Quote Qty',
        REF_DES: 'RefDes',
        DNP_REF_DES: 'DNP RefDes',
        BOM_LineID: 'BOM Item#',
        BOM_Item: 'Item',
        CPN: 'CPN',
        CPN_REV: 'CPN Rev'
      },
      SuppliesMaterialsAndTools: {
        PageName: 'Supplies, Materials & Tools',
        MenuName: 'Supplies, Materials & Tools'
      },
      Equipment: {
        PageName: 'Equipment',
        MenuName: 'Equipments'
      },
      Personnel: {
        PageName: 'Personnel',
        MenuName: 'Personnel'
      },
      Department: {
        PageName: 'Department'
      },
      Standards: {
        PageName: 'Standard',
        MenuName: 'Standards'
      },
      StockAdjustment: {
        PageName: 'Add Stock Adjustment',
        AvailableStock: 'Available Stock',
        InvalidQty: 'Adjustment Qty must be less or equal than Available Stock.',
        AdjustmentQty: 'Adjustment Qty',
        Notes: 'Notes'
      },
      SalesOrder: {
        SO: 'SO#',
        SODate: 'SO Date',
        PODate: 'PO Date',
        Revision: 'SO Version',
        LineID: 'SO Line#',
        POLineID: 'Cust PO Line#',
        POQTY: 'PO Qty',
        KitQty: 'Kit Qty',
        PO: 'PO#',
        RemainPOQty: 'Remain PO Qty',
        RemainKitQty: 'Remain kit Qty',
        MaterialDockDate: 'Material Dock Date',
        PODueDate: 'Promised Ship Date',
        KitReleaseQty: 'Planned Kit & Planned Build Qty',
        POOrderQty: 'Promised Ship Qty From PO',
        PlannKit: 'Planned Kit#',
        MFGLeadTime: 'Build Lead Time (Business Days)',
        KitReleaseDate: 'Planned Kit Release Date',
        RealTimeFeasibility: 'Build Feasibility (Real Time)',
        ActualKitReleaseDate: 'Actual Kit Release Date',
        ReleaseBy: 'Released By',
        ReturnBy: 'Return By',
        ReleaseTimeFeasibility: 'Feasibility at the time of the release',
        KitStatus: 'Kit Status',
        KitReleasedStatus: 'Kit Release Status',
        KitReturnedStatus: 'Kit Return Status',
        KitReturnedDate: 'Kit Return Date',
        Shortage: 'Shortage Qty',
        RushJob: 'Rush Job',
        ReleasedComment: 'Released Comment',
        ReleaseKitNumber: 'Kit Release#',
        ShortageLines: 'Shortage Line(s)/Total Line(s)',
        SalesCommissionTo: 'Sales Commission To',
        QuoteGroup: 'Quote Group',
        QuoteTurnTime: 'Quote Qty Turn Time',
        QuoteNumber: 'Quote#',
        QuoteStatus: 'Quote Status',
        DoNotCreateKit: 'Do not Create Kit',
        ShippingComments: 'Header Shipping Comments',
        ShippingCommentsLine: 'Line Shipping Comments',
        InternalNotes: 'Header Internal Notes',
        InternalNotesLine: 'Line Internal Notes',
        Customer: 'Customer',
        Terms: 'Terms',
        ShippingMethod: 'Shipping Method',
        AssyIDPID: 'Assy ID/PID',
        AssyNumberMFGPN: 'Assy#/MPN',
        RMAPo: 'RMA PO',
        CCMPDD: 'CCMPDD',
        ShippingAddress: 'Shipping Address',
        ReleaseNumber: 'FCA Release#',
        ReleaseNote: 'Release Notes',
        AdditionalNote: 'Additional Notes',
        CancellationReason: 'Cancellation Reason',
        RequestedDockDate: 'Requested Dock Date',
        RequestedShipDate: 'Requested Ship Date',
        PromisedShipDate: 'Promised Ship Date',
        LegacyPo: 'Legacy PO',
        SOPostingStatus: 'SO Posting Status',
        WoComment: 'WO Comment',
        TBDComment: 'TBD Comment',
        RMANumber: 'RMA#',
        IsDebitedByCustomer: 'Debited By Cust',
        OrgPONumber: 'Orig. PO#',
        IsReworkRequired: 'Rework Required',
        ReworkPONumber: 'Rework PO#',
        POType: 'PO Type',
        PORevision: 'PO Revision',
        SOVersionShort: 'SO Ver.',
        BlanketPO: 'Blanket PO',
        BlanketPOOption: 'Blanket PO Option',
        PORevDate: 'PO Revision Date',
        BlanketPONumber: 'BPO#',
        ReleaseQty: 'Release Qty',
        FreeOnBoard: 'Free On Board',
        OtherChargeType: 'Other Line From',
        ReOpenSO: 'Re-Open SO {0}'
      },
      TransferStock: {
        WH: 'Warehouse',
        ParentWH: 'Parent Warehouse',
        Bin: 'Location/Bin',
        UMID: 'UMID',
        Kit: 'Kit',
        CurrentLocation: 'Current Location/Bin',
        CurrentWH: 'Current Warehouse',
        CurrentDepartment: 'Current Department',
        ToBin: 'To Location/Bin',
        InTransitBinToBin: 'In Transit(Bin to Bin)',
        CanNotDrag: 'CAN NOT DRAG',
        NextPlannedRelease: 'Next Planned Release',
        LastPlannedRelease: 'Last Planned Release',
        ActualPlannedKitReleaseDate: 'Actual Planned Kit Release Date',
        Department: 'Department',
        WHToWHTransfer: 'WH To WH Xfer',
        BinToWhTransfer: 'Bin To WH Xfer',
        BelongToKit: 'Belongs to selected kit',
        BelongToAnyKit: 'Belongs to any kit',
        NotBelongToKit: 'Does not belong to any kit'
      },
      SupplierQuote: {
        SupplierQuote: 'Supplier Quote',
        Supplier: 'Supplier',
        Quote: 'Quote#',
        QuoteDate: 'Quote Date',
        QuoteStatus: 'Quote Status',
        Reference: 'Reference',
        MapSupplier: 'Map Manufacturer',
        PartPricing: 'Part Pricing',
        Item: 'Item',
        Qty: 'Qty',
        Min: 'Min',
        Mult: 'Mult',
        Stock: 'Stock',
        Packaging: 'Packaging',
        CustomReel: 'Custom Reel',
        NCNR: 'NCNR',
        LeadTime: 'Lead Time',
        UnitOfTime: 'Unit Of Time',
        UnitPrice: 'Unit Price ($)',
        menuEntries: {
          remove_row: { value: 'remove_row', name: 'Remove Selected Row(s)' }
        },
        FieldMapper: {
          itemNumber: 'itemNumber',
          packageID: 'packageID',
          reeling: 'reeling',
          NCNR: 'NCNR',
          UnitOfTime: 'UnitOfTime',
          UnitPrice: 'UnitPrice',
          qty: 'qty',
          leadTime: 'leadTime',
          stock: 'stock',
          negotiatePrice: 'negotiatePrice'
        },
        EntityMapper: {
          itemNumber: 'Item #',
          qty: 'Qty',
          UnitPrice: 'Unit Price ($)',
          leadTime: 'Lead Time',
          UnitOfTime: 'Unit Of Time',
          packageID: 'Packaging',
          min: 'Min',
          mult: 'Mult',
          stock: 'Stock',
          reeling: 'Custom Reel',
          NCNR: 'NCNR'
        },
        PricingErrors: {
          ToolTipInvalid: 'Invalid value for {0}.',
          Required: '{0} required.',
          InvalidNumber: '{0} must be a number.',
          InvalidRange: '{0} must be in between 1 to 99999999',
          InvalidValue: 'Invalid value for {0}.',
          InvalidPackaging: 'Invalid Packaging.',
          InvalidUnitOfTime: 'Invalid Unit of Time.',
          Invalid: 'Invalid {0}. Must be Yes, No or Unknown.',
          PricingLineAlreadyExist: 'Pricing line already exist with same Qty, Lead Time and Unit of Time.',
          PricingItemNumberAlreadyExist: 'Pricing line Item# already exist.',
          PricingAlreadyExist: 'Pricing line Item# is already exist with same Qty, Lead Time and Unit of Time.',
          NegotiatePrice: 'Negotiated Price must be less than or equal to Unit Price.',
          UnitPrice: 'Unit Price must be greater than Negotiated Price.'
        }
      },
      Bank: {
        BankAccountCode: 'Bank Account Code',
        PaymentDate: 'Payment Date',
        RefundToBankAccountCode: 'Refund To (Bank Account Code)'
      },
      PartAttribute: {
        MountingType: 'Mounting Type',
        FunctionalType: 'Functional Type',
        Unit: 'Unit',
        Package: 'Package/Case (Shape) Type',
        PackageCase: 'Package/Case (Shape) ',

        ConnectorType: 'Connector Type',
        RoHSStatus: 'RoHS Status',
        Packaging: 'Packaging',
        Feature: 'Feature',
        MinOperatingTemp: 'Min. Operating Temp. (°C)',
        MaxOperatingTemp: 'Max. Operating Temp. (°C)',
        TempCoefficient: 'Temperature Coefficient',
        TempCoefficientUnit: 'Temperature Coefficient Unit',
        TempCoefficientValue: 'Temperature Coefficient Value',
        noOfPosition: 'Pin Count',
        NoOfRows: 'No. Of Rows',
        Pitch: 'Pitch (Unit in mm)',
        PitchMating: 'Pitch Mating(Unit in mm)',
        SizeDimensionLength: 'Size/Dimension Length',
        SizeDimensionWidth: 'Size/Dimension width',
        Height: 'Height',
        Tolerance: 'Tolerance',
        Voltage: 'Voltage',
        Value: 'Value',
        PowerWatts: 'Power (Watts)',
        Weight: 'Weight',
        Color: 'Color'
        //RestrictedUseWithPermission: "Restricted Use With Permission"
      },
      UMIDManagement: {
        IsCPN: 'CPN (Component) Available',
        UMID: 'UMID',
        COFC: 'COFC',
        DateOfExpiration: 'Date of Expiry',
        InitialCount: 'Initial Qty/Count',
        InitialUnits: 'Initial Units',
        UMIDPrefix: 'UMID Prefix',
        MFR: 'MFR',
        MFRPN: 'MPN',
        Count: 'Count',
        ToLocationBIN: 'To Location/BIN',
        Packaging: 'Packaging',
        CostCategory: 'Cost Category',
        InternalDateCode: 'Internal Date Code',
        LotCode: 'Lot Code',
        UMIDPendingParts: 'UMID Pending Parts',
        pcbPerArray: 'PCB Per Array',
        sealDate: 'Seal Date (MM/DD/YY)',
        MFGorExpiryDate: 'Shelf Life Date Type',
        mfgDate: 'Date of Manufacture (MM/DD/YY)',
        expiryDate: 'Date of Expiration (MM/DD/YY)',
        specialNote: 'Special Note',
        VerifyLabelAndTakePicture: 'Verify Label And Take Picture',
        TransferMaterial: 'Xfer Material',
        TransferBulkMaterial: 'Xfer Bulk Material',
        AllocatedInKit: 'Allocated In Kit',
        PSSupplier: 'PS Supplier',
        FromUMID: 'From UMID',
        ParentUMID: 'Origin UMID',
        SplitUMID: 'Split UMID',
        SplitCount: 'Split Qty/Count',
        SplitUnits: 'Split Units',
        TransferBin: 'Xfer Bin',
        PackingSlipNumber: 'Supplier Packing Slip#',
        History: 'UMID History',
        CountMaterial: 'Count Material',
        CPNPartMFR: 'Original MFR',
        CPNPartMPN: 'Original MPN',
        CPN: 'CPN',
        Receivedstatus: 'Received Status',
        Bin: 'Bin',
        InventoryType: 'Inventory Type',
        IdenticalUMID: 'Identical UMID'
      },
      Shipped: {
        ShippedQty: 'Shipped Qty'
      },
      Qty: {
        ReadyToShipQty: 'Ready To Ship',
        BackOrderQty: 'Backorder Qty (Open PO Qty)',
        WIPQty: 'WIP Qty',
        BuildOverageQty: 'Build Overage',
        IdlePOQty: 'Open PO Qty',
        BalanceQty: 'Balance Qty',
        AvailableStockQty: 'Available Stock Qty',
        StockAdjustmentQty: 'Stock Adjustment Qty',
        ReadyToShipQtyWithStockAdjustment: 'Ready To Ship With Stock Adjustment',
        ExcessShipQty: 'Excess Ship Qty',
        PossibleExcessQty: 'Possible Excess/Shortage Qty',
        ExcessFreetoUseQty: 'Excess (Free to Use)'
      },
      KitAllocation: {
        PageName: 'Kit Allocation',
        BOMCurrentInternalVersion: 'BOM Current Internal Version',
        KitAllocationInternalVersion: 'Top Level KIT BOM Version',
        AllocatedCount: 'Allocated Qty/Count',
        AllocatedUnits: 'Allocated Units',
        AllocatedUOM: 'Allocated UOM',
        ConsumedUnits: 'Consumed Units',
        ConsumedPins: 'Consumed Pins',
        ReturnUnits: 'Returned Units',
        ScrappedUnits: 'Scrapped Units',
        ExpiredUnits: 'Expired Units',
        AllocatedPins: 'Allocated Pins',
        ScrapedPins: 'Scrapped Pins',
        ConsumedCount: 'Consumed Qty/Count',
        AdjustUnits: 'Adjusted Units',
        AdjustCount: 'Adjusted Qty/Count',
        ReleaseNumber: 'Release#',
        ShortagePerBuildUnits: 'Shortage Units',
        ShortagePerBuildPins: 'Shortage Pins',
        ShortagePerBuildWithAvailableUnits: 'Shortage Units With Available Stock',
        ShortagePerBuildWithAvailablePins: 'Shortage Pins With Available Stock',
        Count: 'Qty/Count',
        Units: 'Units',
        InitialCount: 'Initial Qty/Count',
        InitialUnits: 'Initial Units',
        CheckBuildFeasibility: 'Check Build Feasibility',
        BuildFeasibility: 'Build Feasibility',
        ChangePlanning: 'Change Planning',
        KitPreparationTab: 'Kit Preparation',
        DeallocateInventory: 'DEALLOCATE INVENTORY',
        DeallocateCancel: 'CANCEL',
        RoHSApprovalReason: 'RoHS Approval Reason',
        RoHSApprovedBy: 'RoHS Approved By',
        RoHSApprovedOn: 'RoHS Approved On',
        ReleaseReturnKit: 'Release/Return Kit',
        KitDetails: 'Kit Details',
        InitiateKitReturn: 'Initiate Kit Return',
        ReturnKit: 'Return Kit',
        GotoAllocatedUMIDs: 'Go to Allocated UMID(s)',
        ShortageIndication: 'Shortage is less then 30%.',
        KitReleaseDate: 'Kit Release Date',
        KitReleaseStatus: 'Kit Release Status',
        MaterialDockDate: 'Material Dock Date',
        PODueDate: 'Promised Ship Date',
        DeallocatedMaterial: 'Deallocated Material',
        ReReleaseKitPlan: 'Re-release Kit Plan',
        NonKittingItem: 'Non-Kitting Item',
        NonKittingItemReason: 'Reason For Non-Kitting Item',
        RemaingUnallocatedStock: 'Remaining Unallocated Stock'
      },
      Purchase: {
        MRPQty: 'MRP Qty',
        PO: 'PO#',
        PODate: 'PO Date',
        PurchasedQty: 'Purchased Qty',
        PurchasedUnits: 'Purchased Units',
        PurchasedDetails: 'Purchased Details',
        PricePerUnit: 'Price per Unit',
        ExtendedPrice: 'Extended Price',
        SO: 'SO#'
      },
      SalesCommission: {
        CostSummary: 'Sales Commission Notes',
        Price: 'Price ea (including commission) ($)',
        ActualPrice: 'Price ea (excluding commission) ($)',
        CommissionDollar: 'Commission ea ($)',
        ExtCommissionDollar: 'Ext. Commission ($)',
        CommissionPercentage: 'Commission ea (%)',
        OrgPrice: 'Quoted Price ea (including commission) ($)',
        ActualOrgPrice: 'Quoted Price ea (excluding commission) ($)',
        OrgCommissionPercentage: 'Quoted Commission ea (%)',
        OrgCommissionDollar: 'Quoted Commission ea ($)',
        ExtOrgCommissionDollar: 'Ext. Quoted Commission ($)',
        QuoteAttribute: 'Commission Calc. From',
        Type: 'Type',
        Action: 'Action',
        SalePrice: 'Sale Price',
        QuotedPrice: 'Quoted Price',
        POQty: 'PO Qty',
        QuotedQty: 'Quoted Qty'
      },
      Customer_PO_Status_Report: {
        PageName: 'Customer PO Status Report'
      },
      HELP_BLOG_MESSAGES: {
        DESCRIPTION: 'Blog Description',
        HELP_BLOG: 'Help blog'
      },
      SHOW_USER_STATUS: {
        CountDown: 'Countdown Timer',
        Action: 'Action',
        Image: 'Prompt',
        User: 'User',
        PromptColor: 'Prompt Color',
        ToWH: 'To WH (cartID)',
        UMID: 'UMID',
        FromWH: 'From WH',
        Dept: 'From Dept',
        ToCartID: 'To CartID',
        IdealCart: ' are in idle state.',
        FeatureEnableText: 'Allow feature to enable.',
        SmartCartUser: 'SMART CART USERS',
        CancelRequest: 'Cancel Request',
        ReservedSide: 'Reserved Side',
        RequestType: 'Request Type',
        OfflineSmartCarts: 'Offline Smart Carts',
        PickedUser: 'Pick User',
        PickColor: 'Pick Color',
        PromptNumber: 'Prompt#',
        DropColor: 'Drop Color'
      },
      PART_MASTER: {
        PageName: 'Manage Parts Detail',
        BypassMachineSetupHint: 'System will Auto Verify UMID',
        RequireSuperVisorApprHint: 'Require Level 2 UMID Verification'
      },
      DYNAMIC_MESSAGE: {
        MessageCode: 'Message Code',
        MessageType: 'Message Type',
        Category: 'Category'
      },
      Show_Light_Instruction: 'To search smart cart, select desired results & click show light',
      Show_Light_Instruction_Select: 'Click to show light & initiate transfer material or click to cancel the action.',
      DK_CURRENT_VERSION: 'Current Version',
      FeatureEnableText: 'Allow feature to enable.',
      ConditionalFeatureEnableToolTip: '<br /> <b>Enable feature to use.</b>',
      SelectRecordsEnableButton: 'Select records to enable button.',
      SelectDataFrom: {
        contactChipsSelect: 'Type here and select'
      },
      Audit_Page: {
        Warehouse: 'Warehouse',
        Bin: 'Bin/Location',
        PID: 'PID',
        Side: 'Side',
        Qty: 'Qty',
        Error: 'Error Status',
        UMID: 'UMID',
        Action: 'Action',
        Seconds: 'Sec',
        Hint: 'Scan or Type & Enter only one side of the smart cart at a time like ST02-L, ST02-R.',
        TotalSlot: 'Total Slot',
        TotalRow: 'Total Number of Rows'
      },
      RACK_MST: {
        AvailableRack: 'Show Available Racks',
        ClearRack: 'Clear Rack',
        IncomingRack: 'Incoming Rack',
        OutgoingRack: 'Outgoing Rack',
        EmptyRack: 'Show Empty Racks',
        RackHistory: 'Rack History',
        ScanRack: 'Rack Menu',
        Rack: 'Rack',
        OperationStatus: 'Operation Status',
        AssyStatus: 'Assy Status',
        CurrentOP: 'Current OP#',
        CurrentWO: 'Current WO#'
      },
      MANUAL_PRICE_MSG: {
        CELL_COLOR: 'Cell highlights with red color',
        MESSAGE_VAL1: '1. If Qty Unit Price($)  is less than higher Qty Unit Price($).',
        MESSAGE_VAL2: '2. If Qty Ext. Price($) is greater than higher Qty Ext. Price($).'
      },
      MANUAL_ASSEMBLY_SALES_PRICE_MATRIX_MSG: {
        CELL_COLOR: 'Cell highlights with red color',
        MESSAGE_VAL1: '1. If Qty Unit Price($) is less than higher Qty Unit Price($).',
        MESSAGE_VAL2: '2. If Qty, Turn Time and Unit Of Time wise dupliicate entry found.'
      },
      PURCHASE_INSPECTION_REQUIREMENT: {
        Template: 'Template',
        PurchaseRequirement: 'Requirements & Comments',
        PartRequirementCategory: 'Requirements & Comments Category'
      },
      MFGCODE_COMMENT: {
        Template: 'Template',
        PurchaseRequirement: 'Comment',
        PartRequirementCategory: 'Category',
        PartRequirementCategoryType: 'Part Requirement Category'
      },
      PACKING_SLIP: {
        PackingSlipLine: 'Packing Slip Line#',
        PackingSlip: 'PackingSlip',
        RefInvoiceNumber: 'Ref. Invoice#',
        OPEN_STATE: 'Open',
        CLOSED_STATE: 'Closed',
        COMPLETE: 'C',
        PENDING: 'P',
        CANCELED: 'CA',
        CANCELED_STATE: 'Canceled',
        Material_Receive_Detail: 'Material Receipts',
        POLineID: 'PO Line ID',
        TotalLines: 'Total Lines',
        RejectedLines: 'Rejected Lines',
        AcceptedWithDeviationLines: 'Accepted with Deviation Lines',
        AcceptedLines: 'Accepted Lines',
        PendingLines: 'Pending Lines',
        PackingSlipQty: 'Packing Slip/Ship Qty',
        OrderedQty: 'Ordered Qty',
        Packaging: 'Packaging',
        ReceivedQty: 'Received Qty',
        PackingSlipDate: 'Packing Slip Date',
        PackingSlipNumber: 'Packing Slip#',
        PackingSlipStatus: 'Packing Slip Status',
        MaterialReceiptDate: 'Material Receipt Date',
        PSLineNumber: 'PS Line#',
        CustomerConsigned: 'Customer Consigned (No Charge)',
        NonUMIDStock: 'Do Not Create UMID',
        Customer: 'Customer',
        LockStatus: 'Lock Status',
        PackingSlipPostingStatus: 'Packing Slip Posting Status'
      },
      Employee: {
        ZipCode: 'Zip/Postal Code',
        City: 'City',
        State: 'State',
        Country: 'Country'
      },
      LabelTemplate: {
        Name: 'Label Templates',
        Title: 'Label Template'
      },
      SupplierInvoice: {
        PackingSlipNumber: 'Packing Slip#',
        InvoiceNumber: 'Invoice#',
        CreditMemoNumber: 'Credit Memo#',
        CreditMemoDate: 'Credit Memo Date',
        DebitMemoNumber: 'Debit Memo#',
        DebitMemoDate: 'Debit Memo Date',
        PaymentTerms: 'Supplier PMT Terms',
        InvPaymentTerms: 'INV/CM/DM PMT Terms',
        CMPaymentTerms: 'CM PMT Terms',
        DMPaymentTerms: 'DM PMT Terms',
        SupplierPaymentTermsForInv: 'Supplier PMT Terms',
        PaidAmount: 'Paid Amount ($)',
        PaymentMethod: 'Payment Method',
        Discount: 'Internal Discount & Credits',
        TransactionMode: 'Transaction Mode',
        MaterialReceiptDate: 'Material Receipt Date',
        ExtendedAmount: 'Extended Amount ($)',
        ExtendedInvoiceAmount: 'Extended Invoice Amount'
      },
      CustomerInvoice: {
        ReceivedAmount: 'Received Amount'
      },
      SupplierRMA: {
        RMAPostingStatus: 'RMA & RMA Packing Slip Posting Status',
        RMAStatus: 'Supplier RMA/CM Status',
        Supplier: 'Supplier',
        RMANumber: 'RMA#',
        RMADate: 'RMA Date',
        PackingSlipNumber: 'Packing Slip#',
        PackingSlipDate: 'Packing Slip Date',
        ShippedDate: 'Ship By Date',
        RMADocuments: 'RMA Documents',
        ItemsReturn: 'Items Return',
        RefCreditMemoNumber: 'Credit Memo#',
        RefCreditMemoDate: 'Credit Memo Date',
        RMARemark: 'RMA Comment',
        InternalRMARemark: 'Internal RMA Comment',
        ShippingMethod: 'Shipping Method',
        Carrier: 'Carrier',
        CarrierAccount: 'Carrier Account#',
        ShippingInsurance: 'Shipping With Insurance',
        RMALine: 'RMA Line#',
        RefPackingSlipNumber: 'Packing Slip#',
        RefInvoiceNumber: 'Supplier Invoice#',
        RMAIssueQty: 'RMA Qty',
        ShippedQty: 'Shipped Qty',
        RMAUnitPrice: 'PO Unit Price',
        ExtendedRMAPrice: 'Extended RMA Price',
        RMALineRemark: 'RMA Line Comment',
        InternalRMALineRemark: 'Internal RMA Line Comment'
      },
      PURCHASE_ORDER: {
        PO: 'PO#',
        ShippingInsurance: 'Shipping With Insurance',
        ShippingComment: 'Internal Notes',
        DueDate: 'Due Date',
        SupplierPromisedDeliveryDate: 'Supplier Promised Delivery Date',
        BlanketPO: 'Blanket PO',
        LineComment: 'Line Comments',
        POLineID: 'PO Line ID',
        Description: 'Description',
        AdditionalNote: 'Additional Notes',
        ReleaseNotes: 'Release Notes',
        POComments: 'PO Comments',
        InternalComments: 'Internal Comments',
        BillToShipTo: 'Billing Address / Shipping Address',
        MarkFor: 'Intermediate Shipping',
        PurchaseRequirement: 'Purchase Order Material Purchase Requirement',
        ShippingAddress: 'Shipping Address',
        TotalRelease: 'Total Releases',
        PODate: 'PO Date',
        POWorkingStatus: 'PO Working Status',
        POPostingStatus: 'PO Posting Status',
        PORevision: 'PO Revision',
        InternalNotes: 'Line Internal Notes',
        POCompleteReason: 'PO Complete Reason',
        POCompleteReleaseLineReason: 'PO Release Complete Reason',
        POCompleteLineReason: 'PO Line Completion Reason',
        OtherCharge: 'Other Charge',
        Comments: 'Comment',
        POCancelReason: 'Cancellation Reason',
        POUndoReason: 'Undo Cancellation Reason',
        CancellationConfirmed: 'Cancellation Confirmed by Supplier',
        OpenQty: 'Open Qty',
        ReceivedQty: 'Received Qty',
        LastMaterialReceiptDate: 'Last Material Receipt Date',
        MaterialReceiptNumber: 'Packing Slip#',
        CustomerConsigned: 'Customer Consigned (No Charge)',
        Customer: 'Customer',
        NonUMIDStock: 'Do Not Create UMID',
        LockStatus: 'Lock Status',
        Supplier: 'Supplier',
        ContactPerson: 'Contact Person'
      },
      COMPONENT: {
        Part: 'Part'
      },
      MFRQtyTooltipNotes: {
        PossibleExcessQtyHelpText: '(Ready To Ship [A] +  WIP Qty [B]) - Backorder Qty [D]',
        NegativePossibleExcessQtyHintText: 'Shortage is negative value & requires build planning.',
        ExcessFreetoUseHelpText: 'Actual Build Qty - Scrapped Qty - PO Qty + Adjustment Qty',
        TotalAvailableQtyHelpText: 'Ready To Ship [A] + WIP  Qty [B]',
        TotalReadyToShipWithAdjustmentQtyHelpText: 'Hint: Includes any stock adjustment'
      },
      ScanOREnter: {
        ScanUMID: 'Scan UMID or Type & Enter',
        ScanOldUMID: 'Scan Old UMID or Type & Enter',
        ScanNewUMID: 'Scan New UMID or Type & Enter',
        ScanMPNSPN: 'Scan MPN/SPN label (1D or 2D) or Type & Enter',
        ScanPID: 'Scan PID or Type & Enter',
        ScanCPN: 'Scan CPN Part or Type & Enter',
        ScanMPNwithoutBarcode: 'Scan MPN (Without Barcode) or Type & Enter',
        ScanRack: 'Scan Rack or Type & Enter',
        ScanBin: 'Scan Location/Bin or Type & Enter',
        ScanFromBin: 'Scan From Location/Bin or Type & Enter',
        ScanToBin: 'Scan To Location/Bin or Type & Enter',
        ScanBinOrSmartCart: 'Scan Bin/Smart Cart or Type & Enter',
        ScanWarehouse: 'Scan Warehouse or Type & Enter',
        ScanFeeder: 'Scan Feeder# or Type & Enter',
        ScanSerialNum: 'Scan Serial# or Type & Enter',
        ScanFromSerialNum: 'Scan From Serial# or Type & Enter',
        ScanToSerialNum: 'Scan To Serial# or Type & Enter',
        ScanWorkorderNum: 'Scan WO# or Type & Enter',
        ScanOperationNum: 'Scan OP# or Type & Enter',
        ScanFromPackagingBoxSerialNum: 'Scan Packaging/Box Serial# or Type & Enter',
        ScanToPackagingBoxSerialNum: 'Scan Packaging/Box Serial# or Type & Enter',
        ScanCustomerPSNum: 'Scan Customer PS# or Type & Enter',
        Scan1D2DLabel: 'Scan 1D/2D barcode or Type & Enter. Scan 1P from 1D barcode',
        ScanInternalRefNum: 'Scan Internal Ref# or Type & Enter',
        ScanMFRSerialNum: 'Scan MFR Serial# or Type & Enter',
        ScanFinalSerialNum: 'Scan Final Product Serial# or Type & Enter'

      },
      Supplier: {
        Standard: 'Standard',
        Standards: 'Standards',
        LastApprovalDate: 'Issue Date',
        ExpirationDate: 'Expiration Date',
        CertificateNumber: 'Certificate Number'
      },
      SHIPMENT_SUMMARY: {
        ALL_COMPLETED_RELEASE_LINE: 'Some release(s) are Pending or TBD. To view line(s), Add release as required per schedule or Select "Incl. Completed Release Line" in filter.'
      },
      Address: {
        BillingAddress: 'Billing Address',
        ShippingAddress: 'Shipping Address',
        ShippingFromAddress: 'Shipping From Address',
        BusinessAddress: 'Business Address',
        RMAShippingAddress: 'Shipping From Address (RMA)',
        RemitTo: 'Remit To',
        RemitToAddress: 'Remit To Address',
        WireTransferAddress: 'Wire Transfer Address',
        SupplierRMAAddress: 'Supplier RMA Address',
        PayToAddress: 'Remit To Address',
        MarkForAddress: 'Intermediate Shipping Address',
        SupplierBusinessAddress: 'Supplier Business Address',
        UnsetTheDefaultAddress: 'Unset the Default Address',
        SetAsDefaultAddress: 'Set as Default Address',
        RMAIntermediateAddress: 'RMA Intermediate Address'
      },
      EmployeeContPersonHistory: {
        EmployeePopupTitle: 'Assigned Contact Person To Functional User Account History',
        ContPersonPopupTitle: 'Functional User Account History for Contact Person'
      },
      Datakey: {
        DATAKEY_LABEL: {
          DATAKEY: 'Data key',
          DATAKEYS: 'Data Keys',
          DATAKEYSHISTORY: 'Data Keys History',
          SYSTEMCONFIGRATIONS: 'SYSTEMCONFIGRATIONS',
          DATAKEY_CLUSTERNAME: 'Cluster Name',
          DATAKEY_VALUE: 'Value',
          DATAKEY_DESCRIPTION : 'Description',
          HINT : 'Hint: Click on update button to change value.',
          UPDATE: 'Update',
          Individual: 'Individual',
          Cluster: 'Cluster',
          All: 'All',
          DATAKEY_AccountYear: {
            FY: 'FY',
            CY: 'CY'
          },
          AccountingYear: 'AccountingYear',
          CommonNumberFormat: 'CommonNumberFormat',
          Cancel: 'Cancel',
          Save: 'Save',
          SaveAndExit: 'Save & Exit'
        },
        DATAKEY_INPUTCONTROLNAME: {
          NumberBox: 'NumberBox',
          RadioButton: 'RadioButton',
          TextBox: 'TextBox',
          TextBoxMasking: 'TextBoxMasking',
          TextEditor: 'TextEditor',
          TextBoxTypeEmail: 'TextBoxTypeEmail',
          DropDown: 'DropDown',
          TextBoxJsonViewer: 'TextBoxJsonViewer',
          TextBoxTypeUrl: 'TextBoxTypeUrl',
          TimePicker: 'TimePicker',
          NumberFormatForm: 'NumberFormatForm'
        }
      }
    },
    COMPONENT_ROHS_DEVIATION_TOOLTIP_MESSAGE: '<b>None:</b> If this option selected during assembly creation, then RoHS Category of all parts of BOM must be same as BOM RoHS category. <br /> <b>Allowed w/ Engr. Approval:</b> If this option selected during assembly creation, then all parts of BOM allowed including Non-RoHS, RoHS 3 and above or RoHS components with the approval of customer.',
    COMPONENT_UPLOAD_PART_FOR_PARTSTAT_TOOLTIP_MESSAGE: 'Upload excel file containing list of part numbers to get filtered list of parts for exporting it in the partstat. <br />System will pick first column as part#.',
    COMPONENT_SELF_LIFE_DAYS_FORMULA_TOOLTIP: `Validate at UMID creation level for the shelf life day calculations<br />Validation 1<br />Date of Manufacture must be less than current date<br />
                                              <table>
	                                              <tr>
		                                              <th>Mfg Date&nbsp;&nbsp;</th>
		                                              <th>Add Days&nbsp;&nbsp;</th>
		                                              <th>Expiry Date&nbsp;&nbsp;</th>
 		                                              <th>Current Date&nbsp;&nbsp;</th>
		                                              <th>Difference&nbsp;&nbsp;</th>
		                                              <th>Shelf Expiration&nbsp;&nbsp;</th>
		                                              <th>Tolerance&nbsp;&nbsp;</th>
		                                              <th></th>
	                                              </tr>
	                                              <tr>
		                                              <td>1-2-2019</td>
 		                                              <td>180</td>
		                                              <td>31-7-2019</td>
		                                              <td>22-2-2019</td>
		                                              <td>159</td>
		                                              <td>400</td>
		                                              <td>75 = 300</td>
 		                                              <td>300 > 159 InValid</td>
	                                              </tr>
	                                              <tr>
		                                              <td>1-2-2019</td>
 		                                              <td>180</td>
		                                              <td>31-7-2019</td>
		                                              <td>22-2-2019</td>
		                                              <td>159</td>
		                                              <td>200</td>
		                                              <td>75 = 150</td>
 		                                              <td>150 < 159 Valid</td>
	                                              </tr>
                                              </table>
                                              <br />Validation 2<br />Date of Expiry must be grater than current date<br />
                                              <table>
	                                              <tr>
		                                              <th>Expiry Date&nbsp;&nbsp;</th>
 		                                              <th>Current Date&nbsp;&nbsp;</th>
 		                                              <th>Difference&nbsp;&nbsp;</th>
 		                                              <th>Shelf Expiration&nbsp;&nbsp;</th>
 		                                              <th>Tolerance&nbsp;&nbsp;</th>
		                                              <th></th>
	                                              </tr>
	                                              <tr>
		                                              <td>31-5-2019</td>
		                                              <td>22-2-2019</td>
		                                              <td>98</td>
		                                              <td>200</td>
		                                              <td>75 = 150</td>
		                                              <td>150 > 98 InValid</td>
	                                              </tr>
	                                              <tr>
		                                              <td>31-5-2019</td>
		                                              <td>22-2-2019</td>
		                                              <td>98</td>
		                                              <td>100</td>
		                                              <td>75 = 75</td>
		                                              <td>75 < 98 Valid</td>
	                                              </tr>
                                              </table>`,
    COMPONENT_CLOUD_API_UPDATE_SWITCH_TOOLTIP_MESSAGE: 'List of Fields that determines when which field will be updated weather Cloud Update is On/ Off: <br /><b> Update when ON: </b><br /> No.of Rows | Tolerance | Feature | Functional Type(External) | Mounting Type(External) | Mounting Type | Voltage | Pitch Mating | <br />  Pitch | Power | No.Position | Value | Temperature Coefficient | Temperature Coefficient Value | Temperature Coefficient Unit |  Color <br /><b>  Always update: </b><br /> Part Status(External) | RoHS Status(External)  | Source  |  Connector Type(External) <br /><b> Always update(update if Empty): </b><br /> EOL Date | LTB Date | Lead Time | Packaging | Part Status | RoHS Status | Data Sheet | Connector Type | Package/Case(Shape) Type | <br />Tentative Price Ea($) | Obsolete Date | Detailed Desc | Min | Mult | MFR SPQ | UMID SPQ<br /> Other field which are not listed will not be updated in Cloud Update.',
    ENTERPRISE_ADVANCE_SEARCH_FORMULA_TOOLTIP: `<table>
                                                  <tr>
		                                                <th class="font-size-13 padding-0-10-imp">No.&nbsp;&nbsp;</th>
		                                                <th class="font-size-13 padding-0-10-imp">Command</th>
                                                    <th class="font-size-13 padding-0-10-imp">KeyWord</th>
                                                    <th class="font-size-13 padding-0-10-imp">Description</th>
                                                    <th class="font-size-13 padding-0-10-imp">Example</th>
                                                  </tr>
                                                  <tr>
		                                                <td class="font-size-13 padding-0-10-imp">1.&nbsp;&nbsp;</td>
                                                    <td class="font-size-13 padding-0-10-imp">Exact Match <br /> (Default)</td>
                                                    <td class="font-size-13 padding-0-10-imp">NULL</td>
                                                    <td class="font-size-13 padding-0-10-imp">It will give the result with exact match of the search criteria<br /> by default. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                    <td class="font-size-13 padding-0-10-imp">SMT Pick & Place => SMT Pick & Place</td>
	                                                </tr>
                                                  <tr>
 		                                                  <td class="font-size-13 padding-0-10-imp">2.&nbsp;&nbsp;</td>
		                                                  <td class="font-size-13 padding-0-10-imp">Exact Match</td>
                                                      <td class="font-size-13 padding-0-10-imp">""</td>
                                                      <td class="font-size-13 padding-0-10-imp">For Exact Match search, need to use double quotes (" ") around  <br />the search criteria to get result for exact match. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                     <td class="font-size-13 padding-0-10-imp">
                                                            "Shelving Cart" => Shelving Cart
                                                        </td>
                                                  </tr>
                                                  <tr>
		                                                <td class="font-size-13 padding-0-10-imp">3.&nbsp;&nbsp;</td>
                                                    <td class="font-size-13 padding-0-10-imp">Start With</td>
                                                    <td class="font-size-13 padding-0-10-imp">*</td>
                                                    <td class="font-size-13 padding-0-10-imp">For Start With search, need to use (*) after the search criteria <br /> to get the result for the start with. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                    <td class="font-size-13 padding-0-10-imp">CA* => CA277, CA856, CA, california</td>
	                                                </tr>
                                                  <tr>
		                                                  <td class="font-size-13 padding-0-10-imp">4.&nbsp;&nbsp;</td>
		                                                  <td class="font-size-13 padding-0-10-imp">OR</td>
                                                      <td class="font-size-13 padding-0-10-imp">"" ""</td>
                                                      <td class="font-size-13 padding-0-10-imp">For OR search, need to use the double quote (" ") around each <br />search criteria and separate each search criteria with space. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                      <td class="font-size-13 padding-0-10-imp">"Shelving Cart" "SMT PICK & PLACE" => Shelving Cart OR SMT PICK & PLACE </td>
                                                  </tr>
                                                  <tr>
		                                                  <td class="font-size-13 padding-0-10-imp">5.&nbsp;&nbsp;</td>
		                                                  <td class="font-size-13 padding-0-10-imp">Fuzzy</td>
                                                      <td class="font-size-13 padding-0-10-imp">~</td>
                                                      <td class="font-size-13 padding-0-10-imp">For Fuzzy Search, need to user (~) after the search criteria to <br />get the result for the fuzzy search. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                      <td class="font-size-13 padding-0-10-imp">CA2801~ => CA277, CA2801, CA856</td>
                                                  </tr>                                                 
                                                </table>
                                                <table>
                                                  <tr>
		                                                <th class="font-size-13 border-0">Note: Special character are not performed for Contain, End with and Start with in Advance Search.</th>
                                                  </tr>
                                                  </table>`,
    COMPONENT_WHERE_USED_OTHER_TOOLTIP_MESSAGE: `<b>Part used in following blocks</b>
                                                  <ul>
                                                    <li>Alternate Parts</li>
                                                    <li>Drive Tools</li>
                                                    <li>Process Material</li>
                                                    <li>Customer CPN</li>
                                                    <li>Require Mating Parts</li>
                                                    <li>Pickup Pad</li>
                                                    <li>Functional Testing Tools</li>
                                                  </ul>`,
    SUPPLIER_TYPE_TOOLTIP: `<table class="table-labor-box-top border-color-white mb-5">
                              <tr>
		                            <th></th>
		                            <th>Component (Off-the-shelf) &nbsp;&nbsp;&nbsp;</th>
                                <th>Component (CPN) &nbsp;&nbsp;&nbsp;</th>
                                <th>Component (Custom Part) &nbsp;&nbsp;&nbsp;</th>
                                <th>Assembly &nbsp;&nbsp;&nbsp;</th>
                                <th>Sales Kit &nbsp;&nbsp;&nbsp;</th>
                                <th>Other(Non-Component) &nbsp;&nbsp;&nbsp;</th>
                              </tr>
                              <tr>
                                <th>All</th>
                                <td>Yes</td>
                                <td>Yes</td>
                                <td>Yes</td>
                                <td>Yes</td>
                                <td>Yes</td>
                                <td>Yes</td>
                              </tr>
                              <tr>
                                <th>Off-the-shelf</th>
                                <td>Yes</td>
                                <td>No</td>
                                <td>No</td>
                                <td>No</td>
                                <td>No</td>
                                <td>Yes</td>
                              </tr>
                              <tr>
                                <th class="pb-5">Strictly Custom Part only &nbsp;&nbsp;</th>
                                <td class="pb-5">No</td>
                                <td class="pb-5">Yes</td>
                                <td class="pb-5">Yes</td>
                                <td class="pb-5">Yes</td>
                                <td class="pb-5">Yes</td>
                                <td class="pb-5">Yes</td>
                              </tr>
                            </table>
                            <table>
                              <tr>
		                            <th>Component (Off-the-shelf): &nbsp;&nbsp;</th>
                                <td>Capacitor, Resistor, etc.</td>
                              </tr>
                              <tr>
                                <th>Component (CPN):</th>
                                <td>Customer Internal Part# for Assembly, Custom Components, Bare PCB, Capacitors, Resistors, etc.</td>
                              </tr>
                              <tr>
                                <th>Component (Custom Part):</th>
                                <td>Custom Components such as Bare PCB,  Custom Metal, Custom Plastics, Firmware, etc.</td>
                              </tr>
                              <tr>
                                <th>Assembly:</th>
                                <td>PCB Assembly, Box Assembly, Wire Assembly, etc.</td>
                              </tr>
                              <tr>
                                <th>Sales Kit:</th>
                                <td>Kitting of Components, Assembly, Custom Components etc.</td>
                              </tr>
                              <tr>
                                <th>Other(Non-Component):</th>
                                <td>Generic, NRE, Freight Charges, FAI Report, etc.</td>
                              </tr>
                            </table>`,
    CUSTOMER_PART_CPN_TOOLTIP_MESSAGE: 'Customer Part# <br /> Adding/Copying following details are not allowed for CPN parts. <br /> <b>Details:</b> Part Restriction Settings | Packaging Alias Parts | Alternate Parts | RoHS Alternate | Pickup Pad | Mating Parts | <br />Drive Tools | Process Material | Functional Testing Tools | Functional Testing Equipments.',
    PART_TYPE_TOOLTIP_MESSAGE: '<b>Assembly/Sales Kit:</b> Not Allowed to update \'Part Restriction Settings\' and \'Packaging Alias\' details.',
    RECEIVE_BULK_TOOLTIP_MESSAGE: 'This will enable in case of part type is <b>\'Other\'</b>.',
    COMPONENT_PRICE_BREAK_TOOLTIP: 'Sales Price Matrix will be enabled where the part is in update mode and it is allowed only where the Part Type is Off-the-shelf and Other.',
    SUPPLIER_INVOICE_PAID_FILTERS_TOOLTIP: 'Apply Invoice/Packing status Paid to enable this filter.',
    SUPPLIER_INVOICE_PAYMENT_METHOD_FILTERS_TOOLTIP: 'This filter will apply on "Payment Method" selected in Supplier master under the "Remit To" tab',
    SUPPLIER_INVOICE_ACCOUNT_REFERENCE_TOOLTIP: 'This field information will retrieve from the selected supplier master.',
    SUPPLIER_INVOICE_LIST_DUE_DATE_FILTERS_TOOLTIP: 'If "Due Date Filters" is checked and no value entered it will consider today\'s date as a due date.',
    SUPPLIER_INVOICE_BALANCE_DUE_DATE_FILTERS_TOOLTIP: 'If no value entered in "Due Date Filters" it will consider today\'s date as a due date.',
    PCB_PER_ARRAY_TOOLTIP_MESSAGE: 'This will enable in case Mounting Type <b>Bare PCB</b>',
    NOTE_FOR_INACTIVE_PART_NOT_SEARCHABLE: 'Inactive(internal) parts are not searchable, use Part Master to search them',
    CREDIT_DEBIT_MEMO_PRICE_ISSUE_CALCULATION_TOOLTIP: 'Formula: Variance ($) * Qty<br>Qty = Packing Slip Qty or Received Qty whichever is less.',
    UMID_LIST_CUSTOMER_STOCK_FILTER: 'Enable only if customer stock selected from MISC section',
    UMID_LIST_SUPPLIER_FILTER: 'The supplier will search data for received material for the selected supplier ',
    COPY_PART_STANDARD_HINT: 'Select \'Part Standards\' from Select Details To Copy section to copy standard details',
    SEARCH_SELECT_TO_UPDATE_HINT: 'Search & Select to load form to update information.',
    ADD_PACKGING_ALIAS_HINT: 'Select Part to copy and update attributes in part master to other packaging aliases in this action.',
    UPDATE_ATTRIBUTE_FROM_PACKAGING_HINT: 'Click UPDATE to set all attributes same as the selected part or change as required.',
    UPDATE_ATTRIBUTE_HINT: 'Change attribute as required',
    CONFIRMATION_CHANGE_PACKAGING_BASE_PART: 'You have selected {0} instead of {1} ({2}).',
    COPY_PART_SETTING_NOTE: 'All parts in the list will be added to each other as a packaging alias and settings of the selected part {0} will be copied to all other packaging aliases in the list. <br /> If desired, select a different part from the dropdown(the list) to copy settings from.',
    QUOTE_ATTRIBUTE_LIST: [{
      Type: 'Business Days', Value: 'B'
    }, { Type: 'Week Days', Value: 'D' }, { Type: 'Week', Value: 'W' }],
    TURN_TIME_LIST: [{
      Type: 'Business Days', Value: 'B'
    }, { Type: 'Week Days', Value: 'D' }],
    QUOTE_ATTRIBUTE: {
      BUSINESS_DAY: {
        TYPE: 'Business Days',
        VALUE: 'B'
      },
      WEEK_DAY: {
        TYPE: 'Week Days',
        VALUE: 'D'
      },
      WEEK: {
        TYPE: 'Week',
        VALUE: 'W'
      }
    },
    QUOTE_ATTRIBUTE_CRITERIA: [{ Name: 'Whichever is greater', Value: 1 }, {
      Name: 'Add to Lead Time', Value: 2
    }],
    QUOTE_ATTRIBUTE_TYPE: [{
      Name: 'Material', Value: 'M'
    }, {
      Name: 'Labor', Value: 'L'
    }],
    QUOTE_ATTRIBUTE_MARGIN_TYPE: [{
      Name: 'Markup $', Value: 1
    }, {
      Name: 'Markup %', Value: 2
    }],
    LegendList: {
      UMIDList: [{
        BackgroundColor: 'rgb(255,162,162)',
        FontColor: 'rgb(0,0,0)',
        Value: 'Restrict UMID'
      }],
      SalesOrderList: [{
        BackgroundColor: 'rgb(102,162,102)',
        FontColor: 'rgb(0,0,0)',
        Value: 'Fully Returned'
      }],
      FiltersList: [{
        BackgroundColor: 'rgb(3,155,229)',
        FontColor: 'rgb(0,0,0)',
        Value: 'Progressive Filters'
      }, {
        BackgroundColor: 'rgb(41,182,246)',
        FontColor: 'rgb(0,0,0)',
        Value: 'Non Progressive Filters'
      }],
      KitList: [{
        BackgroundColor: 'rgb(129,212,250)',
        FontColor: 'rgb(0,0,0)',
        Value: '14 Days left in Release'
      }, {
        BackgroundColor: 'rgb(255,241,118)',
        FontColor: 'rgb(0,0,0)',
        Value: '7 Days left in Release'
      }, {
        BackgroundColor: 'rgb(254,118,106)',
        FontColor: 'rgb(0,0,0)',
        Value: '0 Day or Release Date Passed Due OR Recalculation'
      }, {
        BackgroundColor: 'rgb(102,162,102)',
        FontColor: 'rgb(0,0,0)',
        Value: 'Fully Returned'
      }],
      TravelerList: [{
        BackgroundColor: 'rgb(129,212,250)',
        FontColor: 'rgb(0,0,0)',
        Value: 'ASSIGNED TO ME'
      }, {
        BackgroundColor: 'rgb(197,225,165)',
        FontColor: 'rgb(0,0,0)',
        Value: 'WORK IN PROGRESS'
      }, {
        BackgroundColor: 'rgb(255,241,118)',
        FontColor: 'rgb(0,0,0)',
        Value: 'PAUSED'
      }, {
        BackgroundColor: 'rgb(254,118,106)',
        FontColor: 'rgb(0,0,0)',
        Value: 'ON HOLD'
      }, {
        BackgroundColor: 'rgb(25,25,112)',
        FontColor: 'rgb(255,255,255)',
        Value: 'SEQUENTIAL OPERATION WITH CLUSTER'
      }, {
        BackgroundColor: 'rgb(255,128,0)',
        FontColor: 'rgb(255,255,255)',
        Value: 'PARALLEL OPERATION WITH CLUSTER'
      }],
      TaskList: [{
        BackgroundColor: 'rgb(129,212,250)',
        FontColor: 'rgb(0,0,0)',
        Value: 'ASSIGNED TO ME'
      }, {
        BackgroundColor: 'rgb(197,225,165)',
        FontColor: 'rgb(0,0,0)',
        Value: 'WORK IN PROGRESS'
      }, {
        BackgroundColor: 'rgb(255,241,118)',
        FontColor: 'rgb(0,0,0)',
        Value: 'PAUSED'
      }, {
        BackgroundColor: 'rgb(254,118,106)',
        FontColor: 'rgb(0,0,0)',
        Value: 'ON HOLD'
      }],
      CustomerPackingSlipList: [{
        BackgroundColor: 'rgb(133,251,233)',
        FontColor: 'rgb(0,0,0)',
        Value: 'NEAR TO EXPIRE'
      },
      {
        BackgroundColor: 'rgb(255,240,213)',
        FontColor: 'rgb(0,0,0)',
        Value: 'RESERVE STOCK'
      },
      {
        BackgroundColor: 'rgb(254,118,106)',
        FontColor: 'rgb(0,0,0)',
        Value: 'EXPIRED'
      }],
      KitAllocation: [{
        BackgroundColor: 'rgb(254,118,106)',
        FontColor: 'rgb(0,0,0)',
        Value: 'Shortage/UOM Mismatch'
      }, {
        BackgroundColor: 'rgb(249,194,188)',
        FontColor: 'rgb(0,0,0)',
        Value: 'Stock of Non-Kitting Item'
      }],
      phoneCategory: [{
        BackgroundColor: 'rgb(25,25,112)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Primary Phone'
      }, {
        BackgroundColor: 'rgb(0 96 100)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Work'
      }, {
        BackgroundColor: 'rgb(0,100,0)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Mobile'
      }, {
        BackgroundColor: 'rgb(255,128,0)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Main'
      }, {
        BackgroundColor: 'rgb(186 104 200)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Home'
      }, {
        BackgroundColor: 'rgb(1 87 155)',
        FontColor: 'rgb(255, 255, 255)',
        Value: 'Work Fax'
      }, {
        BackgroundColor: 'rgb(156 39 176)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Home Fax'
      }, {
        BackgroundColor: 'rgb(141 110 99)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Pager'
      }, {
        BackgroundColor: 'rgb(92 107 192)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Voicemail'
      }, {
        BackgroundColor: 'rgb(56 142 60)',
        FontColor: 'rgb(255,255,255)',
        Value: 'Other'
      }]
    },
    KitAllocationType: {
      Allocated: 'A',
      Return: 'R',
      Deallocate: 'D'
    },
    TransferSection: {
      WH: 'warehouse',
      Bin: 'bin',
      UID: 'UMID',
      Kit: 'kit',
      Dept: 'dept'
    },
    TransferLabel: {
      TransferFrom: 'transferFrom',
      TransferTo: 'transferTo'
    },
    MfgAddedAsCurrStatus: [
      { mfgAddedAsText: 'Manufacturer Only', className: 'label-primary' },
      { mfgAddedAsText: 'Both', className: 'label-warning' }
    ],
    MilitaryStandardType: 'Military Standard',
    modulesForExportSampleTemplate: {
      MANUFACTURE: 'Manufacturer',
      CUSTOMER: 'Customer',
      SUPPLIER: 'Supplier',
      UMIDMANAGEMENT: 'UMID Management'
    },
    CartImages: {
      permanent: '../../../../assets/images/etc/cart-fixed.png',
      movable: '../../../../assets/images/etc/cart-movable.png',
      kit: '../../../../assets/images/etc/cart-kit.png',
      hotJob: '../../../../assets/images/etc/hot-job.png',
      alert: '../../../../assets/images/etc/alert.png'
    },
    UserAccessMode: {
      S: 'Single',
      M: 'Multiple'
    },
    /* for binding in ui-grid header filter keyword list*/
    KeywordUserAccessModeGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'S', value: 'Single' },
      { id: 'M', value: 'Multiple' },
      { id: 'N/A (Not Applicable)', value: 'N/A (Not Applicable)' }
    ],
    BOMVersionHistoryPopUpTitle: {
      CPN: 'CPN (Part) Change Version History',
      ASSY_BOM: 'Assembly BOM Change Version History',
      RANDD_STATUS: 'R&D Activity'

    },
    General_Notes: {
      State: 'State/Province/Region'
    },
    /* For binding invoice verification status in ui-grid header filter part */
    InvoiceVerificationStatusOptionsGridHeaderDropdown: [
      { id: null, value: 'All', code: 'AL' },
      { id: 'Investigate', value: 'Investigate', code: 'I' },
      { id: 'Waiting for Invoice', value: 'Waiting For Invoice', code: 'W' },
      { id: 'Invoice Received', value: 'Invoice Received', code: 'IR' },
      { id: 'Approved To Pay', value: 'Approved To Pay', code: 'A' },
      { id: 'Fully Paid', value: 'Fully Paid', code: 'P' },
      { id: 'Pending', value: 'Pending', code: 'PE' },
      { id: 'Partially Paid', value: 'Partially Paid', code: 'PP' },
      { id: 'Pending Management Approval', value: 'Pending Management Approval', code: 'PM' }
    ],
    InvoiceApprovalStatusOptionsGridHeaderDropdown: [
      { id: null, value: 'All', code: 0 },
      { id: 'Approved', value: 'Approved', code: 1 },
      { id: 'Pending', value: 'Pending', code: 2 },
      { id: 'N/A', value: 'N/A', code: 3 }
    ],
    InvoiceVerificationReceiptTypeOptionsGridHeaderDropdown: [
      { id: null, value: 'All', code: 'AL' },
      { id: 'Invoice', value: 'Invoice', code: 'I' },
      { id: 'Credit Memo', value: 'Credit Memo', code: 'C' },
      { id: 'Debit Memo', value: 'Debit Memo', code: 'D' }
    ],
    Wo_Op_Cleaning_Type: {
      Water_Soluble: 'WS',
      No_Clean: 'NC',
      Not_Applicable: 'NA'
    },
    packaging_Charges_List: [
      { id: -1, value: 'Freight' },
      { id: -2, value: 'Tax' },
      { id: -3, value: 'Other' }
    ],
    InvoiceApproveStatusOptionsGridHeaderDropdown: [
      { id: null, value: 'All', dbValue: null },
      { id: 'Pending', value: 'Pending', dbValue: 'P' },
      { id: 'Approved', value: 'Approved', dbValue: 'A' },
      { id: 'Disapproved', value: 'Disapproved', dbValue: 'D' }
    ],
    InvoiceApproveMemoOptionsGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Credit Memo', value: 'Credit Memo' },
      { id: 'Debit Memo', value: 'Debit Memo' }
    ],
    salesOrderFilelds: [
      { fieldName: 'SHIPPINGMETHODID', displayValueName: 'Shipping Method' },
      { fieldName: 'SALESORDERNUMBER', displayValueName: 'SO#' },
      { fieldName: 'CUSTOMERID', displayValueName: 'Customer ID' },
      { fieldName: 'TERMSID', displayValueName: 'Terms' },
      { fieldName: 'PODATE', displayValueName: 'PO Date' },
      { fieldName: 'SODATE', displayValueName: 'SO Date' },
      { fieldName: 'MATERIALTENTITVEDOCDATE', displayValueName: 'Customer Consigned Material Promised Dock Date' },
      { fieldName: 'SHIPPINGCOMMENT', displayValueName: 'Header Shipping Comments' },
      { fieldName: 'INTERNALCOMMENT', displayValueName: 'Header Internal Notes' },
      { fieldName: 'REVISIONCHANGENOTE', displayValueName: 'Version Change Note' },
      { fieldName: 'BLANKETPO', displayValueName: 'Blanket PO' },
      { fieldName: 'POREVISION', displayValueName: 'PO Revision' },
      { fieldName: 'PARTID', displayValueName: 'Assy ID' },
      { fieldName: 'ISDELETED', displayValueName: 'SO Detail Deleted' },
      { fieldName: 'MATERIALDUEDATE', displayValueName: 'Purchased Material Dock Date' },
      { fieldName: 'MRPQTY', displayValueName: 'MRP Qty' },
      { fieldName: 'PRICE', displayValueName: 'Price ($)' },
      { fieldName: 'QTY', displayValueName: 'PO Qty' },
      { fieldName: 'REMARK', displayValueName: 'Line Shipping Comments' },
      { fieldName: 'LINECOMMENT', displayValueName: 'Line Internal Notes' },
      { fieldName: 'prcNUMBEROFWEEK', displayValueName: 'Weeks' },
      { fieldName: 'ISHOTJOB', displayValueName: 'Rush Job' },
      { fieldName: 'CONTACTPERSONID', displayValueName: 'Contact Person' },
      { fieldName: 'PONUMBER', displayValueName: 'PO#' },
      { fieldName: 'STATUS', displayValueName: 'Status' },
      { fieldName: 'ISDELETED', displayValueName: 'Canceled Status' },
      { fieldName: 'SHIPPINGQTY', displayValueName: 'Total Releases' },
      { fieldName: 'REVISION', displayValueName: 'Version' },
      { fieldName: 'SHIPPINGADDRESSID', displayValueName: 'Shipping Address' },
      { fieldName: 'BILLINGADDRESSID', displayValueName: 'Billing Address' },
      { fieldName: 'KITQTY', displayValueName: 'Kit Qty' },
      { fieldName: 'CustPOLine', displayValueName: 'Cust PO Line#' },
      { fieldName: 'ISKIPKITCREATION', displayValueName: 'Do not Create Kit' },
      { fieldName: 'PARTDESCRIPTION', displayValueName: 'Part Description' },
      { fieldName: 'QUOTENUMBER', displayValueName: 'Quote#' },
      { fieldName: 'Frequency', displayValueName: 'Charge Frequency' },
      { fieldName: 'QUOTEFROM', displayValueName: 'Quote From' },
      { fieldName: 'SODETAILSTATUS', displayValueName: 'SO Detail Status' },
      { fieldName: 'FREQUENCY', displayValueName: 'Frequency' },
      { fieldName: 'RELEASEQTY', displayValueName: 'Qty' },
      { fieldName: 'REQUESTEDSHIPDATE', displayValueName: 'Requested Ship Date (Orig.)' },
      { fieldName: 'PROMISEDSHIPDATE', displayValueName: 'Promised Ship Date (Orig.)' },
      { fieldName: 'REQUESTEDDOCKDATE', displayValueName: 'Requested Dock Date (Orig.)' },
      { fieldName: 'REQUESTEDREVISEDDOCKDATE', displayValueName: 'Requested Dock Date (Revised)' },
      { fieldName: 'REQUESTEDREVISEDSHIPDATE', displayValueName: 'Requested Ship Date (Revised)' },
      { fieldName: 'REVISEDPROMISEDDATE', displayValueName: 'Promised Ship Date (Revised)' },
      { fieldName: 'AGREETOSHIP', displayValueName: 'Agreed To Ship' },
      { fieldName: 'CARRIERID', displayValueName: 'Carrier' },
      { fieldName: 'CARRIERACCOUNTNUMBER', displayValueName: 'Carrier Account#' },
      { fieldName: 'RMAPO', displayValueName: 'RMA PO' },
      { fieldName: 'LEGACYPO', displayValueName: 'Legacy PO' },
      { fieldName: 'ORGPODATE', displayValueName: 'Orig. PO Date' },
      { fieldName: 'ORGPOQTY', displayValueName: 'Orig. PO Qty' },
      { fieldName: 'RMANUMBER', displayValueName: 'RMA#' },
      { fieldName: 'DEBITBYCUST', displayValueName: 'Debited By Cust' },
      { fieldName: 'ORGPONUMBER', displayValueName: 'Orig. PO#' },
      { fieldName: 'REWORKREQ', displayValueName: 'Rework Required' },
      { fieldName: 'REWORKPONUMBER', displayValueName: 'Rework PO#' },
      { fieldName: 'CUSTORGPOLINENUMBER', displayValueName: 'Orig PO Line#' },
      { fieldName: 'BLANKETPOOPTION', displayValueName: 'Blanket PO Option' },
      { fieldName: 'LINKTOBLANKETPO', displayValueName: 'Link To Blanket PO' }
    ],
    customerPackingFilelds: [
      { fieldName: 'POQTY', displayValueName: 'Request Qty/PO Qty' },
      { fieldName: 'CUSTOMERPOLINEID', displayValueName: 'Cust PO Line#' },
      { fieldName: 'SHIPMENTQTY', displayValueName: 'Shipment Qty' },
      { fieldName: 'REMAININGQTY', displayValueName: 'Remaining Qty' },
      { fieldName: 'SHIPPEDTOQTY', displayValueName: 'Shipped To Date' },
      { fieldName: 'SHIPPINGNOTES', displayValueName: 'Shipping Notes' },
      { fieldName: 'SALESORDERNUMBER', displayValueName: 'SO#' },
      { fieldName: 'PONUMBER', displayValueName: 'PO#' },
      { fieldName: 'PODATE', displayValueName: 'PO Date' },
      { fieldName: 'SODATE', displayValueName: 'SO Date' },
      { fieldName: 'CONTACTPERSONID', displayValueName: 'Contact Person' },
      { fieldName: 'PACKINGSLIPCOMMENT', displayValueName: 'Packing Slip Comment' },
      { fieldName: 'STATUS', displayValueName: 'Status' },
      { fieldName: 'SHIPPINGMETHODID', displayValueName: 'Shipping Method' },
      { fieldName: 'REVISION', displayValueName: 'SO Revision' },
      { fieldName: 'SHIPTO', displayValueName: 'Ship To' },
      { fieldName: 'INTERMEDIATE', displayValueName: 'Intermediate Ship To' }
    ],
    DefaultStandardTagColor: 'rgb(25,25,112)',
    DataElement_Default_Values: {
      Currency: {
        Min: 0,
        Max: 999999999
      },
      Decimal_Number: {
        Min: 1,
        Max: 6
      },
      dateTimeValueSelection: {
        nullValue: { id: 0, title: 'None', value: null },
        customValue: { id: 1, title: 'Custom', value: null },
        currentValue: { id: 2, title: 'Current', value: null }
      },
      fieldWidthValidation: {
        Min: 20,
        Max: 4000
      }
    },
    redirectLink: {
      rfq_consolidated_mfgpn_lineitem_alternate: 'Bill Of Material',
      rfq_lineitems_alternatepart: 'Bill Of Material',
      component: 'Parts',
      who_bought_who: 'Mergers & Acquisitions',
      br_label_template: 'Barcode Template',
      billing_addresses: 'Billing Addresses',
      shipping_addresses: 'Shipping Addresses',
      customer_contactperson: 'Customer Contact Person',
      equipment: 'Equipments, Workstations & Samples',
      rfqforms: 'RFQ',
      workorder: 'Work Order',
      salesordermst: 'Sales Order',
      shippedassembly: 'Shipped Assembly',
      employees: 'Personnel',
      certificate_standards: 'Standards',
      customer_addresses: 'Customer',
      component_fields_genericalias_mst: 'Country Alias',
      rfq_assemblies: 'RFQ List',
      eco_type_values: 'ECO Category Attributes',
      eco_request_type_values: 'ECO Request',
      rfq_type_values: 'Quote Terms & Conditions Attributes',
      genericcategory_Groups: 'Equipment & Workstation Groups',
      rfq_lineitems: 'Bill Of Material',
      salesorderdet: 'Sales Order Details',
      workorder_certification: 'Work Order',
      component_standard_details: 'Standards',
      rfq_assy_standard_class_detail: 'RFQ List',
      department: 'Department',
      eco_request: 'ECO Request',
      dfm_request: 'DFM Request',
      Material_Receive_Detail: 'Material Receipts',
      shipping_requestdet: 'Shipping Request Detail',
      operations: 'Operations',
      uoms: 'Unit Of Measurement',
      br_label_template_delimiter: 'Barcode Template Delimiter',
      component_functionaltestingequipment: 'Equipments, Workstations & Samples',
      workorder_operation_cluster: 'Work Order Cluster',
      workorder_operation_dataelement: 'Work Order data element',
      workorder_operation_employee: 'Work Order Employee',
      workorder_operation_equipment: 'Work Order Equipment',
      workorder_operation: 'Work Order Operation',
      workorder_operation_part: 'Work Order part',
      equipment_workstation_groups: 'Equipment, Workstation & Sample Groups',
      rfq_assy_quantity_price_selection_setting: 'Price Selection Settings',
      dataelement: 'Manage Element',
      standard_class: 'Standards Categories',
      component_sid_stock: 'UMID Management',
      kit_allocation: 'Kit Allocation',
      workorder_assembly_excessstock_location: 'Assembly Stock List',
      operation_part: 'Operations',
      assemblystock: 'Initial Stock',
      cost_category: 'Cost Category',
      department_location: 'Department Geolocation',
      warehousemst: 'Warehouse',
      binmst: 'Bin',
      workorder_trans_umid_details: 'Workorder Transaction UMID Details',
      supplier_invoice: 'Supplier Invoice',
      taskList: 'Task List',
      workorder_transfer: 'Revised Work order',
      purchase_inspection_requirement: 'Part Comments (Internal Notes)',
      RoHS_Stauts: 'RoHS Status',
      purchase_inspection_requirement_template: 'Requirements & Comments Template',
      supplierQuotePartAttribute: 'Supplier Quote Part Attribute',
      supplierQuotePartPrice: 'Supplier Quote Part Price',
      custom_form: 'Custom Forms',
      supplierQuotePartAttributePrice: 'Supplier Quote Part Attribute Price',
      SupplierQuote: 'Supplier Quote',
      SupplierQuotePartsDetail: 'Supplier Quote Parts Detail',
      SupplierAttributeTemplate: 'Supplier Attribute Template',
      customerPackagingSlip: 'Customer Packing Slip',
      mfgCodeMst: 'Customers',
      mfgcodemstSupplier: 'Supplier',
      component_approved_supplier_mst: 'Part Disapproved Supplier',
      supplier_mapping_mst: 'Manufacturer Mapped With Supplier',
      component_approved_supplier_priority_detail: 'Part Approved Supplier Priority',
      packingslip_invoice_payment: 'Supplier Invoice Payment',
      Invalid_MFR_Mapping: 'Manufacturer Mapping',
      supplier_rma: 'Supplier RMA',
      carriers: 'Carrier',
      shipping_method: 'Shipping Methods',
      purchase_order: 'Purchase Order',
      customer_invoice: 'Customer Invoices',
      umid_verification_details: 'UMID Verification Details',
      chart_of_accounts: 'Chart of Accounts',
      account_type: 'Account Type',
      payable_payment_methods: 'Payable Payment Methods',
      receivable_payment_methods: 'Receivable Payment Methods',
      bank_mst: 'Bank Account',
      inspection_mst: 'Requirements & Comments',
      customer_packingslip_creditmemo: 'Customer Credit Memo',
      supplier_credit_memo: 'Supplier Credit Memo',
      supplier_debit_memo: 'Supplier Debit Memo',
      supplier_payment: 'Supplier Payment',
      supplier_refund: 'Supplier Refund',
      transaction_mode_payable: 'Payable Transaction Mode',
      transaction_mode_receivable: 'Receivable Transaction Mode',
      contactperson: 'Contact Person',
      packingslip_invoice_payment_cust_refund: 'Customer Refund',
      mfgcodemstManufacturer: 'Manufacturer',
      systemconfigrations: 'Data Keys'
    },
    PageName: {
      country: 'Country',
      customer: 'Customer',
      supplier: 'Supplier',
      job_type: 'Job Types',
      rfq_type: ' Rfq Types',
      reason: 'Reason',
      funtional_type: ' funtional Type',
      assy_type: 'Assembly Types',
      rohs_status: 'Rohs status',
      quote_attribute: ' Quote Attributes',
      keywords: 'Keywords',
      eco_type_category: 'ECO Categories',
      eco_type_values: 'ECO Category Attributes',
      quote_terms_and_conditions_categories: 'Quote Terms & Conditions Categories',
      quote_terms_and_conditions_attributes: 'Quote Terms & Conditions Attributes',
      department: 'Department',
      unit_measure: 'Unit of Measure',
      measurement_type: 'Measurement Type',
      barcode_templates: ' Barcode Templates',
      cost_categories: ' Cost Categories',
      mounting_type: 'Mounting Types',
      package_case_type: 'Package/Case(Shape) Type',
      functional_type: 'Functional Type',
      mounting_group: 'Mounting Group',
      connector_type: 'Connector Types',
      assembly_types: 'Assembly Types',
      operation_management: 'Operation Management',
      rfq_list: 'RFQ List',
      bin: 'BIN',
      sales_order: 'Sales Order',
      warehouse: 'WAREHOUSE',
      Standards_Categories: 'Standards Categories',
      create_forms: ' Create Forms',
      workorder: 'Work Order',
      workorder_transaction_umid_details: 'Scan UMID',
      manufacturer: 'Manufacturer',
      employees: 'Personnel',
      material_receipt: ' Material Receipt',
      request_for_shipment: 'Request For Shipment',
      equipmentsandworkstations: 'Equipments & Workstations',
      certificate_standards: 'Standards',
      role: 'Role',
      operations: 'Operations',
      requirement: 'RFQ Requirement Template',
      rfq_reason: ' RFQ Reason',
      packaging_type: 'Packaging Type',
      shippedassembly: 'Shipping Records',
      workorder_trans_narrative_history: 'Work Order Narrative History',
      dataelement: 'Manage Element',
      component: 'Parts',
      workorder_assembly_excessstock_location: 'Assembly Stock List',
      operation_part: 'Operations',
      assemblystock: 'Initial Stock',
      alias_parts_validation: 'Part Alias Validations',
      department_location: 'Department Geolocation',
      part_status: 'Part Status',
      part_dynamic_attribute: 'Part Operational attribute',
      component_sid_stock: 'UMID Management',
      UMIDManagement: 'UMID',
      workorder_trans_umid_details: 'Workorder Transaction UMID Details',
      rohs: 'RoHS',
      equipments: 'Equipments',
      workstations: 'Workstations',
      labeltemplates: 'Manage Label Templates',
      printer: 'Manage Printer',
      paymentTerm: 'Manage Payment Term',
      shippingMethods: 'Manage Shipping Methods',
      Rack: 'Rack',
      Camera: 'Camera List',
      FullName: {
        wo_op_suppliesMaterialsAndTools: 'Work Order Operation Supplies, Materials & Tools',
        wo_suppliesMaterialsAndTools: 'Work Order Supplies, Materials & Tools',
        op_suppliesMaterialsAndTools: 'Operation Supplies, Materials & Tools'
      },
      part_master: 'Manage Parts Detail',
      supplier_invoice: 'Supplier Invoice',
      credit_memo: 'Credit Memo',
      debit_memo: 'Debit Memo',
      scanner: 'Scanner',
      changeRole: 'Change Role',
      switchRoleApproval: 'Switch Role Approval',
      purchase_inspection_requirement: 'Purchase Inspection Requirement',
      OperatingTemperatureConversion: 'Operating Temperature Conversion',
      purchaseInspectionRequirement: 'Requirements & Comments',
      purchaseInspectionRequirementTemplate: 'Purchase/Incoming Inspection Requirement Template',
      supplierQuote: 'Supplier Quote',
      supplierQuotePartDetails: 'Supplier Quote Part Details',
      CalibrationDetails: 'Calibration Details',
      customerPackingSlip: 'Customer Packing Slip',
      fob: 'FOB',
      customerInvoice: 'Customer Invoice',
      AssemblyStock: 'Assembly Stock',
      Bank: 'Bank',
      SupplierInvoicePayment: 'Supplier Invoice Payment',
      SupplierInvoicePaymentHistory: 'Supplier Invoice Payment History',
      SupplierInvoiceRefund: 'Supplier Invoice Refund',
      StockAdjustmentQtyWithWO: 'Work order stock adjustment qty',
      StockAdjustment: 'Stock Adjustment',
      SupplierRMA: 'Supplier RMA',
      Carrier: 'Carrier',
      PurchaseOrder: 'Purchase Order',
      CustomerPayment: 'Customer Payment',
      ReportCategory: 'Report Category',
      PartRequirementCategory: 'Part Requirement Category',
      RFQLineItemErrorCode: 'BOM Error Code List',
      PaymentTypeCategory: 'Payment Type Category',
      ChartOfAccounts: 'Chart of Accounts',
      CustomerRefund: 'Customer Refund',
      ContactPerson: 'Contact Person',
      CompanyInfo: 'Company Profile',
      DCFormat: 'Date Code Format'
    },
    SUPPLIER_QUOTE_STATUS: {
      PUBLISHED: 'P',
      PUBLISHED_LABEL: 'Published',
      DRAFT: 'D',
      DRAFT_LABEL: 'Draft'
    },
    CustomFormsStatus: [{
      ID: 0,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary'
    }],
    PackingSlipStatus: {
      WaitingForInvoice: 'W',
      Investigate: 'I',
      Approved: 'A',
      PartiallyPaid: 'PP',
      Paid: 'P',
      InvoiceReceived: 'IR',
      Pending: 'PE',
      PendingManagementApproval: 'PM'
    },
    MaterialInvoiceStatus: {
      Pending: 'P',
      Approved: 'A',
      Disapproved: 'D'
    },
    MaterialInvoiceStatusValue: {
      Pending: 'Pending',
      Approved: 'Approved',
      Disapproved: 'Disapproved'
    },
    BarcodeTemplateStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Draft', value: 'Draft' },
      { id: 'Published', value: 'Published' }
    ],
    BarcodeTemplateTypeGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: '1D', value: '1D' },
      { id: '2D(QR, Datamatrix, etc.)', value: '2D(QR, Datamatrix, etc.)' }
    ],
    UserAccessModeGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Single', value: 'Single' },
      { id: 'Multiple', value: 'Multiple' },
      { id: 'N/A (Not Applicable)', value: 'N/A (Not Applicable)' }
    ],
    ScanDocumentSize: [
      { type: 'AutoSize', name: 'Auto' },                                                 //!< Detect the paper size automatically.
      { type: 'A4', name: 'A4' },                                                         //!< A4: 210x297 mm
      { type: 'Letter', name: 'Letter' },                                                 //!< Letter: 215.9x279.4 mm (8.5x11 in.)
      { type: 'Legal', name: 'Legal' },                                                   //!< Legal:  215.9x355.6 mm (8.5x14 in.)
      { type: 'A5', name: 'A5' },                                                         //!< A5: 148x210 mm
      { type: 'A6', name: 'A6' },                                                         //!< A6: 105x148 mm
      { type: 'Executive', name: 'Executive' },                                           //!< Exective: 184.1x266.7 mm (7.25x10.5 in.)
      { type: 'BusinessCard90X60', name: 'Business Card (Horizontal) (90 x 60 mm)' },     //!< Business Card (Horizontal): 90x60 mm
      { type: 'BusinessCard60X90', name: 'Business Card (Vertical) (60 x 90 mm)' },       //!< Business Card (Vertical) : 60x90 mm
      { type: 'Photo', name: 'Photo (4 x 6 in)' },                                        //!< Photo: 101.6x152.4 mm (4x6 in.)
      { type: 'IndexCard', name: 'IndexCard (5 x 8 in)' },                                //!< Index Card: 127x203.2 mm (5x8 in.)
      { type: 'PhotoL', name: 'Photo (3.5 x 5 in)' },                                     //!< Photo L: 89x127 mm
      { type: 'Photo2L', name: 'Photo (5 x 7 in)' },                                      //!< Photo 2L: 127x178 mm
      { type: 'Postcard', name: 'Postcard (3.9 x 5.8 in)' },                              //!< Post Card 1: 100x148 mm
      { type: 'Postcard2', name: 'Postcard (5.8 x 7.9 in)' },                             //!< Post Card 2: 148x200 mm
      { type: 'Folio', name: 'Folio' },                                                   //!< Folio: 215.9x330.2 mm (8.5x13 in.)
      { type: 'MexicanLegal', name: 'Mexican Legal' },                                    //!< Mexican Legal: 215.9x339.85 mm (8.5x13.38 in.)
      { type: 'IndiaLegal', name: 'India Legal' },                                        //!< India Legal: 215x345mm (8.46x13.58 in.)
      { type: 'LongPaper_NarrowWidth', name: 'Long Paper (Narrow Width)' },               //!< LongPaper (Narrow width). Width: 107.9 mm (4.25in.), Height: Documentt length.
      { type: 'LongPaper_NomalWidth', name: 'Long Paper(Normal Width)' }                  //!< LongPaper (Normal width). Width: 215.9 mm (8.5in.), Height: Documentt length.
    ],
    ScanDocumentColor: [
      { type: 'AutoColor', name: 'Auto' },                     //!< Distinguishes the type of image automatically.
      { type: 'BlackWhite', name: 'Black & White' },               //!< 1bit Monochrome.
      { type: 'ErrorDiffusion', name: 'Gray (Error Diffusion)' },  //!< 1bit Monochrome (Error diffusion).
      { type: 'TrueGray', name: 'True Gray' },                     //!< 8bit gray.
      { type: 'Color24bit', name: '24bit Color' }                  //!< 24bit color.
    ],
    ScanDocumentResolution: [
      //{ type: "reso100dpi", name: "100 x 100 dpi" },
      //{ type: "reso150dpi", name: "150 x 150 dpi" },
      //{ type: "reso200dpi", name: "200 x 200 dpi" },
      //{ type: "reso300dpi", name: "300 x 300 dpi" },
      //{ type: "reso400dpi", name: "400 x 400 dpi" },
      { type: 'reso600dpi', name: '600 x 600 dpi' },
      { type: 'reso1200dpi', name: '1200 x 1200 dpi' }
      //{ type: 'reso2400dpi', name: '2400 x 2400 dpi' },
      //{ type: 'reso4800dpi', name: '4800 x 4800 dpi' },
      //{ type: 'reso9600dpi', name: '9600 x 9600 dpi' },
      //{ type: 'reso19200dpi', name: '19200 x 19200 dpi' }
    ],
    ScanDocumentSide: {
      S: { type: 'S', name: 'Simplex', displayName: 'Simplex Scan (Single-sided)', importName: 'Simplex Scan' },
      D: { type: 'D', name: 'DuplexLongBinding', displayName: 'Duplex Scan (Double-sided)', importName: 'Duplex Scan' }
    },
    WarehouseCartManufacturer: [
      { id: 'InoAuto', name: 'InoAuto' },
      { id: 'Cluso', name: 'Cluso' }
    ],
    InoautoCart: 'InoAuto',
    DateTimeDisplayFormat: '{0} {1}',
    LoadItemsPerPage: {
      Drag_Drop: 20
    },
    RoHSStatus: {
      RoHS: 'RoHS',
      RoHSExempt: 'RoHS-Exempt',
      NonRoHS: 'Non-RoHS'
    },
    TransactionType: {
      Feeder: 'F',
      UMID: 'U'
    },
    RoHSMainCategory: {
      RoHS: -1,
      NonRoHS: -2,
      NotApplicable: -3
    },
    UI_GRID_COLUMN_WIDTH: {
      UPDATED_DATE: 160,
      CREATED_DATE: 160,
      MFG_PN: 320,
      PID: 420,
      CREATEDBY: 200,
      MODIFIEDBY: 200,
      ASSY_NICKNAME: 200,
      ONLY_DATE_COLUMN: 150,
      INDEX_COLUMN: 60
    },
    NameDisplayFormat: '{0} {1}',
    WRENCH_ICON: 'wrench.jpg',
    WRENCH_TOOLTIP: 'Require Drive Tools',
    WRENCH_LINE_TOOLTIP: 'Drive Tools Added on line#{0}.',
    PROGRAMING_REQUIRED_TOOLTIP: 'Require Programming',
    PROGRAMMING_MAPPING_FULL_TOOLTIP: 'Fully Mapped Part with Program',//Part to Program Fully Mapping Done
    PROGRAMMING_MAPPING_PARTIAL_TOOLTIP: 'Partially Mapped Part with Program',//Part to Program Partial Mapping Done
    PROGRAMMING_MAPPING_PENDING_TOOLTIP: 'Pending to Mapping Part with Program',//Part to Program Mapping Pending
    PROGRAMING_REQUIRED_LINE_TOOLTIP: 'Programming Part Added on line#{0}.',
    MATING_TOOLTIP: 'Require Mating Part',
    MATING_LINE_TOOLTIP: 'Mating Part Added on Same Line.',
    PICKUPPAD_TOOLTIP: 'Require Pickup Pad',
    PICKUPPAD_LINE_TOOLTIP: 'Pickup Pad Added on Same Line.',
    MPN_MAPPING_PENDING_IN_CPN_TOOLTIP: 'Map this MPN to CPN',
    TMAX_ICON: 'tmax.png',
    TMAX_YELLOW_ICON: 'tmax_yellow.png',
    CUST_PART_ICON: 'cust_part.png',
    OBSOLETE_NRND_ICON: 'nrnd.png',
    EXPORT_CONTROLLED_ICON: 'export.png',
    IN_ACTIVE_IMAGE: 'in-active.png',
    TEMP_SENC_ICON: 'component-temperature.png',
    WARNING_COMMENT_ICON: 'warning-comment.png',
    MISMATCH_MOUNTING_TYPE_ICON: 'mismatched_monting_type.png',
    MISMATCH_FUNCTIONAL_TYPE_ICON: 'mismatched_functional_type.png',
    APPROVE_MOUNTING_TYPE_ICON: 'approvemountingtype.png',
    MPN_MAPPING_PENDING_IN_CPN_ICON: 'map-2-cpn.png',
    PICKUP_PAD_REQUIRE_ICON: 'pickup-pad-require.png',
    PROGRAMMING_REQUIRED_ICON: 'programming-required.png',
    PROGRAMMING_MAPPING_FULL_ICON: 'part-to-programming-full.png',
    PROGRAMMING_MAPPING_PARTIAL_ICON: 'part-to-programming-partial.png',
    PROGRAMMING_MAPPING_PENDING_ICON: 'part-to-programming-pending.png',
    BAD_PART_ICON: 'badmfrpart.png',
    BAD_SUPPLIER_PART_ICON: 'badsuppart.png',
    TMAX_TOOLTIP: 'Tmax {0}C ({1} Second)',//'Max Soldering Temperature(C) is {0}',
    ADD_ALIAS_PART: 'Add Packaging Alias {0}',
    INVALID_EMAIL: 'Invalid: {0}',
    Kit_Release_Type: {
      //full: 'Full',
      //partial: 'Partial',
      MountingType: 'Mounting Type'
    },
    Kit_Release_Status: {
      Pending: 'Pending',
      Completed: 'Completed',
      NotReleased: 'Not Released',
      PartiallyReleased: 'Partially Released',
      FullReleased: 'Fully Released',
      ReadyToRelease: 'Ready To Release',
      Returned: 'Returned',
      Released: 'Released',
      InProgress: 'In Progress'
    },
    Kit_Plan_Status: {
      Unplanned: 'Unplanned',
      PartiallyPlanned: 'Partially Planned',
      FullPlanned: 'Fully Planned'
    },
    Cust_PO_Status_Report_Legend: {
      UnProcessedQty: {
        BackgroundColor: 'mediumvioletred',
        Key: 'UnProcessed Qty',
        isDisplayAtWoOpLevel: false,
        isDisplayAtAssyLevel: true,
        orderBy: 1
      },
      WIPQty: {
        BackgroundColor: 'orange',
        Key: 'WIP Qty',
        isDisplayAtWoOpLevel: true,
        isDisplayAtAssyLevel: true,
        orderBy: 2
      },
      ScrapQty: {
        BackgroundColor: 'red',
        Key: 'Scrapped Qty',
        isDisplayAtWoOpLevel: true,
        isDisplayAtAssyLevel: true,
        orderBy: 3
      },
      TransferredQty: {
        BackgroundColor: 'lightseagreen',
        Key: 'Transferred Qty',
        isDisplayAtWoOpLevel: true,
        isDisplayAtAssyLevel: false,
        orderBy: 4
      },
      ShippedQty: {
        BackgroundColor: 'green',
        Key: 'Shipped Qty',
        isDisplayAtWoOpLevel: true,
        isDisplayAtAssyLevel: true,
        orderBy: 5
      }
    },
    ParentWarehouse: {
      MaterialDepartment: {
        id: -1, name: 'Main Material Warehouse'
      },
      ProductionDepartment: {
        id: -2, name: 'Main Production Warehouse'
      }
    },
    ReadyForShipmentWarehoue: {
      id: -5, name: 'ReadyForShipment Warehouse'
    },
    ParentWarehouseType: {
      MaterialDepartment: 'M',
      ProductionDepartment: 'P'
    },
    SystemGenratedWarehouseBin: {
      warehouse: {
        EmptyWarehouse: { id: -3, name: 'Empty Warehouse' },
        OpeningWarehouse: { id: -4, name: 'Opening Warehouse' }
      },
      bin: {
        EmptyBin: { id: -1, name: 'Empty Bin' },
        OpeningBin: { id: -2, name: 'Opening Bin' }
      }
    },
    HOME_MENU_MESSAGES: {
      //EMPTY_MENU: 'No Home Menu added yet!',
      //EMPTY_ADD_HOME_MENU: 'Click below to add a Home menu',
      SIDEBAR_HEADER: '(Drag and Drop menu item to the right)',
      DRAG_DROP_MESSAGE: 'Drag and Drop here to add menu items.',
      EMPTY_FILTER_MESSAGE: 'No results match your search criteria.',
      SEARCH_IMAGE: 'assets/images/emptystate/grid-empty.png'
    },
    DEFAULT_IMAGE: 'noimage.png',

    Socket_IO_Events: {
      InoAuto: {
        updateCartStatus: 'updateCartStatus:receive',
        updateCheckinRequestStatus: 'updateCheckinRequestStatus:receive',
        updateCancelRequest: 'updateCancelRequest:receive',
        updateCheckOutRequest: 'updateCheckOutRequest:receive',
        updateUMIDRequest: 'updateUMIDRequest:receive',
        updateSearchCartIDRequest: 'updateSearchCartIDRequest:receive',
        updateAssignDepartmentRequest: 'updateAssignDepartmentRequest:receive',
        updateForceDeliverRequest: 'updateForceDeliverRequest:receive',
        updateUnAuthorizeClearResponse: 'updateUnAuthorizeClearResponse:receive',
        updateUsertoMapandPick: 'updateUsertoMapandPick:receive'

      },
      BOMChange: {
        updateBOMInternalVersion: 'sendBOMInternalVersionChanged:receive'
      },
      SalesOrderChange: {
        sendSalesOrderKitMRPQtyChanged: 'sendSalesOrderKitMRPQtyChanged:receive',
        sendSalesOrderCanceled: 'sendSalesOrderCanceled:receive',
        updateSOVersionConfirmFlag: 'updateSOVersionConfirmFlag:receive'
      },
      HoldResumeTrans: {
        PO_START: 'resumePO:receive',
        PO_STOP: 'haltPO:receive',
        KIT_ALLOCATION_START: 'resumeKitAllocation:receive',
        KIT_ALLOCATION_STOP: 'haltKitAllocation:receive',
        KIT_RELEASE_START: 'resumeKitRelease:receive',
        KIT_RELEASE_STOP: 'haltKitRelease:receive',
        SupplierInvoice_START: 'resumeSupplierInvoice:receive',
        SupplierInvoice_STOP: 'haltSupplierInvoice:receive'
      },
      CommonNotification: {
        ANY_NOTIFICATION_READ: 'anyNotificationRead:receive'
      },
      Traveler: {
        Auto_Terminate_WO_On_Transfer: 'autoTerminateWOOnTransfer:receive'
      },
      SupplierQuote: {
        sendSupplierQuotePartAttributeRemoved: 'sendSupplierQuotePartAttributeRemoved:receive'
      },
      PackingSlipSupplierInvoiceChanges: {
        reGetOnChnagesOfPackingSlipLine: 'reGetOnChnagesOfPackingSlipLine:receive'
      },
      User: {
        User_Status: 'user:status',
        User_Logout: 'user:logout',
        Update_LoginUser: 'updateLoginuser:receive'
      }
    },
    InoAuto_Error_ReasonCode: {
      CancelTask: {
        Code: 201,
        Message: 'Manual Task Cancel'
      },
      TaskTimeOut: {
        Code: 'E501',
        Message: 'Task Timeout'
      }
    },
    InoAuto_Request_Code: {
      SearchByUMID: '103',
      CheckinRequest: '101'
    },
    InoAuto_Search_Status: {
      Chosen: 'Chosen',
      Available: 'Available',
      NotFound: 'Not Found',
      NotAvailable: 'Not Available',
      InTransit: 'In Transit'
    },
    AllFormulas: {
      TotalSolderOpportunitiesOfError: {
        Formula: 'Total Solder Points * Build Qty',
        Format: '{0} * {1}'
      }
    },
    CANCEL_REQUSET_TIMEOUT: 305,
    DEPARTMENT_ASSIGN: 'Check in department mismatch',
    CHECK_IN_REQUSET: 101,
    PartCorrectList: {
      CorrectPart: 1,
      IncorrectPart: 2,
      UnknownPart: 3
    },
    PartCorrectLabelList: {
      CorrectPart: 'Correct Part',
      IncorrectPart: 'Incorrect Part',
      UnknownPart: 'TBD Part'
    },
    PartStatusList: {
      InActiveInternal: -3,
      Discontinued: -2,
      TBD: -1,
      Active: 1,
      Obsolete: 2,
      LastTimeBuy: 3,
      NotForNewDesigns: 4
    },
    DKVersion: {
      DKV2: 'V2',
      DKV3: 'V3'
    },
    DKVersionList: [
      { id: 'V2', value: 'V2' },
      { id: 'V3', value: 'V3' }
    ],
    MFGCodeFormatList: [
      { id: '1', value: 'Display Code first' },
      { id: '2', value: 'Only Name' },
      { id: '3', value: 'Only Code' },
      { id: '4', value: 'Display Code Last' }
    ],
    MySql_Store_Date_Format: 'yyyy-MM-dd',
    MySql_Store_Time_Format: 'hh:mm:ss',
    MOMENT_DATE_FORMAT: 'MM/DD/YYYY',
    MOMENT_DATE_TIME_FORMAT: 'MM/DD/YYYY HH:mm:ss',
    MOMENT_DATE_TIME_FORMAT_UI: 'MM/DD/YY hh:mm A',
    MOMENT_TIME_FORMAT: 'hh:mm:ss A',
    MOMENT_TIME_FORMAT_UI: 'HH:mm',
    DefaultSupplier: {
      Digikey: 'DIGIKEY',
      Arrow: 'ARROW',
      Avnet: 'AVNET',
      Mouser: 'MOUSER',
      Newark: 'NEWARK',
      TTI: 'TTI'
    },
    CUSTOMER_IMPORT: {
      MAXLENGTH: '{0} Customer {1} having {2} char, Max allowed {3} char. ',
      EMAIL_INVALID: '{0} Email Invalid. ',
      WEBSITE_INVALID: '{0} Website Invalid. ',
      COMMNET_MAXLENGTH: '{0} Comment having {1} char, Max allowed {2} char. ',
      TERRITORY_MAXLENGTH: '{0} Territory having {1} char, Max allowed {2} char. ',
      EXT_MAXLENGTH: '{0} Ext. having {1} char, Max allowed {2} char. ',
      EXT_INVALID: '{0} Ext. Invalid. ',
      INVALID_PHONE_NUMBER: '{0} Please enter valid {1}. ',
      SALES_COMMISSION_TO: 'Sales Commission To is required. ',
      SALES_COMMISSION_TO_MAX_LENGTH: '{0} Sales Commission To having {1} char, Max allowed {2} char. ',
      COMMON_MAXLENGTH_MSG_WITH_FIELD: '{0} having {1} char, Max allowed {2} char. ',
      FIELD_INVALID_MSG: '{0} is Invalid. ',
      SPECIAL_CHAR_NOT_ALLOWED: '{0} Special Char not allowed. ',
      REQUIRED_FIELD_MSG: '{0} is required. ',

      CUSTOMER_MAX_LENGTH: {
        CUSTOMERCODE: 8,
        CUSTOMERNAME: 255,
        SALES_COMMISSION_TO: 50,
        ADDRESS_COMPANY_LENGTH: 255,
        ADDRESS_PERSON: 255,
        ADDRESS_DEPARTMENT: 100,
        ADDRESS_LINE: 255,
        ZIPCODE: 10,
        COUNTRY: 100,
        STATE: 255,
        CITY: 255,
        TAXID: 20,
        ACCOUNTREF: 20
      }
    },
    UMID_MAX_LENGTH: 15,
    TEXT_AREA_ROWS: {
      MAX_ROWS: 4,
      ROWS: 2
    },
    DefaultInvalidMFRID: -10,
    TBDMFRPNID: -1,
    NOTACOMPOONENTMFRPNID: -2,
    NOTAVAILABLEMFRPNID: -3,
    ANYMFRPNID: -4,
    CommonMFRImportFieldModel: {
      salesCommissionToName: 'Sales Commission To',
      email: 'Email',
      website: 'Website',
      phExtension: 'Ext.',
      faxNumber: 'Fax',
      contact: 'Phone No',
      CountryCode: 'Country Code',
      comments: 'Comments',
      territory: 'Territory',
      FOB: 'FOB',
      ShippingMethod: 'Shipping Method',
      ScanningSide: 'Scanning Side',
      TypeOfSupplier: 'Type Of Supplier',
      RequireOrderQtyInPackingSlip: 'Require Order Qty in Packing Slip',
      AuthorizeType: 'Authorize Type',
      TaxID: 'Tax ID',
      AccountRef: 'Account Ref',
      BillToCompany: 'Bill To Company',
      BillToPerson: 'Bill To Person',
      BillToDepartment: 'Bill To Department',
      BillToEmail: 'Bill To Email',
      BillToCountryCode: 'Bill To Country Code',
      BillToFax: 'Bill To Fax',
      BillToPhone: 'Bill To Phone',
      BillToExt: 'Bill To Ext',
      BillToAddressline1: 'Bill To Address Line 1',
      BillToaddressLine2: 'Bill To Address Line 2',
      BillToaddressLine3: 'Bill To Address Line 3',
      BillToState: 'Bill To State',
      BillToCountry: 'Bill To Country',
      BillToCity: 'Bill To City',
      BillToZipCode: 'Bill To ZipCode',
      ShippingAddressSameAsBillingAddress: 'Shipping Address Same As Billing Address',
      ShippingCompany: 'Shipping Company',
      ShippingPerson: 'Shipping Person',
      ShippingDepartment: 'Shipping Department',
      ShippingEmail: 'Shipping Email',
      ShippingCountryCode: 'Shipping Country Code',
      ShippingFax: 'Shipping Fax',
      ShippingPhone: 'Shipping Phone',
      ShippingExt: 'Shipping Ext',
      ShippingAddressline1: 'Shipping Address Line 1',
      ShippingAddressLine2: 'Shipping Address Line 2',
      ShippingAddressLine3: 'Shipping Address Line 3',
      ShippingState: 'Shipping State',
      ShippingCountry: 'Shipping Country',
      ShippingCity: 'Shipping City',
      ShippingZipCode: 'Shipping ZipCode',
      LegalName: 'Legal Name'
    },
    SUPPLIER_QUOTE_COLUMN_MAPPING: [
      { fieldName: 'Item', isRequired: true },
      { fieldName: 'Qty', isRequired: true },
      { fieldName: 'Unit Price ($)', isRequired: true },
      { fieldName: 'Lead Time', isRequired: true },
      { fieldName: 'Unit Of Time', isRequired: true },
      { fieldName: 'Packaging', isRequired: true },
      { fieldName: 'Min', isRequired: true },
      { fieldName: 'Mult', isRequired: true },
      { fieldName: 'Stock', isRequired: true },
      { fieldName: 'Custom Reel', isRequired: true },
      { fieldName: 'NCNR', isRequired: true }
    ],
    MFG_COLUMN_MAPPING: [
      { fieldName: 'MFR Code', isRequired: true },
      { fieldName: 'MFR Name', isRequired: true },
      { fieldName: 'Legal Name' },
      { fieldName: 'Comments' },
      { fieldName: 'Country Code' },
      { fieldName: 'Phone No' },
      { fieldName: 'Ext.' },
      { fieldName: 'Fax' },
      { fieldName: 'Email' },
      { fieldName: 'Website' },
      { fieldName: 'Bill To Company' },
      { fieldName: 'Bill To Person' },
      { fieldName: 'Bill To Department' },
      { fieldName: 'Bill To Email' },
      { fieldName: 'Bill To Country Code' },
      { fieldName: 'Bill To Fax' },
      { fieldName: 'Bill To Phone' },
      { fieldName: 'Bill To Ext' },
      { fieldName: 'Bill To Address Line 1' },
      { fieldName: 'Bill To Address Line 2' },
      { fieldName: 'Bill To Address Line 3' },
      { fieldName: 'Bill To State' },
      { fieldName: 'Bill To Country' },
      { fieldName: 'Bill To City' },
      { fieldName: 'Bill To ZipCode' },
      { fieldName: 'Shipping Address Same As Billing Address' },
      { fieldName: 'Shipping Company' },
      { fieldName: 'Shipping Person' },
      { fieldName: 'Shipping Department' },
      { fieldName: 'Shipping Email' },
      { fieldName: 'Shipping Country Code' },
      { fieldName: 'Shipping Fax' },
      { fieldName: 'Shipping Phone' },
      { fieldName: 'Shipping Ext' },
      { fieldName: 'Shipping Address Line 1' },
      { fieldName: 'Shipping Address Line 2' },
      { fieldName: 'Shipping Address Line 3' },
      { fieldName: 'Shipping State' },
      { fieldName: 'Shipping Country' },
      { fieldName: 'Shipping City' },
      { fieldName: 'Shipping ZipCode' }],
    SUPPLIER_COLUMN_MAPPING: [
      { fieldName: 'Supplier Code', isRequired: true },
      { fieldName: 'Supplier Name', isRequired: true },
      { fieldName: 'Comments' },
      { fieldName: 'Country Code' },
      { fieldName: 'Phone No' },
      { fieldName: 'Ext.' },
      { fieldName: 'Fax' },
      { fieldName: 'Email' },
      { fieldName: 'Website' },
      { fieldName: 'FOB' },
      { fieldName: 'Authorize Type', isRequired: true },
      { fieldName: 'Scanning Side' },
      { fieldName: 'Require Order Qty in Packing Slip' },
      { fieldName: 'Type Of Supplier' },
      { fieldName: 'Tax ID' },
      { fieldName: 'Account Ref' },
      { fieldName: 'Bill To Company' },
      { fieldName: 'Bill To Person' },
      { fieldName: 'Bill To Department' },
      { fieldName: 'Bill To Email' },
      { fieldName: 'Bill To Country Code' },
      { fieldName: 'Bill To Fax' },
      { fieldName: 'Bill To Phone' },
      { fieldName: 'Bill To Ext' },
      { fieldName: 'Bill To Address Line 1' },
      { fieldName: 'Bill To Address Line 2' },
      { fieldName: 'Bill To Address Line 3' },
      { fieldName: 'Bill To State' },
      { fieldName: 'Bill To Country' },
      { fieldName: 'Bill To City' },
      { fieldName: 'Bill To ZipCode' },
      { fieldName: 'Shipping Address Same As Billing Address' },
      { fieldName: 'Shipping Company' },
      { fieldName: 'Shipping Person' },
      { fieldName: 'Shipping Department' },
      { fieldName: 'Shipping Email' },
      { fieldName: 'Shipping Country Code' },
      { fieldName: 'Shipping Fax' },
      { fieldName: 'Shipping Phone' },
      { fieldName: 'Shipping Ext' },
      { fieldName: 'Shipping Address Line 1' },
      { fieldName: 'Shipping Address Line 2' },
      { fieldName: 'Shipping Address Line 3' },
      { fieldName: 'Shipping State' },
      { fieldName: 'Shipping Country' },
      { fieldName: 'Shipping City' },
      { fieldName: 'Shipping ZipCode' }],
    CUSTOMER_COLUMN_MAPPING: [
      { fieldName: 'Customer Code', isRequired: true },
      { fieldName: 'Customer Name', isRequired: true },
      { fieldName: 'Sales Commission To', isRequired: true },
      { fieldName: 'Legal Name' },
      { fieldName: 'Comments' },
      { fieldName: 'Country Code' },
      { fieldName: 'Phone No' },
      { fieldName: 'Territory' },
      { fieldName: 'Ext.' },
      { fieldName: 'Fax' },
      { fieldName: 'Email' },
      { fieldName: 'Website' },
      { fieldName: 'FOB' },
      { fieldName: 'Shipping Method' },
      { fieldName: 'Bill To Company' },
      { fieldName: 'Bill To Person' },
      { fieldName: 'Bill To Department' },
      { fieldName: 'Bill To Email' },
      { fieldName: 'Bill To Country Code' },
      { fieldName: 'Bill To Fax' },
      { fieldName: 'Bill To Phone' },
      { fieldName: 'Bill To Ext' },
      { fieldName: 'Bill To Address Line 1' },
      { fieldName: 'Bill To Address Line 2' },
      { fieldName: 'Bill To Address Line 3' },
      { fieldName: 'Bill To State' },
      { fieldName: 'Bill To Country' },
      { fieldName: 'Bill To City' },
      { fieldName: 'Bill To ZipCode' },
      { fieldName: 'Shipping Address Same As Billing Address' },
      { fieldName: 'Shipping Company' },
      { fieldName: 'Shipping Person' },
      { fieldName: 'Shipping Department' },
      { fieldName: 'Shipping Email' },
      { fieldName: 'Shipping Country Code' },
      { fieldName: 'Shipping Fax' },
      { fieldName: 'Shipping Phone' },
      { fieldName: 'Shipping Ext' },
      { fieldName: 'Shipping Address Line 1' },
      { fieldName: 'Shipping Address Line 2' },
      { fieldName: 'Shipping Address Line 3' },
      { fieldName: 'Shipping State' },
      { fieldName: 'Shipping Country' },
      { fieldName: 'Shipping City' },
      { fieldName: 'Shipping ZipCode' }],
    UMID_COLUMN_MAPPING: [
      { fieldName: 'UMID Prefix' },
      { fieldName: 'UMID' },
      { fieldName: 'MFR' },
      { fieldName: 'MFR PN' },
      { fieldName: 'Count' },
      { fieldName: 'To Location/BIN' },
      { fieldName: 'Packaging' },
      { fieldName: 'Cost Category' },
      { fieldName: 'Internal Date Code' },
      { fieldName: 'Lot Code' },
      { fieldName: 'PCB Per Array' },
      { fieldName: 'Seal Date (MM/DD/YY)' },
      { fieldName: 'Date of Manufacture (MM/DD/YY)' },
      { fieldName: 'Shelf Life' },
      { fieldName: 'Shelf Life Type' },
      { fieldName: 'Date of Expiration (MM/DD/YY)' },
      { fieldName: 'Special Note' }
    ],
    UMID_COLUMN_MAPPING_REQUIRE: [
      { fieldName: 'UMID Prefix' },
      { fieldName: 'UMID' },
      { fieldName: 'MFR' },
      { fieldName: 'MFR PN' },
      { fieldName: 'Count' },
      { fieldName: 'To Location/BIN' },
      { fieldName: 'Packaging' },
      { fieldName: 'Cost Category' },
      { fieldName: 'Internal Date Code' }],
    MULTIPART_SEARCH_COLUMN_MAPPING: [
      { fieldName: 'SystemID', isAllowSearch: false },
      { fieldName: 'PID Code', isAllowSearch: false },
      { fieldName: 'MFR PN', isAllowSearch: false }
    ],
    RestrictWithPermissionLabel: {
      RestrictUSEWithPermanently: 'Restricted Use Including Packaging Alias Permanently',
      RestrictPackagingUSEWithPermanently: 'Restricted Use Excluding Packaging Alias Permanently',
      RestrictUSEWithPermission: 'Restricted Use Including Packaging Alias With Permission',
      RestrictPackagingUSEWithPermission: 'Restricted Use Excluding Packaging Alias With Permission',
      RestrictUSEInBOMWithPermission: 'Restrict use in BOM With Permission',
      RestrictUseInBOMExcludingAliasWithPermission: 'Restrict use Excluding Packaging in BOM With Permission',
      RestrictUseForSupplier: 'Restricted use for {0} supplier'
    },
    DRAG_DROP_FILE: {
      EMPTY_MESSAGE: 'Drag & Drop here to upload or click on "Upload Document" button.',
      IMAGEURL: 'assets/images/emptystate/document.png'
    },
    ScanConnectionType: {
      Usb: 'Usb',
      Network: 'Network'
    },
    TransferStockType: {
      Remaining: 'Current Material',
      Consumed: 'Consumed Material',
      ZeroOut: 'Zero Out Material',
      Scrapped: 'Scrapped Material',
      Expired: 'Expired Material',
      Adjust: 'Adjust Material'
    },
    Debounce: {
      mdDataTable: 500,
      uiSideFilter: 500,
      menuSearch: 300
    },
    CustomerApprovalStatus: {
      Approve: 'A',
      Pending: 'P',
      NotApprove: 'N'
    },
    EQUIPMENT_SETUP_METHODS: {
      Default: { Key: 'None', Value: null },
      SMTPickAndPlaceSetupAndVerfication: { Key: 'Machine Feeders to Parts Setup', Value: 1 }
    },
    EQUIPMENT_METHODS: {
      SMTPickAndPlaceSetupAndVerfication: 1
    },
    INO_AUTO_RESPONSE: {
      SUCCESS: '200',
      CANCEL: '201',
      PromptUse: 'E103'
    },
    Manage_PageName_Title_Format: 'Manage {0}',
    GENERIC_DATA_FORMAT: {
      EmployeeManager: '({0}) {1} {2}'
    },
    Generic_Confirmation_Type: {
      MFR_REMOVE_REASON: 1,
      PERMISSION_WITH_PACKAGING_ALIAS: 2,
      WO_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD: 3,
      OP_SUPPLIES_MAT_TOOLS_RESTRICT_WITH_PERMISSION_ADD: 4,
      MACHINE_SETUP_SCAN: 5,
      UMID_SETUP_SCAN: 6,
      CHANGE_ROLE: 7,
      SUPPLIER_INVOICE_PAYMENT_VOID: 8,
      CUSTOMER_PAYMENT_VOID: 9,
      APPLIED_CUST_CREDIT_MEMO_VOID: 10,
      APPLIED_CUST_WRITE_OFF_VOID: 11,
      ENABLE_DISABLE_SUPPLIER_API_REQUEST: 12,
      SHELF_LIFE_DAYS: 13,
      CUSTOMER_REFUND_VOID: 14,
      VERIFY_CUST_REFUND_DUPLICATE_PAYMENT_NUM: 15,
      PERMISSION_FOR_CUSTCONSIGN_STATUS_KITALLOCATION: 16
    },
    EntityStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      { id: 'Published', value: 'Published' }
    ],
    GenericDraftPublishStatus: [{
      ID: 0,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    }, {
      ID: 1,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary'
    }],
    GenericDraftPublishStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Draft', value: 'Draft'
      },
      { id: 'Published', value: 'Published' }
    ],
    PRICE_MATRIX_TYPES: {
      QPA_PRICE_MATRIX_TEMPLATE: { Key: 'QPA Price Matrix Template', Value: 1 },
      LINE_OVERHEAD_PRICE_TEMPLATE: { Key: 'Line Overhead Price', Value: 2 }
    },
    LABOR_COST: {
      LABOR_COST_TEMPLATE_NAME: 'Template name',
      LABOR_COST_TEMPLATE: 'Labor Cost Template',
      LABOR_COST_PRICE_DETAILS: 'Labor cost price details',
      LABOR_COST_PRICE_DETAILS_Name: 'Labor_cost_price_details',
      FILE_NAME: 'LaborCostDetail',
      PRICE_VALIDATION_MESSAGE: 'Price should not be greater then previous added price'
    },
    LABOR_COST_HEADER: ['Mounting Type', 'QPA / Line Count', 'Ordered Qty', 'Price $'],
    LABORCOST_COLUMN_MAPPING: {
      MountingType: {
        Name: 'MountingTypeName',
        isRequired: true,
        isDisplay: true
      },
      mountingTypeId: {
        Name: 'mountingTypeId',
        isRequired: false,
        isDisplay: false
      },
      QPA: {
        Name: 'qpa',
        isRequired: true,
        isDisplay: true
      },
      ORDEREDQTY: {
        Name: 'orderedQty',
        isRequired: false,
        isDisplay: true
      },
      PRICE: {
        Name: 'price',
        isRequired: true,
        isDisplay: true
      }
    },
    UMID_History: {
      Trasaction_Type: {
        WH_Dept_Transfer: 'Warehouse to Department Transfer',
        WH_WH_Transfer: 'Warehouse to Warehouse Transfer',
        Bin_WH_Transfer: 'Bin to Warehouse Transfer',
        Bin_Bin_Transfer: 'Bin to Bin Transfer',
        UMID_Bin_Transfer: 'UMID to Bin Transfer',
        KitTransfer: 'Kit Transfer',
        UMID_Bin_TransferWithChangeCount: 'UMID to Bin Transfer And Change Count',
        ChangeOrgQty: 'Change Initial Qty.',
        WithinDept: 'Within Department',
        OtherDept: 'Department to Department',
        TransferStock: 'Transfer Stock',
        TransferKit: 'Transfer Kit'
      },
      Action_Performed: {
        TransferMaterial: 'Transfer Material',
        UMIDTransferMaterial: 'UMID Transfer Material',
        FeederTransferMaterial: 'Feeder Transfer Material',
        UMIDCountMaterial: 'UMID Count Material',
        ChangeInitialQty: 'Change Initial Qty',
        MismatchItem: 'Mismatch Item',
        KitRelease: 'Kit Release'
      },
      Category: {
        Tranfer_Stock_Dept_To_Dept: 'Transfer Stock [Department to Department]',
        UMID_List: 'UMID List',
        UMID_Management: 'UMID Management',
        Warehouse: 'Warehouse',
        Bin: 'Bin',
        Kit_Allocation: 'Kit Allocation',
        Kit_Preparation: 'Kit Preparation',
        Xfer_Bulk_Material: 'Xfer Bulk Material',
        Xfer_Material: 'Xfer Material ',
        SMP_Machine_Setup_Verification: 'Task List'
      }
    },
    gridConfig: {
      //grid + <page name> + <tab name>
      gridMaterialReceipt: 'gridMaterialReceipt',
      gridManagePackingSlipMaterial: 'gridManagePackingSlipMaterial',
      gridMeasurementType: 'gridMeasurementType',
      gridUOM: 'gridUOM',
      gridAssyType: 'gridAssyType',
      gridConnectorType: 'gridConnectorType',
      gridCostCategory: 'gridCostCategory',
      gridECOCategory: 'gridECOCategory',
      gridECOCategoryValues: 'gridECOCategoryValues',
      gridJobType: 'gridJobType',
      gridMountingType: 'gridMountingType',
      gridFunctionalType: 'gridFunctionalType',
      gridPackagingType: 'gridPackagingType',
      gridPartStatus: 'gridPartStatus',
      gridQuoteAttribute: 'gridQuoteAttribute',
      gridCustomer: 'gridCustomer',
      gridManufacturer: 'gridManufacturer',
      gridSupplier: 'gridSupplier',
      gridDepartment: 'gridDepartment',
      gridPersonnel: 'gridPersonnel',
      gridGenericCategory: 'gridGenericCategory',
      gridEquipment: 'gridEquipment',
      gridCountries: 'gridCountries',
      gridReason: 'gridReason',
      gridRequirement: 'gridRequirement',
      gridRFQLineItemErrorCode: 'gridRFQLineItemErrorCode',
      gridRFQType: 'gridRFQType',
      gridRoHS: 'gridRoHS',
      gridECO_DFM_Request: 'gridECO_DFM_Request',
      gridRFQ: 'gridRFQ',
      gridBin: 'gridBin',
      gridScanner: 'gridScanner',
      gridShippingRequest: 'gridShippingRequest',
      gridShippingRequestDet: 'gridShippingRequestDet',
      gridStanderdMessages: 'gridStanderdMessages',
      gridMasterTemplate: 'gridMasterTemplate',
      gridBarcodeTemplate: 'gridBarcodeTemplate',
      gridInHouseAssemblyStock: 'gridInHouseAssemblyStock',
      gridPartPriceBreackDetail: 'gridPartPriceBreackDetail',
      gridWareHouse: 'gridWareHouse',
      gridRack: 'gridRack',
      gridReceivingMaterial: 'gridReceivingMaterial',
      gridKeyword: 'gridKeyword',
      gridLaborCostTemplate: 'gridLaborCostTemplate',
      gridDefectCategory: 'gridDefectCategory',
      gridReaserveStockRequest: 'gridReaserveStockRequest',
      gridShippedAssembly: 'gridShippedAssembly',
      gridMergersAndAcquisitions: 'gridMergersAndAcquisitions',
      gridCertificateStandard: 'gridCertificateStandard',
      gridCertificateStandardClass: 'gridCertificateStandardClass',
      gridRoles: 'gridRoles',
      gridAssemblyOpeningStock: 'gridAssemblyOpeningStock',
      gridAssemblyProductionStock: 'gridAssemblyProductionStock',
      gridWorkOrderHaltResumeResonDetails: 'gridWorkOrderHaltResumeResonDetails',
      gridSalesOrderChangeHistoryLog: 'gridSalesOrderChangeHistoryLog',
      gridWOManualEntry: 'gridWOManualEntry',
      gridWONarrativeHistory: 'gridWONarrativeHistory',
      gridAssemblyStockDetails: 'gridAssemblyStockDetails',
      gridMfgPartList: 'gridMfgPartList',
      gridSupplierPartList: 'gridSupplierPartList',
      gridPackageCaseType: 'gridPackageCaseType',
      gridAliasPartValidation: 'gridAliasPartValidation',
      gridEntitySystemGenerated: 'gridEntitySystemGenerated',
      gridEntityCustom: 'gridEntityCustom',
      gridSetting: 'gridSetting',
      gridReportMaster: 'gridReportMaster',
      gridPageDetail: 'gridPageDetail',
      gridPackingSlip: 'gridPackingSlip',
      gridKitAllocationConsolidate: 'gridKitAllocationConsolidate',
      gridKitAllocation: 'gridKitAllocation',
      gridBinHistory: 'gridBinHistory',
      gridNonUMIDStock: 'gridNonUMIDStock',
      gridUMIDVerificationHistory: 'gridUMIDVerificationHistory',
      gridUMIDHistory: 'gridUMIDHistory',
      gridWorkOrder: 'gridWorkOrder',
      gridSalesOrder: 'gridSalesOrder',
      gridSalesSummaryOrder: 'gridSalesSummaryOrder',
      gridOperation: 'gridOperation',
      gridManageSalesOrder: 'gridManageSalesOrder',
      gridDynamicMessageList: 'gridDynamicMessageList',
      gridMessageWhereUsedList: 'gridMessageWhereUsedList',
      gridLabelTemplates: 'gridLabelTemplates',
      gridSerialNoTransHistory: 'gridSerialNoTransHistory',
      gridWoOperaionConfiguration: 'gridWoOperaionConfiguration',
      gridSerialNoMapping: 'gridSerialNoMapping',
      gridSerialNoGenerate: 'gridSerialNoGenerate',
      gridIncoming: 'gridIncoming',
      gridOutgoing: 'gridOutgoing',
      gridNotificationCartStatus: 'gridNotificationCartStatus',
      gridNotificationServerStatus: 'gridNotificationServerStatus',
      gridNotificationUnauthorize: 'gridNotificationUnauthorize',
      gridNotificationLog: 'gridNotificationLog',
      gridEmptyRack: 'gridEmptyRack',
      gridAvailableRack: 'gridAvailableRack',
      gridClearRack: 'gridClearRack',
      gridRackHistory: 'gridRackHistory',
      gridPendingWOCreation: 'gridPendingWOCreation',
      gridPartMapping: 'gridPartMapping',
      gridPartPriceSelection: 'gridPartPriceSelection',
      gridCustomerAssembyStock: 'gridCustomerAssembyStock',
      gridWOHaltNotificationReceiver: 'gridWOHaltNotificationReceiver',
      gridWOResumeNotificationReceiver: 'gridWOResumeNotificationReceiver',
      gridWorkOrderHaltOperationList: 'gridWorkOrderHaltOperationList',
      gridUnallocatedUmidXferHistory: 'gridUnallocatedUmidXferHistory',
      gridPurchaseInspectionRequirement: 'gridPurchaseInspectionRequirement',
      gridPurchaseInspectionList: 'gridPurchaseInspectionList',
      gridPurchaseInspectionRequirementWhereUsed: 'gridPurchaseInspectionRequirementWhereUsed',
      gridOperatingTemperatureConversion: 'gridOperatingTemperatureConversion',
      gridPackingSlipReceivePartInspectionDetail: 'gridPackingSlipReceivePartInspectionDetail',
      gridShowActiveOperationList: 'gridShowActiveOperationList',
      gridPurchaseInspectionRequirementTemplate: 'gridPurchaseInspectionRequirementTemplate',
      gridSupplierQuoteSummary: 'gridSupplierQuoteSummary',
      gridSupplierQuoteDetail: 'gridSupplierQuoteDetail',
      gridManageSupplierQuote: 'gridManageSupplierQuote',
      gridSupplierQuotePartPriceHistory: 'gridSupplierQuotePartPriceHistory',
      gridCalibrationDetailsList: 'gridCalibrationDetailsList',
      gridCustomerPackingSlipListSummary: 'gridCustomerPackingSlipListSummary',
      gridCustomerPackingSlipListDetail: 'gridCustomerPackingSlipListDetail',
      gridCustomerPackingSlipDetails: 'gridCustomerPackingSlipDetails',
      gridSupplierAttributeTemplate: 'gridSupplierAttributeTemplate',
      gridSupplierQuotePartPricingHistory: 'gridSupplierQuotePartPricingHistory',
      gridSupplierQuotePartPricingWhereUsed: 'gridSupplierQuotePartPricingWhereUsed',
      gridCustomerPackingSlipLog: 'gridCustomerPackingSlipLog',
      gridFOBList: 'gridFOBList',
      gridCustomerInvoiceSummary: 'gridCustomerInvoiceSummary',
      gridCustomerInvoiceDetail: 'gridCustomerInvoiceDetail',
      gridInputField: 'gridInputField',
      gridStockAdjustment: 'gridStockAdjustment',
      gridAgreementEmailTemplateList: 'gridAgreementEmailTemplateList',
      gridArchieveVersionList: 'gridArchieveVersionList',
      gridAgreedUserList: 'gridAgreedUserList',
      gridUserSignUpAgreementList: 'gridUserSignUpAgreementList',
      gridSearchMaterialUMIDDetail: 'gridSearchMaterialUMIDDetail',
      gridOtherExpenseDetail: 'gridOtherExpenseDetail',
      gridBoxSerialNumbers: 'gridBoxSerialNumbers',
      gridBoxScanSerialNumbers: 'gridBoxScanSerialNumbers',
      gridBoxScanSerialNumbersHistory: 'gridBoxScanSerialNumbersHistory',
      gridBankList: 'gridBankList',
      gridSupplierInvoicePayment: 'gridSupplierInvoicePayment',
      gridSupplierInvoicePaymentHistory: 'gridSupplierInvoicePaymentHistory',
      gridSupplierInvoiceRefund: 'gridSupplierInvoiceRefund',
      gridShowGenericConfirmation: 'gridShowGenericConfirmation',
      gridRightsSummaryPermissions: 'gridRightsSummaryPermissions',
      gridRightsSummaryFeatures: 'gridRightsSummaryFeatures',
      gridCameraList: 'gridCameraList',
      gridPendingCustomerPackingSlip: 'gridPendingCustomerPackingSlip',
      gridPendingCustomerPackingSlipSummary: 'gridPendingCustomerPackingSlipSummary',
      gridSupplierInvoiceList: 'gridSupplierInvoiceList',
      gridSupplierInvoiceDetailList: 'gridSupplierInvoiceDetailList',
      gridSupplierCreditMemoList: 'gridSupplierCreditMemoList',
      gridSupplierDebitMemoList: 'gridSupplierDebitMemoList',
      gridUMIDDataElementList: 'gridUMIDDataElementList',
      gridSupplierRMA: 'gridSupplierRMA',
      gridSupplierRMAMaterilDetail: 'gridSupplierRMAMaterilDetail',
      gridPurchaseOrderDetail: 'gridPurchaseOrderDetail',
      gridPurchaseOrderPurchasePartRequirementDetail: 'gridPurchaseOrderPurchasePartRequirementDetail',
      gridPurchaseOrderSummaryDetail: 'gridPurchaseOrderSummaryDetail',
      gridPurchaseOrderPerLineDetail: 'gridPurchaseOrderPerLineDetail',
      gridMFRWhereUsed: 'gridMFRWhereUsed',
      gridPurchaseOrderLog: 'gridPurchaseOrderLog',
      gridSupplierInvoicePaymentTransactionList: 'gridSupplierInvoicePaymentTransactionList',
      gridCustomerPaymentSummary: 'gridCustomerPaymentSummary',
      gridCustomerWriteOffSummary: 'gridCustomerWriteOffSummary',
      gridCustomerCreditNoteSummary: 'gridCustomerCreditNoteSummary',
      gridCustomerCreditNoteDetail: 'gridCustomerCreditNoteDetail',
      gridPackingSlipHistory: 'gridPackingSlipHistory',
      gridSupplierRMAHistory: 'gridSupplierRMAHistory',
      gridSupplierInvoiceHistory: 'gridSupplierInvoiceHistory',
      gridCreditMemoHistory: 'gridCreditMemoHistory',
      gridDebitMemoHistory: 'gridDebitMemoHistory',
      gridSupplierBalanceDue: 'gridSupplierBalanceDue',
      gridGenericFileExtension: 'gridGenericFileExtension',
      gridSearchMaterialHotTable: 'gridSearchMaterialHotTable',
      gridKitList: 'gridKitList',
      gridCustomrCPN: 'gridCustomrCPN',
      gridCustCPNMapping: 'gridCustCPNMapping',
      gridLoadMachineSetup: 'gridLoadMachineSetup',
      gridVerifyMachineSetup: 'gridVerifyMachineSetup',
      gridScanMaterial: 'gridScanMaterial',
      gridVerifyScanMaterial: 'gridVerifyScanMaterial',
      gridScanPlacementTrackingMaterial: 'gridScanPlacementTrackingMaterial',
      gridPartHistory: 'gridPartHistory',
      gridManagePurchaseInspectionTemplatePopup: 'gridManagePurchaseInspectionTemplatePopup',
      gridCountApprovalHistory: 'gridCountApprovalHistory',
      gridComponentNicknameWOBuildDetail: 'gridComponentNicknameWOBuildDetail',
      gridCustomerComment: 'gridCustomerComment',
      gridSupplierComment: 'gridSupplierComment',
      gridAgedReceivableCustInvBalance: 'gridAgedReceivableCustInvBalance',
      gridPastDueCustInvBalance: 'gridPastDueCustInvBalance',
      gridCustomerHistory: 'gridCustomerHistory',
      gridCustomerPaymentDetail: 'gridCustomerPaymentDetail',
      gridAppliedCustCreditMemoToInv: 'gridAppliedCustCreditMemoToInv',
      gridPendingCustPackingSlipPopup: 'gridPendingCustPackingSlipPopup',
      gridSplitUMIDList: 'gridSplitUMIDList',
      gridSupplierLimit: 'gridSupplierLimit',
      gridAppliedCustCreditMemoToInvDetail: 'gridAppliedCustCreditMemoToInvDetail',
      gridAppliedCustWriteOffToInvDetail: 'gridAppliedCustWriteOffToInvDetail',
      gridUmidActiveFeederList: 'gridUmidActiveFeederList',
      gridDuplicatePaymentNumOfCustRefund: 'gridDuplicatePaymentNumOfCustRefund',
      gridConfigureSearch: 'gridConfigureSearch',
      gridBOMLevel: 'gridBOMLevel',
      gridReceivedQtyDetails: 'gridReceivedQtyDetails',
      gridCustAgedRecvRangeDet: 'gridCustAgedRecvRangeDet',
      gridDeallocatedUMIDList: 'gridDeallocatedUMIDList',
      gridReleaseReturnHistoryList: 'gridReleaseReturnHistoryList',
      gridSOShippedQtyBifurcation: 'gridSOShippedQtyBifurcation',
      gridContactPersonList: 'gridContactPersonList',
      gridEmployeeContactPersonList: 'gridEmployeeContactPersonList',
      gridDCFormatList: 'gridDCFormatList'
    },
    BOMIconType: {
      RoHS: 'RoHS',
      ExportControl: 'ExportControl',
      DriverTool: 'DriverTool',
      MatingPart: 'matingPart',
      PickupPad: 'pickupPad',
      Obsolete: 'obsolete',
      PendingtoMapPartwithProgram: 'PendingtoMapPartwithProgram',
      PartiallyMapPartwithProgram: 'PartiallyMapPartwithProgram',
      FullyMapPartwithProgram: 'FullyMapPartwithProgram',
      NotRequiretoMapPartwithProgram: 'NotRequiretoMapPartwithProgram',
      Programing: 'Programing',
      TmaxRed: 'TmaxRed',
      TmaxWarn: 'TmaxWarn',
      OperationalAttribute: 'OperationalAttribute',
      MismatchMountingType: 'MismatchMountingType',
      MismatchFunctionalType: 'MismatchFunctionalType',
      ApproveMountingType: 'ApproveMountingType',
      BadPart: 'BadPart',
      BadSupplierPart: 'BadSupplierPart',
      CustomPart: 'CustomPart',
      MPNNotMappedInCPN: 'MPNNotMappedInCPN'
    },
    DIGKEY_STATUS: {
      Active: 'Active',
      InActive: 'Inactive',
      NotApplicable: 'N/A'
    },
    DYNAMIC_MESSAGE_TYPE: [
      { messageType: 'Warning' },
      { messageType: 'Error' },
      { messageType: 'Information' },
      { messageType: 'Success' },
      { messageType: 'Confirmation' }
    ],

    DYNAMIC_MESSAGE_CATEGORY: [
      { category: 'GLOBAL' },
      { category: 'USER' },
      { category: 'EMPLOYEE' },
      { category: 'PARTS' },
      { category: 'MASTER' },
      { category: 'RFQ' },
      { category: 'RECEIVING' },
      { category: 'MFG' }
    ],

    DYNAMIC_MESSAGE_TYPE_DROPDOWN: [
      { id: '', value: 'All' },
      { id: 'Warning', value: 'Warning' },
      { id: 'Error', value: 'Error' },
      { id: 'Information', value: 'Information' },
      { id: 'Success', value: 'Success' },
      { id: 'Confirmation', value: 'Confirmation' }
    ],

    DYNAMIC_MESSAGE_CATEGORY_DROPDOWN: [
      { id: '', value: 'All' },
      { id: 'GLOBAL', value: 'GLOBAL' },
      { id: 'USER', value: 'USER' },
      { id: 'EMPLOYEE', value: 'EMPLOYEE' },
      { id: 'PARTS', value: 'PARTS' },
      { id: 'MASTER', value: 'MASTER' },
      { id: 'RFQ', value: 'RFQ' },
      { id: 'RECEIVING', value: 'RECEIVING' },
      { id: 'MFG', value: 'MFG' }

    ],

    DisplayOrder: {
      CellTemplate: '<div style="\overflow: hidden\" class=\"ui-grid-cell-contents\" ng-class=\"{invalid:grid.validate.isInvalid(row.entity,col.colDef)}\" title=\"{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}\">{{COL_FIELD | number: 2}}</div>',
      EditCellTemplate: '<div class="grid-edit-input"><form name="inputForm"><input  type="INPUT_TYPE" min="0" max="9999.99" ng-style="{\'background-color\':rowRenderIndex % 2==0?\'transparent !important\':\'#f3f3f3 !important\'}"   ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" style="width:100%;text-align:left;border:none;margin-left:-10px"></form></div>',
      MaxLength: 9999.99
    },
    FileName_Export_Format: {
      DataTrackingEntity: {
        woOp: 'WO#-{0}[{1}], OP#-{2} DataTrackingEntity_Details.csv',
        woOpSubForm: 'WO#-{0}[{1}], OP#-{2}, {3} Details.csv',
        woOpEqp: 'WO#-{0}[{1}], OP#-{2}, Equipment-{3} DataTrackingEntity_Details.csv',
        woOpEqpSubForm: 'WO#-{0}[{1}], OP#-{2}, Equipment-{3}, {4} Details.csv'
      }
    },
    NotificationTreeTabs: {
      Inbox: {
        id: 1,
        icon: 'icon-inbox',
        title: 'Received',
        isDisplayNotificationCount: true
      },
      SendBox: {
        id: 2,
        icon: 'icon-send',
        title: 'Sent',
        isDisplayNotificationCount: false
      }
    },
    Modify_Grid_column_Allow_Change_Message: ' (Modify below as Required)',
    Notification_All_Receiver_Link_Text: '{0} ack {1} pending',
    InvoiceOtherChargeStartNumber: 1000,
    ReleaseKitStatusGridHeaderDropdownWO: [
      { id: null, value: 'All' },
      { id: 'Not Released', value: 'Not Released' },
      { id: 'Released', value: 'Released' }
    ],
    ReleaseKitStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Ready To Release', value: 'Ready To Release' },
      { id: 'Not Released', value: 'Not Released' },
      { id: 'Partially Released', value: 'Partially Released' },
      { id: 'Fully Released', value: 'Fully Released' }
    ],
    KitReturnStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'N/A', value: 'N/A' },
      { id: 'Not Returned', value: 'Not Returned' },
      { id: 'Ready To Return', value: 'Ready To Return' },
      { id: 'Partially Returned', value: 'Partially Returned' },
      { id: 'Intent to Re-Release', value: 'Intent to Re-Release' },
      { id: 'Fully Returned', value: 'Fully Returned' }
    ],
    KitPlanStatusGridHeaderDropdown: [
      { id: 'A', value: 'All' },
      { id: 'U', value: 'Unplanned (Requires Planning)' },
      { id: 'P', value: 'Partially Planned (Require Further Planning)' },
      { id: 'F', value: 'Fully Planned' }
    ],
    customerTypeDropdown: [
      { id: null, value: 'All' },
      { id: 'E', value: 'End Customer' },
      { id: 'B', value: 'Broker' }
    ],
    customerTypenameDropdown: [
      { id: null, value: 'All' },
      { id: 'End Customer', value: 'End Customer' },
      { id: 'Broker', value: 'Broker' }
    ],
    MFRTypeDropdown: [
      { id: null, value: 'All' },
      { id: 'Both', value: 'Both' },
      { id: 'Manufacturer Only', value: 'Manufacturer Only' }
    ],
    RoHSImageFormat: '{0}{1}{2}',
    ExportFormat: '{0}-{1}-{2}-{3}.xls',
    BOMExportName: {
      format1: 'BOM-Format1-Vertical-MFR-PN-View-Repeated-Line-Info',
      format2: 'BOM-Format2-Vertical-MFR-PN-View-No-Repeated-Line-Info',
      format3: 'BOM-Format3-Horizontal-MFR-PN-View',
      format4: 'BOM-Format4-Vertical-MFR-PN-With-Packaging-View-Repeated-Line-Info',
      format5: 'BOM-Format5-Vertical-MFR-PN-With-Packaging-View-No-Repeated-Line-Info',
      format6: 'BOM-Format6-Horizontal-MFR-PN-With-Packaging-View'
    },
    KitPurchaseDeptExportFormat: '{0}({1})-PO-{2}-QTY-{3}-{4}-{5}-{6}-PUR.xls',
    KitProductionDeptExportFormat: '{0}({1})-{2}-{3}-{4}-PROD.xls',
    KitAllocationConsolidatedExportName: 'Consolidated',
    KitAllocationStatusDropDown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Allocate', value: 'Allocate'
      },
      {
        id: 'Return', value: 'Return'
      },
      {
        id: 'Deallocate', value: 'Deallocate'
      }
    ],
    ExportDateFormat: 'MMddyy',
    AssemblyTypeTag: {
      Assembly: {
        DisplayText: 'Assembly',
        ClassName: 'label-primary'
      },
      SubAssembly: {
        DisplayText: 'Sub-assembly',
        ClassName: 'label-warning'
      }
    },
    packingSlipReceiptType: {
      P: { Key: 'P', Value: 'Packing Slip' },
      I: { Key: 'I', Value: 'Invoice' },
      C: { Key: 'C', Value: 'Credit Memo' },
      D: { Key: 'D', Value: 'Debit Memo' },
      R: { Key: 'R', Value: 'Supplier RMA' }
    },
    uploadMappingType: {
      F: { Key: 'F', Value: 'Import File' },
      C1: { Key: 'C1', Value: 'Copy-Paste Format#1' },
      C2: { Key: 'C2', Value: 'Copy-Paste Format#2 ({0} as a column)' }
    },
    Protocol: {
      withSSL: 'https:',
      withoutSSL: 'http:'
    },
    InovaxeUnauthorizeVerifyStatus: [{ id: null, value: 'All' }, { id: 'Resolved', value: 'Resolved' }, { id: 'Pending', value: 'Pending' }],
    InovaxeUnauthorizeMessage: [{ id: null, value: 'All' }, { id: 'Unauthorized Check-In', value: 'Unauthorized Check-In' }, { id: 'Unauthorized Check-Out', value: 'Unauthorized Check-Out' }, { id: 'Unauthorized Clear Request', value: 'Unauthorized Clear Request' }],
    SCAN_SIDE_TOOLTIP_MESSAGE_FOR_SCANNER: 'Scanning side is configured in supplier profile.<br/> Menu -> Settings -> Suppliers.',
    Incomin_Outgoing: [{ id: 'I', value: 'Incoming Rack' }, { id: 'O', value: 'Outgoing Rack' }],
    Incoming_Outgoing_Status: { I: { value: 'WIP' }, O: { value: 'Completed' } },
    RackStatusFilter: [
      { id: null, value: 'All' },
      {
        id: 'Passed', value: 'Passed'
      },
      {
        id: 'Reprocess Required', value: 'Reprocess Required'
      },
      {
        id: 'Defect Observed', value: 'Defect Observed'
      },
      {
        id: 'Scrapped', value: 'Scrapped'
      },
      {
        id: 'Rework Required', value: 'Rework Required'
      },
      {
        id: 'Board With Missing Parts', value: 'Board With Missing Parts'
      },
      {
        id: 'Bypassed', value: 'Bypassed'
      }
    ],
    RackTransactionType: [{ id: null, value: 'All', key: null }, { id: 'Empty', value: 'Empty', key: '1' }, { id: 'WIP', value: 'WIP', key: '2' }, { id: 'Completed', value: 'Completed', key: '3' }],
    NotRackTransaction: '4',
    DuplicateFileCopyAction: {
      Replace_File: {
        Key: 'Replace the file(s) in the destination', Value: 'RFD'
      },
      Skip_File: {
        Key: 'Skip these file(s)', Value: 'STF'
      },
      Keep_Both_File: {
        Key: 'Keep both file(s)', Value: 'KBF'
      }
    },
    RACK_NOT_FOUND: 'Rack# <b>{0}</b> not found',
    SUPPLIER_DEFAULT_TIME: 12,
    DIGIKEY_TYPE_ACC: {
      FJT_SCHEDULE_PARTUPDATEV3: 'FJTV3-ScheduleForPartUpdate',
      FJTV3: 'FJT-V3',
      FJTV3_BOM_CLEAN: 'FJTV3-CleanBOM'
    },
    DEFAULT_ALL: 'All',

    ENTITY_FORM_PERMISSION: [
      { id: 'A', value: 'Add Only' },
      { id: 'F', value: 'All' }
    ],
    DIGIKEYID: -1,
    PROFILE_IMG_SIZE: { w: 600, h: 400 },
    Part_Master_Tool_Tip_Message: {
      AvailableInhouseStock: 'Count(Qty) of available UMID created stock.',
      AvailableCustomerConsigned: 'Count(Qty) of available customer consigned UMID created stock.',
      PendingUmidStock: 'Count(Qty) of available stock for which UMID creation is pending.',
      InitialStock: 'Count(Qty) of available initial stock of existing assembly stock.',
      ReservedStock: 'Count(Qty) of reserved stock as per requested by customer.',
      ReservedPhysical: 'Count(Qty) of reserved UMID created stock for any customer.',
      TotalAvailableInHouseStock: 'Total count(Qty) of Available In-house Stock, Customer Consigned Stock, Pending UMID Stock, Initial Stock and Reserved Physical.',
      AllocatedStock: 'Count(Qty) of UMID created stock which is allocated to any on going Kit.',
      PackagingAliasStock: 'Count(Qty) of UMID created stock avialable in-house stock of the packaging alias part(s).',
      PackagingAliasPendingUMIDStock: 'Count(Qty) of available stock of the packaging alias part(s) which UMID pending for created.',
      AggregatePackagingAvailableInhouseStock: 'Sum of stocks of current part\'s available in-house and it\'s packaging alias part(s).',
      MaintainMinQty: 'Count(Qty) to be maintain minimum qty for safety stock as mentioned in part settings.',
      Shortage: 'Show the shortage of the current part\'s stock(qty) based on mentioned minimum qty in part settings and requested reserv part stock count from the available in-house stock and pending Umid stock.',
      CPNContainAVL: 'if part is CPN then we have to show sum of stock of all alternate part of that CPN'
    },
    DELETE_MPN_FROM_CPN_REQUEST_OPTIONS: {
      INTERNAL_ERROR: {
        name: 'Internal Error.',
        value: 1,
        message: 'Internal Error Due to Mistake Done by User.'
      },
      CUSTOMER_REQUEST: {
        name: 'Customer Request.',
        value: 2,
        message: 'Customer Request To Change in CPN AVL Parts.'
      }
    },
    MPN_REMOVE_OPTIONS_FROM_CPN: {
      REMOVE_FORM_CPN_ONLY: {
        name: 'Remove MPN from CPN Mapping Only.',
        value: 1,
        message: 'This will remove MPN mapping from CPN Only and Update in BOM for MPN Mapping Pending in CPN.'
      },
      REMOVE_FORM_CPN_AND_RELATED_BOM: {
        name: 'Remove MPN from CPN Mapping and Related BOM.',
        value: 2,
        message: 'This will MPN Mapping from CPN and remove MPN from BOM Alternate Parts'
      }
    },

    CUSTOMER_COMMENTS: {
      EMPTY_COMMENT_LIST: 'Please add at least one comment.'
    },
    CUSTOMER_PACKING_SLIP_TYPE: [{ id: 2, name: 'PO/SO' }, { id: 1, name: 'MISC' }],
    CUSTOMER_PACKING_SLIP_TYPE_FILTER: [{ id: null, value: 'All' }, { id: 'PO/SO', value: 'PO/SO' }, { id: 'MISC', value: 'MISC' }],
    TRANSACTION_TYPE: {
      PACKINGSLIP: 'P', // 1,
      INVOICE: 'I',
      CREDITNOTE: 'C'
    },
    WO_HISTORY_DATA_TYPE: {
      NUMBER: 'Number',
      STRING: 'String',
      ID: 'Id',
      COLOR: 'Color',
      BOOLEAN: 'Boolean',
      CASE: 'Case'
    },
    CustomerPackingVersionFormat: [
      { id: 'YYMMDD', value: 'YYMMDD' },
      { id: 'MMDDYY', value: 'MMDDYY' },
      { id: 'DDMMYY', value: 'DDMMYY' },
      { id: 'YYDDMM', value: 'YYDDMM' },
      { id: 'MMYYDD', value: 'MMYYDD' },
      { id: 'DDYYMM', value: 'DDYYMM' }
    ],
    InovaxeConnectionEnable: [
      { id: 'Yes', value: 'Yes' },
      { id: 'No', value: 'No' }
    ],
    KitReleaseWithOtherKitStockStatus: [
      { id: 1, value: 1 ,title:'Yes'},
      { id: 0, value: 0, title: 'No' }
    ],
    REPORT_CREATE_TYPE: {
      CreateNew: 0,
      CloneFromExisting: 1
    },
    ASSY_STOCK_TYPE: {
      OpeningStock: 'OS',
      WorkOrderStock: 'WS',
      AdjustmentStock: 'AS',
      UMIDStock: 'US'
    },
    VerificationRequestFrom: {
      TravelerPreProgram: 'TPP'
    },
    UsageReportGeneratedFrom: {
      WO: 1,
      SO: 2
    },
    DateCodeFormatFrom: [
      { key: 0, value: 'UMID' }, { key: 1, value: 'MFR' }, { key: 2, value: 'MPN' }
    ],
    UsageReportPartType: {
      ALL: 'ALL', // Include both BOM & SMT Parts
      BOM: 'BOM', // Include BOM parts only
      SMT: 'SMT' // Include SMT parts only
    },
    UsageReportDocType: {
      ALL: 'A', // Include both Image & COFC Document
      IMAGE: 'I', // Include Image only
      DOCUMENT: 'D' // Include Document only
    },
    /* For binding invoice verification status in ui-grid header filter part */
    CustomerInvoiceVerificationStatusOptionsGridHeaderDropdown: [
      { id: 0, value: 'Pending', code: 'Pending', DisplayOrder: 1 },
      { id: 1, value: 'Shipped - Not Invoiced', code: 'Shipped - Not Invoiced', DisplayOrder: 4 },
      { id: 2, value: 'Invoiced', code: 'Invoiced', DisplayOrder: 5 },
      { id: 3, value: 'Corrected & Invoiced', code: 'Corrected & Invoiced', DisplayOrder: 6 },
      { id: 4, value: 'Draft', code: 'Draft', DisplayOrder: 2 },
      { id: 5, value: 'Published', code: 'Published', DisplayOrder: 3 }
    ],
    OtherPartFrequency: [
      { id: 1, name: 'Every' },
      { id: 2, name: 'First' },
      { id: 3, name: 'Last' }
    ],
    OtherPartFrequencyType: [
      { id: 1, name: 'Release' },
      { id: 2, name: 'Shipment' }
    ],
    productDetailStatus: {
      Passed: {
        id: '1', status: 'Passed'
      },
      Reprocess: {
        id: '2', status: 'Reprocess Required'
      },
      Defect: {
        id: '3', status: 'Defect Observed'
      },
      Scrapped: {
        id: '4', status: 'Scrapped'
      },
      Rework: {
        id: '5', status: 'Rework Required'
      },
      BoardWithMissing: {
        id: '6', status: 'Board With Missing Parts'
      },
      Bypassed: {
        id: '7', status: 'Bypassed'
      }
    },
    BoxSerialNoPackagingStatus: [
      { id: 1, value: 'Not Packed to ship' },
      { id: 2, value: 'Packed to Ship' },
      { id: 3, value: 'Shipped' },
      { id: 4, value: 'Discard' }
    ],
    SEARCH_MATERIAL_CONTEXT_MENU: {
      updateMFR: { value: 'updateMFR', name: 'Update Part' }
    },
    MaxREFDESAllow: 10000,
    DISPLAYORDER: {
      CellTemplate: '<div ng-class=\"{invalid:grid.validate.isInvalid(row.entity,col.colDef)}\" class="ui-grid-cell-contents grid-cell-text-left">{{COL_FIELD | twoDecimalDisplayOrder}}</div>',
      MAXLENGTH: 99999.9999,
      EditableCellTemplate: '<div class="grid-edit-input"><form name="inputForm"><input type="INPUT_TYPE" min="0" ng-style="{\'background-color\':rowRenderIndex % 2==0?\'transparent !important\':\'#f3f3f3 !important\'}"   ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD" style="width:100%;text-align:left;border:none;margin-left:-10px"></form></div>',
      Width: 130,
      MaxWidth: 130
    },
    PackingSlipModeStatusOptionsGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Draft', value: 'Draft' },
      { id: 'Published', value: 'Published' }
    ],
    PackingSlipModeStatus: [
      {
        ID: 'D',
        Name: 'Draft',
        DisplayOrder: 1,
        ClassName: 'label-warning'
      }, {
        ID: 'P',
        Name: 'Published',
        DisplayOrder: 2,
        ClassName: 'label-primary'
      }
    ],
    AdjustMaterialType: {
      NewCount: 'Enter New',
      AddAppendCount: 'Add/Append ',
      RemoveDeductCount: 'Remove/Deduct'
    },
    RFQAssyStatus: {
      INPROGRESS: { Name: 'In Progress', ID: 1 },
      FOLLOWUP: { Name: 'Follow up Submitted RFQ', ID: 2 },
      WON: { Name: 'Won', ID: 3 },
      Lost: { Name: 'Lost', ID: 4 },
      CANCEL: { Name: 'Canceled', ID: 5 }
    },
    SupplierRMAModeStatusOptionsGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Draft', value: 'Draft' },
      { id: 'Published', value: 'Published' },
      { id: 'Shipped', value: 'Shipped' }
    ],
    SupplierRMAModeStatus: [
      {
        ID: 'D',
        Name: 'Draft',
        DisplayOrder: 1,
        ClassName: 'label-warning'
      }, {
        ID: 'P',
        Name: 'Published',
        DisplayOrder: 2,
        ClassName: 'label-primary'
      }, {
        ID: 'S',
        Name: 'Shipped',
        DisplayOrder: 3,
        ClassName: 'label-success'
      }
    ],
    ShippingInsuranceDropDown: [
      { id: null, value: 'All' },
      { id: 'Yes', value: 'Yes' },
      { id: 'No', value: 'No' }
    ],
    BlanketPOOptionDropDown: [
      { id: null, value: 'All' },
      { id: 'Use This Blanket PO# for All Releases', value: 'Use This Blanket PO# for All Releases' },
      { id: 'Link Future PO(s) to This Blanket PO', value: 'Link Future PO(s) to This Blanket PO' },
      { id: 'Use Blanket PO# and Release# for All Releases', value: 'Use Blanket PO# and Release# for All Releases' }
    ],
    SupplierRMAStatus: [
      { id: null, value: 'All', code: 'AL' },
      { id: 'Draft', value: 'Draft', code: 'D' },
      { id: 'Waiting For Shipment', value: 'Waiting For Shipment', code: 'WS' },
      { id: 'Waiting For Credit Memo', value: 'Waiting for Credit Memo', code: 'WC' },
      { id: 'Credit Memo Received', value: 'Credit Memo Received', code: 'CR' },
      { id: 'Approved To Pay', value: 'Approved To Pay', code: 'A' },
      { id: 'Fully Paid', value: 'Fully Paid', code: 'P' },
      { id: 'Partially Paid', value: 'Partially Paid', code: 'PP' }
    ],
    BaseUOMDropDown: [
      { id: null, value: 'All' },
      { id: 'Yes', value: 'Yes' },
      { id: 'No', value: 'No' }
    ],
    SupplierRMAStatusCode: {
      Draft: 'D',
      WaitingForShipment: 'WS',
      WaitingForCreditMemo: 'WC',
      CreditMemoReceived: 'CR',
      ApprovedToPay: 'A',
      PartiallyPaid: 'PP',
      Paid: 'P'
    },
    SalesOrderDetStatus: {
      INPROGRESS: 1,
      COMPLETED: 2,
      CANCELED: -1
    },
    SalesOrderDetStatusText: {
      INPROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CANCELED: 'Canceled'
    },
    DatakeyDateType: {
      TYPE1: '1',
      TYPE0: '0'
    },
    AssignRightsAndFeatures: {
      VIEW: 'View',
      CHECKMARK: 'Checkmark',
      EDIT: 'Edit',
      FEATURES: 'Features',
      PERMISSIONS: 'Permissions',
      SelectedPage: 'Selected Page',
      SelectedFeature: 'Selected Feature',
      Select: 'Select',
      Role: 'Role',
      RemovePageFilter: 'Click to remove this page',
      RemoveFeatureFilter: 'Click to remove this feature',
      Clear: 'Clear',
      Refresh: 'Refresh',
      AddNew: 'Add New',
      Remove: 'Remove',
      RemoveAll: 'Remove All',
      AddAll: 'Add All',
      Add: 'Add',
      Close: 'Close',
      Cancel: 'Cancel',
      Ok: 'Ok',
      Action: 'Action',
      RightForPage: 'Page',
      RightForFeature: 'Feature',
      RightForPermissionActive: 'PermissionActive',
      MultipleSelected: 'MultipleSelected',
      PagePermissionToUser: 'Assign Page Permission(s) to user(s)',
      FeatureRightToUser: 'Assign Feature Permission(s) to user(s)',
      ConfirmToRemovePage: 'Selected Page Permission will be removed. Press Yes to continue',
      ConfirmToRemoveFeature: 'Selected Feature Permission will be removed. Press Yes to continue',
      RemoveFilter: 'Click to remove this filter',
      AppliedGridFilter: 'Applied Grid Filter'
    },
    FluxTypeDropDown: [
      { id: null, value: 'All' },
      { id: 'NA', value: 'Not Applicable' },
      { id: 'WS', value: 'Water-Soluble' },
      { id: 'NC', value: 'No-Clean' },
      { id: 'BOTH', value: 'Water-Soluble and No-Clean' }
    ],
    PrefixForGeneratePackingSlip: {
      CustomerPackingSlip: 'PS',
      invoiceNumberSlip: 'INV'
    },
    PODEFAULTCOMMENT: 'PO is valid for Authorized/franchised Parts Only. Do not book or ship any unauthorized lines without prior approval from {0} Procurement Team.',
    FluxTypeIcon: {
      noCleanIcon: 'icons-no-clean-11',
      waterSolubleIcon: 'icons-ws',
      notApplicableIcon: 'icons-not-applicable'
    },
    FluxTypeToolTip: {
      noClean: 'No-Clean',
      waterSoluble: 'Water-Soluble',
      notApplicable: 'Flux Type-Not Applicable'
    },
    PurchaseOrderAdvancedFilters: {
      Supplier: { value: 'Suppliers', isDeleted: true },
      ShippingMethod: { value: 'Shipping Methods', isDeleted: true },
      POLineStatus: { value: 'PO Line Working Status', isDeleted: true },
      POStatus: { value: 'PO Working Status', isDeleted: true },
      POLockStatus: { value: 'Lock Status', isDeleted: true },
      POPostingStatus: { value: 'PO Posting Status', isDeleted: true },
      Parts: { value: 'PID / Assy ID / CPN', isDeleted: true },
      PODate: { value: 'PO Date', isDeleted: true },
      POComments: { value: 'Search Comments', isDeleted: true },
      TotalExt: { value: 'Total Ext. Price ($)', isDeleted: true },
      Amount: { value: 'Amount ($)', isDeleted: true },
      POSO: { value: 'Search PO#/SO#', isDeleted: true }
    },
    WhereUsedDropDown: [
      {
        id: null, value: 'All'
      },
      {
        id: 1, value: 'BOM'
      },
      {
        id: 2, value: 'Part'
      }
    ],
    CustomerPackingSlipStatus: [{
      ID: 1,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning',
      ParentID: 0
    }, {
      ID: 2,
      Name: 'Ready To Ship',
      DisplayOrder: 3,
      ClassName: 'light-pink-bg',// label-primary',
      ParentID: 1
    }, {
      ID: 3,
      Name: 'Waiting For Shipping Label',
      DisplayOrder: 4,
      ClassName: 'light-green-bg',
      ParentID: 1
    }, {
      ID: 4,
      Name: 'Waiting For Pickup',
      DisplayOrder: 5,
      ClassName: 'light-blue-bg',
      ParentID: 1
    }, {
      ID: 5,
      Name: 'Shipped',
      DisplayOrder: 6,
      ClassName: 'label-success',
      ParentID: 1
    }, {
      ID: 6,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary',
      ParentID: 1
    }],
    CustomerPackingSlipStatusID: {
      Draft: 0,
      Published: 1,
      Shipped: 2
    },
    CustomerPackingSlipSubStatusID: {
      Draft: 1,
      ReadyToShip: 2,
      WaitingForShipping: 3,
      WaitingForPickup: 4,
      Shipped: 5,
      Published: 6
    },
    CustomerPackingSlipStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Draft', value: 'Draft' },
      { id: 'Published', value: 'Published' },
      { id: 'Ready to Ship', value: 'Ready to Ship' },
      { id: 'Waiting For Shipping Label', value: 'Waiting For Shipping Label' },
      { id: 'Waiting For Pickup', value: 'Waiting For Pickup' },
      { id: 'Shipped', value: 'Shipped' }
    ],
    CUSTOMER_INVOICE_PAID_FILTERS_TOOLTIP: 'Apply Payment Received to enable this filter.',
    UOM_OPERATOR: [{ id: 'Multiply', value: 'Multiplied By' }, { id: 'Divide', value: 'Divided By' }],
    RefPaymentModeForInvoicePayment: {
      Payable: 'P',
      Receivable: 'R',
      CreditMemoApplied: 'CA',
      SupplierRefund: 'RR',
      CustomerWriteOff: 'WOFF',
      CustomerRefund: 'CR'
    },
    InvoicePaymentStatus: {
      Pending: 'PE',
      PartialReceived: 'PR',
      Received: 'RE'
    },
    CUSTINVOICE_STATUS: {
      DRAFT: 1,
      PUBLISHED: 2
    },
    CUSTINVOICE_SUBSTATUS: {
      SHIPPEDNOTINVOICED: 1,
      INVOICED: 2,
      CORRECTEDINVOICED: 3,
      DRAFT: 4,
      PUBLISHED: 5
    },
    CUSTINVOICE_SUBSTATUS_TEXT: {
      SHIPPEDNOTINVOICED: 'Shipped - Not Invoiced',
      INVOICED: 'Invoiced',
      CORRECTEDINVOICED: 'Corrected & Invoiced',
      DRAFT: 'Draft',
      PUBLISHED: 'Published'
    },
    Customer_Invoice_SubStatus: [{
      ID: 1,
      Name: 'Shipped - Not Invoiced',
      DisplayOrder: 3,
      ClassName: 'light-blue-bg'// light-pink-bg'
    },
    {
      ID: 2,
      Name: 'Invoiced',
      DisplayOrder: 4,
      ClassName: 'label-success' //light-blue-bg'
    },
    {
      ID: 3,
      Name: 'Corrected & Invoiced',
      DisplayOrder: 5,
      ClassName: 'light-green-bg'
    },
    {
      ID: 4,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    },
    {
      ID: 5,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary'
    }
    ],
    CustInvoiceStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Draft', value: 'Draft', code: 4 },
      { id: 'Published', value: 'Published', code: 5 },
      { id: 'Shipped - Not Invoiced', value: 'Shipped - Not Invoiced', code: 1 },
      { id: 'Invoiced', value: 'Invoiced', code: 2 },
      { id: 'Corrected & Invoiced', value: 'Corrected & Invoiced', code: 3 }
    ],
    PaymentStatus: [
      { id: null, value: 'All' },
      { id: 'Not Invoiced', value: 'Not Invoiced' },
      { id: 'Waiting For Payment', value: 'Waiting For Payment' },
      { id: 'Partial Payment Received', value: 'Partial Payment Received' },
      { id: 'Payment Received', value: 'Payment Received' }
    ],
    CustCrNoteStatusGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Draft', value: 'Draft', code: 1 },
      { id: 'Published', value: 'Published', code: 2 }
    ],
    CustomerPackingSlipStatusForInvoiceGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Draft', value: 'Draft' },
      { id: 'Published', value: 'Published' },
      { id: 'Ready to Ship', value: 'Ready to Ship' },
      { id: 'Waiting For Shipping Label', value: 'Waiting For Shipping Label' },
      { id: 'Waiting For Pickup', value: 'Waiting For Pickup' },
      { id: 'Shipped', value: 'Shipped' },
      { id: 'Not Applicable', value: 'Not Applicable' }
    ],
    Customer_CrMemo_SubStatus: [{
      ID: 1,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning'
    },
    {
      ID: 2,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary'
    }
    ],
    TypeOfAccount: [
      { id: 'S', name: 'Saving' },
      { id: 'C', name: 'Checking' },
      { id: 'CC', name: 'Credit Card' }
    ],
    CreditDebitType: [
      { id: 'C', name: 'Credit' },
      { id: 'D', name: 'Debit' },
      { id: 'B', name: 'Credit/Debit' }
    ],
    CUSTCRNOTE_STATUS: {
      DRAFT: 1,
      PUBLISHED: 2
    },
    CUSTCRNOTE_SUBSTATUS: {
      DRAFT: 1,
      PUBLISHED: 2
    },
    CUSTCRNOTE_SUBSTATUS_TEXT: {
      DRAFT: 'Draft',
      PUBLISHED: 'Published'
    },
    // logical status
    Customer_Payment_Status: [{
      ID: 0,
      Name: 'Not Invoiced',
      DisplayOrder: 0,
      ClassName: 'label-warning',
      Code: 'NI'
    }, {
      ID: 1,
      Name: 'Waiting For Payment',
      DisplayOrder: 1,
      ClassName: 'light-blue-bg',
      Code: 'WP'
    },
    {
      ID: 2,
      Name: 'Partial Payment Received',
      DisplayOrder: 2,
      ClassName: 'label-primary',
      Code: 'PR'
    },
    {
      ID: 3,
      Name: 'Payment Received',
      DisplayOrder: 3,
      ClassName: 'light-green-bg',
      Code: 'RE'
    },
    {
      ID: 4,
      Name: 'Pending',
      DisplayOrder: 0,
      ClassName: 'label-success',
      Code: 'PEN'
    }],
    CustomerPackingSlipStatusInInvoice: [{
      ID: 0,
      Name: 'Not Appicable',
      DisplayOrder: 1,
      ClassName: 'label-warning',
      ParentID: 0
    },
    {
      ID: 1,
      Name: 'Draft',
      DisplayOrder: 1,
      ClassName: 'label-warning',
      ParentID: 0
    }, {
      ID: 2,
      Name: 'Ready To Ship',
      DisplayOrder: 3,
      ClassName: 'light-pink-bg',
      ParentID: 1
    }, {
      ID: 3,
      Name: 'Waiting For Shipping Label',
      DisplayOrder: 4,
      ClassName: 'light-green-bg',
      ParentID: 1
    }, {
      ID: 4,
      Name: 'Waiting For Pickup',
      DisplayOrder: 5,
      ClassName: 'light-blue-bg',
      ParentID: 1
    }, {
      ID: 5,
      Name: 'Shipped',
      DisplayOrder: 6,
      ClassName: 'label-success',
      ParentID: 1
    }, {
      ID: 6,
      Name: 'Published',
      DisplayOrder: 2,
      ClassName: 'label-primary',
      ParentID: 1
    }],
    CustomerInvoiceTypeGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Invoice', value: 'Invoice' },
      { id: 'MISC Invoice', value: 'MISC Invoice' }
    ],
    CustomerInvoiceType: [
      {
        ID: 1,
        Name: 'Invoice',
        DisplayOrder: 1,
        ClassName: 'label-success'
      },
      {
        ID: 2,
        Name: 'MISC Invoice',
        DisplayOrder: 2,
        ClassName: 'label-warning',
        Code: 'PR'
      }
    ],
    ADD_ENTERPRISE_WITH_DATE_RANGE_NOTES: 'By applying date range, data will be added based on Created/Modified dates of existing records as selected in From Date/To Date.',
    ADD_ENTERPRISE_WITH_DATE_RANGE_NOTES_LIST_PAGE: 'On Add data, it will ask for Date range to select specific data to add in Enterprise, if required to add all data then leave dates blank.',
    PO_COPY_NOTES: 'Release Due Dates and Supplier Promised Delivery Dates will be reflected per past PO time frame.',
    PO_WORKING_STATUS: {
      DRAFT: 'Draft',
      PUBLISH: 'Published'
    },
    maxAddressLength: 500,
    MAX_MPN_LENGTH: 100,
    PartRequirementTypeOptionsGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Requirement', value: 'Requirement'
      },
      {
        id: 'Comment', value: 'Comment'
      }
    ],
    /* for binding in ui-grid header filter payment status in customer payment list*/
    CustPaymentStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'No Pending Amount', value: 'No Pending Amount'
      },
      {
        id: 'Fully Applied', value: 'Fully Applied'
      },
      {
        id: 'Partially Applied', value: 'Partially Applied'
      },
      {
        id: 'Not Applied', value: 'Not Applied'
      },
      {
        id: 'Voided', value: 'Voided'
      }
    ],
    PO_Line_WorkingStatus: {
      Open: { id: 'P', value: 'Open' },
      Close: { id: 'C', value: 'Closed' }
    },
    PurchaseOrderLineStatusGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 'Open', value: 'Open', class: 'label-box label-warning', ID: 'P'
      },
      { id: 'Closed', value: 'Closed', class: 'label-box label-success', ID: 'C' },
      { id: 'Canceled', value: 'Canceled', class: 'label-box label-danger', ID: 'CA' }
    ],
    TEMPLATE_REPORTS_KEYWORD: 'templatereports',
    REPORT_SUFFIX: {
      PURCHASE_ORDER: 'PO',
      SALES_ORDER: 'SO',
      CUSTOMER_PACKINGSLIP: 'CPS',
      CUSTOMER_INVOICE: 'CINV',
      QUOTE: 'QT',
      CUSTOMER_CREDIT_MEMO: 'CCM',
      SUPPLIER_RMA_MEMO: 'SRMAPS',
      SUPPLIER_DEBIT_MEMO: 'SDM',
      SUPPLIER_PACKING_SLIP: 'Receiving-Material-Inspection-Report'
    },
    INPUT_TYPES: {
      AUTOCOMPLETE: 'A',
      CHECKBOX: 'C',
      RADIOBUTTON: 'R',
      DATE_PICKER: 'D',
      TIME_PICKER: 'T',
      MULTI_SELECTION: 'M',
      AUTOCOMPLETE_WITH_MULTISELCTION: 'AM',
      SINGLE_SELECTION: 'S',
      MULTISELECT_CHECKBOX: 'MSC',
      TEXTBOX: 'TB',
      DROPDOWN: 'DD'
    },
    REPORT_DATERANGE_INPUT: {
      FROM_DATE: '01/01/2001'
    },
    ReportParameterFilterDbColumnName: {
      PackingSlipId: 'packingSlipId',
      SupplierPackingSlipId: 'supplierPackingSlipId',
      PackingSlipSerialNumber: 'packingSlipSerialNumber',
      FromDate: 'fromDate',
      ToDate: 'toDate',
      FromTime: 'fromTime',
      ToTime: 'toTime',
      EmployeeID: 'employeeID',
      WorkorderID: 'workorderID',
      OperationID: 'operationID',
      AssyID: 'assyID',
      PartID: 'partID'
    },
    CustPaymentStatusInInvoiceGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Not Invoiced', value: 'Not Invoiced' },
      { id: 'Waiting For Payment', value: 'Waiting For Payment' },
      { id: 'Partial Payment Received', value: 'Partial Payment Received' },
      { id: 'Payment Received', value: 'Payment Received' }
    ],
    CustPaymentStatusInPackingSlipGridHeaderDropdown: [
      { id: null, value: 'All' },
      { id: 'Pending', value: 'Pending' },
      { id: 'Not Invoiced', value: 'Not Invoiced' },
      { id: 'Waiting For Payment', value: 'Waiting For Payment' },
      { id: 'Partial Payment Received', value: 'Partial Payment Received' },
      { id: 'Payment Received', value: 'Payment Received' }
    ],
    SalesOrderAdvancedFilters: {
      Customer: { value: 'Customer', isDeleted: true },
      ShippingMethod: { value: 'Shipping Method', isDeleted: true },
      Terms: { value: 'Terms', isDeleted: true },
      Parts: { value: 'PID / Assy ID / MPN / Assy# / CPN', isDeleted: true },
      POSO: { value: 'PO#/SO#/RMA#', isDeleted: true },
      TotalExt: { value: 'Total Ext. Price ($)', isDeleted: true },
      TotalSOExt: { value: 'Total SO Amount ($)', isDeleted: true },
      SOStatus: { value: 'SO Working Status', isDeleted: true },
      SOPOSTStatus: { value: 'SO Posting Status', isDeleted: true },
      KitPlanStatus: { value: 'Kit Plan Status', isDeleted: true },
      KitReleaseStatus: { value: 'Kit Release Status', isDeleted: true },
      KitReturnStatus: { value: 'Kit Return Status', isDeleted: true },
      SODate: { value: 'SO Date', isDeleted: true },
      WorkOrder: { value: 'Work Order', isDeleted: true },
      RushJob: { value: 'Rush Job', isDeleted: true },
      SubAssembly: { value: 'Include Sub Assembly Kits', isDeleted: true },
      RmaPO: { value: 'RMA PO', isDeleted: true },
      PODate: { value: 'PO Date', isDeleted: true },
      PORevDate: { value: 'PO Rev. Date', isDeleted: true },
      Comments: { value: 'Comments', isDeleted: true },
      ClearAll: { value: 'Clear All', isDeleted: true }
    },
    WorkorderAdvancedFilters: {
      Status: { value: 'Status', isDeleted: false, isDisable: true },
      WoType: { value: 'WO Type', isDeleted: true, isDisable: false },
      AssyType: { value: 'Assy Type', isDeleted: true, isDisable: false },
      RoHS: { value: 'RoHS', isDeleted: true, isDisable: false },
      Standards: { value: 'Standards', isDeleted: true, isDisable: false },
      PendingSOMapping: { value: 'Pending SO Mapping w/ WO', isDeleted: true, isDisable: false },
      PendingKitMapping: { value: 'Pending Kit Mapping w/ WO', isDeleted: true, isDisable: false },
      TrackBySerialNumber: { value: 'Track By Serial#', isDeleted: true, isDisable: false },
      InternalBuildOnly: { value: 'Internal Build Only', isDeleted: true, isDisable: false },
      ValidateUMIDWithBomWOutKit: { value: 'Validate UMID w/ BOM w/o Kit Allocation', isDeleted: true, isDisable: false },
      RevisedWo: { value: 'Revised WO', isDeleted: true, isDisable: false },
      NewWo: { value: 'New WO', isDeleted: true, isDisable: false },
      FluxType: { value: 'Flux Type', isDeleted: true, isDisable: false },
      AppliedECO: { value: 'Applied ECO', isDeleted: true, isDisable: false },
      // Closed: { value: 'Closed', isDeleted: true },
      RushJob: { value: 'Rush Job', isDeleted: true, isDisable: false },
      RunningWorkOrder: { value: 'Running Work Order', isDeleted: true, isDisable: false },
      StoppedWorkorder: { value: 'Stopped Work Order', isDeleted: true, isDisable: false },
      Customer: { value: 'Customer', isDeleted: true, isDisable: false },
      PONumber: { value: 'PO#,SO#', isDeleted: true, isDisable: false },
      AssyId: { value: 'Assy ID', isDeleted: true, isDisable: false },
      Operation: { value: 'Operation', isDeleted: true, isDisable: false },
      NickName: { value: 'Nickname', isDeleted: true, isDisable: false },
      Personnel: { value: 'Personnel', isDeleted: true, isDisable: false },
      Equipment: { value: 'Equipment', isDeleted: true, isDisable: false },
      SuppliesMaterialsTools: { value: 'Supplies, Materials & Tools', isDeleted: true, isDisable: false },
      UMIDUsed: { value: 'UMID Used', isDeleted: true, isDisable: false }
    },
    OperationAdvanceFilter: {
      Operation: { value: 'Operation', isDeleted: true },
      filterStatus: { value: 'Status', isDeleted: true },
      Description: { value: 'Description', isDeleted: true },
      ClearAll: { value: 'Clear All', isDeleted: true }
    },
    ContactPersonAdvanceFilter: {
      RefEntityType: { name: 'refEntityType', value: 'Contact Person Type', isDeleted: true },
      Primary: { name: 'isPrimary', value: 'Primary Person', isDeleted: true },
      Default: { name: 'isDefault', value: 'Set As Default "Attention To"', isDeleted: true },
      MfgIds: { name: 'mfgIds', value: 'Supplier/Customer/Manufacturer', isDeleted: true },
      Comment: { name: 'additionalComment', value: 'Comment', isDeleted: true },
      NameSearch: { name: 'nameSearch', value: 'First Name / Middle Name / Last Name', isDeleted: true },
      EmpIds: { name: 'empIds', value: 'Assigned Personnel', isDeleted: true },
      ClearAll: { value: 'Clear All', isDeleted: true }
    },
    ContactPersonEntityRadioGroup: {
      RefEntityTypeRadio: [{ Key: 'All Contacts', GridDisplayValue: 'All Contacts', Value: null, EntityName: null },
      { Key: 'Personnel Contact', GridDisplayValue: 'Personnel Contacts', Value: 'Personnel', EntityName: 'Personnel', tableName: 'employees' },
      { Key: 'Supplier Contact', GridDisplayValue: 'Supplier Contacts', Value: 'Supplier', EntityName: 'Suppliers', tableName: 'mfgcodemst', mfgType: 'DIST', isCustOrDisty: true },
      { Key: 'Customer/Manufacturer Contact', GridDisplayValue: 'Customer/Manufacturer Contacts', Value: 'Customer/Manufacturer', EntityName: 'Customers And Manufacturers', tableName: 'mfgcodemst', mfgType: 'MFG' }]
    },
    POCompleteType: {
      AUTO: 'A',
      MANUAL: 'M',
      OPEN: 'P'
    },
    PartRestrictionSettings: [
      {
        Name: 'Restrict Use Including Packaging Alias (With Permission)',
        Tooltip: 'Will use this part at BOM if the user has permission'
      },
      {
        Name: 'Restrict Use Excluding Packaging Alias (With Permission)',
        Tooltip: 'Will use this part at BOM if the user has permission'
      },
      {
        Name: 'Restrict Use Including Packaging Alias (Permanently)',
        Tooltip: 'Restrict to the user This part in the entire application'
      },
      { Name: 'Restrict Use Excluding Packaging Alias (Permanently)', Tooltip: 'Restrict to the user This part in the entire application' }
    ],
    POCompleteStatusTypeDropDown: [{ id: null, value: 'All' },
    { id: 'Open', value: 'Open' },
    { id: 'Auto Completed', value: 'Auto Completed' },
    { id: 'Manually Completed', value: 'Manually Completed' }],
    ImagePopOverTemplate: '<div class= "width-100p height-100p"><img class="width-100p cm-list-prev-img" src="{0}" /></div></div>',
    QualityDepartmentID: { id: -1 },
    DATAENTRYCHANGE_AUDITLOG_TABLENAME: {
      MFGCODEMST: 'MFGCODEMST',
      JOBTYPE: 'JOBTYPE',
      RFQTYPE: 'RFQTYPE',
      REQUIREMENT: 'REQUIREMENT',
      RFQ_LINEITEMS_ERRORCODE: 'RFQ_LINEITEMS_ERRORCODE',
      QUOTECHARGES_DYNAMIC_FIELDS_MST: 'QUOTECHARGES_DYNAMIC_FIELDS_MST',
      RFQ_LINEITEMS_KEYWORDS: 'RFQ_LINEITEMS_KEYWORDS',
      LABOR_COST_TEMPLATE: 'LABOR_COST_TEMPLATE',
      MASTER_TEMPLATES: 'MASTER_TEMPLATES',
      OPERATIONS: 'OPERATIONS',
      CONTACT_PERSON: 'CONTACT_PERSON',
      DATE_CODE_FORMAT: 'DATE_CODE_FORMAT'
    },
    WorkorderSerialNo: {
      Separator: '', // for now it is kept blank . this is used in Workorder SerialNo generation logic
      MaxLengthForPrefix: 100,
      MaxLengthForSuffix: 100
    },
    DATE_FILTER_LIST: [
      { ID: 1, Value: 'Today' },
      { ID: 2, Value: 'Yesterday' },
      { ID: 3, Value: 'Current Week' },
      { ID: 4, Value: 'Current Month' },
      { ID: 5, Value: 'Current Quarter' },
      { ID: 6, Value: 'Current Semi-Annual' },
      { ID: 7, Value: 'Current Year' },
      { ID: 8, Value: 'Last Week' },
      { ID: 9, Value: 'Last Month' },
      { ID: 10, Value: 'Last Quarter' },
      { ID: 11, Value: 'Last Semi-Annual' },
      { ID: 12, Value: 'Last Year' },
      { ID: 13, Value: 'Custom' }
    ],
    DATE_FILTER_OBJ: {
      TODAY: { ID: 1, Value: 'Today' },
      YESTERDAY: { ID: 2, Value: 'Yesterday' },
      CURRENTWEEK: { ID: 3, Value: 'Current Week' },
      CURRENTMONTH: { ID: 4, Value: 'Current Month' },
      CURRENTQUARTER: { ID: 5, Value: 'Current Quarter' },
      CURRENTSEMIANNUAL: { ID: 6, Value: 'Current Semi-Annual' },
      CURRENTYEAR: { ID: 7, Value: 'Current Year' },
      LASTWEEK: { ID: 8, Value: 'Last Week' },
      LASTMONTH: { ID: 9, Value: 'Last Month' },
      LASTQUARTER: { ID: 10, Value: 'Last Quarter' },
      LASTSEMIANNUAL: { ID: 11, Value: 'Last Semi-Annual' },
      LASTYEAR: { ID: 12, Value: 'Last Year' },
      CUSTOM: { ID: 13, Value: 'Custom' }
    },
    PO_Working_Status: {
      InProgress: { id: 'P', value: 'In Progress' },
      Completed: { id: 'C', value: 'Completed' },
      Canceled: { id: 'CA', value: 'Canceled' }
    },
    COMMON_ANCHORE_TAG_FOR_REDIRECTION: '<a href=\'{0}\' target=\'_blank\' tabindex=\'-1\' class=\'underline\'>{1}</a>',
    SC_QUOTE_STATUS: {
      ACTIVE: 'Active',
      EXPIRED: 'Expired'
    },
    KeywordWithNA: { NA: 'N/A', YES: 'Yes', NO: 'No' },
    KeywordWithNAGridHeaderDropDown: [
      { id: null, value: 'ALL' },
      { id: 'NA', value: 'N/A' },
      { id: 'YES', value: 'Yes' },
      { id: 'NO', value: 'No' }
    ],
    duplicatePoLineSaveType: {
      DifferentLine: {
        ID: 0,
        Name: 'Add as Another PO Line'
      },
      SameLine: {
        ID: 1,
        Name: 'Merge With PO Line'
      },
      Cancel: {
        ID: 2,
        Name: 'Cancel'
      }
    },
    SO_WORKING_STATUS: {
      InProgress: 'In Progress',
      Completed: 'Completed',
      Canceled: 'Canceled'
    },
    Assembly_Stock_Type_Name: {
      WOStock: 'Production Stock',
      InitialAssemblyStock: 'Initial Stock'
    },
    DELETE_MODULE_LIST: {
      PARTS: [LABEL_CONSTANT.PACKAGING_ALIAS, LABEL_CONSTANT.OTHER_PART_NAMES, LABEL_CONSTANT.ALTERNATE_PARTS, LABEL_CONSTANT.ROHS_REPLACEMENT_PARTS, LABEL_CONSTANT.DRIVE_TOOLS, LABEL_CONSTANT.REQUIRE_MATING_PARTS, LABEL_CONSTANT.REQUIRE_PICKUP_PAD, LABEL_CONSTANT.REQUIRE_FUNCTIONAL_TESTING,
      LABEL_CONSTANT.FUNCTIONAL_TESTING_EQUIPMENT, LABEL_CONSTANT.PROCESS_MATERIALS, LABEL_CONSTANT.STANDARDS, LABEL_CONSTANT.DOCUMENTS, LABEL_CONSTANT.DATA_FIELDS, LABEL_CONSTANT.MISC, LABEL_CONSTANT.CUSTOMER_LOA, LABEL_CONSTANT.COMMENTS, LABEL_CONSTANT.DISAPPROVED_SUPPLIER, LABEL_CONSTANT.SALES_PRICE_MATRIX,
      LABEL_CONSTANT.PART_IMAGES, LABEL_CONSTANT.PART_DATASHEET, LABEL_CONSTANT.EXPORT_AND_LEGAL_CLASSIFICATION, LABEL_CONSTANT.SPECIFIC_REQUIREMENT_AND_COMMENTS, LABEL_CONSTANT.OPERATIONAL_ATTRIBUTES, LABEL_CONSTANT.ACCEPTABLE_SHIPPING_COUNTRIES]
    },
    CustomerInvAdvancedFilters: {
      Status: { value: 'Status', isDeleted: false, isDisable: false },
      Customer: { value: 'Customer', isDeleted: true, isDisable: false },
      CurrentPaymentTerm: { value: 'Payment Terms', isDeleted: true, isDisable: false },
      PaymentStatus: { value: 'Payment Status', isDeleted: true, isDisable: false },
      DueDateFilter: { value: 'Due Date', isDeleted: true, isDisable: false },
      SearchPaymentNumber: { value: 'Payment# or Check#', isDeleted: true, isDisable: false },
      SearchPoNumber: { value: 'PO# / SO# / Packing Slip# / Invoice#', isDeleted: true, isDisable: false },
      PartId: { value: 'PID / Assy ID / MFR PN / Assy# / CPN', isDeleted: true, isDisable: false },
      InvoiceDate: { value: 'Invoice Date', isDeleted: true, isDisable: false },
      ZeroAmountInv: { value: 'Zero Amount {0} Only', isDeleted: true, isDisable: false },
      ZeroAmountLine: { value: 'Zero Amount Line Only', isDeleted: true, isDisable: false },
      SalesCommIncluded: { value: 'Line with Sales Commission', isDeleted: true, isDisable: false },
      OtherChargesIncluded: { value: 'Line with Other Charges', isDeleted: true, isDisable: false },
      CreditMemoAppliedStatus: { value: 'Credit Memo Applied Status', isDeleted: true, isDisable: false },
      CreditMemoRefundStatus: { value: 'Credit Memo Refund Status', isDeleted: true, isDisable: false },
      PackingSlipDate: { value: 'Packing Slip Date', isDeleted: true, isDisable: false },
      PODate: { value: 'PO Date', isDeleted: true, isDisable: false },
      SODate: { value: 'SO Date', isDeleted: true, isDisable: false },
      CreditDate: { value: 'CM Date', isDeleted: true, isDisable: false },
      DebitDate: { value: 'DM Date', isDeleted: true, isDisable: false },
      Comments: { value: 'Comments', isDeleted: true, isDisable: false }
    },
    CustPackingSlipAdvancedFilters: {
      Status: { value: 'Status', isDeleted: false, isDisable: false },
      Customer: { value: 'Customer', isDeleted: true, isDisable: false },
      CustomerInvoiceStatus: { value: 'Customer Invoice Status', isDeleted: true, isDisable: false },
      SearchPoNumber: { value: 'PO# / SO# / Packing Slip# / Invoice# / RMA#', isDeleted: true, isDisable: false },
      PartId: { value: 'PID / Assy ID / MPN / Assy# / CPN', isDeleted: true, isDisable: false },
      PackingSlipDate: { value: 'Packing Slip Date', isDeleted: true, isDisable: false },
      PODate: { value: 'PO Date', isDeleted: true, isDisable: false },
      SODate: { value: 'SO Date', isDeleted: true, isDisable: false },
      Comments: { value: 'Comments', isDeleted: true, isDisable: false }
    },
    FREQUENCY_TYPE: [{ id: 1, type: 'Release' }, { id: 2, type: 'Shipment' }],
    InitialStockPOTypeRadioGroup: {
      poType: [{ Key: 'Legacy PO', Value: 'L' }, { Key: 'MISC', Value: 'M' }]
    },
    InitialStockPOType: {
      LegacyPO: 'L',
      SystemPO: 'S',
      MiscPO: 'M'
    },
    InitialStockPOTypeText: {
      LegacyAndSystemPO: 'PO with Q2C Sales Order and without Q2C WO',
      MiscPO: 'PO without Q2C Sales Order and without Q2C WO',
      NoPO: 'Not Available'
    },
    OIDC_CLIENT_RESPONSE_MESSAGES: {
      FOUND_TIME_AHEAD: {
        KEY: 'ID20001',
        MESSAGE: 'iat is in the future:',
        DISPLAY_MESSAGE: 'Your clock is ahead.'
      },
      FOUND_TIME_BEHIND: {
        KEY: 'ID20002',
        MESSAGE: 'exp is in the past:',
        DISPLAY_MESSAGE: 'your clock is behind.'
      },
      STATE_NOT_FOUND: {
        KEY: 'ID20003',
        MESSAGE: 'No state in response',
        DISPLAY_MESSAGE: 'No state in response'
      },
      MISMATCH_STATE_IN_STORAGE: {
        KEY: 'ID20004',
        MESSAGE: 'No matching state found in storage',
        DISPLAY_MESSAGE: 'No matching state found in storage'
      }
    },
    SO_CALL: {
      OTHER_CHRG: 1,
      REMOVE_SODET: 2,
      REMOVE_LINEDET: 3
    },
    SO_COPY_NOTES: 'Requested Dock Dates, Requested Ship Dates and Promised Ship Dates will be reflected per past PO time frame.',
    ACCESS_DENIED_INVALID_CREDENTIALS: 'Access is denied due to invalid credentials',
    PO_REDIRECTION_TYPE: {
      withoutOtherPart: '1',
      OtherPart: '2',
      completedLines: '3',
      pendingLines: '4'
    },
    CustomerConsignedDropDown: [
      { id: null, value: 'All' },
      { id: 'Yes', value: 'Yes' },
      { id: 'No', value: 'No' }
    ],
    NonUmidStockDropDown: [
      { id: null, value: 'All' },
      { id: 'Yes', value: 'Yes' },
      { id: 'No', value: 'No' }
    ],
    CustPaymentStatusInInvoice: [
      { id: null, value: 'All' },
      { id: 'NI', value: 'Not Invoiced' },
      { id: 'WP', value: 'Waiting For Payment' },
      { id: 'PR', value: 'Partial Payment Received' },
      { id: 'RE', value: 'Payment Received' }
    ],
    SOWorkingStatusID: {
      InProgress: 1,
      Completed: 2,
      Cancelled: -1
    },
    CustomerMappingTooltip: 'Mapped customer is allowed to select as customer consigned in purchase order and material receipt page.',
    COMMON_HISTORY: {
      JOBTYPE: {
        LABLE_NAME: 'Job Type',
        HISTORY_EMPTY_MESSAGE: 'No Job Type history listed yet!'
      },
      RFQTYPE: {
        LABLE_NAME: 'RFQ Type',
        HISTORY_EMPTY_MESSAGE: 'No RFQ type history listed yet!'
      },
      REQUIREMENT: {
        LABLE_NAME: 'RFQ Requirement Template Name',
        HISTORY_EMPTY_MESSAGE: 'No RFQ Requirement Template history listed yet!'
      },
      RFQ_LINEITEMS_ERRORCODE: {
        HISTORY_EMPTY_MESSAGE: 'No  BOM Error Code List history listed yet!'
      },
      RFQ_QUOTE_ATTRIBUTE: {
        Type: 'RFQ Quote Attribute',
        LABLE_NAME: 'Quote Attribute Name',
        HISTORY_EMPTY_MESSAGE: 'No RFQ Quote Attributes history listed yet!'
      },
      SUPPLIER_QUOTE_ATTRIBUTE: {
        Type: 'Supplier Quote Attribute',
        LABLE_NAME: 'Quote Attribute Name',
        HISTORY_EMPTY_MESSAGE: 'No Supplier Quote Attributes history listed yet!'
      },
      KEYWORD: {
        LABLE_NAME: 'Keyword Name',
        HISTORY_EMPTY_MESSAGE: 'No Keywords history listed yet!'
      },
      LABOR_COST_TEMPLATE: {
        LABLE_NAME: 'Labor Cost Template Name',
        HISTORY_EMPTY_MESSAGE: 'No Labor Cost Template history listed yet!'
      },
      EMPLOYEE_CONTACTPERSN: {
        HISTORY_EMPTY_MESSAGE: 'No functional user account history listed yet!'
      },
      IMAGEURL: 'assets/images/emptystate/shipped-list.png',
      MESSAGE: 'No {0} listed yet!'
    },
    POType: [{
      Name: '',
      ClassName: 'cm-no-bg'
    },
    {
      Name: 'Blanket PO',
      ClassName: 'light-blue-bg'
    },
    {
      Name: 'Legacy PO',
      ClassName: 'label-success'
    },
    {
      Name: 'RMA',
      ClassName: 'label-warning'
    }],
    ConfigurationMasterKeyList: {
      UIGridPreference: { id: -1, configName: 'UI Grid Preference', configCode: 'uiGridPreference' },
      DefaultCustPaymentListTabID: { id: -2, configName: 'Customer Payment Default List Tab ID', configCode: 'defaultCustPaymentListTabID' },
      DefaultCustAppliedCMListTabID: { id: -3, configName: 'Customer Applied Credit Memo Default List Tab ID', configCode: 'defaultCustAppliedCMListTabID' },
      DefaultCustAppliedWOFFListTabID: { id: -4, configName: 'Customer Write Offs Default List Tab ID', configCode: 'defaultCustAppliedWOFFListTabID' },
      DefaultCustRefundListTabID: { id: -5, configName: 'Customer Refund Default List Tab ID', configCode: 'defaultCustRefundListTabID' },
      DefaultCustInvoiceListTabID: { id: -6, configName: 'Customer Invoice Default List Tab ID', configCode: 'defaultCustInvoiceListTabID' },
      DefaultCustCreditNoteListTabID: { id: -7, configName: 'Customer Credit Note Default List Tab ID', configCode: 'defaultCustCreditNoteListTabID' },
      DefaultCustPackingSlipListTabID: { id: -8, configName: 'Customer Packing Slip Default List Tab ID', configCode: 'defaultCustPackingSlipListTabID' },
      DefaultSalesOrderListTabID: { id: -9, configName: 'Sales Order Default List Tab ID', configCode: 'defaultSalesOrderListTabID' },
      DefaultPurchaseOrderListTabID: { id: -10, configName: 'Purchase Order Default List Tab ID', configCode: 'defaultPurchaseOrderListTabID' },
      DefaultSupplierQuoteListTabID: { id: -11, configName: 'Supplier Quote List Tab ID', configCode: 'defaultSupplierQuoteListTabID' }
    },
    UIGridPreferences: {
      Pagination: 'P',
      Scrolling: 'S'
    },
    ShipmentSummary: {
      SortingColumn: [
        { id: 1, value: 'Customer' },
        { id: 2, value: 'PO#' },
        { id: 3, value: 'PO Date' },
        { id: 4, value: 'SO Date' }
      ]
    },
    Supplier_Standard_Status: {
      NA: { id: 'NA', value: 'N/A' },
      Compliant: { id: 'CO', value: 'Compliant' },
      Certified: { id: 'CR', value: 'Certified' }
    },
    CommonDateFilterSearchCriteria: [
      { key: 'Custom_Date', value: 'Custom', isShowBottomBorder: true },
      { key: 'TODAY', value: 'Today' },
      { key: 'TOMORROW', value: 'Tomorrow' },
      { key: 'YESTERDAY', value: 'Yesterday', isShowBottomBorder: true },
      { key: 'LAST_SEVEN_DAYS', value: 'Last 7 Days' },
      { key: 'LAST_FORTEEN_DAYS', value: 'Last 14 Days' },
      { key: 'LAST_THIRTY_DAYS', value: 'Last 30 Days', isShowBottomBorder: true },
      { key: 'NEXT_WEEK', value: 'Next Week' },
      { key: 'CURRENT_WEEK', value: 'Current Week' },
      { key: 'LAST_WEEK', value: 'Previous Week', isShowBottomBorder: true },
      { key: 'NEXT_MONTH', value: 'Next Month' },
      { key: 'CURRENT_MONTH', value: 'Current Month' },
      { key: 'LAST_MONTH', value: 'Previous Month', isShowBottomBorder: true },
      { key: 'NEXT_QUARTER', value: 'Next Quarter' },
      { key: 'CURRENT_QUARTER', value: 'Current Quarter' },
      { key: 'LAST_QUARTER', value: 'Previous Quarter', isShowBottomBorder: true },
      { key: 'NEXT_SEMI_ANNUAL', value: 'Next Semi-Annual' },
      { key: 'CURRENT_SEMI_ANNUAL', value: 'Current Semi-Annual' },
      { key: 'LAST_SEMI_ANNUAL', value: 'Previous Semi-Annual', isShowBottomBorder: true },
      { key: 'NEXT_YEAR', value: 'Next Year' },
      { key: 'CURRENT_YEAR', value: 'Current Year' },
      { key: 'LAST_YEAR', value: 'Previous Year', isShowBottomBorder: true },
      { key: 'FIRST_QUARTER', value: 'First Quarter' },
      { key: 'SECOND_QUARTER', value: 'Second Quarter' },
      { key: 'THIRD_QUARTER', value: 'Third Quarter' },
      { key: 'FOURTH_QUARTER', value: 'Fourth Quarter', isShowBottomBorder: true },
      { key: 'WEEK_TO_DATE', value: 'Week To Date' },
      { key: 'MONTH_TO_DATE', value: 'Month To Date' },
      { key: 'QUARTER_TO_DATE', value: 'Quarter To Date' },
      { key: 'YEAR_TO_DATE', value: 'Year To Date', isShowBottomBorder: true },
      { key: 'TTM', value: 'TTM', isShowBottomBorder: true },
      { key: 'LIFE_TIME', value: 'Lifetime' }
    ],
    PO_Posting_Status: {
      Draft: { id: '0', value: 'Draft' },
      Publish: { id: '1', value: 'Publish' }
    },
    ContactPersonDisplayFormatList: [
      { id: 1, value: 'First Middle Last' },
      { id: 2, value: 'First Last' },
      { id: 3, value: 'First Middle Initial Last' },
      { id: 4, value: 'First Middle Initial. Last' },
      { id: 5, value: 'Last, First Middle' },
      { id: 6, value: 'Last, First' },
      { id: 7, value: 'Last, First Middle Initial' },
      { id: 8, value: 'Last, First Middle Initial.' }
    ],
    SortingOrder: [
      { id: 1, value: 'Ascending' },
      { id: 2, value: 'Descending' }
    ],
    CustAddressViewActionBtn: {
      AddNew: { isVisible: true, isDisable: false },
      Update: { isVisible: true, isDisable: false },
      ApplyNew: { isVisible: true, isDisable: false },
      Delete: { isVisible: true, isDisable: false },
      SetDefault: { isVisible: false, isDisable: false },
      Refresh: { isVisible: true, isDisable: false },
      Duplicate: { isVisible: false, isDisable: false }
    },
    ContactPersonViewActionBtn: {
      AddNew: { isVisible: true, isDisable: false },
      Update: { isVisible: true, isDisable: false },
      ApplyNew: { isVisible: true, isDisable: false },
      Delete: { isVisible: true, isDisable: false },
      SetDefault: { isVisible: false, isDisable: false },
      Refresh: { isVisible: true, isDisable: false },
      Duplicate: { isVisible: false, isDisable: false },
      SetPrimary: { isVisible: false, isDisable: false }
    },
    EmployeeDisplayFormatList: [
      { id: 1, value: '(Initial) First Middle Last' },
      { id: 2, value: '(Initial) First Last' },
      { id: 3, value: '(Initial) First Middle Initial Last' },
      { id: 4, value: '(Initial) First Middle Initial. Last' },
      { id: 5, value: '(Initial) Last, First Middle' },
      { id: 6, value: '(Initial) Last, First' },
      { id: 7, value: '(Initial) Last, First Middle Initial' },
      { id: 8, value: '(Initial) Last, First Middle Initial.' }
    ],
    ContactPersonRefEntities: {
      Personnel: 'Personnel',
      Supplier: 'Supplier',
      CustomerAndManufacturer: 'Customer/Manufacturer'
    },
    /* for binding in ui-grid header Correct Part filter keyword list*/
    CorrectPartGridHeaderDropdown: [
      {
        id: null, value: 'All'
      },
      {
        id: 1, value: 'Correct Part'
      },
      {
        id: 2, value: 'Incorrect Part'
      },
      {
        id: 3, value: 'TBD Part'
      }
    ],
    AddressMismatchSelection: [
      {
        id: 1,
        name: 'fromSOHeader',
        title: 'Sales Order Header',
        className: ''
      },
      {
        id: 3,
        name: 'fromCPSHeader',
        title: 'Packing Slip Header',
        className: 'highlight'
      },
      {
        id: 2,
        name: 'fromSORelLine',
        title: 'SO Release Line',
        className: 'highlight'
      },
      {
        id: 4,
        name: 'fromManualSelection',
        title: 'Select Shipping Detail Manually',
        className: ''
      }
    ],
    DetailTabSectionView: {
      PackagingAlias: { ID: 1, Title: 'Packaging Alias' },
      AlternatePart: { ID: 2, Title: 'Alternate Parts' },
      RohsAlternatePart: { ID: 3, Title: 'RoHS Replacement Parts' },
      WhereUserInAssembly: { ID: 4, Title: 'Where Used in Assembly' },
      SupplierAlias: { ID: 5, Title: 'Supplier Alias' },
      RequireDriveTools: { ID: 6, Title: 'Require Drive Tools' },
      ProcessMaterial: { ID: 7, Title: 'Process Material' },
      CPNPart: { ID: 8, Title: 'CPN' },
      WhereUsedOther: { ID: 9, Title: 'Where Used (Others)' },
      RequiredMatingParts: { ID: 10, Title: 'Require Mating Parts' },
      PickupPad: { ID: 11, Title: 'Use Part with Pickup Pad instead' },
      Program: { ID: 12, Title: 'Program' },
      RequireFunctionalTesting: { ID: 13, Title: 'Require Functional Testing' },
      FunctionalTestingEquipment: { ID: 14, Title: 'Functional Testing Equipments' },
      IncorrectPartMapping: { ID: 15, Title: 'Incorrect Part Mapping' }
    },
    PhoneMobileFaxCategory: [
      { key: 'Work', value: 'Work', isContainExt: true, objectKey: 'work', className: 'md-cyan-900-bg' },
      { key: 'Work Fax', value: 'Work Fax', isContainExt: false, objectKey: 'workFax', className: 'light-blue-bg' },
      { key: 'Mobile', value: 'Mobile', isContainExt: false, objectKey: 'mobile', className: 'label-success' },
      { key: 'Main', value: 'Main', isContainExt: false, objectKey: 'main', className: 'label-warning' },
      { key: 'Home', value: 'Home', isContainExt: false, objectKey: 'home', className: 'md-purple-300-bg' },
      { key: 'Home Fax', value: 'Home Fax', isContainExt: false, objectKey: 'homeFax', className: 'md-purple-bg' },
      { key: 'Pager', value: 'Pager', isContainExt: false, objectKey: 'pager', className: 'md-brown-400-bg' },
      { key: 'Voicemail', value: 'Voicemail', isContainExt: false, objectKey: 'voicemail', className: 'md-indigo-400-bg' },
      { key: 'Other', value: 'Other', isContainExt: false, objectKey: 'other', className: 'md-green-700-bg' }
    ],
    EamilSettingsForContactPersonRadio: [
      { key: 'None', value: 'N' },
      { key: 'Primary Email', value: 'p' },
      { key: 'All Emails', value: 'A' }
    ],
    EmailSettingsforContPersonGridHeaderDropdown: [
      { id: null, value: 'All', key: 'all' },
      { id: 'None', value: 'None', key: 'none' },
      { id: 'Primary Email', value: 'Primary Email', key: 'primaryEmail' },
      { id: 'All Emails', value: 'All Emails', key: 'allEmail' }
    ],
    personnelTypeRadio: [
      { key: 'Personal', value: 'P', objectKey: 'personal' },
      { key: 'Functional', value: 'F', objectKey: 'functional' }
    ],
    NAVIGATION_DIRECTION: {
      NEXT: 'N',
      PREVIOUS: 'P',
      NEW: 'NW',
      FIRST: 'F',
      LAST: 'L',
      CURR: 'CU'
    },
    SOLINENUMBERTYPE: {
      SOLINENUM: 'SO',
      CUSTPOLINE: 'CUSTPO'
    },
    CUST_PACKINGSLIP_TYPE: {
      MISC_PS: 1,
      SO_PS: 2,
      MISC_INV: 3,
      CR_NOTE: 4
    },
    SOWORKINGSTATUSCODE: {
      INPROGRESS: 1,
      COMPLETED: 2
    },
    SO_WORKINGSTATUS_LIST: [
      { id: 1, value: 'In Progress' },
      { id: 2, value: 'Completed' }
    ],
    DEFUALT_IMPORT_PART_ID: -1000,
    PersonnelTypeGridHeaderDropdown: [
      { id: null, value: 'All', labelClass: null },
      { id: 'Personal', value: 'Personal' },
      { id: 'Functional', value: 'Functional' }
    ]
  };
  angular
    .module('app.core')
    .constant('CORE', CORE);
})();
