(function () {
    'use strict';

    angular
        .module('app.configuration.dataelement')
        .controller('DataelementValidationPopupController', DataelementValidationPopupController);

    /* @ngInject */
    function DataelementValidationPopupController($mdDialog, data, $timeout, $filter, DialogFactory, CORE, BaseService) {
        var vm = this;

        vm.OperatorFilterType = CORE.OPERATOR_FILTER_TYPE;
        vm.OperationTimePattern = CORE.OperationTimePattern;
        vm.OperationTimeMask = CORE.OperationTimeMask;

        vm.conditionArr = CORE.CONDITIONS;
        vm.OptionTypeArr = angular.copy(CORE.OPTIONTYPES_JS_EXP);
        vm.booleanList = CORE.BOOLEANLIST;
        vm.datatypes = CORE.DATATYPE;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
        vm.NumberOperator = CORE.DATE_AND_NUMBER_OPERATOR.filter((x) => { return ['Is Null', 'Is Not Null'].indexOf(x.Name) == -1; });
        vm.DateOperator = CORE.DATE_OPERATOR.filter((x) => { return ['Is Null', 'Is Not Null'].indexOf(x.Name) == -1; });
        vm.TextOperator = CORE.TEXT_OPERATOR.filter((x) => { return ['Is Null', 'Is Not Null'].indexOf(x.Name) == -1; });
        vm.BooleanOperator = CORE.BOOLEAN_OPERATOR.filter((x) => { return ['Is Null', 'Is Not Null'].indexOf(x.Name) == -1; });
        vm.ignoreValueField = ["= {SYS_DATE}",
            "<> {SYS_DATE}",
            "> {SYS_DATE}",
            "< {SYS_DATE}",
            ">= {SYS_DATE}",
            "<= {SYS_DATE}"];

        var symbol = CORE.SYMBOL;
        vm.headerdata = [
            { label: "Field Name", value: data.dataElementName, displayOrder: 1 }
        ];

        vm.filterData = data.filterData;

        var controlTypeID = data.controlTypeID;
        vm.dateTimeType = data.dateTimeType;
        vm.isEntity = data.isEntity;
        vm.dateformatMask = _dateDisplayFormat.toUpperCase() + ' ' + _timeDisplayFormat;

        vm.todayDate = new Date();

        vm.DateOptions = {
            appendToBody: true
        };
        vm.dateTimeOptions = {
            appendToBody: true
        };

        let isInvaliExpDialogCalled = false;
        var dataType = null;

        if (controlTypeID == CORE.InputeFieldKeys.Textbox) {
            dataType = "varchar";
            vm.OptionTypeArr.splice(1, 1);
        }
        else if (controlTypeID == CORE.InputeFieldKeys.Numberbox) {
            dataType = "int";
        }
        else if (controlTypeID == CORE.InputeFieldKeys.DateTime) {
            switch (vm.dateTimeType + '') {
                case "0":
                default: {
                    dataType = "datetime";
                    break;
                }
                case "1": {
                    dataType = "date";
                    break;
                }
                case "2": {
                    dataType = "time";
                    break;
                }
            }

            vm.OptionTypeArr.splice(1, 1);
        }

        vm.columnList = [{
            Column_name: 'Value', Data_Type: dataType
        }]

        vm.clickOperatorCmb = clickOperatorCmb;
        var bigintDataType = 'bigint';

        if (vm.filterData) {
            var filterData = [];
            var result = vm.filterData[0].Nodes;
            setValueInExpreesionTree(result);
            filterData.push(result);
        }
        else
            resetFilterData();

        /* for down arrow key open datepicker */
        vm.locale = {
            formatDate: function (date) {
                return $filter('date')(date, _dateDisplayFormat);
            }
        };

        vm.DATE_PICKER = CORE.DATE_PICKER;

        vm.openPicker = (item, ev) => {
            if (ev.keyCode == 40) {
                item.isDatePickerOpen = true;
            }
        };

        /* for down arrow key open datepicker */

        // rebuild each expressions
        function setValueInExpreesionTree(nodes) {
            nodes.forEach((element) => {
                if (element && element.ExpressionLevel) {
                    if (element.Selected.FieldName) {
                        var fieldDet = _.find(vm.columnList, function (field) { return field.Column_name == element.Selected.FieldName.Column_name; });
                        element.Selected = {};
                        element.Selected.FieldName = fieldDet;
                        bindOperatorDetails(element);
                        element.Selected.OptionType = vm.OptionTypeArr[0];
                    }
                    else {
                        element.datatype = bigintDataType;
                        element.OperatorValue = element.OperatorValue != null ? parseInt(element.OperatorValue) : "";
                        element.Selected = {};
                        element.Selected.SelectedExpression = element.SelectedExpression;
                        bindOperatorDetails(element);
                        element.Selected.OptionType = vm.OptionTypeArr[1];
                    }

                    element.autoCompleteXAxis = {
                        columnName: 'Column_name',
                        keyColumnName: 'Column_name',
                        keyColumnId: element.Selected.FieldName ? element.Selected.FieldName.Column_name : vm.columnList[0].Column_name,
                        inputName: 'Fields',
                        placeholderName: 'Fields',
                        isRequired: true,
                        isAddnew: false,
                        isDisabled: true,
                        onSelectCallbackFn: changeField,
                        callbackFnParam: element
                    };

                }

                if (element && element.Nodes) {
                    result = setValueInExpreesionTree(element.Nodes);
                    return result;
                }
            });
        }

        function bindOperatorDetails(element) {
            clickOperatorCmb(element);

            var opDet = null;
            if (vm.datatypes.NUMBER.indexOf(element.datatype) != -1) {
                opDet = _.find(vm.NumberOperator, function (item) { return item.Value == element.Operator; });
            }
            else if (vm.datatypes.STRING.indexOf(element.datatype) != -1) {
                opDet = _.find(vm.TextOperator, function (item) { return item.Value == element.Operator; });
            }
            else if (vm.datatypes.DATE.indexOf(element.datatype) != -1) {
                opDet = _.find(vm.DateOperator, function (item) { return item.Value == element.Operator; });
            }
            else if (vm.datatypes.TIME.indexOf(element.datatype) != -1) {
                opDet = _.find(vm.DateOperator, function (item) { return item.Value == element.Operator; });
            }
            else {
                opDet = _.find(vm.BooleanOperator, function (item) { return item.Value == element.Operator; });
                element.Selected.BooleanVal = _.find(vm.booleanList, function (item) { return item.Value == element.OperatorValue; });
            }
            element.Selected.Operator = opDet;
        }

        function resetFilterData() {
            var filterData = [];
            var defaultGrp = { GroupLevel: "1", ParentGroupLevel: null, SubLevel: 1, Condition: 'AND', Nodes: [] };
            filterData.push(defaultGrp);
            vm.filterData = filterData;
        };

        vm.openExpression = function (currentGrp) {
            vm.Selected = {};
            vm.Selected.Operator = null;
            vm.Selected.FieldName = null;
            var maxLevel = _.max(currentGrp.Nodes, 'ExpressionLevel') || {};
            vm.maxGrpLevel = maxLevel.ExpressionLevel;
            if (vm.maxGrpLevel)
                vm.maxGrpLevel = vm.maxGrpLevel + 1;
            else
                vm.maxGrpLevel = 1;
            var newExp = {
                GroupLevel: currentGrp.GroupLevel,
                ExpressionLevel: vm.maxGrpLevel,
                Operator: "",
                DisplayOperator: "",
                OperatorValue: "",
                Selected: angular.copy(vm.Selected),
                datatype: null
            };

            newExp.autoCompleteXAxis = {
                columnName: 'Column_name',
                keyColumnName: 'Column_name',
                keyColumnId: vm.columnList[0].Column_name,
                inputName: 'Fields',
                placeholderName: 'Fields',
                isRequired: true,
                isAddnew: false,
                isDisabled: true,
                onSelectCallbackFn: changeField,
                callbackFnParam: newExp
            };

            currentGrp.Nodes.push(newExp);
        };

        vm.changeOperatorType = function (item) {
            if (item.Selected.SelectedExpression) {
                let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                messageContent.messsage = stringFormat(messageContent.message, "Expression");
                let obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(obj).then((response) => {
                    if (response) {
                        item.Selected.SelectedExpression = null;
                    }
                },(cancel) => {
                    item.Selected.OptionType = vm.OptionTypeArr[1];
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }
            else if (item.Selected.OptionType == vm.OptionTypeArr[1]) {
                switchToExpression(item);
            }
            //else {
            //    changeField(item);
            //}
        };

        function switchToExpression(nodeObj) {
            nodeObj.DisplayOperator = null;
            nodeObj.Operator = null;
            nodeObj.OperatorFilterType = null;
            nodeObj.OperatorValue = null;
            nodeObj.datatype = null;

            nodeObj.Selected.FieldName = null;
            nodeObj.Selected.Operator = null;

            vm.addExpression(nodeObj);
        }

        function clickOperatorCmb(currentGrp) {
            if (currentGrp.Selected) {
                if (currentGrp.Selected.SelectedExpression && currentGrp.Selected.SelectedExpression.Expression) {
                    currentGrp.datatype = bigintDataType;
                } else {
                    if (currentGrp.Selected.FieldName.Data_Type) {
                        currentGrp.datatype = currentGrp.Selected.FieldName.Data_Type;
                    }
                }
            }
        };

        vm.changeOperatorVal = function (item) {
            if (vm.ignoreValueField.indexOf(item.Selected.Operator.Value) != -1) {
                item.OperatorValue = null;
                item.Selected.BooleanVal = null;
            }
        }

        vm.clickBooleanType = function (item) {
            item.OperatorValue = item.Selected.BooleanVal.Value;
        }

        function changeField(selectedItem, currentGrp) {
            // same values if automatically this Fn called while autocomplete initialize
            if (selectedItem == currentGrp.Selected.FieldName) return;

            currentGrp.Selected.FieldName = selectedItem;

            currentGrp.OperatorValue = null;
            currentGrp.Operator = null;
            currentGrp.Selected.Operator = null;
            currentGrp.datatype = null;
            currentGrp.OperatorFilterType = null;

            if (selectedItem) {
                currentGrp.datatype = currentGrp.Selected.FieldName.Data_Type;

                if (vm.datatypes.NUMBER.indexOf(currentGrp.datatype) != -1) {
                    currentGrp.OperatorFilterType = vm.OperatorFilterType.NUMBER_OPERATOR;
                }
                else if (vm.datatypes.STRING.indexOf(currentGrp.datatype) != -1) {
                    currentGrp.OperatorFilterType = vm.OperatorFilterType.TEXT_OPERATOR;
                }
                else if (vm.datatypes.DATE.indexOf(currentGrp.datatype) != -1) {
                    currentGrp.OperatorFilterType = vm.OperatorFilterType.DATE_OPERATOR;
                }
                else if (vm.datatypes.TIME.indexOf(currentGrp.datatype) != -1) {
                    currentGrp.OperatorFilterType = vm.OperatorFilterType.DATE_OPERATOR;
                }
                else {
                    currentGrp.OperatorFilterType = vm.OperatorFilterType.BOOLEAN_OPERATOR;
                }
            }
        };

        vm.addExpression = function (currentGrp,ev) {

            var data = {
                columnList: vm.columnList,
                currentGrp: currentGrp
            };

            DialogFactory.dialogService(
               CORE.DATAELEMENT_VALIDATION_EXPRESSION_MODAL_CONTROLLER,
               CORE.DATAELEMENT_VALIDATION_EXPRESSION_MODAL_VIEW,
               ev,
               data).then((response) => {
                   if (response) {
                       currentGrp.Selected.SelectedExpression = response;
                       currentGrp.OperatorFilterType = vm.OperatorFilterType.NUMBER_OPERATOR;
                   }
               }, (response) => {
                   /* empty */
               }, (err) => {
                   return BaseService.getErrorLog(err);
               });
        };

        vm.openGroup = function (currentGrp) {
            var currentGrpLevel = currentGrp.GroupLevel + '_' + currentGrp.SubLevel;
            var newGrp = {
                GroupLevel: currentGrpLevel.toString(),
                ParentGroupLevel: currentGrp.GroupLevel,
                SubLevel: 1,
                Condition: 'AND',
                Nodes: []
            };
            currentGrp.Nodes.push(newGrp);
            currentGrp.SubLevel = currentGrp.SubLevel + 1;
        };

        vm.deleteGroup = function (currentGrp) {
            if (currentGrp.ParentGroupLevel) {
                var parentNode = searchTree(vm.filterData[0], currentGrp.ParentGroupLevel);
                parentNode.Nodes = _.without(parentNode.Nodes, currentGrp);
            }
            currentGrp.Nodes = [];
        };

        vm.deleteExpression = function (currentGrp) {
            var parentNode = searchTree(vm.filterData[0], currentGrp.GroupLevel);
            parentNode.Nodes = _.without(parentNode.Nodes, currentGrp);
        };

        function searchTree(element, groupLevel) {
            if (element.GroupLevel == groupLevel)
                return element;
            else if (element.Nodes) {
                var i;
                var result = null;
                for (i = 0; result === null && i < element.Nodes.length; i++) {
                    result = searchTree(element.Nodes[i], groupLevel);
                }
                return result;
            }
            return null;
        }

        var list = null;
        function initializeList() {
            list = { elements: [], expressionLists: [] };
        }

        function searchTreeForSave(element) {
            if (element) {
                if (element.ExpressionLevel) {
                    if (element.Selected.Operator) {
                        if (element.Selected.SelectedExpression) {
                            element.SelectedExpression = element.Selected.SelectedExpression;
                        }
                        element.Operator = element.Selected.Operator.Value;
                        element.DisplayOperator = element.Selected.Operator.Name;
                    }
                    element.OperatorValue = element.OperatorValue === "" ? null : element.OperatorValue;
                    list.expressionLists.push(element);
                    list.elements.push(element);
                }

                if (element.Nodes !== undefined && element.Nodes !== null) {
                    var i;
                    var result = null;
                    for (i = 0; i < element.Nodes.length; i++) {
                        result = searchTreeForSave(element.Nodes[i]);
                    }
                }
            }
            return list;
        }

        function calculateAndSaveExpression() {
            initializeList();
            var data = searchTreeForSave(vm.filterData[0]);
            vm.expressionLists = data.expressionLists;

            var ValidExpression = false;
            if (vm.expressionLists.length == 0) {
                ValidExpression = false;
            } else {
                ValidExpression = checkValidExpression();
            }
            return ValidExpression;
        }

        function checkValidExpression() {
            var ValidExpression = true;
            var validOperators = [
                symbol.LESS_THAN_SYMBOL,
                symbol.GREATER_THAN_SYMBOL,
                symbol.GREATER_THAN_OR_EQUAL_SYMBOL,
                symbol.LESS_THAN_OR_EQUAL_SYMBOL,
                symbol.LIKE,
                symbol.START_WITH,
                symbol.END_WITH,
                symbol.EQUAL_TO_SYMBOL,
                symbol.NOT_LIKE,
                symbol.NOT_EQUAL_TO_SYMBOL
            ];

            for (var i = 0, len = vm.expressionLists.length; i < len; i++) {
                if (vm.expressionLists[i].Operator === '' || vm.expressionLists[i].Operator === null || vm.expressionLists[i].ChannelID === '') {

                    openInvaliExpDialog();
                    ValidExpression = false;
                    break;
                }

                if (validOperators.indexOf(vm.expressionLists[i].Operator) != -1
                    && (vm.expressionLists[i].OperatorValue === '' || vm.expressionLists[i].OperatorValue === null)) {

                    openInvaliExpDialog();
                    ValidExpression = false;
                    break;
                }
            }
            return ValidExpression;
        }

        function validateExpression(data, isValid) {
            _.each(data.Nodes, function (item) {
                if (item.Selected && item.Selected.Operator != null) {
                    if (isValid)
                        isValid = true;
                }
                else if (item.Nodes) {
                    validateExpression(item, isValid);
                }
                else {
                    if (!item.Condition || !item.Condition.Nodes)
                        isValid = false;
                }
            });
        }

        vm.SubmitForm = function () {
            var isValid = true;
            _.each(vm.filterData, function (data) {
                validateExpression(data, isValid);
            });

            if (isValid) {
                var isValid = calculateAndSaveExpression();

                if (isValid) {
                    _.each(vm.filterData, function (data) {
                        removeAutocompleteObj(data);
                    });
                    $mdDialog.hide(vm.filterData);
                } else {
                    if (!isInvaliExpDialogCalled) {
                        $mdDialog.hide(vm.filterData);
                    }
                    isInvaliExpDialogCalled = false;
                }
            }
            else {
                openInvaliExpDialog();
            }
        }

        function removeAutocompleteObj(data) {
            _.each(data.Nodes, function (item) {
                delete item.autoCompleteXAxis;
                if (item.Nodes)
                    removeAutocompleteObj(item);
            });
        }

        function openInvaliExpDialog() {
            isInvaliExpDialogCalled = true;
            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_EXPRESSION);
            var model = {
                messageContent: messageContent,
                multiple: true
            };
            DialogFactory.messageAlertDialog(model);
        }

        vm.cancel = function () {
            $mdDialog.cancel();
        }
        /* called for max date validation */
        vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => {
            return BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);
        }
        /* called for min date validation */
        vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => {
            return BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);
        }
    }
})();
