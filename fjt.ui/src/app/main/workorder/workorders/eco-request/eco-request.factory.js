(function () {
  'use strict';

  angular
    .module('app.admin.eco')
    .factory('ECORequestFactory', ECORequestFactory);

  /** @ngInject */
  function ECORequestFactory($resource, CORE) {
    return {
      getECOCategoryWithValues: () => $resource(CORE.API_URL + 'ecocategory/retrieveECOCategoryWithValues',
        { category: '@_category' }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveECORequest: () => $resource(CORE.API_URL + 'ecorequest', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getECORequest: () => $resource(CORE.API_URL + 'ecorequest/:ecoReqID', {
        ecoReqID: '@_ecoReqID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      retriveECORequestsList: () => $resource(CORE.API_URL + 'ecorequest/retriveECORequestsList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteECORequest: () => $resource(CORE.API_URL + 'ecorequest/:ecoReqID', {
        ecoReqID: '@_ecoReqID'
      }, {
        query: {
          isArray: false,
          method: 'DELETE'
        }
      }),
      getECORequestDeptApproval: () => $resource(CORE.API_URL + 'ecorequestdeptapproval/:ecoReqID', {
        ecoReqID: '@_ecoReqID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveECORequestDeptApproval: () => $resource(CORE.API_URL + 'ecorequestdeptapproval', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteECORequestDeptApproval: () => $resource(CORE.API_URL + 'ecorequestdeptapproval/:ecoDeptApprovalID', {
        ecoDeptApprovalID: '@_ecoDeptApprovalID'
      }, {
        query: {
          isArray: false,
          method: 'DELETE'
        }
      }),
      ackECODepartmentApproval: () => $resource(CORE.API_URL + 'ecorequestdeptapproval/ackECODepartmentApproval', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getImplementToWorkorderList: () => $resource(CORE.API_URL + 'ecorequest/getImplementToWorkorderList', {
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      generateDFMNumber: () => $resource(CORE.API_URL + 'ecorequest/generateDFMNumber', {

      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getECOHeaderDetail: () => $resource(CORE.API_URL + 'ecorequest/getECOHeaderDetail/:partID/:requestType', {
        partID: '@_partID',
        requestType: '@_requestType'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),

      getAllECODFMRequestNumber: () => $resource(CORE.API_URL + 'ecorequest/getAllECODFMRequestNumber', {

      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      })
    };
  }
})();
