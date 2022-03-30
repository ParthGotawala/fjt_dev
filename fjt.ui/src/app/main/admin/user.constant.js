(function () {
  'use strict';
  /** @ngInject */
  var USER = {
    USER_ERROR_LABEL: 'Error',

    ADMIN_LABEL: 'Admin',
    ADMIN_STATE: 'admin',
    ADMIN_ROUTE: '/admin',
    ADMIN_CONTROLLER: '',
    ADMIN_VIEW: '',

    ADMIN_USER_LABEL: 'User',
    ADMIN_USER_STATE: 'admin.users',
    ADMIN_USER_ROUTE: '/users',
    ADMIN_USER_CONTROLLER: '',
    ADMIN_USER_VIEW: '',

    // user user
    ADMIN_USER_USER_LABEL: 'User',
    ADMIN_USER_USER_ROUTE: '/userlist',
    ADMIN_USER_USER_STATE: 'app.user',
    ADMIN_USER_USER_CONTROLLER: 'AdminUserController',
    ADMIN_USER_USER_VIEW: 'app/main/admin/user/user.html',

    // user role
    ADMIN_USER_ROLE_LABEL: 'Role',
    ADMIN_USER_ROLE_ROUTE: '/user/role',
    ADMIN_USER_ROLE_STATE: 'app.role',
    ADMIN_USER_ROLE_CONTROLLER: 'roleController',
    ADMIN_USER_ROLE_VIEW: 'app/main/admin/role/role.html',
    ADMIN_USER_ROLE_OTHERPERMISSION_VIEW: 'app/main/admin/role/other-permission-popup.html',
    ADMIN_USER_ROLE_POPUP_VIEW: 'app/main/admin/role/manage-role-popup.html',
    ADMIN_USER_ROLE_POPUP_CONTROLLER: 'ManageRolePopupController',
    ADMIN_USER_ROLE_USEROTHERPERMISSION_CONTROLLER: 'UserOtherPermissionPopupController',

    ADMIN_USER_ROLE_UPADTE_CONTROLLER: 'RoleUpdateController',
    ADMIN_USER_ROLE_UPADTE_VIEW: 'app/main/admin/role/role-update.html',
    ADMIN_USER_ROLE_UPDATE_ROUTE: '/:id',
    ADMIN_USER_ROLE_UPDATE_STATE: 'app.role.roleUpdate',

    ADMIN_SUPPLIER_LABEL: 'Supplier',
    ADMIN_SUPPLIER_STATE: 'app.supplier',
    ADMIN_SUPPLIER_ROUTE: '/supplier/:customerType',

    ADMIN_CUSTOMER_LABEL: 'Customer',
    ADMIN_CUSTOMER_STATE: 'app.customer',
    ADMIN_CUSTOMER_ROUTE: '/customer/:customerType',

    ADMIN_CUSTOMER_CONTROLLER: 'CustomerController',
    ADMIN_CUSTOMER_VIEW: 'app/main/admin/customer/customer.html',

    ADMIN_EMPLOYEE_LABEL: 'Employee',
    ADMIN_EMPLOYEE_ROUTE: '/employee',
    ADMIN_EMPLOYEE_STATE: 'app.employee',
    ADMIN_EMPLOYEE_CONTROLLER: 'EmployeeController',
    ADMIN_EMPLOYEE_VIEW: 'app/main/admin/employee/employee.html',
    ADMIN_EMPLOYEE_UPDATE_VIEW: 'app/main/admin/employee/employee-update.html',
    ADMIN_EMPLOYEE_UPDATE_CONTROLLER: 'EmployeeUpdateController',
    ADMIN_EMPLOYEE_MANAGE_ROUTE: '/manage',
    ADMIN_EMPLOYEE_MANAGE_STATE: 'app.employee.manage',

    ADMIN_RELEASE_NOTES_LABEL: 'ReleaseNote',
    ADMIN_RELEASE_NOTES_ROUTE: '/releasenotes',
    ADMIN_RELEASE_NOTES_STATE: 'app.releasenotes',
    ADMIN_RELEASE_NOTES_CONTROLLER: 'ReleaseNotesController',
    ADMIN_RELEASE_NOTES_VIEW: 'app/main/admin/release-notes/release-notes.html',


    ADMIN_EMPLOYEE_MANAGE_DETAIL_ROUTE: '/detail/:id',
    ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE: 'app.employee.manage.details',
    ADMIN_EMPLOYEE_MANAGE_CREDENTIAL_ROUTE: '/credential/:id',
    ADMIN_EMPLOYEE_MANAGE_CREDENTIAL_STATE: 'app.employee.manage.credential',
    ADMIN_EMPLOYEE_MANAGE_SECURITY_AND_SETTINGS_ROUTE: '/security/:id',
    ADMIN_EMPLOYEE_MANAGE_SECURITY_AND_SETTINGS_STATE: 'app.employee.manage.security',
    ADMIN_EMPLOYEE_MANAGE_RIGHTS_SUMMARY_ROUTE: '/rightsSummary/:id',
    ADMIN_EMPLOYEE_MANAGE_RIGHTS_SUMMARY_STATE: 'app.employee.manage.rightsummary',
    ADMIN_EMPLOYEE_MANAGE_DEPARTMENT_ROUTE: '/department/:id',
    ADMIN_EMPLOYEE_MANAGE_DEPARTMENT_STATE: 'app.employee.manage.department',
    ADMIN_EMPLOYEE_MANAGE_DOCUMENTS_ROUTE: '/documents/:id',
    ADMIN_EMPLOYEE_MANAGE_DOCUMENTS_STATE: 'app.employee.manage.documents',
    ADMIN_EMPLOYEE_MANAGE_WORKSTATIONS_ROUTE: '/workstations/:id',
    ADMIN_EMPLOYEE_MANAGE_WORKSTATIONS_STATE: 'app.employee.manage.workstations',
    ADMIN_EMPLOYEE_MANAGE_CUSTOMERMAPPING_ROUTE: '/customermapping/:id',
    ADMIN_EMPLOYEE_MANAGE_CUSTOMERMAPPING_STATE: 'app.employee.manage.customermapping',
    ADMIN_EMPLOYEE_MANAGE_OTHERDETAIL_ROUTE: '/otherdetail/:id',
    ADMIN_EMPLOYEE_MANAGE_OTHERDETAIL_STATE: 'app.employee.manage.otherdetail',
    ADMIN_EMPLOYEE_MANAGE_PREFERENCE_ROUTE: '/preference/:id',
    ADMIN_EMPLOYEE_MANAGE_PREFERENCE_STATE: 'app.employee.manage.preference',
    ADMIN_EMPLOYEE_MANAGE_USERAGREEMENT_ROUTE: '/useragreement/:id',
    ADMIN_EMPLOYEE_MANAGE_USERAGREEMENT_STATE: 'app.employee.manage.useragreement',

    ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER: 'AddEmployeePopupController',
    ADMIN_EMPLOYEE_ADD_MODAL_VIEW: 'app/main/admin/employee/add-employee-popup.html',

    ADMIN_PART_ADD_MODAL_CONTROLLER: 'AddPartPopupController',
    ADMIN_PART_ADD_MODAL_VIEW: 'app/main/admin/parts/add-part-popup.html',

    ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER: 'AddEquipmentPopupController',
    ADMIN_EQUIPMENT_ADD_MODAL_VIEW: 'app/main/admin/equipment/add-equipment-popup.html',

    ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER: 'AddCustomerPopupController',
    ADMIN_CUSTOMER_ADD_MODAL_VIEW: 'app/main/admin/customer/add-customer-popup.html',

    /* popup to change company ownership */
    ADMIN_CHANGE_COMPANY_OWNERSHIP_POPUP_CONTROLLER: 'ChangeCompanyOwnershipController',
    ADMIN_CHANGE_COMPANY_OWNERSHIP_POPUP_VIEW: 'app/main/admin/customer/change-ownership-popup/change-company-ownership-popup.html',

    ADMIN_EMPLOYEE_PROFILE_VIEW: 'app/main/admin/employee/employee-profile.html',
    ADMIN_EMPLOYEE_PROFILE_CONTROLLER: 'EmployeeProfileController',
    ADMIN_EMPLOYEE_PROFILE_STATE: 'app.employee.view',
    ADMIN_EMPLOYEE_PROFILE_ROUTE: '/profile/:id',

    ADMIN_EMPLOYEE_TIMELINE_VIEW: 'app/main/admin/employee/employee-timeline.html',
    ADMIN_EMPLOYEE_TIMELINE_CONTROLLER: 'EmployeeTimelineController',
    ADMIN_EMPLOYEE_TIMELINE_STATE: 'app.employee.timeline',
    ADMIN_EMPLOYEE_TIMELINE_ROUTE: '/timeline/:id',

    ADMIN_EQUIPMENT_PROFILE_VIEW: 'app/main/admin/equipment/equipment-profile.html',
    ADMIN_EQUIPMENT_PROFILE_CONTROLLER: 'EquipmentProfileController',
    ADMIN_EQUIPMENT_PROFILE_STATE: 'app.equipment.view',
    ADMIN_EQUIPMENT_PROFILE_ROUTE: '/profile/:id',

    ADMIN_RESET_PASSWORD_LABEL: 'ReserPassword',
    ADMIN_RESET_PASSWORD_ROUTE: '/resetpassword',
    ADMIN_RESET_PASSWORD_STATE: 'resetpassword',
    ADMIN_RESET_PASSWORD_VIEW: './user/view/ResetPasswordView.html',
    ADMIN_RESET_PASSWORD_CONTROLLER: 'ResetPasswordController',

    //Component
    ADMIN_MFG_COMPONENT_LABEL: 'Manufacturer Components',
    ADMIN_MFG_COMPONENT_STATE: 'app.component.manufacturer',
    ADMIN_MFG_COMPONENT_ROUTE: '/mfg?keywords?headersearchkeywords?functionaltype?mountingtype?groupname',

    //Component
    ADMIN_DIST_COMPONENT_LABEL: 'Distributor Components',
    ADMIN_DIST_COMPONENT_STATE: 'app.component.distributor',
    ADMIN_DIST_COMPONENT_ROUTE: '/dist?keywords?headersearchkeywords?functionaltype?mountingtype?groupname',

    //Component
    ADMIN_COMPONENT_LABEL: 'Component',
    ADMIN_COMPONENT_STATE: 'app.component',
    ADMIN_COMPONENT_ROUTE: '/component',
    ADMIN_COMPONENT_CONTROLLER: 'ComponentController',
    ADMIN_COMPONENT_VIEW: 'app/main/admin/component/component-list.html',

    // CPN Parts
    ADMIN_CPN_PARTS_LABEL: 'CPN Parts',
    ADMIN_CPN_PARTS_STATE: 'app.cpnparts',
    ADMIN_CPN_PARTS_ROUTE: '/cpnparts/:customerID',
    ADMIN_CPN_PARTS_CONTROLLER: 'CPNPartsController',
    ADMIN_CPN_PARTS_VIEW: 'app/main/admin/customer/cpn-parts/cpn-parts.html',

    //Component
    ADMIN_ASSYTYPE_LABEL: 'Assy Type',
    ADMIN_ASSYTYPE_STATE: 'app.assytype',
    ADMIN_ASSYTYPE_ROUTE: '/assytype',
    ADMIN_ASSYTYPE_CONTROLLER: 'RFQAssyTypeListController',
    ADMIN_ASSYTYPE_VIEW: 'app/main/admin/component/rfq-assy-type/rfq-assy-type-list.html',

    // ECO
    ADMIN_ECO_LABEL: 'ECO',

    // ECO Category
    //ADMIN_ECO_CATEGORY_LABEL: 'ECO Category',
    ADMIN_ECO_CATEGORY_ROUTE: '/eco/ecocategory/1',
    ADMIN_ECO_CATEGORY_STATE: 'app.ecodfmcategorys',

    //Terms & Conditions Category
    //ADMIN_RFQ_CATEGORY_LABEL: 'Quote Terms & Condition Category',
    ADMIN_RFQ_CATEGORY_ROUTE: '/rfqsetting/termsandconditions/categorys/2',
    ADMIN_RFQ_CATEGORY_STATE: 'app.rfqcategorys',

    ADMIN_ECO_CATEGORY_CONTROLLER: 'ECOCategoryController',
    ADMIN_ECO_CATEGORY_VIEW: 'app/main/admin/eco/eco-category/eco-category.html',
    ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_CONTROLLER: 'ECOCategoryAddUpdatePopupController',
    ADMIN_ECO_CATEGORY_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/eco/eco-category/eco-category-add-update-popup.html',

    ////Add Customer Revision
    //ADMIN_ADD_CUSTOMER_REVISION_CONTROLLER: 'CustRevisionPopupController',
    //ADMIN_ADD_CUSTOMER_REVISION_VIEW: 'app/main/admin/customer/customer-part-number/add-customer-part-revision-popup.html',

    //add customer part number
    ADMIN_ADD_CUSTOMER_PART_NUMBER_CONTROLLER: 'CustPartNumberPopupController',
    ADMIN_ADD_CUSTOMER_PART_NUMBER_VIEW: 'app/main/admin/customer/customer-part-number/add-customer-part-number-popup.html',

    // delete MPN from CPN
    DELETE_MPN_CPN_MAPPING_CONTROLLER: 'RemoveMPNFROMCPNConfirmationPopupController',
    DELETE_MPN_CPN_MAPPING_VIEW: 'app/directives/custom/customer-cpn-parts/remove-mpn-from-cpn-mapping/remove-mpn-from-cpn-mapping-popup.html',

    DELETE_MPN_CONFIRMATION_CONTROLLER: 'RemoveMPNConfirmationController',
    DELETE_MPN_CONFIRMATION_VIEW: 'app/directives/custom/customer-cpn-parts/remove-mpn-confirmation-message/remove-mpn-confirmation-message.html',


    ////add customer part revision import
    //ADMIN_ADD_CUSTOMER_PART_NUMBER_IMPORT_CONTROLLER: 'CustPartNumberImportPopupController',
    //ADMIN_ADD_CUSTOMER_PART_NUMBER__IMPORT_VIEW: 'app/main/admin/customer/customer-part-number/customer-part-number-import.html',

    // ECO Category Values
    ADMIN_ECO_CATEGORY_VALUES_LABEL: 'ECO Category Values',
    ADMIN_ECO_CATEGORY_VALUES_ROUTE: '/eco/ecocategoryvalues/1',
    ADMIN_ECO_CATEGORY_VALUES_STATE: 'app.ecodfmattributes',
    ADMIN_ECO_CATEGORY_VALUES_CONTROLLER: 'ECOCategoryValuesController',
    ADMIN_ECO_CATEGORY_VALUES_VIEW: 'app/main/admin/eco/eco-category-values/eco-category-values.html',

    //Terms & Conditions Category Values
    ADMIN_RFQ_CATEGORY_VALUES_LABEL: 'Quote Terms & Condition Attributes',
    ADMIN_RFQ_CATEGORY_VALUES_ROUTE: '/rfqsetting/termsandconditions/attributes/2',
    ADMIN_RFQ_CATEGORY_VALUES_STATE: 'app.rfqattributes',

    ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_CONTROLLER: 'ECOCategoryValueAddUpdatePopupController',
    ADMIN_ECO_CATEGORY_VALUES_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/eco/eco-category-values/eco-category-value-add-update-popup.html',

    REQUIRE_ATTRIBUTE_SELECT_POPUP_CONTROLLER: 'RequireAttributeSelectPopupController',
    REQUIRE_ATTRIBUTE_SELECT_POPUP_VIEW: 'app/main/rfq-transaction/rfq/select-required-attribute-popup/select-required-attribute-popup.html',

    MANAGE_ODDLY_NAMED_REFDES_POPUP_CONTROLLER: 'ManageOddlyNamedRefDesController',
    MANAGE_ODDLY_NAMED_REFDES_POPUP_VIEW: 'app/main/rfq-transaction/bom/import-bom/manage-oddly-named-refdes/manage-oddly-named-refdes-popup.html',

    REQUIRE_ATTRIBUTE_SELECT_POPUP_ALERT_CONTROLLER: 'RequireAttributeAlertPopupController',
    REQUIRE_ATTRIBUTE_SELECT_POPUP_ALERT_VIEW: 'app/main/rfq-transaction/rfq/select-required-attribute-alert-popup/select-required-attribute-alert-popup.html',

    EXTERNAL_API_POPUP_CONTROLLER: 'ExternalApiConfigurationController',
    EXTERNAL_API_POPUP_VIEW: 'app/core/component/external-api-configuration-popup/external-api-configuration.html',

    CONFIGURE_RESTRICT_FILE_TYPE_POPUP_CONTROLLER: 'ConfigureRestrictedFileTypeController',
    CONFIGURE_RESTRICT_FILE_TYPE_POPUP_VIEW: 'app/core/component/configure-restrict-file-types/configure-restrict-file-types.html',

    ASSY_OPENING_STOCK_LIST_MODAL_CONTROLLER: 'AssyOpeningStockListPopupController',
    ASSY_OPENING_STOCK_LIST_MODAL_VIEW: 'app/main/admin/assembly-stock/assy-opening-stock-list-popup/assy-opening-stock-list-popup.html',

    // //Show Picture
    //// ADMIN_SHOW_PICTURE_POPUP_STATE: 'app.admin.showpicture',
    // ADMIN_SHOW_PICTURE_POPUP_CONTROLLER: 'showPictureController',
    // ADMIN_SHOW_PICTURE_POPUP_VIEW: 'app/main/admin/show-picture/show-picture-popup.html',

    /**
     * TEMPLATE URLS / VIEWS
     */
    IMAGE_CROP_VIEW: 'app/main/admin/user/image-crop/image-crop-modal-view-popup.html',

    /**
     * CONTROLLERS
     */
    NAVIGATION_CONTROLLER: 'NavigationController',
    IMAGE_CROP_CONTROLLER: 'ImageCropController',
    HEADER_CONTROLLER: 'HeaderController',
    /**
     * STRINGS
     */
    DRAG_DOCUMET: 'Drop document here or click to upload',
    DRAG_IMAGE_NAME: 'Drop image here or click to upload',
    DELETE_CONFIRM: 'Are you sure?',
    CONTROLLER_AS: 'vm',

    // PASSWORD_GENERATE: 'Please save your password for future reference',

    ADMIN_EMPLOYEE_PATH: 'employees',
    ADMIN_EQUIPMENT_PATH: 'equipment',
    ADMIN_MFGCODE_PATH: 'mfgcode',
    ADMIN_COUNTRY_PATH: 'countrymst',

    EMPLOYEE_BASE_PATH: 'uploads/emp/',
    EMPLOYEE_DEFAULT_IMAGE_PATH: 'default/image/employee/',
    OPERATION_BASE_PATH: 'uploads/operation/images/',
    EQUIPMENT_BASE_PATH: 'uploads/equip/',
    EQUIPMENT_DEFAULT_IMAGE_PATH: 'default/image/equipment/',
    COMPONENT_BASE_PATH: 'uploads/component/images/',
    COMPONENT_IMAGES_FOLDER_NAME: 'images/',
    COMPONENT_DATASHEET_FOLDER_NAME: 'datasheets/',
    COMPONENT_DEFAULT_IMAGE_PATH: 'default/image/component/',
    BOM_DEFAULT_IMAGE_PATH: 'default/image/bom/',
    EQUIPMENT_TASk_BASE_PATH: 'uploads/equipment_task/images/',
    GENERICFILE_BASE_PATH: 'uploads/genericfiles/',
    COUNTRY_BASE_PATH: 'uploads/country/images/',
    COMPANY_BASE_PATH: 'uploads/company/',
    COMPANY_DEFAULT_IMAGE: 'default/image/company/company-logo.png',
    COUNTRY_DEFAULT_IMAGE_PATH: 'default/image/country/',
    ROHS_BASE_PATH: 'uploads/rohs/images/',
    DYNAMIC_ATTRIBUTE_BASE_PATH: 'uploads/dynamicattribute/images/',
    COMPONENT_DATASHEET_BASE_PATH: 'datasheets/', //'uploads/component/datasheets/',
    CERTIFICATE_STANDARDS_BASE_PATH: 'uploads/cert_std/',
    //ADMIN_OTHERPERMISSION_LABEL: 'Other Permission',
    //ADMIN_OTHERPERMISSION_ROUTE: '/otherPermission',
    //ADMIN_OTHERPERMISSION_STATE: 'app.otherPermission',
    //ADMIN_OTHERPERMISSION_CONTROLLER: 'OtherPermissionController',
    //ADMIN_OTHERPERMISSION_VIEW: 'app/main/admin/other-permission/other-permission.html',
    //ADMIN_OTHERPERMISSION_UPDATE_MODAL_VIEW: 'app/main/admin/other-permission/other-permission-update-popup.html',
    //ADMIN_OTHERPERMISSION_UPDATE_MODAL_CONTROLLER: 'OtherPermissionUpdatePopupController',
    //ADMIN_OTHERPERMISSION_SELECT_ATLEASE_ONE_PERMISSION: 'Select at least one other permission.',

    ADMIN_DEFECT_LABEL: 'Defects',
    ADMIN_DEFECT_STATE: 'admin.users',
    ADMIN_DEFECT_ROUTE: '/users',
    ADMIN_DEFECT_CONTROLLER: '',
    ADMIN_DEFECT_VIEW: '',

    ADMIN_DEFECTCATEGORY_LABEL: 'Defect Category',
    ADMIN_DEFECTCATEGORY_ROUTE: '/defectCategory',
    ADMIN_DEFECTCATEGORY_STATE: 'app.defectCategory',
    ADMIN_DEFECTCATEGORY_CONTROLLER: 'DefectCategoryController',
    ADMIN_DEFECTCATEGORY_VIEW: 'app/main/admin/defect-category/defect-category.html',
    ADMIN_DEFECTCATEGORY_UPDATE_MODAL_VIEW: 'app/main/admin/defect-category/defect-category-update-popup.html',
    ADMIN_DEFECTCATEGORY_UPDATE_MODAL_CONTROLLER: 'DefectCategoryUpdatePopupController',
    ADMIN_DEFECTCATEGORY_SELECT_ATLEASE_ONE_PERMISSION: 'Select at least one defect category.',

    ADMIN_MANUFACTURER_LABEL: 'Manufacturer',
    ADMIN_MANUFACTURER_ROUTE: '/manufacturer',
    ADMIN_MANUFACTURER_STATE: 'app.manufacturer',
    ADMIN_MANUFACTURER_CONTROLLER: 'ManufacturerController',
    ADMIN_MANUFACTURER_VIEW: 'app/main/admin/component/manufacturer/manufacturer.html',

    ADMIN_WHO_ACQUIRED_WHO_LABEL: 'Who Acquired Who',
    ADMIN_WHO_ACQUIRED_WHO_ROUTE: '/whoacquiredwho',
    ADMIN_WHO_ACQUIRED_WHO_STATE: 'app.whoacquiredwho',
    ADMIN_WHO_ACQUIRED_WHO_CONTROLLER: 'WhoAcquiredWhoController',
    ADMIN_WHO_ACQUIRED_WHO_VIEW: 'app/main/admin/component/who-acquired-who/who-acquired-who.html',

    ADMIN_COMPONENT_LOGICAL_GROUP_LABEL: 'Component Logical Group',
    ADMIN_COMPONENT_LOGICAL_GROUP_ROUTE: '/mountinggroup',
    ADMIN_COMPONENT_LOGICAL_GROUP_STATE: 'app.componentLogicalGroup',
    ADMIN_COMPONENT_LOGICAL_GROUP_CONTROLLER: 'ComponentLogicalGroupController',
    ADMIN_COMPONENT_LOGICAL_GROUP_VIEW: 'app/main/admin/component/component-logical-group/component-logical-group.html',
    ADMIN_COMPONENT_LOGICAL_GROUP_ADD_UPDATE_MODAL_CONTROLLER: 'ManageComponentLogicalGroupPopupController',
    ADMIN_COMPONENT_LOGICAL_GROUP_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/component/component-logical-group/manage-component-logical-group-popup.html',

    ADMIN_ASSEMBLYSTOCK_LABEL: 'Assembly Stock',
    ADMIN_ASSEMBLYSTOCK_ROUTE: '/assemblyStock',
    ADMIN_ASSEMBLYSTOCK_STATE: 'app.assemblyStock',
    ADMIN_ASSEMBLYSTOCK_CONTROLLER: 'AssemblyStockController',
    ADMIN_ASSEMBLYSTOCK_VIEW: 'app/main/admin/assembly-stock/assembly-stock.html',
    ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_VIEW: 'app/main/admin/assembly-stock/assembly-stock-add-update-popup.html',
    ADMIN_ASSEMBLYSTOCK_UPDATE_MODAL_CONTROLLER: 'AssemblyStockAddUpdatePopupController',
    ADMIN_ASSEMBLYSTOCK_SELECT_ATLEASE_ONE_PERMISSION: 'Select at least one opening assembly stock.',

    ADMIN_UNIT_LABEL: 'Unit',
    ADMIN_UNIT_ROUTE: '/unit',
    ADMIN_UNIT_STATE: 'app.unit',
    ADMIN_UNIT_CONTROLLER: 'UnitController',
    ADMIN_UNIT_VIEW: 'app/main/admin/unit/unit.html',

    ADMIN_MEASUREMENT_TYPE_LABEL: 'Measurement Type',
    ADMIN_MEASUREMENT_TYPE_ROUTE: '/measurementtype',
    ADMIN_MEASUREMENT_TYPE_STATE: 'app.unit.measurementtype',
    ADMIN_MEASUREMENT_TYPE_CONTROLLER: 'MeasurementTypeController',
    ADMIN_MEASUREMENT_TYPE_VIEW: 'app/main/admin/unit/measurement-type/measurement-type.html',

    ADMIN_UNIT_OF_MEASUREMENT_LABEL: 'Unit Of Measurement',
    ADMIN_UNIT_OF_MEASUREMENT_ROUTE: '/unitofmeasurement',
    ADMIN_UNIT_OF_MEASUREMENT_STATE: 'app.unit.unitofmeasurement',
    ADMIN_UNIT_OF_MEASUREMENT_CONTROLLER: 'UnitOfMeasurementController',
    ADMIN_UNIT_OF_MEASUREMENT_VIEW: 'app/main/admin/unit/unit-of-measurement/unit-of-measurement.html',

    ADMIN_UNIT_CONVERSION_LABEL: 'Unit Conversion',
    ADMIN_UNIT_CONVERSION_ROUTE: '/unitconversion',
    ADMIN_UNIT_CONVERSION_STATE: 'app.unitconversion',
    ADMIN_UNIT_CONVERSION_CONTROLLER: 'UnitConversionController',
    ADMIN_UNIT_CONVERSION_VIEW: 'app/main/admin/unit-conversion/unit-conversion.html',

    ADMIN_JOB_TYPE_LABEL: 'Job type',
    ADMIN_JOB_TYPE_ROUTE: '/rfqsetting/jobtype',
    ADMIN_JOB_TYPE_STATE: 'app.jobtype',
    ADMIN_JOB_TYPE_CONTROLLER: 'JobTypeController',
    ADMIN_JOB_TYPE_VIEW: 'app/main/admin/rfq-setting/job-type/job-type.html',
    ADMIN_JOB_TYPE_ADD_UPDATE_MODAL_CONTROLLER: 'ManageJobTypesPopupController',
    ADMIN_JOB_TYPE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/job-type/manage-job-type-popup.html',

    ADMIN_QUOTE_DYNAMIC_FIELDS_LABEL: 'Quote Dynamic Fields',
    ADMIN_QUOTE_DYNAMIC_FIELDS_ROUTE: '/rfqsetting/rfq-quote-dynamic-fields/:type',
    ADMIN_QUOTE_DYNAMIC_FIELDS_STATE: 'app.quotedynamicfields',
    ADMIN_SUPPLIER_DYNAMIC_FIELDS_ROUTE: '/rfqsetting/supplier-quote-dynamic-fields/:type',
    ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE: 'app.supplierdynamicfields',
    ADMIN_QUOTE_DYNAMIC_FIELDS_CONTROLLER: 'QuoteDynamicFieldsController',
    ADMIN_QUOTE_DYNAMIC_FIELDS_VIEW: 'app/main/admin/rfq-setting/quote-dynamic-fields/quote-dynamic-fields.html',
    ADMIN_QUOTE_DYNAMIC_FIELDS_ADD_UPDATE_MODAL_CONTROLLER: 'ManageQuoteDynamicFieldsPopupController',
    ADMIN_QUOTE_DYNAMIC_FIELDS_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/quote-dynamic-fields/manage-quote-dynamic-fields-popup.html',

    ADMIN_COST_CATEGORY_LABEL: 'Cost Category',
    ADMIN_COST_CATEGORY_ROUTE: '/rfqsetting/cost-category',
    ADMIN_COST_CATEGORY_STATE: 'app.costcategory',
    ADMIN_COST_CATEGORY_CONTROLLER: 'CostCategoryController',
    ADMIN_COST_CATEGORY_VIEW: 'app/main/admin/rfq-setting/cost-category/cost-category.html',
    ADMIN_COST_CATEGORY_ADD_UPDATE_MODAL_CONTROLLER: 'ManageCostCategoryPopupController',
    ADMIN_COST_CATEGORY_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/cost-category/manage-cost-category-popup.html',

    ADMIN_RFQ_LINEITEMS_ERRORCODE_ROUTE: '/rfqsetting/rfqlineitemserrorcode',
    ADMIN_RFQ_LINEITEMS_ERRORCODE_STATE: 'app.rfqlineitemserrorcode',
    ADMIN_RFQ_LINEITEMS_ERRORCODE_CONTROLLER: 'RFQLineitemsErrorcodeController',
    ADMIN_RFQ_LINEITEMS_ERRORCODE_VIEW: 'app/main/admin/rfq-setting/rfq-lineitems-errorcode/rfq-lineitems-errorcode-list.html',
    ADMIN__RFQ_LINEITEMS_ERRORCODE_ADD_UPDATE_MODAL_CONTROLLER: 'ManageRFQLineitemsErrorcodePopupController',
    ADMIN__RFQ_LINEITEMS_ERRORCODE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/rfq-lineitems-errorcode/manage-rfq-lineitems-errorcode-popup.html',

    ADMIN_RFQ_TYPE_LABEL: 'Order type',
    ADMIN_RFQ_TYPE_ROUTE: '/rfqsetting/rfqtype',
    ADMIN_RFQ_TYPE_STATE: 'app.rfqtype',
    ADMIN_RFQ_TYPE_CONTROLLER: 'RfqTypeController',
    ADMIN_RFQ_TYPE_VIEW: 'app/main/admin/rfq-setting/rfq-type/rfq-type.html',
    ADMIN_RFQ_TYPE_ADD_UPDATE_MODAL_CONTROLLER: 'ManageRfqTypesPopupController',
    ADMIN_RFQ_TYPE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/rfq-type/manage-rfq-type-popup.html',

    ADMIN_REASON_LABEL: 'Reason',
    ADMIN_REASON_ROUTE: '/rfqsetting/reason',
    ADMIN_REASON_STATE: 'app.reason',
    ADMIN_REASON_CONTROLLER: 'ReasonController',
    ADMIN_REASON_VIEW: 'app/main/admin/rfq-setting/reason/reason.html',
    ADMIN_REASON_ADD_UPDATE_MODAL_CONTROLLER: 'ManageReasonPopupController',
    ADMIN_REASON_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/reason/manage-reason-popup.html',

    ADMIN_RFQ_REASON_LABEL: 'RFQ Reason',
    ADMIN_RFQ_REASON_ROUTE: '/rfq/:reasonId',
    ADMIN_RFQ_REASON_STATE: 'app.reason.rfq',
    ADMIN_RFQ_REASON_CONTROLLER: 'RFQReasonController',
    ADMIN_RFQ_REASON_VIEW: 'app/main/admin/rfq-setting/reason/rfq-reason/rfq-reason.html',

    ADMIN_BOM_REASON_LABEL: 'Bill Of Material Reason',
    ADMIN_BOM_REASON_ROUTE: '/bom/:reasonId',
    ADMIN_BOM_REASON_STATE: 'app.reason.billofmaterial',

    ADMIN_INVOICE_APPROVED_REASON_LABEL: 'Predefined Invoice Approval Reason',
    ADMIN_INVOICE_APPROVED_REASON_ROUTE: '/invoice/:reasonId',
    ADMIN_INVOICE_APPROVED_REASON_STATE: 'app.reason.invoiceapprovedreason',

    ADMIN_KIT_RELEASE_COMMENT_LABEL: 'Predefined Kit Release Comment',
    ADMIN_KIT_RELEASE_COMMENT_ROUTE: '/kitrelease/:reasonId',
    ADMIN_KIT_RELEASE_COMMENT_STATE: 'app.reason.kitreleasecomment',

    ADMIN_MOUNTING_TYPE_LABEL: 'Mounting Type',
    ADMIN_MOUNTING_TYPE_ROUTE: '/rfqsetting/mountingtype',
    ADMIN_MOUNTING_TYPE_STATE: 'app.mountingtype',
    ADMIN_MOUNTING_TYPE_CONTROLLER: 'MountingTypeController',
    ADMIN_MOUNTING_TYPE_VIEW: 'app/main/admin/rfq-setting/mounting-type/mounting-type.html',
    ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER: 'ManageMountingTypePopupController',
    ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/mounting-type/manage-mounting-type-popup.html',

    ADMIN_PACKAGE_CASE_TYPE_LABEL: 'Package/Case(Shape) Type',
    ADMIN_PACKAGE_CASE_TYPE_ROUTE: '/rfqsetting/packagecasetype',
    ADMIN_PACKAGE_CASE_TYPE_STATE: 'app.packagecasetype',
    ADMIN_PACKAGE_CASE_TYPE_CONTROLLER: 'PackageCaseTypeController',
    ADMIN_PACKAGE_CASE_TYPE_VIEW: 'app/main/admin/rfq-setting/package-case-type/package-case-type.html',
    ADMIN_MANAGE_PACKAGE_CASE_TYPE_MODAL_CONTROLLER: 'ManagePackageCaseTypePopupController',
    ADMIN_MANAGE_PACKAGE_CASE_TYPE_MODAL_VIEW: 'app/main/admin/rfq-setting/package-case-type/manage-package-case-type-popup.html',

    ADMIN_CONNECTER_TYPE_LABEL: 'Connector Type',
    ADMIN_CONNECTER_TYPE_ROUTE: '/rfqsetting/connectertype',
    ADMIN_CONNECTER_TYPE_STATE: 'app.connectertype',
    ADMIN_CONNECTER_TYPE_CONTROLLER: 'ConnecterTypeController',
    ADMIN_CONNECTER_TYPE_VIEW: 'app/main/admin/rfq-setting/connecter-type/connecter-type.html',
    ADMIN_CONNECTER_TYPE_ADD_UPDATE_MODAL_CONTROLLER: 'ManageConnecterTypePopupController',
    ADMIN_CONNECTER_TYPE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/connecter-type/manage-connecter-type-popup.html',

    ADMIN_ROHS_LABEL: 'RoHS',
    ADMIN_ROHS_ROUTE: '/rfqsetting/rohs',
    ADMIN_ROHS_STATE: 'app.rohs',
    ADMIN_ROHS_CONTROLLER: 'RohsController',
    ADMIN_ROHS_VIEW: 'app/main/admin/rfq-setting/rohs/rohs.html',

    ADMIN_PART_TYPE_LABEL: 'Part Types',
    ADMIN_PART_TYPE_ROUTE: '/rfqsetting/parttype',
    ADMIN_PART_TYPE_STATE: 'app.rfqparttype',
    ADMIN_PART_TYPE_CONTROLLER: 'PartTypeController',
    ADMIN_PART_TYPE_VIEW: 'app/main/admin/rfq-setting/part-type/part-type.html',
    ADMIN_PART_TYPE_ADD_UPDATE_MODAL_CONTROLLER: 'ManagePartTypePopupController',
    ADMIN_PART_TYPE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/part-type/manage-part-type-popup.html',

    ADMIN_ADDITIONAL_REQUIREMENT_LABEL: 'Additional Requirement',
    ADMIN_ADDITIONAL_REQUIREMENT_ROUTE: '/rfqsetting/additionalrequirement',
    ADMIN_ADDITIONAL_REQUIREMENT_STATE: 'app.additionalrequirement',
    ADMIN_ADDITIONAL_REQUIREMENT_CONTROLLER: 'AdditionalRequirementController',
    ADMIN_ADDITIONAL_REQUIREMENT_VIEW: 'app/main/admin/rfq-setting/additional-requirement/additional-requirement.html',
    ADMIN_ADDITIONAL_REQUIREMENT_ADD_UPDATE_MODAL_CONTROLLER: 'ManageAdditionalRequirementPopupController',
    ADMIN_ADDITIONAL_REQUIREMENT_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/additional-requirement/manage-additional-requirement-popup.html',


    ADMIN_PACKAGING_TYPE_LABEL: 'Packaging Type',
    ADMIN_PACKAGING_TYPE_ROUTE: '/rfqsetting/packagingtype',
    ADMIN_PACKAGING_TYPE_STATE: 'app.packagingtype',
    ADMIN_PACKAGING_TYPE_CONTROLLER: 'PackagingTypeController',
    ADMIN_PACKAGING_TYPE_VIEW: 'app/main/admin/rfq-setting/packaging-type/packaging-type.html',
    ADMIN_PACKAGING_TYPE_ADD_UPDATE_MODAL_CONTROLLER: 'ManagePackagingTypePopupController',
    ADMIN_PACKAGING_TYPE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/packaging-type/manage-packaging-type-popup.html',

    ADMIN_NARRATIVE_MASTER_TEMPLATE_LABEL: 'Narrative Master Templates',
    ADMIN_NARRATIVE_MASTER_TEMPLATE_STATE: 'app.narrativemaster',
    ADMIN_NARRATIVE_MASTER_TEMPLATE_ROUTE: '/narrativemaster',
    ADMIN_NARRATIVE_MASTER_TEMPLATE_VIEW: 'app/main/admin/rfq-setting/additional-requirement/additional-requirement.html',
    ADMIN_NARRATIVE_MASTER_TEMPLATE_CONTROLLER: 'AdditionalRequirementController',

    ADMIN_PART_STATUS_LABEL: 'Part Status',
    ADMIN_PART_STATUS_ROUTE: '/rfqsetting/partstatus',
    ADMIN_PART_STATUS_STATE: 'app.partstatus',
    ADMIN_PART_STATUS_CONTROLLER: 'PartStatusController',
    ADMIN_PART_STATUS_VIEW: 'app/main/admin/rfq-setting/part-status/part-status.html',
    ADMIN_PART_STATUS_ADD_UPDATE_MODAL_CONTROLLER: 'ManagePartStatusPopupController',
    ADMIN_PART_STATUS_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/part-status/manage-part-status-popup.html',

    ADMIN_PART_DYNAMIC_ATTRIBUTE_LABEL: 'Part Operational Attribute',
    ADMIN_PART_DYNAMIC_ATTRIBUTE_ROUTE: '/rfqsetting/partdynamicattribute',
    ADMIN_PART_DYNAMIC_ATTRIBUTE_STATE: 'app.partdynamicattribute',
    ADMIN_PART_DYNAMIC_ATTRIBUTE_CONTROLLER: 'PartDynamicAttributeController',
    ADMIN_PART_DYNAMIC_ATTRIBUTE_VIEW: 'app/main/admin/rfq-setting/part-dynamic-attribute/part-dynamic-attribute.html',
    ADMIN_PART_DYNAMIC_ATTRIBUTE_ADD_UPDATE_MODAL_CONTROLLER: 'ManagePartDynamicAttributePopupController',
    ADMIN_PART_DYNAMIC_ATTRIBUTE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/part-dynamic-attribute/manage-part-dynamic-attribute-popup.html',

    //ADMIN_UNIT_LABEL: 'Unit',
    //ADMIN_UNIT_ROUTE: '/unit',
    //ADMIN_UNIT_STATE: 'app.unit',
    //ADMIN_UNIT_CONTROLLER: 'UnitController',
    //ADMIN_UNIT_VIEW: 'app/main/admin/unit/unit.html',

    ADMIN_DEFECTCATEGORY_ADD_MODAL_CONTROLLER: 'AddDefectCategoryPopupController',
    ADMIN_DEFECTCATEGORY_ADD_MODAL_VIEW: 'app/main/admin/defect-category/add-defect-category-popup.html',

    //ADMIN_EMPLOYEE_DOCUMENT_CONTROLLER: 'EmployeeDocumentController',
    //ADMIN_EMPLOYEE_DOCUMENT_VIEW: 'app/main/admin/employee/employee-document.html',

    /*
     Author :  Azzim Kazzi
     Development Date : 12/24/19
     Constant for the labor cost template list page
     */
    ADMIN_LABOR_COST_TEMPLATE_LABEL: 'Labor cost template',
    ADMIN_LABOR_COST_TEMPLATE_ROUTE: '/laborcosttemplate',
    ADMIN_LABOR_COST_TEMPLATE_STATE: 'app.laborcosttemplate',
    ADMIN_LABOR_COST_TEMPLATE_CONTROLLER: 'LaborCostTemplateController',
    ADMIN_LABOR_COST_TEMPLATE_VIEW: 'app/main/admin/rfq-setting/labor-cost-template/labor-cost-template.html',

    /*
    Author :  Azzim Kazzi
    Development Date : 12/24/19
    Constant for the labor cost template Add/Edit page
    */
    ADMIN_MANAGE_LABOR_COST_TEMPLATE_LABEL: 'Labor cost template',
    ADMIN_MANAGE_LABOR_COST_TEMPLATE_ROUTE: '/managelaborcosttemplate/:id',
    ADMIN_MANAGE_LABOR_COST_TEMPLATE_STATE: 'app.laborcosttemplate.managelaborcosttemplate',
    ADMIN_MANAGE_LABOR_COST_TEMPLATE_CONTROLLER: 'ManageLaborCostTemplateController',
    ADMIN_MANAGE_LABOR_COST_TEMPLATE_VIEW: 'app/main/admin/rfq-setting/labor-cost-template/manage-labor-cost-template.html',

    /*
    Author :  Azzim Kazzi
    Development Date : 12/24/19
    Constant for the open import field mapping popup
    */
    FIELD_MAPPING_CONTROLLER: 'ImportLaborCostPopupController',
    FIELD_MAPPING_VIEW: 'app/main/admin/rfq-setting/import-labor-cost-detail-popup/import-labor-cost-detail-popup.html',

    ADMIN_EMPTYSTATE: {
      EMPLOYEE: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        MESSAGE: 'No personnel is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an personnel'
      },
      RELEASENOTES: {
        IMAGEURL: 'assets/images/emptystate/release-note.png',
        MESSAGE: 'No Release Note is listed yet!',
        ADDNEWMESSAGE: 'Click on the below icon to add release note'
      },
      CUSTOMER: {
        IMAGEURL: 'assets/images/emptystate/customer-empty.png',
        MESSAGE: 'No customer is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a customer',
        NOT_SELECTED_CUST_MASSAGE: 'Please select at least one customer',
        NOT_SELECTED_MASSAGE: 'Please select Customer.'
      },
      SUPPLIER: {
        IMAGEURL: 'assets/images/emptystate/supplier.png',
        MESSAGE: 'No supplier is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a supplier',
        NOT_SELECTED_MASSAGE: 'Please select Supplier.'
      },
      //OTHER_PERMISSION: {
      //    IMAGEURL: 'assets/images/emptystate/permission.png',
      //    MESSAGE: 'No other permission is listed yet!',
      //    ADDNEWMESSAGE: 'Click below to add an other permission'
      //},
      ROLE: {
        IMAGEURL: 'assets/images/emptystate/role.png',
        TIMEOUTIMAGEURL: 'assets/images/emptystate/role-login.png',
        MESSAGE: 'No role is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a role'
      },
      VERIFY_USER: {
        IMAGEURL: 'assets/images/emptystate/unauthorise.png'
      },
      USERSELECTEDROLE: {
        IMAGEURL: 'assets/images/emptystate/role.png',
        MESSAGE: 'Please select role to set user permission'
      },
      USER: {
        IMAGEURL: 'assets/images/emptystate/user.png',
        MESSAGE: 'No user is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an user'
      },
      CUSTOMERBILLINGADDRESS: {
        IMAGEURL: 'assets/images/emptystate/billing-address.png',
        MESSAGE: 'Billing address does not exists!',
        ADDNEWMESSAGE: 'Click below to add a billing address',
        NOSELECTIONMESSAGE: 'No Billing address is selected yet!'
      },
      CUSTOMERSHIPPINGADDRESS: {
        IMAGEURL: 'assets/images/emptystate/shipping-address.png',
        MESSAGE: 'Shipping address does not exists!',
        ADDNEWMESSAGE: 'Click below to add a shipping address',
        NOSELECTIONMESSAGE: 'No Shipping address is selected yet!'
      },
      CUSTOMER_CONTACTPERSON: {
        IMAGEURL: 'assets/images/emptystate/contactinfo.png',
        MESSAGE: 'Contact Person does not exists!',
        ADDNEWMESSAGE: 'Click below to add contact person information',
        NOSELECTIONMESSAGE: 'No contact person is selected yet!'
      },
      CUSTOMER_ASSEMBLY_STOCK: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'No customer assembly stock is listed yet!'
      },
      CERTIFICATE_STANDARD: {
        IMAGEURL: 'assets/images/emptystate/standard.png',
        MESSAGE: 'No standard is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a standard'
      },
      CATEGORY_TYPE: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'No Category type is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a category type'
      },
      DEPARTMENT: {
        IMAGEURL: 'assets/images/emptystate/department-list.png',
        MESSAGE: 'No department is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a department'
      },
      EQUIPMENT: {
        IMAGEURL: 'assets/images/emptystate/Equipment and workstations master.png',
        MESSAGE: 'No Equipment, Workstation & Sample is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an Equipment, Workstation & Sample'
      },
      SAMPLES: {
        IMAGEURL: 'assets/images/emptystate/Equipment and workstations master.png',
        MESSAGE: 'No Sample is listed yet!',
        ADDNEWMESSAGE: 'Click below to refresh Sample'
      },
      EQUIPMENT_WORKSTATION_DYNAMIC: {
        IMAGEURL: 'assets/images/emptystate/equipment.png',
        MESSAGE: 'No {0} is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an {0}'
      },
      ASSIGN_EMPLOYEE_WORKSTATION_DRAGDROP: {
        IMAGEURL: 'assets/images/emptystate/equipment.png',
        MESSAGE: 'No workstation are assigned.',
        ALL_ASSIGNED: 'All workstation are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGN_OPERATION_EMPLOYEE_DRAGDROP: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        MESSAGE: 'No operations are assigned.',
        ALL_ASSIGNED: 'All operations are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      GENERICCATEGORY: {
        IMAGEURL: 'assets/images/emptystate/{0}',
        MESSAGE: 'No {0} is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a {0}'
      },
      LABELTEMPLATES: {
        IMAGEURL: 'assets/images/emptystate/label_templates.png',
        MESSAGE: 'No label templates is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a label templates'
      },
      GEOLOCATION: {
        IMAGEURL: 'assets/images/emptystate/geolocations.png',
        MESSAGE: 'No Geolocations are assigned.',
        ADDNEWMESSAGE: 'Click below to add a Geolocations',
        MESSAGELIST: 'No Geolocations is listed yet!',
        ALL_ASSIGNED: 'All Geolocations are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNFILEDS: {
        IMAGEURL: 'assets/images/emptystate/manageelement.png',
        MESSAGE: 'No data fields are assigned.',
        ALL_ASSIGNED: 'All data fields are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        ADDNEWMESSAGE: 'Click below to add elements'
      },
      PRICING_HISTROY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No pricing histroy listed yet.'
      },
      EQUIPMENT_SCHEDULE_TASK: {
        IMAGEURL: 'assets/images/emptystate/part.png',
        MESSAGE: 'No schedule task is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a schedule task.'
      },
      STANDARD_MESSAGE: {
        IMAGEURL: 'assets/images/emptystate/standard-message.png',
        MESSAGE: 'No message is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a message.'
      },
      FILE_UPLOAD: {
        IMAGEURL: 'assets/images/emptystate/document.png',
        MESSAGE: 'No documents are uploaded yet!'
      },
      DEFECT_CATEGORY: {
        IMAGEURL: 'assets/images/emptystate/defect-category.png',
        MESSAGE: 'No defect category is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a defect category'
      },
      ASSEMBLY_STOCK: {
        IMAGEURL: 'assets/images/emptystate/stock.png',
        MESSAGE: 'No initial stock is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an initial stock'
      },
      ECO_CATEGORY: {
        IMAGEURL: 'assets/images/emptystate/ECO-category.png',
        MESSAGE: 'No ECO category is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an ECO category'
      },
      ECO_CATEGORY_VALUES: {
        IMAGEURL: 'assets/images/emptystate/ECO-category-values.png',
        MESSAGE: 'No ECO category attribute is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an ECO category attribute'
      },
      QUOTE_TERMS_CONDITIONS_CATEGORY: {
        IMAGEURL: 'assets/images/emptystate/ECO-category.png',
        MESSAGE: 'No Quote terms & conditions category is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an Quote terms & conditions category'
      },
      QUOTE_TERMS_CONDITIONS_CATEGORY_VALUES: {
        IMAGEURL: 'assets/images/emptystate/ECO-category-values.png',
        MESSAGE: 'No Quote terms & conditions category attribute is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an Quote terms & conditions category attribute'
      },
      STANDARD_CLASS: {
        IMAGEURL: 'assets/images/emptystate/Standard-class.png',
        MESSAGE: 'No standard category value is listed yet!',
        ADDNEWMESSAGE: 'Click below to add standard category values'
      },
      PAGE_DETAIL: {
        IMAGEURL: 'assets/images/emptystate/page-list.png',
        MESSAGE: 'No page is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a page',
        NOTSELECTEDROLEMASSAGE: 'Please select at least one role',
        PAGE_SUMMARY_MESSAGE: 'No pages are assigned yet!'
      },
      PAGE_RIGHT: {
        ROLE_IMAGEURL: 'assets/images/emptystate/role.png',
        ROLE_MESSAGE: 'No role is selected yet!',
        USER_IMAGEURL: 'assets/images/emptystate/user.png',
        USER_MESSAGE: 'No user is selected yet!'
      },
      COMPONENT: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE_ON_LOAD: 'Select filter(s) and press APPLY FILTERS to retrieve selective part list or press APPLY FILTERS to retrieve full part list.',
        MESSAGE: 'No result matching your search criteria!',
        ADDNEWMESSAGE: 'Click below to add a part'
      },
      SUPPLIER_COMPONENT: {
        IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        MESSAGE_ON_LOAD: 'Select filter(s) and press APPLY FILTERS to retrieve selective part list or press APPLY FILTERS to retrieve full part list.',
        MESSAGE: 'No result matching your search criteria!',
        ADDNEWMESSAGE: 'Click below to add a part'
      },
      COMPONENT_TEMPERATURE: {
        IMAGEURL: 'assets/images/etc/tmax.png',
        MESSAGE: 'No temperature sensitive data are listed yet!',
        ADDNEWMESSAGE: 'Click below to add a temperature sensitive data',
        TOOLTIPMESSAGE: 'Tmax {0}°C ({1} Second)',
        TOOLTIPMESSAGE_FOR_YELLOW_ICON: 'Tmax is not defined.'
      },
      COMPONENT_FILTERS: {
        MESSAGE: 'No result matching your search criteria.'
      },
      COMPONENT_SUPPLIER_API_RESPONSE: {

        MFR_PART_IMAGEURL: 'assets/images/emptystate/part-master.png',
        SUPPLIER_PART_IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        // IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        MESSAGE_ON_LOAD: 'Click appropriate supplier\'s API call button to view results. This is for investigation purpose only.',
        MESSAGE: 'Details are not available on selected supplier!'
      },
      ASSEMBLYTYPE: {
        IMAGEURL: 'assets/images/emptystate/assembly.png',
        MESSAGE: 'No assembly type is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an assembly type'
      },
      MFG: {
        MESSAGE: 'No Alias is assigned yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        SEARCH_IMAGE_URL: 'assets/images/emptystate/grid-empty.png'
      },
      MANUFACTURER: {
        IMAGEURL: 'assets/images/emptystate/manufacturer.png',
        MESSAGE: 'No manufacturer is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a manufacturer'
      },
      WHO_ACQUIRED_WHO: {
        IMAGEURL: 'assets/images/emptystate/Who-acquired.png',
        MESSAGE: 'No Mergers & Acquisitions is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Mergers & Acquisitions'
      },
      MEASUREMENT_TYPES: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'No measurement type is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a measurement type'
      },
      BARCODE_LABEL_TEMPLATE: {
        IMAGEURL: 'assets/images/emptystate/barcode.png',
        MESSAGE: 'No barcode template is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a barcode template'
      },
      UNIT_OF_MEASUREMENT: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'No unit of measurement is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a unit of measurement',
        SELECTTYPEMESSAGE: 'Select any measurement type'
      },
      JOB_TYPE: {
        IMAGEURL: 'assets/images/emptystate/job-type.png',
        MESSAGE: 'No Job Type is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Job type'
      },
      RRQ_LINEITEMS_ERRORCODE: {
        IMAGEURL: 'assets/images/emptystate/error-code.png',
        MESSAGE: 'No Error code is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Error Code',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      RFQ_TYPE: {
        IMAGEURL: 'assets/images/emptystate/order-type.png',
        MESSAGE: 'No Rfq Type is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Rfq type'
      },
      ADDITIONAL_REQUIREMENT: {
        IMAGEURL: 'assets/images/emptystate/additional-requirement.png',
        NARRATIVE_IMAGEURL: 'assets/images/emptystate/narrative-master-templates.png',
        MESSAGE: 'No {0} is listed yet!',
        ADDNEWMESSAGE: 'Click below to add {0}',
        MESSAGE_ASSEMBLY: 'No Assembly Requirement Template is listed yet!',
        MESSAGE_CUST_QUOTE: 'No Customer Quote Requirement Template is listed yet!',
        MESSAGE_NARR_MASTER: 'No Narrative Master Template is listed yet!',
        ADDNEWMESSAGE_ASSEMBLY: 'Click below to add Assembly Requirement Template',
        ADDNEWMESSAGE_CUST_QUOTE: 'Click below to add Customer Quote Requirement Template',
        ADDNEWMESSAGE_NARR_MASTER: 'Click below to add Narrative Master Template'
      },
      REASON: {
        IMAGEURL: 'assets/images/emptystate/Reason-icon.png',
        MESSAGE: 'No RFQ Reason is listed yet!',
        ADDNEWMESSAGE: 'Click below to add RFQ Reason'
      },
      BOM_REASON: {
        IMAGEURL: 'assets/images/emptystate/Reason-icon.png',
        MESSAGE: 'No Bill Of Material Approval Reason is listed yet!',
        ADDNEWMESSAGE: 'Click below to add bill of material approval Reason',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      INVOICE_APPROVE: {
        IMAGEURL: 'assets/images/emptystate/Reason-icon.png',
        MESSAGE: 'No Predefined Invoice Approval Reason is listed yet!',
        ADDNEWMESSAGE: 'Click below to add predefined invoice approval reason',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      MOUNTING_TYPE: {
        IMAGEURL: 'assets/images/emptystate/mounting-type.png',
        MESSAGE: 'Mounting type does not exist.',
        ADDNEWMESSAGE: 'Click below to add  Mounting Type'
      },
      PACKAGE_CASE_TYPE: {
        IMAGEURL: 'assets/images/emptystate/package-case.png',
        MESSAGE: 'No package/case(shape) type listed yet!',
        ADDNEWMESSAGE: 'Click below to add package/case(shape) type'
      },
      UNIT_DETAIL_FORMULA: {
        IMAGEURL: 'assets/images/emptystate/unit-formula.png',
        MESSAGE: 'No unit formula is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a unit formula'
      },
      COMPONANT_CUST_ALIAS_REV: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'No CPN (Component) is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a component alias rev.'
      },
      COMMENTS: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No comments are listed yet!',
        ADDNEWMESSAGE: 'Click below to add a comment'
      },
      COMPONANT_CUST_ALIAS_REV_PN: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'No customer MFR PN mapping  is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a component alias rev.'
      },
      DYNAMIC_MESSAGE: {
        IMAGEURL: 'assets/images/emptystate/message-list.png',
        MESSAGE: 'No message listed yet!'
      },
      DYNAMIC_MESSAGE_WHERE_USED: {
        IMAGEURL: 'assets/images/emptystate/massage_where_used.png',
        MESSAGE: 'Where used details not listed yet!'
      },
      PART_TYPE: {
        IMAGEURL: 'assets/images/emptystate/functional-type.png',
        MESSAGE: 'Functional type does not exist.',
        ADDNEWMESSAGE: 'Click below to add Functional type'
      },
      RFQ_SPECIFIC_PART_REQUIREMENTS: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'Specific Requirements & Comments (functional type and mounting Type) does not exist.',
        ADDNEWMESSAGE: 'Click below to add specific Requirements & Comments'
      },

      PACKAGING_TYPE: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'Packaging type does not exist.',
        ADDNEWMESSAGE: 'Click below to add Packaging type'
      },

      KEYWORD: {
        IMAGEURL: 'assets/images/emptystate/keyword.png',
        MESSAGE: 'No Keyword is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Keyword'
      },
      CUSTOMER_CONFIRMATION: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No Description to display!'
      },
      IMPORT_FIELDS: {
        IMAGEURL: 'assets/images/emptystate/document.png',
        MESSAGE: 'Click on "Upload Data" to Import Excel'
      },
      QUOTE_DYNAMIC_FIELDS: {
        IMAGEURL: 'assets/images/emptystate/quote-dynamic-field.png',
        MESSAGE: 'RFQ quote attribute does not exist.',
        ADDNEWMESSAGE: 'Click below to add RFQ quote attribute'
      },
      SUPPLIER_QUOTE_DYNAMIC_FIELDS: {
        IMAGEURL: 'assets/images/emptystate/quote-dynamic-field.png',
        MESSAGE: 'Supplier quote attribute does not exist.',
        ADDNEWMESSAGE: 'Click below to add Supplier quote attribute'
      },
      SUPPLIER_QUOTES: {
        IMAGEURL: 'assets/images/emptystate/supplier-quote.png',
        MESSAGE: 'Supplier quote does not exist.',
        ADDNEWMESSAGE: 'Click below to add Supplier quote'
      },
      COST_CATEGORY: {
        IMAGEURL: 'assets/images/emptystate/cost-category.png',
        MESSAGE: 'Cost category does not exist.',
        ADDNEWMESSAGE: 'Click below to add Cost Category'
      },
      ASSIGN_DEPARTMENT: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'No department assigned yet!',
        ADDNEWMESSAGE: 'Click below to assign a department'
      },
      ERRORLOGS: {
        IMAGEURL: 'assets/images/emptystate/grid-empty.png',
        MESSAGE: 'No error logs found!'
      },
      SUPPLIERLIMITS: {
        IMAGEURL: 'assets/images/emptystate/supplier-limit.png',
        MESSAGE: 'No supplier limit details found!'
      },
      COUNTRY: {
        IMAGEURL: 'assets/images/emptystate/country-list.png',
        MESSAGE: 'No country is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a country'
      },
      COMPONENT_CUSTOMER_LOA: {
        IMAGEURL: 'assets/images/emptystate/document.png',
        MESSAGE: 'No {0} LOA listed are yet!',
        SELECT_MESSAGE: 'Select any {0} for view LOA',
        ADDNEWMESSAGE: 'Click below to add {0} LOA'
      },
      COMPONENT_PRICEBREAK: {
        IMAGEURL: 'assets/images/emptystate/document.png',
        MESSAGE: 'No {0} LOA listed are yet!',
        SELECT_MESSAGE: 'Select any {0} for view LOA',
        ADDNEWMESSAGE: 'Click below to add {0} LOA'
      },
      CONNECTER_TYPE: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'Connector type does not exist.',
        ADDNEWMESSAGE: 'Click below to add  Connector Type'
      },
      FEATURE: {
        IMAGEURL: 'assets/images/emptystate/manageelement.png',
        MESSAGE: 'No feature is listed yet!',
        ADDNEWMESSAGE: 'Click below to add feature',
        NOTSELECTEDROLEMASSAGE: 'Please select at least one role',
        FEATURE_SUMMARY_MESSAGE: 'No features are assigned yet!'
      },
      WAREHOUSE: {
        IMAGEURL: 'assets/images/emptystate/warehouse.png',
        MESSAGE: 'No warehouse is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Warehouse',
        NOTSELECTEDROLEMASSAGE: 'Please select at least one Warehouse'
      },
      BIN: {
        IMAGEURL: 'assets/images/emptystate/bin.png',
        MESSAGE: 'No bin is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Bin',
        NOTSELECTEDROLEMASSAGE: 'Please select at least one Bin'
      },
      RACK: {
        IMAGEURL: 'assets/images/emptystate/rack.png',
        MESSAGE: 'No rack is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Rack'
      },
      WAREHOUSE_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'Warehouse transaction history not found!'
      },
      BIN_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/history.png',
        MESSAGE: 'Bin transaction history not found!'
      },
      COMPONENT_CPN: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part not belong to any CPN (Component) yet!'
      },
      COMPONENT_PACKAGINGPART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part not belong to any packaging alias parts yet!'
      },
      COMPONENT_ALTERNATE_PART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any Alternate Parts yet!'
      },
      COMPONENT_ROHS_REPLACEMENT_PART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any RoHS Replacement Parts yet!'
      },
      COMPONENT_PROCESS_MATERIAL_PART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any Process Material Parts yet!'
      },
      COMPONENT_REQUIRE_MATING_PART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any Require Mating Parts yet!'
      },
      COMPONENT_PICKUP_PAD_PART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any Pickup Pad Parts yet!'
      },
      COMPONENT_PROGRAM_PART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any Program Parts yet!'
      },
      COMPONENT_REQUIRE_FUNCTIONAL_TESTING_PART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any Require Functional Testing Parts yet!'
      },
      COMPONENT_FUNCTIONAL_TESTING_FUNCTIONAL_PART: {
        IMAGEURL: 'assets/images/emptystate/equipment.png',
        MESSAGE: 'Part does not have any Functional Testing Equipment yet!'
      },
      COMPONENT_POSSIBLE_ALTERNATEPART: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part does not have any Possible Alternate Parts yet!'
      },
      MOUNTING_GROUP: {
        IMAGEURL: 'assets/images/emptystate/mounting-group.png',
        MESSAGE: 'No mounting group is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Mounting Group',
        NOTSELECTEDROLEMASSAGE: 'Please select at least one Mounting Group'
      },
      MATERIAL_RECEIVE: {
        IMAGEURL: 'assets/images/emptystate/material_receive.png',
        MESSAGE: 'No packing slip is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a packing slip.',
        REFRESHMESSAGE: 'Click below to refresh packing slip',
        HISTORYIMAGEURL: 'assets/images/emptystate/shipped-list.png',
        HISTORYMESSAGE: 'No material receipt history listed yet!'
      },
      SUPPLIER_INVOICE: {
        IMAGEURL: 'assets/images/emptystate/invoice_verification.png',
        // MESSAGE: 'There is no any pending {0} for supplier invoice.',
        MESSAGE: 'No {0} is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a {0}.',
        REFRESHMESSAGE: 'Click below to refresh {0}',
        REGETMESSAGE: 'Press REGET INVOICE DETAILS button to get updated list of invoice details',
        REGETMESSAGEFORCREDITMEMO: 'Press REGET CREDIT MEMO DETAILS button to get updated list of credit memo details',
        HISTORYIMAGEURL: 'assets/images/emptystate/shipped-list.png',
        HISTORYMESSAGE: 'No {0} history listed yet!'
      },
      SUPPLIER_QUOTE: {
        IMAGEURL: 'assets/images/emptystate/RFQ-list.png',
        MESSAGE: 'No Supplier Quote is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a Supplier Quote'
      },
      TRACK_NUMBER: {
        MESSAGE: 'No tracking number is listed yet!'
      },
      EXTERNAL_ATTRIBUTE_VALUE: {
        MESSAGE: 'Please select attribute to get external attribute values.'
      },
      COMPONENT_WHERE_USED: {
        MFR_PART_IMAGEURL: 'assets/images/emptystate/part-master.png',
        SUPPLIER_PART_IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        MESSAGE: 'Part not used in any assembly yet!'
      },
      COMPONENT_WHERE_USED_OTHER: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part not used in any other part yet!'
      },
      COMPONENT_SUPPLIER_PART: {
        MFR_PART_IMAGEURL: 'assets/images/emptystate/part-master.png',
        SUPPLIER_PART_IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        MESSAGE: 'Part does not have any Supplier Parts yet!'
      },
      COMPONENT_ASSEMBLY_PART: {
        MFR_PART_IMAGEURL: 'assets/images/emptystate/part-master.png',
        SUPPLIER_PART_IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        MESSAGE: 'Part does not have any Assembly Revision Parts yet!'
      },
      COMPONENT_DRIVE_TOOLS: {
        IMAGEURL: 'assets/images/emptystate/drive-tools.png',
        MESSAGE: 'Drive tools for this part not added yet!'
      },
      COMPONENT_CORRECT_PART: {
        MFR_PART_IMAGEURL: 'assets/images/emptystate/part-master.png',
        SUPPLIER_PART_IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        MESSAGE: 'Part does not have any Mapped Correct Parts yet!'
      },
      COMPONENT_INCORRECT_PART: {
        MFR_PART_IMAGEURL: 'assets/images/emptystate/part-master.png',
        SUPPLIER_PART_IMAGEURL: 'assets/images/emptystate/supplier-part-master.png',
        MESSAGE: 'Part does not have any Mapped Incorrect Parts yet!'
      },
      RESERVE_STOCK_REQUEST: {
        IMAGEURL: 'assets/images/emptystate/receiving-material.png',
        MESSAGE: 'No request is received for reserve stock yet!',
        ADDNEWMESSAGE: 'Click below to add a request for reserve stock.'
      },
      PREDEFINED_CHAT_MESSAGE: {
        IMAGEURL: 'assets/images/emptystate/standard-message.png',
        MESSAGE: 'No predefined chat message is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a chat message.'
      },
      DOCUMENT_DRAG_UPLOAD: {
        IMAGEURL: 'assets/images/emptystate/document.png',
        MESSAGE: 'Drop {0} here <br/> or use the "Upload {0}" button.',
        NO_ANY_DOC_MESSAGE: 'No {0} are uploaded yet!',
        DOCUMENT_ALLOW_FORMAT_MSG: 'Only {0} format video allowed.'
      },
      SCANNER: {
        IMAGEURL: 'assets/images/emptystate/scanner-icon.png',
        MESSAGE: 'No scanner is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a Scanner'
      },
      EMAIL_REPORT_SETTING: {
        IMAGEURL: 'assets/images/emptystate/email-setting.png',
        MESSAGE: 'No E-mail report settings are listed yet!',
        MESSAGE_FOR_NON_COMPANY: 'E-mail report settings are only for company!',
        ADDNEWMESSAGE: 'Click below to add a E-mail report setting'
      },
      COMPONENT_KIT_ALLOCATION: {
        IMAGEURL: 'assets/images/emptystate/part-master.png',
        MESSAGE: 'Part is not allocated to any kit yet!'
      },
      ALIAS_PARTS_VALIDATION: {
        IMAGEURL: 'assets/images/emptystate/validation.png',
        MESSAGE: 'No part alias validations is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a Part Alias Validations'
      },
      PRICE_BREAK: {
        IMAGEURL: 'assets/images/emptystate/validation.png',
        MESSAGE: 'No price break details found!',
        ADDNEWMESSAGE: 'Click below to add a price break details'
      },
      PART_STATUS: {
        IMAGEURL: 'assets/images/emptystate/category.png',
        MESSAGE: 'Part status does not exists.',
        ADDNEWMESSAGE: 'Click below to add  Part Status'
      },
      PART_DYNAMIC_ATTRIBUTE: {
        IMAGEURL: 'assets/images/emptystate/part-dynamic-attribute-master.png',
        MESSAGE: 'No part operational attribute listed yet!',
        ADDNEWMESSAGE: 'Click below to add Part Operational Attribute'
      },
      DOC_VIEW_RESTRICTION_BY_EMP_CERTI: {
        IMAGEURL: 'assets/images/emptystate/not-access-to-certification.png',
        MESSAGE: 'Standard Certification required to access document <br/> Or Please contact to administrator.',
        ADDNEWMESSAGE: 'Click below to add an personnel certification'
      },
      MFG_MAPP: {
        MESSAGE: 'No any {0} has been mapped yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        SEARCH_IMAGE_URL: 'assets/images/emptystate/grid-empty.png'
      },
      DOCUMENT_SEARCH_EMPTY: {
        MESSAGE: 'No any {0} has been mapped yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        SEARCH_IMAGE_URL: 'assets/images/emptystate/grid-empty.png'
      },
      LABOR_COST_EMPTY: {
        MESSAGE: 'No labor cost template price details listed yet!',
        ADDNEWMESSAGE: 'Click below to add an labor cost template price detail',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        SEARCH_IMAGE_URL: 'assets/images/emptystate/grid-empty.png',
        IMAGEURL: 'assets/images/emptystate/labor-cost-template-empty.png'
      },
      LABOR_COST_DETAILS_EMPTY: {
        MESSAGE: 'No labor cost details is listed yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        SEARCH_IMAGE_URL: 'assets/images/emptystate/grid-empty.png',
        IMAGEURL: 'assets/images/emptystate/labor-cost-template-empty.png'
      },
      STANDARD_PERSONNEL_ASSIGNED_EMPTY: {
        MESSAGE: 'No persons are assigned yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/employee.png'
      },
      STANDARD_PERSONNEL_NOT_ASSIGNED_EMPTY: {
        MESSAGE: 'All personnel are assigned!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/employee.png'
      },
      MIS_REPORT_FIELDS_ASSIGNED_EMPTY: {
        MESSAGE: 'No fields are selected yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/manageelement.png'
      },
      MIS_REPORT_NOT_ASSIGNED_EMPTY: {
        MESSAGE: 'All fields are selected!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/manageelement.png'
      },
      COMPONENT_LOGICAL_GROUP_EMPTY: {
        MESSAGE: 'No mounting type is assigned yet!'
      },
      UNALLOCATED_UMID_XFER_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/unallocated-xfer-history-empty.png',
        MESSAGE: 'No unallocated UMID Xfer histroy listed yet.'
      },
      PURCHASE_INSPECTION_REQUIREMENT_EMPTY: {
        MESSAGE: 'No {0} listed yet!',
        ADDNEWMESSAGE: 'Click below to add {0}',
        IMAGEURL: 'assets/images/emptystate/purchase-inspection-requirement-empty.png'
      },
      OPERATING_TEMPERATURE_CONVERSION: {
        IMAGEURL: 'assets/images/emptystate/empty-operating-temperature-conversion.png',
        MESSAGE: 'No Operating Temperature Conversion is listed yet!',
        ADDNEWMESSAGE: 'Click below to add operating temperature conversion.'
      },
      CALIBRATION_DETAILS: {
        IMAGEURL: 'assets/images/emptystate/calibration.png',
        MESSAGE: 'No Calibration Detail is listed yet!',
        MESSAGE_NOT_REQUIRED_CALIBRATION: 'Calibration not required for this Equipment/Workstation.',
        ADDNEWMESSAGE: 'Click below to add calibration detail.'
      },
      PURCHASE_INSPECTION_REQUIREMENT: {
        IMAGEURL: 'assets/images/emptystate/empty-purchase-incoming-inspection-requirement.png',
        MESSAGE: 'No Requirements & Comments is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Requirements & Comments.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE: {
        IMAGEURL: 'assets/images/emptystate/empty-purchase-incoming-inspection-requirement-template.png',
        MESSAGE: 'No Requirements & Comments template is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Requirements & Comments template.'
      },
      ROHS: {
        IMAGEURL: 'assets/images/emptystate/rohs-empty.png',
        MESSAGE: 'No RoHS status is listed yet!',
        ADDNEWMESSAGE: 'Click below to add RoHS status'
      },
      SUPPLIER_ATTRIBUTE_TEMPLATE: {
        IMAGEURL: 'assets/images/emptystate/supplier-attribute-template.png',
        MESSAGE: 'Supplier attributes template does not exist.',
        ADDNEWMESSAGE: 'Click below to add supplier attributes template',
        SEARCH_IMAGE_URL: 'assets/images/emptystate/grid-empty.png',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      FOB_EMPTY: {
        IMAGEURL: 'assets/images/emptystate/fob-empty.png',
        MESSAGE: 'No FOB is listed yet!',
        ADDNEWMESSAGE: 'Click below to add FOB.'
      },
      CONFIGURE_RESTRICT_FILE_TYPES: {
        MESSAGE: 'No configure restrict file type listed yet!',
        ADDNEWMESSAGE: 'Click below to add configure restrict file type',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      INPUTFIELD: {
        IMAGEURL: 'assets/images/emptystate/input-field.png',
        MESSAGE: 'No Input Field is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an input fields'
      },
      USER_SIGNUP_AGREEMENT: {
        IMAGEURL: 'assets/images/emptystate/user-signup-agreement.png',
        MESSAGE: 'No user signup agreement is listed yet!'
      },
      DISAPPROVED_SUPPLIER_ADDED_EMPTY: {
        MESSAGE: 'No suppliers are disapproved yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/supplier.png'
      },
      DISAPPROVED_SUPPLIER_NOT_ADDED_EMPTY: {
        EMPTY_MESSAGE: 'No suppliers are listed yet!',
        MESSAGE: 'All suppliers are disapproved!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/supplier.png'
      },
      DISAPPROVED_COMPONENT_ADDED_EMPTY: {
        MESSAGE: 'No custom parts are disapproved yet!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/part-master.png'
      },
      DISAPPROVED_COMPONENT_NOT_ADDED_EMPTY: {
        EMPTY_MESSAGE: 'No custom parts are listed yet!',
        MESSAGE: 'No parts are listed here.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        IMAGEURL: 'assets/images/emptystate/part-master.png'
      },
      BANK_EMPTY: {
        IMAGEURL: 'assets/images/emptystate/bank.png',
        MESSAGE: 'Bank account does not exist.',
        ADDNEWMESSAGE: 'Click below to add bank account.'
      },
      SUPPLIERPAYTOINFORMATION: {
        IMAGEURL: 'assets/images/emptystate/remit-to-address.png',
        MESSAGE: 'Remit To address does not exists!',
        ADDNEWMESSAGE: 'Click below to add a remit to address',
        NOSELECTIONMESSAGE: 'No Remit To address is selected yet!'
      },
      CAMERA_EMPTY: {
        IMAGEURL: 'assets/images/emptystate/camera-list-empty.png',
        MESSAGE: 'No camera is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a camera',
        CAMERANAME_MESSAGE: '1. Name: Special characters should not be allowed except hyphen (-).'
      },
      SUPPLIER_RMA: {
        IMAGEURL: 'assets/images/emptystate/supplier-rma.png',
        MESSAGE: 'No supplier RMA is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a supplier RMA.',
        REFRESHMESSAGE: 'Click below to refresh supplier RMA',
        HISTORYIMAGEURL: 'assets/images/emptystate/shipped-list.png',
        HISTORYMESSAGE: 'No supplier RMA history listed yet!'
      },
      SUPPLIERRMAADDRESS: {
        MESSAGE: 'Supplier RMA address does not exists!',
        NOSELECTIONMESSAGE: 'No Supplier RMA address is selected yet!'
      },
      RECYCLE_EMPTY: {
        IMAGEURL: 'assets/images/emptystate/restore-data-empty.png',
        NO_ANY_DOC_MESSAGE: 'This folder is empty.'
      },
      CHART_OF_ACCOUNTS: {
        IMAGEURL: 'assets/images/emptystate/empty-chart-of-accounts.png',
        MESSAGE: 'No account is listed yet!',
        ADDNEWMESSAGE: 'Click below to add account.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ACCOUNT_TYPE: {
        IMAGEURL: 'assets/images/emptystate/empty-account-type.png',
        MESSAGE: 'No account type is listed yet!',
        ADDNEWMESSAGE: 'Click below to add account type.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      TRANSACTION_MODES: {
        MESSAGE: 'No {0} Transaction Mode is listed yet!',
        ADDNEWMESSAGE: 'Click below to add {0} Transaction Mode.'
      },
      QUOTE_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/quote-history.png',
        MESSAGE: 'No Sales Price history found yet!'
      },
      CONTACT_PERSON: {
        ICON_CLASS: 't-icons-contact-person',
        MESSAGE: 'Contact Person does not exists!',
        ADDNEWMESSAGE: 'Click below to add a Contact Person',
        NO_PERSON_SELECTED: 'No Contact Person is selected.'
      },
      KIT_RELEASE_COMMENT: {
        IMAGEURL: 'assets/images/emptystate/Reason-icon.png',
        MESSAGE: 'No Predefined Release Comment is listed yet!',
        ADDNEWMESSAGE: 'Click below to add predefined release comment',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      MARK_FOR_INTERMEDIATE_ADDRESS: {
        IMAGEURL: 'assets/images/emptystate/mark-for-intermediate-address.png',
        MESSAGE: 'Intermediate Shipping address does not exists!',
        NOSELECTIONMESSAGE: 'No Intermediate Shipping address is selected yet!'
      },
      WIRE_TRANSFER_ADDRESS: {
        IMAGEURL: 'assets/images/emptystate/wire-transfer-address.png',
        MESSAGE: 'Wire Transfer address does not exists!',
        NOSELECTIONMESSAGE: 'No Wire Transfer address is selected yet!'
      },
      BUSINESS_ADDRESS: {
        IMAGEURL: 'assets/images/emptystate/business-address.png',
        MESSAGE: 'Business address does not exists!',
        NOSELECTIONMESSAGE: 'No Business address is selected yet!'
      },
      RMA_SHIPPING_ADDRESS: {
        IMAGEURL: 'assets/images/emptystate/rma-address.png',
        MESSAGE: 'RMA Shipping address does not exists!',
        ADDNEWMESSAGE: 'Click below to add a RMA Shipping address',
        NOSELECTIONMESSAGE: 'No RMA Shipping address is selected yet!'
      },
      SHIPPING_FROM_ADDRESS_RMA: {
        IMAGEURL: 'assets/images/emptystate/rma-address.png',
        MESSAGE: 'Shipping From Address (RMA) does not exists!',
        ADDNEWMESSAGE: 'Click below to add a Shipping From Address (RMA)',
        NOSELECTIONMESSAGE: 'No Shipping From Address (RMA) is selected yet!'
      },
      SHIPPINGFROMADDRESS: {
        IMAGEURL: 'assets/images/emptystate/shipping-address.png',
        MESSAGE: 'Shipping From address does not exists!',
        ADDNEWMESSAGE: 'Click below to add a shipping from address',
        NOSELECTIONMESSAGE: 'No Shipping From address is selected yet!'
      },
      DC_FORMAT: {
        IMAGEURL: 'assets/images/emptystate/date-code-format.png',
        MESSAGE: 'No Date Code Format is listed yet!',
        ADDNEWMESSAGE: 'Click below to add Date Code Format.'
      },
      RMA_INTERMEDIATE_ADDRESS: {
        IMAGEURL: 'assets/images/emptystate/rma-intermediate-address.png',
        MESSAGE: 'RMA Intermediate address does not exists!',
        NOSELECTIONMESSAGE: 'No RMA Intermediate address is selected yet!'
      }
    },

    ADMIN_MANAGEUSER_ROUTE: '/manageuser/:uid',
    ADMIN_MANAGEUSER_STATE: 'app.user.manageuser',
    ADMIN_MANAGEUSER_CONTROLLER: 'ManageUserController',
    ADMIN_MANAGEUSER_VIEW: 'app/main/admin/user/manage-user.html',

    // Manage Customer page
    ADMIN_MANAGECUSTOMER_ROUTE: '/managecustomer',
    ADMIN_MANAGECUSTOMER_STATE: 'app.customer.managecustomer',
    ADMIN_MANAGECUSTOMER_CONTROLLER: 'ManageCustomerController',
    ADMIN_MANAGECUSTOMER_VIEW: 'app/main/admin/customer/manage-customer.html',

    ADMIN_MANAGECUSTOMER_DETAIL_ROUTE: '/detail/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_DETAIL_STATE: 'app.customer.managecustomer.detail',
    ADMIN_MANAGECUSTOMER_ADDRESSES_ROUTE: '/addresses/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_ADDRESSES_STATE: 'app.customer.managecustomer.addresses',
    ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_ROUTE: '/automationaddresses/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_AUTOMATION_ADDRESSES_STATE: 'app.customer.managecustomer.automationaddresses',
    //ADMIN_MANAGECUSTOMER_BILLING_ADDRESS_ROUTE: '/billingaddress/:subTab/:customerType/:cid',
    //ADMIN_MANAGECUSTOMER_BILLING_ADDRESS_STATE: 'app.customer.managecustomer.billingaddress',
    //ADMIN_MANAGECUSTOMER_SHIPPING_ADDRESS_ROUTE: '/shippingaddress/:customerType/:cid',
    //ADMIN_MANAGECUSTOMER_SHIPPING_ADDRESS_STATE: 'app.customer.managecustomer.shippingaddress',
    //ADMIN_MANAGECUSTOMER_RMASHIPPING_ADDRESS_ROUTE: '/rmashippingaddress/:customerType/:cid',
    //ADMIN_MANAGECUSTOMER_RMASHIPPING_ADDRESS_STATE: 'app.customer.managecustomer.rmashippingaddress',
    ADMIN_MANAGECUSTOMER_CONTACTS_ROUTE: '/contacts/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_CONTACTS_STATE: 'app.customer.managecustomer.contacts',
    ADMIN_MANAGECUSTOMER_OTHER_DETAIL_ROUTE: '/otherdetail/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_OTHER_DETAIL_STATE: 'app.customer.managecustomer.otherdetail',
    ADMIN_MANAGECUSTOMER_PERSONNEL_MAPPING_ROUTE: '/personnelmapping/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_PERSONNEL_MAPPING_STATE: 'app.customer.managecustomer.personnelmapping',
    ADMIN_MANAGECUSTOMER_CPN_ROUTE: '/cpn/:customerType/:cid?keywords',
    ADMIN_MANAGECUSTOMER_CPN_STATE: 'app.customer.managecustomer.cpn',
    ADMIN_MANAGECUSTOMER_LOA_ROUTE: '/loa/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_LOA_STATE: 'app.customer.managecustomer.loa',
    ADMIN_MANAGECUSTOMER_EMAIL_REPORT_SETTING_ROUTE: '/emailreportsetting/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_EMAIL_REPORT_SETTING_STATE: 'app.customer.managecustomer.emailreportsetting',
    ADMIN_MANAGECUSTOMER_INVENTORY_ROUTE: '/inventory/:subTab/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_INVENTORY_STATE: 'app.customer.managecustomer.inventory',
    ADMIN_MANAGECUSTOMER_DOCUMENTS_ROUTE: '/documents/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_DOCUMENTS_STATE: 'app.customer.managecustomer.documents',
    ADMIN_MANAGECUSTOMERMFR_DOCUMENTS_ROUTE: '/manufacturerdocuments/:customerType/:cid',
    ADMIN_MANAGECUSTOMERMFR_DOCUMENTS_STATE: 'app.customer.managecustomer.manufacturerdocuments',
    ADMIN_MANAGECUSTOMER_COMMENT_ROUTE: '/comments/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_COMMENT_STATE: 'app.customer.managecustomer.comments',
    ADMIN_MANAGECUSTOMER_HISTORY_ROUTE: '/history/:customerType/:cid',
    ADMIN_MANAGECUSTOMER_HISTORY_STATE: 'app.customer.managecustomer.history',



    // Manage Supplier page
    ADMIN_MANAGESUPPLIER_ROUTE: '/managesupplier',
    ADMIN_MANAGESUPPLIER_STATE: 'app.supplier.managesupplier',
    ADMIN_MANAGESUPPLIER_CONTROLLER: 'ManageCustomerController',
    ADMIN_MANAGESUPPLIER_VIEW: 'app/main/admin/customer/manage-customer.html',

    ADMIN_MANAGESUPPLIER_DETAIL_ROUTE: '/detail/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_DETAIL_STATE: 'app.supplier.managesupplier.detail',
    ADMIN_MANAGESUPPLIER_ADDRESSES_ROUTE: '/addresses/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_ADDRESSES_STATE: 'app.supplier.managesupplier.addresses',
    ADMIN_MANAGESUPPLIER_WIRE_TRANSFER_ADDRESSES_ROUTE: '/wiretransferaddresses/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_WIRE_TRANSFER_ADDRESSES_STATE: 'app.supplier.managesupplier.wiretransferaddresses',
    ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_ROUTE: '/automationaddresses/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_AUTOMATION_ADDRESSES_STATE: 'app.supplier.managesupplier.automationaddresses',
    //ADMIN_MANAGESUPPLIER_BILLING_ADDRESS_ROUTE: '/billingaddress/:subTab/:customerType/:cid',
    //ADMIN_MANAGESUPPLIER_BILLING_ADDRESS_STATE: 'app.supplier.managesupplier.billingaddress',
    //ADMIN_MANAGESUPPLIER_SHIPPING_ADDRESS_ROUTE: '/shippingaddress/:customerType/:cid',
    //ADMIN_MANAGESUPPLIER_SHIPPING_ADDRESS_STATE: 'app.supplier.managesupplier.shippingaddress',
    //ADMIN_MANAGESUPPLIER_RMASHIPPING_ADDRESS_ROUTE: '/rmashippingaddress/:customerType/:cid',
    //ADMIN_MANAGESUPPLIER_RMASHIPPING_ADDRESS_STATE: 'app.supplier.managesupplier.rmashippingaddress',
    ADMIN_MANAGESUPPLIER_CONTACTS_ROUTE: '/contacts/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_CONTACTS_STATE: 'app.supplier.managesupplier.contacts',
    ADMIN_MANAGESUPPLIER_OTHER_DETAIL_ROUTE: '/otherdetail/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_OTHER_DETAIL_STATE: 'app.supplier.managesupplier.otherdetail',
    ADMIN_MANAGESUPPLIER_STANDARDS_ROUTE: '/standards/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_STANDARDS_STATE: 'app.supplier.managesupplier.standards',
    ADMIN_MANAGESUPPLIER_CUSTOM_COMPONENT_APPROVED_DISAPPROVED_DETAIL_ROUTE: '/customcomponentapproveddisapproveddetail/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_CUSTOM_COMPONENT_APPROVED_DISAPPROVED_DETAIL_STATE: 'app.supplier.managesupplier.customcomponentapproveddisapproveddetail',
    //ADMIN_MANAGESUPPLIER_REMIT_TO_ROUTE: '/remitto/:customerType/:cid',
    //ADMIN_MANAGESUPPLIER_REMIT_TO_STATE: 'app.supplier.managesupplier.remitto',
    ADMIN_MANAGESUPPLIER_DOCUMENTS_ROUTE: '/documents/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_DOCUMENTS_STATE: 'app.supplier.managesupplier.documents',
    ADMIN_MANAGESUPPLIER_COMMENT_ROUTE: '/comments/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_COMMENT_STATE: 'app.supplier.managesupplier.comments',
    ADMIN_MANAGESUPPLIER_HISTORY_ROUTE: '/history/:customerType/:cid',
    ADMIN_MANAGESUPPLIER_HISTORY_STATE: 'app.supplier.managesupplier.history',

    // Manage Manufacturer page
    ADMIN_MANAGEMANUFACTURER_ROUTE: '/managemanufacturer',
    ADMIN_MANAGEMANUFACTURER_STATE: 'app.manufacturer.managemanufacturer',
    ADMIN_MANAGEMANUFACTURER_CONTROLLER: 'ManageCustomerController',
    ADMIN_MANAGEMANUFACTURER_VIEW: 'app/main/admin/customer/manage-customer.html',

    ADMIN_MANAGEMANUFACTURER_DETAIL_ROUTE: '/detail/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_DETAIL_STATE: 'app.manufacturer.managemanufacturer.detail',
    ADMIN_MANAGEMANUFACTURER_ADDRESSES_ROUTE: '/addresses/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_ADDRESSES_STATE: 'app.manufacturer.managemanufacturer.addresses',
    ADMIN_MANAGEMANUFACTURER_AUTOMATION_ADDRESSES_ROUTE: '/automationaddresses/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_AUTOMATION_ADDRESSES_STATE: 'app.manufacturer.managemanufacturer.automationaddresses',
    //ADMIN_MANAGEMANUFACTURER_BILLING_ADDRESS_ROUTE: '/billingaddress/:subTab/:customerType/:cid',
    //ADMIN_MANAGEMANUFACTURER_BILLING_ADDRESS_STATE: 'app.manufacturer.managemanufacturer.billingaddress',
    //ADMIN_MANAGEMANUFACTURER_SHIPPING_ADDRESS_ROUTE: '/shippingaddress/:customerType/:cid',
    //ADMIN_MANAGEMANUFACTURER_SHIPPING_ADDRESS_STATE: 'app.manufacturer.managemanufacturer.shippingaddress',
    //ADMIN_MANAGEMANUFACTURER_RMASHIPPING_ADDRESS_ROUTE: '/rmashippingaddress/:customerType/:cid',
    //ADMIN_MANAGEMANUFACTURER_RMASHIPPING_ADDRESS_STATE: 'app.manufacturer.managemanufacturer.rmashippingaddress',
    ADMIN_MANAGEMANUFACTURER_CONTACTS_ROUTE: '/contacts/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_CONTACTS_STATE: 'app.manufacturer.managemanufacturer.contacts',
    ADMIN_MANAGEMANUFACTURER_EMAIL_REPORT_SETTING_ROUTE: '/emailreportsetting/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_EMAIL_REPORT_SETTING_STATE: 'app.manufacturer.managemanufacturer.emailreportsetting',
    ADMIN_MANAGEMANUFACTURER_DOCUMENTS_ROUTE: '/documents/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_DOCUMENTS_STATE: 'app.manufacturer.managemanufacturer.documents',
    ADMIN_MANAGEMANUFACTURER_OTHER_DETAIL_ROUTE: '/otherdetail/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_OTHER_DETAIL_STATE: 'app.manufacturer.managemanufacturer.otherdetail',
    ADMIN_MANAGEMANUFACTURER_HISTORY_ROUTE: '/history/:customerType/:cid',
    ADMIN_MANAGEMANUFACTURER_HISTORY_STATE: 'app.manufacturer.managemanufacturer.history',

    // Manage MFG Component page
    ADMIN_MANAGECOMPONENT_ROUTE: '/managemfg',
    ADMIN_MANAGECOMPONENT_STATE: 'app.component.managecomponent',

    // Manage DIST Component page
    ADMIN_MANAGEDISTCOMPONENT_ROUTE: '/managedist',
    ADMIN_MANAGEDISTCOMPONENT_STATE: 'app.component.managedistcomponent',

    ADMIN_MANAGECOMPONENT_CONTROLLER: 'ManageComponentController',
    ADMIN_MANAGECOMPONENT_VIEW: 'app/main/admin/component/manage-component.html',

    ///Manage MFG Component Tabs
    ADMIN_MANAGECOMPONENT_DETAIL_TAB_ROUTE: '/detail/:coid',
    ADMIN_MANAGECOMPONENT_DETAIL_STATE: 'app.component.managecomponent.detail',

    ///Manage DIST Component Tabs
    ADMIN_MANAGEDISTCOMPONENT_DETAIL_TAB_ROUTE: '/detail/:coid',
    ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE: 'app.component.managedistcomponent.detail',

    ///Manage MFG Component Tabs ALT & Purchase Order List
    ADMIN_MANAGECOMPONENT_PO_LIST_TAB_ROUTE: '/polist/:coid/',
    ADMIN_MANAGECOMPONENT_PO_LIST_STATE: 'app.component.managecomponent.polist',

    ///Manage DIST Component Tabs ALT & Purchase Order List
    ADMIN_MANAGEDISTCOMPONENT_PO_LIST_TAB_ROUTE: '/polist/:coid',
    ADMIN_MANAGEDISTCOMPONENT_PO_LIST_STATE: 'app.component.managedistcomponent.polist',

    ///Manage MFG Component Tabs Standard
    ADMIN_MANAGECOMPONENT_STANDARDS_TAB_ROUTE: '/standards/:coid',
    ADMIN_MANAGECOMPONENT_STANDARDS_STATE: 'app.component.managecomponent.standards',

    ///Manage DIST Component Tabs Standard
    ADMIN_MANAGEDISTCOMPONENT_STANDARDS_TAB_ROUTE: '/standards/:coid',
    ADMIN_MANAGEDISTCOMPONENT_STANDARDS_STATE: 'app.component.managedistcomponent.standards',

    //In MFG part document tab  , docOpenType : 0-normal rout , 1-to open operator folder , 2- to upload image
    ADMIN_MANAGECOMPONENT_DOCUMENT_TAB_ROUTE: '/documents/:coid/:docOpenType',
    ADMIN_MANAGECOMPONENT_DOCUMENT_STATE: 'app.component.managecomponent.document',

    //In DIST part document tab  , docOpenType : 0-normal rout , 1-to open operator folder , 2- to upload image
    ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_TAB_ROUTE: '/documents/:coid/:docOpenType',
    ADMIN_MANAGEDISTCOMPONENT_DOCUMENT_STATE: 'app.component.managedistcomponent.document',

    ///Manage MFG Component Tabs Data Fields
    ADMIN_MANAGECOMPONENT_DATAFIELDS_TAB_ROUTE: '/datafields/:coid',
    ADMIN_MANAGECOMPONENT_DATAFIELDS_STATE: 'app.component.managecomponent.datafields',

    ///Manage DIST Component Tabs Data Fields
    ADMIN_MANAGEDISTCOMPONENT_DATAFIELDS_TAB_ROUTE: '/datafields/:coid',
    ADMIN_MANAGEDISTCOMPONENT_DATAFIELDS_STATE: 'app.component.managedistcomponent.datafields',

    ///Manage MFG Component Tabs Other Detail
    ADMIN_MANAGECOMPONENT_OTHERDETAIL_TAB_ROUTE: '/otherdetail/:coid',
    ADMIN_MANAGECOMPONENT_OTHERDETAIL_STATE: 'app.component.managecomponent.otherdetail',

    ///Manage DIST Component Tabs Other Detail
    ADMIN_MANAGEDISTCOMPONENT_OTHERDETAIL_TAB_ROUTE: '/otherdetail/:coid',
    ADMIN_MANAGEDISTCOMPONENT_OTHERDETAIL_STATE: 'app.component.managedistcomponent.otherdetail',

    ///Manage MFG Component Tabs Pricing History
    ADMIN_MANAGECOMPONENT_PRICINGHISTORY_TAB_ROUTE: '/pricinghistory/:coid/:subTab',
    ADMIN_MANAGECOMPONENT_PRICINGHISTORY_STATE: 'app.component.managecomponent.pricinghistory',

    ///Manage MFG Component Tabs Supplier Quote
    ADMIN_MANAGECOMPONENT_SPLRQUOTE_TAB_ROUTE: '/splrquote/:coid',
    ADMIN_MANAGECOMPONENT_SPLRQUOTE_STATE: 'app.component.managecomponent.splrquote',

    ///Manage DIST Component Tabs Pricing History
    ADMIN_MANAGEDISTCOMPONENT_PRICINGHISTORY_TAB_ROUTE: '/pricinghistory/:coid/:subTab',
    ADMIN_MANAGEDISTCOMPONENT_PRICINGHISTORY_STATE: 'app.component.managedistcomponent.pricinghistory',

    ///Manage DIST Component Tabs Supplier Quote
    ADMIN_MANAGEDISTCOMPONENT_SPLRQUOTE_TAB_ROUTE: '/splrquote/:coid',
    ADMIN_MANAGEDISTCOMPONENT_SPLRQUOTE_STATE: 'app.component.managedistcomponent.splrquote',

    ///Manage MFG Component Tabs Customer LOA TAB
    ADMIN_MANAGECOMPONENT_CUSTOMERLOA_TAB_ROUTE: '/customerloa/:coid',
    ADMIN_MANAGECOMPONENT_CUSTOMERLOA_STATE: 'app.component.managecomponent.customerloa',

    ///Manage DIST Component Tabs Customer LOA TAB
    ADMIN_MANAGEDISTCOMPONENT_CUSTOMERLOA_TAB_ROUTE: '/customerloa/:coid',
    ADMIN_MANAGEDISTCOMPONENT_CUSTOMERLOA_STATE: 'app.component.managedistcomponent.customerloa',

    ///Manage MFG Component Tabs Comments
    ADMIN_MANAGECOMPONENT_COMMENTS_TAB_ROUTE: '/comments/:coid',
    ADMIN_MANAGECOMPONENT_COMMENTS_STATE: 'app.component.managecomponent.comments',

    ///Manage DIST Component Tabs Comments
    ADMIN_MANAGEDISTCOMPONENT_COMMENTS_TAB_ROUTE: '/comments/:coid',
    ADMIN_MANAGEDISTCOMPONENT_COMMENTS_STATE: 'app.component.managedistcomponent.comments',

    ///Manage MFG Component Tabs BOM
    ADMIN_MANAGECOMPONENT_BOM_TAB_ROUTE: '/bom/:coid/:subTab?keywords',
    ADMIN_MANAGECOMPONENT_BOM_STATE: 'app.component.managecomponent.bom',

    ///Manage DIST Component Tabs BOM
    ADMIN_MANAGEDISTCOMPONENT_BOM_TAB_ROUTE: '/bom/:coid/:subTab?keywords',
    ADMIN_MANAGEDISTCOMPONENT_BOM_STATE: 'app.component.managedistcomponent.bom',

    ///Manage MFG Component Tabs RFQ
    ADMIN_MANAGECOMPONENT_RFQ_TAB_ROUTE: '/rfq/:coid',
    ADMIN_MANAGECOMPONENT_RFQ_STATE: 'app.component.managecomponent.rfq',

    ///Manage DIST Component Tabs RFQ
    ADMIN_MANAGEDISTCOMPONENT_RFQ_TAB_ROUTE: '/rfq/:coid',
    ADMIN_MANAGEDISTCOMPONENT_RFQ_STATE: 'app.component.managedistcomponent.rfq',

    ///Manage MFG Component Tabs Opening Stock
    ADMIN_MANAGECOMPONENT_OPENING_STOCK_TAB_ROUTE: '/assemblystock/:coid/:subTab',
    ADMIN_MANAGECOMPONENT_OPENING_STOCK_STATE: 'app.component.managecomponent.assemblystockdetail',

    ///Manage DIST Component Tabs Opening Stock
    ADMIN_MANAGEDISTCOMPONENT_OPENING_STOCK_TAB_ROUTE: '/assemblystock/:coid/:subTab',
    ADMIN_MANAGEDISTCOMPONENT_OPENING_STOCK_STATE: 'app.component.managedistcomponent.assemblystockdetail',

    ///Manage MFG Component Tabs Supplier API Response
    ADMIN_MANAGECOMPONENT_SUPPLIER_API_RESPONSE_TAB_ROUTE: '/supplierapiresponseg/:coid',
    ADMIN_MANAGECOMPONENT_SUPPLIER_API_RESPONSE_STATE: 'app.component.managecomponent.supplierapiresponse',

    ///Manage DIST Component Tabs Supplier API Response
    ADMIN_MANAGEDISTCOMPONENT_SUPPLIER_API_RESPONSE_TAB_ROUTE: '/supplierapiresponse/:coid',
    ADMIN_MANAGEDISTCOMPONENT_SUPPLIER_API_RESPONSE_STATE: 'app.component.managedistcomponent.supplierapiresponse',

    ///Manage MFG Component Tabs Assembly Sales Price Matrix
    ADMIN_MANAGECOMPONENT_COMPONENT_ASSEMBLY_SALES_PRICE_MATRIX_TAB_ROUTE: '/assysalespricematrix/:coid',
    ADMIN_MANAGECOMPONENT_COMPONENT_ASSEMBLY_SALES_PRICE_MATRIX_STATE: 'app.component.managecomponent.assysalespricematrix',

    ///Manage MFG Component Tabs History
    ADMIN_MANAGECOMPONENT_COMPONENT_HISTORY_TAB_ROUTE: '/componenthistory/:coid',
    ADMIN_MANAGECOMPONENT_COMPONENT_HISTORY_STATE: 'app.component.managecomponent.history',

    ///Manage DIST Component Tabs History
    ADMIN_MANAGEDISTCOMPONENT_COMPONENT_HISTORY_TAB_ROUTE: '/componenthistory/:coid',
    ADMIN_MANAGEDISTCOMPONENT_COMPONENT_HISTORY_STATE: 'app.component.managedistcomponent.history',

    ///Manage MFG Component Tabs Kit Allocation
    ADMIN_MANAGECOMPONENT_KIT_ALLOCATION_TAB_ROUTE: '/kitallocation/:coid',
    ADMIN_MANAGECOMPONENT_KIT_ALLOCATION_STATE: 'app.component.managecomponent.kitallocation',

    ///Manage DIST Component Tabs Kit Allocation
    ADMIN_MANAGEDISTCOMPONENT_KIT_ALLOCATION_TAB_ROUTE: '/kitallocation/:coid',
    ADMIN_MANAGEDISTCOMPONENT_KIT_ALLOCATION_STATE: 'app.component.managedistcomponent.kitallocation',

    ///Manage MFG Component Tabs UMID
    ADMIN_MANAGECOMPONENT_UMID_LIST_TAB_ROUTE: '/umidlist/:coid',
    ADMIN_MANAGECOMPONENT_UMID_LIST_STATE: 'app.component.managecomponent.umidlist',

    ///Manage DIST Component Tabs UMID
    ADMIN_MANAGEDISTCOMPONENT_UMID_LIST_TAB_ROUTE: '/umidlist/:coid',
    ADMIN_MANAGEDISTCOMPONENT_UMID_LIST_STATE: 'app.component.managedistcomponent.umidlist',

    ///Manage MFG Component Tabs DFM
    ADMIN_MANAGECOMPONENT_DFM_TAB_ROUTE: '/dfm/:coid/:ecoDfmType',
    ADMIN_MANAGECOMPONENT_DFM_STATE: 'app.component.managecomponent.dfm',

    ///Manage DIST Component Tabs DFM
    ADMIN_MANAGEDISTCOMPONENT_DFM_TAB_ROUTE: '/dfm/:coid/:ecoDfmType',
    ADMIN_MANAGEDISTCOMPONENT_DFM_STATE: 'app.component.managedistcomponent.dfm',

    ///Manage MFG Component Tabs Workorder
    ADMIN_MANAGECOMPONENT_WORKORDER_TAB_ROUTE: '/workorderlist/:coid',
    ADMIN_MANAGECOMPONENT_WORKORDER_STATE: 'app.component.managecomponent.workorderlist',

    ///Manage DIST Component Tabs Work oRder
    ADMIN_MANAGEDISTCOMPONENT_WORKORDER_TAB_ROUTE: '/workorderlist/:coid',
    ADMIN_MANAGEDISTCOMPONENT_WORKORDER_STATE: 'app.component.managedistcomponent.workorderlist',

    ///
    ADMIN_COMPONENT_ENTERNAL_VALUES_POPUP_CONTROLLER: 'ComponentExternalValuesPopupController',
    ADMIN_COMPONENT_ENTERNAL_VALUES_POPUP_VIEW: 'app/directives/custom/component-external-values-popup/component-external-values-popup.html',

    ///Manage MFG Component Tabs Approived DisApproved Supplier
    ADMIN_MANAGECOMPONENT_APPROVED_DISAPPROVED_SUPPLIER_TAB_ROUTE: '/approveddisapprovedsupplier/:coid',
    ADMIN_MANAGECOMPONENT_APPROVED_DISAPPROVED_SUPPLIER_STATE: 'app.component.managecomponent.approveddisapprovedsupplier',

    ADMIN_COPY_ASSEMBLY_POPUP_CONTROLLER: 'CopyAssemblyPopupController',
    ADMIN_COPY_ASSEMBLY_POPUP_VIEW: 'app/main/admin/component/copy-assembly-popup/copy-assembly-popup.html',

    ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_CONTROLLER: 'CreateAssemblyRevisionPopupController',
    ADMIN_CREATE_ASSEMBLY_REVISION_POPUP_VIEW: 'app/main/admin/component/create-assembly-revision-popup/create-assembly-revision-popup.html',

    ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_CONTROLLER: 'ComponentUpdateMultipleAttributesPopupController',
    ADMIN_COMPONENT_UPDATE_MULTIPLE_ATTRIBUTES_POPUP_VIEW: 'app/main/admin/component/component-update-multiple-attributes-popup/component-update-multiple-attributes-popup.html',

    ADMIN_COMPONENT_UPDATE_MPN_PIDCODE_POPUP_CONTROLLER: 'ComponentUpdateMPNPIDCodePopupController',
    ADMIN_COMPONENT_UPDATE_MPN_PIDCODE_POPUP_VIEW: 'app/main/admin/component/component-update-mpn-pid-code-popup/component-update-mpn-pid-code-popup.html',

    ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_CONTROLLER: 'AddPackagingAliasPartPopupController',
    ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_VIEW: 'app/main/admin/component/add-packaging-alias-popup/add-packaging-alias-popup.html',

    CHANGE_BASE_PART_CONFIRMATION_POPUP_CONTROLLER: 'ChangeBasePartConfirmationPopupController',
    CHANGE_BASE_PART_CONFIRMATION_POPUP_VIEW: 'app/view/change-base-part-confirmation-popup/change-base-part-confirmation-popup.html',

    ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER: 'BOMActivityStartedAssemblyListPopupController',
    ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW: 'app/main/admin/component/bom-activity-started-assembly-list-popup/bom-activity-started-assembly-list-popup.html',

    ADMIN_COMPONENT_TEMPERATURE_SENSITIVE_DATA_LIST_CONTROLLER: 'ComponentTemperatureSensitiveDataListController',
    ADMIN_COMPONENT_TEMPERATURE_SENSITIVE_DATA_LIST_VIEW: 'app/main/admin/component/component-temperature-sensitive-data-popup/component-temperature-sensitive-data-list-popup.html',

    ADMIN_ADD_COMPONENT_TEMPERATURE_SENSITIVE_DATA_CONTROLLER: 'AddComponentTemperatureSensitiveDataController',
    ADMIN_ADD_COMPONENT_TEMPERATURE_SENSITIVE_DATA_VIEW: 'app/main/admin/component/component-temperature-sensitive-data-popup/add-component-temperature-sensitive-data-popup.html',

    ADMIN_SERIAL_NUMBER_CONFIGURATION_POPUP_CONTROLLER: 'SerialNumberConfigurationPopupController',
    ADMIN_SERIAL_NUMBER_CONFIGURATION_POPUP_VIEW: 'app/main/admin/component/serial-number-configuration-pop-up/serial-number-configuration-pop-up.html',

    PART_USAGE_CONTROLLER: 'PartUsageController',
    PART_USAGE_VIEW: 'app/directives/custom/part-usage-detail/part-usage-popup.html',

    // popup for customer other contact person
    ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW: 'app/main/admin/contact-person/manage-contactperson-popup.html',
    ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER: 'ManageContactpersonPopupController',

    // Popup for Billing and Shipping address
    ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_VIEW: 'app/main/admin/customer/billing-shipping-addresses-popup.html',
    ADMIN_CUSTOMER_BILLING_SHIPPING_ADDRESSS_CONTROLLER: 'BillingShippingAddressesPopupController',

    // Popup for Select Billing and Shipping address
    ADMIN_SELECT_ADDRESSS_VIEW: 'app/main/admin/customer/select-address-popup/select-address-popup.html',
    ADMIN_SELECT_ADDRESSS_CONTROLLER: 'SelectAddressesPopupController',

    // Popup for Duplicate address
    ADMIN_DUPLICATE_ADDRESSS_VIEW: 'app/main/admin/customer/copy-address-popup.html',
    ADMIN_DUPLICATE_ADDRESSS_CONTROLLER: 'CopyAddressPopupController',

    // Popup for Select contact person information
    ADMIN_SELECT_CONTACT_PERSON_VIEW: 'app/main/admin/customer/select-contact-person-popup/select-contact-person-popup.html',
    ADMIN_SELECT_CONTACT_PERSON_CONTROLLER: 'selectContactPersonPopupController',

    // popup for show transaction details
    ADMIN_SHOW_TRANSACTION_DETAILS_VIEW: 'app/main/admin/customer/show-transaction-details-popup/show-transaction-details-popup.html',
    ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER: 'showTransactionDetailsPopupController',

    //certificate standard
    ADMIN_CERTIFICATE_STANDARD: 'Certificate Standard',
    CERTIFICATE_STANDARD_LABEL: 'Standards',
    CERTIFICATE_STANDARD_STATE: 'app.certificatestandard',
    CERTIFICATE_STANDARD_ROUTE: '/certificatestandard',
    CERTIFICATE_STANDARD_VIEW: 'app/main/admin/certificate-standards/certificate-standards.html',
    CERTIFICATE_STANDARD_CONTROLLER: 'CertificateStandardController',
    ADMIN_CERTIFICATE_STANDARD_UPDATE_CONTROLLER: 'CertificateStandardUpdateController',
    ADMIN_CERTIFICATE_STANDARD_UPDATE_VIEW: 'app/main/admin/certificate-standards/certificate-standards-update.html',
    ADMIN_CERTIFICATE_STANDARD_ADD_CLASS_MODAL_CONTROLLER: 'StandardClassAddPopupController',
    ADMIN_CERTIFICATE_STANDARD_ADD_CLASS_MODAL_VIEW: 'app/main/admin/certificate-standards/standard-class-add-popup.html',

    ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE: 'app.certificatestandard.detail',
    ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_ROUTE: '/detail/:id',
    ADMIN_MANAGE_CERTIFICATE_STANDARD_DOCUMENTS_STATE: 'app.certificatestandard.documents',
    ADMIN_MANAGE_CERTIFICATE_STANDARD_DOCUMENTS_ROUTE: '/documents/:id',
    ADMIN_MANAGE_CERTIFICATE_STANDARD_PERSONNEL_STATE: 'app.certificatestandard.personnel',
    ADMIN_MANAGE_CERTIFICATE_STANDARD_PERSONNEL_ROUTE: '/personnel/:id/:classID',
    ADMIN_MANAGE_CERTIFICATE_STANDARD_MISC_STATE: 'app.certificatestandard.misc',
    ADMIN_MANAGE_CERTIFICATE_STANDARD_MISC_ROUTE: '/misc/:id',


    //standard class
    STANDARD_CLASS_LABEL: 'Standards Class',
    STANDARD_CLASS_STATE: 'app.standardClass',
    STANDARD_CLASS_ROUTE: '/certificatestandard/standardClass',
    STANDARD_CLASS_VIEW: 'app/main/admin/standard-class/standard-class.html',
    STANDARD_CLASS_CONTROLLER: 'StandardClassController',
    STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_VIEW: 'app/main/admin/standard-class/standard-class-add-update-popup.html',
    STANDARD_CLASS_CONTROLLER_UPDATE_MODAL_CONTROLLER: 'StandardClassUpdatePopupController',

    ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_CONTROLLER: 'AddCertificateStandardController',
    ADMIN_CERTIFICATE_STANDARD_ADD_MODAL_VIEW: 'app/main/admin/certificate-standards/add-certificate-standards-popup.html',

    ADMIN_CERTIFICATE_STANDARD_COPY_MODAL_CONTROLLER: 'CopyCertificateStandardController',
    ADMIN_CERTIFICATE_STANDARD_COPY_MODAL_VIEW: 'app/main/admin/certificate-standards/copy-standards-popup.html',

    EMP_CERTIFICATION_MODAL_CONTROLLER: 'ManageEmployeeCertificationPopupController',
    EMP_CERTIFICATION_MODAL_VIEW: 'app/main/admin/employee/employee-certification/employee-certification-popup.html',

    EMP_RESPONSIBILITY_MODAL_CONTROLLER: 'ManageEmployeeResponsibilityPopupController',
    EMP_RESPONSIBILITY_MODAL_VIEW: 'app/main/admin/employee/employee-responsibility/employee-responsibility-popup.html',

    EMP_STANDARD_CHANGE_ALERT_MODAL_CONTROLLER: 'EmpStandardChangeAlertPopupController',
    EMP_STANDARD_CHANGE_ALERT_MODAL_VIEW: 'app/main/admin/employee/employee-certification/emp-standard-change-alert-popup/emp-standard-change-alert-popup.html',

    //CATEGORY_TYPE_LABEL: 'Category Type',
    //CATEGORY_TYPE_STATE: 'app.categorytype',
    //CATEGORY_TYPE_ROUTE: '/categorytype',
    //CATEGORY_TYPE_VIEW: 'app/main/admin/category-type/category-type.html',
    //CATEGORY_TYPE_CONTROLLER: 'CategoryTypeController',

    ADMIN_DEPARTMENT_LABEL: 'Department',
    ADMIN_DEPARTMENT_ROUTE: '/department',
    ADMIN_DEPARTMENT_STATE: 'app.department',
    ADMIN_DEPARTMENT_CONTROLLER: 'DepartmentController',
    ADMIN_DEPARTMENT_VIEW: 'app/main/admin/department/department-list.html',

    ADMIN_MANAGEDEPARTMENT_ROUTE: '/managedepartment',
    //ADMIN_MANAGEDEPARTMENT_ROUTE: '/managedepartment/:tab/:deptid',
    ADMIN_MANAGEDEPARTMENT_STATE: 'app.department.managedepartment',
    ADMIN_MANAGEDEPARTMENT_CONTROLLER: 'ManageDepartmentController',
    ADMIN_MANAGEDEPARTMENT_VIEW: 'app/main/admin/department/manage-department.html',

    ADMIN_MANAGEDEPARTMENT_DETAIL_ROUTE: '/detail/:deptID',
    ADMIN_MANAGEDEPARTMENT_DETAIL_STATE: 'app.department.managedepartment.detail',
    ADMIN_MANAGEDEPARTMENT_EMPLOYEE_ROUTE: '/employee/:deptID',
    ADMIN_MANAGEDEPARTMENT_EMPLOYEE_STATE: 'app.department.managedepartment.employee',
    ADMIN_MANAGEDEPARTMENT_LOCATION_ROUTE: '/location/:deptID',
    ADMIN_MANAGEDEPARTMENT_LOCATION_STATE: 'app.department.managedepartment.location',
    ADMIN_MANAGEDEPARTMENT_MISC_ROUTE: '/misc/:deptID',
    ADMIN_MANAGEDEPARTMENT_MISC_STATE: 'app.department.managedepartment.misc',

    ADMIN_DEPARTMENT_ADD_MODAL_VIEW: 'app/main/admin/department/add-department-popup.html',
    ADMIN_DEPARTMENT_ADD_MODAL_CONTROLLER: 'AddDepartmentPopupController',

    ADMIN_DUPLICATE_ADD_MODAL_VIEW: 'app/view/duplicate-confirmation-popup/duplicate-confirmation-popup.html',
    ADMIN_DUPLICATE_ADD_MODAL_CONTROLLER: 'DuplicateConfirmationPopupController',

    ADMIN_EQUIPMENT_LABEL: 'Equipment, Workstation & Sample',
    ADMIN_EQUIPMENT_ROUTE: '/equipment',
    ADMIN_EQUIPMENT_STATE: 'app.equipment',
    ADMIN_EQUIPMENT_CONTROLLER: 'EquipmentController',
    ADMIN_EQUIPMENT_VIEW: 'app/main/admin/equipment/equipment-list.html',

    ADMIN_MANAGEEQUIPMENT_ROUTE: '/manageequipment',
    ADMIN_MANAGEEQUIPMENT_STATE: 'app.equipment.manageequipment',
    ADMIN_MANAGEEQUIPMENT_CONTROLLER: 'ManageEquipmentController',
    ADMIN_MANAGEEQUIPMENT_VIEW: 'app/main/admin/equipment/manage-equipment.html',

    ADMIN_MANAGEEQUIPMENT_DETAIL_ROUTE: '/detail/:eqpID',
    ADMIN_MANAGEEQUIPMENT_DETAIL_STATE: 'app.equipment.manageequipment.detail',

    ADMIN_MANAGEEQUIPMENT_MAINTENANCE_SCHEDULE_ROUTE: '/maintenance/:eqpID/:subTab',
    ADMIN_MANAGEEQUIPMENT_MAINTENANCE_SCHEDULE_STATE: 'app.equipment.manageequipment.maintenance',

    ADMIN_MANAGEEQUIPMENT_CALIBRATION_DETAIL_ROUTE: '/calibrationdetail/:eqpID',
    ADMIN_MANAGEEQUIPMENT_CALIBRATION_DETAIL_STATE: 'app.equipment.manageequipment.calibrationdetail',

    ADMIN_MANAGEEQUIPMENT_DOCUMENTS_ROUTE: '/documents/:eqpID',
    ADMIN_MANAGEEQUIPMENT_DOCUMENTS_STATE: 'app.equipment.manageequipment.documents',

    ADMIN_MANAGEEQUIPMENT_DATA_FIELDS_ROUTE: '/datafields/:eqpID',
    ADMIN_MANAGEEQUIPMENT_DATA_FIELDS_STATE: 'app.equipment.manageequipment.datafields',

    ADMIN_MANAGEEQUIPMENT_OTHER_ROUTE: '/other/:eqpID',
    ADMIN_MANAGEEQUIPMENT_OTHER_STATE: 'app.equipment.manageequipment.other',


    // popup for equipment add task
    ADMIN_EQUIPMENT_MANAGETASK_MODAL_VIEW: 'app/main/admin/equipment/manage-equipment-task-popup.html',
    ADMIN_EQUIPMENT_MANAGETASK_MODAL_CONTROLLER: 'ManageEquipmentTaskPopupController',

    // popup for equipment preview task documents
    ADMIN_EQUIPMENT_PREVIEW_TASKDOCUMENTS_MODAL_VIEW: 'app/main/admin/equipment/equipment-preview-task-document-popup.html',
    ADMIN_EQUIPMENT_PREVIEW_TASKDOCUMENTS_MODAL_CONTROLLER: 'EquipmentPreviewTaskDocumentPopupController',

    // popup for equipment maintenance schedule
    ADMIN_EQUIPMENT_MAINTENANCESCHEDULE_MODAL_VIEW: 'app/main/admin/equipment/manage-maintenance-schedule-popup.html',
    ADMIN_EQUIPMENT_MAINTENANCESCHEDULE_MODAL_CONTROLLER: 'ManageMaintenanceSchedulePopupController',

    MANAGE_EMPLOYEE_OPERATIONS_ROUTE: '/manageemployeeoperations/:id',
    MANAGE_EMPLOYEE_OPERATIONS_STATE: 'app.employee.manageemployeeoperations',
    MANAGE_EMPLOYEE_OPERATIONS_CONTROLLER: 'ManageEmployeeOperationsController',
    MANAGE_EMPLOYEE_OPERATIONS_VIEW: 'app/main/admin/employee/manage-employee-operations/manage-employee-operations.html',

    /* Generic Category */
    ADMIN_GENERICCATEGORY_LABEL: 'Generic Category',

    /*Equipment & Workstation Groups*/
    ADMIN_GENERICCATEGORY_EQPGROUP_STATE: 'app.equipmentgroup',
    ADMIN_GENERICCATEGORY_EQPGROUP_LABEL: 'Equipment, Workstation & Sample Groups',
    ADMIN_GENERICCATEGORY_EQPGROUP_ROUTE: '/equipmentgroup/:categoryTypeID',

    /* Equipment & Workstation Types */
    ADMIN_GENERICCATEGORY_EQPTYPE_STATE: 'app.equipmenttype',
    ADMIN_GENERICCATEGORY_EQPTYPE_LABEL: 'Equipment, Workstation & Sample Types',
    ADMIN_GENERICCATEGORY_EQPTYPE_ROUTE: '/equipmenttype/:categoryTypeID',

    /* Equipment & Workstation Ownerships */
    ADMIN_GENERICCATEGORY_EQPOWNER_STATE: 'app.equipmentownership',
    ADMIN_GENERICCATEGORY_EQPOWNER_LABEL: 'Equipment, Workstation & Sample Ownerships',
    ADMIN_GENERICCATEGORY_EQPOWNER_ROUTE: '/equipmentownership/:categoryTypeID',

    /* Standard Types */
    ADMIN_GENERICCATEGORY_STANDTYPE_STATE: 'app.standardtype',
    ADMIN_GENERICCATEGORY_STANDTYPE_LABEL: 'Standard Types',
    ADMIN_GENERICCATEGORY_STANDTYPE_ROUTE: '/standardtype/:categoryTypeID',

    /* Part Status */
    ADMIN_GENERICCATEGORY_PART_STATUS_STATE: 'app.partstatus',
    ADMIN_GENERICCATEGORY_PART_STATUS_LABEL: 'Part Status',
    ADMIN_GENERICCATEGORY_PART_STATUS_ROUTE: '/partstatus/:categoryTypeID',

    /*Barcode separators */
    ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_STATE: 'app.barcodeseparator',
    ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_LABEL: 'Barcode Separators',
    ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_ROUTE: '/barcodeseparator/:categoryTypeID',

    /*Titles */
    ADMIN_GENERICCATEGORY_EMPTITLE_STATE: 'app.employeetitle',
    ADMIN_GENERICCATEGORY_EMPTITLE_LABEL: 'Titles',
    ADMIN_GENERICCATEGORY_EMPTITLE_ROUTE: '/employeetitle/:categoryTypeID',

    /* Operation Types */
    ADMIN_GENERICCATEGORY_OPTYPE_STATE: 'app.operationtype',
    ADMIN_GENERICCATEGORY_OPTYPE_LABEL: 'Operation Types',
    ADMIN_GENERICCATEGORY_OPTYPE_ROUTE: '/operationtype/:categoryTypeID',

    /* Shipping Status */
    ADMIN_GENERICCATEGORY_SHIPSTATUS_STATE: 'app.shippingstatus',
    ADMIN_GENERICCATEGORY_SHIPSTATUS_LABEL: 'Shipping Status',
    ADMIN_GENERICCATEGORY_SHIPSTATUS_ROUTE: '/shippingstatus/:categoryTypeID',

    /* Locations */
    ADMIN_GENERICCATEGORY_LOCATIONTYPE_STATE: 'app.locationtype',
    ADMIN_GENERICCATEGORY_LOCATIONTYPE_LABEL: 'Geolocations',
    ADMIN_GENERICCATEGORY_LOCATIONTYPE_ROUTE: '/locationtype/:categoryTypeID',

    /* Responsibilities */
    ADMIN_GENERICCATEGORY_WORKAREA_STATE: 'app.workarea',
    ADMIN_GENERICCATEGORY_WORKAREA_LABEL: 'Responsibilities',
    ADMIN_GENERICCATEGORY_WORKAREA_ROUTE: '/workarea/:categoryTypeID',

    /* Shipping Methods */
    ADMIN_GENERICCATEGORY_SHIPPINGTYPE_STATE: 'app.shippingtype',
    ADMIN_GENERICCATEGORY_SHIPPINGTYPE_LABEL: 'Shipping Methods',
    ADMIN_GENERICCATEGORY_SHIPPINGTYPE_ROUTE: '/shippingtype/:categoryTypeID',

    /* Home Menu Category */
    ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_STATE: 'app.homemenucategory',
    ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_LABEL: 'Home Menu Category',
    ADMIN_GENERICCATEGORY_HOME_MENU_CATEGORY_ROUTE: '/homemenucategory/:categoryTypeID',

    /* Payment Terms */
    ADMIN_GENERICCATEGORY_TERMS_STATE: 'app.terms',
    ADMIN_GENERICCATEGORY_TERMS_LABEL: 'Payment Terms',
    ADMIN_GENERICCATEGORY_TERMS_ROUTE: '/terms/:categoryTypeID',

    /* Operation Verification Status */
    ADMIN_GENERICCATEGORY_VERISTATUS_STATE: 'app.verificationstatus',
    ADMIN_GENERICCATEGORY_VERISTATUS_LABEL: 'Operation Verification Status',
    ADMIN_GENERICCATEGORY_VERISTATUS_ROUTE: '/verificationstatus/:categoryTypeID',

    //printer
    ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE: 'app.printer',
    ADMIN_GENERICCATEGORY_PRINTER_TYPE_LABEL: 'Printers',
    ADMIN_GENERICCATEGORY_PRINTER_TYPE_ROUTE: '/printer/:categoryTypeID',

    /* Document Type Methods */
    ADMIN_GENERICCATEGORY_DOCUMENTTYPE_STATE: 'app.documenttype',
    ADMIN_GENERICCATEGORY_DOCUMENTTYPE_LABEL: 'Document Types',
    ADMIN_GENERICCATEGORY_DOCUMENTTYPE_ROUTE: '/documenttype/:categoryTypeID',

    /* Report Category Type */
    ADMIN_GENERICCATEGORY_REPORTCATEGORY_STATE: 'app.reportcategory',
    ADMIN_GENERICCATEGORY_REPORTCATEGORY_LABEL: 'Report Category',
    ADMIN_GENERICCATEGORY_REPORTCATEGORY_ROUTE: '/reportcategory/:categoryTypeID',

    /* Requirements & Comments Category Type */
    ADMIN_GENERICCATEGORY_PARTREQUIREMENTCATEGORY_STATE: 'app.partrequirementcategory',
    ADMIN_GENERICCATEGORY_PARTREQUIREMENTCATEGORY_LABEL: 'Requirements & Comments Category',
    ADMIN_GENERICCATEGORY_PARTREQUIREMENTCATEGORY_ROUTE: '/partrequirementcategory/:categoryTypeID',

    //Label Templates //commented as unused
    //ADMIN_GENERICCATEGORY_PRINTER_FORMAT_STATE: 'app.printformat',
    //ADMIN_GENERICCATEGORY_PRINTER_FORMAT_LABEL: 'Label Templates',
    //ADMIN_GENERICCATEGORY_PRINTER_FORMAT_ROUTE: '/printformat/:categoryTypeID',

    // New Label Templates
    ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE: 'app.labeltemplates',
    ADMIN_LABELTEMPLATE_PRINTER_FORMAT_LABEL: 'Label Templates',
    ADMIN_LABELTEMPLATE_PRINTER_FORMAT_ROUTE: '/labeltemplates',

    //ECO/DFM Type
    ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_STATE: 'app.ecodfmtype',
    ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_LABEL: 'ECO/DFM Type',
    ADMIN_GENERICCATEGORY_ECO_DFM_TYPE_ROUTE: '/ecodfmtype/:categoryTypeID',

    //Charges types
    ADMIN_GENERICCATEGORY_CHARGES_TYPE_STATE: 'app.chargestype',
    ADMIN_GENERICCATEGORY_CHARGES_TYPE_LABEL: 'Charges Type',
    ADMIN_GENERICCATEGORY_CHARGES_TYPE_ROUTE: '/chargestype/:categoryTypeID',

    //Notification category
    ADMIN_GENERICCATEGORY_NOTIFICATION_CATEGORY_STATE: 'app.notificationcategory',
    ADMIN_GENERICCATEGORY_NOTIFICATION_CATEGORY_LABEL: 'Notification Category',
    ADMIN_GENERICCATEGORY_NOTIFICATION_CATEGORY_ROUTE: '/notificationcategory/:categoryTypeID',

    ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_STATE: 'app.paymenttypecategory',
    ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_LABEL: 'Payment Type Category',
    ADMIN_GENERICCATEGORY_PAYMENT_TYPE_CATEGORY_ROUTE: '/paymenttypecategory/:categoryTypeID',

    ADMIN_GENERICCATEGORY_ROUTE: '/genericcategory/:categoryTypeID',
    ADMIN_GENERICCATEGORY_CONTROLLER: 'GenericCategoryController',
    ADMIN_GENERICCATEGORY_VIEW: 'app/main/admin/genericcategory/genericcategory-list.html',

    /*remove*/
    /*ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_STATE: 'app.receivablepaymentmethods',
    ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_LABEL: 'Receivable Payment Methods',
    ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_ROUTE: '/receivablepaymentmethods/:categoryTypeID',*/


    ADMIN_GENERICCATEGORY_PAYMENT_METHODS_STATE: 'app.paymentmethods',
    ADMIN_GENERICCATEGORY_PAYMENT_METHODS_LABEL: 'Payment Methods',
    ADMIN_GENERICCATEGORY_PAYMENT_METHODS_ROUTE: '/paymentmethods',

    ADMIN_GENERICCATEGORY_PAYABLE_PAYMENT_METHODS_STATE: 'app.paymentmethods.payable',
    ADMIN_GENERICCATEGORY_PAYABLE_PAYMENT_METHODS_ROUTE: '/payable/:categoryTypeID',

    ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_STATE: 'app.paymentmethods.receivable',
    ADMIN_GENERICCATEGORY_RECEIVABLE_PAYMENT_METHODS_ROUTE: '/receivable/:categoryTypeID',

    //ADMIN_PAYMENT_METHODS_ROUTE: '/genericcategory/:categoryTypeID',
    ADMIN_PAYMENT_METHODS_CONTROLLER: 'PaymentMethodsController',
    ADMIN_PAYMENT_METHODS_VIEW: 'app/main/admin/payment-methods/payment-methods-list.html',

    ADMIN_LABELTEMPLATES_ROUTE: '/labeltemplates',
    ADMIN_LABELTEMPLATES_CONTROLLER: 'LabelTemplatesController',
    ADMIN_LABELTEMPLATES_VIEW: 'app/main/admin/labeltemplates/labeltemplates-list.html',

    ADMIN_MANAGELABELTEMPLATES_STATE: 'app.labeltemplates.manage',
    ADMIN_MANAGELABELTEMPLATES_ROUTE: '/manage/:id',
    ADMIN_MANAGELABELTEMPLATES_CONTROLLER: 'ManageLabelTemplatesController',
    ADMIN_MANAGELABELTEMPLATES_VIEW: 'app/main/admin/labeltemplates/manage-labeltemplates.html',

    /* Carrier Master */
    ADMIN_GENERICCATEGORY_CARRIERMST_STATE: 'app.carriermst',
    ADMIN_GENERICCATEGORY_CARRIERMST_LABEL: 'Carriers',
    ADMIN_GENERICCATEGORY_CARRIERMST_ROUTE: '/carriermst/:categoryTypeID',

    ADMIN_MANAGEGENERICCATEGORY_ROUTE: '/managegenericcategory/:categoryTypeID/:gencCategoryID',
    //ADMIN_MANAGEGENERICCATEGORY_STATE: 'app.managegenericcategory',
    /* [S] - manage generic category state */
    ADMIN_EQPGROUP_MANAGEGENERICCATEGORY_STATE: 'app.equipmentgroup.managegenericcategory',
    ADMIN_EQPTYPE_TYPE_MANAGEGENERICCATEGORY_STATE: 'app.equipmenttype.managegenericcategory',
    ADMIN_EQPOWNER_MANAGEGENERICCATEGORY_STATE: 'app.equipmentownership.managegenericcategory',
    ADMIN_STANDTYPE_MANAGEGENERICCATEGORY_STATE: 'app.standardtype.managegenericcategory',
    ADMIN_PART_STATUS_MANAGEGENERICCATEGORY_STATE: 'app.partstatus.managegenericcategory',
    ADMIN_BARCODE_SEPARATOR_MANAGEGENERICCATEGORY_STATE: 'app.barcodeseparator.managegenericcategory',
    ADMIN_EMPTITLE_MANAGEGENERICCATEGORY_STATE: 'app.employeetitle.managegenericcategory',
    ADMIN_OPTYPE_MANAGEGENERICCATEGORY_STATE: 'app.operationtype.managegenericcategory',
    ADMIN_SHIPSTATUS_MANAGEGENERICCATEGORY_STATE: 'app.shippingstatus.managegenericcategory',
    ADMIN_LOCATIONTYPE_MANAGEGENERICCATEGORY_STATE: 'app.locationtype.managegenericcategory',
    ADMIN_WORKAREA_MANAGEGENERICCATEGORY_STATE: 'app.workarea.managegenericcategory',
    ADMIN_SHIPPINGTYPE_MANAGEGENERICCATEGORY_STATE: 'app.shippingtype.managegenericcategory',
    ADMIN_TERMS_MANAGEGENERICCATEGORY_STATE: 'app.terms.managegenericcategory',
    ADMIN_VERISTATUS_MANAGEGENERICCATEGORY_STATE: 'app.verificationstatus.managegenericcategory',
    ADMIN_PRINTER_TYPE_MANAGEGENERICCATEGORY_STATE: 'app.printer.managegenericcategory',
    //ADMIN_PRINTER_FORMAT_MANAGEGENERICCATEGORY_STATE: 'app.printformat.managegenericcategory', //commented as unused
    ADMIN_HOME_MENU_CATEGORY_MANAGEGENERICCATEGORY_STATE: 'app.homemenucategory.managegenericcategory',
    ADMIN_DOCUMENT_TYPE_MANAGEGENERICCATEGORY_STATE: 'app.documenttype.managegenericcategory',
    ADMIN_ECO_DFM_TYPE_MANAGEGENERICCATEGORY_STATE: 'app.ecodfmtype.managegenericcategory',
    ADMIN_CARRIERMST_MANAGEGENERICCATEGORY_STATE: 'app.carriermst.managegenericcategory',
    ADMIN_REPORTCATEGORY_MANAGEGENERICCATEGORY_STATE: 'app.reportcategory.managegenericcategory',
    ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE: 'app.partrequirementcategory.managegenericcategory',

    ADMIN_CHARGES_TYPE_MANAGEGENERICCATEGORY_STATE: 'app.chargestype.managegenericcategory',
    ADMIN_NOTIFICATION_CATEGORY_MANAGEGENERICCATEGORY_STATE: 'app.notificationcategory.managegenericcategory',
    ADMIN_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE: 'app.paymentmethods.payable.managegenericcategorypayable',
    ADMIN_RECEIVABLE_PAYMENT_METHODS_MANAGEGENERICCATEGORY_STATE: 'app.paymentmethods.receivable.managegenericcategoryreceivable',
    ADMIN_PAYMENT_TYPE_CATEGORY_MANAGEGENERICCATEGORY_STATE: 'app.paymenttypecategory.managegenericcategory',

    /* [E] - manage generic category state */
    ADMIN_MANAGEGENERICCATEGORY_CONTROLLER: 'ManageGenericCategoryController',
    ADMIN_MANAGEGENERICCATEGORY_VIEW: 'app/main/admin/genericcategory/manage-genericcategory.html',

    ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER: 'GenericCategoryAddPopupController',
    ADMIN_GENERIC_CATEGORY_MODAL_VIEW: 'app/main/admin/genericcategory/generic-category-add-popup.html',

    ADMIN_ADD_EDIT_UNIT_OF_MEASUREMENT_MODAL_VIEW: 'app/main/admin/unit/manage-unit-of-measurement-popup/manage-unit-of-measurement-popup.html',
    ADMIN_ADD_EDIT_UNIT_OF_MEASUREMENT_MODAL_CONTROLLER: 'ManageUnitOfMeasurementPopUpController',

    ADMIN_ADD_EDIT_UNIT_DETAIL_FORMULA_MODAL_VIEW: 'app/main/admin/unit/manage-unit-of-measurement-popup/manage-unit-detail-formula-popup/manage-unit-detail-formula-popup.html',
    ADMIN_ADD_EDIT_UNIT_DETAIL_FORMULA_MODAL_CONTROLLER: 'ManageUnitDetailFormulaPopUpController',

    //ADMIN_INPUT_FIELDS_LABEL: 'Input Fields',
    //ADMIN_INPUT_FIELDS_ROUTE: '/inputfields',
    //ADMIN_INPUT_FIELDS_STATE: 'app.inputfields',
    //ADMIN_INPUT_FIELDS_CONTROLLER: 'InputFieldsController',
    //ADMIN_INPUT_FIELDS_VIEW: 'app/main/admin/inputfields/input-fields.html',
    //ADMIN_INPUT_FIELDS_UPDATE_MODAL_VIEW: 'app/main/admin/inputfields/input-fields-update.html',
    //ADMIN_INPUT_FIELDS_UPDATE_MODAL_CONTROLLER: 'InputFieldsUpdateController',

    ADMIN_DYNAMICMESSAGE_ROUTE: '/dynamicmessage',
    ADMIN_DYNAMICMESSAGE_STATE: 'app.dynamicmessage',
    ADMIN_DYNAMICMESSAGE_CONTROLLER: 'DynamicMessageController',
    ADMIN_DYNAMICMESSAGE_VIEW: 'app/main/admin/dynamic-message-constant/dynamic-message-constant-list.html',

    ADMIN_MANAGE_DYNAMICMESSAGE_MODAL_VIEW: 'app/main/admin/dynamic-message-constant/manage-dynamic-message/manage-dynamic-message-popup.html',
    ADMIN_MANAGE_DYNAMICMESSAGE_MODAL_CONTROLLER: 'ManageDynamicmessagePopupController',

    ADMIN_MANAGE_TIMELINE_MESSAGE_MODAL_VIEW: 'app/main/admin/dynamic-message-constant/manage-timeline-message/manage-timeline-message-popup.html',
    ADMIN_MANAGE_TIMELINE_MESSAGE_MODAL_CONTROLLER: 'ManageTimelineMessagePopupController',

    ADMIN_MANAGE_DYNAMICMESSAGE_DB_POPUP_VIEW: 'app/main/admin/dynamic-message-constant/manage-dynamic-message-db-popup/manage-dynamic-message-db-popup.html',
    ADMIN_MANAGE_DYNAMICMESSAGE_DB_POPUP_CONTROLLER: 'manageDynamicMessageDBPopUpController',

    ADMIN_DYNAMICMESSAGE_HISTORY_POPUP_VIEW: 'app/main/admin/dynamic-message-constant/view-dynamic-message-history-popup/view-dynamic-message-history-popup.html',
    ADMIN_DYNAMICMESSAGE_HISTORY_POPUP_CONTROLLER: 'viewDynamicMessageHistoryPopUpController',

    ADMIN_DYNAMICMESSAGE_USAGE_POPUP_VIEW: 'app/main/admin/dynamic-message-constant/manage-message-usage-detail-popup/manage-message-usage-detail-popup.html',
    ADMIN_DYNAMICMESSAGE_USAGE_POPUP_CONTROLLER: 'manageMessageUsageDetailPopupController',


    //{{vm.loginUser.username}}
    ACCOUNT_LABEL: 'My Profile',

    STANDARDMESSAGE_LABEL: 'Standard Message',
    STANDARDMESSAGE_STATE: 'app.standardmessage',
    STANDARDMESSAGE_ROUTE: '/standardmessage',
    STANDARDMESSAGE_VIEW: 'app/main/admin/standard-message/standard-message.html',
    STANDARDMESSAGE_CONTROLLER: 'StandardMessageController',
    MANAGE_STANDARDMESSAGE_CONTROLLER: 'ManageStandardMessageController',
    MANAGE_STANDARDMESSAGE_VIEW: 'app/main/admin/standard-message/manage-standard-message.html',
    MANAGE_STANDARDMESSAGE_STATE: 'app.standardmessage.manage',
    MANAGE_STANDARDMESSAGE_ROUTE: '/manage/:id',

    //ADMIN_STANDARDMESSAGE_ADD_MODAL_CONTROLLER: 'AddStandardMessagePopupController',
    //ADMIN_STANDARDMESSAGE_ADD_MODAL_VIEW: 'app/main/admin/standard-message/add-standard-message-popup.html',

    //Page Detail
    ADMIN_PAGE_LABEL: 'Page',
    ADMIN_PAGE_ROUTE: '/page',
    ADMIN_PAGE_STATE: 'app.page',
    ADMIN_PAGE_CONTROLLER: 'PageDetailController',
    ADMIN_PAGE_VIEW: 'app/main/admin/page-detail/pagedetail-list.html',

    ADMIN_MANAGEPAGE_ROUTE: '/managepagedetail/:pageID',
    ADMIN_MANAGEPAGE_STATE: 'app.page.managepage',
    ADMIN_MANAGEPAGE_CONTROLLER: 'ManagePageDetailController',
    ADMIN_MANAGEPAGE_VIEW: 'app/main/admin/page-detail/manage-pagedetail.html',

    ASSIGN_FEATURE: 'Assign Features to Page',
    ADMIN_ASSIGN_FEATURES_MODAL_VIEW: 'app/main/admin/page-detail/assign-page-feature/assign-page-feature-popup.html',
    ADMIN_ASSIGN_FEATURES_MODAL_CONTROLLER: 'AssignPageFeaturePopUpController',

    //Page Rights
    ADMIN_PAGERIGHT_LABEL: 'Page Rights',
    ADMIN_PAGERIGHT_STATE: 'app.pageright',
    ADMIN_PAGERIGHT_ROUTE: '/pageright',
    ADMIN_PAGERIGHT_CONTROLLER: 'pageRightController',
    ADMIN_PAGERIGHT_VIEW: 'app/main/admin/page-right/pageright.html',
    ADMIN_PAGERIGHT_ROLE_LABEL: 'Page Rights Role',
    ADMIN_PAGERIGHT_USER_LABEL: 'Page Rights User',

    //Assign Rights & Features
    ADMIN_ASSIGNRIGHTSANDFETURES_LABEL: 'Assign Rights & Features',
    ADMIN_ASSIGNRIGHTSANDFETURES_STATE: 'app.assignrightsandfetures',
    ADMIN_ASSIGNRIGHTSANDFETURES_ROUTE: '/assignrightsandfetures',
    ADMIN_ASSIGNRIGHTSANDFETURES_CONTROLLER: 'assignRightsAndFeturesController',
    ADMIN_ASSIGNRIGHTSANDFETURES_VIEW: 'app/main/admin/assignrightsandfetures/assignrightsandfetures.html',
    ADMIN_ASSIGNRIGHTSANDFETURES_ROLE_LABEL: 'Assign Rights & Features Role',
    ADMIN_ASSIGNRIGHTSANDFETURES_USER_LABEL: 'Assign Rights & Features User',

    //standard class

    //Default profile image path for login user.
    DEFAULT_PROFILE_PATH: 'assets/images/avatars/profile.jpg',

    //Barcode label template
    ADMIN_BARCODE_LABEL_TEMPLATE_LABEL: 'Barcode Template',
    ADMIN_BARCODE_LABEL_TEMPLATE_STATE: 'app.barcodeLabelTemplate',
    ADMIN_BARCODE_LABEL_TEMPLATE_ROUTE: '/barcodeLabelTemplate',
    ADMIN_BARCODE_LABEL_TEMPLATE_CONTROLLER: 'BarcodeLabelTemplateController',
    ADMIN_BARCODE_LABEL_TEMPLATE_VIEW: 'app/main/admin/component/barcode-label-template/barcode-label-template-list.html',
    //Manage barcode label template
    ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_ROUTE: '/managebarcodeLabelTemplate/:id',
    ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_STATE: 'app.barcodeLabelTemplate.managebarcodeLabelTemplate',
    ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_CONTROLLER: 'ManageBarcodeLabelTemplateController',
    ADMIN_MANAGE_BARCODE_LABEL_TEMPLATE_VIEW: 'app/main/admin/component/barcode-label-template/manage-barcode-label-template.html',

    ADD_DESCRIPTION_POPUP_CONTROLLER: 'BarcodeDelimiterDescriptionController',
    ADD_DESCRIPTION_POPUP_VIEW: 'app/main/admin/component/barcode-label-template/add-description-popup.html',

    PRINTER_CONTROLLER: 'PrinterPopUpController',
    PRINTER_VIEW: 'app/main/transaction/receiving-material/add-update-printer.html',

    ADMIN_KEYWORD_LABEL: 'Keyword',
    ADMIN_KEYWORD_ROUTE: '/rfqsetting/keyword',
    ADMIN_KEYWORD_STATE: 'app.keyword',
    ADMIN_KEYWORD_CONTROLLER: 'KeywordController',
    ADMIN_KEYWORD_VIEW: 'app/main/admin/rfq-setting/keyword/keyword.html',
    ADMIN_KEYWORD_ADD_UPDATE_MODAL_CONTROLLER: 'ManageKeywordPopupController',
    ADMIN_KEYWORD_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/keyword/manage-keyword-popup.html',

    //ErrorLog
    ADMIN_ERRORLOG_LABEL: 'Error Logs',
    ADMIN_ERRORLOG_ROUTE: '/errorLogs',
    ADMIN_ERRORLOG_STATE: 'app.errorLogs',
    ADMIN_ERRORLOG_CONTROLLER: 'ErrorLogsController',
    ADMIN_ERRORLOG_VIEW: 'app/main/admin/errorLogs/errorLogs.html',

    //Supplier Limit
    ADMIN_SUPPLIER_LIMIT_LABEL: 'Supplier Call Limits',
    ADMIN_SUPPLIER_LIMIT_ROUTE: '/supplierlimit',
    ADMIN_SUPPLIER_LIMIT_STATE: 'app.supplierlimit',
    ADMIN_SUPPLIER_LIMIT_CONTROLLER: 'SupplierLimitController',
    ADMIN_SUPPLIER_LIMIT_VIEW: 'app/main/admin/supplier-limit/supplier-limit.html',

    ADMIN_COUNTRY_LABEL: 'Country',
    ADMIN_COUNTRY_ROUTE: '/country',
    ADMIN_COUNTRY_STATE: 'app.country',
    ADMIN_COUNTRY_CONTROLLER: 'CountryController',
    ADMIN_COUNTRY_VIEW: 'app/main/admin/country/country.html',
    ADMIN_COUNTRY_ADD_UPDATE_MODAL_CONTROLLER: 'CountryAddUpdatePopupController',
    ADMIN_COUNTRY_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/country/country-add-update-popup.html',


    ADMIN_ROHS_ADD_UPDATE_MODAL_CONTROLLER: 'RohsAddUpdatePopupController',
    ADMIN_ROHS_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/rfq-setting/rohs/rohs-add-update-popup.html',
    //ADMIN_COUNTRY_SELECT_ATLEASE_ONE_PERMISSION: 'Select at least one defect category.',


    //Scanner
    ADMIN_SCANNER_STATE: 'app.Scanner',
    ADMIN_SCANNER_LABEL: 'Scanner',
    ADMIN_SCANNER_ROUTE: '/Scanner',
    ADMIN_SCANNER_CONTROLLER: 'ScannerListController',
    ADMIN_SCANNER_VIEW: 'app/main/admin/Scanner/scanner-list.html',
    SCANNER_ADD_UPDATE_MODAL_CONTROLLER: 'ScannerAddUpdatePopupController',
    SCANNER_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/Scanner/scanner-add-update-popup.html',


    /* Picture Station */
    ADMIN_PICTURE_STATION_STATE: 'app.picturestation',
    ADMIN_PICTURE_STATION_LABEL: 'Picture Station',
    ADMIN_PICTURE_STATION_ROUTE: '/picturestation',
    ADMIN_PICTURE_STATION_VIEW: 'app/main/admin/picture-station/picture-station.html',
    ADMIN_PICTURE_STATION_CONTROLLER: 'PictureStationController',


    //Alias Parts Validation
    ADMIN_ALIAS_PARTS_VALIDATION_STATE: 'app.aliasPartsValidation',
    ADMIN_ALIAS_PARTS_VALIDATION_LABEL: 'Part Alias Validations',
    ADMIN_ALIAS_PARTS_VALIDATION_ROUTE: '/aliaspartsvalidation',
    ADMIN_ALIAS_PARTS_VALIDATION_CONTROLLER: 'AliasPartsValidationListController',
    ADMIN_ALIAS_PARTS_VALIDATION_VIEW: 'app/main/admin/alias-parts-validation/alias-parts-validation-list.html',
    ADMIN_ALIAS_PARTS_VALIDATION_ADD_UPDATE_MODAL_CONTROLLER: 'AliasPartsValidationAddUpdatePopupController',
    ADMIN_ALIAS_PARTS_VALIDATION_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/alias-parts-validation/alias-parts-validation-add-update-popup.html',
    ADMIN_ALIAS_PARTS_VALIDATION_COPY_CONTROLLER: 'CopyAliasPartsValidationsPopupController',
    ADMIN_ALIAS_PARTS_VALIDATION_COPY_VIEW: 'app/main/admin/alias-parts-validation/copy-alias-parts-validation-popup.html',

    //Part Price Break Deatils
    ADMIN_COMPONENT_PRICE_BREAK_DETAILS_CONTROLLER: 'ComponentPriceBreakDetailsController',
    ADMIN_COMPONENT_PRICE_BREAK_DETAILS_VIEW: 'app/main/admin/component/component-price-break-details/component-price-break-details.html',
    ADMIN_COMPONENT_PRICE_BREAK_DETAILS_STATE: 'app.componentpricebreak',
    ADMIN_COMPONENT_PRICE_BREAK_DETAILS_ROUTE: '/rfqsetting/componentpricebreak',
    ADMIN_PRICE_BREAK_ADD_UPDATE_MODAL_CONTROLLER: 'PriceBreakAddUpdatePopupController',
    ADMIN_PRICE_BREAK_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/component/component-price-break-details/price-break-add-update-popup.html',

    //Pucrchase/Incoming Inspection Requirement(s)
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_STATE: 'app.purchaseinspection',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_LABEL: 'Requirements & Comments',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_ROUTE: '/purchaseincominginspectionreq/purchaseinspection',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_CONTROLLER: 'PurchaseInspectionController',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_VIEW: 'app/main/admin/purchase-incoming-inspection-requirement/purchase-inspection/purchase-inspection.list.html',

    //Pucrchase/Incoming Inspection Requirement Template
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_STATE: 'app.purchaseinspectiontemplate',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_LABEL: 'Requirements & Comments Template',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_ROUTE: '/purchaseincominginspectionreq/purchaseinspectiontemplate',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_CONTROLLER: 'PurchaseInspectionTemplateController',
    ADMIN_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_VIEW: 'app/main/admin/purchase-incoming-inspection-requirement/purchase-inspection-template/purchase-inspection-template.list.html',
    COPY_PURCHASE_INSPECTION_TEMPLATE_MODAL_VIEW: 'app/main/admin/purchase-incoming-inspection-requirement/purchase-inspection-template/copy-template-popup.html',
    COPY_PURCHASE_INSPECTION_TEMPLATE_MODAL_CONTROLLER: 'CopyPurchaseInspectionTemplateModalController',

    //Chart of Accounts
    ADMIN_CHART_OF_ACCOUNTS_STATE: 'app.chartofaccounts',
    ADMIN_CHART_OF_ACCOUNTS_ROUTE: '/chartofaccounts',
    ADMIN_CHART_OF_ACCOUNTS_CONTROLLER: 'ChartofAccountsController',
    ADMIN_CHART_OF_ACCOUNTS_VIEW: 'app/main/admin/chartofaccounts/chart-of-accounts-list.html',

    //Account Type
    ADMIN_ACCOUNT_TYPE_STATE: 'app.accounttype',
    ADMIN_ACCOUNT_TYPE_ROUTE: '/accounttype',
    ADMIN_ACCOUNT_TYPE_CONTROLLER: 'AccountTypeController',
    ADMIN_ACCOUNT_TYPE_VIEW: 'app/main/admin/accounttype/account-type-list.html',
    MANAGE_ACCOUNT_TYPE_MODAL_CONTROLLER: 'ManageAccountTypePopupController',
    MANAGE_ACCOUNT_TYPE_MODAL_VIEW: 'app/main/admin/accounttype/manage-account-type-popup.html',

    //Operating Temperature Conversion
    ADMIN_OPERATING_TEMPERATURE_CONVERSION_STATE: 'app.operatingtemperatureconversion',
    ADMIN_OPERATING_TEMPERATURE_CONVERSION_LABEL: 'Operating Temperature Conversion',
    ADMIN_OPERATING_TEMPERATURE_CONVERSION_ROUTE: '/operatingtemperatureconversion',
    ADMIN_OPERATING_TEMPERATURE_CONVERSION_CONTROLLER: 'OperatingTemperatureConversionListController',
    ADMIN_OPERATING_TEMPERATURE_CONVERSION_VIEW: 'app/main/admin/operating-temperature-conversion/operating-temperature-conversion-list.html',
    ADMIN_ADD_UPDATE_OPERATING_TEMPERATURE_CONVERSION_MODAL_CONTROLLER: 'AddUpdateOperatingTemperatureConversionPopupController',
    ADMIN_ADD_UPDATE_OPERATING_TEMPERATURE_CONVERSION_MODAL_VIEW: 'app/main/admin/operating-temperature-conversion/add-update-operating-temperature-conversion-popup.html',
    ADMIN_MANAGE_OPERATING_TEMPERATURE_CONVERSION_POPUP_STATE: 'app.manageoperatingtemperatureconversion',

    //Calibration Details
    ADMIN_CALIBRATION_DETAILS_STATE: 'app.calibrationdetails',
    ADMIN_CALIBRATION_DETAILS_LABEL: 'Calibration Details',
    ADMIN_CALIBRATION_DETAILS_ROUTE: '/calibrationdetails',
    ADMIN_CALIBRATION_DETAILS_CONTROLLER: 'CalibrationDetailsListController',
    ADMIN_CALIBRATION_DETAILS_VIEW: 'app/main/admin/calibration-details/calibration-details-list.html',
    ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_CONTROLLER: 'AddUpdateCalibrationDetailsPopupController',
    ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_VIEW: 'app/main/admin/calibration-details/add-update-calibration-details-popup.html',
    ADMIN_MANAGE_CALIBRATION_DETAILS_POPUP_STATE: 'app.managecalibrationdetails',

    //Supplier Attribute Template
    ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_STATE: 'app.supplierattributetemplate',
    ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_LABEL: 'Supplier Attribute Template',
    ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ROUTE: '/supplierattributetemplate',
    ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_CONTROLLER: 'SupplierAttributeTemplateListController',
    ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_VIEW: 'app/main/admin/supplier-attribute-template/supplier-attribute-template-list.html',
    ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ADD_UPDATE_MODAL_CONTROLLER: 'SupplierAttributeTemplateAddUpdatePopupController',
    ADMIN_SUPPLIER_ATTRIBUTE_TEMPLATE_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/supplier-attribute-template/supplier-attribute-template-add-update-popup.html',

    // Input fields
    ADMIN_INPUTFIELD_LABEL: 'Input Field',
    ADMIN_INPUTFIELD_ROUTE: '/inputfield',
    ADMIN_INPUTFIELD_STATE: 'app.inputfield',
    ADMIN_INPUTFIELD_CONTROLLER: 'InputFieldController',
    ADMIN_INPUTFIELD_VIEW: 'app/main/admin/input-field/input-field.html',
    MANAGE_INPUTFIELD_CONTROLLER: 'ManageInputFieldController',
    MANAGE_INPUTFIELD_VIEW: 'app/main/admin/input-field/manage-input-field.html',
    MANAGE_INPUTFIELD_STATE: 'app.inputfield.manage',
    MANAGE_INPUTFIELD_ROUTE: '/manage/:id',

    //FOB
    ADMIN_FOB_STATE: 'app.fob',
    ADMIN_FOB_LABEL: 'FOB',
    ADMIN_FOB_ROUTE: '/fob',
    ADMIN_FOB_CONTROLLER: 'FOBController',
    ADMIN_FOB_VIEW: 'app/main/admin/fob/fob-list.html',


    // Bank
    ADMIN_BANK_LABEL: 'Bank',
    ADMIN_BANK_STATE: 'app.bank',
    ADMIN_BANK_ROUTE: '/bank',
    ADMIN_BANK_CONTROLLER: 'BankListController',
    ADMIN_BANK_VIEW: 'app/main/admin/bank/bank-list.html',
    ADMIN_BANK_ADD_UPDATE_MODAL_CONTROLLER: 'BankAddUpdatePopupController',
    ADMIN_BANK_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/bank/bank-add-update-popup.html',

    //CAMERA
    ADMIN_CAMERA_STATE: 'app.camera',
    ADMIN_CAMERA_LABEL: 'Camera',
    ADMIN_CAMERA_ROUTE: '/camera',
    ADMIN_CAMERA_CONTROLLER: 'CameraController',
    ADMIN_CAMERA_VIEW: 'app/main/admin/camera/camera-list.html',
    CAMERA_ADD_UPDATE_MODAL_CONTROLLER: 'CameraAddUpdatePopupController',
    CAMERA_ADD_UPDATE_MODAL_VIEW: 'app/main/admin/camera/camera-add-update-popup.html',

    ADMIN_DC_FORMAT_LABEL: 'Date Code Format',
    ADMIN_DC_FORMAT_ROUTE: '/datecodeformat',
    ADMIN_DC_FORMAT_STATE: 'app.datecodeformat',
    ADMIN_DC_FORMAT_CONTROLLER: 'DCFormatController',
    ADMIN_DC_FORMAT_VIEW: 'app/main/admin/dcformat/dcformat-list.html',
    ADMIN_DC_FORMAT_POPUP_CONTROLLER: 'ManageDCFormatPopupController',
    ADMIN_DC_FORMAT_POPUP_VIEW: 'app/main/admin/dcformat/manage-dcformat-popup.html',

    EQUIPMENTWORKSTATION:
    {
      EQUIPMENT: 'Equipment',
      WORKSTATION: 'Workstation'
    },
    ACTIVEINACTIVE:
    {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive'
    },
    BARCODE: [{ Id: 1, Value: '1D' }, { Id: 2, Value: '2D(QR, Datamatrix, etc.)' }],
    BarcodeCategory: [
      { key: 'M', value: 'MFR PN' },
      { key: 'P', value: 'Packing Slip' }
    ],
    DateCodeCategory: [
      { key: 'G', value: 'Gregorian' },
      { key: 'J', value: 'Julian' }
    ],
    DateCodeCategoryDropDown: [
      { id: null, value: 'All' },
      { id: 'Gregorian', value: 'Gregorian' },
      { id: 'Julian', value: 'Julian' }
    ],
    GregorianDateCodeFormatList: [
      { id: 0, value: 'Select' },
      { id: 1, value: 'DD' },
      { id: 2, value: 'WW' },
      { id: 3, value: 'MM' },
      { id: 4, value: 'YY' },
      { id: 5, value: 'YYYY' }
    ],
    JulianDateCodeFormatList: [
      { id: 0, value: 'Select' },
      { id: 1, value: 'DDD' },
      { id: 4, value: 'YY' },
      { id: 5, value: 'YYYY' }
    ],
    RoHSStatusID: 1,
    RoHSMainCategoryId: -1,
    NONRoHSStatusID: -2,
    NonRoHSMainCategoryId: -2,
    PIDCodeInvalidCharacter: '--',
    EmployeeMasterTabs: {
      Detail: { ID: 0, Name: 'detail' },
      Credential: { ID: 1, Name: 'credential' },
      Security: { ID: 2, Name: 'security' },
      RightsSummary: { ID: 3, Name: 'rightsSummary' },
      Department: { ID: 4, Name: 'department' },
      Documents: { ID: 5, Name: 'documents' },
      Workstations: { ID: 6, Name: 'workstations' },
      CustomerMapping: { ID: 7, Name: 'customermapping' },
      OtherDetail: { ID: 8, Name: 'otherdetail' },
      Preference: { ID: 9, Name: 'preferences' },
      UserAgreement: { ID: 10, Name: 'useragreement' }
    },
    PartMasterTabs: {
      Detail: { ID: 0, Name: 'detail' },
      POList: { ID: 1, Name: 'alternategroup' },
      Standard: { ID: 2, Name: 'standards' },
      Document: { ID: 3, Name: 'documents' },
      Comments: { ID: 4, Name: 'comments' },
      DataFields: { ID: 5, Name: 'datafields' },
      OtherDetail: { ID: 6, Name: 'otherdetail' },
      PricingHistory: { ID: 7, Name: 'pricinghistory' },
      AssemblySalesPriceMatrix: { ID: 8, Name: 'assysalespricematrix' },
      SupplierQuote: { ID: 9, Name: 'supplierquote' },
      RFQ: { ID: 10, Name: 'RFQ' },
      BOM: { ID: 11, Name: 'bom' },
      DFM: { ID: 12, Name: 'dfm' },
      OpeningStock: { ID: 13, Name: 'openingstock' },
      UMIDList: { ID: 14, Name: 'umidlist' },
      KitAllocation: { ID: 15, Name: 'kitallocation' },
      WorkorderList: { ID: 16, Name: 'workorderlist' },
      CustomerLOA: { ID: 17, Name: 'customerloa' },
      ApprovedDisapprovedSupplier: { ID: 18, Name: 'approveddisapprovedsupplier' },
      SupplierApiResponse: { ID: 19, Name: 'supplierapiresponse' },
      ComponentHistory: { ID: 20, Name: 'componenthistory' }
    },
    PartMasterAlternateGroupsTabs: {
      PackagingParts: { ID: 0, Name: 'packagingparts' },
      AlternateParts: { ID: 1, Name: 'alternateparts' },
      RoHSReplacementParts: { ID: 2, Name: 'rohsreplacementparts' },
      WhereUsed: { ID: 3, Name: 'whereused' },
      DriveTools: { ID: 4, Name: 'drivetools' },
      ProcessMaterial: { ID: 5, Name: 'processmaterial' },
      CPNList: { ID: 6, Name: 'cpnlist' },
      WhereUsedOther: { ID: 7, Name: 'whereusedother' },
      RequireMatingParts: { ID: 8, Name: 'requirematingparts' },
      PickupPadParts: { ID: 9, Name: 'pickuppad' },
      Program: { ID: 10, Name: 'program' },
      RequireFunctionalTestingParts: { ID: 11, Name: 'requirefunctionaltestingpart' },
      FunctionalEquipmentParts: { ID: 12, Name: 'functionalequipmentspart' },
      PurchaseHistory: { ID: 13, Name: 'purchasehistory' }
    },
    StandardsTabs: {
      Detail: { ID: 0, Name: 'detail', Title: 'Details' },
      Documents: { ID: 1, Name: 'documents', Title: 'Documents' },
      Personnel: { ID: 2, Name: 'personnel', Title: 'Personnel' },
      MISC: { ID: 3, Name: 'misc' }
    },
    EquipmentAndWorkstationTabs: {
      Detail: { ID: 0, Name: 'Detail' },
      MaintenanceSchedule: { ID: 1, Name: 'Maintenance Schedule' },
      CalibrationDetails: { ID: 2, Name: 'Calibration Detail' },
      Document: { ID: 3, Name: 'Documents' },
      DataFields: { ID: 4, Name: 'Data Fields' },
      OtherDetail: { ID: 5, Name: 'MISC' }
    },
    EquipmentAndWorkstationMaintananceScheduleTabs: {
      Usage: { ID: 0, Name: 'Usage' },
      Time: { ID: 1, Name: 'Time' }
    },
    CustomerTabs: {
      Detail: { ID: 0, Name: 'Detail' },
      Addresses: { ID: 1, Name: 'Addresses' },
      WireTransferAddresses: { ID: 2, Name: 'Wire Transfer Address' },
      AutomationAddresses: { ID: 3, Name: 'Addresses (Automation)' },
      //BilingAddress: { ID: 1, Name: 'Bill To' },
      //ShippingAddress: { ID: 2, Name: 'Shipping Address' },
      //RMAShippingAddress: { ID: 3, Name: 'RMA Shipping Address' },
      Contacts: { ID: 4, Name: 'Contacts' },
      OtherDetail: { ID: 5, Name: 'MISC' },
      Standards: { ID: 6, Name: 'Standards' },
      PersonnelMapping: { ID: 7, Name: 'Personnel Mapping' },
      CPN: { ID: 8, Name: 'CPN' },
      LOA: { ID: 9, Name: 'LOA' },
      EmailReportSetting: { ID: 10, Name: 'E-mail Report Setting' },
      Inventory: { ID: 11, Name: 'Inventory' },
      CustomComponentApprovedDisapprovedDetail: { ID: 12, Name: 'Custom Part Disapproved Detail' },
      //RemitTo: { ID: 12, Name: 'Remit To' },
      Documents: { ID: 13, Name: 'Documents' },
      ManufacturerDocuments: { ID: 14, Name: 'MFR Documents' },
      Comments: { ID: 15, Name: 'Comments' },
      History: { ID: 16, Name: 'History' }
    },
    CustomerInventoryTabs: {
      UMIDStock: { ID: 0, Name: 'umidstock', DisplayName: 'UMID Stock' },
      AssemblyStock: { ID: 1, Name: 'assemblystock', DisplayName: 'Assembly Stock' }
    },
    CustomerBilingAddressTabs: {
      Detail: { ID: 0, Name: 'details', Title: 'Details' },
      Address: { ID: 1, Name: 'address', Title: 'Address' }
    },
    CustomerShippingAddressTabs: {
      Detail: { ID: 2, Name: 'shipdetails', Title: 'Details' },
      Address: { ID: 3, Name: 'shipaddress', Title: 'Address' }
    },
    CustomerRMAShippingAddressTabs: {
      Detail: { ID: 4, Name: 'rmashipdetails', Title: 'Details' },
      Address: { ID: 5, Name: 'rmashipaddress', Title: 'Address' }
    },
    DepartmentTabs: {
      Detail: { ID: 0, Name: 'detail' },
      Employee: { ID: 1, Name: 'employee' },
      Geolocations: { ID: 2, Name: 'Geolocations' },
      Misc: { ID: 3, Name: 'misc' }
    },
    PaymentMethodsTabs: {
      Payable: { ID: 0, Name: 'payable' },
      Receivable: { ID: 1, Name: 'receivable' }
    },

    TransactionModesTabs: {
      Payable: {
        Index: 0,
        Name: 'payable',
        modeType: 'RP',
        addButtonLabel: 'Payable Transaction Mode',
        DisplayName: 'Payable',
        IconName: 't-icons-payable-transaction-mode'
      },
      Receivable: {
        Index: 1,
        Name: 'receivable',
        modeType: 'RR',
        addButtonLabel: 'Receivable Transaction Mode',
        DisplayName: 'Receivable',
        IconName: 't-icons-receivable-transaction-mode'
      }
    },
    LoginUserPageListBroadcast: 'loginuserpagelist',
    AssemblyStockListReloadBroadcast: 'assemblystocklistreload',
    SampleListRefreshBroadcast: 'samplelistrefreshbroadcast',
    CalibrationDetailListReloadBroadcast: 'calibrationdetaillistreload',
    SupplierInvoicePaymentSaveBroadcase: 'SupplierInvoicePaymentSaveBroadcase',
    SupplierInvoicePaymentCheckPrintBroadcast: 'SupplierInvoicePaymentCheckPrintBroadcast',
    SupplierInvoicePaymentRemottancePrintBroadcast: 'SupplierInvoicePaymentRemottancePrintBroadcast',
    SupplierInvoiceVoidPaymentBroadcast: 'SupplierInvoiceVoidPaymentBroadcast',
    SupplierInvoiceVoidPaymentSaveSuccessBroadcast: 'SupplierInvoiceVoidPaymentSaveSuccessBroadcast',
    SupplierInvoiceVoidAndReIssuePaymentBroadcast: 'SupplierInvoiceVoidAndReIssuePaymentBroadcast',
    SupplierInvoicePayNowBroadcast: 'SupplierInvoicePayNowBroadcast',
    SupplierInvoicePaymentHistoryRefreshBroadcast: 'SupplierInvoicePaymentHistoryRefreshBroadcast',
    SupplierInvoiceRefundDetailSaveBroadcast: 'SupplierInvoiceRefundDetailSaveBroadcast',
    SupplierInvoiceRefundVoidAndReleaseInvoiceGroupBroadcast: 'SupplierInvoiceRefundVoidAndReleaseInvoiceGroupBroadcast',
    SupplierInvoiceVoidAndReIssueRefundBroadcast: 'SupplierInvoiceVoidAndReIssueRefundBroadcast',
    SupplierInvoiceVoidRefundSaveSuccessBroadcast: 'SupplierInvoiceVoidRefundSaveSuccessBroadcast',
    ComponentGetDetailBroadcast: 'ComponentGetDetailBroadcast',
    ComponentAssySalesPriceSaveBroadcast: 'ComponentAssySalesPriceSaveBroadcast',
    RefreshBoxSRNoUIGridList: 'RefreshBoxSRNoUIGridList',
    RefreshSupplierCustomerList: 'RefreshSupplierCustomerList',
    RefreshManufactureList: 'RefreshManufactureList',
    ApproveSupplierInvoiceBroadcast: 'ApproveSupplierInvoiceBroadcast',
    GenericCategoryListReloadBroadcast: 'GenericCategoryListReloadBroadcast',
    GenericCategoryExportTemplateBroadcast: 'GenericCategoryExportTemplateBroadcast',
    GenericCategoryAddUpdateBroadcast: 'GenericCategoryAddUpdateBroadcast',
    PartMasterAdvanceFilters: {
      RefreshAdvanceFilterData: 'RefreshAdvanceFilterData',
      ClearFilterSelection: 'ClearFilterSelection',
      OnClearFilterReloadListData: 'OnClearFilterReloadListData'
    },
    EmployeeRadioGroup: {
      isExternalEmployee: [{ Key: 'External', Value: true }, { Key: 'Personnel', Value: false }],
      isActive: [{ Key: 'Active', Value: true }, { Key: 'Inactive', Value: false }],
      isFormula: [{ Key: 'Deviation', Value: false }, { Key: 'Formula', Value: true }]
    },
    DepartmentRadioGroup: {
      isParentDeptID: [{ Key: 'Parent Department', Value: false }, { Key: 'Sub Department', Value: true }]
    },
    StandardsRadioGroup: {
      isActive: [{ Key: 'Enable', Value: true }, { Key: 'Disable', Value: false }]
    },
    isPopupOpen: false,
    purchaseInpectionType: [
      { key: 'Template', value: true },
      { key: 'Requirements & Comments', value: false }
    ],
    purchaseInpectionSaveType: {
      Cancel: 'Cancel',
      Append: 'Append',
      Override: 'Override'
    },
    CustomerSupplierManufacture_BillTo_Split_UI: {
      BillToDetailUI: 'tabHeight_Bill_To_Detail_Split',
      BillToAddressUI: 'tabHeight_Bill_To_Adress_Split'
    },
    DefaultUOMMessage: 'Set this UOM as a default unit of stock for {0}.',
    InitialStockNotes: {
      WONumberNotAllowedFormat: 'Note: Pattern WOXXXXX-XX not allowed'
    },
    ADMIN_ASSEBLY_STOCK_DETAIL_LABEL: 'Assembly Stock Detail',
    ADMIN_ASSEBLY_STOCK_DETAIL_STATE: 'app.admin.assemblystock',
    ADMIN_ASSEBLY_STOCK_DETAIL_ROUTE: '/assemblystockdetail',

    //ADMIN_ASSEBLY_OPENING_STOCK_LIST_LABEL: 'Assembly Opening Stock',
    //ADMIN_ASSEBLY_OPENING_STOCK_LIST_STATE: 'app.admin.assemblystock.openingstock',
    //ADMIN_ASSEBLY_OPENING_STOCK_LIST_ROUTE: '/assemblystockdetail/initstock',
    //ADMIN_ASSEBLY_OPENING_STOCK_LIST_CONTROLLER: 'AssemblyOpeningStockListController',
    //ADMIN_ASSEBLY_OPENING_STOCK_LIST_VIEW: '/app/main/admin/assembly-stock/assembly-openingstock-list.html',

    //ADMIN_ASSEBLY_PRODUCTION_STOCK_LIST_LABEL: 'Assembly Production Stock',
    //ADMIN_ASSEBLY_PRODUCTION_STOCK_LIST_STATE: 'app.admin.assemblystock.productionstock',
    //ADMIN_ASSEBLY_PRODUCTION_STOCK_LIST_ROUTE: '/assemblystock/prodstock',
    //ADMIN_ASSEBLY_PRODUCTION_STOCK_LIST_CONTROLLER: 'AssemblyProductionStockListController',
    //ADMIN_ASSEBLY_PRODUCTION_STOCK_LIST_VIEW: '/app/main/admin/assembly-stock/assembly-productionstock-list.html',

    AssemblyStockTabs: {
      OpeningStock: { ID: 0, Name: 'openingStock' },
      ProductionStock: { ID: 1, Name: 'productionStock' }
    },

    ADMIN_TRANSACTION_MODES_METHODS_STATE: 'app.transactionmodes',
    ADMIN_TRANSACTION_MODES_METHODS_LABEL: 'Transaction Modes',
    ADMIN_TRANSACTION_MODES_METHODS_ROUTE: '/transactionmodes',

    ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_STATE: 'app.transactionmodes.payable',
    ADMIN_PAYABLE_TRANSACTION_MODES_METHODS_ROUTE: '/payable',

    ADMIN_RECEIVABLE_TRANSACTION_MODES_METHODS_STATE: 'app.transactionmodes.receivable',
    ADMIN_RECEIVABLE_TRANSACTION_MODES_METHODS_ROUTE: '/receivable',

    ADMIN_TRANSACTION_MODES_CONTROLLER: 'TransactionModesController',
    ADMIN_TRANSACTION_MODES_VIEW: 'app/main/admin/transaction-modes/transaction-modes.html',

    ADMIN_MANAGE_PAYABLE_TRANSACTION_MODES_STATE: 'app.transactionmodes.payable.manage',
    ADMIN_MANAGE_PAYABLE_TRANSACTION_MODES_ROUTE: '/manage/:id',

    ADMIN_MANAGE_RECEIVABLE_TRANSACTION_MODES_STATE: 'app.transactionmodes.receivable.manage',
    ADMIN_MANAGE_RECEIVABLE_TRANSACTION_MODES_ROUTE: '/manage/:id',

    ADMIN_MANAGE_TRANSACTION_MODES_CONTROLLER: 'ManageTransactionModesController',
    ADMIN_MANAGE_TRANSACTION_MODES_VIEW: 'app/main/admin/transaction-modes/manage-transaction-modes.html',

    ADMIN_CONTACT_PERSON_STATE: 'app.contactperson',
    ADMIN_CONTACT_PERSON_LABEL: 'Contact Person',
    ADMIN_CONTACT_PERSON_ROUTE: '/contactperson',
    ADMIN_CONTACT_PERSON_CONTROLLER: 'CotactPersonController',
    ADMIN_CONTACT_PERSON_VIEW: 'app/main/admin/contact-person/contact-person.html',

    ADMIN_EMPLOYEE_CONTACTPERSON_HISTORY_MODAL_CONTROLLER: 'EmployeeContactPersonHistoryPopupController',
    ADMIN_EMPLOYEE_CONTACTPERSON_HISTORY_MODAL_VIEW: 'app/main/admin/contact-person/employee-contactperson-history-popup.html',

    ADMIN_DUPLICATE_CONTACTPERSON_MODAL_VIEW: 'app/main/admin/contact-person/duplicate-contactperson-popup.html',
    ADMIN_DUPLICATE_CONTACTPERSON_MODAL_CONTROLLER: 'DuplicateContactpersonPopupController'
  };
  angular
    .module('app.admin.user')
    .constant('USER', USER);
})();
