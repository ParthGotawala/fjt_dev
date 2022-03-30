(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider.state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE, {
      url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_ROUTE,
      params: {
        transType: 'I'
      },
      views: {
        'content@app': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        },
        'tabContent@app.transaction.customerinvoice': {
          templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_VIEW,
          controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }, data: {
        autoActivateChild: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE
      }
    })
      .state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_ROUTE,
        views: {
          //'content@app': {
          //  templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW,
          //  controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER,
          //  controllerAs: CORE.CONTROLLER_AS
          //},
          'summarylist': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      })
      .state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_ROUTE,
        views: {
          //'content@app': {
          //  templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW,
          //  controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER,
          //  controllerAs: CORE.CONTROLLER_AS
          //},
          'detaillist': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      })
      .state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_ROUTE,
        params: {
          transType: 'I'
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_ROUTE,
        params: {
          packingSlipNumber: null
        },
        views: {
          'details': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_ROUTE,
        views: {
          'documents': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_ROUTE,
        views: {
          'packingdocument': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_ROUTE,
        views: {
          'misc': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_ROUTE,
        //params: {
        //  transType: 'I'
        //},
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.customerpackingslipinvoice': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_ROUTE,
        views: {
          'summarylist': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_SUMM_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_ROUTE,
        views: {
          'detaillist': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INV_PACKINGSLIP_LIST_DETL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_ROUTE,
        params: {
          transType: 'C'
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.customercreditnote': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        data: {
          autoActivateChild: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_STATE
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_SUMM_ROUTE,
        params: {
          transType: 'C'
        },
        views: {
          'summarylist': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_SUMM_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_LIST_DETL_ROUTE,
        params: {
          transType: 'C'
        },
        views: {
          'detaillist': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_LIST_DETL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_MANAGE_CUSTOMER_CREDIT_NOTE_MAIN_STATE, {
        url: TRANSACTION.TRANSACTION_MANAGE_CUSTOMER_CREDIT_NOTE_MAIN_ROUTE,
        params: {
          transType: 'C'
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MANAGE_MAIN_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_ROUTE,
        views: {
          'details': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_ROUTE,
        views: {
          'documents': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_STATE, {
        url: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_ROUTE,
        views: {
          'misc': {
            templateUrl: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_VIEW,
            controller: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      });
  }
})();
