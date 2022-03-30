(function () {
  'use strict';

  angular
    .module('fuse')
    .run(runBlock);

  /** @ngInject */
  function runBlock($q, $rootScope, $timeout, $state, CORE, DASHBOARD, store, UserPagePermisionFactory,
    BaseService, HELPER_PAGE, Idle, $mdDialog, DialogFactory, USER, $mdSelect) {
    /* Moved below. */
    //function redirectError() {
    //  /* only for debug purpose - [S]*/
    //  let tractActivityLog = getLocalStorageValue('tractActivityLog');
    //  if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
    //    tractActivityLog = [];
    //  }
    //  const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from redirectError' };
    //  const obj2 = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'redirectError : ' + JSON.stringify(toState) };
    //  tractActivityLog.push(obj);
    //  setLocalStorageValue('tractActivityLog', tractActivityLog);
    //  /* [E]*/
    //  BaseService.logout();
    //}
    ////Setup rootScope variables
    //$rootScope.dateDisplayFormat = _dateDisplayFormat;
    //$rootScope.uimaskFormat = _configUIMask;
    //$rootScope.dateTimeDisplayFormat = _dateTimeDisplayFormat;
    //$rootScope.timeWithoutSecondDisplayFormat = _timeWithoutSecondDisplayFormat;
    //$rootScope.unitInputStep = _unitInputStep;

    const errorHandle = $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
      /* only for debug purpose - [S]*/
      let tractActivityLog = getLocalStorageValue('tractActivityLog');
      if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
        tractActivityLog = [];
      }
      const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from redirectError' };
      const obj2 = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'redirectError toState: ' + JSON.stringify(toState) };
      const obj3 = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'redirectError fromState: ' + JSON.stringify(fromState) };
      const obj4 = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'redirectError error: ' + JSON.stringify(error) };
      tractActivityLog.push(obj);
      tractActivityLog.push(obj2);
      tractActivityLog.push(obj3);
      tractActivityLog.push(obj4);
      setLocalStorageValue('tractActivityLog', tractActivityLog);
      /* [E]*/
      BaseService.logout();
    });
    const loginuser = getLocalStorageValue('loginuser');
    if (loginuser) {
      UserPagePermisionFactory.checkAutoLogout().query().$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          const isPasswordChnaged = getLocalStorageValue('passwordchange');
          if (response.apiStatusCode === CORE.API_RESPONSE_CODE.UNAUTHORIZED && !isPasswordChnaged) {
            /* only for debug purpose - [S] */
            let tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
              tractActivityLog = [];
            }
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from password change check.' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
            /* [E] */
            BaseService.logout();
          }
        }
        else {
          /* only for debug purpose - [S] */
          let tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
            tractActivityLog = [];
          }
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from password change check.' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
          /* [E] */
          BaseService.logout();
        }
      }).catch((error) => {
        if (error && error.status !== CORE.API_RESPONSE_CODE.UNAUTHORIZED) {
          /* only for debug purpose - [S]*/
          let tractActivityLog = getLocalStorageValue('tractActivityLog');
          if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
            tractActivityLog = [];
          }
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from password change check.' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
          /* [E]*/
          BaseService.getErrorLog(error);
          BaseService.logout();
        }
      });
    }

    var redirectToValidState = false;
    // Activate loading indicator
    const stateChangeStartEvent = $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
      // If user hit any URL and user already logged in then  redirect to valid State.
      redirectToValidState = toState.name === DASHBOARD.DASHBOARD_STATE;
      if (toState.external) {
        event.preventDefault();
        window.open(toState.url, '_self');
      }
      if (toState.name === 'app.logout') {
        /* only for debug purpose - [S]*/
        let tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
          tractActivityLog = [];
        }
        const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service app.logout' };
        tractActivityLog.push(obj);
        setLocalStorageValue('tractActivityLog', tractActivityLog);
        /* [E]*/
        BaseService.logout();
      } else {
        const forms = BaseService.getFormForValidation();
        const popupforms = BaseService.getPopupFormForValidation();
        const flagforms = BaseService.getFlagFormForValidation();
        if (forms.length > 0 || popupforms.length > 0 || flagforms.length > 0) {
          const findDirtyForm = _.find(forms, (form) => {
            return form && form.$dirty;
          });
          const findDirtypopupForm = _.find(popupforms, (form) => {
            return form.$dirty;
          });
          const findDirtyFlagForm = _.find(flagforms, (form) => {
            return form === true;
          });
          if (findDirtyForm || findDirtypopupForm || findDirtyFlagForm) {
            showWithoutSavingAlertforBackButton(toState, toParams);
            event.preventDefault();
          } else {
            BaseService.currentPageForms = [];
            BaseService.currentPagePopupForm = [];
            BaseService.currentPageFlagForm = [];
          }
        } else {
          BaseService.currentPageForms = [];
          BaseService.currentPagePopupForm = [];
          BaseService.currentPageFlagForm = [];
        }
      }
      $rootScope.gridOption = { CurrentPage: '' };
      $rootScope.loadingProgress = true;
      if (toState.name.indexOf('app.login') === -1 && toState.name.indexOf('app.logoutresponse') === -1 && toState.name.indexOf('app.500') === -1
        && toState.name.indexOf('app.dbscript') === -1 && toState.name.indexOf('app.diffchecker') === -1
        // && toState.name.indexOf('app.resetpassword') === -1 && toState.name.indexOf('app.forgotpassword') === -1 
      ) {
        const loginData = getLocalStorageValue('loginuser');
        const Allpromise = [];
        if (loginData) {
          if (loginData.employee && loginData.employee.logoutIdleTime) {
            Idle.setIdle(loginData.employee.logoutIdleTime);
          } else {
            Idle.setIdle(_configIdleTime);
          }
          Idle.watch();
          if (_.find(CORE.EXCLUDE_PAGE, (page) => { return toState.name.indexOf(page) > -1; })) {
          } else {
            const toPageDet = BaseService.getPageTitle(toState.name);
            const fromPageDet = BaseService.getPageTitle(fromState.name);
            const obj = {
              id: loginData.userid,
              roleID: loginData.defaultLoginRoleID,
              pageRoute: toState.name,
              oldRoute: fromState.name,
              toPageTitle: toPageDet ? toPageDet.PageDetails.menuName : '',
              fromPageTitle: fromPageDet ? fromPageDet.PageDetails.menuName : ''
            };
            Allpromise.push(IsPageAccess(obj));
            $q.all(Allpromise).then((res) => {
              res = _.first(res);
              const previousStateObj = JSON.parse(sessionStorage.getItem('previousStateObj'));
              // const isUserOverridden = store.get('isUserOverridden');
              const isUserOverridden = getLocalStorageValue('isUserOverridden');
              if (redirectToValidState && previousStateObj && previousStateObj.stateName && !isUserOverridden) {
                sessionStorage.removeItem('previousStateObj');
                return $state.go(previousStateObj.stateName, previousStateObj.stateParams);
              }
              else if (res && res.PageDetails.pageRoute === obj.pageRoute) {
                $rootScope.$broadcast('updateHBTooltip', res.PageDetails.pageName); // For Tooltip name in helpBlogIcon in toolbar
                const loginUserDetails = BaseService.loginUser;
                if (loginUserDetails) {
                  loginUserDetails.pageID = res.PageID;
                  loginUserDetails.RO = res.RO;
                  loginUserDetails.RW = res.RW;
                  loginUserDetails.isHelpBlog = res.isHelpBlog;
                  //loginUserDetails.featurePageDetail = res.featurePageDetail;  //As per discuss with DP/VS now no need to check feature on page access it will get only on load in tollbar with menu.
                  loginUserDetails.isHelpBlog = (res.PageDetails && res.PageDetails.helpBlog && res.PageDetails.helpBlog.length > 0) ? true : false;
                  /* only for debug purpose - [S]*/
                  const tractActivityLog = getLocalStorageValue('tractActivityLog');
                  if (tractActivityLog && Array.isArray(tractActivityLog)) {
                    const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set Loginuser: stateChangeStartEvent' };
                    tractActivityLog.push(obj);
                    setLocalStorageValue('tractActivityLog', tractActivityLog);
                  }
                  /* [E]*/
                  BaseService.setLoginUser(loginUserDetails, null);
                  return true;
                } else {
                  // console.log('setLoginUser');
                  /* only for debug purpose - [S]*/
                  let tractActivityLog = getLocalStorageValue('tractActivityLog');
                  if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
                    tractActivityLog = [];
                  }
                  const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from base service stateChangeStartEvent' };
                  tractActivityLog.push(obj);
                  setLocalStorageValue('tractActivityLog', tractActivityLog);
                  /* [E]*/
                  BaseService.logout();
                }
              }
              else if (res && res.PageDetails.pageRoute !== obj.pageRoute) {
                return $state.go(res.PageDetails.pageRoute);
              }
              else {
                $timeout(() => {
                  return $state.go(HELPER_PAGE.UNAUTHORIZED_STATE, { pageRoute: obj.pageRoute });
                });
              }
            }).catch((error) => {
              BaseService.getErrorLog(error);
              console.log('IsPageAccess');
              $state.go(HELPER_PAGE.API_ACCESS_STATE);
              // BaseService.logout();
              return;
            });;
          }
        }
        if (!loginData) {
          event.preventDefault();
          if (toState.name.indexOf('app.dbscript') > -1
            || toState.name.indexOf('app.diffchecker') > -1
            // || toState.name.indexOf('app.resetpassword') > -1 || toState.name.indexOf('app.forgotpassword') > -1 
          ) {
            return $state.go(toState.name);
          } else {
            $rootScope.previousState = { state: toState, params: toParams };
            console.log('logout from stateChangeStartEvent');
            return $state.go(CORE.LOGIN_STATE, {}, { reload: true });
          }
          //return $state.go(Page401);
        }
      }
    });

    // De-activate loading indicator
    const stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      // console.log('stateChanged 6');
      $timeout(() => {
        $rootScope.loadingProgress = false;
        /* commented as success/errors message on popup display  will not come for any page(e.g. reset password) */
        // $mdDialog.cancel();

        /** Prevent form validation on enter key press */
        preventFormSubmit();
        $(document).bind('click', (event) => {
          var container = $('md-select');
          if (!container.is(event.target) &&
            container.has(event.target).length === 0) {
            $mdSelect.hide();
          }
        });
      });
      if (toState && toState.name === CORE.LOGIN_STATE) {
        console.log('logout from stateChangeSuccessEvent');
        $timeout(() => {
          $mdDialog.hide('', { closeAll: true });
        });
        const loginData = getLocalStorageValue('loginuser');
        if (loginData) {
          $state.go(DASHBOARD.DASHBOARD_STATE);
        }
      }
      if (toState && toState.name !== (fromState && fromState.name) && toState.data && toState.data.hasOwnProperty('autoActivateChild') && toState.data.autoActivateChild) {
        // Extra Flag for restrict Reload whole page - SHUBHAM(16/04/2021)
        if (toState.data.restrictReload) {
          $state.go(toState.data.autoActivateChild, {});
        } else {
          $state.go(toState.data.autoActivateChild, {}, { reload: true });
        }
        return;
      }
    });

    // Store state in the root scope for easy access
    $rootScope.state = $state;

    // Cleanup
    $rootScope.$on('$destroy', () => {
      stateChangeStartEvent();
      stateChangeSuccessEvent();
      errorHandle();
    });

    // to check current state form haveing dirty than need to ask for confirmation
    function showWithoutSavingAlertforBackButton(toState, toParams) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          _.each(BaseService.currentPageForms, (objform) => {
            if (objform) {
              objform.$setPristine();
            }
          });
          BaseService.currentPageForms = [];
          BaseService.currentPagePopupForm = [];
          BaseService.currentPageFlagForm = [];
          $state.go(toState.name, toParams, { reload: true });
        }
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function IsPageAccess(userRoute) {
      return UserPagePermisionFactory.isPageAccess().save(userRoute)
        .$promise.then((permision) => {
          return permision.data;
        }).catch((error) => {
          if (error.status === 401) { // only got error in case of token is Expired/Invalid...
            BaseService.loginIDS();
          }
          else {
            BaseService.getErrorLog(error);
            console.log('IsPageAccess');
            $state.go(HELPER_PAGE.API_ACCESS_STATE);
            // BaseService.logout();
            return;
          }
        });
    }

    const onKeyUpcode = document.addEventListener('keydown', (e) => {
      if (e.keyCode === 9 && _.includes(e.srcElement.className, 'add-shortcut-button')) {
        if (USER.isPopupOpen) {
          e.preventDefault();
          return false;
        }
      }
    });
  }
})();
