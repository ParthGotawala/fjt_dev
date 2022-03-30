(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('supplierQuotePartPriceDetailGrid', supplierQuotePartPriceDetailGrid);

  /** @ngInject */
  function supplierQuotePartPriceDetailGrid(BaseService, hotRegisterer, $q, $timeout, CORE, RFQTRANSACTION, TRANSACTION, PartCostingFactory, ImportExportFactory, DialogFactory, SupplierQuoteFactory, socketConnectionService, NotificationFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        supplierQuoteId: '=',
        supplierQuotePartDetailId: '=',
        partId: '=',
        partPackagingId: '='
      },
      templateUrl: 'app/directives/custom/supplier-quote-part-price-detail-grid/supplier-quote-part-price-detail-grid.html',
      controller: supplierQuotePartPriceDetailGridCtrl,
      controllerAs: 'vm',
      link: () => {
      }
    };
    return directive;
    /** @ngInject */
    /**
    * Controller for view data of alternative details
    *
    * @param
    */
    function supplierQuotePartPriceDetailGridCtrl($scope) {
      const vm = this;
      // get handsontable object
      var _hotRegisterer = null;
      var _dummyEvent = null;
      vm.LabelConstant = CORE.LabelConstant;
      vm.supplierQuotePartDetailId = $scope.supplierQuotePartDetailId;
      vm.partId = $scope.partId;
      vm.supplierQuoteId = $scope.supplierQuoteId;
      vm.isDisable = false;
      vm.unitOfTime = {
        BUSINESS_DAY: RFQTRANSACTION.RFQ_TURN_TYPE['BUSINESS_DAY'],
        WEEK_DAY: RFQTRANSACTION.RFQ_TURN_TYPE['WEEK_DAY'],
        WEEK: RFQTRANSACTION.RFQ_TURN_TYPE['WEEK']
      };
      const pricingErrors = CORE.LabelConstant.SupplierQuote.PricingErrors;
      vm.CustomReeling = RFQTRANSACTION.SUPPLIER_QUOTE_CUSTOM_STATUS;
      vm.Ncnr = RFQTRANSACTION.SUPPLIER_QUOTE_NCNR_STATUS;
      vm.pricingModel = [];
      vm.sourceHeader = [];
      vm.packagingList = [];
      vm.requiredFields = [];
      vm.dropdownTypes = [];
      vm.isValid = false;
      vm.isGridLoaded = false;
      vm.saveBtnDisableFlag = false;
      vm.isTransactionLocked = false;
      vm.enableNegotiatePrice = false;
      vm.partPicingModuleName = 'PartPricing.xlsx';
      vm.retrieveSupplierQuotePartPricingDetails = () => {
        vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuotePartPricingDetails().query({ id: vm.supplierQuotePartDetailId }).$promise.then((response) => {
          if (response && response.data) {
            vm.exportHeader = angular.copy(CORE.SUPPLIER_QUOTE_COLUMN_MAPPING);
            vm.dynamicHeaders = angular.copy(response.data.sourceHeader);
            initSourceHeader(response.data.sourceHeader);
            $timeout(() => {
              initDatabaseModel(response.data.pricingDetails);
            }, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      vm.getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
        if (packaging && packaging.data) {
          vm.packagingList = packaging.data;
        }
        return vm.packagingList;
      }).catch((error) => BaseService.getErrorLog(error));

      vm.checkSupplierQuotePartPricingValidations = () => {
        const query = {
          supplierQuoteMstID: vm.supplierQuoteId,
          partID: vm.partId
        };
        return SupplierQuoteFactory.checkSupplierQuotePartPricingValidations().query(query).$promise.then((isUsed) => {
          if (isUsed && (isUsed.data[0] || isUsed.data[1] && isUsed.data[1].length > 0)) {
            vm.isTransactionLocked = true;
            vm.isDisable = true;
          } else {
            vm.isTransactionLocked = false;
            vm.isDisable = false;
          }
          return vm.isDisable;
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const init = () => {
        const pricingPromise = [vm.getPackaging(), vm.checkSupplierQuotePartPricingValidations()];
        vm.cgBusyLoading = $q.all(pricingPromise).then(() => {
          vm.retrieveSupplierQuotePartPricingDetails();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();
      // Added custom cell renderer
      // It will be call after all cell change and render events
      // Add cells color based on error code here
      Handsontable.renderers.registerRenderer('cellRenderer', function (instance, td, row, col, prop, value, cellProperties) {
        if (vm.dropdownTypes.indexOf(prop) !== -1) {
          Handsontable.renderers.AutocompleteRenderer.apply(this, arguments);
        } else {
          Handsontable.renderers.TextRenderer.apply(this, arguments);
        }
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        const pricingModelObj = vm.pricingModel[row];
        switch (prop) {
          case 'itemNumber': {
            td.style.textAlign = 'right';
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Item');
              } else if (isNaN(value)) {
                td.title = stringFormat(pricingErrors.ToolTipInvalid, 'Item');
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'qty': {
            td.style.textAlign = 'right';
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Qty');
              } else if ((isNaN(value)) || !Number.isInteger(Number(value))) {
                td.title = stringFormat(pricingErrors.ToolTipInvalid, 'qty');
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'min': {
            td.style.textAlign = 'right';
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Min');
              } else if (value) {
                const val = Number(value);
                if (!Number.isInteger(val) || val <= 0) {
                  td.title = stringFormat(pricingErrors.ToolTipInvalid, 'min');
                } else {
                  td.title = '';
                }
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'mult': {
            td.style.textAlign = 'right';
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Mult');
              } else if (value) {
                const val = Number(value);
                if (!Number.isInteger(val) || val <= 0) {
                  td.title = stringFormat(pricingErrors.ToolTipInvalid, 'mult');
                } else {
                  td.title = '';
                }
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'stock': {
            td.style.textAlign = 'right';
            if (!vm.isDisable) {
              if (!value && parseInt(value) !== 0) {
                td.title = stringFormat(pricingErrors.Required, 'Stock');
              } else if (value) {
                const val = Number(value);
                if (!Number.isInteger(val) || val < 0) {
                  td.title = stringFormat(pricingErrors.ToolTipInvalid, 'stock');
                } else {
                  td.title = '';
                }
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'packageID': {
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Packaging');
              } else if (value) {
                const isExist = _.find(vm.packagingList, (item) => item.name.toLowerCase() === value.toLowerCase());
                if (!isExist) {
                  td.title = pricingErrors.InvalidPackaging;
                } else {
                  td.title = '';
                }
              }
              else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'NCNR': {
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'NCNR');
              } else if (value) {
                const isExist = _.find(vm.Ncnr, (item) => item.VALUE.toLowerCase() === value.toLowerCase());
                if (!isExist) {
                  td.title = stringFormat(pricingErrors.Invalid, 'NCNR');
                } else {
                  td.title = '';
                }
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'reeling': {
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Custom Reel');
              } else if (value) {
                const isExist = _.find(vm.CustomReeling, (item) => item.VALUE.toLowerCase() === value.toLowerCase());
                if (!isExist) {
                  td.title = stringFormat(pricingErrors.Invalid, 'Custom Reel');
                } else {
                  td.title = '';
                }
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'leadTime': {
            td.style.textAlign = 'right';
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Lead Time');
              } else if (value) {
                const val = Number(value);
                if (!Number.isInteger(val)) {
                  td.title = stringFormat(pricingErrors.ToolTipInvalid, 'lead time');
                } else {
                  td.title = '';
                }
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'UnitOfTime': {
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Unit Of Time');
              } else if (value) {
                const isExist = _.find(vm.unitOfTime, (item) => item.TYPE.toLowerCase() === value.toLowerCase());
                if (!isExist) {
                  td.title = pricingErrors.InvalidUnitOfTime;
                } else {
                  td.title = '';
                }
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'UnitPrice': {
            td.style.textAlign = 'right';
            if (!vm.isDisable) {
              if (!value) {
                td.title = stringFormat(pricingErrors.Required, 'Unit Price');
              } else if (isNaN(value) || parseFloat(value) <= 0 || countDecimals(parseFloat(value)) > _unitPriceFilterDecimal) {
                td.title = stringFormat(pricingErrors.ToolTipInvalid, 'unit price');
              } else {
                td.title = '';
              }
            }
            cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'negotiatePrice': {
            td.style.textAlign = 'right';
            if ((value !== '' && value !== null) && (parseFloat(value) < 0 || countDecimals(parseFloat(value)) > _unitPriceFilterDecimal)) {
              td.title = stringFormat(pricingErrors.ToolTipInvalid, 'negotiate price');
            } else {
              td.title = '';
            }
            cellProperties.readOnly = vm.isDisable || (!vm.enableNegotiatePrice) || (pricingModelObj && pricingModelObj.isPartCosting);
            break;
          }
          case 'extPrice': {
            td.style.textAlign = 'right';
            break;
          }
          case 'negotiateExtPrice': {
            td.style.textAlign = 'right';
            break;
          }
          case 'total': {
            td.style.textAlign = 'right';
            break;
          }
        }

        vm.dynamicHeaders.forEach((item, index) => {
          //let fieldName = item.fieldName.replace(" ", "");
          const fieldName = item.attributeColumnName;
          switch (prop) {
            case fieldName: {
              td.style.textAlign = 'right';
              if (!vm.isDisable) {
                if (!value) {
                  td.title = stringFormat(pricingErrors.Required, item.fieldName);
                } else if (isNaN(value) || parseFloat(value) < 0 || countDecimals(parseFloat(value)) > _unitPriceFilterDecimal) {
                  td.title = stringFormat(pricingErrors.ToolTipInvalid, item.fieldName.toLowerCase());
                } else {
                  td.title = '';
                }
              }
              if (vm.pricingModel && vm.pricingModel[row] && vm.pricingModel[row].itemNumber) {
                cellProperties.readOnly = vm.isDisable || (vm.enableNegotiatePrice) || vm.pricingModel[row].isPartCosting;
              }
              break;
            }
          }
        });
      });

      vm.settings = {
        rowHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: true,
        renderAllRows: true,
        fixedColumnsLeft: 1,
        minSpareRows: 1,
        stretchH: 'all',
        contextMenu: {
          items: {
            'remove_row': {
              name: vm.LabelConstant.SupplierQuote.menuEntries.remove_row.name,
              disabled: () => {
                const selectedRange = _hotRegisterer.getSelected();
                if (selectedRange && (selectedRange[0][0] || selectedRange[0][0] === 0)) {
                  const row = selectedRange[0][0];
                  if (selectedRange) {
                    return vm.pricingModel.length - 1 === row || vm.isTransactionLocked ? true : false;
                  }
                }
              },
              callback: (event, row) => {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DELETE_PRICING_ROW_CONFIRMATION_MESSAGE);
                const model = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
                  multiple: true
                };
                const selectedIndex = _.map(row, (item) => _.range(item.start.row, item.end.row + 1));
                const indexValues = [];
                _.each(selectedIndex, (item) => {
                  _.each(item, (value) => {
                    indexValues.push(value);
                  });
                });
                const deleteObj = _.filter(vm.pricingModel, (item, index) => indexValues.includes(index));

                const withIDs = _.map(_.filter(deleteObj, 'id'), 'id');
                _hotRegisterer.deselectCell();
                return DialogFactory.messageConfirmDialog(model).then((yes) => {
                  if (yes) {
                    if (withIDs.length > 0) {
                      const removePricing = {
                        IDs: withIDs,
                        partID: vm.partId,
                        supplierQuoteID: vm.supplierQuoteId,
                        supplierQuotePartDetID: vm.supplierQuotePartDetailId
                      };
                      vm.cgBusyLoading = SupplierQuoteFactory.removeSupplierQuotePartPricingLines().query({ removePricing: removePricing }).$promise.then((response) => {
                        if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                          vm.pricingModel = _.differenceWith(vm.pricingModel, deleteObj);
                        }
                      }).catch((error) => BaseService.getErrorLog(error));
                    } else {
                      vm.pricingModel = _.differenceWith(vm.pricingModel, deleteObj);
                    }
                  }
                  else {
                    return false;
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }
          }
        },
        //contextMenu: ['remove_row'],
        mergeCells: false,
        manualColumnResize: false,
        selectionMode: 'multiple', // 'single', 'range' or 'multiple'
        //manualRowResize: true,
        // Disabled drag and fill functionality
        fillHandle: false,
        cells: () => {
          const cellProperties = {
            renderer: 'cellRenderer'
          };
          return cellProperties;
        },
        afterInit: () => {
          window.setTimeout(() => {
            _hotRegisterer = hotRegisterer.getInstance('hot-partpricing');
            if (_hotRegisterer) {
              _hotRegisterer.validateCells();
            }
            setHandsontableHeight();
          });
        },
        afterChange: (changes, source) => {
          // if user copy-paste
          switch (source) {
            case 'edit':
            case 'CopyPaste.cut':
            case 'UndoRedo.undo':
            case 'CopyPaste.paste': {
              changes.forEach((item) => {
                const row = item[0];
                const field = item[1];
                if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
                  return;
                }
                const pricingObj = vm.pricingModel[row];
                if (pricingObj) {
                  let oldVal = item[2] === '' ? null : item[2];
                  let newVal = item[3] === '' ? null : item[3];
                  oldVal = oldVal ? oldVal.toString().trim() : oldVal;
                  newVal = newVal ? newVal.toString().trim() : newVal;
                  if (oldVal !== newVal) {
                    if (vm.pricingModel[row] && vm.pricingModel[row].id) {
                      vm.pricingModel[row].isUpdated = true;
                    }
                    vm.isPricingChange = SupplierQuoteFactory.isPricingChange = true;
                    BaseService.currentPageFlagForm = [SupplierQuoteFactory.isPricingChange];
                    let attTotal = 0;
                    if (vm.dynamicHeaders.length > 0) {
                      vm.dynamicHeaders.forEach((item) => {
                        //let fieldName = item.fieldName.replace(" ", "");
                        const fieldName = item.attributeColumnName;
                        switch (field) {
                          case fieldName:
                            if (!pricingObj.qty && !pricingObj.UnitPrice) {
                              pricingObj.extPrice = null;
                              pricingObj.total = null;
                            }
                            else if (!isNaN(pricingObj.qty) && !isNaN(pricingObj.UnitPrice) && !isNaN(pricingObj[fieldName]) && pricingObj.qty > 0 && pricingObj.UnitPrice > 0) {
                              pricingObj.extPrice = multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.UnitPrice) || 0));
                              //pricingObj.extPrice = parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.UnitPrice) || 0))).toFixed(_unitPriceFilterDecimal);
                              vm.dynamicHeaders.forEach((calc) => {
                                const calcfieldName = calc.attributeColumnName; //calc.fieldName.replace(" ", "");
                                attTotal += pricingObj[calcfieldName] ? parseFloat(Number(pricingObj[calcfieldName])) : 0;
                              });
                              pricingObj.total = CalcSumofArrayElement([attTotal, Number(pricingObj.extPrice)], _amountFilterDecimal);
                              //pricingObj.total = parseFloat(Math.abs(attTotal + Number(pricingObj.extPrice))).toFixed(_unitPriceFilterDecimal);
                            } else {
                              pricingObj.extPrice = 0;
                              pricingObj.total = 0;
                            }
                            break;
                          case 'qty':
                            if (!pricingObj.qty && !pricingObj.UnitPrice) {
                              pricingObj.extPrice = null;
                              pricingObj.total = null;
                            }
                            else if (!isNaN(pricingObj.qty) && !isNaN(pricingObj.UnitPrice)) {
                              pricingObj.min = pricingObj.min ? pricingObj.min : angular.copy(pricingObj.qty);
                              pricingObj.negotiateExtPrice = isNaN(pricingObj.negotiatePrice) ? 0 : multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.negotiatePrice) || 0));
                              //pricingObj.negotiateExtPrice = isNaN(pricingObj.negotiatePrice) ? 0 : parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.negotiatePrice) || 0))).toFixed(_unitPriceFilterDecimal);
                              pricingObj.extPrice = multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.UnitPrice) || 0));
                              //pricingObj.extPrice = parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.UnitPrice) || 0))).toFixed(_unitPriceFilterDecimal);
                              attTotal += pricingObj[fieldName] ? parseFloat(Number(pricingObj[fieldName])) : 0;
                              pricingObj.total = CalcSumofArrayElement([(Number(pricingObj.extPrice) || 0), (attTotal || 0)], _amountFilterDecimal);
                              //pricingObj.total = parseFloat(Math.abs((Number(pricingObj.extPrice) || 0) + (attTotal || 0))).toFixed(_unitPriceFilterDecimal);
                            } else if (!isNaN(pricingObj.qty)) {
                              pricingObj.min = pricingObj.min ? pricingObj.min : angular.copy(pricingObj.qty);
                              pricingObj.extPrice = 0;
                              pricingObj.total = 0;
                            } else {
                              pricingObj.extPrice = 0;
                              pricingObj.total = 0;
                            }
                            break;
                          case 'UnitPrice':
                            if (!pricingObj.qty && !pricingObj.UnitPrice) {
                              pricingObj.extPrice = null;
                              pricingObj.total = null;
                            }
                            else if (!isNaN(pricingObj.qty) && !isNaN(pricingObj.UnitPrice)) {
                              pricingObj.extPrice = multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.UnitPrice) || 0));
                              //pricingObj.extPrice = parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.UnitPrice) || 0))).toFixed(_unitPriceFilterDecimal);
                              attTotal += pricingObj[fieldName] ? parseFloat(Number(pricingObj[fieldName])) : 0;
                              pricingObj.total = CalcSumofArrayElement([(Number(pricingObj.extPrice) || 0), (attTotal || 0)], _amountFilterDecimal);
                              //pricingObj.total = parseFloat(Math.abs((Number(pricingObj.extPrice) || 0) + (attTotal || 0))).toFixed(_unitPriceFilterDecimal);
                            } else {
                              pricingObj.extPrice = 0;
                              pricingObj.total = 0;
                            }
                            break;
                          case 'negotiatePrice':
                            if (!pricingObj.qty || !pricingObj.negotiatePrice) {
                              pricingObj.negotiateExtPrice = null;
                            }
                            else if (!isNaN(pricingObj.qty) && !isNaN(pricingObj.negotiatePrice)) {
                              pricingObj.negotiateExtPrice = multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.negotiatePrice) || 0));
                              //pricingObj.negotiateExtPrice = parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.negotiatePrice) || 0))).toFixed(_unitPriceFilterDecimal);
                            } else {
                              pricingObj.negotiateExtPrice = 0;
                            }
                            break;
                          default:
                        }
                      });
                    } else {
                      switch (field) {
                        case 'qty':
                          if (!pricingObj.qty && !pricingObj.UnitPrice) {
                            pricingObj.extPrice = null;
                            pricingObj.total = null;
                          }
                          else if (!isNaN(pricingObj.qty) && !isNaN(pricingObj.UnitPrice)) {
                            pricingObj.min = pricingObj.min ? pricingObj.min : angular.copy(pricingObj.qty);
                            pricingObj.negotiateExtPrice = isNaN(pricingObj.negotiatePrice) ? 0 : multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.negotiatePrice) || 0));
                            //pricingObj.negotiateExtPrice = isNaN(pricingObj.negotiatePrice) ? 0 : parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.negotiatePrice) || 0))).toFixed(_unitPriceFilterDecimal);
                            pricingObj.extPrice = multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.UnitPrice) || 0));
                            //pricingObj.extPrice = parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.UnitPrice) || 0))).toFixed(_unitPriceFilterDecimal);
                            pricingObj.total = pricingObj.extPrice;
                          } else if (!isNaN(pricingObj.qty)) {
                            pricingObj.min = pricingObj.min ? pricingObj.min : angular.copy(pricingObj.qty);
                            pricingObj.extPrice = 0;
                            pricingObj.total = 0;
                          } else {
                            pricingObj.extPrice = 0;
                            pricingObj.total = 0;
                          }
                          break;
                        case 'UnitPrice':
                          if (!pricingObj.qty && !pricingObj.UnitPrice) {
                            pricingObj.extPrice = null;
                            pricingObj.total = null;
                          }
                          else if (!isNaN(pricingObj.qty) && !isNaN(pricingObj.UnitPrice)) {
                            pricingObj.extPrice = multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.UnitPrice) || 0));
                            //pricingObj.extPrice = parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.UnitPrice) || 0))).toFixed(_unitPriceFilterDecimal);
                            pricingObj.total = pricingObj.extPrice;
                          } else {
                            pricingObj.extPrice = 0;
                            pricingObj.total = 0;
                          }
                          break;
                        case 'negotiatePrice':
                          if (!pricingObj.qty || !pricingObj.negotiatePrice) {
                            pricingObj.negotiateExtPrice = null;
                          }
                          else if (!isNaN(pricingObj.qty) && !isNaN(pricingObj.negotiatePrice)) {
                            pricingObj.negotiateExtPrice = multipleUnitValue((Number(pricingObj.qty) || 0), (Number(pricingObj.negotiatePrice) || 0));
                            //pricingObj.negotiateExtPrice = parseFloat(Math.abs((Number(pricingObj.qty) || 0) * (Number(pricingObj.negotiatePrice) || 0))).toFixed(_unitPriceFilterDecimal);
                          } else {
                            pricingObj.negotiateExtPrice = 0;
                          }
                          break;
                        default:
                      }
                    }
                  }
                }
              });
            }
          }
        },
        afterGetColHeader: (col, th) => {
          if (!vm.isDisable) {
            th.className = 'h-col-' + col;
            if (col !== vm.colTotalIndex && col !== vm.colExtPriceIndex && col !== vm.colNegotiatePriceIndex && col !== vm.colNegotiateExtPriceIndex && col !== -1) {
              //if (col != -1) {
              th.innerHTML = th.innerHTML.replace(vm.requiredFields[col].title, vm.requiredFields[col].title + ' <span class="red"> *</span>');
            }
          }
        },
        afterRemoveRow: () => {
          vm.isPricingChange = SupplierQuoteFactory.isPricingChange = true;
        },
        afterValidate: (isValid, value, row) => {
          // If first row (header row) or empty row then return
          if (!_hotRegisterer || _hotRegisterer.isEmptyRow(row)) {
            return true;
          }
          //else {
          //  if (vm.pricingModel[row] && !vm.pricingModel[row].itemNumber) {
          //    return true;
          //  } else {
          //    return isValid;
          //  }
          //}
        },
        beforeCreateRow: (index) => { // addition parameter , amount, source
          const pricingObj = vm.pricingModel[index - 1];
          if (pricingObj && !pricingObj.id) {
            if (!pricingObj.itemNumber) {
              const maxItemNumObj = _.maxBy(vm.pricingModel, 'itemNumber');
              pricingObj.itemNumber = maxItemNumObj && maxItemNumObj.itemNumber ? (maxItemNumObj.itemNumber + 1) : 1;
            }
            pricingObj.UnitOfTime = RFQTRANSACTION.RFQ_TURN_TYPE['BUSINESS_DAY'].TYPE;
            let objPackaging = _.find(vm.packagingList, { id: $scope.partPackagingId });
            if (!objPackaging) {
              objPackaging = _.find(vm.packagingList, { name: TRANSACTION.Packaging.Bulk });
            }
            pricingObj.packageID = objPackaging ? objPackaging.name : null;
            pricingObj.mult = 1;
            pricingObj.min = 1;
            pricingObj.leadTime = 15;
            pricingObj.stock = 0;
            _.each(vm.dynamicHeaders, (item) => {
              pricingObj[item.attributeColumnName] = item.toolingPrice || 0;
            });
            pricingObj.reeling = RFQTRANSACTION.SUPPLIER_QUOTE_CUSTOM_STATUS[2].VALUE;
            pricingObj.NCNR = RFQTRANSACTION.SUPPLIER_QUOTE_NCNR_STATUS[2].VALUE;
          }
        }
      };


      function initSourceHeader(headersArr) {
        // Add hidden columns into so we can generate model based on source header
        vm.sourceHeader = [
          {
            field: 'id',
            header: 'id',
            title: 'id',
            hidden: true,
            displayOrder: 0,
            type: 'numeric',
            width: 30
          },
          {
            field: 'itemNumber',
            header: 'item#',
            title: 'item#',
            hidden: false,
            displayOrder: 0,
            type: 'numeric',
            width: 30,
            validator: (value, callback) => {
              const val = Number(value);
              if (!value || value <= 0 || isNaN(val)) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'qty',
            header: 'Qty',
            hidden: false,
            displayOrder: 1,
            title: 'Qty',
            type: 'text',
            width: 80,
            validator: (value, callback) => {
              const val = Number(value);
              if (!value || val <= 0 || isNaN(val) || !Number.isInteger(val)) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'UnitPrice',
            header: 'Unit Price',
            hidden: false,
            displayOrder: 2,
            title: 'Unit Price ($)',
            type: 'text',
            width: 80,
            validator: (value, callback) => {
              const val = Number(value);
              if (!value || val <= 0 || isNaN(value) || countDecimals(val) > _unitPriceFilterDecimal) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'extPrice',
            header: 'Ext. Price',
            title: 'Ext. Price ($)',
            hidden: false,
            displayOrder: 3,
            readOnly: true,
            type: 'numeric',
            width: 80,
            validator: (value, callback) => {
              callback(true);
            }
          },
          {
            field: 'negotiatePrice',
            header: 'Negotiated Price',
            hidden: false,
            displayOrder: 4,
            title: 'Negotiated Price ($)',
            type: 'text',
            width: 80,
            validator: (value, callback) => {
              const val = Number(value);
              if (val < 0 || isNaN(value) || countDecimals(val) > _unitPriceFilterDecimal) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'negotiateExtPrice',
            header: 'Negotiated Ext. Price',
            title: 'Negotiated Ext. Price ($)',
            hidden: false,
            displayOrder: 5,
            readOnly: true,
            type: 'numeric',
            width: 80,
            validator: (value, callback) => {
              callback(true);
            }
          },
          {
            field: 'leadTime',
            header: 'Lead Time',
            hidden: false,
            displayOrder: 6,
            title: 'Lead Time',
            type: 'text',
            width: 55,
            validator: (value, callback) => {
              const val = Number(value);
              if (!value || val < 1 || value.length > 9 || !Number.isInteger(val)) {
                vm.isValid = false;
                callback(false);
              }
              else if (isNaN(val) || val === 0) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'UnitOfTime',
            header: 'Unit Of Time',
            hidden: false,
            displayOrder: 7,
            title: 'Unit Of Time',
            type: 'dropdown',
            width: 80,
            source: _.map(vm.unitOfTime, (x) => x.TYPE),
            validator: (value, callback) => {
              if (!value) {
                vm.isValid = false;
                callback(false);
              }
              else {
                const isExist = _.find(vm.unitOfTime, (item) => item.TYPE.toLowerCase() === value.toLowerCase());
                if (isExist) {
                  vm.isValid = true;
                  callback(true);
                } else {
                  vm.isValid = false;
                  callback(false);
                }
              }
            }
          },
          {
            field: 'packageID',
            header: 'Packaging',
            hidden: false,
            displayOrder: 8,
            title: 'Packaging',
            type: 'dropdown',
            width: 100,
            source: vm.packagingList.map((x) => x.name),
            validator: (value, callback) => {
              if (!value) {
                vm.isValid = false;
                callback(false);
              }
              else {
                const isExist = _.find(vm.packagingList, (item) => item.name.toLowerCase() === value.toLowerCase());
                if (isExist) {
                  vm.isValid = true;
                  callback(true);
                } else {
                  vm.isValid = false;
                  callback(false);
                }
              }
            }
          },
          {
            field: 'min',
            header: 'Min',
            hidden: false,
            displayOrder: 9,
            title: 'Min',
            type: 'text',
            width: 55,
            validator: (value, callback) => {
              const val = Number(value);
              if (!value || value < 1 || value.length > 9 || !Number.isInteger(val)) {
                vm.isValid = false;
                callback(false);
              }
              else if (isNaN(val) || val === 0) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'mult',
            header: 'Mult',
            hidden: false,
            displayOrder: 10,
            title: 'Mult',
            type: 'text',
            width: 55,
            validator: (value, callback) => {
              const val = Number(value);
              if (!value || value < 1 || value.length > 9 || !Number.isInteger(val)) {
                vm.isValid = false;
                callback(false);
              }
              else if (isNaN(val) || val === 0) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'stock',
            header: 'Stock',
            hidden: false,
            displayOrder: 11,
            title: 'Stock',
            type: 'text',
            width: 55,
            validator: (value, callback) => {
              const val = Number(value);
              if ((!value && value !== 0) || value === '' || val < 0 || value.length > 9 || !Number.isInteger(val)) {
                vm.isValid = false;
                callback(false);
              }
              else if (isNaN(val)) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          },
          {
            field: 'reeling',
            header: 'Custom Reel',
            hidden: false,
            displayOrder: 12,
            title: 'Custom Reel',
            type: 'dropdown',
            width: 60,
            source: _.map(vm.CustomReeling, (x) => x.VALUE),
            validator: (value, callback) => {
              if (!value) {
                vm.isValid = false;
                callback(false);
              }
              else {
                const isExist = _.find(vm.CustomReeling, (item) => item.VALUE.toLowerCase() === value.toLowerCase());
                if (isExist) {
                  vm.isValid = true;
                  callback(true);
                } else {
                  vm.isValid = false;
                  callback(false);
                }
              }
            }
          },
          {
            field: 'NCNR',
            header: 'NCNR',
            hidden: false,
            displayOrder: 13,
            title: 'NCNR',
            type: 'dropdown',
            width: 60,
            source: _.map(vm.Ncnr, (x) => x.VALUE),
            validator: (value, callback) => {
              if (!value) {
                vm.isValid = false;
                callback(false);
              }
              else {
                const isExist = _.find(vm.Ncnr, (item) => item.VALUE.toLowerCase() === value.toLowerCase());
                if (isExist) {
                  vm.isValid = true;
                  callback(true);
                } else {
                  vm.isValid = false;
                  callback(false);
                }
              }
            }
          }
        ];

        //Added headers by configuration
        headersArr.forEach((header) => {
          const dispOrder = _.last(vm.sourceHeader).displayOrder + 1;
          vm.sourceHeader.push({
            field: header.attributeColumnName,
            header: header.fieldName,
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: dispOrder,
            title: header.fieldName + ' ($)',
            type: 'text',
            width: 80,
            validator: (value, callback) => {
              const val = Number(value);
              if ((!value && val !== 0) || val < 0 || isNaN(value) || countDecimals(val) > _unitPriceFilterDecimal) {
                vm.isValid = false;
                callback(false);
              }
              else {
                vm.isValid = true;
                callback(true);
              }
            }
          });
          vm.exportHeader.push({ fieldName: header.fieldName + ' ($)', isRequired: true });
        });
        vm.sourceHeader.push({
          field: 'total',
          header: 'Total',
          displayOrder: _.last(vm.sourceHeader).displayOrder + 1,
          hidden: false,
          title: 'Total ($)',
          type: 'numeric',
          readOnly: true,
          width: 90,
          validator: (value, callback) => {
            callback(true);
          }
        });
        _.each(vm.sourceHeader, (item) => {
          if (!item.hidden) {
            vm.requiredFields.push(item);
          }
        });
        vm.colTotalIndex = _.findIndex(vm.requiredFields, (x) => x.field === 'total');
        vm.colExtPriceIndex = _.findIndex(vm.requiredFields, (x) => x.field === 'extPrice');
        vm.colNegotiatePriceIndex = _.findIndex(vm.requiredFields, (x) => x.field === 'negotiatePrice');
        vm.colNegotiateExtPriceIndex = _.findIndex(vm.requiredFields, (x) => x.field === 'negotiateExtPrice');
        vm.sourceHeader = _.sortBy(vm.sourceHeader, 'displayOrder');

        vm.sourceHeader.forEach((item) => {
          if (item.type === 'dropdown') {
            vm.dropdownTypes.push(item.field);
          }
        });
        vm.isGridLoaded = true;
      }

      const initDatabaseModel = (pricingDetails) => {
        vm.pricingModel = [];
        let modelRow = [];
        if (pricingDetails.length > 0) {
          for (let i = 0, len = pricingDetails.length; i < len; i++) {
            let total = 0;
            modelRow = pricingDetails[i];
            modelRow.packageID = modelRow.packageID ? _.find(vm.packagingList, { id: modelRow.packageID }).name : null;
            modelRow.reeling = _.find(vm.CustomReeling, { ID: modelRow.reeling }).VALUE;
            modelRow.NCNR = _.find(vm.Ncnr, { ID: modelRow.NCNR }).VALUE;
            modelRow.UnitOfTime = modelRow.UnitOfTime ? _.find(vm.unitOfTime, { VALUE: modelRow.UnitOfTime }).TYPE : null;
            if (modelRow.attibutePriceList && modelRow.attibutePriceList.length > 0) {
              const splitAttributesPrice = modelRow.attibutePriceList.split('@@@');
              _.map(splitAttributesPrice, (data) => {
                if (data) {
                  const splitValue = data.split('$#@%&');
                  if (splitValue.length > 0) {
                    modelRow[splitValue[2].replace(/ /g, '').replace(/\./g, '@$@')] = splitValue[3] ? parseFloat(splitValue[3]).toFixed(_unitPriceFilterDecimal) : 0;
                  }
                }
              });
            }
            modelRow.qty = modelRow.qty;
            modelRow.UnitPrice = modelRow.UnitPrice.toFixed(_unitPriceFilterDecimal);
            modelRow.negotiatePrice = modelRow.negotiatePrice ? modelRow.negotiatePrice.toFixed(_unitPriceFilterDecimal) : null;
            modelRow.negotiateExtPrice = modelRow.negotiatePrice ? multipleUnitValue((modelRow.qty || 0), (modelRow.negotiatePrice || 0)) : null;
            //modelRow.negotiateExtPrice = modelRow.negotiatePrice ? parseFloat(Math.abs((modelRow.qty || 0) * (modelRow.negotiatePrice || 0))).toFixed(_unitPriceFilterDecimal) : null;
            modelRow.extPrice = multipleUnitValue((modelRow.qty || 0), (modelRow.UnitPrice || 0));
            //modelRow.extPrice = parseFloat(Math.abs((modelRow.qty || 0) * (modelRow.UnitPrice || 0))).toFixed(_unitPriceFilterDecimal);
            vm.dynamicHeaders.forEach((item) => {
              //let fieldName = item.fieldName.replace(" ", "");
              total += parseFloat(modelRow[item.attributeColumnName]);
            });
            total = isNaN(total) ? 0 : total;
            modelRow.total = CalcSumofArrayElement([(modelRow.extPrice || 0), (total || 0)], _amountFilterDecimal);
            modelRow.isPartCosting = modelRow.isPartCosting ? true : false;
            //modelRow.total = parseFloat(parseFloat(modelRow.extPrice) + parseFloat(total)).toFixed(_unitPriceFilterDecimal);
            vm.pricingModel.push(modelRow);
          }
          vm.pricingModel = _.sortBy(vm.pricingModel, 'itemNumber');
        } else {
          vm.pricingModel = [];
        }
        // setHandsontableHeight();
      };

      vm.enablePricing = () => {
        if (vm.enableNegotiatePrice) {
          if (SupplierQuoteFactory.isPricingChange) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PRICING_SAVE_INFORMATION);
            messageContent.message = stringFormat(messageContent.message, 'negotiated price', ' disabling');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.saveBtnDisableFlag = false;
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          } else {
            if (!vm.isTransactionLocked) {
              vm.isDisable = false;
            } else {
              vm.isDisable = true;
            }
            vm.enableNegotiatePrice = false;
            reInit();
          }
        } else {
          if (SupplierQuoteFactory.isPricingChange) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PRICING_SAVE_INFORMATION);
            messageContent.message = stringFormat(messageContent.message, 'the pricing', 'enabling');
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.saveBtnDisableFlag = false;
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          } else {
            vm.enableNegotiatePrice = true;
            vm.isDisable = true;
            reInit();
          }
        }
      };

      vm.disableNegotiateButton = () => {
        if (vm.pricingModel) {
          const check = _.first(vm.pricingModel);
          if (check && check.id) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      };

      vm.reInitPricing = () => {
        if (SupplierQuoteFactory.isPricingChange) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_MESSAGE_LOST);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              reInitPricing();
            }
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          reInitPricing();
        }
      };

      const reInitPricing = () => {
        vm.cgBusyLoading = $q.all([vm.checkSupplierQuotePartPricingValidations()]).then(() => {
          vm.isPricingChange = SupplierQuoteFactory.isPricingChange = false;
          vm.isGridLoaded = false;
          vm.pricingModel = [];
          vm.sourceHeader = [];
          $timeout(() => {
            vm.retrieveSupplierQuotePartPricingDetails();
            if (_hotRegisterer) {
              if (vm.pricingModel) {
                const last = _.last(vm.pricingModel);
                if (last && !last.id) {
                  vm.pricingModel.pop();
                }
              }
              vm.settings.beforeCreateRow();
              _hotRegisterer.render();
            }
          }, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const reInit = () => {
        vm.isGridLoaded = false;
        $timeout(() => {
          const copyPricingModel = angular.copy(vm.pricingModel);
          const copyDynamicHeaders = angular.copy(vm.dynamicHeaders);
          vm.pricingModel = [];
          vm.sourceHeader = [];
          vm.dynamicHeaders = copyDynamicHeaders;
          initSourceHeader(copyDynamicHeaders);
          vm.pricingModel = copyPricingModel;
          vm.isGridLoaded = true;
          if (_hotRegisterer) {
            if (vm.pricingModel) {
              const last = _.last(vm.pricingModel);
              if (!last.id) {
                vm.pricingModel.pop();
              }
            }
            vm.settings.beforeCreateRow();
            _hotRegisterer.render();
          }
        }, true);
      };

      vm.savePricingDetails = () => {
        vm.saveBtnDisableFlag = true;
        if (!SupplierQuoteFactory.isPricingChange) {
          NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
          vm.saveBtnDisableFlag = false;
          return;
        } else {
          if (vm.enableNegotiatePrice) {
            saveNegotiatePrice();
          } else {
            savePricing();
          }
        }
      };

      const saveNegotiatePrice = () => {
        if (!(vm.pricingModel.length === 1 && Object.keys(vm.pricingModel[0]).length === 0 && vm.pricingModel[0].constructor === Object) && !vm.isDisable) {
          vm.pricingModel.splice(-1, 1);
        }
        const pricingErrorChecker = angular.copy(vm.pricingModel);
        _.each(pricingErrorChecker, (PricingDetails) => {
          PricingDetails.fieldValidation = [];
          if (PricingDetails.negotiatePrice && PricingDetails.id) {
            if (isNaN(PricingDetails.negotiatePrice)) {
              PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidNumber, 'negotiated price'));
            }
            else if (parseFloat(PricingDetails.negotiatePrice) < 0 || countDecimals(parseFloat(PricingDetails.negotiatePrice)) > _unitPriceFilterDecimal) {
              PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidValue, 'negotiated price'));
            }
            else if (parseFloat(PricingDetails.negotiatePrice) > parseFloat(PricingDetails.UnitPrice)) {
              PricingDetails.fieldValidation.push(pricingErrors.NegotiatePrice);
            }
          }
        });
        if (_.find(pricingErrorChecker, (lineItem) => (lineItem.fieldValidation && lineItem.fieldValidation.length > 0))) {
          const errorRecordSet = _.filter(pricingErrorChecker, (lineItem) => (lineItem.fieldValidation && lineItem.fieldValidation.length > 0));
          DialogFactory.dialogService(
            CORE.SUPPLIER_QUOTE_PART_PRICING_ERROR_CONTROLLER,
            CORE.SUPPLIER_QUOTE_PART_PRICING_ERROR_VIEW,
            null,
            errorRecordSet).then(() => {
            }, (data) => {
              if (data) {
                if (_hotRegisterer) {
                  _hotRegisterer.validateCells();
                }
              }
            }, () => { },
              (err) => BaseService.getErrorLog(err));
          vm.saveBtnDisableFlag = false;
        } else {
          const priceDetail = _.filter(_.map(vm.pricingModel, (data) => {
            if (data.id) {
              return {
                id: data.id,
                negotiatePrice: Number(data.negotiatePrice)
              };
            }
          }), (item) => item);
          vm.cgBusyLoading = SupplierQuoteFactory.saveSupplierQuoteNegotiatePriceDetails().query({ priceDetail: priceDetail }).$promise.then((response) => {
            if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.saveBtnDisableFlag = false;
              vm.isPricingChange = SupplierQuoteFactory.isPricingChange = false;
              vm.retrieveSupplierQuotePartPricingDetails();
            } else {
              vm.saveBtnDisableFlag = false;
            }
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }
      };

      const savePricing = () => {
        const FieldMapper = CORE.LabelConstant.SupplierQuote.FieldMapper;
        if (!(vm.pricingModel.length === 1 && Object.keys(vm.pricingModel[0]).length === 0 && vm.pricingModel[0].constructor === Object) && !vm.isDisable) {
          vm.pricingModel.splice(-1, 1);
        }
        vm.pricingModel = _.compact(vm.pricingModel);
        const pricingErrorChecker = angular.copy(vm.pricingModel);
        if (vm.pricingModel.length > 0) {
          let isRequiredValidation = false;
          _.each(pricingErrorChecker, (PricingDetails) => {
            if (!PricingDetails.NCNR || !PricingDetails.UnitOfTime || !PricingDetails.UnitPrice || !PricingDetails.itemNumber
              || !PricingDetails.leadTime || !PricingDetails.min || !PricingDetails.mult || !PricingDetails.packageID || !PricingDetails.qty
              || !PricingDetails.reeling || (!PricingDetails.stock && PricingDetails.stock !== 0)) {
              isRequiredValidation = true;
            }
            if (vm.dynamicHeaders.length > 0) {
              vm.dynamicHeaders.forEach((attributePrice) => {
                const fieldName = attributePrice.attributeColumnName;
                if (!PricingDetails[fieldName] && PricingDetails[fieldName] !== 0) {
                  isRequiredValidation = true;
                }
              });
            }
          });
          if (isRequiredValidation) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PRICING_REQUIRED_FIELDS);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                if (_hotRegisterer) {
                  _hotRegisterer.validateCells();
                }
                vm.saveBtnDisableFlag = false;
              }
            }).catch((error) => {
              vm.saveBtnDisableFlag = false;
              return BaseService.getErrorLog(error);
            });
          } else {
            const duplicateItemNumbers = [];
            _.each(pricingErrorChecker, (PricingDetails, index) => {
              const uniqueItemNumberCheck = _.find(vm.pricingModel, (lineItem, lineItemindex) => lineItemindex !== index && lineItem.itemNumber === PricingDetails.itemNumber);
              if (uniqueItemNumberCheck) {
                duplicateItemNumbers.push(uniqueItemNumberCheck.itemNumber);
              }
            });
            if (duplicateItemNumbers.length > 0) {
              const uniqueLineItems = _.uniq(duplicateItemNumbers);
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ITEM_NUMBER_DUPLICATE);
              messageContent.message = stringFormat(messageContent.message, uniqueLineItems.join(','));
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.saveBtnDisableFlag = false;
                }
              }).catch((error) => {
                vm.saveBtnDisableFlag = false;
                return BaseService.getErrorLog(error);
              });
            } else {
              _.each(pricingErrorChecker, (PricingDetails, index) => {
                PricingDetails.fieldValidation = [];
                let checker;
                _.each(CORE.LabelConstant.SupplierQuote.EntityMapper, (item, index) => {
                  if (index !== FieldMapper.packageID && index !== FieldMapper.itemNumber && index !== FieldMapper.UnitOfTime && index !== FieldMapper.NCNR && index !== FieldMapper.reeling && index !== FieldMapper.qty && index !== FieldMapper.UnitPrice && index !== FieldMapper.stock && (PricingDetails[index] || PricingDetails[index] <= 0)) {
                    if (isNaN(PricingDetails[index])) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidNumber, item));
                    }
                    else if (parseFloat(PricingDetails[index]) < 1 || parseFloat(PricingDetails[index]) > 999999999 || !Number.isInteger(parseFloat(PricingDetails[index]))) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidValue, item));
                    }
                  }
                  else if (index === FieldMapper.stock && (PricingDetails[index] || PricingDetails[index] <= 0)) {
                    if (isNaN(PricingDetails[index])) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidNumber, item));
                    }
                    else if (parseFloat(PricingDetails[index]) < 0 || parseFloat(PricingDetails[index]) > 999999999 || !Number.isInteger(parseFloat(PricingDetails[index]))) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidValue, item));
                    }
                  }
                  else if (index === FieldMapper.itemNumber && PricingDetails[index]) {
                    if (isNaN(PricingDetails[index])) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidNumber, item));
                    }
                    else if (parseFloat(PricingDetails[index]) <= 0 || parseFloat(PricingDetails[index]) > 999999999.99999 || countDecimals(parseFloat(PricingDetails[index])) > _unitPriceFilterDecimal) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidValue, item));
                    }
                  }
                  else if (index === FieldMapper.qty && PricingDetails[index]) {
                    if (isNaN(PricingDetails[index])) {//|| index == FieldMapper.negotiatePrice
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidNumber, item));
                    }
                    else if (parseFloat(PricingDetails[index]) <= 0 || parseFloat(PricingDetails[index]) > 999999999 || !Number.isInteger(parseFloat(PricingDetails[index]))) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidValue, item));
                    }
                  }
                  else if (index === FieldMapper.UnitPrice && PricingDetails[index]) {
                    if (isNaN(PricingDetails[index])) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidNumber, item));
                    }
                    else if (parseFloat(PricingDetails[index]) <= 0 || parseFloat(PricingDetails[index]) > 999999999.99999 || countDecimals(parseFloat(PricingDetails[index])) > _unitPriceFilterDecimal) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidValue, item));
                    }
                    else if (index === FieldMapper.UnitPrice && parseFloat(PricingDetails.negotiatePrice) && parseFloat(PricingDetails.negotiatePrice) > parseFloat(PricingDetails.UnitPrice)) {
                      PricingDetails.fieldValidation.push(pricingErrors.UnitPrice);
                    }
                  }
                  else if (index === FieldMapper.packageID && PricingDetails[index]) {
                    checker = _.find(vm.packagingList, (obj) => obj.name.toLowerCase() === PricingDetails[index].toString().toLowerCase());
                    if (!checker) {
                      PricingDetails.fieldValidation.push(pricingErrors.InvalidPackaging);
                    }
                  }
                  else if (index === FieldMapper.reeling && PricingDetails[index]) {
                    checker = _.find(vm.CustomReeling, (obj) => obj.VALUE.toLowerCase() === PricingDetails[index].toString().toLowerCase());
                    if (!checker) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.Invalid, item));
                    }
                  }
                  else if (index === FieldMapper.NCNR && PricingDetails[index]) {
                    checker = _.find(vm.Ncnr, (obj) => obj.VALUE.toLowerCase() === PricingDetails[index].toString().toLowerCase());
                    if (!checker) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.Invalid, item));
                    }
                  }
                  else if (index === FieldMapper.UnitOfTime && PricingDetails[index]) {
                    checker = _.find(vm.unitOfTime, (obj) => obj.TYPE.toLowerCase() === PricingDetails[index].toString().toLowerCase());
                    if (!checker) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.Invalid, item));
                    }
                  }
                });
                if (vm.dynamicHeaders && vm.dynamicHeaders.length > 0) {
                  vm.dynamicHeaders.forEach((attributePrice) => {
                    const fieldName = attributePrice.attributeColumnName;
                    if (isNaN(PricingDetails[fieldName])) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidNumber, attributePrice.fieldName));
                    }
                    else if (parseFloat(PricingDetails[fieldName]) < 0 || countDecimals(parseFloat(PricingDetails[fieldName])) > _unitPriceFilterDecimal) {
                      PricingDetails.fieldValidation.push(stringFormat(pricingErrors.InvalidValue, attributePrice.fieldName));
                    }
                  });
                }
                if (PricingDetails.fieldValidation.length === 0) {
                  const uniqueValidation = _.find(vm.pricingModel, (lineItem, lineItemindex) => lineItemindex !== index && lineItem.UnitOfTime.toLowerCase() === PricingDetails.UnitOfTime.toLowerCase() &&
                    parseFloat(lineItem.qty).toFixed(_unitPriceFilterDecimal) === parseFloat(PricingDetails.qty).toFixed(_unitPriceFilterDecimal) && lineItem.leadTime === PricingDetails.leadTime);
                  if (uniqueValidation) {
                    PricingDetails.fieldValidation.push(pricingErrors.PricingLineAlreadyExist);
                  }
                }
              });
              if (_.find(pricingErrorChecker, (lineItem) => (lineItem.fieldValidation && lineItem.fieldValidation.length > 0))) {
                const errorRecordSet = _.filter(pricingErrorChecker, (lineItem) => (lineItem.fieldValidation && lineItem.fieldValidation.length > 0));
                DialogFactory.dialogService(
                  CORE.SUPPLIER_QUOTE_PART_PRICING_ERROR_CONTROLLER,
                  CORE.SUPPLIER_QUOTE_PART_PRICING_ERROR_VIEW,
                  null,
                  errorRecordSet).then(() => {
                  }, () => {
                    if (_hotRegisterer) {
                      _hotRegisterer.validateCells();
                    }
                  }, () => {
                    if (_hotRegisterer) {
                      _hotRegisterer.validateCells();
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                vm.saveBtnDisableFlag = false;
              } else {
                vm.savePartPricing();
              }
            }
          }
        } else {
          vm.savePartPricing();
        }
      };

      vm.savePartPricing = () => {
        const dynamicFieldObject = [];
        if (vm.dynamicHeaders && vm.dynamicHeaders.length > 0) {
          vm.pricingModel.forEach((data) => {
            _.map(vm.dynamicHeaders, (item) => {
              const fieldName = item.attributeColumnName;
              dynamicFieldObject.push(
                {
                  supplierQuotePartPriceID: data.id ? data.id : null,
                  itemNumber: data.itemNumber,
                  attributeID: item.attributeID,
                  Price: Number(data[fieldName])
                });
            });
          });
        }
        const priceDetail = _.map(vm.pricingModel, (data) => {
          if (data.qty) {
            return {
              id: data.id ? data.id : null,
              supplierQuotePartDetID: vm.supplierQuotePartDetailId,
              itemNumber: data.itemNumber,
              qty: Number(data.qty),
              min: Number(data.min),
              mult: Number(data.mult),
              stock: Number(data.stock),
              packageID: _.find(vm.packagingList, (item) => item.name.toLowerCase() === data.packageID.toLowerCase()).id,
              reeling: _.find(vm.CustomReeling, (item) => item.VALUE.toLowerCase() === data.reeling.toLowerCase()).ID,
              NCNR: _.find(vm.CustomReeling, (item) => item.VALUE.toLowerCase() === data.NCNR.toLowerCase()).ID,
              leadTime: Number(data.leadTime),
              UnitOfTime: _.find(vm.unitOfTime, (item) => item.TYPE.toLowerCase() === data.UnitOfTime.toLowerCase()).VALUE,
              UnitPrice: Number(data.UnitPrice),
              //negotiatePrice: Number(data.negotiatePrice),
              attributePrice: _.filter(dynamicFieldObject, { itemNumber: data.itemNumber }),
              isUpdated: data.isUpdated ? data.isUpdated : false
            };
          }
        });
        const pricingData = {
          partPricingDetails: _.compact(priceDetail),
          supplierQuotePartDetID: vm.supplierQuotePartDetailId,
          supplierQuoteMstID: vm.supplierQuoteId,
          partID: vm.partId
        };
        vm.cgBusyLoading = SupplierQuoteFactory.saveSupplierQuotePartPricingDetails().query(pricingData).$promise.then((response) => {
          if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.saveBtnDisableFlag = false;
            vm.isPricingChange = SupplierQuoteFactory.isPricingChange = false;
            vm.retrieveSupplierQuotePartPricingDetails();
          } else if (response.errors && response.errors.data && (response.errors.data.isUsed || response.errors.data.isPublished) && response.status === CORE.ApiResponseTypeStatus.EMPTY) {
            if (checkResponseHasCallBackFunctionPromise(response)) {
              vm.saveBtnDisableFlag = false;
              response.alretCallbackFn.then(() => {
                reInitPricing();
              });
            }
          } else if (response.errors && response.errors.data && response.status === CORE.ApiResponseTypeStatus.EMPTY) {
            vm.saveBtnDisableFlag = false;
            DialogFactory.dialogService(
              CORE.SUPPLIER_QUOTE_PART_PRICING_ERROR_CONTROLLER,
              CORE.SUPPLIER_QUOTE_PART_PRICING_ERROR_VIEW,
              null,
              response.errors.data).then(() => {
              }, () => {
              }, (err) => BaseService.getErrorLog(err));
          } else {
            vm.saveBtnDisableFlag = false;
          }
        }).catch((error) => {
          vm.saveBtnDisableFlag = false;
          return BaseService.getErrorLog(error);
        });
      };

      vm.downloadTemplate = () => {
        const exportObj = {};
        _.map(vm.exportHeader, (item) => {
          exportObj[item.fieldName] = '';
        });

        vm.cgBusyLoading = ImportExportFactory.importFile([exportObj]).then((res) => {
          if (res.data) {
            exportFileDetail(res, vm.partPicingModuleName);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };


      const exportFileDetail = (res, name) => {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, name);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', name);
            link.style = 'visibility:hidden';
            document.body.appendChild(link);
            $timeout(() => {
              link.click();
              document.body.removeChild(link);
            });
          }
        }
      };


      vm.eroOptions = {
        workstart: () => {
        },
        workend: () => { },
        sheet: (json, sheetnames, select_sheet_cb, file) => {
          const type = file.name.split('.');
          if (_.find(CORE.UPLOAD_DOCUMENT_TYPE, (docType) => docType === type[type.length - 1])) {
            const data = {
              headers: vm.exportHeader,
              excelHeaders: json[0],
              notquote: true,
              headerName: vm.LabelConstant.SupplierQuote.PartPricing
            };
            DialogFactory.dialogService(
              RFQTRANSACTION.PRICING_COLUMN_MAPPING_CONTROLLER,
              RFQTRANSACTION.PRICING_COLUMN_MAPPING_VIEW,
              _dummyEvent,
              data).then((result) => {
                json[0] = result.excelHeaders;
                //$timeout(() => { generateModel(json, result.model); });
                generateModel(json, result.model);
              }, (err) => BaseService.getErrorLog(err));
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
          }
        },
        badfile: () => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        pending: () => {
        },
        failed: () => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DOC_FILE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        large: () => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
        },
        multiplefile: () => {
        }
      };

      vm.importPricing = (ev) => {
        _dummyEvent = ev;
        angular.element('#fi-excel').trigger('click');
      };

      // Create model from array
      function generateModel(uploadedPricing, pricingHeaders) {
        const importPricingModel = [];
        for (let i = 1, len = uploadedPricing.length; i < len; i++) {
          const item = uploadedPricing[i];
          const modelRow = {};
          uploadedPricing[0].forEach((column, index) => {
            if (column.name === null) {
              return;
            }
            const obj = pricingHeaders.find((x) => x.column && column && x.column.toUpperCase() === column.name.toUpperCase());
            if (!obj) {
              return;
            }
            const field = vm.exportHeader.find((x) => x.fieldName === obj.header);
            if (!modelRow[field.fieldName]) {
              modelRow[field.fieldName] = item[index] || item[index] === 0 || item[index] === '0' ? item[index] : null;
            }
          });
          importPricingModel.push(modelRow);
        };
        checkUploadedPartPricing(importPricingModel, pricingHeaders);
      }

      const checkUploadedPartPricing = (importPricingModel, pricingHeaders) => {
        const notMappedColumn = _.filter(pricingHeaders, (data) => {
          if (_.findIndex(vm.exportHeader, (item) => item.fieldName === data.header) !== -1 && !data.column) {
            return data;
          }
        });
        if (notMappedColumn.length > 0) {
          const columnString = _.map(notMappedColumn, 'header').join(', ');
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_IMPORT_COLUMN_NOT_MAPPED);
          messageContent.message = stringFormat(messageContent.message, columnString);
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
          return;
        }

        const dynamicFieldObject = [];
        if (vm.dynamicHeaders && vm.dynamicHeaders.length > 0) {
          importPricingModel.forEach((data, index) => {
            _.map(vm.dynamicHeaders, (item) => {
              dynamicFieldObject.push(
                {
                  itemNumber: index,// data[vm.LabelConstant.SupplierQuote.Item],
                  attributeName: item.fieldName,
                  attributeID: item.attributeID,
                  Price: data[item.fieldName + ' ($)']
                });
            });
          });
        }

        const pricingModel = _.map(importPricingModel, (model, index) => ({
          supplierQuotePartDetID: vm.supplierQuotePartDetailId,
          itemNumber: model[vm.LabelConstant.SupplierQuote.Item],
          qty: model[vm.LabelConstant.SupplierQuote.Qty],
          min: model[vm.LabelConstant.SupplierQuote.Min],
          mult: model[vm.LabelConstant.SupplierQuote.Mult],
          stock: model[vm.LabelConstant.SupplierQuote.Stock],
          packaging: model[vm.LabelConstant.SupplierQuote.Packaging],
          packageID: null,
          reeling: model[vm.LabelConstant.SupplierQuote.CustomReel],
          reelingID: null,
          NCNR: model[vm.LabelConstant.SupplierQuote.NCNR],
          NCNRID: null,
          leadTime: model[vm.LabelConstant.SupplierQuote.LeadTime],
          UnitOfTime: model[vm.LabelConstant.SupplierQuote.UnitOfTime],
          UnitPrice: model[vm.LabelConstant.SupplierQuote.UnitPrice],
          attributePrice: _.filter(dynamicFieldObject, { itemNumber: index /*model[vm.LabelConstant.SupplierQuote.Item]*/ })
        }));

        if (pricingModel.length > 0) {
          vm.cgBusyLoading = SupplierQuoteFactory.importSupplierQuotePartPricingDetails().query({ partPricingDetails: _.compact(pricingModel) }).$promise.then((response) => {
            if (response && response.errors && response.errors.data && (response.errors.data.isUsed || response.errors.data.isPublished) && response.status === CORE.ApiResponseTypeStatus.EMPTY) {
              if (checkResponseHasCallBackFunctionPromise(response)) {
                response.alretCallbackFn.then(() => {
                  reInitPricing();
                });
              }
            }
            else if (response && response.status === CORE.ApiResponseTypeStatus.FAILED) {
              const exportErrorList = _.filter(response.data, (status) => status.status === CORE.ApiResponseTypeStatus.FAILED);
              const pricingErrorList = [];
              _.each(exportErrorList, (item) => {
                const mapppingObject = {};
                mapppingObject[vm.LabelConstant.SupplierQuote.Item] = item.itemNumber;
                mapppingObject[vm.LabelConstant.SupplierQuote.Qty] = item.qty;
                mapppingObject[vm.LabelConstant.SupplierQuote.Min] = item.min;
                mapppingObject[vm.LabelConstant.SupplierQuote.Mult] = item.mult;
                mapppingObject[vm.LabelConstant.SupplierQuote.Stock] = item.stock;
                mapppingObject[vm.LabelConstant.SupplierQuote.Packaging] = item.packaging;
                mapppingObject[vm.LabelConstant.SupplierQuote.CustomReel] = item.reeling;
                mapppingObject[vm.LabelConstant.SupplierQuote.NCNR] = item.NCNR;
                mapppingObject[vm.LabelConstant.SupplierQuote.LeadTime] = item.leadTime;
                mapppingObject[vm.LabelConstant.SupplierQuote.UnitOfTime] = item.UnitOfTime;
                mapppingObject[vm.LabelConstant.SupplierQuote.UnitPrice] = item.UnitPrice;
                if (item.attributePrice.length > 0) {
                  _.map(item.attributePrice, (attributes) => {
                    //mapppingObject[attributes.attributeName] = attributes.Price;
                    mapppingObject[attributes.attributeName + ' ($)'] = attributes.Price;
                  });
                }
                mapppingObject.Error = item.message;
                pricingErrorList.push(mapppingObject);
              });

              vm.cgBusyLoading = ImportExportFactory.importFile(pricingErrorList).then((res) => {
                if (res.data && pricingErrorList.length > 0) {
                  $timeout(() => {
                    vm.retrieveSupplierQuotePartPricingDetails();
                  }, true);
                  exportFileDetail(res, 'PartPricing_Error.xlsx');
                }
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              $timeout(() => {
                vm.retrieveSupplierQuotePartPricingDetails();
              }, true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };
      const attributeRemoved = (response) => {
        const data = response;
        const attributes = _.map(data.deletedAttributes, 'fieldName').join(',');
        if (vm.supplierQuotePartDetailId === data.supplierQuotePartDetID && !vm.isDisable) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SUPPLIER_QUOTE_PART_ATTRIBUTE_REMOVED);
          messageContent.message = stringFormat(messageContent.message, attributes, data.username);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.isGridLoaded = false;
              let copyDynamicHeaders = [];
              _.each(data.deletedAttributes, (item) => {
                copyDynamicHeaders = _.reject(vm.dynamicHeaders, (o) => o.attributeID === item.id);
              });
              $timeout(() => {
                const copyPricingModel = angular.copy(vm.pricingModel);
                vm.pricingModel = [];
                vm.sourceHeader = [];
                vm.dynamicHeaders = copyDynamicHeaders;
                initSourceHeader(copyDynamicHeaders);
                vm.pricingModel = copyPricingModel;
                vm.isGridLoaded = true;
                if (_hotRegisterer) {
                  _hotRegisterer.render();
                }
                setHandsontableHeight();
                //initDatabaseModel(vm.pricingModel);
              }, true);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      function socketListener(response) {
        $timeout(() => {
          attributeRemoved(response);
        });
      }
      function connectSocket() {
        socketConnectionService.on(CORE.Socket_IO_Events.SupplierQuote.sendSupplierQuotePartAttributeRemoved, socketListener);
      }
      connectSocket();

      socketConnectionService.on('reconnect', () => {
        connectSocket();
      });
      function removeSocketListener() {
        socketConnectionService.removeListener(CORE.Socket_IO_Events.SupplierQuote.sendSupplierQuotePartAttributeRemoved);
      }
      $scope.$on('$destroy', () => {
        removeSocketListener();
      });

      // on disconnect socket
      socketConnectionService.on('disconnect', () => {
        removeSocketListener();
      });

      // set handsontable full height to screen
      function setHandsontableHeight() {
        const offset = $('#hot-partpricing-container').offset();

        if (!offset) {
          return;
        }

        const docHeight = $('#supplierQuotePartPrice').height();
        //var footerHeight = $('.footerfixedbutton').outerHeight();

        const handsontableHeight = (docHeight - offset.top) + 12;
        //let handsontableHeight = 350;//docHeight - offset.top - 700;
        //$('#hot-partpricing-container').height(handsontableHeight).css({
        //  overflow: 'auto'
        //});

        $('#hot-partpricing-container').height(handsontableHeight).css({
          overflow: 'hidden'
        });
        // Resolved Scroll issue in case of read only handsontable
        $('#hot-partpricing-container .wtHolder').height(handsontableHeight);
        //$('#hot-partpricing-container .wtHolder').width('auto');
      }

      // set height to the handosontable container

      $(window).resize(() => {
        handsontableresize();
      });

      function handsontableresize() {
        const offset = $('#hot-partpricing-container').offset();

        if (!offset) {
          return;
        }
        const docHeight = $('#supplierQuotePartPrice').height();
        const tableHeight = (docHeight - offset.top) + 12;
        $('#hot-partpricing-container .wtHolder').height(tableHeight);
      };
    }
  }
})();
