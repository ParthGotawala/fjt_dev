(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('RemoveMPNFROMCPNConfirmationPopupController', RemoveMPNFROMCPNConfirmationPopupController);

  /** @ngInject */
  function RemoveMPNFROMCPNConfirmationPopupController($scope, $mdDialog, CORE, USER, RFQTRANSACTION, data, BaseService, DialogFactory, ManufacturerFactory) {
    var vm = this;
    vm.CPNPartID = data.CPNPartID;
    vm.refcompID = data.refComponentID;
    vm.MPN = data.mfgPN;
    vm.pidCode = data.pidCode;
    vm.mappingRemoveRequestOption = CORE.DELETE_MPN_FROM_CPN_REQUEST_OPTIONS;
    vm.mappingRemoveOption = CORE.MPN_REMOVE_OPTIONS_FROM_CPN;
    vm.loginUser = BaseService.loginUser;
    vm.loginUserId = vm.loginUser.userid;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

    vm.selectedRemoveRequestOption = vm.mappingRemoveRequestOption.INTERNAL_ERROR.value;
    vm.selectedRemoveOption = vm.mappingRemoveOption.REMOVE_FORM_CPN_ONLY.value;
    const model = {
      accessRole: null,
      accessLevel: null,
      isValidate: true
    };

    vm.deleteBOM = () => {
      vm.disabledelete = true;
      if (BaseService.focusRequiredField(vm.deleteMPNfromCPNConfirmationForm)) {
        vm.disabledelete = false;
        return;
      }
      const deleteMPNObj = {
        deleteRequestFrom: vm.selectedRemoveRequestOption,
        deleteMPNFrom: vm.selectedRemoveOption,
        reason: vm.reason,
        refcompID: vm.refcompID,
        CPNPartID: vm.CPNPartID
      };
      checkCPNUIDstock(deleteMPNObj);
    };
    //  check and get access level
    function getAccessLevel() {
      return ManufacturerFactory.getAcessLeval().query({
        access: CORE.ROLE_ACCESS.DELETE_ROLE_ACCESS
      }).$promise.then((response) => {
        if (response && response.data) {
          model.accessRole = response.data.name;
          model.accessLevel = response.data.accessLevel;
          vm.allowAccess = false;
          const currentLoginUserRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.allowAccess = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    getAccessLevel();
    function checkCPNUIDstock(deleteMPNObj) {
      vm.cgBusyLoading = ManufacturerFactory.checkCPNUIDStock().save(deleteMPNObj).$promise.then((resCPNStock) => {
        if (resCPNStock && resCPNStock.data && resCPNStock.data.length > 0) {
          //const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.UMID_STOCK_CONFIRMATION_ON_CPN_MAPPING_REMOVE);
          //messgaeContent.message = messgaeContent.message + '<br/><br/><div flex="100" layout layout-wrap>\
          //  <div layout="row" layout-wrap flex="100">\
          //    <div class="font-size-12 padding-left-15" flex-sm="100">\
          //      <h5 layout="row">\
          //        Following action need to perform manually after Remove MPN from CPN Mapping:\
          //    </h5>\
          //      <div layout="row">\
          //        <div layout="column" flex="100">\
          //          <div class="cm-wo-block cm-right-wo-block">\
          //            <span><b>High Risk: Ensure Inventory Status of these CPN parts, and remove selected parts inventory from CPN. &  Update Labels if any.</b></span>\
          //          </div>\
          //          <div class="cm-wo-block cm-right-wo-block">\
          //            <span>\
          //              <b>\
          //                Inventory management will be a manual process [Find inventory\
          //              <span class="icon-question-mark-circle help-icon">\
          //                <md-tooltip md-direction="top">Find '+vm.pidCode +'</md-tooltip>\
          //              </span>, Remove CPN label from parts relabel as necessary].\
          //            </b>\
          //            </span>\
          //          </div>\
          //          <div class="cm-wo-block cm-right-wo-block">\
          //            <span><b>Will auto-remove/update all BOMs that were used in this CPN and remove unmapped parts from BOM.</b></span>\
          //          </div>\
          //          <div class="cm-wo-block cm-right-wo-block">\
          //            <span><b>Selected parts inventory will be deallocated from the active kit were used in this CPN.</b></span>\
          //          </div>\
          //        </div>\
          //      </div>\
          //    </div>\
          //  </div>\
          //</div>';
          //const obj = {
          //  messageContent: messgaeContent,
          //  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          //  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          //};
          //DialogFactory.messageConfirmDialog(obj).then((yes) => {
          //  if (yes) {
          //    vm.disabledelete = false;
          //    getUserConfirmationPassword(deleteMPNObj);
          //  } else {
          //    vm.disabledelete = false;
          //  }
          //}, () => {
          //  vm.disabledelete = false;
          //}).catch((error) => {
          //  vm.disabledelete = false;
          //  BaseService.getErrorLog(error);
          //});
          const objData = {
            pidCode: vm.pidCode
          };
          DialogFactory.dialogService(
            USER.DELETE_MPN_CONFIRMATION_CONTROLLER,
            USER.DELETE_MPN_CONFIRMATION_VIEW,
            null,
            objData).then((yes) => {
              if (yes) {
                vm.disabledelete = false;
                getUserConfirmationPassword(deleteMPNObj);
              } else {
                vm.disabledelete = false;
              }
            }, () => {
              vm.disabledelete = false;
            }).catch((error) => {
              vm.disabledelete = false;
              BaseService.getErrorLog(error);
            });

        } else {
          vm.disabledelete = false;
          removeMPNMappingFromCPN(deleteMPNObj);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getUserConfirmationPassword(deleteMPNObj) {
      if (!vm.allowAccess) {
        DialogFactory.dialogService(
          CORE.VERIFY_USER_PASSWORD_POPUP_CONTROLLER,
          CORE.VERIFY_USER_PASSWORD_POPUP_VIEW,
          null, model).then((data) => {
            if (data) {
              removeMPNMappingFromCPN(deleteMPNObj);
            }
          }, () => {
            vm.disabledelete = false;
          }, (err) => {
            vm.disabledelete = false;
            BaseService.getErrorLog(err);
          });
      }
      else {
        DialogFactory.dialogService(
          CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
          CORE.MANAGE_PASSWORD_POPUP_VIEW,
          null, {
          isValidate: true
        }).then((data) => {
          if (data) {
            removeMPNMappingFromCPN(deleteMPNObj);
          }
        }, () => {
          vm.disabledelete = false;
        }, (err) => {
          vm.disabledelete = false;
          BaseService.getErrorLog(err);
        });
      }
    }

    function removeMPNMappingFromCPN(deleteMPNObj) {
      vm.cgBusyLoading = ManufacturerFactory.removeMPNMapping().save(deleteMPNObj).$promise.then((resRemoveMapping) => {
        if (resRemoveMapping && resRemoveMapping.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.disabledelete = false;
          $mdDialog.hide();
        }
      }).catch((error) => {
        vm.disabledelete = false;
        BaseService.getErrorLog(error);
      });
    }



    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.deleteMPNfromCPNConfirmationForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };
  }
})();
