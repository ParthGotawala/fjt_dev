(function () {
    'use strict';

    angular
        .module('app.workorder.workorders')
        .controller('AdvancedSearchPopUpController', AdvancedSearchPopUpController);

    function AdvancedSearchPopUpController($mdDialog, data, CORE, BaseService, WorkorderFactory) {
        const vm = this;
        vm.isAll = false;
        vm.woStatusIds = angular.copy(CORE.WorkOrderStatus);
        if (data.length > 0) {
            _.map(vm.woStatusIds, (o) => {
                o.isChecked = data.indexOf(o.Key) != -1;
            });
            var isAnyUnChecked = _.some(vm.woStatusIds, (o) => {
                return o.isChecked == false;
            });
            vm.isAll = !isAnyUnChecked;
        }
        vm.pagingInfo = {
            Page: CORE.UIGrid.Page(),
            SortColumns: [['woID', 'DESC']],
            SearchColumns: [],
        };
        vm.checkChange = () => {
            var isAnyUnChecked = _.some(vm.woStatusIds, (o) => {
                return o.isChecked == false;
            })
            vm.isAll = !isAnyUnChecked;

            vm.isSaveEnabled = _.some(vm.woStatusIds, (o) => {
                return o.isChecked == true;
            });
        }

        vm.checkAll = () => {
            _.each(vm.woStatusIds, (o) => {
                o.isChecked = vm.isAll;
            })
            vm.isSaveEnabled = vm.isAll;
        }
        vm.search = () => {
            var woStatusIdArr = _.map(_.filter(vm.woStatusIds, { isChecked: true }), (o) => { return o.Key });
            $mdDialog.cancel(woStatusIdArr);
        }
        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();