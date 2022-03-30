(function () {
  'use strict';

  angular.module('app.core').controller('IpWebcamCapturePopupController', IpWebcamCapturePopupController);

  function IpWebcamCapturePopupController($scope, $rootScope, data, $mdDialog, $q, $timeout, TRANSACTION, USER, CORE, ReceivingMaterialFactory, BaseService, DialogFactory, Upload) {
    const vm = this;
    vm.image = null;
    vm.duplicateImage = null;
    vm.caputeUMIDdet = data;
    vm.documentTypeList = [];
    vm.verification = data.verification;
    vm.webcamDet = {
      error: true,
      connecting: false
    };
    vm.WebcamURLConfigNote = TRANSACTION.WebcamURLConfigNote;
    if (window.location.protocol === CORE.Protocol.withSSL) {
      vm.WebcamURLConfigNote = vm.WebcamURLConfigNote.replace(CORE.Protocol.withoutSSL, CORE.Protocol.withSSL);
    }
    vm.Entity = CORE.AllEntityIDS.Component_sid_stock;
    const loginUserDetails = BaseService.loginUser;
    vm.isExit = false;
    vm.isCaptureForCofC = false;
    let uploadFileList = [];

    /** Get document type list */
    const getGenericCategoryByType = () => {
      vm.documentTypeList = [];
      return ReceivingMaterialFactory.getGenericCategoryByType().query({ type: CORE.CategoryType.DocumentType.Name }).$promise.then((res) => {
        if (res && res.data) {
          vm.documentTypeList = res.data;
          const objType = _.find(vm.documentTypeList, { gencCategoryName: CORE.FileGroup.PartsPicture });
          vm.FileGroupId = objType ? objType.gencCategoryID : null;
          //$timeout(() => {
          //  if (vm.autoDocumentType) {
          //    vm.autoDocumentType.keyColumnId = vm.FileGroupId;
          //  }
          //},1000);
        }
        return $q.resolve(vm.documentTypeList).then(() => {
          if (vm.autoDocumentType) {
            vm.autoDocumentType.keyColumnId = vm.FileGroupId;
          }
        });
      }).catch(error => BaseService.getErrorLog(error));
    };

    /** Bind auto complete for document type */
    function initAutoComplete() {
      vm.autoDocumentType = {
        columnName: 'gencCategoryName',
        keyColumnName: 'gencCategoryID',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnId: vm.FileGroupId || null,
        addData: {
          headerTitle: CORE.CategoryType.DocumentType.Title,
          popupAccessRoutingState: [USER.ADMIN_DOCUMENT_TYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.CategoryType.DocumentType.ManageTitle
        },
        inputName: CORE.CategoryType.DocumentType.Title,
        placeholderName: CORE.CategoryType.DocumentType.Title,
        isRequired: true,
        isAddnew: true,
        callbackFn: getGenericCategoryByType,
        onSelectCallback: (item) => {
          if (item) {
            vm.FileGroupId = item.gencCategoryID;
          }
          else {
            vm.FileGroupId = null;
          }
        }
      };
    }

    /** discard captured image */
    vm.discardLast = () => {
      if (vm.isExit) {
        vm.verification.videoURL = null;
        $mdDialog.hide({ discardImg: true });
      }
      else {
        vm.autoDocumentType.keyColumnId = null;
        vm.iszoom = false;
        vm.image.path = null;
      }
      vm.isCaptureForCofC = false;
    };

    //[S] Dharam: 04/07/2020 File Upload in chanks
    $scope.$watch('loaderVisible', (newValue) => {
      if (newValue) {
        $scope.timeoutWatch = $timeout(() => {
          /*max time to show infinite loader*/
        }, _configMaxTimeout);
        vm.cgBusyLoading = $scope.timeoutWatch;
      }
      else {
        if ($scope.timeoutWatch) {
          $timeout.cancel($scope.timeoutWatch);
        }
      }
    });

    const generateResuambleObject = () => {
      let vResumable = new Resumable({
        target: `${CORE.API_URL}genericFileList/uploaChunkGenericFiles`,
        chunkSize: _chunkSizeInMB * 1024 * 1024,
        simultaneousUploads: 1,
        testChunks: false,
        throttleProgressCallbacks: 1,
        headers: {
          Authorization: `Bearer ${loginUserDetails.token}`
        }
      });

      if (!vResumable.support) {
        $('.resumable-error').show();
      }
      else {
        // Show a place for dropping/selecting files
        $('.resumable-drop').show();
        //vResumable.assignDrop($('.resumable-drop')[0]);
        //vResumable.assignBrowse($('.resumable-browse')[0]);

        // Handle file add event
        vResumable.on('fileAdded', (file) => {

          if (file && file.resumableObj && file.resumableObj.opts && file.resumableObj.opts.query && file.resumableObj.opts.query.documentDetail) {
            let queryObj = JSON.parse(file.resumableObj.opts.query.documentDetail);
            if (queryObj) {
              if (queryObj.fileGroupBy !== file.file.fileGroupId) {
                queryObj.fileGroupBy = file.file.fileGroupId;
                file.resumableObj.opts.query = {
                  documentDetail: JSON.stringify(queryObj)
                };
              }
              else {
                file.resumableObj.opts.query = {
                  documentDetail: JSON.stringify(queryObj)
                };
              }
            }
          }

          // Show progress pabr
          $('.resumable-progress, .resumable-list').show();
          // Show pause, hide resume
          $('.resumable-progress .progress-resume-link').hide();
          $('.resumable-progress .progress-pause-link').show();
          // Add the file to the list
          $('.resumable-list').append('<li class="resumable-file-' + file.uniqueIdentifier + '">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
          $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-name').html(file.fileName);
          // Actually start the upload
          vResumable.upload();
        });
        vResumable.on('pause', () => {
          // Show resume, hide pause
          $('.resumable-progress .progress-resume-link').show();
          $('.resumable-progress .progress-pause-link').hide();
        });
        vResumable.on('complete', () => {
          uploadFileList = [];
          vm.isCaptureForCofC = false;
          // Hide pause/resume when the upload has completed
          $scope.loaderVisible = false;
          BaseService.currentPageFlagForm = [];
          $('.resumable-list').empty();
          $('.resumable-progress').hide();

          $rootScope.$emit('refreshDocuments');
          vm.discardLast();

        });
        vResumable.on('fileSuccess', () => {
          uploadFileList = [];
          vm.isCaptureForCofC = false;
        });
        vResumable.on('fileError', (file, message) => {
          var statusDetail = '';
          try {
            statusDetail = JSON.parse(message);
          }
          catch (e) {
            statusDetail = true;
          }
          if (typeof (statusDetail) === 'object' && statusDetail.status === CORE.ApiResponseTypeStatus.FAILED && typeof (statusDetail.errors) === 'object') {
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
          $('.progress-bar').css({ width: Math.floor(vResumable.progress() * 100) + '%' });
        });
        vResumable.on('cancel', () => {
        });
        vResumable.on('uploadStart', () => {
          // Show pause, hide resume
        });
      }

      return vResumable;
    };

    //[E] Dharam: 04/07/2020 File Upload in chanks

    /** save image after zoom in/out check */
    vm.saveImage = (isExit) => {
      if (vm.autoDocumentType && vm.autoDocumentType.keyColumnId) {
        vm.ipWebCamCaptureImgForm.$dirty = true;
      }

      if (BaseService.focusRequiredField(vm.ipWebCamCaptureImgForm)) {
        return;
      }

      vm.isExit = isExit;
      let captureImageObj = Upload.dataUrltoBlob(vm.image.path, vm.image.name);
      captureImageObj.fileName = vm.image.name;
      captureImageObj.fileGroupId = vm.FileGroupId;
      uploadFileList.push(captureImageObj);
      if (vm.isCaptureForCofC) {
        let duplicateImageObj = Upload.dataUrltoBlob(vm.duplicateImage.path, vm.duplicateImage.name);
        duplicateImageObj.fileName = vm.duplicateImage.name;
        duplicateImageObj.fileGroupId = vm.duplicatePictureFileGroupId;
        uploadFileList.push(duplicateImageObj);
      }

      let vResumable = generateResuambleObject();

      uploadFileList.forEach((file, index) => {
        var documentDetail = {
          'refTransID': vm.caputeUMIDdet.cstID,
          'entityID': vm.Entity.ID,
          'gencFileOwnerType': vm.Entity.Name,
          'originalname': file.fileName,
          'isShared': true,
          'fileGroupBy': file.fileGroupId,
          'fileSize': file.size
        };

        $scope.loaderVisible = true;
        BaseService.currentPageFlagForm = [true];
        vResumable.opts.query = {
          documentDetail: JSON.stringify(documentDetail)
        };

        vResumable.addFile(file);
      });
    };

    /**
     * Zoom in for captured image
     * @param {any} viewer
     */
    vm.zoomIn = (viewer) => {
      if (vm[viewer]) {
        const zoomValue = vm[viewer].zoomValue + 50;
        vm[viewer].zoom(zoomValue);
      }
    };

    /**
     * Zoom out for captured image
     * @param {any} viewer
     */
    vm.zoomOut = (viewer) => {
      if (vm[viewer]) {
        const zoomValue = vm[viewer].zoomValue - 50;
        vm[viewer].zoom(zoomValue);
      }
    };

    /** After zoom/in out, fit to screen */
    vm.fitToScreen = () => {
      if (vm.captureImageViewer) {
        vm.captureImageViewer.refresh();
      }
    };

    /** Redirect to document type master */
    vm.goToDocumentType = () => {
      BaseService.goToGenericCategoryDocumentTypeList();
    };

    /** Edit webcam URL */
    vm.editVideoURL = () => {
      vm.verification.liveStreamURL = vm.verification.videoStreamURL;
      vm.verification.showVideoURL = true;
    };

    /** Refresh webcam capture view */
    vm.refreshVideoURL = () => {
      vm.verification.videoURLParams = new Date().getTime();
      vm.webcamDet.refreshVideoURL();
    };

    /** start capturing */
    vm.startCapturingImage = () => {
      vm.image = {
        path: `${vm.verification.videoStreamURL}/photoaf.jpg`,
        name: vm.verification.packingSlipSupplierCode && vm.verification.packingSlipNumber ? `${vm.verification.uid}-${new Date().getTime()}-${vm.verification.packingSlipSupplierCode}${vm.verification.packingSlipNumber}.png` : `${vm.verification.uid}-${new Date().getTime()}.png`,
        entity: CORE.AllEntityIDS.Component_sid_stock,
        refTransID: vm.cstID
      };

      vm.capturingImage = true;
      toDataURL(`${vm.verification.videoStreamURL}/photoaf.jpg`, (dataUrl) => {
        const objType = _.find(vm.documentTypeList, (data) => { data.gencCategoryName === CORE.FileGroup.PartsPicture; });
        vm.FileGroupId = objType ? objType.gencCategoryID : null;
        $timeout(() => {
          if (vm.autoDocumentType) {
            vm.autoDocumentType.keyColumnId = vm.FileGroupId;
          }
        }, 500);
        vm.capturingImage = false;
        if (dataUrl) {
          if (!vm.autoDocumentType) {
            initAutoComplete();
          }
          getGenericCategoryByType();
          vm.image.path = dataUrl;
          vm.verification.photoURL = `${vm.verification.videoStreamURL}/photoaf.jpg`;
          vm.iszoom = true;

          $timeout(() => {
            vm.captureImageViewer = ImageViewer('#captureFullImg', { snapView: false });
          }, 1000);
        }
      }, () => {
        vm.capturingImage = false;
      });
    }

    /** take capture duplicate for cofc  **/
    vm.takeDuplicatePicture = () => {
      if (vm.isCaptureForCofC) {
        vm.duplicateImage = angular.copy(vm.image);
        vm.duplicateImage.name = vm.verification.packingSlipSupplierCode && vm.verification.packingSlipNumber ? `${vm.verification.uid}-${new Date().getTime()}-${vm.verification.packingSlipSupplierCode}${vm.verification.packingSlipNumber}.png` : `${vm.verification.uid}-${new Date().getTime()}.png`;

        let objType = _.find(vm.documentTypeList, (data) => { return data.gencCategoryName == CORE.FileGroup.COFC });
        vm.duplicatePictureFileGroupId = objType ? objType.gencCategoryID : null;

      } else {
        vm.duplicateImage.path = null;
      }
    };

    // capture the image
    const toDataURL = (url, callback) => {
      try {
        vm.httpRequest = new XMLHttpRequest();
        vm.httpRequest.onload = function () {
          var fileReader = new FileReader();
          fileReader.onloadend = function () {
            callback(fileReader.result);
          };
          fileReader.readAsDataURL(vm.httpRequest.response);
        };
        vm.httpRequest.open('GET', url);
        vm.httpRequest.responseType = 'blob';
        vm.httpRequest.send();
      }
      catch (exception) {
        // exception block
      }
    };

    /** Cancel capturing process */
    vm.cancelCapturing = function () {
      if (vm.httpRequest) {
        vm.httpRequest.abort();
      }
      vm.capturingImage = false;
      vm.iszoom = false;
      vm.image.path = null;
      vm.verification.photoURL = null;
      if (vm.duplicateImage) {
        vm.duplicateImage.path = null;
      }
    };

    vm.close = () => {
      vm.verification.videoURL = null;
      $mdDialog.hide({ discardImg: true });
    };

    $scope.$on('$destroy', function () {
      $scope.$applyAsync(() => {
        vm.verification.videoURL = null;
      });
    });

    let stateChangeSuccessCall = $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      vm.verification.videoURL = null;
    });
  }
})();
