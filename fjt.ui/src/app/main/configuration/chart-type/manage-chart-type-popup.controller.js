(function () {
    'use strict';
    angular
        .module('app.configuration.charttype')
        .controller('ManageChartTypesPopupController', ManageChartTypesPopupController);
    /** @ngInject */
    function ManageChartTypesPopupController($mdDialog, data, CORE, ChartTypeFactory, BaseService) {
        const vm = this;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.taToolbar = CORE.Toolbar;
       

        vm.chartTypeModel = {
            name: null,
            iconClass: null,
            isActive: true,
        };
        if (data && data.chartTypeID) {
            vm.chartTypeModel.chartTypeID = data.chartTypeID;
        }
        if (vm.chartTypeModel.chartTypeID) {
            vm.cgBusyLoading = ChartTypeFactory.retriveChartType().query({
                chartTypeID: vm.chartTypeModel.chartTypeID
            }).$promise.then((response) => {
                if (response && response.data) {
                    vm.chartTypeModel.name = response.data.name;
                    vm.chartTypeModel.iconClass = response.data.iconClass;
                    vm.chartTypeModel.isActive = response.data.isActive ? response.data.isActive : false;
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.saveChartType = () => {
            ChartTypeFactory.chartType().save(vm.chartTypeModel).$promise.then((res) => {
                if (res.data) {
                    if (res.data.chartTypeID) {
                        $mdDialog.cancel(res.data);
                    }
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        };

        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.AddChartTypesForm);
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
    }
})();