(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WOOPFirstArticleAlreadyAddedSerials', WOOPFirstArticleAlreadyAddedSerials);

  function WOOPFirstArticleAlreadyAddedSerials($mdDialog, data, CORE, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.woOPFirstArticleData = angular.copy(data);
    vm.firstArticleSerialAlreadyAddedNote = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FIRST_ARTICLE_SERIAL_ALREADY_ADDED_NOTE.message;

    // go to work order operation first article page
    vm.goToWorkorderOperationFirstArticlesPage = (woOPID) => {
      BaseService.goToWorkorderOperationFirstArticles(woOPID);
      return false;
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
