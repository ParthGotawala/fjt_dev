(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('CreateAssemblyRevisionPopupController', CreateAssemblyRevisionPopupController);

  /** @ngInject */
  function CreateAssemblyRevisionPopupController($scope, $q, $mdDialog, $timeout, CORE, USER, data, BaseService, DialogFactory, ComponentFactory, RFQSettingFactory, MasterFactory, AssyTypeFactory, ManageMFGCodePopupFactory) {
    const vm = this;
    vm.assyData = data;
    vm.cid = (data && data.id) ? data.id : undefined;
    vm.mfgTypedata = (data && data.mfgType) ? data.mfgType.toUpperCase() : null;

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.MFG_TYPE = CORE.MFG_TYPE;
    vm.textAreaRows = CORE.TEXT_AREA_ROWS;
    vm.PartCategory = CORE.PartCategory;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.CUSTOMER_PART_CPN_TOOLTIP_MESSAGE = CORE.CUSTOMER_PART_CPN_TOOLTIP_MESSAGE;
    vm.COMPONENT_ROHS_DEVIATION_TOOLTIP_MESSAGE = CORE.COMPONENT_ROHS_DEVIATION_TOOLTIP_MESSAGE;
    vm.PART_TYPE_TOOLTIP_MESSAGE = CORE.PART_TYPE_TOOLTIP_MESSAGE;
    vm.COPY_PART_STANDARD_HINT = CORE.COPY_PART_STANDARD_HINT;
    vm.PartCorrectList = CORE.PartCorrectList;
    vm.userRoHSStatusID = USER.RoHSStatusID;
    vm.rohsDeviation = CORE.RoHSDeviation;
    vm.rohsMainCategory = CORE.RoHSMainCategory;
    vm.PIDCodeMultipleHyphenMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMP_MULTIPLE_HYPHEN_IN_PID_CODE_NOT_ALLOWED);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.makeAPIcallForDuplicationCheck = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.partStatus = CategoryTypeObjList.PartStatus.Name;
    vm.PIDCodeLength = null;
    vm.disablecopy = true;
    vm.isAssyPNORRevChange = false;
    vm.component = {
      fromMfrCode: '',
      fromPartID: vm.assyData.id,
      newPartRev: null,
      newPartPID: null
    };

    vm.CopyOption = [
      { Name: 'Part Image(s)', ParamName: 'pIsCopyImages', Section: 1 },
      { Name: 'Part Data Sheet Links', ParamName: 'pIsCopyDatasheet', Section: 1 },
      { Name: 'Part Standards', ParamName: 'pIsStandards', Section: 5 },
      { Name: 'Required Functional Types', ParamName: 'pIsRequiredFunctionalType', Section: 2 },
      { Name: 'Required Mounting Types', ParamName: 'pIsRequiredMountingType', Section: 2 },
      { Name: 'Documents', ParamName: 'pIsCopyDocument', Section: 1 },
      { Name: 'Settings', ParamName: 'pIsSettings', Section: 4 },
      { Name: 'Acceptable Shipping Countries', ParamName: 'pIsAcceptableShippinCountry', Section: 5 },
      { Name: 'Attributes', ParamName: 'pIsAttribute', Section: 4 },/*auto tick*/
      { Name: 'Additional Attributes', ParamName: 'pIsAdditionalAttibute', Section: 4 }/*auto tick*/,
      { Name: 'Packaging Alias Parts', ParamName: 'pIsPackagingAliasPart', Section: 3 },
      { Name: 'Other Part Names', ParamName: 'pIsOtherPartName', Section: 3 },
      { Name: 'Operational Attributes', ParamName: 'pIsOperationalAttirbutes', Section: 4 },
      { Name: 'Packaging Details', ParamName: 'pIsPackagingDetail', Section: 4 },
      { Name: 'Comments', ParamName: 'pIsComments', Section: 5 },
      { Name: 'Alternate Parts', ParamName: 'pIsAlternatePart', Section: 3 },
      { Name: 'RoHS Replacement Parts', ParamName: 'pIsRoHSReplacementPart', Section: 3 },
      { Name: 'Drive Tools', ParamName: 'pIsDriveTool', Section: 2 },
      { Name: 'Process Material', ParamName: 'pIsProcessMaterial', Section: 5 },
      { Name: 'Pickup Pad', ParamName: 'pIsPickupPad', Section: 3 },
      { Name: 'Require Mating Parts', ParamName: 'pIsRequiredMattingParts', Section: 3 },
      { Name: 'Functional Testing Tools', ParamName: 'pIsFunctionalTesingTool', Section: 2 },
      { Name: 'Functional Testing Equipments', ParamName: 'pIsFinctionalRestingEquipment', Section: 2 },
      { Name: 'BOM', ParamName: 'pIsBOM', Section: 1 },
      { Name: 'Tracking Serial Number', ParamName: 'pIsTrackSNumber', Section: 1 }];

    const initial = () => {
      vm.CopyOption.forEach((item) => {
        if (item.Name !== 'Part Image(s)' && item.Name !== 'Part Data Sheet Links' && item.Name !== 'Part Standards' && item.Name !== 'Documents' && item.Name !== 'Settings'
          && item.Name !== 'Acceptable Shipping Countries' && item.Name !== 'Flux Type' && item.Name !== 'Other Part Names' && item.Name !== 'Operational Attributes' && item.Name !== 'Packaging Details') {
          if (vm.mfgTypedata !== CORE.MFG_TYPE.MFG) {
            item.isDisabled = true;
          }

          if (vm.mfgTypedata === CORE.MFG_TYPE.MFG && vm.partCategoryID !== CORE.PartCategory.SubAssembly && (item.Name === 'Required Functional Types' || item.Name === 'Required Mounting Types'
            || item.Name === 'BOM' || item.Name === 'Tracking Serial Number')) {
            item.isDisabled = true;
          }
          if (vm.mfgTypedata === CORE.MFG_TYPE.MFG && vm.partCategoryID === CORE.PartCategory.SubAssembly && item.Name === 'Packaging Alias Parts') {
            item.isDisabled = true;
          }

          if (vm.assyData.isCPN && (item.Name === 'Alternate Parts' || item.Name === 'RoHS Replacement Parts' || item.Name === 'Packaging Alias Parts'
            || item.Name === 'Drive Tools' || item.Name === 'Process Material' || item.Name === 'Functional Testing Tools'
            || item.Name === 'Functional Testing Equipments' || item.Name === 'Pickup Pad' || item.Name === 'Require Mating Parts')) {
            item.isDisabled = true;
          };
        }
      });
    };
    /**
     * On change value of To part CPN apply validation
     * */
    vm.onCPNPartChange = () => {
      vm.component.isCustom = vm.component.isCPN ? true : vm.fromComponent.isCustom;
      if (vm.fromComponent.isCPN) {
        if (vm.autoCompleteAssemblyType) {
          vm.autoCompleteAssemblyType.keyColumnId = null;
        }
      }

      vm.CopyOption.forEach((item) => {
        if (item.Name === 'Alternate Parts' || item.Name === 'RoHS Replacement Parts' || item.Name === 'Packaging Alias Parts'
          || item.Name === 'Drive Tools' || item.Name === 'Process Material' || item.Name === 'Functional Testing Tools'
          || item.Name === 'Functional Testing Equipments' || item.Name === 'Pickup Pad' || item.Name === 'Require Mating Parts') {
          if (vm.component.isCPN || vm.fromComponent.isCPN) {
            item.isChecked = false;
            item.isDisabled = true;
          } else {
            item.isDisabled = false;
          }
        };

        if (vm.mfgTypedata === CORE.MFG_TYPE.MFG && vm.partCategoryID !== CORE.PartCategory.SubAssembly && (item.Name === 'Required Functional Types' || item.Name === 'Required Mounting Types'
          || item.Name === 'BOM' || item.Name === 'Tracking Serial Number')) {
          item.isDisabled = true;
        }
        if (vm.mfgTypedata === CORE.MFG_TYPE.MFG && vm.partCategoryID === CORE.PartCategory.SubAssembly && item.Name === 'Packaging Alias Parts') {
          item.isDisabled = true;
        }
      });

      vm.selectChange();
    };
    /* retrieve component detail by id */
    vm.componentDetails = (cid) => {
      if (cid) {
        return ComponentFactory.component().query({
          id: cid
        }).$promise.then((fromComponent) => {
          if (fromComponent && fromComponent.data) {
            if (fromComponent.data.category === vm.PartCategory.SubAssembly) {
              fromComponent.data.PIDCodePrefix = '';
              fromComponent.data.PIDCodeSufix = fromComponent.data.PIDCode;
            }
            else {
              const index = fromComponent.data.PIDCode.indexOf('+');
              fromComponent.data.PIDCodePrefix = fromComponent.data.PIDCode.substr(0, index + 1);
              fromComponent.data.PIDCodeSufix = fromComponent.data.PIDCode.substr(index + 1);
            }
            if (fromComponent.data.mfgCodemst && fromComponent.data.mfgCodemst.mfgCode && fromComponent.data.mfgCodemst.mfgName) {
              fromComponent.data.mfgCodemst.fullMfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, fromComponent.data.mfgCodemst.mfgCode, fromComponent.data.mfgCodemst.mfgName);
            }
            if (fromComponent.data.refSupplierMfgComponent && fromComponent.data.refSupplierMfgComponent.mfgCodemst && fromComponent.data.refSupplierMfgComponent.mfgCodemst.mfgName) {
              fromComponent.data.refSupplierMfgComponent.mfgCodemst.fullMfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, fromComponent.data.refSupplierMfgComponent.mfgCodemst.mfgCode, fromComponent.data.refSupplierMfgComponent.mfgCodemst.mfgName);
            }
            vm.fromComponent = angular.copy(fromComponent.data);
            vm.IsSupplier = (vm.fromComponent.mfgCodemst.mfgType === vm.MFG_TYPE.DIST);
            vm.selectedStandard = [];
            _.each(fromComponent.data.componetStandardDetail, (stdclass) => {
              stdclass.colorCode = CORE.DefaultStandardTagColor;
              stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
              stdclass.colorCode = stdclass.Standardclass ? (stdclass.Standardclass.colorCode ? stdclass.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
              stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
              stdclass.priority = stdclass.certificateStandard ? stdclass.certificateStandard.priority : null;
              vm.selectedStandard.push(stdclass);
            });
            vm.selectedStandard.sort(sortAlphabatically('priority', 'standard', true));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* binding values in view mode - category*/
    const getCategory = (item) => {
      if (item) {
        const selectedCategory = _.find(vm.categoryList, (c) => c.id === item.id);
        vm.component.selectedCategoryTxt = selectedCategory ? selectedCategory.Value : '';
        vm.partCategoryID = selectedCategory ? selectedCategory.partCategory : null;
        vm.component.category = selectedCategory.partCategory;

        vm.component.epicorType = selectedCategory.epicorType;
        vm.autoCompleteEpicorType.keyColumnId = vm.component.epicorType;
        if (selectedCategory.id !== vm.PartCategory.SubAssembly || vm.fromComponent.isCPN) {
          vm.autoCompleteAssemblyType.keyColumnId = null;
        }
      }
      else {
        vm.component.selectedCategoryTxt = null;
        vm.partCategoryID = null;
        vm.component.category = null;
      }
      if ((!vm.fromComponent.isCustom && !vm.fromComponent.isCPN && vm.partCategoryID !== vm.PartCategory.SubAssembly)) {
        vm.component.rev = '';
        vm.component.custAssyPN = '';
      }
      vm.changePIDCode();
      vm.changeAssyCode();
    };
    const getEpicoreType = (item) => {
      if (item) {
        vm.component.epicorType = item.epicorType;
      }
    };
    vm.revisionChange = () => {
      vm.isAssyPNORRevChange = true;
      vm.generateMfgPN();
      vm.changePIDCode();
    };
    // change PID Code
    vm.changePIDCode = () => {
      vm.component.PIDCode = generatePIDCode();
      vm.isAssyPNORRevChange = true;
    };
    const generatePIDCode = (isCheck) => {
      const mfgCode = getSelectedMFGDetails();
      if (mfgCode) {
        if (vm.partCategoryID === vm.PartCategory.SubAssembly) {
          const PidCode = ((vm.component.nickName ? vm.component.nickName.trim() : '') + ' Rev' + (vm.component.rev ? vm.component.rev.trim() : ''));
          if (!isCheck) {
            vm.component.PIDCodePrefix = '';
            vm.component.PIDCodeSufix = PidCode;
          }
          return PidCode;
        }
        else {
          vm.generateMfgPN();
          if (!isCheck) {
            vm.component.PIDCodePrefix = mfgCode.mfgCode + '+';
            vm.component.PIDCodeSufix = vm.component.mfgPN ? vm.component.mfgPN.trim() : '';
          }
          //return $filter('limitTo')(mfgCode.mfg + "+" + (vm.component.mfgPN || ''), PIDCodeLength, 0);
          return (mfgCode.mfgCode + '+' + (vm.component.mfgPN ? vm.component.mfgPN.trim() : ''));
        }
      }
      else {
        vm.component.PIDCodePrefix = '';
        vm.component.PIDCodeSufix = '';
        return '';
      }
    };

    const getSelectedMFGDetails = () => _.find(vm.mfgCodeDetail, (item) => item.id === vm.autoCompletemfgCode.keyColumnId);

    vm.generateMfgPN = () => {
      if (vm.isMfgPnDisabled()) {
        if (vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly) {
          vm.component.mfgPN = ((vm.component.custAssyPN ? vm.component.custAssyPN.trim() : '') + ' Rev' + (vm.component.rev ? vm.component.rev.trim() : ''));
        }
      }
    };
    vm.isMfgPnDisabled = () => {
      if (vm.autoCompleteCategory && (vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly)) {
        return true;
      }
      else {
        return false;
      }
    };
    //Get Assembly List
    function getAssyTypeList() {
      return AssyTypeFactory.getAssyTypeList().query().$promise.then((response) => {
        vm.assyTypeList = [];
        if (response && response.data) {
          vm.assyTypeList = _.filter(response.data, (item) => item.isActive);
        }

        return $q.resolve(vm.assyTypeList);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    function getAssyType(item) {
      if (!item) {
        vm.assyTypeList = _.filter(vm.assyTypeList, (item) => item.isActive);
      }
    }

    // generate Asy Code
    vm.changeAssyCode = () => {
      const mfgCode = getSelectedMFGDetails();
      if (mfgCode) {
        if (vm.partCategoryID === vm.PartCategory.SubAssembly) {
          vm.component.nickName = mfgCode.mfgCode + '' + (vm.component.assyCode ? vm.component.assyCode.trim() : '');
        } else {
          vm.component.nickName = '';
        }
      } else {
        vm.component.nickName = '';
      }
      vm.changePIDCode();
    };
    const getComponentMfg = (item) => {
      const pidCode = angular.copy(vm.PIDCodeLength);
      vm.PIDCodeLength = null;
      const fromPartPIDCodeSufix = vm.fromComponent.PIDCodeSufix;
      if (item) {
        vm.autoCompletemfgCode.keyColumnId = item.id;
        vm.component.mfgcodeID = item.id;
        vm.changePIDCode();
        vm.changeAssyCode();

        const selectedMFG = _.find(vm.mfgCodeDetail, (p) => p.id === item.id);
        vm.component.selectedMFGCodeTxt = selectedMFG ? selectedMFG.mfgCode : '';
        vm.mfgCodeCharacterCount = selectedMFG.mfgCode.length + 1;
      }
      else {
        vm.mfgCodeCharacterCount = 5;
        if (vm.component) {
          vm.component.mfgcodeID = null;
          vm.component.selectedMFGCodeTxt = '';
        }
        vm.autoCompletemfgCode.keyColumnId = null;
        vm.replacementPartList = [];
        vm.changePIDCode();
        vm.changeAssyCode();
      }
      // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 16/02/2021)
      $timeout(() => {
        vm.PIDCodeLength = pidCode;
        vm.fromComponent.PIDCodeSufix = fromPartPIDCodeSufix;
        vm.changePIDCode();
      });
      // vm.validateDuplicateMFRPN();
    };
    // Get part category master list
    function getPartCategoryMstList() {
      return MasterFactory.getPartCategoryMstList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.categoryList = response.data.map((item) => ({
            id: item.id,
            Value: item.categoryName,
            partCategory: item.partCategory,
            epicorType: item.epicorType
          }));
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return null;
      });
    }
    // Get Epicore Type List
    function getEpicorTypeList() {
      return MasterFactory.getEpicorTypeList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.epicorTypeList = response.data;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return null;
      });
    }
    // search and get data for mfgcode
    function getMfgSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        vm.mfgCodeDetail = [];
        if (mfgcodes && mfgcodes.data) {
          if (searchObj && searchObj.mfgcodeID) {
            vm.component.selectedMFGCodeTxt = mfgcodes.data[0] ? mfgcodes.data[0].mfgCode : '';
            vm.component.mfgcodeID = mfgcodes.data[0] ? mfgcodes.data[0].id : '';
            const selectedMfgCode = mfgcodes.data[0];
            $timeout(() => {
              if (vm.autoCompletemfgCode && vm.autoCompletemfgCode.inputName) {
                $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMfgCode);
              }
            });
          }
          vm.mfgCodeDetail = mfgcodes.data;
        }
        return vm.mfgCodeDetail;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.getSelectedValues = () => {
      if (vm.mfgCodeDetail) {
        const selectedMFG = _.find(vm.mfgCodeDetail, (item) => item.id === vm.autoCompletemfgCode.keyColumnId);
        // getComponentMfg(selectedMFG);
        if (selectedMFG) {
          $timeout(() => {
            $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMFG);
          }, _configTimeout);
        }
      }
    };
    /* [S] - Mounting Type Auto Complete*/
    const partType = () => ComponentFactory.getPartTypeList().query().$promise.then((res) => {
      if (res && res.data) {
        if (vm.cid) {
          vm.partTypeList = res.data;
        }
        else {
          vm.partTypeList = _.filter(res.data, (item) => item.isActive);
        }
      }
      else {
        vm.partTypeList = [];
      }

      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const getPartType = (item) => {
      if (item) {
        vm.autoCompletePartType.keyColumnId = item.id;
        vm.component.functionalCategoryID = item.id;
      }
      else {
        vm.component.functionalCategoryID = null;
        vm.partTypeList = _.filter(vm.partTypeList, (item) => item.isActive);
      }
    };
    /* [F] - Functional Type Auto Complete*/

    /* [S] - Mounting Type Auto Complete*/
    const mountingType = () => ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
      if (res && res.data) {
        if (vm.cid) {
          vm.mountingTypeList = res.data;
        }
        else {
          vm.mountingTypeList = _.filter(res.data, (item) => item.isActive);
        }
      }
      else {
        vm.mountingTypeList = [];
      }

      return res;
    }).catch((error) => BaseService.getErrorLog(error));
    const getmountingType = (item) => {
      if (item) {
        vm.component.mountingTypeID = item.id;
        vm.autoCompleteMountingType.keyColumnId = item.id;
      }
      else {
        vm.component.mountingTypeID = null;
        vm.mountingTypeList = _.filter(vm.mountingTypeList, (item) => item.isActive);
      }
    };
    /* [F] - Mounting Type Auto Complete*/

    const initAutoComplete = () => {
      vm.autoCompleteRohsStatus = {
        columnName: 'name',
        controllerName: CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_ROHS_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.cid ? vm.component.RoHSStatusID : vm.userRoHSStatusID,
        inputName: 'copyRohsComplient',
        placeholderName: 'RoHS Status',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ROHS_STATE],
          pageNameAccessLabel: CORE.PageName.rohs_status
        },
        callbackFn: getRoHSList,
        onSelectCallbackFn: rohsConfirmationPopup
      };

      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        parentColumnName: 'mfgCodeAlias',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.component ? vm.component.mfgcodeID : null,
        inputName: 'mfgCode',
        placeholderName: stringFormat('Search {0} code and add', (vm.mfgTypedata === 'DIST' ? 'Supplier' : vm.mfgTypedata)),
        isRequired: true,
        isUppercaseSearchText: true,
        addData: {
          mfgType: vm.mfgTypedata,
          popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.manufacturer
        },
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id,
            searchInActive: false
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: getComponentMfg,
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemfgCode.inputName,
            type: vm.mfgTypedata,
            searchInActive: false
          };
          return getMfgSearch(searchObj);
        }
      };

      vm.autoCompleteCategory = {
        columnName: 'Value',
        keyColumnName: 'id',
        keyColumnId: vm.component ? (vm.component.partType ? vm.component.partType : vm.PartCategory.Component) : vm.PartCategory.Component,
        inputName: 'Type',// 'Category',
        placeholderName: 'Part Type',//'Category',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getCategory
      };
      vm.autoCompleteEpicorType = {
        columnName: 'epicorType',
        keyColumnName: 'epicorType',
        keyColumnId: vm.component.epicorType ? vm.component.epicorType : null,
        inputName: 'epicorType',
        placeholderName: 'Purchase Type',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getEpicoreType
      };
      vm.autoCompleteAssemblyType = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: vm.component.assemblyType ? vm.component.assemblyType : null,
        controllerName: CORE.MANAGE_ASSY_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_ASSY_TYPE_MODAL_MODAL_VIEW,
        inputName: 'Assy Type',
        placeholderName: 'Assy Type',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ASSYTYPE_STATE],
          pageNameAccessLabel: CORE.PageName.assy_type
        },
        callbackFn: getAssyTypeList,
        onSelectCallbackFn: getAssyType
      };

      vm.autoCompletePartType = {
        columnName: 'partTypeName',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.functionalCategoryID : null,
        inputName: 'Functional Category',
        placeholderName: 'Functional Category',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PART_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.funtional_type
        },
        callbackFn: partType,
        onSelectCallbackFn: getPartType
      };

      vm.autoCompleteMountingType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.mountingTypeID : null,
        inputName: 'Mounting Type',
        placeholderName: 'Mounting Type',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.mounting_type
        },
        callbackFn: mountingType,
        onSelectCallbackFn: getmountingType
      };
      vm.getSelectedValues();
    };

    function getPIDCode() {
      vm.PIDCodeLength = null;
      return ComponentFactory.getComponentPIDCode().query({
      }).$promise.then((res) => {
        if (res.data) {
          $timeout(() => {
            vm.PIDCodeLength = res.data ? res.data.values : 0;
          });
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }
    //getPIDCode();

    // get RoHS List
    function getRoHSList() {
      return MasterFactory.getRohsList().query().$promise.then((requirement) => {
        if (requirement && requirement.data) {
          if (vm.cid) {
            vm.RohsList = requirement.data;
          }
          else {
            vm.RohsList = _.filter(requirement.data, (item) => item.isActive);
          }
        }
        else {
          vm.RohsList = [];
        }
        return requirement;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const rohsConfirmationPopup = (item) => {
      if (item && item.id) {
        if (item && vm.fromComponent.RoHSStatusID !== item.id) {
          if (item.refMainCategoryID === USER.RoHSMainCategoryId) {
            vm.component.isRohs = true;
          }
          else if (item.refMainCategoryID === USER.NonRoHSMainCategoryId) {
            vm.component.isRohs = false;
          }
          else {
            vm.component.isRohs = false;
          }
        }
        vm.component.RoHSStatusID = (item && item.id) ? item.id : null;

        if (!item) {
          vm.RohsList = _.filter(vm.RohsList, (item) => item.isActive);
        }

        vm.setRoHSDeviation();
        vm.component.rfq_rohsmst = item || {};
      }
    };
    vm.setRoHSDeviation = () => {
      vm.refMainCategoryID = undefined;
      if (vm.partCategoryID === vm.PartCategory.SubAssembly && (vm.component.RoHSStatusID || vm.component.RoHSStatusID === 0)) {
        const selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.component.RoHSStatusID);
        if (selectedRoHS) {
          vm.refMainCategoryID = selectedRoHS.refMainCategoryID;
          switch (vm.refMainCategoryID) {
            case vm.rohsMainCategory.RoHS:
              {
                _.each(vm.rohsDeviation, (item) => {
                  item.isDeleted = item.id === -3 ? true : false;
                });
                vm.component.rohsDeviation = -1;
              }
              break;
            case vm.rohsMainCategory.NotApplicable:
              {
                vm.component.rohsDeviation = undefined;
              }
              break;
          }
        }
      }
      else {
        vm.component.rohsDeviation = undefined;
      }
    };

    const autocompletePromise = [getMfgSearch(), partType(), mountingType(), vm.componentDetails(vm.cid), getPIDCode(), getPartCategoryMstList(), getRoHSList(), getEpicorTypeList(), getAssyTypeList()];

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      vm.component = angular.copy(vm.fromComponent);
      const rohsDeviationDet = vm.rohsDeviation.find((a) => a.id === vm.fromComponent.rohsDeviation);
      vm.fromComponent.rohsDeviationName = rohsDeviationDet ? rohsDeviationDet.name : null;
      initAutoComplete();
      $timeout(() => {
        // Bug 41041: Dev testing findings for [Main Branch] - Improvement point for Create Duplicate Part
        if (vm.autoCompleteRohsStatus && vm.autoCompleteRohsStatus.inputName) {
          vm.component.rohsDeviation = vm.fromComponent.rohsDeviation;
        }
        initial();
      });
    }).catch((error) => BaseService.getErrorLog(error));

    vm.changeSelectAll = () => {
      _.each(vm.CopyOption, (item) => {
        if (!item.isDisabled) {
          item.isChecked = vm.selectAll;
        }
      });

      vm.selectChange();
    };

    vm.selectBySection = (section, selectedValue) => {
      _.each(vm.CopyOption, (item) => {
        if (!item.isDisabled && item.Section === section) {
          item.isChecked = selectedValue;
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

      const fifthSectionCount = _.filter(vm.CopyOption, (item) => item.Section === 5);
      const selectedFifthSection = _.filter(vm.CopyOption, (item) => item.Section === 5 && (item.isChecked || (item.isDisabled && !item.isChecked)));
      const disabledFromFifthSection = _.filter(vm.CopyOption, (item) => item.Section === 5 && item.isDisabled);

      vm.selectFirstSection = (disabledFromFirstSection.length === firstSectionCount.length) ? false : (firstSectionCount.length === selectedFirstSection.length) ? true : false;
      vm.selectSecondSection = (disabledFromSecondSection.length === secondSectionCount.length) ? false : (secondSectionCount.length === selectedSecondSection.length) ? true : false;
      vm.selectThirdSection = (disabledFromThirdSection.length === thirdSectionCount.length) ? false : (thirdSectionCount.length === selectedThirdSection.length) ? true : false;
      vm.selectFourthSection = (disabledFromFourthSection.length === fourthSectionCount.length) ? false : (fourthSectionCount.length === selectedFourthSection.length) ? true : false;
      vm.selectFifthSection = (disabledFromFifthSection.length === fifthSectionCount.length) ? false : (fifthSectionCount.length === selectedFifthSection.length) ? true : false;

      vm.selectAll = ((checkedOption.length + disabledOption.length) === vm.CopyOption.length) ? true : false;
      vm.disablecopy = checkedOption.length > 0 ? false : true;
    };

    vm.CopyAssyDetail = () => {
      if (vm.CreateAssemblyRevisionForm.$invalid) {
        BaseService.focusRequiredField(vm.CreateAssemblyRevisionForm);
        return;
      }
      if (vm.getPIDCodeValidation()) {
        setFocusByName('toPIDCodeSufix');
        return;
      }
      const copyOption = vm.CopyOption.filter((a) => !a.isDisabled);
      const copyPartDetailObj = _.chain(copyOption).keyBy('ParamName').mapValues('isChecked').value();
      copyPartDetailObj.FromPartID = vm.assyData.id;

      copyPartDetailObj.newEpicorType = vm.autoCompleteEpicorType.keyColumnId ? vm.autoCompleteEpicorType.keyColumnId : null;
      copyPartDetailObj.newAssemblyType = vm.autoCompleteAssemblyType.keyColumnId;
      copyPartDetailObj.newMfgcodeID = vm.autoCompletemfgCode.keyColumnId;
      copyPartDetailObj.newCustAssyPN = vm.component.custAssyPN ? vm.component.custAssyPN.trim() : null;
      copyPartDetailObj.newRev = ((vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly) && vm.component.rev) ? vm.component.rev.trim() : null;
      copyPartDetailObj.newMfgPN = vm.component.mfgPN ? (replaceHiddenSpecialCharacter(vm.component.mfgPN)).trim() : vm.component.mfgPN;
      copyPartDetailObj.newAssyCode = vm.component.assyCode ? vm.component.assyCode.trim() : null;
      copyPartDetailObj.newNickName = (vm.partCategoryID === vm.PartCategory.SubAssembly && vm.component.nickName) ? vm.component.nickName.trim() : null;
      copyPartDetailObj.newPIDCode = (vm.component.PIDCodePrefix + vm.component.PIDCodeSufix).trim();
      copyPartDetailObj.isCustom = vm.component.isCustom;
      copyPartDetailObj.isCPN = vm.component.isCPN;
      copyPartDetailObj.mfgType = vm.mfgTypedata;
      copyPartDetailObj.mfgPNDescription = vm.component.mfgPNDescription;
      copyPartDetailObj.detailDescription = vm.component.detailDescription;
      copyPartDetailObj.internalReference = vm.component.internalReference;
      copyPartDetailObj.specialNote = vm.component.specialNote;
      copyPartDetailObj.isFluxNotApplicable = vm.component.isFluxNotApplicable;
      copyPartDetailObj.isNoClean = vm.component.isNoClean;
      copyPartDetailObj.isWaterSoluble = vm.component.isWaterSoluble;
      copyPartDetailObj.rohsDeviation = vm.component.rohsDeviation;
      copyPartDetailObj.RoHSStatusID = vm.component.RoHSStatusID;
      copyPartDetailObj.functionalCategoryID = vm.autoCompletePartType.keyColumnId;
      copyPartDetailObj.mountingTypeID = vm.autoCompleteMountingType.keyColumnId;

      if (vm.assyData.id && copyPartDetailObj.newPIDCode && !vm.disablecopy) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_CREATE_ASSEMBLY_REVISION_CONFIRMATION_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ComponentFactory.createAssemblyRevision().query(copyPartDetailObj).$promise.then((response) => {
              if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                if (response.data && response.data.mfgDet) {
                  const data = {
                    messageContent: response.data.messageContent,
                    mfgList: response.data.mfgDet
                  };

                  DialogFactory.dialogService(
                    CORE.COMPONENT_NICKNAME_VALIDATION_DETAIL_POPUP_CONTROLLER,
                    CORE.COMPONENT_NICKNAME_VALIDATION_DETAIL_POPUP_VIEW,
                    null,
                    data).then(() => { }, () => {
                      setFocus('toNickName');
                    }, (err) => BaseService.getErrorLog(err));
                } else {
                  vm.CreateAssemblyRevisionForm.$setPristine();
                  $mdDialog.hide(response.data);
                }
              }
              else {
                /*Set focus on first enabled field after user click Ok button*/
                if (checkResponseHasCallBackFunctionPromise(response)) {
                  response.alretCallbackFn.then(() => {
                    BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.CreateAssemblyRevisionForm);
                  });
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        });
      } else {
        const alertModel = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.CREATE_ASSEMBLY_REVISION_SELECT_DETAIL_BODY_MESSAGE,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel).then(() => {
          setFocus('selectAllOption');
        }, () => {
        });;
      }
    };

    //go to manage part number
    vm.goToAssyMaster = (partID) => {
      if (vm.mfgTypedata === vm.MFG_TYPE.DIST) {
        BaseService.goToSupplierPartDetails(partID);
      }
      else {
        BaseService.goToComponentDetailTab(null, partID);
      }
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
      if (vm.mfgTypedata === vm.MFG_TYPE.DIST) {
        BaseService.goToSupplierPartList();
      }
      else {
        BaseService.goToPartList();
      }
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
    vm.goToFunctionalTypeList = () => {
      BaseService.goToFunctionalTypeList();
    };
    vm.goToMountingTypeList = () => {
      BaseService.goToMountingTypeList();
    };
    //getAssyDetails();

    vm.headerdata = [];
    vm.headerdata.push(
      {
        label: (vm.mfgTypedata === vm.MFG_TYPE.MFG) ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier,
        value: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.assyData.mfgCode, vm.assyData.manufacturerName),
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null
      },
      {
        label: (vm.mfgTypedata === vm.MFG_TYPE.MFG) ? vm.LabelConstant.MFG.MFGPN : vm.LabelConstant.MFG.SupplierPN,
        value: vm.assyData.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.assyData.id,
        isCopy: true,
        isAssy: true,
        imgParms: {
          imgPath: !vm.assyData.rohsIcon.startsWith(vm.rohsImagePath) ? (vm.rohsImagePath + vm.assyData.rohsIcon) : vm.assyData.rohsIcon,
          imgDetail: vm.assyData.rohsComplientConvertedValue
        }
      }
    );

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.CreateAssemblyRevisionForm);
      if (isdirty) {
        const data = {
          form: vm.CreateAssemblyRevisionForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.goToRoHSStatusList = () => {
      BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
    };

    vm.goToAssyTypeList = () => {
      BaseService.goToAssyTypeList();
    };
    vm.goToManufacturerList = (mfgType) => {
      if (vm.mfgTypedata === mfgType) {
        BaseService.goToSupplierList();
      }
      else {
        BaseService.goToManufacturerList();
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.CreateAssemblyRevisionForm];
    });

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.getPIDCodeValidation = () => {
      if (vm.component.PIDCodeSufix && vm.component.PIDCodeSufix.includes(USER.PIDCodeInvalidCharacter)) {
        return true;
      }
      else {
        return false;
      }
    };
    vm.checkChangePIDCode = () => {
      vm.isAssyPNORRevChange = true;
    };
    //check Component PID Code Already Exists
    vm.validateDuplicatePIDCode = (isAssyPNORRevChange, elementName) => {
      const isCodePrefix = vm.partCategoryID === vm.PartCategory.SubAssembly ? true : (vm.component.PIDCodePrefix ? true : false);
      if (isCodePrefix && vm.component.PIDCodeSufix && isAssyPNORRevChange && !vm.makeAPIcallForDuplicationCheck) {
        const pidCodeDetail = {
          PIDCode: (vm.component.PIDCodePrefix + vm.component.PIDCodeSufix).trim()
        };

        vm.makeAPIcallForDuplicationCheck = true;
        vm.cgBusyLoading = ComponentFactory.validateDuplicatePIDCode().query(pidCodeDetail).$promise.then((res) => {
          if (res && res.errors) {
            res.alretCallbackFn.then(() => {
              vm.isAssyPNORRevChange = false;
              vm.makeAPIcallForDuplicationCheck = false;
              setFocusByName(elementName);
            });
          } else {
            vm.makeAPIcallForDuplicationCheck = false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //check Component MFR PN Code Already Exists
    vm.validateDuplicateMFRPN = (isAssyPNORRevChange, elementName) => {
      if (vm.component.custAssyPN !== vm.fromComponent.custAssyPN) {
        vm.component.assyCode = null;
      } else if (vm.component.custAssyPN === vm.fromComponent.custAssyPN) {
        vm.component.assyCode = vm.fromComponent.assyCode;
      }
      if (vm.component.mfgPN && vm.autoCompletemfgCode.keyColumnId && isAssyPNORRevChange && !vm.makeAPIcallForDuplicationCheck) {
        const mfrDetail = {
          mfgPN: vm.component.mfgPN,
          mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
          mfgType: vm.mfgTypedata
        };
        vm.makeAPIcallForDuplicationCheck = true;
        vm.cgBusyLoading = ComponentFactory.validateDuplicateMFRPN().query(mfrDetail).$promise.then((res) => {
          if (res && res.errors) {
            res.alretCallbackFn.then(() => {
              vm.isAssyPNORRevChange = false;
              vm.makeAPIcallForDuplicationCheck = false;
              setFocusByName(elementName);
            });
          } else {
            vm.makeAPIcallForDuplicationCheck = false;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /**
    * On change value of Flux Type configure N/A and 'NC and WS'
    * @param {any} isNoCleanChecked
    */
    vm.fluxTypeChange = (isNoCleanChecked) => {
      if (vm.component.isFluxNotApplicable) {
        vm.component.isNoClean = false;
        vm.component.isWaterSoluble = false;
      }
      else if (vm.autoCompleteCategory.keyColumnId === CORE.PartCategory.Component && vm.component.isNoClean && vm.component.isWaterSoluble) {
        vm.component.isNoClean = isNoCleanChecked ? true : false;
        vm.component.isWaterSoluble = !(vm.component.isNoClean);
      }
      setFluxTypeValue(false, true);
    };

    /**
     * Set required field for Flux Type
     * @param {boolean} isSetToFocus - for Auto Focus
     * @param {boolean} isSetToError - to set Error on control
     */
    function setFluxTypeValue(isSetToFocus, isSetToError) {
      if (!vm.component.isNoClean && !vm.component.isWaterSoluble && !vm.component.isFluxNotApplicable) {
        //vm.wizardStep1ComponentInfo.fluxType.$setValidity('isFluxTypeRequired', false);

        vm.CreateAssemblyRevisionForm.fluxType.$setValidity('isFluxTypeRequired', !isSetToError);

        if (isSetToFocus) {
          setFocusByName('fluxType');
        }
        return true;
      } else {
        vm.CreateAssemblyRevisionForm.fluxType.$setValidity('isFluxTypeRequired', true);
        return false;
      }
    }
  }
})();
