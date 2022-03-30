(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('ReasonController', ReasonController);

  function ReasonController($scope, $state, CORE, USER, DialogFactory, RFQTRANSACTION) {
    const vm = this;
    vm.currentState = $state.current.name;
    const reasonTabs = CORE.Reason_Type;
    vm.tabList = [
      { id: 0, reason_id: reasonTabs.RFQ.id, title: reasonTabs.RFQ.title, src: USER.ADMIN_RFQ_REASON_STATE, viewsrc: 'rfq', isDisabled: false, displayOrder: reasonTabs.RFQ.DisplayOrder, singleTitle: reasonTabs.RFQ.popupTitle },
      { id: 1, reason_id: reasonTabs.BOM.id, title: reasonTabs.BOM.title, src: USER.ADMIN_BOM_REASON_STATE, viewsrc: 'billofmaterial', isDisabled: false, displayOrder: reasonTabs.BOM.DisplayOrder, singleTitle: reasonTabs.BOM.popupTitle },
      { id: 2, reason_id: reasonTabs.INVOICE_APPROVE.id, title: reasonTabs.INVOICE_APPROVE.title, src: USER.ADMIN_INVOICE_APPROVED_REASON_STATE, viewsrc: 'invoiceapprovedreason', isDisabled: false, displayOrder: reasonTabs.INVOICE_APPROVE.DisplayOrder, singleTitle: reasonTabs.INVOICE_APPROVE.popupTitle },
      { id: 3, reason_id: reasonTabs.KIT_RELEASE_COMMENT.id, title: reasonTabs.KIT_RELEASE_COMMENT.title, src: USER.ADMIN_KIT_RELEASE_COMMENT_STATE, viewsrc: 'kitreleasecomment', isDisabled: false, displayOrder: reasonTabs.KIT_RELEASE_COMMENT.DisplayOrder, singleTitle: reasonTabs.KIT_RELEASE_COMMENT.popupTitle }
    ];
    vm.tabList = _.orderBy(vm.tabList, 'DisplayOrder', 'asc');
    active();

    vm.addEditRecord = (data, ev) => {
      if (data === null) {
        data = {};
      }
      data.reasonId = vm.reasonId;
      DialogFactory.dialogService(
        USER.ADMIN_REASON_ADD_UPDATE_MODAL_CONTROLLER,
        USER.ADMIN_REASON_ADD_UPDATE_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data) {
            $scope.$broadcast(RFQTRANSACTION.EVENT_NAME.ResponseReason, vm.currentState);
          }
        });
    };

    // set tab active on first time page load
    function active() {
      const item = _.find(vm.tabList, (value) => value.src === $state.current.name);
      if (item) {
        vm.activeTab = item.id;
        vm.reasonId = item.reason_id;
        vm.selectedNavItem = item.singleTitle;
      } else {
        vm.activeTab = 0;
        vm.reasonId = reasonTabs.RFQ.id;
        vm.selectedNavItem = reasonTabs.RFQ.popupTitle;
      }
    }

    //Tab change event
    vm.onTabChanges = (item) => {
      vm.currentState = item.src;
      vm.reasonId = item.reason_id;
      vm.selectedNavItem = item.singleTitle;
    };
  }
})();
