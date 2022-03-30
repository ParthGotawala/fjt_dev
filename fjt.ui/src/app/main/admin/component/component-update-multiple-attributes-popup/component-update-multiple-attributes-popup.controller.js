(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('ComponentUpdateMultipleAttributesPopupController', ComponentUpdateMultipleAttributesPopupController);

  /** @ngInject */
  function ComponentUpdateMultipleAttributesPopupController($mdDialog, $timeout, $q, CORE, USER, data, BaseService, MasterFactory, DialogFactory, ComponentFactory) {
    const vm = this;
    const objAttribute = angular.copy(data);
    vm.assyData = objAttribute.rowData;

    vm.bomObj = objAttribute.bomObj;
    vm.AssyID = objAttribute.AssyID || null;
    vm.attributeHintFromUpdatePackaging = CORE.UPDATE_ATTRIBUTE_FROM_PACKAGING_HINT;
    vm.attributeHint = CORE.UPDATE_ATTRIBUTE_FROM_PACKAGING_HINT;
    vm.refComponentId = data && data.refComponentId ? data.refComponentId : null;
    vm.isFromBOM = objAttribute.isFromBOM;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.disablecopy = true;
    vm.headerdata = [];
    vm.ErrorTypes = CORE.PRICING_ERROR_TYPES;
    vm.component = {};
    function initHeaderData() {
      if (objAttribute.isfromMap || vm.isFromBOM) {
        //link to go for part master list page
        vm.goToPartList = () => {
          BaseService.goToPartList();
        };
        //go to part master
        vm.goToPartMaster = (partID) => {
          BaseService.goToComponentDetailTab(null, partID);
        };
        //link to go for part master list page
        vm.goToMFRList = () => {
          BaseService.goToManufacturerList();
        };
        //go to part master
        vm.goToMFRMaster = (mfrid) => {
          BaseService.goToManufacturer(mfrid);
        };

        if (vm.isFromBOM) {
          vm.headerdata.push({
            label: vm.LabelConstant.MFG.MFG,
            value: vm.bomObj.mfgCode,
            displayOrder: 1,
            labelLinkFn: vm.goToMFRList,
            valueLinkFn: vm.goToMFRMaster,
            valueLinkFnParams: vm.bomObj.mfgCodeID
          });
        }
        vm.headerdata.push({
          label: vm.LabelConstant.MFG.MFGPN,
          value: vm.isFromBOM ? vm.bomObj.mfgPN : vm.assyData[0].partNumber,
          displayOrder: 2,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartMaster,
          valueLinkFnParams: vm.isFromBOM ? vm.bomObj.mfgPNID : vm.assyData[0].id,
          isCopy: true,
          imgParms: {
            imgPath: stringFormat('{0}{1}', vm.rohsImagePath, vm.isFromBOM ? vm.bomObj.rohsIcon : vm.assyData[0].rohsIcon),
            imgDetail: vm.isFromBOM ? vm.bomObj.rohsName : vm.assyData[0].rohsName
          }
        });
        if (objAttribute.isfromMap) {
          switch (vm.assyData[0].type) {
            case vm.ErrorTypes.MOUNTNOTADDED:
              vm.component.changeMountingType = true;
              break;
            case vm.ErrorTypes.PARTTYPENOTADDED:
              vm.component.changeFunctionalType = true;
              break;
            case vm.ErrorTypes.ROHSNOTADDED:
              vm.component.changeRoHSStatus = true;
              break;
            case vm.ErrorTypes.CONNECTNOTADDED:
              vm.component.changeConnectorType = true;
              break;
          }
        }
      }
    }

    /* Part Type dropdown fill up */
    const partType = () => ComponentFactory.getPartTypeList().query().$promise.then((res) => {
      vm.partTypeList = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));
    /* mountingType dropdown fill up */
    const mountingType = () => ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
      vm.mountingTypeList = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));
    // get RoHS List
    function getRoHSList() {
      return MasterFactory.getRohsList().query().$promise.then((requirement) => {
        if (requirement && requirement.data) {
          vm.RohsList = requirement.data;
          return requirement.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    /* connecterType dropdown fill up */
    const connecterType = () => ComponentFactory.getConnecterTypeList().query().$promise.then((res) => {
      vm.connecterTypeList = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const getPackageCaseTypeList = () => ComponentFactory.getPackageCaseTypeList().query().$promise.then((res) => {
      vm.packageCaseTypeList = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompletePartType = {
        columnName: 'partTypeName',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.functionalCategoryID : null,
        inputName: 'Functional Category',
        placeholderName: 'Functional Category',
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PART_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.funtional_type
        },
        callbackFn: partType,
        onSelectCallbackFn: null
      };
      vm.autoCompleteMountingType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.mountingTypeID : null,
        inputName: 'Mounting Type',
        placeholderName: 'Mounting Type',
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.mounting_type
        },
        callbackFn: mountingType,
        onSelectCallbackFn: null
      };
      vm.autoCompleteRohsStatus = {
        columnName: 'name',
        controllerName: CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_ROHS_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.component ? vm.component.RoHSStatusID : null,
        inputName: 'rohsComplient',
        placeholderName: 'RoHS Status',
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ROHS_STATE],
          pageNameAccessLabel: CORE.PageName.rohs_status
        },
        callbackFn: getRoHSList,
        onSelectCallbackFn: null
      };
      vm.autoCompleteConnecterType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_CONNECTER_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CONNECTER_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.connecterTypeID : null,
        inputName: 'Connector Type',
        placeholderName: 'Connector Type',
        isRequired: false,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_CONNECTER_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.connector_type
        },
        callbackFn: connecterType,
        onSelectCallbackFn: null
      };
      vm.autoCompletePackageCaseType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_MANAGE_PACKAGE_CASE_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MANAGE_PACKAGE_CASE_TYPE_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.partPackageID : null,
        inputName: 'Package Case Type',
        placeholderName: 'Package Case Type',
        isRequired: false,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PACKAGE_CASE_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.package_case_type
        },
        callbackFn: getPackageCaseTypeList,
        onSelectCallbackFn: null
      };
    };

    /* retrieve component detail by id CPN Part Add from CPN Tab*/
    const componentDetailsById = (cid) => {
      if (cid) {
        return ComponentFactory.component().query({
          id: cid
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.autoCompletePartType.keyColumnId = response.data.functionalCategoryID;
            vm.autoCompleteMountingType.keyColumnId = response.data.mountingTypeID;
            vm.autoCompleteRohsStatus.keyColumnId = response.data.RoHSStatusID;
            vm.autoCompleteConnecterType.keyColumnId = response.data.connecterTypeID;
            vm.autoCompletePackageCaseType.keyColumnId = response.data.partPackageID;
            vm.component.feature = response.data.feature;
            vm.component.minOperatingTemp = response.data.minOperatingTemp;
            vm.component.maxOperatingTemp = response.data.maxOperatingTemp;
            vm.component.temperatureCoefficient = response.data.temperatureCoefficient;
            vm.component.temperatureCoefficientValue = response.data.temperatureCoefficientValue;
            vm.component.temperatureCoefficientUnit = response.data.temperatureCoefficientUnit;
            vm.component.noOfPosition = response.data.noOfPosition;
            vm.component.noOfRows = response.data.noOfRows;
            vm.component.pitch = response.data.pitch;
            vm.component.pitchMating = response.data.pitchMating;
            vm.component.length = response.data.length;
            vm.component.width = response.data.width;
            vm.component.height = response.data.height;
            vm.component.tolerance = response.data.tolerance;
            vm.component.voltage = response.data.voltage;
            vm.component.value = response.data.value;
            vm.component.powerRating = response.data.powerRating;
            vm.component.weight = response.data.weight;
            vm.component.color = response.data.color;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const autocompletePromise = [partType(), mountingType(), getRoHSList(), connecterType(), getPackageCaseTypeList()];

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      vm.component = {
        changeFunctionalType: vm.isFromBOM ? true : false,
        changeMountingType: vm.isFromBOM ? true : false,
        changeRoHSStatus: vm.isFromBOM ? true : false,
        changeConnectorType: vm.isFromBOM ? true : false,
        changePackagCaseType: vm.isFromBOM ? true : false,
        functionalCategoryID: vm.isFromBOM ? vm.bomObj.functionalID : null,
        partPackageID: vm.isFromBOM ? vm.bomObj.partPackageID : null,
        connecterTypeID: vm.isFromBOM ? vm.bomObj.connecterTypeID : null,
        RoHSStatusID: vm.isFromBOM ? vm.bomObj.RoHSStatusID : null,
        mountingTypeID: vm.isFromBOM ? vm.bomObj.mountingID : null
      };
      initAutoComplete();
      if (data && data.refComponentId) {
        componentDetailsById(data.refComponentId);
      }
      if (vm.isFromBOM) {
        const rohsDet = _.find(vm.RohsList, { id: vm.bomObj.RoHSStatusID });
        if (rohsDet && !rohsDet.rohsIcon) {
          vm.bomObj.rohsIcon = CORE.DEFAULT_IMAGE;
          vm.bomObj.rohsName = rohsDet.name;
        }
        if (rohsDet && rohsDet.rohsIcon) {
          vm.bomObj.rohsIcon = rohsDet.rohsIcon;
          vm.bomObj.rohsName = rohsDet.name;
        }
      }
      initHeaderData();
    }).catch((error) => BaseService.getErrorLog(error));

    /*Update method*/
    vm.UpdatePartsAttributes = (continueUpdate) => {
      if (vm.UpdateSeletedPartsAttributesForm.$invalid ||
        (!vm.component.changeFunctionalType && !vm.component.changeMountingType && !vm.component.changeRoHSStatus && !vm.component.changeConnectorType && !vm.component.changePackagCaseType &&
          !vm.component.changeHeightMax && !vm.component.changeHeight && !vm.component.changeLength && !vm.component.changeMinOpTemp &&
          !vm.component.changeMaxOpTemp && !vm.component.changeNoOfPosition && !vm.component.changeNoOfRows && !vm.component.changeWidth &&
          !vm.component.changeTempValue && !vm.component.changeColor && !vm.component.changeFeature && !vm.component.changePitch &&
          !vm.component.changePitchMating && !vm.component.changePowerRating && !vm.component.changeTemperatureCoefficient && !vm.component.changeTempUnit &&
          !vm.component.changeTolerance && !vm.component.changeValue && !vm.component.changeVoltage && !vm.component.changeWeight)
      ) {
        BaseService.focusRequiredField(vm.UpdateSeletedPartsAttributesForm);
        return;
      }
      if (!continueUpdate) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_ATTRIBUTES_UPDATE_CONFIRMATION_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            updatePartAttributes();
          }
        }, () => {
        });
      } else {
        updatePartAttributes();
      }
    };

    function updatePartAttributes() {
      const updateComponentInfo = { AssyID: vm.AssyID };
      if (vm.isFromBOM) {
        updateComponentInfo.ids = [vm.bomObj.mfgPNID];
      } else {
        updateComponentInfo.ids = _.map(vm.assyData, (item) => item.id);
      }
      updateComponentInfo.data = {};
      if (vm.component.changeFunctionalType) {
        updateComponentInfo.data.functionalCategoryID = vm.autoCompletePartType.keyColumnId;
      }
      if (vm.component.changeMountingType) {
        updateComponentInfo.data.mountingTypeID = vm.autoCompleteMountingType.keyColumnId;
      }
      if (vm.component.changeRoHSStatus) {
        updateComponentInfo.data.RoHSStatusID = vm.autoCompleteRohsStatus.keyColumnId;
      }
      if (vm.component.changeConnectorType) {
        updateComponentInfo.data.connecterTypeID = vm.autoCompleteConnecterType.keyColumnId || null;
      }
      if (vm.component.changePackagCaseType) {
        updateComponentInfo.data.partPackageID = vm.autoCompletePackageCaseType.keyColumnId || null;
      }
      if (vm.component.changeFeature) {
        updateComponentInfo.data.feature = vm.component.feature || null;
      }
      if (vm.component.changeMinOpTemp) {
        updateComponentInfo.data.minOperatingTemp = vm.component.minOperatingTemp || null;
      }
      if (vm.component.changeMaxOpTemp) {
        updateComponentInfo.data.maxOperatingTemp = vm.component.maxOperatingTemp || null;
      }
      if (vm.component.changeTemperatureCoefficient) {
        updateComponentInfo.data.temperatureCoefficient = vm.component.temperatureCoefficient || null;
      }
      if (vm.component.changeTempValue) {
        updateComponentInfo.data.temperatureCoefficientValue = vm.component.temperatureCoefficientValue || null;
      }
      if (vm.component.changeTempUnit) {
        updateComponentInfo.data.temperatureCoefficientUnit = vm.component.temperatureCoefficientUnit || null;
      }
      if (vm.component.changeNoOfPosition) {
        updateComponentInfo.data.noOfPosition = vm.component.noOfPosition || null;
      }
      if (vm.component.changeNoOfRows) {
        updateComponentInfo.data.noOfRows = vm.component.noOfRows || null;
      }
      if (vm.component.changePitch) {
        updateComponentInfo.data.pitch = vm.component.pitch || null;
      }
      if (vm.component.changePitchMating) {
        updateComponentInfo.data.pitchMating = vm.component.pitchMating || null;
      }
      if (vm.component.changeLength) {
        updateComponentInfo.data.length = vm.component.length || null;
      }
      if (vm.component.changeWidth) {
        updateComponentInfo.data.width = vm.component.width || null;
      }
      if (vm.component.changeHeight) {
        updateComponentInfo.data.height = vm.component.height || null;
      }
      if (vm.component.changeTolerance) {
        updateComponentInfo.data.tolerance = vm.component.tolerance || null;
      }
      if (vm.component.changeVoltage) {
        updateComponentInfo.data.voltage = vm.component.voltage || null;
      }
      if (vm.component.changeValue) {
        updateComponentInfo.data.value = vm.component.value || null;
      }
      if (vm.component.changePowerRating) {
        updateComponentInfo.data.powerRating = vm.component.powerRating || null;
      }
      if (vm.component.changeWeight) {
        updateComponentInfo.data.weight = vm.component.weight || null;
      }
      if (vm.component.changeColor) {
        updateComponentInfo.data.color = vm.component.color || null;
      }

      vm.cgBusyLoading = ComponentFactory.updateComponentAttributes().query({ updateComponentInfo: updateComponentInfo }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm.pop();
          DialogFactory.closeDialogPopup(res.data);
        } else if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
          updateComponentReturnResponse(res);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /**
       * Perform operation according Validation response return from (Validation/Update Part API)
       * @param {any} res - API response (Validation API/Update Part)
       * @param {any} componentInfo - Part Detail
       * @param {any} newlyAddedFiles - New added File(Images)
       * @param {any} deletedFiles - Delete File(Images/Datasheet)
       * @param {any} newlyAddedUrls - New Added Datasheet URL
       * @param {any} newlyUploadedDataSheetFiles - New Added Datasheet File
       * @param {any} isRequiredPassword - Required password confiramation before Update Part
       */
    function updateComponentReturnResponse(res) {
      if (res.errors && res.errors.data && res.errors.data.assemblyList) {
        DialogFactory.dialogService(
          USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER,
          USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW,
          null,
          res.errors.data.assemblyList
        ).then((activityPopupResDetail) => {
          if (activityPopupResDetail && activityPopupResDetail.continueSave) {
            vm.UpdatePartsAttributes(true);
          }
        }, () => {
          // cancel
        });
      }
    }

    /*Redirection methods*/
    vm.goToRoHSStatusList = () => {
      BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
    };
    vm.goToFunctionalTypeList = () => {
      BaseService.goToFunctionalTypeList();
    };
    vm.goToMountingTypeList = () => {
      BaseService.goToMountingTypeList();
    };
    vm.goToPackageCaseTypeList = () => {
      BaseService.goToPackageCaseTypeList();
    };
    vm.goToConnectorTypeList = () => {
      BaseService.openInNew(USER.ADMIN_CONNECTER_TYPE_STATE, {});
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.UpdateSeletedPartsAttributesForm);
      if (isdirty) {
        const data = {
          form: vm.UpdateSeletedPartsAttributesForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
        $timeout(() => {
          vm.clickCancel = false;
        }, 300);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.UpdateSeletedPartsAttributesForm];
    });

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
