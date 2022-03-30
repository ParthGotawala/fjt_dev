(function () {
    'use strict';

    angular
        .module('app.admin.user')
        .controller('ImageCropController', ImageCropController);

  function ImageCropController(data, $mdDialog, $scope, CORE, DialogFactory) {
    const vm = this;
    vm.file = data;
    vm.profileImageSize = CORE.PROFILE_IMG_SIZE;
    vm.isProfileImage = data ? (data.isProfileImage ? data.isProfileImage : false) : false;
    if (vm.isProfileImage) {
      vm.profileImageNotification = CORE.MESSAGE_CONSTANT.PROFILE_IMAGE_NOTIFICATION;
    }

    vm.resultImage = {};
    const reader = new window.FileReader();
    reader.readAsDataURL(vm.file);
    reader.onloadend = () => {
      vm.imageUrl = reader.result;
      $scope.$applyAsync();
    };

    vm.ok = () => {
      if (vm.isProfileImage) {
        // var byteLengthOfImage = parseInt((vm.resultImage.croppedImage).replace(/=/g, "").length * 0.75);
        // var imageSizeInByte = byteLengthOfImage / 1000;
        if (parseInt(vm.file.size) > CORE.AllowedImageUploadSizeForProfileInByte) {
          const model = {
            title: CORE.MESSAGE_CONSTANT.INVALID_IMAGE_UPLOAD_SIZE_FOR_PROFILE,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return;
        }
      }
      $mdDialog.hide(vm.resultImage);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
