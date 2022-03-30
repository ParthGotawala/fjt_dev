(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('SaveDataElementListViewPopupController', SaveDataElementListViewPopupController);

    /** @ngInject */
    function SaveDataElementListViewPopupController($mdDialog, data, CORE, TRAVELER, WorkorderDataElementTransValueFactory, BaseService, WorkorderEquipmentDataElementTransValueFactory) {
        const vm = this;
        vm.isChecked = true;
        vm.Entity = CORE.Entity;
        vm.ALLEntities = CORE.AllEntityIDS;
        vm.data = data;
        vm.name = data.datalist ? (data.datalist.assetName ? data.datalist.assetName : (data.datalist.opName ? data.datalist.opName : null)) : null;
        vm.MainTitle = CORE.MainTitle;
        vm.dataElementList = [];
        vm.woEntityID = 0;

        /*To save other value detail
         Note:If any step added after other detail just remove function body and add logic of last step 
         */
        vm.fileList = {};
        vm.SaveDetailsForWoTransDataElement = () => {
            if (vm.dataElementForm.$invalid) {
                BaseService.focusRequiredField(vm.dataElementForm);
                return;
            }
            if (vm.MainTitle.OperationDataFields == vm.data.title) {
                let dynamicControlList = WorkorderDataElementTransValueFactory.getWorkorderTransDataElementList(vm.dataElementList);
                WorkorderDataElementTransValueFactory.saveTransctionValue({
                    woTransID: vm.data.woTransID,
                    woOPID: vm.data.woOpEmployeeDetails.workorderOperation.woOPID,
                    woID: vm.data.woOpEmployeeDetails.workorderOperation.woID,
                    entityID: vm.entityID,
                    employeeID: vm.data.employeeID,
                    woNumber: vm.data.woOpEmployeeDetails.workorderOperation.woNumber,
                    opName: vm.data.woOpEmployeeDetails.workorderOperation.opName,
                    dataElementList: dynamicControlList.dataElementList,
                    removeElementList: dynamicControlList.removeElementList,
                    subFormTransList: dynamicControlList.subFormTransList,
                    deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
                    removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
                }, vm.fileList).then((res) => {
                    $mdDialog.cancel();

                    // Display success message of each field if assigned on validation options
                    WorkorderDataElementTransValueFactory.displaySuccessMessage(dynamicControlList.dataElementList);

                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else if (vm.MainTitle.EquipmentDataFields == vm.data.title) {
                let dynamicControlList = WorkorderEquipmentDataElementTransValueFactory.getWorkorderTransDataElementList(vm.dataElementList);
                WorkorderEquipmentDataElementTransValueFactory.saveTransctionValue({
                    woTransID: vm.data.woTransID,
                    woOPID: vm.data.woOpEmployeeDetails.workorderOperation.woOPID,
                    woID: vm.data.woOpEmployeeDetails.workorderOperation.woID,
                    eqpID: vm.data.datalist.eqpID,
                    entityID: vm.entityID,
                    employeeID: vm.data.employeeID,
                    woNumber: vm.data.woOpEmployeeDetails.workorderOperation.woNumber,
                    opName: vm.data.woOpEmployeeDetails.workorderOperation.opName,
                    eqpName: vm.data.datalist.assetName,
                    dataElementList: dynamicControlList.dataElementList,
                    removeElementList: dynamicControlList.removeElementList,
                    subFormTransList: dynamicControlList.subFormTransList,
                    deletedsubFormTransIDs: dynamicControlList.deletedsubFormTransIDs,
                    removeSubFormTransListConditional: dynamicControlList.removeSubFormTransListConditional
                }, vm.fileList).then((res) => {
                    $mdDialog.cancel();
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else {
                $mdDialog.cancel();
            }
            //}
            //else {
            //    $mdDialog.cancel();
            //}
        };
        vm.cancel = () => {
            let isdirty = vm.checkFormDirty(vm.dataElementForm);
            if (isdirty) {
                BaseService.showWithoutSavingAlertForPopUp();
            } else {
                $mdDialog.cancel();
            }
        };

        vm.checkFormDirty = (form, columnName) => {
            let checkDirty = BaseService.checkFormDirty(form, columnName);
            return checkDirty;
        }
    }
})();