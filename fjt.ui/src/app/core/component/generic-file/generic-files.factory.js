(function () {
  'use strict';

  angular.module('app.core').factory('GenericFileFactory', ['$resource', '$http', 'CORE', GenericFileFactory]);

  /** @ngInject */
  function GenericFileFactory($resource, $http, CORE) {
    return {
      genericFileList: () => $resource(CORE.API_URL + 'genericFileList/:refTransID/:gencFileOwnerType', {
        refTransID: '@_refTransID',
        gencFileOwnerType: '@_gencFileOwnerType',
      }, {
        query: {
          isArray: false
        }
      }),
      uploadGenericFiles: (documentDetail, fileDet) => {
        return $http({
          method: 'POST',
          url: CORE.API_URL + 'genericFileList/uploadGenericFiles',
          headers: { 'Content-Type': undefined },
          transformRequest: function (data) {
            var formData = new FormData();
            formData.append('documentDetail', angular.toJson(data.documentDetail));
            formData.append('file', fileDet, fileDet.name);
            return formData;
          },
          data: {
            documentDetail: documentDetail,
            files: FileList
          }
        }, (data) => {
          return data.Data;
        }, (e) => {
          return e;
        });
      },

      updateGenericFiles: (documentDetail, fileDet) => {
        return $http({
          method: 'POST',
          url: CORE.API_URL + 'genericFileList/updateGenericFiles',
          headers: { 'Content-Type': undefined },
          transformRequest: function (data) {
            var formData = new FormData();
            formData.append('documentDetail', angular.toJson(data.documentDetail));
            formData.append('file', fileDet, fileDet.name);
            return formData;
          },
          data: {
            documentDetail: documentDetail,
            files: FileList
          }
        }, (data) => {
          return data.Data;
        }, (e) => {
          return e;
        });
      },
      //downloadDocument: (gencFileID, eventAction) => $http.get(CORE.API_URL + "genericFileList/downloadGenericFile/" + gencFileID + "/" + eventAction, { responseType: 'arraybuffer' }).then(function (response) {
      //    return response;
      //}, function (error) {
      //    return error;
      //}),
      downloadDocument: (downloadDocObj) => $http.post(
        CORE.API_URL + "genericFileList/downloadGenericFile", downloadDocObj,
        { responseType: 'arraybuffer' }).then(function (response) {
          return response;
        }, function (error) {
          return error;
        }),

      downloadDocumentsAsZip: (downloadDocObj) => $http.post(
        CORE.API_URL + "genericFileList/downloadGenericFileAsZip", downloadDocObj,
        { responseType: 'arraybuffer' }).then(function (response) {
          return response;
        }, function (error) {
          return error;
        }),

      setAsDefaultImage: () => $resource(CORE.API_URL + 'genericFileList/setAsDefaultImage', {
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT',
        },
      }),

      setAsShared: () => $resource(CORE.API_URL + 'genericFileList/setAsShared/:gencFileID', {
        gencFileID: '@_gencFileID',
      }, {
        query: {
          isArray: false,
          method: 'GET'

        },
      }),

      addTimelineLogForViewGenericFileOtherThanImage: (gencFileID, eventAction) => $http.get(CORE.API_URL + "genericFileList/addTimelineLogForViewGenericFileOtherThanImage/" + gencFileID + "/" + eventAction, {}).then(function (response) {
        return response;
      }, function (error) {
        return error;
      }),

      enableDisableGenericFile: () => $resource(CORE.API_URL + 'genericFileList/enableDisableGenericFile', {
        enableDisableDocDet: '@_enableDisableDocDet',
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      updateGenericFileDetails: () => $resource(CORE.API_URL + 'genericFileList/updateGenericFileDetails', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDuplicateGenericFiles: () => $resource(CORE.API_URL + 'genericFileList/checkDuplicateGenericFiles', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      //getSamplePictureList: () => $resource(CORE.API_URL + 'genericFileList/getSamplePictureList/:refTransID/:gencFileOwnerType/:entityId', {
      //  refTransID: '@_refTransID',
      //  gencFileOwnerType: '@_gencFileOwnerType',
      //  entityId: '@_entityId'
      //}, {
      //  query: {
      //    isArray: false
      //  }
      //}),

      getSamplePictureCount: () => $resource(CORE.API_URL + 'genericFileList/getSamplePictureCount/:partId', {
        partId: '@_partId'
      }, {
        query: {
          isArray: false
        }
      }),
    };

  }
})();
