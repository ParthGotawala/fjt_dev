(function () {
  'use strict';

  angular
    .module('app.admin.datecodeformat')
    .factory('DCFormatFactory', DCFormatFactory);
  /** @ngInject */
  function DCFormatFactory($resource, CORE) {
    return {
      retrieveDCFormatList: () => $resource(CORE.API_URL + 'datecodeformat/retrieveDCFormatList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveDCFormatById: () => $resource(CORE.API_URL + 'datecodeformat/retriveDCFormatById/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      saveDCFormatDetails: () => $resource(CORE.API_URL + 'datecodeformat/saveDCFormatDetails/', {
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      checkDuplicateDCFormat: () => $resource(CORE.API_URL + 'datecodeformat/checkDuplicateDCFormat', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteDCFormat: () => $resource(CORE.API_URL + 'datecodeformat/deleteDCFormat', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveDateCodeFormatList: () => $resource(CORE.API_URL + 'datecodeformat/retriveDateCodeFormatList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      setDateCodeFormatData: () => $resource(CORE.API_URL + 'datecodeformat/setDateCodeFormatData', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDateCodeFormatData: () => $resource(CORE.API_URL + 'datecodeformat/getDateCodeFormatData', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
