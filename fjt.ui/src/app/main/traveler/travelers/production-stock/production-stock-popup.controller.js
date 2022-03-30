(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductionStockPopupController', ProductionStockPopupController);

    /** @ngInject */
    function ProductionStockPopupController($mdDialog,$scope, data, WorkorderTransProductionFactory, DialogFactory, TRAVELER, CORE, BaseService) {
        const vm = this;
        vm.data = data;
        vm.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opData.opName, vm.data.opData.opNumber);     
        vm.ProductionList = [];
        vm.EmptyMesssage = TRAVELER.TRAVELER_EMPTYSTATE.ASSEMBLY_STOCK;
        vm.debounceConstant = CORE.Debounce;

        //if set pagination from controller set true to here
        vm.ispagination = true;
        vm.selectedItems = [];
        vm.query = {
            order: '',
            search: '',
            limit: !(vm.ispagination == undefined ? CORE.isPagination : vm.ispagination) ? '' : CORE.datalimit,
            page: 1,
            isPagination: vm.ispagination == undefined ? CORE.isPagination : vm.ispagination,
        };
        vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;

        vm.cancel = () => {
            $mdDialog.cancel();
        };
        vm.getProductionData = () => {
            let objs = {
                woTransID: vm.data.woOPCurrentHistory.woTransID
            }
            vm.cgBusyLoading = WorkorderTransProductionFactory.retrieveWorkorderTransactionDetails().query({ operationObj: objs }).$promise.then((productionData) => {
                vm.ProductionList = productionData.data;
                _.each(vm.ProductionList, (productionData) => {
                    productionData.employee.name = productionData.employee.firstName + ' ' + productionData.employee.lastName;
                })
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        vm.openAddProductionStock = (ev) => {
            let data = [];
            vm.data.isEdit = false;
            data = vm.data;
            DialogFactory.dialogService(
            TRAVELER.ADD_PRODUCTION_STOCK_MODAL_CONTROLLER,
            TRAVELER.ADD_PRODUCTION_STOCK_MODAL_VIEW,
            ev,
            data).then((result) => {
            }
            , (insertedData) => {
                vm.getProductionData();
            }, (error) => {
                return BaseService.getErrorLog(error);
            });
        };
        vm.getProductionData();

       
    }
})();