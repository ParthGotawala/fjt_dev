(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('supplierQuotePurchaseOrderPartPriceDetailGrid', supplierQuotePurchaseOrderPartPriceDetailGrid);

  /** @ngInject */
  function supplierQuotePurchaseOrderPartPriceDetailGrid(BaseService, hotRegisterer, $q, $timeout, CORE, RFQTRANSACTION, PartCostingFactory, SupplierQuoteFactory) {
    const directive = {
      restrict: 'E',
      replace: false,
      scope: {
        partId: '=',
        supplierId: '='
      },
      templateUrl: 'app/directives/custom/supplier-quote-purchase-order-part-price-detail-grid/supplier-quote-purchase-order-part-price-detail-grid.html',
      controller: supplierQuotePurchaseOrderPartPriceDetailGridCtrl,
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
    function supplierQuotePurchaseOrderPartPriceDetailGridCtrl($scope) {
      const vm = this;
      // get handsontable object
      var _hotRegisterer = null;
      vm.LabelConstant = CORE.LabelConstant;
      vm.partId = $scope.partId;
      vm.supplierId = $scope.supplierId;
      vm.isDisable = true;
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
      vm.dropdownTypes = [];
      vm.isGridLoaded = false;
      vm.partPicingModuleName = 'PartPricing.xlsx';

      vm.retrieveSupplierQuotePartPricingDetails = () => {
        const supplierPricingData = {
          partID: vm.partId,
          supplierID: vm.supplierId
        };
        vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuotePricingDetailsByPartID().query(supplierPricingData).$promise.then((response) => {
          if (response && response.data) {
            initSourceHeader();
            $timeout(() => {
              initDatabaseModel(response.data.pricingDetails);
            }, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
      //get packaing list
      vm.getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
        if (packaging && packaging.data) {
          vm.packagingList = packaging.data;
        }
        return vm.packagingList;
      }).catch((error) => BaseService.getErrorLog(error));


      const init = () => {
        const pricingPromise = [vm.getPackaging()];
        vm.cgBusyLoading = $q.all(pricingPromise).then(() => {
          vm.retrieveSupplierQuotePartPricingDetails();
        }).catch((error) => BaseService.getErrorLog(error));
      };

      init();
      // Added custom cell renderer
      // It will be call after all cell change and render events
      // Add cells color based on error code here
      Handsontable.renderers.registerRenderer('cellRenderer', function (instance, td, row, col, prop, value) {
        if (vm.dropdownTypes.indexOf(prop) !== -1) {
          Handsontable.renderers.AutocompleteRenderer.apply(this, arguments);
        } else {
          Handsontable.renderers.TextRenderer.apply(this, arguments);
        }
        if (_hotRegisterer && _hotRegisterer.isEmptyRow(row)) {
          return;
        }
        switch (prop) {
          case 'itemNumber': {
            td.style.textAlign = 'right';
            break;
          }
          case 'qty': {
            td.style.textAlign = 'right';
            break;
          }
          case 'min': {
            td.style.textAlign = 'right';
            break;
          }
          case 'mult': {
            td.style.textAlign = 'right';
            break;
          }
          case 'stock': {
            td.style.textAlign = 'right';
            break;
          }
          case 'packageID': {
            break;
          }
          case 'NCNR': {
            break;
          }
          case 'reeling': {
            break;
          }
          case 'leadTime': {
            td.style.textAlign = 'right';
            break;
          }
          case 'UnitOfTime': {
            break;
          }
          case 'UnitPrice': {
            td.style.textAlign = 'right';
            break;
          }
          case 'negotiatePrice': {
            td.style.textAlign = 'right';
            if ((value !== '' && value !== null) && !(parseFloat(value)).toFixed(_unitPriceFilterDecimal)) {
              td.title = stringFormat(pricingErrors.ToolTipInvalid, 'negotiate price');
            } else {
              td.title = '';
            }
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
      });

      vm.settings = {
        rowHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders: true,
        renderAllRows: true,
        fixedColumnsLeft: 1,
        minSpareRows: 0,
        stretchH: 'all',
        contextMenu: {
          items: {
            'remove_row': {
              name: vm.LabelConstant.SupplierQuote.menuEntries.remove_row.name,
              disabled: () => true,
              callback: () => {
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
            _hotRegisterer = hotRegisterer.getInstance('hot-partpricingpurchase');
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
            case 'CopyPaste.paste':
          }
        },
        afterGetColHeader: (col, th) => {
          if (!vm.isDisable) {
            th.className = 'h-col-' + col;
          }
        },
        afterRemoveRow: () => {
        },
        afterValidate: (isValid, value, row) => {
          // If first row (header row) or empty row then return
          if (!_hotRegisterer || _hotRegisterer.isEmptyRow(row)) {
            return true;
          }
        },
        beforeCreateRow: () => {
          if (vm.pricingModel.length > 0 && vm.isDisable) {
            return false;
          } else {
            return true;
          }
        }
      };


      function initSourceHeader() {
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
            readOnly: vm.isDisable,
            displayOrder: 3,
            type: 'numeric',
            width: 30,
            validator: () => {
            }
          },
          {
            field: 'qty',
            header: 'Qty',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 4,
            title: 'Qty',
            type: 'text',
            width: 80,
            validator: () => {
            }
          },
          {
            field: 'min',
            header: 'Min',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 5,
            title: 'Min',
            type: 'text',
            width: 55,
            validator: () => {
            }
          },
          {
            field: 'mult',
            header: 'Mult',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 6,
            title: 'Mult',
            type: 'text',
            width: 55,
            validator: () => {
            }
          },
          {
            field: 'stock',
            header: 'Stock',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 7,
            title: 'Stock',
            type: 'text',
            width: 55,
            validator: () => {
            }
          },
          {
            field: 'packageID',
            header: 'Packaging',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 8,
            title: 'Packaging',
            type: 'dropdown',
            width: 100,
            source: vm.packagingList.map((x) => x.name),
            validator: () => {
            }
          },
          {
            field: 'reeling',
            header: 'Custom Reel',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 9,
            title: 'Custom Reel',
            type: 'dropdown',
            width: 60,
            source: _.map(vm.CustomReeling, (x) => x.VALUE),
            validator: () => {
            }
          },
          {
            field: 'NCNR',
            header: 'NCNR',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 10,
            title: 'NCNR',
            type: 'dropdown',
            width: 60,
            source: _.map(vm.Ncnr, (x) => x.VALUE),
            validator: () => {
            }
          },
          {
            field: 'leadTime',
            header: 'Lead Time',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 11,
            title: 'Lead Time',
            type: 'text',
            width: 55,
            validator: () => {
            }
          },
          {
            field: 'UnitOfTime',
            header: 'Unit Of Time',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 12,
            title: 'Unit Of Time',
            type: 'dropdown',
            width: 80,
            source: _.map(vm.unitOfTime, (x) => x.TYPE),
            validator: () => {
            }
          },
          {
            field: 'UnitPrice',
            header: 'Unit Price',
            hidden: false,
            readOnly: vm.isDisable,
            displayOrder: 13,
            title: 'Unit Price ($)',
            type: 'text',
            width: 80,
            validator: () => {
            }
          },
          {
            field: 'extPrice',
            header: 'Ext. Price',
            title: 'Ext. Price ($)',
            hidden: false,
            displayOrder: 14,
            readOnly: true,
            type: 'numeric',
            width: 80,
            validator: () => {
            }
          },
          {
            field: 'negotiatePrice',
            header: 'Negotiated Price',
            hidden: false,
            readOnly: true,
            displayOrder: 15,
            title: 'Negotiated Price ($)',
            type: 'text',
            width: 80,
            validator: () => {
            }
          },
          {
            field: 'negotiateExtPrice',
            header: 'Negotiated Ext. Price',
            title: 'Negotiated Ext. Price ($)',
            hidden: false,
            displayOrder: 16,
            readOnly: true,
            type: 'numeric',
            width: 80,
            validator: () => {
            }
          }];

        vm.sourceHeader.push({
          field: 'total',
          header: 'Total',
          displayOrder: _.last(vm.sourceHeader).displayOrder + 1,
          hidden: false,
          title: 'Total ($)',
          type: 'numeric',
          readOnly: true,
          width: 90,
          validator: () => {
          }
        });
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
            modelRow.qty = modelRow.qty.toFixed(2);
            modelRow.UnitPrice = modelRow.UnitPrice.toFixed(_unitPriceFilterDecimal);
            modelRow.negotiatePrice = modelRow.negotiatePrice ? modelRow.negotiatePrice.toFixed(_unitPriceFilterDecimal) : null;
            modelRow.negotiateExtPrice = modelRow.negotiatePrice ? parseFloat(Math.abs((modelRow.qty || 0) * (modelRow.negotiatePrice || 0))).toFixed(_unitPriceFilterDecimal) : null;
            modelRow.extPrice = parseFloat(Math.abs((modelRow.qty || 0) * (modelRow.UnitPrice || 0))).toFixed(_unitPriceFilterDecimal);
            total = isNaN(total) ? 0 : total;
            modelRow.total = parseFloat(parseFloat(modelRow.extPrice) + parseFloat(total)).toFixed(_unitPriceFilterDecimal);
            vm.pricingModel.push(modelRow);
          }
          //vm.pricingModel = _.sortBy(vm.pricingModel, 'Supplier');
        } else {
          vm.pricingModel = [];
        }
        // setHandsontableHeight();
      };

      // set handsontable full height to screen
      function setHandsontableHeight() {
        const offset = $('#hot-partpricingpurchase-container').offset();

        if (!offset) {
          return;
        }

        const docHeight = $('#supplierQuotePartPrice').height();
        //var footerHeight = $('.footerfixedbutton').outerHeight();

        const handsontableHeight = (docHeight - offset.top) + 12;

        $('#hot-partpricingpurchase-container').height(handsontableHeight).css({
          overflow: 'hidden'
        });
        // Resolved Scroll issue in case of read only handsontable
        $('#hot-partpricingpurchase-container .wtHolder').height(handsontableHeight);
        //$('#hot-partpricing-container .wtHolder').width('auto');
      }

      // set height to the handosontable container

      $(window).resize(() => {
        handsontableresize();
      });

      function handsontableresize() {
        const offset = $('#hot-partpricingpurchase-container').offset();
        if (!offset) {
          return;
        }
        const docHeight = $('#supplierQuotePartPrice').height();
        const tableHeight = (docHeight - offset.top) + 12;
        $('#hot-partpricingpurchase-container .wtHolder').height(tableHeight);
      };
    }
  }
})();
