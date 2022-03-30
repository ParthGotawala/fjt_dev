(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('entityImagesPreview', entityImagesPreview);

  /** @ngInject */
  function entityImagesPreview() {
    var directive = {
      restrict: 'E',
      scope: {
        documentList: '=',
        selectedDocIndex: '=?',
        headerData: '='
      },
      templateUrl: 'app/directives/custom/entity-images-preview/entity-images-preview.html',
      controller: entityImagesPreviewCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function entityImagesPreviewCtrl($scope, BaseService, CORE, $timeout, $sce) {
      var vm = this;
      vm.documentList = $scope.documentList ? $scope.documentList : [];
      vm.selectedDocIndex = $scope.selectedDocIndex ? $scope.selectedDocIndex : 0;
      vm.LabelConstant = CORE.LabelConstant;

      vm.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
      };

      const displayCurrentImage = () => {
        vm.isVideoFile = vm.isImageFile = vm.isAudioFile = vm.isPDFFile = false;
        vm.PDFFileArrayData = null;
        if (vm.documentList && vm.documentList.length > 0) {
          if (vm.selectedDocIndex > vm.documentList.length - 1) {
            vm.selectedDocIndex = 0;
          }
          else if (vm.selectedDocIndex < 0) {
            vm.selectedDocIndex = (vm.documentList.length - 1);
          }
          const docDet = vm.documentList[vm.selectedDocIndex];
          if (docDet) {
            $scope.headerData = [];
            $scope.headerData.push({
              label: 'Name',
              value: docDet.originalFileName,
              displayOrder: 1
            });
            if (docDet.gencFileType.indexOf('image/') !== -1) {
              vm.isImageFile = true;
              vm.waitForNext = true;
              vm.is360Image = docDet.docPathURL.endsWith('.html');
              vm.currentImageURL = null;
              $timeout(() => {
                vm.currentImageURL = docDet.docPathURL.replace(/(^\w+:|^)/, ''); //encodedUrlString
                $timeout(() => {
                  vm.captureImageViewer = ImageViewer('#captureImg', {
                    snapView: false,
                    zoom: 0
                  });
                  vm.captureImageViewer.refresh();
                  vm.waitForNext = false;
                }, 500);
              });
            }
            else if (docDet.gencFileType.indexOf('/pdf') !== -1) {
              vm.isPDFFile = true;
              vm.PDFFileArrayData = docDet.PDFRespArrayData;
              const url = `${docDet.docPathURL}`;
              vm.PDFFilePath = $sce.trustAsResourceUrl(url);
              BaseService.setBrowserTabTitleManually(); // to set browser tab title manually
              //vm.PDFFilePath = docDet.docPathURL;
            }
            else if (docDet.gencFileType.indexOf('video/') !== -1) {
              vm.isVideoFile = true;
              vm.videoFilePath = docDet.docPathURL;
            }
            else if (docDet.gencFileType.indexOf('audio/') !== -1) {
              vm.isAudioFile = true;
              vm.audioFilePath = docDet.docPathURL;
            }
          }
          else {
            vm.currentImageURL = CORE.NO_IMAGE_COMPONENT;
          }
        }
        else {
          vm.currentImageURL = CORE.NO_IMAGE_COMPONENT;
        }
      };

      // while click on next/prev button , view next image
      vm.nextPrevImage = (indexIncrement) => {
        if (indexIncrement && indexIncrement !== 0) {
          vm.selectedDocIndex = indexIncrement ? vm.selectedDocIndex + indexIncrement : vm.selectedDocIndex;
        }
        displayCurrentImage();
      };

      vm.zoomIn = () => {
        if (vm.captureImageViewer) {
          const zoomValue = vm.captureImageViewer.zoomValue + 50;
          vm.captureImageViewer.zoom(zoomValue);
        }
      };

      vm.zoomOut = () => {
        if (vm.captureImageViewer) {
          const zoomValue = vm.captureImageViewer.zoomValue - 50;
          vm.captureImageViewer.zoom(zoomValue);
        }
      };

      vm.resetCaptureImage = () => {
        if (vm.captureImageViewer) {
          vm.captureImageViewer.refresh();
        }
      };

      angular.element(() => {
        displayCurrentImage();
      });
    }
  }
})();
