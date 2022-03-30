(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ViewAssyUsedForMFGAliasPopupController', ViewAssyUsedForMFGAliasPopupController);

    /** @ngInject */
    function ViewAssyUsedForMFGAliasPopupController($mdDialog, data, CORE, USER) {
        const vm = this;
        vm.LabelConstant = CORE.LabelConstant;
        vm.limitOptions = [25, 50, 75, 100];
        vm.selectedItems = []
        vm.query = {
            order: '',
            search: {
                key: '',
                value: '',
                moduleName: ''
            },
            limit: 100,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };

        vm.assyData = data;
        if (vm.assyData && vm.assyData.usedPartIDsList.length > 0) {
            _.each(vm.assyData.usedPartIDsList, (partItem) => {
                partItem.component.rfq_rohsmst.displayRohsIcon = CORE.WEB_URL + USER.ROHS_BASE_PATH + partItem.component.rfq_rohsmst.rohsIcon;
            });
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();