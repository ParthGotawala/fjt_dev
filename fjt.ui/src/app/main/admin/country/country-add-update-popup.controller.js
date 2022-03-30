(function () {
  'use strict';

  angular
    .module('app.admin.country')
    .controller('CountryAddUpdatePopupController', CountryAddUpdatePopupController);

  /** @ngInject */
  function CountryAddUpdatePopupController($mdDialog, data, CORE, USER, RFQTRANSACTION, CountryFactory, DialogFactory, BaseService, $timeout, Upload) {

    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    if (data)
      vm.copyActive = angular.copy(data.isActive);
    vm.isSubmit = false;
    vm.country = {
      isActive: true
    };
    vm.country = angular.copy(data);
    $timeout(() => {
      if (data && data.Name)
        vm.country.countryName = data.Name ? data.Name : null;
    });
    vm.countryId = null;
    vm.isSubmit = false;
    let oldImgfile;

    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    }
    const countryTemplate = {
      countryName: null,
      flagImageExtention: null,
      remark: null,
      countrySortCode: null,
      imageName: null,
      isActive: true
    };

    if (data && data.countryID) {
      vm.countryId = data.countryID;
      //$timeout(() => {
      if (vm.countryId) {
        // BaseService.checkFormValid(vm.countryForm, false);
        if (vm.country.imageName) {
          vm.imagefile = stringFormat("{0}{1}{2}", CORE.WEB_URL, USER.COUNTRY_BASE_PATH, vm.country.imageName);
          oldImgfile = vm.country.imageName;
          vm.originalFileName = vm.country.imageName; // not original - here after saved new unique generated file name
        } else {
          vm.imagefile = stringFormat("{0}{1}flag.jpg", CORE.WEB_URL, USER.COUNTRY_DEFAULT_IMAGE_PATH);
        }
        vm.countryCopy = _.clone(vm.country);
        vm.checkDirtyObject = {
          columnName: ["remark", "imageName", "countrySortCode", "countryName"],
          oldModelName: vm.countryCopy,
          newModelName: vm.country
        }
      }
      //}, 0);
    } else {
      vm.imagefile = stringFormat("{0}{1}flag.jpg", CORE.WEB_URL, USER.COUNTRY_DEFAULT_IMAGE_PATH);
      if (vm.country) {
        vm.country = countryTemplate;
      }
    }

    vm.clearCountry = () => {
      vm.country = Object.assign({}, countryTemplate);
    };

    if (!vm.country)
      vm.clearCountry();

    vm.cropImage = (file, ev) => {
      if (!file && ev.type == "change") {
        vm.countryForm.flagImage.$dirty = false;

        var messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_FILE_TYPE);
        var model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      else if (!file) {
        vm.countryForm.flagImage.$dirty = false;
        return;
      }
      //file.isFlagImage = true;
      DialogFactory.dialogService(
        USER.IMAGE_CROP_CONTROLLER,
        USER.IMAGE_CROP_VIEW,
        ev,
        file).then((res) => {
          vm.originalFileName = file.name;
          vm.croppedImage = res.croppedImage;
          vm.imagefile = vm.croppedImage;
          vm.countryForm.$$controls[0].$setDirty();
        }, (cancel) => {
          //vm.country.imageName = null;
          //vm.croppedImage = null;
          //oldImgfile = "";
          //vm.country.fileArray = "";
          vm.countryForm.flagImage.$dirty = true;
        }, (err) => {
          if (oldImgfile == vm.imagefile) {
            vm.countryForm.flagImage.$dirty = false;
          }
        });
    };

    // update save object employeeInfo
    let updateSaveObj = (countryInfo) => {
      let newObj = countryInfo;
      let resultObj = _.pickBy(newObj, _.identity);
      return resultObj;
    }

    //save or update country
    vm.saveCountry = () => {
      vm.isSubmit = false;
      if (!vm.countryForm.$valid) {
        BaseService.focusRequiredField(vm.countryForm);
        vm.isSubmit = true;
        return;
      }

      if (vm.croppedImage) {
        let filename = vm.originalFileName;
        let originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
        vm.imageName = `${originalFileName}.png`;
        vm.country.fileArray = Upload.dataUrltoBlob(vm.croppedImage,
          vm.imageName);
      }

      let countryInfo = {
        countryID: vm.country.countryID ? vm.country.countryID : undefined,
        countryName: vm.country.countryName,
        remark: vm.country.remark ? vm.country.remark : '',
        countrySortCode: vm.country.countrySortCode,
        flag: vm.country.fileArray,
        imageName: oldImgfile,
        isActive: vm.country.isActive,
        refTableName: CORE.TABLE_NAME.COUNTRY
      }
      
      if (vm.country && vm.country.countryID && vm.copyActive != countryInfo.isActive) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Active' : 'Inactive', countryInfo.isActive ? 'Active' : 'Inactive');
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveCountryDet(countryInfo);
          }
        }, () => {
          // empty
        });
      } else { saveCountryDet(countryInfo); }

    }
    //save country detail
    let saveCountryDet = (countryInfo) => {      
      if (vm.country && vm.country.countryID) {
        vm.cgBusyLoading = Upload.upload({
          url: `${CORE.API_URL}countrymst/${vm.country.countryID}`,
          method: 'PUT',
          data: countryInfo,
        }).then((res) => {         
          if (res && res.data && res.data.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide();
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      } else {
        vm.cgBusyLoading = Upload.upload({
          url: CORE.API_URL + USER.ADMIN_COUNTRY_PATH,
          data: countryInfo,
        }).then((res) => {
          if (res && res.data) {
            if (res && res.data.data && res.data.data.countryID) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide(res.data.data.countryID);
            } else {
              if (res.data && res.data.status !== CORE.ApiResponseTypeStatus.SUCCESS  ) {               
                if (checkResponseHasCallBackFunctionPromise(res.data)) {
                  res.data.alretCallbackFn.then(() => {
                    setFocusByName("countryName");
                  });
                }

              }
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }


    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object 
      let isdirty = vm.checkFormDirty(vm.countryForm, vm.checkDirtyObject);
      if (isdirty) {
        let data = {
          form: vm.countryForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        vm.country.imageName = null;
        vm.croppedImage = null;
        oldImgfile = "";
        vm.country.fileArray = "";
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //delete image
    vm.deleteImage = () => {
      vm.countryForm.$$controls[0].$setDirty();
      if (vm.country.imageName || vm.imagefile) {
        vm.country.imageName = null;
        vm.croppedImage = null;
        oldImgfile = "";
        vm.country.fileArray = "";
        vm.originalFileName = "";
        return vm.imagefile = stringFormat("{0}{1}flag.jpg", CORE.WEB_URL, USER.COUNTRY_DEFAULT_IMAGE_PATH);
      }
    };
    vm.checkNameUnique = (data, isExists) => {
      if (data) {
        let objs = {
          countryName: isExists ? data : null,
          countryID: vm.country.countryID ? vm.country.countryID : null,
          countrySortCode: !isExists ? data : null
        };
        vm.cgBusyLoading = CountryFactory.checkNameUnique().query({ objs: objs }).$promise.then((res) => {
          if (res && res.errors) {
            if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  if (isExists) {
                    vm.country.countryName = null;
                    setFocusByName("countryName");
                  }
                  else {
                    vm.country.countrySortCode = null;
                    setFocusByName("countrySortCode");
                  }                           
                });
            }            
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.countryForm);
    });
  }
})();
