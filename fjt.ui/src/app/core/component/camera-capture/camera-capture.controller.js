(function () {
  'use strict';

  angular.module('app.core').controller('CameraCaptureController', CameraCaptureController);

  function CameraCaptureController(data, DialogFactory, $scope, $timeout, USER, $mdDialog) { // eslint-disable-line func-names
    const vm = this;
    vm.resultImage = {};
    vm.tracks = [];
    vm.cancel = () => {
      vm.tracks.forEach(track => track.stop());
      DialogFactory.closeDialogPopup();
    };

    var _video = null;

    vm.patOpts = { x: 0, y: 0, w: 100, h: 100 };

    // Setup a channel to receive a video property
    // with a reference to the video element
    // See the HTML binding in main.html
    vm.channel = {
      videoHeight: 500,
      videoWidth: 700,
    };

    vm.webcamError = false;
    vm.onError = (err) => {
      // console.log("1.CameraCaptureError - " + err);
      // console.log("2.err.name - " + err.name);
      // console.log("3.err.message - " + err.message);
      if (err && err.name && err.message) {
        var model = {
          multiple: true,
          title: err.name,
          textContent: err.message
        };
        DialogFactory.alertDialog(model);
        //$mdDialog.cancel();
      } else {
        $timeout(() => {
          $scope.$apply(() => {
            vm.webcamError = true;
          });
        }, 0);
      }
    };

    vm.onSuccess = function () {
      // The video element contains the captured camera data
      _video = vm.channel.video;
      $timeout(() => {
        $scope.$apply(() => {
          vm.patOpts.w = _video.width;
          vm.patOpts.h = _video.height;
          //vm.showDemos = true;
        });
      }, 0);
    };

    vm.onStream = function (stream) {
      vm.tracks = stream.getTracks();
    };

    vm.makeSnapshot = function () {
      if (_video) {
        vm.resultImage.croppedImage = getVideoData(vm.patOpts.x, vm.patOpts.y, vm.patOpts.w, vm.patOpts.h);
        vm.tracks.forEach(track => track.stop());
        DialogFactory.hideDialogPopup(vm.resultImage);
      }
    };

    var getVideoData = function getVideoData(x, y, w, h) {
      var hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = _video.width;
      hiddenCanvas.height = _video.height;
      var ctx = hiddenCanvas.getContext('2d');
      ctx.drawImage(_video, 0, 0, _video.width, _video.height);
      return hiddenCanvas.toDataURL();
    };

    vm.isAccessBackCamera = null;
    vm.devices = [];
    vm.flipCamera = () => {
      vm.isAccessBackCamera = (vm.isAccessBackCamera !== null && vm.isAccessBackCamera !== undefined) ? !vm.isAccessBackCamera : false;
      vm.webcamError = false;
    };
  }
})();
