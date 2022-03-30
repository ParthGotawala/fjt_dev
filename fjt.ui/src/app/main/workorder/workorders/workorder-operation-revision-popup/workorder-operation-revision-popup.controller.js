(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkorderOperationRevisionPopupController', WorkorderOperationRevisionPopupController);

  /** @ngInject */
  function WorkorderOperationRevisionPopupController($scope, $mdDialog, data, WORKORDER, CORE, DialogFactory, BaseService, WorkorderOperationRevisionPopupFactory, TRAVELER) {
    const vm = this;
    var woOPID = data.woOPID;
    var defaultMessage = '';
    let timelineObj = {};

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.WOLabelConstant = CORE.LabelConstant.Workorder;
    vm.OpLabelConstant = CORE.LabelConstant.Operation;

    vm.woOPReviewModel = {
      woID: null,
      opID: null,
      woOPID: woOPID,
      fromOPVersion: null,
      fromWOVersion: null,
      opVersion: null,
      woVersion: null,
      message: null
    };

    // on click of cancel button
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.frmWoOPRevision);
      if (isdirty) {
        let data = {
          isRevisionPopup: true
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        let model = {
          isCancelled: true
        }
        $mdDialog.hide(model);
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    function getWOOPDetails() {
      vm.cgBusyLoading = WorkorderOperationRevisionPopupFactory.getWOOPDetails().query({ woOPID: woOPID }).$promise.then((response) => {
        if (response && response.data) {
          var data = response.data;
          vm.woOPReviewModel.woID = data.woID;
          vm.woOPReviewModel.opID = data.opID;
          vm.woOPReviewModel.fromOPVersion = data.opVersion;
          vm.woOPReviewModel.fromWOVersion = data.workorder.woVersion;

          vm.woOPReviewModel.opVersion = getChar.increment(vm.woOPReviewModel.fromOPVersion);
          vm.woOPReviewModel.woVersion = getChar.increment(vm.woOPReviewModel.fromWOVersion);
          vm.woOPReviewModel.message = defaultMessage = stringFormat(TRAVELER.WORKORDER_OPERATION_REVISION_MESSAGE, convertToThreeDecimal(data.opNumber), vm.woOPReviewModel.fromOPVersion, data.workorder.woNumber, vm.woOPReviewModel.fromWOVersion);
          timelineObj.woNumber = data.workorder.woNumber;
          timelineObj.opName = data.opName;
          timelineObj.fromWOVersion = vm.woOPReviewModel.fromWOVersion;
          timelineObj.fromOPVersion = data.opVersion;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    getWOOPDetails();

    vm.save = () => {
      var model = {
        woID: vm.woOPReviewModel.woID,
        opID: vm.woOPReviewModel.opID,
        woOPID: vm.woOPReviewModel.woOPID,
        opVersion: vm.woOPReviewModel.opVersion.toUpperCase(),
        woVersion: vm.woOPReviewModel.woVersion.toUpperCase(),
        message: vm.woOPReviewModel.message || defaultMessage
      };
      $mdDialog.hide(model);
    }

    vm.changeSave = () => {
      vm.saveDisable = true;
      if (vm.frmWoOPRevision.$invalid) {
        BaseService.focusRequiredField(vm.frmWoOPRevision);
        vm.saveDisable = false;
        return;
      }else if (!vm.woOPReviewModel.opVersion || !vm.woOPReviewModel.woVersion) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.WO_OP_VERSION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        vm.saveDisable = false;
        return;
      }
      //else if (vm.woOPReviewModel.woVersion.charCodeAt(0) < vm.woOPReviewModel.fromWOVersion.charCodeAt(0)) {
      //  var model = {
      //    title: stringFormat(CORE.MESSAGE_CONSTANT.VALIDATE_VERSION, "Work Order"),
      //    multiple: true
      //  };
      //  DialogFactory.alertDialog(model);
      //  return;
      //} else if (vm.woOPReviewModel.opVersion.charCodeAt(0) < vm.woOPReviewModel.fromOPVersion.charCodeAt(0)) {
      //  var model = {
      //    title: stringFormat(CORE.MESSAGE_CONSTANT.VALIDATE_VERSION, "Work Order Operation"),
      //    multiple: true
      //  };
      //  DialogFactory.alertDialog(model);
      //  return;
      //} else {
      var model = {
        woID: vm.woOPReviewModel.woID,
        opID: vm.woOPReviewModel.opID,
        woOPID: vm.woOPReviewModel.woOPID,
        opVersion: vm.woOPReviewModel.opVersion.toUpperCase(),
        woVersion: vm.woOPReviewModel.woVersion.toUpperCase(),
        message: vm.woOPReviewModel.message || defaultMessage,
        timelineObj: timelineObj
      };
      vm.cgBusyLoading = WorkorderOperationRevisionPopupFactory.saveWOOPVersion().save(model).$promise.then((response) => {
        if (response && response.data) {
          $mdDialog.hide(model);
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
      //}
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }

  }

})();
