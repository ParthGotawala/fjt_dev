(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, TRANSACTION, CORE) {
    // State
    $stateProvider
      .state(TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_STATE, {
        url: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, {
        url: TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_ROUTE,
        params: {
          type: CORE.ReceivingMatirialTab.PartToStock.Name
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.manage': {
            templateUrl: TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE, {
        url: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_ROUTE,
        params: {
          whId: '0',
          binId: '0',
          refSalesOrderDetID: '0',
          assyID: '0'
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.list': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_UMID_DOCUMENT_STATE, {
        url: TRANSACTION.TRANSACTION_UMID_DOCUMENT_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.umiddocument': {
            templateUrl: TRANSACTION.TRANSACTION_UMID_DOCUMENT_VIEW,
            controller: TRANSACTION.TRANSACTION_UMID_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_COFC_DOCUMENT_STATE, {
        url: TRANSACTION.TRANSACTION_COFC_DOCUMENT_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.cofcdocument': {
            templateUrl: TRANSACTION.TRANSACTION_COFC_DOCUMENT_VIEW,
            controller: TRANSACTION.TRANSACTION_COFC_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE, {
        url: TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.verificationhistory': {
            templateUrl: TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_VIEW,
            controller: TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_NONUMIDSTOCK_STATE, {
        url: TRANSACTION.TRANSACTION_NONUMIDSTOCK_ROUTE,
        params: {
          whId: '0',
          binId: '0'
        },
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.nonumidstocklist': {
            templateUrl: TRANSACTION.TRANSACTION_NONUMIDSTOCK_VIEW,
            controller: TRANSACTION.TRANSACTION_NONUMIDSTOCK_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_COUNTAPPROVAL_STATE, {
        url: TRANSACTION.TRANSACTION_COUNTAPPROVAL_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.countapprovallist': {
            templateUrl: TRANSACTION.TRANSACTION_COUNTAPPROVAL_VIEW,
            controller: TRANSACTION.TRANSACTION_COUNTAPPROVAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_SPLIT_UID_STATE, {
        url: TRANSACTION.TRANSACTION_SPLIT_UID_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.splitumidlist': {
            templateUrl: TRANSACTION.TRANSACTION_SPLIT_UID_VIEW,
            controller: TRANSACTION.TRANSACTION_SPLIT_UID_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_STATE, {
        url: TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_ROUTE,
        views: {
          'content@app': {
            templateUrl: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_VIEW,
            controller: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          },
          'tabContent@app.transaction.receivingmaterial.parentumiddocument': {
            templateUrl: TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_VIEW,
            controller: TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
  }
})();


