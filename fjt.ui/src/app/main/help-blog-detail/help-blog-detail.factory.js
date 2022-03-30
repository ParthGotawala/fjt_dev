(function () {
    'use strict';

    angular
        .module('app.helpblogdetail')
        .factory('HelpBlogDetailFactory', HelpBlogDetailFactory);

    /** @ngInject */
    function HelpBlogDetailFactory($resource, CORE) {
      return {
        getHelpBlogDetailByPageId: () => $resource(CORE.API_URL + 'helpBlog/getHelpBlogDetailByPageId/:pageID', {
          pageID: '@_pageID'
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        })
      };
    }
})();
