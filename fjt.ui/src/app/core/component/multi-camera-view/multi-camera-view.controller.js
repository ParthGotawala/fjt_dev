(function () {
  'use strict';
  angular.module('app.core').controller('MultiCameraController', MultiCameraController);

  function MultiCameraController($scope, data, $mdDialog, $timeout, USER, BaseService, DialogFactory) {
    const vm = this;
    vm.LivCamList = [];
    vm.cameraUpdateStatus = false;
    vm.groupName = data.cameraList[0].cameraGroup;
    data.cameraList.forEach((element, index) => {
      var newLivCam = {
        cameraindex: index,
        cameraGroup: element.cameraGroup,
        cameraName: element.name,
        id: element.id,
        cameraLink: element.cameraURL,
        cameraURL: element.cameraURL + '/video?' + new Date().getTime(),
        status: false,
        connecting: true
      };
      const videoUrl = `${element.cameraURL}/video?${new Date().getTime()}`;
      checkWebCamAccess(videoUrl, index, loadWebCamSuccess, loadWebCamFailure);
      vm.LivCamList.push(newLivCam);
    });
    vm.cancel = () => {
      if (vm.cameraUpdateStatus) {
        $mdDialog.hide();
      } else {
        $mdDialog.cancel();
      }
    };
    //camera status checker
    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(USER.CAMERA_ADD_UPDATE_MODAL_CONTROLLER, USER.CAMERA_ADD_UPDATE_MODAL_VIEW, ev, data).then(
        (newData) => {
          vm.cameraUpdateStatus = true;
          const newLivCam = {
            cameraindex: data.index,
            cameraGroup: newData.cameraGroup,
            cameraName: newData.name,
            id: newData.id,
            cameraLink: newData.cameraURL,
            cameraURL: newData.cameraURL + '/video?' + new Date().getTime(),
            status: false,
            connecting: true
          };
          vm.LivCamList[data.cameraindex] = newLivCam;
        },
        (err) => BaseService.getErrorLog(err));
    };
    vm.refreshVideoURL = (element, index) => {
      element.status = false;
      element.connecting = true;
      const videoUrl = `${element.cameraURL}/video?${new Date().getTime()}`;
      checkWebCamAccess(videoUrl, index, loadWebCamSuccess, loadWebCamFailure);
    };

    function checkWebCamAccess(url, index, success, failure) {
      const errors = {};
      const img = new Image();
      let loaded = false,
        errored = false;
      // Run only once, when `loaded` is false. If `success` is a function, it is called with `img` as the context.
      img.onload = function () {
        if (loaded) {
          return;
        }
        loaded = true;
        if (success && success.call) {
          vm.LivCamList[index].status = true;
          vm.LivCamList[index].connecting = false;
          success.call(img);
        }
      };
      // Run only once, when `errored` is false. If `failure` is a function, it is called with `img` as the context.
      img.onerror = function () {
        if (errored) {
          return;
        }
        errors[url] = errored = true;
        if (failure && failure.call) {
          vm.LivCamList[index].status = false;
          vm.LivCamList[index].connecting = false;
          vm.LivCamList[index].style = 'border: 0';
          failure.call(img);
        }
      };
      // If `url` is in the `errors` object, trigger the `onerror` callback.
      if (errors[url]) {
        img.onerror.call(img);
        return;
      }
      // Set the img src to trigger loading
      img.src = url;
      // If the image is already complete (i.e. cached), trigger the `onload` callback.
      if (img.complete) {
        img.onload.call(img);
      }
    }

    function loadWebCamSuccess() {
      vm.cameraLiveStatus = true;
    }

    function loadWebCamFailure() {
      vm.cameraLiveStatus = false;
    }
    vm.emitStart = () => {
      $mdDialog.hide('start');
    };
    vm.goToCameraList = () => {
      BaseService.goToCameraList();
    };
    vm.headerdata = [
      {
        label: 'Group',
        value: vm.groupName,
        displayOrder: 1,
        labelLinkFn: vm.goToCameraList
        // valueLinkFn: vm.goToManageSalesOrder
      }];

    $scope.$on('$destroy', () => {
      vm.LivCamList.forEach((element) => {
        element.cameraURL = null;
      });
    });
  }
})();
