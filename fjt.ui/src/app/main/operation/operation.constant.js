(function () {
  'use strict';
  /** @ngInject */
  var OPERATION = {
    OPERATION_ERROR_LABEL: 'Error',

    OPERATION_LABEL: 'Operation',
    OPERATION_ROUTE: '/',
    OPERATION_STATE: 'app.operation',
    OPERATION_CONTROLLER: '',
    OPERATION_VIEW: '',

    OPERATION_OPERATIONS_LABEL: 'Operations',
    OPERATION_OPERATIONS_ROUTE: 'operation',
    OPERATION_OPERATIONS_STATE: 'app.operation.list',
    OPERATION_OPERATIONS_CONTROLLER: 'OperationsController',
    OPERATION_OPERATIONS_VIEW: 'app/main/operation/operations/operations-list.html',

    OPERATION_MANAGE_ROUTE: '/manage',
    OPERATION_MANAGE_STATE: 'app.operation.list.manage',
    OPERATION_MANAGE_CONTROLLER: 'ManageOperationsController',
    OPERATION_MANAGE_VIEW: 'app/main/operation/operations/manage-operations.html',

    OPERATION_MANAGE_DETAILS_ROUTE: '/details/:opID',
    OPERATION_MANAGE_DETAILS_STATE: 'app.operation.list.manage.details',

    OPERATION_MANAGE_DODONT_ROUTE: '/dodont/:opID',
    OPERATION_MANAGE_DODONT_STATE: 'app.operation.list.manage.dodont',

    OPERATION_MANAGE_DOCUMENTS_ROUTE: '/documents/:opID',
    OPERATION_MANAGE_DOCUMENTS_STATE: 'app.operation.list.manage.documents',

    OPERATION_MANAGE_DATAFIELDS_ROUTE: '/datafields/:opID',
    OPERATION_MANAGE_DATAFIELDS_STATE: 'app.operation.list.manage.datafields',

    OPERATION_MANAGE_PARTS_ROUTE: '/parts/:opID',
    OPERATION_MANAGE_PARTS_STATE: 'app.operation.list.manage.parts',

    OPERATION_MANAGE_EQUIPMENTS_ROUTE: '/equipments/:opID',
    OPERATION_MANAGE_EQUIPMENTS_STATE: 'app.operation.list.manage.equipments',

    OPERATION_MANAGE_EMPLOYEES_ROUTE: '/employees/:opID',
    OPERATION_MANAGE_EMPLOYEES_STATE: 'app.operation.list.manage.employees',

    OPERATION_MANAGE_TEMPLATES_ROUTE: '/templates/:opID',
    OPERATION_MANAGE_TEMPLATES_STATE: 'app.operation.list.manage.templates',

    OPERATION_PROFILE_STATE: 'app.operation.list.operationprofile',
    OPERATION_PROFILE_ROUTE: '/profile/:id',
    OPERATION_PROFILE_VIEW: 'app/main/operation/operations/operation-profile.html',
    OPERATION_PROFILE_CONTROLLER: 'OperationProfileController',

    OPERATION_MODAL_VIEW: 'app/main/operation/operations/OperationUpdateModalView.html',
    OPERATION_MODAL_CONTROLLER: 'OperationUpdateModalController',

    OPERATION_MASTER_TEMPLATE_LABEL: 'Master Template',
    OPERATION_MASTER_TEMPLATE_ROUTE: 'masters',
    OPERATION_MASTER_TEMPLATE_STATE: 'app.operation.masters',
    OPERATION_MASTER_TEMPLATE_CONTROLLER: 'OperationMasterTemplateController',
    OPERATION_MASTER_TEMPLATE_VIEW: 'app/main/operation/master-template/master-template.html',

    OPERATION_MASTER_MANAGE_TEMPLATE_ROUTE: '/templatemanage/:id',
    OPERATION_MASTER_MANAGE_TEMPLATE_STATE: 'app.operation.masters.templatemanage',
    OPERATION_MASTER_MANAGE_TEMPLATE_CONTROLLER: 'UpdateOperationTemplateController',
    OPERATION_MASTER_MANAGE_TEMPLATE_VIEW: 'app/main/operation/master-template/update-operation-template.html',


    OPERATION_MASTER_TEMPLATE_MODAL_VIEW: 'app/main/operation/master-template/manage-mastertemplate-popup.html',
    OPERATION_MASTER_TEMPLATE_MODAL_CONTROLLER: 'ManageMasterTemplateModalController',

    DUPLICATE_OPERATION_POPUP_CONTROLLER: 'DuplicateOperationPopupController',
    DUPLICATE_OPERATION_POPUP_VIEW: 'app/main/operation/operations/duplicate-operation-popup.html',

    OPERATION_LIST_POPUP_CONTROLLER: 'DraftOperationListPopupController',
    OPERATION_LIST_POPUP_VIEW: 'app/main/operation/operations/draft-operations-list-popup.html',
    /**
 * TEMPLATE URLS / VIEWS
 */
    NAVIGATION_BAR_VIEW: './user/view/navigation-bar.view.html',
    OPERATION_PATH: _configRootUrl + 'v1/operations',
    OPERATION_IMAGE_MODAL: 'app/main/operation/operations/operation-image-view.html',
    OPERATION_ACTION_VIEW: 'app/main/operation/operations/operation-action-view.html',

    /**
 * CONTROLLERS
 */
    NAVIGATION_CONTROLLER: 'NavigationController',
    OPERATION_IMAGE_MODAL_CONTROLLER: 'OperationImageController',

    /**
 * STRINGS
 */

    OPERATION_EMPTYSTATE: {
      OPERATION: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        MESSAGE: 'No operation is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a operation'
      },
      MASTERTEMPLATE: {
        IMAGEURL: 'assets/images/emptystate/mastertemplate.png',
        MESSAGE: 'No operation Management is listed yet!',
        ADDNEWMESSAGE: 'Click below to add a operation Management'
      },
      ASSIGNFILEDS: {
        IMAGEURL: 'assets/images/emptystate/manageelement.png',
        MESSAGE: 'No data fields are assigned.',
        ALL_ASSIGNED: 'All data fields are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        ADDNEWMESSAGE: 'Click below to add a data fields'
      },
      ASSIGNOPERATIONS: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        MESSAGE: 'No operations are assigned.',
        ALL_ASSIGNED: 'All operations are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNEMPLOYEES: {
        IMAGEURL: 'assets/images/emptystate/employee.png',
        MESSAGE: 'No personnel are assigned.',
        ALL_ASSIGNED: 'All personnel are assigned.',
        ADDNEWMESSAGE: 'Click below to add a personnel',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGN_TEMPLATE: {
        IMAGEURL: 'assets/images/emptystate/operation.png',
        MESSAGE: 'No template are assigned.',
        ALL_ASSIGNED: 'All template are assigned.',
        ADDNEWMESSAGE: 'Click below to add a template',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNEQUIPMENT: {
        IMAGEURL: 'assets/images/emptystate/equipment.png',
        MESSAGE: 'No equipments are assigned.',
        ALL_ASSIGNED: 'All equipments are assigned.',
        ADDNEWMESSAGE: 'Click below to add a equipment',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.'
      },
      ASSIGNPART: {
        IMAGEURL: 'assets/images/emptystate/part.png',
        MESSAGE: 'No supplies,materials & tools are assigned.',
        ALL_ASSIGNED: 'All supplies,materials & tools are assigned.',
        EMPTY_SEARCH_MESSAGE: 'No result matching your search criteria.',
        ADDNEWMESSAGE: 'Click below to add a supplies,materials & tools'

      },
      DOCUMENT_UPLOAD: {
        IMAGEURL: 'assets/images/emptystate/document.png',
        MESSAGE: 'No documents are uploaded yet!',
        ADDNEWMESSAGE: 'Click below to add a document.'
      },
      OPERATIONDETAILS: {
        IMAGEURL: 'assets/images/emptystate/operation-details.png',
        MESSAGE: 'No details listed yet!'
      }
    },
    OperationMasterTabs: {
      Details: { ID: 0, Name: 'details' },
      DoDont: { ID: 1, Name: 'dodont', DisplayName: 'Do\'s & Don\'ts' },
      Documents: { ID: 2, Name: 'documents', DisplayName: 'Documents' },
      DataFields: { ID: 3, Name: 'datafields', DisplayName: 'Data Fields' },
      Parts: { ID: 4, Name: 'parts' },
      Equipments: { ID: 5, Name: 'equipments' },
      Employees: { ID: 6, Name: 'employees' },
      Templates: { ID: 7, Name: 'templates', DisplayName: 'Allocate Templates' }
    },
    OPERATION_ICON: 't-icons-operation',
    OPRATION_TEMPLATE_ICON: 't-icons-operation-management'
  };
  angular
    .module('app.operation.operations')
    .constant('OPERATION', OPERATION);
})();
