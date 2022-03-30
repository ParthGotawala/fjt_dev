(function () {
  'use strict';

  angular
    .module('app.admin.component')
    .controller('ComponentUpdateMPNPIDCodePopupController', ComponentUpdateMPNPIDCodePopupController);

  /** @ngInject */
  function ComponentUpdateMPNPIDCodePopupController($scope, $q, $mdDialog, $timeout, CORE, USER, data, BaseService, DialogFactory, ComponentFactory, RFQSettingFactory, MasterFactory, AssyTypeFactory, ManageMFGCodePopupFactory) {
    const vm = this;
    vm.assyData = data;
    vm.cid = (data && data.id) ? data.id : undefined;

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.MFG_TYPE = CORE.MFG_TYPE;
    vm.mfgTypedata = vm.MFG_TYPE.MFG;
    vm.PartCategory = CORE.PartCategory;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.UPDATE_MPN_PID_ASSEMBLY = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.UPDATE_MPN_PID_ASSEMBLY);
    vm.PIDCodeMultipleHyphenMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMP_MULTIPLE_HYPHEN_IN_PID_CODE_NOT_ALLOWED);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.makeAPIcallForDuplicationCheck = false;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.partStatus = CategoryTypeObjList.PartStatus.Name;
    vm.PIDCodeLength = null;
    vm.disablecopy = true;
    vm.isAssyPNORRevChange = false;
    vm.mfgCodeDetail = [];
    vm.component = {};
    vm.currentComponent = {};

    /* binding values in view mode - category*/
    const getCategory = (item) => {
      if (item) {
        const selectedCategory = _.find(vm.categoryList, (c) => c.id === item.id);
        vm.component.selectedCategoryTxt = selectedCategory ? selectedCategory.Value : '';
        vm.partCategoryID = selectedCategory ? selectedCategory.partCategory : null;
        vm.component.category = selectedCategory.id;

        vm.component.epicorType = selectedCategory.epicorType;
        vm.autoCompleteEpicorType.keyColumnId = vm.component.epicorType;
        if (selectedCategory.id !== vm.PartCategory.SubAssembly || vm.currentComponent.isCPN) {
          vm.autoCompleteAssemblyType.keyColumnId = null;
        }
      }
      else {
        vm.component.selectedCategoryTxt = null;
        vm.partCategoryID = null;
        vm.component.category = null;
      }
      if ((!vm.currentComponent.isCustom && !vm.currentComponent.isCPN && vm.partCategoryID !== vm.PartCategory.SubAssembly)) {
        vm.component.rev = '';
        vm.component.custAssyPN = '';
      }
      // vm.changePIDCode();
      // vm.changeAssyCode();
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
      if (vm.autoCompleteCategory && vm.component && (vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly)) {
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
    vm.changeAssyCode = (changeFromUI) => {
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
      const fromPartPIDCodeSufix = vm.currentComponent.PIDCodeSufix;
      if (item) {
        vm.autoCompletemfgCode.keyColumnId = item.id;
        vm.component.mfgcodeID = item.id;
        vm.changePIDCode();
        // vm.changeAssyCode();

        const selectedMFG = _.find(vm.mfgCodeDetail, (p) => p.id === item.id);
        vm.component.selectedMFGCodeTxt = selectedMFG ? selectedMFG.mfgCode : '';
        vm.mfgCodeCharacterCount = vm.component.selectedMFGCodeTxt.length + 1;
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
        // vm.changeAssyCode();
      }
      // ------ Add timeout for update md-max-length of PID Code text input(SHUBHAM - 16/02/2021)
      $timeout(() => {
        vm.PIDCodeLength = pidCode;
        vm.currentComponent.PIDCodeSufix = fromPartPIDCodeSufix;
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

    const initAutoComplete = () => {
      vm.autoCompleteComponent = {
        columnName: 'formatMFGPN',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'mfgPN',
        placeholderName: stringFormat('Search {0} code and add', (vm.mfgTypedata === vm.MFG_TYPE.DIST ? 'Supplier' : vm.mfgTypedata)),
        isRequired: true,
        isUppercaseSearchText: true,
        isAddnew: false,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: obj.id,
            searchInActive: false
          };
          return queryAssySearchMfgPn(searchObj);
        },
        onSelectCallbackFn: function (asseyDet) {
          if (asseyDet) {
            asseyDet.isCustom = asseyDet.isCustom === 1;
            asseyDet.isCPN = asseyDet.isCPN === 1;
            vm.currentComponent = asseyDet;
            vm.component = angular.copy(asseyDet);
            const mfgCodeDetail = {
              id: asseyDet.mfgcodeID,
              mfgCodeName: asseyDet.fullMfgName,
              mfgCode: asseyDet.mfgCode
            }
            vm.mfgCodeDetail.push(mfgCodeDetail);
            vm.autoCompleteCategory.keyColumnId = asseyDet.category;
            vm.autoCompleteEpicorType.keyColumnId = asseyDet.epicorType;
            vm.autoCompleteAssemblyType.keyColumnId = asseyDet.assemblyType;
            $scope.$broadcast(vm.autoCompletemfgCode.inputName, mfgCodeDetail);
          } else {
            vm.currentComponent = {};
            vm.component = {};
            vm.mfgCodeDetail = [];
            vm.autoCompleteAssemblyType.keyColumnId = null;
            vm.autoCompletemfgCode.keyColumnId = null;
            vm.autoCompleteCategory.keyColumnId = null;
            vm.autoCompleteEpicorType.keyColumnId = null;
            //$scope.$broadcast(vm.autoCompleteCategory.inputName, null);
            //$scope.$broadcast(vm.autoCompleteEpicorType.inputName, null);
            //$scope.$broadcast(vm.autoCompleteAssemblyType.inputName + 'searchText', null);
            $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchString: query,
            mfgPN: true
          };
          return queryAssySearchMfgPn(searchObj);
        }
      };

      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        parentColumnName: 'mfgCodeAlias',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.component ? vm.component.mfgcodeID : null,
        inputName: 'mfgCode',
        placeholderName: stringFormat('Search {0} code and add', (vm.mfgTypedata === vm.MFG_TYPE.DIST ? 'Supplier' : vm.mfgTypedata)),
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
        keyColumnId: vm.PartCategory.SubAssembly,
        inputName: 'Type',// 'Category',
        placeholderName: 'Part Type',//'Category',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getCategory
      };
      vm.autoCompleteEpicorType = {
        columnName: 'epicorType',
        keyColumnName: 'epicorType',
        keyColumnId: null,
        inputName: 'epicorType',
        placeholderName: 'Purchase Type',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getEpicoreType
      };
      vm.autoCompleteAssemblyType = {
        columnName: 'name',
        keyColumnName: 'id',
        keyColumnId: null,
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

    const autocompletePromise = [getPartCategoryMstList(), getPIDCode(), getEpicorTypeList(), getAssyTypeList()];

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    const queryAssySearchMfgPn = (searchObj) => {
      return ComponentFactory.getAllAssyListWitoutSOCreated().query(searchObj).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.updateComponent = () => {
      if (vm.UpdateComponentForm.$invalid) {
        BaseService.focusRequiredField(vm.UpdateComponentForm);
        return;
      }
      if (vm.getPIDCodeValidation()) {
        setFocusByName('toPIDCodeSufix');
        return;
      }

      const copyPartDetailObj = {};
      copyPartDetailObj.componentId = vm.component.id;
      copyPartDetailObj.epicorType = vm.autoCompleteEpicorType.keyColumnId ? vm.autoCompleteEpicorType.keyColumnId : null;
      copyPartDetailObj.mfgcodeID = vm.autoCompletemfgCode.keyColumnId;
      copyPartDetailObj.custAssyPN = vm.component.custAssyPN ? vm.component.custAssyPN.trim() : null;
      copyPartDetailObj.rev = ((vm.component.isCustom || vm.component.isCPN || vm.partCategoryID === vm.PartCategory.SubAssembly) && vm.component.rev) ?
        vm.component.rev.trim() : null;
      copyPartDetailObj.mfgPN = vm.component.mfgPN ? (replaceHiddenSpecialCharacter(vm.component.mfgPN)).trim() : vm.component.mfgPN;
      copyPartDetailObj.assyCode = vm.component.assyCode ? vm.component.assyCode.trim() : null;
      copyPartDetailObj.nickName = (vm.partCategoryID === vm.PartCategory.SubAssembly && vm.component.nickName) ? vm.component.nickName.trim() : null;
      copyPartDetailObj.PIDCode = (vm.component.PIDCodePrefix + vm.component.PIDCodeSufix).trim();
      copyPartDetailObj.isCustom = vm.component.isCustom;
      copyPartDetailObj.isCPN = vm.component.isCPN;
      copyPartDetailObj.mfgType = vm.mfgTypedata;
      copyPartDetailObj.category = vm.autoCompleteCategory.keyColumnId;

      if (vm.component.id && copyPartDetailObj.PIDCode) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.COMPONENT_MPN_PIDCODE_UPDATE_CONFIRMATION_MESSAGE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ComponentFactory.updateMFGPPIDCodeOfComponent().query(copyPartDetailObj).$promise.then((response) => {
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
                    data).then(() => { }, (response) => {
                      setFocus('toNickName');
                    }, (err) => BaseService.getErrorLog(err));
                } else {
                  vm.UpdateComponentForm.$setPristine();
                  $mdDialog.hide(response.data);
                }
              }
              else {
                /*Set focus on first enabled field after user click Ok button*/
                if (checkResponseHasCallBackFunctionPromise(response)) {
                  response.alretCallbackFn.then(() => {
                    BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.UpdateComponentForm);
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
    //getAssyDetails();

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.UpdateComponentForm);
      if (isdirty) {
        const data = {
          form: vm.UpdateComponentForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
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

    /** Redirect to part master page */
    vm.goToMFGPartList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.UpdateComponentForm];
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
          componentId: vm.currentComponent.id,
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
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };
    //check Component MFR PN Code Already Exists
    vm.validateDuplicateMFRPN = (isAssyPNORRevChange, elementName) => {
      if (vm.component.mfgPN && vm.autoCompletemfgCode.keyColumnId && isAssyPNORRevChange && !vm.makeAPIcallForDuplicationCheck) {
        const mfrDetail = {
          componentId: vm.currentComponent.id,
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
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };
  }
})();
