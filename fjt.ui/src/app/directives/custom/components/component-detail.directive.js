(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('componentDetail', componentDetail);

  /** @ngInject */
  function componentDetail(CORE, DialogFactory, $q, $sce, $compile, $state, $stateParams, $timeout, USER, PRICING, $filter, ManageMFGCodePopupFactory, ComponentFactory, BaseService, $mdDialog, MasterFactory, RFQSettingFactory, Upload, WhoAcquiredWhoFactory, RFQTRANSACTION, TRANSACTION, PartCostingFactory, ComponentStandardDetailsFactory, $window, UnitFactory, socketConnectionService, APIVerificationErrorPopupFactory, AssyTypeFactory, WorkorderFactory, SettingsFactory, ChartOfAccountsFactory, ComponentNicknameWOBuildDetailFactory, DCFormatFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        id: '=?',
        component: '=?',
        isEditComponent: '=?'
      },
      templateUrl: 'app/directives/custom/components/component-detail.html',
      controller: componentDetailCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function componentDetailCtrl($scope) {
      var vm = this;
      var selectedMFG;
      var selectedReplacementPart;
      var selectedMfgCode;
      var selectedGoodPart;
      var _dummyEvent = null;
      $scope.loaderVisible = undefined;
      vm.maxMPNLength = CORE.MAX_MPN_LENGTH;
      vm.popoverPlacement = 'right';
      vm.textAreaRows = CORE.TEXT_AREA_ROWS;
      vm.productionPNRegEx = CORE.ProductionPNAllowedCharactersPattern;
      vm.restrictSpecialCharacter = CORE.restrictSpecialCharator;
      vm.debounceTimeInterval = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.DateTypeList = TRANSACTION.DateType;
      vm.productionPNLength = _productionPNLength;
      vm.PartRestrictionSettings = CORE.PartRestrictionSettings;
      vm.SearchEmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM_ERROR_LEGEND;
      vm.OdlyNameEmptyMsg = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.ODDLY_NAME;
      vm.timeoutWatch;
      vm.isSaveDisabled = !$scope.isEditComponent;
      vm.cid = $scope.id ? parseInt($scope.id) : null;
      vm.isComponent = $scope.component;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.PartCorrectList = CORE.PartCorrectList;
      vm.CorePartStatusList = CORE.PartStatusList;
      vm.MFG_TYPE = CORE.MFG_TYPE;
      vm.taToolbar = CORE.Toolbar;
      vm.PIDCodeMultipleHyphenMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMP_MULTIPLE_HYPHEN_IN_PID_CODE_NOT_ALLOWED);
      vm.CUSTOMER_PART_CPN_TOOLTIP_MESSAGE = CORE.CUSTOMER_PART_CPN_TOOLTIP_MESSAGE;
      vm.PART_TYPE_TOOLTIP_MESSAGE = CORE.PART_TYPE_TOOLTIP_MESSAGE;
      vm.RECEIVE_BULK_TOOLTIP_MESSAGE = CORE.RECEIVE_BULK_TOOLTIP_MESSAGE;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.COMPONENT_SELF_LIFE_DAYS_FORMULA_TOOLTIP = CORE.COMPONENT_SELF_LIFE_DAYS_FORMULA_TOOLTIP;
      vm.COMPONENT_ROHS_DEVIATION_TOOLTIP_MESSAGE = CORE.COMPONENT_ROHS_DEVIATION_TOOLTIP_MESSAGE;
      vm.PCB_PER_ARRAY_TOOLTIP_MESSAGE = CORE.PCB_PER_ARRAY_TOOLTIP_MESSAGE;
      vm.COMPONENT_CLOUD_API_UPDATE_SWITCH_TOOLTIP_MESSAGE = CORE.COMPONENT_CLOUD_API_UPDATE_SWITCH_TOOLTIP_MESSAGE;
      vm.COMPONENT_WHERE_USED_OTHER_TOOLTIP_MESSAGE = CORE.COMPONENT_WHERE_USED_OTHER_TOOLTIP_MESSAGE;
      vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
      vm.restrictCommaPattern = CORE.restrictCommaPattern;
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.DateTimeFormat = _dateTimeDisplayFormat;
      vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
      vm.DATE_PICKER = CORE.DATE_PICKER;
      vm.IsPickerOpen = {};
      vm.IsPickerOpen[vm.DATE_PICKER.ltbDate] = false;
      vm.IsEolPickerOpen = {};
      vm.IsEolPickerOpen[vm.DATE_PICKER.eolDate] = false;
      vm.PIDCodeLength = null;
      vm.mfgTypedata = vm.mfgType = $state && $state.$current && $state.$current.parent && $state.$current.parent.name === USER.ADMIN_MANAGEDISTCOMPONENT_STATE ? CORE.MFG_TYPE.DIST : CORE.MFG_TYPE.MFG;
      vm.distType = CORE.MFGTypeDropdown.find((x) => x.Key === 'DIST').Value;
      const CategoryTypeObjList = angular.copy(CORE.CategoryType);
      vm.partStatus = CategoryTypeObjList.PartStatus.Name;
      // let componentMasterList = [];
      vm.mfgTypeDist = CORE.MFG_TYPE.DIST;
      vm.mfgTypeMfg = CORE.MFG_TYPE.MFG;
      vm.mfgLength = CORE.MFG_TYPE_LENGTH.MFG;
      vm.distLength = CORE.MFG_TYPE_LENGTH.DIST;
      vm.PartCategory = CORE.PartCategory;
      vm.PartType = CORE.PartType;
      vm.businessRisk = CORE.BusinessRisk;
      vm.rohsDeviation = CORE.RoHSDeviation;
      vm.rohsMainCategory = CORE.RoHSMainCategory;
      vm.ComponentAlternatePartType = CORE.ComponentAlternatePartType;
      vm.DetailTabSectionView = CORE.DetailTabSectionView;
      vm.imagefile = null;
      vm.partCategoryID = null;
      vm.selectedFunctionalTypeParts = [];
      vm.selectedMountingTypeParts = [];
      vm.selectedImageId = null;
      vm.defaultDataSheetUrlID = null;
      vm.canDeleteImage = false;
      vm.canSetDefaultImage = false;
      vm.acquisitionDetails = [];
      vm.DateFormatArray = CORE.DateFormatArray;
      //vm.standardTabRights = $scope.$parent.vm.pageTabRights ? $scope.$parent.vm.pageTabRights[0].StandardTab : false;
      vm.standardTabRights = false;
      vm.IsSupplier = true;
      vm.isSupplierMfgPnEnabled = false;
      vm.userRoHSStatusID = USER.RoHSStatusID;
      vm.userRoHSMainCategoryId = USER.RoHSMainCategoryId;
      vm.dataSheetLinkPath = '';
      vm.todayDate = new Date();
      vm.OtherPartFrequency = CORE.OtherPartFrequency;
      vm.FrequencyType = CORE.FREQUENCY_TYPE;
      vm.LTBDateOptions = {
        ltbDateOpenFlag: false
      };
      vm.hlStockStatus = true;
      vm.hlBuyDetails = true;
      vm.hlKitAllocation = true;
      vm.hlSalesPriceMatrix = true;
      vm.hlOperanalAttribute = true;
      vm.hlAcceptableCountries = true;
      vm.hlPackingAlias = true;
      vm.hlOtherPart = true;
      vm.hlAlternatePart = true;
      vm.hlRohsPart = true;
      vm.hlWhereUsedAssy = true;
      vm.hlSupplierAlias = true;
      vm.hlRequireDriveTools = true;
      vm.hlProcessMaterial = true;
      vm.hlCPNPart = true;
      vm.hlWhereUsedOther = true;
      vm.hlRequireMattingPart = true;
      vm.hlRequirePickupPad = true;
      vm.hlProgram = true;
      vm.hlRequireFuctionalTesting = true;
      vm.hlFuctionalTestingEquipmet = true;
      vm.hlIncorrectPart = true;
      vm.eolDateOptions = {
        eolDateOpenFlag: false
      };
      vm.reversalDateOptions = {
        reversalDateOpenFlag: false
      };
      vm.isReadOnly = false;
      vm.mfgCodeCharacterCount = 5;
      vm.makeAPIcallForDuplicationCheck = false;
      vm.stockStatusToolTipMessage = CORE.Part_Master_Tool_Tip_Message;
      vm.BarePCBMountingTypeID = CORE.RFQ_MOUNTINGTYPE.BarePCB.ID;
      vm.hasLimitedShelfLife = false;
      vm.selectedSectionExpand = '';
      // vm.ChemicalMountingTypeID = CORE.RFQ_MOUNTINGTYPE.Chemical.ID;
      vm.COA_TYPE = CORE.COMPONENT_COA_TYPE;
      vm.PartMasterAlternateGroupsTabs = USER.PartMasterAlternateGroupsTabs;
      let reTryCount = 0;
      const getAllRights = () => {
        vm.allowIncorrectPartCreation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowIncorrectPartCreation);
        vm.correctIncorrectPartSetting = BaseService.checkFeatureRights(CORE.FEATURE_NAME.CorrectIncorrectPartSetting);
        vm.allowToDeleteOtherPartNamesFeature = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToDeleteOtherPartNames);
        vm.addAliasPart = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowAddAliasParts);
        if ((vm.allowIncorrectPartCreation === null || vm.allowIncorrectPartCreation === undefined ||
          vm.correctIncorrectPartSetting === null || vm.correctIncorrectPartSetting === undefined ||
          vm.allowToDeleteOtherPartNamesFeature === null || vm.allowToDeleteOtherPartNamesFeature === undefined)
          && reTryCount < _configGetFeaturesRetryCount) {
          getAllRights(); //put for hard reload option as it will not get data from feature rights
          reTryCount++;
        }
      };

      const stateChangeSuccessCall = $scope.$on('$viewContentLoaded', () => {
        $timeout(() => {
          getAllRights();
        }, _configWOTimeout);
      });

      $timeout(() => {
        getAllRights();
      });

      vm.stringFormat = (message, fromLabel, toLabel) => stringFormat(message, fromLabel, toLabel);

      $scope.$on('$destroy', () => {
        onAddDeleteAlternatePart();
        onAddDeletePackagingAliasPart();
        onAddDeleteSupplier();
        onAddDeleteDriveToolsPart();
        onAddDeleteProcessMaterial();
        onAddDeleteFunTestEquipment();
        removeSocketListener();
        if (vm.timeoutWatch) {
          $timeout.cancel(vm.timeoutWatch);
        }
        stateChangeSuccessCall();
        onCheckComponent();
        onSaveComponent();
        onContinueProcess();
        onComponentInit();
        onSetComponentChanges();
      });

      /*use this method to trust untrusted html source from url*/
      vm.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
      };
      //watcher call whenever we click on edit  or view button
      $scope.$watch('isEditComponent', (newVal) => {
        if (newVal) {
          if (vm.component && vm.component.replacementPartID) {
            getComponentBySearchObj({ id: vm.component.replacementPartID, mfgType: vm.selectedMfgType });
          }
          if (vm.component && vm.component.mfgcodeID) {
            getMfgSearch({ mfgcodeID: vm.component.mfgcodeID });
          }
        }
      });

      if (vm.mfgTypedata) {
        vm.IsSupplier = vm.mfgTypedata === vm.MFG_TYPE.DIST;
        vm.IsManufacturer = vm.mfgTypedata === vm.MFG_TYPE.MFG;
      }
      function setTabWisePageRights(pageList) {
        if (pageList && pageList.length > 0) {
          let tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_STANDARDS_STATE);
          if (tab && tab.length > 0 && tab[0].isActive) {
            vm.standardTabRights = true;
          }
          tab = pageList.find((a) => a.PageDetails && vm.IsManufacturer && a.PageDetails.pageRoute === USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE);
          if (tab) {
            vm.isReadOnly = tab.RO ? true : false;
          }
          tab = pageList.find((a) => a.PageDetails && vm.IsSupplier && a.PageDetails.pageRoute === USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE);
          if (tab) {
            vm.isReadOnly = tab.RO ? true : false;
          }
        }
      }

      $timeout(() => {
        $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
          var menudata = data;
          setTabWisePageRights(menudata);
          $scope.$applyAsync();
        });
      });

      if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
        setTabWisePageRights(BaseService.loginUserPageList);
      }

      //get list for part status
      const getGenericCategoryList = () => RFQSettingFactory.getPartStatusList().query().$promise.then((partstatus) => {
        if (partstatus && partstatus.data) {
          if (vm.cid) {
            vm.partStatusList = partstatus.data;
          }
          else {
            vm.partStatusList = _.filter(partstatus.data, (item) => item.isActive);
          }
        }
        else {
          vm.partStatusList = [];
        }
        return partstatus;
      }).catch((error) => BaseService.getErrorLog(error));

      vm.openPicker = (type, ev) => {
        if (ev.keyCode === 40) {
          vm.IsPickerOpen[type] = true;
        }
      };

      vm.ltbDateChanged = () => {
        vm.LTBDateOptions = {
          ltbDateOpenFlag: false
        };
      };

      vm.eolDateChanged = () => {
        vm.eolDateOptions = {
          eolDateOpenFlag: false
        };
      };
      vm.obsoleteDateChanged = () => {
        vm.obsoleteDateOptions = {
          maxDate: vm.todayDate,
          obsoleteDateOpenFlag: false
        };
      };
      vm.reversalDateChanged = () => {
        vm.reversalDateOptions = {
          maxDate: vm.todayDate,
          reversalDateOpenFlag: false
        };
      };

      vm.eolopenPicker = (type, ev) => {
        if (ev.keyCode === 40) {
          vm.IsEolPickerOpen[type] = true;
        }
      };
      vm.parentstatusdetail = CORE.PartStatusDropdown;

      vm.categoryList = [];

      vm.selectedMfgType = null;
      vm.replacementPartList = [];
      vm.WebSitePattern = CORE.WebSitePattern;

      function init() {
        $timeout(() => {
          angular.element('#btndummy').triggerHandler('click');
        });
      }
      init();

      vm.dummyEvent = ($event) => {
        _dummyEvent = $event;
      };

      vm.clearPartNoAndRev = () => {
        if (!vm.component.isCustom && !vm.component.isCPN && vm.partCategoryID !== vm.PartCategory.SubAssembly) {
          vm.component.custAssyPN = '';
          vm.component.rev = '';
          vm.component.mfgPN = '';
        }
      };

      vm.onCPNPartChecked = () => {
        if (vm.component.isCPN === true) {
          vm.component.isCustom = true;
        }
      };

      vm.setComponentDetailsForHeader = () => {
        if (vm.cid) {
          const componentDetailsTemp = angular.copy(vm.component);
          $scope.$parent.$parent.vm.getComponentDetail(componentDetailsTemp);
        }
      };
      // search and get data for mfgcode
      function getMfgSearch(searchObj) {
        return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
          vm.mfgCodeDetail = [];
          if (mfgcodes && mfgcodes.data) {
            if (searchObj.mfgcodeID) {
              vm.component.selectedMFGCodeTxt = mfgcodes.data[0] ? mfgcodes.data[0].mfgCode : '';
              vm.component.mfgcodeID = mfgcodes.data[0] ? mfgcodes.data[0].id : '';
              selectedMfgCode = mfgcodes.data[0];
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
      function getSupplierMfgCodeSearch(searchObj) {
        return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
          vm.supplierMfgCodeDetail = [];
          if (mfgcodes && mfgcodes.data) {
            if (searchObj.mfgcodeID) {
              //vm.component.selectedMFGCodeTxt = mfgcodes.data[0] ? mfgcodes.data[0].mfgCode : "";
              //vm.component.mfgcodeID = mfgcodes.data[0] ? mfgcodes.data[0].id : "";
              //selectedMfgCode = mfgcodes.data[0];
              $timeout(() => {
                if (vm.autoCompleteSupplierMfgCode && vm.autoCompleteSupplierMfgCode.inputName) {
                  $scope.$broadcast(vm.autoCompleteSupplierMfgCode.inputName, mfgcodes.data[0]);
                }
              });
            }
            vm.supplierMfgCodeDetail = mfgcodes.data;
          }
          return vm.supplierMfgCodeDetail;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      const getUomClassList = () => UnitFactory.getMeasurementTypeList().query().$promise.then((res) => {
        if (res && res.data) {
          if (vm.cid) {
            vm.uomClassList = res.data;
          }
          else {
            vm.uomClassList = _.filter(res.data, (item) => item.isActive);
          }
        }
        else {
          vm.uomClassList = [];
        }
        return vm.uomClassList;
      }).catch((error) => BaseService.getErrorLog(error));

      /* unit dropdown fill up */
      const getUomlist = () => ComponentFactory.getUOMsList().query({
        measurementTypeID: vm.component ? vm.component.uomClassID : null
      }).$promise.then((res) => {
        vm.uomlist = [];
        if (res && res.data) {
          vm.uomlist = res.data;
          if (vm.autoCompleteuom && vm.component.uom && (vm.component.uomClassID || vm.component.uomClassID === 0)) {
            getUOM({
              id: vm.component.uom
            });
          }
        }
        return vm.uomlist;
      }).catch((error) => BaseService.getErrorLog(error));
      /* unit dropdown fill up */
      const getUomListForWeight = () => ComponentFactory.getUOMsList().query({
        measurementTypeID: CORE.MEASUREMENT_TYPES.WEIGHT.ID
      }).$promise.then((res) => {
        vm.uomListForWeight = res && res.data ? res.data : [];
        return vm.uomListForWeight;
      }).catch((error) => BaseService.getErrorLog(error));
      /* mountingType dropdown fill up */
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
          vm.hasLimitedShelfLife = item.hasLimitedShelfLife;

          const selectedMountingType = _.find(vm.mountingTypeList, (m) => m.id === item.id);
          vm.component.selectedMountingTypeTxt = selectedMountingType ? selectedMountingType.name : '';

          if (item.isCountTypeEach) {
            const uomEach = _.find(vm.uomlist, (m) => m.unitName === 'EACH');
            if (uomEach) {
              vm.autoCompleteuom.keyColumnId = uomEach.id;
            }
          }
        }
        else {
          vm.component.mountingTypeID = null;
          vm.component.selectedMountingTypeTxt = '';
          vm.mountingTypeList = _.filter(vm.mountingTypeList, (item) => item.isActive);
          vm.hasLimitedShelfLife = false;
        }
        if (vm.hasLimitedShelfLife) {
          vm.component.isShelfLife = true;
        }
      };
      /*get list of Package Case Type list from DB to bing with autocomplete on UI*/
      const getPackageCaseTypeList = () => ComponentFactory.getPackageCaseTypeList().query().$promise.then((res) => {
        if (res && res.data) {
          if (vm.cid) {
            vm.packageCaseTypeList = res.data;
          }
          else {
            vm.packageCaseTypeList = _.filter(res.data, (item) => item.isActive);
          }
        }
        else {
          vm.packageCaseTypeList = [];
        }
        return vm.packageCaseTypeList;
      }).catch((error) => BaseService.getErrorLog(error));

      const getPackageCaseType = (item) => {
        if (item) {
          vm.component.partPackageID = item.id;
          vm.autoCompletePackageCaseType.keyColumnId = item.id;
        }
        else {
          vm.packageCaseTypeList = _.filter(vm.packageCaseTypeList, (item) => item.isActive);
          vm.component.partPackageID = null;
        }
        vm.component.rfq_packagecasetypemst = item || {};
        vm.setComponentDetailsForHeader();
      };
      $scope.$watch('loaderVisible', (newValue) => {
        if (newValue) {
          vm.timeoutWatch = $timeout(() => {
            /*max time to show infinite loader*/
          }, _configMaxTimeout);
          $scope.$parent.vm.cgBusyLoading = vm.timeoutWatch;
        }
        else {
          if (vm.timeoutWatch) {
            $timeout.cancel(vm.timeoutWatch);
          }
        }
      });
      /* connecterType dropdown fill up */
      const connecterType = () => ComponentFactory.getConnecterTypeList().query().$promise.then((res) => {
        if (res && res.data) {
          if (vm.cid) {
            vm.connecterTypeList = res.data;
          }
          else {
            vm.connecterTypeList = _.filter(res.data, (item) => item.isActive);
          }
        }
        else {
          vm.connecterTypeList = [];
        }
        return res;
      }).catch((error) => BaseService.getErrorLog(error));

      const getconnecterType = (item) => {
        if (item) {
          vm.component.connecterTypeID = item.id;
          vm.autoCompleteConnecterType.keyColumnId = item.id;

          const selectedConnecterType = _.find(vm.connecterTypeList, (m) => m.id === item.id);

          vm.component.selectedConnecterTxt = selectedConnecterType ? selectedConnecterType.name : '';
        }
        else {
          vm.component.connecterTypeID = null;
          vm.component.selectedConnecterTxt = '';
          vm.connecterTypeList = _.filter(vm.connecterTypeList, (item) => item.isActive);
        }
      };

      /* binding values in view mode - generic category*/
      const getGenericCategory = (item) => {
        if (item) {
          vm.component.selectedPartStatus = item ? item.name : '';
          vm.component.partStatus = item.id;
          if (item.id === vm.CorePartStatusList.Active) {
            vm.component.ltbDate = null;
          }
          /*as per discussion with Dixitbhai on 31-12-2020 reversal date will always enabled,
           * as in new part it also user want to enter then they can enter*/
          /*else if (item.id && item.id !== vm.CorePartStatusList.Active) {
            vm.component.reversalDate = null;
          }*/

          if (item.id !== vm.CorePartStatusList.Obsolete) {
            vm.component.obsoleteDate = null;
          } else if (!vm.component.obsoleteDate) {
            vm.component.obsoleteDate = new Date();
          }
        }
        else {
          vm.component.selectedPartStatus = null;
          vm.partStatusList = _.filter(vm.partStatusList, (item) => item.isActive);
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
      /* binding values in view mode - category*/
      const getCategory = (item) => {
        const pidCode = angular.copy(vm.PIDCodeLength);
        vm.PIDCodeLength = null;
        if (item) {
          const selectedCategory = _.find(vm.categoryList, (c) => c.id === item.id);
          vm.component.selectedCategoryTxt = selectedCategory ? selectedCategory.Value : '';
          vm.partCategoryID = selectedCategory ? selectedCategory.partCategory : null;
          vm.component.category = selectedCategory.id;
          if (!vm.cid) {
            vm.component.epicorType = selectedCategory.epicorType;
            vm.autoCompleteEpicorType.keyColumnId = vm.component.epicorType;
            if (selectedCategory.id === vm.PartType.Other) {
              vm.component.isCustom = false;
              vm.component.isCPN = false;
              vm.component.isFluxNotApplicable = true;
              vm.component.isNoClean = false;
              vm.component.isWaterSoluble = false;
              if (!vm.autoFrequency.keyColumnId) {
                vm.autoFrequency.keyColumnId = CORE.OtherPartFrequency[1].id; // Default First Type
              }
              if (!vm.autoFrequencyType.keyColumnId) {
                vm.autoFrequencyType.keyColumnId = CORE.FREQUENCY_TYPE[0].id; // Default First Type
              }
            }
            if (vm.partCategoryID === vm.PartCategory.Component) {
              vm.component.rfqOnly = false;
            }
            vm.clearPartNoAndRev();
          }
        }
        else {
          vm.component.selectedCategoryTxt = null;
          vm.partCategoryID = null;
          vm.component.category = null;
          vm.autoFrequency.keyColumnId = null;
          vm.autoFrequencyType.keyColumnId = null;
        }
        if (vm.partCategoryID === vm.PartCategory.SubAssembly) {
          if (!vm.cid && !vm.IsSupplier) {
            vm.component.isCustom = true;
          }
          vm.component.restrictUSEwithpermission = false;
          vm.component.restrictPackagingUseWithpermission = false;
          vm.component.restrictUsePermanently = false;
          vm.component.restrictPackagingUsePermanently = false;
        }
        else {
          vm.component.nickName = '';
          vm.component.assyCode = '';
          vm.component.isAutoVerificationOfAllAssemblyParts = false;
          $scope.$broadcast(vm.autoCompleteAssemblyType.inputName, null);
          $scope.$broadcast(vm.autoCompleteAssemblyType.inputName + 'searchText', null);
        }
        if (!vm.cid && (vm.component.isCustom && vm.component.isCPN && vm.partCategoryID !== vm.PartCategory.SubAssembly)) {
          vm.component.rev = '';
          vm.component.custAssyPN = '';
          //vm.component.mfgPN = '';
        }
        if (!vm.cid) {
          vm.setRoHSDeviation();
          vm.autoCompleteConnectedPart.keyColumnId = null;
          $timeout(() => {
            $scope.$broadcast(vm.autoCompleteConnectedPart.inputName, null);
          });

          if (pidCode) {
            // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 02/07/2021)
            $timeout(() => {
              vm.PIDCodeLength = pidCode;
            });
          }
        }
        vm.changePIDCode();
        vm.changeAssyCode();
        vm.component.isCloudApiUpdateAttribute = ((vm.component && vm.component.category === vm.PartType.Other) || vm.component.isCustom || vm.component.isCPN) ? false : vm.component.isCloudApiUpdateAttribute;
      };

      const getEpicoreType = (item) => {
        if (item) {
          vm.component.epicorType = item.epicorType;
        }
      };

      const getChartOfAccountBySearch = (searchObj, type) => ChartOfAccountsFactory.getChartOfAccountBySearch().query(searchObj).$promise.then((chartofAccount) => {
        if (chartofAccount) {
          _.each(chartofAccount.data, (item) => item.chartOfAccountsDisplayName = item.acct_code ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.acct_code, item.acct_name) : item.acct_name);
          if (searchObj && searchObj.acct_id) {
            if (type === vm.COA_TYPE.PURCHASE && vm.autoCompletePurchaseCOA) {
              $scope.$broadcast(vm.autoCompletePurchaseCOA.inputName, chartofAccount.data[0]);
            }
            if (type === vm.COA_TYPE.SALES && vm.autoCompleteSalesCOA) {
              $scope.$broadcast(vm.autoCompleteSalesCOA.inputName, chartofAccount.data[0]);
            }
          }
          return chartofAccount.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      const getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
        if (packaging && packaging.data) {
          if (vm.cid) {
            vm.packagingList = packaging.data;
          }
          else {
            vm.packagingList = _.filter(packaging.data, (item) => item.isActive);
          }
        }
        else {
          vm.packagingList = [];
        }
        return vm.packagingList;
      }).catch((error) => BaseService.getErrorLog(error));

      const getUOMClass = (item) => {
        if (item) {
          vm.component.uomClassID = item ? item.id : null;
          getUomlist();
        }
        else {
          vm.uomClassList = _.filter(vm.uomClassList, (item) => item.isActive);
          vm.component.uomClassID = null;
          vm.uomlist = [];
          vm.component.uom = null;
          vm.autoCompleteuom.keyColumnId = null;
        }
      };

      /* binding values in view mode - UOM*/
      const getUOM = (item) => {
        if (item) {
          const selectedUOM = _.find(vm.uomlist, (u) => u.id === item.id);
          vm.component.selectedUOMTxt = selectedUOM ? selectedUOM.unitName : '';
          vm.component.uom = selectedUOM ? selectedUOM.id : null;
          vm.autoCompleteuom.keyColumnId = item.id;
        }
        else {
          vm.component.selectedUOMTxt = '';
        }
      };

      const getGrossWeightUOM = (item) => {
        if (item) {
          const selectedUOM = _.find(vm.uomListForWeight, (u) => u.id === item.id);
          vm.component.grossWeightUom = selectedUOM ? selectedUOM.id : null;
        }
        else {
          vm.component.grossWeightUom = null;
        }
      };
      const getPackagingUOM = (item) => {
        if (item) {
          const selectedUOM = _.find(vm.uomListForWeight, (u) => u.id === item.id);
          vm.component.packagingWeightUom = selectedUOM ? selectedUOM.id : null;
        }
        else {
          vm.component.packagingWeightUom = null;
        }
      };

      /* Part Type dropdown fill up */
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

          const selectedPartType = _.find(vm.partTypeList, (p) => p.id === item.id);
          vm.component.selectedPartTypeTxt = selectedPartType ? selectedPartType.partTypeName : '';
          vm.component.functionalCategoryID = item.id;
          if (vm.cid) {
            vm.component.rfqPartType.isTemperatureSensitive = item.isTemperatureSensitive;
          }
        }
        else {
          vm.component.selectedPartTypeTxt = null;
          vm.component.functionalCategoryID = null;
          vm.partTypeList = _.filter(vm.partTypeList, (item) => item.isActive);
          if (vm.cid) {
            vm.component.rfqPartType.isTemperatureSensitive = false;
          }
        }
        vm.setComponentDetailsForHeader();
      };
      //on select function for replacement part
      const getreplacementpart = (item) => {
        if (item) {
          vm.autoCompleteReplacementPartList.keyColumnId = item.id;
          vm.component.replacementPartID = item.id;
          vm.component.selectedReplacementPartTxt = item.mfgPN;
        }
        else {
          vm.autoCompleteReplacementPartList.keyColumnId = null;
          vm.component.selectedReplacementPartTxt = null;
          vm.component.replacementPartID = null;
        }
      };

      // Restricted Files Extension
      function retriveConfigureFileTypeList() {
        return SettingsFactory.retriveConfigureFileType().query().$promise.then((response) => {
          vm.FileTypeList = [];
          if (response && response.data && response.data.length > 0) {
            vm.FileTypeList = _.map(response.data, (item) => item ? '!' + item.fileExtension : item).join(',');
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      };

      // get component where used in Assembly detail
      vm.getWhereUseComponent = () => {
        vm.whereUseList = [];
        vm.hlWhereUsedAssy = true;
        if (vm.cid) {
          vm.hlWhereUsedAssy = false;
          return ComponentFactory.getWhereUseComponent().query({ partID: vm.cid }).$promise.then((response) => {
            vm.hlWhereUsedAssy = true;
            if (response && response.data) {
              vm.whereUseList = response.data.whereUsedComponents;
              _.each(vm.whereUseList, (item) => {
                item.displayWhereUsedName = item.mfgPN;
                if (item.qpa) {
                  item.displayWhereUsedName = `${item.displayWhereUsedName} : [${item.qpa}`;
                  if (item.refDesig) {
                    const refDes = item.refDesig.split(',');
                    item.displayWhereUsedName = refDes.length > 3 ?
                      `${item.displayWhereUsedName} : ${refDes[0]}, ${refDes[1]},..., ${refDes[refDes.length - 1]}]` :
                      item.displayWhereUsedName = `${item.displayWhereUsedName} : ${item.refDesig}]`;
                  } else {
                    item.displayWhereUsedName = `${item.displayWhereUsedName}]`;
                  }
                }
                if (item.dnpQty) {
                  item.displayWhereUsedName = `${item.displayWhereUsedName} [DNP: ${item.dnpQty}`;
                  if (item.dnpDesig) {
                    const dnpDesig = item.dnpDesig.split(',');
                    item.displayWhereUsedName = dnpDesig.length > 3 ? `${item.displayWhereUsedName} : ${dnpDesig[0]}, ${dnpDesig[1]},..., ${dnpDesig[dnpDesig.length - 1]}]` :
                      item.displayWhereUsedName = `${item.displayWhereUsedName} : ${item.dnpDesig}]`;
                  } else {
                    item.displayWhereUsedName = `${item.displayWhereUsedName}]`;
                  }
                }
              });

              vm.whereUseList = _.groupBy(vm.whereUseList, 'whereUsed');
            }
          });
        }
      };

      // get component where used Other details
      vm.getWhereUseComponentOther = () => {
        vm.whereUseListOther = [];
        vm.hlWhereUsedOther = true;
        if (vm.cid) {
          vm.hlWhereUsedOther = false;
          return ComponentFactory.getWhereUseComponentOther().query({ partID: vm.cid }).$promise.then((response) => {
            vm.hlWhereUsedOther = true;
            if (response && response.data) {
              vm.whereUseListOther = response.data.whereUsedComponentsOther;
              _.each(vm.whereUseListOther, (item) => {
                item.displayWhereUsedName = item.PIDCode;
                item.displayValue = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgPN);
                if (item.qpa) {
                  item.displayWhereUsedName = `${item.displayWhereUsedName} : ${item.qpa}`;
                }
                if (item.refDesig) {
                  const refDes = item.refDesig.split(',');
                  if (refDes.length > 3) {
                    item.displayWhereUsedName = `${item.displayWhereUsedName} : ${refDes[0]}, ${refDes[1]},..., ${refDes[refDes.length - 1]}`;
                  }
                  else {
                    item.displayWhereUsedName = `${item.displayWhereUsedName} : ${item.refDesig}`;
                  }
                }
              });

              vm.whereUseListOther = _.groupBy(vm.whereUseListOther, 'whereUsed');
            }
          });
        }
      };

      vm.getComponentAssyProgramList = () => {
        vm.hlProgram = true;
        vm.componentProgrammingList = [];
        if (vm.cid) {
          vm.hlProgram = false;
          return ComponentFactory.getComponentAssyProgramList().query({ partID: vm.cid }).$promise.then((components) => {
            vm.hlProgram = true;
            vm.componentProgrammingList = (components && components.data && components.data.programmingList) ? components.data.programmingList : [];
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      const getCostCateogry = (item) => {
        if (item) {
          vm.autoCompleteCostCategory.keyColumnId = item.id;
        }
        else {
          vm.autoCompleteCostCategory.keyColumnId = null;
        }
      };

      const getDateCodeFormat = (item) => {
        if (item) {
          vm.autoCompleteDateCodeFormat.keyColumnId = item.id;
        }
        else {
          vm.autoCompleteDateCodeFormat.keyColumnId = null;
        }
      };

      const getSelectedPackaging = (item) => {
        if (item) {
          vm.component.packaging = item.name;
          vm.component.packagingID = item.id;
        }
        else {
          vm.packagingList = _.filter(vm.packagingList, (item) => item.isActive);
          vm.component.packaging = null;
          vm.component.packagingID = null;
        }
        vm.component.component_packagingmst = item || {};
        vm.setComponentDetailsForHeader();
      };

      function displayCurrentImage() {
        vm.canDeleteImage = false;
        vm.canSetDefaultImage = false;
        vm.currentImageURL = '';
        if (vm.component && vm.component.component_images && vm.component.component_images.length > 0) {
          const img = _.find(vm.component.component_images, (o) => o.id === vm.selectedImageId);
          if (img && !img.isDeleted) {
            vm.canDeleteImage = img.canDeleteImage;
            vm.canSetDefaultImage = img.canSetDefaultImage;
            //encodeURI code added to encode image URLs contain "pdf" work in it by CC on date 25-06-2019 for BUG# 5982
            //now removing code to encodeURI() because images are coming broken after encode by AP on code 15-06-2020 for BUG# 20998
            /*if (_.includes(img.imageURL, "pdf")) {
              vm.currentImageURL = encodeURI(img.imageURL);
            }
            else {
              vm.currentImageURL = img.imageURL;
            }*/
            vm.currentImageURL = img.imageURL;
          }
          else if (vm.component.component_images.length > 0) {
            const img = _.find(vm.component.component_images, (o) => o.isDeleted === false);
            if (img) {
              vm.canDeleteImage = img.canDeleteImage;
              vm.canSetDefaultImage = img.canSetDefaultImage;
              //encodeURI code added to encode image URLs contain "pdf" work in it by CC on date 25-06-2019 for BUG# 5982
              //now removing code to encodeURI() because images are coming broken after encode by AP on code 15-06-2020 for BUG# 20998
              /*if (_.includes(img.imageURL, "pdf")) {
                vm.currentImageURL = encodeURI(img.imageURL);
              }
              else {
                vm.currentImageURL = img.imageURL;
              }*/
              vm.currentImageURL = img.imageURL;
            }
            else {
              vm.currentImageURL = CORE.NO_IMAGE_COMPONENT;
            }
          }
          else {
            vm.currentImageURL = CORE.NO_IMAGE_COMPONENT;
          }
        }
        else {
          vm.currentImageURL = CORE.NO_IMAGE_COMPONENT;
        }
      };

      vm.previewPopoverImage = (imageUrl) => BaseService.previewPopoverImage(imageUrl);

      //get image url
      vm.getImageURL = (url) => {
        vm.is360Image = false;
        //encodeURI code added to encode image URLs contain "pdf" work in it by CC on date 25-06-2019 for BUG# 5982
        //now removing code to encodeURI() because images are coming broken after encode by AP on code 15-06-2020 for BUG# 20998
        /*if (_.includes(url, "pdf") && canEncodeUri)
          return encodeURI(url);
        else*/
        if (url && url.endsWith('.html')) {
          vm.is360Image = true;
          url = CORE.COMPONENT_IMAGE_360;
        }
        return url;
      };
      /* retrieve component detail by id */
      vm.componentDetails = (cid) => {
        if (cid) {
          return ComponentFactory.component().query({
            id: cid
          }).$promise.then((component) => {
            if (component && component.data) {
              const mfgType = component.data.mfgType;
              vm.component.mfgType = mfgType.toUpperCase();
              if (mfgType.toUpperCase() !== vm.mfgTypedata) {
                const inValidMFGTypeName = (mfgType === vm.MFG_TYPE.MFG) ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier;
                const mfgTypeName = (mfgType === vm.MFG_TYPE.MFG) ? vm.LabelConstant.MFG.MFG : vm.LabelConstant.MFG.Supplier;
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.INVALID_SEARCH_PART);
                messageContent.message = stringFormat(messageContent.message, mfgTypeName, component.data.mfgPN, inValidMFGTypeName, mfgTypeName);

                const model = {
                  messageContent: messageContent,
                  multiple: true
                };
                const routeState = (mfgType.toUpperCase() === MFG_TYPE.DIST) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
                return DialogFactory.messageAlertDialog(model).then(() => {
                  $state.transitionTo(routeState, { coid: cid }, { reload: true, location: true, inherit: true, notify: true });
                }).catch((error) => BaseService.getErrorLog(error));
              }

              component.data.minimum = component.data.minimum ? parseInt(component.data.minimum) : null;
              component.data.mult = component.data.mult ? parseInt(component.data.mult) : null;
              if (component.data.component_images && component.data.component_images.length > 0) {
                const defaultImage = _.filter(component.data.component_images, (item) => item.imageURL === component.data.imageURL);

                if (defaultImage && defaultImage.length > 0) {
                  vm.selectedImageId = defaultImage[0].id;
                  vm.canDeleteImage = defaultImage[0].canDeleteImage;
                  vm.canSetDefaultImage = defaultImage[0].canSetDefaultImage;
                }
                else {
                  vm.selectedImageId = component.data.component_images[0].id;
                  vm.canDeleteImage = component.data.component_images[0].canDeleteImage;
                  vm.canSetDefaultImage = component.data.component_images[0].canSetDefaultImage;
                }
              }
              if (component.data.component_images) {
                _.each(component.data.component_images, (item) => {
                  item.orgImageURL = item.imageURL;
                  item.canSetDefaultImage = true;
                  if (item.imageURL && !item.imageURL.startsWith('//') && !item.imageURL.startsWith('http://') && !item.imageURL.startsWith('https://')) {
                    item.imageURL = BaseService.getPartMasterImageURL(component.data.documentPath, item.imageURL);
                    item.canDeleteImage = true;
                  }
                });
              }
              if (component.data.component_datasheets) {
                _.each(component.data.component_datasheets, (item) => {
                  item.isDeleted = false;
                  item.canDeleteDataSheetUrl = true;
                  item.canSetDefaultDataSheetUrl = true;
                  const array = item.datasheetURL.split('/');
                  if (array) {
                    const filename = array[array.length - 1];
                    item.displayName = filename.split('.')[0];
                  }
                  else {
                    item.displayName = '';
                  }
                });
                const obj = _.find(component.data.component_datasheets, (o) => o.isDeleted === false && o.datasheetURL === component.data.dataSheetLink);
                if (obj) {
                  vm.defaultDataSheetUrlID = obj.id;
                }
              }
              if (component.data.category === vm.PartCategory.SubAssembly) {
                component.data.PIDCodePrefix = '';
                component.data.PIDCodeSufix = component.data.PIDCode;
              }
              else {
                const index = component.data.PIDCode.indexOf('+');
                component.data.PIDCodePrefix = component.data.PIDCode.substr(0, index + 1);
                component.data.PIDCodeSufix = component.data.PIDCode.substr(index + 1);
              }
              if (component.data.documentPath) {
                vm.dataSheetLinkPath = CORE.WEB_URL + USER.COMPONENT_DATASHEET_BASE_PATH + component.data.documentPath + '/' + USER.COMPONENT_DATASHEET_FOLDER_NAME;
              }
              component.data.ltbDate = BaseService.getUIFormatedDate(component.data.ltbDate, vm.DefaultDateFormat);
              component.data.eolDate = BaseService.getUIFormatedDate(component.data.eolDate, vm.DefaultDateFormat);
              component.data.obsoleteDate = BaseService.getUIFormatedDate(component.data.obsoleteDate, vm.DefaultDateFormat);
              component.data.reversalDate = BaseService.getUIFormatedDate(component.data.reversalDate, vm.DefaultDateFormat);
              component.data.updatedAtApi = BaseService.getUIFormatedDateTimeInCompanyTimeZone(component.data.componentLastExternalAPICall.length && component.data.componentLastExternalAPICall[0].updatedAtApi, _dateTimeDisplayFormat);
              component.data.supplier = component.data.componentLastExternalAPICall.length && component.data.componentLastExternalAPICall[0].supplierMaster.mfgCode;

              vm.componentCopy = angular.copy(component.data);
              vm.component = angular.copy(component.data);
              vm.chartData = {
                supplier: vm.component.supplier,
                packagingID: vm.component.packagingID
              };
              selectedGoodPart = component.data.isGoodPart;
              displayCurrentImage();

              vm.component.isGoodPart = vm.component.isGoodPart ? vm.component.isGoodPart : vm.PartCorrectList.IncorrectPart;

              vm.IsManufacturer = (vm.component.mfgType === vm.MFG_TYPE.MFG);
              vm.IsSupplier = (vm.component.mfgType === vm.MFG_TYPE.DIST);

              //vm.component.rohsComplient = vm.component.rohsComplient ? true : false;
              vm.component.isShelfLife = vm.component.selfLifeDays ? true : false;
              //fetch selected standard
              vm.selectedStandard = [];
              _.each(component.data.componetStandardDetail, (stdclass) => {
                stdclass.colorCode = CORE.DefaultStandardTagColor;
                stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
                stdclass.colorCode = stdclass.Standardclass ? (stdclass.Standardclass.colorCode ? stdclass.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
                stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
                stdclass.priority = stdclass.certificateStandard ? stdclass.certificateStandard.priority : null;
                vm.selectedStandard.push(stdclass);
              });
              vm.selectedStandard.sort(sortAlphabatically('priority', 'standard', true));

              if (vm.isComponent) {
                $scope.$parent.$parent.vm.componentPN(vm.component.mfgPN);
                $q.all([getComponentMaxTemperatureData(cid)]).then(() => {
                  $scope.$parent.$parent.vm.getComponentDetail(vm.component);
                }).catch((error) => BaseService.getErrorLog(error));
              }

              $timeout(() => {
                if (component.data.mfgPN) {
                  vm.component.mfgPN = component.data.mfgPN;
                }
                if (component.data.nickName) {
                  vm.component.nickName = component.data.nickName;
                }
                if (component.data.rohsDeviation) {
                  vm.component.rohsDeviation = component.data.rohsDeviation;
                }
              }, 3000);
              if (component.data.mfgcodeID) {
                getAcquisitionDetails(component.data.mfgcodeID);
              }
              vm.getFunctionalTypePartList(cid);
              vm.getMountingTypePartList(cid);
              vm.getOddelyRefDesList(cid);

              vm.getComponentGoodBadPartGroup();
              // to get last created production work order by assembly nick name
              getLastWONumberByAssyNickname();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      function getAutoCompleteValueFromData() {
        if (vm.component) {
          if (vm.autoCompleteSupplierMfgCode && vm.component.refSupplierMfgComponent && (vm.component.refSupplierMfgComponent.mfgcodeID || vm.component.refSupplierMfgComponent.mfgcodeID === 0)) {
            getSupplierMfgCodeSearch({
              mfgcodeID: vm.component.refSupplierMfgComponent.mfgcodeID,
              mfgType: CORE.MFG_TYPE.MFG
            });
          }

          if (vm.autoCompletemfgCode && vm.component.mfgcodeID) {
            getMfgSearch({
              mfgcodeID: vm.component.mfgcodeID, mfgType: vm.selectedMfgType
            });
          }

          if (vm.autoCompleteConnectedPart && vm.component.replacementPartID) {
            getAliasSearch({
              id: vm.component.replacementPartID,
              mfgType: vm.mfgTypedata,
              isGoodPart: vm.PartCorrectList.CorrectPart, //As Per discuss with AP //!vm.component.isGoodPart,
              inputName: vm.autoCompleteConnectedPart.inputName
            });
          }

          if (vm.autoCompleteSupplierMfgPN && vm.component.refSupplierMfgpnComponentID) {
            getAliasSearch({
              id: vm.component.refSupplierMfgpnComponentID,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompleteSupplierMfgPN.inputName
            });
          }
        }
      }

      vm.getFunctionalTypePartList = (cid) => {
        if (cid) {
          return ComponentFactory.getFunctionalTypePartList().query({
            id: cid
          }).$promise.then((TypePart) => {
            if (TypePart && TypePart.data) {
              vm.selectedFunctionalTypeParts = [];
              _.each(TypePart.data, (item) => {
                var newItem = {};
                newItem.id = item.partTypeID;
                newItem.name = item.rfq_parttypemst.partTypeName;
                vm.selectedFunctionalTypeParts.push(newItem);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.getMountingTypePartList = (cid) => {
        if (cid) {
          return ComponentFactory.getMountingTypePartList().query({
            id: cid
          }).$promise.then((TypePart) => {
            if (TypePart && TypePart.data) {
              vm.selectedMountingTypeParts = [];
              _.each(TypePart.data, (item) => {
                var newItem = {};
                newItem.id = item.partTypeID;
                newItem.name = item.rfq_mountingtypemst ? item.rfq_mountingtypemst.name : null;
                vm.selectedMountingTypeParts.push(newItem);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

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
      }

      function setRoHSDetails() {
        if (vm.component) {
          const rohsDetails = _.find(vm.RohsList, {
            id: vm.component.RoHSStatusID
          });
          if (rohsDetails) {
            vm.component.rohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + rohsDetails.rohsIcon;
            vm.component.rohsName = rohsDetails.name;
          }
          if (rohsDetails && rohsDetails.id !== USER.NONRoHSStatusID) {
            vm.component.isRohs = true;
          }
          else {
            vm.component.isRohs = false;
          }
        }
      };

      // get Component MSL List
      function getComponentMSLList() {
        return MasterFactory.getComponentMSLList().query().$promise.then((mslList) => {
          vm.componentMSLList = mslList && mslList.data ? mslList.data : [];
        }).catch((error) => BaseService.getErrorLog(error));
      }

      function costCategory() {
        return RFQSettingFactory.getCostCateogryList().query({}).$promise.then((costCategory) => {
          if (costCategory && costCategory.data) {
            vm.costCategoryList = costCategory.data;
            vm.costCategoryList = _.orderBy(vm.costCategoryList, ['categoryName'], ['asc']);
            return vm.costCategoryList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      function getDateCodeFormatList() {
        return DCFormatFactory.retriveDateCodeFormatList().query({}).$promise.then((dcFormatList) => {
          if (dcFormatList && dcFormatList.data) {
            vm.dateCodeFormatList = dcFormatList.data;
            return vm.dateCodeFormatList;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      //componentMFGAlias(), driveTool(), requireMatingPart(),
      const autocompletePromise = [getUomClassList(), getUomlist(), mountingType(), getPackageCaseTypeList(), partType(), getGenericCategoryList(), getPIDCode(), getPartCategoryMstList(), getRoHSList(), connecterType(), getComponentMSLList(), costCategory(), getPackaging(), /*getEpicorTypeList(),*/ getAssyTypeList(), retriveConfigureFileTypeList(), getUomListForWeight(), getDateCodeFormatList()];
      if (!vm.cid) {
        vm.component = {
          partStatus: null,
          //ltbDate: null,
          RoHSStatusID: USER.RoHSStatusID,
          isRohs: true,
          mfgPNDescription: '',
          packageQty: 1,
          umidSPQ: 1,
          maxQty: null,
          minQty: null,
          mfgcodeID: null,
          isGoodPart: vm.PartCorrectList.CorrectPart,
          isCloudApiUpdateAttribute: true,
          businessRisk: null,
          mslID: null,
          umidVerificationRequire: false,
          isAutoVerificationOfAllAssemblyParts: false,
          trackSerialNumber: false,
          restrictPackagingUseWithpermission: false,
          restrictPackagingUsePermanently: false,
          uom: null,
          uomClassID: null,
          isFluxNotApplicable: true,
          isDateCodeFormat: false
        };
        vm.componentCopy = angular.copy(vm.component);
        // initAutoComplete();
        //  vm.component.imageURL = CORE.NO_IMAGE_COMPONENT;
        getComponentBuyDetail(vm.cid);
        displayCurrentImage();
      }
      else {
        autocompletePromise.push(vm.componentDetails(vm.cid));
        getStockStatus(vm.cid);
        getComponentBuyDetail(vm.cid);
        getComponentKitAllocationDetail(vm.cid);
      }
      vm.getWhereUseComponent();
      vm.getWhereUseComponentOther();
      vm.getComponentAssyProgramList();

      // On change of Date Code Format
      vm.changeDateCodeFormat = () => {
        if (vm.component.isDateCodeFormatRequired) {
          autocompletePromise.push(vm.componentDetails(vm.cid));
        }
      };

      function getPIDCode() {
        vm.PIDCodeLength = null;
        return ComponentFactory.getComponentPIDCode().query({
        }).$promise.then((res) => {
          // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 16/02/2021)
          $timeout(() => {
            vm.PIDCodeLength = res.data ? res.data.values : 0;
          });
        }).catch((error) => {
          BaseService.getErrorLog(error);
        });
      }

      // Get part category master list
      function getPartCategoryMstList() {
        return MasterFactory.getPartCategoryMstList().query().$promise.then((response) => {
          if (response && response.data) {
            vm.categoryList = response.data.map((item) => ({
              id: item.id,
              Value: item.categoryName,
              partCategory: item.partCategory,
              epicorType: item.epicorType
            }
            ));

            vm.epicorTypeList = _.map(
              _.groupBy(vm.categoryList, 'epicorType'),
              (grp) => ({
                epicorType: grp[0].epicorType
              }));
            vm.epicorTypeList = _.sortBy(vm.epicorTypeList, 'epicorType');
          }
        }).catch((error) => {
          BaseService.getErrorLog(error);
          return null;
        });
      }

      //Get Assembly List
      function getAssyTypeList() {
        return AssyTypeFactory.getAssyTypeList().query().$promise.then((response) => {
          vm.assyTypeList = [];
          if (response && response.data) {
            if (vm.cid) {
              vm.assyTypeList = response.data;
            }
            else {
              vm.assyTypeList = _.filter(response.data, (item) => item.isActive);
            }
          }

          return $q.resolve(vm.assyTypeList);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      function getAssyType(item) {
        if (!item) {
          vm.assyTypeList = _.filter(vm.assyTypeList, (item) => item.isActive);
        }
      }

      const setAllComponentDetail = () => {
        $scope.$parent.vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
          if (vm.cid && vm.component) {
            const selectedCategory = _.find(vm.categoryList, (c) => c.id === item.id);
            vm.partCategoryID = selectedCategory ? selectedCategory.partCategory : null;
          }
          vm.setRoHSDeviation();
          $timeout(() => {
            $q.all([initAutoComplete(), initAutoCompleteAlias()]).then(() => {
              getAutoCompleteValueFromData();
              setRoHSDetails();
              if (vm.cid && vm.component) {
                vm.getcomponentCustomerAlias();
                if (vm.component.id) {
                  vm.getComponentDriveToolList(vm.component.id);
                  vm.getComponentProcessMaterialList(vm.component.id);
                  vm.getComponentAliasGroups(vm.component.id);
                }

                if (vm.component.packaginggroupID) {
                  vm.getComponentPackagingAliasGroups(vm.cid);
                }
                if (vm.component.id) {
                  vm.getComponentAlternetAliasGroups();
                  vm.getComponentFunctionalTestingEquipmentList();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }, _configTimeout);
        }).catch((error) => BaseService.getErrorLog(error));
      };
      $scope.$parent.vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (vm.cid && vm.component) {
          const selectedCategory = _.find(vm.categoryList, (c) => c.id === vm.component.category);
          vm.partCategoryID = selectedCategory ? selectedCategory.partCategory : null;
        }
        vm.setRoHSDeviation();
        $q.all([initAutoComplete(), initAutoCompleteAlias(), setRoHSDetails()]).then(() => {
          getAutoCompleteValueFromData();
          //customerAliasDropdown();
          if (vm.cid && vm.component) {
            vm.getcomponentCustomerAlias();
            if (vm.component.id) {
              vm.getComponentDriveToolList(vm.component.id);
              vm.getComponentProcessMaterialList(vm.component.id);
              vm.getComponentAliasGroups(vm.component.id);
            }

            if (vm.component.packaginggroupID) {
              vm.getComponentPackagingAliasGroups(vm.cid);
            }
            if (vm.component.id) {
              vm.getComponentAlternetAliasGroups();
              /*getComponentAlternetAliasGroups(CORE.ComponentAlternatePartType.AlternatePart);
              getComponentAlternetAliasGroups(CORE.ComponentAlternatePartType.PickupPadRequired);
              getComponentAlternetAliasGroups(CORE.ComponentAlternatePartType.ProgrammingRequired);
              getComponentAlternetAliasGroups(CORE.ComponentAlternatePartType.FunctionaTestingRequired);
              getComponentAlternetAliasGroups(CORE.ComponentAlternatePartType.MatingPartRequired);*/
              vm.getComponentFunctionalTestingEquipmentList();
            }
            if (vm.component.mfgcodeID && !vm.autoCompletemfgCode.keyColumnId) {
              getMfgSearch({ mfgcodeID: vm.component.mfgcodeID });
            }
            if (vm.component.purchaseacctId) {
              getChartOfAccountBySearch({ acct_id: vm.component.purchaseacctId }, vm.COA_TYPE.PURCHASE);
            }
            if (vm.component.salesacctId) {
              getChartOfAccountBySearch({ acct_id: vm.component.salesacctId }, vm.COA_TYPE.SALES);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }).catch((error) => BaseService.getErrorLog(error));

      vm.changePN = (mfgPN) => {
        $scope.$parent.$parent.vm.componentPN(mfgPN);
        vm.changePIDCode();
      };
      /*let getComponentStatus = (item) => {
          if (item) {
              vm.component.partStatus = item.Value;
          }
          else
              vm.component.partStatus = null;
      }*/

      const getComponentMfg = (item) => {
        selectedMFG = item;
        const pidCode = angular.copy(vm.PIDCodeLength);
        if (!vm.cid) {
          vm.PIDCodeLength = null;
        }
        if (item) {
          vm.autoCompletemfgCode.keyColumnId = item.id;
          if (item.mfgType !== vm.selectedMfgType) {
            vm.selectedMfgType = item.mfgType;
            if (vm.component && vm.component.replacementPartID) {
              getComponentBySearchObj({ id: vm.component.replacementPartID, mfgType: vm.selectedMfgType });
            }

            vm.autoCompleteReplacementPartList.keyColumnId = null;
          }
          vm.component.mfgcodeID = item.id;
          vm.component.mfgType = item.mfgType.toUpperCase();
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
            vm.component.mfgType = null;
            vm.component.selectedMFGCodeTxt = '';
          }
          vm.autoCompletemfgCode.keyColumnId = null;
          vm.replacementPartList = [];
          vm.autoCompleteReplacementPartList.keyColumnId = null;
          //vm.component.PIDCodePrefix = "";
          vm.changePIDCode();
          vm.changeAssyCode();
        }
        if (!vm.cid) {
          // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 16/02/2021)
          $timeout(() => {
            vm.PIDCodeLength = pidCode;
            vm.changePIDCode();
          });
        }
      };

      const getSupplierComponentMfg = (item) => {
        if (item && item.mfgType === CORE.MFG_TYPE.MFG) {
          vm.autoCompleteSupplierMfgCode.keyColumnId = item.id;
          vm.isSupplierMfgPnEnabled = true;
          vm.autoCompleteSupplierMfgPN.addData.parentId = item.id;
        }
        else {
          vm.autoCompleteSupplierMfgCode.keyColumnId = vm.autoCompleteSupplierMfgCode.keyColumnId || null;
          vm.isSupplierMfgPnEnabled = false;
        }
      };

      // start component Required Pickup Pad region
      const getComponentPickupPadDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PICKUP_PAD_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentAlternetAlias = item;
              $scope.ComponentAlternetAlias.type = CORE.ComponentAlternatePartType.PickupPadRequired;
              saveComponentAlternetAlias();
            }
          }, () => {
            // Cancel
          });
        }
      };

      // start component Functional Testing region
      const getComponentFunctionalTestingDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_FUNCTIONAL_TESTING_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentAlternetAlias = item;
              $scope.ComponentAlternetAlias.type = CORE.ComponentAlternatePartType.FunctionaTestingRequired;
              saveComponentAlternetAlias();
            }
          }, () => {
            // Cancel
          });
        }
      };

      // start component alternate alias region
      const getComponentAlternetAliasDetail = (item) => {
        if (item && (vm.autoCompletePartType.keyColumnId || vm.autoCompletePartType.keyColumnId === 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_ALTERNATE_PART_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const validationPromise = [checkAddAlternatePartValidation(item, CORE.ComponentValidationPartType.AlternatePart)];
              $scope.$parent.vm.cgBusyLoading = $q.all(validationPromise).then((responses) => {
                var res = _.find(responses, (response) => response === false);
                if (res !== false) {
                  $scope.ComponentAlternetAlias = item;
                  $scope.ComponentAlternetAlias.type = CORE.ComponentAlternatePartType.AlternatePart;
                  saveComponentAlternetAlias();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // Cancel
          });
        }
      };

      const onAddDeleteAlternatePart = $scope.$on(CORE.EventName.onAddDeleteAlternatePart, (ev, data) => {
        vm.getComponentAlternetAliasGroups(data);
      });

      // start component Drive tools alias region
      const getComponentDriveToolsDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_DRIVE_TOOL_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentDriveToolsAlias = item;
              saveDriveTool();
            }
          }, () => {
            // Cancel
          });
        }
      };

      //start component Require Mating Part
      const getComponentRequireMatingPartlist = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_REQUIRE_MATING_PARTS_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentAlternetAlias = item;
              $scope.ComponentAlternetAlias.type = CORE.ComponentAlternatePartType.MatingPartRequired;
              saveComponentAlternetAlias();
            }
          }, () => {
            // Cancel
          });
        }
      };


      // when item selected from process Material auto complete
      const getComponentProcessMaterialDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PROCESS_MATERIAL_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              $scope.ComponentProcessMaterial = item;
              saveProcessMaterial();
              setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
            }
          }, () => {
            setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
          });
        }
      };

      // start component RoHS alternate alias region
      const setComponentROHSAlternetAliasDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_ROHS_ALTERNATE_PART_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const validationPromise = [checkAddAlternatePartValidation(item, CORE.ComponentValidationPartType.RohsAlternatePart)];
              $scope.$parent.vm.cgBusyLoading = $q.all(validationPromise).then((responses) => {
                var res = _.find(responses, (response) => response === false);
                if (res !== false) {
                  $scope.ComponentAlternetAlias = item;
                  $scope.ComponentAlternetAlias.type = CORE.ComponentAlternatePartType.RoHSReplacementPart;
                  saveComponentAlternetAlias();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // Cancel
          });
        }
      };

      vm.setROHSComplientDataForAutoComplete = (item) => {
        if (item && vm.component.RoHSStatusID !== item.id) {
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
        vm.setComponentDetailsForHeader();
      };

      /* open active wo# list popup */
      const rohsConfirmationPopup = (item) => {
        /* toDo code to show active WO popup on RoHS change
        Check condition 1. is update case, 2. RoHSStatusID is different with current selection, 3. RoHSStatusID is different from stored RoHSStatusID(part)*/
        if (item && item.id && vm.componentCopy.id && item.id !== vm.component.RoHSStatusID && item.id !== vm.componentCopy.RoHSStatusID) {
          // call api to get list of wo# and rfq
          const objs = {
            woID: null,
            partID: vm.component.id,
            rfqFormsID: null
          };
          vm.cgBusyLoading = WorkorderFactory.getAllWORFQContainSamePartID().save({ dataObj: objs }).$promise.then((res) => {
            if (res && res.data &&
              ((res.data.WOListContainSamePartID && res.data.WOListContainSamePartID.length > 0)
                || res.data.RFQListContainSamePartID && res.data.RFQListContainSamePartID.length > 0)) {
              // add object to pass in dialog
              const data = {
                workorderDetails: {
                  woNumber: null,
                  WOListContainSamePartID: res.data.WOListContainSamePartID,
                  isCalledFromWorkOrderPage: false
                },
                componentDetails: {
                  PIDCode: vm.component.PIDCode,
                  mfgPN: vm.component.mfgPN,
                  nickName: vm.component.nickName,
                  id: vm.component.id,
                  isCustom: vm.component.isCustom,
                  rohsIcon: vm.component.rohsIcon,
                  rohsStatus: vm.component.rohsName
                },
                RFQDetails: {
                  RFQListContainSamePartID: res.data.RFQListContainSamePartID,
                  rfqFormsID: null,
                  isCalledFromRFQPage: false
                },
                selectedOldRoHS: _.find(vm.RohsList, (x) => x.id === vm.component.RoHSStatusID),
                selectedNewRoHS: _.find(vm.RohsList, (x) => x.id === item.id)
              };
              DialogFactory.dialogService(
                CORE.WO_COMPONENT_ROHS_CHANGE_ALERT_MODAL_CONTROLLER,
                CORE.WO_COMPONENT_ROHS_CHANGE_ALERT_MODAL_VIEW, {}, data).then((yes) => {
                  if (yes) {
                    // toDo to set new rohs value if yes
                    vm.setROHSComplientDataForAutoComplete(item);
                  }
                }, () => {
                  // toDo to set old rohs value if no
                  vm.autoCompleteRohsStatus.keyColumnId = data.selectedOldRoHS.id;
                }, (err) => BaseService.getErrorLog(err));
            } else {
              vm.component.RoHSStatusID = (item && item.id) ? item.id : null;
            }
          });
        } else if (item && item.id) {
          vm.setROHSComplientDataForAutoComplete(item);
        }
      };

      function setDataOnCorrectPartAndSupplierMfrPN(item) {
        if (item) {
          vm.component.RoHSStatusID = item.RoHSStatusID;
          vm.autoCompleteRohsStatus.keyColumnId = item.RoHSStatusID;
          if (vm.mfgTypedata === vm.distType) {
            vm.autoCompletePart.keyColumnId = item.partStatus;
          }
          vm.component.uomClassID = item.uomClassID;
          vm.autoCompleteUomClass.keyColumnId = item.uomClassID;
          vm.autoCompleteuom.keyColumnId = item.uom;
          vm.component.uom = item.uom;
          vm.autoCompletePartType.keyColumnId = item.functionalCategoryID;
          vm.autoCompleteMountingType.keyColumnId = item.mountingTypeID;

          vm.autoCompletePackageCaseType.keyColumnId = item.partPackageID;
          vm.component.minOperatingTemp = item.minOperatingTemp;
          vm.component.maxOperatingTemp = item.maxOperatingTemp;
          vm.component.temperatureCoefficientValue = item.temperatureCoefficientValue;
          vm.component.temperatureCoefficientUnit = item.temperatureCoefficientUnit;
          vm.autoCompleteConnecterType.keyColumnId = item.connecterTypeID;
          vm.component.connecterTypeID = item.connecterTypeID;
          vm.component.noOfPosition = item.noOfPosition;
          vm.component.noOfRows = item.noOfRows;
          vm.component.pitch = item.pitch;
          vm.component.pitchMating = item.pitchMating;
          vm.component.length = item.length;
          vm.component.width = item.width;
          vm.component.height = item.height;
          vm.component.tolerance = item.tolerance;
          vm.component.voltage = item.voltage;
          vm.component.value = item.value;
          vm.component.powerRating = item.powerRating;
          vm.component.weight = item.weight;
          vm.component.feature = item.feature;
          vm.component.color = item.color;

          vm.component.packageQty = item.packageQty;
          vm.component.umidSPQ = item.umidSPQ;
          vm.component.partPackage = item.partPackage;
          vm.component.restrictPackagingUsePermanently = item.restrictPackagingUsePermanently ? true : false;
          vm.component.restrictPackagingUseWithpermission = item.restrictPackagingUseWithpermission ? true : false;
          vm.component.restrictUsePermanently = item.restrictUsePermanently ? true : false;
          vm.component.restrictUSEwithpermission = item.restrictUSEwithpermission ? true : false;
          vm.component.partPackage = item.partPackage;
          vm.component.isNoClean = item.isNoClean ? true : false;
          vm.component.isWaterSoluble = item.isWaterSoluble ? true : false;
          vm.component.isFluxNotApplicable = item.isFluxNotApplicable ? true : (!item.isNoClean && !item.isWaterSoluble && !item.isFluxNotApplicable ? true : false);
          vm.component.mfgPNDescription = item.mfgPNDescription;
          vm.component.detailDescription = item.detailDescription;
          vm.component.isHazmatMaterial = item.isHazmatMaterial ? true : false;
          vm.component.isReceiveBulkItem = item.isReceiveBulkItem ? true : false;
          vm.component.isEpoxyMount = item.isEpoxyMount ? true : false;
          if (vm.IsSupplier && item.isCustom) {
            vm.component.isCustom = true;
          }
        }
      }

      const getSupplierMfgPNDetails = (item) => {
        if (!vm.cid && item) {
          setDataOnCorrectPartAndSupplierMfrPN(item);
        }
      };

      // start component packaging alias region
      const getComponentPackagingAliasDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_PACKING_ALIAS_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              const validationPromise = [checkAddAlternatePartValidation(item, CORE.ComponentValidationPartType.PackagingAlias)];
              $scope.$parent.vm.cgBusyLoading = $q.all(validationPromise).then((responses) => {
                var res = _.find(responses, (response) => response === false);
                if (res !== false) {
                  $scope.ComponentPackagingAlias = item;
                  saveComponentPackagingAlias();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // Cancel
          });
        }
      };
      const getComponentFunctionalTestingEquipmentDetail = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_FUNCTIONAL_TESTING_EQUIPMENT_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.assetName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              saveComponentFunctionalTestingEquipment(item);
            }
          }, () => {
            // Cancel
          });
        }
      };

      function getComponentBySearchObj(searchObj) {
        return ComponentFactory.getComponentByMfgType().query({ listObj: searchObj }).$promise.then((res) => {
          if (res && res.data.data) {
            if (searchObj.id) {
              vm.component.selectedReplacementPartTxt = res.data.data[0] ? res.data.data[0].mfgPN : '';
              selectedReplacementPart = res.data.data[0];
              $timeout(() => {
                $scope.$broadcast(vm.autoCompleteReplacementPartList.inputName, selectedReplacementPart);
              });
            }
            return res.data.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      //get alias for auto-complete-serach
      function getAliasSearch(searchObj) {
        return ComponentFactory.getComponentMFGAliasPartsSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            //if (vm.autoCompleteGoodBadPart && searchObj.inputName == vm.autoCompleteGoodBadPart.inputName) {
            _.each(componentAlias.data.data, (item) => {
              item.isIcon = true;
            });
            //}
            if (searchObj.id) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      //get Section Wise search alias Part for auto-complete-serach
      function getPartAliasSearch(searchObj) {
        searchObj.currentPartId = vm.cid;
        return ComponentFactory.getComponentMFGAliasPartsSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            _.each(componentAlias.data.data, (item) => {
              item.isIcon = true;
            });
            if (searchObj.id) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }

      //get MFG part for Supplier auto-complete-serach
      /*function getSupplierMFGPNSearch(searchObj) {
        return ComponentFactory.getSupplierMFGPNSearch().query({ listObj: searchObj }).$promise.then((component) => {
          if (searchObj.id) {
            $timeout(() => {
              if (vm.autoCompleteSupplierMfgPN){
                $scope.$broadcast(vm.autoCompleteSupplierMfgPN.inputName, component.data.data[0]);
              }
            });
          }
          else {
            return component.data.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }*/
      function getFunctionalTestingEquipmentSearch(searchObj) {
        searchObj.currentPartId = vm.cid;
        return ComponentFactory.getComponentFunctionalTestingEquipmentSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
          if (componentAlias && componentAlias.data.data) {
            if (searchObj.eqpID) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
          }
          return componentAlias.data.data;
        }).catch((error) => BaseService.getErrorLog(error));
      }
      function getCompleteConnectedPartDetail(item) {
        if (item) {
          /*vm.component.RoHSStatusID = item.RoHSStatusID;
          vm.autoCompleteRohsStatus.keyColumnId = item.RoHSStatusID;
          vm.autoCompletePart.keyColumnId = item.partStatus;
          vm.autoCompletePartType.keyColumnId = item.functionalCategoryID;
          vm.autoCompleteMountingType.keyColumnId = item.mountingTypeID;
          vm.autoCompletePackageCaseType.keyColumnId = item.partPackageID;
          vm.component.uomClassID = item.uomClassID;
          let canCallGetUOM = false;
          if (vm.autoCompleteUomClass.keyColumnId === item.uomClassID) {
            canCallGetUOM = true;
          }
          vm.autoCompleteUomClass.keyColumnId = item.uomClassID;
          //vm.autoCompleteuom.keyColumnId = item.uom;
          vm.component.uom = item.uom;
          if (canCallGetUOM) {
            getUOM({
              id: vm.component.uom
            });
          }*/
          if (vm.component.replacementPartID === null || (vm.component.replacementPartID !== vm.autoCompleteConnectedPart.keyColumnId)) {
            setDataOnCorrectPartAndSupplierMfrPN(item);

            vm.autoCompleteSupplierMfgCode.keyColumnId = item.refMfgPNMfgCodeId;
            vm.autoCompleteSupplierMfgPN.keyColumnId = item.refSupplierMfgpnComponentID;

            if (item.refMfgPNMfgCodeId) {
              getSupplierMfgCodeSearch({
                mfgcodeID: item.refMfgPNMfgCodeId,
                mfgType: CORE.MFG_TYPE.MFG
              });

              if (item.refSupplierMfgpnComponentID) {
                getAliasSearch({
                  id: item.refSupplierMfgpnComponentID,
                  isGoodPart: vm.PartCorrectList.CorrectPart,
                  mfgType: CORE.MFG_TYPE.MFG,
                  inputName: vm.autoCompleteSupplierMfgPN.inputName
                });
              }
            }
          }
          vm.correctedPartDetail = {
            partID: item ? item.id : null,
            PIDCode: item ? item.PIDCode : null,
            mfgType: item ? item.mfgType : null,
            isCustom: item ? item.isCustom : null,
            mfgPN: item ? item.mfgPN : null,
            rohsIcon: item ? stringFormat('{0}{1}{2}', _configWebUrl, USER.ROHS_BASE_PATH, item.rohsIcon) : null,
            rohsName: item ? item.rohsName : null,
            isGoodPart: item ? item.isGoodPart : false,
            orgMfgPN: item ? item.orgMfgPN : null,
            displayOtherCopyValue: true,
            copyAfterLabelOtherValueArray: [
              {
                displayOrder: 1,
                value: item ? item.orgMfgPN : null,
                label: (item ? (item.mfgType ? item.mfgType.toUpperCase() : item.mfgType) : vm.mfgTypeMfg) === vm.mfgTypeDist ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN
              }]
          };
          if (item.partType !== vm.autoCompleteCategory.keyColumnId) {
            vm.autoCompleteConnectedPart.keyColumnId = null;
            $timeout(() => {
              $scope.$broadcast(vm.autoCompleteConnectedPart.inputName, null);
            });
          }
        } else {
          vm.correctedPartDetail = {
            partID: null,
            PIDCode: null,
            isCustom: null,
            rohsIcon: null,
            rohsName: null
          };
          vm.component.replacementPartID = null;
        }
      }


      const initAutoComplete = () => {
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
        vm.autoCompleteSupplierMfgCode = {
          columnName: 'mfgCodeName',
          controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.component.refSupplierMfgComponent ? vm.component.refSupplierMfgComponent.mfgcodeID : null,
          inputName: 'refSupplierMfgCode',
          placeholderName: 'Search ' + vm.LabelConstant.MFG.MFG + ' code and add',
          isRequired: (vm.mfgTypedata === vm.distType),
          isUppercaseSearchText: true,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            popupAccessRoutingState: [USER.ADMIN_MANAGESUPPLIER_DETAIL_STATE],
            pageNameAccessLabel: CORE.PageName.supplier
          },
          isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
          callbackFn: function (obj) {
            const searchObj = {
              mfgcodeID: obj.id
            };
            return getSupplierMfgCodeSearch(searchObj);
          },
          onSelectCallbackFn: getSupplierComponentMfg,
          onSearchFn: function (query) {
            const searchObj = {
              searchQuery: query,
              inputName: vm.autoCompleteSupplierMfgCode.inputName,
              type: CORE.MFG_TYPE.MFG
            };
            return getSupplierMfgCodeSearch(searchObj);
          }
        };
        //find active part status id from list
        let defaultPartStatus = null;
        if (vm.component && !vm.component.partStatus) {
          defaultPartStatus = _.find(vm.partStatusList, (partItem) => partItem.name === CORE.ActiveText);
        }
        else {
          defaultPartStatus = _.find(vm.partStatusList, (partItem) => partItem.id === vm.component.partStatus);
        }
        vm.autoCompletePart = {
          columnName: 'name',
          controllerName: USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: defaultPartStatus ? defaultPartStatus.id : null,
          inputName: CategoryTypeObjList.PartStatus.Name,
          placeholderName: CategoryTypeObjList.PartStatus.Title,
          addData: { headerTitle: CategoryTypeObjList.PartStatus.Title },
          isRequired: true,
          isAddnew: true,
          callbackFn: getGenericCategoryList,
          onSelectCallbackFn: getGenericCategory
        };
        vm.autoCompleteRohsStatus = {
          columnName: 'name',
          controllerName: CORE.MANAGE_ROHS_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_ROHS_MODAL_VIEW,
          keyColumnName: 'id',
          keyColumnId: vm.cid ? vm.component.RoHSStatusID : vm.userRoHSStatusID,
          inputName: 'rohsComplient',
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
        vm.autoCompleteCategory = {
          columnName: 'Value',
          keyColumnName: 'id',
          keyColumnId: vm.component ? (vm.component.partType ? vm.component.partType : vm.PartCategory.Component) : vm.PartCategory.Component,
          inputName: 'Type',// 'Category',
          placeholderName: 'Part Type',//'Category',
          isRequired: true,
          isAddnew: false,
          callbackFn: getPartCategoryMstList,
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
          callbackFn: getPartCategoryMstList,
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

        vm.autoPackaging = {
          columnName: 'name',
          keyColumnName: 'id',
          keyColumnId: vm.component && vm.component.packagingID ? vm.component.packagingID : null,
          controllerName: CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
          addData: {
            popupAccessRoutingState: [USER.ADMIN_PACKAGING_TYPE_STATE],
            pageNameAccessLabel: CORE.PageName.packaging_type
          },
          inputName: 'Packaging',
          placeholderName: 'Packaging',
          isRequired: false,
          isAddnew: true,
          callbackFn: getPackaging,
          onSelectCallbackFn: getSelectedPackaging
        };
        vm.autoFrequency = {
          columnName: 'name',
          keyColumnName: 'id',
          keyColumnId: vm.component && vm.component.frequency ? vm.component.frequency : null,
          inputName: 'Frequency',
          placeholderName: 'Charge Frequency',
          isRequired: false,
          isAddnew: false
        };
        vm.autoFrequencyType = {
          columnName: 'type',
          keyColumnName: 'id',
          keyColumnId: vm.component && vm.component.frequencyType ? vm.component.frequencyType : null,
          inputName: 'FrequencyType',
          placeholderName: 'Frequency Type',
          isRequired: false,
          isAddnew: false
        };

        //find mounting type id from list
        let defaultMountingTypeID = null;
        if (vm.component && !vm.component.mountingTypeID
          && vm.partCategoryID === vm.PartCategory.SubAssembly) {
          const defaultMountingType = _.find(vm.mountingTypeList, (mountingTypeItem) => mountingTypeItem.name === CORE.MountingTypeAssembly);
          defaultMountingTypeID = defaultMountingType ? defaultMountingType.id : null;
        }
        else {
          defaultMountingTypeID = vm.component ? vm.component.mountingTypeID : null;
        }
        vm.autoCompleteMountingType = {
          columnName: 'name',
          keyColumnName: 'id',
          controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
          keyColumnId: defaultMountingTypeID,
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
          onSelectCallbackFn: getPackageCaseType
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
          onSelectCallbackFn: getconnecterType
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

        vm.autoCompleteReplacementPartList = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          keyColumnId: vm.component ? vm.component.replacementPartID : null,
          inputName: 'Replacement Part',
          placeholderName: 'Replacement Part',
          isRequired: true,
          isAddnew: false,
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id
            };
            return getComponentBySearchObj(searchObj);
          },
          onSelectCallbackFn: getreplacementpart,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: selectedMFG ? selectedMFG.mfgType : null,
              query: query
            };
            return getComponentBySearchObj(searchObj);
          }
        };

        let defaultUOM = null;
        if (!vm.component.uom && vm.uomlist) {
          defaultUOM = _.find(vm.uomlist, (item) => item.id === CORE.UOM_DEFAULTS.EACH.ID);
          if (defaultUOM) {
            vm.component.uomClassID = defaultUOM ? defaultUOM.measurementTypeID : null;
            vm.component.uom = defaultUOM ? defaultUOM.id : null;
          }
        }
        vm.autoCompleteUomClass = {
          columnName: 'name',
          keyColumnName: 'id',
          keyColumnId: vm.component ? vm.component.uomClassID : null,
          inputName: 'UOMClass',
          placeholderName: 'UOM Class',
          isRequired: true,
          isAddnew: false,
          callbackFn: getUomClassList,
          onSelectCallbackFn: getUOMClass
        };
        vm.autoCompleteuom = {
          columnName: 'unitName',
          keyColumnName: 'id',
          keyColumnId: vm.component ? vm.component.uom : null,
          inputName: 'Unit',
          placeholderName: 'UOM',
          isRequired: true,
          isAddnew: false,
          callbackFn: getUomlist,
          onSelectCallbackFn: getUOM
        };
        vm.autoCompleteGrossWeightUom = {
          columnName: 'unitName',
          keyColumnName: 'id',
          keyColumnId: vm.component ? vm.component.grossWeightUom : null,
          inputName: 'GrossWeightUom',
          placeholderName: 'Gross Weight UOM',
          isRequired: false,
          isAddnew: false,
          callbackFn: getUomListForWeight,
          onSelectCallbackFn: getGrossWeightUOM
        };
        vm.autoCompletePackagingWeightUom = {
          columnName: 'unitName',
          keyColumnName: 'id',
          keyColumnId: vm.component ? vm.component.packagingWeightUom : null,
          inputName: 'PackagingWeightUom',
          placeholderName: 'Packaging Weight UOM',
          isRequired: false,
          isAddnew: false,
          callbackFn: getUomListForWeight,
          onSelectCallbackFn: getPackagingUOM
        };

        vm.autoCompleteCostCategory = {
          columnName: 'categoryName',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COSE_CATEGORY_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COSE_CATEGORY_MODAL_VIEW,
          keyColumnId: vm.component ? vm.component.costCategoryID : null,
          inputName: 'Cost Category',//ID',// 'Category',
          placeholderName: 'Cost Category',//ID',//'Category',
          isRequired: false,
          isAddnew: true,
          callbackFn: costCategory,
          onSelectCallbackFn: getCostCateogry
        };

        vm.autoCompleteDateCodeFormat = {
          columnName: 'dateCodeFormatValue',
          keyColumnName: 'id',
          controllerName: USER.ADMIN_DC_FORMAT_POPUP_CONTROLLER,
          viewTemplateURL: USER.ADMIN_DC_FORMAT_POPUP_VIEW,
          keyColumnId: vm.component ? vm.component.dateCodeFormatID : null,
          inputName: 'dateCodeFormatValue',
          placeholderName: 'Date Code Format',
          isRequired: vm.component.isDateCodeFormat,
          isAddnew: true,
          callbackFn: getDateCodeFormatList,
          onSelectCallbackFn: getDateCodeFormat
        };

        vm.autoCompleteConnectedPart = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: vm.component ? vm.component.replacementPartID : null,
          inputName: 'Recommended Part',
          placeholderName: 'Search text or Add',
          isRequired: vm.component.isGoodPart !== vm.PartCorrectList.CorrectPart ? true : false,
          addData: {
            mfgType: vm.mfgTypedata //CORE.MFG_TYPE.MFG
          },
          //isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              mfgType: vm.mfgTypedata, //CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompleteConnectedPart.inputName,
              isGoodPart: vm.PartCorrectList.CorrectPart,//!vm.component.isGoodPart
              partType: vm.autoCompleteCategory.keyColumnId
            };
            return getAliasSearch(searchObj);
          },
          isAddnew: true,
          onSelectCallbackFn: getCompleteConnectedPartDetail,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: vm.mfgTypedata, //CORE.MFG_TYPE.MFG,
              query: query,
              inputName: vm.autoCompleteConnectedPart.inputName,
              isGoodPart: vm.PartCorrectList.CorrectPart,//!vm.component.isGoodPart
              partType: vm.autoCompleteCategory.keyColumnId
            };
            return getAliasSearch(searchObj);
          }
        };
        vm.autoCompleteSupplierMfgPN = {
          columnName: 'orgMfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: vm.component ? vm.component.refSupplierMfgpnComponentID : null,
          inputName: vm.LabelConstant.MFG.MFGPN,
          placeholderName: vm.LabelConstant.MFG.MFGPN,
          isRequired: (vm.mfgTypedata === vm.distType),
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            parentId: vm.autoCompleteSupplierMfgCode.keyColumnId
          },
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              mfgcodeID: vm.autoCompleteSupplierMfgCode.keyColumnId,
              inputName: vm.autoCompleteSupplierMfgPN.inputName
            };
            return getAliasSearch(searchObj);
          },
          isAddnew: true,
          onSelectCallbackFn: getSupplierMfgPNDetails,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              mfgcodeID: vm.autoCompleteSupplierMfgCode.keyColumnId,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              inputName: vm.autoCompleteSupplierMfgPN.inputName
            };
            return getAliasSearch(searchObj);
          }
        };

        vm.autoCompletePurchaseCOA = {
          columnName: 'chartOfAccountsDisplayName',
          controllerName: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW,
          keyColumnName: 'acct_id',
          keyColumnId: vm.component && vm.component.purchaseacctId ? vm.component.purchaseacctId : null,
          inputName: 'Purchase COA',
          placeholderName: 'Purchase COA',
          isRequired: false,
          isAddnew: true,
          callbackFn: (item) => getChartOfAccountBySearch(item, vm.COA_TYPE.PURCHASE),
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.component.purchaseacctId = item.acct_id;
            }
            else {
              vm.component.purchaseacctId = null;
              $scope.$broadcast(vm.autoCompletePurchaseCOA.inputName, null);
            }
          },
          onSearchFn: (query) => getChartOfAccountBySearch({ searchString: query }, vm.COA_TYPE.PURCHASE)
        };

        vm.autoCompleteSalesCOA = {
          columnName: 'chartOfAccountsDisplayName',
          controllerName: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_CHART_OF_ACCOUNTS_MODAL_VIEW,
          keyColumnName: 'acct_id',
          keyColumnId: vm.component && vm.component.salesacctId ? vm.component.salesacctId : null,
          inputName: 'Sales COA',
          placeholderName: 'Sales COA',
          isRequired: false,
          isAddnew: true,
          callbackFn: (item) => getChartOfAccountBySearch(item, vm.COA_TYPE.SALES),
          onSelectCallbackFn: (item) => {
            if (item) {
              vm.component.salesacctId = item.acct_id;
            }
            else {
              vm.component.salesacctId = null;
              $scope.$broadcast(vm.autoCompleteSalesCOA.inputName, null);
            }
          },
          onSearchFn: (query) => getChartOfAccountBySearch({ searchString: query }, vm.COA_TYPE.SALES)
        };

        vm.getSelectedValues();
      };
      const initAutoCompleteAlias = () => {
        vm.autoCompletePackagingAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          keyColumnId: null,
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          inputName: 'Packaging Alias',
          placeholderName: 'Search text or Add',
          isRequired: false,
          isAddnew: true,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            parentId: vm.autoCompletemfgCode ? vm.autoCompletemfgCode.keyColumnId : null,
            isBadPart: vm.PartCorrectList.CorrectPart,
            functionalCategoryID: vm.autoCompletePartType.keyColumnId,
            mountingTypeID: vm.autoCompleteMountingType.keyColumnId
          },
          callbackFn: function (obj) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.component.RoHSStatusID);
            const searchObj = {
              //mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
              id: obj.id,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompletePackagingAlias.inputName,
              rohsMainCategoryID: selectedRoHS.refMainCategoryID,
              isRohsMainCategoryInvertMatch: true,
              mountingTypeID: vm.autoCompleteMountingType.keyColumnId,
              packagingAliasFilter: true
            };
            if (!vm.component.isCustom) {
              searchObj.mfgcodeID = vm.autoCompletemfgCode.keyColumnId;
            }
            return getPartAliasSearch(searchObj);
          },
          onSelectCallbackFn: getComponentPackagingAliasDetail,
          onSearchFn: function (query) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.component.RoHSStatusID);
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              inputName: vm.autoCompletePackagingAlias.inputName,
              //mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
              rohsMainCategoryID: selectedRoHS.refMainCategoryID,
              isRohsMainCategoryInvertMatch: true,
              mountingTypeID: vm.autoCompleteMountingType.keyColumnId,
              currentPartId: vm.cid,
              packagingAliasFilter: true
            };
            if (!vm.component.isCustom) {
              searchObj.mfgcodeID = vm.autoCompletemfgCode.keyColumnId;
            }
            return getPartAliasSearch(searchObj);
          }

        };
        vm.autoCompleteAlternetAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Alternate Part',
          placeholderName: 'Search text or Add',
          isRequired: false,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            isBadPart: vm.PartCorrectList.CorrectPart,
            functionalCategoryID: vm.autoCompletePartType.keyColumnId
          },
          callbackFn: function (obj) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.component.RoHSStatusID);
            const searchObj = {
              id: obj.id,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              inputName: vm.autoCompleteAlternetAlias.inputName,
              rohsMainCategoryID: selectedRoHS.refMainCategoryID,
              isRohsMainCategoryInvertMatch: true,
              alternatePartFilter: true
            };
            return getPartAliasSearch(searchObj);
          },
          isAddnew: true,
          onSelectCallbackFn: getComponentAlternetAliasDetail,
          onSearchFn: function (query) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.component.RoHSStatusID);
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              inputName: vm.autoCompleteAlternetAlias.inputName,
              rohsMainCategoryID: selectedRoHS.refMainCategoryID,
              isRohsMainCategoryInvertMatch: true,
              alternatePartFilter: true
            };
            return getPartAliasSearch(searchObj);
          }
        };

        vm.autoCompleteRequirePickupPadAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Pickup Pad',
          placeholderName: 'Search text or Add',
          isRequired: false,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            parentId: vm.autoCompletemfgCode ? vm.autoCompletemfgCode.keyColumnId : null,
            isBadPart: vm.PartCorrectList.CorrectPart
          },
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              categoryID: vm.PartCategory.Component,
              inputName: vm.autoCompleteRequirePickupPadAlias.inputName,
              pickupPadPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          },
          isAddnew: true,
          onSelectCallbackFn: getComponentPickupPadDetail,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              categoryID: vm.PartCategory.Component,
              query: query,
              inputName: vm.autoCompleteRequirePickupPadAlias.inputName,
              pickupPadPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          }
        };
        vm.autoCompleteRequireFunctionalTestingAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Functional Testing',
          placeholderName: 'Search text or Add',
          isRequired: false,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            isBadPart: vm.PartCorrectList.CorrectPart,
            mountingTypeName: 'Tools'
          },
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              mfgType: CORE.MFG_TYPE.MFG,
              mountingType: 'Tools',
              inputName: vm.autoCompleteRequireFunctionalTestingAlias.inputName,
              requireFunctionalPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          },
          isAddnew: true,
          onSelectCallbackFn: getComponentFunctionalTestingDetail,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              mountingType: 'Tools',
              inputName: vm.autoCompleteRequireFunctionalTestingAlias.inputName,
              strictCustomPart: false,
              requireFunctionalPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          }
        };
        vm.autoCompleteRequireFunctionalTestingEquipmentsAlias = {
          columnName: 'assetName',
          keyColumnName: 'eqpID',
          controllerName: USER.ADMIN_EQUIPMENT_ADD_MODAL_CONTROLLER,
          viewTemplateURL: USER.ADMIN_EQUIPMENT_ADD_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Equipment',
          placeholderName: 'Search text or Add',
          isRequired: false,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            popupAccessRoutingState: [USER.ADMIN_MANAGEEQUIPMENT_STATE],
            pageNameAccessLabel: CORE.PageName.equipments
          },
          callbackFn: function (obj) {
            if (obj.status === CORE.ApiResponseTypeStatus.SUCCESS && obj.data && obj.data.equipmentData) {
              const searchObj = {
                eqpID: obj.data.equipmentData.eqpID,
                query: obj.data.equipmentData.assetName,
                inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
              };
              return getFunctionalTestingEquipmentSearch(searchObj);
            } else {
              const searchObj = {
                eqpID: obj.eqpID,
                query: obj.assetName,
                inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
              };
              return getFunctionalTestingEquipmentSearch(searchObj);
            }
          },
          isAddnew: true,
          onSelectCallbackFn: getComponentFunctionalTestingEquipmentDetail,
          onSearchFn: function (query) {
            const searchObj = {
              query: query,
              inputName: vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName
            };
            return getFunctionalTestingEquipmentSearch(searchObj);
          }
        };
        vm.autoCompleteROHSAlternetAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'ROHSAlternateAlias',
          placeholderName: 'Search text or Add',
          isRequired: false,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            isBadPart: vm.PartCorrectList.CorrectPart
          },
          callbackFn: function (obj) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.component.RoHSStatusID);
            const searchObj = {
              id: obj.id,
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              inputName: vm.autoCompleteROHSAlternetAlias.inputName,
              rohsMainCategoryID: selectedRoHS.refMainCategoryID,
              isRohsMainCategoryInvertMatch: false,
              roHReplacementPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          },
          isAddnew: true,
          onSelectCallbackFn: setComponentROHSAlternetAliasDetail,
          onSearchFn: function (query) {
            var selectedRoHS = _.find(vm.RohsList, (m) => m.id === vm.component.RoHSStatusID);
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              // RoHSStatusID: vm.userRoHSStatusID,//vm.component.RoHSStatusID, not required to pass this parameter as we have to provide invert RoHS filter and it is managed through main category id
              // User Story 20345: Changes for Alternate Part, RoHS Alternate part and Packaging alias part validations and make default validations entries when user creates new functional type
              query: query,
              inputName: vm.autoCompleteROHSAlternetAlias.inputName,
              rohsMainCategoryID: selectedRoHS.refMainCategoryID,
              isRohsMainCategoryInvertMatch: false,
              roHReplacementPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          }
        };

        vm.autoCompleteDriveToolAlias = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Drive Tool',
          placeholderName: 'Search text or Add',
          isRequired: false,
          isAddnew: true,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            isBadPart: vm.PartCorrectList.CorrectPart,
            mountingTypeName: 'Tools',
            popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
            pageNameAccessLabel: CORE.PageName.part_master
          },
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              categoryID: vm.PartCategory.Component,
              inputName: vm.autoCompleteDriveToolAlias.inputName,
              driveToolsPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          },
          onSelectCallbackFn: getComponentDriveToolsDetail,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              mountingType: 'Tools',
              categoryID: vm.PartCategory.Component,
              inputName: vm.autoCompleteDriveToolAlias.inputName,
              strictCustomPart: false,
              driveToolsPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          }
        };
        vm.autoCompleteRequireMatingPart = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'Require Mating Parts',
          placeholderName: 'Search text or Add',
          isRequired: false,
          isAddnew: true,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            isBadPart: vm.PartCorrectList.CorrectPart,
            popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
            pageNameAccessLabel: CORE.PageName.part_master
          },
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              categoryID: vm.PartCategory.Component,
              inputName: vm.autoCompleteRequireMatingPart.inputName,
              requireMatingPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          },
          onSelectCallbackFn: getComponentRequireMatingPartlist,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              categoryID: vm.PartCategory.Component,
              inputName: vm.autoCompleteRequireMatingPart.inputName,
              requireMatingPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          }
        };
        vm.autoCompleteProcessMaterial = {
          columnName: 'mfgPN',
          keyColumnName: 'id',
          controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
          keyColumnId: null,
          inputName: 'ProcessMaterial',
          placeholderName: 'Search text or Add',
          isRequired: false,
          isAddnew: true,
          addData: {
            mfgType: CORE.MFG_TYPE.MFG,
            isBadPart: vm.PartCorrectList.CorrectPart
          },
          callbackFn: function (obj) {
            const searchObj = {
              id: obj.id,
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              categoryID: vm.PartCategory.Component,
              inputName: vm.autoCompleteProcessMaterial.inputName,
              processMaterialPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          },
          onSelectCallbackFn: getComponentProcessMaterialDetail,
          onSearchFn: function (query) {
            const searchObj = {
              mfgType: CORE.MFG_TYPE.MFG,
              isGoodPart: vm.PartCorrectList.CorrectPart,
              query: query,
              categoryID: vm.PartCategory.Component,
              inputName: vm.autoCompleteProcessMaterial.inputName,
              processMaterialPartFilter: true
            };
            return getPartAliasSearch(searchObj);
          }
        };
      };

      vm.locale = {
        formatDate: function (date) {
          return $filter('date')(date, vm.DefaultDateFormat);
        }
      };

      vm.ParentDetail = {
        componentID: vm.cid,
        customerID: null
      };
      vm.componentAliasList = [];

      vm.resetDateCodeFormatData = () => {
        if (!vm.component.isDateCodeFormat) {
          $timeout(() => {
            if (vm.autoCompleteDateCodeFormat) {
              $scope.$broadcast(vm.autoCompleteDateCodeFormat.inputName, null);
              vm.autoCompleteDateCodeFormat.keyColumnId = null;
            }
          }, 0);
          vm.component.dateCodeFormatID = null;
        }
      };

      function deleteImages(deletedFiles) {
        if (deletedFiles && deletedFiles.length > 0) {
          const componentObj = {
            refComponentID: vm.component.id,
            deletedIDs: deletedFiles
          };
          return ComponentFactory.deleteComponentImages().query({ componentObj: componentObj }).$promise.then(() => CORE.ApiResponseTypeStatus.SUCCESS)
            .catch((error) => BaseService.getErrorLog(error));
        }
      }
      function addNewImages(newlyAddedFiles) {
        if (newlyAddedFiles && newlyAddedFiles.length > 0) {
          const componentObj = {
            refComponentID: vm.component.id,
            files: newlyAddedFiles
          };
          return Upload.upload({
            url: `${CORE.API_URL}component/createComponentImage`,
            method: 'POST',
            data: componentObj
          }).then((res) => {
            if (res.data.data && !res.data.errors) {
              return CORE.ApiResponseTypeStatus.SUCCESS;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      function addNewImageUrls(newlyAddedUrls) {
        if (newlyAddedUrls && newlyAddedUrls.length > 0) {
          const componentObj = {
            refComponentID: vm.component.id,
            files: newlyAddedUrls
          };
          $scope.$parent.vm.cgBusyLoading = ComponentFactory.createComponentImageUrls().query({ componentObj: componentObj }).$promise
            .then(() => CORE.ApiResponseTypeStatus.SUCCESS)
            .catch((error) => BaseService.getErrorLog(error));
        }
      }

      function uploadNewDataSheetFiles(newlyUploadedDataSheetFiles) {
        if (newlyUploadedDataSheetFiles && newlyUploadedDataSheetFiles.length > 0) {
          const componentObj = {
            refComponentID: vm.component.id,
            files: newlyUploadedDataSheetFiles
          };
          return Upload.upload({
            url: `${CORE.API_URL}component/uploadComponentDataSheets`,
            method: 'POST',
            data: componentObj
          }).then((res) => {
            if (res.data.data && !res.data.errors) {
              return CORE.ApiResponseTypeStatus.SUCCESS;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      function checkSettingsValidation() {
        var validationResult = true;
        if (vm.cid && vm.component) {
          const settingsFields =
            ['scrapValuePerBuild',
              'scrapRatePercentagePerBuild',
              'plannedValuePerBuild',
              'plannedOverRunPercentagePerBuild',
              'selfLifeDays',
              'shelfLifeAcceptanceDays',
              'shelfListDaysThresholdPercentage',
              'maxShelfLifeAcceptanceDays',
              'maxShelfListDaysThresholdPercentage',
              'alertExpiryDays',
              'maxPriceLimit',
              'maxQtyonHand',
              'saftyStock',
              'eau',
              'totalSolderPoints',
              'businessRisk',
              'driverToolRequired',
              'matingPartRquired',
              'pickupPadRequired',
              'programingRequired',
              'functionalTestingRequired',
              'trackSerialNumber',
              'restrictUSEwithpermission',
              'restrictPackagingUseWithpermission',
              'restrictUsePermanently',
              'restrictPackagingUsePermanently',
              'bomLock',
              'umidVerificationRequire',
              'isAutoVerificationOfAllAssemblyParts'
            ];
          _.each(settingsFields, (item) => {
            if (vm.component[item] !== vm.componentCopy[item]) {
              validationResult = false;
              return validationResult;
            }
          });
          return validationResult;
        }
        else {
          return true;
        }
      }

      function createComponent(componentInfo, deletedFiles, newlyAddedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles) {
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.component().save(componentInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (res.data && res.data.mfgDet) {
              const data = {
                messageContent: res.data.messageContent,
                mfgList: res.data.mfgDet
              };

              DialogFactory.dialogService(
                CORE.COMPONENT_NICKNAME_VALIDATION_DETAIL_POPUP_CONTROLLER,
                CORE.COMPONENT_NICKNAME_VALIDATION_DETAIL_POPUP_VIEW,
                null,
                data).then(() => { }, () => {
                  setFocus('nickName');
                }, (err) => BaseService.getErrorLog(err));
            } else {
              if (res.data && res.data.id) {
                vm.wizardStep1ComponentInfo.$setPristine();
                vm.component.id = res.data.id;
                selectedGoodPart = vm.component.isGoodPart;
                vm.componentCopy = angular.copy(vm.component);

                const imagesPromise = [deleteImages(deletedFiles), addNewImages(newlyAddedFiles), addNewImageUrls(newlyAddedUrls), uploadNewDataSheetFiles(newlyUploadedDataSheetFiles)];
                $q.all(imagesPromise).then(() => {
                  $timeout(() => {
                    vm.getComponentImages(vm.cid);
                    getComponentDataSheetUrls(vm.cid);
                  }, _configTimeout);
                }).catch((error) => BaseService.getErrorLog(error));
                if (vm.isComponent) {
                  $scope.$parent.$parent.vm.addUpdateComponent(res.data.id);
                }

                setRoHSDetails();
                getStockStatus(vm.component.id);
                getComponentBuyDetail(vm.component.id);
                getComponentKitAllocationDetail(vm.cid);
                getLastWONumberByAssyNickname();
              }
            }
            vm.getOddelyRefDesList(vm.cid);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      /* save  component detail into database */
      vm.saveComponent = () => {
        if (!vm.isReadOnly) {
          const isFluxTypeValidationFailed = setFluxTypeValue(false, false);
          const isFormRequiredValidationFailed = BaseService.focusRequiredField(vm.wizardStep1ComponentInfo);
          const isRequireFunctionalTesting = vm.component.functionalTestingRequired ? (!vm.component.requiredTestTime ? true : false) : false;

          if (isFluxTypeValidationFailed || isFormRequiredValidationFailed || isRequireFunctionalTesting) {
            if (isFluxTypeValidationFailed) {
              $timeout(() => {
                setFluxTypeValue(false, true);
                const elmnt = document.getElementById('fluxdiv');
                if (elmnt) {
                  elmnt.scrollIntoView({ block: 'start' });
                }
              }, true);
            } else if (isRequireFunctionalTesting) {
              BaseService.focusRequiredField(vm.partMasterBlocksFrom);
            }
            return;
          }

          if (vm.getPIDCodeValidation()) {
            setFocus('PartDetailPIDCodeSufix');
            return;
          }

          const newlyAddedFiles = [];
          const newlyAddedUrls = [];
          const deletedFiles = [];
          const newlyAddedDataSheetUrls = [];
          const newlyUploadedDataSheetFiles = [];
          const deletedDataSheetUrls = [];
          if (vm.component.component_images && vm.component.component_images.length > 0 /*&& vm.component.isCustom*/) {
            _.each(vm.component.component_images, (item) => {
              if (item.originalFileName && !item.isDeleted && item.id < 0) {
                if (item.imageURL.startsWith('//') && item.imageURL.startsWith('http://') || item.imageURL.startsWith('https://')) {
                  newlyAddedUrls.push(item.imageURL);
                }
                else {
                  const filename = item.originalFileName;
                  const originalFileName = filename.substr(0, filename.lastIndexOf('.')) || filename;
                  vm.imageName = `${originalFileName}.png`;

                  if (item.id < 0) {
                    newlyAddedFiles.push({ id: 1, file: Upload.dataUrltoBlob(item.imageURL, vm.imageName) });
                  }
                }
              }
              else if (item.isDeleted && item.id > 0) {
                deletedFiles.push({ id: item.id });
              }
            });
          }
          if (vm.component.component_datasheets && vm.component.component_datasheets.length > 0) {
            _.each(vm.component.component_datasheets, (item) => {
              if (!item.isDeleted && item.id < 0) {
                if (item.datasheetURL) {
                  newlyAddedDataSheetUrls.push(item);
                }
                else if (item.fileData) {
                  newlyUploadedDataSheetFiles.push({ id: item.id, file: Upload.dataUrltoBlob(item.fileData, item.originalFileName) });
                }
              }
              else if (item.isDeleted && item.id > 0) {
                deletedDataSheetUrls.push({ id: item.id });
              }
            });
          }
          const componentInfo = {
            dataSheetLink: vm.component.dataSheetLink,
            isCustom: vm.component.isCustom ? vm.component.isCustom : false,
            isCPN: vm.component.isCPN ? vm.component.isCPN : false,
            isGoodPart: vm.component.isGoodPart ? vm.component.isGoodPart : vm.PartCorrectList.IncorrectPart,
            replacementPartID: vm.component.isGoodPart === vm.PartCorrectList.IncorrectPart ? vm.autoCompleteConnectedPart.keyColumnId : null,
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            mfgPN: vm.component.mfgPN ? (replaceHiddenSpecialCharacter(vm.component.mfgPN)).trim() : vm.component.mfgPN,
            //PIDCode: vm.component.PIDCode,
            PIDCode: (vm.component.PIDCodePrefix + vm.component.PIDCodeSufix).trim(),
            productionPN: vm.component.productionPN ? (replaceHiddenSpecialCharacter(vm.component.productionPN)).trim() : vm.component.productionPN,
            category: vm.partCategoryID,
            partType: vm.autoCompleteCategory.keyColumnId,
            mfgPNDescription: vm.component.mfgPNDescription,
            detailDescription: vm.component.detailDescription,
            specialNote: vm.component.specialNote,
            purchasingComment: vm.component.purchasingComment,
            costCategoryID: vm.autoCompleteCostCategory.keyColumnId,
            rfqOnly: (vm.partCategoryID === vm.PartCategory.SubAssembly) ? vm.component.rfqOnly : false,
            nickName: (vm.partCategoryID === vm.PartCategory.SubAssembly && vm.component.nickName) ? vm.component.nickName.trim() : null,
            rev: ((vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly) && vm.component.rev) ? vm.component.rev.trim() : null,
            partStatus: vm.autoCompletePart.keyColumnId,
            partStatusText: vm.component.partStatusText,
            ltbDate: (BaseService.getAPIFormatedDate(vm.component.ltbDate)),
            eolDate: (BaseService.getAPIFormatedDate(vm.component.eolDate)),
            obsoleteDate: (BaseService.getAPIFormatedDate(vm.component.obsoleteDate)),
            reversalDate: (BaseService.getAPIFormatedDate(vm.component.reversalDate)),
            leadTime: vm.component.leadTime,
            RoHSStatusID: vm.autoCompleteRohsStatus.keyColumnId,
            rohsText: vm.component.rohsText,
            mslID: (vm.component.mslID && vm.component.mslID !== 'null') ? vm.component.mslID : null,
            deviceMarking: vm.component.deviceMarking, //need to rename with device marking
            packaging: vm.component.packaging,
            packagingID: vm.autoPackaging.keyColumnId,
            minimum: vm.component.minimum,
            mult: vm.component.mult,
            uomClassID: vm.component.uomClassID,
            uom: vm.autoCompleteuom.keyColumnId,
            uomText: vm.component.uomText,
            countryOfOrigin: vm.component.countryOfOrigin,
            htsCode: vm.component.htsCode,
            scrapValuePerBuild: vm.component.scrapValuePerBuild,
            scrapRatePercentagePerBuild: vm.component.scrapRatePercentagePerBuild,
            plannedValuePerBuild: vm.component.plannedValuePerBuild,
            plannedOverRunPercentagePerBuild: vm.component.plannedOverRunPercentagePerBuild,
            maxPriceLimit: vm.component.maxPriceLimit,
            maxQtyonHand: vm.component.maxQtyonHand,
            saftyStock: vm.component.saftyStock,
            eau: vm.component.eau,
            businessRisk: (vm.component.businessRisk && vm.component.businessRisk !== 'null') ? vm.component.businessRisk : null,
            matingPartRquired: vm.component.matingPartRquired ? vm.component.matingPartRquired : false,
            driverToolRequired: vm.component.driverToolRequired ? vm.component.driverToolRequired : false,
            //Track Serial Numbers
            bomLock: vm.component.bomLock,
            restrictUSEwithpermission: vm.component.restrictUSEwithpermission,
            pickupPadRequired: vm.component.pickupPadRequired ? vm.component.pickupPadRequired : false,
            programingRequired: vm.component.programingRequired ? vm.component.programingRequired : false,
            functionalTestingRequired: vm.component.functionalTestingRequired ? vm.component.functionalTestingRequired : false,
            restrictUsePermanently: vm.component.restrictUsePermanently,
            selfLifeDays: vm.component.isShelfLife ? vm.component.selfLifeDays : null,
            shelfListDaysThresholdPercentage: vm.component.isShelfLife ? vm.component.shelfListDaysThresholdPercentage : null,
            shelfLifeAcceptanceDays: vm.component.isShelfLife ? vm.component.shelfLifeAcceptanceDays : null,
            maxShelfLifeAcceptanceDays: vm.component.isShelfLife ? vm.component.maxShelfLifeAcceptanceDays : null,
            maxShelfListDaysThresholdPercentage: vm.component.isShelfLife ? vm.component.maxShelfListDaysThresholdPercentage : null,
            shelfLifeDateType: vm.component.shelfLifeDateType,
            functionalCategoryText: vm.component.functionalCategoryText,
            functionalCategoryID: vm.autoCompletePartType.keyColumnId,//need to rename with functional category
            mountingTypeText: vm.component.mountingTypeText,
            mountingTypeID: vm.autoCompleteMountingType.keyColumnId,
            partPackageID: vm.autoCompletePackageCaseType.keyColumnId,
            operatingTemp: vm.component.operatingTemp,
            minOperatingTemp: vm.component.minOperatingTemp,
            maxOperatingTemp: vm.component.maxOperatingTemp,
            connectorTypeText: vm.component.connectorTypeText,
            connecterTypeID: vm.autoCompleteConnecterType.keyColumnId,
            noOfPosition: vm.component.noOfPosition,
            noOfPositionText: vm.component.noOfPositionText,
            noOfRows: vm.component.noOfRows,
            noOfRowsText: vm.component.noOfRowsText,
            pitch: vm.component.pitch,
            pitchMating: vm.component.pitchMating,
            sizeDimension: vm.component.sizeDimension,
            length: vm.component.length,
            width: vm.component.width,
            heightText: vm.component.heightText,
            height: vm.component.height,
            tolerance: vm.component.tolerance,
            voltage: vm.component.voltage,
            value: vm.component.value,
            partPackage: vm.component.partPackage,
            powerRating: vm.component.powerRating,
            weight: vm.component.weight,
            feature: vm.component.feature,
            //priceCategoryID: vm.component.priceCategoryID,
            //minQty: vm.component.minQty,
            //maxQty: vm.component.maxQty,
            packageQty: vm.component.packageQty,
            umidSPQ: vm.component.umidSPQ,
            //stdLeadTimeFrom: vm.component.stdLeadTimeFrom,
            //stdLeadTimeTo: vm.component.stdLeadTimeTo,
            //nonStdLeadTimeFrom: vm.component.nonStdLeadTimeFrom,
            //nonStdLeadTimeTo: vm.component.nonStdLeadTimeTo,
            //replacementPartID: vm.autoCompleteReplacementPartList.keyColumnId,
            //partValues: vm.component.partValues,
            //volume: vm.component.volume,
            driveToolgroupID: vm.autoCompleteDriveToolAlias.keyColumnId,
            //isPIDManual: vm.isPIDManual,
            pcbPerArray: vm.component.pcbPerArray,
            assyCode: vm.component.assyCode ? vm.component.assyCode.trim() : null,
            imageURL: vm.component.imageURL === CORE.NO_IMAGE_COMPONENT ? undefined : vm.component.imageURL,
            /*files: newlyAddedFiles, //vm.component.fileArray,
            newlyAddedFiles: newlyAddedFiles,
            updatedFiles: updatedFiles,
            deletedFiles: deletedFiles,*/
            custAssyPN: vm.component.custAssyPN ? vm.component.custAssyPN.trim() : null,
            //functionalTypePartRequired: vm.component.functionalTypePartRequired ? vm.component.functionalTypePartRequired : false,
            //mountingTypePartRequired: vm.component.mountingTypePartRequired ? vm.component.mountingTypePartRequired : false,
            color: vm.component.color,
            refSupplierMfgpnComponentID: vm.autoCompleteSupplierMfgPN.keyColumnId,
            //isTemperatureSensitive: vm.component.isTemperatureSensitive,
            unit: vm.component.unit,
            grossWeight: vm.component.grossWeight,
            packagingWeight: vm.component.packagingWeight,
            isCloudApiUpdateAttribute: vm.component.isCloudApiUpdateAttribute ? vm.component.isCloudApiUpdateAttribute : false,
            epicorType: vm.autoCompleteEpicorType.keyColumnId ? vm.autoCompleteEpicorType.keyColumnId : null,
            newlyAddedDataSheetUrls: newlyAddedDataSheetUrls,
            deletedDataSheetUrls: deletedDataSheetUrls,
            grossWeightUom: vm.autoCompleteGrossWeightUom.keyColumnId,
            packagingWeightUom: vm.autoCompletePackagingWeightUom.keyColumnId,
            temperatureCoefficient: vm.component.temperatureCoefficient,
            temperatureCoefficientValue: vm.component.temperatureCoefficientValue,
            temperatureCoefficientUnit: vm.component.temperatureCoefficientUnit,
            rohsDeviation: vm.component.rohsDeviation,
            //maxSolderingTemperature: vm.component.maxSolderingTemperature,
            alertExpiryDays: vm.component.alertExpiryDays,
            umidVerificationRequire: vm.component.umidVerificationRequire,
            isAutoVerificationOfAllAssemblyParts: vm.component.isAutoVerificationOfAllAssemblyParts,
            totalSolderPoints: vm.component.totalSolderPoints,
            trackSerialNumber: vm.component.trackSerialNumber,
            price: vm.component.price,
            restrictPackagingUseWithpermission: vm.component.restrictPackagingUseWithpermission,
            restrictPackagingUsePermanently: vm.component.restrictPackagingUsePermanently,
            isSupplier: vm.IsSupplier,
            mfgType: vm.component.mfgType,
            //requiredTestTime: vm.component.requiredTestTime,
            requiredTestTime: vm.component.functionalTestingRequired ? vm.component.requiredTestTime : null,
            predictedObsolescenceYear: vm.component.predictedObsolescenceYear,
            assemblyType: vm.autoCompleteAssemblyType.keyColumnId,
            refMfgPNMfgCodeId: vm.autoCompleteSupplierMfgCode.keyColumnId,
            frequency: vm.autoFrequency.keyColumnId,
            isNoClean: vm.component.isNoClean ? vm.component.isNoClean : false,
            isWaterSoluble: vm.component.isWaterSoluble ? vm.component.isWaterSoluble : false,
            isFluxNotApplicable: vm.component.isFluxNotApplicable ? vm.component.isFluxNotApplicable : false,
            isHazmatMaterial: vm.component.isHazmatMaterial ? vm.component.isHazmatMaterial : false,
            isEpoxyMount: vm.component.isEpoxyMount ? vm.component.isEpoxyMount : false,
            purchaseacctId: vm.component.purchaseacctId ? vm.component.purchaseacctId : null,
            salesacctId: vm.component.salesacctId ? vm.component.salesacctId : null,
            internalReference: vm.component.internalReference,
            frequencyType: vm.autoFrequencyType.keyColumnId,
            isReceiveBulkItem: vm.component.isReceiveBulkItem ? vm.component.isReceiveBulkItem : false,
            oddelyRefDesList: vm.component.oddelyRefDesList ? vm.component.oddelyRefDesList : [],
            removeOddelyRefDesIds: vm.component.removeOddelyRefDesIds ? vm.component.removeOddelyRefDesIds : [],
            dateCodeFormatID: vm.autoCompleteDateCodeFormat.keyColumnId,
            isDateCodeFormat: vm.component.isDateCodeFormat ? vm.component.isDateCodeFormat : false
          };
          if (!vm.cid) {
            //componentInfo.PIDCode = generatePIDCode();
            getPIDCodeManual(componentInfo);
          }

          if (!vm.allowIncorrectPartCreation) {
            if (!vm.cid) {
              if (vm.component.isGoodPart === vm.PartCorrectList.IncorrectPart) {
                const alertModel = {
                  messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.BAD_PART_CREATION_FEATURE_BASED_VALIDATION
                };
                DialogFactory.messageAlertDialog(alertModel);
                return;
              }
            }
            else if (vm.component.isGoodPart === vm.PartCorrectList.IncorrectPart && vm.componentCopy.isGoodPart === vm.PartCorrectList.CorrectPart) {
              const alertModel = {
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.BAD_PART_CREATION_FEATURE_BASED_VALIDATION
              };
              DialogFactory.messageAlertDialog(alertModel);
              return;
            }
          }

          if (vm.component.id) {
            let restrictFlagUpdateValidation = '';
            let partStatusUpdateValidation = '';
            if (vm.component.restrictUSEwithpermission !== vm.componentCopy.restrictUSEwithpermission) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_WITH_PERMISSION);
              restrictFlagUpdateValidation = messageContent.message;
            }
            if (vm.component.restrictUsePermanently !== vm.componentCopy.restrictUsePermanently) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_PERMANENTLY);
              restrictFlagUpdateValidation = (restrictFlagUpdateValidation ? (restrictFlagUpdateValidation + ' and ') : '') + messageContent.message;
            }
            if ((vm.componentCopy.restrictUSEwithpermission === true || vm.componentCopy.restrictUsePermanently === true) &&
              vm.component.restrictUSEwithpermission === false && vm.component.restrictUsePermanently === false) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.THIS_WILL_UNRESTRICT_ALL_PACKAGING_ALIAS_PARTS);
              restrictFlagUpdateValidation = restrictFlagUpdateValidation + messageContent.message;
            }
            if (vm.autoCompletePart.keyColumnId !== vm.CorePartStatusList.Active &&
              vm.componentCopy.partStatus === vm.CorePartStatusList.Active) {
              let oldPartstatus = _.filter(vm.partStatusList, (item) => item.id === vm.componentCopy.partStatus);
              let newPartstatus = _.filter(vm.partStatusList, (item) => item.id === vm.autoCompletePart.keyColumnId);
              oldPartstatus = (oldPartstatus && oldPartstatus.length > 0) ? oldPartstatus[0].name : '';
              newPartstatus = (newPartstatus && newPartstatus.length > 0) ? newPartstatus[0].name : '';
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PART_STATUS_ACTIVE_TO_NON_ACTIVE_UPDATE);
              partStatusUpdateValidation = stringFormat(messageContent.message, oldPartstatus, newPartstatus);
            }
            componentInfo.isRemovePackingAlias = false;
            componentInfo.isRemoveAlternateParts = false;
            componentInfo.isRemoveRoHSAlternateParts = false;
            const validationPromise = [
              checkAlternatePartValidationOnEdit(componentInfo, vm.autoCompletePartType.keyColumnId, CORE.ComponentValidationPartType.AlternatePart),
              checkAlternatePartValidationOnEdit(componentInfo, vm.autoCompletePartType.keyColumnId, CORE.ComponentValidationPartType.PackagingAlias),
              checkAlternatePartValidationOnEdit(componentInfo, vm.autoCompletePartType.keyColumnId, CORE.ComponentValidationPartType.RohsAlternatePart)
            ];
            //var validationPromise = [checkAlternatePartValidationOnEdit(componentInfo, vm.autoCompletePartType.keyColumnId, CORE.ComponentValidationPartType.AlternatePart)];
            $scope.$parent.vm.cgBusyLoading = $q.all(validationPromise).then((responses) => {
              var resPackagingAlias = _.find(responses, (item) => item.type === CORE.ComponentValidationPartType.PackagingAlias);
              var resAlternatePart = _.find(responses, (item) => item.type === CORE.ComponentValidationPartType.AlternatePart);
              var resRoHSAlternatePart = _.find(responses, (item) => item.type === CORE.ComponentValidationPartType.RohsAlternatePart);
              var isRemovePackingAlias = false;
              var isRemoveAlternateParts = false;
              var isRemoveRoHSAlternateParts = false;
              if (resPackagingAlias) {
                isRemovePackingAlias = resPackagingAlias.status;
              }
              if (resAlternatePart) {
                isRemoveAlternateParts = resAlternatePart.status;
              }
              if (resRoHSAlternatePart) {
                isRemoveRoHSAlternateParts = resRoHSAlternatePart.status;
              }

              if (isRemoveAlternateParts || isRemovePackingAlias || isRemoveRoHSAlternateParts ||
                restrictFlagUpdateValidation ||
                partStatusUpdateValidation) {
                let textContentMessage = [];
                if (isRemovePackingAlias) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PACKAGING_ALIAS_PART);
                  textContentMessage.push(messageContent.message);
                }
                if (isRemoveAlternateParts) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ALTERNATE_PARTS);
                  textContentMessage.push(messageContent.message);
                }
                if (isRemoveRoHSAlternateParts) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ROHS_REPLACEMENT_PARTS);
                  textContentMessage.push(messageContent.message);
                }
                if (textContentMessage && textContentMessage.length > 0) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ALTERNATE_PART_VALIDATION_CONFIRMATION_BODY_MESSAGE);
                  textContentMessage = stringFormat(messageContent.message, textContentMessage.join(', '));
                } else {
                  textContentMessage = '';
                }
                if (restrictFlagUpdateValidation) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_RESTRICT_FLAG_UPDATE_CONFIRMATION_MESSAGE);
                  textContentMessage = (textContentMessage ? (textContentMessage + '<br>*') : '') + stringFormat(messageContent.message, restrictFlagUpdateValidation);
                }

                if (partStatusUpdateValidation) {
                  textContentMessage = (textContentMessage ? (textContentMessage + '<br>*') : '') + partStatusUpdateValidation;
                }

                if (textContentMessage) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_VALIDATION_MESSAGES_CONTENT_STRING);
                  messageContent.message = stringFormat(messageContent.message, textContentMessage);
                  textContentMessage = messageContent;
                }

                const obj = {
                  messageContent: textContentMessage,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };

                DialogFactory.messageConfirmDialog(obj).then((yes) => {
                  if (yes) {
                    validatePartDetail(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, true);
                  }
                }, () => {
                  // Empty
                });
              }
              else if (selectedGoodPart !== vm.component.isGoodPart || checkSettingsValidation() !== true) {
                validatePartDetail(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, true);
              }
              else {
                validatePartDetail(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, false);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            if (vm.autoCompletePart.keyColumnId !== vm.CorePartStatusList.Active) {
              let newPartstatus = _.filter(vm.partStatusList, (item) => item.id === vm.autoCompletePart.keyColumnId);
              newPartstatus = (newPartstatus && newPartstatus.length > 0) ? newPartstatus[0].name : '';

              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PART_STATUS_NON_ACTIVE_CREATE);
              messageContent.message = stringFormat(messageContent.message, newPartstatus);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  createComponent(componentInfo, deletedFiles, newlyAddedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
                }
              }, () => {
                // Cancel
              });
            }
            else {
              createComponent(componentInfo, deletedFiles, newlyAddedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
            }
          }
        }
      };

      /**
       * Validate Part Detail before go for Update it
       * @param {any} componentInfo - Part Detail
       * @param {any} newlyAddedFiles - New added File(Images)
       * @param {any} deletedFiles - Delete File(Images/Datasheet)
       * @param {any} newlyAddedUrls - New Added Datasheet URL
       * @param {any} newlyUploadedDataSheetFiles - New Added Datasheet File
       * @param {any} isRequiredPassword - Required password confiramation before Update Part
       */
      function validatePartDetail(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, isRequiredPassword) {
        if (vm.cid) {
          componentInfo.id = vm.cid;
          $scope.$parent.vm.cgBusyLoading = ComponentFactory.validationOnUpdatePart().query(componentInfo).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              updateComponentReturnResponse(res.errors, componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, isRequiredPassword);
            } else {
              if (isRequiredPassword) {
                openPasswordDialoag(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
              } else {
                updateComponent(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      /**
       * Varify user by update important data on save part detail
       * @param {any} componentInfo - Part Detail
       * @param {any} newlyAddedFiles - New added File(Images)
       * @param {any} deletedFiles - Delete File(Images/Datasheet)
       * @param {any} newlyAddedUrls - New Added Datasheet URL
       * @param {any} newlyUploadedDataSheetFiles - New Added Datasheet File
       */
      function openPasswordDialoag(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles) {
        return DialogFactory.dialogService(
          CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
          CORE.MANAGE_PASSWORD_POPUP_VIEW,
          _dummyEvent, {
          isValidate: true
        }).then((data) => {
          if (data) {
            updateComponent(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
          }
        }, () => {
          // Empty
        });
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
      function updateComponentReturnResponse(res, componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, isRequiredPassword) {
        if (res.data && res.data.assemblyList) {
          DialogFactory.dialogService(
            USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER,
            USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW,
            null,
            res.data.assemblyList
          ).then((activityPopupResDetail) => {
            if (activityPopupResDetail && activityPopupResDetail.continueSave) {
              if (isRequiredPassword) {
                openPasswordDialoag(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
              } else {
                updateComponent(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
              }
            }
          }, () => {
            // cancel
          });
        } else if (res.data && Array.isArray(res.data.usedOperationList) && res.data.usedOperationList.length > 0) {
          const usedOperationDet = {
            woOperationList: res.data.usedOperationList,
            isWaterSoluble: componentInfo.isWaterSoluble,
            isNoClean: componentInfo.isNoClean,
            isFluxNotApplicable: componentInfo.isFluxNotApplicable,
            assyDetail: {
              pidCode: componentInfo.PIDCode,
              assyID: vm.cid,
              assyRohsIcon: vm.component.rohsIcon,
              assyRohsName: vm.component.rohsName,
              MFGPN: vm.component.mfgPN
            },
            partType: componentInfo.partType
          };
          DialogFactory.dialogService(
            CORE.WORKORDER_OPERATION_CLEANING_DETAIL_LIST_MODAL_CONTROLLER,
            CORE.WORKORDER_OPERATION_CLEANING_DETAIL_LIST_MODAL_VIEW,
            event,
            usedOperationDet).then((responseDet) => {
              if (responseDet && responseDet.Proceed) {
                componentInfo.processIsCleanTypeChecked = responseDet.Proceed;
                if (isRequiredPassword) {
                  openPasswordDialoag(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
                } else {
                  updateComponent(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
                }
              }
            }, () => {
              // cancel
            });
        } else if (res.data && Array.isArray(res.data.usedTransactionList) && res.data.usedTransactionList.length > 0) {
          const usedTranscationDetail = {
            usedTransactionList: res.data.usedTransactionList,
            isWaterSoluble: componentInfo.isWaterSoluble,
            isNoClean: componentInfo.isNoClean,
            isFluxNotApplicable: componentInfo.isFluxNotApplicable,
            assyDetail: {
              pidCode: componentInfo.PIDCode,
              assyID: vm.cid,
              assyRohsIcon: vm.component.rohsIcon,
              assyRohsName: vm.component.rohsName,
              MFGPN: vm.component.mfgPN
            },
            partType: componentInfo.partType
          };
          DialogFactory.dialogService(
            CORE.PART_USED_TRANSACTION_LIST_MODAL_CONTROLLER,
            CORE.PART_USED_TRANSACTION_LIST_MODAL_VIEW,
            event,
            usedTranscationDetail).then((responseDet) => {
              if (responseDet && responseDet.Proceed) {
                if (isRequiredPassword) {
                  openPasswordDialoag(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
                } else {
                  updateComponent(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles);
                }
              }
            }, () => {
              // cancel
            });
        }
      }

      // update component to database
      function updateComponent(componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, isRequiredPassword) {
        if (vm.cid) {
          $scope.$parent.vm.cgBusyLoading = ComponentFactory.component().update({ id: vm.cid }, componentInfo).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.FAILED) {
              updateComponentReturnResponse(res.errors, componentInfo, newlyAddedFiles, deletedFiles, newlyAddedUrls, newlyUploadedDataSheetFiles, isRequiredPassword);
            } else if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              const imagesPromise = [deleteImages(deletedFiles), addNewImages(newlyAddedFiles), addNewImageUrls(newlyAddedUrls), uploadNewDataSheetFiles(newlyUploadedDataSheetFiles)];
              $q.all(imagesPromise).then(() => {
                $timeout(() => {
                  vm.getComponentImages(vm.cid);
                  getComponentDataSheetUrls(vm.component.id);
                }, _configTimeout);
              }).catch((error) => BaseService.getErrorLog(error));
              selectedGoodPart = vm.component.isGoodPart;
              vm.component.PIDCode = componentInfo.PIDCode;
              vm.componentCopy = angular.copy(vm.component);
              if (vm.isComponent) {
                $scope.$parent.$parent.vm.addUpdateComponent();
              }
              setRoHSDetails();
              getStockStatus(vm.component.id);
              getComponentBuyDetail(vm.component.id);
              getComponentKitAllocationDetail(vm.component.id);
              getComponentMaxTemperatureData(vm.component.id);
              vm.getOddelyRefDesList(vm.component.id);
              vm.wizardStep1ComponentInfo.$setPristine();
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      //Check on Save Part
      function checkAlternatePartValidationOnEdit(componentInfo, id, type) {
        if (vm.cid) {
          if (componentInfo.functionalCategoryID !== vm.componentCopy.functionalCategoryID &&
            type === CORE.ComponentValidationPartType.PackagingAlias) {
            return ComponentFactory.checkPartUsedAsPackagingAlias().query({ id: vm.cid }).$promise.then((validationCriteria) => {
              var obj = {
                status: (validationCriteria && validationCriteria.data) ? (validationCriteria.data.count > 0) : false,
                type: type
              };
              return obj;
            }).catch(() => {
              var obj = {
                status: true,
                type: type
              };
              return obj;
            });
          }
          else {
            const componentObj = {
              id: id,
              type: type
            };
            return ComponentFactory.getComponentAlternatePnValidations().query({ componentObj: componentObj }).$promise.then((validationCriteria) => {
              var notMatchedParameters = [];
              if (validationCriteria && validationCriteria.data) {
                _.each(validationCriteria.data, (field) => {
                  var partFieldValue = vm.componentCopy[field.fieldNameToValidate];
                  var alternatePartFieldValue = componentInfo[field.fieldNameToValidate];
                  var partValue;
                  var alternateValue;
                  var expr;
                  if (field.fieldDataType === 'string') {
                    partFieldValue = partFieldValue ? partFieldValue.toString() : null;
                    alternatePartFieldValue = alternatePartFieldValue ? alternatePartFieldValue.toString() : null;
                    if (partFieldValue !== alternatePartFieldValue) {
                      notMatchedParameters.push(field.fieldTitle);
                    }
                  }
                  else if (field.fieldDataType === 'number') {
                    partValue = (partFieldValue ? parseFloat(partFieldValue) : null);
                    alternateValue = (alternatePartFieldValue ? parseFloat(alternatePartFieldValue) : null);

                    expr = alternateValue + ' == ' + partValue;
                    if (!eval(expr)) {
                      notMatchedParameters.push(field.fieldTitle);
                    }
                  }
                });
                const obj = {
                  status: notMatchedParameters.length > 0,
                  type: type
                };
                if (notMatchedParameters.length) {
                  if (type === 1) {
                    return ComponentFactory.checkPartUsedAsAlternatePart().query({ id: vm.cid }).$promise.then((validationCriteria) => {
                      var obj = {
                        status: (validationCriteria && validationCriteria.data) ? (validationCriteria.data.count > 0) : false,
                        type: type
                      };
                      return obj;
                    }).catch(() => {
                      var obj = {
                        status: true,
                        type: type
                      };
                      return obj;
                    });
                  }
                  else if (type === 2) {
                    return ComponentFactory.checkPartUsedAsPackagingAlias().query({ id: vm.cid }).$promise.then((validationCriteria) => {
                      var obj = {
                        status: (validationCriteria && validationCriteria.data) ? (validationCriteria.data.count > 0) : false,
                        type: type
                      };
                      return obj;
                    }).catch(() => {
                      var obj = {
                        status: true,
                        type: type
                      };
                      return obj;
                    });
                  }
                  else if (type === 3) {
                    return ComponentFactory.checkPartUsedAsRoHSAlternatePart().query({ id: vm.cid }).$promise.then((validationCriteria) => {
                      var obj = {
                        status: (validationCriteria && validationCriteria.data) ? (validationCriteria.data.count > 0) : false,
                        type: type
                      };
                      return obj;
                    }).catch(() => {
                      var obj = {
                        status: true,
                        type: type
                      };
                      return obj;
                    });
                  }
                }
                else {
                  return obj;
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }

      //Check on Add Alternate Parts
      function checkAddAlternatePartValidation(item, typeId) {
        var componentObj = {
          toPartId: vm.cid,
          fromPartId: item.id,
          typeId: typeId
        };
        return $scope.$parent.vm.cgBusyLoading = ComponentFactory.checkAlternateAliasValidations().query(componentObj).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            return true;
          }
          else {
            return false;
          }
        }).catch(() => false);
      }

      vm.getComponentImages = (cid) => {
        if (cid) {
          return ComponentFactory.getComponentImages().query({
            id: cid
          }).$promise.then((images) => {
            if (images && images.data) {
              vm.component.component_images = [];
              _.each(images.data, (item) => {
                if (!vm.component.documentPath) {
                  vm.component.documentPath = item.component.documentPath;
                }
                vm.component.imageURL = item.component.imageURL;
                item.orgImageURL = item.imageURL;
                item.canSetDefaultImage = true;
                if (item.imageURL && !item.imageURL.startsWith('//') && !item.imageURL.startsWith('http://') && !item.imageURL.startsWith('https://')) {
                  item.imageURL = BaseService.getPartMasterImageURL(vm.component.documentPath, item.imageURL);
                  item.canDeleteImage = true;
                }
              });
              vm.component.component_images = images.data;
              if (vm.component.component_images && vm.component.component_images.length && vm.component.imageURL) {
                const defaultImage = _.find(vm.component.component_images, (item) => item.orgImageURL === vm.component.imageURL);
                if (defaultImage) {
                  vm.showImagePreview(defaultImage);
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      const onCheckComponent = $scope.$on('checkComponent', () => {
        $scope.$parent.$parent.vm.showWithoutSavingAlertforNextPrevious(null, null, true /*isChanged*/, false, vm.wizardStep1ComponentInfo);
      });
      const onSaveComponent = $scope.$on('saveComponent', () => {
        vm.saveComponent();
      });
      const onContinueProcess = $scope.$on('continueProcess', (evt, data) => {
        vm.cid = data;
        vm.componentDetails(vm.cid);
      });
      const onComponentInit = $scope.$on('componentInit', () => {
        vm.componentDetails(vm.cid);
      });
      const onSetComponentChanges = $scope.$on('setComponentChanges', () => {
        setAllComponentDetail();
      });

      /* get component Customer Alias */
      vm.getcomponentCustomerAlias = () => {
        vm.CustomerAliasList = [];
        vm.hlCPNPart = true;
        if (vm.cid) {
          if (vm.component && vm.component.isCPN) {
            const AVLPageInfo = {
              Page: 0,
              ItemsPerPage: 0,
              SortColumns: [],
              SearchColumns: [],
              ComponentCustAliasRevID: vm.cid
            };
            vm.hlCPNPart = false;
            return ComponentFactory.getComponentCustAliasRevPNByCustId().query(AVLPageInfo).$promise.then((response) => {
              vm.hlCPNPart = true;
              vm.CustomerAliasList = (response && response.data && response.data.CompCustAliasRevPN) ? response.data.CompCustAliasRevPN : [];
              _.each(vm.CustomerAliasList, (item) => {
                item.displayMfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgPN);
              });
            });
          }
          else {
            vm.hlCPNPart = false;
            return ComponentFactory.getCustomerAlias().query({
              id: vm.cid
            }).$promise.then((response) => {
              vm.hlCPNPart = true;
              vm.CustomerAliasList = (response && response.data) ? response.data : [];
              _.each(vm.CustomerAliasList, (item) => {
                item.displayMfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.ComponentCPNPart.mfgCodemst.mfgCode, item.ComponentCPNPart.mfgPN);
              });
            });
          }
        }
      };

      /* get component Drive Tools */
      const onAddDeleteDriveToolsPart = $scope.$on(CORE.EventName.onAddDeleteDriveToolsPart, () => {
        vm.getComponentDriveToolList(vm.cid);
      });
      vm.getComponentDriveToolList = (refComponentID) => {
        vm.driveToolsPagingInfo = {
          Page: 0,
          SortColumns: [['id', 'DESC']],
          SearchColumns: [],
          refComponentID: refComponentID
        };
        vm.hlRequireDriveTools = false;
        return ComponentFactory.getDriveToolListByComponentId().query(vm.driveToolsPagingInfo).$promise.then((componentDriveTools) => {
          vm.hlRequireDriveTools = true;
          if (componentDriveTools.data) {
            _.each(componentDriveTools.data.driveTools, (item) => {
              item.orgMfgPN = item.mfgPN;
              item.mfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgPN);
            });
            vm.componentDriveToolList = componentDriveTools.data.driveTools;
            $scope.$broadcast(vm.autoCompleteDriveToolAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //Save Component Drive Tools
      function saveDriveTool() {
        const componentInfo = {
          refComponentID: vm.cid,
          componentID: $scope.ComponentDriveToolsAlias.id
        };
        return ComponentFactory.createComponentDriveTools().save({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$broadcast(CORE.EventName.onAddDeleteDriveToolsPart);
          }
          else {
            $scope.$broadcast(vm.autoCompleteDriveToolAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /* remove  DriveTools alias  */
      vm.removeDriveToolAlias = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_COMPONENT_BLOCK_ITEM_CONFIRMATION_BOBY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN, 'Drive Tool');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              return ComponentFactory.deleteDriveToolComponent().query({ componentObj: item }).$promise.then(() => {
                $scope.$broadcast(CORE.EventName.onAddDeleteDriveToolsPart);
                setFocusOnControl(vm.autoCompleteDriveToolAlias.inputName);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            setFocusOnControl(vm.autoCompleteDriveToolAlias.inputName);
          });
        }
      };
      //end DriveTools alias region

      /* get Component Process Material */
      const onAddDeleteProcessMaterial = $scope.$on(CORE.EventName.onAddDeleteProcessMaterial, () => {
        vm.getComponentProcessMaterialList(vm.component.id);
      });
      vm.getComponentProcessMaterialList = (refComponentID) => {
        vm.hlProcessMaterial = false;
        vm.processMaterialList = [];
        return ComponentFactory.getComponenProcessMaterialList().query({ id: refComponentID }).$promise.then((componentProcessMaterial) => {
          vm.hlProcessMaterial = true;
          vm.processMaterialList = [];
          if (componentProcessMaterial && componentProcessMaterial.data) {
            _.each(componentProcessMaterial.data, (item) => {
              item.componentAsProcessMaterial.orgMfgPN = item.componentAsProcessMaterial.mfgPN;
              item.componentAsProcessMaterial.mfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.componentAsProcessMaterial.mfgCodemst.mfgCode, item.componentAsProcessMaterial.mfgPN);
            });
            vm.processMaterialList = componentProcessMaterial.data;
          }
          $scope.$broadcast(vm.autoCompleteProcessMaterial.inputName, null);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //Save Process Material
      function saveProcessMaterial() {
        const componentInfo = {
          refComponentID: vm.component.id,
          componentID: $scope.ComponentProcessMaterial.id
        };
        return ComponentFactory.createComponentProcessMaterial().save({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$broadcast(CORE.EventName.onAddDeleteProcessMaterial);
          }
          else {
            $scope.$broadcast(vm.autoCompleteProcessMaterial.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      /* remove  Component Process Material  */
      vm.removeComponentProcessMaterial = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_COMPONENT_BLOCK_ITEM_CONFIRMATION_BOBY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.componentAsProcessMaterial.mfgPN, 'Process Material');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              ComponentFactory.deleteComponentProcessMaterial().query({ componentObj: item }).$promise.then(() => {
                /*vm.componentListForProcessMaterialAC = angular.copy(componentMasterList);
                var obj = _.find(vm.componentListForProcessMaterialAC, function (data) {
                  return data.id === item.id;
                });*/
                $scope.$broadcast(CORE.EventName.onAddDeleteProcessMaterial);
                setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            setFocusOnControl(vm.autoCompleteProcessMaterial.inputName);
          });
        }
      };
      const onAddDeleteSupplier = $scope.$on(CORE.EventName.onAddDeleteSupplier, () => {
        vm.getComponentAliasGroups(vm.component.id);
      });
      /* get component alias list */
      vm.getComponentAliasGroups = (partid) => {
        /*Fetch Assembly Revision list in case of part is assembly*/
        vm.hlSupplierAlias = true;
        vm.componentGroupList = [];
        if (vm.partCategoryID === vm.PartCategory.SubAssembly) {
          const searchObj = {
            nickName: vm.component.nickName,
            mfgType: vm.mfgTypedata,
            fetchAll: true
          };
          vm.hlSupplierAlias = false;
          return ComponentFactory.getAssemblyRevisionList().query(searchObj).$promise.then((res) => {
            vm.hlSupplierAlias = true;
            vm.componentGroupList = [];
            if (res && res.data) {
              vm.componentGroupList = _.reject(res.data.data, (item) => item.id === vm.cid);
              _.each(vm.componentGroupList, (item) => {
                item.displayMfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgPN);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          vm.hlSupplierAlias = false;
          /* fetch component alias list */
          const searchObj = {
            id: partid,
            fetchAll: true
          };
          return ComponentFactory.getComponentAliasGroup().query(searchObj).$promise.then((componentalias) => {
            vm.hlSupplierAlias = true;
            vm.componentGroupList = [];
            if (componentalias && componentalias.data) {
              vm.componentGroupList = componentalias.data.data;
              _.each(vm.componentGroupList, (item) => {
                item.displayMfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgPN);
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      //end component alias region

      /* save  component packaging detail into database */
      function saveComponentPackagingAlias() {
        const componentInfo = {
          PID: $scope.ComponentPackagingAlias.PID,
          componetID: $scope.ComponentPackagingAlias.id,
          mfgPN: $scope.ComponentPackagingAlias.mfgPN,
          aliasgroupID: $scope.ComponentPackagingAlias.packaginggroupID,
          parentComponentID: vm.cid,
          parentPackaginggroupID: vm.component.packaginggroupID
        };
        $scope.$parent.vm.cgBusyLoading = ComponentFactory.createPackagingAlias().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
            if (res.data && res.data.assemblyList) {
              DialogFactory.dialogService(
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_CONTROLLER,
                USER.ADMIN_BOM_ACTIVITY_STARTED_ASSEMBLY_LIST_POPUP_VIEW,
                null,
                res.data.assemblyList
              ).then(() => {
                // success
              }, () => {
                // calcel
              });
            }
            else {
              if (res.data.restrictPackagingUsePermanently === false) {
                vm.component.restrictPackagingUsePermanently = false;
              }
              if (res.data.restrictPackagingUseWithpermission === false) {
                vm.component.restrictPackagingUseWithpermission = false;
              }
              vm.component.restrictUsePermanently = res.data.restrictUsePermanently;
              vm.component.restrictUSEwithpermission = res.data.restrictUSEwithpermission;
              vm.component.driverToolRequired = res.data.driverToolRequired;
              vm.component.matingPartRquired = res.data.matingPartRquired;
              vm.component.programingRequired = res.data.programingRequired;
              vm.component.functionalTestingRequired = res.data.functionalTestingRequired;
              vm.component.requiredTestTime = res.data.requiredTestTime;

              if (res.data.aliasgroupID) {
                vm.component.packaginggroupID = res.data.aliasgroupID;
              }
              $scope.$broadcast(CORE.EventName.onAddDeletePackagingAliasPart);
            }
          }
          else {
            $scope.$broadcast(vm.autoCompletePackagingAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /* get  component packaging list */
      vm.getComponentPackagingAliasGroups = (componentID) => {
        if (componentID && vm.IsSupplier !== true && !vm.component.isCPN && vm.partCategoryID !== vm.PartCategory.SubAssembly) {
          vm.componentPackageGroupList = [];
          vm.hlPackingAlias = false;
          return ComponentFactory.getComponentPackagingAliasGroup().query({ id: componentID }).$promise.then((componentPackagingalias) => {
            vm.hlPackingAlias = true;
            if (componentPackagingalias && componentPackagingalias.data) {
              vm.componentPackageGroupList = componentPackagingalias.data;
            }
            _.each(vm.componentPackageGroupList, (item) => {
              item.isCustom = item.isCustom ? true : false;
              item.displayMfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgPN);
            });
            $timeout(() => {
              if (vm.autoCompletePackagingAlias) {
                $scope.$broadcast(vm.autoCompletePackagingAlias.inputName, null);
                //vm.autoCompletePackagingAlias.keyColumnId = null;
              }
            }, 0);
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.addPackagingAliasPart = (event) => {
        if (vm.isReadOnly || vm.wizardStep1ComponentInfo.$dirty || vm.IsSupplier || (vm.partCategoryID === vm.PartCategory.SubAssembly) || vm.component.isCPN) {
          return;
        } else {
          vm.component.mfgCode = vm.component.mfgCodemst ? vm.component.mfgCodemst.mfgCode : null;
          vm.component.manufacturerName = vm.component.mfgCodemst ? vm.component.mfgCodemst.mfgName : null;
          vm.component.rohsComplientConvertedValue = vm.component.rohsName;
          vm.component.mfgType = vm.component.mfgCodemst.mfgType;
          DialogFactory.dialogService(
            USER.ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_CONTROLLER,
            USER.ADMIN_COMPONENT_ADD_PACKAGING_ALIAS_POPUP_VIEW,
            event,
            vm.component).then(() => {
              vm.getComponentPackagingAliasGroups(vm.cid);
              $scope.$broadcast(CORE.EventName.onAddDeletePackagingAliasPart);
            }, (data) => {
              if (data) {
                //  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }, (err) => BaseService.getErrorLog(err));
        }
      };
      /* remove  component packaging  */
      vm.removePackagingAlias = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_COMPONENT_BLOCK_ITEM_CONFIRMATION_BOBY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.mfgPN, 'Packaging Alias Part');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              ComponentFactory.deleteComponentPackagingAlias().query({ componentObj: item }).$promise.then(() => {
                vm.packagingAliasDetails = vm.AliasMFGCopyComponent || [];
                const obj = _.find(vm.packagingAliasDetails, (data) => data.id === item.componentID);
                if (obj) {
                  obj.packaginggroupID = null;
                }
                setFocusOnControl(vm.autoCompletePackagingAlias.inputName);
                $scope.$broadcast(CORE.EventName.onAddDeletePackagingAliasPart);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            setFocusOnControl(vm.autoCompletePackagingAlias.inputName);
          });
        }
      };

      const onAddDeletePackagingAliasPart = $scope.$on(CORE.EventName.onAddDeletePackagingAliasPart, () => {
        vm.getComponentPackagingAliasGroups(vm.cid);
      });
      //end component packaging alias region

      /* save  component alternate detail into database */
      function saveComponentAlternetAlias() {
        const componentInfo = {
          PID: $scope.ComponentAlternetAlias.PID,
          componetID: $scope.ComponentAlternetAlias.id,
          mfgPN: $scope.ComponentAlternetAlias.mfgPN,
          parentComponentID: vm.cid,
          type: $scope.ComponentAlternetAlias.type
        };
        ComponentFactory.createAlternetAlias().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$broadcast(CORE.EventName.onAddDeleteAlternatePart, componentInfo.type);
          }
          else {
            switch (componentInfo.type) {
              case CORE.ComponentAlternatePartType.AlternatePart: {
                $scope.$broadcast(vm.autoCompleteAlternetAlias.inputName, null);
                break;
              }
              case CORE.ComponentAlternatePartType.PickupPadRequired: {
                $scope.$broadcast(vm.autoCompleteRequirePickupPadAlias.inputName, null);
                break;
              }
              case CORE.ComponentAlternatePartType.FunctionaTestingRequired: {
                $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingAlias.inputName, null);
                break;
              }
              case CORE.ComponentAlternatePartType.MatingPartRequired: {
                $scope.$broadcast(vm.autoCompleteRequireMatingPart.inputName, null);
                break;
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      /* get  component alternate list */
      vm.getComponentAlternetAliasGroups = (type) => {
        if (vm.IsSupplier !== true && !vm.component.isCPN && vm.cid) {
          let haveToGetData = true;
          switch (type) {
            case CORE.ComponentAlternatePartType.AlternatePart: {
              vm.componentAlternetGroupList = [];
              vm.hlAlternatePart = false;
              break;
            }
            case CORE.ComponentAlternatePartType.PickupPadRequired: {
              haveToGetData = vm.component.pickupPadRequired ? true : false;
              vm.componentPickupPadList = [];
              vm.hlRequirePickupPad = false;
              break;
            }
            case CORE.ComponentAlternatePartType.FunctionaTestingRequired: {
              haveToGetData = vm.component.functionalTestingRequired ? true : false;
              vm.componentFunctionalTestingList = [];
              vm.hlRequireFuctionalTesting = false;
              break;
            }
            case CORE.ComponentAlternatePartType.MatingPartRequired: {
              haveToGetData = vm.component.matingPartRquired ? true : false;
              vm.componentRequireMatingPartlList = [];
              vm.hlRequireMattingPart = false;
              break;
            }
            case CORE.ComponentAlternatePartType.RoHSReplacementPart: {
              vm.componentROHSAlternetGroupList = [];
              vm.hlRohsPart = false;
              break;
            }
            default: {//execute when type is null or undefined on page load
              vm.componentAlternetGroupList = [];
              vm.componentPickupPadList = [];
              vm.componentFunctionalTestingList = [];
              vm.componentRequireMatingPartlList = [];
              vm.componentROHSAlternetGroupList = [];
              vm.hlAlternatePart = false;
              vm.hlRohsPart = false;
              vm.hlRequireMattingPart = false;
              vm.hlRequirePickupPad = false;
              vm.hlRequireFuctionalTesting = false;
              break;
            }
          }

          if (vm.cid && haveToGetData) {
            ComponentFactory.getComponentAlternetAliasGroup().query({
              id: vm.cid,
              type: type
            }).$promise.then((componentAlternetalias) => {
              var dataList = [];
              if (componentAlternetalias && componentAlternetalias.data) {
                _.each(componentAlternetalias.data, (item) => {
                  item.alternateComponent.orgMfgPN = item.alternateComponent.mfgPN;
                  item.alternateComponent.mfgPN = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.alternateComponent.mfgCodemst.mfgCode, item.alternateComponent.mfgPN);
                });
                dataList = componentAlternetalias.data;
              }

              vm.hlAlternatePart = true;
              vm.hlRohsPart = true;
              vm.hlRequireMattingPart = true;
              vm.hlRequirePickupPad = true;
              vm.hlRequireFuctionalTesting = true;
              vm.hlFuctionalTestingEquipmet = true;
              switch (type) {
                case CORE.ComponentAlternatePartType.AlternatePart: {
                  vm.componentAlternetGroupList = dataList;
                  $timeout(() => {
                    if (vm.autoCompleteAlternetAlias) {
                      $scope.$broadcast(vm.autoCompleteAlternetAlias.inputName, null);
                      //vm.autoCompleteAlternetAlias.keyColumnId = null;
                    }
                  }, 0);
                  break;
                }
                case CORE.ComponentAlternatePartType.PickupPadRequired: {
                  vm.componentPickupPadList = dataList;
                  $scope.$broadcast(vm.autoCompleteRequirePickupPadAlias.inputName, null);
                  break;
                }
                case CORE.ComponentAlternatePartType.FunctionaTestingRequired: {
                  vm.componentFunctionalTestingList = dataList;
                  $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingAlias.inputName, null);
                  break;
                }
                case CORE.ComponentAlternatePartType.MatingPartRequired: {
                  vm.componentRequireMatingPartlList = dataList;
                  $scope.$broadcast(vm.autoCompleteRequireMatingPart.inputName, null);
                  break;
                }
                case CORE.ComponentAlternatePartType.RoHSReplacementPart: {
                  vm.componentROHSAlternetGroupList = dataList;
                  $scope.$broadcast(vm.autoCompleteROHSAlternetAlias.inputName, null);
                  break;
                }
                default: {
                  if (dataList && dataList.length) {
                    vm.componentAlternetGroupList = _.filter(dataList, (item) => item.type === CORE.ComponentAlternatePartType.AlternatePart);
                    vm.componentPickupPadList = _.filter(dataList, (item) => item.type === CORE.ComponentAlternatePartType.PickupPadRequired);
                    vm.componentFunctionalTestingList = _.filter(dataList, (item) => item.type === CORE.ComponentAlternatePartType.FunctionaTestingRequired);
                    vm.componentRequireMatingPartlList = _.filter(dataList, (item) => item.type === CORE.ComponentAlternatePartType.MatingPartRequired);
                    vm.componentROHSAlternetGroupList = _.filter(dataList, (item) => item.type === CORE.ComponentAlternatePartType.RoHSReplacementPart);
                  }
                  vm.hlAlternatePart = true;
                  vm.hlRohsPart = true;
                  vm.hlRequireMattingPart = true;
                  vm.hlRequirePickupPad = true;
                  vm.hlRequireFuctionalTesting = true;
                  vm.hlFuctionalTestingEquipmet = true;
                  break;
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };
      /* remove  component alternate part  */
      vm.removeAlternetAlias = (item) => {
        if (item) {
          let blockName = '';
          let conrtolName = '';
          switch (item.type) {
            case CORE.ComponentAlternatePartType.AlternatePart: {
              blockName = 'Alternate Part';
              conrtolName = vm.autoCompleteAlternetAlias.inputName;
              break;
            }
            case CORE.ComponentAlternatePartType.PickupPadRequired: {
              blockName = 'Pickup Pad';
              conrtolName = vm.autoCompleteRequirePickupPadAlias.inputName;
              break;
            }
            case CORE.ComponentAlternatePartType.FunctionaTestingRequired: {
              blockName = 'Functional Testing Tools';
              conrtolName = vm.autoCompleteRequireFunctionalTestingAlias.inputName;
              break;
            }
            case CORE.ComponentAlternatePartType.MatingPartRequired: {
              blockName = 'Require Mating Parts';
              conrtolName = vm.autoCompleteRequireMatingPart.inputName;
              break;
            }
            case CORE.ComponentAlternatePartType.RoHSReplacementPart: {
              blockName = 'RoHS replacement part';
              conrtolName = vm.autoCompleteROHSAlternetAlias.inputName;
              break;
            }
          }
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_COMPONENT_BLOCK_ITEM_CONFIRMATION_BOBY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.alternateComponent.mfgPN, blockName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              ComponentFactory.deleteComponentAlternetAlias().query({ componentObj: item }).$promise.then(() => {
                vm.alternetAliasDetails = vm.AliasMFGCopyComponent;
                $scope.$broadcast(CORE.EventName.onAddDeleteAlternatePart, item.type);
                setFocusOnControl(conrtolName);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            setFocusOnControl(conrtolName);
          });
        }
      };
      //end component alternate alias region

      vm.getComponentOtherPartsList = () => {
        vm.hlOtherPart = true;
        if (vm.cid) {
          vm.ComponentOtherPartsList = [];
          vm.hlOtherPart = false;
          ComponentFactory.getComponentOtherPartList().query({
            id: vm.cid
          }).$promise.then((componentAlternetalias) => {
            vm.hlOtherPart = true;
            vm.ComponentOtherPartsList = (componentAlternetalias && componentAlternetalias.data) ? componentAlternetalias.data : [];
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      vm.getComponentOtherPartsList();

      vm.getComponentOtherPartName = ($event) => {
        var keyCode = $event.which || $event.keyCode;
        if (vm.otherPartName && keyCode === 13) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.ADD_OTHER_PART_NAME_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, vm.otherPartName);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if (vm.otherPartName) {
                saveComponentOtherPartName();
              }
              else {
                setFocusOnControl('otherPartName');
              }
            }
          }, () => {
            setFocusOnControl('otherPartName');
          });
        }
      };

      /* save component other part name into database */
      function saveComponentOtherPartName() {
        const componentInfo = {
          componentID: vm.cid,
          name: vm.otherPartName
        };
        if (vm.otherPartName) {
          return DialogFactory.dialogService(
            CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
            CORE.MANAGE_PASSWORD_POPUP_VIEW,
            _dummyEvent, {
            isValidate: true
          }).then((data) => {
            if (data) {
              ComponentFactory.createComponentOtherPart().query({ componentObj: componentInfo }).$promise.then((res) => {
                if (res && res.data) {
                  vm.otherPartName = '';
                  vm.getComponentOtherPartsList();
                }
                else {
                  $scope.$broadcast(vm.autoCompleteAlternetAlias.inputName, null);
                }
                setFocusOnControl('otherPartName');
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            // Empty
          });
        }
      }
      /* remove component other part name */
      vm.removeOtherPartName = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_COMPONENT_BLOCK_ITEM_CONFIRMATION_BOBY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.name, 'Other Part Names');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              ComponentFactory.deleteComponentOtherPart().query({ componentObj: item }).$promise.then(() => {
                vm.getComponentOtherPartsList();
                setFocusOnControl('otherPartName');
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            setFocusOnControl('otherPartName');
          });
        }
      };

      /* get  good/bad part component detail from database */
      vm.getComponentGoodBadPartGroup = () => {
        const listObj = {
          id: vm.cid,
          fetchAll: true
        };
        vm.hlIncorrectPart = false;
        vm.goodBadMFGPart = [];
        return ComponentFactory.getComponentGoodBadPartGroup().query(listObj).$promise.then((response) => {
          vm.hlIncorrectPart = true;
          vm.goodBadMFGPart = [];
          if (response.data && response.data.data) {
            _.each(response.data.data, (item) => {
              item.goodBadPart = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgPN);
            });
            vm.goodBadMFGPart = response.data.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* save  component alternate detail into database */
      const onAddDeleteFunTestEquipment = $scope.$on(CORE.EventName.onAddDeleteFunTestEquipment, () => {
        vm.getComponentFunctionalTestingEquipmentList();
      });
      function saveComponentFunctionalTestingEquipment(item) {
        const componentInfo = {
          eqpID: item.eqpID,
          componentID: vm.cid
        };
        ComponentFactory.createComponentFunctionalTestingEquipment().query({ componentObj: componentInfo }).$promise.then((res) => {
          if (res && res.data) {
            $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName, null);
            $scope.$broadcast(CORE.EventName.onAddDeleteFunTestEquipment);
          }
          else {
            $scope.$broadcast(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName, null);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      /*get functional testing equipment*/
      vm.getComponentFunctionalTestingEquipmentList = () => {
        vm.hlFuctionalTestingEquipmet = false;
        return ComponentFactory.getComponentFunctionalTestingEquipmentList().query({ id: vm.cid }).$promise.then((componentTestingEquipment) => {
          vm.hlFuctionalTestingEquipmet = true;
          if (componentTestingEquipment) {
            vm.componentFunctionalTestingEquipmentsList = componentTestingEquipment.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      /* remove functional testing equipment*/
      vm.removeComponentFunctionalTestingEquipment = (item) => {
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_COMPONENT_BLOCK_ITEM_CONFIRMATION_BOBY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, item.equipment.assetName, 'Functional Testing Equipments');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              ComponentFactory.deleteComponentFunctionalTestingEquipment().query({ componentObj: item }).$promise.then(() => {
                $scope.$broadcast(CORE.EventName.onAddDeleteFunTestEquipment);
                setFocusOnControl(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName);
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            setFocusOnControl(vm.autoCompleteRequireFunctionalTestingEquipmentsAlias.inputName);
          });
        }
      };

      $timeout(() => {
        $scope.$parent.vm.componentForm = vm.wizardStep1ComponentInfo;
      }, 1000);

      /************ For binding values in view mode for component **************/

      vm.getSelectedValues = () => {
        if (vm.mfgCodeDetail) {
          const selectedMFG = _.find(vm.mfgCodeDetail, (item) => item.id === vm.autoCompletemfgCode.keyColumnId);
          getComponentMfg(selectedMFG);
        }
        const selectedPartStatus = _.find(vm.partStatusList, (item) => item.id === vm.autoCompletePart.keyColumnId);
        if (vm.component) {
          vm.component.selectedPartStatus = selectedPartStatus ? selectedPartStatus.gencCategoryName : '';
        }
        const selectedUOM = _.find(vm.uomlist, (item) => item.id === vm.autoCompleteuom.keyColumnId);
        if (vm.component) {
          vm.component.selectedUOMTxt = selectedUOM ? selectedUOM.unitName : '';
        }
        if (!vm.component.unit && !vm.cid) {
          vm.component.unit = 1;
        }
        const selectedCategory = _.find(vm.categoryList, (item) => item.id === vm.autoCompleteCategory.keyColumnId);
        if (vm.component) {
          vm.component.selectedCategoryTxt = selectedCategory ? selectedCategory.Value : '';
        }
        const selectedMountingType = _.find(vm.mountingTypeList, (item) => item.id === vm.autoCompleteMountingType.keyColumnId);
        if (vm.component) {
          vm.component.selectedMountingTypeTxt = selectedMountingType ? selectedMountingType.name : '';
        }
        const selectedConnecterType = _.find(vm.connecterTypeList, (item) => item.id === vm.autoCompleteConnecterType.keyColumnId);
        if (vm.component) {
          vm.component.selectedConnecterTxt = selectedConnecterType ? selectedConnecterType.name : '';
        }
        const selectedPartType = _.find(vm.partTypeList, (item) => item.id === vm.autoCompletePartType.keyColumnId);
        if (vm.component) {
          vm.component.selectedPartTypeTxt = selectedPartType ? selectedPartType.partTypeName : '';
        }
      };
      /************ For binding values in view mode for component **************/

      const getSelectedMFGDetails = () => _.find(vm.mfgCodeDetail, (item) => item.id === vm.autoCompletemfgCode.keyColumnId);

      const getPIDCodeManual = (obj) => {
        if (!vm.cid) {
          if (obj.PIDCode !== generatePIDCode(true)) {
            obj.isPIDManual = true;
          }
        }
      };

      // change PID Code
      vm.changePIDCode = () => {
        if (!vm.cid) {
          vm.component.PIDCode = generatePIDCode();
        }
        vm.isAssyPNORRevChange = true;
      };

      // generate Asy Code
      vm.changeAssyCode = () => {
        if (!vm.cid) {
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
        }
      };
      const generatePIDCode = (isCheck) => {
        if (!vm.cid) {
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

              return (mfgCode.mfgCode + '+' + (vm.component.mfgPN ? vm.component.mfgPN.trim() : ''));
            }
          }
          else {
            vm.component.PIDCodePrefix = '';
            vm.component.PIDCodeSufix = '';
            return '';
          }
        }
      };

      vm.generateMfgPN = () => {
        if (!vm.cid && vm.isMfgPnDisabled()) {
          // let MfgPNLength = 100;
          if (vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly) {
            //vm.component.mfgPN = $filter('limitTo')((vm.component.custAssyPN || '') + " Rev" + (vm.component.rev || ''), MfgPNLength, 0);
            vm.component.mfgPN = ((vm.component.custAssyPN ? vm.component.custAssyPN.trim() : '') + ' Rev' + (vm.component.rev ? vm.component.rev.trim() : ''));
          }
        }
      };

      vm.isMfgPnDisabled = () => {
        if (vm.autoCompleteCategory && (vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly)) {
          return true;
        }
        else {
          return vm.cid ? true : false;
          // return vm.cid === null ? false : true;
        }
      };

      vm.revisionChange = () => {
        vm.isAssyPNORRevChange = true;
        vm.generateMfgPN();
        vm.changePIDCode();
      };

      vm.cropImage = (file, ev, selectedId) => {
        if (!file && ev.type === 'change') {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_FILE_TYPE);
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        } else if (file !== null) {
          file.isProfileImage = true;

          DialogFactory.dialogService(
            USER.IMAGE_CROP_CONTROLLER,
            USER.IMAGE_CROP_VIEW,
            ev,
            file).then((res) => {
              if (!selectedId) {
                let minId = -1;
                if (vm.component.component_images && vm.component.component_images.length > 0) {
                  const item = _.min(_.sortBy(vm.component.component_images, 'id'), 'id');
                  if (item && item.id <= 0) {
                    minId = item.id - 1;
                    if (minId === 0) {
                      minId = -1;
                    }
                  }
                }
                const newImg = { id: minId, imageURL: res.croppedImage, originalFileName: file.name, isDeleted: false, canDeleteImage: true, canSetDefaultImage: false };
                if (!vm.component.component_images) {
                  vm.component.component_images = [];
                }
                vm.component.component_images.push(newImg);
                vm.wizardStep1ComponentInfo.$setDirty();
                vm.selectedImageId = minId;
                vm.canDeleteImage = true;
                vm.canSetDefaultImage = false;
              }
              else {
                const item = _.find(vm.component.component_images, (o) => o.id === selectedId);
                item.imageURL = res.croppedImage;
                item.originalFileName = file.name;
                item.isDeleted = false;
                vm.selectedImageId = item.id;
                vm.canDeleteImage = item.canDeleteImage;
                vm.canSetDefaultImage = false;
                vm.wizardStep1ComponentInfo.$setDirty();
              }
              displayCurrentImage();
            }, () => {
              // calcel
            });
        }
      };

      vm.openFunctionalTypePartPopup = () => {
        var data = [];
        data.SelectedValues = angular.copy(vm.selectedFunctionalTypeParts);
        data.isFunctionalType = true;
        data.mfgPN = vm.component.mfgPN;
        data.partID = vm.cid;
        data.PIDCode = vm.component.PIDCode;
        data.RoHSStatusID = vm.component.RoHSStatusID;
        data.RoHSIcon = vm.component.rohsIcon;
        data.rohsName = vm.component.rohsName;

        DialogFactory.dialogService(
          USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_CONTROLLER, USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_VIEW, null, data).then((result) => {
            // if no any changes in functionaltype then no need to call this api for save
            if (result) {
              const cobj = {
                refComponentID: vm.cid,
                list: result
              };
              ComponentFactory.saveFunctionalTypePart().query({ componentObj: cobj }).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  $timeout(() => {
                    vm.getFunctionalTypePartList(vm.cid);
                    setFocusOnControl('btnAddFunctionalType');
                  }, 200);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            vm.getFunctionalTypePartList(vm.cid);
            setFocusOnControl('btnAddFunctionalType');
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.deleteFunctionalTypePart = (row) => {
        if (row) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_FUNCTIONAL_TYPE_PART_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, row.name);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            var cobj = {
              refComponentID: vm.cid,
              partTypeID: [row.id]
            };
            vm.cgBusyLoading = ComponentFactory.deleteFunctionalTypePart().query({ componentObj: cobj }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.getFunctionalTypePartList(vm.cid);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }, () => {
            // cancel
          });
        }
      };

      vm.openMountingTypePartPopup = () => {
        var data = [];
        data.SelectedValues = angular.copy(vm.selectedMountingTypeParts);
        data.isMountingType = true;
        data.mfgPN = vm.component.mfgPN;
        data.partID = vm.cid;
        data.PIDCode = vm.component.PIDCode;
        data.RoHSStatusID = vm.component.RoHSStatusID;
        data.RoHSIcon = vm.component.rohsIcon;
        data.rohsName = vm.component.rohsName;

        DialogFactory.dialogService(
          USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_CONTROLLER, USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_VIEW, null, data).then((result) => {
            // if no any changes in mountingtype then no need to call this api for save
            if (result) {
              const cobj = {
                refComponentID: vm.cid,
                list: result
              };
              ComponentFactory.saveMountingTypePart().query({ componentObj: cobj }).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  $timeout(() => {
                    vm.getMountingTypePartList(vm.cid);
                    setFocusOnControl('btnAddMountingType');
                  }, 200);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
            vm.getMountingTypePartList(vm.cid);
            setFocusOnControl('btnAddMountingType');
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.deleteMountingTypePart = (row) => {
        if (row) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_MOUNTING_TYPE_PART_CONFIRMATION_BODY_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, row.name);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            var cobj = {
              refComponentID: vm.cid,
              partTypeID: [row.id]
            };
            vm.cgBusyLoading = ComponentFactory.deleteMountingTypePart().query({ componentObj: cobj }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.getMountingTypePartList(vm.cid);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }, () => {
            // cancel
          });
        }
      };

      vm.openTemperatureSensitiveDataPopup = () => {
        var data = [];
        data.componentID = vm.cid;
        data.parentVM = vm;

        DialogFactory.dialogService(
          USER.ADMIN_COMPONENT_TEMPERATURE_SENSITIVE_DATA_LIST_CONTROLLER,
          USER.ADMIN_COMPONENT_TEMPERATURE_SENSITIVE_DATA_LIST_VIEW, null, data).then(() => {
            setFocusOnControl('btnTemperatureSensitiveData');
          }, (cancel) => {
            $q.all([getComponentMaxTemperatureData(vm.cid)]).then(() => {
              vm.component.isTemperatureSensitive = (cancel && cancel.isTemperatureSensitive ? cancel.isTemperatureSensitive : false);
              vm.setComponentDetailsForHeader();
            }).catch((error) => BaseService.getErrorLog(error));
            setFocusOnControl('btnTemperatureSensitiveData');
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.addSupplierAliasPart = () => {
        var data = [];
        data.mfgType = CORE.MFG_TYPE.DIST;
        data.supplierMfgCodeId = vm.component.mfgcodeID;
        data.supplierMfgPnID = vm.component.id;
        data.category = vm.component.category;

        DialogFactory.dialogService(
          CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          CORE.MANAGE_COMPONENT_MODAL_VIEW, null, data).then(() => {
            setFocusOnControl('btnAddSupplierAliasPart');
          }, () => {
            $scope.$broadcast(CORE.EventName.onAddDeleteSupplier);
            setFocusOnControl('btnAddSupplierAliasPart');
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.getPIDCodeValidation = () => {
        if (vm.component.PIDCodeSufix && vm.component.PIDCodeSufix.includes(USER.PIDCodeInvalidCharacter)) {
          return true;
        }
        else {
          return false;
        }
      };

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
      vm.getMinNumberValueValidation = (minValue) => BaseService.getMinNumberValueValidation(minValue);

      //hyper link go for list page
      vm.goToPartList = () => {
        BaseService.goToPartList();
      };
      vm.goToManufacturerList = (isMFG) => {
        if (isMFG) {
          BaseService.goToManufacturerList();
        }
        else {
          BaseService.goToSupplierList();
        }
      };
      vm.goToCostCategoryList = () => {
        BaseService.openInNew(USER.ADMIN_COST_CATEGORY_STATE, {});
      };
      vm.goToPartStatusList = () => {
        BaseService.openInNew(USER.ADMIN_PART_STATUS_STATE, {});
      };
      vm.goToRoHSStatusList = () => {
        BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
      };
      vm.goToUomList = () => {
        BaseService.goToUOMList();
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
      vm.goToComponentDetail = (mfgType, partId) => {
        if (mfgType) {
          mfgType = mfgType.toLowerCase();
        }
        BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
      };

      vm.goToComponentSalesPriceMatrixTab = (partId) => {
        BaseService.goToComponentSalesPriceMatrixTab(partId);
      };

      vm.goToComponentBOMDetail = (mfgType, partId) => {
        // if (mfgType) {
        //  mfgType = mfgType.toLowerCase();
        // }
        // localStorage.setItem('searchBOMAssemblyPart', JSON.stringify({ mfgPN: vm.component.mfgPN, partId: partId, mfgType: mfgType }));
        BaseService.goToComponentBOMWithKeyWord(partId, encodeURIComponent(vm.component.isCPN ? vm.component.custAssyPN : vm.component.mfgPN));
      };

      vm.goToEquipment = (equipmentId) => {
        BaseService.goToManageEquipmentWorkstation(equipmentId);
      };
      vm.redirectToAliasAltTab = (subTabName) => {
        const routeState = vm.mfgTypedata.toUpperCase() === CORE.MFG_TYPE.MFG ? USER.ADMIN_MANAGECOMPONENT_ALTERNATEGROUP_STATE : USER.ADMIN_MANAGEDISTCOMPONENT_ALTERNATEGROUP_STATE;
        BaseService.openInNew(routeState, { coid: vm.cid, selectedTab: USER.PartMasterTabs.AlternateGroup.Name, subTab: subTabName });
      };
      vm.expandSection = (componentSectionDet) => {
        vm.aliasName = '';
        vm.isViewFirstSection = false;
        vm.isViewSecondSection = false;
        vm.isViewThirdSection = false;
        vm.isViewForthdSection = false;
        if (vm.openSection && vm.openSection.ID === componentSectionDet.ID) {
          vm.openSection = '';
          return;
        }
        vm.openSection = componentSectionDet;
        vm.ComponentAlternatePartType = '';
        if (!(!vm.cid || vm.cid === null)) {
          vm.aliasName = componentSectionDet.Title;

          switch (componentSectionDet.ID) {
            case vm.DetailTabSectionView.PackagingAlias.ID:
            case vm.DetailTabSectionView.AlternatePart.ID:
            case vm.DetailTabSectionView.RohsAlternatePart.ID:
              if (vm.IsSupplier !== true && !vm.component.isCPN && !vm.wizardStep1ComponentInfo.$dirty && vm.cid) {
                vm.isViewFirstSection = componentSectionDet.ID === vm.DetailTabSectionView.PackagingAlias.ID ? (vm.partCategoryID === vm.PartCategory.SubAssembly ? false : true) : true;
              }
              vm.ComponentAlternatePartType = componentSectionDet.ID === vm.DetailTabSectionView.RohsAlternatePart.ID ? CORE.ComponentAlternatePartType.RoHSReplacementPart : CORE.ComponentAlternatePartType.AlternatePart;
              break;
            case vm.DetailTabSectionView.WhereUserInAssembly.ID:
              vm.isViewFirstSection = true;
              break;
            case vm.DetailTabSectionView.RequireDriveTools.ID:
            case vm.DetailTabSectionView.ProcessMaterial.ID:
              if (vm.IsSupplier !== true && !vm.component.isCPN && !vm.wizardStep1ComponentInfo.$dirty && vm.cid) {
                vm.isViewSecondSection = componentSectionDet.ID === vm.DetailTabSectionView.RequireDriveTools.ID ?
                  (vm.component.driverToolRequired ? true : false) : (vm.component.isEpoxyMount ? true : false);
              }
              break;
            case vm.DetailTabSectionView.CPNPart.ID:
            case vm.DetailTabSectionView.WhereUsedOther.ID:
            case vm.DetailTabSectionView.SupplierAlias.ID:
              vm.isViewSecondSection = true;
              break;
            case vm.DetailTabSectionView.RequiredMatingParts.ID:
            case vm.DetailTabSectionView.PickupPad.ID:
            case vm.DetailTabSectionView.RequireFunctionalTesting.ID:
              if (vm.IsSupplier !== true && !vm.component.isCPN && !vm.wizardStep1ComponentInfo.$dirty && vm.cid) {
                vm.isViewThirdSection = componentSectionDet.ID === vm.DetailTabSectionView.RequiredMatingParts.ID ? (vm.component.matingPartRquired ? true : false)
                  : (componentSectionDet.ID === vm.DetailTabSectionView.PickupPad.ID ? (vm.component.pickupPadRequired ? true : false)
                    : (componentSectionDet.ID === vm.DetailTabSectionView.RequireFunctionalTesting.ID ? (vm.component.functionalTestingRequired ? true : false)
                      : false
                    )
                  );
                vm.ComponentAlternatePartType = componentSectionDet.ID === vm.DetailTabSectionView.RequiredMatingParts.ID ? CORE.ComponentAlternatePartType.MatingPartRequired
                  : (componentSectionDet.ID === vm.DetailTabSectionView.PickupPad.ID ? CORE.ComponentAlternatePartType.PickupPadRequired
                    : CORE.ComponentAlternatePartType.FunctionaTestingRequired
                  );
              }
              break;
            case vm.DetailTabSectionView.Program.ID:
              if (vm.cid) {
                vm.isViewThirdSection = true;
              }
              break;
            case vm.DetailTabSectionView.FunctionalTestingEquipment.ID:
              vm.isViewThirdSection = vm.IsSupplier !== true && !vm.component.isCPN && vm.cid ? true : false;
              break;
            case vm.DetailTabSectionView.IncorrectPartMapping.ID:
              vm.isViewForthdSection = true;
              break;
            default:
          }
        }
      };

      vm.goToAVListTab = (partDetail) => {
        if (partDetail) {
          BaseService.goToCustomerCPNList(partDetail.mfgcodeID, partDetail.custAssyPN);
        } else {
          BaseService.goToCustomerCPNList(vm.component.mfgcodeID, vm.component.custAssyPN);
        }
      };
      vm.goToPackagingList = () => {
        BaseService.goToPackaging();
      };
      vm.goToAssyTypeList = () => {
        BaseService.goToAssyTypeList();
      };

      vm.goChartOfAccountsList = () => BaseService.goToChartOfAccountList();

      vm.openDataSheetLink = (url) => {
        /*if (!url) {
          url = CORE.WEB_URL + USER.COMPONENT_DATASHEET_BASE_PATH + vm.component.documentPath + '/' + USER.COMPONENT_DATASHEET_FOLDER_NAME;
        }
        const dataURL = stringFormat('{0}{1}', url, fileName ? fileName : '');
        */
        if (!url.startsWith('//') && !url.startsWith('http://') && !url.startsWith('https://')) {
          url = CORE.WEB_URL + USER.COMPONENT_DATASHEET_BASE_PATH + vm.component.documentPath + '/' + USER.COMPONENT_DATASHEET_FOLDER_NAME + url;
        }
        BaseService.openURLInNew(url);
      };

      vm.goToAssemblyOpeningBalanceDetails = () => {
        BaseService.goToAssemblyOpeningBalanceDetails(vm.component.id);
      };

      vm.goToNonUMIDStockList = () => {
        BaseService.goToNonUMIDStockList(null, null, vm.component.PIDCode);
      };

      vm.showImagePreview = (item) => {
        vm.selectedImageId = item.id;
        vm.imagefile = item.imageURL;
        vm.canDeleteImage = item.canDeleteImage;
        vm.canSetDefaultImage = item.canSetDefaultImage;
        displayCurrentImage();
      };

      vm.deleteImage = (id) => {
        if (vm.component.component_images) {
          vm.canDeleteImage = false;
          vm.canSetDefaultImage = false;
          _.each(vm.component.component_images, (item) => {
            if (item.id === id) {
              vm.wizardStep1ComponentInfo.$setDirty();
              item.isDeleted = true;
              if (vm.component.imageURL === item.orgImageURL) {
                vm.component.imageURL = null;
              }
              if (vm.component.component_images && vm.component.component_images.length) {
                const img = _.find(vm.component.component_images, (o) => o.isDeleted === false);
                if (img) {
                  vm.selectedImageId = img.id;
                  vm.canDeleteImage = img.canDeleteImage;
                  vm.canSetDefaultImage = img.canSetDefaultImage;
                  if (!vm.component.imageURL || vm.component.imageURL === null) {
                    vm.component.imageURL = img.orgImageURL;
                  }
                }
                else {
                  vm.selectedImageId = null;
                }
              }
              else {
                vm.selectedImageId = null;
              }
              displayCurrentImage();
            }
          });
        }
      };

      vm.getDefaultImageURL = () => BaseService.getPartMasterImageURL(vm.component.documentPath, vm.component.imageURL);

      vm.setDefaultImage = (id) => {
        if (vm.component.component_images) {
          _.each(vm.component.component_images, (item) => {
            if (item.id === id && !item.isDeleted) {
              //vm.wizardStep1ComponentInfo.$setDirty();
              vm.component.imageURL = item.orgImageURL;
              const imageDataObj = {
                id: vm.cid,
                imageUrl: vm.component.imageURL
              };

              vm.cgBusyLoading = ComponentFactory.updateComponentDefaultImage().query({
                imageDataObj: imageDataObj
              }).$promise.then(() => {
                // success
              }).catch((error) => BaseService.getErrorLog(error));
            }
          });
        }
      };

      function getAcquisitionDetails(buyToID) {
        if (buyToID) {
          const searchObj = {
            buyToID: buyToID
          };
          return WhoAcquiredWhoFactory.getAcquisitionDetails().query({ listObj: searchObj }).$promise.then((acquisition) => {
            if (acquisition && acquisition.data && acquisition.data[0].acquisitionDetail) {
              vm.acquisitionDetails = acquisition.data[0].acquisitionDetail.split('\n');
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      // open pop up and add new rfq assembly standard class
      vm.addStandardClass = (ev) => {
        const obj = {
          //rfqAssyIndex: vm.component.PIDCode && vm.component.rev ? (vm.component.PIDCode + "|" + vm.component.rev) : (vm.component.PIDCode),
          rfqAssyId: null,
          selectedClassList: vm.selectedStandard,
          cid: vm.cid,
          rfqFormsID: null
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.RFQ_ASSEMBLY_STANDARD_CLASS_CONTROLLER,
          RFQTRANSACTION.RFQ_ASSEMBLY_STANDARD_CLASS_VIEW,
          ev,
          obj).then(() => {
            //result.standardList = _.sortBy(result.standardList, 'priority');
            //vm.selectedStandard = result.standardList;
            getComponentStandardDetail(); /* calling again as sometime not get updated data from standard dir */
            //vm.wizardStep1ComponentInfo.$setDirty(true);
            setFocusOnControl('btnAddStandardClass');
          }, () => {
            setFocusOnControl('btnAddStandardClass');
          }, (err) => BaseService.getErrorLog(err));
      };

      function getComponentStandardDetail() {
        if (vm.cid) {
          return ComponentStandardDetailsFactory.getcomponentstandardDetail().query({ id: vm.cid }).$promise.then((response) => {
            vm.componentStandardDetaillist = (response && response.data) ? response.data : [];
            //fetch selected standard
            vm.selectedStandard = [];
            _.each(vm.componentStandardDetaillist, (stdclass) => {
              stdclass.colorCode = CORE.DefaultStandardTagColor;
              stdclass.class = stdclass.Standardclass ? stdclass.Standardclass.className : null;
              stdclass.colorCode = stdclass.Standardclass ? (stdclass.Standardclass.colorCode ? stdclass.Standardclass.colorCode : CORE.DefaultStandardTagColor) : CORE.DefaultStandardTagColor;
              stdclass.standard = stdclass.certificateStandard ? stdclass.certificateStandard.fullName : null;
              stdclass.priority = stdclass.certificateStandard ? stdclass.certificateStandard.priority : null;
              vm.selectedStandard.push(stdclass);
            });
            vm.selectedStandard.sort(sortAlphabatically('priority', 'standard', true));
            $scope.$parent.$parent.vm.getComponentStandards(vm.selectedStandard);
          });
        }
      }

      function getStockStatus(componentID) {
        vm.hlStockStatus = true;
        if (componentID) {
          vm.hlStockStatus = false;
          return ComponentFactory.getStockStatus().query({ id: componentID }).$promise.then((response) => {
            vm.hlStockStatus = true;
            if (response.data) {
              vm.stockDetail = response.data.stockDetail;
              vm.stockUnitDetail = response.data.stockUnitDetail;
              vm.stockUOMDetail = response.data.stockUOMDetail;
              vm.stockAbbreviation = vm.stockUOMDetail ? vm.stockUOMDetail.abbreviation : null;
              vm.customerConsignmentStockList = response.data.customerConsignmentStockList;
              if (vm.stockDetail) {
                if (vm.stockDetail.shortage < 0) {
                  vm.stockDetail.shortageQty = (-1 * angular.copy(vm.stockDetail.shortage));
                  vm.stockDetail.shortageQty = stringFormat('({0})', $filter('number')(vm.stockDetail.shortageQty));
                }
                vm.stockDetail.shortageQty = vm.stockDetail.shortageQty || 0;
              }

              if (vm.stockUnitDetail) {
                if (vm.stockUnitDetail.shortage < 0) {
                  vm.stockUnitDetail.shortageQty = (-1 * vm.stockUnitDetail.shortage);
                  vm.stockUnitDetail.shortageQty = stringFormat('({0})', $filter('number')(vm.stockUnitDetail.shortageQty));
                }
                vm.stockUnitDetail.shortageQty = vm.stockUnitDetail.shortageQty || 0;
              }
            }
            else {
              vm.stockDetail = null;
              vm.stockUnitDetail = null;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      vm.customerConsignStockDetail = () => {
        const data = {
          stockUOMDetail: vm.stockUOMDetail,
          customerConsignmentStockList: vm.customerConsignmentStockList
        };
        DialogFactory.dialogService(
          CORE.COMPONENT_CUSTOMER_CONSIGN_STOCK_DETAIL_MODEL_CONTROLLER,
          CORE.COMPONENT_CUSTOMER_CONSIGN_STOCK_DETAIL_MODEL_VIEW,
          null,
          data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      };

      function getComponentBuyDetail(componentID) {
        //if (componentID) {
        vm.hlBuyDetails = false;
        return ComponentFactory.getComponentBuyDetail().query({ id: (componentID || 0) }).$promise.then((response) => {
          vm.hlBuyDetails = true;
          if (response.data) {
            vm.buyDetail = response.data.buyDetail;
          }
        }).catch((error) => BaseService.getErrorLog(error));
        //}
      }

      function getComponentKitAllocationDetail(componentID) {
        vm.hlKitAllocation = true;
        if (componentID) {
          vm.hlKitAllocation = false;
          return ComponentFactory.getComponentKitAllocationDetail().query({ id: componentID }).$promise.then((response) => {
            vm.hlKitAllocation = true;
            if (response.data) {
              vm.componentKitAllocationList = response.data.componentKitAllocationList;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      /* Open popup for display history of entry change */
      vm.showInternalVersionHistory = ($event) => {
        if (vm.component && vm.component.id && vm.component.liveVersion) {
          const data = {
            partID: vm.component.id,
            assemblyNumber: vm.component.PIDCode,
            assemblyRev: vm.component.rev,
            narrative: false,
            title: CORE.BOMVersionHistoryPopUpTitle.ASSY_BOM
          };

          DialogFactory.dialogService(
            RFQTRANSACTION.BOM_HISTORY_POPUP_CONTROLLER,
            RFQTRANSACTION.BOM_HISTORY_POPUP_VIEW,
            $event,
            data).then(() => {
              // success
            }, () => {
              // cancel
            }, (error) => BaseService.getErrorLog(error));
        }
      };

      vm.changeSafetyStock = () => {
        if (vm.stockDetail) {
          vm.stockDetail.safetyStock = vm.component.saftyStock;
          vm.stockDetail.shortage = (vm.stockDetail.totalAvailableInHouseStock || 0) - ((vm.stockDetail.reservedLogicalStock || 0) + (vm.stockDetail.safetyStock || 0));
          if (vm.stockDetail.shortage < 0) {
            vm.stockDetail.shortageQty = (-1 * vm.stockDetail.shortage);
            vm.stockDetail.shortageQty = stringFormat('({0})', $filter('number')(vm.stockDetail.shortageQty));
          }
          else {
            vm.stockDetail.shortageQty = 0;
          }
        }
      };
      vm.onGoodPartChange = () => {
        if (vm.component.isGoodPart === vm.PartCorrectList.IncorrectPart) {
          if (vm.partCategoryID === vm.PartCategory.SubAssembly && !vm.IsSupplier) {
            vm.component.isCustom = true;
          }
          else {
            vm.component.isCustom = false;
          }
          vm.component.isCPN = false;
        }
      };
      vm.onCustomPartChange = () => {
        vm.component.isCloudApiUpdateAttribute = ((vm.component && vm.component.category === vm.PartType.Other) || vm.component.isCustom || vm.component.isCPN) ? false : true;
        if (vm.component.isCustom) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_CUSTOM_PART_CONFIRMATION_BODY_MESSAGE);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.component.isCloudApiUpdateAttribute = ((vm.component && vm.component.category === vm.PartType.Other) || vm.component.isCustom || vm.component.isCPN) ? false : true;
            // success
          }, () => {
            vm.component.isCustom = false;
            vm.component.isCloudApiUpdateAttribute = ((vm.component && vm.component.category === vm.PartType.Other) || vm.component.isCustom || vm.component.isCPN) ? false : true;
          });
        }
        else {
          vm.clearPartNoAndRev();
        }
      };



      vm.getComponentVerification = (ev, isContinue) => {
        vm.event = ev;
        if (!vm.component.mfgPN) {
          return;
        }
        if (vm.component.isCustom) {
          return;
        }
        if (!isContinue) {
          vm.transactionID = getGUID();
        }
        $scope.loaderVisible = true;
        const model = {
          transactionID: vm.transactionID,
          partNumber: (replaceHiddenSpecialCharacter(vm.component.mfgPN)).trim()
        };
        /*to update part in edit case only*/
        if (vm.cid) {
          model.isPartUpdate = true;
          model.partID = vm.cid;
        }
        const listMfrPN = [];
        listMfrPN.push(model);
        ComponentFactory.getPartDetailFromExternalApi().save(listMfrPN).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
            $scope.loaderVisible = false;
          }
        }).catch((error) => {
          $scope.loaderVisible = false;
          return BaseService.getErrorLog(error);
        });
      };

      function getDataSheetUrlMinId() {
        var minId = -1;
        if (vm.component.component_datasheets && vm.component.component_datasheets.length > 0) {
          const item = _.min(_.sortBy(vm.component.component_datasheets, 'id'), 'id');
          if (item && item.id <= 0) {
            minId = item.id - 1;
            if (minId === 0) {
              minId = -1;
            }
          }
        }
        return minId;
      }

      vm.addDataSheetLinkAddPopup = (ev) => {
        DialogFactory.dialogService(
          CORE.COMPONENT_DATA_SHEET_URL_ADD_MODAL_CONTROLLER,
          CORE.COMPONENT_DATA_SHEET_URL_ADD_MODAL_VIEW,
          ev).then(() => {
            // cancel
          }, (cancel) => {
            if (cancel) {
              if (vm.component.component_datasheets && vm.component.component_datasheets.length > 0) {
                const obj = _.find(vm.component.component_datasheets, (o) => o.isDeleted === false && o.datasheetURL === cancel);
                if (obj) {
                  const alertModel = {
                    messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DATASHEET_LINK_ALREADY_EXISTS
                  };
                  DialogFactory.messageAlertDialog(alertModel);
                  return;
                }
              }

              const minId = getDataSheetUrlMinId();
              const array = cancel.split('/');
              let displayName = '';
              if (array) {
                const filename = array[array.length - 1];
                displayName = filename.split('.')[0];
              }
              const newDataSheetUrl = {
                id: minId,
                datasheetURL: cancel,
                isDeleted: false,
                canDeleteDataSheetUrl: true,
                canSetDefaultDataSheetUrl: false,
                displayName: displayName
              };
              if (!vm.component.component_datasheets || vm.component.component_datasheets.length === 0) {
                vm.component.component_datasheets = [];
                vm.component.dataSheetLink = newDataSheetUrl.datasheetURL;
                vm.defaultDataSheetUrlID = newDataSheetUrl.id;
              }
              else if (vm.component.component_datasheets && vm.component.component_datasheets.length > 0) {
                const obj = _.find(vm.component.component_datasheets, (o) => o.isDeleted === false);
                if (obj) {
                  if (!vm.component.dataSheetLink || vm.component.dataSheetLink === null) {
                    vm.component.dataSheetLink = obj.datasheetURL;
                    vm.defaultDataSheetUrlID = obj.id;
                  }
                }
                else {
                  vm.component.dataSheetLink = newDataSheetUrl.datasheetURL;
                  vm.defaultDataSheetUrlID = newDataSheetUrl.id;
                }
              }
              vm.component.component_datasheets.push(newDataSheetUrl);
              vm.wizardStep1ComponentInfo.$setDirty();
            }
          }, (err) => BaseService.getErrorLog(err));
      };

      function deleteDataSheetInternal(item) {
        item.isDeleted = true;
        if (item.id === vm.defaultDataSheetUrlID) {
          vm.component.dataSheetLink = null;
          vm.defaultDataSheetUrlID = null;
        }
        vm.wizardStep1ComponentInfo.$setDirty();

        if (vm.component.component_datasheets && vm.component.component_datasheets.length > 0) {
          const obj = _.find(vm.component.component_datasheets, (o) => o.isDeleted === false);
          if (obj) {
            if (!vm.component.dataSheetLink || vm.component.dataSheetLink === null) {
              vm.component.dataSheetLink = obj.datasheetURL;
              vm.defaultDataSheetUrlID = obj.id;
            }
          }
          else {
            vm.component.dataSheetLink = null;
            vm.defaultDataSheetUrlID = null;
          }
        }
        else {
          vm.component.dataSheetLink = null;
          vm.defaultDataSheetUrlID = null;
        }
      }

      vm.deleteDataSheetUrl = (id, item) => {
        if (item) {
          if (vm.component.component_datasheets) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_DATA_SHEET_URL_DELETE_CONFIRMATION_MESSAGE);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                if (item.id < 0) {
                  deleteDataSheetInternal(item);
                }
                else {
                  DialogFactory.dialogService(
                    CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
                    CORE.MANAGE_PASSWORD_POPUP_VIEW,
                    _dummyEvent, {
                    isValidate: true
                  }).then((data) => {
                    if (data) {
                      deleteDataSheetInternal(item);
                    }
                  }, () => {
                    // Empty
                  });
                }
              }
            }, () => {
              // cancel
            });
          }
        }
      };

      vm.setDefaultDataSheetUrl = (id, ispdf) => {
        if (vm.component.component_datasheets) {
          _.each(vm.component.component_datasheets, (item) => {
            if (item.id === id && !item.isDeleted) {
              vm.wizardStep1ComponentInfo.$setDirty();
              if (ispdf) {
                vm.component.dataSheetLink = item.datasheetName;
                vm.defaultDataSheetUrlID = item.id;
              }
              else if (!item.isDeleted) {
                vm.component.dataSheetLink = item.datasheetURL;
                vm.defaultDataSheetUrlID = item.id;
              }
            }
          });
        }
      };

      function getComponentDataSheetUrls(cid) {
        if (cid) {
          return ComponentFactory.getComponentDataSheetUrls().query({
            id: cid
          }).$promise.then((datasheet) => {
            if (datasheet && datasheet.data) {
              vm.component.component_datasheets = [];
              vm.component.component_datasheets = datasheet.data;
              _.each(vm.component.component_datasheets, (item) => {
                item.isDeleted = false;
                item.canDeleteDataSheetUrl = true;
                item.canSetDefaultDataSheetUrl = true;
                if (!vm.component.documentPath) {
                  vm.component.documentPath = item.component.documentPath;
                }
                vm.component.dataSheetLink = item.component.dataSheetLink;
                const array = item.datasheetURL.split('/');
                if (array) {
                  const filename = array[array.length - 1];
                  item.displayName = filename.split('.')[0];
                }
                else {
                  item.displayName = '';
                }
              });
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      vm.uploadDataSheetFile = (file) => {
        if (!file) {
          return;
        }
        const reader = new window.FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (vm.component.component_datasheets && vm.component.component_datasheets.length > 0) {
            const obj = _.find(vm.component.component_datasheets, (o) => o.isDeleted === false && (o.datasheetURL === file.name || o.originalFileName === file.name));
            if (obj) {
              const alertModel = {
                messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DATASHEET_FILE_ALREADY_EXISTS
              };
              DialogFactory.messageAlertDialog(alertModel);
              return;
            }
          }
          const minId = getDataSheetUrlMinId();

          const newDataSheet = {
            id: minId,
            fileData: reader.result,
            originalFileName: file.name,
            displayName: file.name,
            isDeleted: false,
            canDeleteImage: true,
            canSetDefaultDataSheetUrl: false
          };
          if (!vm.component.component_datasheets) {
            vm.component.component_datasheets = [];
          }
          vm.component.component_datasheets.push(newDataSheet);
          vm.wizardStep1ComponentInfo.$setDirty();
        };
      };

      function getComponentMaxTemperatureData(cid) {
        if (cid) {
          return ComponentFactory.getComponentMaxTemperatureData().query({
            id: cid
          }).$promise.then((componentTemperature) => {
            if (componentTemperature && componentTemperature.data) {
              vm.component.componentTemperature = [];
              vm.component.componentTemperature = componentTemperature.data;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      function setFocusOnControl(controlName) {
        $timeout(() => {
          const element = $window.document.getElementsByName(controlName);
          if (element && element[0]) {
            element[0].focus();
          }
        });
      }

      angular.element(() => {
        BaseService.currentPageForms.push(vm.wizardStep1ComponentInfo);
      });

      vm.partRestrictModel = {
        restrictUSEwithpermission: 'restrictUSEwithpermission',
        restrictPackagingUseWithpermission: 'restrictPackagingUseWithpermission',
        restrictUsePermanently: 'restrictUsePermanently',
        restrictPackagingUsePermanently: 'restrictPackagingUsePermanently'
      };
      vm.restrictPartCheckChange = (modalName) => {
        var fieldValue = vm.component[modalName];
        if (fieldValue) {
          switch (modalName) {
            case vm.partRestrictModel.restrictUSEwithpermission:
              vm.component.restrictPackagingUseWithpermission = vm.component.restrictUsePermanently = vm.component.restrictPackagingUsePermanently = false;
              break;
            case vm.partRestrictModel.restrictPackagingUseWithpermission:
              vm.component.restrictUSEwithpermission = vm.component.restrictUsePermanently = vm.component.restrictPackagingUsePermanently = false;
              break;
            case vm.partRestrictModel.restrictUsePermanently:
              vm.component.restrictUSEwithpermission = vm.component.restrictPackagingUseWithpermission = vm.component.restrictPackagingUsePermanently = false;
              break;
            case vm.partRestrictModel.restrictPackagingUsePermanently:
              vm.component.restrictUSEwithpermission = vm.component.restrictPackagingUseWithpermission = vm.component.restrictUsePermanently = false;
              break;
          }
        }
        vm.setComponentDetailsForHeader();
      };

      vm.PartUsage = () => {
        const obj = { partID: vm.cid };
        DialogFactory.dialogService(
          USER.PART_USAGE_CONTROLLER,
          USER.PART_USAGE_VIEW,
          null,
          obj).then(() => {
            // success
          }, () => {
            // cancel
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.showImagesPreview = () => {
        var imagesList = (vm.component && vm.component.component_images) ? angular.copy(vm.component.component_images) : null;

        imagesList = _.filter(imagesList, (item) => item.isDeleted === false);

        if (imagesList && imagesList.length > 0) {
          const data = {
            imagesList: imagesList,
            selectedImageIndex: imagesList.indexOf(_.find(imagesList, (x) => x.id === vm.selectedImageId))
          };

          DialogFactory.dialogService(
            CORE.COMPONENT_IMAGES_PREVIEW_POPUP_MODAL_CONTROLLER,
            CORE.COMPONENT_IMAGES_PREVIEW_POPUP_MODAL_VIEW,
            _dummyEvent,
            data).then(() => {
              // success
            }, () => {
              // cancel
            }, (error) => BaseService.getErrorLog(error));
        }
      };
      //#region for update part notifiction
      //  Part Attribute changes Listeners
      function partUpdatedNotificationListener(message) {
        if (!vm.socketmsgwasOpened) {
          vm.socketmsgwasOpened = true;
          if (message && parseInt(message.bomPartID) === parseInt(vm.cid) && message.hasOwnProperty('bomLock')) {
            vm.socketmsgwasOpened = false;
            vm.componentDetails(parseInt(vm.cid));
          }
          else {
            vm.socketmsgwasOpened = false;
          }
        }
      }
      //#endregion

      function connectSocket() {
        socketConnectionService.on(CORE.EventName.sendPartUpdateVerification, sendPartUpdateVerification);
        socketConnectionService.on(PRICING.EventName.sendPartUpdatedNotification, partUpdatedNotificationListener);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });

      function removeSocketListener() {
        socketConnectionService.removeListener(CORE.EventName.sendPartUpdateVerification, sendPartUpdateVerification);
        socketConnectionService.removeListener(PRICING.EventName.sendPartUpdatedNotification, partUpdatedNotificationListener);
      }

      // on disconnect socket.io
      socketConnectionService.on('disconnect', () => {
        console.log('connection disconnect');
        removeSocketListener();
      });

      function sendPartUpdateVerification(item) {
        if (item.transactionID === vm.transactionID && item.partNumber === vm.component.mfgPN) {
          $scope.loaderVisible = false;
          const objApi = {
            ispartMaster: true,
            transactionID: vm.transactionID
          };
          APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
            if (response && response.data && response.data.bomError.length > 0 && !vm.isopenErrorpopup) {
              openErrorListPopup();
            } else {
              if (item && item.isPartUpdate && item.partID) {
                /*reload part detail page after update part from external API*/
                $state.go($state.current.name, { id: vm.cid }, { reload: true });
              }
              else {
                $scope.$parent.vm.cgBusyLoading = ComponentFactory.getComponentDetailByPN().query({ partNumber: vm.component ? vm.component.mfgPN : null })
                  .$promise.then((mfgparts) => {
                    if (mfgparts.status === CORE.ApiResponseTypeStatus.SUCCESS && mfgparts && mfgparts.data) {
                      //check parts from supplier or mfg
                      if (mfgparts.data.length > 0) {
                        const partTypeList = _.filter(mfgparts.data, (part) => part.mfgType.toLowerCase() === vm.mfgTypedata.toLowerCase());
                        if (partTypeList.length > 0) {
                          if (partTypeList && partTypeList.length === 1) {
                            vm.cid = partTypeList[0].id;
                            //set pristine
                            vm.wizardStep1ComponentInfo.$setPristine();
                            // url redirect
                            $state.go($state.current.name, {
                              coid: vm.cid
                            });
                          }
                          else {
                            if (!vm.isopenSelectPopup) {
                              vm.isopenSelectPopup = true;
                              $scope.loaderVisible = false;
                              const data = {
                                mfgPart: vm.component.mfgPN,
                                supplierName: null,
                                isAutoSelect: true,
                                mfgType: vm.mfgTypedata,
                                partData: partTypeList
                              };
                              DialogFactory.dialogService(
                                TRANSACTION.SELECT_MULTI_COMPONENT_MODAL_CONTROLLER,
                                TRANSACTION.SELECT_MULTI_COMPONENT_MODAL_VIEW,
                                vm.event,
                                data).then(() => {
                                  // success
                                }, (selectItem) => {
                                  vm.isopenSelectPopup = false;
                                  if (selectItem) {
                                    //set pristine
                                    vm.wizardStep1ComponentInfo.$setPristine();
                                    // url redirect
                                    $state.go($state.current.name, {
                                      //mfgType: vm.mfgTypedata,
                                      coid: selectItem.id
                                    });
                                  }
                                }, (err) => {
                                  vm.isopenSelectPopup = false;
                                  return BaseService.getErrorLog(err);
                                });
                            }
                          }
                        } else {
                          // messsage to supplier/mfr part
                          const messageConstant = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.SEARCHED_PART_MISMATCH_WITH_MFRTYPE);
                          messageConstant.message = stringFormat(messageConstant.message, vm.component ? vm.component.mfgPN : null, vm.mfgTypedata.toUpperCase() === CORE.MFG_TYPE.MFG ? CORE.LabelConstant.MFG.MFGPN : CORE.LabelConstant.MFG.SupplierPN, vm.mfgTypedata.toUpperCase() === CORE.MFG_TYPE.MFG ? CORE.LabelConstant.MFG.SupplierPN : CORE.LabelConstant.MFG.MFGPN, vm.mfgTypedata.toUpperCase() === CORE.MFG_TYPE.MFG ? 'Supplier Parts' : 'Manufacturer Parts');
                          const alertModel = {
                            messageContent: messageConstant
                          };
                          DialogFactory.messageAlertDialog(alertModel);
                          return;
                        }
                      }
                    }
                  }).catch((error) => {
                    $scope.loaderVisible = false;
                    return BaseService.getErrorLog(error);
                  });
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }

      function openErrorListPopup() {
        vm.isopenErrorpopup = true;
        const data = {
          transactionID: vm.transactionID,
          partNumber: vm.component.mfgPN,
          isPartmaster: true
        };
        DialogFactory.dialogService(
          RFQTRANSACTION.API_VERIFICATION_ERROR_CONTROLLER,
          RFQTRANSACTION.API_VERIFICATION_ERROR_VIEW,
          vm.event,
          data).then(() => {
            // success
          }, (data) => {
            removePartStatus();
            vm.isopenErrorpopup = false;
            if (data.iscontinue) {
              vm.getComponentVerification(vm.event, true);
            }
          });
      }

      function removePartStatus() {
        var objRemoval = {
          transactionID: vm.transactionID
        };
        ComponentFactory.removePartStatus().save(objRemoval).$promise.then(() => {
          // success
        }).catch((error) => BaseService.getErrorLog(error));
      }

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

          vm.wizardStep1ComponentInfo.fluxType.$setValidity('isFluxTypeRequired', !isSetToError);

          if (isSetToFocus) {
            setFocusByName('fluxType');
          }
          return true;
        } else {
          vm.wizardStep1ComponentInfo.fluxType.$setValidity('isFluxTypeRequired', true);
          return false;
        }
      }
      /**
       * Open Popup for view sample data of Unit Calculation Sample Data
       * */
      vm.viewUnitCalculationSampleData = () => {
        const usedOperationDet = {
          assyDetail: {
            pidCode: vm.component.PIDCode,
            assyID: vm.cid,
            assyRohsIcon: vm.component.rohsIcon,
            assyRohsName: vm.component.rohsName,
            MFGPN: vm.component.mfgPN
          },
          partType: vm.component.partType,
          IsManufacturer: vm.component.mfgCodemst ? (vm.component.mfgCodemst.mfgType === vm.MFG_TYPE.MFG) : null
          // IsManufacturer: vm.component.mfgCodemst.mfgType
        };
        DialogFactory.dialogService(
          CORE.PART_UNIT_CALCULATION_SAMPLE_DATA_POPUP_CONTROLLER,
          CORE.PART_UNIT_CALCULATION_SAMPLE_DATA_POPUP_VIEW,
          event,
          usedOperationDet).then(() => {
          }, () => {
            // cancel
          });
      };
      /// Method for make main form dirty on change section wise check-box change
      vm.settingRequireCheckBox = () => {
        vm.wizardStep1ComponentInfo.$setDirty();
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

      /* to bind data in grid on load */
      const getLastWONumberByAssyNickname = () => {
        if (vm.component.partType === vm.PartCategory.SubAssembly && vm.cid) {
          vm.cgBusyLoading = ComponentNicknameWOBuildDetailFactory.getLastWOBuildDetByCompNickname().query({
            nickName: vm.component.nickName
          }).$promise.then((respOfWOBuildDet) => {
            vm.lastWONumberByAssyNickname = null;
            if (respOfWOBuildDet && respOfWOBuildDet.status === CORE.ApiResponseTypeStatus.SUCCESS && respOfWOBuildDet.data) {
              vm.lastWONumberByAssyNickname = respOfWOBuildDet.data.lastWONumberByAssyNickname;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      // open work order number build history pop up
      vm.viewWONumberBuildHistory = (event, nickName) => {
        const data = {
          partID: vm.component.id || null,
          assyNickName: nickName
        };
        DialogFactory.dialogService(
          CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_CONTROLLER,
          CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_VIEW,
          event,
          data).then(() => { // Success Section
          }, () => { // Cancel Section
          }, (err) => BaseService.getErrorLog(err));
      };

      // view assembly stock popup
      vm.ViewAssemblyStockStatus = () => {
        const data = {
          partID: vm.component.id,
          mfgPN: vm.component.mfgPN,
          woID: null,
          rohsIcon: vm.component.rohsIcon,
          rohsName: vm.component.rohsName,
          PIDCode: vm.component.PIDCode
        };
        DialogFactory.dialogService(
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
          CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
          event,
          data).then(() => { // Success Section
          }, () => { // Cancel Section
          }, (err) => BaseService.getErrorLog(err));
      };

      vm.changeShelfLife = () => {
        if (!vm.component.isShelfLife && (vm.component.selfLifeDays !== null || vm.component.shelfLifeAcceptanceDays !== null || vm.component.shelfListDaysThresholdPercentage !== null ||
          vm.component.maxShelfLifeAcceptanceDays !== null || vm.component.maxShelfListDaysThresholdPercentage !== null)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.RESET_SHELF_LIFE_DAYS_DATA);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.component.selfLifeDays = null;
              vm.component.shelfLifeAcceptanceDays = null;
              vm.component.shelfListDaysThresholdPercentage = null;
              vm.component.maxShelfLifeAcceptanceDays = null;
              vm.component.maxShelfListDaysThresholdPercentage = null;
            }
          }, () => {
            vm.component.isShelfLife = true;
          });
        }
      };
      vm.changeSelfLifeDays = () => {
        if (vm.component.selfLifeDays) {
          if (vm.component.shelfLifeAcceptanceDays) {
            vm.changeAcceptanceDay();
          } else if (vm.component.shelfListDaysThresholdPercentage) {
            vm.changeAcceptancePercentage();
          }
          if (vm.component.maxShelfLifeAcceptanceDays || vm.component.maxShelfLifeAcceptanceDays) {
            vm.changeMaxAcceptanceDay();
          }
          setMinMaxNumber();
        }
      };
      vm.changeAcceptanceDay = () => {
        vm.component.shelfListDaysThresholdPercentage = vm.component.shelfLifeAcceptanceDays ? getPercentage(vm.component.shelfLifeAcceptanceDays) : null;
        setMinMaxNumber();
      };
      vm.changeAcceptancePercentage = () => {
        vm.component.shelfLifeAcceptanceDays = vm.component.shelfListDaysThresholdPercentage ? getDays(vm.component.shelfListDaysThresholdPercentage) : null;
        setMinMaxNumber();
      };
      vm.changeMaxAcceptanceDay = () => {
        vm.component.shelfLifeAcceptanceDays = vm.component.shelfLifeAcceptanceDays ? vm.component.shelfLifeAcceptanceDays : null;
        vm.component.shelfListDaysThresholdPercentage = vm.component.shelfListDaysThresholdPercentage ? vm.component.shelfListDaysThresholdPercentage : 0;
        vm.component.maxShelfListDaysThresholdPercentage = vm.component.maxShelfLifeAcceptanceDays ? getPercentage(vm.component.maxShelfLifeAcceptanceDays) : null;
        setMinMaxNumber();
      };
      vm.changeMaxAcceptancePercentage = () => {
        vm.component.shelfLifeAcceptanceDays = vm.component.shelfLifeAcceptanceDays ? vm.component.shelfLifeAcceptanceDays : 0;
        vm.component.shelfListDaysThresholdPercentage = vm.component.shelfListDaysThresholdPercentage ? vm.component.shelfListDaysThresholdPercentage : 0;
        vm.component.maxShelfLifeAcceptanceDays = vm.component.maxShelfListDaysThresholdPercentage ? getDays(vm.component.maxShelfListDaysThresholdPercentage) : null;
        setMinMaxNumber();
      };

      const getDays = (percentage) => {
        vm.component.selfLifeDays = vm.component.selfLifeDays ? vm.component.selfLifeDays : null;
        const days = Math.floor(((percentage * vm.component.selfLifeDays) / 100));
        return days ? days : null;
      };
      const getPercentage = (days) => {
        vm.component.selfLifeDays = vm.component.selfLifeDays ? vm.component.selfLifeDays : null;
        const percentage = Number(((days * 100) / vm.component.selfLifeDays).toFixed(8));
        return percentage ? percentage : null;
      };

      const setMinMaxNumber = () => {
        vm.wizardStep1ComponentInfo.shelfLifeAcceptanceDays.$setValidity('maxNumber', true);
        vm.wizardStep1ComponentInfo.maxShelfLifeAcceptanceDays.$setValidity('maxNumber', true);
        if (vm.component.shelfLifeAcceptanceDays && (!vm.component.shelfLifeAcceptanceDays || (vm.component.selfLifeDays < vm.component.shelfLifeAcceptanceDays))) {
          vm.wizardStep1ComponentInfo.shelfLifeAcceptanceDays.$setValidity('maxNumber', false);
        }
        if (vm.component.maxShelfLifeAcceptanceDays && (!vm.component.shelfLifeAcceptanceDays || (vm.component.shelfLifeAcceptanceDays < vm.component.maxShelfLifeAcceptanceDays))) {
          vm.wizardStep1ComponentInfo.maxShelfLifeAcceptanceDays.$setValidity('maxNumber', false);
        }
      };

      /** Set/Remove duplicate validation if RefDes is duplicate */
      vm.checkUniqueOddelyRefDes = () => {
        const checkDuplicate = _.find(vm.component.oddelyRefDesList, (obj) => obj.tempID !== vm.OddelyRefDesDet.tempID && obj.refDes === vm.OddelyRefDesDet.refDes);
        if (checkDuplicate) {
          $scope.$applyAsync(() => {
            vm.wizardStep1ComponentInfo.oddlyRefDes.$setValidity('duplicate', false);
          });
          return false;
        }
        vm.wizardStep1ComponentInfo.oddlyRefDes.$setValidity('duplicate', true);
        return true;
      };
      /** Add/Update Oddly RefDes */
      vm.addOddelyRefDesToList = (event) => {
        let RefDesControl;
        if (event.keyCode === 13) {
          vm.isDisableRefDes = true;
          $timeout(() => {
            if (!vm.OddelyRefDesDet.refDes || !vm.OddelyRefDesDet.refDes.trim()) {
              vm.isDisableRefDes = false;
              setFocus('oddlyRefDes');
              return;
            }
            vm.isDisableRefDes = false;
            if (vm.checkUniqueOddelyRefDes()) {
              const componentRefDes = _.find(vm.component.oddelyRefDesList, (obj) => obj.tempID === vm.OddelyRefDesDet.tempID);
              if (componentRefDes) {
                componentRefDes.oldrefDes = componentRefDes.refDes;
                if (componentRefDes.refDes !== vm.OddelyRefDesDet.refDes.replace(/,/g, '')) {
                  componentRefDes.isEdited = true;
                }
                componentRefDes.refDes = vm.OddelyRefDesDet.refDes.replace(/,/g, '');
                componentRefDes.isRequiredToUpdate = true;
                vm.component.refDesChanged = true;
                RefDesControl = _.find(vm.wizardStep1ComponentInfo.$$controls, (ctrl) => ctrl.$name === 'oddlyRefDesChanged');
                RefDesControl.$setDirty();
              } else {
                vm.component.oddelyRefDesList.push({
                  refDes: vm.OddelyRefDesDet.refDes.replace(/,/g, ''),
                  refComponentID: vm.cid,
                  tempID: (vm.component.oddelyRefDesList.length + 1)
                });
                vm.component.refDesChanged = true;
                RefDesControl = _.find(vm.wizardStep1ComponentInfo.$$controls, (ctrl) => ctrl.$name === 'oddlyRefDesChanged');
                RefDesControl.$setDirty();
              }
              resetOddelyRefDesObj();
              setFocus('oddlyRefDes');
              vm.searchOddlyRefdes(true);
            } else {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ALREADY_EXISTS);
              messageContent.message = stringFormat(messageContent.message, 'Oddly Named RefDes ' + vm.OddelyRefDesDet.refDes);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                resetOddelyRefDesObj();
                setFocus('oddlyRefDes');
              });
            }
            // }
          });
          /** Prevent enter key submit event */
          preventInputEnterKeyEvent(event);
        }
      };

      /** Remove oddly RefDes from list */
      vm.removeRefDesItem = (item) => {
        let RefDesControl;
        vm.component.removeOddelyRefDesIds = vm.component.removeOddelyRefDesIds || [];
        vm.component.removeOddelyRefDes = vm.component.removeOddelyRefDes || [];
        if (item) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'Oddly Named RefDes', '');
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.wizardStep1ComponentInfo.$setDirty(true);
              vm.component.refDesChanged = true;
              RefDesControl = _.find(vm.wizardStep1ComponentInfo.$$controls, (ctrl) => ctrl.$name === 'oddlyRefDesChanged');
              RefDesControl.$setDirty();
              if (item.id > 0) {
                vm.component.removeOddelyRefDesIds.push(item.id);
                vm.component.removeOddelyRefDes.push(item.refDes);
              }
              vm.component.oddelyRefDesList.splice(vm.component.oddelyRefDesList.indexOf(item), 1);
              const numberIndex = _.findIndex(vm.component.oddelyRefDesList, (obj) => obj.refDes === item.refDes);
              $timeout(() => {
                if (numberIndex === -1) {
                  vm.wizardStep1ComponentInfo.oddlyRefDes.$setValidity('duplicate', true);
                }
              });
              //vm.isAddTrackDisable = _.filter(vm.component.oddelyRefDesList, (obj) => !obj.refDes).length > 0;
              _.each(vm.component.oddelyRefDesList, (item, index) => {
                item.tempID = (index + 1);
              });
              setFocus('oddlyRefDes');
              vm.searchOddlyRefdes(false);
            }
          }, () => {
            setFocus('oddlyRefDes');
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      // for search Oddly RefDes
      vm.searchOddlyRefdes = (isReset) => {
        if (isReset) {
          vm.searchText = null;
          vm.component.oddelyRefDesListSearch = vm.component.oddelyRefDesList;
        }
        else {
          vm.component.oddelyRefDesListSearch = _.filter(vm.component.oddelyRefDesList, (x) => x.refDes.toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1);
        }
      };

      /** Edit RefDes */
      vm.editrefDesItem = (item) => {
        vm.OddelyRefDesDet = angular.copy(item);
        setFocus('oddlyRefDes');
      };
      vm.checkCopyStatus = () => { vm.copystatus = false; };
      vm.copyrefDesItem = ($event, item) => { $event.stopPropagation(); copyTextForWindow(item); vm.copystatus = true; };
      // to reset current Ref des
      vm.resetOddelyRefDes = () => {
        resetOddelyRefDesObj();
      };
      // to reset re-set Ref des Object
      const resetOddelyRefDesObj = () => {
        vm.OddelyRefDesDet = {
          refDes: null
        };
        if (vm.wizardStep1ComponentInfo) {
          vm.wizardStep1ComponentInfo.oddlyRefDes.$setValidity('duplicate', true);
        }
      };
      resetOddelyRefDesObj();
      // Get Oddely ref Des list
      vm.getOddelyRefDesList = (cid) => {
        if (cid) {
          return ComponentFactory.getOddelyRefDesList().query({ id: cid }).$promise.then((resOddRefDes) => {
            if (resOddRefDes && resOddRefDes.data) {
              vm.component.oddelyRefDesList = resOddRefDes.data;
              _.each(vm.component.oddelyRefDesList, (item, index) => {
                item.tempID = (index + 1);
              });
              vm.searchOddlyRefdes(true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.viewAddAliasToolTip = (isDisableFeatureBtn) => stringFormat(CORE.ADD_ALIAS_PART, isDisableFeatureBtn ? '' : CORE.LabelConstant.ConditionalFeatureEnableToolTip);
    }
  }
})();
