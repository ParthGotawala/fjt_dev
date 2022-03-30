(function () {
  'use strict';

  angular
    .module('app.admin.camera')
    .controller('CameraAddUpdatePopupController', CameraAddUpdatePopupController);

  /** @ngInject */
  function CameraAddUpdatePopupController($scope, $mdDialog, $timeout, USER, $window, data, TRANSACTION, CORE, PictureStationFactory, CameraFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.isShowStreaming = false;
    vm.MESSAGE = USER.ADMIN_EMPTYSTATE.CAMERA_EMPTY;
    vm.CameraNamePattern = CORE.CameraNamePattern;
    vm.ipWebcamObj = TRANSACTION.IPWebCamConfiguration;
    vm.WebcamURLConfigNote = stringFormat('2. Camera URL: {0}', TRANSACTION.WebcamURLConfigNote);
    if ($window.location.protocol === CORE.Protocol.withSSL) {
      vm.WebcamURLConfigNote = vm.WebcamURLConfigNote.replace(CORE.Protocol.withoutSSL, CORE.Protocol.withSSL);
    }
    vm.webcamDet = {
      error: true,
      connecting: false
    };
    vm.camera = {
      isActive: true
    };
    vm.cameraActiveRadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };
    if (data && data.id) {
      vm.camera = angular.copy(data);
    }

    // Edit Camera Details
    if (vm.camera.id) {
      vm.cgBusyLoading = CameraFactory.getCameraDetailsById().query({ id: vm.camera.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.camera = response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.checkWebCamAccess = (url, success, failure) => {
      $timeout(() => {
        vm.webcamDet.connecting = true;
        const img = new Image();
        let loaded = false;
        let errored = false;
        const errors = [];

        // Run only once, when `loaded` is false. If `success` is a function, it is called with `img` as the context.
        img.onload = function () {
          if (loaded) {
            return;
          }

          loaded = true;

          if (success && success.call) {
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
      });
    };

    vm.loadWebCamSuccess = () => {
      vm.webcamDet.error = false;
      vm.webcamDet.connecting = false;
      vm.webcamDet.showVideoURL = false;
    };

    vm.loadWebCamFailure = () => {
      vm.webcamDet.error = true;
      vm.webcamDet.connecting = false;
    };

    // Save Camera Details
    vm.saveCamera = () => {
      if (BaseService.focusRequiredField(vm.cameraForm, false)) {
        return;
      }

      if ($window.location.protocol === CORE.Protocol.withSSL && !vm.camera.cameraURL.contains(CORE.Protocol.withSSL)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SSL_REQUIRED);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj).then(() => {
          setFocusByName('cameraURL');
        });
        return;
      }

      const objcamera = _.find(vm.cameraGroupList, (camera) => camera.cameraGroup === vm.autoCompleteCameraGroupType.keyColumnId);
      if (objcamera) {
        vm.camera.cameraGroup = objcamera.cameraGroup || vm.camera.cameraGroup;
      } else {
        vm.camera.cameraGroup = vm.autoCompleteCameraGroupType.searchText;
      }

      vm.cgBusyLoading = CameraFactory.saveCameraDetails().save(vm.camera).$promise.then((res) => {
        if (res.data) {
          vm.webcamDet.videoURL = null;
          $mdDialog.hide(res.data);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    vm.openConfigurationPopup = (ev) => {
      DialogFactory.dialogService(
        CORE.IPWEBCAM_CONFIGURATION_MODAL_CONTROLLER,
        CORE.IPWEBCAM_CONFIGURATION_MODAL_VIEW,
        ev,
        {}).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    //check ipAddress and node name unique validation
    vm.checkAlreadyExists = (columnValue, columnName) => {
      vm.isduplicate = false;
      if (vm.camera && (vm.camera.name || vm.camera.cameraURL)) {
        const objs = {
          id: vm.camera.id,
          name: vm.camera.name,
          cameraURL: vm.camera.cameraURL
        };

        vm.cgBusyLoading = CameraFactory.checkDuplicateCameraDetails().query({ objs: objs }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, columnName);

            const uniqueObj = {
              messageContent: messageContent,
              controlName: columnValue
            };

            const obj = {
              messageContent: uniqueObj.messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.camera[columnValue] = null;

            DialogFactory.messageAlertDialog(obj).then(() => {
              if (uniqueObj.controlName) {
                setFocusByName(uniqueObj.controlName);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    function initAutoComplete() {
      vm.autoCompleteCameraGroupType = {
        columnName: 'cameraGroup',
        keyColumnName: 'cameraGroup',
        keyColumnId: vm.camera.cameraGroup,
        inputName: 'Search Group',
        placeholderName: 'Search Group or Add',
        isRequired: true,
        isAddnew: false,
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteCameraGroupType.inputName
          };
          return getCameraGroupSearch(searchObj);
        }
      };
      if (data && data.cameraGroup) {
        $timeout(() => {
          vm.autoCompleteCameraGroupType.searchText = data.cameraGroup;
        });
      }
    }
    // get camera type list
    function getCameraGroupSearch(searchObj) {
      return PictureStationFactory.getAllCameraList().query(searchObj).$promise.then((camera) => {
        if (camera && camera.data) {
          vm.cameraGroupList = camera.data;
          if (!vm.autoCompleteCameraGroupType) {
            initAutoComplete();
          }
          return camera.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getCameraGroupSearch();
    // Show Streaming content
    vm.showStreaming = () => {
      if (vm.camera.cameraURL) {
        vm.isShowStreaming = true;
        if ($window.location.protocol === CORE.Protocol.withSSL && !vm.camera.cameraURL.contains(CORE.Protocol.withSSL)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SSL_REQUIRED);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj);
          return;
        }
        const liveStreamURL = vm.camera.cameraURL;
        vm.webcamDet.videoURL = liveStreamURL + '/video';
        vm.webcamDet.videoURLParams = new Date().getTime();
        if (vm.webcamDet) {
          vm.checkWebCamAccess(`${vm.webcamDet.videoURL}?${vm.webcamDet.videoURLParams}`, vm.loadWebCamSuccess, vm.loadWebCamFailure);
        }
        else {
          vm.webcamDet.showVideoURL = false;
        }
      } else {
        setFocusByName('cameraURL');
        return;
      }
    };

    // cancel Streaming
    vm.cancelStreaming = () => {
      vm.webcamDet.videoURL = null;
      vm.webcamDet.showVideoURL = false;
      vm.isShowStreaming = false;
    };

    /** Refresh webcam capture view */
    vm.refreshVideoURL = () => {
      vm.webcamDet.videoURLParams = new Date().getTime();
      vm.checkWebCamAccess(`${vm.webcamDet.videoURL}?${vm.webcamDet.videoURLParams}`, vm.loadWebCamSuccess, vm.loadWebCamFailure);
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
      vm.webcamDet.videoURL = null;
      const isdirty = vm.cameraForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.cameraForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };

    $scope.$on('$destroy', () => {
      $scope.$applyAsync(() => {
        vm.webcamDet.videoURL = null;
      });
    });

    $scope.$on('$stateChangeSuccess', () => {
      vm.webcamDet.videoURL = null;
    });
  }
})();
