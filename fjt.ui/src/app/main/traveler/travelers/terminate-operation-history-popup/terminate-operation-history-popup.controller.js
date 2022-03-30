(function () {
  'use strict';

  angular
    .module('app.traveler.travelers')
    .controller('TerminateOperationHistoryPopupController', TerminateOperationHistoryPopupController);

  /** @ngInject */
  function TerminateOperationHistoryPopupController($mdDialog, CORE, DialogFactory, TRAVELER, BaseService, data, TerminateOperationHistoryPopupFactory) {
    const vm = this;

    var fromWOOPID = data.fromWOOPID;
    vm.woTransferList = [];
    vm.dateFormat = _dateTimeDisplayFormat;
    vm.LabelConstant = CORE.LabelConstant;

    vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.WO_TRANSFER_HISTORY;

    getWorkorderTransferHistory();

    function getWorkorderTransferHistory() {
      return TerminateOperationHistoryPopupFactory.getWorkorderTransferHistory().query({ woOPID: fromWOOPID }).$promise.then((response) => {
        if (response && response.data) {
          vm.woTransferList = response.data;
          vm.isNoDataFound = vm.woTransferList.length == 0;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    vm.displayComment = ($event, item) => {

      var model = {
        title: 'Comment',
        data: item.description,
        isRequired: false,
        isDisabled: true
      };

      DialogFactory.dialogService(
        CORE.TEXT_ANGULAR_ELEMENT_MODAL_CONTROLLER,
        CORE.TEXT_ANGULAR_ELEMENT_MODAL_VIEW,
        $event,
        model).then((response) => {
          item.comment = response;
        }, (error) => {
          return BaseService.getErrorLog(error);
        });
    }

    vm.cancel = (data) => {
      $mdDialog.cancel(data);
    };


    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }
    //redirect to work order details
    vm.goToWorkorderDetails = (woID) => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    }

    vm.goToWorkorderOperationDetails = (woOPID) => {
      BaseService.goToWorkorderOperationDetails(woOPID);
      return false;
    }

  }
})();
