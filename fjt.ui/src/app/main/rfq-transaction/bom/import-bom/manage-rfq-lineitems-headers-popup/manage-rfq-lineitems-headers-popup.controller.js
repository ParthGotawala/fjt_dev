(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ManageRFQLineitemsHeadersPopupController', ManageRFQLineitemsHeadersPopupController);

  /** @ngInject */
  function ManageRFQLineitemsHeadersPopupController($mdDialog, $scope, uiSortableMultiSelectionMethods, BaseService, ManageRFQLineitemsHeadersPopupFactory, RFQTRANSACTION) {
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
        // const sourceModel = ui.item.sortable.model;
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
      vm.cgBusyLoading = ManageRFQLineitemsHeadersPopupFactory.saveDisplayOrder().save(lineitemsheardeslist).$promise.then(() => {
        // Empty
      }).catch((error) => BaseService.getErrorLog(error));
    }
    init();
    function init() {
      vm.cgBusyLoading = ManageRFQLineitemsHeadersPopupFactory.getRFQLineItemsHeaders().query().$promise.then((res) => {
        if (res.data) {
          vm.lineitemsheaderNoAddedList = res.data;
          vm.lineitemsheaderNoAddedList.forEach((item) => {
            if (RFQTRANSACTION.MULTI_FIELDS.indexOf(item.field) !== -1) {
              item.isDisabled = true;
            }
            if (RFQTRANSACTION.HIDDEN_FIELDS.indexOf(item.field) !== -1) {
              item.isHidden = true;
            }
            else {
              item.isHidden = false;
            }
          });
          vm.lineitemsheaderNoAddedList = _.filter(vm.lineitemsheaderNoAddedList, (item) => !item.isHidden);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
