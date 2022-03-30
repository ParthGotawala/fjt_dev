(function () {
  'use strict';

  angular
    .module('app.toolbar')
    .controller('ToolbarController', ToolbarController);

  /** @ngInject */
  function ToolbarController($scope, $rootScope, $q, $state, $timeout, $mdSidenav, store,
    msNavigationService, BaseService, UserPagePermisionFactory, EmployeeFactory, $mdMenu, $window,
    HELP_BLOG_DETAIL, CORE, USER, DialogFactory, PanelFactory, hotkeys, $mdDialog, Idle, RoleFactory, UserFactory, socketConnectionService, RolePagePermisionFactory, DASHBOARD, ReceivingMaterialFactory, WarehouseBinFactory, TRANSACTION, BinFactory, ReleaseNoteFactory, ComponentFactory, CHAT) {
    $scope.closeModals = function () {
      if ($scope.timedout) {
        $mdDialog.hide('', { closeAll: true });
        $scope.timedout = null;
      }
    };
    $scope.inovaxeStatus = CORE.InovaxeStatus;
    /* made logout when timeout state and do refresh*/
    const loginData = getLocalStorageValue('loginuser');
    //let loginData = localStorage.getItem('loginuser');
    if (loginData && loginData["userTimeout"]) {
      // console.log('userTimeout');
      /* only for debug purpose - [S]*/
      let tractActivityLog = getLocalStorageValue('tractActivityLog');
      if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
        tractActivityLog = [];
      }
      const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from toolbaruserTimeout' };
      tractActivityLog.push(obj);
      setLocalStorageValue('tractActivityLog', tractActivityLog);
      /* [E]*/
      BaseService.logout();
      return;
    }

    const idleStart = $scope.$on('IdleStart', function () {
      // the user appears to have gone idle
    });

    const idleWarn = $scope.$on('IdleWarn', function (e, countdown) {
      // follows after the IdleStart event, but includes a countdown until the user is considered timed out
      // the countdown arg is the number of seconds remaining until then.
      // you can change the title or display a warning dialog from here.
      // you can let them resume their session by calling Idle.watch()
    });

    const idleTimeout = $scope.$on('IdleTimeout', function () {
      // the user has timed out (meaning idleDuration + timeout has passed without any activity)
      // this is where you'd log them
      let loginData = getLocalStorageValue('loginuser');
      loginData["userTimeout"] = true;
      if (loginData.onlineStatus && loginData.onlineStatus !== CHAT.USER_STATUS.DONOTDISTURB && loginData.onlineStatus !== CHAT.USER_STATUS.OFFLINE) {
        loginData['onlineStatus'] = CHAT.USER_STATUS.AWAY;
      }
      /* only for debug purpose - [S]*/
      const tractActivityLog = getLocalStorageValue('tractActivityLog');
      if (tractActivityLog && Array.isArray(tractActivityLog)) {
        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set Loginuser: IdleTimeout.' };
        tractActivityLog.push(obj);
        setLocalStorageValue('tractActivityLog', tractActivityLog);
      }
      /* [E]*/
      BaseService.setLoginUser(loginData, null);

      let event = angular.element.Event('click');
      angular.element('body').trigger(event);
      $scope.timedout = PanelFactory.panelService(CORE.TIMEDOUT_MODAL_CONTROLLER, CORE.TIMEDOUT_MODAL_VIEW, event).then(() => {
      }, (validUser) => {
        if (validUser) {
          let loginData = getLocalStorageValue('loginuser');
          loginData["userTimeout"] = false;
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set Loginuser: close IdleTimeout.' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          BaseService.setLoginUser(loginData, null);
          Idle.watch();
        }
      }, (err) => {
        return BaseService.getErrorLog(err);
      });
    });

    const idleEnd = $scope.$on('IdleEnd', function () {
      // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog

      /* while time-out and move to other screen directly from URL - so logout needed*/
      $timeout(() => {
        let loginData = getLocalStorageValue('loginuser');
        if (loginData["userTimeout"]) {
          $scope.closeModals();
          // console.log('IdleEnd');
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from toolbarIdleEnd' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          BaseService.logout();
          return;
        }
      }, 0);
    });

    const keepalive = $scope.$on('Keepalive', function () {
      // do something to keep the user's session alive
    });

    const vm = this;
    vm.partSearchList = [];
    let PermisonList = [];
    vm.ShortCutMenuVisible = false;
    vm.loginUser = BaseService.loginUser;
    vm.helpBlogState = HELP_BLOG_DETAIL.HELPBLOGDETAIL_STATE;
    vm.userProfileState = CORE.USER_PROFILE_STATE;
    vm.employeeTimelineState = USER.ADMIN_EMPLOYEE_TIMELINE_STATE;
    vm.debounceConstant = CORE.Debounce;
    vm.labelConstant = CORE.LabelConstant.SHOW_USER_STATUS;
    vm.ScanOREnterUMID = CORE.LabelConstant.ScanOREnter.ScanUMID;
    vm.MFGConstant = CORE.LabelConstant.MFG;
    vm.MFG_TYPE = CORE.MFG_TYPE;
    vm.mfgType = vm.MFG_TYPE.MFG;
    vm.HBPageTooltip = '';
    vm.showUMIDList = false;
    vm.hasInvalidUMIDScan = false;
    vm.invalidUMIDScanMsg = '';
    //add company profile
    vm.companyProfileState = CORE.COMPANY_PROFILE_STATE;
    vm.releaseNoteState = USER.ADMIN_RELEASE_NOTES_STATE;
    vm.ENTERPRISE_ADVANCE_SEARCH_FORMULA_TOOLTIP = CORE.ENTERPRISE_ADVANCE_SEARCH_FORMULA_TOOLTIP;
    vm.statusurl = WebsiteBaseUrl + '/status-service/service-status.html';
    vm.getLatestReleaseVersion = () => {
      vm.currentReleaseDetails = ReleaseNoteFactory.getLatestReleaseVersion().query().$promise.then((res) => {
        if (res && res.data) {
          vm.currentReleaseVersion = res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getLatestReleaseVersion();

    vm.offlinesmartcarts = 0;

    vm.popup = {
      logout_user: false
    };
    // Data
    $rootScope.global = {
      search: ''
    };
    let Menus = [];
    vm.bodyEl = angular.element('body');
    vm.userStatusOptions = [
      {
        'title': 'Online',
        'icon': 'icon-checkbox-marked-circle green-fg',
        'color': '#4CAF50',
        'status': CHAT.USER_STATUS.ONLINE
      },
      {
        'title': 'Away',
        'icon': 'icon-clock orange-500-fg',
        'color': '#FFC107',
        'status': CHAT.USER_STATUS.AWAY
      },
      {
        'title': 'Do not Disturb',
        'icon': 'icon-minus-circle red-fg',
        'color': '#F44336',
        'status': CHAT.USER_STATUS.DONOTDISTURB
      },
      {
        // need to Confirm why below code is added? as it is not used anywhere.
        'title': 'Invisible',
        'icon': 'icon-checkbox-blank-circle-outline green-fg',
        'color': '#BDBDBD',
        'status': 'I'
      },
      {
        'title': 'Offline',
        'icon': 'icon-checkbox-blank-circle-outline green-fg',
        'color': '#616161',
        'status': CHAT.USER_STATUS.OFFLINE
      }
    ];

    vm.languages = {
      en: {
        'title': 'English',
        'translation': 'TOOLBAR.ENGLISH',
        'code': 'en',
        'flag': 'us',
        'href': '#googtrans(en|en)',
        'cookieVal': ''
      },
      es: {
        'title': 'Spanish',
        'translation': 'TOOLBAR.SPANISH',
        'code': 'es',
        'flag': 'es',
        'href': '#googtrans(en|es)',
        'cookieVal': '/es/es'
      }
      //tr: {
      //    'title'      : 'Turkish',
      //    'translation': 'TOOLBAR.TURKISH',
      //    'code'       : 'tr',
      //    'flag'       : 'tr'
      //}
    };

    // Methods
    vm.toggleSidenav = toggleSidenav;
    vm.logout = logout;
    vm.changeLanguage = changeLanguage;
    vm.setUserStatus = setUserStatus;
    vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
    vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
    vm.search = search;
    vm.searchResultClick = searchResultClick;
    vm.changePassword = changePassword;
    vm.viewTimeLine = viewTimeLine;
    vm.myProfile = myProfile;

    //////////

    init();

    /**
     * Initialize
     */
    function init() {
      // Select the first status as a default
      vm.userStatus = BaseService.loginUser ? _.find(vm.userStatusOptions, (item) => item.status === BaseService.loginUser.onlineStatus) : vm.userStatusOptions[0];

      // Get the selected language directly from angular-translate module setting
      //vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
      let langVal = BaseService.getCurrentLangauge();
      langVal = langVal ? langVal : 'en';
      vm.selectedLanguage = vm.languages[langVal];
      //angular.element(document).ready(() => {
      //    $timeout(() => {
      //        googleTranslateElementInit();
      //    }, 0);
      //});
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId) {
      $mdSidenav(sidenavId).toggle();
    }

    /**
     * Sets User Status
     * @param status
     */
    function setUserStatus(status) {
      vm.userStatus = status;
    }


    /**
     * Logout Function
     */
    function logout() {
      vm.popup.logout_user = true;
      /* only for debug purpose - [S]*/
      const tractActivityLog = getLocalStorageValue('tractActivityLog');
      if (tractActivityLog && Array.isArray(tractActivityLog)) {
        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'ogout from toolbarlogoutWithOperationConfirmation' };
        tractActivityLog.push(obj);
        setLocalStorageValue('tractActivityLog', tractActivityLog);
      }
      /* [E]*/
      BaseService.logoutWithOperationConfirmation(vm);
    }

    /**
     * Change Language
     */
    function changeLanguage(lang) {
      vm.selectedLanguage = lang;

      /**
       * Show temporary message if user selects a language other than English
       *
       * angular-translate module will try to load language specific json files
       * as soon as you change the language. And because we don't have them, there
       * will be a lot of errors in the page potentially breaking couple functions
       * of the template.
       *
       * To prevent that from happening, we added a simple "return;" statement at the
       * end of this if block. If you have all the translation files, remove this if
       * block and the translations should work without any problems.
       */
      //if (lang.code !== 'en') {
      //    var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through Theme Forest profile page.';

      //    $mdToast.show({
      //        template: '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
      //        hideDelay: 7000,
      //        position: 'top right',
      //        parent: '#content'
      //    });

      //    return;
      //}

      //// Change the language
      //$translate.use(lang.code);
      //window.location = lang.href;
      //$window.location.href = $location.path() + "/" + lang.href;
      BaseService.setCurrentLangauge(lang.code, lang.cookieVal);
      location.reload();
    }
    /**
     * Toggle horizontal mobile menu
     */
    function toggleHorizontalMobileMenu() {
      vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
    }

    /**
     * Toggle msNavigation folded
     */
    function toggleMsNavigationFolded() {
      msNavigationService.toggleFolded();
    }

    /**
     * Search action
     *
     * @param query
     * @returns {Promise}
     */
    function search(query) {
      // If there is a query, filter the navigation;
      // otherwise we will return the entire navigation
      // list. Not exactly a good thing to do but it's
      // for demo purposes.
      if (query) {
        const promises = [getNavigationDetails(query), getHelpBlogDetails(query)];
        return $q.all(promises).then((responses) => {
          var resultList = [];
          var getNavigationDetailsResp = responses[0];
          var getHelpBlogDetailsResp = responses[1];

          if (getNavigationDetailsResp && getNavigationDetailsResp.length) {
            resultList.push({
              id: -1,
              title: 'Page'
            });
            resultList = resultList.concat(getNavigationDetailsResp);
          }
          if (getHelpBlogDetailsResp && getHelpBlogDetailsResp.length) {
            resultList.push({
              id: -1,
              title: 'Help Page'
            });
            resultList = resultList.concat(getHelpBlogDetailsResp);
          }
          return resultList;
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return [];
        });
      }
    }

    function getNavigationDetails(query) {
      var navigation = [],
        flatNavigation = msNavigationService.getFlatNavigation(),
        deferred = $q.defer();

      // Iterate through the navigation array and
      // make sure it doesn't have any groups or
      // none ui-sref items
      for (let x = 0; x < flatNavigation.length; x++) {
        if (flatNavigation[x].uisref) {
          navigation.push(flatNavigation[x]);
        }
      }
      if ((_.includes(query, ['\\',])) || (_.includes(query, '*')) ||
        (_.includes(query, '(')) || (_.includes(query, ')')) || (_.includes(query, '+')) ||
        (_.includes(query, '?')) || (_.includes(query, '[')) || (_.includes(query, ']'))) {
        return false;
      }
      navigation = navigation.filter((item) => {
        if (angular.lowercase(item.title).search(angular.lowercase(query)) > -1) {
          return true;
        }
      });

      // Fake service delay
      $timeout(() => {
        deferred.resolve(navigation);
      }, _configTimeout);

      return deferred.promise;
    }

    function getHelpBlogDetails(query) {
      return UserPagePermisionFactory.helpBlogDetailByKeyword().query({ query }).$promise.then((response) => {
        if (response && response.data) {
          let titleList = response.data.map((item) => {
            return {
              title: item.helpBlog.pageDetail ? item.helpBlog.pageDetail.menuName : "",
              pageID: item.helpBlog.pageID,
              pageTitle: ` | ${item.helpBlog.title}`
            };
          });

          titleList = _.uniqBy(titleList, 'pageTitle');
          return titleList;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return;
      });
    }

    /**
     * Search result click action
     *
     * @param item
     */
    function searchResultClick(item) {
      // If item has a link
      if (item) {
        if (item.uisref) {
          // If there are state params,
          // use them...
          if (item.stateParams) {
            BaseService.openInNew(item.state, item.stateParams);
          }
          else {
            BaseService.openInNew(item.state);
          }
        }
        else if (item.pageID) {
          BaseService.openInNew(vm.helpBlogState, { pageID: item.pageID });
        }
      }
    }

    //// Check Employee has any Active operation or not
    //let isactiveTransEmployee = () => {

    //  return EmployeeFactory.isactiveTrans_Employee().query({ id: vm.loginUser.employee.id }).$promise.then((employeeActiveTrans) => {
    //    return $q.resolve(employeeActiveTrans);
    //  }).catch((error) => {
    //    //console.log(error);
    //    return BaseService.getErrorLog(error);
    //  });
    //}

    // redirect user after set "loginuser" in login user
    const redirectUserAfterSetFeatureRights = () => {
      let pageRightsAvailable = false;
      if ($state.params && $state.params.pageRoute) {
        pageRightsAvailable = _.some(BaseService.loginUserPageList, (item) => item && item.PageDetails && item.PageDetails.pageRoute === $state.params.pageRoute);
        if (pageRightsAvailable) {
          $state.go($state.params.pageRoute, {}, {});
        }
      }
      $rootScope.$broadcast('UpdateFeatureRights', BaseService.loginUserPageList);
    };

    const checkParentMenuWithHasChild = (parentID) => {
      let addMenuParents;
      // start activity main menu items where has childs are true and only consider as menu
      const findParentMenuWithHasChild = _.find(menuPageDetail, (pages) => {
        return pages.pageID == parentID;
      });
      if (findParentMenuWithHasChild) {
        if (findParentMenuWithHasChild.parentPageID) {
          msNavigationService.saveItem(findParentMenuWithHasChild.menuRoute, {
            title: findParentMenuWithHasChild.menuName,
            icon: findParentMenuWithHasChild.iconClass,
            weight: findParentMenuWithHasChild.orderBy,
            hasShortcut: false,
            isPopup: findParentMenuWithHasChild.isPopup,
            popupFunName: findParentMenuWithHasChild.popupFunName,
            isHideFromMenuList: findParentMenuWithHasChild.isHideFromMenuList,
            paramDet: findParentMenuWithHasChild.paramDet
          });
          addMenuParents = checkParentMenuWithHasChild(findParentMenuWithHasChild.parentPageID);
        } else {
          msNavigationService.saveItem(findParentMenuWithHasChild.menuRoute, {
            title: findParentMenuWithHasChild.menuName,
            icon: findParentMenuWithHasChild.iconClass,
            weight: findParentMenuWithHasChild.orderBy,
            hasShortcut: false,
            isPopup: findParentMenuWithHasChild.isPopup,
            popupFunName: findParentMenuWithHasChild.popupFunName,
            isHideFromMenuList: findParentMenuWithHasChild.isHideFromMenuList,
            paramDet: findParentMenuWithHasChild.paramDet
          });
          return false;
        }
        return !findParentMenuWithHasChild ? true : false;
      }
      return addMenuParents;
    };

    //check parent menu exist or not
    const checkParentMenu = (parentID) => {
      let result;
      let invalidChildItem = false;
      //if parent Page found than check for parent of parent is added or not
      const hasParentPage = _.find(Menus, (y) => {
        return y.PageID == parentID;
      });
      if (hasParentPage && hasParentPage.PageDetails.parentPageID) {
        result = checkParentMenu(hasParentPage.PageDetails.parentPageID);
      }
      else {
        // chec menu with has childs has more parent than check recursively else add in menu manually instead of db data
        invalidChildItem = checkParentMenuWithHasChild(parentID);
        if (!invalidChildItem) {
          const findParentMenuWithHasChild = _.find(menuPageDetail, (pages) => {
            return pages.pageID == parentID;
          });
          if (findParentMenuWithHasChild && findParentMenuWithHasChild.menuRoute) {
            msNavigationService.saveItem(findParentMenuWithHasChild.menuRoute, {
              title: findParentMenuWithHasChild.menuName,
              icon: findParentMenuWithHasChild.iconClass,
              weight: findParentMenuWithHasChild.orderBy,
              hasShortcut: false,
              isPopup: findParentMenuWithHasChild.isPopup,
              popupFunName: findParentMenuWithHasChild.popupFunName,
              isHideFromMenuList: findParentMenuWithHasChild.isHideFromMenuList,
              paramDet: findParentMenuWithHasChild.paramDet
            });
          }
          return false;
        }
      }
      return result;
    };

    let menuPageDetail;
    //Bind assigned menu into msNavigation save item
    const bindMenu = (pages) => {
      let userDetail = pages[0];
      menuPageDetail = pages[1];

      //$rootScope.userRightPages = userDetail;

      if (userDetail && userDetail.length > 0) {
        vm.isProfilePage = _.find(userDetail, (data) => { return data.PageDetails && data.PageDetails.pageName == 'User Profile' });
        vm.isTimelinePage = _.find(userDetail, (data) => { return data.PageDetails && data.PageDetails.pageName == 'Employee Timeline' });
      }

      //let mainMenu = [];
      Menus = angular.copy(userDetail);

      msNavigationService.clearNavigation();
      // Remove permision list which have null page details
      userDetail = _.remove(userDetail, (y) => {
        return y.PageDetails;
      });

      // copy all login user menu in list of toolbarto fetc page title and all details
      BaseService.loginUserPageList = [];
      BaseService.loginUserPageList = angular.copy(Menus);
      $timeout(() => {
        $rootScope.$broadcast(USER.LoginUserPageListBroadcast, BaseService.loginUserPageList);
      });
      // copy all login user menu in list of toolbarto fetc page title and all details

      _.each(userDetail, (item) => {
        let invalidItem = false;
        //check parent page for child menu
        if (item.PageDetails && item.PageDetails.parentPageID) {
          invalidItem = checkParentMenu(item.PageDetails.parentPageID);
        }
        if (!invalidItem) {
          if (item.PageDetails && item.PageDetails.menuRoute) {
            if (item.PageDetails.pageRoute) {
              msNavigationService.saveItem(item.PageDetails.menuRoute, {
                title: item.PageDetails.menuName,
                icon: item.PageDetails.iconClass,
                weight: item.PageDetails.orderBy,
                state: item.PageDetails.pageRoute,
                hasShortcut: item.isShortcut,
                isPopup: item.PageDetails.isPopup,
                popupFunName: item.PageDetails.popupFunName,
                isHideFromMenuList: item.PageDetails.isHideFromMenuList,
                paramDet: item.PageDetails.paramDet
              });
            } else {
              msNavigationService.saveItem(item.PageDetails.menuRoute, {
                title: item.PageDetails.menuName,
                icon: item.PageDetails.iconClass,
                weight: item.PageDetails.orderBy,
                hasShortcut: item.isShortcut,
                isPopup: item.PageDetails.isPopup,
                popupFunName: item.PageDetails.popupFunName,
                isHideFromMenuList: item.PageDetails.isHideFromMenuList,
                paramDet: item.PageDetails.paramDet
              });
            }
          }
        }
      });

      $rootScope.$broadcast('getPageTitleAfterReload', $state.current);
      $timeout(() => {
        $rootScope.$broadcast('getBreadcrumbAfterReload');
      }, 0);
      msNavigationService.sort();
      vm.ShortCutMenuVisible = true;
    };

    //Get user assigned menu list
    vm.getUserdetail = () => {
      if (vm.loginUser && vm.loginUser.defaultLoginRoleID) {
        if (vm.loginUser.permissionList && vm.loginUser.permissionList.length > 0) {
          bindMenu(angular.copy(vm.loginUser.permissionList));
          vm.isShowUserStatus = _.find(BaseService.loginUser.featurePageDetail, (item) => { return item.featureName == CORE.ROLE_ACCESS.SmartCartUser });
          redirectUserAfterSetFeatureRights();
        } else {
          vm.cgBusyLoading = UserPagePermisionFactory.userMenus().query({ id: vm.loginUser.userid, roleId: vm.loginUser.defaultLoginRoleID }).$promise.then((permisionList) => {
            const loginUserDetails = BaseService.loginUser;
            PermisonList = (permisionList && permisionList.data) ? permisionList.data.pageDetailList : null;
            loginUserDetails.permissionList = angular.copy(PermisonList);
            loginUserDetails.featurePageDetail = (permisionList && permisionList.data) ? permisionList.data.featurePageDetail : null;
            bindMenu(PermisonList);
            vm.isShowUserStatus = _.find(loginUserDetails.featurePageDetail, (item) => { return item.featureName == CORE.ROLE_ACCESS.SmartCartUser });
            /* only for debug purpose - [S]*/
            const tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (tractActivityLog && Array.isArray(tractActivityLog)) {
              const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set loginuser: getUserdetail.' };
              tractActivityLog.push(obj);
              setLocalStorageValue('tractActivityLog', tractActivityLog);
            }
            /* [E]*/

            localStorage.setItem('loginuser', JSON.stringify(loginUserDetails));
            //_.each(BaseService.loginUserPageList, (item) => {
            //  if (item && item.PageDetails && $state.params && $state.params.pageRoute && item.PageDetails.pageRoute == $state.params.pageRoute) {
            //    pageRightsAvailable = true;
            //  }
            //});
            redirectUserAfterSetFeatureRights();
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };
    vm.getUserdetail();

    //set default role name
    const setDefaultRoleName = () => {
      const rolename = _.find(roleList, (roledetail) => {
        if (roledetail.roleId == vm.loginUser.defaultLoginRoleID) {
          return roledetail.roleName;
        }
      });
      if (rolename) {
        vm.defaultRoleName = rolename.roleName;
      }
      $rootScope.RoleList = roleList;
    };

    const roleList = [];
    //Get the role by the current user for bind the switch role menu
    const getRoleByUser = () => {
      RoleFactory.getRolesByUser().query({ id: vm.loginUser.userid }).$promise.then((userRole) => {
        if (userRole && userRole.status === CORE.ApiResponseTypeStatus.SUCCESS && userRole.data) {
          _.map(userRole.data, (data) => {
            const roleData = {};
            roleData.userId = data.userId;
            roleData.roleId = data.roleId;
            roleData.roleName = data.role ? data.role.name : null;
            roleList.push(roleData);
          });
          BaseService.loginUser.roles = _.map(userRole.data, (item) => {
            return {
              id: item.roleId,
              name: item.role.name,
              accessLevel: item.role.accessLevel,
              slug: item.role.slug,
              user_roles: {
                RoleId: item.roleId,
                userId: item.userId
              }
            };
          });
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set Loginuser: getRolesByUser.' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          BaseService.setLoginUser(BaseService.loginUser);
          vm.loginUser = BaseService.loginUser;
          setDefaultRoleName();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getRoleByUser();

    let changeRole = false;
    vm.setAsDefaultRole = (role) => {
      if (BaseService.checkAllFormDirtyValidation()) {
        const alertData = {
          cleanForm: true, isLogout: false, params: role, callbackFn: function (role) {
            vm.setAsDefaultRole(role);
          }
        };
        BaseService.showWithoutSavingAlertForPopUp(alertData);
      } else {
        const userDetails = BaseService.loginUser;
        const currentRole = _.find(userDetails.roles, { id: userDetails.defaultLoginRoleID });
        const selectedRole = _.find(userDetails.roles, { id: role.roleId });
        if (currentRole.accessLevel > selectedRole.accessLevel) {
          const objRoleChange = {
            AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
            refID: userDetails.userid,
            refTableName: CORE.TABLE_NAME.USERS,
            isAllowSaveDirect: true,
            popupTitle: CORE.PageName.switchRoleApproval,
            approveFromPage: CORE.PageName.changeRole,
            confirmationType: CORE.Generic_Confirmation_Type.CHANGE_ROLE,
            isOnlyPassword: true,
            transactionType: stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.CHANGE_ROLE, currentRole.name, selectedRole.name),
            createdBy: userDetails.userid,
            updatedBy: userDetails.userid,
            isSwitchRoleApproval: true  // manage flag for identify - password confirmatoin for switch role?
          };
          DialogFactory.dialogService(
            CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
            CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
            null,
            objRoleChange).then((data) => {
              if (data) {
                roleChange(role, userDetails);
              }
            }, () => {
              return;
            }).catch((error) => BaseService.getErrorLog(error));
        } else {
          roleChange(role, userDetails);
        }
      }
    };

    const roleChange = (role, userDetails) => {
      if (role.roleId != userDetails.defaultLoginRoleID) {
        const userObject = {
          id: vm.loginUser.userid,
          defaultLoginRoleID: role.roleId,
          employeeID: vm.loginUser.employee.id
        };

        vm.cgBusyLoading = UserFactory.updateUserByDefaultRole().query({ userObj: userObject }).$promise.then((updateRole) => {
          if (updateRole.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            userDetails.defaultLoginRoleID = role.roleId;
            /* only for debug purpose - [S]*/
            const tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (tractActivityLog && Array.isArray(tractActivityLog)) {
              const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set Loginuser: roleChange.' };
              tractActivityLog.push(obj);
              setLocalStorageValue('tractActivityLog', tractActivityLog);
            }
            /* [E]*/
            BaseService.setLoginUser(userDetails, null);
            $state.go(DASHBOARD.DASHBOARD_STATE);
            changeRole = true;
            $timeout(() => {
              $state.reload();
            }, 0, true);
          };
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //go to smart cart page
    vm.gotoSmartCartWarehouseList = () => {
      BaseService.goToSmartCartWHList();
    };
    //go to unauthorize page
    vm.gotoUnauthorizePage = () => {
      BaseService.goToUnauthorizeRequestList();
    };
    //set pick color by user in db
    vm.pickColor = (item) => {
      if (item) {
        if (item.pickUserID && vm.loginUser.userid != item.pickUserID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.COLOR_PICKED_USER_CONFIRM);
          messageContent.message = stringFormat(messageContent.message, item.ledColorName, item.pickuserName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              setPickColorforUser(item);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (!item.pickUserID) {
          setPickColorforUser(item);
        } else if (item.pickUserID && vm.loginUser.userid == item.pickUserID) {
          setDropColorforUser();
        }
      }
    };
    // call api to pick color for user
    const setPickColorforUser = (item) => {
      var objTrans = {
        TransactionID: item.transactionID,
        id: item.id,
        userID: vm.loginUser.userid,
        userName: vm.loginUser.username,
        ledColorName: item.ledColorName,
        ledColorCssClass: item.ledColorCssClass,
        searchUserName: item.userName
      };
      WarehouseBinFactory.setPickUserDeatil().query(objTrans).$promise.then(() => {
        $rootScope.$broadcast('setTransactionID', { transactionID: item.transactionID, isOpen: false });
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // call api to drop color for user
    const setDropColorforUser = () => {
      var objTrans = {
        TransactionID: null,
        id: null,
        userID: vm.loginUser.userid,
        userName: null,
        ledColorName: null,
        ledColorCssClass: null,
        searchUserName: null
      };
      WarehouseBinFactory.setDropUserDeatil().query(objTrans).$promise.then(() => {
        $rootScope.$broadcast('setTransactionID', { transactionID: null, isOpen: false });
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //get assign color details
    vm.getAssignColors = () => {
      vm.isProgress = true;
      vm.assignColorDetails = [];
      ReceivingMaterialFactory.getAssignColorToUsers().query({ pcartMfr: CORE.InoautoCart }).$promise.then((res) => {
        if (res && res.data) {
          vm.isProgress = false;
          vm.assignColorDetails = res.data.assignColors;
          vm.status = CORE.InovaxeStatus[2].id;
          if (Array.isArray(res.data.serverStatus) && res.data.serverStatus.length) {
            vm.status = res.data.serverStatus[0].values;
          }
          _.each(vm.assignColorDetails, (item) => {
            item.requestMessage = JSON.parse(item.requestMessage);
            if (item.messageType === CORE.InoAuto_Request_Code.CheckinRequest) {
              item.side = item.requestMessage.TowerSide.length === 2 ? (TRANSACTION.Warehouse_Side.B.value) : item.requestMessage.TowerSide[0].Side == TRANSACTION.Warehouse_Side.L.key ? TRANSACTION.Warehouse_Side.R.value : TRANSACTION.Warehouse_Side.L.value
            }
            vm.startTimer(item);
          });
          if (res.data.unauthorize && res.data.unauthorize.length > 0 && res.data.unauthorize[0].unauthorizeCount > 0) {
            vm.assignColorDetails.push(...res.data.unauthorize);
          }
          vm.offlinesmartcarts = (res.data.offlinesmartcarts && res.data.offlinesmartcarts.length > 0) ? res.data.offlinesmartcarts[0].count : 0;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.startTimer = (data) => {
      data.currentTimerDiff = '';
      data.activityStartTime = (parseInt(data.requestMessage.TimeOut) + _configAdditionalTimeout) - data.activityStartTime;
      data.tickActivity = setInterval(() => {
        data.activityStartTime = data.activityStartTime - 1;
        data.currentTimerDiff = secondsToTime(data.activityStartTime, true);
        if (data.activityStartTime === 0) {
          data.activityStartTime = (parseInt(data.requestMessage.TimeOut)) + _configAdditionalTimeout;
          clearInterval(data.tickActivity);
        }
      }, _configSecondTimeout);
    };

    //cancel request
    vm.cancelRequest = (item) => {
      var objTrans = {
        TransactionID: item.transactionID,
        ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
        ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message,
        isRemove: item.activityStartTime < 0 ? true : false
      };
      WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //set profile image of login user.
    function setProfileImage() {
      if (vm.loginUser.employee && vm.loginUser.employee.profileImg != null && vm.loginUser.employee.profileImg !== '') {
        vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.loginUser.employee.profileImg;
      }
      else {
        vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
      }
    }
    setProfileImage();
    function selectedDepartment(item) {
      if (item) {
        BaseService.setDepartmentbyUser(vm.loginUser.employee.id, item);
      }
    }
    const getWarehouseList = () => {
      vm.WarehouseList = [];
      return BinFactory.getAllWarehouse({ isDepartment: true }).query().$promise.then((whlist) => {
        vm.WarehouseList = (whlist && whlist.data) ? whlist.data : null;
        const dept = getLocalStorageValue(vm.loginUser.employee.id);
        if (dept && dept.department && vm.WarehouseList.length > 0) {
          vm.departmentID = dept.department.ID;
        } else {
          vm.departmentID = vm.WarehouseList.length > 0 ? vm.WarehouseList[0].ID : null;
        }
        if (!vm.autoCompleteWarehouse) {
          initAutocomplete();
        }
        return vm.WarehouseList;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getWarehouseList();

    const mdMenuClose = $scope.$on('$mdMenuClose', () => {
      vm.showUMIDList = false;
      vm.autoCompleteSearchPart.keyColumnId = null;
      vm.autoCompleteSearchSupplierPart.keyColumnId = null;
      vm.headerSearchEnterpriseCriteria = null;
      vm.hasInvalidUMIDScan = false;
      vm.searchUMID = null;
      vm.invalidUMIDScanMsg = '';
      $scope.$broadcast(vm.autoCompleteSearchPart.inputName, null);
      $scope.$broadcast(vm.autoCompleteSearchSupplierPart.inputName, null);
    });
    vm.searchPart = () => {
      setFocusOnControl(vm.autoCompleteSearchPart.inputName);
    };
    function setFocusOnControl(controlName) {
      $timeout(() => {
        const element = $window.document.getElementsByName(controlName);
        if (element && element[0]) {
          element[0].focus();
        }
      });
    }

    vm.OpenApplicationStatus = () => {
      window.open(vm.statusurl);
    };
    function initAutocomplete() {
      vm.autoCompleteWarehouse = {
        columnName: 'Name',
        controllerName: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_CONTROLLER,
        viewTemplateURL: TRANSACTION.TRANSACTION_MANAGEWAREHOUSE_VIEW,
        keyColumnName: 'ID',
        keyColumnId: vm.departmentID,
        inputName: 'ParentWarehouse',
        placeholderName: 'Department',
        isRequired: false,
        isAddnew: false,
        onSelectCallbackFn: selectedDepartment,
        callbackFn: getWarehouseList
      };
      /* Search Part */
      vm.autoCompleteSearchPart = {
        columnName: 'displayMfgPN',
        keyColumnName: 'id',
        keyColumnId: null,
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        inputName: 'HeaderSearchPart',
        placeholderName: 'Type here to search part',
        isRequired: false,
        //addData: { mfgType: CORE.MFG_TYPE.MFG },
        isAddnew: true,
        addData: {
          mfgType: vm.MFG_TYPE.MFG,
          closeToolbar: true,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName,
          isReqToRedirNewAddPart: true
        },
        onSelectCallbackFn: (partDetail) => {
          if (partDetail) {
            $mdMenu.hide();
            vm.autoCompleteSearchPart.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteSearchPart.inputName, null);
            if (vm.showUMIDList) {
              BaseService.goToUMIDList(null, null, null, null, partDetail.PIDCode);
            }
            else {
              BaseService.goToComponentDetailTab(vm.MFG_TYPE.MFG, partDetail.id);
            }
          } else {
            vm.autoCompleteSearchPart.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteSearchPart.inputName, null);
            $mdMenu.hide();
          }
        },
        onSearchFn: (query) => {
          vm.autoCompleteSearchPart.searchText = query;
          const searchObj = {
            mfgType: vm.MFG_TYPE.MFG,
            query: query,
            inputName: vm.autoCompleteSearchPart.inputName,
            isGoodPart: null,
            isContainCPN: true
          };
          return getPartSearch(searchObj);
        }
      };
      vm.autoCompleteSearchSupplierPart = {
        columnName: 'displayMfgPN',
        keyColumnName: 'id',
        keyColumnId: null,
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        inputName: 'HeaderSearchSupplierPart',
        placeholderName: 'Type here to search part',
        isRequired: false,
        //addData: { mfgType: CORE.MFG_TYPE.MFG },
        isAddnew: true,
        addData: {
          mfgType: vm.MFG_TYPE.DIST,
          closeToolbar: true,
          popupAccessRoutingState: [USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName,
          isReqToRedirNewAddPart: true
        },
        onSelectCallbackFn: (partDetail) => {
          if (partDetail) {
            $mdMenu.hide();
            vm.autoCompleteSearchSupplierPart.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteSearchSupplierPart.inputName, null);
            if (vm.showUMIDList) {
              BaseService.goToUMIDList(null, null, null, null, partDetail.PIDCode);
            }
            else {
              BaseService.goToComponentDetailTab(vm.MFG_TYPE.DIST, partDetail.id);
            }
          } else {
            vm.autoCompleteSearchSupplierPart.keyColumnId = null;
            $scope.$broadcast(vm.autoCompleteSearchSupplierPart.inputName, null);
            $mdMenu.hide();
          }
        },
        onSearchFn: (query) => {
          vm.autoCompleteSearchSupplierPart.searchText = query;
          const searchObj = {
            mfgType: vm.MFG_TYPE.DIST,
            query: query,
            inputName: vm.autoCompleteSearchPart.inputName,
            isGoodPart: null,
            isContainCPN: true
          };
          return getPartSearch(searchObj, true);
        }
      };
    }
    vm.getComponentVerification = (searchText, mfgType, ev) => {
      const popUpData = {
        popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
        pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
      };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const data = {
          mfgType: mfgType,
          closeToolbar: true,
          isReqToRedirNewAddPart: true,
          autoExternalAPICall: true,
          Name: searchText
        };

        $mdMenu.hide();
        if (mfgType === CORE.MFG_TYPE.DIST) {
          vm.autoCompleteSearchSupplierPart.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteSearchSupplierPart.inputName, null);
        } else {
          vm.autoCompleteSearchPart.keyColumnId = null;
          $scope.$broadcast(vm.autoCompleteSearchPart.inputName, null);
        }

        DialogFactory.dialogService(
          CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          CORE.MANAGE_COMPONENT_MODAL_VIEW,
          ev,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };
    /* add part*/
    vm.goToAddPart = (type) => {
      BaseService.goToComponentDetailTab(type.toLowerCase(), null);
    };
    /* Go to Part Master List */
    vm.goToPartList = (type) => {
      if (vm.MFG_TYPE.MFG === type) {
        BaseService.goToPartList();
      } else {
        BaseService.goToSupplierPartList();
      }
    };

    vm.scanUMID = (e) => {
      $timeout(() => {
        scanUMID(e);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    function scanUMID(e) {
      // if ((e.keyCode === 48 && !form.$touched) || (e.keyCode === 13)) {
      if ((e.keyCode === 13)) {
        if (!vm.searchUMID) {
          return;
        }
        getUMIDDetailByUMID();
      }
    }

    const getUMIDDetailByUMID = () => {
      if (vm.searchUMID) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailByUMID().query({ UMID: vm.searchUMID }).$promise.then((response) => {
          if (response && response.data) {
            const item = response.data;
            if (item) {
              BaseService.goToUMIDDetail(item.id);
              vm.hasInvalidUMIDScan = false;
              vm.searchUMID = null;
            }
          } else {
            vm.hasInvalidUMIDScan = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_UID_NOT_FOUND);
            messageContent.message = stringFormat(messageContent.message, vm.searchUMID);
            vm.invalidUMIDScanMsg = messageContent.message;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* UMID List */
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    function getPartSearch(searchObj) {
      return ComponentFactory.getComponentMFGAliasPIDProdPNSearch().query({ listObj: searchObj }).$promise.then((partList) => {
        if (partList && partList.data && partList.data.data) {
          vm.partSearchList = partList.data.data;
        }
        else {
          vm.partSearchList = [];
        }
        return vm.partSearchList;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const loginuserEvent = $rootScope.$on('loginuser', () => {
      setProfileImage();
    });

    $scope.toggleShortcut = () => {
      if (vm.loginUser.isHelpBlog) {
        if (BaseService.loginUser.isHelpBlog) {
          BaseService.openInNew(vm.helpBlogState, { pageID: vm.loginUser.pageID });
        }
        else {
          //401 unauthorised page redirection
          return $state.go(HELPER_PAGE.UNAUTHORIZED_STATE, { pageRoute: 'app.helpblog.helpblogdetail' });
        }
      } else {
        hotkeys.toggleCheatSheet();
      }
    };


    // hotkeys adeed
    const bindHotKeys = () => {
      hotkeys.bindTo($scope).add({
        combo: CORE.HOT_KEYS.USER_LOGOUT.SHORTCUT_KEY,
        description: CORE.HOT_KEYS.USER_LOGOUT.DESCRIPTION,
        callback: () => {
          if (!vm.popup.logout_user) {
            // console.log('bindHotKeys');
            /* only for debug purpose - [S]*/
            const tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (tractActivityLog && Array.isArray(tractActivityLog)) {
              const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from toolbarbindHotKeys' };
              tractActivityLog.push(obj);
              setLocalStorageValue('tractActivityLog', tractActivityLog);
            }
            /* [E]*/
            vm.logout();
          }
        }
      });
    };
    bindHotKeys();

    /**
  * Change Password Function
  */
    function changePassword(ev) {
      DialogFactory.dialogService(
        CORE.CHANGE_PASSWORD_CONTROLLER,
        CORE.CHANGE_PASSWORD_VIEW,
        ev,
        null).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /**
     * View Timeline
     */
    function viewTimeLine() {
      $state.go(USER.ADMIN_EMPLOYEE_TIMELINE_STATE, { id: vm.loginUser.userid });
    }

    /**
    * my profile Function
    */
    function myProfile() {
      $state.go(CORE.USER_PROFILE_STATE, { id: vm.loginUser.employee.id });
    }

    // Function for get response of send notification of user right permission changes
    const sendNotificationOfRightChanges = () => {
      // if (!getLocalStorageValue('UserRightChange')) {
      showInformationForReLogin();
      // localStorage.setItem('UserRightChange', true);
      // }
    };

    // Function for get response of send notification of user right permission changes
    const sendNotificationOfDefaultRoleChanges = (data) => {
      const userDetails = BaseService.loginUser;
      userDetails.defaultLoginRoleID = data.roleId;
      setDefaultRoleName(roleList);
      // localStorage.setItem('UserRightChange', true);
      // for same login no need to display popup as we are doing hard reload.
      if (!changeRole) {
        showInformationForDefaultRoleReLogin();
      }
      changeRole = false;
    };

    // Function of show information popup for logout after get notification of changes of role-right-permission
    const showInformationForReLogin = () => {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.CHANGE_ASSY_REV_CONFIRMATION_HEADER,
        textContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.CHANGE_PERMISSION_GET_NOTIFICATION.message,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_LOGOUT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
      };
      return DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          vm.popup.logout_user = true;
          BaseService.logoutWithOperationConfirmation(vm);
        }
      }, () => {
        // localStorage.setItem('UserRightChange', false);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Function of show information popup for logout after get notification of changes of role-right-permission
    const showInformationForDefaultRoleReLogin = () => {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.CHANGE_ASSY_REV_CONFIRMATION_HEADER,
        textContent: CORE.MESSAGE_CONSTANT.CHANGE_ROLE_GET_NOTIFICATION,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_LOGOUT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
      };
      return DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          vm.popup.logout_user = true;
          BaseService.logoutWithOperationConfirmation(vm);
        }
      }, () => {
        // localStorage.setItem('UserRightChange', false);
        $state.go($state.$current, {}, { reload: true });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function connectSocket() {
      socketConnectionService.on(CORE.EventName.sendNotificationOfRightChanges, sendNotificationOfRightChanges);
      socketConnectionService.on(CORE.EventName.sendNotificationOfDefaultRoleChanges, sendNotificationOfDefaultRoleChanges);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCheckOutRequest, updateCheckOutRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.User.User_Status, changeUserStatusListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.EventName.sendNotificationOfRightChanges, sendNotificationOfRightChanges);
      socketConnectionService.removeListener(CORE.EventName.sendNotificationOfDefaultRoleChanges, sendNotificationOfDefaultRoleChanges);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCheckOutRequest, updateCheckOutRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.User.User_Status, changeUserStatusListener);
    }

    function changeUserStatusListener(message) {
      if (message && message.onlineStatus && BaseService.loginUser && BaseService.loginUser.userid === message.userID) {
        const status = _.find(vm.userStatusOptions, (item) => item.status === message.onlineStatus);
        setUserStatus(status);
        // Update onlineStatus in BaseService loginuser.
        BaseService.loginUser['onlineStatus'] = message.onlineStatus;

        // Update localStorage Loginuser value only once.
        const loginuser = getLocalStorageValue('loginuser');
        // manage case: manually set Offline from chat then do not change status online on page reload.
        if (message.isFromChat) {
          BaseService.loginUser.isRemainOldStatus = message.onlineStatus === CHAT.USER_STATUS.OFFLINE ? true : false;
          loginuser.isRemainOldStatus = message.onlineStatus === CHAT.USER_STATUS.OFFLINE ? true : false;
        }
        if (loginuser && loginuser.onlineStatus !== message.onlineStatus) {
          loginuser.onlineStatus = message.onlineStatus;
          setLocalStorageValue('loginuser', loginuser);
        }
      }
    }

    //// Function for send notification when user change the other user role-right-permiddion
    //let sendNotificationAllActiveSession = () => {
    //  RolePagePermisionFactory.sendNotificationOfRightChanges().query({ id: vm.selectEmployeeId }).$promise.then((response) => {
    //  }).catch((error) => {
    //    return BaseService.getErrorLog(error);
    //  });
    //}

    $scope.$on('$destroy', () => {
      removeSocketListener();
      idleStart();
      idleWarn();
      idleTimeout();
      idleEnd();
      keepalive();
      mdMenuClose();
      loginuserEvent();
      updateHBTooltip();
      window.removeEventListener('storage', storageChange, false);
    });

    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function storageChange(event) {
      if (event.key === 'loginuser') {
        if (!getLocalStorageValue('loginuser')) {
          $mdDialog.hide('', { closeAll: true });
          // console.log('storageChange');
          /* only for debug purpose - [S]*/
          const tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (tractActivityLog && Array.isArray(tractActivityLog)) {
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from toolbarstorageChange"' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
          }
          /* [E]*/
          BaseService.logout();
        }
      }
    }
    //received details for cancel request
    function updateCancelRequestStatus(req) {
      if (req.allRequest) {
        vm.assignColorDetails = [];
      } else {
        vm.assignColorDetails = _.reject(vm.assignColorDetails, (o) => { return o.transactionID == req.transactionID });
      }
    }
    //received details for successful cart placed
    function updateCheckOutRequest(req) {
      if (req.transactionID) {
        vm.assignColorDetails = _.reject(vm.assignColorDetails, (o) => { return o.transactionID == req.transactionID });
      }
    }
    // ----------------------------------- [S] Get Search result on press enter in Search TextBox(Enterprise Search) ------------------------------
    vm.enterpriseSearch = () => {
      setFocus('headerEnterpriseSearch');
    };
    vm.headerEnterpriseSearch = (event) => {
      if ((!event || event.keyCode === 13)) {
        BaseService.goToEnterpriseSearch(encodeURIComponent(vm.headerSearchEnterpriseCriteria));
        vm.headerSearchEnterpriseCriteria = null;
        $mdMenu.hide();
      }
    };
    vm.searchOnEnterprise = () => {
      BaseService.goToEnterpriseSearch(encodeURIComponent(vm.headerSearchEnterpriseCriteria));
      vm.headerSearchEnterpriseCriteria = null;
      $mdMenu.hide();
    };
    // ----------------------------------- [E] Get Search result on press enter in Search TextBox ------------------------------

    /**
   * Update Checkin Status
   * @param {any} response
   */

    window.addEventListener('storage', storageChange, false);

    /* set page name for helpBlog*/
    const updateHBTooltip = $scope.$on('updateHBTooltip', (evt, newpageName) => {
      vm.HBPageTooltip = newpageName;
    });
  }
})();
