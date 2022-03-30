(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('CopyAssemblyPopupController', CopyAssemblyPopupController);

  /** @ngInject */
  function CopyAssemblyPopupController($mdDialog, $timeout, CORE, USER, data, BaseService, APIVerificationErrorPopupFactory, DialogFactory, ComponentFactory) {
    const vm = this;
    vm.assyData = data;

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.MFG_TYPE = CORE.MFG_TYPE;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.disablecopy = true;

    const COMPONENT_COPY_FIELD = [
      { Name: 'Part Standards', ParamName: 'pIsStandards', Section: 4 },
      { Name: 'Required Functional Types', ParamName: 'pIsRequiredFunctionalType', Section: 1 },
      { Name: 'Required Mounting Types', ParamName: 'pIsRequiredMountingType', Section: 1 },
      { Name: 'Settings', ParamName: 'pIsSettings', Section: 3 },
      { Name: 'Attributes', ParamName: 'pIsAttribute', Section: 3 },
      { Name: 'Additional Attributes', ParamName: 'pIsAdditionalAttibute', Section: 3 },
      { Name: 'Packaging Details', ParamName: 'pIsPackagingDetail', Section: 3 },
      { Name: 'Packaging Alias Parts', ParamName: 'pIsPackagingAliasPart', Section: 2 },
      { Name: 'Other Part Names', ParamName: 'pIsOtherPartName', Section: 2 },
      { Name: 'Alternate Parts', ParamName: 'pIsAlternatePart', Section: 2 },
      { Name: 'RoHS Replacement Parts', ParamName: 'pIsRoHSReplacementPart', Section: 2 },
      { Name: 'Drive Tools', ParamName: 'pIsDriveTool', Section: 1 },
      { Name: 'Process Material', ParamName: 'pIsProcessMaterial', Section: 4 },
      { Name: 'Pickup Pad', ParamName: 'pIsPickupPad', Section: 2 },
      { Name: 'Require Mating Parts', ParamName: 'pIsRequiredMattingParts', Section: 2 },
      { Name: 'Functional Testing Tools', ParamName: 'pIsFunctionalTesingTool', Section: 1 },
      { Name: 'Functional Testing Equipments', ParamName: 'pIsFinctionalRestingEquipment', Section: 1 }
    ];

    vm.CopyOption = angular.copy(COMPONENT_COPY_FIELD);
    const initial = () => {
      vm.CopyOption.forEach((item) => {
        if (data.isCPN && (item.Name === 'Alternate Parts' || item.Name === 'RoHS Replacement Parts' || item.Name === 'Packaging Alias Parts'
          || item.Name === 'Drive Tools' || item.Name === 'Process Material' || item.Name === 'Functional Testing Tools'
          || item.Name === 'Functional Testing Equipments' || item.Name === 'Pickup Pad' || item.Name === 'Require Mating Parts')) {
          item.isDisabled = true;
        }
        if (data.category === CORE.PartCategory.SubAssembly && item.Name === 'Packaging Alias Parts') {
          item.isDisabled = true;
        } else if (item.Name === 'Required Functional Types' || item.Name === 'Required Mounting Types') {
          item.isDisabled = true;
        }
      });
    };
    initial();

    //get alias for auto-complete-search
    function getAliasSearch(searchObj) {
      return ComponentFactory.getComponentPidCodeSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
        if (componentAlias && componentAlias.data.data) {
          /*componentAlias.data.data = _.reject(componentAlias.data.data, (item) => {
              return item.id == vm.assyData.id
          });*/
          return componentAlias.data.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // start component packaging alias region
    const getComponentPackagingAliasDetail = (item) => {
      if (item && (item.isCPN || data.isCPN)) {
        vm.CopyOption.forEach((item) => {
          if (item.Name === 'Alternate Parts' || item.Name === 'RoHS Replacement Parts' || item.Name === 'Packaging Alias Parts'
            || item.Name === 'Drive Tools' || item.Name === 'Process Material' || item.Name === 'Functional Testing Tools'
            || item.Name === 'Functional Testing Equipments' || item.Name === 'Pickup Pad' || item.Name === 'Require Mating Parts') {
            item.isChecked = false;
            item.isDisabled = true;
          };
        });
      } else {
        vm.CopyOption.forEach((item) => {
          if (item.Name === 'Alternate Parts' || item.Name === 'RoHS Replacement Parts' || item.Name === 'Packaging Alias Parts'
            || item.Name === 'Drive Tools' || item.Name === 'Process Material' || item.Name === 'Functional Testing Tools'
            || item.Name === 'Functional Testing Equipments' || item.Name === 'Pickup Pad' || item.Name === 'Require Mating Parts') {
            item.isChecked = false;
            item.isDisabled = false;
          };
        });
      }
    };
    vm.autoCompleteFromPart = {
      columnName: 'PIDCode',
      keyColumnName: 'id',
      keyColumnId: null,
      controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
      viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
      inputName: 'Copy To Part',
      placeholderName: 'Search text or Add',
      isRequired: true,
      isAddnew: false,
      addData: {
        mfgType: CORE.MFG_TYPE.MFG,
        parentId: vm.assyData ? vm.assyData.mfgcodeID : null,
        isBadPart: CORE.PartCorrectList.IncorrectPart,
        popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
        pageNameAccessLabel: CORE.PageName.part_master
      },
      callbackFn: function () {
      },
      onSelectCallbackFn: getComponentPackagingAliasDetail,
      onSearchFn: function (query) {
        const searchObj = {
          id: vm.assyData.id,
          mfgType: CORE.MFG_TYPE.MFG,
          query: query,
          mfgcodeID: vm.assyData.mfgcodeID,
          category: vm.assyData.category
        };
        return getAliasSearch(searchObj);
      }
    };
    vm.selectBySection = (section, selectedValue) => {
      _.each(vm.CopyOption, (item) => {
        if (!item.isDisabled && item.Section === section) {
          item.isChecked = selectedValue;
        }
      });
      vm.selectChange();
    };

    vm.changeSelectAll = () => {
      _.each(vm.CopyOption, (item) => {
        if (!item.isDisabled) {
          item.isChecked = vm.selectAll;
        }
      });
      vm.selectChange();
    };

    vm.selectChange = () => {
      const checkedOption = _.filter(vm.CopyOption, (item) => item.isChecked && !item.isDisabled);
      const disabledOption = _.filter(vm.CopyOption, (item) => item.isDisabled);

      const firstSectionCount = _.filter(vm.CopyOption, (item) => item.Section === 1);
      const selectedFirstSection = _.filter(vm.CopyOption, (item) => item.Section === 1 && (item.isChecked || (item.isDisabled && !item.isChecked)));
      const disabledFromFirstSection = _.filter(vm.CopyOption, (item) => item.Section === 1 && item.isDisabled);

      const secondSectionCount = _.filter(vm.CopyOption, (item) => item.Section === 2);
      const selectedSecondSection = _.filter(vm.CopyOption, (item) => item.Section === 2 && (item.isChecked || (item.isDisabled && !item.isChecked)));
      const disabledFromSecondSection = _.filter(vm.CopyOption, (item) => item.Section === 2 && item.isDisabled);

      const thirdSectionCount = _.filter(vm.CopyOption, (item) => item.Section === 3);
      const selectedThirdSection = _.filter(vm.CopyOption, (item) => item.Section === 3 && (item.isChecked || (item.isDisabled && !item.isChecked)));
      const disabledFromThirdSection = _.filter(vm.CopyOption, (item) => item.Section === 3 && item.isDisabled);

      const fourthSectionCount = _.filter(vm.CopyOption, (item) => item.Section === 4);
      const selectedFourthSection = _.filter(vm.CopyOption, (item) => item.Section === 4 && (item.isChecked || (item.isDisabled && !item.isChecked)));
      const disabledFromFourthSection = _.filter(vm.CopyOption, (item) => item.Section === 4 && item.isDisabled);

      vm.selectFirstSection = (disabledFromFirstSection.length === firstSectionCount.length) ? false : (firstSectionCount.length === selectedFirstSection.length) ? true : false;
      vm.selectSecondSection = (disabledFromSecondSection.length === secondSectionCount.length) ? false : (secondSectionCount.length === selectedSecondSection.length) ? true : false;
      vm.selectThirdSection = (disabledFromThirdSection.length === thirdSectionCount.length) ? false : (thirdSectionCount.length === selectedThirdSection.length) ? true : false;
      vm.selectFourthSection = (disabledFromFourthSection.length === fourthSectionCount.length) ? false : (fourthSectionCount.length === selectedFourthSection.length) ? true : false;

      vm.selectAll = ((checkedOption.length + disabledOption.length) === vm.CopyOption.length) ? true : false;
      vm.disablecopy = checkedOption.length > 0 ? false : true;
    };

    vm.CopyAssyDetail = () => {
      if (vm.CopyPartDetailForm.$invalid || !vm.autoCompleteFromPart.keyColumnId || vm.disablecopy) {
        BaseService.focusRequiredField(vm.CopyPartDetailForm);
        return;
      }
      const copyOption = vm.CopyOption.filter((a) => !a.isDisabled);
      const copyPartDetailObj = _.chain(copyOption).keyBy('ParamName').mapValues('isChecked').value();
      //copyPartDetailObj.ToPartID = vm.assyData.id;
      //copyPartDetailObj.FromPartID = vm.autoCompleteFromPart.keyColumnId;
      copyPartDetailObj.FromPartID = vm.assyData.id;
      copyPartDetailObj.ToPartID = vm.autoCompleteFromPart.keyColumnId;
      if (vm.autoCompleteFromPart.keyColumnId) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_COPY_ASSEMBLY_DETAILS_CONFIRMATION_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ComponentFactory.copyPartDetail().query(copyPartDetailObj).$promise.then((response) => {
              if (response && response.data) {
                vm.CopyPartDetailForm.$setPristine();
                $mdDialog.hide();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        });
      } else {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_COPY_ASSEMBLY_SELECT_FROM_PART_VALIDATION,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };

    //go to manage part number
    vm.goToAssyMaster = (partID) => {
      BaseService.goToComponentDetailTab(null, partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
      BaseService.goToPartList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.assyData.mfgcodeID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    ///go to standard list
    vm.goToStandardList = () => {
      BaseService.goToStandardList();
      return false;
    };
    //getAssyDetails();

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.LabelConstant.MFG.MFG,
      value: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.assyData.mfgCode, vm.assyData.manufacturerName),
      displayOrder: 1,
      labelLinkFn: vm.goToCustomerList,
      valueLinkFn: vm.goToCustomer,
      valueLinkFnParams: null
    }, {
      label: vm.LabelConstant.MFG.MFGPN,
      value: vm.assyData.mfgPN,
      displayOrder: 1,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      valueLinkFnParams: vm.assyData.id,
      isCopy: true,
      isAssy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.assyData.rohsIcon,
        imgDetail: vm.assyData.rohsComplientConvertedValue
      }
    }
      //{
      //    label: vm.LabelConstant.MFG.MFGPN,
      //    value: vm.assyData.mfgPN,
      //    displayOrder: 1,
      //    labelLinkFn: vm.goToAssyList,
      //    valueLinkFn: vm.goToAssyMaster,
      //    valueLinkFnParams: vm.assyData.id,
      //    isCopy: true,
      //    isMFGPN: true,
      //    isCopyAheadLabel: false,
      //    imgParms: {
      //        imgPath: vm.rohsImagePath + vm.assyData.rohsIcon,
      //        imgDetail: vm.assyData.rohsComplientConvertedValue
      //    }
    );

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.CopyPartDetailForm);
      if (isdirty) {
        const data = {
          form: vm.CopyPartDetailForm
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
      BaseService.currentPagePopupForm = [vm.CopyPartDetailForm];
    });

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
  }
})();
