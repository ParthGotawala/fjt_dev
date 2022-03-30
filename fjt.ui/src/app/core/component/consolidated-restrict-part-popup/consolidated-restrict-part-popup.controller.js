(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ConsolidatedRestrictedPartPopupController', ConsolidatedRestrictedPartPopupController);

  /** @ngInject */
  function ConsolidatedRestrictedPartPopupController($mdDialog, CORE, USER, RFQTRANSACTION, data) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM;
    vm.consolidateRestrictPartDetail = _.clone(data.consolidateRestrictPartDetail);
    vm.consolidateLineItems = [];
    vm.LabelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CPNPID = data.CPNPID;
    vm.custPNID = data.custPNID;
    vm.CPNRoHSIcon = data.CPNRoHSIcon;
    vm.CPNRoHSName = data.CPNRoHSName;
    vm.restrictCPNUseInBOMStep = parseInt(data.restrictCPNUseInBOMStep) === 1 ? 'Yes' : 'No';
    vm.restrictCPNUsePermanentlyStep = parseInt(data.restrictCPNUsePermanentlyStep) === 1 ? 'No' : 'Yes';
    vm.restrictCPNUseWithPermissionStep = parseInt(data.restrictCPNUseWithPermissionStep) === 1 ? 'No' : 'Yes';
    vm.cpncustAssyPN = data.cpncustAssyPN;
    _.each(vm.consolidateRestrictPartDetail, (Item) => {
      var dashSplit = Item.split('|');
      var i = 0;
      var obj = {};
      _.each(dashSplit, (innerItem) => {
        if (i === 0) {
          const innerItemData = innerItem.split(':');
          obj.level = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 1) {
          const innerItemData = innerItem.split(':');
          obj.part = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 2) {
          const innerItemData = innerItem.split(':');
          obj.item = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 3) {
          const innerItemData = innerItem.split(':');
          obj.PIDCode = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 4) {
          const innerItemData = innerItem.split(':');
          obj.mfgPNID = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 5) {
          const innerItemData = innerItem.split(':');
          obj.restrictUseInBOMExcludingAliasStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'Yes' : 'No' : 'No';
        }
        if (i === 6) {
          const innerItemData = innerItem.split(':');
          obj.restrictUseInBOMExcludingAliasWithPermissionStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'Yes' : 'No' : 'No';
        }
        if (i === 7) {
          const innerItemData = innerItem.split(':');
          obj.restrictUseInBOMStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'Yes' : 'No' : 'No';
        }
        if (i === 8) {
          const innerItemData = innerItem.split(':');
          obj.restrictUseInBOMWithPermissionStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'Yes' : 'No' : 'No';
        }
        if (i === 9) {
          const innerItemData = innerItem.split(':');
          obj.restrictUseExcludingAliasStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'No' : 'Yes' : 'Yes';
        }
        if (i === 10) {
          const innerItemData = innerItem.split(':');
          obj.restrictUseExcludingAliasWithPermissionStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'No' : 'Yes' : 'Yes';
        }
        if (i === 11) {
          const innerItemData = innerItem.split(':');
          obj.restrictUsePermanentlyStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'No' : 'Yes' : 'Yes';
        }
        if (i === 12) {
          const innerItemData = innerItem.split(':');
          obj.restrictUseWithPermissionStep = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? 'No' : 'Yes' : 'Yes';
        }
        if (i === 18) {
          const innerItemData = innerItem.split(':');
          obj.custAssyPN = innerItemData.length > 1 ? innerItemData[1] ? innerItemData[1] : null : null;
        }
        if (i === 19) {
          const innerItemData = innerItem.split(':');
          obj.isCustom = innerItemData.length > 1 ? parseInt(innerItemData[1]) === 1 ? true : false : false;
        }
        if (i === 20) {
          const innerItemData = innerItem.split(':');
          obj.AssyPN = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 21) {
          const innerItemData = innerItem.split(':');
          obj.partID = innerItemData.length > 1 ? parseInt(innerItemData[1]) : null;
        }
        if (i === 22) {
          const innerItemData = innerItem.split(':');
          obj.assyCustPN = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 23) {
          const innerItemData = innerItem.split(':');
          obj.mfgPN = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 24) {
          const innerItemData = innerItem.split(':');
          obj.mfgPNRoHSName = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 25) {
          const innerItemData = innerItem.split(':');
          obj.mfgPNRoHSIcon = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 26) {
          const innerItemData = innerItem.split(':');
          obj.AssyRoHSName = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 27) {
          const innerItemData = innerItem.split(':');
          obj.AssyRoHSIcon = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        i = i + 1;
      });

      vm.consolidateLineItems.push(obj);
    });
    vm.consolidateLineItems = _.orderBy(vm.consolidateLineItems, 'level');
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
