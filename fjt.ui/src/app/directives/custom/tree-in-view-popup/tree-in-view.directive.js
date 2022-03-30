(function () {
  'use strict';

  angular.module('app.core').directive('treeInView', treeInView);

  /** @ngInject */
  function treeInView($mdDialog, KitAllocationFactory, BaseService, CORE, TRANSACTION, $q) {
    var directive = {
      restrict: 'E',
      scope: {
        salesOrderDetailId: '=?',
        partId: '=?',
        isKitAllocation: '=?'
      },
      templateUrl: 'app/directives/custom/tree-in-view-popup/tree-in-view.html',
      controller: treeInViewCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    /**
    * Controller for view data of Kit Assy Tree view
    *
    * @param
    */
    function treeInViewCtrl($scope) {
      const vm = this;
      vm.LabelConstant = CORE.LabelConstant;
      vm.salesOrderDetailId = $scope.salesOrderDetailId;
      vm.isKitAllocation = $scope.isKitAllocation ? true : false;
      vm.partID = $scope.partId;
      vm.documentClass = 'kit-js-tree';
      vm.viewType = TRANSACTION.VIEW_TYPE;

      function getAssemblyTreeViewList(viewType) {
        const objData = {
          salesOrderDetailId: vm.salesOrderDetailId,
          partID: vm.partID,
          viewType: viewType,
          isKitAllocation: vm.isKitAllocation
        };
        return KitAllocationFactory.getAssemblyTreeViewList().query(objData).$promise.then((response) => {
          if (response && response.data) {
            if (viewType === vm.viewType.SingleLevelView) {
              vm.singleLevelViewList = response.data.levelTreeList;
            }
            if (viewType === vm.viewType.MultiLevelView) {
              vm.multiLevelViewList = response.data.levelTreeList;
            }
            if (viewType === vm.viewType.FlattenedView) {
              vm.flattenedViewList = response.data.levelTreeList;
            }
          }
          return $q.resolve(response.data.levelTreeList);
        });
      }

      vm.onTreeLoaded = () => {
        $('.' + vm.documentClass).jstree('open_all');
        $('.' + vm.documentClass).jstree('show_dots');
        $('.' + vm.documentClass).jstree('hide_icons');
      };

      if (vm.salesOrderDetailId && vm.partID) {
        const promise = [getAssemblyTreeViewList(vm.viewType.SingleLevelView), getAssemblyTreeViewList(vm.viewType.MultiLevelView), getAssemblyTreeViewList(vm.viewType.FlattenedView)];
        $scope.$parent.$parent.cgBusyLoading = $q.all(promise).then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }
  }
})();
