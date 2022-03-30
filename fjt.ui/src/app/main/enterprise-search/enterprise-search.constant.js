(function () {
  'use strict';
  /** @ngInject */
  var ENTERPRISE_SEARCH = {
    ENTERPRISE_SEARCH_LABEL: 'Enterprise Search',
    ENTERPRISE_SEARCH_ROUTE: '/enterprisesearch/:searchText',
    ENTERPRISE_SEARCH_STATE: 'app.enterprisesearch',
    ENTERPRISE_SEARCH_CONTROLLER: 'EnterpriseSearchController',
    ENTERPRISE_SEARCH_VIEW: 'app/main/enterprise-search/enterprise-search.html',

    ENTERPRISE_ADVANCE_SEARCH_POPUP_CONTROLLER: 'EnterpriseAdvanceSearchPopupController',
    ENTERPRISE_ADVANCE_SEARCH_POPUP_VIEW: 'app/core/component/enterprise-advance-search-popup/enterprise-advance-search-poup.html',

    NewarkMessage: 'No Result Found',

    SEARCH_RESULT: {
      IMAGEURL: 'assets/images/emptystate/workorder.png',
      MESSAGE: 'No record found!'
    }
  };
  angular
    .module('app.enterprisesearch')
    .constant('ENTERPRISE_SEARCH', ENTERPRISE_SEARCH);
})();
