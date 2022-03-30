(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('TimedOutPopupController', TimedOutPopupController);

  /** @ngInject */
  function TimedOutPopupController($scope, $mdDialog, $q, $rootScope, mdPanelRef, BaseService, EmployeeFactory, Idle,
    CORE, USER, store, UserLoginFactory, DialogFactory, MasterFactory) {
    const vm = this;
    const loginUser = BaseService.loginUser;
    vm.timeoutImage = USER.ADMIN_EMPTYSTATE.ROLE.TIMEOUTIMAGEURL;
    vm.themeClass = CORE.THEME;
    vm.incorrectUserPassword = CORE.MESSAGE_CONSTANT.USER_PASSWORD_INCORRECT;

    //close panel dialog
    const closePanel = (isValid) => {
      if (isValid) {
        const loginData = getLocalStorageValue('loginuser');
        if (loginData) {
          loginData['userTimeout'] = false;
        }
        /* only for debug purpose - [S]*/
        const tractActivityLog = getLocalStorageValue('tractActivityLog');
        if (tractActivityLog && Array.isArray(tractActivityLog)) {
          const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: timedout - closePanel.' };
          tractActivityLog.push(obj);
          setLocalStorageValue('tractActivityLog', tractActivityLog);
        }
        /* [E]*/
        BaseService.setLoginUser(loginData, null);
        if (loginData.employee && loginData.employee.logoutIdleTime) {
          Idle.setIdle(loginData.employee.logoutIdleTime);
        } else {
          Idle.setIdle(_configIdleTime);
        }
        Idle.watch();
        window.removeEventListener('focusin', CloseModalIfTimeout);
      }
      mdPanelRef.destroy();
    };

    /* login button clicked */
    vm.loginAfterTimeout = () => {
      var userId = BaseService.loginUser.identityUserId;
      vm.isIncorrectUserPassword = false;
      if (vm.loginFormTimeout.$valid) {
        const encryptedPassword = encryptAES(vm.password);
        const encrypteduserId = encryptAES(userId);
        const userInfo = {
          password: encryptedPassword.toString(),
          userId: encrypteduserId.toString()
        };
        vm.cgBusyLoading = MasterFactory.validateUserPassword().query(userInfo)
          .$promise.then((result) => {
            if (result.status === 'SUCCESS' && result.data && result.data.isMatchPassword) {
              closePanel(true);
            }
            else {
              vm.password = null;
              angular.element(document.getElementById('timeoutpassword')).focus();
              vm.isIncorrectUserPassword = true;
            }
          });
      }
    };

    /* logout button clicked */
    vm.logoutAfterTimeout = () => {
      checkForLogout();
    };

    const checkForLogout = () => {
      closeAllAndLogout();
    };

    const closeAllAndLogout = () => {
      closePanel();
      $mdDialog.hide('', { closeAll: true });
      // console.log('closeAllAndLogout');
      console.log('logout from closeAllAndLogout.');
      BaseService.logout();
    };


    // Check Employee has any Active operation or not
    const isactiveTransEmployee = () => {
      return EmployeeFactory.isactiveTrans_Employee().query({ id: loginUser.employee.id }).$promise.then((employeeActiveTrans) => {
        return $q.resolve(employeeActiveTrans);
      }).catch((error) => {
        //console.log(error);
        return BaseService.getErrorLog(error);
      });
    };

    // Close modal popup on click of window
    function CloseModalIfTimeout() {
      // to get latest value from localstorage
      const loginUser = getLocalStorageValue('loginuser');
      if (loginUser) {
        if (!loginUser.userTimeout) {
          closePanel(true);
        }
        else {
          angular.element(document.getElementById('timedoutpassword')).focus();
        }
        // Don't Remove - Vaibhav Shah
        //$("#timeout-modal-popup").remove();
        //var body = document.body;
        //let mdBackdrop = body.getElementsByClassName('md-dialog-backdrop');
        //if (mdBackdrop.length == 1) {
        //    let mdScrollMask = body.getElementsByClassName('md-scroll-mask');
        //    mdScrollMask[0].parentNode.removeChild(mdScrollMask[0]);
        //}
        //mdBackdrop[0].parentNode.removeChild(mdBackdrop[0]);
        //$mdDialog.hide('', { closeAll: true });
        // Don't Remove - Vaibhav Shah

        //$mdDialog.cancel(true);
      } else {
        checkForLogout();
      }
    }

    //Add Event Listener for click on window
    window.addEventListener('focusin', CloseModalIfTimeout);

    //Close panel event created to call from login page to close panel
    const ClosePanelEvent = $rootScope.$on('ClosePanel', (event, data) => {
      closePanel();
    });

    $scope.$on('$destroy', () => {
      ClosePanelEvent();
      //Remove Event Listener for click on window
      window.removeEventListener('focusin', CloseModalIfTimeout);
    });
  }
})();
