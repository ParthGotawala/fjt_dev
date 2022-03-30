(function () {
  'use strict';

  angular
    .module('app.admin.equipment', ['nsPopover'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msApiProvider, USER, CORE) {
    // State
    $stateProvider.state(USER.ADMIN_EQUIPMENT_STATE, {
      url: USER.ADMIN_EQUIPMENT_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_EQUIPMENT_VIEW,
          controller: USER.ADMIN_EQUIPMENT_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    })
      .state(USER.ADMIN_MANAGEEQUIPMENT_STATE, {
        url: USER.ADMIN_MANAGEEQUIPMENT_ROUTE,
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEEQUIPMENT_VIEW,
            controller: USER.ADMIN_MANAGEEQUIPMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEEQUIPMENT_DETAIL_STATE, {
        url: USER.ADMIN_MANAGEEQUIPMENT_DETAIL_ROUTE,
        params: {
          selectedTab: USER.EquipmentAndWorkstationTabs.Detail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEEQUIPMENT_VIEW,
            controller: USER.ADMIN_MANAGEEQUIPMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEEQUIPMENT_MAINTENANCE_SCHEDULE_STATE, {
        url: USER.ADMIN_MANAGEEQUIPMENT_MAINTENANCE_SCHEDULE_ROUTE,
        params: {
          selectedTab: USER.EquipmentAndWorkstationTabs.MaintenanceSchedule.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEEQUIPMENT_VIEW,
            controller: USER.ADMIN_MANAGEEQUIPMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEEQUIPMENT_CALIBRATION_DETAIL_STATE, {
        url: USER.ADMIN_MANAGEEQUIPMENT_CALIBRATION_DETAIL_ROUTE,
        params: {
          selectedTab: USER.EquipmentAndWorkstationTabs.CalibrationDetails.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEEQUIPMENT_VIEW,
            controller: USER.ADMIN_MANAGEEQUIPMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEEQUIPMENT_DOCUMENTS_STATE, {
        url: USER.ADMIN_MANAGEEQUIPMENT_DOCUMENTS_ROUTE,
        params: {
          selectedTab: USER.EquipmentAndWorkstationTabs.Document.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEEQUIPMENT_VIEW,
            controller: USER.ADMIN_MANAGEEQUIPMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEEQUIPMENT_DATA_FIELDS_STATE, {
        url: USER.ADMIN_MANAGEEQUIPMENT_DATA_FIELDS_ROUTE,
        params: {
          selectedTab: USER.EquipmentAndWorkstationTabs.DataFields.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEEQUIPMENT_VIEW,
            controller: USER.ADMIN_MANAGEEQUIPMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      })
      .state(USER.ADMIN_MANAGEEQUIPMENT_OTHER_STATE, {
        url: USER.ADMIN_MANAGEEQUIPMENT_OTHER_ROUTE,
        params: {
          selectedTab: USER.EquipmentAndWorkstationTabs.OtherDetail.Name
        },
        views: {
          'content@app': {
            templateUrl: USER.ADMIN_MANAGEEQUIPMENT_VIEW,
            controller: USER.ADMIN_MANAGEEQUIPMENT_CONTROLLER,
            controllerAs: CORE.CONTROLLER_AS
          }
        }
      });

    $stateProvider.state(USER.ADMIN_EQUIPMENT_PROFILE_STATE, {
      url: USER.ADMIN_EQUIPMENT_PROFILE_ROUTE,
      views: {
        'content@app': {
          templateUrl: USER.ADMIN_EQUIPMENT_PROFILE_VIEW,
          controller: USER.ADMIN_EQUIPMENT_PROFILE_CONTROLLER,
          controllerAs: CORE.CONTROLLER_AS
        }
      }
    });
  }

})();
