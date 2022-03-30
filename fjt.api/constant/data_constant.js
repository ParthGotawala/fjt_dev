/* eslint-disable no-useless-escape */
const { COMMON } = require('../src/constant');
const _ = require('lodash');
const config = require('./../config/config');
const MESSAGE_CONSTANT = require('./message_constant');

// const DATA_CONSTANT = Object.freeze({
const DATA_CONSTANT = {
    EmailPattern: /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,7})$/,
    WebPattern: '^((http|https?|ftp)://)?([a-zA-Z0-9_\-]+)([\.\:][a-zA-Z0-9\%_\-]+)+(([/][a-zA-Z0-9\%\#\!\&\?\=\~\(\)_\-]*)+([\.][a-zA-Z0-9\%\#\!\?\&\=\(\)_\-]+)*)*$',
    PhonePattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
    ProductionPNAllowedCharactersPattern: /[^-+a-zA-Z0-9]/g,
    ProdWONumPatternNotAllowedForOtherTypeWONum: /^WO\d{5}-\d{0,}$/,  // e.g WO00001- || WO00001-1 || WO00001-01 || WO00001-111
    AGREEMENT: {
        NAME: 'Template',
    },
    ROLES_NAME: {
        SUPER_ADMIN: 'Super Admin'
    },
    WORKORDER_ASSY_DESIGNATORS: {
        NAME: 'Designator'
    },
    ASSEMBLY_STOCK: {
        DISPLAYNAME: "Initial Stock",
        NAME: 'Assembly Stock'
    },
    RELEASE_NOTES: {
        DISPLAYNAME: 'Release Notes',
        NAME: 'Release Notes'
    },
    WORKORDER_BOX_SERIAL_NO: {
        NAME: 'Packaging/Box Serial#'
    },
    WORKORDER_SERIAL_NO: {
        NAME: 'Serial#'
    },
    STANDARD_CLASS: {
        DISPLAYNAME: 'Standard category',
        NAME: 'Standard class'
    },
    CertificateStandards: {
        DISPLAYNAME: 'Standard',
        IMAGE_DISPLAYNAME: 'Standard Image',
        NAME: 'Certificate Standards',
        UPLOAD_PATH: './uploads/cert_std/',
        UNIQUE_FIELD_STANDARDTYPE: 'Standard type',
        UNIQUE_FIELD_STANDARDNAME: 'Standard name',
        UNIQUE_FIELD_STANDARDCODE: 'Standard code',
        UNIQUE_FIELD_STANDARDCOLORCODE: 'Color Code'
    },

    CHART_RAWDATA_CATEGORY: {
        NAME: 'Data source',
        REPORT_DATA_SOURCE_NAME: 'Data source'
    },
    HELP_BLOG: {
        NAME: 'Help Blog'
    },
    HELP_BLOG_DETAIL: {
        NAME: 'Help Blog Section'
    },
    RFQ_LINEITEMS_ERRORCODE: {
        DISPLAYNAME: 'BOM Error Code',
        NAME: 'BOM Error Code'
    },
    RFQ_LINEITEMS_ERRORCODE_CATEGORY: {
        DISPLAYNAME: 'Error Code Category',
        NAME: 'Error Code Category'
    },
    RFQ_LINEITEMS_FILTER: {
        DISPLAYNAME: 'Filter',
        NAME: 'RFQ Filter'
    },
    RFQ_LINEITEMS_HEADERS: {
        NAME: 'RFQ Line Items Headers'
    },
    CHART_TEMPLATEMST: {
        NAME: 'Widget',
        OPTIONTYPES: ['Column', 'Expression'],
        DATATYPE: {
            BOOLEAN: ['tinyint'],
            NUMBER: ['int', 'bigint', 'decimal'],
            STRING: ['varchar', 'text'],
            DATE: ['datetime'],
            TIME: ['time']
        },
        TEXT_OPERATOR: {
            EQUALTO: '=',
            NOTEQUALTO: '<>',
            CONTAINS: 'like',
            DOESNOTCONTAIN: 'not like',
            STARTSWITH: 'start with',
            ENDSWITH: 'end with',
            ISNULL: 'is null'
        },
        AXIS_FORMAT: {
            YEAR: { NAME: 'Year', VALUE: '%Y' },
            MONTH: { NAME: 'Month', VALUE: '%b %Y' },
            DATE: { NAME: 'Date', VALUE: '%m/%d/%Y' }
        }
    },
    CHART_TYPEMST: {
        NAME: 'Chart type'
    },
    CHART_CATEGORY: {
        NAME: 'Chart Category'
    },
    CHART_TEMPLATE_EMPLOYEE_DETAIL: {
        NAME: 'Widget setting'
    },
    CHART_RAWDATA_CATEGORY_FIELDS: {
        AGGREGATE: {
            GROUP: 'GROUP',
            SUM: 'SUM'
        }
    },
    CHART_TEMPLATE_ACCESS: {
        NAME: 'Chart template access personnel'
    },
    CHAT: {
        NAME: 'Chat'
    },
    GROUP_CHAT_LOG: {
        NAME: 'Group Chat',
        REMARKFLAG: {
            NEW_MESSAGE: 'M',
            SPECIAL_MESSAGE: 'S'
        }
    },
    GROUP_CHAT: {
        NAME: 'Group'
    },
    GROUP_PARTICIPANT: {
        NAME: 'Group Participant'
    },
    STANDARD_MESSAGE: {
        NAME: 'Standard message',
        UNIQUE_FIELD_MESSAGE: 'Predefined chat message'
    },
    CUSTOMER_TYPE: {
        CUSTOMER: '1',
        SUPPLIER: '0'
    },
    CATEGORY_TYPE: {
        ECO: 1,
        QUOTETERMSCONDITIONS: 2
    },
    CUSTOMER: {
        NAME: 'Customer',
        CUSTOMERCODE: 'Customer Code',
        SUPPLIERCODE: 'Supplier Code'
    },
    SUPPLIER: {
        NAME: 'Supplier'
    },
    CUSTOMER_ADDRESSES: {
        NAME: 'address',
        BILLING: 'Billing address',
        SHIPPING: 'Shipping address'
    },
    CUSTOMER_ADDRESSES_TYPE: {
        B: 'Billing address',
        S: 'Shipping address',
        P: 'Remit To address',
        R: 'RMA Shipping address',
        I: 'Intermediate Shipping address',
        W: 'Wire Transfer address',
        BU: 'Business address',
        RI: 'RMA Intermediate address'

    },
    ADDRESSES_TYPE: {
        BILLING_ADDRESS: 'B',
        SHIPPING_ADDRESS: 'S',
        PAY_TO_ADDRESS: 'P',
        RMA_SHIPPING_ADDRESS: 'R'
    },
    CUSTOMER_CONTACTPERSON: {
        NAME: 'Contact person',
        REF_TABLE_NAMES: {
            Personnel: 'employees'
        }
    },
    CUSTOMER_CPN: {
        NAME: 'Customer part number',
        MFG_PN_MAPPING: 'Customer MFR part mapping'
    },
    COMPANY_PROFILE: {
        NAME: 'Company profile',
        UPLOAD_PATH: './uploads/company/'
    },
    INVALID_MFG: {
        NAME: 'MFR mapping',
        MFG_MAPPING: 'MFR mapping'
    },
    DATAELEMENT: {
        NAME: 'Data field',
        Name_Format: '{0}{1}'
    },
    DATAELEMENT_KEYVALUES: {
        NAME: 'Key values {0}'
    },
    DATAELEMENT_TRANSACTIONVALUES: {
        NAME: 'Miscellaneous details',
        DYNAMIC_NAME: '{0} miscellaneous details'
    },
    DATAELEMENT_TRANSACTIONVALUES_MANUAL: {
        NAME: 'Manual data field transaction values'
    },
    DATAENTRY_CHANGE_AUDITLOG: {
        NAME: 'History'
    },
    DEFECT_CATEGORY: {
        NAME: 'Defect Category',
        UNIQUE_FIELD: 'Defect Category Name',
        UNIQUE_FIELD_NAME: 'Defect Category Name',
        UNIQUE_FIELD_ORDER: 'Defect category order',
        UNIQUE_FIELD_COLORCODE: 'Color Code'
    },
    WORKORDER_NARRATIVE_HISTORY: {
        NAME: 'Workorder Narrative History'
    },
    EMPLOYEE_DEPARTMENT: {
        NAME: 'Personnel department'
    },
    EMPLOYEE_RESPONSIBILITY: {
        NAME: 'Personnel responsibility'
    },
    EMPLOYEE: {
        NAME: 'Employee',
        DISPLYNAME: 'Personnel',
        UPLOAD_PATH: './uploads/emp/',
        DOWNLOAD_PATH: './default/csv/',
        UNIQUE_FIELD: 'Personnel User ID'
    },
    EMPLOYEE_EQUIPMENT: {
        NAME: 'Personnel equipment'
    },
    DEPARTMENT: {
        NAME: 'Department',
        UNIQUE_FIELD: 'Department name'
    },
    ECO_REQUEST_DEPARTMENT_APPROVAL: {
        NAME: 'Department approval request'
    },
    ECO_REQUEST: {
        NAME: 'ECO request',
        STATUS: {
            Pending: 'P',
            Closed: 'C'
        }
    },
    DFM_REQUEST: {
        NAME: 'DFM request',
        STATUS: {
            Pending: 'P',
            Closed: 'C'
        }
    },
    ECO_REQUEST_TYPE_VALUES: {
        NAME: 'ECO request type value'
    },
    ECO_TYPE_CATEGORY: {
        NAME: 'ECO/DFM category'
    },
    QUOTE_TERMS_CONDITIONS_CATEGORY: {
        NAME: 'Quote terms & conditions category'
    },
    ECO_TYPE_VALUES: {
        NAME: 'ECO/DFM category attribute'
    },
    QUOTE_TERMS_CONDITIONS_ATTRIBUTE: {
        NAME: 'Quote terms & conditions category attribute'
    },
    PART_PICTURE: {
        UPLOAD_PATH: './uploads/pictureStation'
    },
    GENERIC_FILE: {
        NAME: 'Document',
        UPLOAD_PATH: './uploads/genericfiles',
        UPLOAD_API_PATH: './uploads/genericfiles',
        DOWNLOAD_ZIP_FILE_CREATE_API_PATH: './uploads/downloadzipfile/',
        DuplicateFileCopyAction: {
            Replace_File: {
                Key: 'Replace the file(s) in the destination',
                Value: 'RFD'
            },
            Skip_File: {
                Key: 'Skip these file(s)',
                Value: 'STF'
            },
            Keep_Both_File: {
                Key: 'Keep both file(s)',
                Value: 'KBF'
            }
        }
    },
    RESUMABLE_UPLOAD_STATUS: {
        DONE: 'done',
        PARTLY_DONE: 'partly_done'
    },
    GENERIC_FOLDER: {
        NAME: 'Folder'
    },
    EQUIPMENT: {
        UPLOAD_PATH: './uploads/equip/',
        DOWNLOAD_PATH: './default/csv/'
    },
    GENERICCATEGORY: {
        UPLOAD_PATH: './uploads/modelErrorFile/',
        EQUIPMENT_OWNERSHIP: {
            SYSTEM_GENERATED_DATA: {
                Loan: 'Loan',
                Customer: 'Customer',
                FlexTron: 'FlexTron',
                Small_Tools: 'Small Tools',
                Inspection_Requirment_report: 'Inspection Requirement Report'
            }
        }
    },
    NOTIFICATIONMST: {
        NAME: 'Notification',
        REQUEST_STATUS: {
            PENDING: 'P',
            ACCEPTED: 'A',
            REJECTED: 'R'
        },
        MESSAGETYPE: {
            WO_REVIEW: { // DONE
                TYPE: 'WO-REVIEW-REQ',
                SUBTYPE: 'AR',
                SUBJECT: 'You have a new review request for Initial Draft {0} from {1}',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/details/{0}/{1}/true',
                MESSAGE: 'Initial Draft'
            },
            // Is Active - True
            WO_CHANGE_REVIEW: { // DONE
                TYPE: 'WO-CHANGE-REQ-COMMENT',
                SUBTYPE: 'AR',
                SUBJECT: 'Change request comment is added by {0} for {1}. Please review and approve.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/details/{0}/{1}/true',
                REDIRECTURL_OPERATION: '/workorders/manage/operation/details/{0}/{1}/{2}',
                MESSAGE: '{0}' // added request message
            },
            // Is Active - True
            WO_REVIEW_COMMENT: {
                TYPE: 'WO-REVIEW-COMMENT',
                SUBTYPE: 'AR',
                SUBJECT: '{0} review comment',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/details/{0}/{1}/true'
            },
            // Is Active - True
            WO_REVIEW_COMMENT_STATUS: { // DONE
                TYPE: 'WO-REVIEW-COMMENT-STATUS',
                SUBTYPE: null,
                // SUBJECT: 'WO# {0} review comment {1}.',
                SUBJECT: 'Your review comment request is {0} for {1} by {2}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/details/{0}/{1}/true',
                MESSAGE: null
            },
            // Is Active - True
            WO_REVIEW_STATUS: {
                TYPE: 'WO-REVIEW-STATUS',
                SUBTYPE: null,
                SUBJECT: '{0} review {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/details/{0}/{1}/true',
                MESSAGE: '{0} review {1}.'
            },
            // Is Active - False
            WO_TRANS_ASSY_DEFECT: {
                TYPE: 'WO-OP-ASSEMBLY-DEFECT-ADDED',
                SUBTYPE: null,
                SUBJECT: '{0} defect.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: null,
                MESSAGE: '{0} defect added.'
            },
            // Is Active - False
            WO_ASSY_DESIGNATOR: {
                TYPE: 'WO-ASSY-DESIGNATOR',
                SUBTYPE: null,
                SUBJECT: '{0} designator.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: null,
                MESSAGE: '{0} designator added.'
            },
            WO_ASSY_DESIGNATOR_UPDATE: {
                TYPE: 'WO-ASSY-DESIGNATOR-UPDATE',
                SUBTYPE: null,
                SUBJECT: '{0} designator.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: null,
                MESSAGE: '{0} designator updated.'
            },
            // Is Active - False
            WO_ASSY_DESIGNATOR_REMOVE: {
                TYPE: 'WO-ASSY-DESIGNATOR-REMOVE',
                SUBTYPE: null,
                SUBJECT: '{0} designator.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: null,
                MESSAGE: '{0} designator removed.'
            },
            // Is Active - True
            WO_OP_VERSION_CHANGE: { // DONE
                TYPE: 'WO-OP-VERSION-CHANGE',
                SUBTYPE: 'A',
                // SUBJECT: 'WO# {0} OP# {1} changed',
                SUBJECT: 'You have new notification on version change for {0} in {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/operation/details/{0}',
                MESSAGE: null
            },
            // Is Active - True
            WO_VERSION_CHANGE: { // DONE
                TYPE: 'WO-VERSION-CHANGE',
                SUBTYPE: 'A',
                // SUBJECT: 'WO# {0} changed',
                SUBJECT: 'You have new notification on version change for {0}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/details/{0}/',
                MESSAGE: null
            },
            // Is Active - True
            ECO_DEPT_APPROVAL: { // DONE
                TYPE: 'ECO-DEPARTMENT-APPROVAL',
                SUBTYPE: null,
                // SUBJECT: 'ECO {0} approval request',
                SUBJECT: 'You have new notification on new ECO {0} change request approval for {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/ecorequest/detail/{0}/{1}/',
                MESSAGE: 'Please review ECO {0} and give your approval.'

            },
            DFM_DEPT_APPROVAL: {
                TYPE: 'DFM-DEPARTMENT-APPROVAL',
                SUBTYPE: null,
                // SUBJECT: 'DFM {0} approval request',
                SUBJECT: 'You have new notification on new DFM {0} change request approval for {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/dfmrequest/detail/{0}/{1}/',
                MESSAGE: 'Please review DFM {0} and give your approval.'
            },
            // Is Active - True
            ECO_DEPT_APPROVAL_ACK: { // DONE
                TYPE: 'ECO-DEPARTMENT-APPROVAL-ACK',
                SUBTYPE: null,
                // SUBJECT: 'ECO {0} request approved',
                SUBJECT: 'You have new notification on ECO {0} change request approval for {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/ecorequest/detail/{0}/{1}/',
                // MESSAGE: 'Assy# {0} ECO {1} request approved'
                MESSAGE: 'ECO {0} is approved by {1}.'
            },
            DFM_DEPT_APPROVAL_ACK: {
                TYPE: 'DFM-DEPARTMENT-APPROVAL-ACK',
                SUBTYPE: null,
                // SUBJECT: 'DFM {0} request approved',
                SUBJECT: 'You have new notification on DFM {0} change request approval for {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/dfmrequest/detail/{0}/{1}/',
                // MESSAGE: 'Assy# {0} DFM {1} request approved'
                MESSAGE: 'DFM {0} is approved by {1}.'
            },
            // Is Active - True
            ECO_REQUEST_STATUS: { // DONE
                TYPE: 'ECO-REQ-STATUS',
                SUBTYPE: null,
                SUBJECT: 'You have new notification on ECO {0} - {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/ecorequest/detail/{0}/{1}/',
                MESSAGE: 'ECO change request is {0}.'
            },
            DFM_REQUEST_STATUS: {
                TYPE: 'DFM-REQ-STATUS',
                SUBTYPE: null,
                SUBJECT: 'You have new notification on DFM {0} - {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/dfmrequest/detail/{0}/{1}/',
                MESSAGE: 'DFM change request is {0}.'
            },
            // Is Active - True
            WO_OP_TEAM_CHECKIN: {
                TYPE: 'WO-OP-TEAM-START-ACTIVITY',
                SUBTYPE: 'A',
                SUBJECT: '{0} start operation activity.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: '{0} start operation activity.'
            },
            // Is Active - True
            WO_OP_TEAM_CHECKOUT: {
                TYPE: 'WO-OP-TEAM-STOP-ACTIVITY',
                SUBTYPE: 'A',
                SUBJECT: '{0} stop operation activity.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: '{0} stop operation activity.'
            },
            // Is Active - True
            WO_OP_TEAM_PAUSE: {
                TYPE: 'WO-OP-TEAM-PAUSE-ACTIVITY',
                SUBTYPE: 'A',
                SUBJECT: '{0} pause operation activity.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: '{0} pause operation activity.'
            },
            // Is Active - True
            WO_OP_TEAM_RESUME: {
                TYPE: 'WO-OP-TEAM-RESUME-ACTIVITY',
                SUBTYPE: 'A',
                SUBJECT: '{0} resume operation activity.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: '{0} resume operation activity.'
            },
            // Is Active - True
            WO_OP_HOLD: { // DONE
                TYPE: 'HALT-WO-OP',
                SUBTYPE: 'A',
                SUBJECT: '{0} in {1} is halted.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.WorkorderTransOperationHoldUnhold
            },
            // Is Active - True
            WO_OP_UNHOLD: { // DONE
                TYPE: 'RESUME-WO-OP',
                SUBTYPE: 'A',
                SUBJECT: '{0} in {1} is resumed.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.WorkorderTransOperationHoldUnhold
            },
            // Is Active - True
            WO_START: { // DONE
                TYPE: 'RESUME-WO',
                SUBTYPE: 'A',
                SUBJECT: '{0} is started',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.WorkorderTransHoldUnhold
            },
            // Is Active - True
            WO_STOP: { // DONE
                TYPE: 'HALT-WO',
                SUBTYPE: 'A',
                SUBJECT: '{0} is halted',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.WorkorderTransHoldUnhold
            },
            PO_START: {
                TYPE: 'RESUME-PO',
                SOCKET: 'resumePO:receive',
                SUBTYPE: 'A',
                SUBJECT: 'RESUME-PO PO# {0},SO# {1} Assy ID: {2}, Comment: {3}',
                JSONDATA: (data) => {
                    return JSON.stringify(data);
                },
                REDIRECTURL: '/transaction/salesorder/salesorder/manage/{0}',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            PO_STOP: {
                TYPE: 'HALT-PO',
                SOCKET: 'haltPO:receive',
                SUBTYPE: 'A',
                SUBJECT: 'HALT-PO PO# {0},SO# {1} Assy ID: {2}, Comment: {3}',
                JSONDATA: (data) => {
                    return JSON.stringify(data);
                },
                REDIRECTURL: '/transaction/salesorder/salesorder/manage/{0}',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            KIT_ALLOCATION_START: {
                TYPE: 'RESUME-KIT ALLOCATION',
                SOCKET: 'resumeKitAllocation:receive',
                SUBTYPE: 'A',
                SUBJECT: 'RESUME-KIT ALLOCATION PO# {0},SO# {1} Assy ID: {2}, Comment: {3}',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/transaction/kitallocation/{0}/{1}/',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            KIT_ALLOCATION_STOP: {
                TYPE: 'HALT-KIT ALLOCATION',
                SOCKET: 'haltKitAllocation:receive',
                SUBTYPE: 'A',
                SUBJECT: 'HALT-KIT ALLOCATION PO# {0},SO# {1} Assy ID: {2}, Comment: {3}',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/transaction/kitallocation/{0}/{1}/',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            KIT_RELEASE_START: {
                TYPE: 'RESUME-KIT RELEASE',
                SOCKET: 'resumeKitRelease:receive',
                SUBTYPE: 'A',
                SUBJECT: 'RESUME-KIT RELEASE PO# {0},SO# {1} Assy ID: {2}, Comment: {3}',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/transaction/kitallocation/{0}/{1}/',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            KIT_RELEASE_STOP: {
                TYPE: 'HALT-KIT RELEASE',
                SOCKET: 'haltKitRelease:receive',
                SUBTYPE: 'A',
                SUBJECT: 'HALT-KIT RELEASE PO# {0},SO# {1} Assy ID: {2}, Comment: {3}',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/transaction/kitallocation/{0}/{1}/',
                MESSAGE: 'Reason: {0}',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            SUPPLIER_INVOICE_START: {
                TYPE: 'RESUME-SUPPLIER INVOICE',
                SOCKET: 'resumeSupplierInvoice:receive',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            SUPPLIER_INVOICE_STOP: {
                TYPE: 'HALT-SUPPLIER INVOICE',
                SOCKET: 'haltSupplierInvoice:receive',
                refTable: COMMON.DBTableName.HoldUnholdTrans
            },
            CHAT_MESSAGE: {
                TYPE: 'chat-message'
            },
            // Is Active - False
            WO_TRANS_PREPROG_COMP: {
                TYPE: 'WO-OP-PRE-PROG-COMPONENT-ADDED',
                SUBTYPE: null,
                SUBJECT: '{0} component.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: null,
                MESSAGE: '{0} component added.'
            },
            // Is Active - False
            WO_PREPROG_COMP_DESIGNATOR: {
                TYPE: 'WO-PRE-PROG-COMP-DESIGNATOR-ADD',
                SUBTYPE: null,
                SUBJECT: '{0} designator.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: null,
                MESSAGE: '{0} designator added.'
            },
            // Is Active - False
            WO_PREPROG_COMP_DESIGNATOR_REMOVE: {
                TYPE: 'WO-PRE-PROG-COMP-DESIGNATOR-REMOVE',
                SUBTYPE: null,
                SUBJECT: '{0} designator.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: null,
                MESSAGE: '{0} designator removed.'
            },
            // Is Active - True
            SHIPPING_REQ_EMP_DET: { // DONE
                TYPE: 'SHIPPING-REQ-PERSONNEL-DET',
                SUBTYPE: null,
                SUBJECT: 'You have new notification for shipping approval from {0}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/transaction/requestforship/managerequestforship/approval/{0}',
                MESSAGE: 'You have new notification for shipping approval from {0}.'
            },
            // Is Active - True
            ACK_SHIPPING_REQ_EMP_DET: { // DONE
                TYPE: 'ACK-SHIPPING-REQ-PERSONNEL-DET',
                SUBTYPE: null,
                SUBJECT: 'Shipping approval request is approved by {0}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/transaction/requestforship/managerequestforship/detail/{0}',
                MESSAGE: 'Shipping approval request is approved by {0}'
            },
            // Is Active - True
            SHIPPING_REQ_STATUS: { // DONE
                TYPE: 'SHIPPING-REQ-STATUS',
                SUBTYPE: null,
                SUBJECT: 'Shipping request status is changed to {0} from {1}.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/transaction/requestforship/managerequestforship/detail/{0}',
                MESSAGE: 'Shipping request status is changed to {0} from {1}.'
            },
            WO_PRODUCTION_START_AS_FIRST_CHECKIN: {
                TYPE: 'wo-production-start-as-first-checkin'
            },
            WO_OP_TEAM_REPROCESS_QTY_UPDATE: {
                TYPE: 'WO-OP-TEAM-UPDATE-REPROCESS-QTY',
                SUBTYPE: null,
                SUBJECT: '{0} reprocess required quantity changed.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: '{0} reprocess required quantity changed.'
            },
            // Is Active - True
            EMPLOYEE_DETAIL_CHANGE: {

                TYPE: 'PERSONNEL-DET-CHANGE',
                SUBTYPE: 'A',
                SUBJECT: 'Employee details changed.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/employee/manage/security/{0}',
                MESSAGE: 'Person is require re-login in all active session. Do you want to save and notify Person?'
            },
            // Is Active - True
            EMPLOYEE_DEFAULT_ROLE_CHANGE: {
                TYPE: 'PERSONNEL-DEFAULT-ROLE-CHANGE',
                SUBTYPE: 'A',
                SUBJECT: 'Employee default role changed.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/employee/manage/security/{0}',
                MESSAGE: 'Person is require re-login in all active session due to default role changed. Do you want to save and notify Person?'
            },
            // DPMO changes notification
            WO_REWORK_OP_DEFECT_CHANGE_DPMO: {
                TYPE: 'wo_rework_op_defect_change_dpmo'
            },
            // Is Active - True
            UMID_RESTRICT: {
                TYPE: 'UMID-RESTRICT',
                SUBTYPE: null,
                SUBJECT: 'UMID {0}, {1} restrict to used which is assign in kit {2}. Please check your kit shortage.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'transaction/receivingmaterial/list/0/0',
                MESSAGE: null
            },
            // Is Active - True
            EQUIPMENT_ONLINE: {
                TYPE: 'EQUIPMENT-ONLINE',
                SUBTYPE: 'A',
                SUBJECT: 'Equipment {0} is online.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: '{0} Equipment {1} is online.'
            },
            // Is Active - True
            EQUIPMENT_OFFLINE: {
                TYPE: 'EQUIPMENT-OFFLINE',
                SUBTYPE: 'A',
                SUBJECT: 'Equipment {0} is offline.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: 'task/tasklist/travel/{0}/{receiverID}/{0}',
                MESSAGE: '{0} Equipment {1} is offline.'
            },
            WO_REVIEW_CO_OWNER: { // DONE
                TYPE: 'WO-CO-OWNER-ADD',
                SUBTYPE: 'AR',
                SUBJECT: 'Added as Co-Owner of {0}',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/invitepeople/{0}/',
                MESSAGE: 'User {0} has set as co-owner to you of {1}, now you will get all change request notification and allow to accept/decline of change request notification of {1}.'
            },
            WO_REVIEW_CO_OWNER_REMOVE: { // DONE
                TYPE: 'WO-CO-OWNER-REMOVE',
                SUBTYPE: 'AR',
                SUBJECT: 'Removed Co-Owner rights from {0}',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/workorders/manage/invitepeople/{0}/',
                MESSAGE: 'User {0} has removed your co-owner rights of {1}, You will not able to perform any activity and will not get any notification related to owner.'
            },
            ACKNOWLEDGED: {
                TYPE: 'ACKNOWLEDGED'
            },
            REMOVE_EMP_FROM_WO_REQ_REVIEW: {
                TYPE: 'REMOVE_EMP_WO_REQ_REVIEW'
            },
            // Is Active - True
            RATE_LIMIT_EXCEED: { // DONE
                TYPE: 'RATE-LIMIT-EXCEED',
                SUBTYPE: 'AR',
                SUBJECT: 'Rate limit exceeds',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/settings',
                MESSAGE: '{0} external API call limit exceeds on {1} for Application {2}.',
                MESSAGEPRICE: 'It will effect in BOM part costing process.',
                MESSAGEBOM: 'It will effect in BOM cleaning process.',
                MESSAGEPART: 'It will effect in Part Master get data from cloud and Part update schedule.'
            },
            ANY_NOTIFICATION_READ: {
                TYPE: 'ANY-NOTIFICATION-READ'
            },
            CUSTOM_FORM_STATUS_CHANGE: {
                TYPE: 'ENTITY-STATUS-CHANGE',
                SUBTYPE: 'AR',
                SUBJECT: 'Custom Form "{0}" status changed.',
                JSONDATA: data => JSON.stringify(data),
                REDIRECTURL: '/customformsentity/dataelementlist/{0}',
                MESSAGE: 'Please check custom form status changed.'
            }
        },
        NotiAssyWODisplayFormat: 'Assy#: {0} Assy ID: {1} Nickname: {2}',
        NotiWODisplayFormat: 'WO#: {0}[{1}]',
        NotiWOOPDisplayFormat: 'OP#: {0}[{1}]'
    },
    OPERATION: {
        NAME: 'Operation',
        UPLOAD_PATH: './uploads/operation/images/',
        UNIQUE_FIELD: 'Operation#'
    },
    FEATURE: {
        NAME: 'Features'
    },
    ROLE: {
        NAME: 'Role'
    },
    RIGHTS: {
        NAME: 'Rights'
    },
    PAGE_RIGHTS: {
        NAME: 'Page rights'
    },
    PAGE_DETAIL: {
        NAME: 'Page detail'
    },
    UOM: {
        NAME: 'Unit of measurement',
        TableName: 'Uoms'
    },
    UNIT_DETAIL_FORMULA: {
        NAME: 'Unit formula detail'
    },
    WORKORDER: {
        NAME: 'Work Order',
        WOSTATUS: {
            DRAFT: 0,
            PUBLISHED: 1,
            COMPLETED: 2,
            VOID: 4,
            UNDER_TERMINATION: 6,
            TERMINATED: 7
        },
        WOSUBSTATUS: {
            DRAFT: 0,
            PUBLISHED: 1,
            COMPLETED: 2,
            VOID: 4,
            DRAFTREVIEW: 5,
            UNDER_TERMINATION: 6,
            TERMINATED: 7,
            PUBLISHED_DRAFT: 8,
            COMPLETED_WITH_MISSING_PART: 9
        },
        UNIQUE_FIELD: 'WO#',
        SERIAL_NUMBER: 'Work order serial#'
    },
    WORKORDER_COOWNER: {
        NAME: 'Co-Owner(s)'
    },
    WORKORDER_CERTIFICATION: {
        NAME: 'Work Order: Standards'
    },
    WORKORDER_CLUSTER: {
        NAME: 'Work Order: Cluster'
    },
    WORKORDER_OPERATION_CLUSTER: {
        NAME: 'Work Order Cluster: Operation'
    },
    WORKORDER_OPERATION_EMPLOYEE: {
        NAME: 'Work Order: Personnel'
    },
    WORKORDER_OPERATION_EQUIPMENT: {
        NAME: 'Work Order: Equipment(s)'
    },
    WORKORDER_OPERATION_EQUIPMENT_FEEDER: {
        NAME: 'Work Order: Equipment Feeder(s)'
    },
    WORKORDER_OPERATION_FIRSTPIECE: {
        NAME: 'First piece serials',
        PAGE_SIZE: 100
    },
    WORKORDER_OPERATION_PART: {
        NAME: 'Work Order: Supplies, Materials & Tools'
    },
    WORKORDER_OPERATION: {
        NAME: 'Work Order: Operation',
        OPSTATUS: {
            DRAFT: 0,
            PUBLISHED: 1,
            TERMINATED: 2
        }
    },
    WORKORDER_PREPROGCOMP: {
        NAME: 'Pre-Programming part'
    },
    WORKORDER_PREPROGCOMP_DESIGNATOR: {
        NAME: 'Pre-Programming part designator'
    },
    WORKORDER_REQFORREVIEW: {
        NAME: 'Work Order: Review request',
        REQUEST_STATUS: {
            PENDING: 'P',
            ACCEPTED: 'A',
            REJECTED: 'R'
        },
        WORKORDER_CHANGE_TYPE: {
            DO: { TYPE: 'DO', NAME: 'Do\'s' },
            DN: { TYPE: 'DN', NAME: 'Don\'ts' },
            IP: { TYPE: 'IP', NAME: 'Instruction/Process Detail' },
            OF: { TYPE: 'OF', NAME: 'Operation Fields' },
            ST: { TYPE: 'ST', NAME: 'Standards' },
            ET: { TYPE: 'ET', NAME: 'Equipments' },
            SM: { TYPE: 'SM', NAME: 'Supplies, Materials & Tools' },
            WC: { TYPE: 'WC', NAME: 'Job Specific Requirement' },
            MI: { TYPE: 'MI', NAME: 'Management Communication' }
        },
        WO_OP_CHANGE_TYPES: ['DO', 'DN', 'IP', 'OF', 'LI', 'WC', 'MI']
    },
    WORKORDER_REQREVCOMMENTS: {
        NAME: 'Work Order: Review request comment',
        REQUEST_STATUS: {
            PENDING: 'P',
            ACCEPTED: 'A',
            REJECTED: 'R'
        }
    },
    WORKORDER_REQREVINVITEDEMP: {
        NAME: 'Work Order: Review request personnel',
        REQUEST_STATUS: {
            PENDING: 'P',
            ACCEPTED: 'A',
            REJECTED: 'R'
        }
    },
    WORKORDER_SERIALMST: {
        NAME: 'Work Order: Serial#',
        MFG_SERIAL_NAME: 'Work Order: MFR serial',
        PRODUCT_SERIAL_NAME: 'Work Order: Product serial',
        PRODUCT_SERIAL_MAPPING_NAME: 'Work Order: Product serial mapping',
        SERIAL_NO_LIMIT_EXISTS: 'Serial# <b>{0}</b> limit exists as you given No of digits <b>{1}</b>. Add more serial#, change No of digit limit.',
        DUPLICATE_SERIAL: 'This serial# <b>{0}</b> already generated.',
        STATUS: {
            PASS: 1,
            REPROCESS: 2,
            OBSERVED: 3,
            SCRAP: 4,
            REWORK: 5
        },
        SERIAL_TYPE: {
            MANUFACTURE: 1,
            FINAL_PRODUCT: 2
        }
    },
    USER: {
        NAME: 'User'
    },
    WORKORDER_TRANS_ASSY_DEFECTDET: {
        NAME: 'Designator defect'
    },
    WORKORDER_TRANS_PRODUCTION: {
        NAME: 'Work Order production details',
        HISTORY: 'Work Order: Production history'
    },
    WORKORDER_TRANS_SERIAL: {
        NAME: 'Work Order transaction serials'
    },
    WORKORDER_TRANS_DATAELEMENT_VALUES: {
        NAME: 'Work Order Transaction data field'
    },
    WORKORDER_TRANS_EQUIPMENT_DATAELEMENT_VALUES: {
        NAME: 'Work Order Transaction equipment data field'
    },
    WORKORDER_TRANS_EMPINOUT: {
        NAME: 'Work Order personnel transaction'
    },
    WORKORDER_TRANS_FIRSTPCSDET: {
        NAME: 'First piece serial',
        PAGE_SIZE: 100
    },
    CREATE_DUPLICATE_PART_VALIDATIONS: {
        DUPLICATE_PID: 'DUPLICATE_PID',
        DUPLICATE_MFGPN: 'DUPLICATE_MFGPN',
        NICKNAME_MISMATCH_VALIDATION: 'NICKNAME_MISMATCH_VALIDATION',
        DUPLICATE_NICKNAME: 'DUPLICATE_NICKNAME',
        PACKAGING_ALIAS_PART_VALIDATION_FAILED: 'PACKAGING_ALIAS_PART_VALIDATION_FAILED',
        PART_NOT_FOUND: 'PART_NOT_FOUND',
        PACKAGING_GROUP_TYPE_NOT_EXISTS: 'PACKAGING_GROUP_TYPE_NOT_EXISTS'
    },
    SAVE_AVL_MAPPING_VALIDATIONS: {
        DUIPLICATE_MAPPING: 'DUIPLICATE_MAPPING'
    },
    COMPONENT: {
        Name: 'Part',
        PART_STATUS: {
            OBSOLETE: 'Obsolete',
            ACTIVE: 'Active'
        },
        COMMONID: -1,
        UPLOAD_PATH: './uploads/component/images/',
        UPLOAD_DATASHEET_PATH: './uploads/component/datasheets',
        IMAGE_FOLDER_NAME: 'images',
        DATASHEET_BASE_PATH: './datasheets',
        DATASHEET_FOLDER_NAME: 'datasheets',
        DOWNLOAD_FILTER_TEMPLATE_PATH: './default/csv/',
        MFGPN: 'MPN',
        SUPPLIERPN: 'SPN'
    },
    COMPONENT_GENERIC_ALIAS: {
        NAME: 'Alias'
    },
    COMPONENT_OTHER_PART_NAME: {
        NAME: 'Other Part Name'
    },
    /* COMPONENT_ALIAS: {
        //Name: "Component alias",
        Name: "Supplier Alias",
    },*/
    PACKAGING_ALIAS: {
        Name: 'Packaging part alias'
    },
    ALTERNET_ALIAS: {
        Name: 'Alternate Part',
        Type: 1
    },
    PICKUP_PAD_ALIAS: {
        Name: 'Pickup Pad',
        Type: 2
    },
    PROGRAMMING_REQUIRED_ALIAS: {
        Name: 'Program',
        Type: 3
    },
    FUNCTIONAL_TESTING_ALIAS: {
        Name: 'Functional Testing Tool',
        Type: 4
    },
    COMPONENT_FUNCTIONAL_TYPE_PART_NAME: {
        Name: 'Functional Type Part'
    },
    COMPONENT_MOUNTING_TYPE_PART_NAME: {
        Name: 'Mounting Type Part'
    },
    COMPONENT_ODDLY_NAMED_REFDES_NAME: {
        Name: 'Oddely Named RefDes'
    },
    COMPONENT_FUNCTIONAL_TESTING_PART_NAME: {
        Name: 'Functional Testing Equipment'
    },
    DRIVETOOLS_ALIAS: {
        Name: 'Drive Tool'
    },
    REQUIRE_MATING_PARTS: {
        Name: 'Require Mating Part',
        Type: 5
    },
    PROCESSMATERIAL: {
        Name: 'Process Material'
    },
    ROHS_ALTERNET_ALIAS: {
        Name: 'RoHS replacement part',
        Type: 6
    },
    COMPONENT_IMAGES_NAME: {
        Name: 'Part Image'
    },
    COMPONENT_DATASHEET_NAME: {
        Name: 'Data Sheet'
    },
    COMPONENT_ALTERNATEPN_VALIDATIONS_NAME: {
        Name: 'Alternate validation details'
    },
    COMPONENT_TEMPERATURE_SENSITIVE_DATA_NAME: {
        Name: 'Temperature Sensitive Data'
    },
    COMPONENT_ACCEPTABLE_SHIPPING_COUNTRIES: {
        Name: 'Component Acceptable Shipping Countries'
    },
    COMPONENT_HISTORY_NAME: {
        Name: 'Part History'
    },
    OPERATING_TEMPERATURE_CONVERSION: {
        Name: 'Operating Temperature Conversion'
    },
    CALIBRATION_DETAILS: {
        Name: 'Calibration Details'
    },
    COMPONENT_DISAPPROVED_SUPPLIER: {
        Name: 'Part Disapproved Supplier(s)',
        STATUS: {
            APPROVED: 'A',
            DISAPPROVED: 'D'
        }
    },
    SUPPLIER_DISAPPROVED_PART: {
        Name: 'Supplier Disapproved Part(s)'
    },
    APPROVED_SUPPLIER_PRIORITY: {
        Name: 'Priority'
    },
    SALES_ORDER: {
        Name: 'Sales Order',
        PO_Status_Report: 'PO status report',
        SALES_STATUS: {
            DRAFT: 0,
            PUBLISHED: 1
        },
        SOWORKING_STATUS: {
            InProgress: 'In Progress',
            Completed: 'Completed',
            Canceled: 'Canceled'
        },
        Shipment_Summary_Name: 'Sales Order Shipment Summary'
    },
    MIS_REPORT: {
        NAME: 'MIS report',
        MISCommonReportType: {
            Detail: 1,
            Summary: 2
        },
        DateFormatForFilter: '%m-%d-%Y'
    },
    DYNAMIC_REPORT_ACCESS: {
        NAME: 'MIS report access personnel'
    },
    SALESORDER_MST: {
        Name: 'Sales Order'
    },
    WORKORDER_TRANSFER: {
        NAME: 'Work Order transfer'
    },
    WORKORDER_OPERATION_DATAELEMENT_ROLE: {
        Name: 'Work Order operation dataelement role'
    },
    CUSTOMER_PACKING_SLIP: {
        Name: "Customer Packing Slip",
        DetName: "Customer Packing Slip Detail"
    },
    CUSTOMER_INVOICE: {
        Name: 'Customer Invoice'
    },
    CUSTOMER_PACKING_SLIP_AND_INVOICE_TRACKING_NUMBER: {
        Name: "Tracking Number",
        DetName: "Tracking Number Detail"
    },
    BOOKMARK: {
        Name: "Bookmark"
    },
    CUSTOMER_CREDITNOTE: {
        Name: 'Credit Memo'
    },
    PURCHASE_ORDER: {
        Name: 'Purchase Order'
    },
    MFGCODE: {
        NAME: 'Manufacturer',
        DIST_NAME: 'Supplier',
        CUST_NAME: 'Customer',
        MFGTYPE: {
            MFG: 'MFG',
            DIST: 'DIST',
            CUSTOMER: 'CUSTOMER'
        },
        DOWNLOAD_PATH: './default/csv/',
        DIST_AUTHORIZE_TYPE: {
            Authorized: 1,
            Independent: 2,
            AuthorizedAndIndependent: 3
        },
        MFR: 'MFR',
        SUPPLIER: 'Supplier'
    },
    MFGCODEALIAS: {
        NAME: 'Manufacturer alias'
    },
    ASSEMBLY_MST: {
        NAME: 'Assembly'
    },
    ASSEMBLY_REVISION_MST: {
        NAME: 'Assembly Revision'
    },
    ENTITY: {
        NAME: 'Entity',
        UNIQUE_FIELD: 'Entity Name',
        DISPLAY_ORDER: 'Display Order',
        ENTITY_EMPLOYEE_NAME: 'Entity employee',
        STATUS: {
            PUBLISHED: 1,
            DRAFT: 0
        },
        SYSTEM_ENTITY_DOC_UPLOAD_PATH: './uploads/entity/system/',
        CUSTOM_FORM_DOC_UPLOAD_PATH: './uploads/entity/custom/'
    },
    ENTITY_STATUS: [
        { id: 0, Name: 'DRAFT' },
        { id: 1, Name: 'PUBLISHED' }

    ],
    IDENTITY: {
        EntityRefTransID: 'EntityRefTransID',
        CustomerPackingSlipSystemID: 'CustomerPackingSlipSystemID',
        CustomerInvoiceSystemID: 'CustomerInvoiceSystemID',
        AutoGeneratedPaymentNumber: 'AutoGeneratedPaymentNumber',
        customerCreditMemoSystemID: 'customerCreditMemoSystemID',
        CustomerPaymentSystemID: 'CustomerPaymentSystemID',
        CustomerPaymentSystemIDPrefix: 'CPMT',
        CustomerPaymentSystemIDTotalDigit: 9,
        WorkOrderSystemID: 'WorkOrderSystemID',
        CustomerPaymentNumberForZeroValuePayment: 'CustomerPaymentNumberForZeroValuePayment',
        ApplyCustomerCreditMemoSystemID: 'ApplyCustomerCreditMemoSystemID',
        MPNSystemID: 'MPNSystemID',
        SPNSystemID: 'SPNSystemID',
        CustomerRefundSystemID: 'CustomerRefundSystemID',
        CustomerWriteOffPaymentNumber: 'CustomerWriteOffPaymentNumber',
        CustomerPaymentWriteOffSystemID: 'CustomerPaymentWriteOffSystemID',
        SupplierRefundSystemId: 'SupplierRefundSystemID'
    },
    CUST_CREDIT_MEMO: 'C',
    CUST_INVOICE: 'I',
    SHIPPED_ASSEMBLY: {
        NAME: 'Shipped'
    },
    MESUREMENT_TYPES: {
        NAME: 'Mesurement Types'
    },
    BARCODE_LABEL_TEMPLATE: {
        NAME: 'Barcode label template'
    },
    BARCODE_LABEL_TEMPLATE_DELIMITER: {
        NAME: 'Barcode label template delimiter'
    },
    JOB_TYPES: {
        ADDUPDATEDISAPLAYNAME: 'Job Type',
        DISPLAYNAME: 'Job Type',
        NAME: 'Job Types'
    },
    RFQ_TYPES: {
        ADDUPDATEDISAPLAYNAME: 'RFQ Type',
        DISPLAYNAME: 'RFQ Type',
        NAME: 'RFQ Types'
    },
    MOUNTING_TYPE: {
        NAME: 'Mounting Type',
        TableName: 'rfq_mountingtypemst'
    },
    PACKAGE_CASE_TYPE: {
        NAME: 'Package/Case(Shape) Type',
        TableName: 'rfq_packagecasetypemst'
    },
    ROHS: {
        NAME: 'RoHS',
        TableName: 'rfq_rohsmst',
        UPLOAD_PATH: './uploads/rohs/images/'
    },
    ROHS_PEER: {
        NAME: 'RoHS Peer',
        TableName: 'rfq_rohsmst_peer'
    },
    PART_TYPE: {
        NAME: 'Functional Type',
        refTransTableName: 'rfq_parttypemst'
    },
    PACKAGING_TYPE: {
        NAME: 'Packaging Type',
        refTransTableName: 'component_packagingmst'
    },
    UNALLOCTAED_UMID_TRANSFER_HISTORY_TYPE: {
        NAME: 'Unallocated UMID Xfer History',
        TableName: 'unallocted_umid_transfer_history'
    },
    PURCHASE_INSPECTION_REQUIREMENT_TYPE: {
        NAME: 'Requirements & Comments',
        TableName: 'inspection_mst'
    },
    PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_TYPE: {
        NAME: 'Requirements & Comments Template',
        TableName: 'inspection_template_mst'
    },
    CHART_OF_ACCOUNTS: {
        NAME: 'Chart of Accounts',
        TableName: 'acct_acctmst'
    },
    CHART_OF_ACCOUNTS_ERROR_TYPES: {
        TYPE_NOT_EXISTS: 'TYPE_NOT_EXISTS'
    },
    ACCOUNT_TYPE: {
        NAME: 'Account Type',
        TableName: 'acct_classmst'
    },
    FOB_TYPE: {
        NAME: 'FOB',
        TableName: 'freeOnBoardMst'
    },
    CONFIGURE_RESTRICTED_FILE_TYPE: {
        NAME: 'Configure Restricted File Type',
        TableName: 'generic_file_extension'
    },
    REASONS: {
        DISPLAYNAME: 'Bill Of Material Approval Reason',
        DELETEDISPLAYNAME: 'Bill Of Material Approval Reason',
        DISPLAY_RFQ_REASON_NAME: 'RFQ Reason',
        DELETEDISPLAY_RFQ_REASON_NAME: 'RFQ Reason',
        NAME: 'Reasons',
        INVOICEAPPROVENAME: 'Predefined Invoice Approval Reason'
    },
    COMPONENT_PARTSTATUS: {
        NAME: 'Part Status',
        TableName: 'component_partstatusmst'
    },
    CAMERA: {
        NAME: 'Camera',
        TableName: 'cameramst'
    },
    COMPONENT_PART_DYNAMIC_ATTRIBUTE: {
        NAME: 'Part Operational Attribute',
        TableName: 'component_dynamic_attribute',
        UPLOAD_PATH: './uploads/dynamicattribute/images/'
    },
    ADDITIONAL_REQUIREMENT: {
        DISPLAYNAME: 'RFQ Requirement Template',
        NAME: 'Additional Requirement',
        NARRATIVE_DISPLAYNAME: 'Narrative Master Template',
        NARRATIVE_NAME: 'Narrative Master Template',
        CATEGORY: {
            CUSTOMER_QUOTE_REQUIREMENT: {
                ID: 1,
                VALUE: 'Customer Quote Requirement'
            },
            ASSEMBLY_REQUIREMENT: {
                ID: 2,
                VALUE: 'Assembly Requirement'
            },
            NARRATIVE_REQUIREMENT: {
                ID: 3,
                VALUE: 'Narrative Master'
            }
        }
    },
    COMPONENT_SID_STOCK: {
        DISPLAYNAME: "Part To Stock",
        NAME: "Receiving Material",
        TypeReceivePartToStock: "Purchased Part",
        TypeReceivePartToStockCode: "PP",
        ScanUID: "Scan UID",
        DataElementName: "Dataelement",
        TransferStock: "Transfer material",
        UMID: "UMID",
        TableName: "component_sid_stock",
        BarTenderServerIPandPort: "BarTender Server IP and Port",
        UMID_Length: 15,
        DATE_CODE_LENGTH: 4,
        TAPE_REEL: 'Tape & Reel',
        INVENTORY_TYPE: {
            NewStock: 'NI',
            ExistingStock: 'OI',
            ExistingAssemblyStock: 'AI',
            SplitStock: 'SI'
        }
    },
    COMPONENT_SID_STOCK_DATAELEMENT_VALUES: {
        NAME: 'Component Sid Stock DataElement Values'
    },
    COMPONENT_SID_STOCK_LABELIMAGE: {
        NAME: 'Component Sid Stock Label Image'
    },
    COMPONENT_STANDARDS: {
        DISPLAYNAME: 'Standards',
        NAME: 'Part Standards'
    },
    COMPONENT_STANDARDS_CLASS: {
        DISPLAYNAME: 'Part Standard Category',
        NAME: 'Part Standard Class'
    },
    COMPONENT_LOGICAL_GROUP: {
        DISPLAYNAME: 'Mounting Group',
        NAME: 'Mounting Group'
    },
    SERIAL_NUMBER_CONFIGURATION: {
        NAME: 'Serial# Configuration'
    },
    FixedEntityDataelement: {
        NAME: 'Fixed Data Source'
    },
    RFQ_ASSEMBLIES: {
        NAME: 'RFQ Assembly'
    },
    RFQ_ASSEMBLIES_QUANTITY: {
        NAME: 'RFQ Assembly Quantity'
    },
    HISTORY: {
        NAME: 'History'
    },
    RFQ_ASSEMBLY_HISTORY: {
        NAME: 'RFQ Assembly History',
        RANDDNAME: 'R&D Status'
    },
    RFQ_LINEITEMS: {
        NAME: 'RFQ line item',
        BOMNAME: 'BOM',
        COPYRFQNAME: 'RFQ'
    },
    RFQ_LINEITEMS_APPROVAL_COMMENT: {
        APPROVAL_TYPE: {
            ADD: 'A',
            UPDATE: 'U',
            DELETE: 'D'
        }
    },
    RFQ_LINEITEMS_ADDITIONAL_COMMENT: {
        NAME: "BOM Addiional Comment"
    },
    RFQ_BOM_HEADER_COMPONENT_CONFIGURATION: {
        NAME: 'Additional Header Configuration'
    },
    RFQ_ASSY_BOM: {
        NAME: 'RFQ Assembly'
    },
    RFQ_ASSEY_QUOTE_SUMMARY_DETAIL: {
        NAME: 'Quote Summary Detail'
    },
    WORKORDER_SALESORDER_DETAILS: {
        Name: 'Work Order: Sales Order detail'
    },
    EQUIPMENT_TYPE_VALUE: {
        EQUIPMENT: 'E',
        TOOLS: 'T'
    },
    WORKORDER_OPERATION_DATAELEMENT: {
        NAME: 'Work Order operation data field'
    },
    WORKORDER_DATAELEMENT: {
        NAME: 'Work Order data field'
    },
    CHART_TEMPLATE_OPERATIONS: {
        NAME: 'Chart template operation'
    },
    ASSEMBLY_REVISION_COMMENT: {
        NAME: 'Comment(s)'
    },
    REQUEST_FOR_SHIP: {
        NAME: 'Request for shipment',
        STATUS: {
            PUBLISHED: 1,
            DRAFT: 0
        }
    },
    ASSY_TYPES: {
        ADDUPDATEDISAPLAYNAME: 'Assembly Type',
        DISPLAYNAME: 'Assembly Type',
        NAME: 'Assembly Types',
        UNIQUE_FIELD_NAME: 'Name'
    },
    REQUEST_FOR_SHIPDET: {
        NAME: 'Request for shipment detail'
    },
    REQUEST_FOR_SHIPEMPDET: {
        NAME: 'Shipping approval request'
    },
    COMPONENT_CUST_ALIAS_REV: {
        NAME: 'Part customer alias'
    },
    COMPONENT_CUSTOMER_LOA: {
        Name: 'Part customer LOA'
    },
    UNLOCK_VERIFICATION_SCREEN: {
        Name: 'Unlock detail'
    },
    DC_FORMAT: {
        NAME: 'Date Code Format'
    },
    PACKING_SLIP: {
        Name: 'Packing slip',
        Invoice: 'Invoice',
        Supplier_Payment: 'Supplier Payment',
        Supplier_Refund: 'Supplier Refund',
        DetailTableName: 'packing_slip_material_receive_det',
        InvoicePayment: 'Invoice Payment',
        CreditMemo: 'Credit Memo',
        DebitMemo: 'Debit Memo',
        Packing_Slip_System_Id: 'SupplierPackingSlipSystemID',
        Packing_Slip_Prefix: 'SPS',
        Packing_Slip_TotalDigit: 9,
        Invoice_System_Id: 'SupplierInvoiceSystemID',
        Invoice_Prefix: 'SINV',
        Invoice_TotalDigit: 9,
        Credit_Memo_System_Id: 'SupplierCreditMemoSystemID',
        Credit_Memo_Prefix: 'SCM',
        Credit_Memo_TotalDigit: 9,
        Debit_Memo_System_Id: 'SupplierDebitMemoSystemID',
        Debit_Memo_Prefix: 'SDM',
        Debit_Memo_TotalDigit: 9,
        Supplier_Payment_System_Id: 'PaymentForSupplierSystemID',
        Supplier_Payment_Prefix: 'SPMT',
        Supplier_Payment_TotalDigit: 9
    },
    PACKING_SLIP_MATERIAL: {
        Name: 'Packing slip material'
    },
    SUPPLIER_INVOICE_MATERIAL: {
        Name: 'Supplier invoice material',
        CreditMemo: 'Credit Memo material',
        DebitMemo: 'Debit Memo material'
    },
    SUPPLIER_RMA: {
        Name: 'Supplier RMA',
        MaterialName: 'Supplier RMA Material',
        Supplier_RMA_System_Id: 'SupplierRMASystemID',
        Supplier_RMA_Prefix: 'SRMAPS',
        Supplier_RMA_TotalDigit: 8
    },
    SUPPLIER_QUOTE: {
        Name: 'Supplier quote'
    },
    SUPPLIER_QUOTE_PART_DETAIL: {
        Name: 'Supplier quote part detail'
    },
    SUPPLIER_QUOTE_PART_PRICE_DETAIL: {
        Name: 'Supplier quote part Price detail'
    },
    MATERIAL_RECEIVE_PART_INSTRUCTION: {
        Name: 'Packing slip material receive part instruction detail'
    },
    SUPPLIER_ATTRIBUTE_TEMPLATE: {
        Name: 'Supplier attribute template'
    },
    BANK: {
        Name: 'Bank Account'
    },
    TRANSACTION_MODE: {
        PAYABLE: {
            Name: 'Payable Transaction Mode',
            ModeType: 'RP'
        },
        RECEIVABLE: {
            Name: 'Receivable Transaction Mode',
            ModeType: 'RR'
        }
    },
    COMPONENT_INSPECTION_REQUIREMENT_DET: {
        Name: 'Requirements & Comments',
        PackingSlipReceivedStatus: {
            Pending: 'P',
            Accept: 'A',
            Reject: 'R',
            AcceptwithDeviation: 'AD'
        },
        PackingSlipReceivedStatusValue: {
            Pending: 'Pending',
            Accepted: 'Accepted',
            Rejected: 'Rejected',
            AcceptwithDeviation: 'Accept With Deviation'
        },
        InspectionStatus: {
            Pending: 'P',
            Accept: 'A',
            Reject: 'R',
            AcceptwithDeviation: 'AD'
        }
    },
    KIT_ALLOCATION: {
        Name: 'kit allocation',
        Release: 'Release detail',
        Kit: 'Kit',
        ConsolidatedData: 'Consolidate data',
        Status: {
            Allocate: 'A',
            Deallocation: 'D',
            Return: 'R'
        }
    },
    KIT_RELEASE: {
        ReleaseStatus: {
            InProgress: 'P',
            Released: 'R'
        }
    },
    KIT_RETURN: {
        ReturnStatus: {
            FullyReturned: 'FR',
            ReadyToReturn: 'RR',
            ReturnWithShortage: 'RS'
        }
    },
    PURCHASE: {
        Name: 'Purchase list part details'
    },
    RESERVE_STOCK_REQUEST: {
        Name: 'Reserve stock request'
    },
    TIMLINE: {
        NAME: 'Timeline',
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
        },
        EVENTS: {
            LOGIN: {
                id: 1,
                title: 'Login to FJT',
                description: 'Personnel {0} logged in!'
            },
            LOGOUT: {
                id: 2,
                title: 'Logout From FJT',
                description: 'Personnel {0} logged out !'
            },
            NAVIGATE: {
                id: 3,
                title: 'Navigation performed to {0}',
                title_relaod: 'Navigation performed on same page',
                description: 'Personnel "{0}" navigated to {1} !',
                description_relaod: 'Personnel "{0}" has performed reload in browser !'
            },
            WORKORDER: {
                id: 4,
                WORKORDER_SERIALMST: {
                    id: 4.01
                },
                TASK_CONFIRMATION: {
                    id: 4.02
                },
                WORKORDER_CERTIFICATION: {
                    id: 4.03
                },
                WORKORDER_CLUSTER: {
                    id: 4.04
                },
                WORKORDER_SALESORDER_DETAILS: {
                    id: 4.05
                },
                WORKORDER_REQFORREVIEW: {
                    id: 4.06
                },
                WORKORDER_REQREVINVITEDEMP: {
                    id: 4.07
                },
                WORKORDER_REQREVCOMMENTS: {
                    id: 4.08
                },
                WORKORDER_OPERATION: {
                    id: 4.09
                },
                WORKORDER_OPERATION_DATAELEMENT: {
                    id: 4.10
                },
                WORKORDER_OPERATION_DATAELEMENT_ROLE: {
                    id: 4.11
                },
                WORKORDER_OPERATION_EMPLOYEE: {
                    id: 4.12
                },
                WORKORDER_OPERATION_EQUIPMENT: {
                    id: 4.13
                },
                WORKORDER_OPERATION_EQUIPMENT_DATAELEMENT: {
                    id: 4.14
                },
                WORKORDER_OPERATION_PART: {
                    id: 4.15
                },
                WORKORDER_OPERATION_FIRSTPIECE: {
                    id: 4.16
                },
                ECO_REQUEST: {
                    id: 4.17
                },
                ECO_REQUEST_DEPARTMENT_APPROVAL: {
                    id: 4.18
                },
                WORKORDER_OPERATION_CLUSTER: {
                    id: 4.19
                },
                DATAELEMENT_TRANSACTIONVALUES_FOR_WORKORDER: { /* used directly in timeline trigger */
                    id: 4.20
                },
                DATAELEMENT_TRANSACTIONVALUES_FOR_WORKORDER_OPERATION: { /* used directly in timeline trigger */
                    id: 4.21
                },
                GENERICFILES_FOR_WORKORDER: { /* used directly in timeline trigger */
                    id: 4.22
                },
                GENERICFILES_FOR_WORKORDER_OPERATION: { /* used directly in timeline trigger */
                    id: 4.23
                },
                GENERICFILES_FOR_WORKORDER_ECOREQUEST: { /* used directly in timeline trigger */
                    id: 4.24
                },
                GENERICFOLDER_FOR_WORKORDER: { /* used directly in timeline trigger */
                    id: 4.25
                },
                GENERICFOLDER_FOR_WORKORDER_OPERATION: { /* used directly in timeline trigger */
                    id: 4.26
                },
                GENERICFOLDER_FOR_WORKORDER_ECOREQUEST: { /* used directly in timeline trigger */
                    id: 4.27
                },
                VERIFY_WORKORDER: {
                    id: 4.28
                },
                WORKORDER_STATUS: {
                    id: 4.29
                },
                WORKORDER_OPERATION_DOSANDDONTS: {
                    id: 4.30
                },
                WORKORDER_OPERATION_FIRSTPCSDET: {
                    id: 4.31
                },
                WORKORDER_OPERATION_WOOPSTATUS: {
                    id: 4.32
                },
                MASTER_TEMPLATE: {
                    id: 4.33
                },
                WORKORDER_VERSION: {
                    id: 4.34
                },
                WORKORDER_OPERATION_VERSION: {
                    id: 4.35
                },
                WORKORDER_DATAELEMENT: {
                    id: 4.36
                }
            },
            TRAVELER: {
                id: 5,
                CHECK_IN: {
                    id: 5.01
                },
                WORKORDER_TRANS_DATAELEMENT_VALUES: {
                    id: 5.02
                },
                WORKORDER_TRANS_EQUIPMENT_DATAELEMENT_VALUES: {
                    id: 5.03
                },
                CHECK_OUT: {
                    id: 5.04
                },
                WORKORDER_TRANS_FIRSTPCSDET: {
                    id: 5.05
                },
                WORKORDER_TRANS_SERIALNO: {
                    id: 5.06
                },
                WORKORDER_TRANSFER: { /* used directly in Sproc_WorkorderTransfer sp */
                    id: 5.07
                },
                WORKORDER_REQFORREVIEW: {
                    id: 5.08
                },
                OP_EMP_PAUSE: { /* used directly in Sproc_pauseEmployeeForOperation sp */
                    id: 5.09
                },
                OP_EMP_RESUME: { /* used directly in Sproc_resumeEmployeeForOperation sp */
                    id: 5.10
                },
                WORKORDER_TRANS_PRODUCTION: {
                    id: 5.11
                },
                WORKORDER_ASSY_DESIGNATORS: {
                    id: 5.12
                },
                WORKORDER_TRANS_ASSY_DEFECTDET: {
                    id: 5.13
                },
                WORKORDER_PREPROGCOMP: {
                    id: 5.14
                },
                WORKORDER_PREPROGCOMP_DESIGNATOR: {
                    id: 5.15
                },
                WORKORDER_TRANS_PREPROGRAMCOMP: {
                    id: 5.16
                },
                WORKORDER_TRANS_PACKAGINGDETAIL: {
                    id: 5.17
                },
                PRINT_WORKORDER_OPERATION_DETAILS: {
                    id: 5.18
                }
            },
            SALES_ORDER: {
                id: 6,
                GENERICFILES_FOR_SALESORDER: { /* used directly in timeline trigger */
                    id: 6.01
                },
                GENERICFOLDER_FOR_SALESORDER: { /* used directly in timeline trigger */
                    id: 6.02
                },
                DATAELEMENT_TRANSACTIONVALUES_FOR_SALESORDER: { /* used directly in timeline trigger */
                    id: 6.03
                }
            },
            COMPONENT_SID_STOCK: {
                id: 7,
                COMPONENT_SID_STOCK_DATAELEMENT_VALUES: { /* used directly in delete sp */
                    id: 7.01
                },
                GENERICFILES_FOR_COMPONENT_SID_STOCK: { /* used directly in timeline trigger */
                    id: 7.02
                }
            },
            SHIPPING_REQUEST: {
                id: 8,
                SHIPPING_REQUESTDET: {
                    id: 8.01
                },
                SHIPPING_REQUEST_EMPDET: {
                    id: 8.02
                }
            },
            SHIPPEDASSEMBLY: {
                id: 9
            },
            WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION: {
                id: 10
            }
            // GENERICFILES:{
            //    id: 6,
            // }
        },
        WORKORDER: {
            refTransTableName: 'workorder',
            url: 'workorders/manage/details/{0}',
            // CREATE: {
            //    title: 'Work order created',
            //    description: 'Work order {0} created by {1}!',
            // },
            // UPDATE: {
            //    title: 'Work order updated',
            //    description: 'Work order {0} updated by {1}!',
            // },
            // DELETE: {
            //    title: 'Work order removed',
            //    description: 'Work order {0} removed by {1}!'
            // },
            // COPIED: {
            //    title: 'Work order copied as new Work order',
            //    description: 'Work order copied as new Work order {0} by {1}!',
            // },
            // HALT_RESUME_WORKORDER: {
            //    title: 'Work order {0}',
            //    description: 'Work order {0} {1} by {2}!',
            // },
            VERIFY_WORKORDER: {
                // title: 'Work order verified',
                // description: 'Work order {0} verified by {1}!',
                url: 'workorders/manage/operations/{0}'
            }
            // STATUS: {
            //    title: 'Work order status changed',
            //    description: 'Status of work order {0} changed from "{1}" to "{2}" by {3}!',
            // },
            // MASTER_TEMPLATE: {
            //    title: 'Master template added for work order',
            //    description: 'Master template "{0}" added for work order {1} by {2}!',
            // },
            // WORKORDER_VERSION: {
            //    title: 'Work order version updated',
            //    description: 'Version updated from "{0}" to "{1}" for work order {2} by {3}!',
            // }
        },
        WORKORDER_SERIALMST: {
            refTransTableName: 'workorder_serialmst',
            CREATE: {
                // title: 'Serial(s) created for work order',
                // description: 'Serial(s) created for work order {0} by {1}!',
                url: 'workorders/manage/details/{0}'
            }
            // DELETE: {
            //    title: 'All serials removed from work order',
            //    description: 'All serials of work order {0} removed by {1}!'
            // }
        },
        TASK_CONFIRMATION: {
            refTransTableName: 'taskconfirmation',
            SAVE: {
                // title: 'Task confirmation added for work order',
                // description: 'Task confirmation added for "{0}" in work order {1} by {2}!',
                url: 'workorders'
            }
        },
        WORKORDER_CERTIFICATION: {
            refTransTableName: 'workorder_certification',
            SAVE: {
                // title: 'Standards assigned to work order',
                // description: 'Standards updated for work order {0} by {1}!',
                url: 'workorders/manage/standards/{0}'
            }
        },
        WORKORDER_CLUSTER: {
            refTransTableName: 'workorder_cluster',
            url: 'workorders/manage/operations/{0}'
            // CREATE: {
            //    title: 'Cluster added to work order',
            //    description: 'Cluster "{0}" added to work order {1} by {2}!',
            // },
            // UPDATE: {
            //    title: 'Cluster updated for work order',
            //    description: 'Cluster "{0}" updated for work order {1} by {2}!',
            // },
            // DELETE: {
            //    title: 'Cluster removed from work order',
            //    description: 'Cluster {0} removed from work order {0} by {1}!'
            // },
        },
        WORKORDER_SALESORDER_DETAILS: {
            refTransTableName: 'workorder_salesorder_details',
            url: 'workorders/manage/details/{0}'
            // CREATE: {
            //    title: 'Sales order details added for work order',
            //    description: 'Sales order details added for work order {0} by {1}!',
            // },
            // UPDATE: {
            //    title: 'Sales order details updated for work order',
            //    description: 'Sales order details updated for work order {0} by {1}!',
            // },
            // DELETE: {
            //    title: 'Sales order details removed from work order',
            //    description: 'Sales order details removed from work order {0} by {1}!'
            // },
        },
        WORKORDER_REQFORREVIEW: {
            refTransTableName: 'workorder_reqforreview',
            url: 'workorders/manage/invitepeople/{0}',
            travelerUrl: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Review request added for work order',
            //    description: 'To Review work order {0}, request created by {1}!',
            // },
            // UPDATE: {
            //    title: 'Review request updated for work order',
            //    description: 'Review request updated for work order {0} by {1}!',
            // },
            // UPDATESTATUS: {
            //    title: 'Review request status updated for work order',
            //    description: 'Review request status updated for work order {0} by {1}!',
            // },
            // CREATE_FOR_WO_OP: {
            //    title: 'Review request added for work order operation',
            //    description: 'Review request added from operation "{0}" of work order {1} by {2}!',
            // },
            // UPDATE_FOR_WO_OP: {
            //    title: 'Review request updated for work order operation',
            //    description: 'Review request updated from operation "{0}" of work order {1} by {2}!',
            // },
        },
        WORKORDER_REQREVINVITEDEMP: {
            refTransTableName: 'workorder_reqrevinvitedemp',
            url: 'workorders/manage/invitepeople/{0}'
            // CREATE: {
            //    title: 'People invited to review work order',
            //    description: 'People invited to review work order {0} by {1}!',
            // },
            // UPDATE: {
            //    title: 'Invited people details updated to review work order',
            //    description: 'Invited people details updated to review work order {0} by {1}!',
            // },
            // DELETE: {
            //    title: 'Invited people removed from review work order',
            //    description: 'Invited people removed from review work order {0} by {1}!',
            // },
        },
        WORKORDER_DATAELEMENT: {
            refTransTableName: 'workorder_dataelement',
            CREATE: {
                // title: 'Data field(s) added to operation for work order',
                // description: 'Data field(s) added to operation "{0}" for work order {1} by {2}!',
                url: 'workorders/manage/datafields/{0}'
            },
            DELETE: {
                // title: 'Data field(s) removed from operation for work order',
                // description: 'Data field(s) removed from operation" {0}" for work order {1} by {2}!',
                url: 'workorders/manage/datafields/{0}'
            }
        },
        WORKORDER_REQREVCOMMENTS: {
            refTransTableName: 'workorder_reqrevcomments',
            CREATE: {
                // title: 'Review comments added for work order',
                // description: 'Review comments added for work order {0} by {1}!',
                url: 'workorders/manage/invitepeople/{0}'
            },
            UPDATESTATUS: {
                // title: 'Review comments status updated for work order',
                // description: 'Review comments status updated for work order {0} by {1}!',
                url: 'workorders/manage/invitepeople/{0}'
            }
        },
        WORKORDER_OPERATION: {
            refTransTableName: 'workorder_operation',
            CHANGED: {
                // title: 'Operation(s) modified for work order',
                // description: 'Operation(s) modified for work order {0} by {1}!',
                url: 'workorders/manage/operations/{0}'
            },
            DELETE: {
                // title: 'Operation removed from work order',
                // description: 'Operation removed from work order {0} by {1}!',
                url: 'workorders/manage/operations/{0}'
            },
            UPDATE: {
                // title: 'Operation updated for work order',
                // description: 'Operation "{0}" updated for work order {1} by {2}!',
                url: 'workorders/manage/operation/details/{0}'
            },
            HALT_RESUME_WORKORDER_OPERATION: {
                // title: 'Work order operation {0}',
                // description: 'Operation "{0}" {1} of work order {2} by {3}!',
                url: 'workorders/manage/operation/details/{0}'
            },
            WORKORDER_OPERATION_DOSANDDONTS: {
                // title: 'Do\'s/Don\'ts updated for work order operation',
                // description: 'Do\'s/Don\'ts updated for operation "{0}" of work order {1} by {2}!',
                url: 'workorders/manage/operation/dodont/{0}'
            },
            WORKORDER_OPERATION_FIRSTPCSDET: {
                // title: 'First article status updated for work order operation',
                // description: 'First article status updated for operation "{0}" of work order {1} by {2}!',
                url: 'workorders/manage/operation/firstarticle/{0}'
            },
            WORKORDER_OPERATION_WOOPSTATUS: {
                // title: 'Work order operation status updated',
                // description: 'Status updated for operation "{0}" of work order {1} by {2}!',
                url: 'workorders/manage/operation/status/{0}'
            },
            WORKORDER_OPERATION_VERSION: {
                // title: 'Work order operation version updated',
                // description: 'Version updated from "{0}" to "{1}" for operation "{2}" of work order {3} by {4}!',
                url: 'workorders/manage/operation/details/{0}'
            }
        },
        WORKORDER_OPERATION_DATAELEMENT: {
            refTransTableName: 'workorder_operation_dataelement',
            CREATE: {
                // title: 'Data field(s) added to operation for work order',
                // description: 'Data field(s) added to operation "{0}" for work order {1} by {2}!',
                url: 'workorders/manage/operation/datafields/{0}'
            },
            DELETE: {
                // title: 'Data field(s) removed from operation for work order',
                // description: 'Data field(s) removed from operation" {0}" for work order {1} by {2}!',
                url: 'workorders/manage/operation/datafields/{0}'
            }
        },
        WORKORDER_OPERATION_DATAELEMENT_ROLE: {
            refTransTableName: 'workorder_operation_dataelement_role',
            CREATE: {
                // title: 'Role(s) added for data field of operation in work order',
                // description: 'Role(s) added for data field of operation "{0}" in work order {1} by {2}!',
                url: 'workorders/manage/operation/datafields/{0}'
            },
            DELETE: {
                // title: 'Role(s) removed for data field of operation in work order',
                // description: 'Role(s) removed for data field of operation "{0}" in work order {1} by {2}!',
                url: 'workorders/manage/operation/datafields/{0}'
            }
        },
        WORKORDER_OPERATION_EMPLOYEE: {
            refTransTableName: 'workorder_operation_employee',
            CREATE: {
                // title: 'Employee(s) added to operation in work order',
                // description: 'Employee(s) added to operation "{0}" in work order {1} by {2}!',
                url: 'workorders/manage/operation/employees/{0}'
            },
            DELETE: {
                // title: 'Employee(s) removed from operation of work order',
                // description: 'Employee(s) removed from operation "{0}" of work order {1} by {2}!',
                url: 'workorders/manage/operation/employees/{0}'
            }
        },
        WORKORDER_OPERATION_EQUIPMENT: {
            refTransTableName: 'workorder_operation_equipment',
            CREATE: {
                // title: 'Equipment(s) added to operation in work order',
                // description: 'Equipment(s) added to operation "{0}" in work order {1} by {2}!',
                url: 'workorders/manage/operation/equipments/{0}'
            },
            DELETE: {
                // title: 'Equipment(s) removed from operation of work order',
                // description: 'Equipment(s) removed from operation "{0}" of work order {1} by {2}!',
                url: 'workorders/manage/operation/equipments/{0}'
            }
        },
        WORKORDER_OPERATION_EQUIPMENT_DATAELEMENT: {
            refTransTableName: 'workorder_operation_equipment_dataelement',
            CREATE: {
                // title: 'Equipment data field(s) added for operation in work order',
                // description: 'Equipment data field(s) added for operation "{0}" in work order {1} by {2}!',
                url: null
            },
            DELETE: {
                // title: 'Equipment data field(s) removed from operation of work order',
                // description: 'Equipment data field(s) removed from operation "{0}" of work order {1} by {2}!',
                url: null
            }
        },
        WORKORDER_OPERATION_PART: {
            refTransTableName: 'workorder_operation_part',
            CREATE: {
                // title: 'Supplies, Materials & Tools added to operation in work order',
                // description: 'Supplies, Materials & Tools added to operation "{0}" in work order {1} by {2}!',
                url: 'workorders/manage/operation/parts/{0}'
            },
            DELETE: {
                // title: 'Supplies, Materials & Tools removed from operation of work order',
                // description: 'Supplies, Materials & Tools removed from operation "{0}" of work order {1} by {2}!',
                url: 'workorders/manage/operation/parts/{0}'
            },
            SAVE_QPA_DETAILS: {
                title: 'QPA details saved for Supplies, Materials & Tools from work order operation',
                description: 'QPA details saved for Supplies, Materials & Tools from operation "{0}" of work order {1} by {2}!',
                url: 'workorders/manage/operation/parts/{0}'
            }
        },
        WORKORDER_OPERATION_FIRSTPIECE: {
            refTransTableName: 'workorder_operation_firstpiece',
            url: 'workorders/manage/operation/firstarticle/{0}'
            // CREATE: {
            //    title: 'First article serial(s) created for operation in work order',
            //    description: 'First article serial(s) created for operation "{0}" in work order {1} by {2}!',
            // },
            // RESET: {
            //    title: 'First article serial(s) removed from operation in work order',
            //    description: 'First article serial(s) removed from operation "{0}" of work order {1} by {2}!',
            // },
            // ADD: {
            //    title: 'Work order serial(s) added for first article of operation in work order',
            //    description: 'Work order serial(s) added for first article of operation "{0}" in work order {1} by {2}!',
            // },
        },
        ECO_REQUEST: {
            refTransTableName: 'eco_request',
            url: 'workorders/manage/{0}/detail/{1}/{2}/',
            // CREATE: {
            //    title: 'Eco request created for work order',
            //    description: 'Eco request created for work order {0} by {1}!',
            // },
            // UPDATE: {
            //    title: 'Eco request updated for work order',
            //    description: 'Eco request updated for work order {0} by {1}!',
            // },
            DELETE: {
                // title: 'Eco request removed from work order',
                // description: 'Eco request "{0}" removed from work order {1} by {2}!',
                url: null
            }
        },
        ECO_REQUEST_DEPARTMENT_APPROVAL: {
            refTransTableName: 'eco_request_department_approval',
            url: 'workorders/manage/{0}/departmentapproval/{1}/{2}/'
            // CREATE: {
            //    title: 'Department approval request of eco request created for work order',
            //    description: 'Department approval request of eco request "{0}" created for work order {1} by {2}!',
            // },
            // UPDATE: {
            //    title: 'Department approval request of eco request updated for work order',
            //    description: 'Department approval request of eco request "{0}" updated for work order {1} by {2}!',
            // },
            // DELETE: {
            //    title: 'Department approval request removed from eco request of work order',
            //    description: 'Department approval request removed from eco request {0} of work order {1} by {2}!',
            // },
        },
        WORKORDER_OPERATION_CLUSTER: {
            refTransTableName: 'workorder_operation_cluster',
            url: 'workorders/manage/operations/{0}'
        },
        GENERICFILES: {
            refTransTableName: 'genericfiles'
        },
        GENERIC_FOLDER: {
            refTransTableName: 'generic_folder'
        },
        DATAELEMENT_TRANSACTIONVALUES: {
            refTransTableName: 'dataelement_transactionvalues'
        },
        WORKORDER_TRANS: {
            refTransTableName: 'workorder_trans',
            MANUAL_ENTRY: {
                url: 'workorders/managewomanualentry/{0}/{1}',
                CREATE: {
                    title: 'Manual entry added for work order',
                    description: 'Manual entry added for work order "{0}" by {1}!'
                },
                UPDATE: {
                    title: 'Manual entry updated for work order',
                    description: 'Manual entry updated for work order "{0}" by {1}!'
                },
                DELETE: {
                    title: 'Manual entry removed for work order',
                    description: 'Manual entry removed for work order "{0}" by {1}!'
                }
            }
        },
        WORKORDER_TRANS_DATAELEMENT_VALUES: {
            refTransTableName: 'workorder_trans_dataelement_values',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // SAVED: {
            //    title: 'Operation data fields updated for work order operation',
            //    description: 'Operation data fields updated for operation {0} in work order {1} by {2}!',
            // }
        },
        WORKORDER_TRANS_EQUIPMENT_DATAELEMENT_VALUES: {
            refTransTableName: 'workorder_trans_equipment_dataelement_values',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // SAVED: {
            //    title: 'Equipment data fields updated for work order operation',
            //    description: 'Data fields updated for Equipment "{0}" of operation {1} in work order {2} by {3}!',
            // }
        },
        WORKORDER_TRANS_FIRSTPCSDET: {
            refTransTableName: 'workorder_trans_firstpcsdet',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: '1st article serial(s) added for work order operation',
            //    description: '1st article serial(s) added for operation "{0}" in work order {1} by {2}!',
            // },
            // UPDATE: {
            //    title: '1st article serial information updated for work order operation',
            //    description: 'Serial # "{0}" updated for operation "{1}" in work order {2} by {3}!',
            // },
            // DELETE: {
            //    title: '1st article serial(s) removed from work order operation',
            //    description: '1st article serial(s) {0} removed from operation "{1}" in work order {2} by {3}!',
            // }
        },
        WORKORDER_TRANS_SERIALNO: {
            refTransTableName: 'workorder_trans_serialno',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Production serial(s) added for work order operation',
            //    description: 'Serial(s) added with status "{0}" for operation "{1}" in work order {2} by {3}!',
            // },
        },
        WORKORDER_TRANS_PRODUCTION: {
            refTransTableName: 'workorder_trans_production',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Production stock details added for work order operation',
            //    description: 'Production stock details added for operation "{0}" in work order {1} by {2}!',
            // },
        },
        WORKORDER_ASSY_DESIGNATORS: {
            refTransTableName: 'workorder_assy_designators',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Designator added for work order operation defect',
            //    description: 'Designator "{0}" added for defect "{1}" in operation "{2}" of work order {3} by {4}!',
            // },
            // DELETE: {
            //    title: 'Designator removed from work order operation defect',
            //    description: 'Designator "{0}" removed from operation "{1}" of work order {2} by {3}!',
            // }
        },
        WORKORDER_TRANS_ASSY_DEFECTDET: {
            refTransTableName: 'workorder_trans_assy_defectdet',
            url: 'task/tasklist/travel/{0}/{1}/{0}',
            CREATE: {
                title: 'Designator defect details added for work order operation',
                descriptionWithSerial: 'Designator "{0}" defect details added for serial "{1}" in operation "{2}" of work order {3} by {4}!',
                descriptionWithoutSerial: 'Designator "{0}" defect details added in operation "{1}" of work order {2} by {3}!'
            },
            UPDATE: {
                title: 'Designator defect details updated for work order operation',
                descriptionWithSerial: 'Designator "{0}" defect details updated for serial "{1}" in operation "{2}" of work order {3} by {4}!',
                descriptionWithoutSerial: 'Designator "{0}" defect details updated in operation "{1}" of work order {2} by {3}!'
            }
        },
        WORKORDER_PREPROGCOMP: {
            refTransTableName: 'workorder_preprogcomp',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Pre-Programming part added for work order operation',
            //    description: 'Pre-Programming part "{0}" added in operation "{1}" of work order {2} by {3}!',
            // },
            // UPDATE: {
            //    title: 'Pre-Programming part updated for work order operation',
            //    description: 'Pre-Programming part "{0}" updated for operation "{1}" of work order {2} by {3}!',
            // }
        },
        WORKORDER_PREPROGCOMP_DESIGNATOR: {
            refTransTableName: 'workorder_preprogcomp_designator',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Designator added for pre-programming part of work order operation',
            //    description: 'Designator "{0}" added for pre-programming part "{1}" in operation "{2}" of work order {3} by {4}!',
            // },
            // DELETE: {
            //    title: 'Designator removed from pre-programming part of work order operation',
            //    description: 'Designator "{0}" removed from pre-programming part in operation "{1}" of work order {2} by {3}!',
            // }
        },
        WORKORDER_TRANS_PREPROGRAMCOMP: {
            refTransTableName: 'workorder_trans_preprogramcomp',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Designator defect details added for pre-programming part of work order operation',
            //    description: 'Designator "{0}" defect details added for pre-programming part "{1}" in operation "{2}" of work order {3} by {4}!',
            // },
            // UPDATE: {
            //    title: 'Designator defect details updated for pre-programming part of work order operation',
            //    description: 'Designator "{0}" defect details updated for pre-programming part "{1}" in operation "{2}" of work order {3} by {4}!',
            // },
        },
        WORKORDER_TRANS_PACKAGINGDETAIL: {
            refTransTableName: 'workorder_trans_packagingdetail',
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // CREATE: {
            //    title: 'Box serial details added for work order operation',
            //    description: 'Box serial details added for operation "{0}" in work order {1} by {2}!',
            // },
            // DELETE: {
            //    title: 'Box serial details removed from work order operation',
            //    description: 'Box serial details removed from operation "{0}" in work order {1} by {2}!',
            // }
        },
        SALES_ORDER: {
            refTransTableName: 'salesordermst',
            url: 'transaction/salesorder/salesorder/manage/{0}',
            //CREATE: {
            //    title: 'Sales order created',
            //    description: 'Sales order "{0}" created by {1}!',
            // },
            // UPDATE: {
            //    title: 'Sales order details updated',
            //    description: 'Sales order "{0}" details updated by {1}!',
            // },
        },
        COMPONENT_SID_STOCK: { /* Receiving Material */
            refTransTableName: 'component_sid_stock',
            url: 'transaction/receivingmaterial/managereceivingmaterial/{0}/{1}',
            //CREATE: {
            //    title: 'Receiving material created with details',
            //    description: 'Receiving material with UID "{0}" created by {1}!',
            // },
            // UPDATE: {
            //    title: 'Receiving material details updated',
            //    description: 'Receiving material details updated for UID "{0}" by {1}!',
            // },
        },
        SHIPPING_REQUEST: {
            refTransTableName: 'Shipping_Request',
            url: 'transaction/requestforship'
            // CREATE: {
            //    title: 'Request for shipment created',
            //    description: 'Request for shipment with subject "{0}" created by {1}!',
            // },
            // UPDATE: {
            //    title: 'Request for shipment updated',
            //    description: 'Request for shipment with subject "{0}" updated by {1}!',
            // },
        },
        SHIPPING_REQUESTDET: {
            refTransTableName: 'shipping_requestdet',
            url: 'transaction/requestforship/managerequestforship/detail/{0}'
            // CREATE: {
            //    title: 'Request for shipment details created',
            //    description: 'Request for shipment details created for assembly "{0}" by {1}!',
            // },
            // UPDATE: {
            //    title: 'Request for shipment details updated',
            //    description: 'Request for shipment details updated for assembly "{0}" by {1}!',
            // },
            // DELETE: {
            //    title: 'Request for shipment details removed',
            //    description: 'Request for shipment details removed for "{0}" by {1}!',
            // }
        },
        SHIPPING_REQUEST_EMPDET: {
            refTransTableName: 'shipping_request_empdet',
            url: 'transaction/requestforship/managerequestforship/approval/{0}'
            // CREATE: {
            //    title: 'Employee added for shipment approval request',
            //    description: 'Employee "{0}" added for shipment approval request "{1}" by {2}!',
            // },
            // UPDATE: {
            //    title: 'Employee request updated for shipment approval request',
            //    description: 'Employee "{0}" updated for shipment approval request "{1}" by {2}!',
            // },
            // DELETE: {
            //    title: 'Employee removed from shipment approval request',
            //    description: 'Employee "{0}" removed from shipment approval request "{1}" by {2}!',
            // },
            // ACK: {
            //    title: 'Employee approval request acknowledged',
            //    description: 'Employee "{0}" approval request acknowledged for shipment request "{1}" by {2}!',
            // }
        },
        SHIPPEDASSEMBLY: {
            refTransTableName: 'shippedassembly',
            url: 'transaction/shipped/manageshipped/{0}'
            // CREATE: {
            //    title: 'Shipped assembly added',
            //    description: 'Shipped assembly for work order "{0}" & quantity "{1}" by {2}!',
            // },
            // UPDATE: {
            //    title: 'Shipped assembly updated',
            //    description: 'Shipped assembly for work order "{0}" & quantity "{1}" updated by {2}!',
            // },
        },
        WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION: {
            refTransTableName: 'workorder_assembly_excessstock_location',
            url: 'transaction/inhouseassemblystock'
            // CREATE: {
            //    title: 'In house assembly stock location added',
            //    description: 'In house assembly stock location "{0}" added for work order "{1}" & assembly "{2}" by {3}!',
            // },
            // UPDATE: {
            //    title: 'In house assembly stock location updated',
            //    description: 'In house assembly stock location "{0}" updated for work order "{1}" & assembly "{2}" by {3}!',
            // },
            // DELETE: {
            //    title: 'In house assembly stock location(s) removed',
            //    description: 'In house assembly stock location(s) "{0}" removed for work order "{1}" & assembly "{2}" by {3}!',
            // },
        },
        PRINT_WORKORDER_OPERATION_DETAILS: {
            url: 'task/tasklist/travel/{0}/{1}/{0}'
            // title: 'Print operation performed for work order operation',
            // description: 'Print operation performed from operation "{0}" of work order {1} by {2}!'
        }
    },
    EQUIPMENT_TOOLS: {
        NAME: 'Equipment, Workstation & Sample'
    },
    EQUIPMENT_TASKS: {
        NAME: 'Equipment, Workstation & Sample schedule task'
    },
    WORKORDER_ASSEMBLY_EXCESSSTOCK_LOCATION: {
        NAME: 'Work Order Geolocation for assembly stock'
    },
    RFQ: {
        NAME: 'RFQ',
        RFQ_STATUS_NAME: 'RFQ Status'
    },
    ASSEMBLY_HISTORY: {
        NAME: 'Activity History'
    },
    RFQ_ASSEMBLY: {
        NAME: 'RFQ assembly',
        SAME_QUANTITY_EXISTS: 'Same quantity for \'Assembly # {0}\' is already exists.',
        SAME_ASSY_EXISTS: 'Same Assembly \'{0}\' is already exists in current RFQ. Please reload page for get latest Updates.'
    },
    COMPONET_CUST_REV: {
        MESSAGE: 'This revision is already exists, Do you want to change the internal revision? last revision is {0}.'
    },
    RFQ_ASSY_QUANTITY: {
        NAME: 'RFQ assy. quantity'
    },
    RFQ_ASSY_MISC_BUILD: {
        NAME: 'RFQ assy. Misc Build'
    },
    RFQ_ASSY_QTY_TURN_TIME: {
        NAME: 'RFQ assy. quantity turn time'
    },
    WORKORDER_TRANS_PACKAGINGDETAIL: {
        NAME: 'Box Serials'
    },
    GOOD_BAD_PART: {
        Name: 'Good MFR Part'
    },
    REPORT_CHANGE_LOGS: {
        NAME: 'Report Change Logs'
    },
    DIGIKEY_TYPE_ACC: {
        FJT_BOM_CLEAN: 'FJT-CleanBOM',
        FJT_SCHEDULE_PARTUPDATE: 'FJT-ScheduleForPartUpdate',
        FJT_SCHEDULE_PARTUPDATEV3: 'FJTV3-ScheduleForPartUpdate',
        FJT: 'FJT',
        FJTV3: 'FJT-V3',
        FJTV3_BOM_CLEAN: 'FJTV3-CleanBOM'
    },
    DIGIKEY_VERSION: {
        DKV3: 'V3',
        DKV2: 'V2'
    },
    DKVersion: 'DKVersion',
    PricingServiceStatus: 'PricingServiceStatus',
    PRICING: {
        DIGI_KEY: {
            CLIENT_ID: 'c07d5b9b-89b0-4958-8c40-b7238e1aec1a',
            CLIENT_SECREATKEY: 'S1iM7oB2vD6tT5hX6mB6cO4bK7rO0uJ4wI7eL5lO7kB8cP5oY5',
            GRANT_TYPE: 'authorization_code',
            REDIRECT_URI: 'https://www.digikey.com',
            HOST_NAME_CODE: 'sso.digikey.com',
            HOST_NAME_API: 'api.digikey.com',
            CODEGETAPI: '/as/token.oauth2',
            CODEGETAPIV3: '/v1/oauth2/token',
            PARTGETAPI: '/services/partsearch/v2/keywordsearch',
            PARTGETAPIV3: '/Search/v3/Products/Keyword',
            POST: 'POST',
            GET: 'GET',
            CACHE: 'no-cache',
            CONTENT_TYPE_PART: 'application/json',
            CONTENT_TYPE_CODE: 'application/x-www-form-urlencoded',
            PART_SEARCHAPI: '/services/partsearch/v2/partdetails',
            PART_SEARCHAPIV3: '/Search/v3/Products/{0}',
            DIGI: 'digi',
            Weeks: 'weeks',
            Week: 'week',
            Tolerance: 'Tolerance',
            OperatingTemp: 'Operating Temperature',
            OperatingTempJunc: 'Operating Temperature - Junction',
            Thickness: 'Thickness - Overall',
            Height: 'Height',
            HeightMax: 'Height - Seated (Max)',
            Size: 'Size / Dimension',
            Width: 'Width',
            Feature: 'Features',
            MountingType: 'Mounting Type',
            ConnectorType: 'Connector Type',
            Package: 'Package / Case',
            Voltage: 'Voltage - Rated',
            Capacitance: 'Capacitance',
            Inductance: 'Inductance',
            ResistanceInOhms: 'Resistance (Ohms)',
            Resistance: 'Resistance',
            PowerElement: 'Power Per Element',
            Power: 'Power (Watts)',
            NoOfRows: 'Number of Rows',
            Pitch: 'Pitch',
            PitchMating: 'Pitch - Mating',
            TemperatureCoefficient: 'Temperature Coefficient',
            Color: 'Color',
            VoltageRating: 'Voltage Rating',
            CuTTape: 'Cut Tape (CT)',
            DigiReel: 'Digi-Reel®',
            TapeAndReel: 'Tape & Reel (TR)',
            Tube: 'Tube',
            ProductPhoto: 'Product Photos',
            ProductCatelog: 'Catalog Drawings',
            Packaging: 'Packaging',
            DIGI_KEY_SUPPLIER: -1,
            MaxRedirects: 20,
            REFRESH_TOKEN: 'refresh_token'
        },
        AVNET: {
            URL: '/ws/getDEXFetchProductsVS/wcs?STORE_ID={0}&searchTerm={1}&searchType=MFPARTNUMBER&infoLevel=COMPLETE',
            AUTH: 'Basic c3lzZmxleHRhcGk6dDl1S2ZSeDg=',
            CACHE: 'no-cache',
            HOST: 'b2b.avnet.com',
            PORT: '10443',
            GET: 'GET',
            WCToken: '1161067%2Cq2ZjuoBT2xzOLWnKRPL0%2B38r%2FA74HlNfrAk08rrYyXK0TDOJke0EYpkxUcwhdRnx%2FA7Jmkm6wIpJAXQ3XckgRhd8u8Utj52XOiGX%2F8%2FLPpRYfxR804TC306rPeGhS1amlfwsNsg3VqV%2FV06MBZiUNKJOzZTnxVH1cNcrj7T2MFSX%2B4N9uP7GCq5LYta2nJhHKvhin1MICtB1YLuUZGQfNg%3D%3D',
            WCTrustedToken: '1161067%2Chn5a%2F81q8%2BuwhhZRnPB4p4wkkc8%3D',
            STORE_ID: '715839035',
            ACCEPT: 'application/json',
            Avnet: 'Avnet',
            PinCount: 'Pin Count',
            Height: 'Product Height',
            Temprature: 'Operating Temperature',
            Mounting: 'Mounting',
            Size: 'Product Dimensions',
            Capacitance: 'Capacitance Value',
            Tolerance: 'Tolerance',
            Voltage: 'Voltage(DC)',
            CaseSize: 'Case Size',
            SupplierPackage: 'Supplier Package',
            Pitch: 'Pitch',
            Feature: 'productFeatures'
        },
        NEWARK: {
            API_KEY: 'f463bdbggmtrv4d779q556fr',
            CACHE: 'no-cache',
            SEARCH_ID: 'www.newark.com',
            HOST: 'api.element14.com',
            GET: 'GET',
            API: '/catalog/products',
            NEWARK: 'newark',
            NoOfContact: ' No. of Contacts',
            Length: ' Length',
            Width: ' Width',
            Height: ' Depth',
            HeightMax: ' Height',
            Tolerance: ' Resistance Tolerance',
            Packaging: ' Packaging',
            OperatingMin: ' Operating Temperature Min',
            OperatingMax: ' Operating Temperature Max',
            CapaTolerance: ' Capacitance Tolerance',
            NoOfPins: ' No. of Pins',
            Capacitance: ' Capacitance',
            Inductance: ' Inductance',
            Resistance: ' Resistance',
            VoltageRate: ' Voltage Rating',
            IsoVoltage: ' Isolation Voltage',
            PowerRating: ' Power Rating',
            ResPackage: ' Resistor Case Style',
            NoOfRows: ' No. of Rows',
            LEDColor: ' LED Color'
        },
        Mouser: {
            SOAP_URI: 'http://schemas.xmlsoap.org/soap/envelope/',
            HEADER: 'http://api.mouser.com/service',
            API_KEY: 'c30aac7a-061f-4a07-8a2f-72b32f637e0c ',
            HOST: 'api.mouser.com',
            API: 'https://api.mouser.com/service/searchapi.asmx',
            CONTENT: 'text/xml',
            CACHE: 'no-cache',
            POST: 'POST',
            MOUSER: 'mouser',
            Days: 'Days',
            Day: 'Day',
            Días: 'Días',
            Día: 'Día',
            Dias: 'Dias',
            Dia: 'Dia',
            Envelope: 'soap:Envelope',
            Body: 'soap:Body',
            Packaging: 'Packaging',
            ConductiveEpoxy: 'Conductive Epoxy',
            CuTTape: "Cut Tape",
            MouseReel: 'MouseReel',
            CONTENT_TYPE: 'application/json',
            MO_API_PATH: 'https://api.mouser.com/api/v1/search/partnumber?apiKey={0}'
        },
        Arrow: {
            HOST: 'api.arrow.com',
            GET: 'GET',
            NO_CACHE: 'no-cache',
            API_KEY: '9b4ec42e3ec43be42669494e12c91b120e595d22a580dc5c5cd0c4664dd4137c',
            LOGIN: 'flextronassembly',
            PATH_URL: '/itemservice/v3/en/search/token?login={0}&apikey={1}&search_token={2}&rows=5',
            ACNA: 'ACNA',
            RoHS: 'eurohs'
        },
        TTI: {
            HOST: 'www.ttiinc.com',
            GET: 'GET',
            NO_CACHE: 'no-cache',
            SOURCE: 'flextroncircuitassembly',
            ACCESS_TOKEN: 'b0e77920-3e42-4afe-acc1-6d6614eb51fe',
            HEADER: 'C9ZRS2D2wYcZT',
            PATH_URL: '/service/part/search/customer/json?searchTerms={0}&accessToken={1}&utm=APIILF034&channel=api&source={2}&campaigns=tti-api'
        },
        OCTOPART: {
            HOST: 'octopart.com',
            GET: 'GET',
            PATH_URL: '/api/v4/rest/parts/match?apikey={0}&queries=[{"mpn":"{1}"}]&pretty_print=true&include[]=specs&include[]=imagesets&include[]=category_uids&include[]=descriptions&include[]=compliance_documents&include[]=datasheets&include[]=external_links',
            NO_CACHE: 'no-cache',
            ACCEPT: 'application/json'
        },
        HEILIND: {
            HOST: 'ebizapi.dac-group.com',
            GET: 'GET'
        },
        DigiKeyClientID: 'DigiKeyClientID',
        DigiKeySecretID: 'DigiKeySecretID',
        DigiKeyCustomeID: 'DigiKeyCustomeID',
        DigiKeyCode: 'DigiKeyCode',
        DigiKeyRefreshToken: 'DigiKeyRefreshToken',
        DigiKeyAccessToken: 'DigiKeyAccessToken',
        DigikeyRecordCount: 'DigikeyRecordCount',
        PIDCodeLength: 'PIDCodeLength',
        MouserApiKey: 'MouserApiKey',
        NewarkCluster: 'Newark',
        MouserCluster: 'Mouser',
        AvnetCluster: 'Avnet',
        HeilindCluster: 'Heilind',
        AvnetAPIPath: 'AvnetAPIPath',
        HeilindPartner: 'HeilindPartnerName',
        HeilindToken: 'HeilindAccessToken',
        AvnetSubscriptionKey: 'AvnetSubscriptionKey',
        AvnetHostName: 'AvnetAPIHostName',
        DigiKeyCluster: 'DigiKey',
        RohsComplient: 'RoHS Compliant',
        AvnetStoreID: 'AvnetStoreID',
        AvnetToken: 'AvnetAuthToken',
        ArrowLoginKey: 'ArrowLoginKey',
        ArrowApiKey: 'ArrowApiKey',
        TTIAccessToken: 'TTIAccessToken',
        TTIHeader: 'TTIHeader',
        EACH: 'EACH',
        Active: 'Active',
        MOUSER: 'MO',
        LastTimeBuy: 'Last Time Buy',
        NoOfPosition: 'Number of Positions',
        Length: 'Length',
        LeadFree: 'Lead Free',
        DIGIKEY: 'DK',
        ERR_AUTH: 401,
        ERR_NOTADD: '404',
        ERR_RATE: 429,
        ERR_PID: '101',
        Newark: 'NW',
        Avnet: 'AV',
        ARROW: 'AR',
        tti: 'TTI',
        ERR_MOUNT_NOTADD: '402',
        ERR_UOM_NOTADD: '403',
        ERR_CONNECT_NOTADD: '407',
        ERR_PACKAGING_NOTADD: '408',
        ERR_PARTTYPE_NOTADD: '405',
        ERR_ROHS_NOTADD: '406',
        NewarkURL: 'http://www.newark.com/',
        Yes: 'YES',
        Manufacturer: 'Manufacturer',
        Distributor: 'Distributor',
        Weight: 'Weight',
        NAME: 'Pricing',
        DIST: 'DISTY',
        MFG: 'MFG',
        PIDCodeDuplicate: 'PIDCodeDuplicate',
        Auto: 'Auto',
        AliasGroupID: 'AliasGroupID',
        AlternateGroupID: 'AlternateGroupID',
        PackagingGroupID: 'PackagingGroupID',
        INCH: 'in',
        MountingType: 'Mounting Type',
        PartType: 'Functional Type',
        Rohs: 'RoHS',
        UOM: 'Unit',
        ConnecterType: 'Connector Type',
        PackagingType: 'Packaging Type',
        TBD: 'TBD',
        NewarkCustomerID: 'NewarkCustomerID',
        NewarkSecretKey: 'NewarkSecretKey',
        NewarkApiKey: 'NewarkApiKey',
        OctoPartApiKey: 'OctoPartApiKey',
        ComponentUpdateTimeInterval: 'ComponentUpdateTimeInterval',
        BartenderServer: 'BartenderServer',
        BartenderServerPort: 'BartenderServerPort',
        Printer: 'Printer',
        Obsolete: 'Obsolete',
        RoHS_Status: 1,
        Non_RoHS_Status: 0,
        NONE_Status: -1,
        NONE_UOM: 0,
        NO: 'NO'
    },
    COMPONENT_LOGICALGROUP: {
        SUPPLIES: {
            ID: 1,
            Name: 'Supplies'
        },
        MATERIALS: {
            ID: 2,
            Name: 'Materials'
        },
        TOOLS: {
            ID: 3,
            Name: 'Tools'
        }
    },
    RFQMountingType: {
        TBD: {
            ID: -1,
            Name: 'TBD'
        },
        Assembly: {
            ID: 1,
            Name: 'Assembly'
        },
        ThruHole: {
            ID: 2,
            Name: 'Thru-Hole'
        },
        SMT: {
            ID: 3,
            Name: 'SMT'
        },
        BarePCB: {
            ID: 4,
            Name: 'Bare PCB'
        },
        Tools: {
            ID: 5,
            Name: 'Tools'
        }
    },
    WHO_BOUGHT_WHO: {
        DISPLAYNAME: 'Mergers & Acquisitions',
        NAME: 'Who Acquired Who'
    },
    SETTINGS: {
        DISPLAYNAME: 'Data Key',
        NAME: 'Settings',
        DISPLAYKEYNAME: 'Digikey API key'
    },
    WORKORDER_EQUIPMENT_FEEDER_DETAILS: {
        DISPLAYNAME: 'Feeder Details',
        NAME: 'Feeder Details'
    },
    WORKORDER_TRANS_UMID_DETAILS: {
        DISPLAYNAME: 'UMID Scan Details',
        NAME: 'UMID Scan Details'
    },
    APPROVAL_REASON: {
        DISPLAYNAME: 'Approval Reason',
        NAME: 'Approval Reason'
    },
    DYNAMIC_MESSAGE_CONSTANT: {
        NAME: 'Dynamic message',
        EMP_TIMELINE_NAME: 'Timeline message',
        MODULE_NAMES: {
            EMPLOYEE_TIMELINE: 'EMPLOYEE_TIMELINE'
        },
        MESSAGE_ACCESS_DATA: [{
            DEFAULT_PATH: './constant_json/default/global.json',
            UPLOAD_PATH: './constant_json/global/global.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/global/backup_message_file/',
            BACKUP_FILE_NAME: 'global',
            MODULE_NAME: 'Global',
            NAME: 'CORE',
            /* this name used at UI project to identify object and assign value */
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/workorder.json',
            UPLOAD_PATH: './constant_json/workorder/workorder.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/workorder/backup_message_file/',
            BACKUP_FILE_NAME: 'workorder',
            MODULE_NAME: 'Work Order',
            NAME: 'WORKORDER',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/admin.json',
            UPLOAD_PATH: './constant_json/admin/admin.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/admin/backup_message_file/',
            BACKUP_FILE_NAME: 'admin',
            MODULE_NAME: 'Admin',
            NAME: 'USER',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/operation.json',
            UPLOAD_PATH: './constant_json/operation/operation.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/operation/backup_message_file/',
            BACKUP_FILE_NAME: 'operation',
            MODULE_NAME: 'Operation',
            NAME: 'OPERATION',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/reports.json',
            UPLOAD_PATH: './constant_json/reports/reports.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/reports/backup_message_file/',
            BACKUP_FILE_NAME: 'reports',
            MODULE_NAME: 'Reports',
            NAME: 'REPORTS',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/task.json',
            UPLOAD_PATH: './constant_json/task/task.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/task/backup_message_file/',
            BACKUP_FILE_NAME: 'task',
            MODULE_NAME: 'Task',
            NAME: 'TASK',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/transaction.json',
            UPLOAD_PATH: './constant_json/transaction/transaction.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/transaction/backup_message_file/',
            BACKUP_FILE_NAME: 'transaction',
            MODULE_NAME: 'Transaction',
            NAME: 'TRANSACTION',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/traveler.json',
            UPLOAD_PATH: './constant_json/traveler/traveler.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/traveler/backup_message_file/',
            BACKUP_FILE_NAME: 'traveler',
            MODULE_NAME: 'Traveler',
            NAME: 'TRAVELER',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/rfqtransaction.json',
            UPLOAD_PATH: './constant_json/rfqtransaction/rfqtransaction.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/rfqtransaction/backup_message_file/',
            BACKUP_FILE_NAME: 'rfqtransaction',
            MODULE_NAME: 'RFQTRANSACTION',
            NAME: 'RFQTRANSACTION',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/widget.json',
            UPLOAD_PATH: './constant_json/widget/widget.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/widget/backup_message_file/',
            BACKUP_FILE_NAME: 'widget',
            MODULE_NAME: 'WIDGET',
            NAME: 'WIDGET',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/configuration.json',
            UPLOAD_PATH: './constant_json/configuration/configuration.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/configuration/backup_message_file/',
            BACKUP_FILE_NAME: 'configuration',
            MODULE_NAME: 'CONFIGURATION',
            NAME: 'CONFIGURATION',
            USED_AT: 'ui'
        },
        {
            DEFAULT_PATH: './constant_json/default/api_message.json',
            UPLOAD_PATH: './constant_json/api_message/api_message.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/api_message/backup_message_file/',
            BACKUP_FILE_NAME: 'api_message',
            MODULE_NAME: COMMON.Api_Message_Module_Name,
            USED_AT: 'api'
        },
        {
            DEFAULT_PATH: './constant_json/default/emp_timeline.json',
            UPLOAD_PATH: './constant_json/emp_timeline/emp_timeline.json',
            BACKUP_FILE_UPLOAD_PATH: './constant_json/emp_timeline/backup_message_file/',
            BACKUP_FILE_NAME: 'emp_timeline',
            MODULE_NAME: 'EMPLOYEE_TIMELINE',
            USED_AT: 'emp_timeline'
        }


        ]
    },
    MESSAGE_CONFIGURATION_CONSTANT: {
        NAME: 'Dynamic message',
        MODULE_NAMES: {
            MESSAGE_USAGE: 'Where Used detail'
        }
    },


    CONSOLIDATE_MFGPN_RFQLINEITEM: {
        Name: 'consolidated MFGPN line item'
    },
    SERVICE_QUEUE_PART: {
        BOM_CLEAN_QUEUE: 'BOMCleanServiceDKQueue',
        BOM_CLEANV3_QUEUE: 'BOMCleanServiceDKV3Queue',
        SCHEDULE_PART_UPDATE_QUEUE: 'SchedulePartUpdateQueue',
        ENTERPRISE_ADD_DETAIL_QUEUE: 'EnterpriseAddDetailQueue',
        PART_CLEAN_QUEUE: 'PartCleanServiceDKQueue',
        PART_CLEANV3_QUEUE: 'PartCleanServiceDKV3Queue'
    },
    PRICING_SUPPLIER: [
        { Name: 'DigiKey', ID: -1, QueueName: 'DigiKeyServiceQueue' },
        { Name: 'Newark', ID: -2, QueueName: 'NewarkServiceQueue' },
        { Name: 'Mouser', ID: -3, QueueName: 'MouserServiceQueue' },
        { Name: 'TTI', ID: -4, QueueName: 'TTIServiceQueue' },
        { Name: 'Arrow', ID: -5, QueueName: 'ArrowServiceQueue' },
        { Name: 'Avnet', ID: -6, QueueName: 'AvnetServiceQueue' },
        { Name: 'Heilind', ID: -12, QueueName: 'HeilindServiceQueue' }
    ],
    DK_PRICING_SUPPLIER_QUEUE: 'DigiKeyServiceV3Queue',
    PART_PICTURE_SERVICE_QUEUE: 'PartPictureServiceQueue',
    PRICING_STATUS: {
        SendRequest: 0,
        NotPricing: 1,
        Success: 2
    },
    DBVersion: {
        NAME: 'DB Script'
    },
    WORKORDER_PRINT_TEMPLATE: './default/template/workorder-print-report.html',
    DEFAULT_PDF_FORMAT_PATH: './default/template',
    KEYWORD: {
        NAME: 'Keyword'
    },
    COMPONENT_ERROR_TYPE: {
        MFGNOTADDED: 'MFGNOTADDED',
        DISTNOTADDED: 'DISTYNOTADDED',
        PARTINVALID: 'PARTINVALID',
        AUTHFAILED: 'AUTHFAILED',
        UNKNOWN: 'UNKNOWN',
        MOUNTNOTADDED: 'MOUNTNOTADDED',
        UOMNOTADDED: 'UOMNOTADDED',
        PARTTYPENOTADDED: 'PARTTYPENOTADDED',
        ROHSNOTADDED: 'ROHSNOTADDED',
        CONNECTNOTADDED: 'CONNECTNOTADDED',
        PACKAGINGNOTADDED: 'PACKAGINGNOTADDED',
        PARTSTATUSNOTADDED: 'PARTSTATUSNOTADDED',
        PIDCODELENGTH: 'PIDCodeLength'
    },
    COMPONENT_AIP_ERROR_MESSAGE: {
        NOT_ADDED: "<b>{1}</b> \"{0}\" does not exist. Please add.",
    },
    IMPORT_EXCEL_VALIDATION: {
        EMPLOYEE: {
            VALIDATIONFIELDLIST: ['email', 'code', 'initialName']
        }
    },
    dbChangesFilePath: {
        MainBranch: {
            Db_Script_1: "./dbscript/main_branch/dbscript_main_01.js",
            Db_Script_2: "./dbscript/main_branch/dbscript_main_02.js",
            Db_Script_3: "./dbscript/main_branch/dbscript_main_03.js",
            Db_Script_4: "./dbscript/main_branch/dbscript_main_04.js",
            Db_Script_5: "./dbscript/main_branch/dbscript_main_05.js",
            Db_Script_6: "./dbscript/main_branch/dbscript_main_06.js",
            Db_Script_7: "./dbscript/main_branch/dbscript_main_07.js",
            Db_Script_8: "./dbscript/main_branch/dbscript_main_08.js"
        },
        DevBranch: {
            Db_Script_1: "./dbscript/dev_branch/dbscript_dev_01.js",
            Db_Script_2: "./dbscript/dev_branch/dbscript_dev_02.js",
            Db_Script_3: "./dbscript/dev_branch/dbscript_dev_03.js",
            Db_Script_4: "./dbscript/dev_branch/dbscript_dev_04.js",
            Db_Script_5: "./dbscript/dev_branch/dbscript_dev_05.js",
            Db_Script_6: "./dbscript/dev_branch/dbscript_dev_06.js",
            Db_Script_7: "./dbscript/dev_branch/dbscript_dev_07.js",
            Db_Script_8: "./dbscript/dev_branch/dbscript_dev_08.js",
            Db_Script_9: "./dbscript/dev_branch/dbscript_dev_09.js",
            Db_Script_10: "./dbscript/dev_branch/dbscript_dev_10.js",
            Db_Script_11: "./dbscript/dev_branch/dbscript_dev_11.js",
            Db_Script_12: "./dbscript/dev_branch/dbscript_dev_12.js",
            Db_Script_13: "./dbscript/dev_branch/dbscript_dev_13.js",
            Db_Script_14: "./dbscript/dev_branch/dbscript_dev_14.js",
            Db_Script_15: "./dbscript/dev_branch/dbscript_dev_15.js",
            Db_Script_16: "./dbscript/dev_branch/dbscript_dev_16.js",
            Db_Script_17: "./dbscript/dev_branch/dbscript_dev_17.js",
            Db_Script_18: "./dbscript/dev_branch/dbscript_dev_18.js",
            Db_Script_19: "./dbscript/dev_branch/dbscript_dev_19.js",
            Db_Script_20: "./dbscript/dev_branch/dbscript_dev_20.js",
            Db_Script_21: "./dbscript/dev_branch/dbscript_dev_21.js",
            Db_Script_22: "./dbscript/dev_branch/dbscript_dev_22.js",
            Db_Script_23: "./dbscript/dev_branch/dbscript_dev_23.js",
            Db_Script_24: "./dbscript/dev_branch/dbscript_dev_24.js",
            Db_Script_25: "./dbscript/dev_branch/dbscript_dev_25.js",
            Db_Script_26: "./dbscript/dev_branch/dbscript_dev_26.js",
            Db_Script_27: "./dbscript/dev_branch/dbscript_dev_27.js",
            Db_Script_28: "./dbscript/dev_branch/dbscript_dev_28.js",
            Db_Script_29: "./dbscript/dev_branch/dbscript_dev_29.js",
            Db_Script_30: "./dbscript/dev_branch/dbscript_dev_30.js",
            Db_Script_31: './dbscript/dev_branch/dbscript_dev_31.js'
        },
        DevBranchMessage: {
            Db_Script_Msg_1: './dbscript/dev_branch_message/dbscript_message_1.js',
            Db_Script_Msg_2: './dbscript/dev_branch_message/dbscript_message_2.js'
        },
        MainBranchMessage: {
            Db_Script_Msg_1: './dbscript/main_branch_message/dbscript_message_main_1.js'
        },
        DevBranchIdentity: {
            Db_Script_Identity_1: './dbscript/dev_branch_identity/dbscript_identity_1.js'
        },
        MainBranchIdentity: {
            Db_Script_Identity_1: './dbscript/main_branch_identity/dbscript_identity_main_1.js'
        }
    },
    woQtyApprovalConfirmationTypes: {
        BuildQtyConfirmation: 'BuildQtyConfirmation',
        WOStatusChangeRequest: 'WOStatusChangeRequest'
    },
    Operations_Type_For_WOOPTimeLineLog: {
        DosAndDonts: 'DOSANDDONTS',
        firstPcsDet: 'FIRSTPCSDET',
        WoOpStatus: 'WOOPSTATUS'
    },
    PRICING_SETTING: {
        NAME: 'Pricing quantity settings'
    },
    PRICING_HISTORY: {
        NAME: 'Pricing history'
    },
    SUMMARY_QUOTE: {
        NAME: 'Quotation'
    },
    LABOR: {
        NAME: 'Labor'
    },
    Quote_Dynamic_Fields: {
        DISPLAYNAME: 'Quote Attribute',
        NAME: 'Quote Dynamic Fields',
        UNIQUE_FIELD: 'Field name'
    },
    COST_CATEGORY: {
        NAME: 'Cost Category',
        UNIQUE_FIELD: 'Category'
    },
    PART_CATEGORY: {
        PCB: {
            ID: 1,
            NAME: 'PCB'
        },
        COMPONENT: {
            ID: 2,
            NAME: 'Component'
        },
        SUBASSEMBLY: {
            ID: 3,
            NAME: 'Sub Assembly'
        }
    },
    PART_TYPE_ID: {
        OTHER: 4
    },
    USER_ROLE: {
        SUPER_ADMIN: { NAME: 'Super Admin', ID: 1 },
        EXECUTIVE: { NAME: 'Executive' },
        MANAGER: { NAME: 'Manager' },
        ENGINEER: { NAME: 'Engineer' },
        TEAMLEAD: { NAME: 'Team Lead' },
        OPERATOR: { NAME: 'Operator' }
    },
    CUSTOMER_APPROVAL: {
        NONE: 'N',
        APPROVED: 'A',
        PENDING: 'P'
    },
    GENERIC_CATEGORY_TYPE: {
        PART_STATUS: "Part Status",
        TERMS_TYPE: "Payment Terms",
        SHIPPING_METHODS: "Shipping Methods",
        EQUIPMENT_WORKSTATION_TYPES: "Equipment, Workstation & Sample Types",
        EQUIPMENT_WORKSTATION_GROUPS: "Equipment, Workstation & Sample Groups",
        EQUIPMENT_WORKSTATION_OWNERSHIPS: "Equipment, Workstation & Sample Ownerships",
        GEOLOCATIONS: "Geolocations",
        ECO_DFM_TYPE: "ECO/DFM Type",
        BARCODE_SEPARATORS: 'Barcode Separators',
        CARRIER: 'Carrier',
        REPORT_CATEGORY: 'Report Category',
        PayablePaymentMethod: 'Payable Payment Method',
        ReceivablePaymentMethod: 'Receivable Payment Method',
        PaymentTypeCategory: 'Payment Type Category'
    },
    ERRORLOGS: {
        NAME: 'Error Logs'
    },
    COUNTRYMST: {
        NAME: 'Country'
    },
    FORMS_EMPLOYEE: {
        NAME: 'Form personnel'
    },
    COUNTRY: {
        NAME: 'Country',
        UPLOAD_PATH: './uploads/country/images/',
        UNIQUE_FIELD_NAME: 'Country name',
        UNIQUE_FIELD_SORT_CODE: 'Country sort code'
    },
    DYNAMIC_REPORT: {
        NAME: 'Dynamic Report',
        END_USER_REPORT_FILE_PATH: './enduserreport/',
        SYSTEM_REPORT_FILE_PATH: './reports/staticreport/',
        TEMPLATE_FILE_PATH: './reports/template/',
        REPORT_EXTENSTION: '.mrt',
        DEFUALT_DB_NAME: 'FlextTron',
        DB_SERVER: 'Server=localhost; Database=flexjobtracking_dev;UserId=root; Pwd=triveni@123;',
        REPORT_NAME: 'Report name',
        REPORT_CATEGORY: {
            STATIC_REPORT: 1,
            END_USER_REPORT: 2,
            TEMPLATE_REPORT: 3,
            SYSTEM_GENERATED_REPORT: 4
        },
        TEMPLATE: {
            NAME: 'Template'
        },
        REPORT_STATUS: {
            DRAFT: 'D',
            PUBLISHED: 'P'
        },
        REPORT_CREATE_TYPE: {
            CreateNew: 0,
            CloneFromExisting: 1
        },
        DEFAULT_REPORT_PARAMETER: {
            ReportTitle: 'Para_ReportTitle',
            ROHSImagePath: 'Para_RoHSImagePath',
            AdditionalNotes: 'Para_AdditionalNotes',
            WhereCluse: 'Para_WhereCluse',
            Employee: 'Para_EmployeeID',
            AssyPN: 'Para_AssyPN'
        }
    },
    REPORT_PARAMETER_SETTING_MAPPING: {
        NAME: 'Report Filter Parameter'
    },
    LICENSE_INFO: {
        NAME: 'Company License'
    },
    CONNECTER_TYPE: {
        NAME: 'Connector Type',
        TableName: 'rfq_connectertypemst'
    },
    ConnectorType: {
        HEADERBREAKAWAY: {
            ID: -2,
            Name: 'Header, Breakaway'
        }
    },
    DEFAULT_PARTS: {
        TO_BE_DETERMINED: {
            ID: -1,
            Name: 'To Be Determined'
        },
        NOT_A_COMPONENT: {
            ID: -2,
            Name: 'NOT-A-COMPONENT'
        },
        Not_Available: {
            ID: -3,
            Name: 'Not Available'
        },
        Any: {
            ID: -4,
            Name: 'Any'
        }
    },
    /*ROHS: {
        NAME: "RoHS",
        UPLOAD_PATH: './uploads/rohs/images/'
    },*/
    WAREHOUSEMST: {
        NAME: 'Warehouse'
    },
    INOVAXETRANSACTION: {
        NAME: 'Inovaxe Notification Log'
    },
    COMPONENT_MSL: {
        NAME: 'Component MSL'
    },
    BINMST: {
        NAME: 'Bin'
    },
    VERIFICATION_HISTORY: {
        NAME: 'Verification history'
    },
    LABEL_TEMPLATE: {
        NAME: 'Label Template',
        LABEL_INFORMATION: 'Label Template information',
        NOT_VERIFIED: 'Label Template not verified.',
        BARETENDER_INTEGRATION_FILE_PATH: '/default/barcodedocument/barTenderDocuments/IntegrationFile.btin'
    },
    PRICE_FILTER: {
        GetRFQConsolidateRfqLineItem: {
            ID: 1,
            Name: 'All',
            SpName: 'Sproc_GetRFQConsolidateRfqLineItem'
        },
        GetRFQUnQuotedLineItems: {
            ID: 2,
            Name: 'Unquoted Items',
            SpName: 'Sproc_GetRFQUnQuotedLineItems'
        },
        GetRFQCustomRulesLineItems: {
            ID: 3,
            Name: '80-20 Rules',
            SpName: 'Sproc_GetRFQCustomRulesLineItems'
        },
        GetExcessMaterialLineItems: {
            ID: 4,
            Name: 'Excess Material Exposure',
            SpName: 'Sproc_GetExcessMaterialLineItems'
        },
        GetRFQMaterialAtRiskLineItems: {
            ID: 5,
            Name: 'NRND & Obsolete Items',
            SpName: 'Sproc_GetRFQMaterialAtRiskLineItems'
        },
        GetLeadTimeRiskLineItems: {
            ID: 6,
            Name: 'Lead Time Risk',
            SpName: 'Sproc_GetLeadTimeRiskLineItems'
        },
        GetRFQManualSelectPrice: {
            ID: 7,
            Name: 'Manual Selected Price',
            SpName: 'Sproc_GetRFQManualSelectPrice'
        },
        GetCostingNotRequiredDNP: {
            ID: 8,
            Name: 'Costing Not Required(DNP)',
            SpName: 'Sproc_GetRFQCostingNotRequireLineItem'
        }
    },
    modulesForExportSampleTemplate: {
        MANUFACTURE: 'Manufacturer',
        SUPPLIER: 'Supplier',
        PERSONNEL: 'Personnel',
        EQUIPMENT_WORKSTATION: 'Equipment, Workstation & Sample',
        EQUIPMENT: 'Equipment'
    },
    Wo_Op_Cleaning_Type: {
        Water_Soluble: 'WS',
        No_Clean: 'NC',
        Not_Applicable: 'NA'
    },
    ActivityTransactionType: {
        BOM: 'B',
        Costing: 'C',
        Kit: 'K'
    },
    SCAN_DOCUMENT_API: {
        CONNECTION_FAILED: 'Internal Scanner Server is down.<br />Please contact to administrator or try again.'
    },
    SCANNER_MST: {
        NAME: 'Scanner'
    },
    REPORT: {
        NAME: 'Reports'
    },
    ComponentAlternatePNValidations: {
        NAME: 'Part Alias Validations'
    },
    Component_Price_Break_Details: {
        NAME: "Sell Price Break",
        PARTS_PRICE_PRICE_BREAK_NAME: "Sales Price Break",
        ASSEMBLY_SALES_PRICE: 'Sales Price',
        Type: {
            PriceBreak: 1,
            AssySalesPrice: 2
        }
    },
    SUPPLIER_QUOTE_FROM: {
        FromRFQ: 1,
        FromPartMaster: 2,
        NA: 3
    },
    ComponentDynamicAttributeMappingPart: {
        NAME: 'Operational Attribute'
    },
    DB_DUPLICATE_MESSAGE: {
        DUPLICATE: 'ER_SIGNAL_EXCEPTION: Duplicate entry'
    },
    PRINT_BARCODE_PAGE_NAME: {
        ReceivingMaterial: 'Receiving Material',
        Warehouse: 'Warehouse',
        Bin: 'Bin',
        Rack: 'Rack',
        SearchMaterial: 'Search Material',
        SerialNo: 'Serial#'
    },
    BARCODDE_CATEGORY: {
        MFRPN: 'M',
        PACKINGSLIP: 'P'
    },
    RoHSMainCategory: {
        RoHS: -1,
        NonRoHS: -2,
        NotApplicable: -3
    },
    ROHS_DEFAULT_ICON: {
        RoHS: 'rohs-big.png',
        NonRoHS: 'non-rohs-big.png',
        NotApplicable: 'noimage.png'
    },
    RoHSDeviationDet: {
        No: -1,
        WithApproval: -2,
        Yes: -3
    },
    EMPLOYEE_CERTIFICATION: {
        NAME: 'Personnel certification'
    },
    CONTACT_PERSON: {
        NAME: 'Contact Pesrson'
    },
    CUSTOMER_EMPLOYEE_MAPPING: {
        NAME: 'Customer Personnal'
    },
    RFQ_ASSY_STATUS: {
        IN_PROGRESS: {
            NAME: 'In Progress',
            VALUE: 1
        },
        FOLLOW_UP: {
            NAME: 'Follow UP',
            VALUE: 2
        },
        WON: {
            NAME: 'Win',
            VALUE: 3
        },
        LOST: {
            NAME: 'Loss',
            VALUE: 4
        },
        CANCEL: {
            NAME: 'Cancel',
            VALUE: 5
        }
    },
    WO_Status: [{
        ID: 0,
        Name: 'Draft'
    }, {
        ID: 1,
        Name: 'Published'
    }, {
        ID: 2,
        Name: 'Completed'
    }, {
        ID: 4,
        Name: 'Void'
    }, {
        ID: 5,
        Name: 'Draft Under Review'
    }, {
        ID: 6,
        Name: 'Under Termination'
    }, {
        ID: 7,
        Name: 'Terminated'
    }, {
        ID: 8,
        Name: 'Published Draft & Review'
    },
    {
        ID: 9,
        Name: 'Completed With Missing Parts'
    }],
    RECEIVING_MATIRIAL_TAB: [{
        Name: 'receivingPartToStock',
        title: 'Purchased Part'
    }, {
        Name: 'receivingList',
        title: 'UMID List'
    }, {
        Name: 'cpnReceive',
        title: 'Customer Consigned Part'
    }, {
        Name: 'verificationHistory',
        title: 'Verification History'
    }, {
        Name: 'UIDManagement',
        title: 'UMID Management'
    }, {
        Name: 'NonUMIDStockList',
        title: 'UMID Pending Parts'
    }],
    MFG_TYPE_DETAIL: [{
        Name: 'Manufacturer',
        Type: 'MFG'
    }, {
        Name: 'Supplier',
        Type: 'DIST'
    }],
    OPERATION_RADIO_GROUP: {
        CLEANING_TYPE: [{ KEY: 'Not Applicable', VALUE: 'NA' }, { KEY: 'No-Clean', VALUE: 'NC' }, { KEY: 'Water-Soluble', VALUE: 'WS' }],
        QTY_CONTROL: [{ KEY: 'Qty Tracking Required', VALUE: true }, { KEY: 'Qty Tracking Not Required', VALUE: false }],
        IS_REWORK: [{ KEY: 'Rework Operation', VALUE: true }, { KEY: 'Non-Rework Operation', VALUE: false }],
        IS_ISSUE_QTY: [{ KEY: 'Issue Qty Required', VALUE: true }, { KEY: 'Issue Qty Not Required', VALUE: false }],
        IS_TEAM_OPERATION: [{ KEY: 'One Person Operation', VALUE: false }, { KEY: 'Team Operation', VALUE: true }],
        IS_PREPROGRAMMING_COMPONENT: [{ KEY: 'Part Pre-Programming Required', VALUE: true }, { KEY: 'Part Pre-Programming Not Required', VALUE: false }]
    },
    EQUIPMENT_TYPE: [
        { LABEL: 'Equipment', VALUE: 'E' },
        { LABEL: 'Workstation', VALUE: 'W' },
        { LABEL: 'Samples', VALUE: 'S' }
    ],
    RACK_MST: {
        NAME: 'Rack'
    },
    BARCODE_LABEL_SPECIAL_CHARACTER: [
        { FIND: '€', REPLACE: '&#128;' },
        { FIND: '™', REPLACE: '&#153;' },
        { FIND: '¡', REPLACE: '&#161;' },
        { FIND: '¢', REPLACE: '&#162;' },
        { FIND: '£', REPLACE: '&#163;' },
        { FIND: '¤', REPLACE: '&#164;' },
        { FIND: '¥', REPLACE: '&#165;' },
        { FIND: '¦', REPLACE: '&#166;' },
        { FIND: '§', REPLACE: '&#167;' },
        { FIND: '¨', REPLACE: '&#168;' },
        { FIND: '©', REPLACE: '&#169;' },
        { FIND: 'ª', REPLACE: '&#170;' },
        { FIND: '«', REPLACE: '&#171;' },
        { FIND: '¬', REPLACE: '&#172;' },
        { FIND: '­', REPLACE: '&#173;' },
        { FIND: '®', REPLACE: '&#174;' },
        { FIND: '¯', REPLACE: '&#175;' },
        { FIND: '°', REPLACE: '&#176;' },
        { FIND: '±', REPLACE: '&#177;' },
        { FIND: '²', REPLACE: '&#178;' },
        { FIND: '³', REPLACE: '&#179;' },
        { FIND: '´', REPLACE: '&#180;' },
        { FIND: 'µ', REPLACE: '&#181;' },
        { FIND: '¶', REPLACE: '&#182;' },
        { FIND: '·', REPLACE: '&#183;' },
        { FIND: '¸', REPLACE: '&#184;' },
        { FIND: '¹', REPLACE: '&#185;' },
        { FIND: 'º', REPLACE: '&#186;' },
        { FIND: '»', REPLACE: '&#187;' },
        { FIND: '¼', REPLACE: '&#188;' },
        { FIND: '½', REPLACE: '&#189;' },
        { FIND: '¾', REPLACE: '&#190;' },
        { FIND: '¿', REPLACE: '&#191;' },
        { FIND: 'À', REPLACE: '&#192;' },
        { FIND: 'Á', REPLACE: '&#193;' },
        { FIND: 'Â', REPLACE: '&#194;' },
        { FIND: 'Ã', REPLACE: '&#195;' },
        { FIND: 'Ä', REPLACE: '&#196;' },
        { FIND: 'Å', REPLACE: '&#197;' },
        { FIND: 'Æ', REPLACE: '&#198;' },
        { FIND: 'Ç', REPLACE: '&#199;' },
        { FIND: 'È', REPLACE: '&#200;' },
        { FIND: 'É', REPLACE: '&#201;' },
        { FIND: 'Ê', REPLACE: '&#202;' },
        { FIND: 'Ë', REPLACE: '&#203;' },
        { FIND: 'Ì', REPLACE: '&#204;' },
        { FIND: 'Í', REPLACE: '&#205;' },
        { FIND: 'Î', REPLACE: '&#206;' },
        { FIND: 'Ï', REPLACE: '&#207;' },
        { FIND: 'Ð', REPLACE: '&#208;' },
        { FIND: 'Ñ', REPLACE: '&#209;' },
        { FIND: 'Ò', REPLACE: '&#210;' },
        { FIND: 'Ó', REPLACE: '&#211;' },
        { FIND: 'Ô', REPLACE: '&#212;' },
        { FIND: 'Õ', REPLACE: '&#213;' },
        { FIND: 'Ö', REPLACE: '&#214;' },
        { FIND: '×', REPLACE: '&#215;' },
        { FIND: 'Ø', REPLACE: '&#216;' },
        { FIND: 'Ù', REPLACE: '&#217;' },
        { FIND: 'Ú', REPLACE: '&#218;' },
        { FIND: 'Û', REPLACE: '&#219;' },
        { FIND: 'Ü', REPLACE: '&#220;' },
        { FIND: 'Ý', REPLACE: '&#221;' },
        { FIND: 'Þ', REPLACE: '&#222;' },
        { FIND: 'ß', REPLACE: '&#223;' },
        { FIND: 'à', REPLACE: '&#224;' },
        { FIND: 'á', REPLACE: '&#225;' },
        { FIND: 'â', REPLACE: '&#226;' },
        { FIND: 'ã', REPLACE: '&#227;' },
        { FIND: 'ä', REPLACE: '&#228;' },
        { FIND: 'å', REPLACE: '&#229;' },
        { FIND: 'æ', REPLACE: '&#230;' },
        { FIND: 'ç', REPLACE: '&#231;' },
        { FIND: 'è', REPLACE: '&#232;' },
        { FIND: 'é', REPLACE: '&#233;' },
        { FIND: 'ê', REPLACE: '&#234;' },
        { FIND: 'ë', REPLACE: '&#235;' },
        { FIND: 'ì', REPLACE: '&#236;' },
        { FIND: 'í', REPLACE: '&#237;' },
        { FIND: 'î', REPLACE: '&#238;' },
        { FIND: 'ï', REPLACE: '&#239;' },
        { FIND: 'ð', REPLACE: '&#240;' },
        { FIND: 'ñ', REPLACE: '&#241;' },
        { FIND: 'ò', REPLACE: '&#242;' },
        { FIND: 'ó', REPLACE: '&#243;' },
        { FIND: 'ô', REPLACE: '&#244;' },
        { FIND: 'õ', REPLACE: '&#245;' },
        { FIND: 'ö', REPLACE: '&#246;' },
        { FIND: '÷', REPLACE: '&#247;' },
        { FIND: 'ø', REPLACE: '&#248;' },
        { FIND: 'ù', REPLACE: '&#249;' },
        { FIND: 'ú', REPLACE: '&#250;' },
        { FIND: 'û', REPLACE: '&#251;' },
        { FIND: 'ü', REPLACE: '&#252;' },
        { FIND: 'ý', REPLACE: '&#253;' },
        { FIND: 'þ', REPLACE: '&#254;' },
        { FIND: 'ÿ', REPLACE: '&#255;' },
        { FIND: '⅓', REPLACE: '&#8531;' },
        { FIND: '⅔', REPLACE: '&#8532;' },
        { FIND: '⅛', REPLACE: '&#8539;' },
        { FIND: '⅜', REPLACE: '&#8540;' },
        { FIND: '⅝', REPLACE: '&#8541;' },
        { FIND: 'ˆ', REPLACE: '&#136;' }
    ],
    // ------------------------- [S] Model creation for Elastic Search ---------------------------
    ELASTIC_MODELS: {
        PART_MASTER_FIELD: {
            ID: "id",
            MFG_CODE_MST: "mfgCodemst",
            CUST_ASSY_PN: "custAssyPN",
            MGFPN: "mfgPN",
            PRODUCTION_PN: "productionPN",
            NICKNAME: "nickname",
            PID_CODE: "PIDCode",
            MFGPN_DESCRIPTION: "mfgPNDescription",
            SPECIAL_NOTE: "specialNote",
            LTB_DATE: "ltbDate",
            EOL_DATE: "eolDate",
            DEVICE_MARKING: "deviceMarking",
            PART_PACKAGE: "partPackage",
            POWER_RATING: "powerRating",
            FEATURE: "feature",
            COLOR: "color",
            TOLERANCE: "tolerance",
            VOLTAGE: "voltage",
            VALUE: "value",
            NO_OF_POSITION: "noOfPosition",
            NO_OF_ROWS: "noOfRows",
            MFG_CODE_ID: "mfgcodeID",
            MFG_CODE: "mfgCode",
            MFG_TYPE: "mfgType",
            IS_CUST_OR_DISTY: "isCustOrDisty",
            ROHS_STATUS_ID: "RoHSStatusID",
            ROHS_NAME: "rohsName",
            PART_STATUS: "partStatus",
            PART_STATUS_NAME: "partStatusName",
            FUNCTIONAL_CATEGORY_ID: "functionalCategoryID",
            RPT_NAME: "rptName",
            MOUNTING_TYPE_ID: "mountingTypeID",
            MOUNTING_TYPE_NAME: "mountingTypeName",
            CONNECTER_TYPE_ID: "connecterTypeID",
            RFQ_CONNECTER_TYPE_NAME: "rfqConnecterTypeName",
            PACKAGING_ID: "packagingID",
            PACKAGING_NAME: "packagingName",
            REF_SUPPLIER_MFGPN_COMPONENTID: "refSupplierMfgpnComponentID",
            REF_SUPP_COM_MGPN: "refSuppComMgPN",
            REF_SUPP_COM_MFG_CODE_ID: "refSuppComMfgcodeID",
            REF_SUPP_COM_MFG_CODE: "refSuppComMfgCode",
            REF_SUPP_COM_MFG_TYPE: "refSuppComMfgType",
            REF_SUPP_COM_IS_CUST_OR_DISTY: "refSuppComIsCustOrDisty",
        },
        RFQ_MASTER_FIELD: {
            ID: "id",
            CUSTOMER_ID: "customerId",
            MFG_CODE: "mfgCode",
            MFG_NAME: "mfgName",
            IS_CUST_OR_DISTY: "isCustOrDisty",
            MFG_TYPE: "mfgType",
            MFG_CODE_MST: "customer",

            EMPLOYEE_ID: "employeeID",
            FIRST_NAME: "firstName",
            LAST_NAME: "lastName",

            EMPLOYEE: "employee",
            SALES_COMMISSION_TO: "salesCommissionTo",
            SALES_CEMP_FIRST_NAME: "salesCEmpFirstName",
            SALES_CEMP_LAST_NAME: "salesCEmpLastName",

            RFQ_ASSEMBLIES_ID: "rfqAssembliesId",
            COMPONENT_ASSEMBLY: "componentAssembly",
            PART_ID: "partID",
            PID_CODE: "PIDCode",
            REV: "rev",
            MFG_PN: "mfgPN",
            SPECIAL_NOTE: "specialNote",
            NICKNAME: "nickname",
            RFQ_ASSEMBLIES: "rfqAssemblies",

            RFQ_STATUS: "status",
            RFQ_ASSY_TYPEMST: "assemblyType",
            ASSEMBLY_TYPE_ID: "assemblyTypeID",
            ASSEMBLY_TYPE_NAME: "assemblyTypeName",

            JOB_TYPE: "jobType",
            JOB_TYPE_ID: "jobTypeID",
            JOB_TYPE_NAME: "jobTypeName",

            RFQ_TYPE: "rfqType",
            RFQ_TYPE_ID: "RFQTypeID",
            RFQ_TYPE_NAME: "rfqTypeName",

            QUOTE_DUE_DATE: "quoteDueDate",
            QUOTE_PRIORITY: "quotePriority",
            QUOTE_NOTE: "quoteNote",
            ADDITIONAL_REQUIREMENT: "additionalRequirement",
            ASSY_NOTE: "assyNote"

        },
        SALES_ORDER_MASTER_FIELD: {
            ID: 'id',
            SALES_ORDER_NUMBER: 'salesOrderNumber',
            PO_NUMBER: 'poNumber',
            PO_DATE: 'poDate',
            SO_DATE: 'soDate',
            CUSTOMER_ID: 'customerID',
            FREE_ONBOARD_ID: 'freeOnBoardId',
            SOD_ID: 'sodId',
            PART_ID: 'partID',
            MATERIAL_DUE_DATE: 'materialDueDate',
            MATERIAL_TENTITIVE_DOC_DATE: 'materialTentitiveDocDate',
            PO_QTY: 'qty',
            RUSH_JOB: 'isHotJob',
            PID_CODE: 'PIDCode',
            MGF_PN: 'mfgPN',
            MFGPN_DESCRIPTION: 'mfgPNDescription',
            NICKNAME: 'nickname',
            MFG_CODE: 'mfgCode',
            IS_CUST_OR_DISTY: 'isCustOrDisty',
            MFG_TYPE: 'mfgType',
            MFG_NAME: 'mfgName',
            FOB_NAME: 'fobName',
            CUSTOMER: 'customers',
            COMPONENT_ASSEMBLY: 'componentAssembly',
            FOB: 'freeonboardmst'
        },
        PACKING_SLIP_MASTER_FIELD: {
            ID: "id",
            SYSTEM_ID: "systemId",
            RECEIPT_TYPE: "receiptType",
            MFG_MST_ID: "mfgMstId",
            MFG_NAME: "mfgName",
            MFG_TYPE: "mfgType",
            PO_NUMBER: "poNumber",
            RMA_NUMBER: "rmaNumber",
            RMA_DATE: "rmaDate",
            SO_NUMBER: "soNumber",
            PACKING_SLIP_NUMBER: "packingSlipNumber",
            PACKING_SLIP_DATE: "packingSlipDate",
            INVOICE_NUMBER: "invoiceNumber",
            INVOICE_DATE: "invoiceDate",
            CREDIT_MEMO_NUMBER: "creditMemoNumber",
            CREDIT_MEMO_DATE_DATE: "creditMemoDate",
            DEBIT_MEMO_NUMBER: "debitMemoNumber",
            DEBIT_MEMO_DATE_DATE: "debitMemoDate",
            RECEIPT_DATE: "receiptDate",
            SHIPPED_TO_DATE: "shippedToDate",
            REF_PACKING_SLIP_ID: "refPackingSlipId",
            REF_PACKING_SLIP_NUMBER: "refPackingSlipNumber",
            REF_RMA_NUMBER: "refRMANumber",
            PARENT_INVOICE_ID: "parentInvoiceId",
            REF_PACKING_SLIP_ID_FOR_MEMO: "refPackingSlipIdForMemo",
            REF_INVOICE_NUMBER: "refInvoiceNumber",
            CREDIT_MEMO_TYPE: "creditMemoType",
            CREDIT_MEMO_TYPE_VALUE: "creditMemoTypeValue",
            DEBIT_MEMO_TYPE_VALUE: "debitMemoTypeValue",
            RECEIVING_DET_ID: "receivingDetId",
            PACKING_SLIP_SERIAL_NUMBER: "packingSlipSerialNumber",
            INVOICE_SERIAL_NUMBER: "invoiceSerialNumber",
            CREDIT_MEMO_SERIAL_NUMBER: "creditMemoSerialNumber",
            DEBIT_MEMO_SERIAL_NUMBER: "debitMemoSerialNumber",
            COMP_ID: "compId",
            MFR_PN_MFR_ID: "mfrPnMfrId",
            MFR_PN_MFR_NAME: "mfrPnMfrName",
            MFR_PN_MFR_CODE: "mfrPnMfrCode",
            MFGPN: "mfgPN",
            NICKNAME: "nickname",
            PACKAGING_NAME: "packagingName",
            ORDERED_QTY: "orderedQty",
            PACKING_SLIP_QTY: "packingSlipQty",
            INVOICE_PRICE: "invoicePrice",
            RECEIVED_QTY: "receivedQty",
            PURCHASE_PRICE: "purchasePrice",
            IS_CUSTORDISTY: "isCustOrDisty",
            RECEIVED_STATUS_VALUE: "receivedStatusValue",
            REMARK: "remark",
            HaltStatus: "haltStatus",
            HaltReason: "haltReason",
            LockStatus: "lockStatus",
            REF_PURCHASE_ORDER_ID: "refPurchaseOrderID",
            IS_RECEIVED_AS_WRONG_PART: 'receivedWrongPart',
            TOTAL_RECEIVED_AGAINST_PO: 'TotalReceivedAgainstPO',
            DISPUTE_QTY: 'disputeQty',
            BACKORDER_QTY: 'backorderQty',
            LOCKED_BY: 'lockedBy',
            LOCKED_AT: 'lockedAt',
            UOM: 'uom',
            ROHS: 'rohsStatus',
            INVOICE_APPROVED_BY: 'invoiceApprovedBy',
            APPROVED_AT: 'approvedAt',
            APPROVAL_COMMENT: 'invoiceApprovalComment',
            REF_CREDIT_MEMO_NUMBER: 'refCreditMemo',
            LINE_QTY_VARIANCE: 'lineQtyVariance',
            PS_CUST_CONSIGNED: 'isCustConsignedValue',
            PS_LINE_CUST_CONSIGNED: 'isLineCustConsignedValue',
            IS_NON_UMID_STOCK: 'isNonUMIDStockValue',
            PS_CUSTOMER_ID: 'CustomerID',
            PS_CUSTOMER: 'customerName',
            PS_LINE_CUSTOMER_ID: 'lineCustomerID',
            PS_LINE_CUSTOMER: 'lineCustomerName',
            PS_LINE_NON_UMID_STOCK: 'lineNonUMIDStockValue'
        },
        SUPPLIER_RMA_MASTER_FIELD: {
            ID: "id",
            SYSTEM_ID: "systemId",
            RECEIPT_TYPE: "receiptType",
            RMA_NUMBER: "poNumber",
            RMA_DATE: "poDate",
            PACKING_SLIP_NUMBER: "packingSlipNumber",
            PACKING_SLIP_DATE: "packingSlipDate",
            SHIPPED_DATE: "receiptDate",
            SHIPPING_METHOD_ID: "shippingMethodId",
            SHIPPING_METHOD: "shippingMethod",
            CARRIER_ID: "carrierId",
            CARRIER: "carrier",
            RECEIVING_DET_ID: "receivingDetId",
            RMA_LINE_NUMBER: "packingSlipSerialNumber",
            SHIPPED_QTY: "receivedQty",
            COMP_ID: "compId",
            MFR_PN_MFR_ID: "mfrPnMfrId",
            MFR_PN_MFR_NAME: "mfrPnMfrName",
            MFR_PN_MFR_CODE: "mfrPnMfrCode",
            MFR_PN_MFG_TYPE: "mfrPnMfgType",
            MFGPN: "mfgPN",
            MFG_MST_ID: "mfgMstId",
            MFG_NAME: "mfgName",
            MFG_CODE: "mfgCode",
            MFG_TYPE: "mfgType",
            PACKAGING_NAME: "packagingName",
            REF_PACKING_SLIP_NUMBER: "refPackingSlipNumber",
            REF_INVOICE_NUMBER: "refInvoiceNumber",
            RMA_COMMENT: 'rmaComment',
            SPN: 'spn',
            SUPPLIER_CODE: 'supplierCode',
            SPNID: 'spnId',
            UOM: 'uom',
            RMA_QTY: 'rmaQty',
            RMA_LINE_COMMENT: 'rmaLineComment',
            LOCKED_BY: 'lockedBy',
            LOCKED_AT: 'lockedAt',
            LOCK_STATUS: 'lockStatus'
        },
        SUPPLIER_PAYMENT_AND_REFUND_FIELD: {
            ID: 'id',
            REF_PAYMENT_MODE: 'refPaymentMode',
            TRANSACTION_MODE_NAME: 'transactionModeName',
            SYSTEM_ID: 'systemId',
            ACCOUNT_REFERENCE: 'accountReference',
            MFGCODE_ID: 'mfgcodeID',
            SUPPLIER_CODE_NAME: 'supplierCodeName',
            PAYMENT_NUMBER: 'paymentNumber',
            PAYMENT_TYPE: 'paymentType',
            PAYMENT_METHOD: 'paymentMethod',
            SYSTEM_GENERATED_PAYMENT_METHOD: 'systemGeneratedPaymentMethod',
            BANK_NAME: 'bankName',
            BANK_ACCOUNT_NO: 'bankAccountNo',
            BANK_ACCOUNT_MASID: 'bankAccountMasID',
            PAYMENT_DATE: 'paymentDate',
            DEPOSIT_BATCH_NUMBER: 'depositBatchNumber',
            OFFSET_AMOUNT: 'offsetAmount',
            REMARK: 'remark',
            IS_PAYMENT_VOIDED: 'isPaymentVoided',
            IS_PAYMENT_VOIDED_CONVERTED_VALUE: 'isPaymentVoidedConvertedValue',
            VOID_PAYMENT_REASON: 'voidPaymentReason',
            VOIDED_BY: 'voidedBy',
            VOIDED_AT: 'voidedAt',
            REF_VOIDED_PAYMENT_NO: 'refVoidedPaymentNumber',
            REF_VOIDED_PAYMENT_ID: 'refVoidedPaymentId',
            LOCK_STATUS_CONVERTED_VALUE: 'lockStatusConvertedValue',
            LOCKED_AT: 'lockedAt',
            LOCKED_BY: 'lockedBy',
            INVOICE_NUM_LIST: 'invoiceNumberList',
            CREDIT_MEMO_NUM_LIST: 'creditMemoNumberList',
            DEBIT_MEMO_NUM_LIST: 'debitMemoNumberList'
        },
        CUSTOMER_PACKING_SLIP_MASTER_FIELD: {
            ID: 'customerPackingSlipID',
            POQTY: 'poQty',
            SHIPMENT_QTY: 'shipQty',
            REMAINING_QTY: 'remainingQty',
            NICKNAME: 'nickName',
            COMP_ID: 'partId',
            MFGPN: 'assyName',
            PIDCODE: 'assyID',
            ASSY_PART_DESCRIPTION: 'assyDescription',
            PACKING_SLIP_NUMBER: 'packingSlipNumber',
            PACKING_SLIP_DATE: 'packingSlipDate',
            PONUMBER: 'poNumber',
            PODATE: 'poDate',
            SONUMBER: 'soNumber',
            SODATE: 'soDate',
            SALESORDERID: 'refSalesOrderID',
            CUSTOMERID: 'customerID',
            CUSTOMERNAME: 'customerName',
            STATUS: 'status',
            PACKINGSLIPTYPE: 'packingslipType',
            REVISION: 'sorevision',
            CUSTOMERPACKINGSLIPDETID: 'customerPackingSlipDetID',
            CUSTOMERCODE: 'customerCode',
            MFGTYPE: 'mfgType',
            CUSTPOLINE: 'custPOLineID',
            HEADERCOMMENT: 'headerComment',
            PACKINGSLIPCOMMENT: 'packingSlipComment',
            INTERNALCOMMENT: 'internalComment',
            STANDARDS: 'standrads',
            SHIPPINGNOTES: 'shippingNotes',
            SYSTEM_ID: 'systemID',
            TERMS_ID: 'termsID',
            TERMS_DISPLAY_TEXT: 'termsDisplayText',
            SHIPPING_METHOD_ID: 'shippingMethodId',
            SHIPPING_METHOD_DISPLAY_TEXT: 'shippingMethodDisplayText',
            SALES_COMMISSION_TO: 'salesCommissionTo',
            SALES_COMMISSION_TO_DISPLAY_TEXT: 'salesCommissionToDisplayText',
            FREEONBOARD_ID: 'freeOnBoardDisplayText',
            TRACKING_NUMBER_LIST: 'trackingNumberList',
            PO_REVISION: 'poRevision',
            CARRIER_ID: 'carrierId',
            CARRIER_DISPLAY_TEXT: 'carrierDisplayText',
            CARRIERACCOUNTNUMBER: 'carrierAccountNumber'
        },
        CUSTOMER_INVOICE_MASTER_FIELD: {
            ID: 'custInvMstID',
            CUST_INV_DET_ID: 'customerInvDetID',
            PACKING_SLIP_NUMBER: 'packingSlipNumber',
            PACKING_SLIP_DATE: 'packingSlipDate',
            PONUMBER: 'poNumber',
            PODATE: 'poDate',
            SONUMBER: 'soNumber',
            SODATE: 'soDate',
            SALESORDERID: 'refSalesOrderID',
            CUSTOMERID: 'customerID',
            CUSTOMERNAME: 'customerName',
            //STATUS: 'status',
            REVISION: 'sorevision',
            CUSTOMERCODE: 'customerCode',
            INVOICENUMBER: 'invoiceNumber',
            INVOICEDATE: 'invoiceDate',
            PACKINGSLIPID: 'packingSlipID',
            POLINENUM: 'reflineID',
            LOCKED: 'Locked',
            FOBNAME: 'FOBName',
            SHIPPINGMETHOD: 'shippingMethod',
            MFRPN: 'mfgPn',
            MFGTYPE: 'mfgType',
            //SHIPPEDQTY: 'shippedQty',
            PARTID: 'partId',
            SYSTEM_ID: 'systemID',
            TERMS_ID: 'termsID',
            TERMS_DISPLAY_TEXT: 'termsDisplayText',
            SHIPPING_METHOD_ID: 'shippingMethodId',
            SALES_COMMISSION_TO: 'salesCommissionTo',
            SALES_COMMISSION_TO_DISPLAY_TEXT: 'salesCommissionToDisplayText',
            HEADERCOMMENT: 'headerComment',
            PACKINGSLIPCOMMENT: 'packingSlipComment',
            PIDCODE: 'assyID',
            NICKNAME: 'nickName',
            SHIP_QTY: 'shipQty',
            INTERNALCOMMENT: 'internalComment',
            SHIPPINGNOTES: 'shippingNotes',
            ASSY_PART_DESCRIPTION: 'assyDescription',
            CUSTPOLINE: 'custPOLineID',
            CREDIT_MEMO_NUMBER: 'creditMemoNumber',
            CREDIT_MEMO_DATE: 'creditMemoDate',
            REF_DEBIT_MEMO_NUMBER: 'refDebitMemoNumber',
            REF_DEBIT_MEMO_DATE: 'refDebitMemoDate',
            RMA_NUMBER: 'rmaNumber',
            TRANS_TYPE: 'transType',
            COMP_ID: 'partId',
            TRACKING_NUMBER_LIST: 'trackingNumberList',
            INVOICE_TYPE: 'invoiceType',
            STATUS_CONVERTED_VALUE: 'statusConvertedValue',
            PO_REVISION: 'poRevision',
            CARRIER_ID: 'carrierId',
            CARRIER_DISPLAY_TEXT: 'carrierDisplayText',
            CARRIERACCOUNTNUMBER: 'carrierAccountNumber'
        },
        SUPPLIER_QUOTE_MASTER_FIELD: {
            MST_ID: 'supplierQuoteMstID',
            ID: 'supplierQuotePartDetID',
            MfgCodeID: 'mfgcodeID',
            supplierID: 'supplierID',
            PartID: 'partID',
            Reference: 'reference',
            SupplierPartID: 'supplierPartID',
            MfgName: 'mfgName',
            SupplierName: 'supplier',
            QuoteNumber: 'quoteNumber',
            QuoteDate: 'quoteDate',
            MFGPN: 'mfgPN',
            SupplierPN: 'supplierPN',
            QuoteStatus: 'quoteStatus',
            Status: 'isActive'
        },
        CHAT_MASTER_FIELD: {
            CHAT_ID: 'chatID',
            GROUP_CHAT_ID: 'groupChatID',
            MESSAGE: 'message',
            CHAT_DATE: 'chatDate',
            SENDER_USER: 'senderUser',
            SND_FIRSTNAME: 'sndFirstName',
            SND_LASTNAME: 'sndLastName',
            REC_FIRSTNAME: 'recFirstName',
            REC_LASTNAME: 'recLastName',
            RECEIVER_USER: 'receiverUser',
            GROUP_CHAT: 'group_chat',
            GROUP_ID: 'groupID',
            GROUP_NAME: 'groupName'
        },
        WORK_ORDER_MASTER_FIELD: {
            BUILD_QTY: "buildQty",
            CUSTOMER_ID: "customerID",
            IS_CUSTORDISTY: "isCustOrDisty",
            MFG_CODE: "mfgCode",
            MFG_NAME: "mfgName",
            PART_ID: "partID",
            MFGPN: "mfgPN",
            MFG_TYPE: "mfgType",
            NICKNAME: "nickName",
            PID_CODE: "PIDCode",
            PO_NUMBER: "poNumber",
            SALES_ORDER_NUMBER: "salesOrderNumber",
            SALES_ORDER_MST_IDS: "salesOrderMstIDs",
            WOID: "woID",
            WO_NUMBER: "woNumber",
            WO_SUB_STATUS: "woSubStatus",
            WO_VERSION: "woVersion",
            RUSH_JOB: "RushJob",
            HOLD_STATUS: "HoldStatus",
            HOLD_REASON: "HoldReason"
        },
        UMID_MASTER_FIELD: {
            COST_CATEGORY: 'costCategory',
            DATE_CODE: 'dateCode',
            DEPARTMENT: 'department',
            EXPIRED_STATUS: 'expiredStatus',
            EXPIRY_DATE: 'expiryDate',
            ID: 'id',
            LOCATION: 'location',
            LOT_CODE: 'lotCode',
            MFG_CODE: 'mfgCode',
            MFGPN: 'mfgPN',
            MFGPN_DESCRIPTION: 'mfgPNDescription',
            MFG_TYPE: 'mfgType',
            MSL_LEVEL: 'mslLevel',
            PACKAGING_NAME: 'packagingName',
            PART_ID: 'partID',
            PICTURE_COUNT: 'pictureCount',
            PID_CODE: 'PIDCode',
            PKG_QTY: 'pkgQty',
            PKG_UNIT: 'pkgUnit',
            ORG_QTY: 'orgQty',
            ORG_UNIT: 'orgPkgUnit',
            UID: 'uid',
            RECEIVE_MATERIAL_TYPE: 'receiveMaterialType',
            UOM_NAME: 'uomName',
            WAREHOUSE: 'warehouse',
            PACKING_SLIP_ID: 'packingSlipID',
            PACKING_SLIP: 'packingSlipNumber',
            RESERVE_STOCK: 'reservedStock',
            CUSTOMER_STOCK: 'customerConsign',
            PARENT_UMID_ID: 'parentUIDId',
            PARENT_UMID: 'parentUID',
            FROM_UMID_ID: 'fromUIDId',
            FROM_UMID: 'fromUID',
        },
        MFG_CODE_MASTER_FIELD: {
            TABLE_NAME: 'mfgcodemst',
            ID: 'id',
            MFG_CODE: 'mfgCode',
            MFG_NAME: 'mfgName',
            LEGAL_NAME: 'legalName',
            CONTACT: 'contact',
            FAX_NUMBER: 'faxNumber',
            ISACTIVE: 'isActive',
            MFG_TYPE: 'mfgType',
            TERMS: 'Terms',
            IS_CUSTORDISTY: 'isCustOrDisty',
            SALES_COMMISSION_TO: 'salesCommissionTo',
            FOB: 'freeOnBoardMst',
            CONT_PERSON_LIST: 'contPersonList'
        },
        PERSONAL_MASTER_FIELD: {
            ID: 'id',
            INITIAL_NAME: 'initialName',
            FIRST_NAME: 'firstName',
            LAST_NAME: 'lastName',
            MIDDLE_NAME: 'middleName',
            EMAIL: 'email',
            STREET1: 'street1',
            CONTACT: 'contact',
            USERNAME: 'username',
            CONTACT_PERSON: 'contactPerson'
        },
        OPERATION_MASTER_FIELD: {
            ID: 'opID',
            OPERATION_NUMBER: 'opNumber',
            OPERATION_NAME: 'opName',
            OPERATION_STATUS: 'opStatus',
            SHORT_DESCRIPTION: 'shortDescription',
            OP_DESCRIPTION: 'opDescription',
            OP_WORKING_CONDITION: 'opWorkingCondition',
            OP_MANAGEMENT_INSTRUCTION: 'opManagementInstruction',
            OP_DEFERRED_INSTRUCTION: 'opDeferredInstruction'
        },
        WORKORDER_OPERATION_MASTER_FIELD: {
            ID: "woOPID",
            WO_ID: "woID",
            WO_NUMBER: "woNumber",
            OP_ID: "opID",
            WO_OP_NUMBER: "woOpNumber",
            WO_OP_NAME: "woOpName",
            OP_NUMBER: "opNumber",
            OP_NAME: "opName",
            OP_VERSION: "opVersion",
            OPERATION_TYPE: "OperationType",
            OPERATION_TYPE_ID: "operationTypeID",
            PARENT_OP_ID: "parentOPID",
            PARENT_OPERATION: "parentOperation",
            TAB_LIMIT_AT_TRAVELER: "tabLimitAtTraveler",
            PROCESS_TIME: "processTime",
            SETUP_TIME: "setupTime",
            PER_PIECE_TIME: "perPieceTime",
            QTY_CONTROL: "qtyControl",
            IS_PRE_PROGRAMMING_COMPONENT: "isPreProgrammingComponent",
            IS_REWORK: "isRework",
            IS_TEAM_OPERATION: "isTeamOperation ",
            IS_ISSUE_QTY: "isIssueQty",
            CLEANING_TYPE: "cleaningType",
            OP_DESCRIPTION: "opDescription",
            OP_WORKING_CONDITION: "opWorkingCondition",
            OP_MANAGEMENT_INSTRUCTION: "opManagementInstruction",
            OP_DEFERRED_INSTRUCTION: "opDeferredInstruction",
            OP_DOES: "opDoes",
            OP_DONTS: "opDonts",
            REF_DESIG_LIST: 'refDesigList',
            SHORT_DESCRIPTION: "shortDescription"
        },
        EQUIPMENT_WORKSTATION_MASTER_FIELD: {
            ID: 'eqpID',
            CATEGORY: 'Category',
            NAME: 'Name',
            MAKE: 'Make',
            MODEL: 'Model',
            YEAR: 'Year',
            WORKSTATION_ASSET: 'WorkStationAsset',
            DEPARTMENT_ID: 'departmentID',
            DEPARTMENT_NAME: 'DepartmentName',
            LOCATION_NAME: 'locationName',
            LOCATION_TYPE_ID: 'locationTypeID',
            TYPE_NAME: 'TypeName',
            EQPTYPE_ID: 'eqpTypeID',
            EQP_DESCRIPTION: 'eqpDescription'
        },
        WAREHOUSE_MASTER_FIELD: {
            ID: 'ID',
            WAREHOUSE_TYPE: 'warehouseType',
            NAME: 'Name',
            NICKNAME: 'nickname',
            PARENT_WAREHOUSE: 'ParentWarehouse',
            STATUS: 'Status',
            IS_PERMANENT_WH: 'IsPermanentWH',
            ALL_MOVABLE_BIN: 'allMovableBin',
            USER_ACCESS_MODE: 'userAccessMode'
        },
        TRAVELER_FIELD: {
            ID: 'woTransinoutID',
            STAR_TTIME: 'startTime',
            END_TIME: 'endTime',
            USER_ID: 'userId',
            WO_ID: 'woID',
            EMPLOYEE_ID: 'employeeID',
            WO_OP_ID: 'woOPID',
            WO_NUMBER: 'woNumber',
            OP_NAME: 'opName',
            OP_NUMBER: 'opNumber',
            IS_TEAM_OPERATION: 'isTeamOperation'
        },
        UOM_FIELD: {
            ID: 'id',
            MEASUREMENT_TYPE: 'measurementtype',
            ABBREVIATION: 'abbreviation',
            UNIT_NAME: 'unitName',
            ONEUOM: '1UOM',
            OPERATOR: 'operator',
            UNIT_CONVERT_VALUE: 'unitConvertValue',
            ALIAS_LIST: 'aliaslist',
            DEFAULT_UOM_CONVERTED_VALUE: 'defaultUOMConvertedValue',
            IS_FORMULA_CONVERTED_VALUE: 'isFormulaConvertedValue',
            DESCRIPTION: 'description',
            IS_SYSTEM_DEFAULT_CONVERTED_VALUE: 'isSystemDefaultConvertedValue',
            MEASUREMENT_TYPE_ID: 'measurementTypeID',
            DISPLAY_ORDER: 'displayOrder',
            MEASUREMENT_TYPE_ORDER: 'measurementTypeOrder',
            BASE_UNIT_VALUE: 'baseUnitValue'
        },
        WHO_BROUGHT_WHO_FIELD: {
            ID: 'id',
            BUY_BY: 'buyBy',
            MFG_BY_IS_CUST: 'mfgByIsCust',
            MFG_BY_MFG_TYPE: 'mfgByMfgType',
            MFG_BY: 'mfgBy',
            MFG_TO_IS_CUST: 'mfgToIsCust',
            MFG_TO_MFG_TYPE: 'mfgToMfgType',
            BUY_TO: 'buyTo',
            MFG_TO: 'mfgTo',
            BUY_DATE: 'buyDate',
            CREATED_AT: 'createdAt',
            CREATED_BY_EMP: 'createdByEmp',
            DESCRIPTION: 'description'

        },
        RFQ_CONNECTOR_TYPES_FIELD: {
            ID: "id",
            NAME: "NAME",
            DESCRIPTION: "description",
            ALIAS_LIST: "aliaslist",
            STATUS: "Status"
        },
        COMPONENT_PARTSTATUSMST_FIELD: {
            ID: "id",
            NAME: "NAME",
            ALIAS_LIST: "aliaslist",
        },
        COMPONENT_LOGICAL_GROUP_FIELD: {
            ID: 'id',
            NAME: 'name',
            ALIAS_LIST: 'aliaslist',
            STATUS: 'Status'
        },
        RFQ_PARTTYPE_MST_FIELD: {
            ID: 'id',
            PART_TYPE_NAME: 'partTypeName',
            DISPLAY_ORDER: 'displayOrder',
            TEMPERATURE_SENSITIVE_VALUE: 'temperatureSensitiveValue',
            ALIAS_LIST: 'aliaslist',
            STATUS: 'Status'
        },
        RFQ_MOUNTING_TYPE_MST_FIELD: {
            ID: "id",
            NAME: "NAME",
            DESCRIPTION: "description",
            COUNT_TYPE_EACH: "CountTypeEach",
            ALIAS_LIST: "aliaslist",
            STATUS: "Status"
        },
        COST_CATEGORY_FIELD: {
            ID: 'id',
            CATEGORY_NAME: 'categoryName',
            FROM: 'from',
            TO: 'to'
        },
        KIT_ALLOCATION_MST: {
            ID: 'id',
            REF_SALES_ORDER_DET_ID: 'refSalesOrderDetID',
            SALE_ORDER_ID: 'refSalesOrderID',
            PO_NUMBER: 'poNumber',
            SALES_ORDER_NUMBER: 'salesOrderNumber',
            ASSY_ID: 'assyId',
            ASSY_MFG_TYPE: 'assyMfgType',
            ASSY_PID_CODE: 'AssyPIdCode',
            ASSY_MFG_PN: 'assyMfgPN',
            PART_ID: 'partId',
            PART_MFG_TYPE: 'partMfgType',
            PART_CODE: 'partCode',
            PART_MFG_PN: 'partMfgPn',
            UID: 'UID',
            REF_UID_ID: 'refUIDId',
            ALLOCATED_QTY: 'allocatedQty',
            CONSUME_QTY: 'consumeQty',
            SCRAP_EXPIRED_QTY: 'scrapExpiredQty',
            KIT_STATUS: 'KitStatus',
            RETURN_QTY: 'returnQty',
            KIT_NUMBER: 'kitNumber'
        },
        COMPONENT_PACKAGING_MST: {
            ID: 'id',
            NAME: 'name',
            ALIAS_LIST: 'aliaslist',
            STATUS: 'Status'
        },
        STANDARD_TYPES_MST: {
            ID: 'id',
            NAME: 'name',
            CODE: 'code',
            DISPLAY_ORDER: 'displayOrder',
            STATUS: 'Status'
        },
        STANDARDS_MST: {
            ID: 'certificateStandardID',
            FULL_NAME: 'fullName',
            SHORT_NAME: 'shortName',
            STANDARD_TYPE_ID: 'standardTypeId',
            STANDARD_TYPE: 'standardType',
            PRIORITY: 'priority',
            DESCRIPTION: 'description',
            STANDARD_INFO: 'standardInfo',
            DISPLAY_ORDER: 'displayOrder',
            CERTIFICATE: 'Certificate',
            CERIFICATE_ISSUE_DATE: 'cerificateIssueDate',
            CERTIFICATE_DATE: 'certificateDate',
            STATUS: 'Status',
            EXPORT_CONTROLLED: 'ExportControlled',
            RESTRICTED_DATA_ACCESS: 'RestrictedDataAccess'
        },
        STANDARDS_CATEGORIES_MST: {
            ID: 'classID',
            CLASS_NAME: 'className',
            STANDARD_ID: 'standardId',
            STANDARD: 'Standard',
            DISPLAY_ORDER: 'displayOrder',
            STATUS: 'Status'
        },
        WORKORDER_OPERATION_EQUIPMENT_MST: {
            ID: 'woOpEqpId',
            WO_ID: 'woID',
            WO_NUMBER: 'woNumber',
            WO_VERSION: 'woVersion',
            WO_OP_NUMBER: 'woOpNumber',
            WO_OP_NAME: 'woOpName',
            WO_OP_ID: 'woOPID',
            SALES_ORDER_NUMBER: 'salesOrderNumber',
            EQP_ID: 'eqpID',
            PO_NUMBER: 'poNumber',
            ASSET_NAME: 'assetName',
            EQP_MAKE: 'eqpMake',
            EQP_MODEL: 'eqpModel',
            EQP_YEAR: 'eqpYear'
        },
        WORKORDER_OPERATION_EMPLOYEE_MST: {
            ID: 'woOpEmployeeID',
            WO_ID: 'woID',
            WO_NUMBER: 'woNumber',
            WO_VERSION: 'woVersion',
            WO_OP_NUMBER: 'woOpNumber',
            WO_OP_NAME: 'woOpName',
            WO_OP_ID: 'woOPID',
            SALES_ORDER_NUMBER: 'salesOrderNumber',
            EMPLOYEE_ID: 'employeeID',
            PO_NUMBER: 'poNumber',
            FIRST_NAME: 'firstName',
            LAST_NAME: 'lastName',
            INITIAL_NAME: 'initialName',
            EMP_CERTIFICATIONS: 'empCertifications'
        },
        WORKORDER_OPERATION_PART_MST: {
            ID: 'woOPPartID',
            WO_ID: 'woID',
            WO_NUMBER: 'woNumber',
            WO_VERSION: 'woVersion',
            WO_OP_NUMBER: 'woOpNumber',
            WO_OP_NAME: 'woOpName',
            WO_OP_ID: 'woOPID',
            PO_NUMBER: 'poNumber',
            SALES_ORDER_NUMBER: 'salesOrderNumber',
            PART_ID: 'partId',
            PID_CODE: 'PIDCode',
            MFG_PN_DESCRIPTION: 'mfgPNDescription',
            MFG_PN: 'mfgPN',
            MFG_TYPE: 'mfgType',
            PART_TYPE_NAME: 'partTypeName',
            ROHS_NAME: 'rohsName',
            MOUNTING_TYPE: 'mountingType',
            TOTAL_QPA: 'totalQPA',
            QPA: 'qpa'
        },
        CHANGE_REQUEST_MST: {
            ID: 'woRevReqcommID',
            WO_ID: 'woID',
            WO_NUMBER: 'woNumber',
            WO_VERSION: 'woVersion',
            WO_OP_NUMBER: 'woOpNumber',
            WO_OP_NAME: 'woOpName',
            WO_OP_ID: 'woOPID',
            PO_NUMBER: 'poNumber',
            SALES_ORDER_NUMBER: 'salesOrderNumber',
            ACC_REJ_BY: 'accRejBy',
            ACC_REJ_DATE: 'accRejDate',
            COMMENT_EMPLOYEE_ID: 'commentemployeeID',
            COMMENT_DATE: 'commentDate',
            DESCRIPTION: 'description',
            REQUEST_TYPE: 'requestType',
            THREAD_TITLE: 'threadTitle',
            CHANGE_TYPE: 'changeType',
            APP_REJ_BY: 'AppRejBy',
            COMMENT_BY: 'CommentBy',
            ACC_REJ_STATUS: 'accRejStatus',
            WO_REV_NUMBER: 'woRevnumber',
            WO_OP_REV_NUMBER: 'woOpRevNumber'
        },
        GENERIC_CATEGORY_MST: {
            ID: 'gencCategoryID',
            GENC_CATEGORY_NAME: 'gencCategoryName',
            GENC_CATEGORY_CODE: 'gencCategoryCode',
            PARENT_GEN_CAT_ID: 'parentGenCatID',
            PARENT_NAME: 'parentName',
            DISPLAY_ORDER: 'displayOrder',
            STATUS: 'Status'
        },
        ECO_TYPE_CATEGORY_MST: {
            ID: 'ecoTypeCatID',
            NAME: 'name',
            DISPLAY_ORDER: 'displayOrder'
        },
        ECO_TYPE_CATEGORY_VALUE_MST: {
            ID: 'ecoTypeValID',
            ECO_TYPE_CAT_ID: 'ecoTypeCatID',
            NAME: 'name',
            DISPLAY_ORDER: 'displayOrder',
            ECO_TYPE_CAT_NAME: 'ecoTypeCatName',
            CATEGORY: 'category',
            NOTE_REQUIRED: 'NoteRequired'
        },
        RESERVE_STOCK_REQUEST_MST: {
            ID: 'id',
            PART_ID: 'partID',
            MFG_TYPE: 'mfgType',
            PID_CODE: 'PIDCode',
            MFG_PN: 'mfgPN',
            MFG: 'mfg',
            CUSTOMER_ID: 'customerID',
            CUSTOMER_NAME: 'customerName',
            IS_CUST_OR_DISTY: 'isCustOrDisty',
            CUS_MFG_TYPE: 'cusMfgType',
            NICKNAME: 'nickName',
            ASSY_ID: 'assyID',
            ASSY_MFG_CODE_ID: 'assyMFGcodeID',
            ASSY_MFG_TYPE: 'assyMFGType',
            ASSY_PID_CODE: 'assyPIDCode',
            TRANSACTION_DATE: 'transactionDate',
            COUNT: 'count',
            UNIT: 'unit',
            UOM: 'uom',
            DESCRIPTION: 'description'
        },
        REQUEST_FOR_SHIPMENT_MST: {
            ID: 'id',
            REQ_ID: 'req_id',
            REQUEST_DATE: 'requestDate',
            REQUESTED_BY: 'requestedBy',
            REQUESTED_BYNAME: 'requestedByName',
            NOTE: 'note',
            STATUS: 'status',
            VERIFICATION_STATUS: 'verificationStatus',
            WO_NUMBER: 'woNumber',
            PID_CODE: 'PIDCode',
            MFG_PN: 'mfgPN',
            MFG_NAME: 'mfgName',
            CUSTOMER_ID: 'customerID',
            MFG_TYPE: 'mfgType',
            PART_ID: 'partMasterID'
        },
        DEFECT_CATEGORY_FIELD: {
            DEF_CAT_ID: 'defectCatId',
            DEF_CAT_NAME: 'defectCatName',
            DEF_CAT_DESCRIPTION: 'defectDescription'
        },
        DEPARTMENT_FIELD: {
            DEPT_ID: 'deptId',
            DEPT_NAME: 'deptName',
            PARENT_DEPTNAME: 'deptParentName',
            MANAGER_NAME: 'deptMngrName',
            MANAGER_ID: 'deptMngrID'
        },
        ENTITY_FIELD: {
            ENTITY_ID: 'entityID',
            ENTITY_NAME: 'entityName',
            ENTITY_REMARK: 'remark'
        },
        CALIBRATION_DETAILS_FIELD: {
            ID: 'id',
            REF_EQP_ID: 'refEqpID',
            ASSET_NAME: 'assetName',
            EQP_MAKE: 'eqpMake',
            EQP_MODEL: 'eqpModel',
            EQP_YEAR: 'eqpYear',
            CALIBRATION_TYPE: 'calibrationType',
            CALIBRATION_DATE: 'calibrationDate',
            CALIBRATION_EXPIRATION_DATE: 'calibrationExpirationDate',
            CALIBRATION_COMMENTS: 'calibrationComments'
        },
        PURCHASE_ORDER_FIELD: {
            ID: 'id',
            PODATE: 'poDate',
            PONUMBER: 'poNumber',
            POREVISION: 'poRevision',
            SODATE: 'soDate',
            SONUMBER: 'soNumber',
            SUPPLIERNAME: 'supplierName',
            SUPPLIERID: 'supplierID',
            SUPPLIERQUOTENUMBER: 'supplierQuoteNumber',
            TERMS: 'termsName',
            TERMSID: 'termsID',
            SHIPPINGMETHODID: 'shippingMethodID',
            SHIPPINGMETHOD: 'shippingMethod',
            CARRIERID: 'carrierID',
            CARRIERNAME: 'carrierName',
            CARRIERACCOUNT: 'carrierAccountNumber',
            POCOMMENT: 'poComment',
            INTERNALREF: 'internalRef',
            SYSTEMID: 'serialNumber',
            PIDCODE: 'PIDCode',
            MFRPN: 'mfgPN',
            MFRPNID: 'mfgPartID',
            CONTACTPERSON: 'contactPerson',
            CONTACTPERSONID: 'contactPersonEmpID',
            MFR: 'mfgName',
            MFRID: 'mfgcodeID',
            DESCRIPTION: 'partDescription',
            QTY: 'qty',
            UOM: 'unitName',
            PACKAGING: 'packagingID',
            PACKAGINGNAME: 'packagingName',
            POID: 'purchaseID',
            SERIAL_NUMBER: 'serialNumber',
            PO_WORKING_STATUS: 'poWorkingStatus',
            CANCELLATION_REASON: 'cancleReason',
            CANCELLATION_CONFIRMED: 'CancellationConfirmed',
            PO_CUSTOMER_CONSIGNED: 'isCustConsignedValue',
            LINE_CUSTOMER_CONSIGNED: 'isLineCustConsignedValue',
            PO_CUSTOMER_ID: 'customerID',
            PO_CUSTOMER: 'customerName',
            LINE_CUSTOMER_ID: 'lineCustomerID',
            LINE_CUSTOMER: 'lineCustomerName',
            PO_NON_UMID_STOCK: 'isNonUMIDStockValue',
            LINE_NON_UMID_STOCK: 'isLineNonUMIDStockValue'
        },
        CUSTOMER_PAYMENT_MASTER_FIELD: {
            ID: 'id',
            CUSTOMER_FULL_NAME: 'customerCodeName',
            MFGCODE_ID: 'mfgcodeID',
            SYSTEM_ID: 'systemId',
            DEPOSIT_BATCH_NUMBER: 'depositBatchNumber',
            IS_VOIDED: 'isPaymentVoidedConvertedValue',
            PAYMENT_NUMBER: 'paymentNumber',
            BANK_NAME: 'bankName',
            BANK_ACCOUNT_NO: 'bankAccountNo',
            PAYMENT_TYPE: 'paymentType',
            BANK_ACCOUNT_MASID: 'bankAccountMasID',
            PAYMENT_METHOD: 'paymentMethod',
            SYS_GENERATED_PAY_METHOD: 'systemGeneratedPaymentMethod',
            PAYMENT_DATE: 'paymentDate',
            ACCOUNT_REFERENCE: 'accountReference',
            INVOICE_NUM_LIST: 'invoiceNumberList',
            LOCK_STATUS_CONVERTED_VALUE: 'lockStatusConvertedValue',
            LOCKED_AT: 'lockedAt',
            LOCKED_BY: 'lockedBy',
            REMARK: 'remark',
            VOIDED_AT: 'voidedAt',
            VOIDED_BY: 'voidedBy',
            VOID_PAYMENT_REASON: 'voidPaymentReason',
            REF_VOIDED_PAYMENT_NO: 'refVoidedPaymentNumber',
            REF_VOIDED_PAYMENT_ID: 'refVoidedPaymentId',
            CREDIT_MEMO_NUMBER: 'creditMemoNumber',
            CREDIT_MEMO_DATE: 'creditMemoDate',
            CREDIT_MEMO_ID: 'custCreditMemoID',
            PAYMENT_MODE: 'refPaymentMode',
            TRANSACTION_MODE_NAME: 'transactionModeName',
            PAYMENT_NUM_LIST_AGAINST_REFUND: 'paymentNumListAgainstRefund',
            CM_NUM_LIST_AGAINST_REFUND: 'CMNumListAgainstRefund'
        },
        CHART_OF_ACCOUNTS: {
            ID: 'acct_id',
            ACCOUNT_NAME: 'acct_name',
            ACCOUNT_CODE: 'acct_code',
            ACCOUNT_TYPE: 'account_type',
            IS_SUB_ACCOUNT: 'isSubAccount',
            PARENT_ACCOUNT_NAME: 'parent_account_name',
            DESCRIPTION: 'description',
            SYSTEMID: 'systemid'
        },
        ACCOUNT_TYPE: {
            ID: 'class_id',
            CLASS_NAME: 'class_name',
            CLASS_CODE: 'class_code',
            IS_SUB_TYPE: 'isSubType',
            PARENT_CLASS_NAME: 'parent_class_name',
            SYSTEMID: 'systemid',
            DESCRIPTION: 'description',
            SYSTEM_GENERATED: 'system_defined'
        },
        PAYMENT_TYPE_CATEGORY: {
            ID: 'gencCategoryID',
            PAYMENT_TYPE_CATEGORY_NAME: 'gencCategoryName',
            PAYMENT_TYPE_CATEGORY_CODE: 'gencCategoryCode',
            IS_ACTIVE: 'isActive',
            SYSTEM_GENERATED: 'systemGenerated'
        },
        SALES_ORDER_FIELD: {
            ID: 'id',
            SALES_ORDER_NUMBER: 'salesOrderNumber',
            PO_NUMBER: 'poNumber',
            PO_DATE: 'poDate',
            SO_DATE: 'soDate',
            CUSTOMER_ID: 'customerID',
            FREE_ONBOARD_ID: 'freeOnBoardId',
            IS_CUST_OR_DISTY: 'isCustOrDisty',
            MFG_TYPE: 'mfgType',
            MFG_NAME: 'mfgName',
            MFG_CODE: 'mfgCode',
            FOB_NAME: 'fobName',
            SHIPPING_METHOD_ID: 'shippingMethodID',
            SHIPPING_METHOD_NAME: 'shippingMethodName',
            SO_REVISION: 'revision',
            SO_REVISION_CHANGE_NOTE: 'revisionChangeNote',
            SERIALNUMBER: 'serialNumber',
            CARRIER_ID: 'carrierID',
            CARRIER_NAME: 'carrierName',
            CARRIER_ACCOUNT: 'carrierAccountNumber',
            TERMS_ID: 'termsID',
            TERMS_NAME: 'termsName',
            SALES_COMMISSION_ID: 'salesCommissionTo',
            BLANKETPO: 'blanketPO',
            LEGACYPO: 'legacyPO',
            RMAPO: 'rmaPO',
            RMANUMBER: 'rmaNumber',
            ISDEBITEDBYCUSTOMER: 'isDebitedByCustomer',
            ORGPONUMBER: 'orgPONumber',
            ISREWORKREQUIRED: 'isReworkRequired',
            REWORKPONUMBER: 'reworkPONumber'
        },
        TRANSACTION_MODE: {
            ID: 'id',
            MODE_TYPE: 'modeType',
            MODE_NAME: 'modeName',
            MODE_CODE: 'modeCode',
            DESCRIPTION: 'description',
            IS_ACTIVE: 'isActive',
            SYSTEM_GENERATED: 'systemGenerated',
            ACCT_NAME: 'acct_name'
        },
        CONTACT_PERSON: {
            PERSON_ID: 'personId',
            FULL_NAME: 'fullName',
            FIRST_NAME: 'firstName',
            MIDDLE_NAME: 'middleName',
            LAST_NAME: 'lastName',
            TITLE: 'title',
            DIVISION: 'division',
            ADDITIONAL_COMMENT: 'additionalComment',
            EMAIL: 'email',
            REF_ENTITY_TYPE: 'refEntityType',
            REF_NAME: 'refName',
            PERSONNELS: 'personnels',
            REF_TRANS_ID: 'refTransID',
            IS_DEFAULT: 'isDefault',
            IS_PRIMARY: 'isPrimary',
            SYSTEM_GENERATED: 'systemGenerated',
            STATUS: 'status',
            PHONE_NUMBER_LIST: 'phoneNumberList'
        }
    },
    ELASTIC_URL: {
        PART_MASTER: {
            ADD_PART: '/api/Part/AddPart',
            SUPPLIER_URL: 'supplier/0/managesupplier/detail/0/',
            CUSTOMER_URL: 'customer/1/managecustomer/detail/1/',
            MANUFACTURER_URL: 'manufacturer/managemanufacturer/detail/2/',
            RFQ_ROHSMST_URL: 'rfqsetting/rohs',
            PID_CODE: 'component/manage{0}/detail/',
            PACKAGING_TYPE: 'rfqsetting/packagingtype'
        },
        RFQ_MASTER: {
            AddRFQ: '/api/RFQ/AddRFQ',
            QUOTA_GROUP_URL: 'rfq/manage/',
            ASSEMBLY_TYPE_URL: 'assytype',
            JOB_TYPE_URL: 'rfqsetting/jobtype',
            RFQ_TYPE: 'rfqsetting/rfqtype'
        },
        SALES_ORDER_MASTER: {
            SALES_ORDER_URL: "transaction/salesorder/salesorder/manage/",
        },
        PACKING_SLIP_MASTER: {
            PACKING_SLIP_URL: 'transaction/materialreceipt/PackingSlip/manage/PackingSlip/'
        },
        SUPPLIER_INVOICE_MASTER: {
            SUPPLIER_INVOICE_URL: "transaction/supplierinvoice/invoice/detail/"
        },
        CREDIT_MEMO_MASTER: {
            CREDIT_MEMO_URL: "transaction/supplierinvoice/creditmemo/detail/"
        },
        DEBIT_MEMO_MASTER: {
            DEBIT_MEMO_URL: "transaction/supplierinvoice/debitmemo/detail/"
        },
        SUPPLIER_RMA_MASTER: {
            SUPPLIER_RMA_URL: 'transaction/supplierrma/manage/supplierrma/'
        },
        SUPPLIER_PAYMENT: {
            SUPPLIER_PAYMENT_URL: 'transaction/supplierinvoice/paymenthistory/managepayment/detail/',
            PAYMENT_METHOD: '',
            SUPPLIER_DETAILS_URL: 'supplier/0/managesupplier/detail/0/'
        },
        PAYMENT_METHODS: {
            PAYABLE: 'paymentmethods/payable/25/managegenericcategory/25/',
            RECEIVABLE: 'paymentmethods/receivable/30/managegenericcategory/30/'
        },
        SUPPLIER_REFUND: {
            SUPPLIER_REFUND_URL: 'transaction/supplierinvoice/refund/managerefund/detail/'
        },
        PURCHASE_ORDER_MASTER: {
            PURCHASE_ORDER_URL: 'transaction/purchaseorderlist/purchaseorder/manage/'
        },
        CUSTOMER_PACKING_SLIP_MASTER: {
            PACKING_SLIP_URL: 'transaction/customerpackinglist/customerpacking/manage/'
        },
        CUSTOMER_INVOICE_MASTER: {
            INVOICE_URL: "transaction/customerinvoicelist/customerinvoice/manage/I/"
        },
        CUSTOMER_CREDIT_MEMO: {
            CREDIT_MEMO_URL: "transaction/customercreditnotelist/creditnote/manage/C/"
        },
        APPLY_CUST_CRDIT_MEMO_TO_INVOICE: {
            APPLY_CUST_CREDIT_MEMO_URL: "transaction/applycredittoinvoicelist/applycustomercreditmemo/manage/"
        },
        SUPPLIER_QUOTE_MASTER: {
            SUPPLIER_QUOTE_URL: "transaction/supplierquote/manage/"
        },
        WORK_ORDER_MASTER: {
            WORK_ORDER_URL: 'workorders/manage/details/',
            WORK_ORDER_EQUIPMENT_URL: 'workorders/manage/equipments/',
            WORK_ORDER_EMPLOYEE_URL: 'workorders/manage/employees/',
            WORK_ORDER_PART_URL: 'workorders/manage/parts/'
        },
        UMID_MASTER: {
            UMID_URL: 'transaction/receivingmaterial/managereceivingmaterial/'
        },
        PERSONAL: {
            PERSONAL_URL: 'employee/manage/detail/'
        },
        OPERATION_MASTER: {
            OPERATION_URL: "operation/manage/details/"
        },
        WORK_ORDER_OPERATION: {
            WORK_ORDER_OPERATION_URL: 'workorders/manage/operation/details/',
            WORK_ORDER_OPERATION_EQUIPMENT_URL: 'workorders/manage/operation/equipments/',
            WORK_ORDER_OPERATION_EMPLOYEE_URL: 'workorders/manage/operation/employees/',
            WORK_ORDER_OPERATION_PART_URL: 'workorders/manage/operation/parts/'
        },
        EQUIPMENT_WORKSTATION_MASTER: {
            EQUIPMENT_WORKSTATION_URL: 'equipment/manageequipment/detail/'
        },
        CALIBRATION_DETAILS_MASTER: {
            CALIBRATION_DETAILS_URL: 'calibrationdetails'
        },
        WAREHOUSE_MASTER: {
            WAREHOUSE_URL: 'transaction/warehouse/'
        },
        UOM_MASTER: {
            UOM_URL: 'unit'
        },
        WHO_BOUGHT_WHO_MASTER: {
            WHO_BOUGHT_WHO_URL: 'whoacquiredwho'
        },
        KIT_ALLOCATION: {
            KIT_ALLOCATION_URL: 'transaction/kitallocation/'
        },
        CONNECTOR_TYPES: {
            CONNECTOR_TYPES_URL: 'rfqsetting/connectertype'
        },
        PART_STATUS: {
            PART_STATUS_URL: 'rfqsetting/partstatus'
        },
        MOUNTING_GROUP: {
            MOUNTING_GROUP_URL: 'mountinggroup'
        },
        FUNCTIONAL_TYPE: {
            FUNCTIONAL_TYPE_URL: 'rfqsetting/parttype'
        },
        MOUNTING_TYPE: {
            MOUNTING_TYPE_URL: 'rfqsetting/mountingtype'
        },
        COST_CATEGORY: {
            COST_CATEGORY_URL: 'rfqsetting/cost-category'
        },
        PACKANGING_TYPES: {
            PACKANGING_TYPES_URL: 'rfqsetting/packagingtype'
        },
        STANDARD_TYPES: {
            STANDARD_TYPES_URL: 'standardtype/5/managegenericcategory/5/'
        },
        STANDARDS: {
            STANDARDS_URL: 'certificatestandard/detail/'
        },
        STANDARDS_CATEGORIES: {
            STANDARDS_CATEGORIES_URL: 'certificatestandard/standardClass'
        },
        GENERIC_CATEGORIES: {
            EQUIPMENT_WORK_STATION_GROUPS_URL: "equipmentgroup/1/managegenericcategory/1/",
            EQUIPMENT_WORK_STATION_TYPES_URL: "equipmenttype/2/managegenericcategory/2/",
            EQUIPMENT_WORK_STATION_OWNERSHIPS_URL: "equipmentownership/4/managegenericcategory/4/",
            LOCATIONS_URL: "locationtype/11/managegenericcategory/11/",
            ECO_DFM_TYPE_URL: "ecodfmtype/22/managegenericcategory/22/",
            SHIPPING_METHOD_URL: "shippingtype/13/managegenericcategory/13/",
            CARRIER_URL: "carriermst/26/managegenericcategory/26/",
            PAYMENT_TERMS_URL: "terms/14/managegenericcategory/14/",
            CHARGE_TYPE_URL: "chargestype/23/managegenericcategory/23/",
            PAYMENT_TYPE_CATEGORY_URL: 'paymenttypecategory/29/managegenericcategory/29/'
        },
        ECO_TYPE_CATEGORY: {
            ECO_TYPE_CATEGORY_MST_URL: 'workorders/eco/ecocategory/1',
            ECO_TYPE_CATEGORY_MST_ATTRIBUTES_URL: 'workorders/eco/ecocategoryvalues/1'
        },
        RESERVE_STOCK_REQUEST: {
            RESERVE_STOCK_REQUEST_URL: 'transaction/reservestockrequest'
        },
        REQUEST_FOR_SHIPMENT: {
            REQUEST_FOR_SHIPMENT_URL: 'transaction/requestforship/managerequestforship/detail'
        },
        DEFECT_CATEGORY: {
            DEFECT_CATEGORY_URL: 'defectCategory'
        },
        DEPARTMENT: {
            DEPARTMENT_URL: 'department/managedepartment/detail'
        },
        ENTITY: {
            ENTITY_CUSTOM_FORM_URL: "forms/0/elementmanage"
        },
        CUSTOMER_PAYMENT: {
            DETAIL_PAGE_URL: 'transaction/customerpaymentlist/customerpayment/manage/',
            CUSTOMER_DETAILS_URL: 'customer/1/managecustomer/detail/1/',
            PAYMENT_METHOD: 'paymentmethods/25/managegenericcategory/25/'
        },
        CHART_OF_ACCOUNTS: {
            CHART_OF_ACCOUNTS_URL: 'chartofaccounts'
        },
        ACCOUNT_TYPE: {
            ACCOUNT_TYPE_URL: 'accounttype'
        },
        CUSTOMER_WRITEOFF: {
            DETAIL_PAGE_URL: 'transaction/applywriteofftoinvoicelist/applycustomerwriteoff/manage/',
        },
        CUSTOMER_REFUND: {
            DETAIL_PAGE_URL: 'transaction/customerrefundlist/customerrefund/manage/',
        },
        TRANSACTION_MODES: {
            PAYABLE_TRANSACTION_MODES: 'transactionmodes/payable',
            RECEIVABLE_TRANSACTION_MODES: 'transactionmodes/receivable'
        },
        CONTACT_PERSON: {
            CONTACT_PERSON: 'contactperson',
            MANUFACTURER: 'manufacturer',
            SUPPLIER: 'supplier/0',
            EMPLOYEE: 'employee'
        }
    },
    PLANN_DET: {
        Name: 'Plan Kit'
    },
    SO_OTHER_EXPENSE_DET: {
        Name: 'Sales Order Other Expense'
    },
    MODLE_MASTER_TYPE: {
        PART: 1,
        RFQ: 2,
        SALES_ORDER: 3,
        PACKING_SLIP: 4,
        CHAT: 5,        // Remove This Entity as per Story : User Story 8985: Shubham- Enterprise Search (Elastic Search)- Check Comments
        GROUP_CHAT: 5,  // Remove This Entity as per Story : User Story 8985: Shubham- Enterprise Search (Elastic Search)- Check Comments
        WORK_ORDER: 6,
        UMID: 7,
        MFG_CODE_MASTER: 8,
        PERSONAL: 9,
        OPERATION: 10,
        WORKORDER_OPERATION: 11,
        EQUIPMENT_WORKSTATION: 12,
        WAREHOUSE: 13,
        TRAVELER: 14,
        UOM: 15,
        MERGER_ACQUISITIONS: 16,
        KIT_ALLOCATION: 17,
        CONNECTOR_TYPES: 18,
        PART_STATUS: 19,
        MOUNTING_GROUP: 20,
        FUNCTIONAL_TYPE: 21,
        MOUNTING_TYPES: 22,
        COST_CATEGORIES: 23,
        PACKAGING_TYPES: 24,
        STANDARD_TYPES: 25,
        STANDARDS: 26,
        STANDARDS_CATEGORIES: 27,
        WORKORDER_OPERATION_EQUIPMENT: 28,
        WORKORDER_OPERATION_EMPLOYEE: 29,
        WORKORDER_OPERATION_PART: 30,
        CHANGE_REQUEST: 31,
        EQUIPMENT_WORKSTATION_TYPES: 32,
        EQUIPMENT_WORKSTATION_GROUPS: 33,
        EQUIPMENT_WORKSTATION_OWNERSHIPS: 34,
        GEOLOCATIONS: 35,
        ECO_DFM_CATEGORY: 36,
        ECO_DFM_CATEGORY_ATTRIBUTES: 37,
        ECO_DFM_TYPE: 38,
        RESERVE_STOCK_REQUEST: 39,
        REQUEST_FOR_SHIPMENT: 40,
        WORKORDER_OPERATION_DOS_DONTS: 41,
        DEFECT_CATEGORY: 42,
        DEPARTMENT: 43,
        ENTITY: 44,
        SUPPLIER_QUOTE: 45,
        CUSTOMER_PACKING_SLIP: 46,
        CALIBRATION_DETAILS: 47,
        CUSTOMER_INVOICE: 48,
        SUPPLIER_RMA: 49,
        PURCHASE_ORDER_DETAILS: 50,
        CUSTOMER_PAYMENT: 51,
        CHART_OF_ACCOUNTS: 52,
        ACCOUNT_TYPE: 53,
        PAYMENT_TYPE_CATEGORY: 54,
        SUPPLIER_PAYMENT: 55,
        SUPPLIER_REFUND: 56,
        TRANSACTION_MODE: 57,
        SALES_ORDER_MST: 58,
        CONTACT_PERSON: 59
    },
    ACTION_TYPE: {
        MANAGE: 1,
        DELETE: 2
    },
    ELASTIC_ENTITY: [
        { ID: 1, EntityName: 'RFQ', FunctionName: 'manageRFQDetailInElastic', Type: 'RFQ' },
        { ID: 2, EntityName: 'Parts', FunctionName: 'managePartDetailInElastic', Type: 'Parts' },
        { ID: 3, EntityName: 'Sales Order Details', FunctionName: 'manageSalesOrderDetailInElastic', Type: 'Sales Order Detail' },
        {
            ID: 4,
            EntityName: 'Packing Slips',
            FunctionName: 'managePackingSlipInElastic',
            Type: 'Packing Slips',
            Parameter: { receiptType: 'P' }
        },
        {
            ID: 5,
            EntityName: 'Credit Memos',
            FunctionName: 'managePackingSlipInElastic',
            Type: 'Credit Memos',
            Parameter: { receiptType: 'C' }
        },
        {
            ID: 6,
            EntityName: 'Debit Memos',
            FunctionName: 'managePackingSlipInElastic',
            Type: 'Debit Memos',
            Parameter: { receiptType: 'D' }
        },
        { ID: 7, EntityName: 'Chats', FunctionName: 'manageChatDetailInElastic', Type: 'Chats' },
        { ID: 8, EntityName: 'Work Orders', FunctionName: 'manageWorkOrderDetailInElastic', Type: 'Work Orders' },
        { ID: 9, EntityName: 'UMIDs', FunctionName: 'manageUMIDDetailInElastic', Type: 'UMIDs' },
        {
            ID: 10,
            EntityName: "Manufacturers",
            FunctionName: "manageMFGCodeDetailInElastic",
            Type: "Manufacturers",
            Parameter: { mfgType: "MFG", isCustOrDisty: false }
        },
        {
            ID: 11,
            EntityName: 'Customers',
            FunctionName: 'manageMFGCodeDetailInElastic',
            Type: 'Customers',
            Parameter: { mfgType: 'MFG', isCustOrDisty: true }
        },
        {
            ID: 12,
            EntityName: 'Suppliers',
            FunctionName: 'manageMFGCodeDetailInElastic',
            Type: 'Suppliers',
            Parameter: { mfgType: 'DIST', isCustOrDisty: true }
        },
        { ID: 13, EntityName: "Personnels", FunctionName: "managePersonalDetailInElastic", Type: "Personnel" },
        { ID: 14, EntityName: "Operations", FunctionName: "manageOperationDetailInElastic", Type: "Operations" },
        {
            ID: 15,
            EntityName: 'Work Order Operations',
            FunctionName: 'manageWorkOrderOperationDetailInElastic',
            Type: 'Work Order Operations',
            Parameter: { IsDoDontCall: false }
        },
        { ID: 16, EntityName: 'Equipment, WorkStation & Samples', FunctionName: 'manageEquipmentWorkStationDetailInElastic', Type: 'Equipment, WorkStation & Samples' },
        { ID: 17, EntityName: 'Warehouses', FunctionName: 'manageWarehouseDetailInElastic', Type: 'Warehouses' },
        { ID: 18, EntityName: 'Traveler', FunctionName: 'manageTravelerDetailInElastic', Type: 'Traveler' },
        { ID: 19, EntityName: 'Units of Measurement', FunctionName: 'manageUOMDetailInElastic', Type: 'Units of Measurement' },
        { ID: 20, EntityName: 'Merger & Acquisitions', FunctionName: 'manageMergerAcquisitionInElastic', Type: 'Merger & Acquisitions' },
        { ID: 21, EntityName: 'Connector Types', FunctionName: 'manageConnectorTypesInElastic', Type: 'Connector Types' },
        { ID: 22, EntityName: 'Part Statuses', FunctionName: 'managePartStatusInElastic', Type: 'Part Statuses' },
        { ID: 23, EntityName: 'Mounting Groups', FunctionName: 'manageMountingGroupInElastic', Type: 'Mounting Groups' },
        { ID: 24, EntityName: 'Functional Types', FunctionName: 'manageFunctionalTypeInElastic', Type: 'Functional Types' },
        { ID: 25, EntityName: 'Mounting Types', FunctionName: 'manageMountingTypesInElastic', Type: 'Mounting Types' },
        { ID: 26, EntityName: 'Cost Categories', FunctionName: 'manageCostCategoriesInElastic', Type: 'Cost Categories' },
        { ID: 27, EntityName: 'Packaging Types', FunctionName: 'managePackagingTypesInElastic', Type: 'Packaging Types' },
        // { ID: 28, EntityName: "Standard Types", FunctionName: "manageStandardTypesnElastic", Type: "Standard Types" },
        { ID: 28, EntityName: 'Standards', FunctionName: 'manageStandardsInElastic', Type: 'Standards' },
        { ID: 29, EntityName: 'Standards Categories', FunctionName: 'manageStandardsCategoriesInElastic', Type: 'Standards Categories' },
        { ID: 30, EntityName: 'Kit Allocation', FunctionName: 'manageKitAllocationInElastic', Type: 'Kit Allocation' },
        { ID: 31, EntityName: 'Work Order Operation Equipments', FunctionName: 'manageWOOperationEquipmentInElastic', Type: 'Work Order Operation Equipments' },
        { ID: 32, EntityName: 'Work Order Operation Employees', FunctionName: 'manageWOOperationEmployeeInElastic', Type: 'Work Order Operation Employees' },
        { ID: 33, EntityName: 'Work Order Operation Parts', FunctionName: 'manageWOOperationPartInElastic', Type: 'Work Order Operation Parts' },
        {
            ID: 34,
            EntityName: 'Work Order Change Requests',
            FunctionName: 'manageChangeRequestInElastic',
            Type: 'Work Order Change Requests',
            Parameter: { requestType: 'I' }
        },
        {
            ID: 35,
            EntityName: 'Traveler Change Requests',
            FunctionName: 'manageChangeRequestInElastic',
            Type: 'Traveler Change Requests',
            Parameter: { requestType: 'C' }
        },
        { ID: 36, EntityName: 'Equipment, Workstation & Sample Types', FunctionName: 'manageEquipmentWorkstationTypesInElastic', Type: 'Equipment, Workstation & Sample Types' },
        { ID: 37, EntityName: 'Equipment, Workstation & Sample Groups', FunctionName: 'manageEquipmentWorkstationGroupsInElastic', Type: 'Equipment, Workstation & Sample Groups' },
        { ID: 38, EntityName: 'Equipment, Workstation & Sample Ownerships', FunctionName: 'manageEquipmentWorkstationOwnershipsInElastic', Type: 'Equipment, Workstation & Sample Ownerships' },
        { ID: 39, EntityName: 'Geolocations', FunctionName: 'manageLocationsInElastic', Type: 'Geolocations' },
        { ID: 40, EntityName: 'ECO/DFM Categories', FunctionName: 'manageECODFMCategoryInElastic', Type: 'ECO/DFM Categories' },
        { ID: 41, EntityName: 'ECO/DFM Category Attributes', FunctionName: 'manageECODFMCategoryAttributesInElastic', Type: 'ECO/DFM Category Attributes' },
        { ID: 42, EntityName: 'ECO/DFM Types', FunctionName: 'manageECODFMTypeInElastic', Type: 'ECO/DFM Types' },
        { ID: 43, EntityName: 'Reserve Stock Requests', FunctionName: 'manageReserveStockRequestInElastic', Type: 'Reserve Stock Requests' },
        { ID: 44, EntityName: 'Request For Shipments', FunctionName: 'manageRequestForShipmentInElastic', Type: 'Request For Shipments' },
        {
            ID: 45,
            EntityName: 'Work Order Operation Do\'s & Don\'ts',
            FunctionName: 'manageWorkOrderOperationDetailInElastic',
            Type: 'Work Order Operation Do\'s & Don\'ts',
            Parameter: { IsDoDontCall: true }
        },
        {
            ID: 46,
            EntityName: 'Defect Categories',
            FunctionName: 'manageDefectCategoryDetailInElastic',
            Type: 'Defect Categories'
        },
        {
            ID: 47,
            EntityName: "Department",
            FunctionName: "manageDepartmentDetailInElastic",
            Type: "Departments"
        },
        {
            ID: 48,
            EntityName: "Create Forms",
            FunctionName: "manageEntityDetailInElastic",
            Type: "Create Form"
        },
        {
            ID: 49,
            EntityName: 'Supplier Quote',
            FunctionName: 'manageSupplierQuoteInElastic',
            Type: 'Supplier Quote'
        },
        {
            ID: 50,
            EntityName: 'Calibration Details',
            FunctionName: 'manageCalibrationDetailInElastic',
            Type: 'Calibration Details'
        },
        {
            ID: 51,
            EntityName: 'Customer Packing Slip',
            FunctionName: 'manageCustomerPackingSlipInElastic',
            Type: 'Customer Packing Slip'
        },
        {
            ID: 52,
            EntityName: 'Customer Invoices',
            FunctionName: 'manageCustomerInvoiceInElastic',
            Type: 'Customer Invoices',
            Parameter: { transType: 'I' }
        },
        {
            ID: 53,
            EntityName: 'Supplier RMA',
            FunctionName: 'manageSupplierRMAInElastic',
            Type: 'Supplier RMA'
        },
        {
            ID: 54,
            EntityName: 'Purchase Order',
            FunctionName: 'managePurchaseOrderElastic',
            Type: 'Purchase Order'
        },
        {
            ID: 55,
            EntityName: "Supplier Invoice",
            FunctionName: "managePackingSlipInElastic",
            Type: "Supplier Invoice",
            Parameter: { receiptType: "I" }
        },
        {
            ID: 56,
            EntityName: 'Customer Payment',
            FunctionName: 'manageCustomerPaymentInElastic',
            Type: 'Customer Payment',
            Parameter: { refPaymentMode: 'R' }
        },
        {
            ID: 57,
            EntityName: 'Chart of Accounts',
            FunctionName: 'manageChartOfAccountsInElastic',
            Type: 'Chart of Accounts'
        },
        {
            ID: 58,
            EntityName: 'Account Type',
            FunctionName: 'manageAccountTypeInElastic',
            Type: 'Account Type'
        },
        {
            ID: 59,
            EntityName: 'Payment Type Category',
            FunctionName: 'managePaymentTypeCategoryInElastic',
            Type: 'Payment Type Category'
        },
        {
            ID: 60,
            EntityName: 'Applied Customer Credit Memo',
            FunctionName: 'manageCustomerPaymentInElastic',
            Type: 'Applied Customer Credit Memo',
            Parameter: { refPaymentMode: 'CA' }
        },
        {
            ID: 61,
            EntityName: 'Customer Credit Memo',
            FunctionName: 'manageCustomerInvoiceInElastic',
            Type: 'Customer Credit Memo',
            Parameter: { transType: 'C' }
        },
        {
            ID: 62,
            EntityName: 'Customer Write Offs',
            FunctionName: 'manageCustomerPaymentInElastic',
            Type: 'Customer Write Offs',
            Parameter: { refPaymentMode: 'WOFF' }
        },
        {
            ID: 63,
            EntityName: 'Customer Refund',
            FunctionName: 'manageCustomerPaymentInElastic',
            Type: 'Customer Refund',
            Parameter: { refPaymentMode: 'CR' }
        },
        {
            ID: 64,
            EntityName: 'Supplier Payment',
            FunctionName: 'manageSupplierPaymentAndRefundInElastic',
            Type: 'Supplier Payments',
            Parameter: { refPaymentMode: 'P' }
        },
        {
            ID: 65,
            EntityName: 'Supplier Refund',
            FunctionName: 'manageSupplierPaymentAndRefundInElastic',
            Type: 'Supplier Refunds',
            Parameter: { refPaymentMode: 'RR' }
        },
        {
            ID: 66,
            EntityName: 'Payable Transaction Mode',
            FunctionName: 'manageTransactionModesInElastic',
            Type: 'Payable Transaction Mode',
            Parameter: { modeType: 'RP' }
        },
        {
            ID: 67,
            EntityName: 'Receivable Transaction Mode',
            FunctionName: 'manageTransactionModesInElastic',
            Type: 'Receivable Transaction Mode',
            Parameter: { modeType: 'RR' }
        },
        { ID: 68, EntityName: 'Sales Order', FunctionName: 'manageSalesOrderInElastic', Type: 'Sales Order' },
        { ID: 69, EntityName: 'Contact Person', FunctionName: 'manageContactPersonInElastic', Type: 'Contact Person' }
    ],
    ELASTIC_DEFAULT_FORMAT: {
        WO_OPERATION_NUMBER: 3,
        COST_CATEGORY_AMOUNT: 6
    },
    // ------------------------- [E] Model creation for Elastic Search ---------------------------
    WORKORDER_CHANGE_TYPE: {
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
    SALESCOMMISSION_DET: {
        Name: 'Sales Commission'
    },

    OPEARATION_STATUS: [
        { ID: 0, Name: 'Draft' },
        { ID: 1, Name: 'Published' },
        { ID: 2, Name: 'Disabled' }
    ],
    SUPPLIER_QUOTE_STATUS: {
        DRAFT: 'D',
        PUBLISHED: 'P'
    },
    UNAUTHORIZE_NOTIFICATION: {
        Name: 'Unauthorized Notification'
    },
    PACKING_SLIP_MODE_STATUS: {
        DRAFT: 'D',
        PUBLISHED: 'P'
    },
    INO_AUTO: {
        InoAuto: 'InoAuto',
        DATA_KEYS: {
            InoAutoServerHeartbeatStatus: 'InoAutoServerHeartbeatStatus',
            InoAutoServerName: 'InoAutoServerName',
            CheckinRequestTimeout: 'CheckinRequestTimeout'
        },
        MESSAGE_TYPE: {
            Server_Heartbeat: '115',
            Check_Cart_Status: '114',
            Check_Multiple_Cart_Status: '116',
            Check_Multiple_Cart_Slot_Detail: '117',
            CheckIn_Cart: '101',
            Cancel_Single_Cart_Request: '108',
            Cancel_All_Cart_Request: '110',
            CheckOut_Cart_Request: '501',
            CheckOut_Cart_Response: '502',
            SearchByUID_Request: '103',
            SearchByCartID_Request: '106',
            Assign_Department: '1030',
            UnAuthorized_Checkin: '1001',
            UnAuthorized_Clear_Request: '1004',
            UnAuthorized_Clear_Response: '1005',
            Deliver_Response: '104'
        },
        SERVER_STATUS: {
            Online: 'Online',
            Offline: 'Offline'
        },
        TOWER_STATUS: {
            Online: 'Online',
            Offline: 'Offline'
        },
        SOURCE: {
            InoAutoSystem: 0,
            FlextronSystem: 1
        },
        StatusCode: {
            Success: '200',
            OK: 'OK',
            ManualCancel: 'E501',
            Unauthorize: 'E104'
        },
        MESSAGE: {
            Department_Mismatch: 'Check in department mismatch',
            Task_Complete: 'Task Completed',
            Task_Complete_SearchUID: 'Last part from search result is picked, Smart cart transfer task is complete for this search. Create new search  if required.',
            ServerHearbeat: 'Server Hearbeat',
            CartHearbeat: 'Cart Hearbeat',
            UnAuthorize: 'Slot  is not in unauthorized',
            ClearReason: 'Auto clear slot after UMID transfer to another bin',
            ColorPick: 'Color picked successfully.',
            ColorDrop: 'Color dropped successfully.'
        },
        TransferType: {
            StockTransfer: 'Stock Transfer To Other Department',
            Department: 'Department Transfer'
        }
    },
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
        CommonNotification: {
            ANY_NOTIFICATION_READ: 'anyNotificationRead:receive'
        },
        Traveler: {
            Auto_Terminate_WO_On_Transfer: 'autoTerminateWOOnTransfer:receive'
        }
    },
    warehouseType: {
        SmartCart: { key: 'SMC', value: 'Smart Cart' },
        ShelvingCart: { key: 'SHC', value: 'Shelving Cart' },
        Equipment: { key: 'EQP', value: 'Equipment' }
    },

    warehouseDepartmentType: [
        { id: -1, value: 'Main Material Warehouse' },
        { id: -2, value: 'Main Production Warehouse' }
    ],
    WarehouseCartManufacturer: [
        { id: 'InoAuto', name: 'InoAuto' },
        { id: 'Cluso', name: 'Cluso' }
    ],
    WarehouseErrors: {
        CartName: 'Cart Name',
        ParentWarehouse: 'Parent Warehouse',
        WarehouseType: 'Warehouse Type',
        CartManufacturer: 'Cart Manufacturer',
        UniqueCartId: 'Unique Cart Id',
        Domain: 'Domain',
        Invalid: 'Invalid {0}.',
        Required: '{0} required.',
        InvalidLength: 'Max 50 char for {0}.',
        InvalidPermanentWarehouse: 'Permanent warehouse not valid for smart cart.',
        InvalidAllBinsMovable: 'In smart cart all bin should not movable update values to No.',
        InvalidPermanentWarehouseEquipment: 'Equipment warehouse are always Permanent warehouse.',
        InvalidBinEquipment: 'All bin movable not valid for Equipment.',
        UniqueCartIdNonUnique: 'Unique cart id is not unique.',
        NotFound: 'No {0} found please enter valid {1} name.',
        FailureOperationStatus: 'FAILED',
        ErrorInDataProcessing: 'ERROR_IN_DATA_PROCESSING'
    },
    WarehouseImportConfirmations: {
        Yes: 'YES',
        No: 'NO'
    },
    BinImportErrors: {
        Required: '{0} name required',
        InvalidLengthBin: 'Max 50 char for bin name',
        InvalidLengthDescription: 'Max 255 char for description',
        WareohouseNotFound: 'No warehouse found please enter valid warehouse name.',
        BinExist: 'Bin already exist',
        FailureOperationStatus: 'FAILED',
        ErrorInDataProcessing: 'ERROR_IN_DATA_PROCESSING',
        inActiveWarehouse: 'Given warehouse is inactive, please activate it to insert bin.'
    },
    SUPPLIER_QUOTE_CUSTOM_STATUS: [
        { ID: 0, VALUE: 'Unknown' },
        { ID: 1, VALUE: 'Yes' },
        { ID: 2, VALUE: 'No' }
    ],
    SUPPLIER_QUOTE_NCNR_STATUS: [
        { ID: 0, VALUE: 'Unknown' },
        { ID: 1, VALUE: 'Yes' },
        { ID: 2, VALUE: 'No' }
    ],
    SUPPLIER_QUOTE_TURN_TYPE: {
        BUSINESS_DAY: {
            TYPE: 'Business Days',
            VALUE: 'B'
        },
        WEEK_DAY: {
            TYPE: 'Weekdays',
            VALUE: 'D'
        },
        WEEK: {
            TYPE: 'Week',
            VALUE: 'W'
        }
    },
    SupplierQuotePricingImportErrors: {
        FieldMapper: {
            packaging: 'packaging',
            reeling: 'reeling',
            NCNR: 'NCNR',
            UnitOfTime: 'UnitOfTime',
            UnitPrice: 'UnitPrice',
            qty: 'qty',
            leadTime: 'leadTime',
            stock: 'stock',
            itemNumber: 'itemNumber'
        },
        EntityMapper: {
            itemNumber: 'Item#',
            qty: 'Qty',
            UnitPrice: 'Unit Price',
            leadTime: 'Lead Time',
            UnitOfTime: 'Unit Of Time',
            packaging: 'Packaging',
            min: 'Min',
            mult: 'Mult',
            stock: 'Stock',
            reeling: 'Custom Reeling',
            NCNR: 'NCNR',
        },
        DecimalNmberPattern: /^[0-9]\d{0,9}(\.\d{1,5})?%?$/,
        Item: 'Item',
        Qty: 'Qty',
        Min: 'Min',
        Mult: 'Mult',
        Stock: 'Stock',
        Packaging: 'Packaging',
        LeadTime: 'Lead Time',
        UnitOfTime: 'Unit Of Time',
        UnitPrice: 'Unit Price',
        CustomReeling: 'Custom Reeling',
        NCNR: 'NCNR',
        Required: '{0} required.',
        InvalidNumber: '{0} must be a number.',
        InvalidDigit: '{0} must be a digit.',
        InvalidValue: 'Invalid value for {0}.',
        InvalidRange: '{0} must be in between 1 to 99999999',
        InvalidRangeDecimal: '{0} must be in between 1.00000000 to 99999999.99999999',
        InvalidPackaging: 'Invalid Packaging.',
        InvalidUnitOfTime: 'Invalid Unit of Time.',
        Invalid: 'Invalid {0}. Must be Yes, No or Unknown.',
        PricingLineAlreadyExist: "Pricing line already exist with same Qty, Lead Time and Unit of Time.",
        PricingItemNumberAlreadyExist: "Pricing line Item# already exist.",
        PricingAlreadyExist: "Pricing line Item# is already exist with same Qty, Lead Time and Unit of Time.",
        ErrorInDataProcessing: "Error in data processing."
    },
    PartCorrectList: {
        CorrectPart: 1,
        IncorrectPart: 2,
        UnknownPart: 3
    },
    PartStatusList: {
        InternalInactive: -3,
        Discontinued: -2,
        TBD: -1,
        Active: 1,
        Obsolete: 2,
        LastTimeBuy: 3,
        NotForNewDesigns: 4
    },
    RiskType: {
        LowRisk: 'Low Risk',
        MediumRisk: 'Medium Risk',
        HighRisk: 'High Risk'
    },
    HOLD_UNHOLD_TRANS: {
        Halt: 'H',
        Resume: 'R',
        POModule: 'PO',
        KitAllocationModule: 'Kit Allocation',
        KitReleaseModule: 'Kit Release',
        SupplierInvoiceModule: 'SINV',
        SupplierInvoice: 'Supplier Invoice',
        SupplierDebitMemoModule: 'SDM',
        SupplierDebitMemo: 'Supplier Debit Memo',
        SupplierCreditMemoModule: 'SCM',
        SupplierCreditMemo: 'Supplier Credit Memo',
        HaltedLabel: 'HALTED',
        ResumedLabel: 'RESUMED',
        POSOMESSAGE: 'PO/SO',
        HaltedMessage: 'halted',
        ResumedMessage: 'resumed'
    },
    STOCK_TRANSFER: 'Stock Transfer',
    ADMIN_ID: '1',
    Pricing_Start_Status: '1',
    ExportReportHeader: {
        UploadedMFRPN: 'Uploaded MFR PN',
        UploadedSupplierPN: 'Uploaded Supplier PN',
        UploadedDescription: 'Uploaded Description',
        UploadedDesignator: 'Uploaded Designator',
        MFRPN: 'MFR PN',
        Status: 'Status',
        MatchStatus: 'Match Status',
        DatasheetURL: 'Data-sheet',
        Packaging: 'Packaging',
        Distributor: 'Supplier',
        SKU: 'SKU',
        Qty: 'Qty',
        BuyNow: 'Buy Now',
        PartStatus: 'Part Status',
        Percentage: 'Percentage(%)',
        PartsCount: 'Parts Count',
        FunctionType: 'Functional Type',
        MountingType: 'Mounting Type',
        FunctionalCategoryText: 'Functional Type Text',
        MountingTypeText: 'Mounting Type Text',
        UploadedCPN: 'Uploaded CPN',
        RoHSAlternative: 'RoHS Alternative',
        UploadedCPNRev: 'Uploaded CPN Rev',
        UploadedMFR: 'Uploaded MFR',
        UploadedSupplier: 'Uploaded Supplier',
        PIDCode: 'PID',
        Description: 'Description',
        UpdatedAtApi: 'External API Call Date',
        LifeCycleStatus: 'Lifecycle Status',
        EOLDate: 'Obsolescence/EOL Date',
        LifecycleRisk: 'Lifecycle Risk',
        RoHS: 'RoHS',
        RoHSRisk: 'RoHS Risk',
        SupplierCount: 'Number of Suppliers',
        MultiSourceRisk: 'Multi-Sourcing Risk',
        AvailabilityRisk: 'Availability Risk',
        Exact: 'Exact'
    },
    ExportPriceGroupHeader: {
        PriceGroup: 'Price Group',
        AssyID: 'Assy ID',
        Qty: 'Quote Qty',
        TurnTime: 'Turn Time',
        UnitOfTime: 'Unit Of Time'
    },
    PAGE_RIGHTS_TYPE: {
        PERMISSIONS: 'Permissions',
        FEATURES: 'Features'
    },
    EMPLOYEE_UNIQUE_CHECK_FIELDS: {
        EMAIL: 'email',
        CODE: 'code',
        INITIAL_NAME: 'initialName'
    },
    MFR_MAX_LENGTH: {
        MFRCODE: 8,
        MFRNAME: 255
    },
    TEXT_EDITOR: {
        UPLOAD_FOLDER_PATH: './uploads/genericfiles/textAngular', // Folder path
        UPLOAD_API_PATH: '/uploads/genericfiles/textAngular' // API URL path
    },
    HOME_MENU: {
        Name: 'Home page menu item',
        Order: 'Home menu order'
    },
    MASTER_TEMPLATE: {
        Name: 'Operation management',
        Status: 'Operation management status'
    },
    LABOR_COST_TEMPLATE: {
        Name: 'Labor Cost Template',
        DOWNLOAD_PATH: './default/csv/',
        FileName: 'LaborCostDetail'
    },
    WAREHOUSE_TEMPLATE: {
        Name: 'Warehouse Template',
        DOWNLOAD_PATH: './default/csv/',
        FileName: 'Warehouse'
    },
    BIN_TEMPLATE: {
        Name: 'BIN Template',
        DOWNLOAD_PATH: './default/csv/',
        FileName: 'BIN.csv'
    },
    PART_PRICING_TEMPLATE: {
        Name: 'Part Pricing Template',
        DOWNLOAD_PATH: './uploads/csv/',
        FileName: 'PartPricing.xlsx'
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
            KitRelease: 'Kit Release',
            UMID_TRANSFER_INOAUTO: 'UMID Transfer Material (Ino Auto Response)',
            BinTransfer: 'Bin Transfer'
        },
        TrasferStockType: {
            StockTransfer: 'Stock Transfer',
            StockTransferToOtherDept: 'Stock Transfer To Other Department',
            KitTransfer: 'Kit Transfer',
            DeptTransfer: 'Department Transfer',
            WarehouseTransfer: 'Warehouse Transfer',
            BinTransfer: 'Bin Transfer',
            UMIDTransfer: 'UMID Transfer'
        }
    },
    API_RESPONSE_CODE: {
        SUCCESS: 200,
        ERROR: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAGE_NOT_FOUND: 404,
        ACCESS_DENIED: 403, // client authenticated but doesnot have permission to access requested resource
        INTERNAL_SERVER_ERROR: 500
    },
    EMPLOYEE_UNIQUE_CHECK_FIELDS_NAME: {
        EMAIL: 'Email',
        CODE: 'User ID',
        INITIAL_NAME: 'Initial name'
    },
    TRAVELER_URL: '#!/task/tasklist/travel/{0}/{1}/{2}',
    GENERIC_CATEGORY_UNIQUE_FIELD_NAME: {
        NAME: '{0} name',
        CODE: '{0} code',
        DISPLAY_ORDER: 'Display Order'
    },
    ROLE_UNIQUE_FIELD_NAME: {
        ROLE_NAME: 'Role Name',
        ROLE_ORDER: 'Role access level'
    },
    PAGE_DETAIL_UNIQUE_FIELD_NAME: {
        PAGE_NAME: 'Page name'
    },
    OPERATION_UNIQUE_FIELD_NAME: {
        OP_NUMBER: 'Operation number',
        COLOR_CODE: 'Color Code'
    },
    CONNECTOR_UNIQUE_FIELD_NAME: {
        NAME: 'Connector type'
    },
    LABEL_TEMPLATE_UNIQUE_FIELD_NAME: {
        NAME: '{0} name'
    },
    ECO_TYPE_CATEGORY_UNIQUE_FIELD: {
        NAME: 'ECO/DFM category name',
        DISPLAY_ORDER: 'Display order'
    },
    QUOTE_TERMS_CONDITIONS_CATEGORY_UNIQUE_FIELD: {
        NAME: 'Quote terms & conditions category name'
    },
    ECO_TYPE_VALUES_UNIQUE_FIELD: {
        NAME: 'ECO category attribute type name',
        DISPLAY_ORDER: 'Display order'
    },
    QUOTE_TERMS_CONDITIONS_ATTRIBUTE_UNIQUE_FIELD: {
        NAME: 'Quote terms & conditions category attribute type name'
    },
    MEASUREMENT_TYPES_UNIQUE_FIELD: {
        TYPE: 'Measurement type',
        DISPLAY_ORDER: 'Display order'
    },
    UOM_UNIQUE_FIELD: {
        NAME: 'Unit name',
        DISPLAY_ORDER: 'Display Order',
        ABBREVIATION: 'UOM code'
    },
    RoHS_UNIQUE_FIELD: {
        RoHS: 'RoHS'
    },
    PART_STATUS_UNIQUE_FIELD: {
        PART_STATUS: 'Part status',
        COLOR_CODE: 'Color code'
    },
    LOGICAL_GROUP_UNIQUE_FIELD: {
        NAME: 'Mounting Group name'
    },
    PART_TYPE_UNIUE_FIELD: {
        NAME: 'Functional type',
        DISPLAY_ORDER: 'Display order'
    },
    MOUNTING_TYPE_UNIUE_FIELD: {
        NAME: 'Mounting type',
        COLOR_CODE: 'Color code'
    },
    COST_CATEGORY_UNIUE_FIELD: {
        NAME: 'Cost category name',
        CATEGORY_FROM_TO: 'From and To range value'
    },
    PACKAGING_TYPE_UNIQUE_FIELD: {
        TYPE: 'Packaging type'
    },
    PACKAGE_CASE_TYPE_UNIQUE_FIELD: {
        TYPE: 'Package/case(shape) type',
        COLOR_CODE: 'Color code'
    },
    COMPONENT_DYNAMIC_ATTRIBUTE_UNIQUE_FIELD: {
        NAME: 'Attribute Name'
    },
    EQUIPMENT_WORKSTATION_UNIQUE_FIELD: {
        NAME: 'Equipment, Workstation & Sample Name'
    },
    MENU_UNIQUE_FIELD: {
        NAME: 'Menu'
    },
    CHART_RAWDATA_CATEGORY_UNIQUE_FIELD: {
        NAME: 'Data Source: Category name'
    },
    ENTITY_UNIQUE_FIELD: {
        NAME: '{0} name'
    },
    CHART_TYPES_UNIQUE_FIELD: {
        TYPE: 'Chart type'
    },
    PURCHASE_INSPECTION_REQUIREMENT_UNIQUE_FIELD: {
        REQUIREMENT: 'Requirement'
    },
    PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_UNIQUE_FIELD: {
        NAME: 'Template name'
    },
    INPUT_FIELD: {
        NAME: 'Input field',
        UNIQUE_FIELD_MESSAGE: 'Input field',
        DISPLAY_ORDER: 'Display order'
    },
    STOCKADJUSTMENT: {
        NAME: 'Stock Adjustment'
    },
    USERCONFIGURATION: {
        NAME: 'User Preference'
    },
    PARTUPDATE: {
        NAME: 'External part updating'
    },
    INVITE_USER_TYPE: { InviteUser: 'I', CoOwner: 'C', Owner: 'O' },
    PRIORITY: 'Priority',
    DISPLAY_ORDER: 'Display order',
    LABELTEMPLATE_DEFAULTLABELTYPE: [
        { ID: 'B', name: 'Bin' },
        { ID: 'R', name: 'Rack' },
        { ID: 'U', name: 'UMID' },
        { ID: 'W', name: 'Warehouse' }
    ],
    REPORT_DETAIL: {
        REPORT_DB_CONNECTION: `Server=${config.development.host};Database=${config.development.database};UserId=${config.development.username};Pwd=${config.development.password}`
    },
    IDENTITY_SERVER: {
        REGISTER_ON_IDENTITY_SERVER: {
            METHOD: 'POST',
            PATH: '/api/account/register'
        },
        REGISTER_EXSISTING_USER_ON_IDENTITY_SERVER: {
            METHOD: 'POST',
            PATH: '/Utility/RegisterExsistingUserFromFJT'
        },
        UPDATE_SCOPE_OF_USER: {
            METHOD: 'POST',
            PATH: '/Utility/ManageClientUserMapping'
        },
        REMOVE_USER: {
            METHOD: 'POST',
            PATH: '/api/account/RemoveUser'
        },
        Update_USER: {
            METHOD: 'POST',
            PATH: '/api/account/UpdateUser'
        },
        GET_DOWNLOAD_AGREEMENT_DETAILS_LIST: {
            METHOD: 'POST',
            PATH: '/Agreement/api/GetAgreementTemplateDetails'
        },
        VALIDATE_USER_PASSWORD: {
            METHOD: 'POST',
            PATH: '/api/Account/ValidatePassword'
        },
        SET_SUPER_ADMIN: {
            METHOD: 'GET',
            PATH: '/api/Authentication/SetSuperAdmin'
        }
    },
    REPORT_VIEWER: {
        DOWNLOAD_REPORT: {
            METHOD: 'POST',
            PATH: '/api/Viewer/DownloadReport'
        }
    },
    PACKING_SLIP_TYPE: { MISC: 1, PO: 2 },
    PONUMBER_DATE_FORMAT: 'YYMMDD',
    PONUMBER_SYSID: 'PONumberSysID',
    CHARTOFACCOUNTSSYSTEMID: 'ChartOfAccountsSystemID',
    ACCOUNTTYPESYSTEMID: 'AccountClassificationSystemID',
    SONUMBER_SYSID: 'salesOrderSystemID',
    DCFORMAT_SYSID: 'DCFormatSystemID',
    RestrictSpecialCharatorPattern: /^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/,
    InovaxeProductionConnection: 'InovaxeProductionConnection',
    CUSTOMER_PAYMENT: {
        Name: 'Customer payment'
    },
    CUSTOMER_REFUND: {
        Name: 'Customer refund'
    },
    PACKING_SLIP_RECEIPT_TYPE: {
        INVOICE: 'I',
        CREDIT_MEMO: 'C',
        DEBIT_MEMO: 'D',
        PACKING_SLIP: 'P'
    },
    CREDIT_MEMO_TYPE: {
        INVOICE: 'IC',
        RMA: 'RC',
        MISC: 'MC'
    },
    SUPPLIER_INVOICE_APPROVAL_STATUS: {
        APPROVED: 1,
        PENDING: 2,
        NA: 3
    },
    CUST_CRNOTE_UNIQUE_CHECK_FIELDS_NAME: {
        CREDITMEMONUMBER: 'Credit Memo#',
        REFDEBITMEMONUMBER: 'Ref. Debit Memo#'
    },
    RefPaymentModeForInvoicePayment: {
        Payable: 'P',
        Receivable: 'R',
        SupplierRefund: 'RR',
        CustomerWriteOff: 'WOFF',
        CustomerRefund: 'CR'
    },
    SupplierRMAPackingSlipMode: {
        Draft: 'D',
        Published: 'P',
        Shipped: 'S'
    },
    SupplierPackingSlipANdInvoiceStatus: {
        Investigate: 'I',
        WaitingForInvoice: 'W',
        InvoiceReceived: 'IR',
        ApprovedToPay: 'A',
        PartiallyPaid: 'PP',
        Paid: 'P',
        Pending: 'PE',
        PendingManagementApproval: 'PM'
    },
    /* used for customer and Supplier transaction before change please check both transactions */
    CustomerPaymentLockStatus: {
        NA: 'NA',
        ReadyToLock: 'RL',
        Locked: 'LC'
    },
    ProgramingStatusDropdown: [
        { id: 0, value: 'N/A' },
        { id: 5, value: 'Who Will Program' },
        { id: 3, value: 'Cust will program' },
        { id: 4, value: 'Pre-Programmed' },
        { id: 1, value: 'Pre-Assy' },
        { id: 2, value: 'Post-Assy' }
    ],
    CUSTOMER_COMMENT: {
        Customer: 'Customer Comment',
        Supplier: 'Supplier Comment'
    },
    PAGE_NAMES: {
        DYNAMIC_REPORTS: 'Dynamic Reports',
        REPORT: 'Report'
    },
    FEATURE_NAMES: {
        ALLOW_DESIGN_REPORT: 'Allow Design Report',
        ALLOW_TO_ADD_REPORT: 'Allow to Add Report'
    },
    RabbitMQ: 'RabbitMQ',
    MongoDB: 'MongoDB',
    ReceivableRefPaymentMode: {
        ReceivablePayment: { name: 'Payment', code: 'R', className: 'label-success' },
        CreditMemoApplied: { name: 'Credit Memo Applied', code: 'CA', className: 'label-warning' },
        Refund: { name: 'Refund', code: 'CR', className: 'label-danger' },
        Writeoff: { name: 'Write Off', code: 'WOFF', className: 'label-primary' }
    },
    InvoicePaymentStatus: {
        Pending: 'PE',
        PartialReceived: 'PR',
        Received: 'RE'
    },
    MFG_TYPE: {
        MFG: 'MFG',
        DIST: 'DIST',
        CUSTOMER: 'CUSTOMER'
    },
    SCAN_ERROR_CODE: [
        { CODE: 'FEED001', NAME: MESSAGE_CONSTANT.MFG.FEEDER_FAILED.message },
        { CODE: 'FEED002', NAME: MESSAGE_CONSTANT.MFG.FEEDER_VERIFIED.message },
        { CODE: 'FEED003', NAME: MESSAGE_CONSTANT.MFG.FEEDER_ALLOCATED.message },
        { CODE: 'FEED004', NAME: MESSAGE_CONSTANT.MFG.FEEDER_INVALID.message },
        { CODE: 'FEED005', NAME: MESSAGE_CONSTANT.MFG.FEEDER_REQUIRED.message },
        { CODE: 'FEED006', NAME: MESSAGE_CONSTANT.MFG.FEEDER_ALREADY_VERIFIED.message },
        { CODE: 'FEED007', NAME: MESSAGE_CONSTANT.MFG.FEEDER_INACTIVE.message },
        { CODE: 'FEED008', NAME: MESSAGE_CONSTANT.MFG.FEEDER_NOT_ALLOCATED_YET.message },
        { CODE: 'FEED009', NAME: MESSAGE_CONSTANT.MFG.FEEDER_SCANNED.message },
        { CODE: 'UMID001', NAME: MESSAGE_CONSTANT.MFG.UMID_FAILED.message },
        { CODE: 'UMID002', NAME: MESSAGE_CONSTANT.MFG.UMID_VERIFIED.message },
        { CODE: 'UMID003', NAME: MESSAGE_CONSTANT.MFG.UMID_ALREADY_IN_USE.message },
        { CODE: 'UMID004', NAME: MESSAGE_CONSTANT.MFG.UMID_INVALID.message },
        { CODE: 'UMID005', NAME: MESSAGE_CONSTANT.MFG.UMID_REQUIRED.message },
        { CODE: 'UMID006', NAME: MESSAGE_CONSTANT.MFG.UMID_SCANNED.message },
        { CODE: 'UMID007', NAME: MESSAGE_CONSTANT.MFG.UMID_NOT_IN_WORKORDER_OR_KIT.message },
        { CODE: 'UMID008', NAME: MESSAGE_CONSTANT.MFG.UMID_NOT_ASSIGNED.message },
        { CODE: 'UMID009', NAME: MESSAGE_CONSTANT.MFG.UMID_NOT_ALLOCATED.message },
        { CODE: 'UMID010', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_BOM.message },
        { CODE: 'UMID011', NAME: MESSAGE_CONSTANT.MFG.UMID_EXPIRED_ON.message },
        { CODE: 'UMID012', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_UMID.message },
        { CODE: 'UMID013', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_PART.message },
        { CODE: 'UMID014', NAME: MESSAGE_CONSTANT.MFG.UMID_ALREADY_IN_USE.message },
        { CODE: 'UMID015', NAME: MESSAGE_CONSTANT.MFG.UMID_WRONG_LOCATION.message },
        { CODE: 'UMID017', NAME: MESSAGE_CONSTANT.MFG.UMID_INVALID_OLD_UMID.message },
        { CODE: 'UMID018', NAME: MESSAGE_CONSTANT.MFG.UMID_INVALID_BIN.message },
        { CODE: 'UMID019', NAME: MESSAGE_CONSTANT.MFG.UMID_INVALID_STOCK_TRANSFER.message },
        { CODE: 'UMID020', NAME: MESSAGE_CONSTANT.MFG.UMID_NOT_POPULATE_FROM_BOM.message },
        { CODE: 'UMID021', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_PART_WITH_PERMISSION.message },
        { CODE: 'UMID022', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_PART_PACKAGING.message },
        { CODE: 'UMID023', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_PART_PACKAGING_WITH_PERMISSION.message },
        { CODE: 'UMID024', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_WITH_PERMISSION_FROM_BOM.message },
        { CODE: 'UMID025', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_BOM_DUE_TO_CPN_RESTRICT.message },
        { CODE: 'UMID026', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_BOM_DUE_TO_CPN_RESTRICT_WITH_PERMISSION.message },
        { CODE: 'UMID027', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_PART_WITH_PERMISSION_NOT_APPROVED_FROM_BOM.message },
        { CODE: 'UMID028', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_INCORRECT_PART.message },
        { CODE: 'UMID029', NAME: MESSAGE_CONSTANT.MFG.UMID_BOM_LINE_INVALID.message },
        { CODE: 'UMID030', NAME: MESSAGE_CONSTANT.MFG.UMID_INVALID_PART_ROHS_TBD.message },
        { CODE: 'UMID031', NAME: MESSAGE_CONSTANT.MFG.UMID_MUST_BE_FROM_PRODUCTION_WAREHOUSE.message },
        { CODE: 'UMID032', NAME: MESSAGE_CONSTANT.MFG.UMID_ASSEMBLY_MUST_HAVE_ROHS_STATUS.message },
        { CODE: 'UMID033', NAME: MESSAGE_CONSTANT.MFG.UMID_ASSEMBLY_PART_ROHS_MISMATCH.message },
        { CODE: 'UMID034', NAME: MESSAGE_CONSTANT.MFG.UMID_ASSEMBLY_CUSTOMER_APPROVAL_REQUIRE_FROM_BOM.message },
        { CODE: 'UMID035', NAME: MESSAGE_CONSTANT.MFG.UMID_CONFIRMATION_FOR_DIFF_LINE_ITEM.message },
        { CODE: 'UMID036', NAME: MESSAGE_CONSTANT.MFG.UMID_RESTRICTED_FROM_PART_WITH_PERMISSION_USED_IN_WORKORDER.message },
        { CODE: 'UMID037', NAME: MESSAGE_CONSTANT.MFG.UMID_CONFIRMATION_ALREADY_SCANNED.message },
        { CODE: 'UMID038', NAME: MESSAGE_CONSTANT.MFG.UMID_NOT_ENOUGH_STOCK.message },
        { CODE: 'UMID039', NAME: MESSAGE_CONSTANT.MFG.UMID_CONFIRM_DEALLOCATE_OTHER_KIT.message },
        { CODE: 'UMID040', NAME: MESSAGE_CONSTANT.MFG.UMID_ALLOCATED_SUCCESS.message },
        { CODE: 'UMID041', NAME: MESSAGE_CONSTANT.MFG.UMID_ALREADY_IN_FEDDER.message },
        // skip UMID042 as it is used in fun_checkKitAllocation
        { CODE: 'UMID043', NAME: MESSAGE_CONSTANT.MFG.UMID_MISSING_BOM_PART_ONLY.message },
        { CODE: 'UMID044', NAME: MESSAGE_CONSTANT.MFG.UMID_FLUXTYPE_MISMATCH.message },
        { CODE: 'UMID045', NAME: MESSAGE_CONSTANT.MFG.UMID_ASSY_FLUXTYPE_INVALID.message },
        { CODE: 'UMID046', NAME: MESSAGE_CONSTANT.MFG.UMID_FLUXTYPE_INVALID.message },
        { CODE: 'UMID047', NAME: MESSAGE_CONSTANT.MFG.UMID_CONFIRMATION_PART_STATUS_INACTIVE.message },
        { CODE: 'UMID048', NAME: MESSAGE_CONSTANT.MFG.UMID_FROM_EMPTY_BIN_NOT_ALLOWED.message },
        { CODE: 'UMID049', NAME: 'UMID049' }, // THIS TO BE FOR SUPERVISOR CONFIRMATION AT 'RestrictAccessConfirmationPopupController'
        { CODE: 'UMID050', NAME: MESSAGE_CONSTANT.MFG.UMID_VERIFY_UMID_BEFORE_ZEROOUT.message },
        { CODE: 'UMID051', NAME: MESSAGE_CONSTANT.MFG.UMID_MISSING_SMT_PART_ONLY.message },
        { CODE: 'UMID052', NAME: MESSAGE_CONSTANT.MFG.UMID_STRICTY_LIMIT_REFDES_ONLY.message },
        { CODE: 'PREPROG001', NAME: MESSAGE_CONSTANT.MFG.PART_PREPROGRAMMING_MAPPING_NOT_ADDED.message },
        { CODE: 'PREPROG002', NAME: MESSAGE_CONSTANT.MFG.PART_IS_NOT_REQUIRE_PREPROGRAMMING_FROM_PART_MASTER.message },
        { CODE: 'PREPROG003', NAME: MESSAGE_CONSTANT.MFG.UMID_NOT_IN_KIT_FOR_WO_PREPROG.message }
    ],
    WO_TRANS_ERROR: {
        TRANS01: 'TRANS001',
        TRANS02: 'TRANS002',
        TRANS03: 'TRANS003'
    },
    UPDATE_SUPERADMIN_ROLE_ON_IDENTITY: {
        ADD: 'A',
        DELETE: 'D'
    },
    MAPPING_TYPE: {
        MFR: 0,
        CUSTOMER: 1
    },
    PurchaseOrderLockStatus: {
        NA: { id: 'NA', value: 'Not Applicable' },
        ReadyToLock: { id: 'RL', value: 'Ready To Lock' },
        Locked: { id: 'LC', value: 'Locked' }
    },
    PurchaseOrderStatus: {
        Draft: { id: 0, value: 'Draft' },
        Publish: { id: 1, value: 'Publish' }
    },
    PurchaseOrderWorkingStatus: {
        InProgress: { id: 'P', value: 'In Progress' },
        Completed: { id: 'C', value: 'Completed' },
        Canceled: { id: 'CA', value: 'Canceled' }
    },
    PurchaseOrderLineWorkingStatus: {
        Open: { id: 'P', value: 'Open' },
        Closed: { id: 'C', value: 'Closed' }
    },

    VALIDATION_TYPE: {
        ALTERNATE_PART: { ID: 1, NAME: 'Alternate Part' },
        PACKAGING_PART: { ID: 2, NAME: 'Packaging Alias Part' },
        ROHSREPLACEMENT_PART: { ID: 3, NAME: 'RoHS Replacement Part' }
    },
    API_URL_FOR_GET_LANG_LONG: 'https://maps.googleapis.com/maps/api/geocode/json?address={0}&key=AIzaSyAs597r3NiSLjzNpM5ea8-OjG_dZMAcSxQ', // Only used in update old record of CustomerAddress table for get location by ZipCode.
    CustomerPaymentRefundStatusText: {
        All: { id: null, value: 'All', Code: '' },
        NotApplicable: { id: 'Not Applicable', value: 'Not Applicable', ClassName: 'label-warning', Code: 'NA', Name: 'Not Applicable' },
        PendingRefund: { id: 'Pending Refund', value: 'Pending Refund', ClassName: 'md-purple-300-bg', Code: 'PE', Name: 'Pending Refund' },
        PartialPaymentRefunded: { id: 'Partial Payment Refunded', value: 'Partial Payment Refunded', ClassName: 'label-primary', Code: 'PR', Name: 'Partial Payment Refunded' },
        FullPaymentRefunded: { id: 'Full Payment Refunded', value: 'Full Payment Refunded', ClassName: 'label-success', Code: 'FR', Name: 'Full Payment Refunded' }
    },
    CONTACT_PERSON_REF_TYPES: {
        Manufacturer: 'Manufacturer',
        Supplier: 'Supplier',
        Personnel: 'Personnel'
    },
    AddressType: {
        BillingAddress: { id: 'B', value: 'Billing Address' },
        ShippingAddress: { id: 'S', value: 'Shipping Address' },
        IntermediateAddress: { id: 'I', value: 'Intermediate Shipping Address' },
        PayToInformation: { id: 'P', value: 'Remit To Address' },
        RMAShippingAddress: { id: 'R', value: 'RMA Shipping Address' },
        BusinessAddress: { id: 'BU', value: 'Business Address' },
        RMAIntermediateAddress: { id: 'RI', value: 'RMA Intermediate Address' }
    },
    DateCodeFormats: {
        Date: 'DD',
        Week: 'WW',
        Month: 'MM',
        Year: 'YY',
        FullYear: 'YYYY'
    },
    SUPPLIERMFRMAPPINGTYPE: {
        StrictlyCustomComponent: { key: 'S', value: 'Strictly Custom Part Only' },
        OffTheShelf: { key: 'B', value: 'Off-the-shelf' },
        Both: { key: 'O', value: 'All' }
    }
};
// });

/* Read emp_timeline message constant document merge it with data constant document timeline object   */
// eslint-disable-next-line import/no-dynamic-require
const allConstantMessagesOfEmpTimeline = require(COMMON.Message_Constant_JSON_File.EMP_TIMELINE.File_Read_Path);
_.merge(DATA_CONSTANT.TIMLINE, allConstantMessagesOfEmpTimeline);
module.exports = DATA_CONSTANT;