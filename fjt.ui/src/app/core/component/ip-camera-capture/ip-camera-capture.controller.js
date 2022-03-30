(function () {
  'use strict';

  angular.module('app.core').controller('IpCameraCaptureController', IpCameraCaptureController);

  function IpCameraCaptureController(data, DialogFactory, $scope, $timeout, Upload, USER, $mdDialog) { // eslint-disable-line func-names
    const vm = this;
    vm.resultImage = {};
    vm.tracks = [];
    vm.cancel = () => {
      vm.tracks.forEach(track => track.stop());
      DialogFactory.closeDialogPopup();
    };
    var _video = null;

    //Edit Url
    vm.verification = {
      showVideoURL: true
    };
    vm.videoURL = null;

    const generateVideoURL = (newURL) => {
      if (newURL) {
        vm.cameraURL = newURL;
      }
      else {
        //get Url from localStorage
        vm.cameraURL = localStorage.getItem('liveStreamVideoURL');
      }

      if (vm.cameraURL) {
        //vm.videoURL = 'http://' + vm.cameraURL + '/video?' + new Date().getTime();
        vm.videoURL = vm.cameraURL + '/video?' + new Date().getTime();
      }
      else {
        vm.videoURL = null;
      }
    };

    generateVideoURL();

    //on updaeting url
    vm.onURLUpdate = (newURL) => {
      generateVideoURL(newURL);
    };
    vm.webcamDet = {};

    vm.patOpts = { x: 0, y: 0, w: 100, h: 100 };
    // Setup a channel to receive a video property
    // with a reference to the video element
    // See the HTML binding in main.html
    vm.channel = {
      videoHeight: 500,
      videoWidth: 700
    };

    vm.refreshURL = (refreshStatus) => {
      vm.webcamError = !refreshStatus;
    };

    vm.webcamError = true;
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


    let toDataURL = (url, callback) => {
      try {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function () {
          var fileReader = new FileReader();
          fileReader.onloadend = function () {
            callback(fileReader.result);
          };
          fileReader.readAsDataURL(httpRequest.response);
        };
        httpRequest.open('GET', url);
        httpRequest.responseType = 'blob';
        httpRequest.send();
      }
      catch (exception) {
        // handle this block: take care by Fenil
      }
    };

    vm.makeSnapshot = function () {
      //Capture Image
      var captureImageObj = null;
      //const imageURL = `http://${vm.cameraURL}/photoaf.jpg`;
      const imageURL = `${vm.cameraURL}/photoaf.jpg`;

      toDataURL(imageURL, (dataUrl) => {
        if (dataUrl && dataUrl.match(/:(.*?);/)) {
          captureImageObj = Upload.dataUrltoBlob(dataUrl, 'DocumentPicture');
          DialogFactory.hideDialogPopup(dataUrl);
        }
        });
      //if (_video) {
      //  vm.resultImage.croppedImage = getVideoData(vm.patOpts.x, vm.patOpts.y, vm.patOpts.w, vm.patOpts.h);
      // vm.tracks.forEach(track => track.stop());
      // }
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
