(function () {
    'use strict';

    angular.module('app.core')
        .controller('WidgetFilterExpressionPopupController', WidgetFilterExpressionPopupController);

    /* @ngInject */
    function WidgetFilterExpressionPopupController($mdDialog, $timeout, data, CORE, DialogFactory) {
        var vm = this;
        // all field list
        vm.axisList = data.axisList;
        var currentGrp = data.currentGrp;

        // set theme class dymanically on each popup element as theme is not apply on popup if opened from popup
        vm.themeClass = CORE.THEME;

        vm.Selected = { Expression: null, ExpressionVal: null };
        vm.AirthmeticAllOpertaor = CORE.AIRTHMETIC_ALL_OPERTAOR;
        vm.Datatypes = CORE.DATATYPE;
        vm.axisList = _.filter(vm.axisList, function (item) {
            return CORE.DATATYPE.NUMBER.indexOf(item.dataType) != -1;
        });
        vm.ExpressionData = [];
        vm.btnClicked = false;

        rebuildExpression();

        function rebuildExpression() {
            if (currentGrp.Selected.SelectedExpression && currentGrp.Selected.SelectedExpression.Expression) {
                vm.Selected.sourcefield = vm.axisList[0],
                vm.Selected.Expression = currentGrp.Selected.SelectedExpression.Expression;
                if (vm.Selected.Expression) {
                    var expressionData = vm.Selected.Expression.split(/[{?}]/);
                    angular.forEach(expressionData, function (value, key) {
                        if (value.trim() !== "") {
                            vm.ExistField = _.find(vm.axisList, function (field) { return field.field == value.trim(); });
                            if (vm.ExistField) {
                                vm.ExpressionData.push({ Name: value.trim(), value: value.trim(), type: 'field', visibleSpan: true, visibleText: false });
                            }
                            else {
                                var symbols = value.trim().split(' ');
                                if (symbols.length > 1) {
                                    angular.forEach(symbols, function (symbol, key) {
                                        if (symbol.trim() !== "") {
                                            if (!isNaN(parseFloat(symbol)) && isFinite(symbol))
                                                vm.ExpressionData.push({ Name: symbol.trim(), value: symbol.trim(), type: 'constant', visibleSpan: true, visibleText: false });
                                            else
                                                vm.ExpressionData.push({ Name: symbol.trim(), value: symbol.trim(), type: 'type', visibleSpan: true, visibleText: false });
                                        }
                                    });
                                }
                                else {
                                    if (!isNaN(parseFloat(value)) && isFinite(value))
                                        vm.ExpressionData.push({ Name: value.trim(), value: value.trim(), type: 'constant', visibleSpan: true, visibleText: false });
                                    else
                                        vm.ExpressionData.push({ Name: value.trim(), value: value.trim(), type: 'type', visibleSpan: true, visibleText: false });
                                }
                            }
                        }
                    });
                }
            }
        }

        vm.addSymbol = function (symbol) {
            vm.ExpressionData.push({ Name: symbol.Value, value: symbol.Value, type: 'type', visibleSpan: true, visibleText: false });
        };

        vm.addFieldToExpression = function (alias) {
            vm.ExpressionData.push({ Name: alias.field, value: alias.field, type: 'field', visibleSpan: true, visibleText: false });
            vm.autoCompleteXAxis.keyColumnId = null;
        };

        vm.addConstantToExpression = function (val) {
            vm.ExpressionData.push({ Name: val, value: val, type: 'constant', visibleSpan: true, visibleText: false });
            vm.constantVal = "";
        };

        vm.removeChoice = function (index) {
            vm.ExpressionData.splice(index, 1);
        };

        vm.autoCompleteXAxis = {
            columnName: 'displayName',
            keyColumnName: 'displayName',
            keyColumnId: 'field',
            inputName: 'Fields',
            placeholderName: 'Fields',
            isRequired: false,
            isAddnew: false,
            onSelectCallbackFn: function (selectedItem) {
                vm.selectedAxis = selectedItem;
            },
        }

        vm.submitForm = function () {

            vm.Selected.Expression = null;
            vm.Selected.ExpressionVal = null;

            angular.forEach(vm.ExpressionData, function (value, key) {
                vm.ExistField = _.find(vm.axisList, { field: value.Name });
                if (vm.ExistField) {
                    if (vm.Selected.Expression) {
                        vm.Selected.Expression += "{" + value.Name.toString().replace(/(\r\n|\n|\r)/gm, "") + "}";
                        vm.Selected.ExpressionVal += "{" + value.value.toString().replace(/(\r\n|\n|\r)/gm, "") + "}";
                    }
                    else {
                        vm.Selected.Expression = "{" + value.Name.toString().replace(/(\r\n|\n|\r)/gm, "") + "}";
                        vm.Selected.ExpressionVal = "{" + value.value.toString().replace(/(\r\n|\n|\r)/gm, "") + "}";
                    }
                }
                else {
                    if (vm.Selected.Expression) {
                        vm.Selected.Expression += " " + value.Name + " ";
                        vm.Selected.ExpressionVal += " " + value.value + " ";
                    }
                    else {
                        vm.Selected.Expression = value.Name;
                        vm.Selected.ExpressionVal = value.value;
                    }
                }
            });

            // add static value 1 to each fields
            var expression = vm.Selected.Expression.replace(/\{.*?\}/g, "(1)");
            // test expression
            try {
                eval(expression);
            }
            catch (e) {
                openInvaliExpDialog();
                return;
            }

            var IsValidExp = true;
            // get all fields and if not found in list then display invalid expression dialog
            var fieldList = _.uniq(vm.Selected.Expression.match(/{.*?}/g), function (val) { return val.replace(/[{}]/g, ''); });
            if (fieldList) {
                angular.forEach(fieldList, function (value, key) {
                    vm.ExistField = _.find(vm.axisList, function (field) { return field.field == value.replace(/[{}]/g, ''); });
                    if (!vm.ExistField) {
                        openInvaliExpDialog();
                        IsValidExp = false;
                        return;
                    }
                });
            }
            else {
                openInvaliExpDialog();
                IsValidExp = false;
                return;
            }

            if (!IsValidExp)
                return;
            
            $mdDialog.hide(vm.Selected);
        };

      function openInvaliExpDialog() {        
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_EXPRESSION);
        let model = {
          messageContent: messageContent,
          multiple: true
        };            
            DialogFactory.messageAlertDialog(model);
        }
     
        vm.cancel = function () {
            $mdDialog.cancel();
        }
    }
})();
