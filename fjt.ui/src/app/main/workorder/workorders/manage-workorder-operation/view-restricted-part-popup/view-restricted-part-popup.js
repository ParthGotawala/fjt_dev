(function () {
    'use strict';

    angular
        .module('app.workorder.workorders')
        .controller('ViewRestrictedPartPopupController', ViewRestrictedPartPopupController);

    /** @ngInject */
    function ViewRestrictedPartPopupController($mdDialog, data, CORE, USER) {
        const vm = this;
        vm.LabelConstant = CORE.LabelConstant;
        //vm.limitOptions = [25, 50, 75, 100];
        vm.selectedItems = [];
        //vm.query = {
        //    order: '',
        //    search: {
        //    },
        //    limit: 100,
        //    page: 1,
        //    isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        //};

        vm.assyData = data;
        if (vm.assyData && vm.assyData.restrictedPartList.length > 0) {
            _.each(vm.assyData.restrictedPartList, (partItem) => {
                partItem.displayRohsIcon = partItem.displayRohsIcon ? partItem.displayRohsIcon : CORE.WEB_URL + USER.ROHS_BASE_PATH + partItem.rohsIcon;
            });
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();