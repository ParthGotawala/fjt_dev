(function () {
  'use strict';

  angular
    .module('app.admin.calibrationdetails')
    .factory('CalibrationDetailsFactory', CalibrationDetailsFactory);

  /** @ngInject */
  function CalibrationDetailsFactory($resource, $http, CORE) {
    return {
      retrieveCalibrationDetailsById: () => $resource(CORE.API_URL + 'calibrationdetails/retrieveCalibrationDetailsById/:id', { id: '@_id' }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      calibrationdetails: () => $resource(CORE.API_URL + 'calibrationdetails/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        },
        update: {
          method: 'PUT'
        }
      }),

      retrieveCalibrationDetailsList: () => $resource(CORE.API_URL + 'calibrationdetails/retrieveCalibrationDetailsList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteCalibrationDetails: () => $resource(CORE.API_URL + 'calibrationdetails/deleteCalibrationDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
