(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('PartImportMappPopupController', PartImportMappPopupController);

  /** @ngInject */
  function PartImportMappPopupController($scope, $mdDialog, CORE, USER, data, BaseService, ComponentFactory, MasterFactory, DialogFactory, $rootScope, RFQTRANSACTION, socketConnectionService, PRICING, ImportBOMFactory, APIVerificationErrorPopupFactory) {
    var isDirty = false;
    const vm = this;
    vm.apiVerificationList = [];
    vm.apiErrorList = [];
    vm.apiConstant = RFQTRANSACTION.API_LINKS;
    vm.DefaultDateTimeFormat = _dateTimeDisplayFormat;
    vm.VerifyPNExternalTooltip = RFQTRANSACTION.VERIFY_PN_EXTERNALLY_TOOLTIP;
    vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
    vm.allMfgsModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
    vm.allMappedMfgsModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.LabelConstant = CORE.LabelConstant.MFG;
    vm.mfgType = CORE.MFG_TYPE;
    vm.type = data && data.type ? data.type : CORE.MFG_TYPE.MFG;
    vm.createdbyLabel = CORE.LabelConstant.COMMON.GRIDHEADER_CREATEDBY;
    vm.createdAtLabel = CORE.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE;
    vm.isAllowDeleteCustSuppAlias = false;
    vm.loginUser = BaseService.loginUser;
    vm.googleImage = CORE.GOOGLE_IMAGE;
    vm.currentPageName = vm.isCustOrDisty && vm.type === CORE.MFG_TYPE.MFG ? CORE.PAGENAME_CONSTANT[10].PageName : (vm.type === CORE.MFG_TYPE.MFG ? CORE.PAGENAME_CONSTANT[21].PageName : CORE.PAGENAME_CONSTANT[22].PageName);
    vm.apiMappedUnMappedList = [];
    vm.selectedItems = [];
    vm.isNoDataFound = false;
    vm.transactionID = null;
    vm.getVerificationMPNList = () => {
      vm.apiVerificationList = [];
      vm.apiErrorList = [];
      vm.isNoDataFound = true;
      vm.cgBusyLoading = ComponentFactory.getVerificationMPNList().query({ transactionID: vm.transactionID }).$promise.then((response) => {
        if (response && response.data) {
          vm.apiMappedUnMappedList = _.orderBy(response.data, ['isVerified'], ['asc']);
          vm.apiErrorList = _.filter(vm.apiMappedUnMappedList, (mfgDet) => !mfgDet.isVerified);
          const apiVerificationList = _.filter(vm.apiMappedUnMappedList, (mfgDet) => mfgDet.isVerified);
          vm.apiVerificationList = apiVerificationList;
          _.each(vm.apiVerificationList, (item) => {
            item.createdAt = BaseService.getUIFormatedDateTime(item.createdAt, vm.DefaultDateTimeFormat);
          });

          vm.isNoDataFound = false;
          getBOMStatusUpdate();
          getApierror();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getUserImportTransctionId = () => {
      vm.cgBusyLoading = ComponentFactory.getUserImportTransctionId().query({
        userid: vm.loginUser.userid
      }).$promise.then((resp) => {
        if (resp && resp.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.transactionID = resp && resp.data && resp.data.transactionID ? resp.data.transactionID : getGUID();
          vm.getVerificationMPNList();
        }
      });
    };
    vm.getUserImportTransctionId();
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
            ((mfgDet.importMfrName && mfgDet.importMfrName.toLowerCase().indexOf(searchTxt) !== -1) ||
              (mfgDet.importMfgPN && mfgDet.importMfgPN.toLowerCase().indexOf(searchTxt) !== -1)
              || mfgDet.userName.toLowerCase().indexOf(searchTxt) !== -1)
          );
        } else {
          errorList = vm.apiMappedUnMappedList.filter((mfgDet) =>
            !mfgDet.isVerified &&
            ((mfgDet.importMfrName && mfgDet.importMfrName.toLowerCase() === searchTxt) ||
              (mfgDet.importMfgPN && mfgDet.importMfgPN.toLowerCase() === searchTxt)
              || mfgDet.userName.toLowerCase() === searchTxt)
          );
        }
        vm.apiErrorList = errorList;
      }
      else {
        vm.apiErrorList = vm.apiMappedUnMappedList.filter((mfgDet) => !mfgDet.isVerified);
      }
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
            ((mfgDet.importMfrName && mfgDet.importMfrName.toLowerCase().indexOf(searchTxt) !== -1) ||
              (mfgDet.importMfgPN && mfgDet.importMfgPN.toLowerCase().indexOf(searchTxt) !== -1)
              || mfgDet.mfrName.toLowerCase().indexOf(searchTxt) !== -1 || mfgDet.mfgPN.toLowerCase().indexOf(searchTxt) !== -1
              || (mfgDet.supplierName && (mfgDet.supplierName.toLowerCase().indexOf(searchTxt) !== -1 ||
                (mfgDet.spn && mfgDet.spn.toLowerCase().indexOf(searchTxt) !== -1)))
              || mfgDet.createdBy.toLowerCase().indexOf(searchTxt) !== -1 || mfgDet.createdAt.toLowerCase().indexOf(searchTxt) !== -1
              || mfgDet.userName.toLowerCase().indexOf(searchTxt) !== -1)
          );
        } else {
          mappedList = vm.apiMappedUnMappedList.filter((mfgDet) =>
            mfgDet.isVerified &&
            ((mfgDet.importMfrName && mfgDet.importMfrName.toLowerCase() === searchTxt) ||
              (mfgDet.importMfgPN && mfgDet.importMfgPN.toLowerCase() === searchTxt)
              || (mfgDet.mfrName && mfgDet.mfrName.toLowerCase() === searchTxt) || mfgDet.mfgPN.toLowerCase() === searchTxt
              || (mfgDet.supplierName && (mfgDet.supplierName.toLowerCase() === searchTxt))
              || (mfgDet.spn && mfgDet.spn.toLowerCase() === searchTxt)
              || mfgDet.createdBy.toLowerCase() === searchTxt || mfgDet.createdAt.toLowerCase() === searchTxt
              || mfgDet.userName.toLowerCase() === searchTxt)
          );
        }
        vm.apiVerificationList = mappedList;
      }
      else {
        vm.apiVerificationList = _.filter(vm.apiMappedUnMappedList, (mfgDet) => mfgDet.isVerified);
      }
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

    //check for continue and close option
    vm.checkContinue = () => {
      const NotVetifiedObj = _.find(vm.apiMappedUnMappedList, (err) => !err.isVerified);
      return NotVetifiedObj;
    };

    // Update verified MFR list
    vm.refreshData = () => {
      vm.removeErrorListFilter();
      vm.removeVerifyListFilter();
      const isAnyVerified = _.filter(vm.apiErrorList, (item) => item.isVerified === true);
      vm.cgBusyLoading = ComponentFactory.UpdateVerificationManufacturer().query({ manufacturers: isAnyVerified }).$promise.then(() => {
        vm.getVerificationMPNList();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.appendMFRDetail = () => {
      openModelImportMFR(true);
    };

    const openModelImportMFR = (isAppend) => {
      const data = {
        transactionID: vm.transactionID,
        isAppend: isAppend
      };
      DialogFactory.dialogService(
        CORE.COMPONENT_IMPORT_MODAL_CONTROLLER,
        CORE.COMPONENT_IMPORT_MODAL_VIEW,
        vm.event,
        data).then(() => {
          //vm.loadData();
        }, () => {
          //vm.loadData();
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.cancel = (actionToPerform) => {
      const objCheck = {
        isContinue: actionToPerform,
        isDirty: isDirty
      };
      if (objCheck.isDirty || objCheck.isContinue) {
        if (objCheck.isContinue) {
          const objIDs = {
            partID: CORE.DEFUALT_IMPORT_PART_ID
          };
          vm.cgBusyLoading = ComponentFactory.removeImportMPNMappDet().query(objIDs).$promise.then((response) => {
            if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.getVerificationMPNList();
              $mdDialog.cancel();
              openModelImportMFR();
            }
          });
        } else {
          $mdDialog.cancel();
        }
      } else {
        $mdDialog.cancel(false);
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
    //go to digikey link
    vm.gotoSupplier = (partNumber, link, isfindchip) => {
      if (isfindchip || link === vm.apiConstant.DIGIKEY) {
        partNumber = encodeURIComponent(partNumber);
      }
      link = stringFormat('{0}{1}', link, partNumber);
      BaseService.openURLInNew(link);
    };
    vm.goToComponentDetail = (partId, mfgType) => {
      BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
    };
    vm.gotoGoogle = (mfg) => {
      BaseService.searchToGoogle(mfg);
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
    const removeImportMFG = (item) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Import Part', 1);

      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then(() => {
        const objIDs = {};
        if (item && item._id) {
          objIDs.id = item._id;
          objIDs.partID = CORE.DEFUALT_IMPORT_PART_ID;
          objIDs.importMPN = item.importMfgPN;
        }
        vm.cgBusyLoading = ComponentFactory.removeImportMPNMappDet().query(objIDs).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.getVerificationMPNList();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }, () => {
        // cancel
      });
    };

    // Get Supplier API error for show API error count
    function getApierror(isOpenError) {
      var objApi = {
        transactionID: vm.transactionID,
        partID: CORE.DEFUALT_IMPORT_PART_ID
      };
      APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
        if (response && response.data && response.data.bomError) {
          vm.issueCount = response.data.bomError.length;
          if (isOpenError && !vm.socketErrorOpened) {
            if (vm.issueCount > 0) {
              openErrorListPopup();
            }
            vm.getVerificationMPNList();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // on disconnect socket
    //update progress for bom clean process
    function sendBOMStatusProgressbarUpdate(message) {
      if (message && message.partID && parseInt(message.partID) === parseInt(CORE.DEFUALT_IMPORT_PART_ID) && message.transactionID === vm.transactionID) {
        getBOMStatusUpdate(true);
      }
    }

    function getBOMStatusUpdate(isOpenError) {
      ImportBOMFactory.retrieveBOMorPMPregressStatus().query({
        partID: CORE.DEFUALT_IMPORT_PART_ID,
        transactionID: vm.transactionID
      }).$promise.then((response) => {
        if (response && response.data && response.data.length > 0) {
          vm.bomCleanProgress = response.data[0].percentage ? response.data[0].percentage : 1;
          vm.remainTime = seconds_to_days_hours_mins_secs_str(response.data[0].remainTime);
        }
        if (vm.bomCleanProgress === 100 && !vm.remainTime && isOpenError) {
          getApierror(isOpenError);
        }
      });
    }

    function BOMconnectSocket() {
      socketConnectionService.on(PRICING.EventName.sendBOMStatusProgressbarUpdate, sendBOMStatusProgressbarUpdate);
    }
    BOMconnectSocket();
    // Socket io listener remove
    function BOMremoveSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.sendBOMStatusProgressbarUpdate, sendBOMStatusProgressbarUpdate);
    }
    // Socket io reconnect method
    socketConnectionService.on('reconnect', () => {
      BOMremoveSocketListener();
      BOMconnectSocket();
    });

    // External Verification Step
    vm.apiVerification = function (isOpenError) {
      var objApi = {
        transactionID: vm.transactionID,
        partID: CORE.DEFUALT_IMPORT_PART_ID
      };
      vm.cgBusyLoading = APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
        if (response && response.data && response.data.bomError && response.data.bomError.length > 0) {
          vm.issueCount = response.data.bomError.length;
          if (isOpenError) {
            openErrorListPopup();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.verifyInternally = () => {
      vm.cgBusyLoading = ComponentFactory.importComponentDetail().query({ mfgPnImportedDetail: [], transactionID: vm.transactionID }).$promise.then((manufacturer) => {
        if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.getVerificationMPNList();
        }
      });
    };
    // Open Error list pop-up in case of external verification pop-up
    function openErrorListPopup() {
      var data = {
        transactionID: vm.transactionID,
        partID: CORE.DEFUALT_IMPORT_PART_ID
      };
      vm.socketErrorOpened = true;
      DialogFactory.dialogService(
        RFQTRANSACTION.API_VERIFICATION_ERROR_CONTROLLER,
        RFQTRANSACTION.API_VERIFICATION_ERROR_VIEW,
        null,
        data).then(() => {
          vm.socketErrorOpened = false;
        }, (data) => {
          if (data && data.iscontinue) {
            vm.continue = true;
            vm.apiVerification();
            vm.verifyInternally();
          }
          else {
            getApierror();
          }
          vm.socketErrorOpened = false;
        });
    }

    vm.cancelAPIVerification = () => {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
        textContent: CORE.MESSAGE_CONSTANT.CANCEL_VERIFY_PN_EXTRNALLY_CONFIRMATION_MESSAGE,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          vm.cgBusyLoading = ComponentFactory.stopImportPartVerification().query({
            partID: CORE.DEFUALT_IMPORT_PART_ID,
            transactionID: vm.transactionID
          }).$promise.then((manufacturer) => {
            if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.getVerificationMPNList();
            }
          });
        }
      }, () => {
        // Empty
      });
    };

    vm.addPart = function (item, $event) {
      var data = {
        Name: item.importMfgPN,
        Title: 'Component',
        parentId: null,
        mfgType: CORE.MFG_TYPE.MFG
      };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE], pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        data.Name = item.importMfgPN;
        data.isBadPart = CORE.PartCorrectList.CorrectPart;
        data.mfgCode = item.importMfrName;
        DialogFactory.dialogService(
          CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          CORE.MANAGE_COMPONENT_MODAL_VIEW,
          $event,
          data).then((responsne) => {
            if (responsne) {
              vm.reVerifyMPNImport(item);
            }
          }, () => {
          }, () => { }, (error) => BaseService.getErrorLog(error));
      }
    };
    vm.addMFG = function (item, $event) {
      var data = {
        Name: item.importMfrName,
        Title: CORE.COMPONENT_MFG_TYPE.MANUFACTURER,
        mfgType: CORE.MFG_TYPE.MFG,
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
            vm.reVerifyMPNImport(item);
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.reVerifyMPNImport = (item) => {
      vm.cgBusyLoading = ComponentFactory.reVerifyMPNImport().query(item).$promise.then((manufacturer) => {
        if (manufacturer && manufacturer.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.getVerificationMPNList();
        }
      });
    };
    //close pop-up on destroy page
    $scope.$on('$destroy', () => {
      //isSummarySubmitted();
      BOMremoveSocketListener();
    });
  }
})();
