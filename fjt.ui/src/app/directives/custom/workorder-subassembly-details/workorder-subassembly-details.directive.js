(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('workorderSubassemblyDetails', workorderSubassemblyDetails);

  /** @ngInject */
  function workorderSubassemblyDetails() {
    var directive = {
      restrict: 'E',
      scope: {
        soDetId: '=',
        assyId: '=',
        woObj: '=',
        buildQty: '=',
        isIncludeSubAssembly:'='
      },
      templateUrl: 'app/directives/custom/workorder-subassembly-details/workorder-subassembly-details.html',
      controller: workorderSubassemblyDetailsCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function workorderSubassemblyDetailsCtrl($scope, $q, BaseService, DialogFactory, SalesOrderFactory, WORKORDER, CORE, USER) {
      var vm = this;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.LabelConstant = CORE.LabelConstant;
      vm.woObj = $scope.woObj;

      //get sub assembly details by work order and assembly ID
      const getSubAsemblyDetails = () => {
        if ($scope.assyId) {
          const assyInfo = {
            soDetID: $scope.soDetId,
            partID: $scope.assyId,
            woID: vm.woObj.woID,
            customerID: vm.woObj.customerID
          };
          return SalesOrderFactory.getSubAsemblyDetailList().query({
            assyObj: assyInfo
          }).$promise.then((res) => {
            return res.data;
          });
        }
      };

      // get records for subassenly datas
      vm.refreshList = () => {
        var cgPromise = [getSubAsemblyDetails()];
        vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
          const subAssemblyDetails = responses[0];
          if (subAssemblyDetails) {
            _.each(subAssemblyDetails, (item) => {
              // get all refrence work order details in array
              item.refWorkOrderNumbers = [];
              if (item.refWorkOrders) {
                const wODetails = item.refWorkOrders.split(',');
                if (wODetails.length > 0) {
                  _.each(wODetails, (woItem) => {
                    const woObj = woItem.split('####');
                    if (woObj.length > 0) {
                      const _woItem = {};
                      _woItem.woNumberWithVersion = woObj[0];
                      _woItem.woID = woObj[1];
                      item.refWorkOrderNumbers.push(_woItem);
                    }
                  });
                }
              }
              item.qpaQty = (item.qpaQty || 0);
              item.requiredQty = (item.requiredQty || 0);
              item.excessQty = (item.excessQty || 0);
              item.totalQty = (item.totalQty || 0);
              item.availableQty = (item.availableQty || 0);

              item.requiredQty = (($scope.buildQty || 0) * item.qpaQty);
              item.excessQty = item.excessQty;
              item.totalQty = (($scope.buildQty || 0) * item.qpaQty) + item.excessQty;
              item.availableQty = item.availableQty;
            });
          }
          vm.subAssemblyDetails = responses[0];
        });
      };
      vm.refreshList();

      // get sub assembly qty
      vm.getSubAssemblyQty = (item) => (($scope.buildQty || 0) * item.qpaQty) + item.excessQty;

      // get assembly required Qty
      vm.getRequiredQty = (item) => (($scope.buildQty || 0) * item.qpaQty);

      // add new sub assembly work order
      vm.addRecord = (ev, item) => {
        var data = {
          woID: vm.woObj.woID,
          customerID: vm.woObj.customerID,
          woNumber: vm.woObj.woNumber,
          woVersion: vm.woObj.woVersion,
          soDetId:$scope.soDetId,
          openInNewTab: true,
          subAssy: {
            id: item.prPerPartID,
            PIDCode: item.PIDCode,
            rohsIcon: vm.rohsImagePath + item.rohsIcon,
            rohsName: item.rohsName,
          },
          mainAssy: {
            id: item.partID,
            PIDCode: vm.woObj.PIDCode,
            rohsIcon: vm.woObj.rohsIcon,
            rohsName: vm.woObj.rohsName,
          },
          subAssyPartID: item.prPerPartID, //subAssemblyPartID
          mainAssyPartID: item.partID, //mainAssemblyPartID
          isFromWO: true
        };

        DialogFactory.dialogService(
          WORKORDER.ADD_WORKORDER_CONTROLLER,
          WORKORDER.ADD_WORKORDER_VIEW,
          event,
          data).then((result) => {
          }, (error) => {
            return BaseService.getErrorLog(error);
          });
      };

      ////keep watch to update directive value base on selection details
      //$scope.$watch('buildQty', function (oldvalue, newValue) {
      //  if (oldvalue != newValue) {
      //    _.each(responses[0], (item) => {
      //      item.requiredQty = (newValue * item.qpaQty);
      //      item.excessQty = item.excessQty;
      //      item.totalQty = (newValue * item.qpaQty) + item.excessQty;
      //      item.availableQty = item.availableQty;
      //    }); 
      //  }
      //});
      // go to work order details.
      vm.goToWorkorderDetails = (woID) => {
        BaseService.goToWorkorderDetails(woID);
        return false;
      }
    }
  }
})();
