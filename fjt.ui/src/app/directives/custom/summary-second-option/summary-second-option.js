(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('summarySecondOption', summarySecondOption);

  /** @ngInject */
  function summarySecondOption() {
    var directive = {
      restrict: 'E',
      scope: {
        id: '='
      },
      templateUrl: 'app/directives/custom/summary-second-option/summary-second-option.html',
      controller: SummarySecondOptionDirectiveController,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function SummarySecondOptionDirectiveController($state, RFQTRANSACTION, $scope, $rootScope, $q, $timeout, hotRegisterer, PartCostingFactory, MasterFactory, BaseService, DialogFactory, CORE, PRICING, CustomerConfirmationPopupFactory, BOMFactory, USER, socketConnectionService, ComponentPriceBreakDetailsFactory) {
      const vm = this;
      var rfqAssyID = $scope.id;
      // get handsontable object
      var _hotRegisterer = null;
      vm.isNoDataFound = true;
      vm.selectedItems = [];
      vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NO_SUMMARY;
      vm.LabelConstant = CORE.LabelConstant;
      vm.CostingTypeName = RFQTRANSACTION.COSTIING_TYPE_NAME;
      vm.CostingType = RFQTRANSACTION.SUMMARY_COSTINGTYPE;
      vm.timeType = RFQTRANSACTION.RFQ_TURN_TYPE;
      vm.quoteMarginType = CORE.QUOTE_ATTRIBUTE_MARGIN_TYPE;
      vm.AddNewOptionalAttribute = [];
      vm.loginUser = BaseService.loginUser;
      vm.loginUserId = vm.loginUser.userid;

      // Added custom cell renderer
      // It will be call after all cell change and render events
      // Add cells color based on error code here
      Handsontable.renderers.registerRenderer('cellRenderer', function (instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }

        switch (prop) {
          case 'copyToAll': {
            td.style.background = '#FFFFFF';
            td.style.borderBottom = '0px';
            cellProperties.editor = false;
            const summaryObj = vm.summaryModel[row];
            if (summaryObj && (summaryObj.isMaterialCostLable || summaryObj.isCustomPartLabel || summaryObj.isLaborCostLable || summaryObj.isOverheadCostLable || summaryObj.isLast || !summaryObj.fieldName || summaryObj.isLaborQupteAddOptional || summaryObj.isAdhocAddOptional || summaryObj.isAllAddOptional || summaryObj.isNREAddOptional || summaryObj.isToolingAddOptional || summaryObj.isMaterialCostingAddOptional)) {
              td.innerHTML = '';
              td.title = '';
            }
            else {
              td.innerHTML = '<md-icon role="img" md-font-icon="iconsm-copy-to-all" class="material-icons mat-icon iconsm-copy-to-all cursor-pointer padding-top-3"></md-icon>';
              td.title = 'Copy First to All';
            }
            break;
          }
          case 'costingName': {
            cellProperties.readOnly = true;
            const summaryObj = vm.summaryModel[row];
            td.title = '';
            if (summaryObj && summaryObj.tooltip) {
              td.title = summaryObj.tooltip;
            }
            if (summaryObj && (summaryObj.isLast || !summaryObj.fieldName || summaryObj.isMaterialCostLable || summaryObj.isCustomPartLabel)) {
              td.style.fontWeight = 'bold';
              td.style.color = '#000';
              td.style.background = '#d7fbd7';
            }
            if (summaryObj && (summaryObj.isLaborQupteAddOptional || summaryObj.isAdhocAddOptional || summaryObj.isAllAddOptional || summaryObj.isNREAddOptional || summaryObj.isToolingAddOptional || summaryObj.isMaterialCostingAddOptional || summaryObj.costingName === vm.CostingTypeName.MATERIALCOSTING)) {
              td.style.color = '#039be5';
              td.style.fontWeight = 'bold';
              td.style.background = '';
            }
            if (summaryObj && (summaryObj.costingType === vm.CostingType.FinalEA)) {
              td.style.background = '#b1edfc';
            }
            if (summaryObj && (summaryObj.isMaterialCostTotal || summaryObj.isCostTotal || summaryObj.isCostTotalWithAttribute)) {
              td.style.background = '#dbf8ff';
            }
            break;
          }
          default: {
            // if (row != 0)
            td.style.textAlign = 'right';
            if (row === 0) {
              cellProperties.readOnly = true;
            }
            const summaryObj = vm.summaryModel[row];
            if (summaryObj && (summaryObj.isLast || !summaryObj.fieldName || summaryObj.isMaterialCostLable || summaryObj.isCustomPartLabel)) {
              td.style.fontWeight = 'bold';
              td.style.color = '#000';
              if (summaryObj.costingName !== vm.CostingTypeName.MATERIALCOSTING) {
                td.style.background = '#d7fbd7';
              }
              if (!summaryObj.isMaterialCostLable && !summaryObj.isCustomPartLabel) {
                cellProperties.readOnly = true;
              }
            }
            if (vm.assemblyData && vm.assemblyData.isSummaryComplete) {
              cellProperties.readOnly = true;
            }
            if (prop.includes('toolingQty_') && summaryObj && !(summaryObj.Type === vm.CostingType.NRE || summaryObj.costingType === vm.CostingType.NRE || summaryObj.Type === vm.CostingType.TOOL || summaryObj.costingType === vm.CostingType.TOOL)) {
              cellProperties.readOnly = true;
            }
            if (summaryObj && (summaryObj.isLaborQupteAddOptional || summaryObj.isAdhocAddOptional || summaryObj.isAllAddOptional || summaryObj.isNREAddOptional || summaryObj.isToolingAddOptional || summaryObj.isMaterialCostingAddOptional)) {
              cellProperties.readOnly = true;
            }
            if (summaryObj && (summaryObj.isLaborCostLable || summaryObj.isCustomPartLabel || summaryObj.isMaterialCostLable) && !prop.includes('days_') && !prop.includes('toolingQty_')) {
              cellProperties.readOnly = true;
            }
            if (vm.assemblyData && (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId)) {
              cellProperties.readOnly = true;
            }
            if (summaryObj && (summaryObj.costingType === vm.CostingType.FinalEA)) {
              td.style.background = '#b1edfc';
              td.style.fontSize = '16px';
            }
            if (summaryObj && (summaryObj.isMaterialCostTotal || summaryObj.isCostTotal || summaryObj.isCostTotalWithAttribute)) {
              td.style.background = '#dbf8ff';
            }
            if (summaryObj && summaryObj.displayPercentage && !cellProperties.prop.includes('days_') && !cellProperties.prop.includes('toolingQty_')) {
              const currentCellValue = summaryObj[cellProperties.prop];
              if (!isNaN(currentCellValue) && parseFloat(currentCellValue) > 100) {
                td.style.background = '#ff8000';
              }
            }
            break;
          }
        }
      });
      // Copy First attribute value to all as horizontally
      vm.CopyFirstToAll = (row) => {
        if (row !== null) {
          const summaryObj = vm.summaryModel[row];
          if (summaryObj && summaryObj.dynamicFieldId !== null && !vm.assemblyData.isSummaryComplete && vm.summaryQuote.length !== 1) {
            const dynamicFieldObj = _.find(vm.dynamicField, { id: summaryObj.dynamicFieldId, fieldName: summaryObj.fieldName });
            if (dynamicFieldObj) {
              vm.applyGeneralSelect(dynamicFieldObj, summaryObj.custPartId);
              vm.changevalue();
              vm.summaryModel = [];
              vm.customPartModel = [];
              vm.customPartDetail = [];
              $timeout(() => {
                updateHeader();
              });
            }
          }
        }
      };
      // Change Child attribute calculation based on the ref. attribute mapping
      vm.changeChildAttributeClaculation = (listFieldObj, unitPrice) => {
        const actualUnitPrice = unitPrice;
        const attributeDetList = _.filter(vm.dynamicFieldList, { refAttributeID: listFieldObj.quoteChargeDynamicFieldID });
        _.each(attributeDetList, (attributeDet) => {
          unitPrice = actualUnitPrice;
          let listFieldRefObj = _.find(vm.listField, (listfield) => { if (listfield.rfqAssyQuoteID === listFieldObj.rfqAssyQuoteID && listfield.quoteChargeDynamicFieldID === attributeDet.id) { return listfield; } });
          if (listFieldObj.refCustomPartQuoteID) {
            listFieldRefObj = _.find(vm.listField, (listfield) => { if (listfield.rfqAssyQuoteID === listFieldObj.rfqAssyQuoteID && listfield.quoteChargeDynamicFieldID === attributeDet.id && listfield.refCustomPartQuoteID === listFieldObj.refCustomPartQuoteID) { return listfield; } });
          }
          if (listFieldRefObj) {
            unitPrice = unitPrice + parseFloat(listFieldObj.amount);
            vm.RefAttributePrice = 0;
            vm.refAttributePriceCalculation(listFieldObj, unitPrice, listFieldObj.rfqAssyQuoteID, listFieldObj.refCustomPartQuoteID, true);
            if (vm.RefAttributePrice > 0) {
              unitPrice = vm.RefAttributePrice;
            }
            vm.changeDollar(listFieldRefObj, unitPrice);
            vm.changeChildAttributeClaculation(listFieldRefObj, actualUnitPrice);
          }
        });
      };

      // Create dynamic context list
      function initDynamicContextMenu() {
        // context menu object
        vm.dynamicContextMenu = {
          contextMenu: {
            items: {
              'go_to_material_cost': {
                name: 'Go To Material Cost',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && (summaryObj.isMaterialCostLable || summaryObj.isCustomPartLabel)) {
                    return false;
                  }
                  else { return true; }
                },
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  vm.goToPartCosting();
                }
              },
              'go_to_part': {
                name: 'Go To Part',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && summaryObj.isCustomPartLabel) {
                    return false;
                  }
                  else { return true; }
                },
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  const summaryObj = vm.summaryModel[options.start.row];
                  if (summaryObj && summaryObj.custPartId) {
                    vm.gotoPartDetails(summaryObj.custPartId);
                  }
                }
              },
              'go_to_Labor': {
                name: 'Go To Labor Cost',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && !summaryObj.isLaborCostLable) {
                    return true;
                  }
                },
                disabled: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  vm.goToLabor();
                }
              },
              'add_optional_material_costing': {
                name: 'Add Optional Material Quote Attribute',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && (summaryObj.costingName === vm.CostingTypeName.MATERIALCOSTING || summaryObj.isCustomPartLabel)) {
                    return false;
                  }
                  else { return true; }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }
                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  vm.AddOptionalQuoteAttribute(vm.CostingType.Material);
                }
              },
              'add_optional_labor_quote_attribute': {
                name: 'Add Optional Labor Quote Attribute',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && !summaryObj.isLaborQupteAddOptional) {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }
                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  vm.AddOptionalQuoteAttribute(vm.CostingType.Labor);
                }
              },
              'add_optional_ad_hoc': {
                name: 'Add Optional Overhead Quote Attribute',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && !summaryObj.isAdhocAddOptional) {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }
                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  vm.AddOptionalQuoteAttribute(vm.CostingType.Adhoc);
                }
              },
              'add_optional_all': {
                name: 'Add Optional All Quote Attribute',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && !summaryObj.isAllAddOptional) {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }
                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  vm.AddOptionalQuoteAttribute(vm.CostingType.ALL);
                }
              },
              'add_optional_nre': {
                name: 'Add Optional NRE Quote Attribute',
                hidden: function () {
                  let selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && !summaryObj.isNREAddOptional) {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }
                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  vm.AddOptionalQuoteAttribute(vm.CostingType.NRE);
                }
              },
              'add_optional_tooling': {
                name: 'Add Optional Tooling Quote Attribute',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && !summaryObj.isToolingAddOptional) {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }
                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  vm.AddOptionalQuoteAttribute(vm.CostingType.TOOL);
                }
              },
              'copy_all': {
                name: 'Copy First to All',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && (summaryObj.isMaterialCostLable || summaryObj.isCustomPartLabel || summaryObj.isLaborCostLable || summaryObj.isOverheadCostLable || summaryObj.isLast || !summaryObj.fieldName || summaryObj.isLaborQupteAddOptional || summaryObj.isAdhocAddOptional || summaryObj.isAllAddOptional || summaryObj.isNREAddOptional || summaryObj.isToolingAddOptional || summaryObj.isMaterialCostingAddOptional)) {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete || vm.summaryQuote.length === 1) {
                    return true;
                  }

                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }

                  let selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }

                  const summaryObj = vm.summaryModel[options.start.row];
                  if (summaryObj && summaryObj.dynamicFieldId !== null && !vm.assemblyData.isSummaryComplete && vm.summaryQuote.length !== 1) {
                    const dynamicFieldObj = _.find(vm.dynamicField, { id: summaryObj.dynamicFieldId, fieldName: summaryObj.fieldName });
                    if (dynamicFieldObj) {
                      vm.applyGeneralSelect(dynamicFieldObj, summaryObj.custPartId);
                      vm.changevalue();
                      vm.summaryModel = [];
                      vm.customPartModel = [];
                      vm.customPartDetail = [];
                      $timeout(() => {
                        updateHeader();
                      });
                    }
                  }
                }
              },
              'update': {
                name: 'Update Quote Attribute',
                hidden: function () {
                  var selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && (summaryObj.isMaterialCostLable || summaryObj.isCustomPartLabel || summaryObj.isLaborCostLable || summaryObj.isOverheadCostLable || summaryObj.isLast || !summaryObj.fieldName || summaryObj.isLaborQupteAddOptional || summaryObj.isAdhocAddOptional || summaryObj.isAllAddOptional || summaryObj.isNREAddOptional || summaryObj.isToolingAddOptional || summaryObj.isMaterialCostingAddOptional)) {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }

                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }

                  let selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }
                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && summaryObj.isLast) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const summaryObj = vm.summaryModel[options.start.row];
                  if (summaryObj && summaryObj.dynamicFieldId !== null && !vm.assemblyData.isSummaryComplete) {
                    const dynamicFieldObj = _.find(vm.dynamicField, { id: summaryObj.dynamicFieldId, fieldName: summaryObj.fieldName });
                    if (dynamicFieldObj) {
                      vm.addUpdateQuoteAttributes(true, dynamicFieldObj);
                      vm.changevalue();
                      //vm.summaryModel = [];
                      //$timeout(() => {
                      //  updateHeader();
                      //})
                    }
                  }
                }
              },
              'remove': {
                name: 'Remove Quote Attribute',
                hidden: function () {
                  let selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }

                  const summaryObj = vm.summaryModel[row];
                  if (summaryObj && summaryObj.dynamicFieldId) {
                    const dynamicFieldObj = _.find(vm.dynamicField, { id: summaryObj.dynamicFieldId, fieldName: summaryObj.fieldName });
                    if (dynamicFieldObj && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast && !dynamicFieldObj.applyToAll) {
                      if (dynamicFieldObj.Type === vm.CostingType.Material || dynamicFieldObj.costingType === vm.CostingType.Material || dynamicFieldObj.Type === vm.CostingType.Labor || dynamicFieldObj.costingType === vm.CostingType.Labor || dynamicFieldObj.Type === vm.CostingType.Adhoc || dynamicFieldObj.costingType === vm.CostingType.Adhoc || dynamicFieldObj.Type === vm.CostingType.ALL || dynamicFieldObj.costingType === vm.CostingType.ALL) {
                        if (!dynamicFieldObj.displayPercentage && !dynamicFieldObj.displayMargin) {
                          return false;
                        }
                        else {
                          return true;
                        }
                      }
                      else { return false; }
                    }
                    else {
                      return true;
                    }
                  }
                  else {
                    return true;
                  }
                },
                disabled: function () {
                  if (vm.assemblyData.isSummaryComplete) {
                    return true;
                  }
                  if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
                    return true;
                  }

                  let selected = _hotRegisterer.getSelected();
                  if (!selected) { return true; }

                  selected = selected[0];

                  const row = selected[0];
                  const col = selected[1];

                  if (row === null || col !== 1) {
                    return true;
                  }
                },
                callback: function (key, options) {
                  options = options[0];
                  if (!options.start) {
                    return;
                  }
                  const summaryObj = vm.summaryModel[options.start.row];
                  if (summaryObj && summaryObj.dynamicFieldId !== null && !vm.assemblyData.isSummaryComplete) {
                    const dynamicFieldObj = _.find(vm.dynamicField, { id: summaryObj.dynamicFieldId, fieldName: summaryObj.fieldName });
                    if (dynamicFieldObj) {
                      if (dynamicFieldObj.Type === vm.CostingType.Material || dynamicFieldObj.costingType === vm.CostingType.Material) {
                        vm.removeQuoteAttribute(dynamicFieldObj);
                      }
                      else {
                        vm.removeQuoteAttribute(dynamicFieldObj, vm.dynamicField);
                      }
                      vm.changevalue();
                      //vm.summaryModel = [];
                      //$timeout(() => {
                      //  updateHeader();
                      //})
                    }
                  }
                }
              }
            }
          }
        };
      }
      // Initialize Model for bind data
      vm.summaryModel = [];
      vm.customPartModel = [];
      vm.customPartDetail = [];
      vm.finalEAModel = [];
      // Reset Model for initial state
      function modelReset() {
        vm.laborModel = [{
          costingName: 'Labor Costing',
          isLaborQupteAddOptional: true,
          fieldName: 'Labor Costing'
        }, {
          costingName: 'Labor Cost($)',
          isLaborCostLable: true,
          fieldName: 'Labor Cost($)'
        }];
        vm.adhocModel = [{
          costingName: 'Overhead Costing',
          isAdhocAddOptional: true,
          fieldName: 'Overhead Costing'
        }, {
          costingName: 'Overhead Cost($)',
          isOverheadCostLable: true,
          fieldName: 'Overhead Cost($)'
        }];
        vm.allModel = [{
          costingName: 'All Costing (Material + Labor + Overhead)',
          isAllAddOptional: true,
          fieldName: 'All Costing (Material + Labor + Overhead)'
        }];
        vm.nreModel = [{
          costingName: 'NRE Costing',
          isNREAddOptional: true,
          fieldName: 'NRE Costing'
        }];
        vm.toolModel = [{
          costingName: 'Tooling Costing',
          isToolingAddOptional: true,
          fieldName: 'Tooling Costing'
        }];
      }
      // Handson table settings
      vm.settings = {
        rowHeaders: false,
        colWidths: function (index) {
          if (index === 0) {
            return 35;
          } else if (index === 1) {
            return 335;
          } else {
            return 100;
          }
        },
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: true,
        renderAllRows: true,
        fixedColumnsLeft: 2,
        stretchH: 'all',
        contextMenu: true,
        mergeCells: true,
        manualColumnFreeze: true,
        manualColumnResize: true,
        selectionMode: 'single',
        fillHandle: false,
        nestedRows: true,
        className: 'applyFilter',
        afterInit: function () {
          window.setTimeout(() => {
            _hotRegisterer = hotRegisterer.getInstance('hot-summary');
            if (_hotRegisterer) {
              _hotRegisterer.validateCells();
            }
            setHandsontableHeight();
          });
        },
        afterChange: (changes, source) => {
          switch (source) {
            case 'edit': {
              changes.forEach((item) => {
                const field = item[1];
                const row = item[0];
                const oldValue = item[2];
                let newValue = item[3];
                if (oldValue === newValue) {
                  return;
                }

                vm.changevalue();
                if (!(parseFloat(newValue).toFixed(_unitFilterDecimal))) {
                  newValue = 0;
                }
                const summaryObj = vm.summaryModel[row];
                const actualField = field.replace('days_', '').replace('toolingQty_', '');
                const fieldsummaryQuoteId = stringFormat('{0}_{1}', actualField, 'summaryQuoteId');
                const summaryQuotedId = summaryObj[fieldsummaryQuoteId];
                const summaryQuoteObj = _.find(vm.summaryQuote, { id: summaryQuotedId });
                const fielddynamicFieldId = stringFormat('{0}_{1}', actualField, 'dynamicFieldId');
                const dynamicFieldId = summaryObj[fielddynamicFieldId];
                const dynamicFieldObj = _.find(vm.dynamicField, { id: dynamicFieldId, fieldName: summaryObj.fieldName });
                let listFieldObj = _.find(vm.listField, (listfield) => { if (listfield.rfqAssyQuoteID === summaryQuotedId && listfield.quoteChargeDynamicFieldID === dynamicFieldId) { return listfield; } });
                if (summaryObj.Type === vm.CostingType.Material || summaryObj.costingType === vm.CostingType.Material) {
                  listFieldObj = _.find(vm.listField, (listfield) => { if (listfield.rfqAssyQuoteID === summaryQuotedId && listfield.quoteChargeDynamicFieldID === dynamicFieldId && listfield.refCustomPartQuoteID === (summaryObj.refCustomPartQuoteID ? summaryObj.refCustomPartQuoteID : null)) { return listfield; } });
                }
                if (!listFieldObj && summaryQuoteObj && summaryQuoteObj.rfqAssyQuotationsCustomParts && summaryQuoteObj.rfqAssyQuotationsCustomParts.length > 0) {
                  let custPartDet = _.find(summaryQuoteObj.rfqAssyQuotationsCustomParts, (summary) => summary.mfgPNID === summaryObj.custPartId);
                  if (!custPartDet) {
                    custPartDet = _.head(summaryQuoteObj.rfqAssyQuotationsCustomParts);
                  }
                  listFieldObj = _.find(vm.listField, (listfield) => { if (listfield.rfqAssyQuoteID === summaryQuotedId && listfield.quoteChargeDynamicFieldID === dynamicFieldId && listfield.refCustomPartQuoteID === custPartDet.id) { return listfield; } });
                  summaryObj.refCustomPartQuoteID = custPartDet.id;
                }
                if (!field.includes('days_') && !field.includes('toolingQty_')) {
                  if (listFieldObj && dynamicFieldObj && summaryQuoteObj) {
                    if (dynamicFieldObj.Type === vm.CostingType.Material || dynamicFieldObj.costingType === vm.CostingType.Material) {
                      let unitPrice = summaryQuoteObj.unitPrice;
                      if (summaryObj.refCustomPartQuoteID && summaryQuoteObj.rfqAssyQuotationsCustomParts && summaryQuoteObj.rfqAssyQuotationsCustomParts.length > 0) {
                        const customPartDet = _.find(summaryQuoteObj.rfqAssyQuotationsCustomParts, { id: summaryObj.refCustomPartQuoteID });
                        if (customPartDet) {
                          unitPrice = customPartDet.unitPrice;
                        }
                      }
                      vm.RefAttributePrice = 0;
                      vm.refAttributePriceCalculation(listFieldObj, unitPrice, summaryQuotedId, summaryObj.refCustomPartQuoteID, true);
                      if (vm.RefAttributePrice > 0) {
                        unitPrice = vm.RefAttributePrice;
                      }
                      if (dynamicFieldObj.displayPercentage && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.percentage = newValue;
                        vm.changePercentage(listFieldObj, unitPrice);
                      }
                      if (dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.margin = newValue;
                        vm.changeMargin(listFieldObj, unitPrice);
                      }
                      if (!dynamicFieldObj.displayPercentage && !dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.amount = newValue;
                        vm.changeDollar(listFieldObj, unitPrice);
                      }
                      vm.changeChildAttributeClaculation(listFieldObj, unitPrice);
                    }

                    if (dynamicFieldObj.Type === vm.CostingType.Labor || dynamicFieldObj.costingType === vm.CostingType.Labor) {
                      vm.RefAttributePrice = 0;
                      let unitPrice = summaryQuoteObj.laborunitPrice;
                      vm.refAttributePriceCalculation(listFieldObj, unitPrice, summaryQuotedId, summaryObj.refCustomPartQuoteID, true);
                      if (vm.RefAttributePrice > 0) {
                        unitPrice = vm.RefAttributePrice;
                      }
                      if (dynamicFieldObj.displayPercentage && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.percentage = newValue;
                        vm.changePercentage(listFieldObj, unitPrice, summaryQuoteObj.unitPrice);
                      }
                      if (dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.margin = newValue;
                        vm.changeMargin(listFieldObj, unitPrice, summaryQuoteObj.unitPrice);
                      }
                      if (!dynamicFieldObj.displayPercentage && !dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.amount = newValue;
                        vm.changeDollar(listFieldObj, unitPrice, summaryQuoteObj.unitPrice);
                      }
                      vm.changeChildAttributeClaculation(listFieldObj, unitPrice);
                    }

                    if (dynamicFieldObj.Type === vm.CostingType.Adhoc || dynamicFieldObj.costingType === vm.CostingType.Adhoc) {
                      let unitPrice = summaryQuoteObj.overheadUnitPrice;
                      //if (summaryQuoteObj.rfqAssyQuotationsCustomParts && summaryQuoteObj.rfqAssyQuotationsCustomParts.length > 0) {
                      //  const customPartDet = _.sumBy(summaryQuoteObj.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                      //  if (customPartDet > 0) {
                      //    unitPrice = customPartDet + parseFloat(summaryQuoteObj.overheadUnitPrice);
                      //  }
                      //}
                      vm.RefAttributePrice = 0;
                      vm.refAttributePriceCalculation(listFieldObj, unitPrice, summaryQuotedId, summaryObj.refCustomPartQuoteID, true);
                      if (vm.RefAttributePrice > 0) {
                        unitPrice = vm.RefAttributePrice;
                      }
                      if (dynamicFieldObj.displayPercentage && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.percentage = newValue;
                        vm.changePercentage(listFieldObj, unitPrice);
                      }
                      if (dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.margin = newValue;
                        vm.changeMargin(listFieldObj, unitPrice);
                      }
                      if (!dynamicFieldObj.displayPercentage && !dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.amount = newValue;
                        vm.changeDollar(listFieldObj, unitPrice);
                      }
                      vm.changeChildAttributeClaculation(listFieldObj, unitPrice);
                    }

                    if (dynamicFieldObj.Type === vm.CostingType.ALL || dynamicFieldObj.costingType === vm.CostingType.ALL) {
                      vm.RefAttributePrice = 0;
                      let customPartPrice = 0;
                      if (summaryQuoteObj.rfqAssyQuotationsCustomParts && summaryQuoteObj.rfqAssyQuotationsCustomParts.length > 0) {
                        customPartPrice = _.sumBy(summaryQuoteObj.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                      }
                      let unitPrice = vm.getAllTotal(listFieldObj, summaryQuoteObj.unitPrice, item, summaryQuoteObj.laborunitPrice, customPartPrice, summaryQuoteObj.overheadUnitPrice, false);
                      vm.refAttributePriceCalculation(listFieldObj, unitPrice, summaryQuotedId, summaryObj.refCustomPartQuoteID, true);
                      if (vm.RefAttributePrice > 0) {
                        unitPrice = vm.RefAttributePrice;
                      }
                      if (dynamicFieldObj.displayPercentage && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.percentage = newValue;
                        vm.changePercentage(listFieldObj, unitPrice);
                      }
                      if (dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.margin = newValue;
                        vm.changeMargin(listFieldObj, unitPrice);
                      }
                      if (!dynamicFieldObj.displayPercentage && !dynamicFieldObj.displayMargin && dynamicFieldObj.fieldName && !dynamicFieldObj.isLast) {
                        listFieldObj.amount = newValue;
                        vm.changeDollar(listFieldObj, unitPrice, 0);
                      }
                      vm.changeChildAttributeClaculation(listFieldObj, unitPrice);
                    }

                    if (dynamicFieldObj.Type === vm.CostingType.NRE || dynamicFieldObj.costingType === vm.CostingType.NRE || dynamicFieldObj.Type === vm.CostingType.TOOL || dynamicFieldObj.costingType === vm.CostingType.TOOL) {
                      if (!summaryQuoteObj.displayMargin && !summaryQuoteObj.displayPercentage && !summaryQuoteObj.isLast) {
                        listFieldObj.amount = newValue;
                        vm.changeDetails(listFieldObj, listFieldObj.amount);
                      }
                    }
                  } else if (summaryObj.isLaborCostLable && summaryQuoteObj) {
                    summaryQuoteObj.laborunitPrice = newValue;
                    vm.chageLaborprice(summaryQuoteObj, summaryQuoteObj.laborunitPrice, summaryQuoteObj.unitPrice);
                  } else if (summaryObj.isOverheadCostLable && summaryQuoteObj) {
                    let materialCost = parseFloat(summaryQuoteObj.unitPrice);
                    if (summaryQuoteObj.rfqAssyQuotationsCustomParts && summaryQuoteObj.rfqAssyQuotationsCustomParts.length > 0) {
                      const customPartPrice = _.sumBy(summaryQuoteObj.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                      if (customPartPrice && customPartPrice > 0) {
                        materialCost = materialCost + customPartPrice;
                      }
                    }
                    if (materialCost && !isNaN(newValue) && parseFloat(materialCost).toFixed(_amountFilterDecimal) < parseFloat(newValue).toFixed(_amountFilterDecimal)) {
                      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.OVERHEAD_COST_MORE_THAN_MATERIAL_CONFIRAMTION);
                      messageContent.message = stringFormat(messageContent.message, parseFloat(newValue).toFixed(_amountFilterDecimal), parseFloat(materialCost).toFixed(_amountFilterDecimal));
                      const obj = {
                        messageContent: messageContent,
                        btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
                        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                      };
                      return DialogFactory.messageConfirmDialog(obj).then(() => {
                        summaryQuoteObj.overheadUnitPrice = newValue;
                        vm.chageAdhocPrice(summaryQuoteObj, summaryQuoteObj.overheadUnitPrice, summaryQuoteObj.unitPrice);
                        vm.summaryModel = [];
                        vm.customPartModel = [];
                        vm.customPartDetail = [];
                        $timeout(() => {
                          updateHeader();
                        });
                      }, () => {
                        vm.chageAdhocPrice(summaryQuoteObj, summaryQuoteObj.overheadUnitPrice, summaryQuoteObj.unitPrice);
                        vm.summaryModel = [];
                        vm.customPartModel = [];
                        vm.customPartDetail = [];
                        $timeout(() => {
                          updateHeader();
                        });
                      }).catch((error) => BaseService.getErrorLog(error));
                    }
                    else {
                      summaryQuoteObj.overheadUnitPrice = newValue;
                      vm.chageAdhocPrice(summaryQuoteObj, summaryQuoteObj.overheadUnitPrice, summaryQuoteObj.unitPrice);
                    }
                  }
                  vm.summaryModel = [];
                  vm.customPartModel = [];
                  vm.customPartDetail = [];
                  $timeout(() => {
                    updateHeader();
                  });
                }
                else if (field.includes('days_')) {
                  if (summaryObj.isLaborCostLable && summaryQuoteObj) {
                    summaryQuoteObj.laborday = newValue;
                    //vm.changeDays(summaryQuoteObj)
                    vm.changelaborDays(summaryQuoteObj);
                  } else if (summaryObj.isMaterialCostLable && summaryQuoteObj) {
                    summaryQuoteObj.days = newValue;
                    vm.changeMaterialDays(summaryQuoteObj);
                  }
                  else if (summaryQuoteObj && summaryObj.isCustomPartLabel) {
                    //summaryQuoteObj.days = newValue;
                    vm.changeCustomPartDays(summaryQuoteObj, newValue, summaryObj.custPartId);
                  }
                  else if (listFieldObj && dynamicFieldObj && summaryQuoteObj && dynamicFieldObj.displayDays) {
                    if (dynamicFieldObj.Type === vm.CostingType.Material || dynamicFieldObj.costingType === vm.CostingType.Material || dynamicFieldObj.Type === vm.CostingType.Labor || dynamicFieldObj.costingType === vm.CostingType.Labor) {
                      listFieldObj.days = newValue;
                      vm.changeDays(listFieldObj);
                    }
                    if (dynamicFieldObj.Type === vm.CostingType.NRE || dynamicFieldObj.costingType === vm.CostingType.NRE || dynamicFieldObj.Type === vm.CostingType.TOOL || dynamicFieldObj.costingType === vm.CostingType.TOOL) {
                      if (!summaryQuoteObj.isLast) {
                        listFieldObj.days = newValue;
                      }
                    }
                  }
                  //else if (listFieldObj && dynamicFieldObj && summaryQuoteObj && (dynamicFieldObj.Type === vm.CostingType.Adhoc || dynamicFieldObj.costingType === vm.CostingType.Adhoc)) {
                  //  listFieldObj.days = newValue;
                  //  vm.changeDays(listFieldObj);
                  //}
                  if (summaryQuoteObj && listFieldObj) {
                    vm.getTotalAdhocDays(listFieldObj, summaryQuoteObj.days, summaryQuoteObj.laborday);
                  }
                  vm.summaryModel = [];
                  vm.customPartModel = [];
                  vm.customPartDetail = [];
                  $timeout(() => {
                    updateHeader();
                  });
                }
                else if (field.includes('toolingQty_')) {
                  if (listFieldObj && dynamicFieldObj && summaryQuoteObj) {
                    if (dynamicFieldObj.Type === vm.CostingType.NRE || dynamicFieldObj.costingType === vm.CostingType.NRE || dynamicFieldObj.Type === vm.CostingType.TOOL || dynamicFieldObj.costingType === vm.CostingType.TOOL) {
                      if (!summaryQuoteObj.displayMargin && !summaryQuoteObj.displayPercentage && !summaryQuoteObj.isLast) {
                        listFieldObj.toolingQty = newValue;
                      }
                    }
                  }
                  vm.summaryModel = [];
                  vm.customPartModel = [];
                  vm.customPartDetail = [];
                  $timeout(() => {
                    updateHeader();
                  });
                }
              });
              break;
            }
          }
        },
        cells: () => {
          var cellProperties = {
            renderer: 'cellRenderer'
          };
          return cellProperties;
        },
        beforeOnCellMouseDown: (Event, Cellcoords) => {
          if (Cellcoords && Cellcoords.col === 0 && Cellcoords.row !== null) {
            const summaryObj = vm.summaryModel[Cellcoords.row];
            if (summaryObj && !summaryObj.isMaterialCostLable && !summaryObj.isCustomPartLabel && !summaryObj.isLaborCostLable && !summaryObj.isOverheadCostLable && !summaryObj.isLast && summaryObj.fieldName && !summaryObj.isLaborQupteAddOptional && !summaryObj.isAdhocAddOptional && !summaryObj.isAllAddOptional && !summaryObj.isNREAddOptional && !summaryObj.isToolingAddOptional && !summaryObj.isMaterialCostingAddOptional) {
              vm.CopyFirstToAll(Cellcoords.row);
            }
          }
        },
        beforeChange: function (changes) {
          const oldValue = changes[0][2];
          const newValue = changes[0][3];
          if (oldValue !== newValue && !(parseFloat(newValue).toFixed(_unitFilterDecimal))) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.QUOTE_SUMMARY_INVALID_VALUE);
            const alertModel = {
              messageContent: messageContent
            };

            DialogFactory.messageAlertDialog(alertModel);
            // deselect current cell so we can have a focus on popup element
            $timeout(() => {
              if (_hotRegisterer) {
                _hotRegisterer.deselectCell();
              }
            });
            changes[0][3] = changes[0][2];
            return false;
          }
        }
      };

      // Ref Attribute price calculation
      vm.refAttributePriceCalculation = (attribute, unitPrice, summaryQuotedId, refCustomPartQuoteID, isFromMain) => {
        if (isFromMain) {
          vm.RefAttributePrice = parseFloat(unitPrice);
        }
        else {
          vm.RefAttributePrice = ((vm.RefAttributePrice ? vm.RefAttributePrice : 0) + parseFloat(attribute.amount ? attribute.amount : 0));
        }
        const attributeDet = _.find(vm.dynamicFieldList, { id: attribute.quoteChargeDynamicFieldID });
        if (attributeDet.isIncludeInOtherAttribute && attributeDet.refAttributeID) {
          let listFieldObj = _.find(vm.listField, (item) => { if (item.rfqAssyQuoteID === summaryQuotedId && item.quoteChargeDynamicFieldID === attributeDet.refAttributeID) { return item; } });
          if (refCustomPartQuoteID) {
            listFieldObj = _.find(vm.listField, (item) => { if (item.rfqAssyQuoteID === summaryQuotedId && item.quoteChargeDynamicFieldID === attributeDet.refAttributeID && item.refCustomPartQuoteID === refCustomPartQuoteID) { return item; } });
          }
          if (listFieldObj) {
            vm.refAttributePriceCalculation(listFieldObj, unitPrice, summaryQuotedId, refCustomPartQuoteID, false);
          }
          else {
            return vm.RefAttributePrice;
          }
        }
        else {
          return vm.RefAttributePrice;
        }
      };

      vm.sourceHeader = null;

      // Dynamic header mapping
      function updateHeader() {
        if (Array.isArray(vm.summaryModel) && vm.summaryModel.length) {
          vm.summaryModel = [];
        }
        modelReset();
        vm.settings.nestedHeaders = [
          [{
            field: 'copyToAll',
            label: '',
            width: 35,
            colspan: 1
          }, {
            field: 'costingName',
            label: vm.LabelConstant.BOM.QuoteQty,
            width: 350,
            colspan: 1
          }],
          [{
            field: 'copyToAll',
            label: '',
            width: 35,
            colspan: 1
          }, {
            field: 'costingName',
            label: 'Turn Time',
            width: 350,
            colspan: 1
          }],
          [{ colspan: 1 }, { colspan: 1 }]];
        if (vm.summaryQuote && vm.summaryQuote.length > 0) {
          let requestQtyWiseData = _.groupBy(_.filter(vm.summaryQuote, { rfqPriceGroupId: null }), 'requestedQty');
          // Bind Qty header with merge
          const totlColumPerQty = 3; //(2 + (vm.dynamicFieldsTool && vm.dynamicFieldsTool.length > 0 ? 1 : 0));
          _.each(requestQtyWiseData, (data, index) => {
            vm.settings.nestedHeaders[0].push({
              //field: 'requestedQty',
              label: index,
              colspan: (data.length * totlColumPerQty)
            });
            // Bind Qty turn time header with merge
            _.each(data, (item) => {
              vm.settings.nestedHeaders[1].push({
                //field: dayColumnName,
                label: (item.turnTime + ' ' + (item.timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : (item.timeType === vm.timeType.BUSINESS_DAY.VALUE ? vm.timeType.BUSINESS_DAY.TYPE : vm.timeType.WEEK_DAY.TYPE))),
                colspan: totlColumPerQty
              });
            });
          });
          const reqPriceGroupwisedata = _.groupBy(_.filter(vm.summaryQuote, (item) => {
            if (item.rfqPriceGroupId) {
              return item;
            }
          }), 'rfqPriceGroupId');
          // Bind Qty header with merge
          _.each(reqPriceGroupwisedata, (data) => {
            requestQtyWiseData = _.groupBy(data, 'requestedQty');
            _.each(requestQtyWiseData, (objPG, index) => {
              vm.settings.nestedHeaders[0].push({
                //field: 'requestedQty',
                label: (data[0].rfqPriceGroup.name + ' (' + index + ')'),
                colspan: (objPG.length * totlColumPerQty)
              });
              // Bind Qty turn time header with merge
              _.each(objPG, (item) => {
                vm.settings.nestedHeaders[1].push({
                  //field: dayColumnName,
                  label: (item.turnTime + ' ' + (item.timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : (item.timeType === vm.timeType.BUSINESS_DAY.VALUE ? vm.timeType.BUSINESS_DAY.TYPE : vm.timeType.WEEK_DAY.TYPE))),
                  colspan: totlColumPerQty
                });
              });
            });
          });
          _.each(vm.summaryQuote, (item, index) => {
            const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', item.rfqAssyQtyID, item.rfqAssyQtyTurnTimeID, item.timeType, item.rfqPriceGroupId);
            const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', item.rfqAssyQtyID, item.rfqAssyQtyTurnTimeID, item.timeType, item.rfqPriceGroupId);
            const toolingColumnName = stringFormat('{0}_{1}_{2}_{3}_{4}', 'toolingQty', item.rfqAssyQtyID, item.rfqAssyQtyTurnTimeID, item.timeType, item.rfqPriceGroupId);
            let days = (item.manualTurnTime ? item.manualTurnTime : item.days ? item.days : 0);
            if (item.rfqAssyQuotationsCustomParts && item.rfqAssyQuotationsCustomParts.length > 0) {
              const customPartDay = _.maxBy(item.rfqAssyQuotationsCustomParts, 'leadTimeDays');
              if (customPartDay && customPartDay.leadTimeDays) {
                days = Math.max(days, customPartDay.leadTimeDays);
              }
            }
            vm.settings.nestedHeaders[2].push({
              field: dayColumnName,
              label: (days.toString() + ' Days'),
              colspan: 0
            });
            vm.settings.nestedHeaders[2].push({
              field: priceColumnName,
              label: 'Price',
              colspan: 0
            });
            //if (vm.dynamicFieldsTool && vm.dynamicFieldsTool.length > 0) {
            vm.settings.nestedHeaders[2].push({
              field: toolingColumnName,
              label: 'NRE/Tooling Qty',
              colspan: 0
            });
            //}
            if (index === 0) {
              const objMaterialCosting = { copyToAll: '' };
              objMaterialCosting['costingName'] = vm.CostingTypeName.MATERIALCOSTING;
              objMaterialCosting[dayColumnName] = 'Days';
              objMaterialCosting[priceColumnName] = '';
              objMaterialCosting[toolingColumnName] = '';
              vm.summaryModel.push(objMaterialCosting);
            }
            else {
              const materialCostingRow = _.find(vm.summaryModel, { costingName: vm.CostingTypeName.MATERIALCOSTING });
              if (materialCostingRow) {
                materialCostingRow[dayColumnName] = 'Days';
                materialCostingRow[priceColumnName] = '';
                materialCostingRow[toolingColumnName] = '';
                //materialCostingRow.isMaterialCostingAddOptional = true;
              }
            }
            if (index === 0) {
              const objMaterialCosting = {};
              objMaterialCosting['costingName'] = 'Non Custom Material Cost($)';
              objMaterialCosting[dayColumnName] = item.days;
              objMaterialCosting[priceColumnName] = item.unitPrice;
              objMaterialCosting[toolingColumnName] = '';
              objMaterialCosting.isMaterialCostLable = true;
              const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
              objMaterialCosting[summaryQuoteId] = item.id;
              objMaterialCosting.fieldName = 'Non Custom Material Cost($)';
              vm.summaryModel.push(objMaterialCosting);
              if (item.rfqAssyQuotationsCustomParts && item.rfqAssyQuotationsCustomParts.length > 0) {
                _.each(item.rfqAssyQuotationsCustomParts, (custPart, custIndex) => {
                  if (!_.find(vm.customPartModel, { costingName: custPart.customParts.PIDCode })) {
                    const objCustomPart = {};
                    objCustomPart['costingName'] = custPart.customParts.PIDCode;
                    objCustomPart[dayColumnName] = custPart.leadTimeDays;
                    objCustomPart['custPartId'] = custPart.customParts.id;
                    objCustomPart['refCustomPartQuoteID'] = custPart.id;
                    objCustomPart[priceColumnName] = parseFloat(custPart.unitPrice).toFixed(_amountFilterDecimal);
                    objCustomPart[toolingColumnName] = '';
                    objCustomPart.isCustomPartLabel = true;
                    const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                    objCustomPart[summaryQuoteId] = item.id;
                    objCustomPart.fieldName = custPart.customParts.PIDCode;
                    vm.customPartModel.push(objCustomPart);
                    vm.customPartDetail.push({ custPartId: custPart.customParts.id, refCustomPartQuoteID: custPart.id, PIDCode: custPart.customParts.PIDCode, unitPrice: custPart.unitPrice, days: custPart.leadTimeDays, displayOrder: (custIndex + 1) });
                  }
                });
              }
            }
            else {
              const materialCostingRow = _.find(vm.summaryModel, { costingName: 'Non Custom Material Cost($)' });
              if (materialCostingRow) {
                materialCostingRow[dayColumnName] = item.days;
                materialCostingRow[priceColumnName] = item.unitPrice;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                materialCostingRow[summaryQuoteId] = item.id;
                materialCostingRow[toolingColumnName] = '';
              }
              if (item.rfqAssyQuotationsCustomParts && item.rfqAssyQuotationsCustomParts.length > 0) {
                _.each(item.rfqAssyQuotationsCustomParts, (custPart) => {
                  const costSummaryRow = _.find(vm.customPartModel, { costingName: custPart.customParts.PIDCode });
                  if (costSummaryRow) {
                    costSummaryRow[dayColumnName] = custPart.leadTimeDays;
                    costSummaryRow[priceColumnName] = parseFloat(custPart.unitPrice).toFixed(_amountFilterDecimal);
                    const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                    costSummaryRow[summaryQuoteId] = item.id;
                    costSummaryRow[toolingColumnName] = '';
                  }
                });
              }
            }
          });
        }
        mapdynamicFields();
        setHandsontableHeight();
      }
      // Mapp dyanamic row as per attribute map with each section
      function mapdynamicFields() {
        vm.finalEAModel = [];
        vm.allTotalModel = [];
        _.each(vm.dynamicField, (item) => {
          const objMaterialCosting = _.clone(item);
          const objCustomPartMaterialCosting = _.clone(item);
          if (item.Type === vm.CostingType.Material || item.costingType === vm.CostingType.Material) {
            objMaterialCosting['costingName'] = item.fieldName ? item.fieldName : 'Non Custom Sub Total';
            //objCustomPartMaterialCosting['costingName'] = item.fieldName ? item.fieldName : 'Sub Total';
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const filterList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID && data.refCustomPartQuoteID === null) { return data; } });
              _.each(filterList, (data) => {
                let price = item.displayPercentage ? data.percentage : (item.displayMargin ? data.margin : data.amount);
                let days = data.days;
                if (!item.fieldName && item.costingType !== vm.CostingType.Adhoc && !item.isLast) {
                  price = vm.getTotal(data, quote.unitPrice, item);
                  days = vm.getTotalDays(data, quote.days);
                }
                //if (item.isMaterialCostTotal && !item.fieldName && item.costingType === vm.CostingType.Material && !item.isLast) {
                //  objMaterialCosting['costingName'] = 'Material Cost Total';
                //  objMaterialCosting.isMaterialCostTotal = true;
                //  price = vm.getTotal(data, quote.unitPrice, item);
                //  days = vm.getTotalDays(data, quote.days);
                //}
                objMaterialCosting[dayColumnName] = days;
                objMaterialCosting.margin = data.margin;
                objMaterialCosting.displayMargin = data.displayMargin;
                objMaterialCosting.amount = data.amount;
                objMaterialCosting.unitPrice = quote.unitPrice;
                objMaterialCosting.days = quote.days;
                objMaterialCosting.displayMargin = data.displayMargin;
                objMaterialCosting.amount = data.amount;
                objMaterialCosting.dynamicFieldId = item.id;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                objMaterialCosting[summaryQuoteId] = quote.id;
                const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                objMaterialCosting[dynamicFieldId] = item.id;
                const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                objMaterialCosting[listFieldId] = data.quoteChargeDynamicFieldID;
                objMaterialCosting[priceColumnName] = price;
              });
              if (item.isMaterialCostTotal && !item.fieldName && item.costingType === vm.CostingType.Material && !item.isLast) {
                objMaterialCosting['costingName'] = 'Material Cost Total';
                objMaterialCosting.isMaterialCostTotal = true;
                let customPartPrice = 0;
                if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0) {
                  customPartPrice = _.sumBy(quote.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                }
                const price = vm.getMaterialTotal(quote, quote.unitPrice, customPartPrice);
                let days = quote.days;
                const customPartDay = _.maxBy(quote.rfqAssyQuotationsCustomParts, 'leadTimeDays');
                if (customPartDay && customPartDay.leadTimeDays) {
                  days = Math.max(quote.days, customPartDay.leadTimeDays);
                }
                objMaterialCosting[dayColumnName] = days;
                objMaterialCosting.dynamicFieldId = item.id;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                objMaterialCosting[summaryQuoteId] = quote.id;
                const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                objMaterialCosting[dynamicFieldId] = item.id;
                objMaterialCosting[priceColumnName] = price;
              }
            });
            if (!objMaterialCosting.refCustomPartQuoteID) {
              vm.summaryModel.push(objMaterialCosting);
            }
            if (item.refCustomPartQuoteID) {
              _.each(vm.customPartDetail, (custpart) => {
                const objCustomPartDet = _.clone(objCustomPartMaterialCosting);
                //objCustomPartDet['refCustomPartQuoteID'] = custpart.refCustomPartQuoteID;
                objCustomPartDet['custPartId'] = custpart.custPartId;
                objCustomPartDet['costingName'] = item.fieldName ? item.fieldName : stringFormat('{0} Sub Total', custpart.PIDCode);
                objCustomPartDet.dynamicFieldId = item.id;
                _.each(vm.summaryQuote, (quote) => {
                  const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
                  const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
                  //let isMaterialCostTotal = false;
                  //if (!item.fieldName) {
                  //  isMaterialCostTotal = true;
                  //}
                  const filterCustomPartList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID && data.custPartId === custpart.custPartId) { return data; } });
                  _.each(filterCustomPartList, (data) => {
                    if (!item.isMaterialCostTotal && data.isMaterialCostTotal) {
                      return true;
                    }
                    let price = item.displayPercentage ? data.percentage : (item.displayMargin ? data.margin : data.amount);
                    let days = data.days;
                    if (!item.fieldName && !item.isMaterialCostTotal && item.costingType !== vm.CostingType.Adhoc && !item.isLast) {
                      let custUnitPrice = 0;
                      //let otherCustPartDet = 0;
                      if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0 && data.refCustomPartQuoteID) {
                        if (data.refCustomPartQuoteID) {
                          const custPartDet = _.find(quote.rfqAssyQuotationsCustomParts, { id: data.refCustomPartQuoteID });
                          if (custPartDet) {
                            custUnitPrice = parseFloat(custPartDet.unitPrice).toFixed(_amountFilterDecimal);
                          }
                        }
                      }
                      const custDet = _.find(vm.customPartModel, (cust) => { if (cust.custPartId === custpart.custPartId && cust.isCustomPartLabel) { return cust; } }); // data.days;
                      if (custDet) {
                        days = custDet[dayColumnName];
                      }
                      price = vm.getTotal(data, custUnitPrice, item, 0);
                    }
                    // if (item.isMaterialCostTotal && !item.fieldName && item.costingType === vm.CostingType.Material && !item.isLast) {
                    //  objCustomPartDet['costingName'] = 'Material Cost Total';
                    //  objCustomPartDet.isMaterialCostTotal = true;
                    //  let custUnitPrice = 0;
                    //  let otherCustPartDet = 0;
                    //  if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0 && data.refCustomPartQuoteID) {
                    //    const custPartDet = _.find(quote.rfqAssyQuotationsCustomParts, { id: data.refCustomPartQuoteID });
                    //    if (custPartDet) {
                    //      custUnitPrice = parseFloat(custPartDet.unitPrice);
                    //    }
                    //    const custPartIds = _.map(_.filter(vm.customPartDetail, (cust) => { if (cust.displayOrder < custpart.displayOrder) { return cust; } }), 'custPartId');
                    //    if (custPartIds && custPartIds.length > 0) {
                    //      otherCustPartDet = _.sumBy(_.filter(quote.rfqAssyQuotationsCustomParts, (det) => {
                    //        if (_.includes(custPartIds, det.mfgPNID)) { return det; }
                    //      }), (sum) => parseFloat(sum.unitPrice));
                    //      const customPartDay = _.maxBy(_.filter(quote.rfqAssyQuotationsCustomParts, (det) => {
                    //        if (_.includes(custPartIds, det.mfgPNID)) { return det; }
                    //      }), 'leadTimeDays');
                    //      if (customPartDay && customPartDay.leadTimeDays) {
                    //        days = Math.max(quote.days, customPartDay.leadTimeDays, custPartDet.leadTimeDays);
                    //      }
                    //    }
                    //    else {
                    //      days = Math.max(quote.days, custPartDet.leadTimeDays);
                    //    }
                    //  }
                    //  price = vm.getCustPartTotal(data, quote.unitPrice, (custUnitPrice + otherCustPartDet));
                    // }
                    objCustomPartDet[dayColumnName] = days;
                    objCustomPartDet.isLast = item.isLast;
                    objCustomPartDet.margin = data.margin;
                    objCustomPartDet.displayMargin = data.displayMargin;
                    objCustomPartDet.amount = data.amount;
                    objCustomPartDet.unitPrice = parseFloat(quote.unitPrice).toFixed(_amountFilterDecimal);
                    objCustomPartDet.days = quote.days;
                    objCustomPartDet.amount = data.amount;
                    const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                    objCustomPartDet[summaryQuoteId] = quote.id;
                    const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                    objCustomPartDet[dynamicFieldId] = item.id;
                    const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                    objCustomPartDet[listFieldId] = data.quoteChargeDynamicFieldID;
                    objCustomPartDet[priceColumnName] = price;
                  });
                });
                if (objCustomPartDet.refCustomPartQuoteID === custpart.refCustomPartQuoteID) {
                  vm.customPartModel.push(objCustomPartDet);
                }
              });
            }
          }
          if (item.Type === 'Labor' || item.costingType === 'Labor') {
            objMaterialCosting['costingName'] = item.fieldName ? item.fieldName : 'Sub Total';
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const filterList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID) { return data; } });
              _.each(filterList, (data) => {
                let price = item.displayPercentage ? data.percentage : (item.displayMargin ? data.margin : data.amount);
                let days = data.days;
                if (!item.fieldName && item.costingType !== vm.CostingType.Adhoc && !item.isLast) {
                  let customPartPrice = 0;
                  if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0) {
                    customPartPrice = _.sumBy(quote.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                  }
                  price = vm.getTotal(data, quote.unitPrice, item, quote.laborunitPrice, customPartPrice);
                  days = vm.getTotalDays(data, quote.days, quote.laborday);
                }
                objMaterialCosting[dayColumnName] = days;
                objMaterialCosting[priceColumnName] = price;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                objMaterialCosting[summaryQuoteId] = quote.id;
                const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                objMaterialCosting[dynamicFieldId] = item.id;
                objMaterialCosting.dynamicFieldId = item.id;
                const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                objMaterialCosting[listFieldId] = data.quoteChargeDynamicFieldID;
              });
            });
            vm.laborModel.push(objMaterialCosting);
          }
          if (item.Type === vm.CostingType.Adhoc || item.costingType === vm.CostingType.Adhoc) {
            objMaterialCosting['costingName'] = item.fieldName ? item.fieldName : 'Sub Total';
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              // const toolingColumnName = stringFormat('{0}_{1}_{2}_{3}_{4}', 'toolingQty', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const filterList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID) { return data; } });
              _.each(filterList, (data) => {
                let price = item.displayPercentage ? data.percentage : (item.displayMargin ? data.margin : data.amount);
                let days = '';
                if (!item.fieldName && !item.isLast) {
                  price = vm.getOverheadTotal(data, quote.overheadUnitPrice);
                  days = vm.getTotalDays(data, quote.overheadDay, 0);
                }
                objMaterialCosting[dayColumnName] = days;
                objMaterialCosting[priceColumnName] = price;
                // objMaterialCosting[toolingColumnName] = item.isLast ? vm.getTotalNREQty(data, quote.toolingQty) : data.toolingQty;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                objMaterialCosting[summaryQuoteId] = quote.id;
                const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                objMaterialCosting[dynamicFieldId] = item.id;
                objMaterialCosting.dynamicFieldId = item.id;
                const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                objMaterialCosting[listFieldId] = data.quoteChargeDynamicFieldID;
              });
            });
            vm.adhocModel.push(objMaterialCosting);
          }
          if (item.Type === vm.CostingType.ALL || item.costingType === vm.CostingType.ALL) {
            objMaterialCosting['costingName'] = item.fieldName ? item.fieldName : 'Sub Total';
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const filterList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID) { return data; } });
              _.each(filterList, (data) => {
                let price = item.displayPercentage ? data.percentage : (item.displayMargin ? data.margin : data.amount);
                let customPartPrice = 0;
                if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0) {
                  customPartPrice = _.sumBy(quote.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                }
                const totalPrice = vm.getAllTotal(data, quote.unitPrice, item, quote.laborunitPrice, customPartPrice, quote.overheadUnitPrice, false);
                let days = '';
                if (!item.fieldName && !item.isLast && !item.isCostTotal && !item.isCostTotalWithAttribute) {
                  price = vm.getALLTotalWithALLAttribute(data, totalPrice);
                  // days = vm.getTotalDays(data, 0, 0);
                  // days = vm.getTotalAdhocDays(data, days, quote.laborday);
                }
                if (!item.fieldName && !item.isLast && (item.isCostTotal || item.isCostTotalWithAttribute)) {
                  objMaterialCosting['costingName'] = item.isCostTotal ? 'Total (Material + Labor + Overhead) w/o Attribute' : 'Total (Material + Labor + Overhead) w/ Attribute';
                  let customPartPrice = 0;
                  days = quote.days;
                  if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0) {
                    customPartPrice = _.sumBy(quote.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                    const customPartDay = _.maxBy(quote.rfqAssyQuotationsCustomParts, 'leadTimeDays');
                    if (customPartDay && customPartDay.leadTimeDays) {
                      days = Math.max(days, customPartDay.leadTimeDays);
                    }
                  }
                  if (!item.isCostTotalWithAttribute) {
                    price = vm.getAllTotal(data, quote.unitPrice, item, quote.laborunitPrice, customPartPrice, quote.overheadUnitPrice, false);
                  }
                  else {
                    price = vm.getAllTotal(data, quote.unitPrice, item, quote.laborunitPrice, customPartPrice, quote.overheadUnitPrice, true);
                  }
                  days = vm.getTotalAdhocDays(data, days, quote.laborday);
                }
                //if (!item.fieldName && !item.isLast && item.isCostTotalWithAttribute) {
                //  objMaterialCosting['costingName'] = 'Total (Material + Labor + Overhead) w/ Attribute';
                //  let customPartPrice = 0;
                //  if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0) {
                //    customPartPrice = _.sumBy(quote.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                //    const customPartDay = _.maxBy(quote.rfqAssyQuotationsCustomParts, 'leadTimeDays');
                //    if (customPartDay && customPartDay.leadTimeDays) {
                //      days = Math.max(days, customPartDay.leadTimeDays);
                //    }
                //  }
                //  days = vm.getTotalAdhocDays(data, days, quote.laborday);
                //}
                objMaterialCosting[dayColumnName] = days;
                objMaterialCosting[priceColumnName] = price;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                objMaterialCosting[summaryQuoteId] = quote.id;
                const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                objMaterialCosting[dynamicFieldId] = item.id;
                objMaterialCosting.dynamicFieldId = item.id;
                const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                objMaterialCosting[listFieldId] = data.quoteChargeDynamicFieldID;
              });
            });
            if (!item.isCostTotal && !item.isCostTotalWithAttribute) {
              vm.allModel.push(objMaterialCosting);
            }
            if (item.isCostTotal || item.isCostTotalWithAttribute) {
              vm.allTotalModel.push(objMaterialCosting);
            }
          }
          if (item.costingType === vm.CostingType.FinalEA) {
            objMaterialCosting['costingName'] = item.fieldName;
            if (item.isLast) {
              _.each(vm.summaryQuote, (quote) => {
                const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
                const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
                const filterList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID) { return data; } });
                _.each(filterList, (data) => {
                  let customPartPrice = 0;
                  let days = quote.days;
                  if (quote.rfqAssyQuotationsCustomParts && quote.rfqAssyQuotationsCustomParts.length > 0) {
                    customPartPrice = _.sumBy(quote.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                    const customPartDay = _.maxBy(quote.rfqAssyQuotationsCustomParts, 'leadTimeDays');
                    if (customPartDay && customPartDay.leadTimeDays) {
                      days = Math.max(days, customPartDay.leadTimeDays);
                    }
                  }
                  objMaterialCosting[dayColumnName] = vm.getTotalAdhocDays(data, days, quote.laborday);
                  objMaterialCosting[priceColumnName] = vm.getFinalTotal(data, quote.unitPrice, quote.laborunitPrice, customPartPrice, quote.overheadUnitPrice);
                  const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                  objMaterialCosting[summaryQuoteId] = quote.id;
                  const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                  objMaterialCosting[dynamicFieldId] = item.id;
                  objMaterialCosting.dynamicFieldId = item.id;
                  const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                  objMaterialCosting[listFieldId] = data.quoteChargeDynamicFieldID;
                });
              });
            }
            vm.finalEAModel.push(objMaterialCosting);
          }
          if (item.Type === vm.CostingType.NRE || item.costingType === vm.CostingType.NRE) {
            objMaterialCosting['costingName'] = item.fieldName;
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const toolingColumnName = stringFormat('{0}_{1}_{2}_{3}_{4}', 'toolingQty', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const filterList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID) { return data; } });
              _.each(filterList, (data) => {
                objMaterialCosting[dayColumnName] = item.isLast ? vm.getTotalNreDays(data, quote.days) : data.days;
                objMaterialCosting[priceColumnName] = item.isLast ? vm.getTotalNRE(data, quote.unitPrice) : data.amount;
                objMaterialCosting[toolingColumnName] = item.isLast ? vm.getTotalNREQty(data, quote.toolingQty) : data.toolingQty;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                objMaterialCosting[summaryQuoteId] = quote.id;
                const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                objMaterialCosting[dynamicFieldId] = item.id;
                objMaterialCosting.dynamicFieldId = item.id;
                const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                objMaterialCosting[listFieldId] = data.quoteChargeDynamicFieldID;
              });
            });
            vm.nreModel.push(objMaterialCosting);
          }
          if (item.Type === vm.CostingType.TOOL || item.costingType === vm.CostingType.TOOL) {
            objMaterialCosting['costingName'] = item.fieldName;
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const toolingColumnName = stringFormat('{0}_{1}_{2}_{3}_{4}', 'toolingQty', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const filterList = _.filter(vm.listField, (data) => { if (quote.id === data.rfqAssyQuoteID && item.id === data.quoteChargeDynamicFieldID) { return data; } });
              _.each(filterList, (data) => {
                objMaterialCosting[dayColumnName] = item.isLast ? vm.getTotalToolDays(data, quote.days) : data.days;
                objMaterialCosting[priceColumnName] = item.isLast ? vm.getTotalTool(data, quote.unitPrice) : data.amount;
                objMaterialCosting[toolingColumnName] = item.isLast ? vm.getTotalToolQty(data, quote.toolingQty) : data.toolingQty;
                const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
                objMaterialCosting[summaryQuoteId] = quote.id;
                const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
                objMaterialCosting[dynamicFieldId] = item.id;
                objMaterialCosting.dynamicFieldId = item.id;
                const listFieldId = stringFormat('{0}_{1}', priceColumnName, 'listFieldId');
                objMaterialCosting[listFieldId] = data.quoteChargeDynamicFieldID;
              });
            });
            vm.toolModel.push(objMaterialCosting);
          }
        });
        const objMaterialTotal = _.find(vm.summaryModel, { isMaterialCostTotal: true });
        _.remove(vm.summaryModel, { isMaterialCostTotal: true });
        if (vm.customPartModel && vm.customPartModel.length > 0) {
          const groupbuQuoteDetails = _.groupBy(vm.customPartModel, 'refCustomPartQuoteID');
          _.each(groupbuQuoteDetails, (custItem) => {
            _.each(custItem, (det) => {
              if (!det.isMaterialCostTotal && !det.isCustPartTotal) {
                vm.summaryModel.push(det);
              }
            });
            //const customPartTotal = _.find(custItem, { isMaterialCostTotal: true });
            //if (customPartTotal) {
            //  vm.summaryModel.push(customPartTotal);
            //}
          });
        }
        if (objMaterialTotal) {
          vm.summaryModel.push(objMaterialTotal);
        }
        _.each(vm.laborModel, (item) => {
          if (item.costingName === 'Labor Cost($)') {
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              item[dayColumnName] = quote.laborday;
              item[priceColumnName] = quote.laborunitPrice;
              const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
              item[summaryQuoteId] = quote.id;
              const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
              item[dynamicFieldId] = item.id;
            });
          }
          vm.summaryModel.push(item);
        });
        _.each(vm.adhocModel, (item) => {
          if (item.isOverheadCostLable) {
            _.each(vm.summaryQuote, (quote) => {
              const dayColumnName = stringFormat('{0}{1}_{2}_{3}_{4}', 'days_', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              const priceColumnName = stringFormat('{0}_{1}_{2}_{3}', quote.rfqAssyQtyID, quote.rfqAssyQtyTurnTimeID, quote.timeType, quote.rfqPriceGroupId);
              item[dayColumnName] = quote.overheadDay;
              item[priceColumnName] = quote.overheadUnitPrice;
              const summaryQuoteId = stringFormat('{0}_{1}', priceColumnName, 'summaryQuoteId');
              item[summaryQuoteId] = quote.id;
              const dynamicFieldId = stringFormat('{0}_{1}', priceColumnName, 'dynamicFieldId');
              item[dynamicFieldId] = item.id;
              item.dynamicFieldId = item.id;
            });
          }
          vm.summaryModel.push(item);
        });
        _.each(vm.allTotalModel, (item) => {
          vm.summaryModel.push(item);
        });
        _.each(vm.allModel, (item) => {
          vm.summaryModel.push(item);
        });
        _.each(vm.finalEAModel, (item) => {
          vm.summaryModel.push(item);
        });
        _.each(vm.nreModel, (item) => {
          vm.summaryModel.push(item);
        });
        _.each(vm.toolModel, (item) => {
          vm.summaryModel.push(item);
        });

        if (vm.summaryQuote && vm.summaryQuote.length === 0) {
          vm.isNoDataFound = true;
        }
        else if (vm.isNoDataFound) {
          vm.isNoDataFound = false;
          if (hotRegisterer.getInstance('hot-summary')) {
            _hotRegisterer = hotRegisterer.getInstance('hot-summary');
          }
        }
        $timeout(() => {
          if (_hotRegisterer) {
            _hotRegisterer.render();
            _hotRegisterer.updateSettings({
              nestedHeaders: vm.settings.nestedHeaders
            });
          }
        });
        // Bind Context Menu
        initDynamicContextMenu();
        $scope.$emit(RFQTRANSACTION.EVENT_NAME.HideSummarySave, vm.isNoDataFound);
        // set height to the handosontable container
        window.setTimeout(setHandsontableHeight);
      }

      // set handsontable full height to screen
      function setHandsontableHeight() {
        var offset = $('#hot-summary-container').offset();

        if (!offset) {
          return;
        }

        const docHeight = $(document).height();
        //var footerHeight = $('.footerfixedbutton').outerHeight();

        const handsontableHeight = docHeight - offset.top - 30;
        $('#hot-summary-container').height(handsontableHeight).css({
          overflow: 'hidden'
        });
        if (vm.summaryQuote && vm.summaryQuote.length > 0 && vm.summaryQuote.length < 3) {
          const width = vm.summaryQuote.length * 40;
          $('#hot-summary-container').width(width + '%').css({
            overflow: 'hidden'
          });
        }
        // Resolved Scroll issue in case of read only handsontable
        $('#hot-summary-container .wtHolder').height(handsontableHeight);
        //$('#hot-summary-container .wtHolder').height('auto');
        $('#hot-summary-container .wtHolder').width('auto');
        if (_hotRegisterer) {
          _hotRegisterer.render();
        }
      }

      // set height to the handosontable container

      $(window).resize(() => {
        handsontableresize();
      });
      // Handson table resize function
      function handsontableresize() {
        var offset = $('#hot-summary-container').offset();

        if (!offset) {
          return;
        }

        const docHeight = $(document).height();
        const tableHeight = docHeight - offset.top - 10;
        $('#hot-summary-container .wtHolder').height(tableHeight);
      };
      //get summary quote list for assembly
      const getSummaryQuote = () => {
        var obj = {
          rfqAssyID: rfqAssyID,
          isSummaryComplete: vm.assemblyData.isSummaryComplete
        };
        return PartCostingFactory.retriveSummaryQuote().query({ summaryGetobj: obj }).$promise.then((quote) => {
          if (quote && quote.data) {
            _.each(quote.data, (summary) => {
              var total = 0;
              if (summary.timeType === vm.timeType.WEEK_DAY.VALUE) {
                total = summary.turnTime / 7;
              }
              else if (summary.timeType === vm.timeType.BUSINESS_DAY.TYPE) {
                total = summary.turnTime / 5;
              }
              else {
                total = summary.turnTime;
              }
              summary.totalDays = total;
            });
            vm.summaryQuote = quote.data; //_.sortBy(quote.data, ['rfqPriceGroupId','requestedQty', 'totalDays']);
            hotRegisterer.removeInstance('hot-summary');
            if (hotRegisterer.getInstance('hot-summary')) {
              _hotRegisterer = hotRegisterer.getInstance('hot-summary');
            }
            vm.listField = [];
            bindSummaryDetailList();
            checkQuotePrice();
            return quote.data;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      // Bind all summary ditails as per allow margin and percentage maping
      const bindSummaryDetailList = () => {
        vm.summaryModel = [];
        vm.customPartModel = [];
        vm.customPartDetail = [];
        vm.listField = [];
        let i = 0;
        let countItem = 0;
        const dynamicFields = _.filter(vm.dynamicFieldList, (ctype) => { if (ctype.costingType === vm.CostingType.Material || ctype.costingType === vm.CostingType.Labor) { return ctype; } });
        vm.laborCount = _.filter(vm.dynamicFieldList, { costingType: vm.CostingType.Labor });
        vm.dynamicFieldsAdHOC = _.filter(vm.dynamicFieldList, { costingType: vm.CostingType.Adhoc });
        vm.dynamicFieldsAll = _.filter(vm.dynamicFieldList, { costingType: vm.CostingType.ALL });
        vm.dynamicFieldsNRE = _.filter(vm.dynamicFieldList, { costingType: vm.CostingType.NRE });
        vm.dynamicFieldsTool = _.filter(vm.dynamicFieldList, { costingType: vm.CostingType.TOOL });
        vm.dynamicField = [];
        const data = _.groupBy(dynamicFields, 'costingType');
        _.each(vm.summaryQuote, (item, index) => {
          item.unitPrice = parseFloat(item.unitPrice ? parseFloat(item.unitPrice).toFixed(_amountFilterDecimal) : '0.00').toFixed(_amountFilterDecimal);
          item.laborunitPrice = parseFloat(item.laborunitPrice ? parseFloat(item.laborunitPrice).toFixed(_amountFilterDecimal) : '0.00').toFixed(_amountFilterDecimal);
          item.overheadUnitPrice = parseFloat(item.overheadUnitPrice ? parseFloat(item.overheadUnitPrice).toFixed(_amountFilterDecimal) : '0.00').toFixed(_amountFilterDecimal);
          //bind Material ans Labor data
          _.each(data, (dataFields) => {
            if (i === 0) {
              const dynamicCustPartTotalObj = {
                fieldName: '',
                refCustomPartQuoteID: null,
                id: null,
                isMaterialCostTotal: true,
                displayPercentage: null,
                displayMargin: null,
                total: null,
                costingType: vm.CostingType.Material,
                isLast: false
              };
              vm.dynamicField.push(dynamicCustPartTotalObj);
            }
            if (i === 1) {
              const dynamic = {
                fieldName: stringFormat('Labor Cost($)'),
                id: null,
                displayPercentage: null,
                displayMargin: null,
                displayDays: null,
                Type: 'LB'
              };
              vm.dynamicField.push(dynamic);
            }
            const totalobjDyfieldsCostList = _.filter(dataFields, (objDyfields) => {
              const objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID === objDyfields.id && !additionalCost.refCustomPartQuoteID);
              if (objAdditionalQuote) {
                return true;
              }
              else {
                return objDyfields.isActive;
              }
            });
            _.each(totalobjDyfieldsCostList, (fields) => {
              var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID === fields.id && !additionalCost.refCustomPartQuoteID);
              var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => dynamicFieldObj.id === fields.id && !dynamicFieldObj.refCustomPartQuoteID);
              if ((objItem) || (objItem && ((fields.applyToAll && fields.isActive) || fields.isActive))) {
                if (!dynamicFieldObjItem) {
                  const dynamic = {
                    fieldName: stringFormat('{0}($)', fields.fieldName),
                    id: fields.id,
                    displayPercentage: false,
                    displayMargin: false,
                    displayDays: fields.isDaysRequire,
                    Type: fields.costingType,
                    applyToAll: fields.applyToAll
                  };
                  vm.dynamicField.push(dynamic);
                  if (fields.displayPercentage) {
                    const dynamic = {
                      fieldName: stringFormat('{0}(%)', fields.fieldName),
                      id: fields.id,
                      displayPercentage: true,
                      displayMargin: false,
                      Type: fields.costingType
                    };
                    vm.dynamicField.push(dynamic);
                  }
                  if (fields.displayMargin) {
                    const dynamic = {
                      fieldName: stringFormat('{0} Margin(%)', fields.fieldName),
                      id: fields.id,
                      displayPercentage: false,
                      displayMargin: true,
                      Type: fields.costingType
                    };
                    vm.dynamicField.push(dynamic);
                  }
                  const dynamicObj = {
                    fieldName: '', //vm.CostingType.FinalEA : '',
                    id: fields.id,
                    displayPercentage: null,
                    displayMargin: null,
                    total: null,
                    costingType: fields.costingType,
                    isLast: false
                  };
                  vm.dynamicField.push(dynamicObj);
                }
                if (!objItem && dynamicFieldObjItem) {
                  objItem = {
                    id: null,
                    rfqAssyQuoteID: item.id,
                    quoteChargeDynamicFieldID: dynamicFieldObjItem.id
                  };
                }
                // creating object for data
                objItem.type = fields.costingType;
                const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, { type: vm.CostingType.Adhoc });
                const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
                objItem.subTotal = total;
                objItem.unitprice = parseFloat(item.unitPrice);
                objItem.laborunitPrice = parseFloat(item.laborunitPrice);
                objItem.overheadUnitPrice = parseFloat(item.overheadUnitPrice);
                objItem.amount = objItem.amount || objItem.amount === 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : '0.00';
                objItem.percentage = objItem.percentage || objItem.percentage === 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : '0.00';
                objItem.margin = objItem.margin || objItem.margin === 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : '0.00';
                objItem.displayOrder = ++countItem;
                objItem.selectionType = fields.selectionType;
                objItem.affectType = fields.affectType;
                objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
                objItem.refCustomPartQuoteID = null;
                vm.listField.push(objItem);
              } else {
                let objNewItem = null;
                if (vm.AddNewOptionalAttribute.length > 0) {
                  objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => additionalCost.id === fields.id && !additionalCost.refCustomPartQuoteID);
                }
                if ((fields.applyToAll && fields.isActive && !vm.assemblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
                  if (!dynamicFieldObjItem) {
                    const dynamic = {
                      fieldName: stringFormat('{0}($)', fields.fieldName),
                      id: fields.id,
                      displayPercentage: false,
                      displayMargin: false,
                      displayDays: fields.isDaysRequire,
                      Type: fields.costingType,
                      applyToAll: fields.applyToAll
                    };
                    vm.dynamicField.push(dynamic);
                    if (fields.displayPercentage) {
                      const dynamic = {
                        fieldName: stringFormat('{0}(%)', fields.fieldName),
                        id: fields.id,
                        displayPercentage: true,
                        displayMargin: false,
                        Type: fields.costingType
                      };
                      vm.dynamicField.push(dynamic);
                    }
                    if (fields.displayMargin) {
                      const dynamic = {
                        fieldName: stringFormat('{0} Margin(%)', fields.fieldName),
                        id: fields.id,
                        displayPercentage: false,
                        displayMargin: true,
                        Type: fields.costingType
                      };
                      vm.dynamicField.push(dynamic);
                    }

                    const dynamicObj = {
                      fieldName: '', //vm.CostingType.FinalEA : '',
                      id: fields.id,
                      displayPercentage: null,
                      displayMargin: null,
                      total: null,
                      costingType: fields.costingType,
                      isLast: false
                    };
                    vm.dynamicField.push(dynamicObj);
                  }

                  const objDynamic = {
                    amount: (fields.costingType === vm.CostingType.TOOL) ? (fields.toolingPrice ? parseFloat(fields.toolingPrice).toFixed(_amountFilterDecimal) : '0.00') : '0.00',
                    id: null,
                    percentage: '0.00',
                    margin: '0.00',
                    days: null,
                    quoteChargeDynamicFieldID: fields.id,
                    refCustomPartQuoteID: null,
                    rfqAssyQuoteID: item.id,
                    type: fields.costingType,
                    displayOrder: ++countItem,
                    unitprice: parseFloat(item.unitPrice),
                    laborunitPrice: parseFloat(item.laborunitPrice),
                    overheadUnitPrice: parseFloat(item.overheadUnitPrice),
                    laborday: item.laborday,
                    toolingQty: fields.toolingQty || fields.toolingQty === 0 ? fields.toolingQty : '0'
                  };
                  if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[0].Value === fields.marginApplicableType && (fields.defaultMarginValue || fields.defaultMarginValue === 0)) {
                    const unitPrice = fields.costingType === vm.CostingType.Labor ? item.laborunitPrice : item.unitPrice;
                    if (parseFloat(unitPrice)) {
                      objDynamic.amount = fields.defaultMarginValue ? fields.defaultMarginValue.toFixed(_amountFilterDecimal) : '0.00';
                      objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                      objDynamic.percentage = parseFloat((((parseFloat(objDynamic.amount) * 100) / (parseFloat(unitPrice)))).toFixed(_amountFilterDecimal));
                    }
                    else {
                      objDynamic.amount = '0.00';
                      objDynamic.margin = '0.00';
                      objDynamic.percentage = '0.00';
                    }
                  }
                  else if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[1].Value === fields.marginApplicableType && (fields.defaultMarginValue || fields.defaultMarginValue === 0)) {
                    const unitPrice = fields.costingType === vm.CostingType.Labor ? item.laborunitPrice : item.unitPrice;
                    if (parseFloat(unitPrice)) {
                      objDynamic.percentage = fields.defaultMarginValue.toFixed(_amountFilterDecimal);
                      objDynamic.amount = parseFloat((((parseFloat(objDynamic.percentage) * (parseFloat(unitPrice))) / 100))).toFixed(_amountFilterDecimal);
                      objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                    }
                    else {
                      objDynamic.amount = '0.00';
                      objDynamic.margin = '0.00';
                      objDynamic.percentage = '0.00';
                    }
                  }
                  if (fields.isDaysRequire && (fields.defaultuomValue || fields.defaultuomType)) {
                    let days = fields.defaultuomValue ? fields.defaultuomValue : 0;
                    if (fields.defaultuomType === vm.timeType.WEEK.VALUE) {
                      days = days * 7;
                    }
                    else if (fields.defaultuomType === vm.timeType.BUSINESS_DAY.VALUE) {
                      days = Math.ceil(7 * days / 5);
                    }
                    objDynamic.days = days;
                    objDynamic.selectionType = fields.selectionType;
                    objDynamic.affectType = fields.affectType;
                  }
                  objDynamic.tooltip = fields.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', fields.affectType === 'M' ? 'Material' : 'Labor', fields.selectionType == 1 ? 'Whichever is greater' : 'Add to Lead Time') : stringFormat('Lead Time: Not Applicable');
                  const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type == vm.CostingType.Adhoc);
                  const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
                  objDynamic.subTotal = total;
                  vm.listField.push(objDynamic);
                }
              }
            });
            //Custom Part Related Changes
            if (item.rfqAssyQuotationsCustomParts && item.rfqAssyQuotationsCustomParts.length > 0) {
              _.each(item.rfqAssyQuotationsCustomParts, (custPartDet) => {
                var totalobjDyfieldsCostList = _.filter(dataFields, (objDyfields) => {
                  if (objDyfields.costingType == vm.CostingType.Material) {
                    const objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == objDyfields.id && additionalCost.refCustomPartQuoteID == custPartDet.id);
                    if (objAdditionalQuote) {
                      return true;
                    }
                    else {
                      const objQuoteAttribute = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == objDyfields.id);
                      if (objQuoteAttribute) {
                        const objQuoteAttributeClone = _.clone(objQuoteAttribute);
                        objQuoteAttributeClone.id = null;
                        objQuoteAttributeClone.refCustomPartQuoteID = custPartDet.id;
                        objQuoteAttributeClone.custPartId = custPartDet.customParts.id;
                        item.rfqAssyQuotationsAdditionalCost.push(objQuoteAttributeClone);
                      }
                      return objDyfields.isActive;
                    }
                  }
                });
                _.each(totalobjDyfieldsCostList, (fields) => {
                  var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == fields.id && additionalCost.refCustomPartQuoteID == custPartDet.id);
                  var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => dynamicFieldObj.id == fields.id && dynamicFieldObj.refCustomPartQuoteID == custPartDet.id);
                  if ((objItem) || (objItem && ((fields.applyToAll && fields.isActive) || fields.isActive))) {
                    if (!dynamicFieldObjItem) {
                      const dynamic = {
                        fieldName: stringFormat('{0}($)', fields.fieldName),
                        id: fields.id,
                        refCustomPartQuoteID: custPartDet.id,
                        displayPercentage: false,
                        displayMargin: false,
                        displayDays: fields.isDaysRequire,
                        Type: fields.costingType,
                        applyToAll: fields.applyToAll
                      };
                      vm.dynamicField.push(dynamic);
                      if (fields.displayPercentage) {
                        const dynamic = {
                          fieldName: stringFormat('{0}(%)', fields.fieldName),
                          id: fields.id,
                          refCustomPartQuoteID: custPartDet.id,
                          displayPercentage: true,
                          displayMargin: false,
                          Type: fields.costingType
                        };
                        vm.dynamicField.push(dynamic);
                      }
                      if (fields.displayMargin) {
                        const dynamic = {
                          fieldName: stringFormat('{0} Margin(%)', fields.fieldName),
                          id: fields.id,
                          refCustomPartQuoteID: custPartDet.id,
                          displayPercentage: false,
                          displayMargin: true,
                          Type: fields.costingType
                        };
                        vm.dynamicField.push(dynamic);
                      }
                      const dynamicObj = {
                        fieldName: '',
                        id: fields.id,
                        refCustomPartQuoteID: custPartDet.id,
                        displayPercentage: null,
                        displayMargin: null,
                        total: null,
                        costingType: fields.costingType,
                        isLast: false
                      };
                      vm.dynamicField.push(dynamicObj);
                    }
                    if (!objItem && dynamicFieldObjItem) {
                      objItem = {
                        id: null,
                        rfqAssyQuoteID: item.id,
                        refCustomPartQuoteID: custPartDet.id,
                        quoteChargeDynamicFieldID: dynamicFieldObjItem.id
                      };
                    }
                    // creating object for data
                    objItem.type = fields.costingType;
                    const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type === vm.CostingType.Adhoc);
                    let unitPrice = item.unitPrice;
                    if (custPartDet.id) {
                      unitPrice = custPartDet.unitPrice;
                    }
                    const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitPrice)).toFixed(_amountFilterDecimal);
                    objItem.subTotal = total;
                    objItem.unitprice = parseFloat(unitPrice);
                    objItem.laborunitPrice = parseFloat(item.laborunitPrice);
                    objItem.overheadUnitPrice = parseFloat(item.overheadUnitPrice);
                    objItem.amount = objItem.amount || objItem.amount === 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : '0.00';
                    objItem.percentage = objItem.percentage || objItem.percentage === 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : '0.00';
                    objItem.margin = objItem.margin || objItem.margin === 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : '0.00';
                    objItem.displayOrder = ++countItem;
                    objItem.selectionType = fields.selectionType;
                    objItem.refCustomPartQuoteID = custPartDet.id;
                    objItem.affectType = fields.affectType;
                    objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
                    objItem.custPartId = custPartDet.customParts.id;
                    vm.listField.push(objItem);
                  } else {
                    let objNewItem = null;
                    if (vm.AddNewOptionalAttribute.length > 0) {
                      objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => parseInt(additionalCost.id) === parseInt(fields.id));
                    }
                    if ((fields.applyToAll && fields.isActive && !vm.assemblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
                      if (!dynamicFieldObjItem) {
                        const dynamic = {
                          fieldName: stringFormat('{0}($)', fields.fieldName),
                          id: fields.id,
                          refCustomPartQuoteID: custPartDet.id,
                          displayPercentage: false,
                          displayMargin: false,
                          displayDays: fields.isDaysRequire,
                          Type: fields.costingType,
                          applyToAll: fields.applyToAll
                        };
                        vm.dynamicField.push(dynamic);
                        if (fields.displayPercentage) {
                          const dynamic = {
                            fieldName: stringFormat('{0}(%)', fields.fieldName),
                            id: fields.id,
                            refCustomPartQuoteID: custPartDet.id,
                            displayPercentage: true,
                            displayMargin: false,
                            Type: fields.costingType
                          };
                          vm.dynamicField.push(dynamic);
                        }
                        if (fields.displayMargin) {
                          const dynamic = {
                            fieldName: stringFormat('{0} Margin(%)', fields.fieldName),
                            id: fields.id,
                            refCustomPartQuoteID: custPartDet.id,
                            displayPercentage: false,
                            displayMargin: true,
                            Type: fields.costingType
                          };
                          vm.dynamicField.push(dynamic);
                        }

                        const dynamicObj = {
                          fieldName: '', //vm.CostingType.FinalEA : '',
                          id: fields.id,
                          refCustomPartQuoteID: custPartDet.id,
                          displayPercentage: null,
                          displayMargin: null,
                          total: null,
                          costingType: fields.costingType,
                          isLast: false
                        };
                        vm.dynamicField.push(dynamicObj);
                      }

                      const objDynamic = {
                        amount: (fields.costingType == vm.CostingType.TOOL) ? (fields.toolingPrice ? parseFloat(fields.toolingPrice).toFixed(_amountFilterDecimal) : '0.00') : '0.00',
                        id: null,
                        percentage: '0.00',
                        margin: '0.00',
                        days: null,
                        quoteChargeDynamicFieldID: fields.id,
                        refCustomPartQuoteID: custPartDet.id,
                        rfqAssyQuoteID: item.id,
                        type: fields.costingType,
                        displayOrder: ++countItem,
                        unitprice: parseFloat(custPartDet.unitPrice),
                        laborunitPrice: parseFloat(item.laborunitPrice),
                        laborday: item.laborday,
                        overheadUnitPrice: parseFloat(item.overheadUnitPrice),
                        overheadDay: item.overheadDay,
                        toolingQty: fields.toolingQty || fields.toolingQty == 0 ? fields.toolingQty : '0'
                      };
                      if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[0].Value == fields.marginApplicableType && (fields.defaultMarginValue || fields.defaultMarginValue == 0)) {
                        const unitPrice = fields.costingType == vm.CostingType.Labor ? item.laborunitPrice : custPartDet.unitPrice;
                        if (parseFloat(unitPrice)) {
                          objDynamic.amount = fields.defaultMarginValue > parseFloat(unitPrice) ? unitPrice : fields.defaultMarginValue.toFixed(_amountFilterDecimal);
                          objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                          objDynamic.percentage = parseFloat((((parseFloat(objDynamic.amount) * 100) / (parseFloat(unitPrice)))).toFixed(_amountFilterDecimal));
                        }
                        else {
                          objDynamic.amount = '0.00';
                          objDynamic.margin = '0.00';
                          objDynamic.percentage = '0.00';
                        }
                      }
                      else if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[1].Value == fields.marginApplicableType && (fields.defaultMarginValue || fields.defaultMarginValue == 0)) {
                        const unitPrice = fields.costingType == vm.CostingType.Labor ? item.laborunitPrice : custPartDet.unitPrice;
                        if (parseFloat(unitPrice)) {
                          objDynamic.percentage = fields.defaultMarginValue.toFixed(_amountFilterDecimal);
                          objDynamic.amount = parseFloat((((parseFloat(objDynamic.percentage) * (parseFloat(unitPrice))) / 100))).toFixed(_amountFilterDecimal);
                          objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                        }
                        else {
                          objDynamic.amount = '0.00';
                          objDynamic.margin = '0.00';
                          objDynamic.percentage = '0.00';
                        }
                      }
                      if (fields.isDaysRequire && (fields.defaultuomValue || fields.defaultuomType)) {
                        let days = fields.defaultuomValue ? fields.defaultuomValue : 0;
                        if (fields.defaultuomType === vm.timeType.WEEK.VALUE) {
                          days = days * 7;
                        }
                        else if (fields.defaultuomType === vm.timeType.BUSINESS_DAY.VALUE) {
                          days = Math.ceil(7 * days / 5);
                        }
                        objDynamic.days = days;
                        objDynamic.selectionType = fields.selectionType;
                        objDynamic.affectType = fields.affectType;
                        // objDynamic.
                      }
                      objDynamic.tooltip = fields.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', fields.affectType == 'M' ? 'Material' : 'Labor', fields.selectionType == 1 ? 'Whichever is greater' : 'Add to Lead Time') : stringFormat('Lead Time: Not Applicable');
                      const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type == vm.CostingType.Adhoc);
                      const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(parseFloat(custPartDet.unitPrice))).toFixed(_amountFilterDecimal);
                      objDynamic.subTotal = total;
                      objDynamic.custPartId = custPartDet.customParts.id;
                      objDynamic.refCustomPartQuoteID = custPartDet.id;
                      vm.listField.push(objDynamic);
                    }
                  }
                  if (!_.find(vm.dynamicField, (d) => { if (d.isMaterialCostTotal && d.refCustomPartQuoteID == custPartDet.id) { return d; } })) {
                    const dynamicCustPartTotalObj = {
                      fieldName: '',
                      refCustomPartQuoteID: custPartDet.id,
                      id: fields.id,
                      isMaterialCostTotal: true,
                      displayPercentage: null,
                      displayMargin: null,
                      total: null,
                      costingType: vm.CostingType.Material,
                      isLast: false
                    };
                    vm.dynamicField.push(dynamicCustPartTotalObj);
                    const objDynamic = {
                      rfqAssyQuoteID: item.id,
                      quoteChargeDynamicFieldID: fields.id,
                      refCustomPartQuoteID: custPartDet.id,
                      custPartId: custPartDet.customParts.id,
                      isMaterialCostTotal: true,
                      displayOrder: ++countItem,
                      amount: '0.00',
                      margin: '0.00',
                      percentage: '0.00',
                      days: null
                    };
                    vm.listField.push(objDynamic);
                  }
                });
              });
            }
            i++;
          });

          // bind ad Hoc data
          const totalAdHOCCostList = _.filter(vm.dynamicFieldsAdHOC, (objDyAdHOC) => {
            const objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, { quoteChargeDynamicFieldID: objDyAdHOC.id });
            if (objAdditionalQuote) {
              return true;
            }
            else {
              return objDyAdHOC.isActive;
            }
          });
          if (index === 0) {
            const dynamicAdhoc = {
              fieldName: stringFormat('Overhead Cost($)'),
              id: null,
              displayPercentage: null,
              displayMargin: null,
              displayDays: null,
              Type: 'Adhoc'
            };
            vm.dynamicField.push(dynamicAdhoc);
          }
          _.each(totalAdHOCCostList, (adhoc) => {
            var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, { quoteChargeDynamicFieldID: adhoc.id });
            var dynamicFieldObjItem = _.find(vm.dynamicField, { id: adhoc.id });
            if ((objItem) || (objItem && ((adhoc.applyToAll && adhoc.isActive) || adhoc.isActive))) {
              if (!dynamicFieldObjItem) {
                const dynamic = {
                  fieldName: stringFormat('{0}($)', adhoc.fieldName),
                  id: adhoc.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: adhoc.isDaysRequire,
                  Type: adhoc.costingType,
                  applyToAll: adhoc.applyToAll
                };
                vm.dynamicField.push(dynamic);
                if (adhoc.displayPercentage) {
                  const dynamic = {
                    fieldName: stringFormat('{0}(%)', adhoc.fieldName),
                    id: adhoc.id,
                    displayPercentage: true,
                    displayMargin: false,
                    Type: adhoc.costingType
                  };
                  vm.dynamicField.push(dynamic);
                }
                if (adhoc.displayMargin) {
                  const dynamic = {
                    fieldName: stringFormat('{0} Margin(%)', adhoc.fieldName),
                    id: adhoc.id,
                    displayPercentage: false,
                    displayMargin: true,
                    Type: adhoc.costingType
                  };
                  vm.dynamicField.push(dynamic);
                }
                const dynamicObj = {
                  fieldName: '', //vm.CostingType.FinalEA : '',
                  id: adhoc.id,
                  displayPercentage: null,
                  displayMargin: null,
                  total: null,
                  costingType: adhoc.costingType,
                  isLast: false
                };
                vm.dynamicField.push(dynamicObj);
              }
              if (!objItem && dynamicFieldObjItem) {
                objItem = {
                  id: null,
                  rfqAssyQuoteID: item.id,
                  quoteChargeDynamicFieldID: dynamicFieldObjItem.id
                };
              }
              // creating object for data
              objItem.type = adhoc.costingType;
              const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, { type: vm.CostingType.Adhoc });
              const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
              objItem.subTotal = total;
              objItem.unitprice = parseFloat(item.unitPrice);
              objItem.laborunitPrice = parseFloat(item.laborunitPrice);
              objItem.overheadUnitPrice = parseFloat(item.overheadUnitPrice);
              objItem.amount = objItem.amount || objItem.amount === 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : '0.00';
              objItem.percentage = objItem.percentage || objItem.percentage === 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : '0.00';
              objItem.margin = objItem.margin || objItem.margin === 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : '0.00';
              objItem.displayOrder = ++countItem;
              objItem.selectionType = adhoc.selectionType;
              objItem.affectType = adhoc.affectType;
              objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
              vm.listField.push(objItem);
            } else {
              let objNewItem = null;
              if (vm.AddNewOptionalAttribute.length > 0) {
                objNewItem = _.find(vm.AddNewOptionalAttribute, { id: adhoc.id });
              }
              if ((adhoc.applyToAll && adhoc.isActive && !vm.assemblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
                if (!dynamicFieldObjItem) {
                  const dynamic = {
                    fieldName: stringFormat('{0}($)', adhoc.fieldName),
                    id: adhoc.id,
                    displayPercentage: false,
                    displayMargin: false,
                    displayDays: adhoc.isDaysRequire,
                    Type: adhoc.costingType,
                    applyToAll: adhoc.applyToAll
                  };
                  vm.dynamicField.push(dynamic);
                  if (adhoc.displayPercentage) {
                    const dynamic = {
                      fieldName: stringFormat('{0}(%)', adhoc.fieldName),
                      id: adhoc.id,
                      displayPercentage: true,
                      displayMargin: false,
                      Type: adhoc.costingType
                    };
                    vm.dynamicField.push(dynamic);
                  }
                  if (adhoc.displayMargin) {
                    const dynamic = {
                      fieldName: stringFormat('{0} Margin(%)', adhoc.fieldName),
                      id: adhoc.id,
                      displayPercentage: false,
                      displayMargin: true,
                      Type: adhoc.costingType
                    };
                    vm.dynamicField.push(dynamic);
                  }
                  const dynamicObj = {
                    fieldName: '', //vm.CostingType.FinalEA : '',
                    id: adhoc.id,
                    displayPercentage: null,
                    displayMargin: null,
                    total: null,
                    costingType: adhoc.costingType,
                    isLast: false
                  };
                  vm.dynamicField.push(dynamicObj);
                }
                const objDynamic = {
                  amount: (adhoc.costingType === vm.CostingType.TOOL) ? (adhoc.toolingPrice ? parseFloat(adhoc.toolingPrice).toFixed(_amountFilterDecimal) : '0.00') : '0.00',
                  id: null,
                  percentage: '0.00',
                  margin: '0.00',
                  days: null,
                  quoteChargeDynamicFieldID: adhoc.id,
                  rfqAssyQuoteID: item.id,
                  type: adhoc.costingType,
                  displayOrder: ++countItem,
                  unitprice: parseFloat(item.unitPrice),
                  laborunitPrice: parseFloat(item.laborunitPrice),
                  overheadDay: item.overheadDay,
                  overheadUnitPrice: parseFloat(item.overheadUnitPrice),
                  laborday: item.laborday,
                  toolingQty: adhoc.toolingQty || adhoc.toolingQty === 0 ? adhoc.toolingQty : '0'
                };
                if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[0].Value == adhoc.marginApplicableType && (adhoc.defaultMarginValue || adhoc.defaultMarginValue == 0)) {
                  const unitPrice = item.overheadUnitPrice;
                  if (parseFloat(unitPrice)) {
                    objDynamic.amount = adhoc.defaultMarginValue > parseFloat(unitPrice) ? unitPrice : adhoc.defaultMarginValue.toFixed(_amountFilterDecimal);
                    objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                    objDynamic.percentage = parseFloat((((parseFloat(objDynamic.amount) * 100) / (parseFloat(unitPrice)))).toFixed(_amountFilterDecimal));
                  }
                  else {
                    objDynamic.amount = '0.00';
                    objDynamic.margin = '0.00';
                    objDynamic.percentage = '0.00';
                  }
                }
                else if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[1].Value == adhoc.marginApplicableType && (adhoc.defaultMarginValue || adhoc.defaultMarginValue == 0)) {
                  const unitPrice = item.overheadUnitPrice;
                  if (parseFloat(unitPrice)) {
                    objDynamic.percentage = adhoc.defaultMarginValue.toFixed(_amountFilterDecimal);
                    objDynamic.amount = parseFloat((((parseFloat(objDynamic.percentage) * (parseFloat(unitPrice))) / 100))).toFixed(_amountFilterDecimal);
                    objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                  }
                  else {
                    objDynamic.amount = '0.00';
                    objDynamic.margin = '0.00';
                    objDynamic.percentage = '0.00';
                  }
                }
                if (adhoc.isDaysRequire && (adhoc.defaultuomValue || adhoc.defaultuomType)) {
                  let days = adhoc.defaultuomValue ? adhoc.defaultuomValue : 0;
                  if (adhoc.defaultuomType === vm.timeType.WEEK.VALUE) {
                    days = days * 7;
                  }
                  else if (adhoc.defaultuomType === vm.timeType.BUSINESS_DAY.VALUE) {
                    days = Math.ceil(7 * days / 5);
                  }
                  objDynamic.days = days;
                  objDynamic.selectionType = adhoc.selectionType;
                  objDynamic.affectType = adhoc.affectType;
                }
                objDynamic.tooltip = adhoc.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', adhoc.affectType == 'M' ? 'Material' : 'Labor', adhoc.selectionType == 1 ? 'Whichever is greater' : 'Add to Lead Time') : stringFormat('Lead Time: Not Applicable');
                const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type == vm.CostingType.Adhoc);
                const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
                objDynamic.subTotal = total;
                vm.listField.push(objDynamic);
              }
            }
          });



          // bind All Attribute data
          const totalAllCostList = _.filter(vm.dynamicFieldsAll, (objDyAll) => {
            const objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, { quoteChargeDynamicFieldID: objDyAll.id });
            if (objAdditionalQuote) {
              return true;
            }
            else {
              return objDyAll.isActive;
            }
          });
          _.each(totalAllCostList, (all) => {
            let objItem = _.find(item.rfqAssyQuotationsAdditionalCost, { quoteChargeDynamicFieldID: all.id });
            const dynamicFieldObjItem = _.find(vm.dynamicField, { id: all.id });
            if ((objItem) || (objItem && ((all.applyToAll && all.isActive) || all.isActive))) {
              if (!dynamicFieldObjItem) {
                const dynamic = {
                  fieldName: stringFormat('{0}($)', all.fieldName),
                  id: all.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: all.isDaysRequire,
                  Type: all.costingType,
                  applyToAll: all.applyToAll
                };
                vm.dynamicField.push(dynamic);
                if (all.displayPercentage) {
                  const dynamic = {
                    fieldName: stringFormat('{0}(%)', all.fieldName),
                    id: all.id,
                    displayPercentage: true,
                    displayMargin: false,
                    Type: all.costingType
                  };
                  vm.dynamicField.push(dynamic);
                }
                if (all.displayMargin) {
                  const dynamic = {
                    fieldName: stringFormat('{0} Margin(%)', all.fieldName),
                    id: all.id,
                    displayPercentage: false,
                    displayMargin: true,
                    Type: all.costingType
                  };
                  vm.dynamicField.push(dynamic);
                }
                const dynamicObj = {
                  fieldName: '', //vm.CostingType.FinalEA : '',
                  id: all.id,
                  displayPercentage: null,
                  displayMargin: null,
                  total: null,
                  costingType: all.costingType,
                  isLast: false
                };
                vm.dynamicField.push(dynamicObj);
              }
              if (!objItem && dynamicFieldObjItem) {
                objItem = {
                  id: null,
                  rfqAssyQuoteID: item.id,
                  quoteChargeDynamicFieldID: dynamicFieldObjItem.id
                };
              }
              // creating object for data
              objItem.type = all.costingType;
              const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, { type: vm.CostingType.ALL });
              const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
              objItem.subTotal = total;
              objItem.unitprice = parseFloat(item.unitPrice);
              objItem.laborunitPrice = parseFloat(item.laborunitPrice);
              objItem.overheadUnitPrice = parseFloat(item.overheadUnitPrice);
              objItem.amount = objItem.amount || objItem.amount === 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : '0.00';
              objItem.percentage = objItem.percentage || objItem.percentage === 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : '0.00';
              objItem.margin = objItem.margin || objItem.margin === 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : '0.00';
              objItem.displayOrder = ++countItem;
              objItem.selectionType = all.selectionType;
              objItem.affectType = all.affectType;
              objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
              vm.listField.push(objItem);
            } else {
              let objNewItem = null;
              if (vm.AddNewOptionalAttribute.length > 0) {
                objNewItem = _.find(vm.AddNewOptionalAttribute, { id: all.id });
              }
              if ((all.applyToAll && all.isActive && !vm.assemblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
                if (!dynamicFieldObjItem) {
                  const dynamic = {
                    fieldName: stringFormat('{0}($)', all.fieldName),
                    id: all.id,
                    displayPercentage: false,
                    displayMargin: false,
                    displayDays: all.isDaysRequire,
                    Type: all.costingType,
                    applyToAll: all.applyToAll
                  };
                  vm.dynamicField.push(dynamic);
                  if (all.displayPercentage) {
                    const dynamic = {
                      fieldName: stringFormat('{0}(%)', all.fieldName),
                      id: all.id,
                      displayPercentage: true,
                      displayMargin: false,
                      Type: all.costingType
                    };
                    vm.dynamicField.push(dynamic);
                  }
                  if (all.displayMargin) {
                    const dynamic = {
                      fieldName: stringFormat('{0} Margin(%)', all.fieldName),
                      id: all.id,
                      displayPercentage: false,
                      displayMargin: true,
                      Type: all.costingType
                    };
                    vm.dynamicField.push(dynamic);
                  }
                  const dynamicObj = {
                    fieldName: '', //vm.CostingType.FinalEA : '',
                    id: all.id,
                    displayPercentage: null,
                    displayMargin: null,
                    total: null,
                    costingType: all.costingType,
                    isLast: false
                  };
                  vm.dynamicField.push(dynamicObj);
                }
                const objDynamic = {
                  amount: (all.costingType === vm.CostingType.TOOL) ? (all.toolingPrice ? parseFloat(all.toolingPrice).toFixed(_amountFilterDecimal) : '0.00') : '0.00',
                  id: null,
                  percentage: '0.00',
                  margin: '0.00',
                  days: null,
                  quoteChargeDynamicFieldID: all.id,
                  rfqAssyQuoteID: item.id,
                  type: all.costingType,
                  displayOrder: ++countItem,
                  unitprice: parseFloat(item.unitPrice),
                  laborunitPrice: parseFloat(item.laborunitPrice),
                  laborday: item.laborday,
                  overheadUnitPrice: parseFloat(item.overheadUnitPrice),
                  overheadDay: item.overheadDay,
                  toolingQty: all.toolingQty || all.toolingQty === 0 ? all.toolingQty : '0'
                };
                if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[0].Value === all.marginApplicableType && (all.defaultMarginValue || all.defaultMarginValue === 0)) {
                  const unitPrice = ((item.unitPrice ? parseFloat(item.unitPrice) : 0) + (item.laborunitPrice ? parseFloat(item.laborunitPrice) : 0) + (item.overheadUnitPrice ? parseFloat(item.overheadUnitPrice) : 0));
                  if (parseFloat(unitPrice)) {
                    objDynamic.amount = all.defaultMarginValue > parseFloat(unitPrice) ? unitPrice : all.defaultMarginValue.toFixed(_amountFilterDecimal);
                    objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                    objDynamic.percentage = parseFloat((((parseFloat(objDynamic.amount) * 100) / (parseFloat(unitPrice)))).toFixed(_amountFilterDecimal));
                  }
                  else {
                    objDynamic.amount = '0.00';
                    objDynamic.margin = '0.00';
                    objDynamic.percentage = '0.00';
                  }
                }
                else if (RFQTRANSACTION.QUOTE_ATTRIBUTE_MARGIN_TYPE[1].Value === all.marginApplicableType && (all.defaultMarginValue || all.defaultMarginValue === 0)) {
                  const unitPrice = ((item.unitPrice ? parseFloat(item.unitPrice) : 0) + (item.laborunitPrice ? parseFloat(item.laborunitPrice) : 0) + (item.overheadUnitPrice ? parseFloat(item.overheadUnitPrice) : 0));
                  if (parseFloat(unitPrice)) {
                    objDynamic.percentage = all.defaultMarginValue.toFixed(_amountFilterDecimal);
                    objDynamic.amount = parseFloat((((parseFloat(objDynamic.percentage) * (parseFloat(unitPrice))) / 100))).toFixed(_amountFilterDecimal);
                    objDynamic.margin = parseFloat((((parseFloat(objDynamic.amount) * 100) / ((parseFloat(unitPrice)) + parseFloat(objDynamic.amount))))).toFixed(_amountFilterDecimal);
                  }
                  else {
                    objDynamic.amount = '0.00';
                    objDynamic.margin = '0.00';
                    objDynamic.percentage = '0.00';
                  }
                }
                if (all.isDaysRequire && (all.defaultuomValue || all.defaultuomType)) {
                  let days = all.defaultuomValue ? all.defaultuomValue : 0;
                  if (all.defaultuomType === vm.timeType.WEEK.VALUE) {
                    days = days * 7;
                  }
                  else if (all.defaultuomType === vm.timeType.BUSINESS_DAY.VALUE) {
                    days = Math.ceil(7 * days / 5);
                  }
                  objDynamic.days = days;
                  objDynamic.selectionType = all.selectionType;
                  objDynamic.affectType = all.affectType;
                }
                objDynamic.tooltip = all.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', all.affectType == 'M' ? 'Material' : 'Labor', all.selectionType == 1 ? 'Whichever is greater' : 'Add to Lead Time') : stringFormat('Lead Time: Not Applicable');
                const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type === vm.CostingType.ALL);
                const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
                objDynamic.subTotal = total;
                vm.listField.push(objDynamic);
              }
            }
          });
          const dynamicFieldAllTotalWithAttribute = _.find(vm.dynamicField, { isCostTotalWithAttribute: true });
          if (!dynamicFieldAllTotalWithAttribute) {
            const dynamicTotalObj = {
              fieldName: '',
              id: null,
              isCostTotalWithAttribute: true,
              displayPercentage: null,
              displayMargin: null,
              total: null,
              costingType: vm.CostingType.ALL,
              isLast: false
            };
            vm.dynamicField.push(dynamicTotalObj);
          }
          const dynamicFieldAllTotal = _.find(vm.dynamicField, { isCostTotal: true });
          if (!dynamicFieldAllTotal) {
            const dynamicTotalObj = {
              fieldName: '',
              id: null,
              isCostTotal: true,
              displayPercentage: null,
              displayMargin: null,
              total: null,
              costingType: vm.CostingType.ALL,
              isLast: false
            };
            vm.dynamicField.push(dynamicTotalObj);
          }
          const dynamicFieldFinalEA = _.find(vm.dynamicField, { fieldName: vm.CostingType.FinalEA });
          if (!dynamicFieldFinalEA) {
            const dynamicd = {
              fieldName: vm.CostingType.FinalEA,
              id: null,
              displayPercentage: null,
              displayMargin: null,
              total: null,
              costingType: vm.CostingType.FinalEA,
              isLast: true
            };
            vm.dynamicField.push(dynamicd);
          }
          // bind NRE data
          let NRECount = 0;
          const totalNRECostList = _.filter(vm.dynamicFieldsNRE, (objDyNRE) => {
            const objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == objDyNRE.id);
            if (objAdditionalQuote) {
              return true;
            }
            else {
              return objDyNRE.isActive;
            }
          });
          _.each(totalNRECostList, (nre) => {
            var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == nre.id);
            var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => dynamicFieldObj.id == nre.id);
            if ((objItem) || (objItem && ((nre.applyToAll && nre.isActive) || nre.isActive))) {
              if (!dynamicFieldObjItem) {
                const dynamic = {
                  fieldName: stringFormat('{0}($)', nre.fieldName),
                  id: nre.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: nre.isDaysRequire,
                  Type: nre.costingType,
                  tooltip: nre.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', nre.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, nre.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat('Lead Time: Not Applicable'),
                  applyToAll: nre.applyToAll
                };
                vm.dynamicField.push(dynamic);
              }
              if (!objItem && dynamicFieldObjItem) {
                objItem = {
                  id: null,
                  rfqAssyQuoteID: item.id,
                  quoteChargeDynamicFieldID: dynamicFieldObjItem.id
                };
              }

              // creating object for data
              objItem.type = nre.costingType;
              const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type == vm.CostingType.Adhoc);
              const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
              objItem.subTotal = total;
              objItem.unitprice = parseFloat(item.unitPrice);
              objItem.laborunitPrice = parseFloat(item.laborunitPrice);
              objItem.overheadUnitPrice = parseFloat(item.overheadUnitPrice);
              objItem.amount = objItem.amount || objItem.amount === 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : '0.00';
              objItem.percentage = objItem.percentage || objItem.percentage === 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : '0.00';
              objItem.margin = objItem.margin || objItem.margin === 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : '0.00';
              objItem.displayOrder = ++countItem;
              objItem.selectionType = nre.selectionType;
              objItem.affectType = nre.affectType;
              objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
              vm.listField.push(objItem);
            } else {
              let objNewItem = null;
              const objNREisAvailable = _.find(vm.dynamicField, (a) => a.fieldName === vm.CostingType.TotalNRE);
              if (vm.AddNewOptionalAttribute.length > 0) {
                objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => additionalCost.id == nre.id);
              }
              if ((nre.applyToAll && nre.isActive && !vm.assemblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
                if (!dynamicFieldObjItem) {
                  const dynamic = {
                    fieldName: stringFormat('{0}($)', nre.fieldName),
                    id: nre.id,
                    displayPercentage: false,
                    displayMargin: false,
                    displayDays: nre.isDaysRequire,
                    Type: nre.costingType,
                    tooltip: nre.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', nre.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, nre.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat('Lead Time: Not Applicable'),
                    applyToAll: nre.applyToAll
                  };
                  if (objNREisAvailable) {
                    vm.dynamicField.splice(vm.dynamicField.indexOf(objNREisAvailable), 0, dynamic);
                  } else {
                    vm.dynamicField.push(dynamic);
                  }
                }

                const objDynamic = {
                  amount: (nre.costingType === vm.CostingType.NRE) ? (nre.toolingPrice ? parseFloat(nre.toolingPrice).toFixed(_amountFilterDecimal) : '0.00') : '0.00',
                  id: null,
                  percentage: '0.00',
                  margin: '0.00',
                  days: null,
                  quoteChargeDynamicFieldID: nre.id,
                  rfqAssyQuoteID: item.id,
                  type: nre.costingType,
                  displayOrder: ++countItem,
                  unitprice: parseFloat(item.unitPrice),
                  laborunitPrice: parseFloat(item.laborunitPrice),
                  laborday: item.laborday,
                  overheadUnitPrice: parseFloat(item.overheadUnitPrice),
                  overheadDay: item.overheadDay,
                  toolingQty: nre.toolingQty || nre.toolingQty == 0 ? nre.toolingQty : '0'
                };
                if (nre.isDaysRequire && (nre.defaultuomValue || nre.defaultuomType)) {
                  let days = nre.defaultuomValue ? nre.defaultuomValue : 0;
                  if (nre.defaultuomType === vm.timeType.WEEK.VALUE) {
                    days = days * 7;
                  }
                  else if (nre.defaultuomType === vm.timeType.BUSINESS_DAY.VALUE) {
                    days = Math.ceil(7 * days / 5);
                  }
                  objDynamic.days = days;
                  objDynamic.selectionType = nre.selectionType;
                  objDynamic.affectType = nre.affectType;
                }
                objDynamic.tooltip = nre.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', nre.affectType === 'M' ? 'Material' : 'Labor', nre.selectionType == 1 ? 'Whichever is greater' : 'Add to Lead Time') : stringFormat('Lead Time: Not Applicable');
                const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type === vm.CostingType.Adhoc);
                const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
                objDynamic.subTotal = total;
                vm.listField.push(objDynamic);
              }
            }
            const dynamicFieldTotalNREItem = _.find(vm.dynamicField, (dynamicFieldObj) => dynamicFieldObj.fieldName === vm.CostingType.TotalNRE);
            NRECount++;
            if (NRECount === totalNRECostList.length && !dynamicFieldTotalNREItem) {
              const dynamicd = {
                fieldName: vm.CostingType.TotalNRE,//datalist[0]
                id: null,
                displayPercentage: null,
                displayMargin: null,
                total: null,
                costingType: nre.costingType,
                isLast: true
              };
              vm.dynamicField.push(dynamicd);
            }
          });

          // bind Tooling data
          let ToolCount = 0;
          const totalToolingCostList = _.filter(vm.dynamicFieldsTool, (objDyTool) => {
            const objAdditionalQuote = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == objDyTool.id);
            if (objAdditionalQuote) {
              return true;
            }
            else {
              return objDyTool.isActive;
            }
          });
          _.each(totalToolingCostList, (tool) => {
            var objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == tool.id);
            var dynamicFieldObjItem = _.find(vm.dynamicField, (dynamicFieldObj) => dynamicFieldObj.id == tool.id);
            if ((objItem) || (objItem && ((tool.applyToAll && tool.isActive) || tool.isActive))) {
              if (!dynamicFieldObjItem) {
                const dynamic = {
                  fieldName: stringFormat('{0}($)', tool.fieldName),
                  id: tool.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: tool.isDaysRequire,
                  Type: tool.costingType,
                  tooltip: tool.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', tool.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, tool.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat('Lead Time: Not Applicable'),
                  applyToAll: tool.applyToAll
                };
                vm.dynamicField.push(dynamic);
              }
              if (!objItem && dynamicFieldObjItem) {
                objItem = {
                  id: null,
                  rfqAssyQuoteID: item.id,
                  quoteChargeDynamicFieldID: dynamicFieldObjItem.id
                };
              }
              // creating object for data
              objItem.type = tool.costingType;
              const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type == vm.CostingType.Adhoc);
              const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(item.unitPrice)).toFixed(_amountFilterDecimal);
              objItem.subTotal = total;
              objItem.unitprice = parseFloat(item.unitPrice);
              objItem.laborunitPrice = parseFloat(item.laborunitPrice);
              objItem.overheadUnitPrice = parseFloat(item.overheadUnitPrice);
              objItem.amount = objItem.amount || objItem.amount == 0 ? parseFloat(objItem.amount).toFixed(_amountFilterDecimal) : '0.00';
              objItem.percentage = objItem.percentage || objItem.percentage == 0 ? parseFloat(objItem.percentage).toFixed(_amountFilterDecimal) : '0.00';
              objItem.margin = objItem.margin || objItem.margin == 0 ? parseFloat(objItem.margin).toFixed(_amountFilterDecimal) : '0.00';
              objItem.displayOrder = ++countItem;
              objItem.selectionType = tool.selectionType;
              objItem.affectType = tool.affectType;
              objItem.toolingQty = objItem.toolingQty ? objItem.toolingQty : 0;
              vm.listField.push(objItem);
            } else {
              let objNewItem = null;
              const objToolisAvailable = _.find(vm.dynamicField, (a) => a.fieldName === vm.CostingType.TotalTOOL);
              if (vm.AddNewOptionalAttribute.length > 0) {
                objNewItem = _.find(vm.AddNewOptionalAttribute, (additionalCost) => additionalCost.id == tool.id);
              }
              if ((tool.applyToAll && tool.isActive && !vm.assemblyData.isSummaryComplete) || (objNewItem || dynamicFieldObjItem)) {
                if (!dynamicFieldObjItem) {
                  const dynamic = {
                    fieldName: stringFormat('{0}($)', tool.fieldName),
                    id: tool.id,
                    displayPercentage: false,
                    displayMargin: false,
                    displayDays: tool.isDaysRequire,
                    Type: tool.costingType,
                    tooltip: tool.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', tool.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, tool.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat('Lead Time: Not Applicable'),
                    applyToAll: tool.applyToAll
                  };
                  if (objToolisAvailable) {
                    vm.dynamicField.splice(vm.dynamicField.indexOf(objToolisAvailable), 0, dynamic);
                  } else {
                    vm.dynamicField.push(dynamic);
                  }
                }

                const objDynamic = {
                  amount: (tool.costingType === vm.CostingType.TOOL) ? (tool.toolingPrice ? parseFloat(tool.toolingPrice).toFixed(_amountFilterDecimal) : '0.00') : '0.00',
                  id: null,
                  percentage: '0.00',
                  margin: '0.00',
                  days: null,
                  quoteChargeDynamicFieldID: tool.id,
                  rfqAssyQuoteID: item.id,
                  type: tool.costingType,
                  displayOrder: ++countItem,
                  unitprice: parseFloat(item.unitPrice),
                  laborunitPrice: parseFloat(item.laborunitPrice),
                  laborday: item.laborday,
                  overheadUnitPrice: parseFloat(item.overheadUnitPrice),
                  overheadDay: item.overheadDay,
                  toolingQty: tool.toolingQty || tool.toolingQty == 0 ? tool.toolingQty : '0'
                };
                if (tool.isDaysRequire && (tool.defaultuomValue || tool.defaultuomType)) {
                  let days = tool.defaultuomValue ? tool.defaultuomValue : 0;
                  if (tool.defaultuomType === vm.timeType.WEEK.VALUE) {
                    days = days * 7;
                  }
                  else if (tool.defaultuomType === vm.timeType.BUSINESS_DAY.VALUE) {
                    days = Math.ceil(7 * days / 5);
                  }
                  objDynamic.days = days;
                  objDynamic.selectionType = tool.selectionType;
                  objDynamic.affectType = tool.affectType;
                }
                objDynamic.tooltip = tool.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', tool.affectType === 'M' ? 'Material' : 'Labor', tool.selectionType == 1 ? 'Whichever is greater' : 'Add to Lead Time') : stringFormat('Lead Time: Not Applicable');
                const listItem = _.filter(item.rfqAssyQuotationsAdditionalCost, (list) => list.type === vm.CostingType.Adhoc);
                const total = (_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(parseFloat(item.unitPrice))).toFixed(_amountFilterDecimal);
                objDynamic.subTotal = total;
                vm.listField.push(objDynamic);
              }
            }
            const dynamicFieldTotalToolItem = _.find(vm.dynamicField, (dynamicFieldObj) => dynamicFieldObj.fieldName === vm.CostingType.TotalTOOL);
            ToolCount++;
            if (ToolCount === totalToolingCostList.length && !dynamicFieldTotalToolItem) {
              const dynamicd = {
                fieldName: vm.CostingType.TotalTOOL,//datalist[0]
                id: null,
                displayPercentage: null,
                displayMargin: null,
                total: null,
                costingType: tool.costingType,
                isLast: true
              };
              vm.dynamicField.push(dynamicd);
            }
          });

          const objDynamic = {
            amount: '0.00',
            id: null,
            percentage: '0.00',
            margin: '0.00',
            days: null,
            quoteChargeDynamicFieldID: null,
            rfqAssyQuoteID: item.id,
            type: vm.CostingType.FinalEA,
            displayOrder: ++countItem,
            unitprice: null,
            toolingQty: '0',
            laborunitPrice: null,
            overheadUnitPrice: null
          };
          vm.listField.push(objDynamic);
        });
        vm.summaryModel = [];
        vm.customPartModel = [];
        vm.customPartDetail = [];
        $timeout(() => {
          updateHeader();
        });
      };
      //get summary terms and condition list
      const getTermsandCondition = () => PartCostingFactory.getSummaryTermsCondition().query({ rfqAssyID: rfqAssyID }).$promise.then((terms) => {
        if (terms && terms.data) {
          vm.termsandcondition = terms.data;
          return terms.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
      //get dynamic list for summary
      const getDynamicFields = (isAddedOptionalAttribute) => PartCostingFactory.retriveDynamicFields().query().$promise.then((dynamic) => {
        if (dynamic && dynamic.data) {
          vm.dynamicFieldList = _.orderBy(dynamic.data, 'costingType', 'desc');
          if (isAddedOptionalAttribute) {
            vm.listField = [];
            bindSummaryDetailList();
            vm.changevalue();
          }
          return dynamic.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

      //get comment from RFQ assembly
      const getComment = () => CustomerConfirmationPopupFactory.getRFQLineItemsDescription().query({ id: vm.assemblyData.partID }).$promise.then((res) => {
        if (res && res.data) {
          vm.lineitemsDescriptionList = _.sortBy(res.data.response, (x) => parseInt(x.lineID));
          _.each(vm.lineitemsDescriptionList, (item) => {
            var level = _.maxBy(_.filter(res.data.asseblyList, { prPerPartID: item.partID }), 'level').level;
            item.assyLevel = level;
            item.assyID = item.component ? item.component.PIDcode : '';
            item.displayDescription = [];
            const err = item.description ? item.description.split('\n') : [];
            _.each(err, (error) => {
              if (item.qpaDesignatorStep == false || item.lineMergeStep == false || item.duplicateCPNStep == false || item.requireMountingTypeStep == false || item.requireFunctionalTypeStep == false || item.customerApprovalForQPAREFDESStep == false || item.customerApprovalForBuyStep == false || item.customerApprovalForPopulateStep == false || item.dnpQPARefDesStep == false || item.customerApprovalForDNPQPAREFDESStep == false || item.customerApprovalForDNPBuyStep == false || item.dnpInvalidREFDESStep == false) {
                item.displayDescription.push((item.qpa == null ? '' : (item.qpa + ':')) + (item.refDesig == null ? '' : (item.refDesig + ':')) + (error == null ? '' : error.replace(/^.+:/, '')));
              }
            });

            _.each(item.rfqLineitemsAlternetpart, (data) => {
              var errorArr = data.description ? data.description.split('\n') : [];

              _.each(errorArr, (error) => {
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
                  item.displayDescription.push((data.mfgCode == null ? '' : (data.mfgCode + ': ')) + (data.mfgPN == null ? '' : (data.mfgPN + ': ')) + (error == null ? '' : error.replace(/^.+:/, '')));
                }
                if (data.distVerificationStep == false || data.distCodeStep == false || data.getMFGPNStep == false
                  || data.distPNStep == false || data.distGoodPartMappingStep == false) {
                  item.displayDescription.push((data.distributor == null ? '' : (data.distributor + ': ')) + (data.distPN == null ? '' : (data.distPN + ': ')) + (error == null ? '' : error.replace(/^.+:/, '')));
                }
              });
            });
          });
          return vm.lineitemsDescriptionList = _.sortBy(vm.lineitemsDescriptionList, 'assyLevel');
        }
      }).catch((error) => BaseService.getErrorLog(error));

      // get Component Internal Version
      function getComponentInternalVersion() {
        if (vm.assemblyData && vm.assemblyData.partID) {
          return MasterFactory.getComponentInternalVersion().query({ id: vm.assemblyData.partID }).$promise.then((component) => {
            if (component && component.data) {
              vm.liveVersion = component.data.liveVersion;
              vm.assemblyData.liveInternalVersion = component.data.liveVersion;
            }
            return vm.assemblyData.liveInternalVersion;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      //get assembly details
      const getAssyDetails = (isfinal, saveClick) => BOMFactory.getAssyDetails().query({ id: $state.params.id }).$promise.then((response) => {
        if (response && response.data) {
          const oldCustomPartDetShowInReport = vm.assemblyData ? vm.assemblyData.isCustomPartDetShowInReport : false;
          vm.assemblyData = response.data;
          if (vm.liveVersion) {
            vm.assemblyData.liveInternalVersion = vm.liveVersion;
          }
          vm.quotedetail = _.orderBy(vm.assemblyData.rfqAssyQuoteSubmitted, 'id', 'desc');
          if (saveClick) {
            vm.assemblyData.isCustomPartDetShowInReport = oldCustomPartDetShowInReport;
            if (vm.assemblyData.isPriceUpdate) {
              showAlertForMismatch(false);
            } else if (vm.assemblyData.isLaborUpdate) {
              showAlertForMismatch(true);
            } else {
              savePartCostingPrice(isfinal);
            }
          } else {
            return vm.assymblyData;
          }
        }
      });
      // Show alter for mismatch version of labor ot pricing version mismatch.
      function showAlertForMismatch(islabor) {
        const messgaeContent = angular.copy(islabor ? CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.LABOR_MISMATCH_WITH_LABOR_COST_AND_COST_SUMMARY : CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.PRICING_MISMATCH_WITH_PART_COSTING_AND_COST_SUMMARY);
        const model = {
          messageContent: messgaeContent
        };
        DialogFactory.messageAlertDialog(model, () => {
          $rootScope.$broadcast(PRICING.EventName.ChangeClickSubmitStatus);
          if (BOMFactory.isBOMChanged) {
            savePartCostingPrice(false);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      const autocompletePromise = [getDynamicFields(), getTermsandCondition(), getAssyDetails()];
      // not in use after changes on (22-11-2019) Shirish
      const bindSummaryDetail = (responses) => {
        return $timeout(() => {
          //vm.summaryQuote = responses[0];
          vm.dynamicFieldList = responses[0] = _.orderBy(responses[0], 'costingType', 'desc');
          const dynamicFields = _.filter(responses[0], (ctype) => (ctype.costingType === vm.CostingType.Material || ctype.costingType == vm.CostingType.Labor));
          vm.laborCount = _.filter(responses[0], (ctype) => (ctype.costingType === vm.CostingType.Labor));
          vm.dynamicFieldsAdHOC = _.filter(responses[0], (ctype) => ctype.costingType === vm.CostingType.Adhoc);
          vm.dynamicFieldsNRE = _.filter(responses[0], (ctype) => ctype.costingType === vm.CostingType.NRE);
          vm.dynamicFieldsTool = _.filter(responses[0], (ctype) => ctype.costingType === vm.CostingType.TOOL);
          vm.dynamicField = [];
          const data = _.groupBy(dynamicFields, 'costingType');
          let i = 0;
          _.each(data, (dataFields) => {
            if (i > 0) {
              const dynamic = {
                fieldName: stringFormat('Labor Cost($)'),
                id: null,
                displayPercentage: null,
                displayMargin: null,
                displayDays: null,
                Type: 'LB'
              };
              vm.dynamicField.push(dynamic);
            }
            _.each(dataFields, (fields) => {
              if ((fields.applyToAll && fields.isActive) || fields.isActive) {
                var dynamic = {
                  fieldName: stringFormat('{0}($)', fields.fieldName),
                  id: fields.id,
                  displayPercentage: false,
                  displayMargin: false,
                  displayDays: fields.isDaysRequire,
                  Type: fields.costingType,
                  applyToAll: fields.applyToAll
                };
                vm.dynamicField.push(dynamic);
                if (fields.displayPercentage) {
                  var dynamic = {
                    fieldName: stringFormat('{0}(%)', fields.fieldName),
                    id: fields.id,
                    displayPercentage: true,
                    displayMargin: false,
                    Type: fields.costingType
                  };
                  vm.dynamicField.push(dynamic);
                }
                if (fields.displayMargin) {
                  var dynamic = {
                    fieldName: stringFormat('{0} Margin(%)', fields.fieldName),
                    id: fields.id,
                    displayPercentage: false,
                    displayMargin: true,
                    Type: fields.costingType
                  };
                  vm.dynamicField.push(dynamic);
                }
                var dynamicObj = {
                  fieldName: '', //vm.CostingType.FinalEA : '',
                  id: fields.id,
                  displayPercentage: null,
                  displayMargin: null,
                  total: null,
                  costingType: fields.costingType,
                  isLast: false
                };
                vm.dynamicField.push(dynamicObj);
              }
            });
            i++;
          });
          _.each(vm.dynamicFieldsAdHOC, (adhoc) => {
            if ((adhoc.applyToAll && adhoc.isActive) || adhoc.isActive) {
              var dynamic = {
                fieldName: stringFormat('{0}($)', adhoc.fieldName),
                id: adhoc.id,
                displayPercentage: false,
                displayMargin: false,
                displayDays: adhoc.isDaysRequire,
                Type: adhoc.costingType,
                applyToAll: adhoc.applyToAll
              };
              vm.dynamicField.push(dynamic);
            }
          });
          const dynamicd = {
            fieldName: vm.CostingType.FinalEA,//datalist[0]
            id: null,
            displayPercentage: null,
            displayMargin: null,
            total: null,
            costingType: vm.CostingType.FinalEA,
            isLast: true
          };
          vm.dynamicField.push(dynamicd);
          let NRECount = 0;
          _.each(vm.dynamicFieldsNRE, (nre) => {
            if ((nre.applyToAll && nre.isActive) || nre.isActive) {
              var dynamic = {
                fieldName: stringFormat('{0}($)', nre.fieldName),
                id: nre.id,
                displayPercentage: false,
                displayMargin: false,
                displayDays: nre.isDaysRequire,
                Type: nre.costingType,
                tooltip: nre.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', nre.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, nre.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat('Lead Time: Not Applicable'),
                applyToAll: nre.applyToAll
              };
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
                  isLast: true
                };
                vm.dynamicField.push(dynamicd);
              }
            }
          });
          let TotalCount = 0;
          _.each(vm.dynamicFieldsTool, (tool) => {
            if ((tool.applyToAll && tool.isActive) || tool.isActive) {
              const dynamic = {
                fieldName: stringFormat('{0}($)', tool.fieldName),
                id: tool.id,
                displayPercentage: false,
                displayMargin: false,
                displayDays: tool.isDaysRequire,
                Type: tool.costingType,
                tooltip: tool.isDaysRequire ? stringFormat('Lead Time: Applicable, Affecting on: {0}, Selection lead time criteria: {1}', tool.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Name, tool.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value ? RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Name : RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Name) : stringFormat('Lead Time: Not Applicable'),
                applyToAll: tool.applyToAll
              };
              vm.dynamicField.push(dynamic);
              TotalCount++;
              if (TotalCount === vm.dynamicFieldsTool.length) {
                const dynamicd = {
                  fieldName: vm.CostingType.TotalTOOL,//datalist[0]
                  id: dynamic.id,
                  displayPercentage: null,
                  displayMargin: null,
                  total: null,
                  costingType: tool.costingType,
                  isLast: true
                };
                vm.dynamicField.push(dynamicd);
              }
            }
          });
        }, 0);
      };

      //get promise data for dynamic list and summary quote and based on it create object for same
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        var bindQuotePromise = [getSummaryQuote(), getComment(), getComponentInternalVersion()];
        vm.cgBusyLoading = $q.all(bindQuotePromise).then(() => {
          //vm.summaryModel = [];
          //vm.customPartModel = [];
          //vm.customPartDetail = [];
          //$timeout(() => {
          //  updateHeader();
          //});
        });
      }).catch((error) => BaseService.getErrorLog(error));

      //calculate margin dollar and margin percentage base on profit
      vm.changePercentage = (item, unitprice) => {
        if (vm.assemblyData.isSummaryComplete) {
          return false;
        }
        if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
          return true;
        }

        const objCost = _.find(vm.listField, (cost) => cost.rfqAssyQuoteID === item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID === item.quoteChargeDynamicFieldID && cost.refCustomPartQuoteID === item.refCustomPartQuoteID);
        if (objCost) {
          objCost.percentage = item.percentage;
          const percentage = objCost.percentage ? parseFloat(objCost.percentage) : 0;
          //if (parseFloat(objCost.percentage) > 100)
          //  percentage = '100.00';
          if (parseFloat(unitprice)) {
            objCost.amount = parseFloat((((percentage * (parseFloat(unitprice))) / 100))).toFixed(_amountFilterDecimal);
            objCost.margin = parseFloat((((objCost.amount * 100) / ((parseFloat(unitprice)) + parseFloat(objCost.amount))))).toFixed(_amountFilterDecimal);
            objCost.percentage = parseFloat(percentage).toFixed(_amountFilterDecimal);
          }
          else {
            objCost.amount = '0.00';
            objCost.margin = '0.00';
            objCost.percentage = '0.00';
          }
        }
      };
      //calculate amount for NRE and tooling
      vm.changeDetails = (item, amount) => {
        if (vm.assemblyData.isSummaryComplete) {
          return false;
        }
        if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
          return true;
        }
        const objCost = _.find(vm.listField, (cost) => cost.rfqAssyQuoteID === item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID === item.quoteChargeDynamicFieldID && cost.refCustomPartQuoteID === item.refCustomPartQuoteID);
        if (objCost && objCost.amount) {
          const lastChar = amount[amount.length - 1];
          if (lastChar !== '.') {
            if (parseFloat(amount) > 100000) {
              objCost.amount = '100000.00';
            }
          }
        }
      };
      // calculate markup profit and margin profit based on dollar
      vm.changeDollar = (item, unitprice, laborPrice) => {
        if (vm.assemblyData.isSummaryComplete) {
          return false;
        }
        if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
          return true;
        }
        const objCost = _.find(vm.listField, (cost) => cost.rfqAssyQuoteID === item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID === item.quoteChargeDynamicFieldID && cost.refCustomPartQuoteID === item.refCustomPartQuoteID && cost.id === item.id);
        if (objCost) {
          const lastChar = objCost.amount[objCost.amount.length - 1];
          if (lastChar === '.') {
            objCost.amount = objCost.amount.substring(0, objCost.amount.length - 1);
            // item.amount = item.amount.substring(0, item.amount.length - 1);
          }
          if (parseFloat(unitprice)) {
            item.amount = item.amount ? item.amount : '0.00';
            // if (parseFloat(item.amount ? item.amount : 0) > parseFloat(unitprice))
            //  item.amount = parseFloat(unitprice);
            objCost.amount = parseFloat((parseFloat(item.amount ? (item.amount) : 0))).toFixed(_amountFilterDecimal);
            objCost.margin = parseFloat((((parseFloat(objCost.amount ? objCost.amount : 0) * 100) / ((parseFloat(unitprice)) + parseFloat(objCost.amount ? objCost.amount : 0))))).toFixed(_amountFilterDecimal);
            objCost.percentage = parseFloat((((parseFloat(objCost.amount ? objCost.amount : 0) * 100) / (parseFloat(unitprice))))).toFixed(_amountFilterDecimal);
            if (objCost.type === vm.CostingType.Adhoc) {
              const listItem = _.filter(vm.listField, (list) => list.type === vm.CostingType.Adhoc && list.rfqAssyQuoteID === item.rfqAssyQuoteID);
              _.each(listItem, (costItem) => {
                costItem.subTotal = parseFloat((_.sumBy(_.filter(vm.listField, (listam) => listam.amount), (sum) => parseFloat(sum.amount)) + parseFloat(unitprice) + parseFloat(laborPrice ? laborPrice : 0)).toFixed(_amountFilterDecimal));
              });
            }
          }
          else {
            objCost.amount = '0.00';
            objCost.margin = '0.00';
            objCost.percentage = '0.00';
          }
          //   BOMFactory.isBOMChanged = true;
        }
      };
      // calculate markup profit and markup dollar
      vm.changeMargin = (item, unitprice) => {
        if (vm.assemblyData.isSummaryComplete) {
          return false;
        }
        if (!vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
          return true;
        }
        const objCost = _.find(vm.listField, (cost) => cost.rfqAssyQuoteID === item.rfqAssyQuoteID && cost.quoteChargeDynamicFieldID === item.quoteChargeDynamicFieldID && cost.refCustomPartQuoteID === item.refCustomPartQuoteID);
        if (objCost && objCost.margin) {
          objCost.margin = objCost.margin ? objCost.margin.toString() : '';
          let index = objCost.margin.indexOf('.');
          if (index === -1) {
            index = (objCost.margin.length - 1);
          }
          else {
            index = index - 1;
          }
          if (parseFloat(unitprice)) {
            if (parseFloat(objCost.margin) >= 50) {
              objCost.margin = 50.00;
              //objCost.margin = objCost.margin.substring(0, index) + objCost.margin.substring(index + 1, objCost.margin.length);
            }
            const margin = objCost.margin;
            //if (parseFloat(margin) > 50)
            //    margin = 50.00;
            const marginpercentage = (margin / 100);
            const salesPrice = ((parseFloat(unitprice)) / (1 - marginpercentage));

            objCost.amount = parseFloat(((salesPrice - (parseFloat(unitprice))))).toFixed(_amountFilterDecimal);
            objCost.percentage = parseFloat((((parseFloat(objCost.amount) * 100) / (parseFloat(unitprice))))).toFixed(_amountFilterDecimal);
            objCost.margin = parseFloat(margin).toFixed(_amountFilterDecimal);
          }
          else {
            objCost.amount = '0.00';
            objCost.margin = '0.00';
            objCost.percentage = '0.00';
          }
        }
        else {
          objCost.margin = '0.00';
        }
        //  BOMFactory.isBOMChanged = true;
      };
      // receive event from BOM for summary save
      vm.changevalue = () => {
        BOMFactory.isBOMChanged = true;
        BaseService.currentPageFlagForm = [BOMFactory.isBOMChanged];
      };
      $scope.$on(PRICING.EventName.SaveSummaryTab, (name, isfinal) => {
        if (vm.assemblyData.liveInternalVersion !== vm.assemblyData.partCostingBOMInternalVersion && isfinal) {
          const obj = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: RFQTRANSACTION.QUOTE.BOM_VERSION_MISMATCH,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK
          };
          return DialogFactory.alertDialog(obj).then(() => {
            $rootScope.$broadcast(PRICING.EventName.ChangeClickSubmitStatus);
            if (BOMFactory.isBOMChanged) {
              isfinal = false;
              getAssyDetails(isfinal, true);
              // savePartCostingPrice(isfinal);
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          $rootScope.$broadcast(PRICING.EventName.ChangeClickSubmitStatus);
          getAssyDetails(isfinal, true);
          // savePartCostingPrice(isfinal);
        }
      });
      // socket io connection
      function connectSocket() {
        socketConnectionService.on(PRICING.EventName.revisedQuote, revisedQuote);
        socketConnectionService.on(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
        socketConnectionService.on(PRICING.EventName.updateSummaryQuote, updateSummaryQuote);
        socketConnectionService.on(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
      }
      connectSocket();
      // socket io reconnect event
      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });
      // remove socket io listener
      function removeSocketListener() {
        socketConnectionService.removeListener(PRICING.EventName.revisedQuote, revisedQuote);
        socketConnectionService.removeListener(PRICING.EventName.sendCostingStartStopActivity, CostingStartStopActivity);
        socketConnectionService.removeListener(PRICING.EventName.updateSummaryQuote, updateSummaryQuote);
        socketConnectionService.removeListener(PRICING.EventName.sendSubmittedQuote, sendSubmittedQuote);
      }
      // socket io disconnect event
      socketConnectionService.on('disconnect', () => {
        removeSocketListener();
      });
      // Sent submitted quote Listener
      function sendSubmittedQuote(data) {
        if (parseInt(data.assyID) === parseInt(rfqAssyID)) {
          vm.assemblyData.isSummaryComplete = true;
          //getSummaryQuote();
          $state.go(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: rfqAssyID }, { reload: true });
        }
      };
      // Reviced Quote Listener
      function revisedQuote(assyid) {
        if (parseInt(assyid) === parseInt(rfqAssyID)) {
          vm.assemblyData.isSummaryComplete = false;
          $state.go(RFQTRANSACTION.RFQ_SUMMARY2_STATE, { id: rfqAssyID }, { reload: true });
        }
      }
      // Costing Activity Start/Stop Listener
      function CostingStartStopActivity(data) {
        if (data.rfqAssyID === parseInt(rfqAssyID)) {
          vm.assemblyData.isActivityStart = !vm.assemblyData.isActivityStart;
          vm.assemblyData.activityStartBy = data.loginUserId;
        }
      }
      // Quote new attribute add event
      const quoteAddAttribute = $scope.$on('quoteAddAttribute', () => {
        var autocompletePromise = [getDynamicFields()];
        vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
          var bindHtmlPromise = [bindSummaryDetail(responses)];
          vm.cgBusyLoading = $q.all(bindHtmlPromise).then(() => {
            var bindQuotePromise = [getSummaryQuote()];
            vm.cgBusyLoading = $q.all(bindQuotePromise).then(() => {
              $timeout(() => {
                vm.listField = [];
                bindSummaryDetailList();
              });
            });
          });
        }).catch((error) => BaseService.getErrorLog(error));
      });

      //submit pricing
      //call function for save summary
      const savePartCostingPrice = (isfinal) => {
        let isMarginMorethenHundered = false;
        _.each(vm.summaryQuote, (item) => {
          const rfqAssyQuotationsAdditionalCost = _.filter(vm.listField, (qty) => parseInt(qty.rfqAssyQuoteID) === parseInt(item.id) && !qty.isMaterialCostTotal);
          item.rfqAssyQuotationsAdditionalCost = rfqAssyQuotationsAdditionalCost;
          const costlist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => costQuote.type !== vm.CostingType.NRE && costQuote.amount);
          item.total = (_.sumBy(costlist, (sum) => parseFloat(sum.amount)) + parseFloat(item.unitPrice));
          item.materialCost = (_.sumBy(_.filter(costlist, { type: vm.CostingType.Material }), (sum) => parseFloat(sum.amount)));
          item.laborCost = (_.sumBy(_.filter(costlist, { type: vm.CostingType.Labor }), (sum) => parseFloat(sum.amount)));
          item.overheadCost = _.sumBy(_.filter(costlist, { type: vm.CostingType.Adhoc }), (sum) => parseFloat(sum.amount));
          item.allCost = _.sumBy(_.filter(costlist, { type: vm.CostingType.ALL }), (sum) => parseFloat(sum.amount));
          item.laborunitPrice = item.laborunitPrice ? parseFloat(item.laborunitPrice) : 0;
          item.laborCost = item.laborCost + parseFloat(item.laborunitPrice);
          item.materialCost = item.materialCost + parseFloat(item.unitPrice);
          item.overheadCost = item.overheadCost + parseFloat(item.overheadUnitPrice);
          //total days for material and
          const dayslist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => costQuote.days);
          item.materialDays = (_.sumBy(_.filter(dayslist, { type: vm.CostingType.Material }), (sum) => parseInt(sum.days)) + parseInt(item.days ? item.days : 0));
          item.laborDays = (_.sumBy(_.filter(dayslist, { type: vm.CostingType.Labor }), (sum) => parseInt(sum.days)) + parseInt(item.laborday ? item.laborday : 0));
          item.laborday = item.laborday ? parseInt(item.laborday) : 0;
          //get all days list which added on labor
          const laborLeadtimeDays = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => (costQuote.type == vm.CostingType.NRE || costQuote.type == vm.CostingType.TOOL) && costQuote.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[1].Value);
          const totalLaborDays = (_.sumBy(_.filter(laborLeadtimeDays, { selectionType: RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Value }), (sum) => parseInt(sum.days)));
          item.laborDays = (item.laborDays ? item.laborDays : 0) + (totalLaborDays ? totalLaborDays : 0);
          //check for grater condition
          const laborItem = _.find(laborLeadtimeDays, (ldays) => ldays.days > item.laborDays && ldays.selectionType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value);
          if (laborItem) {
            item.laborDays = laborItem.days;
          }
          item.overheadDays = _.sumBy(_.filter(dayslist, { type: vm.CostingType.Adhoc }), (sum) => parseInt(sum.days));
          item.allDays = _.sumBy(_.filter(dayslist, { type: vm.CostingType.ALL }), (sum) => parseInt(sum.days));

          //get all days list which added on material
          const materialLeadtimeDays = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => (costQuote.type == vm.CostingType.NRE || costQuote.type == vm.CostingType.TOOL) && costQuote.affectType == RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_TYPE[0].Value);
          const totalMaterialDays = (_.sumBy(_.filter(materialLeadtimeDays, { selectionType: RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[1].Value }), (sum) => parseInt(sum.days)));
          item.materialDays = (item.materialDays ? item.materialDays : 0) + (totalMaterialDays ? totalMaterialDays : 0);
          //check for grater condition
          const materialItem = _.find(materialLeadtimeDays, (ldays) => ldays.days > item.materialDays && ldays.selectionType === RFQTRANSACTION.SUMMARY.QUOTE_ATTRIBUTE_CRITERIA[0].Value);
          if (materialItem) {
            item.materialDays = materialItem.days;
          }
          //get days and cost for NRE
          const nreCostlist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => costQuote.type === vm.CostingType.NRE && costQuote.amount);
          const nreDayslist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => costQuote.type === vm.CostingType.NRE && costQuote.days);
          item.nreCost = _.sumBy(nreCostlist, (sum) => parseFloat(sum.amount) * parseFloat(sum.toolingQty));
          item.nreDays = _.sumBy(nreDayslist, (sum) => parseInt(sum.days));

          //get days and tooling for NRE
          const toolCostlist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => costQuote.type === vm.CostingType.TOOL && costQuote.amount);
          const toolDayslist = _.filter(item.rfqAssyQuotationsAdditionalCost, (costQuote) => costQuote.type === vm.CostingType.TOOL && costQuote.days);
          item.toolingCost = _.sumBy(toolCostlist, (sum) => parseFloat(sum.amount) * parseFloat(sum.toolingQty));
          item.toolingDays = _.sumBy(toolDayslist, (sum) => parseInt(sum.days));

          //CustomPart Total Update
          if (item.rfqAssyQuotationsCustomParts && item.rfqAssyQuotationsCustomParts.length > 0) {
            _.each(item.rfqAssyQuotationsCustomParts, (custPart) => {
              custPart.refCustomPartQuoteID = custPart.id;
              custPart.rfqAssyQuoteID = custPart.rfqAssyQuoteId;
              custPart.totalPrice = vm.getTotalCustomPart(custPart, custPart.unitPrice);
              custPart.totalLeadTimeDays = custPart.leadTimeDays;
            });
            item.customPartList = item.rfqAssyQuotationsCustomParts;
            item.materialCost = item.materialCost + (_.sumBy(item.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice)));
          }
          const marginMoreThanHundered = _.filter(item.rfqAssyQuotationsAdditionalCost, (cost) => cost.percentage && !isNaN(cost.percentage) && parseFloat(cost.percentage) > 100);
          if (marginMoreThanHundered && marginMoreThanHundered.length > 0) {
            isMarginMorethenHundered = true;
          }
        });
        if (isMarginMorethenHundered) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.COST_ATTRIBUTE_PERCENTAGE_MORE_THAN_100_CONFIRAMTION);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.messageConfirmDialog(obj).then(() => {
            savePartCosting(isfinal);
          }, () => {
            $rootScope.$broadcast(PRICING.EventName.ChangeClickSubmitStatus);
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          savePartCosting(isfinal);
        }
      };
      // Save Cost summary
      const savePartCosting = (isfinal) => {
        const summary = {
          summaryQuote: vm.summaryQuote,
          isFinalSubmit: isfinal,
          rfqAssyID: rfqAssyID,
          isCustomPartDetShowInReport: vm.assemblyData ? vm.assemblyData.isCustomPartDetShowInReport : false
        };
        if (isfinal) {
          summary.BOMIssue = vm.assemblyData.partcostingBOMIssue;
          summary.quoteID = vm.quotedetail[0].id;
          summary.internalVersion = vm.assemblyData.partCostingBOMInternalVersion;
          summary.QuoteInDate = vm.assemblyData ? vm.assemblyData.quoteInDate : null;
          summary.QuoteDueDate = vm.assemblyData ? vm.assemblyData.quoteDueDate : null;
          summary.assyStatus = RFQTRANSACTION.RFQ_ASSY_STATUS.FOLLOW_UP.VALUE;
          summary.bomLastVersion = vm.assemblyData ? vm.assemblyData.liveInternalVersion : null;
        }
        vm.cgBusyLoading = PartCostingFactory.saveSummaryQuote().query({ summaryQuoteObj: summary }).$promise.then((response) => {
          BOMFactory.isBOMChanged = false;
          BaseService.currentPageFlagForm = [];
          $rootScope.$broadcast(PRICING.EventName.ChangeClickSubmitStatus);
          if (isfinal) {
            if (response && response.data) {
              vm.assemblyData.isSummaryComplete = true;
              const searchObj = {
                partId: vm.assemblyData.partID,
                rfqQuoteNumber: response.data.quoteNumber,
                isPushToPartMaster: true,
                proceedOverriderQuote: false,
                isCallFromPartMaster: false
              };
              ComponentPriceBreakDetailsFactory.getSalesCommissionDetailsFromRfq().query(searchObj).$promise.then(() => { });
            }
          }
          const autocompletePromise = [getDynamicFields()];
          vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
            var bindHtmlPromise = [bindSummaryDetail(responses)];
            vm.cgBusyLoading = $q.all(bindHtmlPromise).then(() => {
              var bindQuotePromise = [getSummaryQuote()];
              vm.cgBusyLoading = $q.all(bindQuotePromise).then(() => {
                $timeout(() => {
                  vm.listField = [];
                  bindSummaryDetailList();
                });
              });
            });
          }).catch((error) => BaseService.getErrorLog(error));
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //get total for customPart
      vm.getTotalCustomPart = (item, unitprice) => {
        var listItem = _.filter(vm.listField, (list) => list.refCustomPartQuoteID == item.refCustomPartQuoteID && list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type !== vm.CostingType.Adhoc && list.type !== vm.CostingType.NRE && list.type !== vm.CostingType.TOOL && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => (checkItem.amount && checkItem.amount[checkItem.amount.length - 1] === '.'));
        if (objCheckValue) {
          return unitprice;
        }
        else {
          const total = ((_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitprice ? unitprice : 0))).toFixed(_amountFilterDecimal);
          return total;
        }
      };

      //get total for function
      vm.getCustPartTotal = (item, unitprice, customPartPrice) => {
        var listItem = _.filter(vm.listField, (list) => (list.displayOrder <= item.displayOrder || list.custPartId == item.custPartId) && list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type != vm.CostingType.Adhoc && list.type !== vm.CostingType.NRE && list.type !== vm.CostingType.TOOL && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => (checkItem.amount && checkItem.amount[checkItem.amount.length - 1] == '.'));
        if (objCheckValue) {
          return unitprice;
        }
        else {
          const total = ((_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0))).toFixed(_amountFilterDecimal);
          return total;
        }
      };

      //get overheadf total for function
      vm.getOverheadTotal = (item, unitprice) => {
        var listItem = _.filter(vm.listField, (list) => list.displayOrder <= item.displayOrder && list.rfqAssyQuoteID === item.rfqAssyQuoteID && list.type === vm.CostingType.Adhoc && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => checkItem.amount && checkItem.amount[checkItem.amount.length - 1] === '.');
        if (objCheckValue) {
          return unitprice;
        }
        else {
          const total = ((_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitprice ? unitprice : 0))).toFixed(_amountFilterDecimal);
          return total;
        }
      };

      //get All total for function
      vm.getAllTotal = (item, unitprice, data, laborunitPrice, customPartPrice, overHeadUnitPrice, isWithAttribute) => {
        var listItem = _.filter(vm.listField, (list) => list.rfqAssyQuoteID === item.rfqAssyQuoteID && list.type !== vm.CostingType.NRE && list.type !== vm.CostingType.ALL && list.type !== vm.CostingType.TOOL && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => checkItem.amount && checkItem.amount[checkItem.amount.length - 1] === '.');
        if (objCheckValue) {
          return (parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0) + parseFloat(laborunitPrice ? laborunitPrice : 0) + parseFloat(overHeadUnitPrice ? overHeadUnitPrice : 0)).toFixed(_amountFilterDecimal);;
        }
        else {
          let attributeTotal = 0;
          if (isWithAttribute) {
            attributeTotal = _.sumBy(listItem, (sum) => parseFloat(sum.amount));
          }
          const total = ((attributeTotal + parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0) + parseFloat(laborunitPrice ? laborunitPrice : 0) + parseFloat(overHeadUnitPrice ? overHeadUnitPrice : 0))).toFixed(_amountFilterDecimal);
          return total;
        }
      };

      //get total for function
      vm.getALLTotalWithALLAttribute = (item, unitprice) => {
        var listItem = _.filter(vm.listField, (list) => list.rfqAssyQuoteID === item.rfqAssyQuoteID && list.displayOrder <= item.displayOrder && list.type === vm.CostingType.ALL && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => checkItem.amount && checkItem.amount[checkItem.amount.length - 1] === '.');
        if (objCheckValue) {
          return unitprice;
        }
        else {
          const total = ((_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitprice ? unitprice : 0))).toFixed(_amountFilterDecimal);
          return total;
        }
      };

      //get material total for function
      vm.getMaterialTotal = (item, unitprice, customPartPrice) => {
        var listItem = _.filter(vm.listField, (list) => list.rfqAssyQuoteID === item.id && list.type === vm.CostingType.Material && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => checkItem.amount && checkItem.amount[checkItem.amount.length - 1] === '.');
        if (objCheckValue) {
          return (parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0));
        }
        else {
          const total = ((_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0))).toFixed(_amountFilterDecimal);
          return total;
        }
      };

      //get total for function
      vm.getTotal = (item, unitprice, data, laborunitPrice, customPartPrice) => {
        var listItem = _.filter(vm.listField, (list) => list.refCustomPartQuoteID == item.refCustomPartQuoteID && list.displayOrder <= item.displayOrder && list.rfqAssyQuoteID === item.rfqAssyQuoteID && list.type !== vm.CostingType.Adhoc && list.type !== vm.CostingType.NRE && list.type !== vm.CostingType.TOOL && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => (checkItem.amount && checkItem.amount[checkItem.amount.length - 1] === '.'));
        if (objCheckValue) {
          return unitprice;
        }
        else {
          const total = ((_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0) + parseFloat(laborunitPrice ? laborunitPrice : 0))).toFixed(_amountFilterDecimal);
          return total;
        }
      };
      // Get final total of Material, Overhead and labor
      vm.getFinalTotal = (item, unitprice, laborPrice, customPartPrice, overheadUnitPrice) => {
        var listItem = _.filter(vm.listField, (list) => list.rfqAssyQuoteID === item.rfqAssyQuoteID && list.type !== vm.CostingType.NRE && list.type !== vm.CostingType.TOOL && list.amount);
        var objCheckValue = _.find(listItem, (checkItem) => checkItem.amount && checkItem.amount[checkItem.amount.length - 1] === '.');
        if (objCheckValue) {
          return (parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0) + parseFloat(laborPrice ? laborPrice : 0) + parseFloat(overheadUnitPrice ? overheadUnitPrice : 0));
        }
        else {
          return ((_.sumBy(listItem, (sum) => parseFloat(sum.amount)) + parseFloat(unitprice ? unitprice : 0) + parseFloat(customPartPrice ? customPartPrice : 0) + parseFloat(laborPrice ? laborPrice : 0) + parseFloat(overheadUnitPrice ? overheadUnitPrice : 0))).toFixed(_amountFilterDecimal);
        }
      };

      // apply same data for all quantity
      vm.applyGeneralSelect = (item, customPartID) => {
        if (vm.assemblyData.isSummaryComplete || vm.summaryQuote.length === 1 || !vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy !== vm.loginUserId) {
          return false;
        }
        const list = _.filter(vm.listField, (field) => { if (field.quoteChargeDynamicFieldID === item.id && field.custPartId === customPartID) { return field; } });
        let i = 0;
        _.each(list, (allfield) => {
          if (i > 0) {
            let unitPrice = allfield.type === vm.CostingType.Labor ? parseFloat(allfield.laborunitPrice) : allfield.type === vm.CostingType.Adhoc ? parseFloat(allfield.overheadUnitPrice) : parseFloat(allfield.unitprice);
            let customPartPrice = 0;
            const objSupplierQuote = _.find(vm.summaryQuote, { id: allfield.rfqAssyQuoteID });
            if (objSupplierQuote && objSupplierQuote.rfqAssyQuotationsCustomParts && objSupplierQuote.rfqAssyQuotationsCustomParts.length > 0) {
              customPartPrice = _.sumBy(objSupplierQuote.rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
            }
            if (allfield.type === vm.CostingType.ALL) {
              unitPrice = vm.getAllTotal(allfield, allfield.unitprice, item, allfield.laborunitPrice, customPartPrice, allfield.overheadUnitPrice, false);
            } else if (allfield.type === vm.CostingType.Material && allfield.refCustomPartQuoteID && objSupplierQuote && objSupplierQuote.rfqAssyQuotationsCustomParts && objSupplierQuote.rfqAssyQuotationsCustomParts.length > 0) {
              const custPartDet = _.find(objSupplierQuote.rfqAssyQuotationsCustomParts, { id: allfield.refCustomPartQuoteID });
              if (custPartDet) {
                unitPrice = parseFloat(custPartDet.unitPrice).toFixed(_amountFilterDecimal);
              }
            }
            vm.RefAttributePrice = 0;
            vm.refAttributePriceCalculation(allfield, unitPrice, allfield.rfqAssyQuoteID, objSupplierQuote.refCustomPartQuoteID, true);
            if (vm.RefAttributePrice > 0) {
              unitPrice = vm.RefAttributePrice;
            }
            if (parseFloat(unitPrice) > 0 && (allfield.type === vm.CostingType.Labor || allfield.type === vm.CostingType.Material || allfield.type === vm.CostingType.Adhoc || allfield.type === vm.CostingType.ALL)) {
              unitPrice = parseFloat(unitPrice);;
              if (!item.displayPercentage && !item.displayMargin && list[0].amount) {
                let amount = _.clone(list[0].amount);
                if (allfield.type === RFQTRANSACTION.SUMMARY_COSTINGTYPE.TOOL || allfield.type === RFQTRANSACTION.SUMMARY_COSTINGTYPE.NRE) {
                  amount = parseFloat(amount).toFixed(_amountFilterDecimal);
                }
                else {
                  amount = parseFloat(amount).toFixed(_amountFilterDecimal); // parseFloat(amount) > parseFloat(unitPrice) ? parseFloat(unitPrice).toFixed(_amountFilterDecimal) : parseFloat(amount).toFixed(_amountFilterDecimal);
                }
                allfield.margin = parseFloat((((parseFloat(amount) * 100) / ((unitPrice) + parseFloat(amount))))).toFixed(_amountFilterDecimal);
                allfield.percentage = parseFloat((((parseFloat(amount) * 100) / (unitPrice)))).toFixed(_amountFilterDecimal);
                allfield.amount = parseFloat(amount).toFixed(_amountFilterDecimal);
                allfield.days = list[0].days;
                allfield.subTotal = ((_.sumBy((_.filter(vm.listField, (data) => data.rfqAssyQuoteID == allfield.rfqAssyQuoteID && data.amount)), (sum) => sum.amount) + unitPrice));
              }
              if (item.displayPercentage && list[0].percentage) {
                allfield.percentage = parseFloat(list[0].percentage).toFixed(_amountFilterDecimal);
                allfield.amount = parseFloat((((parseFloat(allfield.percentage) * (unitPrice)) / 100))).toFixed(_amountFilterDecimal);
                allfield.margin = parseFloat((((parseFloat(allfield.amount) * 100) / ((unitPrice) + parseFloat(allfield.amount))))).toFixed(_amountFilterDecimal);
                allfield.days = list[0].days;
                allfield.subTotal = ((_.sumBy((_.filter(vm.listField, (data) => data.rfqAssyQuoteID === allfield.rfqAssyQuoteID && data.amount)), (sum) => sum.amount) + unitPrice));
              }
              if (item.displayMargin && list[0].margin) {
                const marginpercentage = (list[0].margin / 100);
                const salesPrice = ((unitPrice) / (1 - marginpercentage));
                allfield.margin = parseFloat(list[0].margin).toFixed(_amountFilterDecimal);
                allfield.amount = parseFloat(((salesPrice - (unitPrice)))).toFixed(_amountFilterDecimal);
                allfield.percentage = parseFloat((((parseFloat(allfield.amount) * 100) / (unitPrice)))).toFixed(_amountFilterDecimal);
                allfield.days = list[0].days;
                allfield.subTotal = ((_.sumBy((_.filter(vm.listField, (data) => data.rfqAssyQuoteID === allfield.rfqAssyQuoteID && data.amount)), (sum) => sum.amount) + unitPrice));
              }
              allfield.toolingQty = parseInt(list[0].toolingQty || list[0].toolingQty === 0 ? list[0].toolingQty : 0);
            } else if (allfield.type === vm.CostingType.NRE || allfield.type === vm.CostingType.TOOL) {
              if (!item.displayPercentage && !item.displayMargin && list[0].amount) {
                let amount = _.clone(list[0].amount);
                if (allfield.type === RFQTRANSACTION.SUMMARY_COSTINGTYPE.TOOL || allfield.type === RFQTRANSACTION.SUMMARY_COSTINGTYPE.NRE) {
                  amount = parseFloat(amount).toFixed(_amountFilterDecimal);
                }
                else {
                  amount = parseFloat(amount) > parseFloat(unitPrice) ? parseFloat(unitPrice).toFixed(_amountFilterDecimal) : parseFloat(amount).toFixed(_amountFilterDecimal);
                }
                allfield.margin = '0.00';
                allfield.percentage = '0.00';
                allfield.amount = parseFloat(amount).toFixed(_amountFilterDecimal);
                allfield.days = list[0].days;
              }
              allfield.toolingQty = parseInt(list[0].toolingQty || list[0].toolingQty === 0 ? list[0].toolingQty : 0);
            }
          }
          i = i + 1;
        });
        //   $scope.$apply();
      };
      //total count of days for lead time
      vm.getTotalAdhocDays = (item, days, laborday) => {
        var adhocSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID === item.rfqAssyQuoteID && list.type !== vm.CostingType.NRE && list.type !== vm.CostingType.TOOL && list.days)), (sum) => parseInt(sum.days));
        var summary = _.find(vm.summaryQuote, { id: item.rfqAssyQuoteID });
        summary.manualTurnTime = (parseInt(adhocSum ? adhocSum : 0) + parseInt(days ? days : 0) + parseInt(laborday ? laborday : 0));
        return (parseInt(adhocSum ? adhocSum : 0) + parseInt(days ? days : 0) + parseInt(laborday ? laborday : 0));
      };
      //get total days for NRE
      vm.getTotalNreDays = (item) => {
        var nreSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type === vm.CostingType.NRE && list.days)), (sum) => parseInt(sum.days));
        return (parseInt(nreSum ? nreSum : 0));
      };
      //get total days for Tool
      vm.getTotalToolDays = (item) => {
        var toolSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type === vm.CostingType.TOOL && list.days)), (sum) => parseInt(sum.days));
        return (parseInt(toolSum ? toolSum : 0));
      };
      //get total amount for NRE
      vm.getTotalNRE = (item) => {
        var nreSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type === vm.CostingType.NRE && list.amount)), (sum) => parseFloat(sum.amount) * parseInt(sum.toolingQty ? sum.toolingQty : 0));
        return parseFloat((nreSum ? nreSum : 0)).toFixed(_amountFilterDecimal);
      };
      //get total amount for tool
      vm.getTotalTool = (item) => {
        var toolSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type === vm.CostingType.TOOL && list.amount)), (sum) => parseFloat(sum.amount) * parseInt(sum.toolingQty ? sum.toolingQty : 0));
        return parseFloat((toolSum ? toolSum : 0)).toFixed(_amountFilterDecimal);
      };
      //get total tooling qty
      vm.getTotalToolQty = (item) => {
        var toolSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type === vm.CostingType.TOOL && list.toolingQty)), (sum) => parseInt(sum.toolingQty));
        return (parseInt(toolSum ? toolSum : 0));
      };
      //get total NRE qty
      vm.getTotalNREQty = (item) => {
        var toolSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type === vm.CostingType.NRE && list.toolingQty)), (sum) => parseInt(sum.toolingQty));
        return (parseInt(toolSum ? toolSum : 0));
      };
      //change days to int
      vm.changeDays = (item) => {
        item.days = parseInt(item.days ? item.days : 0);
        const adhocSum = _.sumBy((_.filter(vm.listField, (list) => list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type !== vm.CostingType.NRE && list.type !== vm.CostingType.TOOL)), (sum) => parseInt(sum.days));
        const summary = _.find(vm.summaryQuote, (summary) => summary.id == item.rfqAssyQuoteID);
        summary.manualTurnTime = (parseInt(adhocSum ? adhocSum : 0) + parseInt(item.days ? item.days : 0) + parseInt(item.laborday ? item.laborday : 0));
        vm.changevalue();
        return (parseInt(adhocSum ? adhocSum : 0) + parseInt(item.days ? item.days : 0) + parseInt(item.laborday ? item.laborday : 0));
      };

      //get total for all markup
      vm.getTotalDays = (item, days, laborDays) => {
        days = parseInt(days ? days : 0);
        laborDays = parseInt(laborDays ? laborDays : 0);
        const listItem = _.filter(vm.listField, (list) => list.displayOrder <= item.displayOrder && list.rfqAssyQuoteID == item.rfqAssyQuoteID && list.type != vm.CostingType.Adhoc && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL);
        const totalsum = _.sumBy(listItem, (sum) => sum.days);
        const day = parseInt(totalsum + days + laborDays);
        return day ? day : 0;
      };

      //change material days
      vm.changeMaterialDays = (item) => {
        if (item) {
          item.days = item.days ? parseInt(item.days) : 0;
          vm.changevalue();
        }
      };
      //change material days
      vm.changeCustomPartDays = (item, day, custPartId) => {
        if (item && custPartId != null) {
          const customPartDet = _.find(item.rfqAssyQuotationsCustomParts, { mfgPNID: custPartId });
          if (customPartDet) {
            customPartDet.leadTimeDays = day ? parseInt(day) : 0;
            vm.changevalue();
          }
        }
      };
      //change labor days
      vm.changelaborDays = (item) => {
        if (item) {
          item.laborday = item.laborday ? parseInt(item.laborday) : 0;
          vm.changevalue();
        }
      };
      //change overhead days
      vm.changeOverheadDays = (item) => {
        if (item) {
          item.overheadDay = item.overheadDay ? parseInt(item.overheadDay) : 0;
          vm.changevalue();
        }
      };
      //change labor unit price vm.changeDollar = (item, unitprice, laborPrice)
      vm.chageLaborprice = (quote, laborPrice, unitPrice) => {
        quote.laborunitPrice = parseFloat(quote.laborunitPrice ? quote.laborunitPrice : 0).toFixed(_amountFilterDecimal);
        const listfield = _.filter(vm.listField, (data) => data.rfqAssyQuoteID === quote.id && data.type === vm.CostingType.Labor);
        _.each(listfield, (item) => {
          item.laborunitPrice = quote.laborunitPrice;
          vm.RefAttributePrice = 0;
          vm.refAttributePriceCalculation(item, adhocPrice, quote.id, null, true);
          if (vm.RefAttributePrice > 0) {
            laborPrice = vm.RefAttributePrice;
          }
          vm.changeDollar(item, laborPrice, unitPrice);
        });
        checkQuotePrice();
      };

      //change overhead unit price
      vm.chageAdhocPrice = (quote, adhocPrice, unitPrice) => {
        quote.overheadUnitPrice = parseFloat(quote.overheadUnitPrice ? quote.overheadUnitPrice : 0).toFixed(_amountFilterDecimal);
        const listfield = _.filter(vm.listField, (data) => data.rfqAssyQuoteID === quote.id && data.type === vm.CostingType.Adhoc);
        _.each(listfield, (item) => {
          item.overheadUnitPrice = quote.overheadUnitPrice;
          vm.RefAttributePrice = 0;
          vm.refAttributePriceCalculation(item, adhocPrice, quote.id, null, true);
          if (vm.RefAttributePrice > 0) {
            adhocPrice = vm.RefAttributePrice;
          }
          vm.changeDollar(item, adhocPrice, unitPrice);
        });
        checkQuotePrice();
      };
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
      };
      // Check quote have price or not based on disable submit button
      function checkQuotePrice() {
        var quote = _.find(vm.summaryQuote, (quote) => !parseFloat(quote.unitPrice) && !parseFloat(quote.laborunitPrice));
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
      const exportSummaryDetails = () => {
        var summaryList = [];
        var summaryObj = {
          Group: RFQTRANSACTION.SUMMARY_COSTINGTYPE.Material,
          Title: RFQTRANSACTION.SUMMARY.MaterialCostDollar
        };
        for (let i = 0; i < vm.summaryQuote.length; i++) {
          summaryObj[stringFormat('{0}_{1}{2}($)', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = vm.summaryQuote[i].unitPrice ? parseFloat((parseFloat(vm.summaryQuote[i].unitPrice)).toFixed(_amountFilterDecimal)) : 0;
          summaryObj[stringFormat('{0}_{1}{2}(Days)', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = vm.summaryQuote[i].days ? vm.summaryQuote[i].days : 0;
          summaryObj[stringFormat('{0}_{1}{2} Tooling Qty', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = 0;
        }
        summaryList.push(summaryObj);
        let lastrefCustomPartQuoteID = null;
        _.each(vm.dynamicField, (dataField) => {
          if (dataField.fieldName) {
            if (dataField.refCustomPartQuoteID && lastrefCustomPartQuoteID !== dataField.refCustomPartQuoteID) {
              lastrefCustomPartQuoteID = dataField.refCustomPartQuoteID;
              const customPartDet = _.find(vm.customPartDetail, { refCustomPartQuoteID: dataField.refCustomPartQuoteID });
              if (customPartDet) {
                const summaryPartObj = {
                  Group: RFQTRANSACTION.SUMMARY_COSTINGTYPE.Material,
                  Title: customPartDet.PIDCode
                };
                for (let i = 0; i < vm.summaryQuote.length; i++) {
                  if (vm.summaryQuote[i].rfqAssyQuotationsCustomParts && vm.summaryQuote[i].rfqAssyQuotationsCustomParts.length > 0) {
                    const customPartSummaryDet = _.find(vm.summaryQuote[i].rfqAssyQuotationsCustomParts, { mfgPNID: customPartDet.custPartId });
                    if (customPartSummaryDet) {
                      summaryPartObj[stringFormat('{0}_{1}{2}($)', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = customPartSummaryDet.unitPrice ? parseFloat((parseFloat(customPartSummaryDet.unitPrice)).toFixed(_amountFilterDecimal)) : 0;
                      summaryPartObj[stringFormat('{0}_{1}{2}(Days)', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = customPartSummaryDet.leadTimeDays ? customPartSummaryDet.leadTimeDays : 0;
                      summaryPartObj[stringFormat('{0}_{1}{2} Tooling Qty', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = 0;
                    }
                  }
                }
                summaryList.push(summaryPartObj);
              }
            }
            const obj = {};
            obj.Group = dataField.Type ? dataField.Type === 'LB' ? vm.CostingType.Labor : dataField.Type === 'Adhoc' ? vm.CostingType.Adhoc : dataField.Type : RFQTRANSACTION.SUMMARY.TOTAL;
            obj.Title = dataField.fieldName;
            for (let i = 0; i < vm.summaryQuote.length; i++) {
              const objList = _.find(vm.listField, (dynamic) => dataField.id === dynamic.quoteChargeDynamicFieldID && dynamic.rfqAssyQuoteID === vm.summaryQuote[i].id);
              let price = 0;
              let days = 0;
              let toolQty = 0;
              if (dataField.Type === 'LB') {
                price = parseFloat(vm.summaryQuote[i].laborunitPrice ? vm.summaryQuote[i].laborunitPrice : 0);
                days = parseInt(vm.summaryQuote[i].laborday ? vm.summaryQuote[i].laborday : 0);
              }
              else if (dataField.Type === 'Adhoc') {
                price = parseFloat(vm.summaryQuote[i].overheadUnitPrice ? vm.summaryQuote[i].overheadUnitPrice : 0);
                days = parseInt(vm.summaryQuote[i].overheadDay ? vm.summaryQuote[i].overheadDay : 0);
              }
              else if (!dataField.Type) {
                if (dataField.costingType === vm.CostingType.NRE) {
                  price = parseFloat(vm.getTotalNRE(objList, true));
                  days = parseInt(vm.getTotalNreDays(objList, true));
                }
                else if (dataField.costingType === vm.CostingType.TOOL) {
                  days = parseInt(vm.getTotalToolDays(objList, true));
                  price = parseFloat(vm.getTotalTool(objList, true));
                  toolQty = parseInt(vm.getTotalToolQty(objList, true));
                }
                else {
                  let customPartPrice = 0;
                  let days = vm.summaryQuote[i].days;
                  if (vm.summaryQuote[i].rfqAssyQuotationsCustomParts && vm.summaryQuote[i].rfqAssyQuotationsCustomParts.length > 0) {
                    customPartPrice = _.sumBy(vm.summaryQuote[i].rfqAssyQuotationsCustomParts, (sum) => parseFloat(sum.unitPrice));
                    const customPartDay = _.maxBy(vm.summaryQuote[i].rfqAssyQuotationsCustomParts, 'leadTimeDays');
                    if (customPartDay && customPartDay.leadTimeDays) {
                      days = Math.max(days, customPartDay.leadTimeDays);
                    }
                  }
                  price = parseFloat(vm.getFinalTotal(objList, vm.summaryQuote[i].unitPrice, vm.summaryQuote[i].laborunitPrice, customPartPrice, vm.summaryQuote[i].overheadUnitPrice));
                  days = parseFloat(vm.getTotalAdhocDays(objList, days, vm.summaryQuote[i].laborday)); //(_.sumBy((_.filter(vm.listField, (list) => { return list.rfqAssyQuoteID == vm.summaryQuote[i].id && list.days != null && list.type != vm.CostingType.NRE && list.type != vm.CostingType.TOOL })), (sum) => { return sum.days }) + vm.summaryQuote[i].days);
                }
              }
              else if (!dataField.displayMargin && !dataField.displayPercentage) {
                price = objList.amount ? parseFloat(parseFloat(objList.amount).toFixed(_amountFilterDecimal)) : 0;
                days = objList.days ? objList.days : 0;
                toolQty = objList.toolingQty ? objList.toolingQty : 0;
              }
              else if (dataField.displayMargin) {
                price = objList.margin ? parseFloat(parseFloat(objList.margin).toFixed(_amountFilterDecimal)) : 0;
              }
              else if (dataField.displayPercentage) {
                price = objList.percentage ? parseFloat(parseFloat(objList.percentage).toFixed(_amountFilterDecimal)) : 0;
              }
              obj[stringFormat('{0}_{1}{2}($)', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = price;
              obj[stringFormat('{0}_{1}{2}(Days)', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = days;
              obj[stringFormat('{0}_{1}{2} Tooling Qty', vm.summaryQuote[i].requestedQty, vm.summaryQuote[i].turnTime, vm.summaryQuote[i].timeType === vm.timeType.WEEK.VALUE ? vm.timeType.WEEK.TYPE : vm.summaryQuote[i].timeType === vm.timeType.WEEK_DAY.VALUE ? vm.timeType.WEEK_DAY.TYPE : vm.timeType.BUSINESS_DAY.TYPE)] = toolQty;
            }
            summaryList.push(obj);
          }
        });
        const notesList = [];
        let description = 1;
        _.each(vm.lineitemsDescriptionList, (desc) => {
          if (desc.displayDescription.length > 0 || desc.rfqLineitemsAddtionalComment.length > 0) {
            let comment = '';
            _.each(desc.displayDescription, (comm) => {
              comment = stringFormat('{0}{1}\n', comment, comm);
            });
            const obj = {};
            obj.ID = description;
            obj.Item = desc.lineID,
              obj[RFQTRANSACTION.SUMMARY.ERROR] = comment;
            obj[RFQTRANSACTION.SUMMARY.AdditionalComment] = desc.rfqLineitemsAddtionalComment.length > 0 ? desc.rfqLineitemsAddtionalComment[0].description : '';
            notesList.push(obj);
            description++;
          }
        });
        if (notesList.length === 0) {
          const obj = {};
          obj['#'] = '';
          obj.Item = '',
            obj[RFQTRANSACTION.SUMMARY.ERROR] = '';
          obj[RFQTRANSACTION.SUMMARY.AdditionalComment] = '';
          notesList.push(obj);
        }
        const termsList = [];
        let noteId = 1;
        _.each(vm.termsandcondition, (terms) => {
          if (terms.additional) {
            const condition = {
              '#': noteId
            };
            condition[RFQTRANSACTION.SUMMARY.REQUIREMENT] = terms.additional ? terms.additional : '';
            termsList.push(condition);
            noteId++;
          }
        });
        const opts = [{ sheetid: RFQTRANSACTION.SUMMARY.Summary, header: true }, { sheetid: RFQTRANSACTION.SUMMARY.Notes, header: false }, { sheetid: RFQTRANSACTION.SUMMARY.Terms, header: false }];
        alasql(stringFormat(RFQTRANSACTION.SUMMARY.EXCELQUERY, vm.assemblyData.componentAssembly.mfgPN + '_QuoteSummary'),
          [opts, [summaryList, notesList, termsList]]);
      };

      //receive event from BOM for export summary details
      $scope.$on(PRICING.EventName.ExportSummary, () => {
        exportSummaryDetails();
      });
      // on move to other controller destroy all event
      $scope.$on('$destroy', () => {
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
      };
      vm.gotoPartDetails = (mfgPNID) => {
        BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), mfgPNID, USER.PartMasterTabs.Detail.Name);
        return false;
      };
      //go to Labor Tab
      vm.goToLabor = () => {
        BaseService.goToLabor(rfqAssyID, vm.assemblyData.partID);
        return false;
      };

      //open quote attribute pop up
      vm.addUpdateQuoteAttributes = (isUpdate, item) => {
        if (vm.assemblyData.isSummaryComplete || !vm.assemblyData.isActivityStart || vm.assemblyData.activityStartBy != vm.loginUserId) { return false;}
        if (BOMFactory.isBOMChanged) {
          const model = {
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
      };
      // Add Quote attribute popup
      function openQuoteAttribute(ev) {
        var data = { quoteAttributeType: CORE.QUOTE_DB_ATTRIBUTE_TYPE.RFQ };
        const popUpData = { popupAccessRoutingState: [USER.ADMIN_QUOTE_DYNAMIC_FIELDS_STATE], pageNameAccessLabel: CORE.PageName.quote_attribute };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
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
                $scope.$broadcast('quoteAddAttribute');
              }
            }, () => {
            });
        }
      }
      // Update Quote Attribute popup
      vm.updateQuoteAttribute = (item) => {
        var data = {
          id: item.id,
          quoteAttributeType: CORE.QUOTE_DB_ATTRIBUTE_TYPE.RFQ
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
              $scope.$broadcast('quoteAddAttribute');
            }
          }, () => {
          });
      };
      vm.GoToQuoteAttributelist = () => {
        BaseService.goToQuoteAttributeList();
      };
      // Remove Quote Attribute
      vm.removeQuoteAttribute = (item) => {
        vm.deletedQuoteAttribute = vm.deletedQuoteAttribute || [];
        if (item) {
          const obj = {
            title: CORE.MESSAGE_CONSTANT.WITHOUT_SAVING_ALERT_HEADER_MESSAGE,
            textContent: stringFormat(RFQTRANSACTION.SUMMARY_MESSAGE.DELETE_QUOTE_ATTRIBUTE_MSG, item.fieldName),//'Are you Sure want to remove <b>' + item.fieldName + '</b> quote attribute from this Quote.<br/> Press YES to continue.',
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.confirmDiolog(obj).then(() => {
            const deletedAttributeField = _.filter(vm.dynamicField, (x) => parseInt(x.id) === parseInt(item.id));
            if (deletedAttributeField.length > 0) {
              _.each(deletedAttributeField, (dynamicFieldObj) => {
                if (!dynamicFieldObj.isLast) {
                  vm.dynamicField.splice(vm.dynamicField.indexOf(dynamicFieldObj), 1);
                }
              });
              if (_.filter(vm.dynamicField, (x) => x.Type === item.Type).length === 0) {
                const objNREisAvailable = _.find(vm.dynamicField, (a) => a.costingType === item.Type);
                if (objNREisAvailable && !objNREisAvailable.isLast) {
                  vm.dynamicField.splice(vm.dynamicField.indexOf(objNREisAvailable), 1);
                }
              }
            }
            const deletedAttributeFieldFromNewAdded = _.filter(vm.AddNewOptionalAttribute, (x) => parseInt(x.id) === parseInt(item.id));
            if (deletedAttributeFieldFromNewAdded.length > 0) {
              _.each(deletedAttributeFieldFromNewAdded, (dynamicAddedFieldObj) => {
                if (!dynamicAddedFieldObj.isLast) {
                  vm.AddNewOptionalAttribute.splice(vm.AddNewOptionalAttribute.indexOf(dynamicAddedFieldObj), 1);
                }
              });
            }
            const deletedAttribute = _.filter(vm.listField, (x) => parseInt(x.quoteChargeDynamicFieldID) === parseInt(item.id));
            if (deletedAttribute.length > 0) {
              _.each(deletedAttribute, (dynamicObj) => {
                dynamicObj.amount = 0;
                dynamicObj.days = 0;
                dynamicObj.toolingQty = 0;
                vm.changevalue();
                vm.changeDays(dynamicObj);
                vm.listField.splice(vm.listField.indexOf(dynamicObj), 1);
                _.each(vm.summaryQuote, (item) => {
                  item.deletedrfqAssyQuotationsAdditionalCost = item.deletedrfqAssyQuotationsAdditionalCost || [];
                  const objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == dynamicObj.quoteChargeDynamicFieldID);
                  if (objItem && !objItem.isLast) {
                    item.rfqAssyQuotationsAdditionalCost.splice(item.rfqAssyQuotationsAdditionalCost.indexOf(objItem), 1);
                    item.deletedrfqAssyQuotationsAdditionalCost.push(objItem);
                  }
                });
              });
            }
            vm.listField = [];
            bindSummaryDetailList();
            return true;
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      // Add Quote Attribute function
      vm.AddOptionalQuoteAttribute = (item) => {
        // deselected current cell so we can have a focus on popup element
        _hotRegisterer.deselectCell();

        if (BOMFactory.isBOMChanged) {
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: RFQTRANSACTION.SUMMARY_MESSAGE.ADD_REMOVE_ATTRIBUTE_ALERTMESSAGE,
            multiple: true
          };
          DialogFactory.alertDialog(model);
        }
        else {
          if (item) {
            const data = {
              CostingType: item,
              costingSummaryData: _.filter(vm.listField, (x) => x.type == item)
            };
            DialogFactory.dialogService(
              RFQTRANSACTION.SELECT_OPTIONAL_QUOTE_ATTRIBUTE_POPUP_CONTROLLER,
              RFQTRANSACTION.SELECT_OPTIONAL_QUOTE_ATTRIBUTE_POPUP_VIEW,
              null,
              data).then((data) => {
                if (data) {
                  vm.removedOptionalAttribute = [];
                  _.each(data, (attrObj) => {
                    if (attrObj.selected) {
                      vm.AddNewOptionalAttribute.push(attrObj);
                      if (!_.find(vm.dynamicFieldList, { id: attrObj.id })) {
                        vm.dynamicFieldList.push(attrObj);
                      }
                    }
                    else {
                      vm.removedOptionalAttribute.push(attrObj);
                    }
                  });
                  const deletedAttributeFieldFromNewAdded = _.filter(vm.AddNewOptionalAttribute, (x) => {
                    const removeditem = _.find(vm.removedOptionalAttribute, (removedItemObj) => x.id == removedItemObj.id);
                    if (removeditem) {
                      return true;
                    }
                  });
                  if (deletedAttributeFieldFromNewAdded.length > 0) {
                    _.each(deletedAttributeFieldFromNewAdded, (dynamicAddedFieldObj) => {
                      vm.AddNewOptionalAttribute.splice(vm.AddNewOptionalAttribute.indexOf(dynamicAddedFieldObj), 1);
                    });
                  }
                  const deletedAttributeField = _.filter(vm.dynamicField, (x) => {
                    const removeditem = _.find(vm.removedOptionalAttribute, (removedItemObj) => x.id == removedItemObj.id);
                    if (removeditem) {
                      return true;
                    }
                  });
                  if (deletedAttributeField.length > 0) {
                    _.each(deletedAttributeField, (dynamicFieldObj) => {
                      vm.dynamicField.splice(vm.dynamicField.indexOf(dynamicFieldObj), 1);
                    });
                    if (_.filter(vm.dynamicField, (x) => x.Type === item).length === 0) {
                      const objNREisAvailable = _.find(vm.dynamicField, (a) => a.costingType === item);
                      if (objNREisAvailable) {
                        vm.dynamicField.splice(vm.dynamicField.indexOf(objNREisAvailable), 1);
                      }
                    }
                  }
                  const deletedAttribute = _.filter(vm.listField, (x) => {
                    const removeditem = _.find(vm.removedOptionalAttribute, (removedItemObj) => x.quoteChargeDynamicFieldID == removedItemObj.id);
                    if (removeditem) {
                      return true;
                    }
                    //return x.quoteChargeDynamicFieldID == item.id;
                  });
                  if (deletedAttribute.length > 0) {
                    _.each(deletedAttribute, (dynamicObj) => {
                      dynamicObj.amount = 0;
                      dynamicObj.days = 0;
                      dynamicObj.toolingQty = 0;
                      vm.changevalue();
                      vm.changeDays(dynamicObj);
                      vm.listField.splice(vm.listField.indexOf(dynamicObj), 1);
                      _.each(vm.summaryQuote, (item) => {
                        item.deletedrfqAssyQuotationsAdditionalCost = item.deletedrfqAssyQuotationsAdditionalCost || [];
                        const objItem = _.find(item.rfqAssyQuotationsAdditionalCost, (additionalCost) => additionalCost.quoteChargeDynamicFieldID == dynamicObj.quoteChargeDynamicFieldID);
                        if (objItem) {
                          item.rfqAssyQuotationsAdditionalCost.splice(item.rfqAssyQuotationsAdditionalCost.indexOf(objItem), 1);
                          item.deletedrfqAssyQuotationsAdditionalCost.push(objItem);
                        }
                      });
                    });
                  }
                  //vm.AddNewOptionalAttribute = data;
                  //if (vm.AddNewOptionalAttribute && vm.AddNewOptionalAttribute.length > 0) {
                  //  getDynamicFields(true);
                  //  $scope.$broadcast('quoteAddAttribute');
                  //}
                  //else {
                  vm.listField = [];
                  vm.isNoDataFound = true;
                  hotRegisterer.removeInstance('hot-summary');
                  bindSummaryDetailList();
                  //}
                }
              }, (err) => BaseService.getErrorLog(err));
          }
        }
      };;

      // web socket call if user update labor cost or pricing
      function updateSummaryQuote(data) {
        $timeout(() => {
          if (parseInt(data.rfqAssyID) === parseInt(rfqAssyID)) {
            const obj = {
              rfqAssyID: rfqAssyID,
              isSummaryComplete: vm.assemblyData.isSummaryComplete
            };
            PartCostingFactory.retriveSummaryQuote().query({ summaryGetobj: obj }).$promise.then((quote) => {
              vm.summaryQuote = _.sortBy(quote.data, ['requestedQty', 'totalDays']);
              _.each(vm.summaryQuote, (summary) => {
                summary.laborunitPrice = summary.laborunitPrice ? parseFloat(summary.laborunitPrice).toFixed(_amountFilterDecimal) : '0.00';
                summary.unitPrice = summary.unitPrice ? parseFloat(summary.unitPrice).toFixed(_amountFilterDecimal) : '0.00';
                const listfield = _.filter(vm.listField, (lst) => lst.rfqAssyQuoteID == summary.id && lst.type == (data.isLabor ? vm.CostingType.Labor : vm.CostingType.Material));
                _.each(listfield, (item) => {
                  item.laborunitPrice = summary.laborunitPrice;
                  item.unitprice = summary.unitPrice;
                  vm.changePercentage(item, data.isLabor ? summary.laborunitPrice : summary.unitPrice);
                });
              });
              hotRegisterer.removeInstance('hot-summary');
              _hotRegisterer = hotRegisterer.getInstance('hot-summary');
            });
          }
        }, 1000);
      }
    }
  }
})();
