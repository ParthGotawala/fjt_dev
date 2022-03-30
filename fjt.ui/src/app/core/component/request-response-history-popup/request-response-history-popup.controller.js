(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('RequestResponsePopupController', RequestResponsePopupController);
  /** @ngInject */
  function RequestResponsePopupController($mdDialog, data, BaseService, CORE) {
    const vm = this;
    vm.request = data && data.requestMessage ? JSON.parse(data.requestMessage) : '';
    vm.response = data && data.responseMessage ? JSON.parse(data.responseMessage) : '';
    vm.cancel = () => {
      $mdDialog.cancel();
    };
    //UMID list function call from here
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };
    bindHeaderData();
    //bind popup header
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push( {
        label: 'Message Type',
        value: data.messageType,
        displayOrder: 1,
        labelLinkFn: null,
        valueLinkFn: null,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      },
        {
          label: 'Transaction ID',
          value: data.transactionID,
          displayOrder: 3,
          labelLinkFn: null,
          valueLinkFn: null,
          valueLinkFnParams: null,
          isCopy: true,
          copyParams: null,
          imgParms: null
        });
      if (data.reelBarCode) {
        vm.headerdata.push(
          {
            label: CORE.LabelConstant.UMIDManagement.UMID,
            value: data.reelBarCode,
            displayOrder: 2,
            labelLinkFn: vm.goToUMIDList,
            valueLinkFn: null,
            valueLinkFnParams: null,
            isCopy: true,
            copyParams: null,
            imgParms: null
          });
      }
    }
  }
})();
