(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SearchCollectPartPopupController', SearchCollectPartPopupController);

  /** @ngInject */
  function SearchCollectPartPopupController($scope, $mdDialog, data, BaseService, CORE, $timeout, USER,
    WorkorderTransactionUMIDFactory,
    DialogFactory, TRANSACTION) {
    const vm = this;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.sumObj = {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.data = data || {};
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    // go to umid list
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    }
    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    //sacn label 
    vm.scanLabel = (e, isUMID) => {
      if (!vm.data.isDisableScan) {
        $timeout(function () { scanLabel(e, isUMID) }, true);
      }
      ///** Prevent enter key submit event */
    }
    //scan umid or feeder
    let scanLabel = (e, isUMID) => {
      if (e.keyCode == 13) {
        if (!isUMID) {
          if (vm.feederLocation) {
            vm.validateFeederDetails(e);
          } else {
            // case will not come but incase no feeder entered than display invalid
            invalidAlert("Feeder Location");
          }
        }
        else if (isUMID) {
          if (vm.umid) {
            vm.validateUMIDDetails(e);
          } else {
            // case will not come but incase umid entered selected than display invalid
            invalidAlert("UMID");
          }
        } else {
          // case will not come byt incase no feeder type selected than display invalid
          let alertModel = {
            title: CORE.MESSAGE_CONSTANT.INVALID,
            textContent: CORE.MESSAGE_CONSTANT.INVALID,
            multiple: true
          };
          DialogFactory.alertDialog(alertModel);
        }
      }
    }
    //open alert for invalid feeder or umid
    let invalidAlert = (fieldName) => {
      let alertModel = {
        title: CORE.MESSAGE_CONSTANT.INVALID,
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.INVALID_DYNAMIC, fieldName),
        multiple: true
      };
      DialogFactory.alertDialog(alertModel);
    }

    // feeder first scan - validation
    vm.validateFeederDetails = (e) => {
      let feederObj = {
        feederLocation: vm.feederLocation || null,
        partID: vm.data.partID || null,
        woOpEqpID: vm.data.woOpEqpID || null,
        woOPID: vm.data.woOPID || null,
        woTransID: vm.data.woTransID || null,
        woID: vm.data.woID,
      };
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.validateScanFeederForSearch().query({ feederObj: feederObj }).$promise.then((res) => {
        //let errorMessage = [];
        vm.allocatedUMIDList = [];
        if (res.data && res.data.invalidMessage.length > 0 && res.data.invalidMessage[0].invalidMessage) {
          let alertModel = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: res.data.invalidMessage[0].invalidMessage,
            multiple: true
          };
          DialogFactory.alertDialog(alertModel, callbackFunction);
        } else if (res.data && res.data.allocatedUMIDList.length > 0 && !res.data.invalidMessage[0].invalidMessage) {
          vm.allocatedUMIDList = res.data.allocatedUMIDList;
          vm.isdirty = true;
          BaseService.currentPageFlagForm = [vm.isdirty];
          vm.clear();
        } else if (res.data.allocatedUMIDList.length == 0) {
          let alertModel = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.UMID_NOT_IN_KIT,
            multiple: true
          };
          DialogFactory.alertDialog(alertModel, callbackFunction);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //focus on feeder location
    let callbackFunction = () => {
      scanFocus('feederLocation');
    }
    //focus on umid
    let callbackFunctionUMID = () => {
      scanFocus('umid');
    }
    //cancel popup
    vm.cancel = () => {
      if (vm.isdirty) {
        let obj = {
          title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
          textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            BaseService.currentPageFlagForm = [];
            $mdDialog.cancel();
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        $mdDialog.cancel();
      }
    };
    //common popup for focus
    let scanFocus = (fieldID) => {
      let element = document.getElementById(fieldID);
      if (element) {
        element.focus();
      }
    }

    vm.selectedUMIDList = [];
    //open popup to transfer UMID
    vm.uidTranfer = (event, data) => {
      data.uid = null;
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then(() => {
        }, (transfer) => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }
     // UMID first scan - validation
    vm.validateUMIDDetails = (e) => {
      let umidObj = {
        feederLocation: vm.feederLocation || null,
        UMID: vm.umid || null,
        partID: vm.data.partID || null,
        woOpEqpID: vm.data.woOpEqpID || null,
        woOPID: vm.data.woOPID || null,
        woTransID: vm.data.woTransID || null,
        employeeId: vm.data.employeeId || null,
        checkKitAllocation: true,
        verificationType: CORE.VerificationType.UMIDFirst,
        isVerify: true,
        isConfirmed: true,
        woID: vm.data.woID,
        transactionType: CORE.TransactionType.Feeder,
      };
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.validateScanUMIDFirst().query({ umidObj: umidObj }).$promise.then((res) => {
        let errorMessage = [];
        if (res.data && res.data.errorObjList && res.data.errorObjList.length > 0) {
          // display error message on screen
          errorMessage = _.filter(res.data.errorObjList, (itemObj) => {
            return itemObj.isFeederError || itemObj.isUMIDError;
          });
          if (errorMessage.length > 0) {
            errorMessage = errorMessage.map((item) => { return item.errorText }).join("<br/>");
            vm.errorText = errorMessage;
            let alertModel = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: vm.errorText,
              multiple: true
            };
            DialogFactory.alertDialog(alertModel, callbackFunctionUMID);
          }
        }
        else if (res.data && res.data.umidDetails && res.data.umidDetails[0].feederLocation) {
          vm.feederLocation = res.data.umidDetails[0].feederLocation;
          vm.validateFeederDetails(e);
        }
        else {
          getFeederFromUMID(e);
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.clear = () => {
      vm.feederLocation = '';
      vm.umid = '';
    }
    //Add feeder detail if remove from list of selected UMIDs
    let addFeederDetail = $scope.$on('add-feeder', function (name, data) {
      if (data) {
        vm.allocatedUMIDList.push(data);
      }
    });

    $scope.$on('$destroy', function () {
      addFeederDetail();
    });
    //get all feeder list from umid
    let getFeederFromUMID = (e) => {
      WorkorderTransactionUMIDFactory.getFeederDeatilFromUMID().query({ pUMID: vm.umid }).$promise.then((res) => {
        if (res.data) {
          vm.feederlist = res.data;
          if (vm.feederlist.length == 1) {
            vm.feederLocation = vm.feederlist[0].feederLocation;
            vm.validateFeederDetails(e);
          } else if (vm.feederlist.length > 1) {
            openFeederLocation(e);
          } else {
            let alertModel = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: CORE.MESSAGE_CONSTANT.UMID_NOT_IN_KIT,
              multiple: true
            };
            DialogFactory.alertDialog(alertModel, callbackFunctionUMID);
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //open popup for feeder location
    let openFeederLocation = (e) => {
      DialogFactory.dialogService(
        CORE.SELECT_FEEDER_LOCATION_MODAL_CONTROLLER,
        CORE.SELECT_FEEDER_LOCATION_MODAL_VIEW,
        e,
        vm.feederlist).then(() => {
        }, (selectItem) => {
          if (selectItem) {
            vm.feederLocation = selectItem.feederLocation;
            vm.validateFeederDetails(e);
          }
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }
  }
})();
