/* eslint-disable arrow-body-style */
(function () {
  'use strict';
  angular.module('app.admin.picturestation').controller('PictureStationController', PictureStationController);
  /** @ngInject */
  function PictureStationController($rootScope, $scope, $q, $timeout, CORE, USER, Upload, socketConnectionService, PRICING, ComponentFactory, PictureStationFactory, DialogFactory, BaseService, ReceivingMaterialFactory, RoleFactory) {
    const vm = this;
    const loginUserDetails = BaseService.loginUser;
    vm.documentTypeList = [];
    vm.successUpload = 0;
    vm.pictureStation = {
      captureCounter: null,
      rotationTime: null,
      captureInterval: null,
      capturePerCamera: null,
      noOfCamera: null,
      capturePerRotation: null
    };
    vm.activeCameraList = [];
    vm.onlineCounter = 0;
    vm.docOpenType = 1;
    vm.camGroupList = [];
    vm.entityName = CORE.AllEntityIDS.Component.Name;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.progressTable = false;
    vm.docOpenType = 1;
    vm.LabelConstant = {
      Assembly: CORE.LabelConstant.Assembly
    };
    vm.isActivityStarted = false;
    vm.splitPaneFirstProperties = {};
    vm.custcameraGroup = null;
    vm.noOfLiveCamera = null;
    vm.cameraList = [];
    vm.batchIndex = 0;
    vm.picturesStatus = {
      totalCaptured: 0,
      inProgress: 0,
      uploadFailed: 0,
      captureFailed: 0,
      completed: 0
    };

    let cameraInterval = null;

    /** Get document type ID for part picture */
    const getGenericCategoryByType = () => {
      vm.documentTypeList = [];
      ReceivingMaterialFactory.getGenericCategoryByType().query({
        type: CORE.CategoryType.DocumentType.Name
      }).$promise.then((res) => {
        if (res && res.data) {
          vm.documentTypeList = res.data;
          const objType = _.find(vm.documentTypeList, {
            gencCategoryName: CORE.FileGroup.PartsPicture
          });
          vm.FileGroupId = objType ? objType.gencCategoryID : null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Initialize AutoComplete Camera Group */
    const initAutoComplete = () => {
      /** AutoComplete Camera Group */
      vm.autoCompleteCamGroup = {
        columnName: 'cameraGroup',
        keyColumnName: 'cameraGroup',
        keyColumnId: null,
        inputName: 'CameraGroup',
        placeholderName: 'Type here to search group',
        isRequired: false,
        onSelectCallbackFn: (item) => {
          vm.noOfLiveCamera = 0;
          if (item) {
            vm.custcameraGroup = item.cameraGroup;
            getCameraListByGroup();
          }
          else {
            vm.custcameraGroup = null;
            vm.cameraList = [];
            if (cameraInterval) {
              clearInterval(cameraInterval);
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query
          };
          return getCamGroupSearch(searchObj);
        }
      };

      /** AutoComplete Assy ID */
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'SearchAssy',
        placeholderName: 'Type here to search assembly',
        isRequired: false,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.assemblyHash = item.mfgPN;
            vm.assemblyDescr = item.mfgPNDescription;
            vm.assyID = item.id;
            $timeout(() => {
              if (vm.autoCompleteRoles && vm.roles.length > 0 && vm.assyID) {
                const defaultRole = _.find(vm.roles, { name: CORE.Role.Operator });
                vm.autoCompleteRoles.keyColumnId = vm.roleID = defaultRole ? defaultRole.id : null;
                $scope.$broadcast('roleIdFromPictureStation', vm.roleID);
              }
            });
          } else {
            vm.assemblyHash = null;
            vm.assemblyDescr = null;
            vm.assyID = null;
          }
        },
        onSearchFn: (query) => {
          vm.assyID = null;
          vm.assemblyHash = null;
          vm.assemblyDescr = null;
          const searchObj = {
            query: query,
            type: 'AssyID'
          };
          return getPartSearch(searchObj);
        }
      };

      /** AutoComplete Role */
      vm.autoCompleteRoles = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Roles',
        placeholderName: 'Role',
        isRequired: true,
        isAddnew: false,
        callbackFn: getRoles,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.roleID = item.id;
            //Bind Role permision
            $scope.$broadcast('roleIdFromPictureStation', vm.roleID);
          }
          else {
            vm.roleID = null;
          }
        }
      };
    };

    /**
     * Get camera group list by search text
     * @param {any} searchObj
     */
    const getCamGroupSearch = (searchObj) => PictureStationFactory.getAllCameraList().query(searchObj).$promise.then((camGroupList) => {
      if (camGroupList && camGroupList.data) {
        vm.camGroupList = camGroupList.data;
      } else {
        vm.camGroupList = [];
      }
      return vm.camGroupList;
    }).catch((error) => BaseService.getErrorLog(error));

    /** Get camera list by selected group */
    const getCameraListByGroup = () => {
      if (vm.custcameraGroup) {
        vm.cameraList = [];
        PictureStationFactory.getGroupCameraList().query({
          cameraGroup: vm.custcameraGroup
        }).$promise.then((component) => {
          vm.cameraList = component.data || [];
          vm.pictureStation.noOfCamera = vm.cameraList.length;
          if (vm.pictureStation.rotationTime > 0 && vm.pictureStation.captureInterval > 0) {
            vm.calculateRotationSymmary();
            vm.progressTable = false;
          }
          vm.cameraCheckStatusInterval();
          cameraInterval = setInterval(() => {
            vm.cameraCheckStatusInterval();
          }, _configCameraStatusTime);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /** Calculate Rotation Camera - Evaluates all readings */
    vm.calculateRotationSymmary = function () {
      if (vm.pictureStation.rotationTime > 0 && vm.pictureStation.captureInterval > 0) {
        vm.pictureStation.capturePerCamera = Math.floor(parseInt(vm.pictureStation.rotationTime) / parseInt(vm.pictureStation.captureInterval)) || 0;
        vm.pictureStation.capturePerRotation = parseInt(vm.pictureStation.capturePerCamera) * vm.pictureStation.noOfCamera;
      }
    };

    /**
     * Get assembly list  by search text
     * @param {any} searchObj
     */
    const getPartSearch = (searchObj) => ComponentFactory.getAllAssemblyBySearch().save({
      listObj: searchObj
    }).$promise.then((assyIDList) => {
      if (assyIDList && assyIDList.data) {
        vm.assyList = assyIDList.data.data;
      } else {
        vm.assyList = [];
      }
      return vm.assyList;
    }).catch((error) => BaseService.getErrorLog(error));

    /** Get list of roles */
    const getRoles = () => {
      return RoleFactory.rolePermission().query().$promise.then((d) => {
        vm.roles = d.data || [];

        if (vm.assyID && vm.roles.length > 0 && vm.autoCompleteRoles) {
          const defaultRole = _.find(vm.roles, { name: CORE.Role.Operator });
          vm.autoCompleteRoles.keyColumnId = vm.roleID = defaultRole ? defaultRole.id : null;
          $scope.$broadcast('roleIdFromPictureStation', vm.roleID);
        }

        return vm.roles;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /** Invoke on page load */
    function active() {
      getGenericCategoryByType();
      initAutoComplete();
      getRoles();
      connectSocket();
    }

    active();

    /** This function call on configured interval to check camera status */
    vm.cameraCheckStatusInterval = () => {
      vm.noOfLiveCamera = _.filter(vm.cameraList, { status: true }).length;
      vm.updateCameraLiveStatus();
    };

    /** Check all camera status (Online/Offline) */
    vm.updateCameraLiveStatus = () => {
      if (vm.cameraList && vm.cameraList.length > 0) {
        vm.cameraList.forEach((item, index) => {
          item.status = false;
          const videoUrl = `${item.cameraURL}/video?${new Date().getTime()}`;
          checkWebCamAccess(videoUrl, index, loadWebCamSuccess, loadWebCamFailure);
        });
      }
      else {
        vm.noOfLiveCamera = 0;
        if (cameraInterval) {
          clearInterval(cameraInterval);
        }
      }
    };

    //Check Camera Status
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
          vm.cameraList[index].status = true;
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
          vm.cameraList[index].status = false;
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
      vm.noOfLiveCamera = _.filter(vm.cameraList, { status: true }).length;
    }

    function loadWebCamFailure() {
      vm.noOfLiveCamera = _.filter(vm.cameraList, { status: true }).length;
    }

    /** Refresh camera list */
    vm.refreshCameraList = () => {
      vm.noOfLiveCamera = 0;
      getCameraListByGroup();
    };

    /** Reset form  */
    vm.reset = function () {
      Object.keys(vm.pictureStation).forEach((props) => { if (props !== 'noOfCamera') { vm.pictureStation[props] = null; } });
      vm.isActivityStarted = false;
      vm.successUpload = 0;
      vm.progressTable = false;
      vm.dirtyCount = 0;
      vm.assyID = null;
      vm.assemblyHash = null;
      vm.assemblyDescr = null;
      vm.roleID = null;
      vm.autoCompleteAssy.searchText = '';
      vm.autoCompleteRoles.keyColumnId = null;
      vm.batchIndex = 0;
      vm.folderName = null;
    };

    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on(CORE.EventName.sendPartPictureSave, fileStatus);
    }

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.sendPartPictureSave, fileStatus);
    }

    $scope.$on('$destroy', () => {
      // Remove socket listeners
      clearInterval(cameraInterval);
      clearInterval(vm.startInterval);
      removeSocketListener();
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function fileStatus(data) {
      if (vm.activityUUID && vm.activityUUID === data.activityUUID && vm.isActivityStarted) {
        vm.picturesStatus.completed++;
        checkActivityStopStatus();
      }
    }

    function checkActivityStopStatus() {
      console.log(`vm.pictureStation.capturePerCamera ${vm.pictureStation.capturePerCamera} * vm.onlineCounter ${vm.onlineCounter} = ${(vm.pictureStation.capturePerCamera * vm.onlineCounter)} completed ${vm.picturesStatus.completed} + captureFailed ${vm.picturesStatus.captureFailed} + uploadFailed ${vm.picturesStatus.uploadFailed} = ${(vm.picturesStatus.completed + vm.picturesStatus.captureFailed + vm.picturesStatus.uploadFailed)}`);
      if ((vm.pictureStation.capturePerCamera * vm.onlineCounter) === (vm.picturesStatus.completed + vm.picturesStatus.captureFailed + vm.picturesStatus.uploadFailed)) {
        $rootScope.$emit('refreshDocuments');
        vm.stop();
      }
    }

    /** Open pop-up to check live stream of selected group cameras */
    vm.testCamera = function () {
      DialogFactory.dialogService(
        CORE.MULTI_CAMERA_MODAL_CONTROLLER,
        CORE.MULTI_CAMERA_MODAL_VIEW,
        event,
        {
          cameraList: vm.cameraList
        }
      ).then(
        (state) => {
          if (state === 'start') {
            vm.start();
          }
          else {
            vm.refreshCameraList();
          }
        },
        (err) => {
          BaseService.getErrorLog(err);
        });
    };

    /**
     * Max length validation
     * @param {any} maxLength
     * @param {any} enterTextLength
     */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    ///** Generate Resumable object */
    const vResumable = new Resumable({
      target: `${CORE.API_URL}camera/getPicturesInQueue`,
      chunkSize: _chunkSizeInMB * 1024 * 1024,
      simultaneousUploads: 1,
      testChunks: false,
      throttleProgressCallbacks: 1,
      headers: {
        Authorization: `Bearer ${loginUserDetails.token}`
      }
    });
    if (!vResumable.support) {
      //   $('.resumable-error').show();
    } else {
      // Handle file add event
      vResumable.on('fileAdded', () => {
        vResumable.upload();
        vm.picturesStatus.totalCaptured++;
      });
      vResumable.on('pause', () => {
        // Show resume, hide pause
        //  $('.resumable-progress .progress-resume-link').show();
        //$('.resumable-progress .progress-pause-link').hide();
      });
      vResumable.on('complete', () => {
        // Hide pause/resume when the upload has completed
        $scope.loaderVisible = false;
        $('.resumable-list').empty();
        $('.resumable-progress').hide();
      });
      vResumable.on('fileSuccess', () => {
        vm.picturesStatus.inProgress++;
      });
      vResumable.on('fileError', (file, message) => {
        vm.picturesStatus.uploadFailed++;
        checkActivityStopStatus();
        let statusDetail = '';
        try {
          statusDetail = JSON.parse(message);
        } catch (e) {
          statusDetail = true;
        }
        if (typeof statusDetail === 'object' && statusDetail.status === CORE.ApiResponseTypeStatus.FAILED && typeof statusDetail.errors === 'object') {
          const errorDetail = statusDetail.errors;
          const model = {
            messageContent: errorDetail.messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        }
      });
      vResumable.on('fileProgress', (file) => {
        // Handle progress for both the file and the overall upload
        $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html(Math.floor(file.progress() * 100) + '%');
        $('.progress-bar').css({
          width: Math.floor(vResumable.progress() * 100) + '%'
        });
      });
      vResumable.on('cancel', () => { });
      vResumable.on('uploadStart', () => {
        // Show pause, hide resume
      });
    }

    vm.addEditRecord = (data, ev) => {
      DialogFactory.dialogService(USER.CAMERA_ADD_UPDATE_MODAL_CONTROLLER, USER.CAMERA_ADD_UPDATE_MODAL_VIEW, ev, data).then(
        () => {
          vm.refreshCameraList();
        },
        (err) => BaseService.getErrorLog(err));
    };
    vm.goToCameraList = () => {
      BaseService.goToCameraList();
    };
    vm.goToAssyIDList = () => {
      BaseService.goToPartList();
    };
    vm.goToRoleList = () => {
      BaseService.goToRoleAddUpdate();
    };

    /** Start Activity */
    vm.start = () => {
      vm.isActivityStarted = true;
      vm.picturesStatus = {
        totalCaptured: 0,
        inProgress: 0,
        uploadFailed: 0,
        captureFailed: 0,
        completed: 0
      };
      if (BaseService.focusRequiredField(vm.CameraGroupForm, false) || BaseService.focusRequiredField(vm.CameraForm, false)) {
        vm.isActivityStarted = false;
        return;
      }

      vm.activeCameraList = _.filter(vm.cameraList, { status: true });
      vm.onlineCounter = vm.activeCameraList.length;
      if (vm.onlineCounter < vm.pictureStation.noOfCamera) {
        if (vm.onlineCounter === 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.NO_ONLINE_CAMERA_AVAILABLE);
          messageContent.message = stringFormat(messageContent.message);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          vm.isActivityStarted = false;
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.CAPTURE_IMAGES_ONLINE_CAMERA_CONFIRMATION);
          messageContent.message = stringFormat(messageContent.message, (vm.pictureStation.noOfCamera - vm.onlineCounter), vm.pictureStation.noOfCamera, vm.onlineCounter);
          const model = {
            messageContent: messageContent,
            multiple: true,
            btnText: 'yes'
          };
          DialogFactory.messageConfirmDialog(model).then((yes) => {
            if (yes) {
              vm.uploadManager(vm.onlineCounter, vm.activeCameraList);
            }
            else {
              vm.isActivityStarted = false;
            }
          }, () => {
            vm.isActivityStarted = false;
          });
        }
      } else {
        vm.uploadManager(vm.onlineCounter, vm.activeCameraList);
      }
    };

    /**
         * Start Capturing Images
         * @param {any} onlineCounter
         * @param {any} activeCameraList
         */
    vm.uploadManager = (onlineCounter, activeCameraList) => {
      vm.progressTable = true;
      vm.isActivityStarted = true;
      vm.batchIndex = 0;
      vm.pictureStation.captureCounter = 0;
      BaseService.currentPageFlagForm = [true];
      vm.activityUUID = getGUID();
      if (vm.startInterval) {
        clearInterval(vm.startInterval);
      }
      vm.startInterval = setInterval(() => {
        vm.batchIndex++;
        activeCameraList.forEach((element) => {
          var totalRoundsToCapture = onlineCounter * vm.pictureStation.capturePerCamera;
          if (vm.pictureStation.captureCounter < totalRoundsToCapture) {
            vm.pictureStation.captureCounter++;
            vm.uploadPicture(element, vm.batchIndex);
          } else {
            // vm.stop();
            if (vm.startInterval) {
              clearInterval(vm.startInterval);
            }
          }
        });
      }, vm.pictureStation.captureInterval * 1000);
    };

    /**
     * Generate data to push on API for captured image
     * @param {any} element
     * @param {any} batchName
     */
    vm.uploadPicture = (element, batchName) => {
      const imageURL = `${element.cameraURL}/photoaf.jpg`;
      toDataURL(imageURL, (dataUrl) => {
        if (dataUrl && dataUrl.match(/:(.*?);/)) {
          const objType = _.find(vm.documentTypeList, { gencCategoryName: CORE.FileGroup.PartsPicture });
          vm.FileGroupId = objType ? objType.gencCategoryID : null;
          const captureImageObj = Upload.dataUrltoBlob(dataUrl, 'partpicture');
          captureImageObj.fileName = `${new Date().getTime()}.png`;
          captureImageObj.fileGroupId = vm.FileGroupId;
          const documentDetail = {
            gencFileOwnerType: CORE.AllEntityIDS.Component.Name,
            gencOriginalName: captureImageObj.fileName,
            fileSize: captureImageObj.size,
            assyID: vm.assyID,
            documentType: 'image/png',
            tags: element.name,
            batchName: batchName,
            folderName: vm.folderName,
            roleID: vm.roleID,
            fileGroupBy: captureImageObj.fileGroupId,
            entityID: CORE.AllEntityIDS.Component.ID,
            gencFileExtension: 'png',
            activityUUID: vm.activityUUID
          };
          vResumable.opts.query = {
            documentDetail: JSON.stringify(documentDetail)
          };
          vResumable.addFile(captureImageObj);
        } else {
          vm.picturesStatus.captureFailed++;
          checkActivityStopStatus();
        }
      }, () => {
          vm.picturesStatus.captureFailed++;
          checkActivityStopStatus();
      });
    };

    /**
     * Get image detail from URL
     * @param {any} url
     * @param {any} callback
     */
    const toDataURL = (url, callback) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            callback(reader.result);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = () => {
          vm.picturesStatus.captureFailed++;
          checkActivityStopStatus();
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      } catch (exception) {
        // exception block
      }
    };

    /** Stop activity (Capture image) */
    vm.stop = function () {
      vm.isActivityStarted = false;
      vm.activityUUID = null;
      if (vm.startInterval) {
        clearInterval(vm.startInterval);
      }
      BaseService.currentPageFlagForm = [false];
    };
  }
})();
