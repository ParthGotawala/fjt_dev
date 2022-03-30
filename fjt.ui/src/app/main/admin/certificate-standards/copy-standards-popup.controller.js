(function () {
    'use strict';

    angular.module('app.admin.certificate-standard')
        .controller('CopyCertificateStandardController', CopyCertificateStandardController);

    function CopyCertificateStandardController($scope, $q, data, $mdDialog, $state, $stateParams, $rootScope, GenericFileFactory, $timeout, DialogFactory, USER, CORE, GenericCategoryFactory, BaseService, CertificateStandardFactory, $filter) {
        const vm = this;
        vm.Standardtype = CORE.CategoryType.StandardType.Name;
        let GenericCategoryAllData = [];
        vm.standardDet = {};
        let oldStandardName = '';
        let oldStandardCode = '';
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.copyStandardNote = stringFormat(vm.CORE_MESSAGE_CONSTANT.COPY_STANDARD_NOTE, data.fullName);

      ///go to standard list
      vm.goToStandardList = () => {
        BaseService.goToStandardList();
        return false;
      }
      ///go to standard list
      vm.goToStandardDetails = () => {
        BaseService.goToStandardDetails(data.certificateStandardID);
        return false;
      }

        vm.headerdata = [
          {
            label: 'Standard', value: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, data.shortName, data.fullName), displayOrder: 1, labelLinkFn: vm.goToStandardList,
            valueLinkFn: vm.goToStandardDetails}
        ];


        vm.standardDet.fullName = vm.Name;
        if (data) {
            vm.roles = [];
            _.each(data.certificateStandardRole, (item) => {
                vm.objRole = item.roleID;
                vm.roles.push(vm.objRole);
            })
            vm.standardDet.description = data.description ? data.description : null
            vm.standardDet.isActive = data.isActive,
            vm.standardDet.passwordProtected = data.passwordProtected,
            vm.standardDet.isCertified = false,
            vm.standardDet.isRequired = data.isRequired ? data.isRequired : false,
            vm.standardDet.standardInfo = data.standardInfo,
            vm.standardDet.standardTypeID = data.standardTypeID,
            vm.standardDet.roles = vm.roles ? vm.roles : null
        }

        vm.addUpdateCertificateStandard = () => {
            if (vm.CopyCertificateStandardForm.$invalid) {
                BaseService.focusRequiredField(vm.CopyCertificateStandardForm);
                vm.isSubmit = true;
                return;
            }
            
            vm.objData = {
                certificateDetail: null,
            }
            const CertificateStandardInfo = {
                fullName: vm.standardDet.fullName,
                shortName: vm.standardDet.shortName,
                description: vm.standardDet.description,
                
                isActive: vm.standardDet.isActive,
                passwordProtected: vm.standardDet.passwordProtected,
                isCertified: vm.standardDet.isCertified,
                standardTypeID: vm.standardDet.standardTypeID,
                standardInfo: vm.standardDet.standardInfo,
                roles: vm.standardDet.roles,
            }
            vm.objData.certificateDetail = CertificateStandardInfo;
            vm.cgBusyLoading = CertificateStandardFactory.createCertificateStandard().save(vm.objData).$promise.then((res) => {
                if (res.data && res.data.certificateStandardID) {
                    BaseService.currentPagePopupForm.pop();
                    $mdDialog.hide(res.data);
                }
                else {
                  if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.data && res.data.isDuplicatefullName) {
                    displayStandardNameUniqueMessage();
                  }
                  else if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.data && res.data.isDuplicateCode) {
                    displayStandardCodeUniqueMessage();
                  } else {
                    if (checkResponseHasCallBackFunctionPromise(res)) {
                      res.alretCallbackFn.then(() => {
                        BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.CopyCertificateStandardForm);
                      });
                    }
                  }
                }

            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });            
        }


        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.CopyCertificateStandardForm);
            if (isdirty) {
                let data = {
                    form: vm.CopyCertificateStandardForm
                }
                BaseService.showWithoutSavingAlertForPopUp(data);
            } else {
                BaseService.currentPagePopupForm.pop();
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }

        //Function call on standard blur event and check standard name exist and ask for confirmation
        vm.checkDuplicateStandard = () => {
            if (oldStandardName != vm.standardDet.fullName) {
                if (vm.CopyCertificateStandardForm && vm.CopyCertificateStandardForm.fullname.$dirty && vm.standardDet.fullName) {
                    vm.cgBusyLoading = CertificateStandardFactory.checkDuplicateStandard().query({
                        certificateStandardID: vm.standardDet.certificateStandardID,
                        fullName: vm.standardDet.fullName,
                    }).$promise.then((res) => {
                        vm.cgBusyLoading = false;
                        oldStandardName = angular.copy(vm.standardDet.fullName);
                        if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicatefullName) {
                            displayStandardNameUniqueMessage();
                        }
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
                }
            }
        }

        /* display standard name unique confirmation message */
        let displayStandardNameUniqueMessage = () => {
            oldStandardName = '';
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, "Standard name");
            let obj = {
                messageContent: messageContent,
                multiple:true
            };
            DialogFactory.messageAlertDialog(obj).then((yes) => {
              vm.standardDet.fullName = null;
              setFocus('fullname')
            }, (cancel) => {
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
        }

        //Function call on standard blur event and check standard code exist and ask for confirmation
        vm.checkDuplicateStandardCode = () => {
            if (oldStandardCode != vm.standardDet.shortName) {
                if (vm.CopyCertificateStandardForm && vm.CopyCertificateStandardForm.shortName.$dirty && vm.standardDet.shortName) {
                    vm.cgBusyLoading = CertificateStandardFactory.checkDuplicateStandardCode().query({
                        certificateStandardID: vm.standardDet.certificateStandardID,
                        shortName: vm.standardDet.shortName,
                    }).$promise.then((res) => {
                        vm.cgBusyLoading = false;
                        oldStandardCode = angular.copy(vm.standardDet.shortName);
                        if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCode) {
                            displayStandardCodeUniqueMessage();
                        }
                    }).catch((error) => {
                        return BaseService.getErrorLog(error);
                    });
                }
            }
        }

        /* display standard code unique confirmation message */
        let displayStandardCodeUniqueMessage = () => {
            oldStandardCode = '';            
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, "Standard code");
            let obj = {
                messageContent: messageContent,
                multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then((yes) => {
              vm.standardDet.shortName = null;
              setFocus('shortName');
            }, (cancel) => {
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
        }

        /* called for max length validation */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        }

        /* on load submit form  */
      angular.element(() => {
        BaseService.currentPagePopupForm.push(vm.CopyCertificateStandardForm);
      });
    }
})();
