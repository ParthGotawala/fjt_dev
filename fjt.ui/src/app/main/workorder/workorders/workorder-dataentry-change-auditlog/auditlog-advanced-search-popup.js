(function () {
    'use strict';

    angular
        .module('app.workorder.workorders')
        .controller('AuditlogAdvancedSearchPopupController', AuditlogAdvancedSearchPopupController);

    function AuditlogAdvancedSearchPopupController($mdDialog, data, CORE, BaseService, WorkorderFactory) {
        const vm = this;
        var woID = data.woID;

        var advanceSearch = angular.copy(data.advanceSearch);
        vm.advanceSearchModel = null;
        vm.filterType = advanceSearch && advanceSearch.woOPID ? 'operation' : 'workorder';

        if (advanceSearch) {
            vm.advanceSearchModel = {
                woOPID: advanceSearch.woOPID,
                fromWOVersion: advanceSearch.fromWOVersion,
                toWOVersion: advanceSearch.toWOVersion,
                fromOPVersion: advanceSearch.fromOPVersion,
                toOPVersion: advanceSearch.toOPVersion
            };
        }

        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

        init();
        vm.operationList = [];
        function init() {
            return getOperationList().then((data) => {
                initAutoComplete();
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        function getOperationList() {
            return WorkorderFactory.getWorkorderOperationList().query({ woID: woID }).$promise.then((response) => {
                if (response && response.data) {
                    var operations = response.data.workorderOperation;
                    operations.forEach(function (item) {
                        vm.operationList.push({
                            woOPID: item.woOPID,
                            opFullName: operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber)
                        });
                    });
                    vm.operationList;
                }
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }

        // initalize autocomplete for operation
        let initAutoComplete = () => {
            vm.autoCompleteOperation = {
                columnName: 'opFullName',
                keyColumnName: 'woOPID',
                keyColumnId: vm.advanceSearchModel ? vm.advanceSearchModel.woOPID : null,
                inputName: 'Operation',
                placeholderName: 'Operation',
                isRequired: false,
                isAddnew: false,
                callbackFn: init,
                onSelectCallbackFn: function (selectedItem) {
                    if (!selectedItem && vm.advanceSearchModel) {
                        vm.advanceSearchModel.fromOPVersion = null;
                        vm.advanceSearchModel.toOPVersion = null;
                    }
                }
            }
        };

        // on click of search button
        vm.search = () => {
            if(vm.adSearchForm.$invalid){
                BaseService.focusRequiredField(vm.adSearchForm);
                return;
            }
            if (vm.filterType == 'workorder') {
                vm.advanceSearchModel.woOPID = null;
                vm.advanceSearchModel.fromOPVersion = null;
                vm.advanceSearchModel.toOPVersion = null;
            }
            else {
                vm.advanceSearchModel.fromWOVersion = null;
                vm.advanceSearchModel.toWOVersion = null;
                vm.advanceSearchModel.woOPID = vm.autoCompleteOperation.keyColumnId;
            }

            $mdDialog.hide(vm.advanceSearchModel);
        }

        vm.cancel = () => {
            $mdDialog.cancel();
        };
        /** Validate max size */
        vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
            return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
        };
    }
})();