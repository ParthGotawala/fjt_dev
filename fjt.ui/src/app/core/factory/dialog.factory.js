(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('DialogFactory', ['USER', '$mdDialog', DialogFactory]);

  /** @ngInject */
  function DialogFactory(USER, $mdDialog) {

    return {
      dialogService: (ctrl, template, ev, data) => $mdDialog.show({
        controller: ctrl,
        controllerAs: USER.CONTROLLER_AS,
        templateUrl: template,
        targetEvent: ev,
        skipHide: true,
        multiple: true,
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true, // Only for -xs, -sm breakpoints.
        locals: {
          data,
        },
        onComplete: (s, e) => {
          if ($(e)) {
            var form = $(e).find('form.md-inline-form');
            if (!form || !form[0]) {
              form = $(e).find('form');
            }
            if (form && form[0] && (!data || !data.skipFocusOnFirstElement)) {
              focusOnFirstEnabledFormField(form);
            }
          }
          USER.isPopupOpen = true;
          preventFormSubmit(true);
        },
        onRemoving: function (event, removePromise) {
          USER.isPopupOpen = false;
        }
      }),

      //dialogService: (ctrl, template, ev, data) => {
      //    var info = $q.defer();
      //    $mdDialog.show({
      //        controller: ctrl,
      //        controllerAs: USER.CONTROLLER_AS,
      //        templateUrl: template,
      //        targetEvent: ev,
      //        multiple: true,
      //        clickOutsideToClose: false,
      //        escapeToClose: false,
      //        fullscreen: true, // Only for -xs, -sm breakpoints.
      //        locals: {
      //            data,
      //        },
      //    }).then(() => {
      //        info.resolve()
      //    }, (err) => {
      //        info.reject();
      //    });
      //    return info.promise;
      //},

      dialogServiceForJob: (ctrl, template, ev, data) => $mdDialog.show({
        controller: ctrl,
        controllerAs: USER.CONTROLLER_AS,
        templateUrl: template,
        targetEvent: ev,
        multiple: true,
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true, // Only for -xs, -sm breakpoints.
        locals: {
          data,
        },
      }),

      confirmDiolog: (obj) => $mdDialog.show($mdDialog.confirm(
        {
          escapeToClose: false,
          onComplete: function afterShowAnimation(scope, element, options, controller) {
            if (obj && !obj.defaultConfirmButton) {
              var $actionsSection = element.find('md-dialog-actions');
              var $bodySction = element.find('md-dialog-content');
              var $cancelButton = $actionsSection.children()[0];
              var $confirmButton = $actionsSection.children()[1];
              var $dialogTitle = $bodySction.children()[0];
              var $dialogBody = $bodySction.children()[1];
              angular.element($confirmButton).removeClass('md-focused md-primary');
              angular.element($cancelButton).removeClass('md-primary');
              angular.element($confirmButton).addClass('md-focused md-raised md-ink-ripple');
              angular.element($cancelButton).addClass('md-focused md-raised md-ink-ripple');
              angular.element($dialogBody).addClass('cm-bom-alert-popup');
              if ($cancelButton) {
                $cancelButton.focus();
              }
              if (obj && obj.btnTextDisable) {
                angular.element($confirmButton).attr("disabled", obj.btnTextDisable);
              }
            }

            // [S] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box
            scope.dialog.Initialize = true;
            // [E] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box
          }
        }
      )
        .title(obj ? obj.title : USER.DELETE_CONFIRM)
        .htmlContent(
          '<div class="dynamic-msg-content">' +
          '<div class="dynamic-msg-body"> ' + (obj && obj.textContent ? obj.textContent : '') + '</div>' +
          ' </div>')
        .ok(obj ? obj.btnText : "Yes! Delete it")
        .cancel(obj ? obj.canbtnText : "Cancel")
        .multiple(true)
      ),


      alertDialog: (obj, callBackFn) => $mdDialog.show($mdDialog.alert({
        escapeToClose: false,
        onComplete: function afterShowAnimation(scope, element, options, controller) {
          if (obj && !obj.defaultConfirmButton) {
            var $actionsSection = element.find('md-dialog-actions');
            var $cancelButton = $actionsSection.children()[0];
            angular.element($cancelButton).removeClass('md-primary');
            angular.element($cancelButton).addClass('md-focused md-raised md-ink-ripple');
          }

          // [S] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box
          scope.dialog.Initialize = true;
          // [E] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box
        }
      }
      )
        .title(obj.title)
        .htmlContent(
          '<div class="dynamic-msg-content">' +
          '<div class="dynamic-msg-body"> ' + obj.textContent + '</div>' +
          ' </div>')
        .multiple(obj.multiple)
        .ok(obj && obj.btnText ? obj.btnText : 'Ok')
      ).finally(callBackFn || angular.noop),


      messageAlertDialog: (obj, callBackFn) => $mdDialog.show(
        $mdDialog.alert({
          escapeToClose: false,
          onComplete: function afterShowAnimation(scope, element, options, controller) {
            //element.find('md-dialog').addClass('dynamic-msg-container');
            if (obj && !obj.defaultConfirmButton) {
              var $actionsSection = element.find('md-dialog-actions');
              var $cancelButton = $actionsSection.children()[0];
              angular.element($cancelButton).removeClass('md-primary');
              angular.element($cancelButton).addClass('md-focused md-raised md-ink-ripple');
            }

            // [S] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box
            scope.dialog.Initialize = true;
            // [E] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box
          }
        }).title(obj.messageContent.messageType + ': ' + obj.messageContent.messageCode)
          .htmlContent(
            '<div class="dynamic-msg-content">' +
            '<div class="dynamic-msg-body"> ' + obj.messageContent.message + '</div>' +
            (obj.messageContent.err && obj.messageContent.err.message ? ('<pre class="mt-20"> ' + obj.messageContent.err.message + '</pre>') : '') +
            ' </div>')
          .multiple(true)
          .ok(obj && obj.btnText ? obj.btnText : 'Ok')
      ).finally(callBackFn || angular.noop),


      messageConfirmDialog: (obj) => $mdDialog.show(
        $mdDialog.confirm({
          escapeToClose: false,
          onComplete: function afterShowAnimation(scope, element, options, controller) {
            //element.find('md-dialog').addClass('dynamic-msg-container');
            if (obj && !obj.defaultConfirmButton) {
              var $actionsSection = element.find('md-dialog-actions');
              var $bodySction = element.find('md-dialog-content');
              var $cancelButton = $actionsSection.children()[0];
              var $confirmButton = $actionsSection.children()[1];
              var $dialogTitle = $bodySction.children()[0];
              var $dialogBody = $bodySction.children()[1];
              angular.element($confirmButton).removeClass('md-focused md-primary');
              angular.element($cancelButton).removeClass('md-primary');
              angular.element($confirmButton).addClass('md-focused md-raised md-ink-ripple');
              angular.element($cancelButton).addClass('md-focused md-raised md-ink-ripple');
              angular.element($dialogBody).addClass('cm-bom-alert-popup');
              if ($cancelButton) {
                $cancelButton.focus();
              }

              // [S] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box
              scope.dialog.Initialize = true;
              // [E] - [SHUBHAM - 11/08/2020] - Configure Initialize  Status for close Dialog Box

              if (obj && obj.btnTextDisable) {
                angular.element($confirmButton).attr("disabled", obj.btnTextDisable);
              }
            }
          }
        })
          .title(obj && obj.title ? obj.title : obj.messageContent.messageType + ': ' + obj.messageContent.messageCode) ///obj ? obj.title : USER.DELETE_CONFIRM
          .htmlContent(
            // [SHUBHAM-27/10/2021] Added 'confirmation-model' class for revent tab nevigation in case of Dirty page
            '<div class="dynamic-msg-content confirmation-model">'+
            //'   <div class="msg-icon">' +
            //    CORE.DYNAMIC_MESSAGE_TYPE.find(i => i.messageType === obj.messageContent.messageType).icon +
            //'   </div > ' +
            '   <div class="dynamic-msg-body"> ' + obj.messageContent.message +
            '   </div>' +
            '    </div>')
          .ok(obj && obj.btnText ? obj.btnText : "Yes! Delete it")    //obj ? obj.btnText : "Yes! Delete it"
          .cancel(obj && obj.canbtnText ? obj.canbtnText : "Cancel") //(obj ? obj.canbtnText : "Cancel"
          .multiple(true)
      ),
      closeDialogPopup: (data) => {
        return $mdDialog.cancel(data);
      },
      hideDialogPopup: (data) => {
        return $mdDialog.hide(data);
      },
      closeAllDialogPopup: () => {
        return $mdDialog.hide('', { closeAll: true });
      }
      // autoPassword: (password) => $mdDialog.show($mdDialog.alert()
      // 	.title(USER.PASSWORD_GENERATE)
      // 	.ok('Ok')
      // 	.htmlContent(`<div class="removeUpercase"> Your Password : ${password}</div>`)
      // ),
    };
  }

})();
