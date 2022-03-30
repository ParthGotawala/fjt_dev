(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('NotificationFactory', ['$injector', NotificationFactory]);

  /** @ngInject */
  function NotificationFactory($injector) {
    return {
      success(message) {
        const $mdToast = $injector.get('$mdToast');
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .position('top right')
            .hideDelay(4000)
            .theme('success-toast')
            .action('x')
            .highlightAction(true)
        ).then((res) => {
          if (res == "x") {
            $mdToast.hide();
          }
        }).catch(() => {
          return;
        });
      },
      error(err) {
        const $mdToast = $injector.get('$mdToast');
        $mdToast.show(
          $mdToast.simple()
            .textContent(err)
            .position('top right')
            .hideDelay(4000)
            .theme('error-toast')
        ).catch(() => {
          return;
        });
      },
      somethingWrong(err) {
        const $mdToast = $injector.get('$mdToast');
        $mdToast.show(
          $mdToast.simple()
            .textContent(err)
            .position('top right')
            .hideDelay(4000)
            .theme('warning-toast')
        ).catch(() => {
          return;
        });
      },
      information(err) {
        const $mdToast = $injector.get('$mdToast');
        $mdToast.show(
          $mdToast.simple()
            .textContent(err)
            .position('top right')
            .hideDelay(4000)
            .theme('warning-toast')
            .action('x')
            .highlightAction(true)
        ).then((res) => {
          if (res == "x") {
            $mdToast.hide();
          }
        }).catch(() => {
          return;
        });
      },
    };
  }

})();
