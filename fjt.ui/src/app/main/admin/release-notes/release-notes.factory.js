(function () {
  'use strict';

  angular
    .module('app.admin.releasenotes')
    .factory('ReleaseNoteFactory', ReleaseNoteFactory);

  function ReleaseNoteFactory($resource, CORE) {
    return {
      releaseNotesDetail: () => $resource(CORE.API_URL + 'release_notes/getReleaseNotes/:Id', {
        Id: '@_Id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      releaseNote: () => $resource(CORE.API_URL + 'release_notes/getReleaseVersion', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      releaseNotesValidation: () => $resource(CORE.API_URL + 'release_notes/releaseNotesValidation',{}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      saveReleaseDetails: () => $resource(CORE.API_URL + 'release_notes/saveReleaseDetails', {}, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      saveReleaseNotesDetails: () => $resource(CORE.API_URL + 'release_notes/saveReleaseNotesDetails', {}, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      deleteReleaseNotesDetails: () => $resource(CORE.API_URL + 'release_notes/deleteReleaseNotesDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteReleaseDetails: () => $resource(CORE.API_URL + 'release_notes/deleteReleaseDetails', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getLatestReleaseVersion: () => $resource(CORE.API_URL + 'release_notes/getLatestReleaseVersion', {}, {
        query: {
          isArray: false,
          method: 'GET'
        }
      })
    };
  }
})();
