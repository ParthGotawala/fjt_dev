(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RFQPriceGroupMatrixViewController', RFQPriceGroupMatrixViewController);

  /** @ngInject */
  function RFQPriceGroupMatrixViewController($mdDialog, CORE, RFQTRANSACTION, data) {
    const vm = this;

    vm.rfqPriceGroup = angular.copy(data);
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.unitOfTime = RFQTRANSACTION.RFQ_TURN_TYPE;
    const rfqPriceGroupMatrix = [];
    _.each(vm.rfqPriceGroup, (objPriceGroup) => {
      _.each(objPriceGroup.rfqPriceGroupDetail, (objDetail) => {
        const obj = {
          rfqAssyID: objDetail.rfqAssyID,
          partID: objDetail.partID,
          RoHSIcon: objDetail.RoHSIcon,
          rohsName: objDetail.rohsName,
          mfgPN: objDetail.mfgPN,
          PIDCode: objDetail.PIDCode,
          priceGroup: objPriceGroup.name,
          priceGroupID: objDetail.rfqPriceGroupID,
          qty: objDetail.qty,
          turnTime: objDetail.turnTime,
          unitOfTime: objDetail.unitOfTime,
          custAssyPN: objDetail.custAssyPN,
          isCustom: objDetail.isCustom
        };
        rfqPriceGroupMatrix.push(obj);
      });
    });
    vm.PriceGroupMatrix = _.chain(rfqPriceGroupMatrix).groupBy('PIDCode').map((value) => {
      var partDeail = _.first(value) || {};
      return {
        priceGroupDetail: value,
        PIDCode: partDeail.PIDCode,
        partID: partDeail.partID,
        RoHSIcon: partDeail.RoHSIcon,
        rohsName: partDeail.rohsName,
        mfgPN: partDeail.mfgPN,
        custAssyPN: partDeail.custAssyPN,
        isCustom: partDeail.isCustom
      };
    }).value();
    vm.headerData = [];
    vm.headerData = [{
      label: vm.LabelConstant.Assembly.QuoteGroup,
      value: vm.rfqPriceGroup.length > 0 ? vm.rfqPriceGroup[0].refRFQID : null
    }];
    // close pop up
    vm.cancel = () => {
      $mdDialog.cancel(data.rfqAssyMiscBuild);
    };
  }
})();
