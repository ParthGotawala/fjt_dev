(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('companyProfileDetail', companyProfileDetail);

  /** @ngInject */
  function companyProfileDetail() {
    var directive = {
      restrict: 'E',
      scope: {
      },
      templateUrl: 'app/directives/custom/company-profile-detail/company-profile-detail.html',
      controller: companyProfileDetailCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of company profile
    *
    * @param
    */
    function companyProfileDetailCtrl($scope, $timeout, BaseService, CORE, USER, CountryMstFactory, CompanyProfileFactory, DialogFactory, Upload, $mdDialog) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmailPattern = CORE.EmailPattern;
      const defaultImage = CORE.WEB_URL + USER.COMPANY_DEFAULT_IMAGE;
      let oldImgfile;
      vm.companyProfileForm = [];

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
        $scope.$parent.vm.cgBusyLoading = CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
          if (company && company.data) {
            vm.companyProfile = angular.copy(company.data);
            if (vm.companyProfile.companyLogo) {
              vm.imagefile = stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.COMPANY_BASE_PATH, vm.companyProfile.companyLogo);
              oldImgfile = vm.companyProfile.companyLogo;
              vm.originalFileName = vm.companyProfile.companyLogo;
            } else {
              vm.imagefile = defaultImage;
            }
            vm.contactPersonDetail = {
              companyName: vm.companyProfile.MfgCodeMst.mfgName,
              refTransID: vm.companyProfile.mfgCodeId,
              refTableName: CORE.TABLE_NAME.MFG_CODE_MST,
              isMasterPage: true,
              pageName: CORE.PageName.CompanyInfo,
              mfgType: CORE.MFG_TYPE.MFG,
              contactRedirectionFn: () => { vm.goToContactPersonList(); }
            };
            vm.primaryContPersonsDet = vm.companyProfile.MfgCodeMst.contactPerson;
            $timeout(() => {
              if (vm.autoCompleteCountry.inputName && vm.companyProfile.countryMst) {
                $scope.$broadcast(vm.autoCompleteCountry.inputName, vm.companyProfile.countryMst);
              }
              vm.companyProfileForm.$setPristine();
              vm.companyProfileForm.$setUntouched();
              removeCountryDialCodeManual(vm.companyProfile);
            }, true);
          };
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
          $scope.$parent.vm.ischange = false;
        }
      };

      function getAllCountryList(searchObj) {
        return CountryMstFactory.getAllCountry().query(searchObj).$promise.then((countries) => {
          if (searchObj && searchObj.countryID) {
            $timeout(() => {
              if (vm.autoCompleteCountry && vm.autoCompleteCountry.inputName) {
                $scope.$broadcast(vm.autoCompleteCountry.inputName, countries.data[0]);
              }
            });
          }
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
          const originalFileName = vm.originalFileName.substr(0, vm.originalFileName.lastIndexOf('.')) || vm.originalFileName;
          vm.imageName = `${originalFileName}.png`;
          vm.companyProfile.companyLogo = Upload.dataUrltoBlob(vm.croppedImage,
            vm.imageName);
        }
        const addedPrimaryContPerson = _.filter(vm.primaryContPersonsDet, (item) => !item.personId);

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
        companyProfile.primaryContPersonsDet = addedPrimaryContPerson;
        $scope.$parent.vm.cgBusyLoading = Upload.upload({
          url: `${CORE.API_URL}company_info/updateComapnyInfo/${vm.companyProfile.id}`,
          method: 'PUT',
          data: companyProfile
        }).then((response) => {
          if (response && response.data && response.data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.companyProfileForm.$setPristine();
            vm.companyProfileForm.$setUntouched();
            vm.saveBtnDisableFlag = false;
            $scope.$parent.vm.ischange = false;
            $scope.$broadcast('refreshPrimaryContPerson');
          } else if (response && response.data && response.data.errors && response.data.errors.data && response.data.errors.data.isDuplicateCompanyName) {
            vm.saveBtnDisableFlag = false;
            vm.companyProfile.name = null;
            setFocus('name');
          }
        }).catch((error) => BaseService.getErrorLog(error)).finally(() => {
          vm.saveBtnDisableFlag = false;
        });
      };

      const updateSaveObj = (companyProfile) => _.pickBy(companyProfile, _.identity);

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

      vm.goToCountryList = () => BaseService.openInNew(USER.ADMIN_COUNTRY_STATE, {});

      const removeCountryDialCodeManual = (company) => {
        company.contactNumber = removeDialCodeForPhnData('id_contact', company.contactNumber);
        company.faxNumber = removeDialCodeForPhnData('id_faxNumber', company.faxNumber);
      };

      /* go to manufacturer detail page */
      vm.goToManufacturerDetails = () => {
        BaseService.goToManufacturer(vm.companyProfile.mfgCodeId);
        return false;
      };

      /* Go to contact tab. */
      vm.goToContactPersonList = () => {
        BaseService.goToCompanyProfileContact();
      };

      $scope.$on('savecompanyProfileDetails', () => {
        vm.saveCompanyInfo();
      });

      //Set as current form when page loaded
      angular.element(() => {
        BaseService.currentPageForms = [vm.companyProfileForm];
      });

      $scope.$on('$destroy', () => {
        $mdDialog.cancel();
      });
    }
  }
})();
