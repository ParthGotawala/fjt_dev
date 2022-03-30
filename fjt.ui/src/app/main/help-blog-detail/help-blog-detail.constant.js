(function () {
  'use strict';
  /** @ngInject */
  var HELP_BLOG_DETAIL = {
    HELPBLOGDETAIL_ROUTE: '/helpblogdetail/:pageID',
    HELPBLOGDETAIL_STATE: 'app.helpblog.helpblogdetail',
    HELPBLOGDETAIL_CONTROLLER: 'HelpBlogDetailController',
    HELPBLOGDETAIL_VIEW: 'app/main/help-blog-detail/help-blog-detail.html'
  };
  angular
    .module('app.helpblogdetail')
    .constant('HELP_BLOG_DETAIL', HELP_BLOG_DETAIL);
})();
