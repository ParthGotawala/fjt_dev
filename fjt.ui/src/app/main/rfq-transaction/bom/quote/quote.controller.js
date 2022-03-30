(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('QuoteController', QuoteController);

  /** @ngInject */
  function QuoteController($state, $scope, $q, $timeout, $stateParams, RFQTRANSACTION, CORE, DialogFactory, BaseService) {
    const vm = this;
    vm.quotePageType = RFQTRANSACTION.QUOTE_PAGE_TYPE;
    if ($scope.$parent && $scope.$parent.vm) {
      $scope.$parent.vm.activeTab = $stateParams.pageType === vm.quotePageType.PREVIEW_QUOTE.Name ? 6 : 5;
    }
    if ($scope.$parent.$parent.$parent.vm.bom.isSummaryComplete || $stateParams.pageType === vm.quotePageType.PREVIEW_QUOTE.Name) {
      const quoteSubmittedID = $scope.$parent.$parent.$parent.vm.bom.quoteSubmittedID;
      $state.go(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, { id: $stateParams.id, quoteSubmittedID: quoteSubmittedID, pageType: $stateParams.pageType });
    } else {
      const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.QUOTE_NOT_AVAILABLE);

      const obj = {
        messageContent: messgaeContent
      };
      return DialogFactory.messageAlertDialog(obj).then(() => {
        $state.go(RFQTRANSACTION.RFQ_QUOTE_STATE, { id: $stateParams.id, pageType: vm.quotePageType.PREVIEW_QUOTE.Name }, { reload: true });
      }, (cancel) => {
      }).catch((error) => BaseService.getErrorLog(error));
    }
  }
})();
