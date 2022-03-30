(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('CommonHistoryPopupController', CommonHistoryPopupController);

  /** @ngInject */
  function CommonHistoryPopupController(data, BaseService, DialogFactory) {
    var vm = this;
    console.log('data ',data);
    vm.Title = data.title || 'History';
    vm.id = data.id || null;
    vm.TableName = data.TableName || null;
    vm.headerdata = data.headerData || [];
    vm.EmptyMesssage = data.EmptyMesssage;

    vm.cancel = () => {
      BaseService.currentPagePopupForm.pop();
      DialogFactory.closeDialogPopup();
    };
  }
})();
