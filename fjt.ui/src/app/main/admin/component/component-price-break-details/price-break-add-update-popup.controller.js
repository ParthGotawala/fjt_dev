(function () {
  'use strict';
  angular
    .module('app.admin.componentpricebreakdetails')
    .controller('PriceBreakAddUpdatePopupController', PriceBreakAddUpdatePopupController);

  /** @ngInject */
  function PriceBreakAddUpdatePopupController($mdDialog, $timeout, $scope, data, CORE, BaseService, ComponentPriceBreakDetailsFactory, ManageMFGCodePopupFactory, ComponentFactory, USER) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.id = 0;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };


    //Save or update part price details
    vm.savePriceBreakdetails = () => {
      if (BaseService.focusRequiredField(vm.priceBreakForm)) {
        return;
      }
      if (vm.pricebreakdetails && vm.pricebreakdetails.id) {
        //update price break details
        vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getComponentPriceBreakDetailsList()
          .update({
            id: vm.pricebreakdetails.id
          }, vm.pricebreakdetails).$promise.then((getcomponentpriceBreakdetails) => {
            if (getcomponentpriceBreakdetails.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      } else {
        //save price break details
        vm.cgBusyLoading = ComponentPriceBreakDetailsFactory.getComponentPriceBreakDetailsList()
          .save(vm.pricebreakdetails).$promise.then((getcomponentpriceBreakdetails) => {
            if (getcomponentpriceBreakdetails.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide();
            }
          }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // Close modal popup
    vm.cancel = () => {
      const isDirty = vm.checkFormDirty(vm.priceBreakForm, vm.checkDirtyObject);
      if (isDirty) {
        const data = {
          form: vm.priceBreakForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };


    /** Calculate extended price */
    vm.priceBreakCalculation = function () {
      vm.pricebreakdetails.extendedPrice = vm.pricebreakdetails.priceBreak * vm.pricebreakdetails.unitPrice;
    };


    /** Redirect to MFG page */
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };

    /** Redirect to Parts page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /** Initialize auto-complete */
    const initAutoComplete = () => {
      /** Auto-complete for MFG code (MFR) */
      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.pricebreakdetails && vm.pricebreakdetails.mfgcodeID ? vm.pricebreakdetails.mfgcodeID : null,
        inputName: 'mfg',
        placeholderName: CORE.LabelConstant.MFG.MFG,
        isRequired: true,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.manufacturer
        },
        callbackFn: function (obj) {
          vm.autoCompletecomponent.keyColumnId = null;

          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          // vm.autoCompletecomponent.addData.parentId = item ? item.id : null;
          if (item) {
            vm.autoCompletecomponent.addData.parentId = item ? item.id : null;
          } else {
            vm.autoCompletecomponent.addData.parentId = null;
            $scope.$broadcast(vm.autoCompletecomponent.inputName, null);
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletemfgCode.inputName
          };
          $scope.$broadcast(vm.autoCompletecomponent.inputName, '');
          initAutoCompletecomponent();
          return getMfgSearch(searchObj);
        }
      };

      /** Auto-complete for MFG PN */
      initAutoCompletecomponent();
    };

    const initAutoCompletecomponent = () => {
      vm.autoCompletecomponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.pricebreakdetails && vm.pricebreakdetails.mfgPNID ? vm.pricebreakdetails.mfgPNID : null,
        inputName: 'mfgPN',
        placeholderName: CORE.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: CORE.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        },
        isRequired: true,
        callbackFn: function (obj) {
          const searchObj = {
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            id: obj.id
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item && item.id) {
            vm.pricebreakdetails.mfgPNID = item.id;
          }
        },
        onSearchFn: function (query) {
          const searchObj = {
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            isGoodPart: CORE.PartCorrectList.CorrectPart,
            query: query,
            type: CORE.MFG_TYPE.MFG,
            isContainCPN: false,
            inputName: vm.autoCompletecomponent.inputName,
            strictCustomPart : false
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };
    };

    /**
* Get MFG code list
* @param {any} searchObj
*/
    const getMfgSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
        $timeout(() => {
          if (vm.autoCompletemfgCode && vm.autoCompletemfgCode.inputName) {
            $scope.$broadcast(vm.autoCompletemfgCode.inputName, mfgcodes.data[0]);
          }
        });
      }
      return mfgcodes.data;
    }).catch((error) => BaseService.getErrorLog(error));

    /**
* Get MFG PN List
* @param {any} searchObj
*/
    const getComponentDetailsByMfg = (searchObj) => ComponentFactory.getComponentMFGAliasSearch().query({ listObj: searchObj }).$promise.then((component) => {
      _.each(component.data.data, (comp) => {
        comp.ismfgpn = true;
      });
      if (searchObj.id || searchObj.id === 0) {
        $timeout(() => {
          $scope.$broadcast(vm.autoCompletecomponent.inputName, component.data.data[0]);
        });
      }
      return component.data.data;
    }).catch((error) => BaseService.getErrorLog(error));

    if (data === null) {
      initAutoComplete();
      vm.pricebreakdetails = {
        id: null,
        mfgPNID: null,
        mfgcodeID: null,
        mfgCode: null,
        mfgName: null,
        mfgPN: null,
        extendedPrice: null
      };
    } else {
      vm.pricebreakdetails = {
        id: data.id,
        mfgPNID: data.mfgPNID,
        mfgcodeID: data.mfgcodeID,
        mfgCode: data.mfgCode,
        mfgName: data.mfgName,
        mfgPN: data.mfgPN,
        priceBreak: data.priceBreak,
        unitPrice: data.unitPrice,
        extendedPrice: data.priceBreak * data.unitPrice,
        updatedOn: data.updatedOn
      };
      initAutoComplete();
      $timeout(() => {
        if (vm.pricebreakdetails && vm.pricebreakdetails.mfgcodeID) {
          vm.autoCompletemfgCode.keyColumnId = vm.pricebreakdetails.mfgcodeID;
          $scope.$broadcast(vm.autoCompletemfgCode.inputName, `(${vm.pricebreakdetails.mfgCode}) ${vm.pricebreakdetails.mfgName}`);

          vm.autoCompletecomponent.keyColumnId = vm.pricebreakdetails.mfgPNID;
          $scope.$broadcast(vm.autoCompletecomponent.inputName, `(${vm.pricebreakdetails.mfgCode}) ${vm.pricebreakdetails.mfgPN}`);
        }
      }, 1000);
    }
    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.priceBreakForm);
    });
  }
})();
