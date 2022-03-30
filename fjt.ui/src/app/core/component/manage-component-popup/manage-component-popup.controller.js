(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ManageComponentPopupController', ManageComponentPopupController);

  /** @ngInject */
  function ManageComponentPopupController($q, $scope, $timeout, $filter, data, USER, CORE, DialogFactory, ManageMFGCodePopupFactory, ComponentFactory, BaseService, MasterFactory, RFQSettingFactory, $window, UnitFactory, socketConnectionService, TRANSACTION, RFQTRANSACTION, APIVerificationErrorPopupFactory, PartCostingFactory, AssyTypeFactory) {
    var vm = this;
    $scope.loaderVisible = undefined;
    vm.timeoutWatch;
    vm.maxMPNLength = CORE.MAX_MPN_LENGTH;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.COMPONENT_ROHS_DEVIATION_TOOLTIP_MESSAGE = CORE.COMPONENT_ROHS_DEVIATION_TOOLTIP_MESSAGE;
    vm.CUSTOMER_PART_CPN_TOOLTIP_MESSAGE = CORE.CUSTOMER_PART_CPN_TOOLTIP_MESSAGE;
    vm.PART_TYPE_TOOLTIP_MESSAGE = CORE.PART_TYPE_TOOLTIP_MESSAGE;
    vm.COMPONENT_CLOUD_API_UPDATE_SWITCH_TOOLTIP_MESSAGE = CORE.COMPONENT_CLOUD_API_UPDATE_SWITCH_TOOLTIP_MESSAGE;
    vm.PIDCodeMultipleHyphenMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMP_MULTIPLE_HYPHEN_IN_PID_CODE_NOT_ALLOWED);
    vm.PartCorrectList = CORE.PartCorrectList;
    vm.CorePartStatusList = CORE.PartStatusList;
    vm.mfgCodeDetail = [];
    vm.isDisableGoodPart = false;
    vm.isDisableMFGCode = false;
    vm.isDisableSupplierMFGCode = false;
    vm.isDisableSupplierMFGPN = false;
    vm.isDisableCategory = false;
    vm.isDisablefunctionalType = false;
    vm.isDisableMountingType = false;
    vm.isCPNPartEntry = data.isCPNPartEntry;
    vm.isCustomPartEntry = data.isCustomPartEntry;
    let selectedMFGCode = null;
    let selectedMfg;
    vm.PartCategory = CORE.PartCategory;
    vm.PartType = CORE.PartType;
    vm.businessRisk = CORE.BusinessRisk;
    vm.rohsDeviation = CORE.RoHSDeviation;
    vm.rohsMainCategory = CORE.RoHSMainCategory;
    vm.partCategoryID = null;
    vm.distType = CORE.MFGTypeDropdown.find((x) => x.Key === 'DIST').Value;
    vm.type = CORE.MFG_TYPE.DIST;
    vm.mfgType = data ? data.mfgType : null;
    vm.category = data ? data.category : null;
    vm.customerID = data ? data.customerID : null;
    vm.mountingTypeName = data ? data.mountingTypeName : null;
    vm.rfqOnlyEntry = data ? data.rfqOnlyEntry : null;
    vm.defaultMountingTypeID = null;
    vm.headerdata = [];
    vm.IsSupplier = true;
    vm.PIDCodeLength = null;
    vm.IsManufacturer = false;
    vm.mfgCodeCharacterCount = 5;
    window.setTimeout(() => {
      $('.mfg-popup-width').focus();
    });
    vm.isBadPart = data.isBadPart;
    vm.isDisableGoodPart = data.isBadPart ? true : false;
    vm.isDisableCategory = vm.category ? true : false;
    vm.isDisablefunctionalType = data.functionalCategoryID ? true : false;
    vm.isDisableMountingType = data.mountingTypeID ? true : (vm.mountingTypeName ? true : false);
    vm.isReadOnly = false;
    vm.todayDate = new Date();
    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }
    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        let pageRight = {};
        const routeState = vm.mfgType === vm.type ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
        pageRight = pageList.find((a) => a.PageDetails && (a.PageDetails.pageRoute === routeState));
        vm.isReadOnly = pageRight && pageRight.RO ? true : false;
      }
    }
    vm.paraMfgPN = (data && data.Name) ? (vm.category != vm.PartCategory.Component ? data.Name.toUpperCase() : data.Name) : null;
    if (vm.paraMfgPN) {
      vm.headerdata = [
        {
          label: (vm.mfgType == vm.type ? vm.LabelConstant.MFG.SupplierPN : vm.LabelConstant.MFG.MFGPN),
          value: vm.paraMfgPN,
          displayOrder: 1,
          labelLinkFn: null,
          valueLinkFn: null,
          valueLinkFnParams: null,
          isCopy: true,
          copyParams: null,
          imgParms: null
        }];
    }
    if (!data || !data.mfgType) {
      DialogFactory.closeDialogPopup();
      return;
    }
    if (vm.mfgType) {
      vm.IsSupplier = vm.mfgType === CORE.MFG_TYPE.DIST;
      vm.IsManufacturer = vm.mfgType === CORE.MFG_TYPE.MFG;
    }
    _.each(vm.rohsDeviation, (item) => {
      item.isDeleted = false;
    });
    vm.component = {
      mfgcodeID: data.parentId != null ? data.parentId : null,
      mfgPN: vm.paraMfgPN,
      custAssyPN: (vm.category != vm.PartCategory.Component || data.isCPNPartEntry) ? ((data && data.Name) ? data.Name.toUpperCase() : null) : null,
      isGoodPart: vm.isBadPart == null ? vm.PartCorrectList.CorrectPart : vm.isBadPart,
      category: vm.category ? vm.category : vm.PartCategory.Component,
      isCustom: (vm.category == vm.PartCategory.SubAssembly || data.isCPNPartEntry || data.isCustomPartEntry) ? true : false,
      isCPN: data.isCPNPartEntry != null ? data.isCPNPartEntry : false,
      rfqOnly: data.rfqOnlyEntry != null ? data.rfqOnlyEntry : false,
      functionalCategoryID: data.functionalCategoryID ? data.functionalCategoryID : null,
      mountingTypeID: data.mountingTypeID ? data.mountingTypeID : null,
      unit: 1,
      businessRisk: null,
      supplierMfgCodeId: (vm.IsSupplier && (data.supplierMfgCodeId || data.supplierMfgCodeId == 0)) ? data.supplierMfgCodeId : null,
      refSupplierMfgpnComponentID: (vm.IsSupplier && (data.supplierMfgPnID || data.supplierMfgPnID == 0)) ? data.supplierMfgPnID : null,
      umidVerificationRequire: false,
      isAutoVerificationOfAllAssemblyParts: false,
      trackSerialNumber: false,
      uom: null,
      packageQty: 1,
      umidSPQ: 1,
      uomClassID: null,
      mfgPNDescription: data.description,
      isFluxNotApplicable: true
    };
    vm.component.isCloudApiUpdateAttribute = (vm.category == vm.PartType.Other || vm.component.isCustom || vm.component.isCPN) ? false : true;

    function getAllRights() {
      vm.allowIncorrectPartCreation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowIncorrectPartCreation);
      if ((vm.allowIncorrectPartCreation == null || vm.allowIncorrectPartCreation == undefined)
        && reTryCount < _configGetFeaturesRetryCount) {
        getAllRights(); //put for hard reload option as it will not get data from feature rights
        reTryCount++;
      }
    }
    $timeout(() => {
      getAllRights();
    });

    function getPIDCode() {
      vm.PIDCodeLength = null;
      return ComponentFactory.getComponentPIDCode().query({}).$promise.then((res) => {
        // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 16/02/2021)
        $timeout(() => {
          vm.PIDCodeLength = res.data ? res.data.values : 0;
        });
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    const getEpicoreType = (item) => {
      if (item) {
        vm.component.epicorType = item.epicorType;
      }
    };
    //Get Assembly List
    function getAssyTypeList() {
      return AssyTypeFactory.getAssyTypeList().query().$promise.then((response) => {
        vm.assyTypeList = [];
        if (response && response.data) {
          vm.assyTypeList = _.filter(response.data, (item) => { return item.isActive });
        }
        return $q.resolve(vm.assyTypeList);
      }).catch((error) => BaseService.getErrorLog(error));
    }
    function getSupplierMfgCodeSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        if (searchObj.mfgcodeID != null) {
          $timeout(() => {
            if (vm.autoCompleteSupplierMfgCode && vm.autoCompleteSupplierMfgCode.inputName) {
              $scope.$broadcast(vm.autoCompleteSupplierMfgCode.inputName, mfgcodes.data[0]);
            }
          });
        }
        vm.supplierMfgCodeDetail = (mfgcodes && mfgcodes.data) ? mfgcodes.data : {};
        return mfgcodes.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    const getSupplierComponentMfg = (item) => {
      if (item && item.mfgType == CORE.MFG_TYPE.MFG) {
        vm.autoCompleteSupplierMfgCode.keyColumnId = item.id;
        vm.isSupplierMfgPnEnabled = true;
      }
      else {
        vm.autoCompleteSupplierMfgCode.keyColumnId = vm.autoCompleteSupplierMfgCode.keyColumnId || null;
        vm.isSupplierMfgPnEnabled = false;
      }
    };
    const getUomClassList = () => {
      return UnitFactory.getMeasurementTypeList().query().$promise.then((res) => {
        vm.uomClassList = [];
        if (res && res.data) {
          vm.uomClassList = _.filter(res.data, (item) => { return item.isActive });
        }
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    /* unit dropdown fill up */
    const getUomlist = () => {
      return ComponentFactory.getUOMsList().query({
        measurementTypeID: vm.component ? vm.component.uomClassID : null
      }).$promise.then((res) => {
        vm.uomlist = (res && res.data) ? res.data : [];
        if (vm.autoCompleteuom && vm.component.uom && (vm.component.uomClassID || vm.component.uomClassID == 0)) {
          getUOM({
            id: vm.component.uom
          });
        }
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    const getUOMClass = (item) => {
      if (item) {
        /*let selectedUOMClass = _.find(vm.uomClassList, (u) => {
          return u.id == item.id
        });
        vm.component.uomClassID = selectedUOMClass ? selectedUOMClass.id : null;*/
        vm.component.uomClassID = item ? item.id : null;
        getUomlist();
      }
      else {
        vm.component.uomClassID = null;
        vm.uomlist = [];
        vm.component.uom = null;
        vm.autoCompleteuom.keyColumnId = null;
      }
    };
    /* binding values in view mode - UOM*/
    const getUOM = (item) => {
      if (item) {
        let selectedUOM = _.find(vm.uomlist, (u) => {
          return u.id == item.id
        });
        vm.component.selectedUOMTxt = selectedUOM ? selectedUOM.unitName : '';
        vm.autoCompleteuom.keyColumnId = item.id;
      }
      else {
        vm.component.selectedUOMTxt = null;
      }
    };
    //oncallback function for autocomplete
    //bind selected value of packaging
    const getSelectedPackaging = (item) => {
      if (item) {
        vm.component.packaging = item.name;
        vm.component.packagingID = item.id;
        vm.component.component_packagingmst = item;
      }
      else {
        vm.component.packaging = null;
        vm.component.packagingID = null;
        vm.component.component_packagingmst = {};
      }
    };
    //used to get all RoHS list for autocomplete
    function getRohsList() {
      return MasterFactory.getRohsList().query().$promise.then((requirement) => {
        vm.RohsList = (requirement && requirement.data) ? _.filter(requirement.data, (item) => { return item.isActive }) : [];
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //used to get all packaging list for autocomplete
    const getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingList = packaging.data;
      }
      return vm.packagingList;
    }).catch((error) => BaseService.getErrorLog(error));

    const getGenericCategoryList = () => RFQSettingFactory.getPartStatusList().query().$promise.then((partstatus) => {
      vm.partStatusList = (partstatus && partstatus.data) ? _.filter(partstatus.data, (item) => { return item.isActive }) : [];
      return partstatus.data;
    }).catch((error) => BaseService.getErrorLog(error));
    //get MFG part for Supplier auto-complete-serach
    /*function getSupplierMFGSearch(searchObj) {
      return ComponentFactory.getSupplierMFGPNSearch().query({ listObj: searchObj }).$promise.then((component) => {
        if (searchObj && searchObj.id) {
          $timeout(() => {
            if (vm.autoCompleteSupplierMfgPN)
              $scope.$broadcast(vm.autoCompleteSupplierMfgPN.inputName, component.data.data[0]);
          });
        }
        vm.supplierMfgPNList = (component.data.data && component.data && component.data.data) ? component.data.data : [];
        return component.data.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }*/

    function setDataOnCorrectPartAndSupplierMfrPN(item, isOpenPopuCase) {
      if (item) {
        vm.component.RoHSStatusID = item.RoHSStatusID;
        vm.autoCompleteRohsStatus.keyColumnId = item.RoHSStatusID;
        if (vm.mfgTypedata === vm.distType || isOpenPopuCase) {
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
        vm.component.isNoClean = item.isNoClean ? true : false;
        vm.component.isWaterSoluble = item.isWaterSoluble ? true : false;
        vm.component.isFluxNotApplicable = item.isFluxNotApplicable ? true : (!item.isNoClean && !item.isWaterSoluble && !item.isFluxNotApplicable ? true : false);
        vm.component.mfgPNDescription = item.mfgPNDescription;
        vm.component.detailDescription = item.detailDescription;
        vm.component.partPackage = item.partPackage;
        vm.component.isHazmatMaterial = item.isHazmatMaterial ? true : false;
        if (vm.IsSupplier && item.isCustom && !isOpenPopuCase) {
          vm.component.isCustom = true;
        }
        setFluxTypeValue(false, false);
      }
    }

    const getSupplierMfgPNDetails = (item) => {
      if (item) {
        setDataOnCorrectPartAndSupplierMfrPN(item);
      }
    };

    // Get part category master list
    function getPartCategoryMstList() {
      return MasterFactory.getPartCategoryMstList().query().$promise.then((response) => {
        if (response && response.data) {
          vm.categoryList = response.data.map((item) => {
            return {
              id: item.id,
              Value: item.categoryName,
              partCategory: item.partCategory,
              epicorType: item.epicorType
            };
          });
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

    /* mountingType dropdown fill up */
    const getMountingTypeList = () => {
      return ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
        vm.mountingTypeList = (res && res.data) ? _.filter(res.data, (item) => { return item.isActive }) : [];
        if (vm.mountingTypeName && !vm.component.mountingTypeID) {
          const defaultMountingType = _.find(vm.mountingTypeList, (mountingTypeItem) => {
            return mountingTypeItem.name == vm.mountingTypeName;
          });
          if (defaultMountingType) {
            vm.component.mountingTypeID = defaultMountingType ? defaultMountingType.id : null;
            vm.isDisableMountingType = true;
          }
        }
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const getmountingTypeID = (item) => {
      if (item) {
        vm.component.mountingTypeID = item.id;
        vm.autoCompleteMountingType.keyColumnId = item.id;
        if (item.isCountTypeEach) {
          const uomEach = _.find(vm.uomlist, (m) => {
            return m.unitName == 'EACH';
          });
          if (uomEach) {
            vm.autoCompleteuom.keyColumnId = uomEach.id;
          }
        }
      }
      else {
        vm.component.mountingTypeID = null;
      }
    };
    /*get list of Package Case Type list from DB to bing with autocomplete on UI*/
    const getPackageCaseTypeList = () => {
      return ComponentFactory.getPackageCaseTypeList().query().$promise.then((res) => {
        vm.packageCaseTypeList = (res && res.data) ? _.filter(res.data, (item) => { return item.isActive }) : [];
        return res.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    const getPackageCaseType = (item) => {
      if (item) {
        vm.component.partPackageID = item.id;
        vm.autoCompletePackageCaseType.keyColumnId = item.id;
      }
      else {
        vm.component.partPackageID = null;
      }
    };
    /* Part Type dropdown fill up */
    const getPartTypeList = () => ComponentFactory.getPartTypeList().query().$promise.then((res) => {
      vm.partTypeList = (res && res.data) ? _.filter(res.data, (item) => { return item.isActive }) : [];
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const getPartTypeID = (item) => {
      if (item) {
        vm.autoCompletePartType.keyColumnId = item.id;
      }
    };
    /* connecterType dropdown fill up */
    const connecterType = () => ComponentFactory.getConnecterTypeList().query().$promise.then((res) => {
      vm.connecterTypeList = (res && res.data) ? _.filter(res.data, (item) => { return item.isActive }) : [];
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    /* retrieve component detail by id CPN Part Add from CPN Tab*/
    const componentDetailsById = (cid) => {
      if (cid) {
        return ComponentFactory.component().query({
          id: cid
        }).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataOnCorrectPartAndSupplierMfrPN(response.data, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const autocompletePromise = [getPIDCode(), getRohsList(), getGenericCategoryList(), getPartCategoryMstList(), getPartTypeList(), getUomClassList(), getUomlist(), getMountingTypeList(), getPackageCaseTypeList(), connecterType(), getEpicorTypeList(), getPackaging(), getAssyTypeList()];

    if (vm.component.mfgcodeID != null) {
      autocompletePromise.push(getMfgSearch({ mfgcodeID: vm.component.mfgcodeID }));
    }
    else if (vm.customerID) {
      autocompletePromise.push(getMfgSearch({ mfgcodeID: vm.customerID }));
    }
    if (vm.component.supplierMfgCodeId || vm.component.supplierMfgCodeId == 0) {
      autocompletePromise.push(getSupplierMfgCodeSearch({ mfgcodeID: vm.component.supplierMfgCodeId }));

      if (vm.component.refSupplierMfgpnComponentID || vm.component.refSupplierMfgpnComponentID == 0) {
        autocompletePromise.push(getAliasSearch(
          {
            mfgcodeID: vm.component.supplierMfgCodeId,
            id: vm.component.refSupplierMfgpnComponentID,
            inputName: null //vm.autoCompleteSupplierMfgPN.inputName intentionally left null due to search before define auto complete
          },
          true
        ));
      }
    }

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
      vm.autoCompletemfgCode.keyColumnId = data.parentId;
      const obj = _.find(vm.mfgCodeDetail, (item) => { return item.mfg == data.mfgCode });
      if (obj) {
        vm.autoCompletemfgCode.keyColumnId = obj.id;
      }
      if ((vm.component.mfgcodeID != null || vm.customerID != null) && vm.autoCompletemfgCode) {
        selectedMfg = vm.mfgCodeDetail[0];
        $timeout(() => {
          if (vm.autoCompletemfgCode) {
            vm.isDisableMFGCode = true;
            $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMfg);
          }
        });
      }
      if (vm.component.supplierMfgCodeId || vm.component.supplierMfgCodeId == 0) {
        vm.autoCompleteSupplierMfgCode.keyColumnId = vm.component.supplierMfgCodeId;
        const objSupplierMfg = _.find(vm.supplierMfgCodeDetail, (item) => { return item.id == vm.component.supplierMfgCodeId });
        if (objSupplierMfg) {
          vm.isDisableSupplierMFGCode = true;
          vm.autoCompleteSupplierMfgCode.keyColumnId = objSupplierMfg.id;
          $timeout(() => {
            if (vm.autoCompleteSupplierMfgCode) {
              $scope.$broadcast(vm.autoCompleteSupplierMfgCode.inputName, objSupplierMfg);
              if (vm.component.refSupplierMfgpnComponentID || vm.component.refSupplierMfgpnComponentID == 0) {
                vm.autoCompleteSupplierMfgPN.keyColumnId = vm.component.refSupplierMfgpnComponentID;
                const objSupplierMfgPN = _.find(vm.supplierMfgPNList, (item) => { return item.id == vm.component.refSupplierMfgpnComponentID });
                if (objSupplierMfgPN) {
                  vm.isDisableSupplierMFGPN = true;
                  vm.autoCompleteSupplierMfgPN.keyColumnId = objSupplierMfgPN.id;
                  $timeout(() => {
                    if (vm.autoCompleteSupplierMfgPN) {
                      $scope.$broadcast(vm.autoCompleteSupplierMfgPN.inputName, objSupplierMfgPN);
                    }
                  });
                }
              }
            }
          });
        }
      }

      if (data && data.autoExternalAPICall) {
        vm.getComponentVerification(null, false);
      }

      $timeout(() => {
        BaseService.focusOnFirstEnabledField(vm.AddMfgCodeForm);
        vm.popupLoadingCompleted = true;
        if (data && data.refComponentId) {
          componentDetailsById(data.refComponentId);
        }
      }, _configTimeout);
    }).catch((error) => BaseService.getErrorLog(error));

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

    // generate PIDCode
    const generatePIDCode = (isCheck) => {
      const PIDCodeLength = (vm.selectedMfgType == vm.distType) ? CORE.PIDCODELENGTH.DISTY : vm.PIDCodeLength;
      var mfgCode = getSelectedMFGDetails();
      if (mfgCode) {
        if (vm.partCategoryID === vm.PartCategory.SubAssembly) {
          //return $filter('limitTo')((mfgCode.mfg + '' + (vm.component.assyCode || '') + ' Rev' + (vm.component.rev || '')), PIDCodeLength, 0);
          //return $filter('limitTo')((vm.component.nickName) + " Rev" + (vm.component.rev || ''), PIDCodeLength, 0);
          const PidCode = ((vm.component.nickName ? vm.component.nickName.trim() : '') + ' Rev' + (vm.component.rev ? vm.component.rev.trim() : ''));
          if (!isCheck) {
            vm.component.PIDCodePrefix = '';
            vm.component.PIDCodeSufix = PidCode;
          }
          return PidCode;
        } else {
          vm.generateMfgPN();
          if (!isCheck) {
            vm.component.PIDCodePrefix = mfgCode.mfgCode + '+';
            vm.component.PIDCodeSufix = vm.component.mfgPN ? vm.component.mfgPN.trim() : '';
          }
          //return $filter('limitTo')(mfgCode.mfg + "+" + (vm.component.mfgPN || ''), PIDCodeLength, 0);
          // return (mfgCode.mfg + "+" + (vm.component.mfgPN || ''));
          return (mfgCode.mfgCode + '+' + (vm.component.mfgPN ? vm.component.mfgPN.trim() : ''));
        }
      }
      else {
        vm.component.PIDCodePrefix = '';
        return '';
      }
    };

    vm.changePN = (mfgPN) => {
      $scope.$parent.$parent.vm.componentPN(mfgPN);
      vm.changePIDCode();
    };

    // change PID Code
    vm.changePIDCode = () => {
      vm.component.PIDCode = generatePIDCode();
      vm.isAssyPNORRevChange = true;
    };

    // generate Asy Code
    vm.changeAssyCode = () => {
      var mfgCode = getSelectedMFGDetails();
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

    vm.generateMfgPN = () => {
      if (vm.isMfgPnDisabled()) {
        //let MfgPNLength = 100;
        if (vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly) {
          //vm.component.mfgPN = $filter('limitTo')((vm.component.custAssyPN ? vm.component.custAssyPN.trim() : '') + " Rev" + (vm.component.rev ? vm.component.rev.trim() : ''), MfgPNLength, 0);
          vm.component.mfgPN = ((vm.component.custAssyPN ? vm.component.custAssyPN.trim() : '') + ' Rev' + (vm.component.rev ? vm.component.rev.trim() : ''));
        }
      }
    };

    vm.isMfgPnDisabled = () => vm.autoCompleteCategory && (vm.component.isCustom || vm.component.isCPN || vm.partCategoryID == vm.PartCategory.SubAssembly) ? true : false;

    vm.revisionChange = () => {
      vm.isAssyPNORRevChange = true;
      vm.generateMfgPN();
      vm.changePIDCode();
    };

    // start component good/bad part region
    function getComponentGoodBadPartDetail(item) {
      if (item) {
        /*vm.component.RoHSStatusID = item.RoHSStatusID;
        vm.autoCompleteRohsStatus.keyColumnId = item.RoHSStatusID;
        vm.autoCompletePart.keyColumnId = item.partStatus;
        vm.autoCompletePartType.keyColumnId = item.functionalCategoryID;
        vm.autoCompleteMountingType.keyColumnId = item.mountingTypeID;
        vm.autoCompletePackageCaseType.keyColumnId = item.partPackageID;
        vm.component.uomClassID = item.uomClassID;
        vm.autoCompleteUomClass.keyColumnId = item.uomClassID;
        vm.component.uom = item.uom;
        vm.autoCompleteuom.keyColumnId = item.uom;*/

        setDataOnCorrectPartAndSupplierMfrPN(item);
        vm.autoCompleteSupplierMfgCode.keyColumnId = item.refMfgPNMfgCodeId;
        vm.autoCompleteSupplierMfgPN.keyColumnId = item.refSupplierMfgpnComponentID;
        vm.correctedPartDetail = {
          partID: item ? item.id : null,
          PIDCode: item ? item.PIDCode : null,
          isCustom: item ? item.isCustom : null,
          rohsIcon: item ? stringFormat('{0}{1}{2}', _configWebUrl, USER.ROHS_BASE_PATH, item.rohsIcon) : null,
          rohsName: item ? item.rohsName : null,
          isGoodPart: item ? item.isGoodPart : false
        };

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


        $scope.ComponentGoodBadPart = item;
      }
    }
    vm.obsoleteDateChanged = () => {
      vm.obsoleteDateOptions = {
        maxDate: vm.todayDate,
        obsoleteDateOpenFlag: false
      };
    };
    vm.setROHSComplientDataForAutoComplete = (item) => {
      vm.component.RoHSStatusID = (item && item.id) ? item.id : null;

      if (item && item.refMainCategoryID != USER.RoHSMainCategoryId) {
        vm.component.isRohs = true;
      }
      else if (item && item.refMainCategoryID == USER.NonRoHSMainCategoryId) {
        vm.component.isRohs = false;
      }
      else {
        vm.component.isRohs = false;
      }

      vm.setRoHSDeviation();
    };
    vm.setRoHSDeviation = () => {
      vm.refMainCategoryID = undefined;
      if (vm.partCategoryID == vm.PartCategory.SubAssembly && (vm.component.RoHSStatusID || vm.component.RoHSStatusID == 0)) {
        const selectedRoHS = _.find(vm.RohsList, (m) => {
          return m.id == vm.component.RoHSStatusID;
        });
        _.each(vm.rohsDeviation, (item) => {
          item.isDeleted = false;
        });
        if (selectedRoHS) {
          vm.refMainCategoryID = selectedRoHS.refMainCategoryID;
          switch (vm.refMainCategoryID) {
            case vm.rohsMainCategory.RoHS:
              {
                _.each(vm.rohsDeviation, (item) => {
                  if (item.id === -3) {
                    item.isDeleted = true;
                  }
                });
                vm.component.rohsDeviation = -1;
              }
              break;
            case vm.rohsMainCategory.NonRoHS:
              {
                vm.component.rohsDeviation = -3;
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

    const getconnecterType = (item) => {
      if (item) {
        vm.component.connecterTypeID = item.id;
        vm.autoCompleteConnecterType.keyColumnId = item.id;

        const selectedConnecterType = _.find(vm.connecterTypeList, (m) => {
          return m.id == item.id;
        });

        vm.component.selectedConnecterTxt = selectedConnecterType ? selectedConnecterType.name : '';
      }
      else {
        vm.component.connecterTypeID = null;
        vm.component.selectedConnecterTxt = '';
      }
    };

    function initAutoComplete() {
      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        parentColumnName: 'mfgCodeAlias',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'mfgCode',
        placeholderName: stringFormat('Search {0} code and add', (vm.mfgType == vm.type ? 'Supplier' : vm.mfgType)),
        isRequired: true,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        addData: { mfgType: vm.mfgType },
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          selectedMFGCode = item;
          vm.autoCompletemfgCode.keyColumnId = selectedMFGCode ? selectedMFGCode.id : null;
          vm.selectedMfgType = item ? item.mfgType : null;
          vm.component.PIDCodePrefix = item ? item.mfgCode + '+' : null;
          vm.mfgCodeCharacterCount = item ? (item.mfgCode.length + 1) : 5;
          vm.component.mfgType = item ? item.mfgType : null;
          vm.changePIDCode();
          vm.changeAssyCode();

          const pidCode = angular.copy(vm.PIDCodeLength);
          vm.PIDCodeLength = null;
          // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 16/02/2021)
          $timeout(() => {
            vm.PIDCodeLength = pidCode ? pidCode : vm.PIDCodeLength;
            vm.changePIDCode();
          });
          vm.isAssyPNORRevChange = true;
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemfgCode.inputName,
            type: data ? data.mfgType : null
          };
          return getMfgSearch(searchObj);
        }
      };
      vm.autoCompleteRohsStatus = {
        columnName: 'name',
        controllerName: CORE.MANAGE_ROHS_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_ROHS_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: USER.RoHSStatusID,
        inputName: 'rohsComplient',
        placeholderName: 'RoHS Status',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ROHS_STATE],
          pageNameAccessLabel: CORE.PageName.rohs_status
        },
        callbackFn: getRohsList,
        onSelectCallbackFn: vm.setROHSComplientDataForAutoComplete
      };
      vm.autoCompleteGoodBadPart = {
        columnName: 'mfgPN',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: null,
        inputName: 'Recommended Part',
        placeholderName: 'Search text or Add',
        isRequired: vm.component.isGoodPart != vm.PartCorrectList.CorrectPart ? true : false,
        addData: { mfgType: vm.mfgType },
        callbackFn: function (obj) {
          const searchObj = {
            id: obj.id,
            mfgType: vm.mfgType,
            inputName: vm.autoCompleteGoodBadPart.inputName,
            isGoodPart: vm.PartCorrectList.CorrectPart//!vm.component.isGoodPart
          };
          return getAliasSearch(searchObj);
        },
        isAddnew: true,
        onSelectCallbackFn: getComponentGoodBadPartDetail,
        onSearchFn: function (query) {
          const searchObj = {
            mfgType: vm.mfgType,
            query: query,
            inputName: vm.autoCompleteGoodBadPart.inputName,
            isGoodPart: vm.PartCorrectList.CorrectPart//!vm.component.isGoodPart
          };
          return getAliasSearch(searchObj);
        }
      };
      vm.autoCompleteCategory = {
        columnName: 'Value',
        keyColumnName: 'id',
        keyColumnId: vm.component.category,
        inputName: 'Type',
        placeholderName: 'Part Type',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: function (item) {
          vm.partCategoryID = item ? item.partCategory : null;
          vm.categoryId = item ? item.id : null;
          vm.component.epicorType = item ? item.epicorType : null;
          vm.autoCompleteEpicorType.keyColumnId = vm.component.epicorType ? vm.component.epicorType : null;

          if (vm.categoryId === vm.PartType.Other) {
            vm.component.isCustom = false;
            vm.component.isCPN = false;
          }
          if (vm.partCategoryID === vm.PartCategory.Component) {
            vm.component.rfqOnly = false;
          }

          if (vm.partCategoryID === vm.PartCategory.SubAssembly || vm.component.isCPN) {
            if (!vm.IsSupplier) {
              vm.component.isCustom = true;
            }
          }
          else {
            vm.component.nickName = '';
            vm.component.assyCode = '';
            vm.component.rev = '';
            vm.component.custAssyPN = '';
            vm.component.mfgPN = (data && data.Name) ? data.Name : '';
            $scope.$broadcast(vm.autoCompleteAssemblyType.inputName, null);
            $scope.$broadcast(vm.autoCompleteAssemblyType.inputName + 'searchText', null);
          }
          vm.setRoHSDeviation();
          vm.changePIDCode();
          vm.changeAssyCode();
          if (vm.popupLoadingCompleted) {
            vm.clearPartNoAndRev();
          }
          vm.component.isCloudApiUpdateAttribute = (vm.categoryId === vm.PartType.Other || vm.component.isCustom || vm.component.isCPN) ? false : true;
          const pidCode = angular.copy(vm.PIDCodeLength);
          vm.PIDCodeLength = null;

          if (pidCode) {
            // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 02/07/2021)
            $timeout(() => {
              vm.PIDCodeLength = pidCode ? pidCode : vm.PIDCodeLength;
            });
          }
        }
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
        inputName: 'PartAssyType',
        placeholderName: 'Assy Type',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_ASSYTYPE_STATE],
          pageNameAccessLabel: CORE.PageName.assy_type
        },
        callbackFn: getAssyTypeList,
        onSelectCallbackFn: null
      };
      vm.autoCompleteSupplierMfgCode = {
        columnName: 'mfgCodeName',
        parentColumnName: 'mfgCodeAlias',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.component.supplierMfgCodeId ? vm.component.supplierMfgCodeId : null,
        inputName: 'refSupplierMfgCode',
        placeholderName: `Search ${vm.LabelConstant.MFG.MFG} code and add`,
        isRequired: vm.IsSupplier,
        isUppercaseSearchText: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG
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
      vm.autoCompleteSupplierMfgPN = {
        columnName: 'orgMfgPN',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.refSupplierMfgpnComponentID : null,
        inputName: vm.LabelConstant.MFG.MFGPN,
        placeholderName: vm.LabelConstant.MFG.MFGPN,
        isRequired: vm.IsSupplier,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG
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
        callbackFn: connecterType,
        onSelectCallbackFn: getconnecterType
      };

      //find active part status id from list
      let defaultPartStatus = null;
      if (!vm.component.partStatus) {
        defaultPartStatus = _.find(vm.partStatusList, (partItem) => {
          return partItem.name == CORE.ActiveText;
        });
      }
      vm.autoCompletePart = {
        columnName: 'name',
        controllerName: USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: defaultPartStatus ? defaultPartStatus.id : null,
        inputName: CategoryTypeObjList.PartStatus.Name,
        addData: { headerTitle: CategoryTypeObjList.PartStatus.Title },
        placeholderName: CategoryTypeObjList.PartStatus.Title,
        isRequired: true,
        isAddnew: true,
        callbackFn: getGenericCategoryList
      };

      vm.autoCompletePartType = {
        columnName: 'partTypeName',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.component ? vm.component.functionalCategoryID : null,
        inputName: 'Functional Category',
        placeholderName: 'Functional Type',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PART_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.funtional_type
        },
        callbackFn: getPartTypeList,
        onSelectCallbackFn: getPartTypeID
      };

      //find mounting type id from list
      if (vm.component && (vm.component.mountingTypeID == null || vm.component.mountingTypeID == undefined)
        && vm.partCategoryID == vm.PartCategory.SubAssembly) {
        const defaultMountingType = _.find(vm.mountingTypeList, (mountingTypeItem) => {
          return mountingTypeItem.name == CORE.MountingTypeAssembly;
        });
        vm.defaultMountingTypeID = defaultMountingType ? defaultMountingType.id : null;
      }
      else {
        vm.defaultMountingTypeID = vm.component ? vm.component.mountingTypeID : null;
      }
      vm.autoCompleteMountingType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.defaultMountingTypeID,
        inputName: 'Mounting Type',
        placeholderName: 'Mounting Type',
        isRequired: true,
        isAddnew: true,
        callbackFn: getMountingTypeList,
        onSelectCallbackFn: getmountingTypeID
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

      let defaultUOM = null;
      if (!vm.component.uom) {
        defaultUOM = _.find(vm.uomlist, (item) => {
          return item.id == CORE.UOM_DEFAULTS.EACH.ID;
        });
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

      //find RoHS id from list
      if (vm.component.RoHSStatusID == null || vm.component.RoHSStatusID == undefined) {
        const defaultRoHS = _.find(vm.RohsList, (rohsItem) => {
          return rohsItem.name == CORE.RoHSText;
        });
        vm.component.RoHSStatusID = defaultRoHS ? defaultRoHS.id : null;
      }
    };

    function getMfgSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        if (mfgcodes && mfgcodes.data) {
          if (data && data.Title == CORE.COMPONENT_ALIAS.Alias) {
            mfgcodes.data = _.filter(mfgcodes.data, (item) => { return item.mfgType != CORE.COMPONENT_ALIAS.Mfg });
          }
          else if (data && data.Title == CORE.COMPONENT_ALIAS.PackagingAlias || data && data.Title == CORE.COMPONENT_ALIAS.AlternateAlias) {
            mfgcodes.data = _.filter(mfgcodes.data, (item) => { return item.mfgType == CORE.COMPONENT_ALIAS.Mfg });
          }

          // incase of customerid need to check for customer id in same table
          if ((searchObj.mfgcodeID != null || searchObj.customerID != null) && vm.autoCompletemfgCode) {
            selectedMfg = mfgcodes.data[0];
            if (vm.autoCompletemfgCode) {
              $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMfg);
            }
          }
          vm.mfgCodeDetail = mfgcodes.data;
        }
        return mfgcodes.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getAliasSearch(searchObj, isSupplierMfgPartSearch) {
      return ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((componentAlias) => {
        if (componentAlias && componentAlias.data.data) {
          if (isSupplierMfgPartSearch) {
            vm.supplierMfgPNList = componentAlias.data.data;
          }
          else {
            if (searchObj.inputName == vm.autoCompleteGoodBadPart.inputName) {
              _.each(componentAlias.data.data, (item) => {
                item.isIcon = true;
              });
            }
            if (searchObj.id) {
              $timeout(() => {
                $scope.$broadcast(searchObj.inputName, componentAlias.data.data[0]);
              });
            }
            else {
              switch (searchObj.inputName) {
                case 'Recommended Part': {
                  componentAlias.data.data = _.reject(componentAlias.data.data, (item) => {
                    if (vm.component.isGoodPart == vm.PartCorrectList.CorrectPart) {
                      return _.some(vm.goodBadMFGPart, (obj) => {
                        return obj.badComponentID == item.id;
                      });
                    }
                    else {
                      return _.some(vm.goodBadMFGPart, (obj) => {
                        return obj.goodComponentID == item.id;
                      });
                    }
                  });
                  break;
                }
              }
            }
          }
        }
        return componentAlias.data.data;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    const getSelectedMFGDetails = () => {
      if (vm.autoCompletemfgCode) {
        return _.find(vm.mfgCodeDetail, (item) => {
          return item.id == vm.autoCompletemfgCode.keyColumnId;
        });
      }
    };

    const getPIDCodeManual = () => {
      if (vm.component.PIDCode !== generatePIDCode(true)) {
        vm.component.isPIDManual = true;
      }
    };

    function createComponent(componentData) {
      vm.cgBusyLoading = ComponentFactory.component().save(componentData).$promise.then((response) => {
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
                setFocus('nickNameDet');
              }, (err) => BaseService.getErrorLog(err));
          } else if (response && response.data) {
            response.data.mfgPN = vm.component.mfgPN;
            response.data.PIDCode = vm.component.PIDCode;
            response.data.mfgCodemst = {
              id: selectedMFGCode.id,
              mfgCode: selectedMFGCode.mfgCode,
              mfgType: selectedMFGCode.mfgType,
              mfgName: selectedMFGCode.mfgName
            };

            if (response.data.componentGoodBadPartMapping) {
              response.data.componentGoodBadPartMapping.mfgPN = $scope.ComponentGoodBadPart.orgMfgPN;
              response.data.componentGoodBadPartMapping.mfgCodemst = {
                id: $scope.ComponentGoodBadPart.mfgCodeId,
                mfgCode: $scope.ComponentGoodBadPart.mfgCode,
                mfgName: $scope.ComponentGoodBadPart.mfgName
              };
            }
            BaseService.currentPagePopupForm.pop();
            DialogFactory.closeDialogPopup(response.data);
            if (data && data.isReqToRedirNewAddPart) {
              BaseService.goToComponentDetailTab(data.mfgType, response.data.id);
            }
          }
        } else if (response && response.errors) {// response.status !== CORE.ApiResponseTypeStatus.SUCCESS) {
          if (checkResponseHasCallBackFunctionPromise(response)) {
            response.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddMfgCodeForm);
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.save = () => {
      if (!vm.isReadOnly) {
        const isFluxTypeValidationFailed = setFluxTypeValue(false, false);
        const isFormRequiredValidationFailed = BaseService.focusRequiredField(vm.AddMfgCodeForm);
        if (isFluxTypeValidationFailed || isFormRequiredValidationFailed) {
          if (isFluxTypeValidationFailed) {
            $timeout(() => {
              setFluxTypeValue(false, true);
            }, true);
          }
          return;
        }
        if (vm.getPIDCodeValidation()) {
          setFocusByName('PIDCodeSufixDet');
          return;
        }
        //vm.changePIDCode();
        getPIDCodeManual();

        if (!vm.allowIncorrectPartCreation) {
          if (vm.component.isGoodPart === vm.PartCorrectList.IncorrectPart) {
            const alertModel = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.BAD_PART_CREATION_FEATURE_BASED_VALIDATION,
              multiple: true
            };
            DialogFactory.messageAlertDialog(alertModel);
            return;
          }
        }
        vm.component.mfgPN = vm.component.mfgPN ? (replaceHiddenSpecialCharacter(vm.component.mfgPN)).trim() : vm.component.mfgPN;
        const componentData = angular.copy(vm.component);
        componentData.replacementPartID = vm.component.isGoodPart == vm.PartCorrectList.IncorrectPart ? (vm.autoCompleteGoodBadPart ? vm.autoCompleteGoodBadPart.keyColumnId : null) : null;
        componentData.category = vm.partCategoryID ? vm.partCategoryID : null;
        componentData.partType = vm.autoCompleteCategory.keyColumnId;
        componentData.mfgcodeID = vm.autoCompletemfgCode ? vm.autoCompletemfgCode.keyColumnId : null;
        componentData.partStatus = vm.autoCompletePart ? vm.autoCompletePart.keyColumnId : null;
        componentData.functionalCategoryID = vm.autoCompletePartType ? vm.autoCompletePartType.keyColumnId : null;
        componentData.mountingTypeID = vm.autoCompleteMountingType ? vm.autoCompleteMountingType.keyColumnId : null;
        componentData.partPackageID = vm.autoCompletePackageCaseType ? vm.autoCompletePackageCaseType.keyColumnId : null;
        componentData.RoHSStatusID = vm.autoCompleteRohsStatus.keyColumnId;
        componentData.nickName = ((componentData.isCustom || componentData.isCPN) && vm.partCategoryID == vm.PartCategory.SubAssembly && componentData.nickName) ? componentData.nickName.trim() : null;
        componentData.rev = ((componentData.isCustom || componentData.isCPN || vm.partCategoryID == vm.PartCategory.SubAssembly) && componentData.rev) ? componentData.rev.trim() : null;
        componentData.PIDCode = (vm.component.PIDCodePrefix + vm.component.PIDCodeSufix).trim();
        componentData.fileArray = null;
        componentData.matingPartRquired = false;
        componentData.driverToolRequired = false;
        componentData.pickupPadRequired = false;
        componentData.programingRequired = false;
        componentData.functionalTestingRequired = false;
        componentData.functionalTypePartRequired = false;
        componentData.mountingTypePartRequired = false;
        componentData.uom = vm.autoCompleteuom ? vm.autoCompleteuom.keyColumnId : null;
        componentData.refSupplierMfgpnComponentID = vm.autoCompleteSupplierMfgPN.keyColumnId;
        componentData.rfqOnly = (vm.partCategoryID == vm.PartCategory.SubAssembly) ? componentData.rfqOnly : false;
        componentData.unit = vm.component.unit;
        componentData.operatingTemp = vm.component.operatingTemp;
        componentData.minOperatingTemp = vm.component.minOperatingTemp;
        componentData.maxOperatingTemp = vm.component.maxOperatingTemp;
        componentData.connecterTypeID = vm.autoCompleteConnecterType.keyColumnId;
        componentData.noOfPosition = vm.component.noOfPosition;
        componentData.noOfRows = vm.component.noOfRows;
        componentData.noOfRowsText = vm.component.noOfRowsText;
        componentData.pitch = vm.component.pitch;
        componentData.pitchMating = vm.component.pitchMating;
        componentData.sizeDimension = vm.component.sizeDimension;
        componentData.length = vm.component.length;
        componentData.width = vm.component.width;
        componentData.heightText = vm.component.heightText;
        componentData.height = vm.component.height;
        componentData.tolerance = vm.component.tolerance;
        componentData.value = vm.component.value;
        componentData.powerRating = vm.component.powerRating;
        componentData.weight = vm.component.weight;
        componentData.feature = vm.component.feature;
        componentData.color = vm.component.color;
        componentData.isCloudApiUpdateAttribute = vm.component.isCloudApiUpdateAttribute ? vm.component.isCloudApiUpdateAttribute : false;
        componentData.epicorType = vm.autoCompleteEpicorType.keyColumnId ? vm.autoCompleteEpicorType.keyColumnId : null;
        componentData.businessRisk = vm.component.businessRisk;
        componentData.temperatureCoefficient = vm.component.temperatureCoefficient;
        componentData.temperatureCoefficientValue = vm.component.temperatureCoefficientValue;
        componentData.temperatureCoefficientUnit = vm.component.temperatureCoefficientUnit;
        componentData.packageQty = vm.component.packageQty;
        componentData.umidSPQ = vm.component.umidSPQ;
        componentData.uomClassID = vm.autoCompleteUomClass.keyColumnId;
        componentData.restrictPackagingUseWithpermission = false;
        componentData.restrictPackagingUsePermanently = false;
        componentData.mfgType = vm.mfgType;
        componentData.packagingID = vm.autoPackaging.keyColumnId;
        componentData.obsoleteDate = (BaseService.getAPIFormatedDate(vm.component.obsoleteDate));
        componentData.assemblyType = vm.autoCompleteAssemblyType.keyColumnId;
        componentData.refMfgPNMfgCodeId = vm.autoCompleteSupplierMfgCode.keyColumnId;
        componentData.isHazmatMaterial = vm.component.isHazmatMaterial;
        componentData.isNoClean = vm.component.isNoClean;
        componentData.isWaterSoluble = vm.component.isWaterSoluble;
        componentData.isFluxNotApplicable = vm.component.isFluxNotApplicable;

        if (vm.autoCompletePart.keyColumnId != vm.CorePartStatusList.Active) {
          let newPartstatus = _.filter(vm.partStatusList, (item) => { return item.id == vm.autoCompletePart.keyColumnId });
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
              createComponent(componentData);
            }
          }, () => {
          });
        }
        else {
          createComponent(componentData);
        }
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddMfgCodeForm);
      if (isdirty) {
        const data = {
          form: vm.AddMfgCodeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        DialogFactory.closeDialogPopup();
      }
    };

    //set component custom or not based on mapping set
    vm.changeCustomPart = (item) => {
      if (item) {
        vm.component.isGoodPart = vm.PartCorrectList.CorrectPart;
      }
    };

    vm.copyText = (copyText) => {
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(copyText).select();
      document.execCommand('copy');
      $temp.remove();
      vm.showstatus = true;
    };
    vm.checkStatus = () => {
      vm.showstatus = false;
    };

    vm.getPIDCodeValidation = () => {
      if (vm.component.PIDCodeSufix && vm.component.PIDCodeSufix.includes(USER.PIDCodeInvalidCharacter)) {
        return true;
      }
      else {
        return false;
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

    //hyperlink go for list page
    vm.goToManufacturerList = (isMFG) => {
      if (isMFG) {
        BaseService.goToManufacturerList();
      }
      else {
        BaseService.goToSupplierList();
      }
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToUomList = () => {
      BaseService.goToUOMList();
    };
    vm.goToRoHSStatusList = () => {
      BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
    };
    vm.goToPartStatusList = () => {
      BaseService.openInNew(USER.ADMIN_PART_STATUS_STATE, {});
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
    vm.goToPackagingList = () => {
      BaseService.goToPackaging();
    };
    vm.goToAssyTypeList = () => {
      BaseService.goToAssyTypeList();
    };

    function setFocusOnCustomMfgPartCheckbox() {
      $timeout(() => {
        const element = $window.document.getElementsByName('isCustomMfgPart');
        if (element && element[0]) {
          element[0].focus();
        }
        vm.component.isCloudApiUpdateAttribute = (vm.categoryId === vm.PartType.Other || vm.component.isCustom || vm.component.isCPN) ? false : true;
      });
    }

    vm.onCustomPartChange = () => {
      vm.component.isCloudApiUpdateAttribute = (vm.categoryId === vm.PartType.Other || vm.component.isCustom || vm.component.isCPN) ? false : true;
      if (vm.component.isCustom) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_CUSTOM_PART_CONFIRMATION_BODY_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          setFocusOnCustomMfgPartCheckbox();
        }, () => {
          vm.component.isCustom = false;
          setFocusOnCustomMfgPartCheckbox();
        });
      }
      else {
        vm.clearPartNoAndRev();
      }
    };
    vm.onGoodPartChange = () => {
      if (vm.component.isGoodPart == vm.PartCorrectList.IncorrectPart) {
        if (vm.partCategoryID == vm.PartCategory.SubAssembly && !vm.IsSupplier) {
          vm.component.isCustom = true;
        }
        else {
          vm.component.isCustom = false;
        }
        vm.component.isCPN = false;
        vm.isCPNPartEntry = false;
      }
    };
    vm.PIDcodeKeyDown = ($event) => {
      //vm.component.PIDCode = vm.component.PIDCodePrefix + vm.component.PIDCodeSufix;
    };
    /*vm.getPIDCodePrefixLength = () => {
      var retValue = ((vm.mfgCodeCharacterCount + 1) * 9) + 'px';
      return retValue;
    }*/
    function getDataSheetUrlMinId() {
      var minId = -1;
      if (vm.component.component_datasheets && vm.component.component_datasheets.length > 0) {
        const item = _.min(_.sortBy(vm.component.component_datasheets, 'id'), 'id');
        if (item && item.id <= 0) {
          minId = item.id - 1;
          if (minId == 0) {
            minId = -1;
          }
        }
      }
      return minId;
    }
    /*function getAutoCompleteValueFromData() {
      if (vm.component) {
        if (vm.autoCompleteSupplierMfgCode && vm.component.refSupplierMfgComponent && (vm.component.refSupplierMfgComponent.mfgcodeID || vm.component.refSupplierMfgComponent.mfgcodeID == 0)) {
          getSupplierMfgCodeSearch({
            mfgcodeID: vm.component.refSupplierMfgComponent.mfgcodeID,
            mfgType: CORE.MFG_TYPE.MFG
          });
        }

        if (vm.autoCompletemfgCode && vm.component.mfgcodeID != null) {
          getMfgSearch({
            mfgcodeID: vm.component.mfgcodeID, mfgType: vm.selectedMfgType
          });
        }

        if (vm.autoCompleteSupplierMfgPN && vm.component.refSupplierMfgpnComponentID != null) {
          getSupplierMFGPNSearch({
            id: vm.component.refSupplierMfgpnComponentID,
            isGoodPart: vm.PartCorrectList.CorrectPart,
            mfgType: CORE.MFG_TYPE.MFG
          });
        }

        if (vm.autoCompleteComponentAlias && vm.component.replacementPartID != null) {
          getAliasSearch({
            id: vm.component.replacementPartID, inputName: "Recommended Part", isGoodPart: vm.PartCorrectList.CorrectPart, mfgType: vm.component.replacementComponent.mfgCodemst.mfgType
          });
        }
      }
    }*/

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
      vm.component.mfgPN = (replaceHiddenSpecialCharacter(vm.component.mfgPN)).trim();
      const model = {
        transactionID: vm.transactionID,
        partNumber: vm.component.mfgPN
      };
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

    function connectSocket() {
      socketConnectionService.on(CORE.EventName.sendPartUpdateVerification, sendPartUpdateVerification);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.EventName.sendPartUpdateVerification, sendPartUpdateVerification);
    }
    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    function sendPartUpdateVerification(item) {
      if (item.transactionID === vm.transactionID && (item.partNumber && vm.component.mfgPN && item.partNumber.toUpperCase() === vm.component.mfgPN.toUpperCase())) {
        $scope.loaderVisible = false;
        const objApi = {
          ispartMaster: true,
          transactionID: vm.transactionID
        };
        APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
          if (response && response.data && response.data.bomError.length > 0 && !vm.isopenErrorpopup) {
            openErrorListPopup();
          } else {
            vm.cgBusyLoading = ComponentFactory.getComponentDetailByPN().query({ partNumber: vm.component ? vm.component.mfgPN : null })
              .$promise.then((mfgparts) => {
                if (mfgparts && mfgparts.data && mfgparts.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  // check parts from supplier or mfg
                  if (mfgparts.data.length > 0) {
                    const partTypeList = _.filter(mfgparts.data, (part) => part.mfgType.toLowerCase() === vm.mfgType.toLowerCase());
                    if (partTypeList.length > 0) {
                      if (Array.isArray(partTypeList) && partTypeList && partTypeList.length === 1) {
                        //set pristine
                        vm.AddMfgCodeForm.$setPristine();
                        partTypeList[0].mfgCodemst = { id: partTypeList[0].mfgcodeID, mfgCode: partTypeList[0].mfgCode, mfgName: partTypeList[0].mfgName, mfgType: partTypeList[0].mfgType };
                        if (data && data.isReqToRedirNewAddPart && partTypeList[0].id) {
                          BaseService.goToComponentDetailTab(partTypeList[0].mfgType, partTypeList[0].id);
                        }
                        DialogFactory.closeDialogPopup(partTypeList[0]);
                      }
                      else {
                        $scope.loaderVisible = false;
                        const mpnData = {
                          mfgPart: vm.component.mfgPN,
                          supplierName: null,
                          isAutoSelect: true,
                          mfgType: vm.mfgType,
                          partData: partTypeList
                        };
                        DialogFactory.dialogService(
                          TRANSACTION.SELECT_MULTI_COMPONENT_MODAL_CONTROLLER,
                          TRANSACTION.SELECT_MULTI_COMPONENT_MODAL_VIEW,
                          vm.event,
                          mpnData).then(() => {
                          }, (selectItem) => {
                            if (selectItem) {
                              //set pristine
                              vm.AddMfgCodeForm.$setPristine();
                              selectItem.mfgCodemst = { id: selectItem.mfgcodeID, mfgCode: selectItem.mfgCode, mfgName: selectItem.mfgName, mfgType: selectItem.mfgType };
                              if (data && data.isReqToRedirNewAddPart) {
                                BaseService.goToComponentDetailTab(selectItem.mfgType, selectItem.id);
                              }
                              DialogFactory.closeDialogPopup(selectItem);
                            }
                          }, (err) => BaseService.getErrorLog(err));
                      }
                    }
                    else {
                      // messsage to supplier/mfr part
                      const messageConstant = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.SEARCHED_PART_MISMATCH_WITH_MFRTYPE);
                      messageConstant.message = stringFormat(messageConstant.message, vm.component ? vm.component.mfgPN : null, vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? CORE.LabelConstant.MFG.MFGPN : CORE.LabelConstant.MFG.SupplierPN, vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? CORE.LabelConstant.MFG.SupplierPN : CORE.LabelConstant.MFG.MFGPN, vm.mfgType.toUpperCase() === CORE.MFG_TYPE.MFG ? 'Supplier Parts' : 'Manufacturer Parts');
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
        });
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
        }, (data) => {
          vm.isopenErrorpopup = false;
          removePartStatus();
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

    vm.checkChangePIDCode = () => {
      vm.isAssyPNORRevChange = true;
    };

    //check Component PID Code Already Exists
    vm.validateDuplicatePIDCode = (isAssyPNORRevChange, elementName) => {
      if (vm.component.PIDCodePrefix && vm.component.PIDCodeSufix && isAssyPNORRevChange && !vm.makeAPIcallForDuplicationCheck) {
        const pidCodeDetail = {
          PIDCode: (vm.component.PIDCodePrefix + vm.component.PIDCodeSufix).trim()
        };
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
          mfgType: vm.mfgType
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
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    /**
      * Set required field for Flux Type
      * @param {boolean} isSetToFocus - for Auto Focus
      * @param {boolean} isSetToError - to set Error on control
      */
    function setFluxTypeValue(isSetToFocus, isSetToError) {
      if (!vm.component.isNoClean && !vm.component.isWaterSoluble && !vm.component.isFluxNotApplicable) {

        vm.AddMfgCodeForm.fluxType.$setValidity('isFluxTypeRequired', !isSetToError);

        if (isSetToFocus) {
          setFocusByName('fluxType');
        }
        return true;
      } else {
        vm.AddMfgCodeForm.fluxType.$setValidity('isFluxTypeRequired', true);
        return false;
      }
    }
    $scope.$watch('loaderVisible', (newValue) => {
      if (newValue) {
        vm.timeoutWatch = $timeout(() => {
          /*max time to show infinite loader*/
        }, _configMaxTimeout);
        vm.cgBusyLoading = vm.timeoutWatch;
      }
      else {
        if (vm.timeoutWatch) {
          $timeout.cancel(vm.timeoutWatch);
        }
      }
    });
    $scope.$on('$destroy', () => {
      removeSocketListener();
    });

    //check load
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddMfgCodeForm);
    });
  }
})();
