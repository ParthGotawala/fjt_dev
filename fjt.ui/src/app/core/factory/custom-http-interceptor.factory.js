(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('CustomHttpInterceptorFactory', ['$q', '$location', 'UserService', 'NotificationFactory', '$injector', CustomHttpInterceptorFactory]);

  /** @ngInject */
  function CustomHttpInterceptorFactory($q, $location, UserService, NotificationFactory, $injector, $state, HELPER_PAGE, CORE) {
    let BaseService, DialogFactory, notauthenticate;

    return {
      request: (config) => {
        if (config.url.includes('/api/') && !config.url.includes('/login')) {
          if (!config.url.includes('/getAllModuleDynamicMessages') && !config.url.includes('/executeAllRemainingDbScript')
            && !config.url.includes('/retrieveCurrDBInfo') && !config.url.includes('/forgotUserPassword')
            && !config.url.includes('/resetUserCredential') && !config.url.includes('/getUserDetailsByPasswordToken')
            && !config.url.includes('/getDefinedGlobalSettingKeyValues')) {
            //config.headers.Authorization = `Bearer ${UserService.getCurrentUserToken()}`;
            BaseService = BaseService || $injector.get('BaseService');
            if (BaseService && BaseService.loginUser) {
              config.headers.Authorization = `Bearer ${BaseService.loginUser.token}`;
            }
          }
        }
        return config;
      },
      // TODO: success notification for api request > create, update, delete
      response: (response) => {
        DialogFactory = DialogFactory || $injector.get('DialogFactory');
        CORE = CORE || $injector.get('CORE');
        if (response.config.url.includes('/api/') && response.data && ((response.data.data && (response.data.data.userMessage)) || response.data.userMessage || response.data.errors)) { //&& response.data.userMessage
          const message = ((response.data.data && (response.data.data.userMessage)) ? (response.data.data.userMessage) : (response.data.userMessage)) || response.data.errors;
          let messageText = '';
          if (response.data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (message && (message.messageCode || message.messageType) && message.displayDialog) {
              // to display dialog on UI in case of SUCCESS
            }
            else if (message && typeof (message.message) === 'string' && message.message) {
              messageText = message.message;
            }
            else { messageText = message; }
            if (messageText) {
              NotificationFactory.success(messageText);
            }
          }
          else {
            if (message && message === 'Unauthorized user') {
              if (!notauthenticate) {
                /* only for debug purpose - [S]*/
                let tractActivityLog = getLocalStorageValue('tractActivityLog');
                if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
                  tractActivityLog = [];
                }
                const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from Unauthorized user' };
                tractActivityLog.push(obj);
                setLocalStorageValue('tractActivityLog', tractActivityLog);
                /* [E]*/
                BaseService.logout();
              }
              else {
                notauthenticate = true;
                return;
              }
              //return $q.reject(response);
            }
            else {
              // Inject dialog service for alert
              if ((message && message.messageContent && (message.messageContent.messageCode || message.messageContent.messageType)) ||
                (message && message.message && message.message.messageContent && message.message.messageContent.messageCode) ||
                (message && message.message && message.message.messageCode)
              ) {
                const model = {
                  multiple: true
                };
                /*1062 error no is unique constraint failed error number on mysql*/
                if (message.err && message.err.parent && message.err.parent.errno === 1062) {
                  model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DB_DUPLICATE_MESSAGE);
                  model.messageContent.err = angular.copy(message.messageContent.err);
                  //model.messageContent.err.message = (message.err.errors && message.err.errors[0] && message.err.errors[0].message) ? angular.copy(message.err.errors[0].message) : model.messageContent.err.message;
                  model.messageContent.err.message = angular.copy(message.err.parent.sqlMessage);
                }
                /*1205 error no is Lock wait timeout exceeded; try restarting transaction*/
                else if (message.err && message.err.parent && message.err.parent.errno === 1205) {
                  model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.RESOURCE_BUSY_LOCK_WAIT_TRANSCATION);
                  model.messageContent.err = angular.copy(message.messageContent.err);
                  //model.messageContent.err.message = (message.err.errors && message.err.errors[0] && message.err.errors[0].message) ? angular.copy(message.err.errors[0].message) : model.messageContent.err.message;
                  model.messageContent.err.message = angular.copy(message.err.parent.sqlMessage);
                } else {
                  model.messageContent = angular.copy(message.message || message.messageContent || message.message.messageContent);
                }
                response.data.alretCallbackFn = DialogFactory.messageAlertDialog(model);
              }
              else if (message && !message.messageContent && message.data) {
                //nothing to do
                // This is case for unique checking field and based on module logic , message to be displayed at relavent controller side not from inceptor.
              }
              else {
                const messageObj = {};
                messageObj.title = CORE.MESSAGE_CONSTANT.ALERT_HEADER;
                messageObj.textContent = message.message || message;
                messageObj.multiple = true;
                //callback function that will call after user click OK on alert box
                response.data.alretCallbackFn = DialogFactory.alertDialog(messageObj);
              }
            }
          }
        }
        BaseService = BaseService || $injector.get('BaseService');
        return $q.resolve(response);
      },
      responseError: (responseError) => {
        // Inject dialog service for alert
        DialogFactory = DialogFactory || $injector.get('DialogFactory');
        CORE = CORE || $injector.get('CORE');
        if (responseError && responseError.config && responseError.config.url && responseError.config.url.includes('/api/')) {
          //const err = responseError.data.userMessage || responseError.data.data.userMessage;
          if (responseError.data || responseError.data instanceof ArrayBuffer) {
            $state = $state || $injector.get('$state');
            HELPER_PAGE = HELPER_PAGE || $injector.get('HELPER_PAGE');
            if (responseError && responseError.status.toString() === '404') {
              if (responseError.data instanceof ArrayBuffer) {
                return responseError;
              }
              else {
                $state.go(HELPER_PAGE.NOT_FOUND_STATE);
              }
            }
            else if (responseError && responseError.status.toString() === '401') {
              if (angular.isString(responseError.data) && responseError.data.includes(CORE.ACCESS_DENIED_INVALID_CREDENTIALS)) {
                /* only for debug purpose - [S]*/
                let tractActivityLog = getLocalStorageValue('tractActivityLog');
                if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
                  tractActivityLog = [];
                }
                const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Unauthorized: Access is denied due to invalid / Expired token.' };
                tractActivityLog.push(obj);
                setLocalStorageValue('tractActivityLog', tractActivityLog);
                /* [E]*/

                /* On Token Invalid or Token Expired - redirect on External page for login / renew token. */
                sessionStorage.setItem('lastPageLocation', location.hash);
                window.location.href = "silentrefresh.html";
              }
              else {
                $state.go(HELPER_PAGE.UNAUTHORIZED_STATE, { pageRoute: $state && $state.current ? $state.current.name : null });
              }
            }
            else if (responseError && responseError.status.toString() === '501') {
              $state.go(HELPER_PAGE.API_ACCESS_STATE);
            }
            else {
              const resError = responseError.data;
              let err;
              if (resError) {
                if (resError.userMessage || (resError.data && resError.data.userMessage)) {
                  err = resError.userMessage || resError.data.userMessage;
                }
                else if (responseError.data && responseError.data.errors) {
                  err = responseError.data.errors.message || responseError.data.errors.name;
                }
              }

              if (resError && resError.errors && resError.errors.messageCode) {
                const model = {
                  messageContent: angular.copy(resError.errors),
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model);
              }
              else {
                if (!BaseService.isUnHandleException) {
                  // Show Alert for message
                  const messageObj = {};
                  messageObj.title = CORE.MESSAGE_CONSTANT.ALERT_HEADER;
                  messageObj.textContent = err;
                  DialogFactory.alertDialog(messageObj);
                  BaseService.isUnHandleException = true;
                }
              }
            }
          }
          if (responseError.data && responseError.data.errors && (responseError.data.errors.name === 'TokenExpired'
            || responseError.data.errors.name === 'TokenNotFound')) {
            // console.log('TokenNotFound');
            /* only for debug purpose - [S]*/
            let tractActivityLog = getLocalStorageValue('tractActivityLog');
            if (!tractActivityLog || !Array.isArray(tractActivityLog)) {
              tractActivityLog = [];
            }
            const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'logout from TokenNotFound' };
            tractActivityLog.push(obj);
            setLocalStorageValue('tractActivityLog', tractActivityLog);
            /* [E]*/

            /* On Token Invalid or Token Expired - redirect on External page for login / renew token. */
            sessionStorage.setItem('lastPageLocation', location.hash);
            window.location.href = "silentrefresh.html";
            //$location.path('/login');
          } else {
            if (!BaseService.isUnHandleException && !responseError.config.url.includes('/CheckAutoLogout')) {
              const messageObj = {};
              messageObj.title = CORE.MESSAGE_CONSTANT.ALERT_HEADER;
              if (responseError && responseError.status.toString() === '-1' && (responseError.config.url.includes(_configReportDesigneUrl) || responseError.config.url.includes(_configReportViewerUrl))) {
                messageObj.textContent = CORE.MESSAGE_CONSTANT.DownloadFileErrorMsg.ServiceUnavailable;
              } else {
                messageObj.textContent = CORE.MESSAGE_CONSTANT.SOMTHING_WRONG;
                BaseService.isUnHandleException = true;
              }
              DialogFactory.alertDialog(messageObj);
            }
          }
        }
        return $q.reject(responseError);
      }
    };
  }
})();
