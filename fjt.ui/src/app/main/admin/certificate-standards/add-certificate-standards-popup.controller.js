(function () {
  'use strict';

  angular.module('app.admin.certificate-standard')
    .controller('AddCertificateStandardController', AddCertificateStandardController);

  function AddCertificateStandardController($scope, $q, data, $mdDialog, $state, $stateParams, $rootScope, GenericFileFactory, $timeout, DialogFactory, USER,
    MasterFactory, RoleFactory, CORE, GenericCategoryFactory, CertificateStandardFactory, $filter, BaseService) {
    const vm = this;
    vm.Standardtype = CORE.CategoryType.StandardType;
    let GenericCategoryAllData = [];
    vm.standardDet = {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    let oldStandardName = '';
    let oldStandardCode = '';
    vm.Standardtype = CORE.CategoryType.StandardType;
    vm.taToolbar = CORE.Toolbar;
    vm.todayDate = new Date();
    vm.fromDate = vm.todayDate;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormatOfDate = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.issueDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    /* for down arrow key open datepicker */
      vm.DATE_PICKER = CORE.DATE_PICKER;
      vm.IsPickerOpen = {};
      vm.IsPickerOpen[vm.DATE_PICKER.certificateDate] = false;

      vm.isIssuedateOpen = {};
      vm.isIssuedateOpen[vm.DATE_PICKER.issueDate] = false;

      const standard = {
        fullName: null,
        shortName: null,
        description: null,
        isActive: true,
        isCertified: false,
        isRequired: false,
        passwordProtected: false,
        certificateDate: null,
        cerificateIssueDate: null
      };
   ///go to standard list
    vm.goToStandardList = () => {
      BaseService.goToStandardList();
      return false;
    };
    vm.standardDet = Object.assign({}, standard);
    vm.certificateDateOptions = {
      minDate: new Date(vm.certificateStandardID ? vm.standardDet.cerificateIssueDate : (vm.standardDet.cerificateIssueDate ? ((vm.certificateDateOptions.minDate > vm.todayDate) ? vm.standardDet.cerificateIssueDate : vm.todayDate) : vm.todayDate)),
      appendToBody: true
    };
    vm.openPicker = (type, ev) => {
      if (ev.keyCode === 40) {
        vm.IsPickerOpen[type] = true;
      }
    };

    vm.openIssuePicker = (type, ev) => {
      if (ev.keyCode === 40) {
        vm.isIssuedateOpen[type] = true;
      }
    };

    //on radio button change model will be null
    vm.certificateTypeChange = () => {
      if (vm.standardDet.isCertified === false) {
        vm.standardDet.cerificateNumber = null;
        vm.autoCompleteSupplier.keyColumnId = null;
        vm.standardDet.cerificateIssueDate = null;
        vm.standardDet.certificateDate = null;
        vm.standardGeneralDetailForm.$setPristine();
        vm.standardGeneralDetailForm.$setUntouched();
      }
    };

    vm.roles = [];
    // retrieve role
    vm.getRoleList = () =>
      RoleFactory.rolePermission().query().$promise.then((d) => {
        vm.roles = _.filter(d.data, (item) => {
          if (item.isActive) {
            return item.isChecked = false;
          }
        });
        vm.roles = _.sortBy(d.data, 'accessLevel');
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );

    //select All Role
    vm.selectAllRoles = () => {
      _.each(vm.roles, (item) =>
      {
        item.isChecked = vm.isSelected;
      });
    };
    vm.checkChange = () => {
      var isAnyUnChecked = _.some(vm.roles, (o) =>
        o.isChecked === false && o.isActive
      );
      vm.isSelected = !isAnyUnChecked;
    };

    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    /* for down arrow key open datepicker */

    vm.locale = {
      formatDate: function (date) {
        return $filter('date')(date, vm.DefaultDateFormat);
      }
    };

    // get Supplier List
    const getSupplierList = () => {
      const queryObj = {
        isCustomerCodeRequired: true
      };
      return MasterFactory.getSupplierList().query(queryObj).$promise.then((supplier) => {
        if (supplier && supplier.data) {
          _.each(supplier.data, (item) => {
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          });
          vm.SupplierList = supplier.data;
        }
        return $q.resolve(vm.SupplierList);
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    //Get Generic category list to bind standard type
    const getstandardTypeList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(vm.Standardtype.Name);
      const listObj = {
        GencCategoryType: GencCategoryType
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        GenericCategoryAllData = genericCategories.data;
        vm.StandardTypeList = _.filter(GenericCategoryAllData, (item) =>
          item.parentGencCategoryID === null && item.categoryType === vm.Standardtype.Name
        );
        return $q.resolve(vm.StandardTypeList);
      }).catch((error) =>
         BaseService.getErrorLog(error)
      );
    };

    vm.checkCertificateDate = () => {
      if (vm.standardDet.certificateDate) {
        if (vm.standardDet.cerificateIssueDate) {
          const selectedIssuedate = new Date(vm.standardDet.cerificateIssueDate);
          if (vm.standardDet.certificateDate < selectedIssuedate) {
            vm.fromDate = '';
            vm.standardDet.cerificateIssueDate = null;
          }
        }
        const certificateDate = new Date(vm.standardDet.certificateDate.setHours(0, 0, 0, 0));
        const todayDate = new Date(vm.todayDate.setHours(0, 0, 0, 0));
        if (certificateDate < todayDate) {
          vm.standardDet.certificateDate = null;
          vm.fromDate = '';
        }
        else {
          vm.fromDate = certificateDate;
        }
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const result = BaseService.checkFormDirty(form, columnName);
      return result;
    };

    const autocompletePromise = [getstandardTypeList(), getSupplierList(), vm.getRoleList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      if (vm.standardDet.roles && vm.standardDet.roles.length > 0 && vm.roles && vm.roles.length > 0) {
        vm.roleIDs = [];
        _.each(vm.standardDet.roles, (item) => {
          vm.roleIDs.push(item.roleID);
        });
        _.map(vm.roles, (o) => {
          o.isChecked = vm.roleIDs.indexOf(o.id) !== -1;
        });
        const isAnyUnChecked = _.some(vm.roles, (o) =>
          o.isChecked === false && o.isActive
        );
        vm.isSelected = !isAnyUnChecked;

        _.map(vm.standardDet.roles, (data) => {
          _.map(vm.roles, (item)  => {
            if (data.roleID === item.id) {
              return item.isChecked = true;
            }
          });
        });
        const RoleselectedData = _.filter(vm.roles, (data) => {
          if ((data.isActive) || data.isChecked && !data.isActive) {
            return data;
          }
        });
        vm.roles = RoleselectedData;
      }
      else {
        if (vm.roles.length > 0) {
          const activeRoles = _.filter(vm.roles, (Role) => {
            if (Role.isActive) {
              return Role;
            }
          });
          vm.roles = activeRoles;
        }
      }
      initAutoComplete();
      vm.standardDetCopy = angular.copy(vm.standardDet);
      $timeout(() => {
        vm.checkDirtyObject = {
          columnName: ['cerificateIssueDate', 'certificateDate'],
          oldModelName: vm.standardDetCopy,
          newModelName: vm.standardDet
        };
      }, 0);
    }).catch((error) =>
      BaseService.getErrorLog(error)
   );
    const initAutoComplete = () => {
      vm.autoCompleteSupplier = {
        columnName: 'mfgName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.standardDet.certificateSupplierID ? vm.standardDet.certificateSupplierID : null,
        inputName: 'Supplier',
        placeholderName: 'Supplier',
        isRequired: true,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST,
          popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.supplier
        },
        callbackFn: getSupplierList

      },
        vm.autoCompleteStandardType = {
          columnName: 'gencCategoryName',
          controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
          keyColumnName: 'gencCategoryID',
          keyColumnId: vm.standardDet.standardTypeID ? vm.standardDet.standardTypeID : null,
          inputName: vm.Standardtype.Name,
          placeholderName: vm.Standardtype.Title,
          addData: {
            headerTitle: vm.Standardtype.Title,
            popupAccessRoutingState: [USER.ADMIN_STANDTYPE_MANAGEGENERICCATEGORY_STATE],
            pageNameAccessLabel: vm.Standardtype.Title
          },
          isRequired: true,
          isAddnew: true,
          callbackFn: getstandardTypeList
        };
    };
    /*-----------add,Save&Exit,Save-------------------*/
    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.tempData = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.standardGeneralDetailForm.$setPristine();
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.standardGeneralDetailForm);
        if (isdirty) {
          const data = {
            form: vm.standardGeneralDetailForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              pageInit();
              pageSet();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          pageInit();
          pageSet();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.hide(vm.tempData);
      }
      setFocusByName('fullName');
    };
    const pageInit = () => {
      vm.standardDet = {};
      vm.isSelected = false;
      vm.selectAllRoles();
      vm.objData = {};
      vm.certificateStandardID = {};
      initAutoComplete();
      vm.standardDet.isCertified = false;
      vm.standardDet.passwordProtected = false;
    };
    const pageSet = () => {
      $timeout(() => {
        vm.standardGeneralDetailForm.$dirty = false;
        vm.standardGeneralDetailForm.$setPristine();
        vm.standardGeneralDetailForm.$setUntouched();
      }, 300);
    };
    /*--------save and save&exit ---------*/
    vm.save = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.standardGeneralDetailForm)) {
        if (!vm.checkFormDirty(vm.standardGeneralDetailForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          if (vm.tempData) {
            $mdDialog.hide(vm.tempData);
          } else {
            return;
          }
        }
        return;
      }
      if (vm.standardGeneralDetailForm.$invalid) {
        BaseService.focusRequiredField(vm.standardGeneralDetailForm);
        return;
      }
      let roles = _.filter(vm.roles, (item) => item.isChecked === true);
      roles = _.map(roles, (item) => item.id );
      vm.standardDet.roles = roles;

      vm.standardDet.passwordProtected = vm.standardDet.passwordProtected;
      vm.standardDet.certificateDate = vm.standardDet.isCertified ? vm.standardDet.certificateDate : null;
      const _certificateDate = vm.standardDet.certificateDate ? (BaseService.getAPIFormatedDate(vm.standardDet.certificateDate)) : null;
      const _cerificateIssueDate = vm.standardDet.cerificateIssueDate ? (BaseService.getAPIFormatedDate(vm.standardDet.cerificateIssueDate)) : null;

      vm.objData = {
        certificateDetail: null,
        standardClassDetail: null
      };
      vm.standardDet.standardTypeID = vm.autoCompleteStandardType.keyColumnId ? vm.autoCompleteStandardType.keyColumnId : null;
      vm.standardDet.certificateSupplierID = vm.autoCompleteSupplier.keyColumnId ? vm.autoCompleteSupplier.keyColumnId : null;
      delete vm.standardDet['displayOrder'];
      delete vm.standardDet['priority'];
      vm.objData.certificateDetail = angular.copy(vm.standardDet);
      vm.objData.certificateDetail.certificateDate = _certificateDate;
      vm.objData.certificateDetail.cerificateIssueDate = _cerificateIssueDate;
      vm.objData.standardClassDetail = null;
      if (vm.certificateStandardID && vm.certificateStandardID > 0) {
        vm.cgBusyLoading = CertificateStandardFactory.updateCertificateStandard().update({
          id: vm.certificateStandardID
        }, vm.objData).$promise.then((res) => {
          if (res) {
            if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.saveAndProceed(buttonCategory, res.data);
            }
            else if (res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data) {
              if (res.errors.data.isDuplicatefullName) {
                displayStandardNameUniqueMessage();
              } else if (res.errors.data.isDuplicateCode) {
                displayStandardCodeUniqueMessage();
              }
              else {
                if (checkResponseHasCallBackFunctionPromise(res)) {
                  res.alretCallbackFn.then(() => {
                    BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.standardGeneralDetailForm);
                  });
                }
              }
            }
          }
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      }
      else {
        vm.cgBusyLoading = CertificateStandardFactory.createCertificateStandard().save(vm.objData).$promise.then((res) => {
          if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.saveAndProceed(buttonCategory, res.data);
              }
              else if (res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data) {
                if (res.errors.data.isDuplicatefullName) {
                  displayStandardNameUniqueMessage();
                } else if (res.errors.data.isDuplicateCode) {
                  displayStandardCodeUniqueMessage();
                }
                else {
                  if (checkResponseHasCallBackFunctionPromise(res)) {
                    res.alretCallbackFn.then(() => {
                      BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.standardGeneralDetailForm);
                    });
                  }
                }
              }
            }
        }).catch((error) =>
          BaseService.getErrorLog(error)
        );
      }
    };
    /*Used to close pop-up*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.standardGeneralDetailForm, vm.checkDirtyObject);
      if (isdirty) {
        const data = {
          form: vm.standardGeneralDetailForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else if (vm.tempData) {
        $mdDialog.cancel(vm.tempData);
      } else {
        $mdDialog.cancel();
      }
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.standardGeneralDetailForm);
    });

    //Function call on standard blur event and check standard name exist and ask for confirmation
    vm.checkDuplicateStandard = () => {
      if (oldStandardName !== vm.standardDet.fullName) {
        if (vm.standardGeneralDetailForm && vm.standardGeneralDetailForm.fullname.$dirty && vm.standardDet.fullName) {
          vm.cgBusyLoading = CertificateStandardFactory.checkDuplicateStandard().query({
            certificateStandardID: vm.standardDet.certificateStandardID,
            fullName: vm.standardDet.fullName
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldStandardName = angular.copy(vm.standardDet.fullName);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicatefullName) {
              displayStandardNameUniqueMessage();
            }
          }).catch((error) =>
            BaseService.getErrorLog(error)
          );
        }
      }
    };

    /* display standard name unique confirmation message */
    const displayStandardNameUniqueMessage = () => {
      oldStandardName = '';
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, 'Standard name');
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        vm.standardDet.fullName = null;
        setFocus('fullname');
      }, (cancel) => {
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    //Function call on standard blur event and check standard code exist and ask for confirmation
    vm.checkDuplicateStandardCode = () => {
      if (oldStandardCode !== vm.standardDet.shortName) {
        if (vm.standardGeneralDetailForm && vm.standardGeneralDetailForm.shortName.$dirty && vm.standardDet.shortName) {
          vm.cgBusyLoading = CertificateStandardFactory.checkDuplicateStandardCode().query({
            certificateStandardID: vm.standardDet.certificateStandardID,
            shortName: vm.standardDet.shortName
          }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            oldStandardCode = angular.copy(vm.standardDet.shortName);
            if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateCode) {
              displayStandardCodeUniqueMessage();
            }
          }).catch((error) =>
            BaseService.getErrorLog(error)
          );
        }
      }
    };

    /* display standard code unique confirmation message */
    const displayStandardCodeUniqueMessage = () => {
      oldStandardCode = '';
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, 'Standard code');
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        vm.standardDet.shortName = null;
        setFocus('shortName');
      }, (cancel) => {
      }).catch((error) =>
        BaseService.getErrorLog(error)
      );
    };

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) =>
      BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* called for text editor max length validation */
    vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
      vm.entertext = vm.htmlToPlaintext(enterTextLength);
      return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
    };

    vm.htmlToPlaintext = (text) =>
      text ? String(text).replace(/<[^>]+>/gm, '') : '';

    vm.goToStandardType = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_STANDTYPE_STATE, {});
    };
    vm.goToSupplier = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
    };


    /* called for max date validation */
    vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) =>
      BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);

    /* called for min date validation */
    vm.getMinDateValidation = (FromDateLabel, ToDateLabel) =>
      BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);

    vm.getMinDateValidationCertificateDate = (FromDateLabel) => {
      const str = getCompareDateLabel();
      return vm.getMinDateValidation(FromDateLabel, str);
    };
    const getCompareDateLabel = () => {
      let str = 'Today Date';
      if (vm.standardDet.cerificateIssueDate
        && vm.standardGeneralDetailForm.certificateDate
        && vm.standardGeneralDetailForm.certificateDate.$viewValue
        && new Date(vm.standardGeneralDetailForm.certificateDate.$viewValue) < new Date(vm.standardDet.cerificateIssueDate)) {
        str = 'Issue Date';
      }
      return str;
    };

    //Set mindate value on change in Issue Date
    vm.onChangeIssueDate = (certificateDate) => {
      if (vm.standardDet.cerificateIssueDate) {
        vm.standardDet.certificateDateOptions = {
          minDate: new Date(vm.certificateStandardID ? vm.standardDet.cerificateIssueDate : (vm.standardDet.cerificateIssueDate ? ((vm.certificateDateOptions.minDate > vm.todayDate) ? vm.standardDet.cerificateIssueDate : vm.todayDate) : vm.todayDate)),
          appendToBody: true
        };
        if (new Date(vm.standardDet.cerificateIssueDate) > new Date(certificateDate)) {
          vm.standardDet.certificateDate = null;
        }
        if (!certificateDate) {
          vm.standardDet.certificateDate = null;
        }
      }
    };
  }
})();
