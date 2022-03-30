(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('employeeDetail', employeeDetail);
  /** @ngInject */
  function employeeDetail(CORE, $state, $q, $timeout, USER, CountryMstFactory, EmployeeFactory, BaseService, $rootScope, MasterFactory, Upload, RolePagePermisionFactory, EmployeeCertificationFactory, DialogFactory, ContactPersonFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        employeeId: '='
      },
      templateUrl: 'app/directives/custom/employee-detail/employee-detail.html',
      controller: employeeCredenialCtrl,
      controllerAs: 'vm'
    };
    return directive;
    /** @ngInject */
    function employeeCredenialCtrl($scope) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.EmailPattern = CORE.EmailPattern;
      vm.paymentMode = CORE.PaymentMode;
      vm.WorkArea = CORE.CategoryType.WorkArea;
      vm.entityName = CORE.AllEntityIDS.Employee;
      vm.TimeMask = CORE.TimeMask;
      vm.LabelConstant = CORE.LabelConstant;
      vm.confirmCode = null;
      vm.confirmEmail = null;
      let oldImgfile;
      let selectedCountry;
      let defaultCountry = {};
      vm.loginUser = BaseService.loginUser;
      let allCountryList = [];
      let checkFieldName = '';
      let checkUniquefieldValue = '';
      let oldContactPersonId = '';
      vm.personnelTypeRadioObj = _.reduce(CORE.personnelTypeRadio, (obj, value) => {
        obj[value.objectKey] = value.value;
        return obj;
      }, {});

      vm.radioButtonGroup = {
        isExternalEmployee: {
          array: USER.EmployeeRadioGroup.isExternalEmployee
        },
        isActive: {
          array: USER.EmployeeRadioGroup.isActive
        },
        personnelTypeRadio: CORE.personnelTypeRadio
      };

      const employeeId = $scope.employeeId ? parseInt($scope.employeeId) : null;
      vm.employeeId = employeeId;

      //  check and get accesslevel for change personnel standard : DELETEROLEACCESS key used right now
      function getAccessLevel() {
        return MasterFactory.getAcessLeval().query({
          access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS
        }).$promise.then((response) => {
          if (response && response.data) {
            vm.isAllowUserToChangeCertification = false;
            const currentLoginUserRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
            if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
              vm.isAllowUserToChangeCertification = true;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // serach and get data for mfgcode
      function getAllCountryList(searchObj) {
        return CountryMstFactory.getAllCountry().query(searchObj).$promise.then((countries) => {
          _.each(countries.data, (item) => {
            item.country = item.countryName;
            item.countryName = item.country;
          });

          if (searchObj && searchObj.countryID) {
            vm.employee.selectedCountryTxt = countries.data[0] ? countries.data[0].countryName : '';
            vm.employee.countryID = countries.data[0] ? countries.data[0].countryID : '';
            selectedCountry = countries.data[0];
            $timeout(() => {
              if (vm.autoCompleteCountry.inputName) {
                $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
              }
            });
          }

          vm.countryDetail = countries.data;
          /* if all country data (length 1 means only seleted one) */
          if (!searchObj && vm.countryDetail && vm.countryDetail.length > 0) {
            allCountryList = angular.copy(vm.countryDetail);
          }
          return countries.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      const getEmployeeCertificationList = () => EmployeeCertificationFactory.getCertifiedStandardListOfEmployee().save({
        employeeID: vm.employeeId
      }).$promise.then((res) => {
        if (res && res.data) {
          vm.employeeCertificationList = [];
          _.each(res.data, (stdwithclassItem) => {
            const stdwithclassObj = {
              allClassList: []
            };
            _.each(stdwithclassItem.employeeCertification, (empCertiItem) => {
              if (empCertiItem.classID) {
                const classObj = {};
                const selectedClassItem = _.find(stdwithclassItem.CertificateStandard_Class, (classitem) => empCertiItem.classID === classitem.classID);
                classObj.class = selectedClassItem ? selectedClassItem.className : null;
                classObj.colorCode = selectedClassItem ? (selectedClassItem.colorCode ? selectedClassItem.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
                stdwithclassObj.allClassList.push(classObj);
              }
            });
            stdwithclassObj.colorCode = CORE.DefaultStandardTagColor;
            stdwithclassObj.standard = stdwithclassItem.fullName;
            stdwithclassObj.priority = stdwithclassItem.priority;
            vm.employeeCertificationList.push(stdwithclassObj);
          });
          vm.employeeCertificationList.sort(sortAlphabatically('priority', 'standard', true));
        }
        return $q.resolve(res);
      }).catch((error) => BaseService.getErrorLog(error));

      const getEmployeeResponsibilityList = () => EmployeeFactory.getEmployeeResponsibility().query({ employeeID: vm.employeeId }).$promise.then((res) => {
        if (res && res.data) {
          vm.employeeResponsibilityList = res.data;
        }
        return $q.resolve(res);
      }).catch((error) => BaseService.getErrorLog(error));

      function getEmployeeDetail() {
        vm.cgBusyLoading = EmployeeFactory.employee().query({ id: vm.employeeId }).$promise.then((employees) => {
          vm.employeeMain = angular.copy(employees.data);
          vm.employee = angular.copy(employees.data);
          vm.employeeContactPerson = angular.copy(employees.data.employeeContactPerson);
          oldContactPersonId = vm.employeeContactPerson && vm.employeeContactPerson.length > 0 ? vm.employeeContactPerson[0].contactPersonId : null;

          if (vm.employee) {
            $scope.$parent.vm.employeeTitle = ': ' + vm.employee.formattedName;
            /* set default country code value to model if CountryCode not available */
            vm.employee.contactCountryCode = vm.employee.contactCountryCode ? vm.employee.contactCountryCode : CORE.defaultCountryCodeForPhone;
            vm.employee.faxCountryCode = vm.employee.faxCountryCode ? vm.employee.faxCountryCode : CORE.defaultCountryCodeForPhone;
            vm.employee.logoutIdleTime = convertDisplayTime(vm.employee.logoutIdleTime);
            vm.confirmCode = vm.employee.code;
            vm.confirmEmail = vm.employee.email;
          }

          //Check Employee is active in any transaction or not
          vm.EmployeeActiveTrans = _.find(employees.data.workorderTransEmpinout, (emp) => emp.checkinTime && !emp.checkoutTime);

          vm.userId = vm.employee.userID;
          vm.selectedRole = vm.employee.selectedRole;
          if (vm.selectedRole && vm.selectedRole.length > 0) {
            vm.selectedRole = _.first(vm.selectedRole);
          }
          vm.isCreateMode = false;
          if (vm.employee.isUser) {
            vm.isUser = true;
          }
          else {
            vm.isUser = false;
          }
          if (vm.employee && vm.employee.profileImg) {
            vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + vm.employee.profileImg;
            oldImgfile = vm.imagefile;
            vm.originalFileName = vm.employee.profileImg;
          }
          else {
            vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
            vm.originalFileName = '';
          }
          vm.isActiveChange = false;
          if (vm.employee && vm.employee.countryID) {
            getAllCountryList({ countryID: vm.employee.countryID, refTable: 'countrymst' });
          }

          initAutoComplete();
          $timeout(() => {
            if (vm.employeeId && vm.employeeDetail) {
              removeCountryDialCodeManual(vm.employee);
              vm.employeeDetail.$setPristine();
              BaseService.checkFormValid(vm.employeeDetail, false);
              vm.checkDirtyObject = {
                columnName: ['contact', 'faxNumber', 'profileImg', 'paymentModeExempt', 'paymentModeNonExempt', 'isActive'],
                oldModelName: vm.employeeDetail,
                newModelName: vm.employee
              };
            }
          }, 0);
          return $q.resolve(employees);
        }).catch((error) => BaseService.getErrorLog(error));
      }

      ////Get Generic category list to bind standard type
      //let getWorkAreaList = () => {
      //  let GencCategoryType = [];
      //  GencCategoryType.push(vm.WorkArea.Name);
      //  let listObj = {
      //    GencCategoryType: GencCategoryType,
      //    isActive: vm.employeeId ? true : false
      //  }
      //  return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
      //    GenericCategoryAllData = genericCategories.data;
      //    vm.WorkAreaList = _.filter(GenericCategoryAllData, (item) => {
      //      return item.parentGencCategoryID == null && item.categoryType == vm.WorkArea.Name;
      //    });
      //    return $q.resolve(GenericCategoryAllData);
      //  }).catch((error) => {
      //    return BaseService.getErrorLog(error);
      //  });
      //}

      /* Employee dropdown fill up */
      const getemployeeList = () => EmployeeFactory.employeeList().query().$promise.then((employees) => {
        vm.employeeList = angular.copy(employees.data);
        _.each(vm.employeeList, (item) => {
          if (item.employeeDepartment) {
            item.employeeDepartment = _.first(item.employeeDepartment);
          }
          let deptName = '';
          let gencCategoryName = '';
          if (item.employeeDepartment && item.employeeDepartment.department) {
            deptName = ' (' + item.employeeDepartment.department.deptName + ')';
          }
          if (item.employeeDepartment && item.employeeDepartment.genericCategory) {
            gencCategoryName = ' ' + item.employeeDepartment.genericCategory.gencCategoryName;
          }
          item.name = stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.initialName, item.firstName, item.lastName) + deptName + gencCategoryName;
          if (item.profileImg && item.profileImg) {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + item.profileImg;
          }
          else {
            item.ProfilePic = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          }
        });
        if (vm.employeeId) {
          // if employee is manager of any employee that should not be in list
          vm.employeeList = vm.employeeList.filter((el) => el.managerID !== vm.employeeId);
          // self employee should not be in list
          vm.employeeList = vm.employeeList.filter((el) => el.id !== vm.employeeId);
        }
        return $q.resolve(vm.employeeList);
      }).catch((error) => BaseService.getErrorLog(error));

      const getEmployeeCountry = (item) => {
        selectedCountry = item;
        if (item) {
          vm.employee.countryID = item.countryID;
        }
        else {
          if (vm.employee) {
            vm.employee.countryID = null;
          }
        }
      };

      /* Get Contact Person List. */
      const getContactPersonList = (searchObj) => {
        const addeedContactPerson = _.find(vm.employeeContactPerson, (item) => !item.id);
        const contactPersonInfo = {
          refTableName: CORE.Import_export.Personnel.Table_Name,
          searchObj: (searchObj ? searchObj : null),
          id: addeedContactPerson ? addeedContactPerson.contactPerson.personId : null
        };
        return ContactPersonFactory.getContactPersonList().query({ contactPersonInfo: contactPersonInfo }).$promise.then((response) => {
          if (searchObj && searchObj.personId) {
            $scope.$broadcast(vm.autoCompleteContactPerson.inputName, response.data.contactPersonList[0]);
          }
          if (response && response.data && response.data.contactPersonList) {
            return $q.resolve(response.data.contactPersonList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Refresh Current Contact person After update / save. */
      const refreshEmployeeContactPerson = (isFromReleaseContPerson) => {
        const addedContPerson = isFromReleaseContPerson ? (_.find(vm.employeeContactPerson, (item) => !item.id)) : null;
        vm.cgBusyLoading = EmployeeFactory.GerCurrentContactPersonByEmpId().query({ empId: vm.employee.id }).$promise.then((response) => {
          if (response && response.data && response.data.contactPersons) {
            vm.employeeContactPerson = response.data.contactPersons;
            oldContactPersonId = vm.employeeContactPerson && vm.employeeContactPerson.length > 0 ? vm.employeeContactPerson[0].contactPersonId : null;
            if (addedContPerson) {
              vm.employeeContactPerson.push(addedContPerson);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // get Supplier List
      const getSupplierList = () => MasterFactory.getSupplierList().query().$promise.then((supplier) => {
        if (supplier && supplier.data) {
          _.each(supplier.data, (item) => {
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          });
          vm.SupplierList = supplier.data;
        }
        return $q.resolve(vm.SupplierList);
      }).catch((error) => BaseService.getErrorLog(error));
      const autocompletePromise = [getemployeeList(), getSupplierList(), getAccessLevel()];
      //if (!vm.employeeId)  // as edit time allcountrylist needed for auto fillup
      autocompletePromise.push(getAllCountryList());
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
        if (vm.employeeId) {
          getEmployeeDetail();
          getEmployeeCertificationList();
          getEmployeeResponsibilityList();
        }
        else {
          vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
          vm.employee.paymentMode = vm.paymentMode.Exempt;
          defaultCountry = _.find(vm.countryDetail, (item) => item.countryName === CORE.defaultSelectedCountry.countryName);
          if (defaultCountry && defaultCountry.countryID) {
            vm.employee.selectedCountryTxt = defaultCountry.countryName ? defaultCountry.countryName : '';
            vm.employee.countryID = defaultCountry.countryID;
            selectedCountry = defaultCountry;
            $timeout(() => {
              if (vm.autoCompleteCountry.inputName) {
                $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
              }
            });
          }
          vm.employee.isActive = true;
          vm.employee.personnelType = vm.personnelTypeRadioObj.personal;
          initAutoComplete();
        }
      }).catch((error) => BaseService.getErrorLog(error));

      // update save object employeeInfo
      const updateSaveObj = (employeeInfo) => {
        const newObj = employeeInfo;
        const resultObj = _.pickBy(newObj, _.identity);
        return resultObj;
      };

      const removeCountryDialCodeManual = (modelObj) => {
        modelObj.contact = removeDialCodeForPhnData('id_contact', modelObj.contact);
        modelObj.faxNumber = removeDialCodeForPhnData('id_faxNumber', modelObj.faxNumber);
      };

      const initAutoComplete = () => {
        vm.autoCompleteManagerDetail = {
          columnName: 'name',
          controllerName: USER.ADMIN_EMPLOYEE_ADD_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_EMPLOYEE_ADD_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.employee.managerID ? vm.employee.managerID : null,
          inputName: 'Manager',
          placeholderName: 'Manager',
          isRequired: false,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE],
            pageNameAccessLabel: CORE.LabelConstant.Personnel.PageName
          },
          isAddnew: true,
          callbackFn: getemployeeList
        };
        //vm.autoCompleteWorkAreaDetail = {
        //  columnName: 'gencCategoryName',
        //  controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        //  viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        //  keyColumnName: 'gencCategoryID',
        //  keyColumnId: vm.employee.workAreaID ? vm.employee.workAreaID : null,
        //  inputName: vm.WorkArea.Name,
        //  placeholderName: CORE.CategoryType.WorkArea.Title,
        //  addData: { headerTitle: CORE.CategoryType.WorkArea.Title },
        //  isRequired: false,
        //  isAddnew: true,
        //  callbackFn: getWorkAreaList
        //}
        vm.autoCompleteCountry = {
          columnName: 'countryName',
          //parentColumnName: 'countryAlias',
          controllerName: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_COUNTRY_ADD_UPDATE_MODAL_VIEW,
          keyColumnName: 'countryID',
          keyColumnId: vm.employee ? vm.employee.countryID : null,
          inputName: 'Country',
          placeholderName: 'Country',
          isRequired: false,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_COUNTRY_STATE],
            pageNameAccessLabel: CORE.PageName.country
          },
          isAddnew: true,
          callbackFn: function (obj) {
            const searchObj = {
              countryID: obj
            };
            return getAllCountryList(searchObj);
          },
          onSelectCallbackFn: getEmployeeCountry,
          onSearchFn: function (query) {
            const searchObj = {
              searchQuery: query,
              inputName: vm.autoCompleteCountry.inputName
            };
            return getAllCountryList(searchObj);
          }
        };
        vm.autoCompleteSupplier = {
          columnName: 'mfgName',
          controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.employee.supplierID ? vm.employee.supplierID : null,
          inputName: 'Supplier',
          placeholderName: 'Supplier',
          isAddnew: true,
          callbackFn: getSupplierList,
          addData: {
            mfgType: CORE.MFG_TYPE.DIST, masterPage: true,
            popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
            pageNameAccessLabel: CORE.PageName.supplier
          }
        };
        vm.autoCompleteContactPerson = {
          controllerName: USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_MANAGE_CONTACTPERSON_MODAL_VIEW,
          columnName: 'fullName',
          keyColumnName: 'personId',
          keyColumnId: null,
          inputName: 'fullName',
          placeholderName: 'Contact person',
          isRequired: false,
          isAddnew: true,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_CONTACT_PERSON_STATE],
            pageNameAccessLabel: CORE.PageName.ContactPerson,
            headerTitle: 'avcd',
            isFromEmployeePage: true,
            refTableName: CORE.Import_export.Personnel.Table_Name
          },
          callbackFn: (item) => {
            getContactPersonList(item);
          },
          onSearchFn: function (query) {
            const searchObj = {
              searchQuery: query
            };
            return getContactPersonList(searchObj);
          },
          onSelectCallbackFn: (item) => {
            vm.addedContactPerson = item;
          }
        };
      };

      vm.externalEmployeeChanged = () => {
        if (!vm.employee.isExternalEmployee) {
          vm.autoCompleteSupplier.keyColumnId = null;
        }
      };

      vm.cropImage = (file, ev) => {
        if (!file) {
          return;
        }
        file.isProfileImage = true;

        DialogFactory.dialogService(
          USER.IMAGE_CROP_CONTROLLER,
          USER.IMAGE_CROP_VIEW,
          ev,
          file).then((res) => {
            vm.originalFileName = file.name;
            vm.croppedImage = res.croppedImage;
            vm.imagefile = vm.croppedImage;
            $scope.$parent.vm.employeeDetail.$$controls[0].$setDirty();
          }, () => { // Empty Block.
          }, () => {
            if (oldImgfile === vm.imagefile) {
              $scope.$parent.vm.employeeDetail.profileImage.$dirty = false;
            }
          });
      };
      //delete image
      vm.deleteImage = () => {
        vm.employeeDetail.$$controls[0].$setDirty();
        if (vm.employee.profileImg || vm.imagefile) {
          vm.employee.profileImg = null;
          vm.imagefile = null;
          vm.croppedImage = null;
          vm.originalFileName = '';
          return vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
        }
      };

      //Check login user at time of set inactive or also check user is not active for any transactions
      vm.checkLogInuser = (emp) => {
        const login = BaseService.loginUser;
        if (login.userid === emp.userID) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.EMP_INACTIVE_ERROR);
          const obj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(obj);

          vm.employee.isActive = true;
          vm.isActiveChange = false;
        }
        else if (!vm.employee.isActive && vm.EmployeeActiveTrans) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.EMP_TRANS_ERROR);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          vm.employee.isActive = !vm.employee.isActive;
          vm.isActiveChange = vm.isActiveChange ? false : false;
        } else {
          vm.isActiveChange = vm.isActiveChange ? true : true;
        }
      };

      /* called for max length validation */
      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      //check emailid Already Exists
      vm.checkEmailIDAlreadyExists = (employeeDetailForm, checkUniquefield) => {
        const EncryptedEmail = vm.employee.email ? encryptAES(vm.employee.email) : null;
        if (checkUniquefield === 'email') {
          checkUniquefieldValue = EncryptedEmail ? EncryptedEmail.toString() : null;
          checkFieldName = checkUniquefield;
        } else if (checkUniquefield === 'code') {
          checkUniquefieldValue = vm.employee.code;
          checkFieldName = checkUniquefield;
        }
        else if (checkUniquefield === 'initialName') {
          checkUniquefieldValue = vm.employee.initialName;
          checkFieldName = checkUniquefield;
        }

        if (vm.employee && checkUniquefieldValue) {
          const objs = {
            id: vm.employeeId,
            checkUniquefieldValue: checkUniquefieldValue,
            checkFieldName: checkFieldName
          };
          vm.cgBusyLoading = EmployeeFactory.checkEmailIDAlreadyExists().query({ objs: objs }).$promise.then((res) => {
            vm.cgBusyLoading = false;
            if (res.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
              if (checkResponseHasCallBackFunctionPromise(res)) {
                res.alretCallbackFn.then(() => {
                  if (checkUniquefield === 'email') {
                    vm.employee.email = '';
                    setFocusByName('email');
                  } else if (checkUniquefield === 'code') {
                    vm.employee.code = '';
                    setFocusByName('employeecode');
                  } else if (checkUniquefield === 'initialName') {
                    vm.employee.initialName = '';
                    setFocusByName('initialName');
                  }
                });
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      //check logoutIdle Time minimum 15 minute
      vm.checklogoutIdleTime = (employeeDetail) => {
        //console.log(vm.employeeDetail.logoutIdleTime.$error);
        vm.logoutIdleTime = null;
        const logoutIdleTime = vm.employee.logoutIdleTime ? timeToSeconds(vm.employee.logoutIdleTime) : null;

        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MINUME_FIVE_MINUTE_REQUIRED);
        // let obj = {
        //   messageContent: messageContent,
        //   multiple: true
        // };

        if (vm.employee.logoutIdleTime && logoutIdleTime < 300) {
          // DialogFactory.messageAlertDialog(obj);
          employeeDetail.$invalid = true;
          return vm.logoutIdleTime = messageContent.message;
        }
      };

      // Function for send notification when user change the other user role-right-permiddion
      const sendNotificationAllActiveSession = () => {
        RolePagePermisionFactory.sendNotificationOfRightChanges().query({ id: vm.employeeId }).$promise.then(() => {
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      };

      // open pop up for adding employee Certification
      vm.addEmpStandard = (ev) => {
        vm.standardDisable = true;
        if (!vm.employeeId) {
          return;
        }
        const data = {
          employeeID: vm.employeeId,
          employeeName: stringFormat(CORE.NameDisplayFormat, vm.employee.firstName, vm.employee.lastName)
        };
        DialogFactory.dialogService(
          USER.EMP_CERTIFICATION_MODAL_CONTROLLER,
          USER.EMP_CERTIFICATION_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.standardDisable = false;
          }, () => {
            vm.standardDisable = false;
            getEmployeeCertificationList();
          }, (err) => {
            vm.standardDisable = false;
            return BaseService.getErrorLog(err);
          });
      };

      // Click Evenet  of 'personnelType'
      vm.changeIsContactPersonRequired = () => {
        if ((vm.employee.personnelType === vm.personnelTypeRadioObj.personal) && vm.employeeContactPerson.length > 0) {
          vm.employee.personnelType = vm.personnelTypeRadioObj.functional;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RELEASE_CURRENT_CONT_PERSON);
          const model = {
            messageContent: messageContent,
            multiple: true
          };

          DialogFactory.messageAlertDialog(model).then(() => {
            // Need to Revert form dirty if we Reverted 'personnelType' Input value and other fields are not in dirty.
            const isFormDirty = _.some(vm.employeeDetail.$$controls, (control) => control.$dirty && (control.$name !== 'personnelType'));
            if (!isFormDirty) {
              vm.employeeDetail.$setPristine();
              vm.employeeDetail.$setUntouched();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          $scope.$broadcast(vm.autoCompleteContactPerson.inputName + 'searchText', null);
        }
      };

      // Add Contact person on UI list.
      vm.addContactPerson = () => {
        if (vm.addedContactPerson && vm.addedContactPerson.employeeContactPerson && vm.addedContactPerson.employeeContactPerson.length > 0 && vm.addedContactPerson.employeeContactPerson[0].id) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CONT_PERSON_ALREADY_ASSIGNED);
          messgaeContent.message = stringFormat(messgaeContent.message, vm.addedContactPerson.fullName.split('|')[0], vm.addedContactPerson.employeeContactPerson[0].employee.formattedEmpName);
          const model = {
            messageContent: messgaeContent
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              $scope.$broadcast(vm.autoCompleteContactPerson.inputName + 'searchText', null);
            }
          }).catch((error) => {
            BaseService.getErrorLog(error);
          });
        } else {
          if (vm.employeeContactPerson && vm.employeeContactPerson.length > 0) {
            const newAssignedContPerson = _.find(vm.employeeContactPerson, (item) => !item.id);
            const assignedContPerson = _.find(vm.employeeContactPerson, (item) => item.id);
            let messageContent = {};
            if (newAssignedContPerson) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.OLD_CONT_PERSON_OVERRIDE);
              messageContent.message = stringFormat(messageContent.message, vm.addedContactPerson.fullName.split('|')[0], newAssignedContPerson.contactPerson.fullName);
            } else if (assignedContPerson) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.OLD_CONT_PERSON_RELEASED);
              messageContent.message = stringFormat(messageContent.message, assignedContPerson.contactPerson.fullName, vm.employee.formattedName, vm.addedContactPerson.fullName.split('|')[0]);
            }

            if (messageContent && messageContent.message) {
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then(() => {
                vm.assignContPerson();
              }, () => { // Empty Block.
              }).catch((error) => {
                BaseService.getErrorLog(error);
              });
            }
          } else {
            vm.assignContPerson();
          }
        }
      };

      // Add Contact person on UI List.
      vm.assignContPerson = () => {
        vm.employeeContactPerson = _.filter(vm.employeeContactPerson, (item) => item.id);
        vm.addedContactPerson.fullName = vm.addedContactPerson.fullName.split('|')[0];
        const contactPersonInfo = {
          displayOrder: 1,
          contactPerson: vm.addedContactPerson
        };
        vm.employeeContactPerson.push(contactPersonInfo);
        $scope.$broadcast(vm.autoCompleteContactPerson.inputName + 'searchText', null);
      };

      // Remove Contact person From UI list.
      vm.removeContactPerson = () => {
        vm.employeeContactPerson = _.filter(vm.employeeContactPerson, (item) => item.id); // There is Always one Record added in list.
      };

      // Check ContactPErson Assigned Validation and SaveEmployee .
      vm.savePersonnel = () => {
        if (vm.autoCompleteContactPerson.keyColumnId) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CONT_PERSON_NOT_ASSIGNED);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
          };

          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.SaveEmployee();
          }, () => {
            $scope.$parent.vm.saveDisable = false;
          }).catch((error) => {
            $scope.$parent.vm.saveDisable = false;
            BaseService.getErrorLog(error);
          });
        } else {
          vm.SaveEmployee();
        }
      };

      vm.SaveEmployee = () => {
        const OriginalEmailText = vm.employee.email;
        let EncryptedEmail = angular.copy(vm.employee.email);
        EncryptedEmail = encryptAES(EncryptedEmail);

        if (vm.croppedImage) {
          const filename = vm.originalFileName;
          const originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;

          vm.imageName = `${originalFileName}.png`;
          vm.employee.fileArray = Upload.dataUrltoBlob(vm.croppedImage,
            vm.imageName);
        }

        const addedContactPerson = _.find(vm.employeeContactPerson, (item) => !item.id);
        let employeeInfo = {
          id: vm.employee.id,
          firstName: vm.employee.firstName,
          middleName: vm.employee.middleName,
          lastName: vm.employee.lastName,
          email: EncryptedEmail.toString() ? EncryptedEmail.toString() : '',
          contact: vm.employee.contact ? vm.employee.contact : '',
          burdenRate: vm.employee.burdenRate ? vm.employee.burdenRate : null,
          street1: vm.employee.street1 ? vm.employee.street1 : '',
          street2: vm.employee.street2 ? vm.employee.street2 : '',
          street3: vm.employee.street3 ? vm.employee.street3 : '',
          postcode: vm.employee.postcode ? vm.employee.postcode : '',
          city: vm.employee.city ? vm.employee.city : '',
          state: vm.employee.state ? (vm.employee.state).toUpperCase() : '',
          countryID: vm.employee.countryID ? vm.employee.countryID : null,
          profile: vm.employee.fileArray,
          profileId: vm.profileId,
          paymentMode: vm.employee.paymentMode,
          code: (vm.employee.code).toUpperCase(),
          visibleCode: (vm.employee.code.substr(vm.employee.code.length - 4)).toUpperCase(),
          managerID: vm.autoCompleteManagerDetail.keyColumnId ? vm.autoCompleteManagerDetail.keyColumnId : null,
          faxNumber: vm.employee.faxNumber ? vm.employee.faxNumber : '',
          //workAreaID: vm.autoCompleteWorkAreaDetail.keyColumnId ? vm.autoCompleteWorkAreaDetail.keyColumnId : null,
          supplierID: vm.autoCompleteSupplier.keyColumnId ? vm.autoCompleteSupplier.keyColumnId : null,
          entityID: vm.entityName.ID,
          ownertype: vm.entityName.Name,
          profileImg: vm.employee.profileImg,
          userId: vm.employee.userId ? vm.employee.userId : null,
          initialName: vm.employee.initialName,
          isExternalEmployee: vm.employee.isExternalEmployee ? vm.employee.isExternalEmployee : false,
          isUser: true,
          isActive: vm.employee.isActive,
          phExtension: vm.employee.phExtension,
          contactCountryCode: vm.employee.contact ? vm.employee.contactCountryCode : null,
          faxCountryCode: vm.employee.faxNumber ? vm.employee.faxCountryCode : null,
          logoutIdleTime: vm.employee.logoutIdleTime ? timeToSeconds(vm.employee.logoutIdleTime) : null,
          personnelType: vm.employee.personnelType,
          personId: (vm.employee.personnelType === vm.personnelTypeRadioObj.functional && addedContactPerson && addedContactPerson.contactPerson) ? addedContactPerson.contactPerson.personId : null,
          oldPersonId: oldContactPersonId || null,
          isContactPersonChanged: ((vm.employeeMain && vm.employee && (vm.employeeMain.personnelType !== vm.employee.personnelType)) || (addedContactPerson ? ((oldContactPersonId || null) !== (addedContactPerson.contactPerson ? addedContactPerson.contactPerson.personId : null)) : false)) ? true : false
        };
        employeeInfo = updateSaveObj(employeeInfo);
        employeeInfo.contact = addDialCodeForPhnData('id_contact', employeeInfo.contact);
        employeeInfo.faxNumber = addDialCodeForPhnData('id_faxNumber', employeeInfo.faxNumber);
        /* STATIC CODE as _.pickBy(newObj, _.identity) return only true type fields  */
        if (!employeeInfo.isExternalEmployee) {
          employeeInfo.isExternalEmployee = false;
        }
        if (!employeeInfo.isActive) {
          employeeInfo.isActive = false;
        }
        if (vm.employee && vm.employee.id) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.CHANGE_PERSONNEL_PERMISSION_SEND_NOTIFICATION);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_SEND_NOTIFICATION,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
          };
          return DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = Upload.upload({
                url: `${CORE.API_URL}employees/${vm.employee.id}`,
                method: 'PUT',
                data: employeeInfo
              }).then((res) => {
                removeCountryDialCodeManual(employeeInfo);
                if (res.data.data && !res.data.errors) {
                  if (res.data.data) {
                    employeeInfo.formattedName = res.data.data.formattedName;
                    vm.employeeMain = angular.copy(employeeInfo);
                    vm.employee = employeeInfo;
                    if (employeeInfo.isContactPersonChanged) {
                      refreshEmployeeContactPerson();
                    }
                    $scope.$broadcast(vm.autoCompleteContactPerson.inputName + 'searchText', null);
                    vm.employee.email = OriginalEmailText;
                    vm.employee.logoutIdleTime = convertDisplayTime(vm.employee.logoutIdleTime);
                    vm.confirmCode = vm.employee.code;
                    vm.confirmEmail = vm.employee.email;
                    $scope.$parent.vm.employeeTitle = ': ' + vm.employee.formattedName;
                    $scope.$broadcast('refreshGrid', true);
                    const data = {
                      profileImg: res.data.data.profileImg,
                      empID: vm.employee.id
                    };
                    /* only for debug purpose - [S]*/
                    const tractActivityLog = getLocalStorageValue('tractActivityLog');
                    if (tractActivityLog && Array.isArray(tractActivityLog)) {
                      const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set Loginuser: empDetail_!' };
                      tractActivityLog.push(obj);
                      setLocalStorageValue('tractActivityLog', tractActivityLog);
                    }
                    /* [E]*/
                    BaseService.setLoginUser(null, data);
                    $rootScope.$emit('loginuser');
                    if (res.data.data) {
                      vm.userId = res.data.data.id;

                      if (res.data.data.profileImg) {
                        vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_BASE_PATH + res.data.data.profileImg;
                        vm.originalFileName = res.data.data.profileImg;
                      }
                      else {
                        vm.imagefile = CORE.WEB_URL + USER.EMPLOYEE_DEFAULT_IMAGE_PATH + 'profile.jpg';
                        vm.originalFileName = '';
                      }
                    }
                    else {
                      vm.userId = res.data.data.id;
                    }
                    if (vm.userId) {
                      vm.isUser = true;
                      vm.isUpdatePagePermison = true;
                      //   vm.getPermission();
                    }
                    vm.isCreateMode = false;
                    oldImgfile = vm.imagefile;
                    // msWizard.nextStep();
                    // vm.UpdateUser(msWizard);
                  }
                }
                $scope.$parent.vm.saveDisable = false;
                vm.employeeDetail.$setPristine();
                $scope.$parent.vm.ischangePage = false;
              }).catch((error) => {
                $scope.$parent.vm.saveDisable = false;
                return BaseService.getErrorLog(error);
              });
              sendNotificationAllActiveSession();
            }
          }, () => {
            $scope.$parent.vm.saveDisable = false;
          }).catch((error) => {
            $scope.$parent.vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
        else {
          vm.cgBusyLoading = Upload.upload({
            url: CORE.API_URL + USER.ADMIN_EMPLOYEE_PATH,
            data: employeeInfo
          }).then((res) => {
            removeCountryDialCodeManual(employeeInfo);
            if (res.data && res.data.data) {
              employeeInfo.formattedName = res.data.data.formattedName;
              vm.employeeMain = angular.copy(employeeInfo);
              vm.employee = employeeInfo;
              if (employeeInfo.isContactPersonChanged) {
                refreshEmployeeContactPerson();
              }
              $scope.$broadcast(vm.autoCompleteContactPerson.inputName + 'searchText', null);
              vm.employee.email = OriginalEmailText;
              vm.employee.logoutIdleTime = convertDisplayTime(vm.employee.logoutIdleTime);
              vm.confirmCode = vm.employee.code;
              vm.confirmEmail = vm.employee.email;
              $scope.$parent.vm.employeeTitle = ': ' + vm.employee.formattedName;
              if (res.data.data[0]) {
                const data = {
                  profileImg: res.data.data[0].profileImg,
                  empID: vm.employee.id
                };
                /* only for debug purpose - [S]*/
                const tractActivityLog = getLocalStorageValue('tractActivityLog');
                if (tractActivityLog && Array.isArray(tractActivityLog)) {
                  const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''), message: 'Set Loginuser: empDetail_2' };
                  tractActivityLog.push(obj);
                  setLocalStorageValue('tractActivityLog', tractActivityLog);
                }
                /* [E]*/
                BaseService.setLoginUser(null, data);
                $rootScope.$emit('loginuser');
                vm.employee.id = res.data.data[0].id;
                vm.employeeId = vm.employee.id;
                vm.originalFileName = res.data.data[0].profileImg;
                if (res.data.data[1]) {
                  vm.isUser = true;
                  vm.isUpdatePagePermison = true;
                  vm.userId = res.data.data[1].id;
                }
                vm.isCreateMode = false;
                vm.employeeDetail.$setPristine();
                //need to re-factor auto commit  at API side
                //$timeout(function () {
                $state.go(USER.ADMIN_EMPLOYEE_MANAGE_DETAIL_STATE, { id: vm.employeeId });
                //}, _configTimeout);
              }
            }
            $scope.$parent.vm.saveDisable = false;
            vm.employeeDetail.$setPristine();
            $scope.$parent.vm.ischangePage = false;
          }).catch((error) => {
            $scope.$parent.vm.saveDisable = false;
            return BaseService.getErrorLog(error);
          });
        }
      };

      /* Find and set address from zip-code*/
      vm.FindAddress = () => {
        if (vm.employee.postcode && vm.employee.postcode.length === 5) {
          const geocoder = new google.maps.Geocoder();
          const zip = vm.employee.postcode;
          let city = '';
          let state = '';
          let country = '';
          geocoder.geocode({ 'address': zip }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              const address_components = results[0].address_components;
              _.each(address_components, (component) => {
                const types = component.types;
                _.each(types, (type) => {
                  if (type === 'locality') {
                    city = component.long_name;
                  }
                  if (type === 'administrative_area_level_1') {
                    state = component.long_name;
                  }
                  if (type === 'country') {
                    country = component.long_name;
                  }
                });
              });

              $timeout(() => {
                /* if data added manually then no need to replace else replace finded one */
                vm.employee.city = vm.employee.city ? vm.employee.city : (city ? city : null);
                vm.employee.state = vm.employee.state ? vm.employee.state : (state ? state.toUpperCase() : null);
                if (!vm.employee.countryID) {
                  if (country) {
                    const matchedCountry = _.find(allCountryList, (item) => item.countryName === country);
                    if (matchedCountry && matchedCountry.countryID) {
                      vm.autoCompleteCountry.keyColumnId = matchedCountry.countryID;
                      vm.employee.selectedCountryTxt = matchedCountry.countryName ? matchedCountry.countryName : '';
                      vm.employee.countryID = matchedCountry.countryID;
                      selectedCountry = matchedCountry;
                      $timeout(() => {
                        if (vm.autoCompleteCountry.inputName) {
                          $scope.$broadcast(vm.autoCompleteCountry.inputName, selectedCountry);
                        }
                      });
                    }
                  }
                  else {
                    vm.employee.countryID = null;
                  }
                }
              }, 0);
            }
          });
        }
      };

      // open pop up for adding employee Responsibility
      vm.addEmpResponsibility = (ev) => {
        vm.ResponsibilityDisable = true;
        if (!vm.employeeId) {
          return;
        }
        const data = {
          employeeID: vm.employeeId,
          employeeName: stringFormat(CORE.NameDisplayFormat, vm.employee.firstName, vm.employee.lastName)
        };
        DialogFactory.dialogService(
          USER.EMP_RESPONSIBILITY_MODAL_CONTROLLER,
          USER.EMP_RESPONSIBILITY_MODAL_VIEW,
          ev,
          data).then(() => {
            vm.ResponsibilityDisable = false;
          }, () => {
            vm.ResponsibilityDisable = false;
            getEmployeeResponsibilityList();
          }, (err) => {
            vm.ResponsibilityDisable = false;
            return BaseService.getErrorLog(err);
          });
      };

      /* Release Contact Person */
      vm.releaseContatPerson = (contactPersonData) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RELEASE_CONT_PERSON);
        messageContent.message = stringFormat(messageContent.message, contactPersonData.contactPerson.fullName, vm.employee.formattedName);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then(() => {
          vm.cgBusyLoading = EmployeeFactory.releaseContactPersonById().query({ contactPersonData: contactPersonData }).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              refreshEmployeeContactPerson(true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Commented As May need to Implement in Future. */
      /* Delete Contact Person from UI List. */
      //vm.deleteContactPerson = () =>
      //const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
      //messageContent.message = stringFormat(messageContent.message, contactPersonData.contactPerson.fullName);
      //const obj = {
      //  messageContent: messageContent,
      //  btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
      //  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
      //};

      //DialogFactory.messageConfirmDialog(obj).then(() => {
      //  vm.cgBusyLoading = EmployeeFactory.deleteEmployeeContactPerson().query({ contactPersonData: contactPersonData }).$promise.then((response) => {
      //    if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
      //      refreshEmployeeContactPerson();
      //      $scope.$broadcast(vm.autoCompleteContactPerson.inputName + 'searchText', null);
      //    }
      //  }).catch((error) => BaseService.getErrorLog(error));
      //}, () => {
      //}).catch((error) => BaseService.getErrorLog(error));
      //};

      // Open contact person history popup.
      vm.openContactPersonHistory = (ev) => {
        const data = {
          title: CORE.LabelConstant.EmployeeContPersonHistory.EmployeePopupTitle,
          employeeId: vm.employee.id,
          headerData: [{
            label: CORE.MainTitle.Employee,
            value: vm.employee.formattedName,
            displayOrder: 1,
            labelLinkFn: vm.goToPersonnelList,
            valueLinkFn: vm.goToManagePersonnel,
            valueLinkFnParams: vm.employee.id
          }]
        };
        DialogFactory.dialogService(
          USER.ADMIN_EMPLOYEE_CONTACTPERSON_HISTORY_MODAL_CONTROLLER,
          USER.ADMIN_EMPLOYEE_CONTACTPERSON_HISTORY_MODAL_VIEW,
          ev,
          data).then(() => { // Empty Block.
          }, () => { // Empty Block.
          }, (err) => BaseService.getErrorLog(err));
      };

      // Goto Personnel List Page.
      vm.goToPersonnelList = () => {
        BaseService.goToPersonnelList();
      };
      // Manage Personnel Page.
      vm.goToManagePersonnel = (empId) => {
        BaseService.goToManagePersonnel(empId);
      };

      //redirect to Country master
      vm.goToCountryList = () => {
        BaseService.openInNew(USER.ADMIN_COUNTRY_STATE, {});
      };
      //redirect to supplier master
      vm.goToSupplierList = () => {
        BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {});
      };
      //redirect to Manager master
      vm.goToManagerList = () => {
        BaseService.openInNew(USER.ADMIN_EMPLOYEE_STATE, {});
      };
      //redirect to Responsibility master
      vm.goToResponsibilityList = () => {
        BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_WORKAREA_STATE, {});
      };
      //redirect to Contact Person list page.
      vm.goToContactPersonList = () => {
        BaseService.goToContactPersonList();
      };

      vm.StandardList = () => {
        BaseService.goToStandardList();
      };

      angular.element(() => {
        setFocusByName('employeefirstname');
        $scope.$parent.vm.employeeDetail = vm.employeeDetail;
        BaseService.currentPageForms.push(vm.employeeDetail);
      });

      const saveEmployeeDetailChanges = $scope.$on('saveEmployeeDetailChanges', () => {
        vm.savePersonnel();
      });

      $scope.$on('$destroy', () => {
        saveEmployeeDetailChanges();
      });
    }
  }
})();
