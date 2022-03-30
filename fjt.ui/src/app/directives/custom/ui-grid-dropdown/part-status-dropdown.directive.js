angular
  .module('app.core')
  .directive('partStatusDropdown', function () {
    return {
      template: '<select class="form-control ui-grid-filter-input" style="height:30px" ng-model="colFilter.term" ng-options="option.id as option.value for option in  partStatusList"></select>',
      controller: ['$scope', 'RFQSettingFactory', 'CORE', 'BaseService', function ($scope, RFQSettingFactory, CORE, BaseService) {
        var vm = this;

        $scope.init = function () {
          if ($scope.colFilter && $scope.partStatusList && $scope.partStatusList.length > 0) {
            $scope.colFilter.term = $scope.colFilter.term == undefined || $scope.colFilter.term == null ? $scope.partStatusList[0].id : $scope.colFilter.term;
          }
        };

        return RFQSettingFactory.getPartStatusList().query().$promise.then((partstatus) => {
          $scope.partStatusList = [{ id: null, value: 'All' }];
          _.each(partstatus.data, function (item) {
            var obj = {
              id: item.name,
              value: item.name
            }
            $scope.partStatusList.push(obj);
          });
          $scope.init();
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        })

      }]
    };
  });


