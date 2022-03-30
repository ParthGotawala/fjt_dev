(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('kitAllocationGridAdvancedFilter', kitAllocationGridAdvancedFilter);

  /** @ngInject */
  function kitAllocationGridAdvancedFilter(KitAllocationFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        filterList: '=',
        searchFunction: '=',
        partID: '=',
        refSalesOrderDetailId: '=',
        isConsolidated: '=',
        mountingTypeId: '=?'
      },
      templateUrl: 'app/directives/custom/kit-allocation-grid-advanced-filter/kit-allocation-grid-advanced-filter.html',
      controller: kitAllocationGridAdvancedFilterCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function kitAllocationGridAdvancedFilterCtrl($scope, USER ,CORE, TRANSACTION, BaseService) {
      var vm = this;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.transaction = TRANSACTION;
      vm.LabelConstant = CORE.LabelConstant;
      vm.configTimeout = _configTimeout;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COMPONENT_FILTERS;
      vm.functionalTypeList = vm.functionalTypeListToDisplay = $scope.filterList.functionalTypeList;
      vm.mountingTypeList = vm.mountingTypeListToDisplay = $scope.filterList.mountingTypeList;
      vm.warehouseList = vm.warehouseListToDisplay = $scope.filterList.warehouseList;

      $scope.$watch('filterList', (newValue) => {
        vm.functionalTypeList = vm.functionalTypeListToDisplay = newValue.functionalTypeList;
        vm.mountingTypeList = vm.mountingTypeListToDisplay = newValue.mountingTypeList;
        vm.warehouseList = vm.warehouseListToDisplay = newValue.warehouseList;
        _.map(vm.warehouseList, (data) => {
          data.Name = stringFormat('{0} ({1})', data.Name, data.totalReel);
        });
        vm.warehouseListCopy = vm.warehouseListToDisplay = angular.copy(vm.warehouseList);
        vm.initCartType();
        vm.selectCart();
        if (vm.functionalTypeSearchText) {
          vm.searchFunctionalTypeList();
        }
        else if (vm.mountingTypeSearchText) {
          vm.searchMountingTypeList();
        }
        else if (vm.cartTypeSearchText) {
          vm.searchCartTypeList();
        }
        else if (vm.warehouseSearchText) {
          vm.searchWarehouseList();
        }
      });

      vm.pagingInfo = $scope.filterList.pagingInfo;
      vm.mountingTypeId = $scope.mountingTypeId;
      vm.filter = {
        functionalType: [],
        mountingType: [],
        cartType: [],
        warehouse: []
      };
      const cartType = angular.copy(CORE.WarehouseCartManufacturer);
      cartType.splice(0, 0, { id: '-1', name: 'Manual' });
      vm.initCartType = () => {
        vm.cartTypeList = [];
        _.map(vm.warehouseList, (data) => {
          if (!data.cartMfr) {
            data.cartMfr = '-1';
          }
          const obj = _.find(cartType, (item) => data.cartMfr === item.id);
          if (obj) {
            vm.cartTypeList.push(obj);
          }
        });
        vm.cartTypeList = vm.cartTypeListToDisplay = _.orderBy(_.uniqBy(vm.cartTypeList, 'name'), ['name'], ['asc']);
      };
      vm.selectCart = () => {
        if (vm.filter && vm.filter.cartType && vm.filter.cartType.length > 0) {
          vm.warehouseList = [];
          _.map(vm.filter.cartType, (data) => {
            if (data === '-1') {
              data = null;
            }
            _.each(vm.warehouseListCopy, (item) => {
              if (item.cartMfr === data) {
                vm.warehouseList.push(item);
              }
            });
          });
          vm.warehouseListToDisplay = vm.warehouseList;
        }
      };
      vm.advanceFilter = () => {
        const advancefilterData = {
          functionalType: vm.filter.functionalType.join(','),
          mountingType: vm.filter.mountingType.join(','),
          cartType: vm.filter.cartType.join(','),
          warehouse: vm.filter.warehouse.join(',')
        };
        $scope.searchFunction(advancefilterData);
      };
      if (vm.mountingTypeId) {
        vm.showAdvanceFilter = true;
        vm.filter.mountingType.push(vm.mountingTypeId);
        vm.advanceFilter();
      } else {
        vm.showAdvanceFilter = false;
      }
      vm.resetFilter = () => {
        vm.clearFunctionalTypeFilter();
        vm.clearMountingTypeFilter();
        vm.clearCartTypeFilter();
        vm.clearWarehouseFilter();
        vm.clearFunctionalTypeSearchText();
        vm.clearMountingTypeSearchText();
        vm.clearCartTypeSearchText();
        vm.clearWarehouseSearchText();
        vm.advanceFilter();
      };
      vm.getKitAllocationFilterList = (type) => {
        const objFilter = {
          partID: $scope.partID,
          refSalesOrderDetailId: $scope.refSalesOrderDetailId,
          isConsolidated: $scope.isConsolidated
        };

        KitAllocationFactory.getKitAllocationFilterList().query(objFilter).$promise.then((response) => {
          if (response.data) {
            if (type === TRANSACTION.KitAllocationAdvanceFilterType.FunctionalType) {
              vm.functionalTypeSearchText = null;
              vm.functionalTypeList = vm.functionalTypeListToDisplay = vm.functionalTypeListToDisplay = response.data.FunctionalTypeList;
            }
            if (type === TRANSACTION.KitAllocationAdvanceFilterType.MountingType) {
              vm.mountingTypeSearchText = null;
              vm.mountingTypeList = vm.mountingTypeListToDisplay = response.data.MountingTypeList;
            }

            if (type === TRANSACTION.KitAllocationAdvanceFilterType.CartType || type === TRANSACTION.KitAllocationAdvanceFilterType.Warehouse) {
              if (type === TRANSACTION.KitAllocationAdvanceFilterType.CartType) {
                vm.cartTypeSearchText = null;
              } else {
                vm.clearWarehouseSearchText();
              }
              vm.warehouseList = warehouseListToDisplay = response.data.WarehouseList;
              _.map(vm.warehouseList, (data) => {
                data.Name = stringFormat('{0} ({1})', data.Name, data.totalReel);
              });
              vm.warehouseListCopy = angular.copy(vm.warehouseList);
              vm.initCartType();
              vm.selectCart();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.searchFunctionalTypeList = () => {
        const functionalTypeListToFilter = angular.copy(vm.functionalTypeList);
        vm.functionalTypeListToDisplay = vm.functionalTypeSearchText ? _.filter(functionalTypeListToFilter, (item) => item.partTypeName.toLowerCase().contains(vm.functionalTypeSearchText.toLowerCase())) : functionalTypeListToFilter;
      };

      vm.searchMountingTypeList = () => {
        const mountingTypeListToFilter = angular.copy(vm.mountingTypeList);
        vm.mountingTypeListToDisplay = vm.mountingTypeSearchText ? _.filter(mountingTypeListToFilter, (item) => item.name.toLowerCase().contains(vm.mountingTypeSearchText.toLowerCase())) : mountingTypeListToFilter;
      };

      vm.searchCartTypeList = () => {
        const cartTypeListToFilter = angular.copy(vm.cartTypeList);
        vm.cartTypeListToDisplay = vm.cartTypeSearchText ? _.filter(cartTypeListToFilter, (item) => item.name.toLowerCase().contains(vm.cartTypeSearchText.toLowerCase())) : cartTypeListToFilter;
      };
      vm.searchWarehouseList = () => {
        const warehouseListToFilter = angular.copy(vm.warehouseList);
        vm.warehouseListToDisplay = vm.warehouseSearchText ? _.filter(warehouseListToFilter, (item) => item.Name.toLowerCase().contains(vm.warehouseSearchText.toLowerCase())) : warehouseListToFilter;
      };
      vm.clearFunctionalTypeFilter = () => {
        vm.filter.functionalType = [];
        if (vm.pagingInfo.functionalType) {
          vm.advanceFilter();
        }
      };

      vm.clearMountingTypeFilter = () => {
        vm.filter.mountingType = [];
        if (vm.pagingInfo.mountingType) {
          vm.advanceFilter();
        }
      };

      vm.clearCartTypeFilter = () => {
        vm.filter.cartType = [];
        vm.warehouseList = vm.warehouseListToDisplay = vm.warehouseListCopy;
        if (vm.pagingInfo.cartType) {
          vm.advanceFilter();
        }
      };

      vm.clearWarehouseFilter = () => {
        vm.filter.warehouse = [];
        if (vm.pagingInfo.warehouse) {
          vm.advanceFilter();
        }
      };
      vm.clearFunctionalTypeSearchText = () => {
        vm.functionalTypeSearchText = null;
        vm.searchFunctionalTypeList();
      };
      vm.clearMountingTypeSearchText = () => {
        vm.mountingTypeSearchText = null;
        vm.searchMountingTypeList();
      };
      vm.clearCartTypeSearchText = () => {
        vm.cartTypeSearchText = null;
        vm.searchCartTypeList();
      };
      vm.clearWarehouseSearchText = () => {
        vm.warehouseSearchText = null;
        vm.searchWarehouseList();
      };
      vm.goToFunctionalTypeList = () => {
        BaseService.goToFunctionalTypeList();
      };
      vm.goToMountingTypeList = () => {
        BaseService.goToMountingTypeList();
      };
      vm.goToWHList = () => {
        BaseService.goToWHList();
      };
    }
  }
})();
