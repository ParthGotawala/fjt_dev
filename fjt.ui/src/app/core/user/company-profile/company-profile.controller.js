(function () {
  'use strict';

  angular
    .module('app.companyprofile')
    .controller('CompanyController', CompanyController);

  /** @ngInject */
  function CompanyController($scope, $timeout, BaseService, CORE, USER, CountryMstFactory, CompanyProfileFactory, DialogFactory, Upload) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmailPattern = CORE.EmailPattern;
    const defaultImage = CORE.WEB_URL + USER.COMPANY_DEFAULT_IMAGE;
    let oldImgfile;

    vm.autoCompleteCountry = {
      columnName: 'countryName',
      controllerName: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_CONTROLLER,
      viewTemplateURL: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_VIEW,
      keyColumnName: 'countryID',
      keyColumnId: vm.companyProfile && vm.companyProfile.countryID ? vm.companyProfile.countryID : null,
      inputName: 'Country',
      placeholderName: 'Country',
      isRequired: true,
      addData: {
        popupAccessRoutingState: [USER.ADMIN_COUNTRY_STATE],
        pageNameAccessLabel: CORE.PageName.country
      },
      isAddnew: true,
      callbackFn: (obj) => {
        const searchObj = {
          countryID: obj
        };
        return getAllCountryList(searchObj);
      },
      onSelectCallbackFn: (item) => {
        if (item) {
          vm.companyProfile.countryID = item.countryID;
        } else {
          vm.companyProfile.countryID = null;
        }
      },
      onSearchFn: (query) => {
        const searchObj = {
          searchQuery: query,
          inputName: vm.autoCompleteCountry.inputName
        };
        return getAllCountryList(searchObj);
      }
    };

    const getCompanyInfo = () => {
      vm.cgBusyLoading = CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
        vm.companyProfile = angular.copy(company.data);
        if (vm.companyProfile.companyLogo) {
          vm.imagefile = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.COMPANY_BASE_PATH, vm.companyProfile.companyLogo);
          oldImgfile = vm.companyProfile.companyLogo;
          vm.originalFileName = vm.companyProfile.companyLogo;
        } else {
          vm.imagefile = defaultImage;
        }
        $timeout(() => {
          if (vm.autoCompleteCountry.inputName && vm.companyProfile.countryMst) {
            $scope.$broadcast(vm.autoCompleteCountry.inputName, vm.companyProfile.countryMst);
          }
          vm.companyProfileForm.$setPristine();
          vm.companyProfileForm.$setUntouched();
          removeCountryDialCodeManual(vm.companyProfile);
        }, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getCompanyInfo();


    vm.cropImage = (file, ev) => {
      if (!file && ev.type === 'change') {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_FILE_TYPE);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model);
      }
      else if (!file) {
        vm.companyProfileForm.companyLogo.$dirty = false;
        return;
      }
      DialogFactory.dialogService(
        USER.IMAGE_CROP_CONTROLLER,
        USER.IMAGE_CROP_VIEW,
        ev,
        file).then((res) => {
          vm.originalFileName = file.name;
          vm.croppedImage = res.croppedImage;
          vm.imagefile = vm.croppedImage;
          vm.companyProfileForm.$$controls[0].$setDirty();
        }, () => {
          if (oldImgfile === vm.imagefile) {
            vm.companyProfileForm.companyLogo.$dirty = true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.deleteImage = () => {
      vm.companyProfileForm.$$controls[0].$setDirty();
      if (vm.companyProfile.companyLogo || vm.imagefile) {
        vm.companyProfile.companyLogo = '';
        vm.croppedImage = null;
        oldImgfile = '';
        vm.originalFileName = '';
        vm.imagefile = defaultImage;
      }
    };

    function getAllCountryList(searchObj) {
      return CountryMstFactory.getAllCountry().query(searchObj).$promise.then((countries) => {
        _.each(countries.data, (item) => {
          item.country = item.countryName;
          item.countryName = item.country;
        });

        return countries.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }


    vm.saveCompanyInfo = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.companyProfileForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (vm.croppedImage) {
        const filename = vm.originalFileName;
        const originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
        vm.imageName = `${originalFileName}.png`;
        vm.companyProfile.companyLogo = Upload.dataUrltoBlob(vm.croppedImage,
          vm.imageName);
      }
      vm.companyProfile.registeredEmailEncrypted = encryptAES(angular.copy(vm.companyProfile.registeredEmail)).toString();
      vm.companyProfile.contactCountryCode = vm.companyProfile.contactNumber ? vm.companyProfile.contactCountryCode : null;
      vm.companyProfile.faxCountryCode = vm.companyProfile.faxNumber ? vm.companyProfile.faxCountryCode : null;
      const companyProfile = updateSaveObj(vm.companyProfile);
      companyProfile.registeredEmail = null;
      companyProfile.ein = vm.companyProfile.ein ? vm.companyProfile.ein : '';
      companyProfile.personName = vm.companyProfile.personName ? vm.companyProfile.personName : '';
      companyProfile.contactNumber = vm.companyProfile.contactNumber ? vm.companyProfile.contactNumber : '';
      companyProfile.phoneExt = vm.companyProfile.phoneExt ? vm.companyProfile.phoneExt : '';
      companyProfile.faxNumber = vm.companyProfile.faxNumber ? vm.companyProfile.faxNumber : '';
      companyProfile.street1 = vm.companyProfile.street1 ? vm.companyProfile.street1 : '';
      companyProfile.street2 = vm.companyProfile.street2 ? vm.companyProfile.street2 : '';
      companyProfile.street3 = vm.companyProfile.street3 ? vm.companyProfile.street3 : '';
      //companyProfile.remittanceAddress = vm.companyProfile.remittanceAddress ? vm.companyProfile.remittanceAddress : '';
      companyProfile.city = vm.companyProfile.city ? vm.companyProfile.city : '';
      companyProfile.state = vm.companyProfile.state ? vm.companyProfile.state : '';
      companyProfile.postalCode = vm.companyProfile.postalCode ? vm.companyProfile.postalCode : '';
      companyProfile.countryID = vm.autoCompleteCountry.keyColumnId ? vm.autoCompleteCountry.keyColumnId : '';
      companyProfile.contactNumber = addDialCodeForPhnData('id_contact', companyProfile.contactNumber);
      companyProfile.faxNumber = addDialCodeForPhnData('id_faxNumber', companyProfile.faxNumber);
      vm.cgBusyLoading = Upload.upload({
        url: `${CORE.API_URL}company_info/updateComapnyInfo/${vm.companyProfile.id}`,
        method: 'PUT',
        data: companyProfile
      }).then((response) => {
        if (response && response.data && response.data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.companyProfileForm.$setPristine();
          vm.companyProfileForm.$setUntouched();
          vm.saveBtnDisableFlag = false;
        } else if (response && response.data && response.data.errors && response.data.errors.data && response.data.errors.data.isDuplicateCompanyName) {
          vm.saveBtnDisableFlag = false;
          vm.companyProfile.name = null;
          setFocus('name');
        }
      }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
        vm.saveBtnDisableFlag = false;
      });
    };

    const updateSaveObj = (companyProfile) => {
      const newObj = companyProfile;
      const resultObj = _.pickBy(newObj, _.identity);
      return resultObj;
    };

    vm.checkEmailUnique = () => {
      if (vm.companyProfile.registeredEmail) {
        const query = {
          id: vm.companyProfile.id,
          registeredEmail: encryptAES(vm.companyProfile.registeredEmail).toString()
        };
        CompanyProfileFactory.checkEmailUnique().query(query).$promise.then((response) => {
          if (response && response.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
            messageContent.message = stringFormat(messageContent.message, 'Email');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.companyProfile.registeredEmail = null;
                setFocus('email');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.checkCompanyNameUnique = () => {
      if (vm.companyProfile.name) {
        CompanyProfileFactory.checkCompanyNameUnique().query(vm.companyProfile).$promise.then((response) => {
          if (response && response.data && response.data.length > 0 && (response.data[0] || response.data[1] || response.data[2])) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY);
            messageContent.message = stringFormat(messageContent.message, vm.companyProfile.name);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then(() => {
              vm.companyProfile.name = null;
              setFocus('name');
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToCountryList = () => {
      BaseService.openInNew(USER.ADMIN_COUNTRY_STATE, {});
    };

    const removeCountryDialCodeManual = (company) => {
      company.contactNumber = removeDialCodeForPhnData('id_contact', company.contactNumber);
      company.faxNumber = removeDialCodeForPhnData('id_faxNumber', company.faxNumber);
    };
    /* go to manufacturer detail page */
    vm.goToManufacturerDetails = () => {
      BaseService.goToManufacturer(vm.companyProfile.mfgCodeId);
      return false;
    };

    angular.element(() => {
      BaseService.currentPageForms.push(vm.companyProfileForm);
    });
  }
})();
