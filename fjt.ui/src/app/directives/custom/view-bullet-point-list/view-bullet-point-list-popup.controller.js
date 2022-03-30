(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('viewBulletPointListPopupController', viewBulletPointListPopupController);

  /** @ngInject */
  function viewBulletPointListPopupController($mdDialog, DialogFactory, CORE, USER, data) {
    const vm = this;
    vm.title = data.title || '';
    vm.dataList = data.list || [];

    vm.copyData = () => {
      vm.displayItem = '';
      _.each(vm.dataList, (record) => vm.displayItem += stringFormat('* {0}\n', record));
      copyTextForWindow(vm.displayItem);
      const model = {
        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: CORE.MESSAGE_CONSTANT.COPY_TO_CLIPBOARD,
        multiple: true
      };
      DialogFactory.alertDialog(model).then(() => setFocus('closeBtn'));
    };

    vm.cancel = () => $mdDialog.cancel();
  }
})();
