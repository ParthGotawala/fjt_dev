(function () {
  'use strict';

  angular.module('app.core').directive('predefinedComment', predefinedComment);

  /** @ngInject */
  function predefinedComment($mdDialog, CORE, USER, BaseService, DialogFactory, RFQSettingFactory) {
    var directive = {
      restrict: 'E',
      scope: {
        reasonId: '=',
          paramSelectCommentCallbackFn: '&',
          isHideRedirectToMstBtn: '='
      },
      templateUrl: 'app/directives/custom/predefined-comment/predefined-comment.html',
      controller: predefinedCommentCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of User Agreement
    *
    * @param
    */
    function predefinedCommentCtrl($scope) {
      const vm = this;
        vm.reasonId = $scope.reasonId;
        vm.isHideRedirectToMstBtn = $scope.isHideRedirectToMstBtn ? $scope.isHideRedirectToMstBtn : false;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
      vm.comment = null;

      vm.createReasonModel = (reasonId) => {
        if (reasonId) {
          switch (reasonId) {
            case CORE.Reason_Type.RFQ.id:
              vm.reasonType = CORE.Reason_Type.RFQ;
              vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.REASON;
              vm.currentState = USER.ADMIN_RFQ_REASON_STATE;
              break;
            case CORE.Reason_Type.BOM.id:
              vm.reasonType = CORE.Reason_Type.BOM;
              vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.BOM_REASON;
              vm.currentState = USER.ADMIN_BOM_REASON_STATE;
              break;
            case CORE.Reason_Type.INVOICE_APPROVE.id:
              vm.reasonType = CORE.Reason_Type.INVOICE_APPROVE;
              vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.INVOICE_APPROVE;
              vm.currentState = USER.ADMIN_INVOICE_APPROVED_REASON_STATE;
              break;
            case CORE.Reason_Type.KIT_RELEASE_COMMENT.id:
              vm.reasonType = CORE.Reason_Type.KIT_RELEASE_COMMENT;
              vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.KIT_RELEASE_COMMENT;
              vm.currentState = USER.ADMIN_KIT_RELEASE_COMMENT_STATE;
              break;
          }
          active();
        }
      };

      vm.createReasonModel(vm.reasonId);

      function active() {
        vm.cgBusyLoading = RFQSettingFactory.getActiveReasonListByReasonType().query({ reason_type: vm.reasonId }).$promise.then((response) => {
          if (response && response.data) {
            vm.standardReasonList = vm.reasonlist = angular.copy(response.data);
            vm.isNoDataFound = vm.standardReasonList.length === 0;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      vm.selectComment = (ev, reasonDetails) => {
        if (reasonDetails && reasonDetails.reason) {
          vm.comment = reasonDetails.reason;
          $scope.paramSelectCommentCallbackFn() ? $scope.paramSelectCommentCallbackFn()(ev, vm.comment) : '';
        }
      };

      // refresh comments
      vm.refereshComment = () => {
        active();
        vm.searchText = null;
        vm.comment = null;
      };

      // add new comments
      vm.addComment = () => {
        const popUpData = {
          popupAccessRoutingState: [vm.currentState],
          pageNameAccessLabel: vm.reasonType.popupTitle
        };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          const obj = {
            reasonId: vm.reasonId
          };
          DialogFactory.dialogService(
            USER.ADMIN_REASON_ADD_UPDATE_MODAL_CONTROLLER,
            USER.ADMIN_REASON_ADD_UPDATE_MODAL_VIEW,
            null,
            obj).then(() => {
            }, (data) => {
              if (data) {
                active();
              }
            }, () => {
            });
        }
      };

      vm.gotoPredefinedComment = () => {
        switch (vm.reasonId) {
          case CORE.Reason_Type.RFQ.id:
            BaseService.goToRFQReasonTab();
            break;
          case CORE.Reason_Type.BOM.id:
            BaseService.goToBOMDefaultCommentTab();
            break;
          case CORE.Reason_Type.INVOICE_APPROVE.id:
            BaseService.goToInvoiceApprovedMessageTab();
            break;
          case CORE.Reason_Type.KIT_RELEASE_COMMENT.id:
            BaseService.goToKitReleaseCommentTab();
            break;
        }
      };

      vm.searchCommonData = (isReset) => {
        if (isReset) {
          vm.searchText = null;
          vm.standardReasonList = vm.reasonlist;
        }
        else {
          vm.standardReasonList = _.filter(vm.reasonlist, (x) => x.reason.toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1);
        }
      };
    }
  }
})();
