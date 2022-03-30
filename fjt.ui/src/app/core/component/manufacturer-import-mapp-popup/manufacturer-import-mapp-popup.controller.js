(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ManufacturerImportMappPopupController', ManufacturerImportMappPopupController);

  /** @ngInject */
  function ManufacturerImportMappPopupController($mdDialog, CORE, USER, data, BaseService, ManufacturerFactory, MasterFactory, DialogFactory, $rootScope) {
    var isDirty = false;
    const vm = this;
    vm.apiVerificationList = [];
    vm.apiErrorList = [];
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.allMappedMfgsModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
    vm.allMfgsModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
    vm.addNewFlag = CORE.MESSAGE_CONSTANT.ADD_NEW;
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.customerTypeList = CORE.customerTypeDropdown;
    vm.LabelConstant = CORE.LabelConstant.MFG;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.mfgType = CORE.MFG_TYPE;
    vm.type = data.type;
    vm.isAllowDeleteCustSuppAlias = false;
    vm.isCustOrDisty = data.isCustOrDisty;
    vm.loginUser = BaseService.loginUser;
    vm.googleImage = CORE.GOOGLE_IMAGE;
    vm.MFRName = vm.mfgType.MFG ? vm.isCustOrDisty ? vm.LabelConstant.Customer : vm.LabelConstant.Manufacturer : vm.LabelConstant.Supplier;
    vm.currentPageName = vm.isCustOrDisty && vm.type === CORE.MFG_TYPE.MFG ? CORE.PAGENAME_CONSTANT[10].PageName : (vm.type === CORE.MFG_TYPE.MFG ? CORE.PAGENAME_CONSTANT[21].PageName : CORE.PAGENAME_CONSTANT[22].PageName);
    vm.messageMapped = stringFormat(CORE.MESSAGE_CONSTANT.MFR_MAPPING_NOTE, vm.MFRName, vm.MFRName, vm.MFRName, vm.type === vm.mfgType.MFG ? CORE.COMPONENT_MFG_TYPE.MANUFACTURER : CORE.COMPONENT_MFG_TYPE.SUPPLIER);
    vm.selectedItems = [];
    vm.apiMappedUnMappedList = [];
    vm.isNoDataFound = false;
    vm.getDerivedManufacturerList = (isOpenImportDataPopup) => {
      vm.apiVerificationList = [];
      vm.apiErrorList = [];
      vm.isNoDataFound = true;
      vm.cgBusyLoading = ManufacturerFactory.getVerificationManufacturerList({ type: vm.type, isCustOrDisty: vm.isCustOrDisty }).query().$promise.then((response) => {
        if (response && response.data) {
          vm.apiMappedUnMappedList = _.orderBy(_.filter(_.uniqWith(response.data, (mainObj, compareObj) => mainObj.importMfg.toLowerCase() === compareObj.importMfg.toLowerCase())), ['isVerified'], ['asc']);
          vm.apiErrorList = _.filter(vm.apiMappedUnMappedList, (mfgDet) => !mfgDet.isVerified);

          const apiVerificationList = _.filter(vm.apiMappedUnMappedList, (mfgDet) => mfgDet.isVerified);
          _.each(apiVerificationList, (data) => {
            data.isSystemGenerated = data.mfgCode === data.importMfg.toUpperCase() || data.mfgName === data.importMfg.toUpperCase();
            data.isCustOrDistyText = CORE.MFG_TYPE.MFG === data.mfrType ? ((data.isMfg) ? 'Both' : 'Manufacturer Only') : null;
          });
          vm.apiVerificationList = apiVerificationList;

          if (isOpenImportDataPopup) {
            openModelImportMFR();
          }
          vm.isNoDataFound = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    //  check and get accesslevel for delete customer/mfg/supplier alias : DELETEROLEACCESS key used right now
    function getAccessLevelForDeleteAlias() {
      return MasterFactory.getAcessLeval().query({
        access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.isAllowDeleteCustSuppAlias = false;
          const currentLoginUserRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.isAllowDeleteCustSuppAlias = true;
          }
        }
        return response;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.getDerivedManufacturerList();
    getAccessLevelForDeleteAlias();
    /* set curr status of mfg added */
    vm.getMFGTypeCurrStatusClassName = (mfgStatusText) => {
      const type = _.find(CORE.MfgAddedAsCurrStatus, (item) => item.mfgAddedAsText === mfgStatusText);
      return type ? type.className : '';
    };

    vm.queryOperation = {
      order: '',
      operation_search: '',
      limit: !(vm.ispagination === undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
      page: 1,
      isPagination: vm.ispagination === undefined ? CORE.isPagination : vm.ispagination
    };
    //remove filter
    vm.removeErrorListFilter = () => {
      vm.allMfgsModel.searchText = '';
      vm.searchPendingList();
    };

    vm.searchPendingList = (searchCriteria) => {
      vm.apiErrorList = [];
      vm.isNoDataFound = true;
      if (searchCriteria) {
        const searchTxt = angular.copy(searchCriteria).toLowerCase();
        let errorList = [];
        if (vm.allMfgsModel.searchType === CORE.CustomSearchTypeForList.Contains) {
          errorList = vm.apiMappedUnMappedList.filter((mfgDet) =>
            !mfgDet.isVerified &&
            (mfgDet.importMfg.toLowerCase().indexOf(searchTxt) !== -1)
          );
        } else {
          errorList = vm.apiMappedUnMappedList.filter((mfgDet) =>
            !mfgDet.isVerified &&
            (mfgDet.importMfg.toLowerCase() === searchTxt)
          );
        }
        vm.apiErrorList = errorList;
      }
      else {
        vm.apiErrorList = vm.apiMappedUnMappedList.filter((mfgDet) => !mfgDet.isVerified);
      }
      vm.isNoDataFound = false;
    };
    vm.searchMappedList = (searchCriteria) => {
      vm.apiVerificationList = [];
      vm.isNoDataFound = true;
      if (searchCriteria) {
        const searchTxt = angular.copy(searchCriteria).toLowerCase();
        let mappedList = [];
        if (vm.allMappedMfgsModel.searchType === CORE.CustomSearchTypeForList.Contains) {
          mappedList = vm.apiMappedUnMappedList.filter((mfgDet) =>
            mfgDet.isVerified &&
            ((mfgDet.mfgCode && mfgDet.mfgCode.toLowerCase().indexOf(searchTxt) !== -1)
              || (mfgDet.mfgName && mfgDet.mfgName.toLowerCase().indexOf(searchTxt) !== -1)
              || (mfgDet.importMfg && mfgDet.importMfg.toLowerCase().indexOf(searchTxt) !== -1))
          );
        } else {
          mappedList = vm.apiMappedUnMappedList.filter((mfgDet) =>
            mfgDet.isVerified &&
            ((mfgDet.mfgCode && mfgDet.mfgCode.toLowerCase() === searchTxt)
              || (mfgDet.mfgName && mfgDet.mfgName.toLowerCase() === searchTxt)
              || (mfgDet.importMfg && mfgDet.importMfg.toLowerCase() === searchTxt))
          );
        }
        vm.apiVerificationList = mappedList;
      }
      else {
        vm.apiVerificationList = _.filter(vm.apiMappedUnMappedList, (mfgDet) => mfgDet.isVerified);
      }
      vm.isNoDataFound = false;
    };

    //remove filter
    vm.removeVerifyListFilter = () => {
      vm.allMappedMfgsModel.searchText = '';
      vm.searchMappedList();
    };

    vm.changeSearchType = () => {
      vm.removeErrorListFilter();
      vm.removeVerifyListFilter();
    };

    vm.addMFG = function (item, type, $event) {
      var data = {
        Name: item.importMfg,
        Title: vm.type === vm.mfgType.MFG ? vm.isCustOrDisty ? CORE.COMPONENT_MFG_TYPE.CUSTOMER : CORE.COMPONENT_MFG_TYPE.MANUFACTURER : CORE.COMPONENT_MFG_TYPE.SUPPLIER,
        Button: type,
        mfgType: vm.type === vm.mfgType.MFG ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
        isBadPart: false,
        isCustOrDisty: vm.isCustOrDisty
      };

      DialogFactory.dialogService(
        CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        CORE.MANAGE_MFGCODE_MODAL_VIEW,
        $event,
        data).then(() => {
        }, (insertedData) => {
          if (insertedData) {
            if (_.find(insertedData.alias, (mfgcodes) => mfgcodes.alias.toLowerCase() === item.importMfg.toLowerCase())) {
              const aliasDet = _.find(insertedData.alias, (mfgcodes) => mfgcodes.alias.toLowerCase() === item.importMfg.toLowerCase());
              vm.apiErrorList.forEach((obj) => {
                if (obj.importMfg === item.importMfg) {
                  obj.isVerified = true;
                  obj.isCustOrDisty = insertedData.isCustOrDisty;
                  obj.mfgCode = insertedData.mfgCode;
                  obj.mfgName = insertedData.mfgName;
                  obj.AlisasId = aliasDet.id;
                  isDirty = true;
                }
              });
              vm.verfyMfr();
            }
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    //check for continue and close option
    vm.checkContinue = () => {
      const NotVetifiedObj = _.find(vm.apiErrorList, (err) => !err.isVerified);
      return NotVetifiedObj;
    };

    // Update verified MFR list
    vm.refreshData = () => {
      vm.removeErrorListFilter();
      vm.removeVerifyListFilter();
      const isAnyVerified = _.filter(vm.apiErrorList, (item) => item.isVerified === true);
      vm.cgBusyLoading = ManufacturerFactory.UpdateVerificationManufacturer().query({ manufacturers: isAnyVerified }).$promise.then(() => {
        vm.getDerivedManufacturerList();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.appendMFRDetail = () => {
      openModelImportMFR();
    };

    const openModelImportMFR = () => {
      const data = {
        type: vm.type,
        isStatusPopupOpen: true,
        isCustOrDisty: vm.isCustOrDisty
      };
      vm.removeErrorListFilter();
      vm.removeVerifyListFilter();
      DialogFactory.dialogService(
        CORE.MFR_IMPORT_MODAL_CONTROLLER,
        CORE.MFR_IMPORT_MODAL_VIEW,
        vm.event,
        data).then(() => {
          vm.getDerivedManufacturerList();
          refreshListPage();
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.cancel = (actionToPerform) => {
      var isAnyVerified = _.filter(vm.apiErrorList, (item) => item.isVerified === true);
      const objCheck = {
        isAnyVerified: isAnyVerified,
        isContinue: actionToPerform,
        isAllowToAddNew: actionToPerform,
        isDirty: isDirty
      };
      if (objCheck.isDirty || objCheck.isContinue) {
        if (objCheck.isAnyVerified.length > 0) {
          vm.refreshData();
          $mdDialog.cancel(objCheck);
        }
        else if (objCheck.isContinue) {
          vm.cgBusyLoading = ManufacturerFactory.removeMFRDetails().query({ mfrType: vm.type, isCustOrDisty: vm.isCustOrDisty }).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.getDerivedManufacturerList(true);
              refreshListPage();
            }
          });
        } else {
          $mdDialog.cancel();
        }
      } else {
        refreshListPage();
        $mdDialog.cancel(false);
      }
    };

    const refreshListPage = () => {
      if (vm.type === vm.mfgType.MFG && !vm.isCustOrDisty) {
        $rootScope.$broadcast(USER.RefreshManufactureList);
      } else {
        $rootScope.$broadcast(USER.RefreshSupplierCustomerList);
      }
    };
    vm.goToManufactureOrCustomer = (detail) => {
      if (detail.isMfg) {
        vm.goToCustomer(detail.mfgCodeID);
      } else {
        vm.goToManufacturer(detail.mfgCodeID);
      }
    };
    /* to go at Edit Manufacture Code details page  */
    vm.goToManufacturer = (mfgCodeID) => {
      BaseService.goToManufacturer(mfgCodeID);
      return false;
    };
    /* to go at Edit Customer details page  */
    vm.goToCustomer = (mfgCodeID) => {
      BaseService.goToCustomer(mfgCodeID);
      return false;
    };
    /* to go at Edit Supplier details page  */
    vm.goToSupplierDetail = (mfgCodeID) => {
      BaseService.goToSupplierDetail(mfgCodeID);
      return false;
    };

    vm.gotoGoogle = (mfg) => {
      BaseService.searchToGoogle(mfg);
    };
    vm.verfyMfr = () => {
      var mfrList = _.filter(vm.apiErrorList, (item) => item.isVerified === true);
      if (mfrList.length > 0) {
        vm.cgBusyLoading = ManufacturerFactory.VerifyManufacturer().query(mfrList).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            refreshListPage();
            vm.refreshData();
          }
        }).catch((error) => BaseService.getErrorLog(error));;
      }
    };

    vm.removeAliasFromList = ($event, item, isMapped) => {
      if (isMapped) {
        const objMFGDetail = {
          AccessRole: CORE.ROLE_ACCESS.MFRRemoveAccess,
          refID: item.mfgCodeAliasID,
          refTableName: CORE.TABLE_NAME.MFG_CODE_ALIAS,
          isAllowSaveDirect: false,
          approveFromPage: vm.currentPageName,
          confirmationType: CORE.Generic_Confirmation_Type.MFR_REMOVE_REASON,
          transactionType: stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.MFR_REMOVE_REASON, item.mfgCode, item.mfgName),
          createdBy: vm.loginUser.userid,
          updatedBy: vm.loginUser.userid
        };
        DialogFactory.dialogService(
          CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
          CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
          $event, objMFGDetail).then((data) => {
            if (data) {
              removeImportMFG(item, isMapped);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
      } else {
        removeImportMFG(item, isMapped);
      }
    };
    const removeImportMFG = (item, isMapped) => {
      const objIDs = {
        id: item.mfgCodeAliasID,
        importMfg: item.importMfg,
        fromPageRequest: vm.type,
        isMapped: isMapped,
        isCustOrDisty: vm.isCustOrDisty
      };
      vm.cgBusyLoading = ManufacturerFactory.removeImportMFG().query(objIDs).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.getDerivedManufacturerList();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.viewWhereUsed = (rowDet, code, ev) => {
      const mfgDetail = {
        name: rowDet.mfgName,
        mfgCode: rowDet.mfgCode,
        isManufacturer: (vm.type === vm.mfgType.MFG ? true : false),
        mfgTypeLabel: vm.type === vm.mfgType.MFG ? (vm.isCustOrDisty ? vm.LabelConstant.Customer : vm.LabelConstant.Manufacturer) : vm.LabelConstant.Supplier
      };

      DialogFactory.dialogService(
        CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_CONTROLLER,
        CORE.VIEW_WHEREUSED_MANUFACTURER_MODAL_VIEW,
        ev,
        mfgDetail).then(() => { }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };
  }
})();
