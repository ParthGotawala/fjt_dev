(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('SummaryController', SummaryController);

  /** @ngInject */
  function SummaryController($state, RFQTRANSACTION, $scope, $q, $timeout, $stateParams, PartCostingFactory, MasterFactory, BaseService, DialogFactory, CORE, PRICING, CustomerConfirmationPopupFactory, BOMFactory, USER, socketConnectionService) {
    const vm = this;
    var rfqAssyID = $stateParams.id;
    vm.selectedItems = [];
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NO_SUMMARY;
    vm.CostingType = RFQTRANSACTION.SUMMARY_COSTINGTYPE;
    vm.timeType = RFQTRANSACTION.RFQ_TURN_TYPE;
    vm.quoteMarginType = CORE.QUOTE_ATTRIBUTE_MARGIN_TYPE;
    vm.LabelConstant = CORE.LabelConstant;
    vm.AddNewOptionalAttribute = [];
    //get summary quote list for assembly
    let getSummaryQuote = () => {
      var obj = {
        rfqAssyID: rfqAssyID,
        isSummaryComplete: vm.assymblyData.isSummaryComplete
      };
      return PartCostingFactory.retriveSummaryQuote().query({ summaryGetobj: obj }).$promise.then((quote) => {
        if (quote && quote.data) {
          _.each(quote.data, (summary) => {
            var total = 0;
            if (summary.timeType == vm.timeType.WEEK_DAY.VALUE)
              total = summary.turnTime / 7;
            else if (summary.timeType == vm.timeType.BUSINESS_DAY.TYPE)
              total = summary.turnTime / 5;
            else
              total = summary.turnTime;
            summary.totalDays = total;
          });
          vm.summaryQuote = quote.data;
          if (vm.summaryQuote.length == 0) {
            vm.isNoDataFound = true;
          }
          vm.listField = [];
          bindSummaryDetailList(vm.summaryQuote);
          $scope.$emit(RFQTRANSACTION.EVENT_NAME.HideSummarySave, vm.isNoDataFound);
          checkQuotePrice();
          return quote.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let bindSummaryDetailList = (rfqQuatationSummary) => {
      vm.listField = [];
      var i = 0;
      var countItem = 0;
      var dynamicFields = _.filter(vm.dynamicFieldList, (ctype) => { return (ctype.costingType == vm.CostingType.Material || ctype.costingType == vm.CostingType.Labor) });
      vm.laborCount = _.filter(vm.dynamicFieldList, (ctype) => { return (ctype.costingType == vm.CostingType.Labor) });
      vm.dynamicFieldsAdHOC = _.filter(vm.dynamicFieldList, (ctype) => { return ctype.costingType == vm.CostingType.Adhoc });
      vm.dynamicFieldsNRE = _.filter(vm.dynamicFieldList, (ctype) => { return ctype.costingType == vm.CostingType.NRE });
      vm.dynamicFieldsTool = _.filter(vm.dynamicFieldList, (ctype) => { return ctype.costingType == vm.CostingType.TOOL });
      vm.dynamicField = [];
      var data = _.groupBy(dynamicFields, 'costingType');
      var datalist = Object.keys(data);
      _.each(vm.summaryQuote, (item) => {
        item.unitPrice = parseFloat(item.unitPrice ? parseFloat(item.unitPrice).toFixed(_amountFilterDecimal) : "0.00").toFixed(_amountFilterDecimal);
        item.laborunitPrice = parseFloat(item.laborunitPrice ? parseFloat(item.laborunitPrice).toFixed(_amountFilterDecimal) : "0.00").toFixed(_amountFilterDecimal);
        //bind Material ans Labor data
        _.each(data, (dataFields) => {
          if (i == 1) {
            var dynamic = {
              fieldName: stringFormat("Labor Cost($)"),
              id: null,
              displayPercentage: null,
              displayMargin: null,
              displayDays: null,
              Type: "LB",
            }
            vm.dynamicField.push(dynamic);
          }
          var totalobjDyfieldsCostList = _.filter(dataFields, (objDyfields) => {
            let objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == objDyfields.id });
            if (objAdditionalQuote)
              return true;
            else
              return objDyfields.isActive;
          })
          _.each(totalobjDyfieldsCostList, (fields) => {
            var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == fields.id });
            var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => { return dynamicFieldObj.id == fields.id });
            if ((objItem) || (objItem && ((fields.applyToAll && fields.isActive) || fields.isActive))) {
              if (!dynamicFieldObjItem) {
                var dynamic = {
                  fieldName: stringFormat("{0}($)", fields.fieldName),
                  id: fields.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: fields.isDaysRequire,
                  Type: fields.costingType,
                  applyToAll: fields.applyToAll
                }
                vm.dynamicField.push(dynamic);
                if (fields.displayPercentage) {
                  var dynamic = {
                    fieldName: stringFormat("{0}(%)", fields.fieldName),
                    id: fields.id,
                    displayPercentage: true,
                    displayMargin: false,
                    Type: fields.costingType,
                  }
                  vm.dynamicField.push(dynamic);
                }
                if (fields.displayMargin) {
                  var dynamic = {
                    fieldName: stringFormat("{0} Margin(%)", fields.fieldName),
                    id: fields.id,
                    displayPercentage: false,
                    displayMargin: true,
                    Type: fields.costingType,
                  }
                  vm.dynamicField.push(dynamic);
                }
                var dynamicObj = {
                  fieldName: "", //vm.CostingType.FinalEA : "",
                  id: fields.id,
                  displayPercentage: null,
                  displayMargin: null,
                  total: null,
                  costingType: fields.costingType,
                  isLast: false,
                }
                vm.dynamicField.push(dynamicObj);
              }
              if (!objItem && dynamicFieldObjItem) {
                objItem = {
                  id: null,
                  rfqAssyQuoteID: item.id,
                  quoteChargeDynamicFieldID: dynamicFieldObjItem.id
                }
              }
              // creating object for data
              objItem.type = fields.costingType;
              var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
              var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
              objItem.subTotal = total;
              objItem.unitprice = parseFloat(item.unitPrice);
              objItem.laborunitPrice = parseFloat(item.laborunitPrice);
              objItem.amount = objItem.amount || objItem.amount == 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : "0.00";
              objItem.percentage = objItem.percentage || objItem.percentage == 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : "0.00";
              objItem.margin = objItem.margin || objItem.margin == 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : "0.00";
              objItem.displayOrder = ++countItem;
              objItem.selectionType = fields.selectionType;
              objItem.affectType = fields.affectType;
              objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
              vm.listField.push(objItem);

            } else {
              var objNewItem = null;
              if (vm.AddNewOptionalAttribute.length > 0) {
                objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => { return additionalCost.id == fields.id });
              }
              if ((fields.applyToAll && fields.isActive && !vm.assymblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
                if (!dynamicFieldObjItem) {
                  var dynamic = {
                    fieldName: stringFormat("{0}($)", fields.fieldName),
                    id: fields.id,
                    displayPercentage: false,
                    displayMargin: false,
                    displayDays: fields.isDaysRequire,
                    Type: fields.costingType,
                    applyToAll: fields.applyToAll
                  }
                  vm.dynamicField.push(dynamic);

                  if (fields.displayPercentage) {
                    var dynamic = {
                      fieldName: stringFormat("{0}(%)", fields.fieldName),
                      id: fields.id,
                      displayPercentage: true,
                      displayMargin: false,
                      Type: fields.costingType,
                    }
                    vm.dynamicField.push(dynamic);
                  }
                  if (fields.displayMargin) {
                    var dynamic = {
                      fieldName: stringFormat("{0} Margin(%)", fields.fieldName),
                      id: fields.id,
                      displayPercentage: false,
                      displayMargin: true,
                      Type: fields.costingType,
                    }
                    vm.dynamicField.push(dynamic);
                  }

                  var dynamicObj = {
                    fieldName: "", //vm.CostingType.FinalEA : "",
                    id: fields.id,
                    displayPercentage: null,
                    displayMargin: null,
                    total: null,
                    costingType: fields.costingType,
                    isLast: false,
                  }
                  vm.dynamicField.push(dynamicObj);
                }

                var objDynamic = {
                  amount: (fields.costingType == vm.CostingType.TOOL) ? (fields.toolingPrice ? parseFloat(fields.toolingPrice).toFixed(_amountFilterDecimal) : "0.00") : "0.00",
                  id: null,
                  percentage: "0.00",
                  margin: "0.00",
                  days: null,
                  quoteChargeDynamicFieldID: fields.id,
                  rfqAssyQuoteID: item.id,
                  type: fields.costingType,
                  displayOrder: ++countItem,
                  unitprice: parseFloat(item.unitPrice),
                  laborunitPrice: parseFloat(item.laborunitPrice),
                  laborday: item.laborday,
                  toolingQty: fields.toolingQty || fields.toolingQty == 0 ? fields.toolingQty : "0"
                }
                if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[0].Value == fields.marginApplicableType && (fields.defaultMarginValue || fields.defaultMarginValue == 0)) {

                  var unitPrice = fields.costingType == vm.CostingType.Labor ? item.laborunitPrice : item.unitPrice;
                  if (parseFloat(unitPrice)) {
                    objDynamic.amount = fields.defaultMarginValue > parseFloat(unitPrice) ? unitPrice : fields.defaultMarginValue.toFixed(_amountFilterDecimal);
                    objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                    objDynamic.percentage = parseFloat((((parseFloat(objDynamic.amount) * 100) / (parseFloat(unitPrice)))).toFixed(_amountFilterDecimal));
                  }
                  else {
                    objDynamic.amount = "0.00";
                    objDynamic.margin = "0.00";
                    objDynamic.percentage = "0.00";
                  }
                }
                else if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[1].Value == fields.marginApplicableType && (fields.defaultMarginValue || fields.defaultMarginValue == 0)) {
                  var unitPrice = fields.costingType == vm.CostingType.Labor ? item.laborunitPrice : item.unitPrice;
                  if (parseFloat(unitPrice)) {
                    objDynamic.percentage = fields.defaultMarginValue.toFixed(_amountFilterDecimal);
                    objDynamic.amount = parseFloat((((parseFloat(objDynamic.percentage) * (parseFloat(unitPrice))) / 100))).toFixed(_amountFilterDecimal);
                    objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                  }
                  else {
                    objDynamic.amount = "0.00";
                    objDynamic.margin = "0.00";
                    objDynamic.percentage = "0.00";
                  }
                }
                if (fields.isDaysRequire && (fields.defaultuomValue || fields.defaultuomType)) {
                  var days = fields.defaultuomValue ? fields.defaultuomValue : 0;
                  if (fields.defaultuomType == vm.timeType.WEEK.VALUE)
                    days = days * 7;
                  else if (fields.defaultuomType == vm.timeType.BUSINESS_DAY.VALUE) {
                    days = Math.ceil(7 * days / 5);
                  }
                  objDynamic.days = days;
                  objDynamic.selectionType = fields.selectionType;
                  objDynamic.affectType = fields.affectType;
                  // objDynamic.
                }
                objDynamic.tooltip = fields.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", fields.affectType == "M" ? "Material" : "Labor", fields.selectionType == 1 ? "Whichever is greater" : "Add to Lead Time") : stringFormat("Lead Time: Not Applicable");
                var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
                var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
                objDynamic.subTotal = total;
                vm.listField.push(objDynamic);
              }
            }
          });
          i++;
        });

        // bind ad Hoc data
        var totalAdHOCCostList = _.filter(vm.dynamicFieldsAdHOC, (objDyAdHOC) => {
          let objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == objDyAdHOC.id });
          if (objAdditionalQuote)
            return true;
          else
            return objDyAdHOC.isActive;
        })
        _.each(totalAdHOCCostList, (adhoc) => {
          var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == adhoc.id });
          var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => { return dynamicFieldObj.id == adhoc.id });
          if ((objItem) || (objItem && ((adhoc.applyToAll && adhoc.isActive) || adhoc.isActive))) {
            if (!dynamicFieldObjItem) {
              var dynamic = {
                fieldName: stringFormat("{0}($)", adhoc.fieldName),
                id: adhoc.id,
                displayPercentage: false,
                displayMargin: false,
                displayDays: adhoc.isDaysRequire,
                Type: adhoc.costingType,
                applyToAll: adhoc.applyToAll
              }
              vm.dynamicField.push(dynamic);
            }
            if (!objItem && dynamicFieldObjItem) {
              objItem = {
                id: null,
                rfqAssyQuoteID: item.id,
                quoteChargeDynamicFieldID: dynamicFieldObjItem.id,
              }
            }
            // creating object for data
            objItem.type = adhoc.costingType;
            var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
            var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
            objItem.subTotal = total;
            objItem.unitprice = parseFloat(item.unitPrice);
            objItem.laborunitPrice = parseFloat(item.laborunitPrice);
            objItem.amount = objItem.amount || objItem.amount == 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : "0.00";
            objItem.percentage = objItem.percentage || objItem.percentage == 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : "0.00";
            objItem.margin = objItem.margin || objItem.margin == 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : "0.00";
            objItem.displayOrder = ++countItem;
            objItem.selectionType = adhoc.selectionType;
            objItem.affectType = adhoc.affectType;
            objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
            vm.listField.push(objItem);

          } else {
            var objNewItem = null;
            if (vm.AddNewOptionalAttribute.length > 0) {
              objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => { return additionalCost.id == adhoc.id });
            }
            if ((adhoc.applyToAll && adhoc.isActive && !vm.assymblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
              if (!dynamicFieldObjItem) {
                var dynamic = {
                  fieldName: stringFormat("{0}($)", adhoc.fieldName),
                  id: adhoc.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: adhoc.isDaysRequire,
                  Type: adhoc.costingType,
                  applyToAll: adhoc.applyToAll
                }
                vm.dynamicField.push(dynamic);
              }
              var objDynamic = {
                amount: (adhoc.costingType == vm.CostingType.TOOL) ? (adhoc.toolingPrice ? parseFloat(adhoc.toolingPrice).toFixed(_amountFilterDecimal) : "0.00") : "0.00",
                id: null,
                percentage: "0.00",
                margin: "0.00",
                days: null,
                quoteChargeDynamicFieldID: adhoc.id,
                rfqAssyQuoteID: item.id,
                type: adhoc.costingType,
                displayOrder: ++countItem,
                unitprice: parseFloat(item.unitPrice),
                laborunitPrice: parseFloat(item.laborunitPrice),
                laborday: item.laborday,
                toolingQty: adhoc.toolingQty || adhoc.toolingQty == 0 ? adhoc.toolingQty : "0"
              }
              if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[0].Value == adhoc.marginApplicableType && (adhoc.defaultMarginValue || adhoc.defaultMarginValue == 0)) {
                var unitPrice = adhoc.costingType == vm.CostingType.Labor ? item.laborunitPrice : item.unitPrice;
                if (parseFloat(unitPrice)) {
                  objDynamic.amount = adhoc.defaultMarginValue > parseFloat(unitPrice) ? unitPrice : adhoc.defaultMarginValue.toFixed(_amountFilterDecimal);
                  objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                  objDynamic.percentage = parseFloat((((parseFloat(objDynamic.amount) * 100) / (parseFloat(unitPrice)))).toFixed(_amountFilterDecimal));
                }
                else {
                  objDynamic.amount = "0.00";
                  objDynamic.margin = "0.00";
                  objDynamic.percentage = "0.00";
                }
              }
              else if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[1].Value == adhoc.marginApplicableType && (adhoc.defaultMarginValue || adhoc.defaultMarginValue == 0)) {
                var unitPrice = adhoc.costingType == vm.CostingType.Labor ? item.laborunitPrice : item.unitPrice;
                if (parseFloat(unitPrice)) {
                  objDynamic.percentage = adhoc.defaultMarginValue.toFixed(_amountFilterDecimal);
                  objDynamic.amount = parseFloat((((parseFloat(objDynamic.percentage) * (parseFloat(unitPrice))) / 100))).toFixed(_amountFilterDecimal);
                  objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                }
                else {
                  objDynamic.amount = "0.00";
                  objDynamic.margin = "0.00";
                  objDynamic.percentage = "0.00";
                }
              }
              if (adhoc.isDaysRequire && (adhoc.defaultuomValue || adhoc.defaultuomType)) {
                var days = adhoc.defaultuomValue ? adhoc.defaultuomValue : 0;
                if (adhoc.defaultuomType == vm.timeType.WEEK.VALUE)
                  days = days * 7;
                else if (adhoc.defaultuomType == vm.timeType.BUSINESS_DAY.VALUE) {
                  days = Math.ceil(7 * days / 5);
                }
                objDynamic.days = days;
                objDynamic.selectionType = adhoc.selectionType;
                objDynamic.affectType = adhoc.affectType;
              }
              objDynamic.tooltip = adhoc.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", adhoc.affectType == "M" ? "Material" : "Labor", adhoc.selectionType == 1 ? "Whichever is greater" : "Add to Lead Time") : stringFormat("Lead Time: Not Applicable");
              var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
              var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
              objDynamic.subTotal = total;
              vm.listField.push(objDynamic);
            }
          }
        });

        var dynamicFieldFinalEA = _.find(vm.dynamicField, (dynamicFieldObj) => { return dynamicFieldObj.fieldName == vm.CostingType.FinalEA });
        if (!dynamicFieldFinalEA) {
          var dynamicd = {
            fieldName: vm.CostingType.FinalEA,
            id: null,
            displayPercentage: null,
            displayMargin: null,
            total: null,
            costingType: vm.CostingType.FinalEA,
            isLast: true,
          }
          vm.dynamicField.push(dynamicd);
        }
        // bind NRE data
        var NRECount = 0;
        var totalNRECostList = _.filter(vm.dynamicFieldsNRE, (objDyNRE) => {
          let objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == objDyNRE.id });
          if (objAdditionalQuote)
            return true;
          else
            return objDyNRE.isActive;
        })
        _.each(totalNRECostList, (nre) => {
          var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == nre.id });
          var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => { return dynamicFieldObj.id == nre.id });
          if ((objItem) || (objItem && ((nre.applyToAll && nre.isActive) || nre.isActive))) {
            if (!dynamicFieldObjItem) {
              var dynamic = {
                fieldName: stringFormat("{0}($)", nre.fieldName),
                id: nre.id,
                displayPercentage: false,
                displayMargin: false,
                displayDays: nre.isDaysRequire,
                Type: nre.costingType,
                tooltip: nre.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", nre.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, nre.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat("Lead Time: Not Applicable"),
                applyToAll: nre.applyToAll
              }
              vm.dynamicField.push(dynamic);
            }
            if (!objItem && dynamicFieldObjItem) {
              objItem = {
                id: null,
                rfqAssyQuoteID: item.id,
                quoteChargeDynamicFieldID: dynamicFieldObjItem.id
              }
            }

            // creating object for data
            objItem.type = nre.costingType;
            var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
            var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
            objItem.subTotal = total;
            objItem.unitprice = parseFloat(item.unitPrice);
            objItem.laborunitPrice = parseFloat(item.laborunitPrice);
            objItem.amount = objItem.amount || objItem.amount == 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : "0.00";
            objItem.percentage = objItem.percentage || objItem.percentage == 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : "0.00";
            objItem.margin = objItem.margin || objItem.margin == 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : "0.00";
            objItem.displayOrder = ++countItem;
            objItem.selectionType = nre.selectionType;
            objItem.affectType = nre.affectType;
            objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
            vm.listField.push(objItem);
          } else {
            var objNewItem = null;
            let objNREisAvailable = _.find(vm.dynamicField, a => a.fieldName == vm.CostingType.TotalNRE)
            if (vm.AddNewOptionalAttribute.length > 0) {
              objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => { return additionalCost.id == nre.id });
            }
            if ((nre.applyToAll && nre.isActive && !vm.assymblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
              if (!dynamicFieldObjItem) {
                var dynamic = {
                  fieldName: stringFormat("{0}($)", nre.fieldName),
                  id: nre.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: nre.isDaysRequire,
                  Type: nre.costingType,
                  tooltip: nre.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", nre.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, nre.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat("Lead Time: Not Applicable"),
                  applyToAll: nre.applyToAll
                }
                if (objNREisAvailable) {
                  vm.dynamicField.splice(vm.dynamicField.indexOf(objNREisAvailable), 0, dynamic);
                } else {
                  vm.dynamicField.push(dynamic);
                }
              }

              var objDynamic = {
                amount: (nre.costingType == vm.CostingType.NRE) ? (nre.toolingPrice ? parseFloat(nre.toolingPrice).toFixed(_amountFilterDecimal) : "0.00") : "0.00",
                id: null,
                percentage: "0.00",
                margin: "0.00",
                days: null,
                quoteChargeDynamicFieldID: nre.id,
                rfqAssyQuoteID: item.id,
                type: nre.costingType,
                displayOrder: ++countItem,
                unitprice: parseFloat(item.unitPrice),
                laborunitPrice: parseFloat(item.laborunitPrice),
                laborday: item.laborday,
                toolingQty: nre.toolingQty || nre.toolingQty == 0 ? nre.toolingQty : "0"
              }
              if (nre.isDaysRequire && (nre.defaultuomValue || nre.defaultuomType)) {
                var days = nre.defaultuomValue ? nre.defaultuomValue : 0;
                if (nre.defaultuomType == vm.timeType.WEEK.VALUE)
                  days = days * 7;
                else if (nre.defaultuomType == vm.timeType.BUSINESS_DAY.VALUE) {
                  days = Math.ceil(7 * days / 5);
                }
                objDynamic.days = days;
                objDynamic.selectionType = nre.selectionType;
                objDynamic.affectType = nre.affectType;
              }
              objDynamic.tooltip = nre.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", nre.affectType == "M" ? "Material" : "Labor", nre.selectionType == 1 ? "Whichever is greater" : "Add to Lead Time") : stringFormat("Lead Time: Not Applicable");
              var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
              var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
              objDynamic.subTotal = total;
              vm.listField.push(objDynamic);

            }
          }
          var dynamicFieldTotalNREItem = _.find(vm.dynamicField, (dynamicFieldObj) => { return dynamicFieldObj.fieldName == vm.CostingType.TotalNRE });
          NRECount++;
          if (NRECount == totalNRECostList.length && !dynamicFieldTotalNREItem) {
            var dynamicd = {
              fieldName: vm.CostingType.TotalNRE,//datalist[0]
              id: null,
              displayPercentage: null,
              displayMargin: null,
              total: null,
              costingType: nre.costingType,
              isLast: true,
            }
            vm.dynamicField.push(dynamicd);
          }
        });

        // bind Tooling data
        var ToolCount = 0;
        var totalToolingCostList = _.filter(vm.dynamicFieldsTool, (objDyTool) => {
          let objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == objDyTool.id });
          if (objAdditionalQuote)
            return true;
          else
            return objDyTool.isActive;
        })
        _.each(totalToolingCostList, (tool) => {
          var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == tool.id });
          var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => { return dynamicFieldObj.id == tool.id });
          if ((objItem) || (objItem && ((tool.applyToAll && tool.isActive) || tool.isActive))) {
            if (!dynamicFieldObjItem) {
              var dynamic = {
                fieldName: stringFormat("{0}($)", tool.fieldName),
                id: tool.id,
                displayPercentage: false,
                displayMargin: false,
                displayDays: tool.isDaysRequire,
                Type: tool.costingType,
                tooltip: tool.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", tool.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, tool.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat("Lead Time: Not Applicable"),
                applyToAll: tool.applyToAll
              }
              vm.dynamicField.push(dynamic);
            }
            if (!objItem && dynamicFieldObjItem) {
              objItem = {
                id: null,
                rfqAssyQuoteID: item.id,
                quoteChargeDynamicFieldID: dynamicFieldObjItem.id
              }
            }
            // creating object for data
            objItem.type = tool.costingType;
            var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
            var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
            objItem.subTotal = total;
            objItem.unitprice = parseFloat(item.unitPrice);
            objItem.laborunitPrice = parseFloat(item.laborunitPrice);
            objItem.amount = objItem.amount || objItem.amount == 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : "0.00";
            objItem.percentage = objItem.percentage || objItem.percentage == 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : "0.00";
            objItem.margin = objItem.margin || objItem.margin == 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : "0.00";
            objItem.displayOrder = ++countItem;
            objItem.selectionType = tool.selectionType;
            objItem.affectType = tool.affectType;
            objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
            vm.listField.push(objItem);
          } else {
            var objNewItem = null;
            let objToolisAvailable = _.find(vm.dynamicField, a => a.fieldName == vm.CostingType.TotalTOOL)
            if (vm.AddNewOptionalAttribute.length > 0) {
              objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => { return additionalCost.id == tool.id });
            }
            if ((tool.applyToAll && tool.isActive && !vm.assymblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
              if (!dynamicFieldObjItem) {
                var dynamic = {
                  fieldName: stringFormat("{0}($)", tool.fieldName),
                  id: tool.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: tool.isDaysRequire,
                  Type: tool.costingType,
                  tooltip: tool.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", tool.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, tool.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat("Lead Time: Not Applicable"),
                  applyToAll: tool.applyToAll
                }
                if (objToolisAvailable) {
                  vm.dynamicField.splice(vm.dynamicField.indexOf(objToolisAvailable), 0, dynamic);
                } else {
                  vm.dynamicField.push(dynamic);
                }
              }

              var objDynamic = {
                amount: (tool.costingType == vm.CostingType.TOOL) ? (tool.toolingPrice ? parseFloat(tool.toolingPrice).toFixed(_amountFilterDecimal) : "0.00") : "0.00",
                id: null,
                percentage: "0.00",
                margin: "0.00",
                days: null,
                quoteChargeDynamicFieldID: tool.id,
                rfqAssyQuoteID: item.id,
                type: tool.costingType,
                displayOrder: ++countItem,
                unitprice: parseFloat(item.unitPrice),
                laborunitPrice: parseFloat(item.laborunitPrice),
                laborday: item.laborday,
                toolingQty: tool.toolingQty || tool.toolingQty == 0 ? tool.toolingQty : "0"
              }
              if (tool.isDaysRequire && (tool.defaultuomValue || tool.defaultuomType)) {
                var days = tool.defaultuomValue ? tool.defaultuomValue : 0;
                if (tool.defaultuomType == vm.timeType.WEEK.VALUE)
                  days = days * 7;
                else if (tool.defaultuomType == vm.timeType.BUSINESS_DAY.VALUE) {
                  days = Math.ceil(7 * days / 5);
                }
                objDynamic.days = days;
                objDynamic.selectionType = tool.selectionType;
                objDynamic.affectType = tool.affectType;
              }
              objDynamic.tooltip = tool.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", tool.affectType == "M" ? "Material" : "Labor", tool.selectionType == 1 ? "Whichever is greater" : "Add to Lead Time") : stringFormat("Lead Time: Not Applicable");
              var listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => { return list.type == vm.CostingType.Adhoc });
              var total = (_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
              objDynamic.subTotal = total;
              vm.listField.push(objDynamic);
            }
          }
          var dynamicFieldTotalToolItem = _.find(vm.dynamicField, (dynamicFieldObj) => { return dynamicFieldObj.fieldName == vm.CostingType.TotalTOOL });
          ToolCount++;
          if (ToolCount == totalToolingCostList.length && !dynamicFieldTotalToolItem) {
            var dynamicd = {
              fieldName: vm.CostingType.TotalTOOL,//datalist[0]
              id: null,
              displayPercentage: null,
              displayMargin: null,
              total: null,
              costingType: tool.costingType,
              isLast: true,
            }
            vm.dynamicField.push(dynamicd);
          }
        });

        var objDynamic = {
          amount: "0.00",
          id: null,
          percentage: "0.00",
          margin: "0.00",
          days: null,
          quoteChargeDynamicFieldID: null,
          rfqAssyQuoteID: item.id,
          type: vm.CostingType.FinalEA,
          displayOrder: ++countItem,
          unitprice: null,
          toolingQty: "0",
          laborunitPrice: null
        }
        vm.listField.push(objDynamic);
      });
    }
    //get summary terms and condition list
    let getTermsandCondition = () => {
      return PartCostingFactory.getSummaryTermsCondition().query({ rfqAssyID: rfqAssyID }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.termsandcondition = terms.data;
          return terms.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //get dynamic list for summary
    let getDynamicFields = (isAddedOptionalAttribute) => {
      return PartCostingFactory.retriveDynamicFields().query().$promise.then((dynamic) => {
        if (dynamic && dynamic.data) {
          vm.dynamicFieldList = _.orderBy(dynamic.data, 'costingType', 'desc');
          if (isAddedOptionalAttribute) {
            bindSummaryDetailList();
            vm.changevalue();
          }
          return dynamic.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //get comment from RFQ assembly
    let getComment = () => {
      return CustomerConfirmationPopupFactory.getRFQLineItemsDescription().query({ id: vm.assymblyData.partID }).$promise.then((res) => {
        if (res && res.data) {
          vm.lineitemsDescriptionList = _.sortBy(res.data.response, (x) => { return parseInt(x.lineID); });
          _.each(vm.lineitemsDescriptionList, function (item) {
            var level = _.maxBy(_.filter(res.data.asseblyList, { prPerPartID: item.partID }), 'level').level;
            item.assyLevel = level;
            item.assyID = item.component ? item.component.PIDcode : "";
            item.displayDescription = [];
            var err = item.description ? item.description.split('\n') : [];
            _.each(err, function (error) {
              if (item.qpaDesignatorStep == false || item.lineMergeStep == false || item.duplicateCPNStep == false || item.requireMountingTypeStep == false || item.requireFunctionalTypeStep == false || item.customerApprovalForQPAREFDESStep == false || item.customerApprovalForBuyStep == false || item.customerApprovalForPopulateStep == false || item.dnpQPARefDesStep == false || item.customerApprovalForDNPQPAREFDESStep == false || item.customerApprovalForDNPBuyStep == false || item.dnpInvalidREFDESStep == false) {
                item.displayDescription.push((item.qpa == null ? "" : (item.qpa + ":")) + (item.refDesig == null ? "" : (item.refDesig + ":")) + (error == null ? "" : error.replace(/^.+:/, '')));
              }
            })

            _.each(item.rfqLineitemsAlternetpart, function (data) {
              var errorArr = data.description ? data.description.split('\n') : [];

              _.each(errorArr, function (error) {
                if (data.mfgVerificationStep == false || data.mfgDistMappingStep == false ||
                  data.mfgCodeStep == false || data.obsoletePartStep == false || data.mfgGoodPartMappingStep == false
                  || data.mfgPNStep == false || data.nonRohsStep == false || data.epoxyStep == false
                  || data.invalidConnectorTypeStep == false || data.duplicateMPNInSameLineStep == false
                  || data.mismatchFunctionalCategoryStep == false || data.mismatchMountingTypeStep == false || data.pickupPadRequiredStep == false || data.mismatchCustomPartStep == false
                  || data.restrictUseWithPermissionStep == false || data.restrictUsePermanentlyStep == false || data.matingPartRquiredStep == false || data.suggestedGoodPartStep == false
                  || data.restrictUseExcludingAliasWithPermissionStep == false || data.restrictUseExcludingAliasStep == false
                  || data.functionalTestingRequiredStep == false || data.uomMismatchedStep == false || data.programingRequiredStep == false
                  || data.mismatchColorStep == false || data.restrictUseInBOMStep == true || data.restrictUseInBOMWithPermissionStep == true || data.restrictUseInBOMExcludingAliasStep == true || data.restrictUseInBOMExcludingAliasWithPermissionStep == true
                  || data.mismatchNumberOfRowsStep == false || data.partPinIsLessthenBOMPinStep == false || data.tbdPartStep == false
                  || data.customerApproval == RFQTRANSACTION.CUSTOMER_APPROVAL.PENDING) {
                  item.displayDescription.push((data.mfgCode == null ? "" : (data.mfgCode + ": ")) + (data.mfgPN == null ? "" : (data.mfgPN + ": ")) + (error == null ? "" : error.replace(/^.+:/, '')));
                }
                if (data.distVerificationStep == false || data.distCodeStep == false || data.getMFGPNStep == false
                  || data.distPNStep == false || data.distGoodPartMappingStep == false) {
                  item.displayDescription.push((data.distributor == null ? "" : (data.distributor + ": ")) + (data.distPN == null ? "" : (data.distPN + ": ")) + (error == null ? "" : error.replace(/^.+:/, '')));
                }
              })
            });
          });
          return vm.lineitemsDescriptionList = _.sortBy(vm.lineitemsDescriptionList, "assyLevel");

        }

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // get Component Internal Version
    function getComponentInternalVersion() {
      if (vm.assymblyData && vm.assymblyData.partID) {
        return MasterFactory.getComponentInternalVersion().query({ id: vm.assymblyData.partID }).$promise.then((component) => {
          if (component && component.data) {
            vm.liveVersion = component.data.liveVersion;
            vm.assymblyData.liveInternalVersion = component.data.liveVersion;
          }
          return vm.assymblyData.liveInternalVersion;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }
    //get assembly details
    let getAssyDetails = (isfinal, saveClick) => {
      return BOMFactory.getAssyDetails().query({ id: $state.params.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.assymblyData = response.data;
          if (vm.liveVersion)
            vm.assymblyData.liveInternalVersion = vm.liveVersion;
          vm.quotedetail = _.orderBy(vm.assymblyData.rfqAssyQuoteSubmitted, 'id', 'desc');
          if (saveClick) {
            if (vm.assymblyData.isPriceUpdate) {
              showAlertForMismatch(false);
            } else if (vm.assymblyData.isLaborUpdate) {
              showAlertForMismatch(true);
            } else {
              savePartCostingPrice(isfinal);
            }
          } else
            return vm.assymblyData;
        }
      });
    }

    function showAlertForMismatch(islabor) {
      let obj = {
        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: islabor ? RFQTRANSACTION.QUOTE.LABOR_VERSION_MISMATCH : RFQTRANSACTION.QUOTE.PRICING_VERSION_MISMATCH,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK
      };
      return DialogFactory.alertDialog(obj).then(() => {
        if (BOMFactory.isBOMChanged) {
          savePartCostingPrice(false);
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    var autocompletePromise = [getDynamicFields(), getTermsandCondition(), getAssyDetails()];
    // not in use after changes on (22-11-2019) Shirish
    let bindSummaryDetail = (responses) => {
      return $timeout(() => {
        //vm.summaryQuote = responses[0];
        vm.dynamicFieldList = responses[0] = _.orderBy(responses[0], 'costingType', 'desc');
        var dynamicFields = _.filter(responses[0], (ctype) => { return (ctype.costingType == vm.CostingType.Material || ctype.costingType == vm.CostingType.Labor) });
        vm.laborCount = _.filter(responses[0], (ctype) => { return (ctype.costingType == vm.CostingType.Labor) });
        vm.dynamicFieldsAdHOC = _.filter(responses[0], (ctype) => { return ctype.costingType == vm.CostingType.Adhoc });
        vm.dynamicFieldsNRE = _.filter(responses[0], (ctype) => { return ctype.costingType == vm.CostingType.NRE });
        vm.dynamicFieldsTool = _.filter(responses[0], (ctype) => { return ctype.costingType == vm.CostingType.TOOL });
        vm.dynamicField = [];
        var data = _.groupBy(dynamicFields, 'costingType');
        var datalist = Object.keys(data);
        var i = 0;
        _.each(data, (dataFields) => {
          if (i > 0) {
            var dynamic = {
              fieldName: stringFormat("Labor Cost($)"),
              id: null,
              displayPercentage: null,
              displayMargin: null,
              displayDays: null,
              Type: "LB",
            }
            vm.dynamicField.push(dynamic);
          }
          _.each(dataFields, (fields) => {
            if ((fields.applyToAll && fields.isActive) || fields.isActive) {
              var dynamic = {
                fieldName: stringFormat("{0}($)", fields.fieldName),
                id: fields.id,
                displayPercentage: false,
                displayMargin: false,
                displayDays: fields.isDaysRequire,
                Type: fields.costingType,
                applyToAll: fields.applyToAll
              }
              vm.dynamicField.push(dynamic);
              if (fields.displayPercentage) {
                var dynamic = {
                  fieldName: stringFormat("{0}(%)", fields.fieldName),
                  id: fields.id,
                  displayPercentage: true,
                  displayMargin: false,
                  Type: fields.costingType,
                }
                vm.dynamicField.push(dynamic);
              }
              if (fields.displayMargin) {
                var dynamic = {
                  fieldName: stringFormat("{0} Margin(%)", fields.fieldName),
                  id: fields.id,
                  displayPercentage: false,
                  displayMargin: true,
                  Type: fields.costingType,
                }
                vm.dynamicField.push(dynamic);
              }
              var dynamicObj = {
                fieldName: "", //vm.CostingType.FinalEA : "",
                id: fields.id,
                displayPercentage: null,
                displayMargin: null,
                total: null,
                costingType: fields.costingType,
                isLast: false,
              }
              vm.dynamicField.push(dynamicObj);
            }
          });
          i++;
        });
        _.each(vm.dynamicFieldsAdHOC, (adhoc) => {
          if ((adhoc.applyToAll && adhoc.isActive) || adhoc.isActive) {
            var dynamic = {
              fieldName: stringFormat("{0}($)", adhoc.fieldName),
              id: adhoc.id,
              displayPercentage: false,
              displayMargin: false,
              displayDays: adhoc.isDaysRequire,
              Type: adhoc.costingType,
              applyToAll: adhoc.applyToAll
            }
            vm.dynamicField.push(dynamic);
          }
        });
        var dynamicd = {
          fieldName: vm.CostingType.FinalEA,//datalist[0]
          id: null,
          displayPercentage: null,
          displayMargin: null,
          total: null,
          costingType: vm.CostingType.FinalEA,
          isLast: true,
        }
        vm.dynamicField.push(dynamicd);
        var NRECount = 0;
        _.each(vm.dynamicFieldsNRE, (nre) => {
          if ((nre.applyToAll && nre.isActive) || nre.isActive) {
            var dynamic = {
              fieldName: stringFormat("{0}($)", nre.fieldName),
              id: nre.id,
              displayPercentage: false,
              displayMargin: false,
              displayDays: nre.isDaysRequire,
              Type: nre.costingType,
              tooltip: nre.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", nre.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, nre.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat("Lead Time: Not Applicable"),
              applyToAll: nre.applyToAll
            }
            vm.dynamicField.push(dynamic);
            NRECount++;
            if (NRECount == vm.dynamicFieldsNRE.length) {
              var dynamicd = {
                fieldName: vm.CostingType.TotalNRE,//datalist[0]
                id: dynamic.id,
                displayPercentage: null,
                displayMargin: null,
                total: null,
                costingType: nre.costingType,
                isLast: true,
              }
              vm.dynamicField.push(dynamicd);
            }
          }
        });
        var TotalCount = 0;
        _.each(vm.dynamicFieldsTool, (tool) => {
          if ((tool.applyToAll && tool.isActive) || tool.isActive) {
            var dynamic = {
              fieldName: stringFormat("{0}($)", tool.fieldName),
              id: tool.id,
              displayPercentage: false,
              displayMargin: false,
              displayDays: tool.isDaysRequire,
              Type: tool.costingType,
              tooltip: tool.isDaysRequire ? stringFormat("Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}", tool.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, tool.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat("Lead Time: Not Applicable"),
              applyToAll: tool.applyToAll
            }
            vm.dynamicField.push(dynamic);
            TotalCount++;
            if (TotalCount == vm.dynamicFieldsTool.length) {
              var dynamicd = {
                fieldName: vm.CostingType.TotalTOOL,//datalist[0]
                id: dynamic.id,
                displayPercentage: null,
                displayMargin: null,
                total: null,
                costingType: tool.costingType,
                isLast: true,
              }
              vm.dynamicField.push(dynamicd);
            }
          }
        });
      }, 0);
    }

    //get promise data for dynamic list and summary quote and based on it create object for same 

    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      //var bindHtmlPromise = [bindSummaryDetail(responses)];
      //vm.cgBusyLoading = $q.all(bindHtmlPromise).then((response) => {
      var bindQuotePromise = [getSummaryQuote(), getComment(), getComponentInternalVersion()];
      vm.cgBusyLoading = $q.all(bindQuotePromise).then((response) => {
        //});
      });
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    //calculate margin dollar and margin percentage base on profit
    vm.changePercentage = (item, unitprice) => {
      if (vm.assymblyData.isSummaryComplete)
        return false;
      var objCost = _.find(vm.listField, (cost) => { return cost.rfqAssyQuoteID == item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID == item.quoteChargeDynamicFieldID });
      if (objCost) {
        objCost.percentage = item.percentage;
        var percentage = objCost.percentage ? parseFloat(objCost.percentage) : 0;
        if (parseFloat(objCost.percentage) > 100)
          percentage = "100.00";
        if (parseFloat(unitprice)) {
          objCost.amount = parseFloat((((percentage * (parseFloat(unitprice))) / 100))).toFixed(_amountFilterDecimal);
          objCost.margin = parseFloat((((objCost.amount * 100) / ((parseFloat(unitprice)) + parseFloat(objCost.amount))))).toFixed(_amountFilterDecimal);
          objCost.percentage = parseFloat(percentage).toFixed(_amountFilterDecimal);
        }
        else {
          objCost.amount = "0.00";
          objCost.margin = "0.00";
          objCost.percentage = "0.00";
        }

        //BOMFactory.isBOMChanged = true;
      }
    }
    //calculate amount for NRE and tooling
    vm.changeDetails = (item, amount) => {
      if (vm.assymblyData.isSummaryComplete)
        return false;
      var objCost = _.find(vm.listField, (cost) => { return cost.rfqAssyQuoteID == item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID == item.quoteChargeDynamicFieldID });
      if (objCost && objCost.amount) {
        var lastChar = amount[amount.length - 1];
        if (lastChar != ".") {
          if (parseFloat(amount) > 100000)
            objCost.amount = "100000.00";
        }
      }

    }
    //calculate markup profit and margin profit based on dollar
    vm.changeDollar = (item, unitprice, laborPrice) => {
      if (vm.assymblyData.isSummaryComplete)
        return false;
      var objCost = _.find(vm.listField, (cost) => { return cost.rfqAssyQuoteID == item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID == item.quoteChargeDynamicFieldID });
      if (objCost) {
        var lastChar = objCost.amount[objCost.amount.length - 1];
        if (lastChar == ".") {
          objCost.amount = objCost.amount.substring(0, objCost.amount.length - 1);
          // item.amount = item.amount.substring(0, item.amount.length - 1);
        }
        if (parseFloat(unitprice)) {
          item.amount = item.amount ? item.amount : "0.00";
          if (parseFloat(item.amount ? item.amount : 0) > parseFloat(unitprice))
            item.amount = parseFloat(unitprice);
          objCost.amount = parseFloat((parseFloat(item.amount ? (item.amount) : 0))).toFixed(_amountFilterDecimal);
          objCost.margin = parseFloat((((parseFloat(objCost.amount ? objCost.amount : 0) * 100) / ((parseFloat(unitprice)) + parseFloat(objCost.amount ? objCost.amount : 0))))).toFixed(_amountFilterDecimal);
          objCost.percentage = parseFloat((((parseFloat(objCost.amount ? objCost.amount : 0) * 100) / (parseFloat(unitprice))))).toFixed(_amountFilterDecimal);
          if (objCost.type == vm.CostingType.Adhoc) {
            var listItem = _.filter(vm.listField, (list) => { return list.type == vm.CostingType.Adhoc && list.rfqAssyQuoteID == item.rfqAssyQuoteID });
            _.each(listItem, (costItem) => {
              costItem.subTotal = parseFloat((_.sumBy(_.filter(vm.listField, (listam) => { return listam.amount }), (sum) => { return parseFloat(sum.amount) }) + parseFloat(unitprice) + parseFloat(laborPrice ? laborPrice : 0)).toFixed(_amountFilterDecimal));
            });
          }
        }
        else {
          objCost.amount = "0.00";
          objCost.margin = "0.00";
          objCost.percentage = "0.00";
        }
        //   BOMFactory.isBOMChanged = true;
      }
    }
    //calculate markup profit and markup dollar
    vm.changeMargin = (item, unitprice) => {
      if (vm.assymblyData.isSummaryComplete)
        return false;
      var objCost = _.find(vm.listField, (cost) => { return cost.rfqAssyQuoteID == item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID == item.quoteChargeDynamicFieldID });
      if (objCost && objCost.margin) {
        objCost.margin = objCost.margin ? objCost.margin.toString() : "";
        var index = objCost.margin.indexOf(".");
        if (index == -1)
          index = (objCost.margin.length - 1);
        else
          index = index - 1;
        if (parseFloat(unitprice)) {
          if (parseFloat(objCost.margin) >= 50) {
            objCost.margin = 50.00;
            //objCost.margin = objCost.margin.substring(0, index) + objCost.margin.substring(index + 1, objCost.margin.length);
          }
          var margin = objCost.margin;
          //if (parseFloat(margin) > 50)
          //    margin = 50.00;
          var marginpercentage = (margin / 100);
          var salesPrice = ((parseFloat(unitprice)) / (1 - marginpercentage));

          objCost.amount = parseFloat(((salesPrice - (parseFloat(unitprice))))).toFixed(_amountFilterDecimal);
          objCost.percentage = parseFloat((((parseFloat(objCost.amount) * 100) / (parseFloat(unitprice))))).toFixed(_amountFilterDecimal);
          objCost.margin = parseFloat(margin).toFixed(_amountFilterDecimal);
        }
        else {
          objCost.amount = "0.00";
          objCost.margin = "0.00";
          objCost.percentage = "0.00";
        }
      }
      else
        objCost.margin = "0.00";
      //  BOMFactory.isBOMChanged = true;
    }
    //receive event from BOM for summary save 
    vm.changevalue = () => {
      BOMFactory.isBOMChanged = true;
      BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
    }
    $scope.$on(PRICING.EventName.SaveSummaryTab, (name, isfinal) => {
      if (vm.assymblyData.liveInternalVersion != vm.assymblyData.partCostingBOMInternalVersion && isfinal) {
        let obj = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: RFQTRANSACTION.QUOTE.BOM_VERSION_MISMATCH,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK
        };
        return DialogFactory.alertDialog(obj).then(() => {
          if (BOMFactory.isBOMChanged) {
            isfinal = false;
            getAssyDetails(isfinal, true);
            // savePartCostingPrice(isfinal);
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      } else {
        getAssyDetails(isfinal, true);
        // savePartCostingPrice(isfinal);
      }
    });

    function connectSocket() {
      socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.on(PRICING.EventName.updateSummaryQuote, updateSummaryQuote);
      socketConnectionService.on(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
      socketConnectionService.removeListener(PRICING.EventName.updateSummaryQuote, updateSummaryQuote);
      socketConnectionService.removeListener(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
    }

    socketConnectionService.on('disconnect', function () {
      removeSocketListener();
    });

    function sendSubmittedQuote(data) {
      if (data.assyID == rfqAssyID) {
        vm.assymblyData.isSummaryComplete = true;
        getSummaryQuote();
      }
    };
    function revisedQuote(assyid) {
      if (assyid == rfqAssyID) {
        vm.assymblyData.isSummaryComplete = false;
        getSummaryQuote();
        // $state.go(RFQTRANSACTION.RFQ_SUMMARY_STATE, { id: $stateParams.id }, { reload: true });
      }
    }
    let quoteAddAttribute = $scope.$on('quoteAddAttribute', function (event, data) {
      var autocompletePromise = [getDynamicFields()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        var bindHtmlPromise = [bindSummaryDetail(responses)];
        vm.cgBusyLoading = $q.all(bindHtmlPromise).then((response) => {
          var bindQuotePromise = [getSummaryQuote()];
          vm.cgBusyLoading = $q.all(bindQuotePromise).then((response) => {
          });
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    });

    //submit pricing
    //call function for save summary
    let savePartCostingPrice = (isfinal) => {
      _.each(vm.summaryQuote, (item) => {
        var rfqAssyQuotationsAdditionalCost = _.filter(vm.listField, (qty) => { return qty.rfqAssyQuoteID == item.id });
        item.rfqAssyQuotationsAdditionalCost = rfqAssyQuotationsAdditionalCost;
        var costlist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return costQuote.type != vm.CostingType.NRE && costQuote.amount });
        item.total = (_.sumBy(costlist, (sum) => { return parseFloat(sum.amount) }) + parseFloat(item.unitPrice));
        item.materialCost = (_.sumBy(_.filter(costlist, (quote) => { return quote.type == vm.CostingType.Material }), (sum) => { return parseFloat(sum.amount) }));
        item.laborCost = (_.sumBy(_.filter(costlist, (quote) => { return quote.type == vm.CostingType.Labor }), (sum) => { return parseFloat(sum.amount) }));
        item.laborunitPrice = item.laborunitPrice ? parseFloat(item.laborunitPrice) : 0;
        item.laborCost = item.laborCost + parseFloat(item.laborunitPrice);
        item.materialCost = item.materialCost + parseFloat(item.unitPrice);

        //total days for material and 
        var dayslist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return costQuote.days });
        item.materialDays = (_.sumBy(_.filter(dayslist, (quote) => { return quote.type == vm.CostingType.Material }), (sum) => { return parseInt(sum.days) }) + parseInt(item.days ? item.days : 0));
        item.laborDays = (_.sumBy(_.filter(dayslist, (quote) => { return quote.type == vm.CostingType.Labor }), (sum) => { return parseInt(sum.days) }) + parseInt(item.laborday ? item.laborday : 0));
        item.laborday = item.laborday ? parseInt(item.laborday) : 0;
        //get all days list which added on labor
        var laborLeadtimeDays = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return (costQuote.type == vm.CostingType.NRE || costQuote.type == vm.CostingType.TOOL) && costQuote.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Value });
        var totalLaborDays = (_.sumBy(_.filter(laborLeadtimeDays, (days) => { return days.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Value }), (sum) => { return parseInt(sum.days) }));
        item.laborDays = (item.laborDays ? item.laborDays : 0) + (totalLaborDays ? totalLaborDays : 0);
        //check for grater condition
        var laborItem = _.find(laborLeadtimeDays, (ldays) => { return ldays.days > item.laborDays && ldays.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value });
        if (laborItem)
          item.laborDays = laborItem.days;

        //get all days list which added on material
        var materialLeadtimeDays = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return (costQuote.type == vm.CostingType.NRE || costQuote.type == vm.CostingType.TOOL) && costQuote.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value });
        var totalMaterialDays = (_.sumBy(_.filter(materialLeadtimeDays, (days) => { return days.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Value }), (sum) => { return parseInt(sum.days) }));
        item.materialDays = (item.materialDays ? item.materialDays : 0) + (totalMaterialDays ? totalMaterialDays : 0);
        //check for grater condition
        var materialItem = _.find(materialLeadtimeDays, (ldays) => { return ldays.days > item.materialDays && ldays.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value });
        if (materialItem)
          item.materialDays = materialItem.days;
        //get days and cost for NRE
        var nreCostlist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return costQuote.type == vm.CostingType.NRE && costQuote.amount });
        var nreDayslist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return costQuote.type == vm.CostingType.NRE && costQuote.days });
        item.nreCost = _.sumBy(nreCostlist, (sum) => { return parseFloat(sum.amount) * parseFloat(sum.toolingQty) });
        item.nreDays = _.sumBy(nreDayslist, (sum) => { return parseInt(sum.days) });

        //get days and tooling for NRE
        var toolCostlist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return costQuote.type == vm.CostingType.TOOL && costQuote.amount });
        var toolDayslist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => { return costQuote.type == vm.CostingType.TOOL && costQuote.days });
        item.toolingCost = _.sumBy(toolCostlist, (sum) => { return parseFloat(sum.amount) * parseFloat(sum.toolingQty) });
        item.toolingDays = _.sumBy(toolDayslist, (sum) => { return parseInt(sum.days) });
      });
      var summary = {
        summaryQuote: vm.summaryQuote,
        isFinalSubmit: isfinal,
        rfqAssyID: rfqAssyID
      }
      if (isfinal) {
        summary.BOMIssue = vm.assymblyData.partcostingBOMIssue;
        summary.quoteID = vm.quotedetail[0].id;
        summary.internalVersion = vm.assymblyData.partCostingBOMInternalVersion;
        summary.QuoteInDate = vm.assymblyData ? vm.assymblyData.quoteInDate : null;
        summary.QuoteDueDate = vm.assymblyData ? vm.assymblyData.quoteDueDate : null;
        summary.assyStatus = RFQTRANSACTION.RFQ_ASSY_STATUS.FOLLOW_UP.VALUE;
        summary.bomLastVersion = vm.assymblyData ? vm.assymblyData.liveInternalVersion : null;
      }
      vm.cgBusyLoading = PartCostingFactory.saveSummaryQuote().query({ summaryQuoteObj: summary }).$promise.then((response) => {
        BOMFactory.isBOMChanged = false;
        BaseService.currentPageFlagForm = [];
        if (isfinal) {
          if (response && response.data) {
            vm.assymblyData.isSummaryComplete = true;
            //$timeout(() => {
            //    $state.go(RFQTRANSACTION.RFQ_QUOTE_STATE, { id: rfqAssyID, pageType: RFQTRANSACTION.QUOTE_PAGE_TYPE.QUOTE.Name }, { reload: false })
            //}, 1000);
          }

        }
        var autocompletePromise = [getDynamicFields()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
          var bindHtmlPromise = [bindSummaryDetail(responses)];
          vm.cgBusyLoading = $q.all(bindHtmlPromise).then((response) => {
            var bindQuotePromise = [getSummaryQuote()];
            vm.cgBusyLoading = $q.all(bindQuotePromise).then((response) => {
            });
          });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //function roundToFour(num) {
    //    return +(Math.round(num + "e+4") + "e-4");
    //}
    //get total for function
    vm.getTotal = (item, unitprice, data, laborunitPrice) => {
      var listItem = _.filter(vm.listField, (list) => { return list.displayOrder <= item.displayOrder && list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type != vm.CostingType.Adhoc && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL && list.amount });
      var objCheckValue = _.find(listItem, (checkItem) => { return (checkItem.amount && checkItem.amount[checkItem.amount.length - 1] == ".") });
      if (objCheckValue)
        return unitprice;
      else {
        var total = ((_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(unitprice ? unitprice : 0) + parseFloat(laborunitPrice ? laborunitPrice : 0))).toFixed(_amountFilterDecimal);
        return total;
      }
    }

    vm.getFinalTotal = (item, unitprice, laborPrice) => {
      var listItem = _.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL && list.amount });
      var objCheckValue = _.find(listItem, (checkItem) => { return (checkItem.amount && checkItem.amount[checkItem.amount.length - 1] == ".") });
      if (objCheckValue)
        return unitprice;
      else
        return ((_.sumBy(listItem, (sum) => { return parseFloat(sum.amount) }) + parseFloat(unitprice ? unitprice : 0) + parseFloat(laborPrice ? laborPrice : 0))).toFixed(_amountFilterDecimal);
    }

    // apply same data for all quantity
    vm.applyGeneralSelect = (item) => {
      if (vm.assymblyData.isSummaryComplete || vm.summaryQuote.length == 1)
        return false;
      var list = _.filter(vm.listField, (field) => { return field.quoteChargeDynamicFieldID == item.id });
      var i = 0;
      _.each(list, (allfield) => {
        if (i > 0) {
          var unitPrice = allfield.type == vm.CostingType.Labor ? parseFloat(allfield.laborunitPrice) : parseFloat(allfield.unitprice);
          if (parseFloat(unitPrice) > 0 && (allfield.type == vm.CostingType.Labor || allfield.type == vm.CostingType.Material || allfield.type == vm.CostingType.Adhoc)) {
            if (!item.displayPercentage && !item.displayMargin && list[0].amount) {
              var amount = _.clone(list[0].amount);
              if (allfield.type == RFQTRANSACTION.SUMMARY_COSTINGTYPE.TOOL || allfield.type == RFQTRANSACTION.SUMMARY_COSTINGTYPE.NRE)
                amount = parseFloat(amount).toFixed(_amountFilterDecimal);
              else
                amount = parseFloat(amount) > parseFloat(unitPrice) ? parseFloat(unitPrice).toFixed(_amountFilterDecimal) : parseFloat(amount).toFixed(_amountFilterDecimal);
              allfield.margin = parseFloat((((parseFloat(amount) * 100) / ((unitPrice) + parseFloat(amount))))).toFixed(_amountFilterDecimal);
              allfield.percentage = parseFloat((((parseFloat(amount) * 100) / (unitPrice)))).toFixed(_amountFilterDecimal);
              allfield.amount = parseFloat(amount).toFixed(_amountFilterDecimal);
              allfield.days = list[0].days;
              allfield.subTotal = ((_.sumBy((_.filter(vm.listField, (data) => { return data.rfqAssyQuoteID == allfield.rfqAssyQuoteID && data.amount })), (sum) => { return sum.amount }) + unitPrice));
            }
            if (item.displayPercentage && list[0].percentage) {
              allfield.percentage = parseFloat(list[0].percentage).toFixed(_amountFilterDecimal);
              allfield.amount = parseFloat((((parseFloat(allfield.percentage) * (unitPrice)) / 100))).toFixed(_amountFilterDecimal);
              allfield.margin = parseFloat((((parseFloat(allfield.amount) * 100) / ((unitPrice) + parseFloat(allfield.amount))))).toFixed(_amountFilterDecimal);
              allfield.days = list[0].days;
              allfield.subTotal = ((_.sumBy((_.filter(vm.listField, (data) => { return data.rfqAssyQuoteID == allfield.rfqAssyQuoteID && data.amount })), (sum) => { return sum.amount }) + unitPrice));
            }
            if (item.displayMargin && list[0].margin) {
              var marginpercentage = (list[0].margin / 100);
              var salesPrice = ((unitPrice) / (1 - marginpercentage));
              allfield.margin = parseFloat(list[0].margin).toFixed(_amountFilterDecimal);
              allfield.amount = parseFloat(((salesPrice - (unitPrice)))).toFixed(_amountFilterDecimal);
              allfield.percentage = parseFloat((((parseFloat(allfield.amount) * 100) / (unitPrice)))).toFixed(_amountFilterDecimal);
              allfield.days = list[0].days;
              allfield.subTotal = ((_.sumBy((_.filter(vm.listField, (data) => { return data.rfqAssyQuoteID == allfield.rfqAssyQuoteID && data.amount })), (sum) => { return sum.amount }) + unitPrice));
            }
            allfield.toolingQty = parseInt(list[0].toolingQty || list[0].toolingQty == 0 ? list[0].toolingQty : 0);
          } else if (allfield.type == vm.CostingType.NRE || allfield.type == vm.CostingType.TOOL) {
            if (!item.displayPercentage && !item.displayMargin && list[0].amount) {
              var amount = _.clone(list[0].amount);
              if (allfield.type == RFQTRANSACTION.SUMMARY_COSTINGTYPE.TOOL || allfield.type == RFQTRANSACTION.SUMMARY_COSTINGTYPE.NRE)
                amount = parseFloat(amount).toFixed(_amountFilterDecimal);
              else
                amount = parseFloat(amount) > parseFloat(unitPrice) ? parseFloat(unitPrice).toFixed(_amountFilterDecimal) : parseFloat(amount).toFixed(_amountFilterDecimal);
              allfield.margin = '0.00';
              allfield.percentage = '0.00';
              allfield.amount = parseFloat(amount).toFixed(_amountFilterDecimal);
              allfield.days = list[0].days;
            }
            allfield.toolingQty = parseInt(list[0].toolingQty || list[0].toolingQty == 0 ? list[0].toolingQty : 0);
          }

        }
        i = i + 1;
      });
      //   $scope.$apply();
    }
    //total count of days for lead time
    vm.getTotalAdhocDays = (item, days, laborday) => {
      var adhocSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL && list.days })), (sum) => { return parseInt(sum.days) });
      var summary = _.find(vm.summaryQuote, (summary) => { return summary.id == item.rfqAssyQuoteID });
      summary.manualTurnTime = (parseInt(adhocSum ? adhocSum : 0) + parseInt(days ? days : 0) + parseInt(laborday ? laborday : 0));
      return (parseInt(adhocSum ? adhocSum : 0) + parseInt(days ? days : 0) + parseInt(laborday ? laborday : 0));
    }
    //get total days for NRE
    vm.getTotalNreDays = (item, days) => {
      var nreSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type == vm.CostingType.NRE && list.days })), (sum) => { return parseInt(sum.days) });
      return (parseInt(nreSum ? nreSum : 0));
    }
    //get total days for Tool
    vm.getTotalToolDays = (item, days) => {
      var toolSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type == vm.CostingType.TOOL && list.days })), (sum) => { return parseInt(sum.days) });
      return (parseInt(toolSum ? toolSum : 0));
    }
    //get total amount for NRE
    vm.getTotalNRE = (item, days) => {
      var nreSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type == vm.CostingType.NRE && list.amount })), (sum) => { return parseFloat(sum.amount) * parseInt(sum.toolingQty ? sum.toolingQty : 0) });
      return parseFloat((nreSum ? nreSum : 0)).toFixed(_amountFilterDecimal);
    }
    //get total amount for tool
    vm.getTotalTool = (item, days) => {
      var toolSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type == vm.CostingType.TOOL && list.amount })), (sum) => { return parseFloat(sum.amount) * parseInt(sum.toolingQty ? sum.toolingQty : 0) });
      return parseFloat((toolSum ? toolSum : 0)).toFixed(_amountFilterDecimal);
    }
    //get total tooling qty
    vm.getTotalToolQty = (item, qty) => {
      var toolSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type == vm.CostingType.TOOL && list.toolingQty })), (sum) => { return parseInt(sum.toolingQty) });
      return (parseInt(toolSum ? toolSum : 0));
    }
    //get total NRE qty
    vm.getTotalNREQty = (item, qty) => {
      var toolSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type == vm.CostingType.NRE && list.toolingQty })), (sum) => { return parseInt(sum.toolingQty) });
      return (parseInt(toolSum ? toolSum : 0));
    }
    //change days to int
    vm.changeDays = (item) => {
      item.days = parseInt(item.days ? item.days : 0);
      var adhocSum = _.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL })), (sum) => { return parseInt(sum.days) });
      var summary = _.find(vm.summaryQuote, (summary) => { return summary.id == item.rfqAssyQuoteID });
      summary.manualTurnTime = (parseInt(adhocSum ? adhocSum : 0) + parseInt(item.days ? item.days : 0) + parseInt(item.laborday ? item.laborday : 0));
      vm.changevalue();
      return (parseInt(adhocSum ? adhocSum : 0) + parseInt(item.days ? item.days : 0) + parseInt(item.laborday ? item.laborday : 0));
    }

    //get total for all markup
    vm.getTotalDays = (item, days, laborDays) => {
      days = parseInt(days ? days : 0);
      laborDays = parseInt(laborDays ? laborDays : 0);
      var listItem = _.filter(vm.listField, (list) => { return list.displayOrder <= item.displayOrder && list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type != vm.CostingType.Adhoc && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL });
      var totalsum = _.sumBy(listItem, (sum) => { return sum.days });
      return parseInt(totalsum + days + laborDays);
    }

    //change material days
    vm.changeMaterialDays = (item) => {
      if (item) {
        item.days = item.days ? parseInt(item.days) : 0;
        vm.changevalue();
      }
    }
    //change labor days
    vm.changelaborDays = (item) => {
      if (item) {
        item.laborday = item.laborday ? parseInt(item.laborday) : 0;
        vm.changevalue();
      }
    }
    //change labor unit price vm.changeDollar = (item, unitprice, laborPrice)
    vm.chageLaborprice = (quote, laborPrice, unitPrice) => {
      quote.laborunitPrice = parseFloat(quote.laborunitPrice ? quote.laborunitPrice : 0).toFixed(_amountFilterDecimal);
      var listfield = _.filter(vm.listField, (data) => { return data.rfqAssyQuoteID == quote.id && data.type == vm.CostingType.Labor });
      _.each(listfield, (item) => {
        item.laborunitPrice = quote.laborunitPrice;
        vm.changeDollar(item, laborPrice, unitPrice);
      });
      checkQuotePrice();
    }
    //apply all labor
    vm.applyalllabor = () => {
      var i = 0;
      _.each(vm.summaryQuote, (item) => {
        if (i > 0) {
          item.laborunitPrice = vm.summaryQuote[0].laborunitPrice;
          item.laborday = vm.summaryQuote[0].laborday;
          vm.chageLaborprice(item, item.laborunitPrice, item.unitPrice);
        }
        i++;
      });
      checkQuotePrice();
    }

    function checkQuotePrice() {
      var quote = _.find(vm.summaryQuote, (quote) => {
        return !parseFloat(quote.unitPrice) && !parseFloat(quote.laborunitPrice);
      })
      if (quote) {
        $scope.$emit(RFQTRANSACTION.EVENT_NAME.isSummaryNotAttributes, { isSubmitDisable: true, isSummaryNotAttributes: vm.dynamicFieldList.length == 0 ? true : false });
      } else {
        $scope.$emit(RFQTRANSACTION.EVENT_NAME.isSummaryNotAttributes, { isSubmitDisable: false, isSummaryNotAttributes: vm.dynamicFieldList.length == 0 ? true : false });
      }
    }
    //export excel with multiple sheet.
    //1. summary quote same as summary screen.
    //2. notes which added in comments section
    //3. all requirement added in RFQ page..
    let exportSummaryDetails = () => {
      var summaryList = [];
      var summaryObj = {
        Group: RFQTRANSACTION.SUMMARY_COSTINGTYPE.Material,
        Title: RFQTRANSACTION.SUMMARY.MaterialCostDollar
      };
      for (var i = 0; i < vm.summaryQuote.length; i++) {
        summaryObj[stringFormat("{0}_{1}{2}($)", vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType == vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType == vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = vm.summaryQuote[i].unitPrice ? parseFloat((parseFloat(vm.summaryQuote[i].unitPrice)).toFixed(_amountFilterDecimal)) : 0;// 
        summaryObj[stringFormat("{0}_{1}{2}(Days)", vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType == vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType == vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = vm.summaryQuote[i].days ? vm.summaryQuote[i].days : 0;
        summaryObj[stringFormat("{0}_{1}{2} Tooling Qty", vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType == vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType == vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = 0;
      }
      summaryList.push(summaryObj);
      _.each(vm.dynamicField, (dataField) => {
        if (dataField.fieldName) {
          var obj = {};
          obj.Group = dataField.Type ? dataField.Type == "LB" ? vm.CostingType.Labor : dataField.Type : RFQTRANSACTION.SUMMARY.TOTAL;
          obj.Title = dataField.fieldName;
          for (var i = 0; i < vm.summaryQuote.length; i++) {
            var objList = _.find(vm.listField, (dynamic) => { return dataField.id == dynamic.quoteChargeDynamicFieldID && dynamic.rfqAssyQuoteID == vm.summaryQuote[i].id });
            var price = 0;
            var days = 0;
            var toolQty = 0;
            if (dataField.Type == "LB") {
              price = parseFloat(vm.summaryQuote[i].laborunitPrice ? vm.summaryQuote[i].laborunitPrice : 0);
              days = parseInt(vm.summaryQuote[i].laborday ? vm.summaryQuote[i].laborday : 0);
            }
            else if (!dataField.Type) {
              if (dataField.costingType == vm.CostingType.NRE) {
                price = parseFloat(vm.getTotalNRE(objList, true));
                days = parseInt(vm.getTotalNreDays(objList, true));
              }
              else if (dataField.costingType == vm.CostingType.TOOL) {
                days = parseInt(vm.getTotalToolDays(objList, true));
                price = parseFloat(vm.getTotalTool(objList, true));
                toolQty = parseInt(vm.getTotalToolQty(objList, true));
              }
              else {
                price = parseFloat(vm.getFinalTotal(objList, vm.summaryQuote[i].unitPrice, vm.summaryQuote[i].laborunitPrice));
                days = parseFloat(vm.getTotalAdhocDays(objList, vm.summaryQuote[i].days, vm.summaryQuote[i].laborday)); //(_.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == vm.summaryQuote[i].id && list.days != null && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL })), (sum) => { return sum.days }) + vm.summaryQuote[i].days);
              }
            }
            else if (!dataField.displayMargin && !dataField.displayPercentage) {
              price = objList.amount ? parseFloat(parseFloat(objList.amount).toFixed(_amountFilterDecimal)) : 0;
              days = objList.days ? objList.days : 0;
              toolQty = objList.toolingQty ? objList.toolingQty : 0;
            }
            else if (dataField.displayMargin)
              price = objList.margin ? parseFloat(parseFloat(objList.margin).toFixed(_amountFilterDecimal)) : 0;
            else if (dataField.displayPercentage)
              price = objList.percentage ? parseFloat(parseFloat(objList.percentage).toFixed(_amountFilterDecimal)) : 0;
            obj[stringFormat("{0}_{1}{2}($)", vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType == vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType == vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = price;// 
            obj[stringFormat("{0}_{1}{2}(Days)", vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType == vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType == vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = days;
            obj[stringFormat("{0}_{1}{2} Tooling Qty", vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType == vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType == vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = toolQty;
          }
          summaryList.push(obj);
        }
      });
      var notesList = [];
      var description = 1;
      _.each(vm.lineitemsDescriptionList, (desc) => {
        if (desc.displayDescription.length > 0 || desc.rfqLineitemsAddtionalComment.length > 0) {
          var comment = "";
          _.each(desc.displayDescription, (comm) => {
            comment = stringFormat("{0}{1}\n", comment, comm);
          });
          var obj = {};
          obj.ID = description;
          obj.Item = desc.lineID,
            obj[RFQTRANSACTION.SUMMARY.ERROR] = comment
          obj[RFQTRANSACTION.SUMMARY.AdditionalComment] = desc.rfqLineitemsAddtionalComment.length > 0 ? desc.rfqLineitemsAddtionalComment[0].description : "";
          notesList.push(obj);
          description++;
        }
      });
      if (notesList.length == 0) {
        var obj = {};
        obj['#'] = "";
        obj.Item = "",
          obj[RFQTRANSACTION.SUMMARY.ERROR] = ""
        obj[RFQTRANSACTION.SUMMARY.AdditionalComment] = "";
        notesList.push(obj);
      }
      var termsList = [];
      var noteId = 1;
      _.each(vm.termsandcondition, (terms) => {
        if (terms.additional) {
          var condition = {
            '#': noteId,
          }
          condition[RFQTRANSACTION.SUMMARY.REQUIREMENT] = terms.additional ? terms.additional : "";
          termsList.push(condition);
          noteId++;
        }
      });
      var opts = [{ sheetid: RFQTRANSACTION.SUMMARY.Summary, header: true }, { sheetid: RFQTRANSACTION.SUMMARY.Notes, header: false }, { sheetid: RFQTRANSACTION.SUMMARY.Terms, header: false }];
      var res = alasql(stringFormat(RFQTRANSACTION.SUMMARY.EXCELQUERY, vm.assymblyData.componentAssembly.mfgPN + "_QuoteSummary"),
        [opts, [summaryList, notesList, termsList]]);
    }

    //receive event from BOM for export summary details
    $scope.$on(PRICING.EventName.ExportSummary, (name, data) => {
      exportSummaryDetails();
    });
    // on move to other controller destroy all event
    $scope.$on('$destroy', function () {
      removeSocketListener();
      // revisedquote();
      quoteAddAttribute();
      BaseService.currentPageFlagForm = [];
      BOMFactory.isBOMChanged = false;
    });

    //go to Part Costing Tab
    vm.goToPartCosting = () => {
      BaseService.goToPartCosting(rfqAssyID);
      return false;
    }
    //go to Labor Tab
    vm.goToLabor = () => {
      BaseService.goToLabor(rfqAssyID, vm.assymblyData.partID);
      return false;
    }

    //open quote attribute pop up
    vm.addUpdateQuoteAttributes = (isUpdate, item) => {
      if (BOMFactory.isBOMChanged) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_BODY_MESSAGE_SUMMARY,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      }
      else {
        if (isUpdate) {
          vm.updateQuoteAttribute(item);
        } else {
          openQuoteAttribute();
        }
      }
    }

    function openQuoteAttribute(ev) {
      var data = {};
      let popUpData = { popupAccessRoutingState: [USER.ADMIN_QUOTE_DYNAMIC_FIELDS_STATE], pageNameAccessLabel: CORE.PageName.quote_attribute };
      let isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
          CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
          ev,
          data).then(() => {
          }, (data) => {
            if (data) {
              BaseService.currentPageFlagForm = [true];
              BOMFactory.isBOMChanged = true;
              $scope.$broadcast("quoteAddAttribute");
            }
          },
            (err) => {
            });
      }
    }
    vm.updateQuoteAttribute = (item) => {
      var data = {
        id: item.id
      };
      DialogFactory.dialogService(
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
        null,
        data).then(() => {
        }, (data) => {
          if (data) {
            BaseService.currentPageFlagForm = [true];
            BOMFactory.isBOMChanged = true;
            $scope.$broadcast("quoteAddAttribute");
          }
        }, (err) => {
        });
    }
    vm.GoToQuoteAttributelist = () => {
      BaseService.goToQuoteAttributeList();
    }

    vm.removeQuoteAttribute = (item) => {
      vm.deletedQuoteAttribute = vm.deletedQuoteAttribute || [];
      if (item) {
        let obj = {
          title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
          textContent: stringFormat(RFQTRANSACTION.SUMMARY_MESSAGE.DELETE_QUOTE_ATTRIBUTE_MSG, item.fieldName),//"Are you Sure want to remove <b>" + item.fieldName + "</b> quote attribute from this Quote.<br/> Press YES to continue.",
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.confirmDiolog(obj).then(() => {
          let deletedAttributeField = _.filter(vm.dynamicField, (x) => { return x.id == item.id; })
          if (deletedAttributeField.length > 0) {
            _.each(deletedAttributeField, (dynamicFieldObj) => {
              if (!dynamicFieldObj.isLast)
                vm.dynamicField.splice(vm.dynamicField.indexOf(dynamicFieldObj), 1)
            })
            if (_.filter(vm.dynamicField, x => x.Type == item.Type).length == 0) {
              let objNREisAvailable = _.find(vm.dynamicField, a => a.costingType == item.Type);
              if (objNREisAvailable && !objNREisAvailable.isLast)
                vm.dynamicField.splice(vm.dynamicField.indexOf(objNREisAvailable), 1)
            }
          }
          let deletedAttributeFieldFromNewAdded = _.filter(vm.AddNewOptionalAttribute, (x) => { return x.id == item.id; })
          if (deletedAttributeFieldFromNewAdded.length > 0) {
            _.each(deletedAttributeFieldFromNewAdded, (dynamicAddedFieldObj) => {
              if (!dynamicAddedFieldObj.isLast)
                vm.AddNewOptionalAttribute.splice(vm.AddNewOptionalAttribute.indexOf(dynamicAddedFieldObj), 1)
            })
          }
          let deletedAttribute = _.filter(vm.listField, (x) => { return x.quoteChargeDynamicFieldID == item.id; })
          if (deletedAttribute.length > 0) {
            _.each(deletedAttribute, (dynamicObj) => {
              dynamicObj.amount = 0;
              dynamicObj.days = 0;
              dynamicObj.toolingQty = 0;
              vm.changevalue();
              vm.changeDays(dynamicObj);
              vm.listField.splice(vm.listField.indexOf(dynamicObj), 1)
              _.each(vm.summaryQuote, (item) => {
                item.deletedrfqAssyQuotationsAdditionalCost = item.deletedrfqAssyQuotationsAdditionalCost || [];
                var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == dynamicObj.quoteChargeDynamicFieldID });
                if (objItem && !objItem.isLast) {
                  item.rfqAssyQuotationsAdditionalCost.splice(item.rfqAssyQuotationsAdditionalCost.indexOf(objItem), 1);
                  item.deletedrfqAssyQuotationsAdditionalCost.push(objItem);
                }
              })
            })
          }
          //bindSummaryDetailList();
          return true;
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    }

    vm.AddOptionalQuoteAttribute = (item) => {
      if (BOMFactory.isBOMChanged) {
        var model = {
          title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
          textContent: RFQTRANSACTION.SUMMARY_MESSAGE.ADD_REMOVE_ATTRIBUTE_ALERTMESSAGE,
          multiple: true
        };
        DialogFactory.alertDialog(model);
      }
      else {
        if (item) {
          let data = {
            CostingType: item,
            costingSummaryData: _.filter(vm.listField, x => x.type == item)
          }
          DialogFactory.dialogService(
            RFQTRANSACTION.SELECT_OPTIONAL_QUOTE_ATTRIBUTE_POPUP_CONTROLLER,
            RFQTRANSACTION.SELECT_OPTIONAL_QUOTE_ATTRIBUTE_POPUP_VIEW,
            null,
            data).then((data) => {
              if (data) {
                vm.removedOptionalAttribute = [];
                _.each(data, (attrObj) => {
                  if (attrObj.selected)
                    vm.AddNewOptionalAttribute.push(attrObj);
                  else
                    vm.removedOptionalAttribute.push(attrObj);
                })
                let deletedAttributeFieldFromNewAdded = _.filter(vm.AddNewOptionalAttribute, (x) => {
                  let removeditem = _.find(vm.removedOptionalAttribute, (removedItemObj) => {
                    return x.id == removedItemObj.id;
                  })
                  if (removeditem) {
                    return true;
                  }
                })
                if (deletedAttributeFieldFromNewAdded.length > 0) {
                  _.each(deletedAttributeFieldFromNewAdded, (dynamicAddedFieldObj) => {
                    vm.AddNewOptionalAttribute.splice(vm.AddNewOptionalAttribute.indexOf(dynamicAddedFieldObj), 1)
                  })
                }
                let deletedAttributeField = _.filter(vm.dynamicField, (x) => {
                  let removeditem = _.find(vm.removedOptionalAttribute, (removedItemObj) => {
                    return x.id == removedItemObj.id;
                  })
                  if (removeditem) {
                    return true;
                  }
                })
                if (deletedAttributeField.length > 0) {
                  _.each(deletedAttributeField, (dynamicFieldObj) => {
                    vm.dynamicField.splice(vm.dynamicField.indexOf(dynamicFieldObj), 1)
                  })
                  if (_.filter(vm.dynamicField, x => x.Type == item).length == 0) {
                    let objNREisAvailable = _.find(vm.dynamicField, a => a.costingType == item);
                    if (objNREisAvailable)
                      vm.dynamicField.splice(vm.dynamicField.indexOf(objNREisAvailable), 1)
                  }
                }
                let deletedAttribute = _.filter(vm.listField, (x) => {
                  let removeditem = _.find(vm.removedOptionalAttribute, (removedItemObj) => {
                    return x.quoteChargeDynamicFieldID == removedItemObj.id;
                  })
                  if (removeditem) {
                    return true;
                  }
                  //return x.quoteChargeDynamicFieldID == item.id;
                })
                if (deletedAttribute.length > 0) {
                  _.each(deletedAttribute, (dynamicObj) => {
                    dynamicObj.amount = 0;
                    dynamicObj.days = 0;
                    dynamicObj.toolingQty = 0;
                    vm.changevalue();
                    vm.changeDays(dynamicObj);
                    vm.listField.splice(vm.listField.indexOf(dynamicObj), 1)
                    _.each(vm.summaryQuote, (item) => {
                      item.deletedrfqAssyQuotationsAdditionalCost = item.deletedrfqAssyQuotationsAdditionalCost || [];
                      var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => { return additionalCost.quoteChargeDynamicFieldID == dynamicObj.quoteChargeDynamicFieldID });
                      if (objItem) {
                        item.rfqAssyQuotationsAdditionalCost.splice(item.rfqAssyQuotationsAdditionalCost.indexOf(objItem), 1);
                        item.deletedrfqAssyQuotationsAdditionalCost.push(objItem);
                      }
                    })
                  })
                }
                //vm.AddNewOptionalAttribute = data;
                getDynamicFields(true);
              }
            }, (err) => {
            });
        }
      }
    }

    // web socket call if user update labor cost or pricing
    function updateSummaryQuote(data) {
      $timeout(() => {
        if (data.rfqAssyID == rfqAssyID) {
          var obj = {
            rfqAssyID: rfqAssyID,
            isSummaryComplete: vm.assymblyData.isSummaryComplete
          };
          PartCostingFactory.retriveSummaryQuote().query({ summaryGetobj: obj }).$promise.then((quote) => {
            vm.summaryQuote = _.sortBy(quote.data, ['requestedQty', 'totalDays']);
            _.each(vm.summaryQuote, (summary) => {
              summary.laborunitPrice = summary.laborunitPrice ? parseFloat(summary.laborunitPrice).toFixed(_amountFilterDecimal) : "0.00";
              summary.unitPrice = summary.unitPrice ? parseFloat(summary.unitPrice).toFixed(_amountFilterDecimal) : "0.00";
              var listfield = _.filter(vm.listField, (lst) => { return lst.rfqAssyQuoteID == summary.id && lst.type == (data.isLabor ? vm.CostingType.Labor : vm.CostingType.Material) });
              _.each(listfield, (item) => {
                item.laborunitPrice = summary.laborunitPrice;
                item.unitprice = summary.unitPrice;
                vm.changePercentage(item, data.isLabor ? summary.laborunitPrice : summary.unitPrice);
              });
            });
          });
        }
      }, 1000);
    }
  }
})();
