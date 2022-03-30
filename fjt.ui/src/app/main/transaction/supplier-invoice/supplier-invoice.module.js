(function () {
    'use strict';
    angular
        .module('app.transaction.supplierInvoice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, TRANSACTION, CORE) {
        // State
      $stateProvider
        .state(TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicepackingslip': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_PACKING_SLIP_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_TARIFF_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_TARIFF_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicetariff': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_TARIFF_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_TARIFF_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_RMA_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_RMA_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicesupplierrma': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_RMA_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_RMA_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicecreditmemo': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_CREDIT_MEMO_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicedebitmemo': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_DEBIT_MEMO_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(TRANSACTION.TRANSACTION_INVOICE_PAYMENT_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_PAYMENT_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicepayment': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_PAYMENT_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_PAYMENT_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_STATE, {
          url: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_ROUTE,
          params: {
            slipType: CORE.PackingSlipInvoiceTabName,
            packingSlipNumber: null
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicetariff.manage': {
              templateUrl: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_MANAGE_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_STATE, {
          url: TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_ROUTE,
          params: {
            slipType: CORE.PackingSlipInvoiceTabName,
            packingSlipNumber: null
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicecreditmemo.manage': {
              templateUrl: TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_MANAGE_CREDIT_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_STATE, {
          url: TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_ROUTE,
          params: {
            slipType: CORE.PackingSlipInvoiceTabName,
            packingSlipNumber: null
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicedebitmemo.manage': {
              templateUrl: TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_MANAGE_DEBIT_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        }).state(TRANSACTION.TRANSACTION_INVOICE_REFUND_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_REFUND_ROUTE,
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_VIEW,
              controller: TRANSACTION.TRANSACTION_SUPPLIER_INVOICE_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            },
            'tabContent@app.transaction.invoicerefund': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_REFUND_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_REFUND_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_ROUTE,
          views: {
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DETAIL_ROUTE,
          params: {
            selectedTab: TRANSACTION.SupplierInvoicePaymentTabs.Detail.Name
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DOCUMENT_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_DOCUMENT_ROUTE,
          params: {
            selectedTab: TRANSACTION.SupplierInvoicePaymentTabs.Document.Name
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_MANAGE_PAYMENT_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_ROUTE,
          views: {
            //'content@app': {
            //  templateUrl: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_VIEW,
            //  controller: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_CONTROLLER,
            //  controllerAs: CORE.CONTROLLER_AS
            //}
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DETAIL_ROUTE,
          params: {
            selectedTab: TRANSACTION.SupplierInvoiceRefundTabs.Detail.Name
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        })
        .state(TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DOCUMENT_STATE, {
          url: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_DOCUMENT_ROUTE,
          params: {
            selectedTab: TRANSACTION.SupplierInvoiceRefundTabs.Document.Name
          },
          views: {
            'content@app': {
              templateUrl: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_VIEW,
              controller: TRANSACTION.TRANSACTION_INVOICE_MANAGE_REFUND_CONTROLLER,
              controllerAs: CORE.CONTROLLER_AS
            }
          }
        });
    }
})();
