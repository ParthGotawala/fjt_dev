(function () {
    'use strict';

    angular
        .module('app.admin.rfqsetting')
        .controller('ImportLaborCostPopupController', ImportLaborCostPopupController);

    /** @ngInject */
    function ImportLaborCostPopupController($mdDialog, DialogFactory, data, CORE, BaseService, $timeout) {
        const vm = this;
        vm.laborCostHeaders = [];
        let excelHeaders = [];
        vm.excelHeaders = _.map(_.uniq(data.excelHeaders), (x) => { return { name: x }; });
        var laborCostHeaders = data.laborCostHeaders;
        /*Used to bind header data*/
        var defaultAutoCompleteHeader = {
            columnName: 'name',
            keyColumnName: 'name',
            keyColumnId: null,
            inputName: 'Column',
            placeholderName: 'Column',
            isRequired: false,
            isAddnew: false,
            callbackFn: null,
            onSelectCallbackFn: function (selectedItem) {
            }
        }
        /*Used to Add header of excel in header array*/
        _.each(laborCostHeaders, (item) => {
            var pricingItem = {
                header: item.Name
            };
            var autoCompleteHeader = angular.copy(defaultAutoCompleteHeader);
            autoCompleteHeader.isRequired = item.isRequired;
            var excelHeaderObj = vm.excelHeaders.find((x) => {
                return x.name.toUpperCase() == item.Display.toUpperCase();
            });
            autoCompleteHeader.keyColumnId = excelHeaderObj ? excelHeaderObj.name : null;
            pricingItem.autoCompleteHeader = autoCompleteHeader;
            pricingItem.isDisplay = item.isDisplay;
            pricingItem.Display = item.Display;
            pricingItem.InputId = item.Name;
            vm.laborCostHeaders.push(pricingItem);
        });        
        /*Used to close popup*/
        vm.cancel = () => {
            $mdDialog.cancel();
        };
        /*Used when Click on ok button*/
        vm.ok = ($event) => {
            //vm.frmLaborCostHeader
            if (vm.frmLaborCostHeader.$invalid) {
                BaseService.focusRequiredField(vm.frmLaborCostHeader);
                return;
            }
           
            var model = vm.laborCostHeaders.map((item) => {
                return {
                    header: item.header,
                    column: item.autoCompleteHeader.keyColumnId,
                }
            });
            var res = {
                model: model,
                excelHeaders: vm.excelHeaders
            }
            $mdDialog.hide(res);
        };
        $timeout(() => {
            setFocus("MountingTypeName");
        }, 1000);        
    }
})();