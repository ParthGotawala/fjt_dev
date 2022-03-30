(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('RohsAddUpdatePopupController', RohsAddUpdatePopupController);

	/** @ngInject */
	function RohsAddUpdatePopupController($mdDialog, data, CORE, USER, RFQTRANSACTION, DialogFactory, BaseService, $timeout, Upload) {
		const vm = this;
		vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
		vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
		vm.isSubmit = false;
		vm.rohs = null;
		vm.rohs = angular.copy(data);
		vm.rohsId = null;
		vm.isSubmit = false;
		vm.oldimgfile = null;
		if (data && data.id != null) {
			$timeout(() => {
			    if (vm.rohsForm) {
			        BaseService.checkFormValid(vm.rohsForm, false);
			        vm.rohsCopy = _.clone(vm.rohs);
			         vm.checkDirtyObject = {
			             columnName: ["rohsIcon"],
			                oldModelName: vm.rohsCopy,
			                newModelName: vm.rohs
			        }
				    if (vm.rohs.rohsIcon) {
				        vm.imagefile = CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.rohs.rohsIcon;
				        vm.oldImgfile = vm.rohs.rohsIcon;
				    } else {
				        vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_ROHS;
				    }
				}
			}, 0);
		} else {
		    vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_ROHS;
		}

    vm.cropImage = (file, ev) => {
      if (!file) {
        return;
      }
      file.isFlagImage = true;
      DialogFactory.dialogService(
        USER.IMAGE_CROP_CONTROLLER,
        USER.IMAGE_CROP_VIEW,
        ev,
        file).then((res) => {
          vm.originalFileName = file.name;
          vm.croppedImage = res.croppedImage;
          vm.imagefile = vm.croppedImage;
          vm.rohsForm.$$controls[0].$setDirty();
        }, (cancel) => {
          vm.croppedImage = null;
          vm.rohs.rohsIcon = null;
          vm.imagefile = null;
          vm.oldImgfile = "";
          vm.rohs.fileArray = "";
        },
          (err) => {
            if (vm.oldimgfile == vm.imagefile) {
              vm.rohsForm.flagImage.$dirty = false;
            }
          });
    };

    //save or update rohs
    vm.saveROHS = () => {
      vm.isSubmit = false;

      if (!vm.rohsForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      if (vm.croppedImage) {
        let filename = vm.originalFileName;
        let originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
        vm.imageName = `${originalFileName}.png`;
        vm.rohs.fileArray = Upload.dataUrltoBlob(vm.croppedImage, vm.imageName);
      }

      let rohsInfo = {
        id: vm.rohs.id,
        flag: vm.rohs.fileArray,
        rohsIcon: vm.oldImgfile,
      }

      if (vm.rohs && vm.rohs.id) {
        vm.cgBusyLoading = Upload.upload({
          url: `${CORE.API_URL}rfqRohs/updateRohs/${vm.rohs.id}`,
          method: 'PUT',
          data: rohsInfo,
        }).then((res) => {
          if (res && res.data && res.data.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm = [];
            $mdDialog.hide();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object 
      let isdirty = vm.checkFormDirty(vm.rohsForm, vm.checkDirtyObject);
      if (isdirty) {
        let data = {
          form: vm.rohsForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        vm.croppedImage = null;
        vm.rohs.rohsIcon = null;
        vm.imagefile = null;
        vm.oldImgfile = "";
        vm.rohs.fileArray = "";
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    vm.deleteImage = () => {
      vm.rohsForm.$$controls[0].$setDirty();
      if (vm.rohs.rohsIcon || vm.imagefile) {
        vm.croppedImage = null;
        vm.rohs.rohsIcon = null;
        vm.imagefile = null;
        vm.oldImgfile = "";
        vm.rohs.fileArray = "";
        return vm.imagefile = CORE.WEB_URL + USER.ROHS_BASE_PATH + CORE.NO_IMAGE_ROHS;
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.rohsForm];
    });
  }
})();
