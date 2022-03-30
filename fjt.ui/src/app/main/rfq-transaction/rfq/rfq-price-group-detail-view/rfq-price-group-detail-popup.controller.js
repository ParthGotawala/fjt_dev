(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RFQPriceGroupDetailController', RFQPriceGroupDetailController);

  /** @ngInject */
  function RFQPriceGroupDetailController($mdDialog, PartCostingFactory, CORE, RFQTRANSACTION, USER, data, BaseService) {
    const vm = this;

    vm.rfq = angular.copy(data);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.priceGroupName = null;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.unitOfTime = RFQTRANSACTION.RFQ_TURN_TYPE;
    vm.rfqPriceGroupDetail = [];

    vm.headerData = [];
    vm.headerData = [{
      label: vm.LabelConstant.Assembly.QuoteGroup,
      value: vm.rfq.rfqID
    }];

    active();
    function active() {
      vm.cgBusyLoading = PartCostingFactory.getPriceGroupDetail().query({ priceGroupId: vm.rfq.priceGroupId }).$promise.then((dynamic) => {
        if (dynamic && dynamic.data) {
          vm.rfqPriceGroupDetail = dynamic.data;
          _.each(vm.rfqPriceGroupDetail, (item) => {
            item.RoHSIcon = stringFormat('{0}{1}', vm.rohsImagePath, item.RoHSIcon);
          });
          if (vm.rfqPriceGroupDetail.length > 0) {
            vm.priceGroupName = _.first(vm.rfqPriceGroupDetail).priceGroupName;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    // close pop up
    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
