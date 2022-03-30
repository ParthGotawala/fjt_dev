(function () {
  'use strict';

  angular
    .module('app.configuration.helpblog')
    .factory('HelpBlogFactory', HelpBlogFactory);

  /** @ngInject */
  function HelpBlogFactory($resource, CORE, $http) {
    return {
      blog: () => $resource(CORE.API_URL + 'helpBlog/saveBlog', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      checkUniqueHelpBlog: () => $resource(CORE.API_URL + 'helpBlog/checkUniqueHelpBlog', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      checkUniqueHelpBlogTitle: () => $resource(CORE.API_URL + 'helpBlog/checkUniqueHelpBlogTitle', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      /* User Story 30275: Help Blog: Improvement Points Suggested By JV - Charmi Patel */
      getHelpBlogDetailList: () => $resource(CORE.API_URL + 'helpBlog/getHelpBlogDetailList', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getHelpBlogHistory: () => $resource(CORE.API_URL + 'helpBlog/getHelpBlogHistory', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getHelpBlogNotesById: () => $resource(CORE.API_URL + 'helpBlog/getHelpBlogNotesById/:Id', { Id: '@_Id' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      saveHelpBlogNotes: () => $resource(CORE.API_URL + 'helpBlog/saveHelpBlogNotes', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      deleteHelpBlogNotes: () => $resource(CORE.API_URL + 'helpBlog/deleteHelpBlogNotes', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getHelpBlogDetailById: () => $resource(CORE.API_URL + 'helpBlog/getHelpBlogDetailById/:id', { id: '@_id' },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      updateBulkDisplayOrder: () => $resource(CORE.API_URL + 'helpBlog/updateBulkDisplayOrder', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getHelpBlogTemplateDetails: (obj) => $http.post(CORE.API_URL + 'helpBlog/getHelpBlogTemplateDetails', obj,
          { responseType: 'arraybuffer' }).then((response) => response, (error) => error)
    };
  }
})();
