(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponentHistoryViewPopupController', ComponentHistoryViewPopupController);

  /** @ngInject */
  function ComponentHistoryViewPopupController($q, $scope, data, CORE, USER, BaseService, DialogFactory) {
    var vm = this;
    vm.partId = data ? data.partId : null;
    vm.mfgType = data ? data.mfgType : null;
    vm.mfgcodeID = data ? data.mfgcodeID : null;
    vm.mfgCode = data ? data.mfgCode : null;
    vm.rohsIcon = data ? data.rohsIcon : null;
    vm.rohsName = data ? data.rohsName : null;
    vm.LabelConstant = CORE.LabelConstant.MFG;
    vm.headerdata = [];
    vm.editManufacturer = () => {
      if (!vm.mfgcodeID || vm.mfgcodeID <= 0) {
        return;
      }
      var objData = {
        id: vm.mfgcodeID,
        mfgType: vm.mfgType,
        isUpdatable: true
      };
      
      DialogFactory.dialogService(
        CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        CORE.MANAGE_MFGCODE_MODAL_VIEW,
        null,
        objData).then(() => {
        }, (res) => {

        },
          (err) => {
            return BaseService.getErrorLog(err);
          });
    };
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    vm.goToComponentDetail = () => {
      BaseService.goToComponentDetailTab(vm.mfgType.toLowerCase(), vm.partId, USER.PartMasterTabs.Detail.Name);
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    if (data) {
      vm.headerdata = [
        {
          label: vm.mfgType == CORE.MFG_TYPE.DIST ? vm.LabelConstant.SupplierCode : vm.LabelConstant.MFGCode,
          value: vm.mfgCode,
          displayOrder: 1,
          labelLinkFn: vm.goToManufacturerList,
          valueLinkFn: vm.editManufacturer,
          valueLinkFnParams:null,
          isCopy: true,
          copyParams: null,
          imgParms: null
        },
        {
          label: (vm.mfgType == CORE.MFG_TYPE.DIST ? vm.LabelConstant.SupplierPN : vm.LabelConstant.MFGPN),
          value: data.mfgPN,
          displayOrder: 2,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToComponentDetail,
          valueLinkFnParams: null,
          isCopy: true,
          copyParams: null,
          imgParms: {
            imgPath: vm.rohsIcon,
            imgDetail: vm.rohsName
          }
        },
        {
          label: vm.LabelConstant.PID,
          value: data.PIDCode,
          displayOrder: 3,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToComponentDetail,
          valueLinkFnParams: null,
          isCopy: true,
          copyParams: null,
          imgParms: null
        }];
    }
    
    vm.cancel = () => {
      BaseService.currentPagePopupForm.pop();
      DialogFactory.closeDialogPopup();
    };
  }
})();
