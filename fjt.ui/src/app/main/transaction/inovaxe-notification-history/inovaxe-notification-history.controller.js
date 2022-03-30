(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('InovaxeNotificationHistoryController', InovaxeNotificationHistoryController);

  /** @ngInject */
  function InovaxeNotificationHistoryController($filter, $state, TRANSACTION, DialogFactory, CORE, BaseService) {

    const vm = this;
    active();
    function active() {
     
      vm.tabList = [
        //{ id: 0, title: TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_LABEL, src: TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_STATE, viewsrc: 'unauthorize', isDisabled: false },
        { id: 0, title: TRANSACTION.TRANSACTION_INOVAXESERVERLOG_LABEL, src: TRANSACTION.TRANSACTION_INOVAXESERVERLOG_STATE, viewsrc: 'serverlog', isDisabled: false },
        { id: 1, title: TRANSACTION.TRANSACTION_INOVAXECARTSTATUSLOG_LABEL, src: TRANSACTION.TRANSACTION_INOVAXECARTSTATUSLOG_STATE, viewsrc: 'cartstatus', isDisabled: false },
        { id: 2, title: TRANSACTION.TRANSACTION_INOVAXEHISTORY_LABEL, src: TRANSACTION.TRANSACTION_INOVAXELOG_STATE, viewsrc: 'alltransaction', isDisabled: false },
      ];

      var item = $filter('filter')(vm.tabList, { src: $state.current.name }, true);
      if (item[0]) {
        vm.activeTab = item[0].id;
        vm.title = item[0].title;
      }
      else {
        //vm.activeTab = 0;
        //vm.title = vm.tabList[0].title;
        //$state.go(TRANSACTION.TRANSACTION_INOVAXEUNAUTHORIZELOG_STATE);
        vm.activeTab = 2;
        vm.title = vm.tabList[2].title;
        $state.go(TRANSACTION.TRANSACTION_INOVAXELOG_STATE);
      } 
    }

    vm.onTabChanges = (item) => {
      vm.title = item.title;
    }
   

    //open audit popup 
    vm.openAuditPage = (ev, item) => {
      var data = {
        rightSideWHLabel: item ? item.entity.rightSideWHLabel : item
      }
      DialogFactory.dialogService(
        CORE.AUDIT_MODAL_CONTROLLER,
        CORE.AUDIT_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
        },
          (err) => {
            return BaseService.getErrorLog(err);
          });
    }
  }
})();
