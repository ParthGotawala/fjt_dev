(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('RestrictUMIDPopUpController', RestrictUMIDPopUpController);

  function RestrictUMIDPopUpController($mdDialog, $timeout, CORE, USER, DialogFactory, BaseService, data, TRANSACTION, ReceivingMaterialFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.UMIDDetail = data ? data : {};
    vm.restrictUMIDType = TRANSACTION.restrictUMIDType;
    vm.restrictDetail = {};
    vm.isScanUMID = false;
    vm.saveBtnDisableFlag = false;

    const updateImagePath = (details) => {
      if (details) {
        if (!details.component.imageURL) {
          vm.restrictDetail.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
        } else {
          if (!details.component.imageURL.startsWith('http://') && !details.component.imageURL.startsWith('https://')) {
            vm.restrictDetail.imageURL = BaseService.getPartMasterImageURL(details.component.documentPath, details.component.imageURL);
          } else {
            vm.restrictDetail.imageURL = details.component.imageURL;
          }
        }
      }
    };

    const getUMIDDetailById = (id) => {
      vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDByID().query({ id: id }).$promise.then((receivingmaterialdetail) => {
        const componentSidStock = receivingmaterialdetail.data;
        vm.restrictDetail.scanUMID = componentSidStock.uid;
        updateImagePath(componentSidStock);
        vm.restrictDetail.mfgCode = componentSidStock.component && componentSidStock.component.mfgCodemst ? stringFormat('({0}) {1}', componentSidStock.component.mfgCodemst.mfgCode, componentSidStock.component.mfgCodemst.mfgName) : null;
        vm.restrictDetail.mfgPN = componentSidStock.component ? componentSidStock.component.mfgPN : null;
        vm.restrictDetail.PIDCode = componentSidStock.component ? componentSidStock.component.PIDCode : null;
        vm.restrictDetail.componentid = componentSidStock.component ? componentSidStock.component.id : null;
        vm.restrictDetail.rohsIcon = componentSidStock.component && componentSidStock.component.rfq_rohsmst ? componentSidStock.component.rfq_rohsmst.rohsIcon : null;
        vm.restrictDetail.rohsStatus = componentSidStock.component && componentSidStock.component.rfq_rohsmst ? componentSidStock.component.rfq_rohsmst.name : null;
        vm.restrictDetail.mfgPNDescription = componentSidStock.component ? componentSidStock.component.mfgPNDescription : null;
        vm.restrictDetail.pkgQty = componentSidStock.pkgQty;
        vm.restrictDetail.refUMIDId = componentSidStock.id;
        vm.restrictDetail.restrictType = !componentSidStock.isUMIDRestrict;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (vm.UMIDDetail && vm.UMIDDetail.id) {
      vm.restrictDetail.restrictType = vm.UMIDDetail.isUMIDRestrict ? false : true;
      getUMIDDetailById(vm.UMIDDetail.id);
    } else {
      vm.restrictDetail.restrictType = true;
    }

    vm.scanUMIDDetail = (e) => {
      if (vm.restrictDetail.scanUMID) {
        $timeout(() => {
          scanUMID(e);
        }, true);
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent(e);
      }
    };

    const scanUMID = (e) => {
      if ((e.keyCode === 13)) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailByUMID().query({ UMID: vm.restrictDetail.scanUMID }).$promise.then((response) => {
          if (response && response.data) {
            const componentSidStock = response.data;
            let messageContent = null;
            if (vm.restrictDetail.restrictType && componentSidStock.isUMIDRestrict) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RESTRICT_MISMATCH);
              messageContent.message = stringFormat(messageContent.message, vm.restrictDetail.scanUMID, vm.restrictUMIDType[0].key);
            } else if (!vm.restrictDetail.restrictType && !componentSidStock.isUMIDRestrict) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RESTRICT_MISMATCH);
              messageContent.message = stringFormat(messageContent.message, vm.restrictDetail.scanUMID, vm.restrictUMIDType[1].key);
            }
            if (messageContent) {
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.restrictDetail.scanUMID = null;
                  //let myEl = angular.element(document.querySelector('#scanUMID'));
                  //myEl.focus();
                  setFocus('scanUMID');
                }
              }, () => {

              }).catch((error) => BaseService.getErrorLog(error));
              return;
            }

            vm.isScanUMID = true;
            updateImagePath(componentSidStock);
            vm.restrictDetail.mfgCode = componentSidStock.component && componentSidStock.component.mfgCodemst ? stringFormat('({0}) {1}', componentSidStock.component.mfgCodemst.mfgCode, componentSidStock.component.mfgCodemst.mfgName) : null;
            vm.restrictDetail.mfgPN = componentSidStock.component ? componentSidStock.component.mfgPN : null;
            vm.restrictDetail.PIDCode = componentSidStock.component ? componentSidStock.component.PIDCode : null;
            vm.restrictDetail.componentid = componentSidStock.component ? componentSidStock.component.id : null;
            vm.restrictDetail.rohsIcon = componentSidStock.component && componentSidStock.component.rfq_rohsmst ? componentSidStock.component.rfq_rohsmst.rohsIcon : null;
            vm.restrictDetail.rohsStatus = componentSidStock.component && componentSidStock.component.rfq_rohsmst ? componentSidStock.component.rfq_rohsmst.name : null;
            vm.restrictDetail.mfgPNDescription = componentSidStock.component ? componentSidStock.component.mfgPNDescription : null;
            vm.restrictDetail.pkgQty = componentSidStock.pkgQty;
            vm.restrictDetail.refUMIDId = componentSidStock.id;
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_UMID);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.restrictDetail.scanUMID = null;
                setFocus('scanUMID');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.restrictUMIDDetail = () => {
      let messageContent;
      let modelObj;
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.formRestrictUMID)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (!vm.restrictDetail.refUMIDId) {
        vm.saveBtnDisableFlag = false;
        let messageContent = null;
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PLEASE_SCAN_OR_ENTER);
        messageContent.message = stringFormat(messageContent.message, 'UMID');

        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model);
      }

      vm.restrictDetail.confirmOfKitAllocation = false;
      vm.cgBusyLoading = ReceivingMaterialFactory.saveRestrictUMIDDetail().query({ restrictDetail: vm.restrictDetail }).$promise.then((res) => {
        if (res && res.data && res.data.messagecode === 1) {
          vm.saveBtnDisableFlag = false;
          $mdDialog.cancel(true);
        } else if (res && res.data && res.data.messagecode === 2) {
          vm.saveBtnDisableFlag = false;
          messageContent = angular.copy(res.userMessage);
          messageContent.message = stringFormat(messageContent.message, vm.restrictDetail.scanUMID);
          modelObj = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(modelObj).then((yes) => {
            if (yes) {
              setFocus('scanUMID');
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else if (res && res.data && res.data.messagecode === 3) {
          vm.saveBtnDisableFlag = false;
          _.map(res.data.kitList, (data) => {
            data.kitName = stringFormat('({0}, {1}, {2}, {3})',
              data.salesorderdetatil && data.salesorderdetatil.salesOrderMst ? data.salesorderdetatil.salesOrderMst.poNumber : null,
              data.salesorderdetatil && data.salesorderdetatil.salesOrderMst ? data.salesorderdetatil.salesOrderMst.salesOrderNumber : null,
              data.AssemblyDetail ? data.AssemblyDetail.PIDCode : null,
              data.salesorderdetatil ? data.salesorderdetatil.qty : null);
          });

          const kitString = _.map(res.data.kitList, 'kitName').join(',');
          vm.restrictDetail.kitString = kitString;
          messageContent = angular.copy(res.userMessage);
          messageContent.message = stringFormat(messageContent.message, vm.restrictDetail.scanUMID, kitString);
          modelObj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
            multiple: true
          };
          DialogFactory.messageConfirmDialog(modelObj).then((yes) => {
            if (yes) {
              vm.restrictDetail.confirmOfKitAllocation = true;
              vm.cgBusyLoading = ReceivingMaterialFactory.saveRestrictUMIDDetail().query({ restrictDetail: vm.restrictDetail }).$promise.then((response) => {
                if (response && response.data && response.data.messagecode === 1) {
                  vm.saveBtnDisableFlag = false;
                  $mdDialog.cancel(true);
                }
              });
            }
          }, () => {

          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        } else {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.formRestrictUMID);
            });
          }
          vm.saveBtnDisableFlag = false;
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formRestrictUMID, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    vm.reScan = () => {
      vm.isScanUMID = false;
      vm.restrictDetail = {
        restrictType: vm.restrictDetail.restrictType
      };
      $timeout(() => {
        //let myEl = angular.element(document.querySelector('#scanUMID'));
        //myEl.focus();
        setFocus('scanUMID');
      }, true);
    };
  }
})();
