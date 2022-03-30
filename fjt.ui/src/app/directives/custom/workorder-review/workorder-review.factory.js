(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('WorkorderReviewFactory', WorkorderReviewFactory);

  /** @ngInject */
  function WorkorderReviewFactory($resource, CORE) {
    return {
      getWORevReqForReviewList: () => $resource(CORE.API_URL + 'workorder_request_for_review/getWORevReqForReviewList/:woID/:empID', {
        woID: '@_woID',
        empID: '@_empID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getWORequestForReviewByID: () => $resource(CORE.API_URL + 'workorder_request_for_review/:woRevReqID', {
        woRevReqID: '@_woRevReqID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getWorkorderRevReqComments: () => $resource(CORE.API_URL + 'workorder_reqrev_comments/getWorkorderRevReqComments', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getReqRevInvitedEmpList: () => $resource(CORE.API_URL + 'workorder_ReqRev_Invited_Emp/getReqRevInvitedEmpList/:woRevReqID', {
        woRevReqID: '@_woRevReqID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveWorkorderRevReqComments: () => $resource(CORE.API_URL + 'workorder_reqrev_comments/saveWorkorderRevReqComments', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      setWORevReqCommentStatus: () => $resource(CORE.API_URL + 'workorder_reqrev_comments/setWORevReqCommentStatus', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      setWORevReqStatus: () => $resource(CORE.API_URL + 'workorder_request_for_review/setWORevReqStatus', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getRequestForReviewBywoID: () => $resource(CORE.API_URL + 'workorder_request_for_review/getRequestForReviewBywoID', {

      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getInitialDraftWOReviewReq: () => $resource(CORE.API_URL + 'workorder_request_for_review/getInitialDraftWOReviewReq', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
    }
  }

})();
