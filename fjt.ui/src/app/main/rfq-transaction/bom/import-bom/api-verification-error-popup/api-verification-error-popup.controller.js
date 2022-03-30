(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('APIVerificationErrorPopupController', APIVerificationErrorPopupController);

  /** @ngInject */
  function APIVerificationErrorPopupController($mdDialog, $stateParams, CORE, USER, data, BaseService, APIVerificationErrorPopupFactory, DialogFactory, RFQTRANSACTION, ImportBOMFactory) {
    const vm = this;
    vm.apiVerificationSummaryList = [];
    vm.ispartMaster = data.isPartmaster;
    if (!vm.ispartMaster) {
      vm.partID = parseInt(data.partID);
    }
    vm.pricingErrorTypes = CORE.PRICING_ERROR_TYPES;
    vm.googleImage = CORE.GOOGLE_IMAGE;
    vm.tableName = CORE.TABLE_NAME;
    vm.addNewFlag = CORE.MESSAGE_CONSTANT.ADD_NEW;
    vm.addNewAliasFlag = CORE.MESSAGE_CONSTANT.ADD_NEW_ALIAS;
    vm.distType = CORE.MFG_TYPE.DIST;
    vm.mfgType = CORE.MFG_TYPE.MFG;
    vm.empty = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.emptyState = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.API_ERROR_EMPTY_STATE;
    vm.apiConstant = RFQTRANSACTION.API_LINKS;
    vm.LabelConstant = CORE.LabelConstant.MFG;
    vm.isActivityStart = data.isReadOnly ? false : true;
    vm.selectedItems = [];
    vm.transactionID = data.transactionID;
    const DOESNOTEXISTS = 'does not exist. Please add.';
    const DISABLETEXT = 'is disabled. Please enable.';
    function init() {
      var objApi = {
        ispartMaster: vm.ispartMaster,
        partID: vm.partID,
        partNumber: data.partNumber,
        transactionID: data.transactionID
      };
      vm.cgBusyLoading = APIVerificationErrorPopupFactory.getAPIVerificationErrors().query({ objApiError: objApi }).$promise.then((response) => {
        if (response && response.data && response.data.bomError) {
          if (response.data.bomError.length === 0) {
            vm.NoDataFound = true;
            vm.isFormDirty = false;
            return;
          }
          vm.bomErrors = angular.copy(response.data.bomError);
          let previousList = [];
          previousList = angular.copy(vm.apiVerificationSummaryList);
          //vm.sortType = 'p';
          //vm.asc = true;
          vm.apiVerificationSummaryList = [];
          const apiError = _.uniqBy(response.data.bomError, (x) => x.errorMsg.toLowerCase());
          _.each(apiError, (error) => {
            switch (error.errorType) {
              case vm.pricingErrorTypes.MFGNOTADDED: {
                error.displayName = vm.LabelConstant.Manufacturers;
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.DISTNOTADDED: {
                error.displayName = vm.LabelConstant.Supplier;
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.PARTINVALID: {
                error.displayName = 'Part';
                error.message = stringFormat('not found in supplier APIs ({0}). Investigate and add part manually in part master.', error.supplierAPI ? error.supplierAPI : 'DK, MO, AV, NW, AR, TTI, HEILIND');
                break;
              }
              case vm.pricingErrorTypes.MOUNTNOTADDED: {
                error.displayName = 'Mounting Type';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.MOUNTINACTIVE: {
                error.displayName = 'Mounting Type';
                error.message = DISABLETEXT;
                break;
              }
              case vm.pricingErrorTypes.UOMNOTADDED: {
                error.displayName = 'Unit';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.UOMINACTIVE: {
                error.displayName = 'Unit';
                error.message = DISABLETEXT;
                break;
              }
              case vm.pricingErrorTypes.UOMCLASSNOTADDED: {
                error.displayName = 'Measurement Type';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.UOMCLASSINACTIVE: {
                error.displayName = 'Measurement Type';
                error.message = DISABLETEXT;
                break;
              }
              case vm.pricingErrorTypes.PARTTYPENOTADDED: {
                error.displayName = 'Functional Type';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.PARTTYPEINACTIVE: {
                error.displayName = 'Functional Type';
                error.message = DISABLETEXT;
                break;
              }
              case vm.pricingErrorTypes.ROHSNOTADDED: {
                error.displayName = 'RoHS';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.ROHSINACTIVE: {
                error.displayName = 'RoHS';
                error.message = DISABLETEXT;
                break;
              }
              case vm.pricingErrorTypes.CONNECTNOTADDED: {
                error.displayName = 'Connector Type';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.CONNECTINACTIVE: {
                error.displayName = 'Connector Type';
                error.message = DISABLETEXT;
                break;
              }
              case vm.pricingErrorTypes.PACKAGINGNOTADDED: {
                error.displayName = 'Packaging Type';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.PACKAGINGINACTIVE: {
                error.displayName = 'Packaging Type';
                error.message = DISABLETEXT;
                break;
              }
              case vm.pricingErrorTypes.PARTSTATUSNOTADDED: {
                error.displayName = 'Part Status';
                error.message = DOESNOTEXISTS;
                break;
              }
              case vm.pricingErrorTypes.PARTSTATUSINACTIVE: {
                error.displayName = 'Part Status';
                error.message = DISABLETEXT;
                break;
              }
            }
            error.isopen = (_.find(previousList, (open) => error.errorMsg.toLowerCase() === open.errorMsg.toLowerCase() && open.isopen)) ? true : false;
            error.apiVerificationErrorList = _.filter(vm.bomErrors, (lst) => lst.errorMsg.toLowerCase() === error.errorMsg.toLowerCase());
            if ((error.errorType === vm.pricingErrorTypes.AUTHFAILED || error.errorType === vm.pricingErrorTypes.UNKNOWN) && error.apiVerificationErrorList.length > 0) {
              error.apiVerificationErrorList.length = 1;
            }
            error.totalError = error.apiVerificationErrorList.length;
            vm.apiVerificationSummaryList.push(error);
          });
          vm.apiVerificationSummaryList = _.orderBy(vm.apiVerificationSummaryList, ['errorMsg'], ['desc']);
        }
        vm.isFormDirty = false;
      }).catch((error) => BaseService.getErrorLog(error));
    }

    init();

    vm.addMFG = function (item, type, $event) {
      var data = {
        Name: item.DataField,
        Title: CORE.COMPONENT_MFG_TYPE.MANUFACTURER,
        Button: type,
        mfgType: item.Type === CORE.MFG_TYPE.MFG ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
        isBadPart: false
      };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGEMANUFACTURER_DETAIL_STATE], pageNameAccessLabel: CORE.PageName.manufacturer };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        setAllDetailFlag();
        DialogFactory.dialogService(
          CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
          CORE.MANAGE_MFGCODE_MODAL_VIEW,
          $event,
          data).then(() => {
            vm.isFormDirty = true;
            if (item.Type === CORE.MFG_TYPE.MFG) {
              item.isMfgUsed = true;
            } else {
              item.isDistUsed = true;
            }
          }, () => {
            vm.isFormDirty = true;
            if (item.Type === CORE.MFG_TYPE.MFG) {
              item.isMfgUsed = true;
            } else {
              item.isDistUsed = true;
            }
          }, (error) => BaseService.getErrorLog(error));
      }
    };
    //common error for all
    function commonCodeError(Item) {
      var summaryDet = _.find(vm.apiVerificationSummaryList, (apiError) => apiError.errorMsg.toLowerCase() === Item.errorMsg.toLowerCase());
      if (summaryDet) {
        summaryDet.isVerified = true;
        _.map(summaryDet.apiVerificationErrorList, verifiedError);
        removeError(summaryDet.apiVerificationErrorList);
      }
    }
    //go to digikey link
    vm.gotoSupplier = (partNumber, link, isfindchip) => {
      if (isfindchip || link === vm.apiConstant.DIGIKEY) {
        partNumber = encodeURIComponent(partNumber);
      }
      link = stringFormat('{0}{1}', link, partNumber);
      BaseService.openURLInNew(link);
    };
    vm.openAuthVerificationPopup = function ($event, Item) {
      var data = {
        clientID: Item.ClientID,
        appID: Item.appID,
        isNewVersion: _DkVersion === CORE.DKVersion.DKV2 ? false : true
      };
      DialogFactory.dialogService(
        CORE.DIGIKEY_VERIFICATION_MODAL_CONTROLLER,
        CORE.DIGIKEY_VERIFICATION_MODAL_VIEW,
        $event,
        data).then(() => {
          Item.isVerified = true;
          if (Item.apiVerificationErrorList) {
            Item.apiVerificationErrorList.forEach((obj) => {
              if (obj.errorType === vm.pricingErrorTypes.AUTHFAILED) {
                obj.isVerified = true;
              }
            });
            removeError(Item.apiVerificationErrorList);
          }
          else {
            commonCodeError(Item);
          }
        }, (err) => BaseService.getErrorLog(err));
    };
    //function verified all list
    function verifiedError(ErrorItem) {
      ErrorItem.isVerified = true;
    }

    vm.queryOperation = {
      order: ''
    };

    //remove filter
    vm.removeFilter = () => {
      vm.errorSearch = null;
    };

    vm.addComponent = function (item, type, $event) {
      var data = {
        Name: item.partNumber,
        Title: 'Component',
        parentId: null,
        mfgType: type,
        description: item.description
      };
      const routeState = (type && type.toUpperCase() === CORE.MFG_TYPE.DIST) ? USER.ADMIN_MANAGEDISTCOMPONENT_DETAIL_STATE : USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE;
      const popUpData = { popupAccessRoutingState: [routeState], pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        if (item.Type === 'PIDCodeLength') {
          data.Name = item.ActualPart;
          data.isBadPart = CORE.PartCorrectList.CorrectPart;
          data.mfgCode = item.MFGCode;
          data.parentId = parseInt(item.DataField);
          data.description = item.apiPartdesc;
        }
        DialogFactory.dialogService(
          CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
          CORE.MANAGE_COMPONENT_MODAL_VIEW,
          $event,
          data).then(() => {
          }, () => {
            vm.isFormDirty = true;
          }, () => { vm.isFormDirty = true; }, (error) => BaseService.getErrorLog(error));
      }
    };

    vm.cancel = (con) => {
      var isAnyVerified = _.some(vm.apiVerificationSummaryList, (item) => item.isVerified === true);
      var data = {
        isAnyVerified: isAnyVerified,
        iscontinue: con,
        verifiedErrors: isAnyVerified ? _.filter(vm.apiVerificationSummaryList, (err) => err.isVerified === true) : []
      };
      $mdDialog.cancel(data);
    };
    //open popup to add mounting type master to add alias
    vm.addMountingType = function (item, $event) {
      var data = {
        isEdit: true,
        aliasText: (item.errorType === vm.pricingErrorTypes.MOUNTINACTIVE ? null : item.DataField),
        refTableName: vm.tableName.RFQ_MOUNTINGTYPE,
        isMaster: item.errorType === vm.pricingErrorTypes.MOUNTINACTIVE
      };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE], pageNameAccessLabel: CORE.PageName.mounting_type };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        setAllDetailFlag();
        DialogFactory.dialogService(
          CORE.MANAGE_MOUNTING_TYPE_MODAL_CONTROLLER,
          CORE.MANAGE_MOUNTING_TYPE_MODAL_VIEW,
          $event,
          data).then(() => {
            vm.isFormDirty = true;
            item.isMountingType = true;
          }, () => { vm.isFormDirty = true; item.isMountingType = true;}, (error) => BaseService.getErrorLog(error));
      }
    };
    /* add.edit measurement types*/
    vm.addEditMeasurementType = (item, ev) => {
      setAllDetailFlag();
      const data = {
        id: item.attributeId,
        aliasText: item.DataField
      };
      DialogFactory.dialogService(
        CORE.MANAGE_MEASUREMENT_TYPES_MODAL_CONTROLLER,
        CORE.MANAGE_MEASUREMENT_TYPES_MODAL_VIEW,
        ev,
        data
      ).then(() => {
      }, () => {
          vm.isFormDirty = true;
          item.isMeasurementType = true; 
      }, () => { vm.isFormDirty = true; item.isMeasurementType = true; }, (error) => BaseService.getErrorLog(error));
    };
    //open popup to add unit to add alias
    vm.addUnit = function (item, $event) {
      var data = {
        isEdit: true,
        aliasText: item.DataField,
        refTableName: vm.tableName.UOM
      };
      DialogFactory.dialogService(
        CORE.COMPONENT_FIELD_GENERIC_ALIAS_CONTROLLER,
        CORE.COMPONENT_FIELD_GENERIC_ALIAS_VIEW,
        $event,
        data).then(() => {
          vm.isFormDirty = true;
          item.isunitMaster = true;
        }, () => { vm.isFormDirty = true; item.isunitMaster = true; }, (error) => BaseService.getErrorLog(error));
    };

    //open popup to add functional type master to add alias
    vm.addPartType = function (item, $event) {
      var data = {
        isEdit: true,
        refTableName: vm.tableName.RFQ_PARTTYPE,
        aliasText: (item.errorType === vm.pricingErrorTypes.PARTTYPEINACTIVE ? null : item.partType),
        isMaster: item.errorType === vm.pricingErrorTypes.PARTTYPEINACTIVE
      };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_PART_TYPE_STATE], pageNameAccessLabel: CORE.PageName.funtional_type };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        setAllDetailFlag();
        DialogFactory.dialogService(
          CORE.MANAGE_PART_TYPE_MODAL_CONTROLLER,
          CORE.MANAGE_PART_TYPE_MODAL_VIEW,
          $event,
          data).then(() => {
            vm.isFormDirty = true;
            item.isfunctionaltype = true;
          }, () => { vm.isFormDirty = true; item.isfunctionaltype = true; }, (error) => BaseService.getErrorLog(error));
      }
    };

    vm.addRohs = function (item, $event) {
      var data = {
        isEdit: true,
        isMaster: item.errorType === vm.pricingErrorTypes.ROHSINACTIVE,
        refTableName: vm.tableName.RFQ_ROHS,
        aliasText: (item.errorType === vm.pricingErrorTypes.ROHSINACTIVE ? null : item.DataField)
      };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_ROHS_STATE], pageNameAccessLabel: CORE.PageName.rohs_status };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        setAllDetailFlag();
        DialogFactory.dialogService(
          CORE.MANAGE_ROHS_MODAL_CONTROLLER,
          CORE.MANAGE_ROHS_MODAL_VIEW,
          $event,
          data).then(() => {
            vm.isFormDirty = true;
            item.isRohsType = true;
          }, () => { vm.isFormDirty = true; item.isRohsType = true;}, (error) => BaseService.getErrorLog(error));
      }
    };
    //open popup to add connector type master to add alias
    vm.addConnecterType = function (item, $event) {
      var data = {
        isEdit: true,
        aliasText: (item.errorType === vm.pricingErrorTypes.CONNECTINACTIVE ? null : item.DataField),
        refTableName: vm.tableName.RFQ_CONNECTERTYPE,
        isMaster: item.errorType === vm.pricingErrorTypes.CONNECTINACTIVE
      };
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_CONNECTER_TYPE_STATE], pageNameAccessLabel: CORE.PageName.connector_type };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        setAllDetailFlag();
        DialogFactory.dialogService(
          CORE.MANAGE_CONNECTER_TYPE_MODAL_CONTROLLER,
          CORE.MANAGE_CONNECTER_TYPE_MODAL_VIEW,
          $event,
          data).then(() => {
            vm.isFormDirty = true;
            item.isConncetorType = true;
          }, () => { vm.isFormDirty = true; item.isConncetorType = true;}, (error) => BaseService.getErrorLog(error));
      }
    };


    //open popup to add connector type master to add alias
    vm.addPackagingType = function (item, $event) {
      var data = {
        isEdit: true,
        aliasText: (item.errorType === vm.pricingErrorTypes.PACKAGINGINACTIVE ? null : item.DataField),
        refTableName: vm.tableName.COMPONENT_PACKAGINGTYPE,
        isMaster: item.errorType === vm.pricingErrorTypes.PACKAGINGINACTIVE
      };

      const popUpData = { popupAccessRoutingState: [USER.ADMIN_PACKAGING_TYPE_STATE], pageNameAccessLabel: CORE.PageName.packaging_type };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        setAllDetailFlag();
        DialogFactory.dialogService(
          CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
          CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
          $event,
          data).then(() => {
            vm.isFormDirty = true;
            item.ispackagingType = true;
          }, () => { vm.isFormDirty = true; item.ispackagingType = true;}, (error) => BaseService.getErrorLog(error));
      }
    };



    function removeError(ErrorList) {
      var list = _.map(_.filter(ErrorList, (err) => err.isVerified === true), '_id');
      var objError = {
        errorPopup: true,
        list: list
      };
      ImportBOMFactory.removeComponentStatus().query({ statusObject: objError });
    }
    function savePIDChanges(pidData) {
      if (!pidData) {
        pidData = {};
      }
      pidData.transactionID = vm.transactionID;
      pidData.partID = vm.partID ? vm.partID : null;
      ImportBOMFactory.saveUpdatedPIDCode().query({ pidObject: pidData });
    }
    //check for continue and close option
    vm.checkContinue = () => _.find(vm.apiVerificationSummaryList, (err) => !err.isVerified);
    //check any one operation is resolved or not
    vm.checkContinueButton = () => _.find(vm.apiVerificationSummaryList, (err) => err.isVerified);
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

    //add part status
    vm.addPartStatus = (item, $event) => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_PART_STATUS_STATE], pageNameAccessLabel: CORE.PageName.part_status };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        setAllDetailFlag();
        const data = {
          isEdit: true,
          aliasText: (item.errorType === vm.pricingErrorTypes.PARTSTATUSINACTIVE ? null : item.DataField),
          refTableName: vm.tableName.COMPONENT_PARTSTATUS,
          isMaster: item.errorType === vm.pricingErrorTypes.PARTSTATUSINACTIVE
        };
        DialogFactory.dialogService(
          USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_PART_STATUS_ADD_UPDATE_MODAL_VIEW,
          $event,
          data).then(() => {
            vm.isFormDirty = true;
          }, () => { vm.isFormDirty = true; item.isPartStatus = true; }, (error) => BaseService.getErrorLog(error));
      }
    };

    // set all flag as false
    const setAllDetailFlag = () => {
      vm.apiVerificationSummaryList.map((item) => {
        item.isMfgUsed = false;
        item.isDistUsed = false;
        item.isChangePID = false;
        item.isMountingType = false;
        item.isunitMaster = false;
        item.isMeasurementType = false;
        item.isfunctionaltype = false;
        item.isRohsType = false;
        item.isConncetorType = false;
        item.isPartStatus = false;
        item.ispackagingType = false;
      });
    };
    vm.changePIDCode = (item, event) => {
      item.selectedMfgType = vm.mfgType;
      setAllDetailFlag();
      DialogFactory.dialogService(
        RFQTRANSACTION.API_VERIFICATION_PID_CODE_CHANGE_CONTROLLER,
        RFQTRANSACTION.API_VERIFICATION_PID_CODE_CHANGE_VIEW,
        event,
        item).then((data) => {
          if (data) {
            item.isVerified = true;
            if (item.apiVerificationErrorList) {
              item.apiVerificationErrorList.forEach((obj) => {
                if (obj.errorType === item.errorType) {
                  obj.isVerified = true;
                }
              });
              removeError(item.apiVerificationErrorList);
            }
            else {
              commonCodeError(item);
            }
            savePIDChanges(item);
          }
          vm.isFormDirty = true;
        }, () => {
          item.isChangePID = true;
          vm.isFormDirty = true;
        }, (err) => BaseService.getErrorLog(err));
    };

    //change credential
    vm.changeDKCredential = (item, event) => {
      DialogFactory.dialogService(
        USER.EXTERNAL_API_POPUP_CONTROLLER,
        USER.EXTERNAL_API_POPUP_VIEW,
        event,
        null).then(() => {
        }, (data) => {
          if (data) {
            item.isVerified = true;
            if (item.apiVerificationErrorList) {
              item.apiVerificationErrorList.forEach((obj) => {
                if (obj.errorType === item.errorType) {
                  obj.isVerified = true;
                }
              });
              removeError(item.apiVerificationErrorList);
            }
            else {
              commonCodeError(item);
            }
          }
          vm.isFormDirty = true;
        }, (err) => BaseService.getErrorLog(err));
    };

    //Refresh Pricing error which is already solved by another user
    vm.refershSupplierError = (deletedRecord) => {
      var Errors = _.filter(vm.apiVerificationSummaryList, (errors) => (errors.errorType !== vm.pricingErrorTypes.CONTACTADMIN && errors.errorType !== vm.pricingErrorTypes.UNKNOWN));
      Errors = _.uniq(Errors); // only unique error will send here
      vm.cgBusyLoading = ImportBOMFactory.removeDuplicateSupplierError().query({ supplierErrors: Errors, deletedRecord: deletedRecord }).$promise.then(() => {
        init();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.gotoGoogle = (mfg) => {
      BaseService.searchToGoogle(mfg);
    };

    // Goto part Url of API source
    vm.gotoPartURL = (productUrl) => {
      BaseService.openURLInNew(decodeURIComponent(productUrl));
    };
    // Delete Error from list
    vm.deleteError = (data) => {
      const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ROW_CONFIRMATION_MESSAGE);
      const model = {
        messageContent: messgaeContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(model).then(() => {
        if (data.apiVerificationErrorList) {
          data.apiVerificationErrorList.forEach((obj) => {
            if (obj.errorType === data.errorType) {
              obj.isVerified = true;
            }
          });
          removeError(data.apiVerificationErrorList);
          const deletedRecord = true;
          vm.refershSupplierError(deletedRecord);
        }
        else {
          data.isVerified = true;
          const deletedRecord = true;
          removeError([data]);
          vm.refershSupplierError(deletedRecord);
        }
      }, () => {
      });
    };

    vm.gotoMasterList = (error) => {
      switch (error.errorType) {
        case vm.pricingErrorTypes.MFGNOTADDED: {
          BaseService.goToManufacturerList();
          break;
        }
        case vm.pricingErrorTypes.DISTNOTADDED: {
          BaseService.goToSupplierList();
          break;
        }
        case vm.pricingErrorTypes.PARTINVALID: {
          BaseService.goToPartList();
          break;
        }
        case vm.pricingErrorTypes.MOUNTNOTADDED || vm.pricingErrorTypes.MOUNTINACTIVE: {
          BaseService.goToMountingTypeList();
          break;
        }
        case vm.pricingErrorTypes.UOMNOTADDED || vm.pricingErrorTypes.UOMINACTIVE: {
          BaseService.goToUOMList();
          break;
        }
        case vm.pricingErrorTypes.UOMCLASSNOTADDED || vm.pricingErrorTypes.UOMCLASSINACTIVE: {
          BaseService.goToUOMList();
          break;
        }
        case vm.pricingErrorTypes.PARTTYPENOTADDED || vm.pricingErrorTypes.PARTTYPEINACTIVE: {
          BaseService.goToFunctionalTypeList();
          break;
        }
        case vm.pricingErrorTypes.ROHSNOTADDED || vm.pricingErrorTypes.ROHSINACTIVE: {
          BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
          break;
        }
        case vm.pricingErrorTypes.CONNECTNOTADDED || vm.pricingErrorTypes.CONNECTINACTIVE: {
          BaseService.openInNew(USER.ADMIN_CONNECTER_TYPE_STATE, {});
          break;
        }
        case vm.pricingErrorTypes.PACKAGINGNOTADDED || vm.pricingErrorTypes.PACKAGINGINACTIVE: {
          BaseService.goToPackageCaseTypeList();
          break;
        }
        case vm.pricingErrorTypes.PARTSTATUSNOTADDED || vm.pricingErrorTypes.PARTSTATUSINACTIVE: {
          BaseService.openInNew(USER.ADMIN_PART_STATUS_STATE, {});
          break;
        }
      }
    };
  }
})();
