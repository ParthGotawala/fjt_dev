(function () {
  "use strict";

  angular
    .module("app.admin.picturestation")
    .factory("PictureStationFactory", PictureStationFactory);

  /** @ngInject */
  function PictureStationFactory($resource, CORE) {
    return {
      getAllCameraList: () =>
        $resource(
          CORE.API_URL + "camera/retriveCameraGroup",
          {},
          {
            query: {
              isArray: false,
              method: "GET",
            },
          }
        ),
      getGroupCameraList: () =>
        $resource(
          CORE.API_URL + "camera/retriveCameraByGroup",
          {},
          {
            query: {
              isArray: false,
              method: "GET",
            },
          }
        ),

      getPicturesInQueue: () =>
        $resource(
          CORE.API_URL + "camera/getPicturesInQueue",
          {},
          {
            query: {
              isArray: false,
              method: "GET",
            },
          }
        ),
    };
  }
})();
