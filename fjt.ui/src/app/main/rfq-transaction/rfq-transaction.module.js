(function () {
  'use strict';

  angular
    .module('app.rfqtransaction', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, CORE, RFQTRANSACTION) {
    $stateProvider.state(RFQTRANSACTION.RFQ_BOM_STATE, {
      url: RFQTRANSACTION.RFQ_BOM_ROUTE,
      views: {
        'content@app': {
          templateUrl: RFQTRANSACTION.RFQ_BOM_VIEW,
          controller: RFQTRANSACTION.RFQ_BOM_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_IMPORT_BOM_STATE, {
      url: RFQTRANSACTION.RFQ_IMPORT_BOM_ROUTE,
      views: {
        'importbom': {
          templateUrl: RFQTRANSACTION.RFQ_IMPORT_BOM_VIEW,
          controller: RFQTRANSACTION.RFQ_IMPORT_BOM_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_SEARCH_BOM_STATE, {
      url: RFQTRANSACTION.RFQ_SEARCH_BOM_ROUTE,
      views: {
        'content@app': {
          templateUrl: RFQTRANSACTION.RFQ_SEARCH_BOM_VIEW,
          controller: RFQTRANSACTION.RFQ_SEARCH_BOM_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_PLANNED_BOM_STATE, {
      url: RFQTRANSACTION.RFQ_PLANNED_BOM_ROUTE,
      views: {
        'plannedbom': {
          templateUrl: RFQTRANSACTION.RFQ_PLANNED_BOM_VIEW,
          controller: RFQTRANSACTION.RFQ_PLANNED_BOM_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_QUOTE_STATE, {
      url: RFQTRANSACTION.RFQ_QUOTE_ROUTE,
      views: {
        'quote': {
          templateUrl: RFQTRANSACTION.RFQ_QUOTE_VIEW,
          controller: RFQTRANSACTION.RFQ_QUOTE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_SUMMARY_STATE, {
      url: RFQTRANSACTION.RFQ_SUMMARY_ROUTE,
      views: {
        'summary': {
          templateUrl: RFQTRANSACTION.RFQ_SUMMARY_VIEW,
          controller: RFQTRANSACTION.RFQ_SUMMARY_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_SUMMARY2_STATE, {
      url: RFQTRANSACTION.RFQ_SUMMARY2_ROUTE,
      views: {
        'summary2': {
          templateUrl: RFQTRANSACTION.RFQ_SUMMARY2_VIEW,
          controller: RFQTRANSACTION.RFQ_SUMMARY2_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_PART_COSTING_STATE, {
      url: RFQTRANSACTION.RFQ_PART_COSTING_ROUTE,
      views: {
        'partcosting': {
          templateUrl: RFQTRANSACTION.RFQ_PART_COSTING_VIEW,
          controller: RFQTRANSACTION.RFQ_PART_COSTING_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    }).state(RFQTRANSACTION.RFQ_RFQ_STATE, {
      url: RFQTRANSACTION.RFQ_RFQ_ROUTE,
      views: {
        'content@app': {
          templateUrl: RFQTRANSACTION.RFQ_RFQ_VIEW,
          controller: RFQTRANSACTION.RFQ_RFQ_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      },
      resolve: {
      }
    })
      .state(RFQTRANSACTION.RFQ_MANAGE_STATE, {
        url: RFQTRANSACTION.RFQ_MANAGE_ROUTE,
        views: {
          'content@app': {
            templateUrl: RFQTRANSACTION.RFQ_MANAGE_VIEW,
            controller: RFQTRANSACTION.RFQ_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(RFQTRANSACTION.RFQ_REVIEW_PRICING_STATE, {
        url: RFQTRANSACTION.RFQ_REVIEW_PRICING_ROUTE,
        views: {
          'content@app': {
            templateUrl: RFQTRANSACTION.RFQ_REVIEW_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_REVIEW_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.rfq.bom.partcosting.reviewpricing': {
            templateUrl: RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      }).state(RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_STATE, {
        url: RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_ROUTE,
        views: {
          'tabContent': {
            templateUrl: RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_NOTQUOTED_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(RFQTRANSACTION.RFQ_RULES_PRICING_STATE, {
        url: RFQTRANSACTION.RFQ_RULES_PRICING_ROUTE,
        views: {
          'tabContent': {
            templateUrl: RFQTRANSACTION.RFQ_RULES_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_RULES_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(RFQTRANSACTION.RFQ_EXCESS_PRICING_STATE, {
        url: RFQTRANSACTION.RFQ_EXCESS_PRICING_ROUTE,
        views: {
          'tabContent': {
            templateUrl: RFQTRANSACTION.RFQ_EXCESS_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_EXCESS_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(RFQTRANSACTION.RFQ_ATRISK_PRICING_STATE, {
        url: RFQTRANSACTION.RFQ_ATRISK_PRICING_ROUTE,
        views: {
          'tabContent': {
            templateUrl: RFQTRANSACTION.RFQ_ATRISK_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_ATRISK_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(RFQTRANSACTION.RFQ_LEADTIME_PRICING_STATE, {
        url: RFQTRANSACTION.RFQ_LEADTIME_PRICING_ROUTE,
        views: {
          'tabContent': {
            templateUrl: RFQTRANSACTION.RFQ_LEADTIME_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_LEADTIME_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(RFQTRANSACTION.RFQ_ALTERNATIVE_PRICING_STATE, {
        url: RFQTRANSACTION.RFQ_ALTERNATIVE_PRICING_ROUTE,
        views: {
          'tabContent': {
            templateUrl: RFQTRANSACTION.RFQ_ALTERNATIVE_PRICING_VIEW,
            controller: RFQTRANSACTION.RFQ_ALTERNATIVE_PRICING_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(RFQTRANSACTION.RFQ_DOCUMENT_STATE, {
        url: RFQTRANSACTION.RFQ_DOCUMENT_ROUTE,
        views: {
          'document': {
            templateUrl: RFQTRANSACTION.RFQ_DOCUMENT_VIEW
          }
        },
        resolve: {
        }
      }).state(RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_STATE, {
        url: RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_ROUTE,
        views: {
          'content@app': {
            templateUrl: RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_VIEW,
            controller: RFQTRANSACTION.QUOTE_SUMMARY_DETAIL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      }).state(RFQTRANSACTION.RFQ_LABOR_STATE, {
        url: RFQTRANSACTION.RFQ_LABOR_ROUTE,
        views: {
          'labor': {
            templateUrl: RFQTRANSACTION.RFQ_LABOR_VIEW,
            controller: RFQTRANSACTION.RFQ_LABOR_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        resolve: {
        }
      });
  }
})();
