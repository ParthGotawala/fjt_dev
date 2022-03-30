(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkorderRevisionPopupController', WorkorderRevisionPopupController);

  /** @ngInject */
  function WorkorderRevisionPopupController($scope, $mdDialog, data, WORKORDER, CORE, DialogFactory,
    BaseService, WorkorderRevisionPopupFactory, TRAVELER) {
    const vm = this;

    var woID = data.woID;
    var defaultMessage = '';
    let timelineObj = {};

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.WOAllLabelConstant = CORE.LabelConstant.Workorder;

    vm.woReviewModel = {
      woID: woID,
      fromWOVersion: null,
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

    // to check for form dirty
    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    function getWODetails() {
      vm.cgBusyLoading = WorkorderRevisionPopupFactory.getWODetails().query({ woID: woID }).$promise.then((response) => {
        if (response && response.data) {
          var data = response.data;
          vm.woReviewModel.fromWOVersion = data.woVersion;
          vm.woReviewModel.woVersion = getChar.increment(vm.woReviewModel.fromWOVersion);
          vm.woReviewModel.message = defaultMessage = stringFormat(TRAVELER.WORKORDER_REVISION_MESSAGE, data.woNumber, vm.woReviewModel.fromWOVersion);

          timelineObj.woNumber = data.woNumber;
          timelineObj.fromWOVersion = data.woVersion;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    getWODetails();

    vm.save = () => {
      var model = {
        woID: vm.woReviewModel.woID,
        message: vm.woReviewModel.message || defaultMessage
      };
      $mdDialog.hide(model);
    }

    vm.changeSave = () => {
      vm.saveDisable = true;
      if (vm.frmWoOPRevision.$invalid) {
        BaseService.focusRequiredField(vm.frmWoOPRevision);
        vm.saveDisable = false;
        return;
      } else if (!vm.woReviewModel.woVersion) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.WO_VERSION,
          multiple: true
        };
        DialogFactory.alertDialog(model);
        vm.saveDisable = false;
        return;
      }
      //else if (vm.woReviewModel.woVersion.charCodeAt(0) < vm.woReviewModel.fromWOVersion.charCodeAt(0)) {
      //  var model = {
      //    title: stringFormat(CORE.MESSAGE_CONSTANT.VALIDATE_VERSION, "Work Order"),
      //    multiple: true
      //  };
      //  DialogFactory.alertDialog(model);
      //  return;
      //} else {
        var model = {
          woID: vm.woReviewModel.woID,
          woVersion: vm.woReviewModel.woVersion.toUpperCase(),
          message: vm.woReviewModel.message || defaultMessage,
          timelineObj: timelineObj
        };

        vm.cgBusyLoading = WorkorderRevisionPopupFactory.saveWOVersion().save(model).$promise.then((response) => {
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
    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };

  }

})();
