(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('workorderTemperatureSensitiveComponents', workorderTemperatureSensitiveComponents);

  /** @ngInject */
  function workorderTemperatureSensitiveComponents() {
    var directive = {
      restrict: 'E',
      scope: {
        woId: '=',
        isIncludeSubAssembly:"="
      },
      templateUrl: 'app/directives/custom/workorder-temperature-sensitive-components/workorder-temperature-sensitive-components.html',
      controller: workorderTemperatureSensitiveComponentsCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function workorderTemperatureSensitiveComponentsCtrl($scope, $q, BaseService, WorkorderFactory, CORE, USER) {
      var vm = this;
      vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
      vm.LabelConstant = CORE.LabelConstant;
      vm.selectedItems = [];
      vm.tmaxIcon = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, CORE.TMAX_ICON);
      //Get Active Operation List of Employee
      let getTempratureSensitiveComponentList = () => {
        let _objList = {};
        _objList.woID = $scope.woId;
        _objList.isSubAssembly = $scope.isIncludeSubAssembly;
        return WorkorderFactory.getTempratureSensitiveComponentListByWoID().query({
          listObj: _objList
        }).$promise.then((response) => {
          return response.data;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      let getRecords = () => {
        var cgPromise = [getTempratureSensitiveComponentList()];
        vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
          vm.componentList = responses[0].componentList;
        });
      }
      getRecords();
      //keep watch to update directive value base on selection details
      $scope.$watch('isIncludeSubAssembly', function (oldvalue, newValue) {
        if (oldvalue != newValue) {
          getRecords();
        }
      });

      vm.refreshList = () => {
        getRecords();
      }
    }
  }
})();
