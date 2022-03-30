(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('EntityImagesPreviewPopupController', EntityImagesPreviewPopupController);

  /** @ngInject */
  function EntityImagesPreviewPopupController(data, BaseService, DialogFactory) {
    var vm = this;
    vm.popupParamData = data;
    vm.headerData = [];

    vm.cancel = () => {
      BaseService.currentPagePopupForm.pop();
      DialogFactory.closeDialogPopup();
    };
  }
})();
