(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .controller('ReserveStockRequestPopupController', ReserveStockRequestPopupController);

  /** @ngInject */
  function ReserveStockRequestPopupController($scope, $mdDialog, $q, $timeout, data, CORE, USER, BaseService, ManageMFGCodePopupFactory, ComponentFactory, MasterFactory, ReserveStockRequestFactory) {
    const vm = this;
    vm.requestID = data && data.id ? data.id : null;
    vm.LabelConstant = angular.copy(CORE.LabelConstant); vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {
      [vm.DATE_PICKER.transactionDate]: false
    };
    vm.reserveStockRequestDet = {
      transactionDate: new Date()
    };
    vm.PartCategory = CORE.PartCategory;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.headerData = [];
    vm.saveBtnDisableFlag = false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.checkDirtyObject = {
      columnName: [],
      oldModelName: null,
      newModelName: null
    };
    vm.DefaultDateFormat = _dateDisplayFormat;
    /** Get supplier list */
    const getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((response) => {
      if (response && response.data) {
        _.each(response.data, (item) => {
          item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
        });
        vm.customerList = response.data;
      }
      return $q.resolve(vm.customerList);
    }).catch((error) => BaseService.getErrorLog(error));

    const getAssyList = (item) => {
      if (item || vm.autoCompleteCustomer.keyColumnId) {
        vm.assyList = [];
        const assyIds = vm.reserveStockRequestDet && vm.reserveStockRequestDet.assyID ? vm.reserveStockRequestDet.assyID.toString() : null;
        return MasterFactory.getAssyPartList().query({ customerID: item && item.id ? item.id : vm.autoCompleteCustomer.keyColumnId, assyIds: assyIds }).$promise.then((response) => {
          vm.assyList = response.data;
          if (vm.reserveStockRequestDet && !vm.reserveStockRequestDet.assyID && vm.reserveStockRequestDet.nickName) {
            const nicknameDet = _.find(vm.assyList, { nickName: vm.reserveStockRequestDet.nickName });
            vm.autoCompleteAssyNickname.keyColumnId = nicknameDet ? nicknameDet.id : null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* unit dropdown fill up */
    const getUomlist = () => ComponentFactory.getUOMsList().query().$promise.then((res) => {
        vm.uomlist = res.data;
        return res.data;
      }).catch((error) => BaseService.getErrorLog(error));

    /** Initialize auto-complete */
    const initAutoComplete = () => {
      /** Auto-complete for customer */
      vm.autoCompleteCustomer = {
        columnName: 'mfgName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.reserveStockRequestDet && vm.reserveStockRequestDet.customerID ? vm.reserveStockRequestDet.customerID : null,
        inputName: 'customer',
        placeholderName: vm.LabelConstant.Customer.Customer,
        isRequired: true,
        isAddnew: true,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        callbackFn: getCustomerList,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              vm.reserveStockRequestDet.customerID = item.id;
            }
          }
          else {
            vm.reserveStockRequestDet.customerID = null;
            vm.reserveStockRequestDet.assyID = null;
            vm.reserveStockRequestDet.nickName = null;
            vm.reserveStockRequestDet.assyCode = null;
            vm.autoCompleteAssyNickname.keyColumnId = null;
            vm.autoCompleteAssy.keyColumnId = null;
          }
          vm.autoCompleteAssy.addData.parentId = item ? item.id : null;

          getAssyList(item);
          //$scope.$broadcast(vm.autoCompletecomponent.inputName, null);
        }
      };

      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'assembly',
        placeholderName: vm.LabelConstant.Assembly.ID,
        isRequired: false,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG, category: CORE.PartCategory.SubAssembly,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        },
        callbackFn: getAssyList,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              vm.reserveStockRequestDet.assyID = item.id;
              vm.reserveStockRequestDet.nickName = item.nickName;
              vm.reserveStockRequestDet.assyCode = item.assyCode;
              vm.autoCompleteAssyNickname.keyColumnId = item.id;
            }
          } else {
            vm.reserveStockRequestDet.assyID = null;
            vm.reserveStockRequestDet.nickName = null;
            vm.reserveStockRequestDet.assyCode = null;
            vm.autoCompleteAssyNickname.keyColumnId = null;
          }
        }
      };

      //vm.autoCompleteuom = {
      //  columnName: 'unitName',
      //  keyColumnName: 'id',
      //  keyColumnId: vm.reserveStockRequestDet && vm.reserveStockRequestDet.uom ? vm.reserveStockRequestDet.uom : null,
      //  inputName: 'UOM',
      //  placeholderName: 'UOM',
      //  isRequired: true,
      //  isAddnew: false,
      //  callbackFn: getUomlist,
      //  onSelectCallbackFn: (item) => {
      //    if (item) {
      //      if (item.id) {
      //        vm.reserveStockRequestDet.uom = item.id;
      //      }
      //    }
      //    else {
      //      vm.reserveStockRequestDet.uom = null;
      //    }
      //  }
      //};

      vm.autoCompleteAssyNickname = {
        columnName: 'nickName',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'assemblyNickname',
        placeholderName: vm.LabelConstant.Assembly.NickName,
        isRequired: false,
        isAddnew: false,
        callbackFn: getAssyList,
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              vm.reserveStockRequestDet.nickName = item.nickName;
            }
          } else {
            vm.reserveStockRequestDet.nickName = null;
          }
        }
      };

      /** Auto-complete for MFG code */
      vm.autoCompletemfgCode = {
        columnName: 'mfgCodeName',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.reserveStockRequestDet && vm.reserveStockRequestDet.component ? vm.reserveStockRequestDet.component.mfgcodeID : null,
        inputName: 'mfg',
        placeholderName: CORE.LabelConstant.MFG.MFG,
        isRequired: true,
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.manufacturer
        },
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: obj.id
          };
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          vm.autoCompletecomponent.addData.parentId = item ? item.id : null;
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletemfgCode.inputName
          };
          return getMfgSearch(searchObj);
        }
      };

      /** Auto-complete for MFG pn */
      vm.autoCompletecomponent = {
        columnName: 'mfgPN',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'mfgPN',
        placeholderName: CORE.LabelConstant.MFG.MFGPN,
        isAddnew: true,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG, category: CORE.PartCategory.Component,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        },
        isRequired: true,
        callbackFn: (obj) => {
          const searchObj = {
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            id: obj.id
          };
          return getComponentDetailsByMfg(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            if (item.id) {
              vm.reserveStockRequestDet.partID = item.id;
              vm.reserveStockRequestDet.unit = item.unit;
              vm.reserveStockRequestDet.uom = item.uom;
              vm.reserveStockRequestDet.unitName = item.unitName;
              //vm.autoCompleteuom.keyColumnId = item.uom;
            }
          }
          else {
            vm.reserveStockRequestDet.partID = null;
            vm.reserveStockRequestDet.unit = null;
            vm.reserveStockRequestDet.uom = null;
            vm.reserveStockRequestDet.unitName = null;
            //vm.autoCompleteuom.keyColumnId = null;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            isGoodPart: CORE.PartCorrectList.CorrectPart,
            query: query,
            type: CORE.MFG_TYPE.MFG,
            inputName: vm.autoCompletecomponent.inputName
          };
          return getComponentDetailsByMfg(searchObj);
        }
      };
    };

    const getAutoCompleteData = () => {
      const autocompletePromise = [getCustomerList(), getUomlist()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
        $timeout(() => {
          if (vm.reserveStockRequestDet && vm.reserveStockRequestDet.component) {
            vm.autoCompletemfgCode.keyColumnId = vm.reserveStockRequestDet.component.mfgcodeID;
            $scope.$broadcast(vm.autoCompletemfgCode.inputName, `(${vm.reserveStockRequestDet.component.mfgCodemst.mfgCode}) ${vm.reserveStockRequestDet.component.mfgCodemst.mfgName}`);

            vm.autoCompletecomponent.keyColumnId = vm.reserveStockRequestDet.partID;
            $scope.$broadcast(vm.autoCompletecomponent.inputName, `(${vm.reserveStockRequestDet.component.mfgCodemst.mfgCode}) ${vm.reserveStockRequestDet.component.mfgPN}`);
          }

          if (vm.reserveStockRequestDet && vm.reserveStockRequestDet.assembly) {
            vm.autoCompleteAssy.keyColumnId = vm.reserveStockRequestDet.assyID;
            $scope.$broadcast(vm.autoCompleteAssy.inputName, vm.reserveStockRequestDet.component.PIDCode);
          }
        }, 1000);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Get request detail for editable record */
    const getRequestDet = () => {
      vm.cgBusyLoading = ReserveStockRequestFactory.getRequestDet().query({ id: vm.requestID }).$promise.then((response) => {
        if (response.data) {
          vm.reserveStockRequestDet = response.data;
          if (vm.reserveStockRequestDet) {
            vm.reserveStockRequestDet.transactionDate = BaseService.getUIFormatedDate(vm.reserveStockRequestDet.transactionDate, vm.DefaultDateFormat);
            if (vm.reserveStockRequestDet.component && vm.reserveStockRequestDet.component.UOMs) {
              vm.reserveStockRequestDet.unitName = vm.reserveStockRequestDet.component.UOMs.unitName;
            }
            vm.headerData.push({
              label: vm.LabelConstant.MFG.MFG,
              labelLinkFn: vm.goToMFGList,
              value: vm.reserveStockRequestDet.component.mfgCodemst.mfgCode,
              valueLinkFn: vm.goToManufacturer,
              valueLinkFnParams: { id: vm.reserveStockRequestDet.component.mfgcodeID },
              displayOrder: 1
            }, {
              label: vm.LabelConstant.MFG.MFGPN,
              labelLinkFn: vm.goToPartList,
              value: vm.reserveStockRequestDet.component.mfgPN,
              valueLinkFn: vm.goToUMIDDetail,
              valueLinkFnParams: { id: vm.reserveStockRequestDet.partID },
              displayOrder: 2,
              isCopy: true,
              isAssy: true,
              imgParms: {
                imgPath: vm.rohsImagePath + vm.reserveStockRequestDet.component.rfq_rohsmst.rohsIcon,
                imgDetail: vm.reserveStockRequestDet.component.rfq_rohsmst.name
              }

            });
          }
        }
        getAutoCompleteData();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (vm.requestID) {
      getRequestDet();
    }
    else {
      getAutoCompleteData();
    }

    /**
    * Get MFG code list
    * @param {any} searchObj
    */
    const getMfgSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
      if (searchObj.mfgcodeID || searchObj.mfgcodeID === 0) {
        $timeout(()=> {
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
          $timeout(()=> {
            $scope.$broadcast(vm.autoCompletecomponent.inputName, component.data.data[0]);
          });
        }
        return component.data.data;
    }).catch((error) => BaseService.getErrorLog(error));

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.reserveStockRequestForm);
      if (isdirty) {
        const data = {
          form: vm.reserveStockRequestForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        vm.reserveStockRequestForm.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    /** Redirect to manufacturer page */
    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };

    vm.goToManufacturer = (data) => {
      BaseService.goToManufacturer(data.id);
    };

    /** Redirect to part master page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToUMIDDetail = (data) => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, data.id, USER.PartMasterTabs.Detail.Name);
    };

    /** Redirect to UOM page */
    vm.goToUOMList = () => {
      BaseService.goToUOMList();
    };

    /** Redirect to customer page */
    vm.goToCustomerList = (id) => {
      BaseService.goToCustomerList(id);
    };

    vm.saveRequest = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.reserveStockRequestForm)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (vm.reserveStockRequestDet) {
        vm.reserveStockRequestDet.transactionDate = BaseService.getAPIFormatedDate(vm.reserveStockRequestDet.transactionDate);
      }
      vm.cgBusyLoading = ReserveStockRequestFactory.saveRequest().query(vm.reserveStockRequestDet).$promise.then((response) => {
        if (response && response.data) {
          vm.saveBtnDisableFlag = false;
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide(response.data);
        } else {
          if (checkResponseHasCallBackFunctionPromise(response)) {
            response.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.reserveStockRequestForm);
            });
          }
          vm.saveBtnDisableFlag = false;
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.reserveStockRequestForm];
    });
  }
})();
