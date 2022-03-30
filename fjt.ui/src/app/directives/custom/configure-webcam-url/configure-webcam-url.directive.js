(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('configureWebcamUrl', configureWebcamUrl);

  /** @ngInject */
  function configureWebcamUrl($state, $timeout, TRANSACTION, BaseService, DialogFactory, CORE) {
    var directive = {
      restrict: 'E',
      scope: {
        verificationDet: '=?',
        webcamDet: '=?',
        callback: '=?',
        refreshCallback: '=?',
        isRefreshbtn: '=?'
      },
      replace: true,
      templateUrl: 'app/directives/custom/configure-webcam-url/configure-webcam-url.html',
      link: function (scope, element, attrs) {
        const vm = this;
        scope.WebcamURLConfigNote = TRANSACTION.WebcamURLConfigNote;
        scope.ipWebcamObj = TRANSACTION.IPWebCamConfiguration;
        if (window.location.protocol === CORE.Protocol.withSSL) {
          scope.WebcamURLConfigNote = scope.WebcamURLConfigNote.replace(CORE.Protocol.withoutSSL, CORE.Protocol.withSSL);
        }
        const videoURL = localStorage.getItem('liveStreamVideoURL');
        var errors = {};

        vm.isRefreshBtn = scope.isRefreshbtn ? scope.isRefreshbtn : false;
        scope.verificationDet.liveStreamURL = videoURL;
        scope.verificationDet.videoStreamURL = videoURL;
        scope.verificationDet.videoURL = scope.verificationDet.liveStreamURL ? `${scope.verificationDet.liveStreamURL}/video` : null;
        scope.verificationDet.videoURLParams = new Date().getTime();

        if (scope.webcamDet) {
          scope.webcamDet.error = true;
          scope.webcamDet.connecting = false;
          checkWebCamAccess(`${scope.verificationDet.videoURL}?${scope.verificationDet.videoURLParams}`, loadWebCamSuccess, loadWebCamFailure);
        }

        scope.cancelVideoURL = () => {
          if (scope.webcamDet) {
            scope.webcamDet.connecting = false;
          }
          scope.verificationDet.showVideoURL = false;
          scope.verificationDet.liveStreamURL = null;
        };

        scope.openConfigurationPopup = (ev) => {
          DialogFactory.dialogService(
            CORE.IPWEBCAM_CONFIGURATION_MODAL_CONTROLLER,
            CORE.IPWEBCAM_CONFIGURATION_MODAL_VIEW,
            ev,
            {}).then(() => {
            }, (data) => {
            }, (error) => BaseService.getErrorLog(error));
        };

        scope.storeVideoURL = () => {
          //scope.verificationDet.showVideoURL = false;
          if (BaseService.focusRequiredField(scope.vm.LabelVerification)) {
            return;
          }

          if (window.location.protocol === CORE.Protocol.withSSL && !scope.verificationDet.liveStreamURL.contains(CORE.Protocol.withSSL)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SSL_REQUIRED);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj);
            return;
          }
          scope.verificationDet.videoStreamURL = scope.verificationDet.liveStreamURL;
          scope.verificationDet.videoURL = scope.verificationDet.liveStreamURL + '/video';
          localStorage.setItem('liveStreamVideoURL', scope.verificationDet.liveStreamURL);
          if (scope.callback) {
            scope.callback(scope.verificationDet.liveStreamURL);
          }
          scope.verificationDet.videoURLParams = new Date().getTime();

          if (scope.webcamDet) {
            checkWebCamAccess(`${scope.verificationDet.videoURL}?${scope.verificationDet.videoURLParams}`, loadWebCamSuccess, loadWebCamFailure);
          }
          else {
            scope.verificationDet.showVideoURL = false;
          }
        };

        function loadWebCamSuccess() {
          scope.webcamDet.error = false;
          scope.webcamDet.connecting = false;
          scope.verificationDet.showVideoURL = false;
        }

        function loadWebCamFailure() {
          scope.webcamDet.error = true;
          scope.webcamDet.connecting = false;
        }

        function checkWebCamAccess(url, success, failure) {
          $timeout(() => {
            scope.webcamDet.connecting = true;
            const img = new Image();
            let loaded = false;
            let errored = false;

            // Run only once, when `loaded` is false. If `success` is a function, it is called with `img` as the context.
            img.onload = function () {
              if (loaded) {
                return;
              }

              loaded = true;

              if (success && success.call) {
                if (scope.refreshCallback) {
                  scope.refreshCallback(true);
                }
                scope.webcamDet.connecting = false;
                success.call(img);
              }
            };

            // Run only once, when `errored` is false. If `failure` is a function, it is called with `img` as the context.
            img.onerror = function () {
              scope.webcamDet.connecting = false;
              if (errored) {
                return;
              }

              errors[url] = errored = true;

              if (failure && failure.call) {
                if (scope.refreshCallback) {
                  scope.refreshCallback(false);
                }
                scope.webcamDet.connecting = false;
                failure.call(img);
              }
            };

            // If `url` is in the `errors` object, trigger the `onerror` callback.
            if (errors[url]) {
              scope.webcamDet.connecting = false;
              img.onerror.call(img);
              return;
            }

            // Set the img src to trigger loading
            img.src = url;

            // If the image is already complete (i.e. cached), trigger the `onload` callback.
            if (img.complete) {
              scope.webcamDet.connecting = false;
              img.onload.call(img);
            }
          });
        };
        scope.vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

        if (scope.webcamDet) {
          scope.webcamDet.refreshVideoURL = () => {
            scope.verificationDet.videoURLParams = new Date().getTime();
            checkWebCamAccess(`${scope.verificationDet.videoURL}?${scope.verificationDet.videoURLParams}`, loadWebCamSuccess, loadWebCamFailure);
          };
        }
      }
    };
    return directive;
  }
})();



