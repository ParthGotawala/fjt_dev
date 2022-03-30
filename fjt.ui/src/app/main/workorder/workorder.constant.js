(function () {
  'use strict';
  /** @ngInject */
  var WORKORDER = {

    WORKORDER_STATUS_FIELDNAME: 'woStatus',
    WORKORDER_SUB_STATUS_FIELDNAME: 'woSubStatus',

    WORKORDER_LABEL: 'Work Order',
    WORKORDER_ROUTE: '/workorder',
    WORKORDER_STATE: 'app.workorders',
    WORKORDER_CONTROLLER: '',
    WORKORDER_VIEW: '',

    WORKORDER_WORKORDERS_LABEL: 'Work Orders',
    WORKORDER_WORKORDERS_ROUTE: '/workorders',
    WORKORDER_WORKORDERS_STATE: 'app.workorder',
    WORKORDER_WORKORDERS_CONTROLLER: 'WorkordersController',
    WORKORDER_WORKORDERS_VIEW: 'app/main/workorder/workorders/workorders-list.html',

    WORKORDER_PENDINGWOCREATIONLIST_LABEL: 'Pending WO Creation List',
    WORKORDER_PENDINGWOCREATIONLIST_ROUTE: '/pendingwocreation',
    WORKORDER_PENDINGWOCREATIONLIST_STATE: 'app.pendingwocreationlist',
    WORKORDER_PENDINGWOCREATIONLIST_CONTROLLER: 'PendingWOCreationController',
    WORKORDER_PENDINGWOCREATIONLIST_VIEW: 'app/main/workorder/workorders/pending-workorder-creation-list/pending-workorder-creation-list.html',

    MANAGE_WORKORDER_LABEL: 'Manage Work Order',
    MANAGE_WORKORDER_ROUTE: '/manage',
    MANAGE_WORKORDER_PARAMS: {
      woRevReqID: {
        value: undefined,
        squash: true
      },
      openRevReq: {
        value: undefined,
        squash: true
      }
    },
    MANAGE_WORKORDER_STATE: 'app.workorder.manage',
    MANAGE_WORKORDER_CONTROLLER: 'ManageWorkorderMainController',
    MANAGE_WORKORDER_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-main.html',

    MANAGE_WORKORDER_DETAILS_STATE: 'app.workorder.manage.details',
    MANAGE_WORKORDER_DETAILS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-details.html',
    MANAGE_WORKORDER_DETAILS_ROUTE: '/details/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_DETAILS_CONTROLLER: 'ManageWorkorderDetailsController',

    MANAGE_WORKORDER_STANDARDS_STATE: 'app.workorder.manage.standards',
    MANAGE_WORKORDER_STANDARDS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-standards.html',
    MANAGE_WORKORDER_STANDARDS_ROUTE: '/standards/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_STANDARDS_CONTROLLER: 'ManageWorkorderStandardsController',

    MANAGE_WORKORDER_DOCUMENTS_STATE: 'app.workorder.manage.documents',
    MANAGE_WORKORDER_DOCUMENTS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-documents.html',
    MANAGE_WORKORDER_DOCUMENTS_ROUTE: '/documents/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_DOCUMENTS_CONTROLLER: 'ManageWorkorderDocumentsController',

    MANAGE_WORKORDER_OPERATIONS_STATE: 'app.workorder.manage.operations',
    MANAGE_WORKORDER_OPERATIONS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-operations.html',
    MANAGE_WORKORDER_OPERATIONS_ROUTE: '/operations/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATIONS_CONTROLLER: 'ManageWorkorderOperationsController',

    MANAGE_WORKORDER_PARTS_STATE: 'app.workorder.manage.parts',
    MANAGE_WORKORDER_PARTS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-parts.html',
    MANAGE_WORKORDER_PARTS_ROUTE: '/parts/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_PARTS_CONTROLLER: 'ManageWorkorderPartsController',

    MANAGE_WORKORDER_EQUIPMENTS_STATE: 'app.workorder.manage.equipments',
    MANAGE_WORKORDER_EQUIPMENTS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-equipments.html',
    MANAGE_WORKORDER_EQUIPMENTS_ROUTE: '/equipments/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_EQUIPMENTS_CONTROLLER: 'ManageWorkorderEquipmentsController',

    MANAGE_WORKORDER_EMPLOYEES_STATE: 'app.workorder.manage.employees',
    MANAGE_WORKORDER_EMPLOYEES_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-employees.html',
    MANAGE_WORKORDER_EMPLOYEES_ROUTE: '/employees/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_EMPLOYEES_CONTROLLER: 'ManageWorkorderEmployeesController',

    MANAGE_WORKORDER_DATAFIELDS_STATE: 'app.workorder.manage.datafields',
    MANAGE_WORKORDER_DATAFIELDS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-dataelement.html',
    MANAGE_WORKORDER_DATAFIELDS_ROUTE: '/datafields/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_DATAFIELDS_CONTROLLER: 'WorkorderDataFieldsController',

    MANAGE_WORKORDER_OTHERDETAILS_STATE: 'app.workorder.manage.otherdetails',
    MANAGE_WORKORDER_OTHERDETAILS_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-otherdetails.html',
    MANAGE_WORKORDER_OTHERDETAILS_ROUTE: '/otherdetails/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OTHERDETAILS_CONTROLLER: 'ManageWorkorderOtherDetailsController',

    MANAGE_WORKORDER_INVITEPEOPLE_STATE: 'app.workorder.manage.invitepeople',
    MANAGE_WORKORDER_INVITEPEOPLE_VIEW: 'app/main/workorder/workorders/manage-workorder/manage-workorder-step-invitepeople.html',
    MANAGE_WORKORDER_INVITEPEOPLE_ROUTE: '/invitepeople/:woID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_INVITEPEOPLE_CONTROLLER: 'ManageWorkorderInvitePeopleController',

    WORKORDER_SHOW_EQUIPMENTLIST_MODAL_VIEW: 'app/main/workorder/workorders/select-equipment-list-popup/select-equipment-list-popup.html',
    WORKORDER_SHOW_EQUIPMENTLIST_MODAL_CONTROLLER: 'ShowEquipmentListPopUpController',

    WORKORDER_SHOW_PARTLIST_MODAL_VIEW: 'app/main/workorder/workorders/select-part-list-popup/select-part-list-popup.html',
    WORKORDER_SHOW_PARTLIST_MODAL_CONTROLLER: 'ShowPartListPopUpController',

    WORKORDER_SHOW_EMPLOYEELIST_MODAL_VIEW: 'app/main/workorder/workorders/select-employee-list-popup/select-employee-list-popup.html',
    WORKORDER_SHOW_EMPLOYEELIST_MODAL_CONTROLLER: 'ShowEmployeeListPopUpController',

    WORKORDER_SHOWLIST_MODAL_VIEW: 'app/main/workorder/workorders/select-list-popup/select-list-popup.html',
    WORKORDER_SHOWLIST_MODAL_CONTROLLER: 'ShowListPopUpController',

    WORKORDER_SHOWEMPLOYEE_OPERATION_MODAL_VIEW: 'app/main/workorder/workorders/show-employee-operation-popup/show-employee-operation-popup.html',
    WORKORDER_SHOWEMPLOYEE_OPERATION_MODAL_CONTROLLER: 'ShowEmployeeOperationPopUpController',

    WORKORDER_SHOWPART_OPERATION_MODAL_VIEW: 'app/main/workorder/workorders/show-part-operation-popup/show-part-operation-popup.html',
    WORKORDER_SHOWPART_OPERATION_MODAL_CONTROLLER: 'ShowPartOperationPopUpController',

    WORKORDER_SHOWEQUIPMENT_OPERATION_MODAL_VIEW: 'app/main/workorder/workorders/show-equipment-operation-popup/show-equipment-operation-popup.html',
    WORKORDER_SHOWEQUIPMENT_OPERATION_MODAL_CONTROLLER: 'ShowEquipmentOperationPopUpController',

    WORKORDER_SHOWOPERATION_MODAL_VIEW: 'app/main/workorder/workorders/show-operation-popup/show-operation-popup.html',
    WORKORDER_SHOWOPERATION_MODAL_CONTROLLER: 'ShowOperationPopUpController',

    WORKORDER_SHOWROLE_MODAL_VIEW: 'app/main/workorder/workorders/show-operation-role-popup/show-operation-role-popup.html',
    WORKORDER_SHOWROLE_MODAL_CONTROLLER: 'ShowOperationRolePopUpController',

    WO_INVITE_EMP_FOR_REVIEW_REQ_MODAL_VIEW: 'app/main/workorder/workorders/invite-emp-for-req-review-popup/invite-emp-for-req-review-popup.html',
    WO_INVITE_EMP_FOR_REVIEW_REQ_MODAL_CONTROLLER: 'InviteEmpForReqReviewPopupController',

    MANAGE_WORKORDER_OPERATION_STATE: 'app.workorder.manage.operation',
    MANAGE_WORKORDER_OPERATION_ROUTE: '/operation',
    MANAGE_WORKORDER_OPERATION_PARAMS: {
      woRevReqID: {
        value: undefined,
        squash: true
      },
      openRevReq: {
        value: undefined,
        squash: true
      }
    },
    MANAGE_WORKORDER_OPERATION_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/manage-workorder-operation-step-main.html',
    MANAGE_WORKORDER_OPERATION_CONTROLLER: 'ManageWorkorderOperationMainController',

    MANAGE_WORKORDER_OPERATION_DETAILS_STATE: 'app.workorder.manage.operation.details',
    MANAGE_WORKORDER_OPERATION_DETAILS_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-details.html',
    MANAGE_WORKORDER_OPERATION_DETAILS_ROUTE: '/details/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_DETAILS_CONTROLLER: 'WorkorderOperationDetailsController',

    MANAGE_WORKORDER_OPERATION_DODONT_STATE: 'app.workorder.manage.operation.dodont',
    MANAGE_WORKORDER_OPERATION_DODONT_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-dodont.html',
    MANAGE_WORKORDER_OPERATION_DODONT_ROUTE: '/dodont/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_DODONT_CONTROLLER: 'WorkorderOperationDoDontsController',

    MANAGE_WORKORDER_OPERATION_DOCUMENTS_STATE: 'app.workorder.manage.operation.documents',
    MANAGE_WORKORDER_OPERATION_DOCUMENTS_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-document.html',
    MANAGE_WORKORDER_OPERATION_DOCUMENTS_ROUTE: '/documents/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_DOCUMENTS_CONTROLLER: 'WorkorderOperationDocumentsController',

    MANAGE_WORKORDER_OPERATION_DATAFIELDS_STATE: 'app.workorder.manage.operation.datafields',
    MANAGE_WORKORDER_OPERATION_DATAFIELDS_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-dataelement.html',
    MANAGE_WORKORDER_OPERATION_DATAFIELDS_ROUTE: '/datafields/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_DATAFIELDS_CONTROLLER: 'WorkorderOperationDataFieldsController',

    MANAGE_WORKORDER_OPERATION_PARTS_STATE: 'app.workorder.manage.operation.parts',
    MANAGE_WORKORDER_OPERATION_PARTS_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-parts.html',
    MANAGE_WORKORDER_OPERATION_PARTS_ROUTE: '/parts/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_PARTS_CONTROLLER: 'WorkorderOperationPartsController',

    MANAGE_WORKORDER_OPERATION_EQUIPMENTS_STATE: 'app.workorder.manage.operation.equipments',
    MANAGE_WORKORDER_OPERATION_EQUIPMENTS_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-equipments.html',
    MANAGE_WORKORDER_OPERATION_EQUIPMENTS_ROUTE: '/equipments/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_EQUIPMENTS_CONTROLLER: 'WorkorderOperationEquipmentsController',

    MANAGE_WORKORDER_OPERATION_EMPLOYEES_STATE: 'app.workorder.manage.operation.employees',
    MANAGE_WORKORDER_OPERATION_EMPLOYEES_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-employee.html',
    MANAGE_WORKORDER_OPERATION_EMPLOYEES_ROUTE: '/employees/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_EMPLOYEES_CONTROLLER: 'WorkorderOperationEmployeesController',

    MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_STATE: 'app.workorder.manage.operation.firstarticle',
    MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-firstarticle.html',
    MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_ROUTE: '/firstarticle/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_CONTROLLER: 'WorkorderOperationFirstArticleController',

    MANAGE_WORKORDER_OPERATION_OTHERDETAILS_STATE: 'app.workorder.manage.operation.otherdetails',
    MANAGE_WORKORDER_OPERATION_OTHERDETAILS_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-otherdetails.html',
    MANAGE_WORKORDER_OPERATION_OTHERDETAILS_ROUTE: '/otherdetails/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_OTHERDETAILS_CONTROLLER: 'WorkorderOperationOtherDetailsController',

    MANAGE_WORKORDER_OPERATION_STATUS_STATE: 'app.workorder.manage.operation.status',
    MANAGE_WORKORDER_OPERATION_STATUS_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-step-status.html',
    MANAGE_WORKORDER_OPERATION_STATUS_ROUTE: '/status/:woOPID/:woRevReqID/:openRevReq',
    MANAGE_WORKORDER_OPERATION_STATUS_CONTROLLER: 'WorkorderOperationStatusController',

    WORKORDER_OPERATION_CLUSTER_CONTROLLER: 'WorkOrderOperationClusterController',
    WORKORDER_OPERATION_CLUSTER_VIEW: 'app/main/workorder/workorders/workorder-operation-cluster-popup/workorder-operation-cluster-popup.html',

    ADD_WORKORDER_CONTROLLER: 'AddWorkorderController',
    ADD_WORKORDER_VIEW: 'app/main/workorder/workorders/add-workorder-popup/add-workorder-popup.html',

    WORKORDER_QTY_CONFIRMATION_APPROVAl_CONTROLLER: 'WorkorderQuantityConfirmationApprovalPopupController',
    WORKORDER_QTY_CONFIRMATION_APPROVAl_VIEW: 'app/main/workorder/workorders/workorder-quantity-confirmation-approval-popup/workorder-quantity-confirmation-approval-popup.html',

    WORKORDER_REVIEW_CHANGES_POPUP_CONTROLLER: 'WorkorderReviewChangesPopupController',
    WORKORDER_REVIEW_CHANGES_POPUP_VIEW: 'app/main/workorder/workorders/workorder-review-changes-popup/workorder-review-changes-popup.html',

    WORKORDER_HALT_RESUME_POPUP_CONTROLLER: 'WorkorderHaltResumeReasonPopupController',
    WORKORDER_HALT_RESUME_POPUP_VIEW: 'app/main/workorder/workorders/workorder-halt-resume-reason-popup/workorder-halt-resume-reason-popup.html',

    WORKORDER_GENERATE_SERIAL_POPUP_CONTROLLER: 'WorkorderGenerateSerialPopupController',
    WORKORDER_GENERATE_SERIAL_POPUP_VIEW: 'app/main/workorder/workorders/workorder-generate-serial-popup/workorder-generate-serial-popup.html',

    WORKORDER_CHANGES_HISTORY_POPUP_CONTROLLER: 'WorkorderChangesHistoryController',
    WORKORDER_CHANGES_HISTORY_POPUP_VIEW: 'app/main/workorder/workorders/workorder-changes-history-popup/workorder-changes-history-popup.html',

    WORKORDER_OPERATION_REVISION_POPUP_CONTROLLER: 'WorkorderOperationRevisionPopupController',
    WORKORDER_OPERATION_REVISION_POPUP_VIEW: 'app/main/workorder/workorders/workorder-operation-revision-popup/workorder-operation-revision-popup.html',

    WORKORDER_REVISION_POPUP_CONTROLLER: 'WorkorderRevisionPopupController',
    WORKORDER_REVISION_POPUP_VIEW: 'app/main/workorder/workorders/workorder-revision-popup/workorder-revision-popup.html',

    AUDITLOG_ADVANCED_SEARCH_POPUP_CONTROLLER: 'AuditlogAdvancedSearchPopupController',
    AUDITLOG_ADVANCED_SEARCH_POPUP_VIEW: 'app/main/workorder/workorders/workorder-dataentry-change-auditlog/auditlog-advanced-search-popup.html',

    WORKORDER_CONVERT_TO_MASTER_TEMPLATE_MODAL_VIEW: 'app/main/workorder/workorders/convert-to-master-template-popup/convert-to-master-template-popup.html',
    WORKORDER_CONVERT_TO_MASTER_TEMPLATE_MODAL_CONTROLLER: 'ConvertToMasterTemplateController',

    WORKORDER_OPERATION_CCONFIGURATION_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/workorder-operation-configuration-popup/workorder-operation-configuration-popup.html',
    WORKORDER_OPERATION_CCONFIGURATION_CONTROLLER: 'WorkOrderOperationConfigurationController',

    VIEW_WO_HALT_RESUME_NOTIFICATION_CONTROLLER: 'ViewWOHaltResumeNotificationPopupController',
    VIEW_WO_HALT_RESUME_NOTIFICATION_VIEW: 'app/main/workorder/workorders/view-wo-halt-resume-notification-popup/view-wo-halt-resume-notification-popup.html',

    VIEW_WO_HALT_OPERATION_CONTROLLER: 'ViewWOHaltOperationPopupController',
    VIEW_WO_HALT_OPERATION_VIEW: 'app/main/workorder/workorders/show-wo-halt-operation-popup/show-wo-halt-operation-popup.html',

    // [S] ECO Request
    ECO_REQUEST_LIST_STATE: 'app.workorder.ecorequestlist',
    ECO_REQUEST_LIST_ROUTE: '/ecorequest/:partID/:woID',
    ECO_REQUEST_LIST_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-list.html',
    ECO_REQUEST_LIST_CONTROLLER: 'ECORequestListController',

    ECO_REQUEST_MAIN_STATE: 'app.workorder.ecorequest',
    ECO_REQUEST_MAIN_ROUTE: '/manage',
    ECO_REQUEST_MAIN_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-main.html',
    ECO_REQUEST_MAIN_CONTROLLER: 'ECORequestMainController',

    ECO_REQUEST_STATE: 'app.workorder.ecorequest.main',
    ECO_REQUEST_ROUTE: '/manage/:requestType/:woID/:ecoReqID',
    ECO_REQUEST_VIEW: 'app/main/workorder/workorders/eco-request/eco-request.html',
    ECO_REQUEST_CONTROLLER: 'ECORequestController',

    ECO_REQUEST_DETAIL_STATE: 'app.workorder.ecorequest.detail',
    ECO_REQUEST_DETAIL_ROUTE: '/ecorequest/detail/:partID/:ecoReqID/:woID',


    ECO_REQUEST_DEPARTMENT_APPROVAL_STATE: 'app.workorder.ecorequest.departmentapproval',
    ECO_REQUEST_DEPARTMENT_APPROVAL_ROUTE: '/ecorequest/departmentapproval/:partID/:ecoReqID/:woID',
    ECO_REQUEST_DEPARTMENT_APPROVAL_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-department-approval/eco-request-department-approval.html',
    ECO_REQUEST_DEPARTMENT_APPROVAL_CONTROLLER: 'ECORequestDepartmentApprovalController',

    ECO_REQUEST_DOCUMENT_STATE: 'app.workorder.ecorequest.documents',
    ECO_REQUEST_DOCUMENT_ROUTE: '/ecorequest/document/:partID/:ecoReqID/:woID',
    ECO_REQUEST_DOCUMENT_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-document/eco-request-document.html',
    ECO_REQUEST_DOCUMENT_CONTROLLER: 'ECORequestDocumentController',
    // [E] ECO Request

    // [S] DFM Request
    DFM_REQUEST_LIST_STATE: 'app.workorder.dfmrequestlist',
    DFM_REQUEST_LIST_ROUTE: '/dfmrequest/:partID/:woID',
    DFM_REQUEST_LIST_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-list.html',
    DFM_REQUEST_LIST_CONTROLLER: 'ECORequestListController',

    DFM_REQUEST_STATE: 'app.workorder.dfmrequest.main',
    DFM_REQUEST_ROUTE: '/manage/:requestType/:partID/:ecoReqID/:woID',
    DFM_REQUEST_VIEW: 'app/main/workorder/workorders/eco-request/eco-request.html',
    DFM_REQUEST_CONTROLLER: 'ECORequestController',

    DFM_REQUEST_MAIN_STATE: 'app.workorder.dfmrequest',
    DFM_REQUEST_MAIN_ROUTE: '/manage',
    DFM_REQUEST_MAIN_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-main.html',
    DFM_REQUEST_MAIN_CONTROLLER: 'ECORequestMainController',

    DFM_REQUEST_DETAIL_STATE: 'app.workorder.dfmrequest.detail',
    DFM_REQUEST_DETAIL_ROUTE: '/dfmrequest/detail/:partID/:ecoReqID/:woID',
    DFM_REQUEST_DETAIL_VIEW: 'app/main/workorder/workorders/eco-request/manage-eco-request/manage-eco-request.html',
    DFM_REQUEST_DETAIL_CONTROLLER: 'ECORequestManageController',

    DFM_REQUEST_DEPARTMENT_APPROVAL_STATE: 'app.workorder.dfmrequest.departmentapproval',
    DFM_REQUEST_DEPARTMENT_APPROVAL_ROUTE: '/dfmrequest/departmentapproval/:partID/:ecoReqID/:woID',
    DFM_REQUEST_DEPARTMENT_APPROVAL_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-department-approval/eco-request-department-approval.html',
    DFM_REQUEST_DEPARTMENT_APPROVAL_CONTROLLER: 'ECORequestDepartmentApprovalController',

    DFM_REQUEST_DOCUMENT_STATE: 'app.workorder.dfmrequest.documents',
    DFM_REQUEST_DOCUMENT_ROUTE: '/dfmrequest/document/:partID/:ecoReqID/:woID',
    DFM_REQUEST_DOCUMENT_VIEW: 'app/main/workorder/workorders/eco-request/eco-request-document/eco-request-document.html',
    DFM_REQUEST_DOCUMENT_CONTROLLER: 'ECORequestDocumentController',

    // [E] DFM Request

    // WO Audit Log History
    WO_DATAENTRY_CHANGE_AUDITLOG_LIST_STATE: 'app.workorder.dataentrychangeauditloglist',
    WO_DATAENTRY_CHANGE_AUDITLOG_LIST_ROUTE: '/auditlog/:woID',
    WO_DATAENTRY_CHANGE_AUDITLOG_LIST_VIEW: 'app/main/workorder/workorders/workorder-dataentry-change-auditlog/workorder-dataentry-change-auditlog-list.html',
    WO_DATAENTRY_CHANGE_AUDITLOG_LIST_CONTROLLER: 'WorkorderDataentryChangeAuditLogController',

    // Difference of WO entry change popup
    DIFFERENCE_OF_WORKORDER_CHANGE_POPUP_CONTROLLER: 'DiffOfWorkorderEntryChangeController',
    DIFFERENCE_OF_WORKORDER_REVIEW_CHANGE_POPUP_VIEW: 'app/main/workorder/workorders/workorder-dataentry-change-auditlog/difference-of-workorder-entrychange-popup.html',

    // WO Audit Log History
    WO_MANUAL_ENTRY_LIST_STATE: 'app.workorder.manualentrylist',
    WO_MANUAL_ENTRY_LIST_ROUTE: '/workordermanualentrylist/:woID',
    WO_MANUAL_ENTRY_LIST_VIEW: 'app/main/workorder/workorders/manual-entry/workorder-manual-entry-list.html',
    WO_MANUAL_ENTRY_LIST_CONTROLLER: 'WorkordersManualEntryListController',

    WO_MANAGE_MANUAL_ENTRY_STATE: 'app.workorder.managewomanualentry',
    WO_MANAGE_MANUAL_ENTRY_ROUTE: '/managewomanualentry/:woID/:woTransID',
    WO_MANAGE_MANUAL_ENTRY_VIEW: 'app/main/workorder/workorders/manual-entry/manage-workorder-manual-entry.html',
    WO_MANAGE_MANUAL_ENTRY_CONTROLLER: 'ManageWorkorderManualEntryController',

    WORKORDER_SHOW_ADVANCEDSEARCHE_CONTROLLER: 'AdvancedSearchPopUpController',
    WORKORDER_SHOW_ADVANCEDSEARCHE_VIEW: 'app/main/workorder/workorders/advanced-search-popup.html',

    WORKORDER_PROFILE_VIEW: 'app/main/workorder/workorders/workorder-profile/workorder-profile.html',
    WORKORDER_PROFILE_CONTROLLER: 'WorkorderProfileController',
    WORKORDER_PROFILE_STATE: 'app.workorder.profile',
    WORKORDER_PROFILE_ROUTE: '/profile/:woID',

    WORKORDER_IMPORT_FEEDER_COLUMN_MAPPING_VIEW: 'app/view/import-equipment-feeder-detail-popup/import-equipment-feeder-detail-popup.html',
    WORKORDER_IMPORT_FEEDER_COLUMN_MAPPING_CONTROLLER: 'ImportEquipmentFeederPopupController',

    WORKORDER_VIEW_FEEDER_DETAILS_VIEW: 'app/view/view-equipment-feeder-detail-popup/view-equipment-feeder-detail-popup.html',
    WORKORDER_VIEW_FEEDER_DETAILS_CONTROLLER: 'ViewEquipmentFeederHistoryController',

    IMPORT_CONFIRMATION_VIEW: 'app/main/workorder/workorders/import-confirmation-popup/import-confirmation-popup.html',
    IMPORT_CONFIRMATION_CONTROLLER: 'ImportConfirmationPopupController',

    WORKORDER_STATUS_FEEDER_DETAILS_VIEW: 'app/view/status-equipment-feeder-detail-popup/status-equipment-feeder-detail-popup.html',
    WORKORDER_STATUS_FEEDER_DETAILS_CONTROLLER: 'StatusEquipmentFeederDetailPopupController',

    PERMANENT_RESTRICT_PART_MODAL_CONTROLLER: 'ViewRestrictedPartPopupController',
    PERMANENT_RESTRICT_PART_MODAL_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/view-restricted-part-popup/view-restricted-part-popup.html',

    WOOP_FIRST_ARTICLE_ALREADY_ADDED_SERIALS_MODAL_CONTROLLER: 'WOOPFirstArticleAlreadyAddedSerials',
    WOOP_FIRST_ARTICLE_ALREADY_ADDED_SERIALS_MODAL_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/wo-op-first-article-already-added-serials/wo-op-first-article-already-added-serials-popup.html',

    SHOW_ACTIVE_OPERATION_POPUP_CONTROLLER: 'ShowActiveOperationPopUpController',
    SHOW_ACTIVE_OPERATION_POPUP_VIEW: 'app/main/workorder/workorders/show-active-operation-popup/show-active-operation-popup.html',

    USAGE_MATERIAL_REPORT_POPUP_CONTROLLER: 'UsageMaterialReportPopUpController',
    USAGE_MATERIAL_REPORT_POPUP_VIEW: 'app/main/workorder/workorders/usage-material-report-popup/usage-material-report-popup.html',

    // all added first article serials popup
    WO_OP_ALL_FIRSTARTICLE_SERIALS_MODAL_VIEW: 'app/main/workorder/workorders/manage-workorder-operation/wo-op-all-firstarticle-serials-popup/wo-op-all-firstarticle-serials-popup.html',
    WO_OP_ALL_FIRSTARTICLE_SERIALS_MODAL_CONTROLLER: 'WOOPAllFirstArticleSerialsPopupController',

    /**
     * CONTROLLERS
     */

    ECO_TAB_LIST: {
      DETAIL: {
        id: 1,
        title: 'Detail',
        DisplayOrder: 1,
        tabnameparam: 'detail'
      },
      DEPARTMENT_APPROVAL: {
        id: 2,
        title: 'Department Approval',
        DisplayOrder: 2,
        tabnameparam: 'departmentapproval'
      },
      DOCUMENTS: {
        id: 3,
        title: 'Documents',
        DisplayOrder: 3,
        tabnameparam: 'document'
      }
    },
    WORKORDER_EMPTYSTATE: {
      WORKORDER: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No work order is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a work order'
      },
      OPERATION: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        NO_SELECTED: 'No operations available.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNEDOPERATIONS: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        NO_ASSIGNED: 'No operations are assigned.',
        All_ASSIGNED: 'All operations are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNEMPLOYEES: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        NO_SELECTED: 'No personnel for selected operation.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNEQUIPMENTS: {
        IMAGEURL: 'assets/images/emptystate/equipment.png',
        NO_SELECTED: 'No equipments for selected operation.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNPARTS: {
        IMAGEURL: 'assets/images/emptystate/part.png',
        NO_SELECTED: 'No supplies, materials & tools for selected operation.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNFILEDS: {
        IMAGEURL: 'assets/images/emptystate/manageelement.png',
        MESSAGE: 'No data fields are assigned.',
        ALL_ASSIGNED: 'All data fields are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        ADDNEWMESSAGE: 'Click below to add a data fields'
      },
      ECO_REQUEST_LIST: {
        IMAGEURL: 'assets/images/emptystate/ECO-request.png',
        MESSAGE: 'No ECO request is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an ECO request'
      },
      DFM_REQUEST_LIST: {
        IMAGEURL: 'assets/images/emptystate/ECO-request.png',
        MESSAGE: 'No DFM request is listed yet!',
        ADDNEWMESSAGE: 'Click below to add an DMF request'
      },
      WORKORDER_SERIAL: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Serial# transaction not processed yet!'
      },
      WORKORDER_SERIAL_TRANS_HISTORY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Serial# is not used in any transaction'
      },
      WORKORDER_REVIEW_CHANGE: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No result matching your search criteria!'
      },
      WORKORDER_REVIEW_EMPTY: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No review comments added yet!'
      },
      WORKORDER_REVIEW_NOT_FOUND: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No review request added yet!'
      },
      WORKORDER_DATAENTRY_CHANGE_AUDITLOG: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No change is listed yet!'
      },
      WORKORDER_MANUAL_ENTRY_LIST: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No manual entry is listed yet!',
        ADDNEWMESSAGE: 'Click below to add activity entry manually'
      },
      WORKORDER_OPERATION_ROLES: {
        IMAGEURL: 'assets/images/emptystate/role.png',
        NO_SELECTED: 'No roles available.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      LOADDETAILS: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Please wait for a while we getting your data.'
      },
      WORKORDER_TRANS_HOLD_UNHOLD: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No halt/resume history found for work order!'
      },
      WORKORDER_MAPPED_PRODUCT_SERIAL: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No serial# is mapped yet!'
      },
      ECO_REQUEST_DEPT_APPROVAL_LIST: {
        IMAGEURL: 'assets/images/emptystate/ECO-request.png',
        MESSAGE: 'No department approval is listed yet!'
      },
      WORKORDER_OPERATION_EQUIPMENT_FEEDER_DETAILS: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No feeder details uploaded yet!'
      },
      WORKORDER_OPERATION_UMID_DETAILS: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No UMID details scanned yet!'
      },
      REQ_REV_SELECTION: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'Please select a change request'
      },
      ACTIVE_OPERATION: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        MESSAGE: 'No active operations are available. ',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      FIRST_ARTICLE: {
        IMAGEURL: 'assets/images/emptystate/workorder.png',
        MESSAGE: 'No 1st article serial# listed yet!'
      }
    },
    ECO_REQUEST_TYPE: {
      ALL: {
        Name: 'All',
        Value: 0
      },
      ECO: {
        Name: 'ecorequest',
        Value: 1
      },
      DFM: {
        Name: 'dfmrequest',
        Value: 2
      }
    },
    ECO_DFM_GRID_TITLE: {
      ReasonForChange: 'Reason For Change',
      DFM_Description: 'Proposed Resolution',
      ECO_Description: 'Issue Description and/or Change',
      ApprovalReason: 'Approval Reason',
      RejecttionReason: 'Rejection Reason'
    },
    ECO_REQUEST: {
      STATUS: {
        Pending: 'P',
        Closed: 'C'
      }
    },
    ECO_REQUEST_FINAL_STATUS: {
      Pending: {
        Name: 'Resolution Pending',
        Value: 'P'
      },
      Accept: {
        Name: 'Resolution Accepted',
        Value: 'A'
      },
      Reject: {
        Name: 'Rejected',
        Value: 'R'
      }
    },
    DFM_REQUEST_FINAL_STATUS: {
      Pending: {
        Name: 'Resolution Pending',
        Value: 'P'
      },
      Accept: {
        Name: 'Resolution Accepted',
        Value: 'A'
      },
      Reject: {
        Name: 'Rejected',
        Value: 'R'
      }
    },
    ECO_REQUEST_IMPLEMENT_TO: {
      Same_WorkOrder: {
        Name: 'Same Work Order',
        Value: 1
      },
      New_WorkOrder: {
        Name: 'New Work Order',
        Value: 2
      },
      Terminate_Transfer: {
        Name: 'Terminate & Transfer to New Revised Work order',
        Value: 3
      }
    },
    WorkOrderRadioGroup: {
      isRevisedWO: [{ Key: 'New WO', Value: false }, { Key: 'Revised WO', Value: true }],
      isHotJob: [{ Key: 'No', Value: false }, { Key: 'Yes', Value: true }],
      isOperationTrackBySerialNo: [{ Key: 'Bulk Qty OP', Value: false }, { Key: 'Track Serial Numbers', Value: true }],
      isSampleAvailable: [{ Key: 'No Sample', Value: false }, { Key: 'Sample & Location', Value: true }],
      PrefixorSuffix: [{ Key: 'Prefix', Value: true }, { Key: 'Suffix', Value: false }],
      isSelectAllRole: [{ Key: 'All', Value: true }, { Key: 'Manual', Value: false }]
    },
    FEEDER_PLACEMENT_TYPE: [{ value: 'By Machine', Key: 1 }, { value: 'By Hand', Key: 2 }],

    FEEDER_COLUMN_MAPPING: {
      Feeder: {
        Name: 'Feeder#',
        isRequired: true,
        isDisplay: true
      }, ProductionPN: {
        Name: 'Production PN',
        isRequired: false,
        isDisplay: true
      }, PID: {
        Name: 'PID',
        isRequired: false,
        isDisplay: true
      }, Description: {
        Name: 'Description',
        isRequired: false,
        isDisplay: true
      }, Qty: {
        Name: 'Qty',
        isRequired: true,
        isDisplay: true
      }, Supply: {
        Name: 'Supply',
        isRequired: false,
        isDisplay: true
      }, UsedOn: {
        Name: 'Used On',
        isRequired: false,
        isDisplay: true
      }, Col1: {
        Name: 'Col1',
        isRequired: false,
        isDisplay: true
      }, Col2: {
        Name: 'Col2',
        isRequired: false,
        isDisplay: true
      }, Col3: {
        Name: 'Col3',
        isRequired: false,
        isDisplay: true
      }, Col4: {
        Name: 'Col4',
        isRequired: false,
        isDisplay: true
      }
    },
    //['Feeder', 'MFG PN', 'Description', 'Quantity', 'Supply', 'Used On', 'Col1', 'Col2', 'Col3', 'Col4'],
    AllLabels: {
      TotalSMQtyInWO: 'Total estimated QPA from all operation * Build Qty',
      TotalActualSMQtyInWO: 'Total actual QPA from all operation * Build Qty',
      TotalToolsQtyInWO: 'Total estimated quantity from all operation',
      TotalActualToolsQtyInWO: 'Total actual quantity from all operation'
    },
    AccessFrom: {
      WorkOrderInvitePeoplePage: 'WorkOrderInvitePeoplePage',
      TravelerChangeRequestPage: 'TravelerChangeRequestPage'
    },
    FirstArticleAddSerialMethod: {
      PickFromExistingOperation: 'Pick Serial# From Previous Existing Operations',
      GenerateNew: 'Generate New Serial#'
    },
    WORKORDER_SERIAL_NUMBER_LABEL: 'Serial#',
    WONotes: {
      SystemGenerateWONumber:'Note: WO# is system generated'
    }
  };
  angular
    .module('app.workorder.workorders')
    .constant('WORKORDER', WORKORDER);
})();
