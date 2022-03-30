(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginResponseController', LoginResponseController);

  /** @ngInject */
  function LoginResponseController($q, $scope, $rootScope, $state, CORE, DASHBOARD, UserLoginFactory, BaseService, DialogFactory, WORKORDER, USER, OPERATION, REPORTS, TASK, TRANSACTION, TRAVELER,
    RFQTRANSACTION, MasterFactory, WIDGET, CONFIGURATION, Idle, PartCostingFactory, $http, UserFactory, store, CHAT) {
    const vm = this;
    var redirectionCount = 0;
    vm.user = {};
    vm.user.rememberme = false;
    vm.isDisabled = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.RESPONSE_MESSAGES = CORE.OIDC_CLIENT_RESPONSE_MESSAGES;
    $rootScope.pageTitle = 'Login';

    function completeLogin() {
      return new Promise((resolve, reject) => {
        $rootScope.manager.signinRedirectCallback()
          .then((user) => {
            resolve(user);
          }, (err) => {
            reject(err);
          }).catch((err) => {
            reject(err);
          });
      });
    };

    function completeLoginResponse() {
      completeLogin().then((response) => {
        if (response) {
          vm.loginUser = JSON.parse(localStorage.getItem('loginuser'));
          vm.lastLoginUserId = localStorage.getItem('lastLoginUserId');
          vm.user = response;
          $http.defaults.headers.common['Authorization'] = 'Bearer ' + response.access_token;
          localStorage.setItem('lastLoginUserId', response.profile ? response.profile.userid : null);
          vm.login();
        }
        else {
          BaseService.loginIDS();
        }
      }, (err) => {
        if (err.message && (err.message.includes(vm.RESPONSE_MESSAGES.STATE_NOT_FOUND.MESSAGE) || err.message.includes(vm.RESPONSE_MESSAGES.MISMATCH_STATE_IN_STORAGE.MESSAGE))) {
          const localStorageLoginuser = JSON.parse(localStorage.getItem('loginuser'));
          if (localStorageLoginuser) {
            const loginuser = BaseService.loginUser;
            if (loginuser) {
              if (loginuser.identityUserId === localStorageLoginuser.identityUserId) {
                redirectToState();
              } else {
                console.log('logout from loginresponse.');
                BaseService.logout();
              }
            } else {
              BaseService.loginUser = localStorageLoginuser;
              redirectToState();
            }
          }
          else {
            if (redirectionCount < 2) {  // if we do not get localstorage loginuserobj then redirect for login.
              const loginTimeout = setTimeout(() => {  // wait few sec for update loginuser data on localstorage from another login tab.
                redirectionCount++;
                completeLoginResponse();
              }, 1500);

              $scope.$on('$destroy', () => {
                clearTimeout(loginTimeout);
              });
            }
            else {
              BaseService.loginIDS();
            }
          }
        }
        else {
          const errMessage = err && err.message ? err.message : '';
          redirectToErrorPage(errMessage);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
    completeLoginResponse();

    function redirectToErrorPage(errMessage) {
      if (errMessage) {
        _.find(CORE.OIDC_CLIENT_RESPONSE_MESSAGES, (resMessage) => {
          if (errMessage.includes(resMessage.MESSAGE)) {
            errMessage = resMessage.KEY;
          }
        });
      }
      $state.go(CORE.INTERNAL_SERVER_ERROR_STATE, { errorMessage: errMessage });
    }

    function redirectToState() {
      const lastPageLocation = sessionStorage.getItem('lastPageLocation');
      sessionStorage.removeItem('lastPageLocation');
      // const isUserOverridden = store.get('isUserOverridden');
      const isUserOverridden = getLocalStorageValue('isUserOverridden');
      if (lastPageLocation) {
        // On manually rediret on silent refresh page, need to update all tab's base-service loginuser.
        UserFactory.updateLoginuser().query({ loginUser: BaseService.loginUser }).$promise.then(() => {
          // console.log('Socket io call for update login user on other browser tabs.');
        });
      }
      if (isUserOverridden || (vm.lastLoginUserId && vm.user && vm.user.profile && vm.lastLoginUserId !== vm.user.profile.userid)) {
        sessionStorage.removeItem('previousStateObj');
        // store.set('isUserOverridden', true);
        setLocalStorageValue('isUserOverridden', true);
        $state.go(DASHBOARD.DASHBOARD_STATE);
      }
      else {
        const previousStateObj = JSON.parse(sessionStorage.getItem('previousStateObj'));
        if (previousStateObj && previousStateObj.stateName) {
          sessionStorage.removeItem('previousStateObj');
          $state.go(previousStateObj.stateName, previousStateObj.stateParams);
        } else if (lastPageLocation && !(_.find(CORE.EXCLUDE_PAGE_URLS, (page) => lastPageLocation.includes(page)))) {
          history.replaceState({}, document.title, lastPageLocation);
        } else if (vm.user.state && !(_.find(CORE.EXCLUDE_PAGE_URLS, (page) => vm.user.state.includes(page)))) {
          history.replaceState({}, document.title, vm.user.state);
        } else {
          $state.go(DASHBOARD.DASHBOARD_STATE);
        }
      }
    }

    vm.login = (ev) => {
      var encryptedUserId = encryptAES(vm.user.profile.userid);
      vm.isDisabledSave = true;
      /* only for debug purpose - [S]*/
      const tractActivityLog = [];
      const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'successfully Login.' };
      tractActivityLog.push(obj);
      setLocalStorageValue('tractActivityLog', tractActivityLog);
      /* [E]*/


      UserLoginFactory.query({  //UserLoginFactory for login with password || UserIdLoginFactory for  login with IDS
        userId: encryptedUserId.toString()
      }).$promise.then((result) => {
        // console.log('result.data', result);
        if (result.alretCallbackFn) {
          result.alretCallbackFn.then((res) => {
            if (res) {
              setFocusByName('username');
            }
          });
        }
        vm.isDisabled = false;
        vm.isDisabledSave = false;
        if (result.status === 'SUCCESS') {
          // set logout Idle Time
          if (result.data && result.data.employee && result.data.employee.logoutIdleTime) {
            Idle.setIdle(result.data.employee.logoutIdleTime);
          } else {
            Idle.setIdle(_configIdleTime);
          }

          //Set Dashboard Pin True AS per discussed with Dixitbhai need to set after login default pin true for menu on 30/04/2020.
          BaseService.setDashboardPin(true);
          //UserService.setCurrentUserToken(result.data.token);
          // vm.userID = result.data.userid;
          const userDetails = {
            identityUserId: vm.user.profile.userid,
            userid: result.data.userid,
            username: result.data.userName,
            token: vm.user.access_token,// result.data.token
            rememberMe: vm.user.rememberme,
            employee: result.data.employee,
            featurePageDetail: result.data.featurePageDetail,
            roles: result.data.roles,
            defaultLoginRoleID: result.data.defaultLoginRoleID,
            printerID: result.data.printerID,
            logoutIdleTime: result.data.logoutIdleTime,
            onlineStatus: result.data.onlineStatus ? result.data.onlineStatus : CHAT.USER_STATUS.ONLINE
          };

          if (result.data.userConfiguration && result.data.userConfiguration.length > 0) {
            // converted configuration list array to single object
            const _sinConfigObj = {};
            _.each(result.data.userConfiguration, (configItem) => {
              _sinConfigObj[configItem.userPrefConfigurationMst.configCode] = configItem.configurationValue;
            });
            userDetails.uiGridPreference = _sinConfigObj.uiGridPreference;
            userDetails.userConfiguration = _sinConfigObj;
          } else {
            // set null if uiGridPreference data doesn't exists
            userDetails.uiGridPreference = null;
            userDetails.userConfiguration = null;
          };
          if (userDetails.roles && userDetails.roles.length > 0) {
            //check login user role as a super Admin or Executive
            const userRoleAdmin = _.find(userDetails.roles, (role) => {
              if (role.id === userDetails.defaultLoginRoleID) {
                return role.name.toLowerCase() === CORE.Role.SuperAdmin.toLowerCase() || role.name.toLowerCase() === CORE.Role.Executive.toLowerCase();
              }
            });
            //check login user role as a operator
            const userRoleOperator = _.find(userDetails.roles, (role) => {
              if (role.id === userDetails.defaultLoginRoleID) {
                return role.name.toLowerCase() === CORE.Role.Operator.toLowerCase();
              }
            });

            const userRoleSuperAdmin = _.find(userDetails.roles, (role) => {
              if (role.id === userDetails.defaultLoginRoleID) {
                return role.name.toLowerCase() === CORE.Role.SuperAdmin.toLowerCase();
              }
            });
            // check login user role manager
            const userRoleManager = _.find(userDetails.roles, (role) => {
              if (role.id === userDetails.defaultLoginRoleID) {
                return role.name.toLowerCase() === CORE.Role.Manager.toLowerCase();
              }
            });

            if (userDetails && userDetails.defaultLoginRoleID) {
              if (userRoleAdmin && userRoleAdmin.id === userDetails.defaultLoginRoleID) {
                userDetails.isUserAdmin = true;
                userDetails.isUserOperator = false;
                userDetails.isUserManager = false;
              }
              else {
                if (userRoleOperator && userRoleOperator.id === userDetails.defaultLoginRoleID) {
                  userDetails.isUserOperator = true;
                }
                else if (userRoleManager && userRoleManager.id === userDetails.defaultLoginRoleID) {
                  userDetails.isUserManager = true;
                }
              }
              if (userRoleSuperAdmin && userRoleSuperAdmin.id === userDetails.defaultLoginRoleID) {
                userDetails.isUserSuperAdmin = true;
              }
            }
          }
          vm.userData = userDetails;
          console.log('Set Loginuser: loginresponse.');
          BaseService.setLoginUser(userDetails, null);
          if (userDetails.isUserSuperAdmin && _configShowDigikeyAccessTokenPopupOnLogin) {
            vm.cgBusyLoading = PartCostingFactory.checkAppAccessTokenActive().query().$promise.then((suppliers) => {
              if (suppliers && suppliers.data && suppliers.data.status === CORE.ApiResponseTypeStatus.FAILED) {
                vm.cgBusyLoading = PartCostingFactory.checkAppAccessTokenActive().query().$promise.then((supplier) => {
                  if (supplier && supplier.data && supplier.data.status === CORE.ApiResponseTypeStatus.FAILED) {
                    DialogFactory.dialogService(
                      USER.EXTERNAL_API_POPUP_CONTROLLER,
                      USER.EXTERNAL_API_POPUP_VIEW,
                      ev,
                      null).then(() => {
                      }, (err) => { BaseService.getErrorLog(err); });
                  }
                });
              }
            });
          }

          if (vm.loginUser && vm.loginUser.identityUserId !== vm.user.profile.userid) {
            UserFactory.reloadPreviousPages().query().$promise.then(() => {
              // console.log('Socket io call for reload old user pages.');
            });
          }
          redirectToState();
          // TODO: move remember to service
          //store.set('remember', vm.user.rememberme);
        }

        else {
          vm.isDisabledSave = false;
          //  $state.go(CORE.LOGIN_STATE);
        }
      }).catch(() => {
        vm.isDisabled = false;
        vm.isDisabledSave = false;
        // TODO: notif service
      });
    };

    const loadMessageConstantData = () => {
      vm.cgBusyLoading = MasterFactory.getAllModuleDynamicMessages().query().$promise.then((response) => {
        if (response.data && response.data.dynamicMessageList) {
          CORE.MESSAGE_CONSTANT = _.assign(CORE.MESSAGE_CONSTANT, response.data.dynamicMessageList.CORE);
          WORKORDER = _.assign(WORKORDER, response.data.dynamicMessageList.WORKORDER);
          USER = _.assign(USER, response.data.dynamicMessageList.USER);
          OPERATION = _.assign(OPERATION, response.data.dynamicMessageList.OPERATION);
          REPORTS = _.assign(REPORTS, response.data.dynamicMessageList.REPORTS);
          TASK = _.assign(TASK, response.data.dynamicMessageList.TASK);
          TRANSACTION = _.assign(TRANSACTION, response.data.dynamicMessageList.TRANSACTION);
          TRAVELER = _.assign(TRAVELER, response.data.dynamicMessageList.TRAVELER);
          RFQTRANSACTION = _.assign(RFQTRANSACTION, response.data.dynamicMessageList.RFQTRANSACTION);
          WIDGET = _.assign(WIDGET, response.data.dynamicMessageList.WIDGET);
          CONFIGURATION = _.assign(CONFIGURATION, response.data.dynamicMessageList.CONFIGURATION);
        }
      }).catch((error) => { BaseService.getErrorLog(error); });

      // added for dynamic message configuration
      vm.cgBusyLoading = MasterFactory.getAllCategoryDynamicMessages().query().$promise.then((response) => {
        if (response.data && response.data.dynamicMessageList) {
          CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE = _.assign(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE, response.data.dynamicMessageList);
        }
      }).catch((error) => { BaseService.getErrorLog(error); });
    };

    loadMessageConstantData();
  }
})();
