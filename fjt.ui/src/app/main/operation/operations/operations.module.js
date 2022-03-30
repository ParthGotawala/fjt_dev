(function () {
  'use strict';

  angular
    .module('app.operation.operations', ['flow'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, OPERATION, CORE) {
    // State        
    $stateProvider.state(OPERATION.OPERATION_OPERATIONS_STATE, {
      url: OPERATION.OPERATION_OPERATIONS_ROUTE,
      views: {
        'content@app': {
          templateUrl: OPERATION.OPERATION_OPERATIONS_VIEW,
          controller: OPERATION.OPERATION_OPERATIONS_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    })
      .state(OPERATION.OPERATION_MANAGE_STATE, {
        url: OPERATION.OPERATION_MANAGE_ROUTE,
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        },
        parentState: OPERATION.OPERATION_OPERATIONS_STATE
      })
      .state(OPERATION.OPERATION_MANAGE_DETAILS_STATE, {
        url: OPERATION.OPERATION_MANAGE_DETAILS_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.Details.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_MANAGE_DODONT_STATE, {
        url: OPERATION.OPERATION_MANAGE_DODONT_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.DoDont.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_MANAGE_DOCUMENTS_STATE, {
        url: OPERATION.OPERATION_MANAGE_DOCUMENTS_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.Documents.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_MANAGE_DATAFIELDS_STATE, {
        url: OPERATION.OPERATION_MANAGE_DATAFIELDS_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.DataFields.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_MANAGE_PARTS_STATE, {
        url: OPERATION.OPERATION_MANAGE_PARTS_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.Parts.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_MANAGE_EQUIPMENTS_STATE, {
        url: OPERATION.OPERATION_MANAGE_EQUIPMENTS_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.Equipments.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_MANAGE_EMPLOYEES_STATE, {
        url: OPERATION.OPERATION_MANAGE_EMPLOYEES_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.Employees.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_MANAGE_TEMPLATES_STATE, {
        url: OPERATION.OPERATION_MANAGE_TEMPLATES_ROUTE,
        params: {
          selectedTab: OPERATION.OperationMasterTabs.Templates.Name
        },
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_MANAGE_VIEW,
            controller: OPERATION.OPERATION_MANAGE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(OPERATION.OPERATION_PROFILE_STATE, {
        url: OPERATION.OPERATION_PROFILE_ROUTE,
        views: {
          'content@app': {
            templateUrl: OPERATION.OPERATION_PROFILE_VIEW,
            controller: OPERATION.OPERATION_PROFILE_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });
  }

})();
