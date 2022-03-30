(function () {
  'use strict';
  /** @ngInject */
  var CONFIGURATION = {

    CONFIGURATION_LABEL: 'Configuration',
    CONFIGURATION_ROUTE: '/',
    CONFIGURATION_STATE: 'app.configuration',
    CONFIGURATION_CONTROLLER: '',
    CONFIGURATION_VIEW: '',

    CONFIGURATION_MANUAL_ENTITY_ROUTE: 'forms/:systemGenerated',
    CONFIGURATION_MANUAL_ENTITY_STATE: 'app.configuration.forms',

    CONFIGURATION_ENTITY_LABEL: 'Entity',
    CONFIGURATION_ENTITY_ROUTE: 'entity/:systemGenerated',
    CONFIGURATION_ENTITY_STATE: 'app.configuration.entity',
    CONFIGURATION_ENTITY_CONTROLLER: 'EntityController',
    CONFIGURATION_ENTITY_VIEW: 'app/main/configuration/entity/entity-list.html',

    CONFIGURATION_RAWDATACATEGORY_LABEL: 'ChartRawdatacategory',
    CONFIGURATION_RAWDATACATEGORY_ROUTE: '/chartrawdatacategory',
    CONFIGURATION_RAWDATACATEGORY_STATE: 'app.chartrawdatacategory',
    CONFIGURATION_RAWDATACATEGORY_CONTROLLER: 'ChartRawdataCategoryController',
    CONFIGURATION_RAWDATACATEGORY_VIEW: 'app/main/configuration/chart-rawdata-category/chartrawdata-category-list.html',

    MANAGE_RAWDATACATEGORY_MODAL_VIEW: 'app/main/configuration/chart-rawdata-category/manage-rawdata-category-popup/manage-chartrawdata-category-popup.html',
    MANAGE_RAWDATACATEGORY_MODAL_CONTROLLER: 'ManagerawdatacategoryPopupController',

    MANAGE_ENTITY_MODAL_VIEW: 'app/main/configuration/entity/manage-entity-popup/manage-entity-popup.html',
    MANAGE_ENTITY_MODAL_CONTROLLER: 'ManageEntityPopupController',

    CONFIGURATION_HELPBLOG_LABEL: 'helpblog',
    CONFIGURATION_HELPBLOG_ROUTE: '/helpBlog/:id',
    CONFIGURATION_HELPBLOG_STATE: 'app.helpblog',
    CONFIGURATION_HELPBLOG_CONTROLLER: 'HelpBlogController',
    CONFIGURATION_HELPBLOG_VIEW: 'app/main/configuration/help-blog/help-blog.html',

    /* Manage help blog - once Help blog changes approved need to remove */
    CONFIGURATION_MANAGE_HELP_BLOG_STATE: 'app.helpblog.managehelpblogdetail',
    CONFIGURATION_MANAGE_HELP_BLOG_LABEL: 'Manage Help Blog',
    CONFIGURATION_MANAGE_HELP_BLOG_ROUTE: '/managehelpblogdetail/:pageID',
    CONFIGURATION_MANAGE_HELP_BLOG_CONTROLLER: 'ManageHelpBlogController',
    CONFIGURATION_MANAGE_HELP_BLOG_VIEW: 'app/main/configuration/help-blog/manage-help-blog.html',

    CONFIGURATION_DATAELEMENT_MANAGE_ROUTE: '/elementmanage/:entityID/:dataElementID',
    CONFIGURATION_DATAELEMENT_MANAGE_STATE: 'app.configuration.entity.elementmanage',
    CONFIGURATION_DATAELEMENT_MANAGE_VIEW: 'app/main/configuration/dataelement/dataelement-manage.html',
    CONFIGURATION_DATAELEMENT_MANAGE_CONTROLLER: 'DataElementManageController',
    CONFIGURATION_SUBFORM_ORDER_UPDATE: 'Subform order updated',
    CONFIGURATION_FORMS_DATAELEMENT_MANAGE_STATE: 'app.configuration.forms.elementmanage',

    CONFIGURATION_DATAELEMENT_OPTION_MODAL_VIEW: 'app/main/configuration/dataelement/dataelement-view-option-popup.html',
    CONFIGURATION_DATAELEMENT_OPTION_MODAL_CONTROLLER: 'DataElementViewOptionPopupController',

    CONFIGURATION_DATAELEMENT_VIEW_ROUTE: '/viewelement/:id',
    CONFIGURATION_DATAELEMENT_VIEW_STATE: 'app.viewelement',
    CONFIGURATION_DATAELEMENT_VIEW_VIEW: 'app/main/configuration/dataelement/dataelement-view.html',
    CONFIGURATION_DATAELEMENT_VIEW_CONTROLLER: 'DataElementViewController',

    CONFIGURATION_MANAGE_TEMPLATE_LABEL: 'Manage Template',
    CONFIGURATION_MANAGE_TEMPLATE_STATE: 'app.templates',
    CONFIGURATION_MANAGE_TEMPLATE_ROUTE: '/managetemplate',
    CONFIGURATION_MANAGE_TEMPLATE_CONTROLLER: '',
    CONFIGURATION_MANAGE_TEMPLATE_VIEW: '',

    CONFIGURATION_AGREEMENT_TEMPLATE_LABEL: 'Agreement Template',
    CONFIGURATION_AGREEMENT_TEMPLATE_ROUTE: '/agreementtemplate/:templateType',
    CONFIGURATION_AGREEMENT_TEMPLATE_STATE: 'app.agreement',
    CONFIGURATION_AGREEMENT_TEMPLATE_CONTROLLER: 'AgreementTemplateController',
    CONFIGURATION_AGREEMENT_TEMPLATE_VIEW: 'app/main/configuration/agreement-template/agreement-template.html',

    CONFIGURATION_MAIL_TEMPLATE_ROUTE: '/mailtemplate/:templateType',
    CONFIGURATION_MAIL_TEMPLATE_STATE: 'app.mail',

    CONFIGURATION_MANAGE_SETTINGS_LABEL: 'Settings',
    CONFIGURATION_MANAGE_SETTINGS_ROUTE: '/settings',
    CONFIGURATION_MANAGE_SETTINGS_STATE: 'app.settings',
    CONFIGURATION_MANAGE_SETTINGS_CONTROLLER: 'SettingsController',
    CONFIGURATION_MANAGE_SETTINGS_VIEW: 'app/main/configuration/settings/settings.html',

    CONFIGURATION_CHARTTYPE_ROUTE: '/charttype',
    CONFIGURATION_CHARTTYPE_STATE: 'app.charttype',
    CONFIGURATION_CHARTTYPE_CONTROLLER: 'ChartTypeController',
    CONFIGURATION_CHARTTYPE_VIEW: 'app/main/configuration/chart-type/chart-type.html',

    ENTITY_EMPLOYEE_MODAL_VIEW: 'app/main/configuration/entity/entity-employee-popup/entity-employee-popup.html',
    ENTITY_EMPLOYEE_MODAL_CONTROLLER: 'EntityEmployeePopupController',

    CONFIGURATION_SEARCH_LABEL: 'ConfigureSearch',
    CONFIGURATION_SEARCH_ROUTE: '/configuresearch',
    CONFIGURATION_SEARCH_STATE: 'app.configuresearch',
    CONFIGURATION_SEARCH_CONTROLLER: 'ConfigureSearchController',
    CONFIGURATION_SEARCH_VIEW: 'app/main/configuration/configure-search/configure-search.html',

    CONFIGURATION_AGREEMENT_LABEL: 'Agreement Template',
    CONFIGURATION_AGREEMENT_STATE: 'app.agreementtemplate',
    CONFIGURATION_AGREEMENT_ROUTE: '/agreement/:templateType',
    CONFIGURATION_AGREEMENT_CONTROLLER: 'AgreementEmailTemplateController',
    CONFIGURATION_AGREEMENT_VIEW: 'app/main/configuration/agreement-template/agreement-email-template.html',

    CONFIGURATION_EMAIL_TEMPLATE_LABEL: 'Email Template',
    CONFIGURATION_EMAIL_TEMPLATE_STATE: 'app.emailtemplate',
    CONFIGURATION_EMAIL_TEMPLATE_ROUTE: '/email/:templateType',
    CONFIGURATION_EMAIL_TEMPLATE_CONTROLLER: '',
    CONFIGURATION_EMAIL_TEMPLATE_VIEW: '',

    CONFIGURATION_MANAGE_AGREEMENT_STATE: 'app.agreementtemplate.manage',
    CONFIGURATION_MANAGE_AGREEMENT_ROUTE: '/manage/:agreementTypeID',
    CONFIGURATION_MANAGE_AGREEMENT_EMAIL_CONTROLLER: 'ManageAgreementEmailTemplateController',
    CONFIGURATION_MANAGE_AGREEMENT_EMAIL_VIEW: 'app/main/configuration/agreement-template/manage-agreement-email-template.html',

    CONFIGURATION_MANAGE_EMAIL_STATE: 'app.emailtemplate.manage',
    CONFIGURATION_MANAGE_EMAIL_ROUTE: '/manage/:agreementTypeID',

    MANAGE_AGREEMENT_TYPE_MODAL_VIEW: 'app/main/configuration/agreement-template/manage-agreement-type-popup.html',
    MANAGE_AGREEMENT_TYPE_MODAL_CONTROLLER: 'AgreementTypePopupController',

    ADD_ENTERPRISERECORD_POPUP_CONTROLLER: 'AddEnterpriseRecordPopupController',
    ADD_ENTERPRISE_RECORD_POPUP_VIEW: 'app/main/configuration/configure-search/add-enterprise-record-popup/add-enterprise-record-popup.html',
    /**
     * CONTROLLERS
     */
    CONFIGURATION_EMPTYSTATE: {
      EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
      DATA_ELEMENT: {
        IMAGEURL: 'assets/images/emptystate/manageelement.png',
        MESSAGE: 'No data field is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a data field'
      },
      ENTITY: {
        IMAGEURL: 'assets/images/emptystate/manageelement.png',
        MESSAGE: 'No entity is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a entity'
      },
      FORM: {
        IMAGEURL: 'assets/images/emptystate/manageelement.png',
        MESSAGE: 'No form is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a form',
        UNAUTHORISED: 'You do not have permission to access {0} form',
        UNAUTHORISED_IMAGEURL: 'assets/images/emptystate/unauthorise.png'
      },
      AGREEMENT: {
        IMAGEURL: 'assets/images/emptystate/agreement.png',
        MESSAGE: 'This helps you to customize agreement template.',
        // ADDNEWMESSAGE: 'Click on any template listed left side to view/modify.',
        SEARCH_IMAGE: 'assets/images/emptystate/grid-empty.png'
      },
      HELPBLOG: {
        IMAGEURL: 'assets/images/emptystate/help-blog.png',
        IMAGEURL_PAGE: 'assets/images/emptystate/page-list.png',
        MESSAGE: 'This helps you to customize page details.',
        ADDNEWMESSAGE: 'Click on any page listed left side to view/modify.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        ALL_ASSIGNED: 'No page blog listed yet!',
        SEARCH_IMAGE: 'assets/images/emptystate/grid-empty.png'
      },
      SETTINGS: {
        IMAGEURL: 'assets/images/emptystate/equipment.png',
        MESSAGE: 'No data-key is listed yet!'
      },
      CHARTRAWDATACATEGORY: {
        IMAGEURL: 'assets/images/emptystate/widget-list.png',
        MESSAGE: 'No Report/Widget Data Source is listed yet!'
      },
      MAIL_TEMPLATE: {
        IMAGEURL: 'assets/images/emptystate/mail-template.png',
        MESSAGE: 'This helps you to customize mail template.',
        // ADDNEWMESSAGE: 'Click on any template listed left side to view/modify.',
        SEARCH_IMAGE: 'assets/images/emptystate/grid-empty.png'
      },
      CHARTTYPE: {
        IMAGEURL: 'assets/images/emptystate/equipment.png',
        MESSAGE: 'No chart type is listed yet!'
      },
      ASSIGNEMPLOYEES: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        MESSAGE: 'No personnel are assigned.',
        ALL_ASSIGNED: 'All personnel are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNUSERS: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        MESSAGE: 'No user(s) are assigned yet!',
        ALL_ASSIGNED: 'All user(s) are assigned',
        USER_NOT_EXISTS: 'User(s) does not exists for selected role!',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria'
      },
      ARCHIEVE_VERSION: {
        IMAGEURL: 'assets/images/emptystate/archived-versions-empty.png',
        MESSAGE: 'No archived version is listed yet!'
      },
      AGREED_USER: {
        IMAGEURL: 'assets/images/emptystate/agreed-used-list-empty.png',
        MESSAGE: 'No agreed user is listed yet!'
      }
    },
    Agreement_Template_Type: {
      AGREEMENT: 'agreement',
      EMAIL: 'email',
      USERAGREEMENT: 'useragreement',
      NAME: 'Name'
    },
    HEADER_INFORMATION: {
      NAME: 'Name',
      DRAFT_VERSION: 'Draft Version',
      CURRENT_VERSION: 'Current Version',
      EFFECTIVE_DATE: 'Effective',
      PUBLISHED_VERSION: 'Published Version',
      PUBLISHED_DATE: 'Published Date',
      DESCRIPTION: 'Description',
      AGREED_ON: 'Agreed On',
      AGREED_BY: 'Agreed By',
      VERSION: 'Version',
      PUBLISH_BY: 'Published By',
      PUBLISH_ON: 'Published On',
      SIGNATURE: 'Signature',
      STATUS: 'Status',
      PURPOSE_OF_AGREEMENT: 'Purpose of Agreement',
      WHERE_USED: 'Where Used',
      TERMS_AND_CONDITION: 'Terms and Conditions',
      TEMPLATE: 'Template',
      PUBLISHED: 'Published',
      DRAFT: 'Draft'
    },
    Page_Name: {
      AGREEMENT: 'Agreement',
      EMAIL: 'Email'
    },
    AgreementTemplateTypeID: {

    },
    DefaultPurchasePriceTimes: 5,
    SETTING: {
      ComponentUpdateTimeInHrs: 'ComponentUpdateTimeInHrs',
      RFQInternalVersionMethod: 'RFQInternalVersionMethod',
      RFQInternalVersionPrefixText: 'RFQInternalVersionPrefixText',
      RFQInternalVersionDateFormat: 'RFQInternalVersionDateFormat',
      POvsMRPQtyTolerancePer: 'POvsMRPQtyTolerancePer',
      TermsAndCondition: 'Terms & Condition',
      CountMaterialPercentage: 'CountMaterialPercentage',
      DatePickerDateFormat: 'DatePickerDateFormat',
      TimePickerTimeFormat: 'TimePickerTimeFormat',
      DateTimePickerDateTimeFormat: 'DateTimePickerDateTimeFormat',
      //UnitPriceFilterDecimal: 'UnitPriceFilterDecimal',
      //UnitPriceInputStep: 'UnitPriceInputStep',
      //UnitFilterDecimal: 'UnitFilterDecimal',
      //UnitInputStep: 'UnitInputStep',
      //AmountFilterDecimal: 'AmountFilterDecimal',
      //AmountInputStep: 'AmountInputStep',
      CommonNumberFormat: 'CommonNumberFormat',
      CommonNumberFormat_Label: {
        Amount: 'Amount',
        Unit: 'Unit',
        UnitPrice: 'UnitPrice',
        Decimal: 'Decimal',
        Step: 'Step',
        Report: 'Report',
        SixDigitUnit: 'SixDigitUnit'
      },
      ExpireDaysLeft: 'ExpireDaysLeft',
      FeederStatusAccess: 'FeederStatusAccess',
      ForceToBuyPriceDifferenceXTimeLess: 'ForceToBuyPriceDifferenceXTimeLess',
      AccountingYear: 'AccountingYear',
      AccountingYear_Label: {
        Value: 'Value',
        Type: 'Type',
        StartingMonth: 'StartingMonth'
      },
      Timezone: 'TimeZone',
      DKVersion: 'DKVersion',
      TextAngularKeyCode: 'TextAngularKeyCode',
      UploadDocumentSize: 'UploadDocumentSize',
      CustomerPackingSlipNumber: 'CustomerPackingSlipNumber',
      GroupConcatSeparator: 'GroupConcatSeparator',
      ProductionPNLength: 'productionPNLength',
      InovaxeProductionConnection: 'InovaxeProductionConnection',
      CustomerReceiptInvoiceAutoSelect: 'CustomerReceiptInvoiceAutoSelect',
      CustomerAllowPaymentDays: 'CustomerAllowPaymentDays',
      DefaultTheme: 'DefaultTheme',
      DemoTheme: 'DemoTheme',
      MouserAPIRequestsLimit: 'MouserAPIRequestsLimit',
      NewarkAPIRequestsLimit: 'NewarkAPIRequestsLimit',
      QuoteValidTillDays: 'QuoteValidTillDays',
      DefaultSOPromisedShipDateDays: 'DefaultSOPromisedShipDateDays',
      AuthenticateCheckNumberDuplication: 'AuthenticateCheckNumberDuplication',
      MfgCodeNameFormat: 'MfgCodeNameFormat',
      ShowDigikeyAccessTokenPopupOnLogin: 'ShowDigikeyAccessTokenPopupOnLogin',
      ContactPersonDisplayNameFormat: 'ContactPersonDisplayNameFormat',
      PersonnelNameFormat: 'PersonnelNameFormat',
      MaxUMID: 'MaxUMID',
      UMIDInternalDateCodeFormat: 'UMIDInternalDateCodeFormat',
      KitReleaseWithOtherKitStock: 'KitReleaseWithOtherKitStock',
      VerificationRoleAccess: 'VerificationRoleAccess',
      DeleteRoleAccess: 'DeleteRoleAccess',
      MFRRemoveAccess: 'MFRRemoveAccess',
      DatePickerPaymentReportDateFormat: 'DatePickerPaymentReportDateFormat',
      SupervisorApprovalForUMIDScan: 'SupervisorApprovalForUMIDScan',
      BCCEmailReport: 'BCC Email Report',
      ServerDBMACAddress: 'ServerDBMACAddress',
      BartenderServerPort: 'BartenderServerPort',
      BartenderServer: 'BartenderServer',
      InoAutoServerHeartbeatStatus: 'InoAutoServerHeartbeatStatus',
      PricingServiceStatus: 'PricingServiceStatus'
    },
    SETTINGSDATEFORMAT: {
      MMDDYY: 'MMDDYY',
      YYMMDD: 'YYMMDD'
      // PREFIXMETHOD: 'P',
      // DATEFORMATMETHOD: 'D'
    },
    ACCOUNTINGYEAR: {
      CALENDARYEAR: 'CY',
      FISCALYEAR: 'FY'
    },
    DataElement_Manage_RadioGroup: {
      isRequired: [{ Key: 'Mandatory', Value: true }, { Key: 'Optional', Value: false }],
      isMultiple: [{ Key: 'Multiple', Value: true }, { Key: 'Single', Value: false }],
      isDecimal: [{ Key: 'Decimal Numbers', Value: true }, { Key: 'Only Numbers', Value: false }],
      isDatasource: [{ Key: 'Data Source', Value: true }, { Key: 'Manual Data', Value: false }],
      isFixedEntity: [{ Key: 'Fixed Entity', Value: true }, { Key: 'Custom Forms', Value: false }],
      isAutoIncrement: [{ Key: 'Auto Increment', Value: true }, { Key: 'Manual Increment', Value: false }],
      defaultValue: [{ Key: 'Yes', Value: true }, { Key: 'No', Value: false }],
      isUnique: [{ Key: 'Yes', Value: true }, { Key: 'No', Value: false }]
    },
    CustomerReceiptInvoiceAutoSelectType: {
      ManualSelection: 0,
      ExactMatchSelection: 1,
      ForwardingBalanceSelection: 2
    },
    DataElementNotes: {
      DataSourceName: 'Hint: Data Source binds only custom forms records.'
    }
  };
  angular
    .module('app.configuration.entity')
    .constant('CONFIGURATION', CONFIGURATION);
})();
