(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('confirmationApproval', confirmationApproval);

  /** @ngInject */
  function confirmationApproval(CORE, DialogFactory, BaseService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        woQtyApprovalObj: '=?'
      },
      templateUrl: 'app/directives/custom/confirmation-approval/confirmation-approval.html',
      controller: confirmationApprovalCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function confirmationApprovalCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.taToolbar = CORE.Toolbar;
      vm.woQtyApproval = $scope.woQtyApprovalObj;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

      /* set signature after drag on signature-pad */
      vm.setSignatureValue = (signature) => {
        if (signature.isEmpty || !signature.dataUrl) {
          var model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: CORE.MESSAGE_CONSTANT.PROVIDE_SIGNATURE,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return;
        }
        vm.woQtyApproval.signaturevalue = signature.dataUrl;
        vm.isSignatureAdded = true;
        vm.confirmationApprovalForm.signaturePad.$setDirty();
      }

      /* clear signature */
      vm.clearSignatureValue = () => {
        vm.isSignatureAdded = false;
      }

      /* delete  signature to add new one */
      vm.deleteSignatureValue = (clearFunCallback, acceptFunCallback, signature) => {
        let obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, "Signature"),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.REMOVE_SINGLE_CONFIRM_MESSAGE, "signature"),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            clearFunCallback();  //clear();
            signature = acceptFunCallback();  //accept();
            vm.woQtyApproval.signaturevalue = null;
            vm.isSignatureAdded = false;
          }

        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // check signature has changed or not
      vm.checkSignatureChanges = () => {
        if (vm.confirmationApprovalForm) {
          vm.confirmationApprovalForm.signaturePad.$setDirty();
        }
      }

    }
  }
})();
