(function () {
  'use strict';

  angular.module('app.admin.certificate-standard')
    .controller('CertificateStandardUpdateController', CertificateStandardUpdateController);

  /** @ngInject */
  function CertificateStandardUpdateController($scope, $q, $state, $stateParams, $rootScope, MasterFactory, $timeout, DialogFactory, USER, Upload, RoleFactory, CORE, $mdDialog, GenericCategoryFactory, CertificateStandardFactory, DataElementTransactionValueFactory, $filter, BaseService) {
    const vm = this;
    vm.IsOtherDetailTab = false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.isSubmit = false;
    vm.standardDet = null;
    vm.standardClassData = [];
    vm.entityID = CORE.AllEntityIDS.CertificateStandard.ID;
    vm.entityName = CORE.AllEntityIDS.CertificateStandard.Name;
    vm.todayDate = new Date();
    vm.fromDate = vm.todayDate;
    vm.taToolbar = CORE.Toolbar;
    vm.OtherDetailTitle = CORE.OtherDetail.TabName;
    vm.StandardsTabs = USER.StandardsTabs;
    vm.CORE_NO_IMAGE_STANDARD = CORE.WEB_URL + CORE.NO_IMAGE_STANDARD;
    vm.selectedTabIndex;
    vm.certificateStandardID = $stateParams.id;
    vm.classID = $stateParams.classID || null;
    vm.tabName = $stateParams.tabname;
    vm.isSelected = false;
    let oldStandardName = '';
    let oldStandardCode = '';
    /* for down arrow key open datepicker */
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.certificateDate] = false;

    vm.isIssuedateOpen = {};
    vm.isIssuedateOpen[vm.DATE_PICKER.issueDate] = false;
    vm.imageURL = vm.CORE_NO_IMAGE_STANDARD;

    vm.radioButtonGroup = {
      isActive: {
        array: USER.StandardsRadioGroup.isActive,
      }
    }

    vm.issueDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };

    vm.openPicker = (type, ev) => {
      if (ev.keyCode == 40) {
        vm.IsPickerOpen[type] = true;
      }
    };

    vm.openIssuePicker = (type, ev) => {
      if (ev.keyCode == 40) {
        vm.isIssuedateOpen[type] = true;
      }
    };

    if (vm.tabName) {
      var tab = _.find(vm.StandardsTabs, (item) => {
        return item.Name == vm.tabName;
      })
      if (tab) {
        vm.selectedTabIndex = tab.ID;
      }
    }

    //on radio button change model will be null
    vm.valueChange = () => {
      if (vm.standardDet.isCertified == false) {
        vm.standardDet.cerificateNumber = null;
        vm.autoCompleteSupplier.keyColumnId = null;
        vm.standardDet.cerificateIssueDate = null;
        vm.standardDet.certificateDate = null;
      }
    }

    vm.roles = [];
    // retrieve role
    vm.getRoleList = () => {
      return RoleFactory.rolePermission().query().$promise.then((d) => {
        vm.roles = _.filter(d.data, (item) => {
          if (item.isActive) {
            return item.isChecked = false;
          }
        })
        vm.roles = _.sortBy(d.data, 'accessLevel');
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //select All Role
    vm.selectAllRoles = () => {
      _.each(vm.roles, function (item) {
        item.isChecked = vm.isSelected;
      })
    }
    vm.checkChange = () => {
      var isAnyUnChecked = _.some(vm.roles, (o) => {
        return o.isChecked == false && o.isActive;
      });
      vm.isSelected = !isAnyUnChecked;
    }
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    /* for down arrow key open datepicker */
    const standard = {
      fullName: null,
      shortName: null,
      description: null,
      //displayOrder: null,
      isActive: true,
      isCertified: false,
      isRequired: false,
      passwordProtected: false,
      certificateDate: null
    };
    vm.dataElementList = [];
    vm.Entity = CORE.Entity;
    vm.entityID = 0;
    vm.sid = $stateParams.id ? $stateParams.id : null;

    let FileAllow = CORE.FileTypeList;
    vm.FileTypeList = _.map(FileAllow, 'extension').join(',');
    let GenericCategoryAllData = [];
    vm.Standardtype = CORE.CategoryType.StandardType;

    // get Supplier List
    let getSupplierList = () => {
      let queryObj = {
        isCustomerCodeRequired: true
      }
      return MasterFactory.getSupplierList().query(queryObj).$promise.then((supplier) => {
        if (supplier && supplier.data) {
          _.each(supplier.data, function (item) {
            item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
          });
          vm.SupplierList = supplier.data;
        }
        return $q.resolve(vm.SupplierList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //Get Generic category list to bind standard type
    let getstandardTypeList = () => {
      let GencCategoryType = [];
      GencCategoryType.push(vm.Standardtype.Name);
      let listObj = {
        GencCategoryType: GencCategoryType,
        isActive: vm.certificateStandardID ? true : false
      }
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        GenericCategoryAllData = genericCategories.data;
        vm.StandardTypeList = _.filter(GenericCategoryAllData, (item) => {
          return item.parentGencCategoryID == null && item.categoryType == vm.Standardtype.Name;
        });
        return $q.resolve(vm.StandardTypeList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });

    }

    vm.StandardTypeList = getstandardTypeList();
    vm.stateTransfer = (tabIndex) => {
      var itemTabName = _.find(vm.StandardsTabs, function (valItem) {
        return valItem.ID == tabIndex;
      })
      if (itemTabName && itemTabName.Name != vm.tabName) {
        switch (itemTabName.Name) {
          case vm.StandardsTabs.Detail.Name:
            $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: vm.certificateStandardID });
            break;
          case vm.StandardsTabs.Documents.Name:
            $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DOCUMENTS_STATE, { id: vm.certificateStandardID });
            break;
          case vm.StandardsTabs.Personnel.Name:
            $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_PERSONNEL_STATE, { id: vm.certificateStandardID });
            break;
          case vm.StandardsTabs.MISC.Name:
            $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_MISC_STATE, { id: vm.certificateStandardID });
            break;
          default:
        }
      }
    }

    vm.checkCertificateDate = () => {
      if (vm.standardDet.certificateDate) {
        if (vm.standardDet.cerificateIssueDate) {
          var selectedIssuedate = new Date(vm.standardDet.cerificateIssueDate);
          if (vm.standardDet.certificateDate < selectedIssuedate) {
            vm.fromDate = "";
            vm.standardDet.cerificateIssueDate = null;
          }
        }
        let certificateDate = new Date(vm.standardDet.certificateDate.setHours(0, 0, 0, 0));
        let todayDate = new Date(vm.todayDate.setHours(0, 0, 0, 0));
        if (certificateDate < todayDate) {
          vm.standardDet.certificateDate = null;
          vm.fromDate = "";
        }
        else {
          vm.fromDate = certificateDate;
        }
      }
    }

    vm.checkFormDirty = (form, columnName) => {
      let result = BaseService.checkFormDirty(form, columnName) || vm.generalDetailForm.$dirty;
      return result;
    }
    //retrieve certificate standard data
    let certificateStandardIdwise = () => {
      if ($stateParams.id || vm.certificateStandardID) {
        return CertificateStandardFactory.retriveCertificateStandards().query({ id: $stateParams.id ? $stateParams.id : vm.certificateStandardID }).$promise.then((response) => {
          vm.standardDet = angular.copy(response.data);

          if (vm.standardDet && vm.standardDet.imageURL) {
            vm.imageURL = CORE.WEB_URL + USER.CERTIFICATE_STANDARDS_BASE_PATH + vm.standardDet.imageURL;
          }

          vm.standardDet.cerificateIssueDate = vm.standardDet.cerificateIssueDate ? BaseService.getUIFormatedDate(vm.standardDet.cerificateIssueDate, vm.DefaultDateFormat) : '';
          vm.standardDet.certificateDate = vm.standardDet.certificateDate ? BaseService.getUIFormatedDate(vm.standardDet.certificateDate, vm.DefaultDateFormat) : '';

          vm.certificateDateOptions = {
            minDate: vm.standardDet.cerificateIssueDate ? vm.standardDet.cerificateIssueDate : '',
            isTodayDate: vm.standardDet.cerificateIssueDate ? false : true,
            appendToBody: true
          };
          if (vm.standardDet && vm.standardDet.certificateStandardRole && vm.standardDet.certificateStandardRole.length > 0) {
            vm.standardDet.roles = vm.standardDet.certificateStandardRole;
          }
          //   vm.cgBusyLoading = CertificateStandardFactory.standardClass().query({ id: vm.standardDet.certificateStandardID }).$promise.then((standardClass) => {
          if (vm.standardDet && vm.standardDet.CertificateStandard_Class && vm.standardDet.CertificateStandard_Class.length > 0) {
            vm.standardClass = {
              certificateStandardID: $stateParams.id ? $stateParams.id : null,
              className: vm.standardDet.CertificateStandard_Class
            }
            vm.standardClassData = vm.standardDet.CertificateStandard_Class
          }
          else {
            vm.standardClass = {
              certificateStandardID: $stateParams.id ? $stateParams.id : null,
              className: null
            }
          }
          vm.standardDetCopy = angular.copy(vm.standardDet);
          
          if (vm.sid && vm.generalDetailForm) {
            $timeout(function () {
              BaseService.checkFormValid(vm.generalDetailForm, false);
              vm.checkDirtyObject = {
                columnName: ["standardInfo"],
                oldModelName: vm.standardDetCopy,
                newModelName: vm.standardDet
              }
            }, 0);
          }
          return $q.resolve(vm.standardDet);
          
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.standardDet = Object.assign({}, standard);
        vm.certificateDateOptions = {
          minDate: vm.todayDate,
          isTodayDate: true,
          appendToBody: true
        };
        vm.standardDetCopy = angular.copy(vm.standardDet);
        vm.checkDirtyObject = {
          columnName: ["standardInfo"],
          oldModelName: vm.standardDetCopy,
          newModelName: vm.standardDet
        }
      }
    }
    var autocompletePromise = [getstandardTypeList(), certificateStandardIdwise(), getSupplierList(), vm.getRoleList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      
      if (vm.standardDet.roles && vm.standardDet.roles.length > 0 && vm.roles && vm.roles.length > 0) {
        vm.roleIDs = []
        _.each(vm.standardDet.roles, function (item) {
          vm.roleIDs.push(item.roleID);
        })
        _.map(vm.roles, (o) => {
          o.isChecked = vm.roleIDs.indexOf(o.id) != -1;
        });
        var isAnyUnChecked = _.some(vm.roles, (o) => {
          return o.isChecked == false && o.isActive;
        });
        vm.isSelected = !isAnyUnChecked;

        _.map(vm.standardDet.roles, function (data) {
          _.map(vm.roles, function (item) {
            if (data.roleID == item.id) {
              return item.isChecked = true;
            }
          });
        });
        let RoleselectedData = _.filter(vm.roles, function (data) {
          if ((data.isActive) || data.isChecked && !data.isActive) {
            return data;
          }
        });
        vm.roles = RoleselectedData;
      }
      else {
        if (vm.roles.length > 0) {
          var activeRoles = _.filter(vm.roles, function (Role) {
            if (Role.isActive)
              return Role;
          });
          vm.roles = activeRoles;
        }
      }
      initAutoComplete();
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });
    vm.CheckStepAndAction = (msWizard, isUnique, isSave) => {
    /*Used to focus on first error filed of form*/
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(msWizard.currentStepForm())) {
        vm.saveDisable = false;
        return;
      }
      if (msWizard.selectedIndex == vm.StandardsTabs.Detail.ID) {
        
        vm.saveStandardDet(msWizard);
      }
      else if (msWizard.selectedIndex == vm.StandardsTabs.Documents.ID) {
        msWizard.nextStep();
      }
      else if (msWizard.selectedIndex == vm.StandardsTabs.Personnel.ID) {
        msWizard.nextStep();
      }
      else if (msWizard.selectedIndex == vm.StandardsTabs.MISC.ID) {
        vm.finish();
      }
    }

    let selectStandard = (item) => {
      if (item) {
        $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { tabname: vm.StandardsTabs.Detail.Name, id: item.certificateStandardID });
        $timeout(() => {
          vm.autoCompleteStandard.keyColumnId = null;
        }, true);
      }
    }

    let getStandardSearch = (searchObj) => {
      return CertificateStandardFactory.getCertificateStandard().query(searchObj).$promise.then((certificate) => {
        vm.certificateStandardList = certificate.data;
        return vm.certificateStandardList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    /*Auto-complete for Search Standard */
    vm.autoCompleteStandard = {
      columnName: 'fullName',
      keyColumnName: 'certificateStandardID',
      keyColumnId: null,
      inputName: 'Standard',
      placeholderName: 'Standard',
      isRequired: false,
      isAddnew: false,
      onSelectCallbackFn: selectStandard,
      onSearchFn: function (query) {
        let searchobj = {
          searchquery: query
        }
        return getStandardSearch(searchobj);
      }
    }


    let initAutoComplete = () => {
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
        callbackFn: getSupplierList,
      }
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
      }
    }
    /*reset detail form*/
    function resetDetailForm() {
      if (vm.generalDetailForm) {
        vm.generalDetailForm.$setPristine();
      }
    }
    /**reset other detail form */
    function resetOtherDetailForm() {
      if (vm.certificateOtherDetail) {
        vm.certificateOtherDetail.$setPristine();
      }
    }

    //Save certificate standard
    vm.saveStandardDet = (msWizard) => {
      vm.isSubmit = false;
      if (vm.generalDetailForm && !vm.generalDetailForm.$valid) {
        vm.isSubmit = true;
        return;
      }

      var roles = _.filter(vm.roles, function (item) { return item.isChecked == true });
      roles = _.map(roles, function (item) { return item.id; })
      vm.standardDet.roles = roles;

      vm.standardDet.passwordProtected = vm.standardDet.passwordProtected;

      
      let _certificateDate = vm.standardDet.isCertified ? (BaseService.getAPIFormatedDate(vm.standardDet.certificateDate)) : null;
      let _cerificateIssueDate = vm.standardDet.cerificateIssueDate ? (BaseService.getAPIFormatedDate(vm.standardDet.cerificateIssueDate)) : null;
    
      let standardClassDetails = [];
      vm.standardClassData.forEach((value) => {
        let obj = { 'classID': value.classID ? value.classID : null, 'certificateStandardID': vm.standardDet.certificateStandardID ? vm.standardDet.certificateStandardID : null, 'className': value.className }
        standardClassDetails.push(obj);
      });

      vm.standardClassObj = {
        'certificateStandardID': vm.standardDet.certificateStandardID ? vm.standardDet.certificateStandardID : null,
        'standardClassInfo': standardClassDetails,
      }
      vm.objData = {
        certificateDetail: null,
        standardClassDetail: null,
      }
      vm.standardDet.standardTypeID = vm.autoCompleteStandardType.keyColumnId ? vm.autoCompleteStandardType.keyColumnId : null;
      vm.standardDet.certificateSupplierID = vm.autoCompleteSupplier.keyColumnId ? vm.autoCompleteSupplier.keyColumnId : null;
      delete vm.standardDet['displayOrder'];
      delete vm.standardDet['priority'];
      vm.objData.certificateDetail = angular.copy(vm.standardDet);
      vm.objData.certificateDetail.certificateDate = _certificateDate;
      vm.objData.certificateDetail.cerificateIssueDate = _cerificateIssueDate;
      vm.objData.standardClassDetail = vm.standardClassObj;
      if (vm.certificateStandardID && vm.certificateStandardID > 0) {
        vm.cgBusyLoading = CertificateStandardFactory.updateCertificateStandard().update({
          id: vm.certificateStandardID,
        }, vm.objData).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            $scope.$parent.vm.cgBusyLoading = $q.all([uploadCertificateStandardImage(true)]).then(function (responses) {
              resetDetailForm();
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
          else if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.data && res.data.isDuplicatefullName) {
            displayStandardNameUniqueMessage();
          }
          else if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.data && res.data.isDuplicateCode) {
            displayStandardCodeUniqueMessage();
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.generalDetailForm);
              });
            }
          }
          // vm.getCertificateStandardDocuments();
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
      else {
        vm.cgBusyLoading = CertificateStandardFactory.createCertificateStandard().save(vm.objData).$promise.then((res) => {

          if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.sid = vm.standardDet.certificateStandardID = res.data.certificateStandardID;
            vm.certificateStandardID = vm.standardDet.certificateStandardID;
            $scope.$parent.vm.cgBusyLoading = $q.all([uploadCertificateStandardImage(true)]).then(function (responses) {
              resetDetailForm();
              $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { id: vm.certificateStandardID });
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
         
          vm.saveDisable = false;
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    //update selected standard class
    vm.select = function (chip, ev) {
      if (chip && chip.classID) {
        DialogFactory.dialogService(
          USER.ADMIN_CERTIFICATE_STANDARD_ADD_CLASS_MODAL_CONTROLLER,
          USER.ADMIN_CERTIFICATE_STANDARD_ADD_CLASS_MODAL_VIEW,
          ev,
          chip).then((val) => {
          }, (err) => {
            return BaseService.getErrorLog(err);
          });
      }
    }


    vm.goBack = () => {
      if (BaseService.checkFormDirty(vm.generalDetailForm, vm.checkDirtyObject)) {
        showWithoutSavingAlertforBackButton();
      } else if (vm.certificateOtherDetail && vm.certificateOtherDetail.$dirty) {
        showWithoutSavingAlertforBackButton();
      } else {
        resetDetailForm();
        resetOtherDetailForm();
        $state.go(USER.CERTIFICATE_STANDARD_STATE);
      }
    };
    function showWithoutSavingAlertforBackButton() {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          BaseService.currentPageForms = [];
          $state.go(USER.CERTIFICATE_STANDARD_STATE);
        }
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /*To save other value detail
   Note:If any step added after other detail just remove function body and add logic of last step 
   */
    vm.fileList = {};
    vm.finish = () => {
      let dynamicControlList = DataElementTransactionValueFactory.getDataElementTransactionList(vm.dataElementList);
      DataElementTransactionValueFactory.saveTransctionValue({
        referenceTransID: vm.certificateStandardID,
        entityID: vm.entityID,
        dataElementList: dynamicControlList.dataElementList,
        removeElementList: dynamicControlList.removeElementList,
        subFormTransList: dynamicControlList.subFormTransList,
        deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
        removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
      }, vm.fileList).then((res) => {
        // commented as per last discussion on 18/09/2018, no need to move to list will press back button
        //$state.go(USER.CERTIFICATE_STANDARD_STATE);

        // Display success message of each field if assigned on validation options
        DataElementTransactionValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);
        resetOtherDetailForm();
        /* code for rebinding document to download - (actually all other details) */
        if (vm.fileList && !_.isEmpty(vm.fileList)) {
          vm.IsOtherDetailTab = false;
          vm.fileList = {};
          $timeout(() => {
            vm.IsOtherDetailTab = true;
          }, 0);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };
    /* Manually put as load "ViewDataElement directive" only on other details tab   */
    vm.onTabChanges = (TabName, msWizard) => {
      if (TabName == vm.StandardsTabs.Detail.Name) {
        vm.IsDetailTab = true;
      }
      else {
        vm.IsDetailTab = false;
      }
      if (TabName == vm.StandardsTabs.MISC.Name) {
        vm.IsOtherDetailTab = true;
      }
      else {
        vm.IsOtherDetailTab = false;
      }
      if (TabName == vm.StandardsTabs.Documents.Name) {
        vm.IsDocumentTab = true;
      }
      else {
        vm.IsDocumentTab = false;
      }
      if (TabName == vm.StandardsTabs.Personnel.Name) {
        vm.IsPersonnelTab = true;
      } else {
        vm.IsPersonnelTab = false;
      }
      msWizard.selectedIndex = vm.selectedTabIndex;
      vm.stateTransfer(vm.selectedTabIndex);
      $("#content").animate({ scrollTop: 0 }, 200);
    }

    vm.newclass = (chip) => {
      return {
        className: chip,
        classID: null
      };
    };

    /*Documents*/


    vm.locale = {
      formatDate: function (date) {
        return $filter('date')(date, vm.DefaultDateFormat);
      }
    };

    //close popup on page destroy 
    $scope.$on('$destroy', function () {
      $mdDialog.hide(false, { closeAll: true });
    });

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      switch (step) {
        case vm.StandardsTabs.Detail.ID: {
          if (vm.generalDetailForm.$dirty)
            return showWithoutSavingAlertforTabChange(step);
          else
            return true;
          break;
        }
        case vm.StandardsTabs.MISC.ID: {
          var isDirty = BaseService.checkFormDirty(vm.certificateOtherDetail);
          if (isDirty)
            return showWithoutSavingAlertforTabChange(step);
          else
            return true;
          break;
        }
      }
    }

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.isSave = false;
        if (step == vm.StandardsTabs.Detail.ID) {
          certificateStandardIdwise();
          resetDetailForm();
          return true;
        } else if (step == vm.StandardsTabs.MISC.ID) {
          resetOtherDetailForm();
          return true;
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //Function call on standard blur event and check standard name exist and ask for confirmation
    vm.checkDuplicateStandard = () => {
      if (oldStandardName != vm.standardDet.fullName) {
        if (vm.generalDetailForm && vm.generalDetailForm.fullname.$dirty && vm.standardDet.fullName) {
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
        messageContent: messageContent
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
        if (vm.generalDetailForm && vm.generalDetailForm.shortName.$dirty && vm.standardDet.shortName) {
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
        messageContent: messageContent
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

    vm.htmlToPlaintext = (text) => {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

    /* called for max length validation */
    vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
      vm.entertext = vm.htmlToPlaintext(enterTextLength)
      return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
    }

    vm.goToStandardType = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_STANDTYPE_STATE, {})
    };
    vm.goToSupplier = () => {
      BaseService.openInNew(USER.ADMIN_SUPPLIER_STATE, {})
    }

    /* called for max date validation */
    vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);
    }
    /* called for min date validation */
    vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);
    }
    vm.getMinDateValidationCertificateDate = (FromDateLabel) => {
      let str = getCompareDateLabel();
      return vm.getMinDateValidation(FromDateLabel, str);
    }
    let getCompareDateLabel = () => {
      let str = 'Today Date';
      if (vm.standardDet.cerificateIssueDate
        && vm.generalDetailForm.certificateDate
        && vm.generalDetailForm.certificateDate.$viewValue
        && new Date(vm.generalDetailForm.certificateDate.$viewValue) < new Date(vm.standardDet.cerificateIssueDate)) {
        str = 'Issue Date';
      }
      return str;
    }

    //Set mindate value onchange in Issue Date
    vm.onChangeIssueDate = (certificateDate) => {
      if (vm.standardDet.cerificateIssueDate) {
        vm.standardDet.certificateDateOptions = {
          minDate: new Date(vm.standardDet.cerificateIssueDate),
          appendToBody: true,
          toDateOpenFlag: false
        };
        if (new Date(vm.standardDet.cerificateIssueDate) > new Date(certificateDate)) {
          vm.standardDet.certificateDate = null;
        }
        if (!certificateDate) {
          vm.standardDet.certificateDate = null;
        }
      }
    }
    /**
     * upload certificate standard image
     * @param {any} isAdd
     */
    function uploadCertificateStandardImage(isAdd) {
      if (vm.certificateStandardID && vm.croppedImage) {
        var standardImage = {
          certificateStandardID: vm.certificateStandardID,
          files: [{ file: Upload.dataUrltoBlob(vm.imageURL, vm.originalFileName) }],
          isAdd: isAdd
        };
        return Upload.upload({
          url: `${CORE.API_URL}certificatestandards/createCertificateStandardImage`,
          method: 'POST',
          data: standardImage,
        }).then((res) => {
          if (res.data.data && !res.data.errors) {
            vm.imageURL = CORE.WEB_URL + USER.CERTIFICATE_STANDARDS_BASE_PATH + res.data.data.imageURL;
            vm.croppedImage = null;
            vm.originalFileName = "";
          }
          return $q.resolve(res);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        return $q.resolve(true);
      }
    }

    /**
     * upload image to ui with crop functionality
     * @param {any} file
     * @param {any} ev
     */
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
          vm.imageURL = vm.croppedImage;
          vm.generalDetailForm.$setDirty();
          //uploadCertificateStandardImage();

        }, (cancel) => {
        }, (err) => {
        });
    };
    //delete image
    vm.deleteImage = () => {
      if (vm.imageURL && vm.imageURL != vm.CORE_NO_IMAGE_STANDARD) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CERTIFICATE_STANDARD_IMAGE_DELETE_CONFIRMATION_MESSAGE);       
        var obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            if (vm.certificateStandardID) {
              vm.standardDet.imageURL = null;
              vm.generalDetailForm.$setDirty();
            }
            /*else*/ {
              vm.imageURL = null;
              vm.croppedImage = null;
              vm.originalFileName = "";
              return vm.imageURL = vm.CORE_NO_IMAGE_STANDARD;
            }
          }
        }, () => {
        });
      }
    };

    vm.addStandard = () => {
      $state.go(USER.ADMIN_MANAGE_CERTIFICATE_STANDARD_DETAIL_STATE, { tabname: vm.StandardsTabs.Detail.Name, id: null });
    }
    // Used to set as current form 
    angular.element(() => {
      if (vm.generalDetailForm) {
        resetDetailForm();
        BaseService.currentPageForms = [vm.generalDetailForm];
      }
    });
  }
})();
