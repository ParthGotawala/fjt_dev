(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ConsolidatedQPAPopupController', ConsolidatedQPAPopupController);

  /** @ngInject */
  function ConsolidatedQPAPopupController($mdDialog, $scope, $timeout, $filter, $q, uiSortableMultiSelectionMethods, CORE, USER, RFQTRANSACTION, data, BaseService, RFQFactory, BOMFactory, CopyBOMPopupFactory, CustomerConfirmationPopupFactory, CustomerFactory, DialogFactory, MasterFactory) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM;
    vm.LabelConstant = CORE.LabelConstant;
    vm.consolidateQpa = _.clone(data.consolidatedpartlineID);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.qpa = data.qpa;
    vm.consolidateLineItems = [];
    _.each(vm.consolidateQpa, (Item) => {
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
          obj.qpa = innerItemData.length > 1 ? parseFloat(innerItemData[1]) : 0;
        }
        if (i === 4) {
          const innerItemData = innerItem.split(':');
          obj.DNPQPA = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
        }
        if (i === 5) {
          //var innerItemData = innerItem.split(":");
          //var objDNPQPA = innerItemData.length > 1 ? _.find(CORE.BuyDNPQTYDropdown, (data) => { return data.id == innerItemData[1].trim() }) : CORE.BuyDNPQTYDropdown[0];
          //obj.isBuyDNPQPA = objDNPQPA ? objDNPQPA.value : CORE.BuyDNPQTYDropdown[0].value;
          const innerItemData = innerItem.split(':');
          obj.isBuyDNPQPA = innerItemData.length > 1 ? innerItemData[1].trim() : CORE.BuyDNPQTYDropdown[0].value;
        }
        if (i === 6) {
          const innerItemData = innerItem.split(':');
          obj.RefDesCount = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
        }
        if (i === 7) {
          const innerItemData = innerItem.split(':');
          obj.isPurchase = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
        }
        if (i === 8) {
          const innerItemData = innerItem.split(':');
          obj.DNPRefDesgCount = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
        }
        if (i === 9) {
          const innerItemData = innerItem.split(':');
          obj.isPopulate = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
        }
        if (i === 10) {
          const innerItemData = innerItem.split(':');
          obj.partID = innerItemData.length > 1 ? parseInt(innerItemData[1]) : 0;
        }
        if (i === 12) {
          const innerItemData = innerItem.split(':');
          obj.assyCustPN = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 13) {
          const innerItemData = innerItem.split(':');
          obj.AssyPN = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 14) {
          const innerItemData = innerItem.split(':');
          obj.AssyRoHSName = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        if (i === 15) {
          const innerItemData = innerItem.split(':');
          obj.AssyRoHSIcon = innerItemData.length > 1 ? innerItemData[1] : null;
        }
        i = i + 1;
      });
      if (obj.isPurchase && (obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[1].value.toUpperCase() || obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[3].value.toUpperCase())) {
        obj.consolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount) + (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
      } else if (!obj.isPurchase && (obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[1].value.toUpperCase() || obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[3].value.toUpperCase())) {
        obj.consolidatedQPA = (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
      } else if (obj.isPurchase && (obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[0].value.toUpperCase() || obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[2].value.toUpperCase())) {
        obj.consolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount);
      } else if (!obj.isPurchase && (obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[0].value.toUpperCase() || obj.isBuyDNPQPA.toUpperCase() === CORE.BuyDNPQTYDropdown[2].value.toUpperCase())) {
        obj.consolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount) + (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
      }

      //if (!obj.isPopulate) {
      //  if (obj.isPurchase && obj.isBuyDNPQPA !== CORE.BuyDNPQTYDropdown[0].value) {
      //    obj.allocationConsolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount);
      //  } else if (!obj.isPurchase && obj.isBuyDNPQPA !== CORE.BuyDNPQTYDropdown[0].value) {
      //    obj.allocationConsolidatedQPA = (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
      //  } else if (obj.isPurchase && obj.isBuyDNPQPA === CORE.BuyDNPQTYDropdown[0].value) {
      //    obj.allocationConsolidatedQPA = (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount) + (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
      //  } else {
      //    obj.allocationConsolidatedQPA = 0;
      //  }
      //} else if (obj.isPopulate && obj.isBuyDNPQPA !== CORE.BuyDNPQTYDropdown[0].value) {
      //  obj.allocationConsolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount) + (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
      //} else if (obj.isPopulate && obj.isBuyDNPQPA === CORE.BuyDNPQTYDropdown[0].value) {
      //  obj.allocationConsolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount);
      //}

      if (obj.isPurchase || obj.isPopulate) {
        if (obj.isBuyDNPQPA.toUpperCase() !== CORE.BuyDNPQTYDropdown[0].value.toUpperCase()) {
          obj.allocationConsolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount) + (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
        } else {
          obj.allocationConsolidatedQPA = (obj.qpa > obj.RefDesCount ? obj.qpa : obj.RefDesCount);
        }
      } else {
        if (obj.isBuyDNPQPA.toUpperCase() !== CORE.BuyDNPQTYDropdown[0].value.toUpperCase()) {
          obj.allocationConsolidatedQPA = (obj.DNPQPA > obj.DNPRefDesgCount ? obj.DNPQPA : obj.DNPRefDesgCount);
        } else {
          obj.allocationConsolidatedQPA = 0;
        }
      }
      vm.consolidateLineItems.push(obj);
    });
    vm.consolidateLineItems = _.orderBy(vm.consolidateLineItems, 'level');
    //get total for ref des count
    vm.getTotalrefDes = () => {
      var sum = (_.sumBy(vm.consolidateLineItems, (sum) => sum.RefDesCount));
      return sum ? sum : 0;
    };
    //get total for dnp ref des count
    vm.getTotaldnprefDes = () => {
      var sum = (_.sumBy(vm.consolidateLineItems, (sum) => sum.DNPRefDesgCount));
      return sum ? sum : 0;
    };
    //get total qpa
    vm.getTotalQPA = () => {
      var sum = (_.sumBy(vm.consolidateLineItems, (sum) => sum.qpa));
      return sum ? sum : 0;
    };
    //get total qpa
    vm.getTotalDNPQPA = () => {
      var sum = (_.sumBy(vm.consolidateLineItems, (sum) => sum.DNPQPA));
      return sum ? sum : 0;
    };
    //get costing qpa
    vm.getTotalCostingConsolidatedQPA = () => {
      var sum = (_.sumBy(vm.consolidateLineItems, (sum) => sum.consolidatedQPA));
      return sum ? sum : 0;
    };
    //get allocation qpa
    vm.getTotalAllocationConsolidatedQPA = () => {
      var sum = (_.sumBy(vm.consolidateLineItems, (sum) => sum.allocationConsolidatedQPA));
      return sum ? sum : 0;
    };
    vm.goToComponentDetail = (id, ev) => {
      if (id) {
        BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, id, USER.PartMasterTabs.Detail.Name);
      }
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    };
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
