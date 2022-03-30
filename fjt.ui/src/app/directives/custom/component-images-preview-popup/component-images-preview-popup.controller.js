(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponentImagesPreviewPopupController', ComponentImagesPreviewPopupController);

  /** @ngInject */
  function ComponentImagesPreviewPopupController($q, $scope, $timeout, $sce, data, CORE, USER, BaseService, DialogFactory) {
    var vm = this;
    vm.imagesList = data && data.imagesList ? data.imagesList : [];
    vm.selectedImageIndex = data && data.selectedImageIndex ? data.selectedImageIndex : 0;
    vm.headerText = data && data.headerText ? data.headerText : null;
    vm.LabelConstant = CORE.LabelConstant;
    vm.trustSrc = function (src) {
      return $sce.trustAsResourceUrl(src);
    }

    function getImageURL(url) {
      var encodedUrlString = url;
      if (url) {
        //encodeURI code added to encode image URLs contain "pdf" work in it by CC on date 25-06-2019 for BUG# 5982
        //now removing code to encodeURI() because images are coming broken after encode by AP on code 15-06-2020 for BUG# 20998
        /*if (_.includes(url, "pdf"))
          encodedUrlString = (encodeURI(url)).replace(/(^\w+:|^)/, '');
        else*/
          encodedUrlString = url.replace(/(^\w+:|^)/, '');
      }
      return encodedUrlString;
    }
    function displayCurrentImage() {
      vm.currentImageURL = null;
      if (vm.imagesList && vm.imagesList.length > 0) {

        if (vm.selectedImageIndex > vm.imagesList.length - 1) {
          vm.selectedImageIndex = 0;
        }
        else if (vm.selectedImageIndex < 0) {
          vm.selectedImageIndex = (vm.imagesList.length - 1);
        }
        var img = vm.imagesList[vm.selectedImageIndex];
        if (img) {
          vm.waitForNext = true;
          vm.is360Image = img.imageURL.endsWith(".html");
          vm.headerdata = [];
          vm.headerdata.push({
            label: vm.LabelConstant.MFG.PID,
            value: img.PIDCode,
            displayOrder: 1,
            labelLinkFn: vm.goToAssemblyList,
            valueLinkFn: vm.goToAssemblyDetails,
            valueLinkFnParams: {
              partID: img.partID
            },
            isCopy: true,
            isCopyAheadLabel: true,
            isAssy: true,
            isCopyAheadOtherThanValue: true,
            copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
            copyAheadValue: img.mfgPN,
            imgParms: {
              imgPath: img.rohsIcon ? stringFormat("{0}{1}{2}", CORE.WEB_URL, USER.ROHS_BASE_PATH, img.rohsIcon) : null,
              imgDetail: img.rohsName != null ? img.rohsName : null,
            }
          });

          $timeout(() => {
            vm.currentImageURL = null;
            if (img.id > 0) {
              vm.currentImageURL = getImageURL(img.imageURL);
            } else {
              vm.currentImageURL = img.imageURL;
            }
            $timeout(() => {
              vm.captureImageViewer = ImageViewer('#captureImg', {
                snapView: false
              });
              vm.captureImageViewer.refresh();
              vm.waitForNext = false;
            }, _configTimeout);
          });
        }
        else {
          vm.currentImageURL = CORE.NO_IMAGE_COMPONENT;
        }
      }
      else {
        vm.currentImageURL = CORE.NO_IMAGE_COMPONENT;
      }
    };

    vm.nextPrevImage = (indexIncrement) => {
      if (indexIncrement && indexIncrement != 0) {
        vm.selectedImageIndex = indexIncrement ? vm.selectedImageIndex + indexIncrement : vm.selectedImageIndex;
      }
      displayCurrentImage();
    }

    vm.zoomIn = () => {
      if (vm.captureImageViewer) {
        let zoomValue = vm.captureImageViewer.zoomValue + 50;
        vm.captureImageViewer.zoom(zoomValue);
      }
    };

    vm.zoomOut = () => {
      if (vm.captureImageViewer) {
        let zoomValue = vm.captureImageViewer.zoomValue - 50;
        vm.captureImageViewer.zoom(zoomValue);
      }
    };

    vm.resetCaptureImage = () => {
      if (vm.captureImageViewer) {
        vm.captureImageViewer.refresh();
      }
    };

    vm.goToAssemblyList = (data) => {
        BaseService.goToPartList();
    }

    vm.goToAssemblyDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
    }

    angular.element(() => {
      displayCurrentImage();
    });


    vm.cancel = () => {
      BaseService.currentPagePopupForm.pop();
      DialogFactory.closeDialogPopup();
    };
  }
})();
