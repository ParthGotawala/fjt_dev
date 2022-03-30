(function () {
    'use strict';

    angular
        .module('app.rfqtransaction')
        .controller('BOMAdditonalColumnConfigurationPopupController', BOMAdditonalColumnConfigurationPopupController);

    /** @ngInject */
    function BOMAdditonalColumnConfigurationPopupController($mdDialog, $scope, $timeout, $filter, $q, CORE, USER, data, BaseService, CustomerConfirmationPopupFactory, DialogFactory, RFQTRANSACTION) {

        const vm = this;
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CUSTOMER_CONFIRMATION;

        vm.customerConfirmationModel = {};
        var rfqAssyID = data.rfqAssyID;
        var partID = data.partID;
        $scope.supported = false;

        init();

        function init() {
            vm.cgBusyLoading = CustomerConfirmationPopupFactory.getRfqAdditionalColumnList().query({ id: data.partID }).$promise.then((res) => {
                if (res && res.data) {
                    vm.headerList = res.data;
                    _.each(vm.headerList, function (item) {
                        if (item.isConfigured)
                            item.isConfigured = true;
                        else
                            item.isConfigured = false;
                    });
                    vm.selectionChange();
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }


        vm.save = () => {
            _.each(vm.headerList, function (item) {
                if (item.isConfigured)
                    item.refComponentID = data.partID;
                else
                    item.refComponentID = null;
            });

            var model = {
                partID: data.partID,
                headerList: vm.headerList
            };

            vm.cgBusyLoading = CustomerConfirmationPopupFactory.saveRfqAdditionalColumnList().save(model).$promise.then((response) => {
                if (response) {
                    $mdDialog.hide();
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.AdditionalFieldConfigurationForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        };
        vm.selectAllChange = () => {
            _.each(vm.headerList, function (item) { item.isConfigured = vm.isAllConfigured; });
        };

        vm.selectionChange = () => {
            var selectedCount = _.filter(vm.headerList, function (item) { if (item.isConfigured) return item; });
            if (selectedCount.length == vm.headerList.length)
                vm.isAllConfigured = true;
            else
                vm.isAllConfigured = false;
        };
        
    }

})();