(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ReasonSelectPopupController', ReasonSelectPopupController);

  /** @ngInject */
  function ReasonSelectPopupController($mdDialog, RFQSettingFactory, $q, CORE, USER, data, BaseService, DialogFactory) {
    const vm = this;
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.REASON;
    vm.isRFQ = data.isRFQ || false;
    vm.isBOM = data.isBOM || false;
    vm.Reason_Type = CORE.Reason_Type;
    let type = null;
    if (vm.isRFQ) {
      type = vm.Reason_Type.RFQ.id;
    }
    if (vm.isBOM) {
      type = vm.Reason_Type.BOM.id;
    }
    // get Additional reason List
    const getReasonList = (type) => RFQSettingFactory.getReasonList().query({ reason_type: type }).$promise.then((reason) => {
      vm.ReasonList = reason.data;
      vm.ReasonList = _.filter(vm.ReasonList, (reason) => reason.isActive);
      if (vm.ReasonList.length > 0) {
        vm.selectedReq = [];
        vm.isNoaddreqFound = false;
      }
      else {
        vm.selectedReq = [];
        vm.isNoaddreqFound = true;
      }
      return $q.resolve(vm.ReasonList);
    }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [getReasonList(type)];

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
    }).catch((error) => BaseService.getErrorLog(error));
    /* open additional reason pop-up to add new */
    vm.addNewReason = () => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_RFQ_REASON_STATE], pageNameAccessLabel: CORE.PageName.rfq_reason };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        const obj = {
          reasonId: type
        };
        DialogFactory.dialogService(
          USER.ADMIN_REASON_ADD_UPDATE_MODAL_CONTROLLER,
          USER.ADMIN_REASON_ADD_UPDATE_MODAL_VIEW,
          null,
          obj).then(() => {
          }, (data) => {
            if (data) {
              getReasonList(type);
            }
          }, () => {
          });
      }
    };

    // logic to bind change event of reason
    vm.selectAssyreq = (selectedreq) => {
      if (vm.selectedReq) {
        const index = vm.selectedReq.indexOf(selectedreq);
        if (index === -1) {
          if (vm.selectedReq) {
            vm.selectedReq.push(selectedreq);
          } else {
            vm.selectedReq = [];
            vm.selectedReq.push(selectedreq);
          }
        } else {
          vm.selectedReq.splice(index, 1);
        }
      } else {
        vm.selectedReq = [];
        vm.selectedReq.push(selectedreq);
      }
      vm.SelectReasonForm.$setDirty();
    };

    // add selected data in Internal Quote Note
    vm.setQuoteAdditionalReq = () => {
      var selectedreq = vm.selectedReq;
      var string1 = '<ul><li>';
      var string2 = '</li><li>';
      var string3 = '</li></ul>';
      const areq = [];
      _.each(selectedreq, (selectedreq) => {
        const addres = _.find(vm.ReasonList, { id: selectedreq });
        if (addres) {
          areq.push(addres.reason);
        }
      });
      if (areq.length > 0) {
        const reqstring = areq.join(string2);
        const str = string1 + reqstring + string3;
        vm.selectedRes = [];
        $mdDialog.cancel(str);
      } else {
        vm.selectedRes = [];
        $mdDialog.cancel();
      }
    };

    vm.refreshReason = () => {
      getReasonList(type);
    };
    vm.goToReason = () => {
      BaseService.goToRFQReasonTab();
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
