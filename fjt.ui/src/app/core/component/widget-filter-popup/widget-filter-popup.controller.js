(function () {
  'use strict';

  angular.module('app.core')
    .controller('WidgetFilterPopupController', WidgetFilterPopupController);


  /* @ngInject */
  function WidgetFilterPopupController($mdDialog, data, $timeout, $filter, DialogFactory, CORE, BaseService) {
    var vm = this;

    vm.axisList = data.axisList;
    vm.numericAxisList = _.filter(vm.axisList, function (item) {
      return CORE.DATATYPE.NUMBER.indexOf(item.dataType) != -1;
    });
    vm.Operators = CORE.ALL_OPERATOR;
    vm.OperatorFilterType = CORE.OPERATOR_FILTER_TYPE;
    vm.OperationTimePattern = CORE.OperationTimePattern;
    vm.OperationTimeMask = CORE.OperationTimeMask;

    vm.conditionArr = CORE.CONDITIONS;
    vm.OptionTypeArr = CORE.OPTIONTYPES;
    vm.booleanList = CORE.BOOLEANLIST;
    vm.datatypes = CORE.DATATYPE;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.DateAndNumberOperator = CORE.DATE_AND_NUMBER_OPERATOR;
    vm.TextOperator = CORE.TEXT_OPERATOR;
    vm.BooleanOperator = CORE.BOOLEAN_OPERATOR;
    var symbol = CORE.SYMBOL;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();

    vm.filterData = data.filterData;

    vm.clickOperatorCmb = clickOperatorCmb;
    var bigintDataType = 'bigint';

    vm.todayDate = new Date();

    vm.DateOptions = {
      appendToBody: true
    };
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
        return $filter('date')(date, vm.DefaultDateFormat);
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
            var fieldDet = _.find(vm.axisList, function (field) { return field.field == element.Selected.FieldName.field; });
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
            columnName: 'displayName',
            keyColumnName: 'field',
            keyColumnId: element.Selected.FieldName ? element.Selected.FieldName.field : 'field',
            inputName: 'Fields',
            placeholderName: 'Fields',
            isRequired: true,
            isAddnew: false,
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
        opDet = _.find(vm.DateAndNumberOperator, function (item) { return item.Value == element.Operator; });
      }
      else if (vm.datatypes.STRING.indexOf(element.datatype) != -1) {
        opDet = _.find(vm.TextOperator, function (item) { return item.Value == element.Operator; });
      }
      else if (vm.datatypes.DATE.indexOf(element.datatype) != -1) {
        opDet = _.find(vm.DateAndNumberOperator, function (item) { return item.Value == element.Operator; });
      }
      else if (vm.datatypes.TIME.indexOf(element.datatype) != -1) {
        opDet = _.find(vm.DateAndNumberOperator, function (item) { return item.Value == element.Operator; });
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
        columnName: 'displayName',
        keyColumnName: 'field',
        keyColumnId: 'field',
        inputName: 'Fields',
        placeholderName: 'Fields',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: changeField,
        callbackFnParam: newExp
      };

      currentGrp.Nodes.push(newExp);
    };

    vm.changeOperatorType = function (item) {
      if (item.Selected.SelectedExpression) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, "Expression", '');
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((response) => {
          if (response) {
            item.Selected.SelectedExpression = null;
          }
        }, (cancel) => {
          item.Selected.OptionType = vm.OptionTypeArr[1];
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        if (item.Selected.OptionType == vm.OptionTypeArr[1] && (!item.Selected.SelectedExpression || !item.Selected.SelectedExpression.Expression)) {
          switchToExpression(item);
        }
      }
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
          if (currentGrp.Selected.FieldName.dataType) {
            currentGrp.datatype = currentGrp.Selected.FieldName.dataType;
          }
        }
      }
    };

    vm.changeOperatorVal = function (item) {
      if (item.Selected.Operator.Value == 'is null' || item.Selected.Operator.Value == 'is not null') {
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
        currentGrp.datatype = currentGrp.Selected.FieldName.dataType;

        if (vm.datatypes.NUMBER.indexOf(currentGrp.datatype) != -1) {
          currentGrp.OperatorFilterType = vm.OperatorFilterType.DATE_AND_NUMBER_OPERATOR;
        }
        else if (vm.datatypes.STRING.indexOf(currentGrp.datatype) != -1) {
          currentGrp.OperatorFilterType = vm.OperatorFilterType.TEXT_OPERATOR;
        }
        else if (vm.datatypes.DATE.indexOf(currentGrp.datatype) != -1) {
          currentGrp.OperatorFilterType = vm.OperatorFilterType.DATE_AND_NUMBER_OPERATOR;
        }
        else if (vm.datatypes.TIME.indexOf(currentGrp.datatype) != -1) {
          currentGrp.OperatorFilterType = vm.OperatorFilterType.DATE_AND_NUMBER_OPERATOR;
        }
        else {
          currentGrp.OperatorFilterType = vm.OperatorFilterType.BOOLEAN_OPERATOR;
        }
      }
    };

    vm.addExpression = function (currentGrp, ev) {

      var data = {
        axisList: vm.numericAxisList,
        currentGrp: currentGrp
      };

      DialogFactory.dialogService(
        CORE.WIDGET_FILTER_EXPRESSION_MODAL_CONTROLLER,
        CORE.WIDGET_FILTER_EXPRESSION_MODAL_VIEW,
        ev,
        data).then((response) => {
          if (response) {
            currentGrp.Selected.SelectedExpression = response;
            currentGrp.OperatorFilterType = vm.OperatorFilterType.DATE_AND_NUMBER_OPERATOR;
          }
        }, (response) => {
          /* empty */
        }, (error) => {
          return BaseService.getErrorLog(error);
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
      vm.expressionForm.$setDirty();
    };

    vm.deleteExpression = function (currentGrp) {
      var parentNode = searchTree(vm.filterData[0], currentGrp.GroupLevel);
      parentNode.Nodes = _.without(parentNode.Nodes, currentGrp);
      vm.expressionForm.$setDirty();
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
      let isdirty = vm.expressionForm.$dirty;
      var isValid = true;
      _.each(vm.filterData, function (data) {
        validateExpression(data, isValid);
      });
      var model = { isDirty: isdirty }
      if (isValid) {
        var isValid = calculateAndSaveExpression();

        if (isValid) {
          _.each(vm.filterData, function (data) {
            removeAutocompleteObj(data);
          });

          model.filterdata = vm.filterData;
          $mdDialog.hide(model);
        } else {
          model.filterdata = vm.filterData;
          $mdDialog.hide(model);
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
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.INVALID_EXPRESSION);
      let model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
    }
    
    function showWithoutSavingAlertforcancle() {    
      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_APPLING_FILTER_ALERT_BODY_MESSAGE);
      let obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes)
          $mdDialog.cancel();
      }, (error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.cancel = function () {
      let isdirty = vm.expressionForm.$dirty;
      if (isdirty) {
        showWithoutSavingAlertforcancle();
      } else {
        $mdDialog.cancel();
      }
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
