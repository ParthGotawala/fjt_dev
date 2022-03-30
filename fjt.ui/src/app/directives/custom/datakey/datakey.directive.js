(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('datakey', dataKeyDirective);

    /** @ngInject */
    function dataKeyDirective() {
        var directive = {
            restrict: 'E',
            scope: {
                keyValue: '=',
                datakeyForm: '='
            },
            templateUrl: 'app/directives/custom/datakey/datakey.html',
            controller: dataKeyCtrl,
            controllerAs: 'vm'
        };
        return directive;

        /** @ngInject */
        function dataKeyCtrl($scope, CORE, BaseService) {
            var vm = this;
            vm.dataKeyForm = $scope.datakeyForm;
            vm.commonNumberValueForCopy = {};
            vm.months = CORE.Month;
            // vm.FYMonth = '';
            vm.LabelConstant = CORE.LabelConstant;
            vm.inputControlName = CORE.LabelConstant.Datakey.DATAKEY_INPUTCONTROLNAME;
            vm.dataKeyValue = CORE.LabelConstant.Datakey.DATAKEY_LABEL.DATAKEY_VALUE;
            vm.dataKeyDescription = CORE.LabelConstant.Datakey.DATAKEY_LABEL.DATAKEY_DESCRIPTION;
            vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
            $scope.keys = $scope.keyValue;
            if($scope.keys.datakey === vm.LabelConstant.Datakey.DATAKEY_LABEL.CommonNumberFormat){
                if($scope.keyValue.datavalues){
                    try {
                        $scope.keys.datavalues = JSON.parse($scope.keyValue.datavalues);
                    }catch (ex) {

                    }
                }
            }
            if($scope.keys.datakey === vm.LabelConstant.Datakey.DATAKEY_LABEL.AccountingYear){
                if($scope.keyValue.datavalues){
                    try {
                        const selectedYear = JSON.parse($scope.keyValue.accountingYearValue);
                        if(selectedYear.Type.Value === vm.LabelConstant.Datakey.DATAKEY_LABEL.DATAKEY_AccountYear.FY){
                            $scope.keys.FYMonth = selectedYear.StartingMonth.Value;
                        }else{
                            $scope.keys.FYMonth = 1;
                        }
                    }catch (ex) {

                    }
                }
            }
            $scope.changeDataKey = () => {
                if($scope.keys.datavalues === vm.LabelConstant.Datakey.DATAKEY_LABEL.DATAKEY_AccountYear.CY){
                    $scope.keys.FYMonth = 1;
                }else{
                    $scope.keys.FYMonth = JSON.parse($scope.keyValue.accountingYearValue).StartingMonth.Value;
                }
            };
            if ($scope.keys.inputControlName === vm.LabelConstant.Datakey.DATAKEY_INPUTCONTROLNAME.TextBoxJsonViewer) {
                $scope.data = JSON.parse($scope.keys.datavalues);
            }
            vm.commonNumberValueForCopy = JSON.stringify($scope.keys.datavalues);

            vm.goToManagePersonal = (employeeId) => {
                BaseService.goToManagePersonnel(employeeId);
            };
        }
    }
})();