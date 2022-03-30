(function () {
  'use strict';

  angular
    .module('app.workorder.workorders', ['flow'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, WORKORDER, CORE) {
    // State        
    $stateProvider.state(WORKORDER.WORKORDER_WORKORDERS_STATE, {
      url: WORKORDER.WORKORDER_WORKORDERS_ROUTE,
      views: {
        'content@app': {
          templateUrl: WORKORDER.WORKORDER_WORKORDERS_VIEW,
          controller: WORKORDER.WORKORDER_WORKORDERS_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    })
      .state(WORKORDER.MANAGE_WORKORDER_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        data: {
          autoActivateChild: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
        }
      }).state(WORKORDER.MANAGE_WORKORDER_DETAILS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_DETAILS_ROUTE,
        data: {
          'selectedTab': 0
        },
        views: {
          'workorderdetails': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_DETAILS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_DETAILS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS
      }).state(WORKORDER.MANAGE_WORKORDER_STANDARDS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_STANDARDS_ROUTE,
        data: {
          'selectedTab': 1
        },
        views: {
          'workorderstandards': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_STANDARDS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_STANDARDS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_DOCUMENTS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_DOCUMENTS_ROUTE,
        data: {
          'selectedTab': 2
        },
        views: {
          'workorderdocuments': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_DOCUMENTS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_DOCUMENTS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATIONS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATIONS_ROUTE,
        data: {
          'selectedTab': 3
        },
        views: {
          'workorderoperations': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATIONS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATIONS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_PARTS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_PARTS_ROUTE,
        data: {
          'selectedTab': 4
        },
        views: {
          'workorderparts': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_PARTS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_PARTS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_EQUIPMENTS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_EQUIPMENTS_ROUTE,
        data: {
          'selectedTab': 5
        },
        views: {
          'workorderequipments': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_EQUIPMENTS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_EQUIPMENTS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_EMPLOYEES_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_EMPLOYEES_ROUTE,
        data: {
          'selectedTab': 6
        },
        views: {
          'workorderemployees': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_EMPLOYEES_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_EMPLOYEES_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_DATAFIELDS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_DATAFIELDS_ROUTE,
        data: {
          'selectedTab': 7
        },
        views: {
          'workorderdatafields': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_DATAFIELDS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_DATAFIELDS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      })
      .state(WORKORDER.MANAGE_WORKORDER_OTHERDETAILS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OTHERDETAILS_ROUTE,
        data: {
          'selectedTab': 8
        },
        views: {
          'workorderotherdetails': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OTHERDETAILS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OTHERDETAILS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_INVITEPEOPLE_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_INVITEPEOPLE_ROUTE,
        data: {
          'selectedTab': 9
        },
        views: {
          'workorderinvitepeople': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_INVITEPEOPLE_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_INVITEPEOPLE_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      })
      .state(WORKORDER.MANAGE_WORKORDER_OPERATION_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        data: {
          //autoActivateChild: WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_STATE
        },
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_ROUTE,
        data: {
          'selectedTab': 0
        },
        views: {
          'operationdetails': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_DETAILS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_DODONT_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_DODONT_ROUTE,
        data: {
          'selectedTab': 1
        },
        views: {
          'operationdodont': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_DODONT_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_DODONT_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_DOCUMENTS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_DOCUMENTS_ROUTE,
        data: {
          'selectedTab': 2
        },
        views: {
          'operationdocuments': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_DOCUMENTS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_DOCUMENTS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_DATAFIELDS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_DATAFIELDS_ROUTE,
        data: {
          'selectedTab': 3
        },
        views: {
          'operationdatafields': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_DATAFIELDS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_DATAFIELDS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_PARTS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_PARTS_ROUTE,
        data: {
          'selectedTab': 4
        },
        views: {
          'operationparts': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_PARTS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_PARTS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_EQUIPMENTS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_EQUIPMENTS_ROUTE,
        data: {
          'selectedTab': 5
        },
        views: {
          'operationequipments': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_EQUIPMENTS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_EQUIPMENTS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_EMPLOYEES_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_EMPLOYEES_ROUTE,
        data: {
          'selectedTab': 6
        },
        views: {
          'operationemployees': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_EMPLOYEES_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_EMPLOYEES_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_ROUTE,
        data: {
          'selectedTab': 7
        },
        views: {
          'operationfirstarticle': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_FIRSTARTICLE_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_OTHERDETAILS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_OTHERDETAILS_ROUTE,
        data: {
          'selectedTab': 8
        },
        views: {
          'operationotherdetails': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_OTHERDETAILS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_OTHERDETAILS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.MANAGE_WORKORDER_OPERATION_STATUS_STATE, {
        url: WORKORDER.MANAGE_WORKORDER_OPERATION_STATUS_ROUTE,
        data: {
          'selectedTab': 9
        },
        views: {
          'operationstatus': {
            templateUrl: WORKORDER.MANAGE_WORKORDER_OPERATION_STATUS_VIEW,
            controller: WORKORDER.MANAGE_WORKORDER_OPERATION_STATUS_CONTROLLER,
          }
        },
        params: WORKORDER.MANAGE_WORKORDER_OPERATION_PARAMS,
        parentState: WORKORDER.MANAGE_WORKORDER_DETAILS_STATE
      }).state(WORKORDER.ECO_REQUEST_LIST_STATE, {
        url: WORKORDER.ECO_REQUEST_LIST_ROUTE,
        params: {
          requestType: 'ecorequest'
        },
        views: {
          'content@app': {
            templateUrl: WORKORDER.ECO_REQUEST_LIST_VIEW,
            controller: WORKORDER.ECO_REQUEST_LIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(WORKORDER.DFM_REQUEST_LIST_STATE, {
        url: WORKORDER.DFM_REQUEST_LIST_ROUTE,
        params: {
          requestType: 'dfmrequest'
        },
        views: {
          'content@app': {
            templateUrl: WORKORDER.ECO_REQUEST_LIST_VIEW,
            controller: WORKORDER.ECO_REQUEST_LIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(WORKORDER.ECO_REQUEST_MAIN_STATE, {
        url: WORKORDER.ECO_REQUEST_MAIN_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.ECO_REQUEST_MAIN_VIEW,
            controller: WORKORDER.ECO_REQUEST_MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      })
      // base route created for internal tabs
      .state(WORKORDER.ECO_REQUEST_STATE, {
        url: WORKORDER.ECO_REQUEST_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.ECO_REQUEST_VIEW,
            controller: WORKORDER.ECO_REQUEST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(WORKORDER.ECO_REQUEST_DETAIL_STATE, {
        url: WORKORDER.ECO_REQUEST_DETAIL_ROUTE,
        params: {
          requestType: 'ecorequest',
          tabName: 'detail'
        },
        views: {
          'detail': {
            templateUrl: WORKORDER.ECO_REQUEST_VIEW,
            controller: WORKORDER.ECO_REQUEST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      }).state(WORKORDER.ECO_REQUEST_DEPARTMENT_APPROVAL_STATE, {
        url: WORKORDER.ECO_REQUEST_DEPARTMENT_APPROVAL_ROUTE,
        params: {
          requestType: 'ecorequest',
          tabName: 'departmentapproval'
        },
        views: {
          'departmentapproval': {
            templateUrl: WORKORDER.ECO_REQUEST_DEPARTMENT_APPROVAL_VIEW,
            controller: WORKORDER.ECO_REQUEST_DEPARTMENT_APPROVAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      }).state(WORKORDER.ECO_REQUEST_DOCUMENT_STATE, {
        url: WORKORDER.ECO_REQUEST_DOCUMENT_ROUTE,
        params: {
          requestType: 'ecorequest',
          tabName: 'document'
        },
        views: {
          'document': {
            templateUrl: WORKORDER.ECO_REQUEST_DOCUMENT_VIEW,
            controller: WORKORDER.ECO_REQUEST_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      }).state(WORKORDER.DFM_REQUEST_MAIN_STATE, {
        url: WORKORDER.DFM_REQUEST_MAIN_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.DFM_REQUEST_MAIN_VIEW,
            controller: WORKORDER.DFM_REQUEST_MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      })
      // base route created for internal tabs
      .state(WORKORDER.DFM_REQUEST_STATE, {
        url: WORKORDER.DFM_REQUEST_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.ECO_REQUEST_VIEW,
            controller: WORKORDER.ECO_REQUEST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(WORKORDER.DFM_REQUEST_DETAIL_STATE, {
        url: WORKORDER.DFM_REQUEST_DETAIL_ROUTE,
        params: {
          requestType: 'dfmrequest',
          tabName: 'detail'
        },
        views: {
          'detail': {
            templateUrl: WORKORDER.ECO_REQUEST_VIEW,
            controller: WORKORDER.ECO_REQUEST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      }).state(WORKORDER.DFM_REQUEST_DEPARTMENT_APPROVAL_STATE, {
        url: WORKORDER.DFM_REQUEST_DEPARTMENT_APPROVAL_ROUTE,
        params: {
          requestType: 'dfmrequest',
          tabName: 'departmentapproval'
        },
        views: {
          'departmentapproval': {
            templateUrl: WORKORDER.DFM_REQUEST_DEPARTMENT_APPROVAL_VIEW,
            controller: WORKORDER.DFM_REQUEST_DEPARTMENT_APPROVAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      }).state(WORKORDER.DFM_REQUEST_DOCUMENT_STATE, {
        url: WORKORDER.DFM_REQUEST_DOCUMENT_ROUTE,
        params: {
          requestType: 'dfmrequest',
          tabName: 'document'
        },
        views: {
          'document': {
            templateUrl: WORKORDER.DFM_REQUEST_DOCUMENT_VIEW,
            controller: WORKORDER.DFM_REQUEST_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        },
      }).state(WORKORDER.WO_DATAENTRY_CHANGE_AUDITLOG_LIST_STATE, {
        url: WORKORDER.WO_DATAENTRY_CHANGE_AUDITLOG_LIST_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.WO_DATAENTRY_CHANGE_AUDITLOG_LIST_VIEW,
            controller: WORKORDER.WO_DATAENTRY_CHANGE_AUDITLOG_LIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(WORKORDER.WO_MANUAL_ENTRY_LIST_STATE, {
        url: WORKORDER.WO_MANUAL_ENTRY_LIST_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.WO_MANUAL_ENTRY_LIST_VIEW,
            controller: WORKORDER.WO_MANUAL_ENTRY_LIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(WORKORDER.WO_MANAGE_MANUAL_ENTRY_STATE, {
        url: WORKORDER.WO_MANAGE_MANUAL_ENTRY_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.WO_MANAGE_MANUAL_ENTRY_VIEW,
            controller: WORKORDER.WO_MANAGE_MANUAL_ENTRY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(WORKORDER.WORKORDER_PROFILE_STATE, {
        url: WORKORDER.WORKORDER_PROFILE_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.WORKORDER_PROFILE_VIEW,
            controller: WORKORDER.WORKORDER_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(WORKORDER.WORKORDER_PENDINGWOCREATIONLIST_STATE, { //Pending WO Creation List
        url: WORKORDER.WORKORDER_PENDINGWOCREATIONLIST_ROUTE,
        views: {
          'content@app': {
            templateUrl: WORKORDER.WORKORDER_PENDINGWOCREATIONLIST_VIEW,
            controller: WORKORDER.WORKORDER_PENDINGWOCREATIONLIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      ;
  }

})();
