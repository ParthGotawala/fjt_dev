(function () {
  'use strict';

  angular
    .module('app.admin.equipment')
    .controller('AddEquipmentPopupController', AddEquipmentPopupController);

  /** @ngInject */
  function AddEquipmentPopupController($mdDialog, $q, data, $filter, CORE, Upload, USER, GenericCategoryFactory, EquipmentFactory, MasterFactory, DialogFactory, BaseService,
    ComponentFactory, TRANSACTION, $timeout, BinFactory, $scope) {
    const vm = this;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.manageEquipment = {};
    vm.manageEquipment.assetName = data.Name ? data.Name : null;
    vm.title = data.Title ? data.Title : null;
    vm.equipmentRadioButtonValue = CORE.EquipmentRadioButtonValue;
    vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Equipment.ID;
    vm.manageEquipment.calibrationRequired = vm.isDefaultcalibrationRequired = data.isCalibrationRequired ? data.isCalibrationRequired : false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    let CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.equipmnetOwnership = CategoryTypeObjList.EquipmentOwnership.Name;
    let GenericCategoryAllData = [];
    vm.isshowCustomer = false;
    vm.isLoan = false;
    vm.debounceConstant = CORE.Debounce;
    /* "_.values" used to convert obect to array*/
    vm.equipmentSetupMethodConstList = _.values(CORE.EQUIPMENT_SETUP_METHODS);
    vm.equipmentSetupMethod = CORE.EQUIPMENT_SETUP_METHODS.Default.Value;
    vm.headerdata = [];
    vm.taToolbar = CORE.Toolbar;
    vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
    let oldimgfile;
    let isProfileImageDeleteAction = false;
    let imageName;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.minLengthMessage = CORE.MESSAGE_CONSTANT.MIN_LENGTH_MESSAGE;
    if (vm.title == CORE.EquipmentAndWorkstation_Title.Equipment)
      vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Equipment.ID;
    else if (vm.title == CORE.EquipmentAndWorkstation_Title.Sample)
      vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Sample.ID;
    else
      vm.manageEquipment.equipmentAs = vm.equipmentRadioButtonValue.Workstation.ID;

    vm.todayDate = new Date();
    vm.placedInServiceDateOptions = {
      maxDate: vm.todayDate,
      appendToBody: true
    };
    vm.outOfServiceDateOptions = {
      minDate: new Date(vm.manageEquipment.eqpID ? vm.manageEquipment.placedInServiceDate : (vm.manageEquipment.placedInServiceDate ? ((vm.outOfServiceDateOptions.minDate > vm.todayDate) ? vm.manageEquipment.placedInServiceDate : vm.todayDate) : vm.todayDate)),
      appendToBody: true
    };

    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup,
      },
      equipmentAs: {
        array: CORE.EquipmentRadioGroup.equipmentAs,
      }
    };
    /* for down arrow key open datepicker */
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.placedInServiceDate] = false;
    vm.IsPickerOpen[vm.DATE_PICKER.outOfServiceDate] = false;
    vm.openPicker = (type, ev) => {
      if (ev.keyCode == 40) {
        vm.IsPickerOpen[type] = true;
      }
    };
    /* for down arrow key open datepicker */

    let getGenericCategoryList = () => {
      let GencCategoryType = [];
      GencCategoryType.push(CategoryTypeObjList.EquipmentGroup.Name);
      GencCategoryType.push(CategoryTypeObjList.EquipmentType.Name);
      GencCategoryType.push(CategoryTypeObjList.EquipmentOwnership.Name);
      let listObj = {
        GencCategoryType: GencCategoryType
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        GenericCategoryAllData = genericCategories ? genericCategories.data : [];
        vm.EquipmentOwnershipTypeList = _.filter(GenericCategoryAllData, (item) => {
          return item.parentGencCategoryID == null && item.categoryType == CategoryTypeObjList.EquipmentOwnership.Name;
        });
        return $q.resolve(vm.EquipmentOwnershipTypeList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.getCustomerList = (item) => {
      if (item && item.gencCategoryName == CORE.EQUIPMENT_OWNERSHIP_TYPE.CUSTOMER) {
        vm.isshowCustomer = true;
        return MasterFactory.getCustomerList().query().$promise.then((customer) => {
          // Added by Vaibhav - For display company name with customer code
          if (customer && customer.data) {
            _.each(customer.data, function (item) {
              item.companyName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
            });
            vm.CustomerList = customer.data;
          }
          return $q.resolve(vm.CustomerList);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else if (item && item.gencCategoryName == CORE.EQUIPMENT_OWNERSHIP_TYPE.LOAN) {
        vm.isLoan = true;
        vm.isshowCustomer = false;
      }
      else {
        vm.autoCompleteCustomer.keyColumnId = null;
        vm.isshowCustomer = false;
        vm.isLoan = false;
        //vm.manageEquipment.placedInServiceDate = null;
        //vm.manageEquipment.outOfServiceDate = null;
        return MasterFactory.getCustomerList().query().$promise.then((customer) => {
          // Added by Vaibhav - For display company name with customer code
          if (customer && customer.data) {
            _.each(customer.data, function (item) {
              item.companyName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
            });
            vm.CustomerList = customer.data;
          }
          return $q.resolve(vm.CustomerList);
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };
    // get all assembly list
    let getPartSearch = (searchObj) => {
      return ComponentFactory.getAllAssemblyBySearch().save({
        listObj: searchObj
      }).$promise.then((partList) => {
        if (partList && partList.data && partList.data.data) {
          vm.partSearchList = partList.data.data;
          if (searchObj.id != null) {
            $timeout(function () {
              if (vm.autoCompleteSearchAssy && vm.autoCompleteSearchAssy.inputName) {
                $scope.$broadcast(vm.autoCompleteSearchAssy.inputName, partList.data.data[0]);
              }
            });
          }
        }
        else {
          vm.partSearchList = [];
        }
        return vm.partSearchList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    var autocompletePromise = [getGenericCategoryList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      initAutoComplete();
      if (data && data.assyId) {
        const searchObj = {
          id: data.assyId
        };
        getPartSearch(searchObj);
      }
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });
    let initAutoComplete = () => {
      vm.autoCompleteCustomer = {
        columnName: 'companyName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.manageEquipment.customerId ? vm.manageEquipment.customerId : null,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        callbackFn: vm.getCustomerList
      };
      vm.autoCompleteEquipmentOwnershipType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.manageEquipment.eqpOwnershipTypeID ? vm.workorder.customerIDvm.manageEquipment.eqpOwnershipTypeID : 0,
        inputName: CategoryTypeObjList.EquipmentOwnership.Name,
        placeholderName: 'Ownership',
        addData: {
          headerTitle: CORE.CategoryType.EquipmentOwnership.Title,
          popupAccessRoutingState: [USER.ADMIN_EQPOWNER_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: stringFormat(CORE.Manage_PageName_Title_Format, CORE.CategoryType.EquipmentOwnership.Title)
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getGenericCategoryList,
        onSelectCallbackFn: vm.getCustomerList
      };
      vm.autoCompleteSearchAssy = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: vm.manageEquipment ? vm.manageEquipment.assyId : null,
        inputName: 'SearchPart',
        placeholderName: 'Type here to search assembly',
        callbackFn: (obj) => {
        },
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.SubAssembly,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.selectedMFG = item;
            // set assembly in header
            vm.headerdata.push(
              {
                label: CORE.LabelConstant.Assembly.ID,
                value: item.PIDCode,
                displayOrder: 2,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToAssyMaster,
                valueLinkFnParams: { partID: item.id },
                isCopy: true,
                isCopyAheadLabel: false,
                imgParms: {
                  imgPath: vm.rohsImagePath + item.rohsIcon,
                  imgDetail: item.rohsName
                }
              }
            );
          } else {
            vm.selectedMFG = '';
            // remove assembly from header
            _.remove(vm.headerdata, (headerItem) => headerItem.label === CORE.LabelConstant.Assembly.ID);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getPartSearch(searchObj);
        }
      };
    };
    /*-------------------add standard category--------*/
    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.pageSet();
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AddEquipmentForm);
        if (isdirty) {
          const data = {
            form: vm.AddEquipmentForm
          };
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            if (data) {
              vm.resetSample();
              initAutoComplete();
              vm.pageSet();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.resetSample();
          initAutoComplete();
          vm.pageSet();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
    };
    vm.resetSample = () => {
      vm.selectedMFG = {};
      vm.manageEquipment.assetName = null;
      vm.manageEquipment.assetNumber = null;
      vm.manageEquipment.eqpMake = null;
      vm.manageEquipment.eqpModel = null;
      vm.manageEquipment.eqpYear = null;
      vm.manageEquipment.fileArray = null;
      vm.manageEquipment.binId = vm.manageEquipment.bin = vm.manageEquipment.warehouse = vm.manageEquipment.parentWarehouse = null;
      vm.manageEquipment.eqpDescription = null;
      vm.manageEquipment.bankName = null;
      vm.manageEquipment.placedInServiceDate = null;
      vm.manageEquipment.outOfServiceDate = null;
      vm.manageEquipment.customer = null;
    };
    vm.pageSet = () => {
      $timeout(() => {
        if (vm.AddEquipmentForm) {
          vm.AddEquipmentForm.$setPristine();
          vm.AddEquipmentForm.dirty = false;
        }
      }, 3000);
    };
    /*----Save and Save&Exit------*/
    vm.save = (buttonCategory) => {
      vm.saveDisable = true;
      if (BaseService.focusRequiredField(vm.AddEquipmentForm)) {
        if (vm.manageEquipment.eqpID && !vm.checkFormDirty(vm.AddEquipmentForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        vm.saveDisable = false;
        return;
      }
      if (vm.AddEquipmentForm.$invalid || !vm.AddEquipmentForm.assetNumber) {
        BaseService.focusRequiredField(vm.AddEquipmentForm);
        vm.saveDisable = false;
        return;
      }
      if (vm.croppedImage) {
        const filename = vm.originalFileName;
        const originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
        imageName = `${originalFileName}.png`;
        vm.manageEquipment.fileArray = Upload.dataUrltoBlob(vm.croppedImage, imageName);
      }

      let eqpValue = '';
      switch (vm.manageEquipment.equipmentAs) {
        case vm.equipmentRadioButtonValue.Equipment.ID:
          eqpValue = vm.equipmentRadioButtonValue.Equipment.Value;
          break;
        case vm.equipmentRadioButtonValue.Workstation.ID:
          eqpValue = vm.equipmentRadioButtonValue.Workstation.Value;
          break;
        case vm.equipmentRadioButtonValue.Sample.ID:
          eqpValue = vm.equipmentRadioButtonValue.Sample.Value;
          break;
      }
      let equipmentInfo = {
        eqpID: vm.manageEquipment.eqpID ? vm.manageEquipment.eqpID : undefined,
        assetName: vm.manageEquipment.assetName,
        assetNumber: vm.manageEquipment.assetNumber,
        //eqpTypeID: returnKeyColumnID(vm.autoCompleteEquipmentType),
        eqpMake: vm.manageEquipment.eqpMake,
        eqpModel: vm.manageEquipment.eqpModel,
        eqpYear: vm.manageEquipment.eqpYear,
        //eqpGroupID: returnKeyColumnID(vm.autoCompleteEquipmentGroup),
        //eqpSubGroupID: returnKeyColumnID(vm.autoCompleteEquipmentSubGroup),
        eqpOwnershipTypeID: vm.autoCompleteEquipmentOwnershipType.keyColumnId ? vm.autoCompleteEquipmentOwnershipType.keyColumnId : null,
        bankName: vm.manageEquipment.bankName,
        customerId: vm.autoCompleteCustomer.keyColumnId ? vm.autoCompleteCustomer.keyColumnId : null,
        placedInServiceDate: BaseService.getAPIFormatedDate(vm.manageEquipment.placedInServiceDate),
        outOfServiceDate: BaseService.getAPIFormatedDate(vm.manageEquipment.outOfServiceDate),
        eqpDescription: vm.manageEquipment.eqpDescription,
        isActive: true,
        profile: vm.manageEquipment.fileArray,
        profileId: vm.profileId,
        entityID: CORE.AllEntityIDS.Equipment.ID,
        ownertype: CORE.AllEntityIDS.Equipment.Name,
        equipmentAs: eqpValue,
        equipmentSetupMethod: vm.equipmentSetupMethod,
        assyId: vm.autoCompleteSearchAssy.keyColumnId,
        binId: vm.manageEquipment.binId,
        profileImage: imageName,
        isProfileImageDeleteAction: vm.manageEquipment.eqpID ? isProfileImageDeleteAction : false
      };
      equipmentInfo = updateSaveObj(equipmentInfo);

      equipmentInfo.calibrationRequired = (vm.manageEquipment.equipmentAs === vm.equipmentRadioButtonValue.Sample.ID) ? false : vm.manageEquipment.calibrationRequired;

      if (vm.manageEquipment && vm.manageEquipment.eqpID) {  // update
        const objs = {
          id: equipmentInfo && equipmentInfo.eqpID ? equipmentInfo.eqpID : 0,
          name: equipmentInfo && equipmentInfo.assetName ? equipmentInfo.assetName : null
        };
        EquipmentFactory.checkEquipmentInWarehouse().query({ objs: objs }).$promise.then((res) => {
          if (res && res.data) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.EQUIPMENT_IN_USE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.saveDisable = false;
                return;
              }
            }, () => {
              vm.saveDisable = false;
            }).catch((error) => {
              vm.saveDisable = false;
              return BaseService.getErrorLog(error);
            });
            return;
          }
          else {
            equipmentUpdate(equipmentInfo, buttonCategory);
          }
        });
      } else {   //Create
        vm.cgBusyLoading = Upload.upload({
          url: CORE.API_URL + USER.ADMIN_EQUIPMENT_PATH,
          data: equipmentInfo
        }).then((res) => {
          vm.saveDisable = false;
          if (res.data && res.data.data) {
            vm.manageEquipment.eqpID = res.data.data.equipmentData.eqpID;
            vm.manageEquipment.isActive = true;
            vm.saveAndProceed(buttonCategory, res.data);
          } else if (res && res.data.status === CORE.ApiResponseTypeStatus.FAILED) {
            BaseService.focusRequiredField(vm.AddEquipmentForm);
          }
        }).catch((error) => {
          vm.saveDisable = false;
          return BaseService.getErrorLog(error);
        });
      }
    };

    const equipmentUpdate = (equipmentInfo, buttonCategory) => {
      vm.cgBusyLoading = Upload.upload({
        url: `${CORE.API_URL}equipment/${vm.manageEquipment.eqpID}`,
        method: 'PUT',
        data: equipmentInfo
      }).then((res) => {
        if (res.data && res.data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.saveDisable = false;
          vm.saveAndProceed(buttonCategory, vm.manageEquipment);
        } else if (res && res.data.status === CORE.ApiResponseTypeStatus.FAILED) {
          BaseService.focusRequiredField(vm.AddEquipmentForm);
        }
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    // update save object equipment
    let updateSaveObj = (equipment) => {
      let newObj = equipment;
      let resultObj = _.pickBy(newObj, _.identity);
      return resultObj;
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.AddEquipmentForm);
      if (isdirty) {
        let data = {
          form: vm.AddEquipmentForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    //open crop image popup
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
          vm.AddEquipmentForm.profileImage.$setDirty();
        }, (cancel) => {
        },
          (err) => {
            if (oldimgfile == vm.imagefile) {
              vm.AddEquipmentForm.profileImage.$dirty = false;
            }
          });
    };
    //delete image
    vm.deleteImage = () => {
      vm.AddEquipmentForm.profileImage.$setDirty();
      if (vm.manageEquipment.profileImage || vm.imagefile) {
        vm.croppedImage = null;
        vm.manageEquipment.fileArray = "";
        vm.manageEquipment.profileImage = null;
        vm.imagefile = null;
        oldimgfile = "";
        vm.imagefile = CORE.WEB_URL + CORE.NO_IMAGE_EQUIPMENT;
        isProfileImageDeleteAction = true;
        vm.originalFileName = "";
      }
    };
    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddEquipmentForm);
    });
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //Redirect to equipment ownership type master
    vm.goToEquipmentOwnershipTypeList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_EQPOWNER_STATE, {});
    }
    //check equipments and workstations name Already Exists
    vm.checkEquipmentAndWorkstationNameAlreadyExists = (equipmentMaintenanceDetailForm) => {
      vm.nameExists = null;
      var eqpValue = "";
      switch (vm.manageEquipment.equipmentAs) {
        case vm.equipmentRadioButtonValue.Equipment.ID:
          eqpValue = vm.equipmentRadioButtonValue.Equipment.Value;
          break;
        case vm.equipmentRadioButtonValue.Workstation.ID:
          eqpValue = vm.equipmentRadioButtonValue.Workstation.Value;
          break;
        case vm.equipmentRadioButtonValue.Sample.ID:
          eqpValue = vm.equipmentRadioButtonValue.Sample.Value;
          break;
      }
      if (vm.manageEquipment && vm.manageEquipment.assetName) {
        let objs = {
          eqpID: vm.manageEquipment.eqpID ? vm.manageEquipment.eqpID : undefined,
          assetName: vm.manageEquipment.assetName,
          equipmentAs: eqpValue,
        };
        vm.cgBusyLoading = EquipmentFactory.checkEquipmentAndWorkstationNameAlreadyExists().query({ objs: objs }).$promise.then((res) => {
          if (res.errors) {
            vm.manageEquipment.assetName = null;
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                setFocusByName("assetName");
              });
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };
    //Redirect to Customer master
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    //Get component master
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    //Get manufacturer master
    vm.gotoManufacturerList = () => {
      BaseService.goToManufacturerList();
    };

    // Redirected to Update Manufacturer
    vm.goToManufacturerDetail = () => {
      BaseService.goToManufacturer(vm.selectedMFG.mfgCodeID);
    };

    /* called for max date validation */
    vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);
    };
    /* called for min date validation */
    vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => {
      return BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);
    };
    vm.getMinDateValidationEquipmentDate = (FromDateLabel) => {
      let str = getCompareDateLabel();
      return vm.getMinDateValidation(FromDateLabel, str);
    };
    let getCompareDateLabel = () => {
      let str = 'Today Date';
      if (vm.manageEquipment.placedInServiceDate
        && vm.AddEquipmentForm.outOfServiceDate
        && vm.AddEquipmentForm.outOfServiceDate.$viewValue
        && new Date(vm.AddEquipmentForm.outOfServiceDate.$viewValue) < new Date(vm.manageEquipment.placedInServiceDate)) {
        str = 'Placed In Service Date';
      }
      return str;
    };

    let htmlToPlaintext = (text) => {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };

    /* called for max length validation */
    vm.getDescrLengthValidation = (maxLength, enterTextLength) => {
      vm.entertext = htmlToPlaintext(enterTextLength);
      return BaseService.getDescrLengthValidation(maxLength, vm.entertext.length);
    };

    //Set mindate value onchange in Placed In Service Date
    vm.onChangePlacedInServiceDate = (outOfServiceDate) => {
      if (vm.manageEquipment.placedInServiceDate) {
        vm.manageEquipment.outOfServiceDateOptions = {
          minDate: new Date(vm.manageEquipment.eqpID ? vm.manageEquipment.placedInServiceDate : (vm.manageEquipment.placedInServiceDate ? ((vm.outOfServiceDateOptions.minDate > vm.todayDate) ? vm.manageEquipment.placedInServiceDate : vm.todayDate) : vm.todayDate)),
          appendToBody: true,
        };
        if (new Date(vm.manageEquipment.placedInServiceDate) > new Date(outOfServiceDate)) {
          vm.manageEquipment.outOfServiceDate = null;
        }
        if (!outOfServiceDate) {
          vm.manageEquipment.outOfServiceDate = null;
        }
      } else {
        vm.manageEquipment.outOfServiceDateOptions = {
          minDate: new Date(vm.todayDate),
          appendToBody: true,
        };
      }
    };
    vm.getLocationBinDetail = ($event) => {
      if (vm.manageEquipment.bin) {
        vm.manageEquipment.binId = null;
        BinFactory.getBinDetailByName().query({ name: vm.manageEquipment.bin }).$promise.then((response) => {
          if (response && response.data) {
            vm.manageEquipment.binId = response.data.id;
            vm.manageEquipment.bin = response.data.Name;
            vm.manageEquipment.warehouse = response.data.warehousemst.Name;
            //vm.manageEquipment.warehouseID =  response.data.warehousemst.id;
            vm.manageEquipment.parentWarehouse = response.data.warehousemst.parentWarehouseMst.Name;
            //vm.manageEquipment.parentWarehouseID =  response.data.warehousemst.parentWarehouseMst.id;
          }
          else {
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            let model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.manageEquipment.binId = vm.manageEquipment.bin = vm.manageEquipment.warehouse = vm.manageEquipment.parentWarehouse = null;
                setFocusByName("binName");
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      } else {
        vm.manageEquipment.binId = vm.manageEquipment.bin = vm.manageEquipment.warehouse = vm.manageEquipment.parentWarehouse = null;
      }
    };
    vm.scanBin = ($event, isEnter) => {
      $timeout(function () {
        if (isEnter) {
          if ($event.keyCode == 13) {
            $event.preventDefault(); $event.stopPropagation();
            if (vm.manageEquipment.bin) {
              setFocusByName(vm.autoCompleteEquipmentOwnershipType.inputName);
            }
          }
        } else {
          vm.getLocationBinDetail($event);
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    /*Used to check max length*/
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToBinList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});
    };
    vm.goToWHList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});
    };
    //go to manage part number
    vm.goToAssyMaster = (param) => {
      BaseService.goToComponentDetailTab(null, param.partID);
    };
  }
})();
