(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ShowListViewPopupController', ShowListViewPopupController);

    /** @ngInject */
    function ShowListViewPopupController($mdDialog, data, CORE, TRAVELER, $timeout, BaseService, DialogFactory) {
        const vm = this;
        vm.isChecked = true;
        vm.ALLEntities = CORE.AllEntityIDS;
        vm.LabelConstant = angular.copy(CORE.LabelConstant);
        vm.OperationTimePattern = CORE.OperationTimePattern;
        vm.OperationTimeMask = CORE.OperationTimeMask;
        vm.Workorder_operationEntity = vm.ALLEntities.Workorder_operation.Name;
        vm.workorder_Entity = vm.ALLEntities.Workorder.Name;
        vm.operation_Entity = vm.ALLEntities.Operation.Name;
        vm.data = data;
        vm.MainTitle = CORE.MainTitle;
        vm.dataElementList = [];
        vm.id = vm.data.woOpEmployeeDetails.workorderOperation.woOPID;
        vm.entity = vm.Workorder_operationEntity;
        vm.cancel = () => {
            $mdDialog.cancel();
        };

        /*Move to equipment page*/
        vm.goToManageEquipmentWorkstation = (equip) => {
            BaseService.goToManageEquipmentWorkstation(equip.eqpID);
        }

        /*Show All*/
        vm.ShowAllForDataElement = (title, datalist, object, ev) => {
            let obj = {
                title: title,
                datalist: object,
                woOpEmployeeDetails: vm.data.woOpEmployeeDetails,
                woTransID: vm.data.woTransID,
            }
            let data = obj;
            DialogFactory.dialogService(
            CORE.SAVE_DATAELEMENT_LIST_MODAL_CONTROLLER,
            CORE.SAVE_DATAELEMENT_LIST_MODAL_VIEW,
            ev,
            data).then(() => {
            }, (res) => {
                if (obj.title == vm.MainTitle.OperationDataFields) {
                    vm.showOperationFields = false;
                }
            }, (error) => {

            }).finally(() => {
                /* for updating op data element latest value , call directive*/
                if (obj.title == vm.MainTitle.OperationDataFields) {
                    $timeout(function () {
                        vm.showOperationFields = true;
                    }, 0);
                }
            });
        };


        // [S] View Operation Equipments Field History
        vm.ViewOperationEquipmentFieldsHistory = (title, equipment, ev) => {
            ev.stopPropagation();
            let obj = {
                title: title,
                name: equipment.eqpMake + " | " + equipment.eqpModel + " | " + equipment.eqpYear,
                opData: vm.data.woOpEmployeeDetails.workorderOperation,
                equipment: equipment,
                woNumber: vm.data.woOpEmployeeDetails.workorderOperation.woNumber,
            }
            let data = obj;
            $timeout(function () {
                DialogFactory.dialogService(
                    CORE.WORKORDER_OPERATION_EQUIPMENT_FIELDS_HISTORY_MODAL_CONTROLLER,
                    CORE.WORKORDER_OPERATION_EQUIPMENT_FIELDS_HISTORY_MODAL_VIEW,
                    ev,
                    data).then(() => {
                    }, (val) => {
                    }, (error) => {
                        return BaseService.getErrorLog(error);
                    });
            });
        }
        // [E] View Operation Equipments Field History
    }
})();