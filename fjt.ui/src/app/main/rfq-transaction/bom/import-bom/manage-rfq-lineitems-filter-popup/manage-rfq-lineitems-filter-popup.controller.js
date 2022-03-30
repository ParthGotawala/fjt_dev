(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ManageRFQLineitemsFilterPopupController', ManageRFQLineitemsFilterPopupController);

  /** @ngInject */
  function ManageRFQLineitemsFilterPopupController($mdDialog, $scope, $timeout, $filter, $q, uiSortableMultiSelectionMethods, CORE, data, BaseService, MasterFactory, DialogFactory, RFQTRANSACTION, ImportBOMFactory) {

    const vm = this;
    vm.lineitemsheaderNoAddedList = [];

    $scope.sortableOptionslineitemsheaders = uiSortableMultiSelectionMethods.extendOptions({
      cancel: '.cursor-not-allow',
      placeholder: 'beingDragged',
      'ui-floating': true,
      cursorAt: {
        top: 0, left: 0
      },
      stop: (e, ui) => {
        const sourceModel = ui.item.sortable.model;
        if (ui.item.sortable.droptarget) {
          const shortHeaderArray = _.filter(vm.lineitemsheaderNoAddedList, (header) => !header.isHidden);
          const disablecount = _.countBy(vm.lineitemsheaderNoAddedList, (header) => header.isDisabled);
          for (let i = shortHeaderArray.length - 1; i >= shortHeaderArray.length - disablecount.true; i--) {
            const item = shortHeaderArray[i];
            if (RFQTRANSACTION.MULTI_FIELDS.indexOf(item.field) === -1) {
              ui.item.sortable.cancel();
              vm.lineitemsheaderNoAddedList = _.orderBy(vm.lineitemsheaderNoAddedList, 'displayOrder');
              return;
            }
          }

          const lineitemsheardeslist = _.map(shortHeaderArray, (itemData, index) => ({
            id: itemData.id,
            //displayOrder: itemData.displayOrder == 1000 ? itemData.displayOrder : index + 1
            displayOrder: index + 1
          }));
          savedisplayOrder(lineitemsheardeslist);
        }
      }
    });

    function savedisplayOrder(lineitemsheardeslist) {
      vm.cgBusyLoading = ImportBOMFactory.saveFilterDisplayOrder().save(lineitemsheardeslist).$promise.then(() => {
        // Empty
      }).catch((error) => BaseService.getErrorLog(error));
    };
    init();
    function init() {
      vm.cgBusyLoading = $q.all([getFilters(), getUserBOMFiltersSequence()]).then(() => {
        _.each(vm.lineitemsheaderNoAddedList, (objfilter) => {
          const objFilterOrder = _.find(vm.bomFiltersSequence, (x) => x.filterId === objfilter.id);
          if (objFilterOrder) {
            objfilter.displayOrder = objFilterOrder.displayOrder;
          }
        });

        vm.lineitemsheaderNoAddedList = _.sortBy(vm.lineitemsheaderNoAddedList, 'displayOrder');
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Get Filters list to bind into filter drop down
    function getFilters() {
      return MasterFactory.getFilters().query().$promise.then((response) => {
        if (response && response.data) {
          vm.lineitemsheaderNoAddedList = response.data;
          return vm.lineitemsheaderNoAddedList;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return null;
      });
    }

    // Get current login user wise BOM Filters Sequence
    function getUserBOMFiltersSequence() {
      return ImportBOMFactory.getUserBOMFiltersSequence().query().$promise.then((resBOMFilterSequence) => {
        if (resBOMFilterSequence && resBOMFilterSequence.data) {
          vm.bomFiltersSequence = resBOMFilterSequence.data;
          return vm.bomFiltersSequence;
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
        return null;
      });
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
