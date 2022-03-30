(function () {
  'use strict';

  angular
    .module('app.admin.camera')
    .factory('CameraFactory', CameraFactory);
  /** @ngInject */
  function CameraFactory($resource, CORE) {
    return {
      retrieveCameraList: () => $resource(CORE.API_URL + 'camera/retrieveCameraList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCameraDetailsById: () => $resource(CORE.API_URL + 'camera/getCameraDetailsById/:id', {
        id: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveCameraDetails: () => $resource(CORE.API_URL + 'camera/saveCameraDetails/', {
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      checkDuplicateCameraDetails: () => $resource(CORE.API_URL + 'camera/checkDuplicateCameraDetails', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteCameraDetails: () => $resource(CORE.API_URL + 'camera/deleteCameraDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveCameraById: () => $resource(CORE.API_URL + 'camera/retriveCameraById/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      })
    };
  }
})();
