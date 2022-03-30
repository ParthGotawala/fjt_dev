(function () {
    'use strict';

    angular.module('app.transaction.packingSlip')
      .controller('StatusFilterController', StatusFilterController);

    function StatusFilterController($scope, $state, $stateParams, $timeout, $mdDialog, BaseService, USER, CORE, TRANSACTION, data) {
        const vm = this;
        let filterData = data;
        vm.transaction = TRANSACTION;
        vm.searchType = angular.copy(CORE.InvoiceVerificationStatusOptionsGridHeaderDropdown);
        let removeData = _.remove(vm.searchType, (data) => { return data.id == null; });
        _.map(vm.searchType, (data) => {
            let selectRecord = _.find(filterData, (item) => { return item == data.code });
            if (selectRecord)
                data.isSelect = true;
            else
                data.isSelect = false;
        });
        vm.isAnySelected = false;
        vm.isAll = false;

        vm.checkAll = () => {
            if (vm.isAll) {
                vm.isAnySelected = true;
                _.map(vm.searchType, (data) => { return data.isSelect = true });
            } else {
                vm.isAnySelected = false;
                _.map(vm.searchType, (data) => { return data.isSelect = false });
            }
        }

        vm.selectType = () => {
            vm.isAll = false;
            if (_.some(vm.searchType, (data) => { return data.isSelect == false }))
                vm.isAll = false;
            else
                vm.isAll = true;

            vm.isAnySelected = _.some(vm.searchType, (data) => { return data.isSelect == true });
        }
        
        vm.search = () => {
            let selectedType = [];
                _.map(vm.searchType, (data) => {
                if (data.isSelect == true)
                    selectedType.push(data.code);
            });
            $mdDialog.cancel(selectedType);
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };
    }
})();