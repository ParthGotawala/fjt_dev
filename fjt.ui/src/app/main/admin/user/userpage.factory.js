(function () {
  'use strict';

  angular
    .module('app.admin.user')
    .factory('UserPagePermisionFactory', UserPagePermisionFactory);

  /** @ngInject */
  function UserPagePermisionFactory($resource, CORE) {
    return {
      userPagePermision: () => $resource(CORE.API_URL + 'userPagePermision/:id', {
        user: '@_user'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      userMenus: () => $resource(CORE.API_URL + 'userPagePermision/getMenuPage/:id/:roleId', {
        user: '@_user'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),
      getShortcutList: () => $resource(CORE.API_URL + 'userPagePermision/getShortcutList/:id/:roleId', {
        user: '@_user'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      isPageAccess: () => $resource(CORE.API_URL + 'userPagePermision/isPageAccess', {
        obj: '@_obj'
      }, {
        update: {
          method: 'POST',
          isArray: false
        }
      }),
      logout: () => $resource(CORE.API_URL + 'logout', {
        obj: '@_obj'
      }, {
        update: {
          method: 'POST',
          isArray: false
        }
      }),
      helpBlogDetailByKeyword: () => $resource(CORE.API_URL + 'helpBlog/helpBlogDetailByKeyword', {},
        {
          query: {
            method: 'GET',
            isArray: false
          }
        }),
      getHomePageMenu: () => $resource(CORE.API_URL + 'userPagePermision/getHomePageMenu', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getHomeMenuCategory: () => $resource(CORE.API_URL + 'userPagePermision/getHomeMenuCategory', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      createMenuDisplayOrder: () => $resource(CORE.API_URL + 'userPagePermision/createMenuDisplayOrder', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      getHomeMenuListOrderWise: () => $resource(CORE.API_URL + 'userPagePermision/getHomeMenuListOrderWise', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      createUserPageDtailsDisplayOrder: () => $resource(CORE.API_URL + 'userPagePermision/createUserPageDtailsDisplayOrder', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      createGenericCategoryDisplayOrder: () => $resource(CORE.API_URL + 'userPagePermision/createGenericCategoryDisplayOrder', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      DeleteHomeMenuItems: () => $resource(CORE.API_URL + 'userPagePermision/deleteHomeMenuItem', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      CheckIsExistsHomeCategoryMenuItem: () => $resource(CORE.API_URL + 'userPagePermision/CheckIsExistsHomeCategoryMenuItem', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      updateBookmarkDisplayOrder: () => $resource(CORE.API_URL + 'userPagePermision/updateBookmarkDisplayOrder', {},
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      checkAutoLogout: () => $resource(CORE.IDENTITY_URL + 'api/Authentication/CheckAutoLogout', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      })
    };
    return;
  }
})();
