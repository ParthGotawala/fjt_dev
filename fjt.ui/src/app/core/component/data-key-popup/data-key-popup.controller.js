(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('DataKeyPopupController', DataKeyPopupController);
    /** @ngInject */
    function DataKeyPopupController($scope, $mdDialog, DialogFactory, CORE, data, SettingsFactory, BaseService) {
        const vm = this;

        vm.datakeylables = CORE.LabelConstant.Datakey.DATAKEY_LABEL;
        vm.keyvalue = data;
        vm.oldvalue = vm.keyvalue.datavalues;
        /* To close dialog */
        $scope.closeDialog = () => {
            const isdirty = vm.checkFormDirty(vm.dataKeyPopupForm);
            if (isdirty) {
              BaseService.showWithoutSavingAlertForPopUp();
            } else {
              $mdDialog.cancel();
            }
        };
        vm.checkFormDirty = (form) => {
            const checkDirty = form.$dirty;
            return checkDirty;
        };

       /* To update or save datakey value */
        vm.saveDataKey = (datakeyupdate, isexit) => {
            if(isexit){
                const isdirty = vm.checkFormDirty(vm.dataKeyPopupForm);
                if (!isdirty) {
                    $mdDialog.cancel();
                    if (BaseService.focusRequiredField(vm.dataKeyPopupForm)) {
                        return;
                    }
                }
            }else{
                const isdirty = vm.checkFormDirty(vm.dataKeyPopupForm);
                if (!isdirty) {
                    if (BaseService.focusRequiredField(vm.dataKeyPopupForm)) {
                        return;
                    }
                }
            }
            let updateObj = {};
            if(datakeyupdate.datakey === vm.datakeylables.CommonNumberFormat){
                updateObj = JSON.stringify(datakeyupdate.datavalues);
            }else{
                updateObj = datakeyupdate.datavalues;
            }
            if(datakeyupdate.datakey === vm.datakeylables.AccountingYear){
                const data = {
                    Type:
                    {
                        ControlName: 'Dropdown',
                        Value: datakeyupdate.datavalues
                    },
                    StartingMonth:
                    {
                        ControlName: 'Dropdown',
                        Value: ''
                    }
                };
                if(datakeyupdate.datavalues === vm.datakeylables.DATAKEY_AccountYear.CY){
                    data.StartingMonth.Value = '1';
                }else{
                    data.StartingMonth.Value = datakeyupdate.FYMonth;
                }
                updateObj = JSON.stringify(data);
            }
            if(vm.dataKeyPopupForm.$valid){
                if (datakeyupdate && datakeyupdate.datavalues) {
                    const settingsInfo = {
                        values: updateObj
                    };
                    vm.cgBusyLoading = SettingsFactory.settings().update({
                        id: datakeyupdate.id
                    }, settingsInfo).$promise.then((res) => {
                        datakeyupdate.datachange = false;
                        if (isexit) {
                            $mdDialog.hide();
                        }
                        if (res.data) {
                            vm.oldvalue = vm.keyvalue.datavalues;
                        }
                    }).catch((error) => BaseService.getErrorLog(error));
                }
            }
        };
    }
})();
