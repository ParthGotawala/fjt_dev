(function () {
    'use strict';

    angular
        .module('app.admin.component')
        .factory('CommentFactory', CommentFactory);

    function CommentFactory($resource, CORE) {
      return {
        retrieveComments: () => $resource(CORE.API_URL + 'comments/retrieveComments', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        getCommentByID: () => $resource(CORE.API_URL + 'comments/getCommentByID', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        checkCommentUnique: () => $resource(CORE.API_URL + 'comments/checkCommentUnique', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        }),
        saveComment: () => $resource(CORE.API_URL + 'comments/saveComment', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        deleteComment: () => $resource(CORE.API_URL + 'comments/deleteComment', {}, {
          query: {
            method: 'POST',
            isArray: false
          }
        })
      };
    }
})();
